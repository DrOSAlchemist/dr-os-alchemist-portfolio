import Head from "next/head";
import { ArrowUpRight, CodeXml, GitFork, Star } from "lucide-react";

function formatDate(value) {
  if (!value) return "Recently updated";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short" }).format(new Date(value));
}

export async function getServerSideProps({ res }) {
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
      return { props: { repos: [], username, unavailable: response.status === 403 ? "rate-limit" : "api" } };
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

    return { props: { repos, username, unavailable: null } };
  } catch {
    return { props: { repos: [], username, unavailable: "network" } };
  }
}

export default function Projects({ repos, username, unavailable }) {
  return (
    <>
      <Head>
        <title>Projects | DrOSAlchemist</title>
        <meta name="description" content="A live index of public DrOSAlchemist GitHub repositories and systems projects." />
        <meta property="og:title" content="Projects | DrOSAlchemist" key="og-title" />
        <meta property="og:description" content="A live index of public DrOSAlchemist GitHub repositories and systems projects." key="og-description" />
      </Head>
      <div className="site-shell page-main">
        <div className="page-kicker"><CodeXml aria-hidden="true" size={14} /> Project index / public repositories</div>
        <div className="projects-heading">
          <div>
            <h1 className="page-title">Built in the<br /><span>open.</span></h1>
            <p className="page-lede">
              Public repositories from <strong>{username}</strong>, loaded directly
              from GitHub and sorted by most recently pushed.
            </p>
          </div>
          <a className="button button-dark" href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noreferrer">
            View GitHub profile <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>

        <div className="page-divider" />
        <div className="section-heading-row">
          <h2>Repository stream <span className="repo-count">{repos.length.toString().padStart(2, "0")}</span></h2>
          <p>Live public data · refreshed at request</p>
        </div>

        {unavailable && (
          <p className="notice-line" role="status">
            {unavailable === "rate-limit"
              ? "GitHub has temporarily limited this request. The repository list will return when its public API window resets."
              : "GitHub is not responding right now. Please try again shortly."}
          </p>
        )}

        {!unavailable && repos.length === 0 && (
          <p className="notice-line" role="status">No public repositories are available yet. Visit the profile to see the latest activity.</p>
        )}

        {repos.length > 0 && (
          <div className="repo-grid">
            {repos.map((repo) => (
              <article className="repo-card" key={repo.name}>
                <div className="repo-card-head">
                  <h3>{repo.name}</h3>
                  <a href={repo.url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`}>
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </a>
                </div>
                <p>{repo.description}</p>
                {repo.topics.length > 0 && (
                  <div className="repo-topics">
                    {repo.topics.map((topic) => <span key={topic}>{topic}</span>)}
                  </div>
                )}
                <div className="repo-meta">
                  {repo.language && <span className="repo-language" data-language={repo.language}><i className="language-dot" />{repo.language}</span>}
                  <span><Star aria-hidden="true" size={12} /> {repo.stars}</span>
                  <span><GitFork aria-hidden="true" size={12} /> {repo.forks}</span>
                  <span>pushed {formatDate(repo.pushedAt)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}