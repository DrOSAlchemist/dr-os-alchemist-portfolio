const maxPages = 5;
const pageSize = 100;
const usernamePattern = /^(?!-)[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;

class RepositoryError extends Error {
  constructor(reason, status) {
    super(`GitHub repository lookup failed: ${reason}`);
    this.reason = reason;
    this.status = status;
  }
}

function normalizeRepository(repo, username) {
  if (!repo || typeof repo !== "object" ||
      !["private", "fork", "archived"].every((key) => typeof repo[key] === "boolean")) {
    throw new RepositoryError("data");
  }
  if (repo.private || repo.fork || repo.archived) return null;
  const count = (value) => Number.isSafeInteger(value) && value >= 0;
  const optionalString = (value) => value === null || typeof value === "string";
  if (typeof repo.name !== "string" || !/^[a-z\d._-]+$/i.test(repo.name) ||
      !optionalString(repo.description) || !optionalString(repo.language) ||
      !count(repo.stargazers_count) || !count(repo.forks_count) ||
      !Array.isArray(repo.topics) || !repo.topics.every((topic) => typeof topic === "string") ||
      !(repo.pushed_at === null || (typeof repo.pushed_at === "string" && Number.isFinite(Date.parse(repo.pushed_at))))) {
    throw new RepositoryError("data");
  }
  // Construct links from the requested owner rather than trusting an API-supplied URL.
  return {
    name: repo.name,
    description: repo.description?.trim() || `A public project from ${username}.`,
    url: `https://github.com/${username}/${repo.name}`,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics.slice(0, 4),
    pushedAt: repo.pushed_at,
  };
}

export function selectRepositories(repos, { query = "", language = "", sort = "recent" } = {}) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return repos.filter((repo) => {
    const text = `${repo.name} ${repo.description} ${repo.topics.join(" ")}`.toLowerCase();
    return (!language || repo.language === language) && terms.every((term) => text.includes(term));
  }).sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "stars") return b.stars - a.stars || a.name.localeCompare(b.name);
    return (Date.parse(b.pushedAt) || 0) - (Date.parse(a.pushedAt) || 0) || a.name.localeCompare(b.name);
  });
}

export async function getPublicRepositories(res, {
  username = process.env.GITHUB_USERNAME || "DrOSAlchemist",
  fetchImpl = fetch,
  logger = console,
  timeoutMs = 6000,
} = {}) {
  let status;
  try {
    if (!usernamePattern.test(username)) throw new RepositoryError("configuration");
    const signal = AbortSignal.timeout(timeoutMs);
    const repos = [];
    const seen = new Set();
    for (let page = 1; page <= maxPages; page++) {
      const response = await fetchImpl(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&direction=desc&per_page=${pageSize}&page=${page}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "DrOSAlchemist-Portfolio",
          },
          signal,
        },
      );
      status = response.status;
      if (!response.ok) {
        const limited = response.status === 429 ||
          (response.status === 403 && (response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after")));
        throw new RepositoryError(limited ? "rate-limit" : "api", status);
      }
      let repositories;
      try {
        repositories = await response.json();
      } catch (error) {
        if (signal.aborted) throw error;
        throw new RepositoryError("data", status);
      }
      if (!Array.isArray(repositories) || repositories.length > pageSize) throw new RepositoryError("data", status);
      for (const item of repositories) {
        const repo = normalizeRepository(item, username);
        if (repo && !seen.has(repo.name.toLowerCase())) {
          seen.add(repo.name.toLowerCase());
          repos.push(repo);
        }
      }
      if (repositories.length < pageSize) {
        res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
        return { repos: selectRepositories(repos), username, unavailable: null };
      }
    }
    // Do not present a bounded partial result as the complete account count.
    throw new RepositoryError("pagination");
  } catch (error) {
    const reason = error instanceof RepositoryError ? error.reason
      : ["TimeoutError", "AbortError"].includes(error.name) ? "timeout" : "network";
    logger.error("Public repository feed unavailable", { reason, status: error.status ?? status });
    res.setHeader("Cache-Control", "no-store");
    return { repos: [], username, unavailable: reason };
  }
}
