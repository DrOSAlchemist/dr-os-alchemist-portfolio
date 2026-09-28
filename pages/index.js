import Head from "next/head";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Boxes, Network, ShieldCheck } from "lucide-react";

const disciplines = [
  {
    number: "01",
    title: "AI / ML platforms",
    text: "The GPU-aware infrastructure that takes experiments to reliable inference.",
    icon: Boxes,
    color: "mint",
  },
  {
    number: "02",
    title: "Networks & naming",
    text: "DNS, IPAM, traffic flow and the connective tissue behind every service.",
    icon: Network,
    color: "blue",
  },
  {
    number: "03",
    title: "Security by design",
    text: "Identity, policy and observability built into the operating model.",
    icon: ShieldCheck,
    color: "coral",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>DrOSAlchemist | AI platforms, networks &amp; systems</title>
        <meta
          name="description"
          content="DrOSAlchemist builds secure, observable infrastructure for AI/ML, Kubernetes, and connected systems."
        />
        <meta property="og:title" content="DrOSAlchemist | Systems, made useful" key="og-title" />
        <meta
          property="og:description"
          content="AI infrastructure, Kubernetes, networking and security, brought together."
          key="og-description"
        />
      </Head>

      <div className="home-page">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> Independent systems engineer</p>
            <h1>
              Infrastructure
              <br />
              for <span className="hero-highlight">intelligence.</span>
            </h1>
            <p className="hero-lede">
              I connect AI/ML, Kubernetes, networking and security into systems
              people can actually operate.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/projects">
                Explore the work <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              <Link className="text-link" href="/writing">
                Read the field notes <ArrowDownRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span className="mono-label">CURRENTLY EXPLORING</span>
              <span>GPU scheduling · platform networking · safe change</span>
            </div>
          </div>

          <div className="system-visual" aria-label="Illustrated map of a connected AI platform">
            <div className="visual-topline">
              <span className="mono-label">SYSTEM MAP / 001</span>
              <span className="visual-state">OPERATIONAL <i /></span>
            </div>
            <div className="system-map">
              <div className="map-label map-label-top">CONTROL PLANE</div>
              <div className="map-node node-gateway">
                <span className="node-index">EDGE / 01</span>
                <strong>Gateway</strong>
                <span>identity · policy</span>
              </div>
              <div className="map-node node-scheduler">
                <span className="node-index">CLUSTER / 02</span>
                <strong>Scheduler</strong>
                <span>queues · GPU pools</span>
              </div>
              <div className="map-node node-inference">
                <span className="node-index">RUNTIME / 03</span>
                <strong>Inference</strong>
                <span>models · signals</span>
              </div>
              <div className="map-node node-network">
                <span className="node-index">FABRIC / 04</span>
                <strong>Network</strong>
                <span>DNS · IPAM · routes</span>
              </div>
              <div className="map-link link-one"><span /></div>
              <div className="map-link link-two"><span /></div>
              <div className="map-link link-three"><span /></div>
              <div className="map-link link-four"><span /></div>
              <div className="map-center-mark"><span>OS</span></div>
              <div className="map-label map-label-bottom">OBSERVABILITY / ALWAYS ON</div>
            </div>
            <div className="visual-footline">
              <span>Composable by design.</span>
              <span className="mono-label">LAT 37.7749° N</span>
            </div>
          </div>
        </section>

        <section className="section-block discipline-section">
          <div className="section-intro">
            <p className="eyebrow">One operating picture</p>
            <h2>Different layers.<br /><span>One system.</span></h2>
            <p className="section-copy">
              Durable platforms happen at the boundaries: where models meet
              compute, where services meet networks, and where change meets policy.
            </p>
          </div>
          <div className="discipline-list">
            {disciplines.map(({ number, title, text, icon: Icon, color }) => (
              <article className="discipline-row" key={number}>
                <span className="discipline-number">{number}</span>
                <span className={`discipline-icon ${color}`}><Icon aria-hidden="true" size={20} strokeWidth={1.7} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <ArrowUpRight className="row-arrow" aria-hidden="true" size={19} />
              </article>
            ))}
          </div>
        </section>

        <section className="feature-band">
          <div className="feature-band-label">
            <span className="mono-label">FIELD NOTE / 01</span>
            <span className="feature-rule" />
          </div>
          <div className="feature-band-copy">
            <p className="eyebrow">Latest from the lab</p>
            <h2>Make the GPU a first-class citizen in Kubernetes.</h2>
            <p>
              Scheduling is a product decision: shape queues, capacity and
              isolation around the workload, not the other way around.
            </p>
            <Link className="text-link" href="/writing/gpu-aware-kubernetes-scheduling">
              Read the note <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="feature-diagram" aria-hidden="true">
            <div className="rack rack-a"><span /><span /><span /></div>
            <div className="rack rack-b"><span /><span /><span /></div>
            <div className="diagram-bus" />
            <div className="diagram-pulse pulse-one" />
            <div className="diagram-pulse pulse-two" />
            <span className="diagram-caption">GPU POOL / INFERENCE</span>
          </div>
        </section>

        <section className="closing-strip">
          <p className="eyebrow">The useful question</p>
          <h2>What should be easier<br /><em>to operate tomorrow?</em></h2>
          <Link className="button button-outline" href="/contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </section>
      </div>
    </>
  );
}
