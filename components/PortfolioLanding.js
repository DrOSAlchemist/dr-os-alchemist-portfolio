import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Boxes, CodeXml, Network, ShieldCheck } from "lucide-react";
import { articles } from "@/lib/articles";
import FeaturedProjects from "@/components/FeaturedProjects";

const expertise = [
  {
    title: "AI infrastructure & Kubernetes",
    items: ["KEDA / vLLM", "GPU scheduling", "Queue recovery", "Model rollout design"],
    icon: Boxes,
    color: "mint",
  },
  {
    title: "Software & operations automation",
    items: ["Python / APIs", "Validation contracts", "Terraform / Helm", "CI verification"],
    icon: Network,
    color: "blue",
  },
  {
    title: "Security & system boundaries",
    items: ["AI policy checks", "Independent verification", "DNS / IPAM", "Supply-chain hygiene"],
    icon: ShieldCheck,
    color: "coral",
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
  {
    number: "04",
    title: "Evidence-backed SRE & AI boundaries",
    text: "Typed inputs, refusal paths, bounded proposals and recovery checks—with source code and explicit limitations.",
    href: "/writing/evidence-backed-agentic-sre",
    label: "Implementation / design note",
  },
];

const toolGroups = [
  { title: "Cloud & infrastructure", items: ["AWS Route 53", "Azure DNS", "Google Cloud DNS", "Cloudflare", "TCPWave"] },
  { title: "AI & Kubernetes", items: ["Kubernetes", "KEDA", "vLLM", "FastAPI", "Redis", "Helm"] },
  { title: "Code & verification", items: ["Python", "JavaScript", "SQLite", "GitHub Actions", "Ruff", "Bandit", "Independent verification"] },
  { title: "Delivery & security design", items: ["Docker", "HCL / Terraform", "AI policy contracts", "GitOps architecture", "Recovery runbooks"] },
];

const engineeringPractices = [
  { title: "Specify the contract", text: "Make inputs, invariants, ownership and failure behavior explicit before automating changes." },
  { title: "Test the unsafe path", text: "Reject stale evidence, unsupported changes and invalid output; exercise recovery as well as success." },
  { title: "Expose the proof", text: "Link code, tests and dated measurements. Label reference designs and roadmap work as such." },
];

export default function PortfolioLanding({ repos, username, unavailable }) {
  const repoByName = new Map(repos.map((repo) => [repo.name, repo]));

  return (
    <>
      <Head>
        <title>DrOSAlchemist | Kubernetes, AI &amp; security engineering</title>
        <meta
          name="description"
          content="Open-source Kubernetes and AI infrastructure, security-conscious automation and evidence-backed engineering. Explore code, tests, measured results and design boundaries."
        />
        <meta property="og:title" content="DrOSAlchemist | Systems, made useful" key="og-title" />
        <meta
          property="og:description"
          content="Kubernetes, AI infrastructure, security-conscious automation and code you can inspect."
          key="og-description"
        />
      </Head>

      <div className="resume-page">
        <section className="resume-hero site-shell" id="top">
          <div className="resume-hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Independent systems engineer</p>
            <h1>DrOSAlchemist</h1>
            <p className="resume-role">Kubernetes &amp; AI <span>·</span> Security-conscious automation <span>·</span> Open source</p>
            <p className="resume-lede">
              I build code and infrastructure at the boundaries of Kubernetes, AI,
              networking and security. Explore working implementations, explicit
              failure paths and documented measurements—not just architecture diagrams.
            </p>
            <div className="resume-actions">
              <a className="button button-dark" href="#github">
                View GitHub projects <ArrowDownRight aria-hidden="true" size={16} />
              </a>
              <Link className="button button-light" href="/writing/evidence-backed-agentic-sre">
                Explore an engineering case study <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </div>
            <div className="resume-stats" aria-label="Portfolio at a glance">
              <div><strong>{unavailable ? "Unavailable" : repos.length}</strong><span>Live public repository count</span></div>
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

        <section className="engineering-practices site-shell" aria-label="Engineering approach">
          {engineeringPractices.map((practice) => (
            <article key={practice.title}>
              <h2>{practice.title}</h2>
              <p>{practice.text}</p>
            </article>
          ))}
        </section>

        <section className="resume-section resume-projects" id="github">
          <div className="site-shell">
            <div className="resume-section-heading">
              <div>
                <p className="eyebrow">Open source / curated implementation evidence</p>
                <h2>Projects built in the open.</h2>
                <p className="section-copy">Each project identifies what is implemented, where to inspect the evidence and what remains unverified. The complete public repository stream is available in the project index.</p>
              </div>
              <Link className="text-link" href="/projects">
                All repositories <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </div>
            {unavailable && (
              <p className="notice-line" role="status">
                {unavailable === "rate-limit"
                  ? "GitHub has temporarily limited live metadata. Curated project links remain available; the live repository count is unavailable."
                  : "GitHub live metadata is unavailable. Curated project links remain available; they are not a live availability check."}
              </p>
            )}
            <FeaturedProjects />
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
                <p className="section-copy">Project-backed engineering practice—not an invented employment history. Follow the code and design notes for scope, tradeoffs and failure modes.</p>
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
                <p className="eyebrow">Tools used in code and reference designs</p>
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