import Head from "next/head";
import Link from "next/link";
import { ArrowUpRight, CodeXml, MessageSquareText } from "lucide-react";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Connect | DrOSAlchemist</title>
        <meta name="description" content="Connect with DrOSAlchemist about AI/ML infrastructure, Kubernetes and network systems." />
      </Head>
      <div className="site-shell page-main contact-page">
        <div className="page-kicker">Connect / start with the problem</div>
        <div className="contact-grid">
          <div>
            <h1 className="page-title">Let&apos;s make<br /><span className="title-highlight">systems clearer.</span></h1>
            <p className="page-lede">
              Interested in platform engineering, AI infrastructure, Kubernetes,
              networking or security? Share the problem you&apos;re trying to solve.
            </p>
          </div>
          <div className="contact-card">
            <MessageSquareText aria-hidden="true" className="contact-mark" size={24} />
            <h2>Find me in the open</h2>
            <p>
              GitHub is the best place to explore public work or start a technical
              conversation. I haven&apos;t published a direct email address here.
            </p>
            <a className="contact-link" href="https://github.com/DrOSAlchemist" target="_blank" rel="noreferrer">
              <span><CodeXml aria-hidden="true" size={17} /> GitHub · DrOSAlchemist</span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a className="contact-link" href="https://www.linkedin.com/in/jsanni/" target="_blank" rel="noreferrer">
              <span>LinkedIn · Joshua Sanni</span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <Link className="contact-link" href="/projects">
              <span>Browse public repositories</span><ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <div className="contact-signoff"><span className="mono-label">BUILD WITH INTENT</span><span>Secure · Observable · Operable</span></div>
      </div>
    </>
  );
}