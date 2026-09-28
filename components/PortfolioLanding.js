import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Boxes, CodeXml, Network, ShieldCheck } from "lucide-react";
import { articles } from "@/lib/articles";

const expertise = [
  {
    title: "AI workflows & model ops",
    items: ["Model infrastructure", "GPU scheduling", "Workflow verification"],
    icon: Boxes,
    color: "mint",
  },
  {
    title: "Cloud platforms & SRE",
    items: ["AWS", "Azure", "Google Cloud", "Kubernetes", "Helm"],
    icon: Network,
    color: "blue",
  },
  {
    title: "Data, network & security",
    items: ["DNS / IPAM", "Log validation", "Container hygiene", "GitOps"],
    icon: ShieldCheck,
    color: "coral",
  },
];

const featuredProjects = [
  {
    name: "dns-migration-automation",
    title: "Multi-cloud DNS migration automation",
    category: "CLOUD / NETWORK / AUTOMATION",
    description: "Provider-neutral zone validation, record diffs, snapshots, recovery attempts, propagation checks and read-only IPAM lookup across Cloudflare, AWS Route 53, Google Cloud DNS, Azure DNS and TCPWave.",
    tags: ["Python", "AWS", "Azure", "Google Cloud", "Cloudflare", "IPAM"],
  },
  {
    name: "dynamo-log-report-fix",
    title: "Agent-task integrity & log validation",
    category: "AI WORKFLOWS / DATA / SECURITY",
    description: "A Terminal-Bench log-report task hardened with a digest-pinned container, removal of a leaked reference solution, and an independent verifier that recomputes report metrics from the source log.",
    tags: ["Python", "Agent evaluation", "Data validation", "Supply-chain hygiene"],
  },
  {
    name: "sre-helm-chart",
    title: "SRE deployment with Kubernetes & Helm",
    category: "SRE / CONTAINERS / DATA",
    description: "A Helm-based deployment of an Elixir Phoenix application with PostgreSQL, environment configuration, database migrations, health probes and public ingress.",
    tags: ["Kubernetes", "Helm", "Docker", "PostgreSQL", "SRE"],
  },
];

const experienceAreas = [
  {
    number: "01",
    title: "AI/ML infrastructure",
    text: "Capacity, scheduling and rollout practices for systems that move models from experiment to production.",
    href: "/writing/gpu-aware-kubernetes-scheduling",
    label: "Field note",
  },
  {
    number: "02",
    title: "Network systems",
    text: "DNS and IPAM workflows that make changes reviewable, validated and recoverable.",
    href: "https://github.com/DrOSAlchemist/dns-migration-automation",
    label: "Open source",
  },
  {
    number: "03",
    title: "Safe operations",
    text: "Observable deployment paths with a clear control, a decision rule and a rollback plan.",
    href: "/writing/safe-model-rollouts",
    label: "Field note",
  },
];

const toolGroups = [
  { title: "Cloud & infrastructure", items: ["AWS Route 53", "Azure DNS", "Google Cloud DNS", "Cloudflare", "TCPWave"] },
  { title: "SRE & delivery", items: ["Kubernetes", "Helm", "Docker", "GitHub Actions", "GitOps"] },
  { title: "Data & workflow integrity", items: ["Python", "HCL / Terraform", "Log validation", "Independent verification"] },
];

function formatDate(value) {
  if (!value) return "Recently updated";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short" }).format(new Date(value));
}

export default function PortfolioLanding({ repos, username, unavailable }) {
  const repoByName = new Map(repos.map((repo) => [repo.name, repo]));

  return (
    <>
      <Head>
        <title>DrOSAlchemist | AI infrastructure, networks &amp; systems</title>
        <meta
          name="description"
          content="AI/ML infrastructure, Kubernetes, network systems and automation built to stay understandable and operable in production."
        />
        <meta property="og:title" content="DrOSAlchemist | Systems, made useful" key="og-title" />
        <meta
          property="og:description"
          content="AI infrastructure, Kubernetes, networking and security, brought together."
          key="og-description"
        />
      </Head>

      <div className="resume-page">
        <section className="resume-hero site-shell" id="top">
          <div className="resume-hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Independent systems engineer</p>
            <h1>DrOSAlchemist</h1>
            <p className="resume-role">AI/ML workflows <span>·</span> DevOps / SRE <span>·</span> Multi-cloud</p>
            <p className="resume-lede">
              I connect AI/ML, Kubernetes, networking and security into systems people can
              actually operate. The work focuses on the details that make platforms visible,
              safe to change and useful after launch.
            </p>
            <div className="resume-actions">
              <a className="button button-dark" href="#github">
                View GitHub projects <ArrowDownRight aria-hidden="true" size={16} />
              </a>
              <a className="button button-light" href="https://www.linkedin.com/in/jsanni/" target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </div>
            <div className="resume-stats" aria-label="Portfolio at a glance">
              <div><strong>{repos.length}</strong><span>Public repositories</span></div>
              <div><strong>{articles.length}</strong><span>Field notes</span></div>
              <div><strong>AI · SRE · CLOUD</strong><span>Areas of focus</span></div>
            </div>
          </div>
          <figure className="resume-portrait">
            <Image
              src="/dr-osalchemist-avatar.jpg"
              alt="DrOSAlchemist profile image"
              width={331}
              height={331}
              priority
            />
            <figcaption><span className="mono-label">SYSTEMS PRACTICE / 001</span><span>Independent · Open source</span></figcaption>
          </figure>
        </section>

        <section className="resume-section resume-projects" id="github">
          <div className="site-shell">
            <div className="resume-section-heading">
              <div>
                <p className="eyebrow">Open source / live from GitHub</p>
                <h2>Projects built in the open.</h2>
                <p className="section-copy">Selected work in AI workflow integrity, SRE, data validation, security hygiene and multi-cloud infrastructure.</p>
              </div>
              <a className="text-link" href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noreferrer">
                All repositories <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </div>
            {unavailable && (
              <p className="notice-line" role="status">
                {unavailable === "rate-limit"
                  ? "GitHub has temporarily limited this request. Visit the profile for the latest public work."
                  : "GitHub is not responding right now. Please try again shortly."}
              </p>
            )}
            {!unavailable && featuredProjects.every((project) => !repoByName.has(project.name)) && (
              <p className="notice-line" role="status">The featured repositories could not be loaded. Visit the GitHub profile for the project list.</p>
            )}
            {!unavailable && (
              <div className="featured-project-grid">
                {featuredProjects.map((project) => {
                  const repo = repoByName.get(project.name);
                  if (!repo) return null;
                  return (
                    <article className="featured-project" key={project.name}>
                      <div className="featured-project-topline">
                        <span className="mono-label">{project.category}</span>
                        <a href={repo.url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.name} on GitHub`}>
                          <ArrowUpRight aria-hidden="true" size={18} />
                        </a>
                      </div>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="resume-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <a className="text-link" href={repo.url} target="_blank" rel="noreferrer">
                        {repo.name} <ArrowUpRight aria-hidden="true" size={14} />
                      </a>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="resume-section" id="skills">
          <div className="site-shell">
            <div className="resume-section-heading">
              <div>
                <p className="eyebrow">Technical expertise</p>
                <h2>Different layers. One system.</h2>
              </div>
            </div>
            <div className="resume-expertise-grid">
              {expertise.map(({ title, items, icon: Icon, color }) => (
                <article className="resume-expertise" key={title}>
                  <span className={`discipline-icon ${color}`}><Icon aria-hidden="true" size={20} /></span>
                  <h3>{title}</h3>
                  <div className="resume-tags">{items.map((item) => <span key={item}>{item}</span>)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="resume-section resume-automation" id="automations">
          <div className="site-shell">
            <div className="resume-section-heading">
              <div>
                <p className="eyebrow">Automation / systems in practice</p>
                <h2>Make change safer to operate.</h2>
                <p className="section-copy">Real examples from the repositories and field notes, described without invented hours-saved or performance claims.</p>
              </div>
            </div>
            <div className="automation-grid">
              <article className="automation-feature">
                <span className="mono-label">DNS / IPAM</span>
                <h3>DNS changes with a recovery path.</h3>
                <p>Validate records, compare desired and live state, snapshot before writes, and check propagation after the change.</p>
                <a className="text-link" href={repoByName.get("dns-migration-automation")?.url || `https://github.com/${username}/dns-migration-automation`} target="_blank" rel="noreferrer">
                  DNS migration automation <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              </article>
              {articles.slice(0, 2).map((article, index) => (
                <article className="automation-note" key={article.slug}>
                  <span className="mono-label">FIELD NOTE / 0{index + 1}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link className="text-link" href={`/writing/${article.slug}`}>
                    Read the note <ArrowUpRight aria-hidden="true" size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="resume-section" id="experience">
          <div className="site-shell">
            <div className="resume-section-heading">
              <div>
                <p className="eyebrow">Experience / systems in practice</p>
                <h2>Work at the boundaries.</h2>
                <p className="section-copy">The through-line is making complex infrastructure visible, reviewable and reversible.</p>
              </div>
            </div>
            <div className="experience-list">
              {experienceAreas.map((item) => {
                const content = (
                  <>
                    <span className="experience-number">{item.number}</span>
                    <div>
                      <span className="experience-label">{item.label}</span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </>
                );
                return item.href.startsWith("http") ? (
                  <a className="experience-row" href={item.href} key={item.number} target="_blank" rel="noreferrer">{content}</a>
                ) : (
                  <Link className="experience-row" href={item.href} key={item.number}>{content}</Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="resume-section resume-tools" id="tools">
          <div className="site-shell">
            <div className="resume-section-heading">
              <div>
                <p className="eyebrow">Complete tool stack</p>
                <h2>Tools serve the system.</h2>
              </div>
            </div>
            <div className="tool-groups">
              {toolGroups.map((group) => (
                <div className="tool-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <div className="resume-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
                </div>
              ))}
            </div>
            <div className="resume-writing-link">
              <CodeXml aria-hidden="true" size={18} />
              <p>
                Field notes: {articles.map((article, index) => (
                  <span key={article.slug}>{index > 0 ? " · " : ""}<Link href={`/writing/${article.slug}`}>{article.title}</Link></span>
                ))}
              </p>
            </div>
          </div>
        </section>

        <section className="resume-contact" id="contact">
          <div className="site-shell resume-contact-inner">
            <div>
              <p className="eyebrow">Contact / let&apos;s collaborate</p>
              <h2>Build systems<br /><span>with intent.</span></h2>
              <p>Open to conversations about AI infrastructure, platform engineering, networking and safer operations.</p>
            </div>
            <div className="resume-contact-links">
              <a className="button button-light" href="https://github.com/DrOSAlchemist" target="_blank" rel="noreferrer">
                GitHub <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <a className="button button-light" href="https://www.linkedin.com/in/jsanni/" target="_blank" rel="noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <Link className="button button-light" href="/contact">
                Contact page <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}