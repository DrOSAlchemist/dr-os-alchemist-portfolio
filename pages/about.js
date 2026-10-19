import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { labs, labProtocol } from "@/lib/labs";

const principles = [
  { number: "01", title: "Make the system legible", text: "Good automation exposes intent, ownership and failure modes instead of hiding them behind a button." },
  { number: "02", title: "Design for the day after launch", text: "Operations, observability and rollback are part of the architecture, not cleanup for later." },
  { number: "03", title: "Secure the seams", text: "Identity, policy and network boundaries matter most where components meet." },
];

const skills = ["Network engineering", "DevSecOps", "SRE", "Kubernetes", "AI / ML infrastructure", "Python / APIs", "Automation", "DNS & IPAM", "Security controls", "CI verification", "GitOps design"];

export default function About() {
  return (
    <>
      <Head>
        <title>About &amp; Engineering Lab | DrOSAlchemist</title>
        <meta name="description" content="DrOSAlchemist's systems and network engineering practice: DevSecOps, SRE, Kubernetes, automation, ongoing DIT study and reproducible local labs." />
        <meta property="og:title" content="About & Engineering Lab | DrOSAlchemist" key="og-title" />
        <meta property="og:description" content="Personal engineering practice with reproducible experiments, inspectable evidence and honest limitations." key="og-description" />
      </Head>
      <div className="site-shell page-main">
        <div className="page-kicker">About / the operator &amp; the engineering lab</div>
        <h1 className="page-title">I work where<br />systems meet reality.</h1>
        <nav className="section-nav lab-navigation" aria-label="About and lab sections">
          <a href="#operator">The operator</a>
          <a href="#lab-protocol">How I experiment</a>
          <a href="#lab-workbench">Lab workbench</a>
          <a href="#evidence-contract">Evidence contract</a>
        </nav>
        <div className="about-grid" id="operator">
          <div className="prose">
            <p>
              I&apos;m DrOSAlchemist, an independent systems engineer and network
              engineer. My practice connects DevSecOps, SRE, Kubernetes, model
              infrastructure and secure network design: the infrastructure,
              identity, automation and policy that make a platform useful
              after the demo is over.
            </p>
            <p>
              I&apos;m pursuing a Doctor of Information Technology (DIT).
              Alongside that study, my engineering questions focus on latency,
              failure, identity boundaries, policy enforcement and operational
              drift. I use the lab to test assumptions and separate what I
              expect a system to do from what the evidence actually shows.
            </p>
            <p>
              I like problems that cross boundaries. A model needs a GPU, a
              scheduler needs a capacity contract, a service needs a name and an
              address, and a secure network path. Every change needs a way to
              be observed, validated and reversed. Connecting those details is
              where reliable systems take shape.
            </p>
            <p>
              This portfolio connects implementation to evidence: source code,
              test contracts, dated measurements and explicit limitations.
              It distinguishes runnable demos from reference architectures,
              and design goals from verified production behavior.
            </p>
            <p>
              This is also my engineering lab: a place to turn a systems question
              into a bounded experiment, test the failure and refusal paths,
              and make the result inspectable. I ask which contract defines
              the boundary, which control enforces it and which network
              conditions affect the outcome. I prefer a small, reproducible
              claim to a large architecture story with no working verification.
            </p>
            <a className="button button-dark" href="#lab-workbench">Explore the lab workbench <ArrowUpRight aria-hidden="true" size={16} /></a>
            <div className="skill-cloud" aria-label="Areas of focus">
              {skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}
            </div>
            <section className="lab-section" id="lab-protocol" aria-labelledby="lab-protocol-title">
              <p className="eyebrow">Method / question to evidence</p>
              <h2 id="lab-protocol-title">How I run an experiment.</h2>
              <p className="section-copy">The lab is a collection of source-backed exercises, not a hosted cloud sandbox. Commands execute on the reader&apos;s machine; this website does not run code or provision resources.</p>
              <ol className="lab-protocol">
                {labProtocol.map((step) => (
                  <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>
                ))}
              </ol>
            </section>
            <section className="lab-section" id="lab-workbench" aria-labelledby="lab-workbench-title">
              <p className="eyebrow">Workbench / reproducible starting points</p>
              <h2 id="lab-workbench-title">Pick a question. Inspect the result.</h2>
              <p className="section-copy">Use a new directory for each clone and inspect the source before running commands. Start with local verification or read-only research. Expand an exercise only after reviewing its dependencies and boundaries.</p>
              <div className="lab-jump-links">
                {labs.map((lab) => <a className="text-link" key={lab.id} href={`#${lab.id}`}>{lab.title}</a>)}
              </div>
              <div className="lab-workbench">
                {labs.map((lab) => (
                  <article className="lab-card" key={lab.id} id={lab.id} aria-labelledby={`${lab.id}-title`}>
                    <span className="project-status">{lab.mode}</span>
                    <h3 id={`${lab.id}-title`}>{lab.title}</h3>
                    <p className="lab-question">{lab.question}</p>
                    <dl className="lab-contract">
                      <div><dt>Prerequisites</dt><dd>{lab.prerequisites}</dd></div>
                      <div><dt>Execution scope</dt><dd>{lab.scope}</dd></div>
                    </dl>
                    <figure className="article-code">
                      <figcaption>Reproduce / {lab.projectName}</figcaption>
                      <pre tabIndex={0} aria-label={`Commands for ${lab.title}`}><code>{lab.command}</code></pre>
                    </figure>
                    <dl className="lab-contract">
                      <div><dt>Expected observation</dt><dd>{lab.expected}</dd></div>
                      <div><dt>Failure check</dt><dd>{lab.failureCheck}</dd></div>
                      <div><dt>Next experiment</dt><dd>{lab.nextStep}</dd></div>
                      <div><dt>Boundary</dt><dd>{lab.boundary}</dd></div>
                    </dl>
                    <a className="text-link" href={lab.guideUrl} target="_blank" rel="noreferrer">{lab.guideLabel} <ArrowUpRight aria-hidden="true" size={14} /></a>
                  </article>
                ))}
              </div>
            </section>
            <section className="lab-section" id="evidence-contract" aria-labelledby="evidence-contract-title">
              <p className="eyebrow">Lab notebook / acceptance contract</p>
              <h2 id="evidence-contract-title">What counts as a result?</h2>
              <div className="lab-evidence-grid">
                <div>
                  <h3>Record enough to challenge it</h3>
                  <ul>
                    <li>Question, source revision, date, environment and exact commands.</li>
                    <li>Expected versus observed behavior, exit codes and refusal cases.</li>
                    <li>Raw evidence location, retention limits and changed variables.</li>
                    <li>Known gaps, cleanup performed and the next falsifiable question.</li>
                  </ul>
                </div>
                <div>
                  <h3>Do not collapse the evidence levels</h3>
                  <ul>
                    <li>A local test verifies its assertions under the tested inputs.</li>
                    <li>A CI run records one revision and one execution environment.</li>
                    <li>A cloud measurement describes its dated setup, not every workload.</li>
                    <li>A design proposal remains a proposal until implemented and verified.</li>
                  </ul>
                </div>
              </div>
              <p className="notice-line">Never publish tokens, private logs or customer data as lab evidence. No exercise here claims production availability, compliance certification or a complete security assessment.</p>
            </section>
          </div>
          <div>
            <figure className="profile-frame">
              <Image
                src="/dr-osalchemist-avatar.jpg"
                alt="DrOSAlchemist GitHub profile avatar"
                width={331}
                height={331}
                priority
              />
              <figcaption><span className="mono-label">DR OS / SYSTEMS PRACTICE</span><span>Profile image via GitHub</span></figcaption>
            </figure>
            <div className="principle-list about-principles">
              {principles.map((principle) => (
                <article className="principle" key={principle.number}>
                  <span>{principle.number}</span>
                  <div><h3>{principle.title}</h3><p>{principle.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="about-next">
          <span className="mono-label">KEEP EXPLORING</span>
          <Link href="/projects">Browse the project index <ArrowUpRight aria-hidden="true" size={16} /></Link>
        </div>
      </div>
    </>
  );
}