import Head from "next/head";
import { useState } from "react";
import { ArrowUpRight, CodeXml, GitFork, Star } from "lucide-react";
import { getPublicRepositories, selectRepositories } from "@/lib/github";
import FeaturedProjects from "@/components/FeaturedProjects";

function formatDate(value) {
  if (!value) return "No push recorded";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", timeZone: "UTC" }).format(new Date(value));
}

export async function getServerSideProps({ res }) {
  return { props: await getPublicRepositories(res) };
}

export default function Projects({ repos, username, unavailable }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("recent");
  const languages = [...new Set(repos.map((repo) => repo.language).filter(Boolean))].sort();
  const visibleRepos = selectRepositories(repos, { query, language, sort });
  const clearFilters = () => { setQuery(""); setLanguage(""); setSort("recent"); };

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
              The repository stream is loaded from GitHub, sorted by most recently pushed and searchable by name, description or topic.
            </p>
          </div>
          <a className="button button-dark" href={`https://github.com/${encodeURIComponent(username)}?tab=repositories`} target="_blank" rel="noreferrer">
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
        <section id="repository-stream" aria-labelledby="repository-heading">
        <div className="section-heading-row">
          <h2 id="repository-heading">Repository stream <span className="repo-count">{unavailable ? "Unavailable" : repos.length.toString().padStart(2, "0")}</span></h2>
          <p>Public originals · GitHub data · hourly cache + stale refresh</p>
        </div>

        {unavailable && (
          <p className="notice-line" role="status">
            {unavailable === "rate-limit"
              ? "GitHub has temporarily limited this request. The repository list will return when its public API window resets."
              : "The complete GitHub repository list could not be loaded. Curated evidence remains available above; use the GitHub profile for the current account listing."}
          </p>
        )}

        {!unavailable && repos.length === 0 && (
          <p className="notice-line" role="status">No public repositories are available yet. Visit the profile to see the latest activity.</p>
        )}

        {repos.length > 0 && (
          <>
          <div className="repo-filters" role="search" aria-label="Filter public repositories">
            <label htmlFor="repo-query">Search repositories
              <input id="repo-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, description or topic" />
            </label>
            <label htmlFor="repo-language">Language
              <select id="repo-language" value={language} onChange={(event) => setLanguage(event.target.value)}>
                <option value="">All languages</option>
                {languages.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label htmlFor="repo-sort">Sort by
              <select id="repo-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="recent">Recently pushed</option>
                <option value="name">Name</option>
                <option value="stars">Stars</option>
              </select>
            </label>
            <button className="button button-light" type="button" onClick={clearFilters}>Reset filters</button>
          </div>
          <p className="repo-results" role="status" aria-live="polite" aria-atomic="true">
            Showing {visibleRepos.length} of {repos.length} public repositories. Forks and archived repositories are excluded.
          </p>
          {visibleRepos.length === 0 && <p className="notice-line">No repositories match these filters. Reset the filters or try a broader search.</p>}
          <div className="repo-grid">
            {visibleRepos.map((repo) => (
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
                  <span><Star aria-hidden="true" size={12} /> {`${repo.stars} ${repo.stars === 1 ? "star" : "stars"}`}</span>
                  <span><GitFork aria-hidden="true" size={12} /> {`${repo.forks} ${repo.forks === 1 ? "fork" : "forks"}`}</span>
                  <span>{repo.pushedAt ? <>Pushed <time dateTime={repo.pushedAt}>{formatDate(repo.pushedAt)}</time></> : formatDate(null)}</span>
                </div>
              </article>
            ))}
          </div>
          </>
        )}
        </section>
      </div>
    </>
  );
}