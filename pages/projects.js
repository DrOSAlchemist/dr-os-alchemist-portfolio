import Head from "next/head";
import { ArrowUpRight, CodeXml, GitFork, Star } from "lucide-react";
import { getPublicRepositories } from "@/lib/github";
import FeaturedProjects from "@/components/FeaturedProjects";

function formatDate(value) {
  if (!value) return "Recently updated";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short" }).format(new Date(value));
}

export async function getServerSideProps({ res }) {
  return { props: await getPublicRepositories(res) };
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
              Curated engineering evidence plus public repositories from <strong>{username}</strong>.
              The live stream below is loaded from GitHub and sorted by most recently pushed.
            </p>
          </div>
          <a className="button button-dark" href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noreferrer">
            View GitHub profile <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>

        <div className="page-divider" />
        <div className="section-heading-row">
          <h2>Selected engineering evidence</h2>
          <p>Code, verification and explicit boundaries</p>
        </div>
        <FeaturedProjects />
        <div className="page-divider" />
        <div className="section-heading-row">
          <h2>Repository stream <span className="repo-count">{unavailable ? "Unavailable" : repos.length.toString().padStart(2, "0")}</span></h2>
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