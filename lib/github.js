export async function getPublicRepositories(res) {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  const username = process.env.GITHUB_USERNAME || "DrOSAlchemist";

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "DrOSAlchemist-Portfolio",
        },
        signal: AbortSignal.timeout(6000),
      },
    );

    if (!response.ok) {
      return { repos: [], username, unavailable: response.status === 403 ? "rate-limit" : "api" };
    }

    const repositories = await response.json();
    const repos = repositories
      .filter((repo) => !repo.private && !repo.fork && !repo.archived)
      .sort((first, second) => new Date(second.pushed_at) - new Date(first.pushed_at))
      .map((repo) => ({
        name: repo.name,
        description: repo.description || "A public project from the DrOSAlchemist workspace.",
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: (repo.topics || []).slice(0, 4),
        pushedAt: repo.pushed_at,
      }));

    return { repos, username, unavailable: null };
  } catch {
    return { repos: [], username, unavailable: "network" };
  }
}