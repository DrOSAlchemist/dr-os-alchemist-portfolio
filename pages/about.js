import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const principles = [
  { number: "01", title: "Make the system legible", text: "Good automation exposes intent, ownership and failure modes instead of hiding them behind a button." },
  { number: "02", title: "Design for the day after launch", text: "Operations, observability and rollback are part of the architecture, not cleanup for later." },
  { number: "03", title: "Secure the seams", text: "Identity, policy and network boundaries matter most where components meet." },
];

const skills = ["Kubernetes", "AI / ML infrastructure", "Python / APIs", "GPU scheduling", "DNS & IPAM", "Security controls", "CI verification", "GitOps design"];

export default function About() {
  return (
    <>
      <Head>
        <title>About | DrOSAlchemist</title>
        <meta name="description" content="Meet DrOSAlchemist, an AI/ML and network systems engineer focused on secure, observable platforms." />
        <meta property="og:title" content="About | DrOSAlchemist" key="og-title" />
        <meta property="og:description" content="Meet DrOSAlchemist, an AI/ML and network systems engineer focused on secure, observable platforms." key="og-description" />
      </Head>
      <div className="site-shell page-main">
        <div className="page-kicker">About / the operator behind the systems</div>
        <h1 className="page-title">I work where<br />systems meet reality.</h1>
        <div className="about-grid">
          <div className="prose">
            <p>
              I&apos;m DrOSAlchemist, an independent systems engineer. My
              work lives at the intersection of model infrastructure, Kubernetes,
              networking and security: the pieces that make a platform useful
              after the demo is over.
            </p>
            <p>
              I like problems that cross boundaries. A model needs a GPU, a
              scheduler needs a capacity contract, a service needs a name and an
              address, and every change needs a way to be seen and reversed.
              Connecting those details is where reliable systems take shape.
            </p>
            <p>
              This portfolio connects implementation to evidence: source code,
              test contracts, dated measurements and explicit limitations.
              It distinguishes runnable demos from reference architectures,
              and design goals from verified production behavior.
            </p>
            <div className="skill-cloud" aria-label="Areas of focus">
              {skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}
            </div>
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