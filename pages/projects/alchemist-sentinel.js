import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { deriveSentinelFindings, sentinelHypotheses, sentinelReplay, sentinelRepository } from "@/lib/sentinel";

export default function AlchemistSentinel() {
  const findings = deriveSentinelFindings(sentinelReplay);

  return (
    <>
      <Head>
        <title>Alchemist Sentinel · Incident replay | DrOSAlchemist</title>
        <meta name="description" content="A read-only synthetic Kubernetes incident replay: inspect evidence, deterministic findings, hypotheses and review-only remediation." />
        <meta property="og:title" content="Alchemist Sentinel · Incident replay" key="og-title" />
        <meta property="og:description" content="Synthetic evidence. Deterministic findings. Human review, not autonomous remediation." key="og-description" />
      </Head>
      <div className="site-shell page-main sentinel-page">
        <Link className="text-link" href="/projects"><ArrowLeft size={14} aria-hidden="true" /> All projects</Link>
        <header className="sentinel-hero">
          <div className="page-kicker"><ShieldCheck size={16} aria-hidden="true" /> Security engineering / evidence workbench</div>
          <h1 className="page-title">Alchemist<br /><span>Sentinel.</span></h1>
          <p className="page-lede">An incident story you can inspect. Follow a shell event and a blocked outbound connection without confusing observations with intent.</p>
          <a className="button button-dark" href={sentinelRepository} target="_blank" rel="noreferrer">Source repository <ArrowUpRight size={16} aria-hidden="true" /></a>
        </header>

        <aside className="sentinel-banner" aria-labelledby="replay-boundary">
          <ShieldCheck size={24} aria-hidden="true" />
          <div><h2 id="replay-boundary">Replay only · synthetic evidence</h2>
            <p>This fixed, read-only scenario is not a live cluster or a monitoring service. No real AI inference, credentials, cluster access or write actions. Nothing here executes remediation or changes public state.</p></div>
        </aside>
        <nav className="section-nav" aria-label="Incident replay sections">
          <a href="#evidence-timeline">Evidence timeline</a>
          <a href="#deterministic-findings">Deterministic findings</a>
          <a href="#hypotheses">Hypotheses</a>
          <a href="#review-plan">Review-only remediation</a>
        </nav>

        <dl className="sentinel-context">
          <div><dt>Scenario</dt><dd>{sentinelReplay.id} / fixed replay</dd></div>
          <div><dt>Namespace</dt><dd>{sentinelReplay.namespace}</dd></div>
          <div><dt>Pod</dt><dd>{sentinelReplay.pod}</dd></div>
          <div><dt>Disposition</dt><dd>Needs human review</dd></div>
        </dl>

        <section className="sentinel-section" id="evidence-timeline" aria-labelledby="timeline-heading">
          <div className="section-heading-row"><h2 id="timeline-heading">01 / Evidence timeline</h2><p>Fixture timestamps · UTC · not live telemetry</p></div>
          <p>{sentinelReplay.baseline} All records below are authored fixtures, not collected security evidence.</p>
          <ol className="sentinel-timeline">
            {sentinelReplay.events.map((event) => (
              <li id={`evidence-${event.id}`} key={event.id}>
                <div className="sentinel-event-stamp"><span className="mono-label">{event.id}</span><time dateTime={event.time}>{event.time.slice(11, 19)} UTC</time></div>
                <article className="sentinel-panel">
                  <span className="mono-label">{event.source}</span>
                  <h3>{event.title}</h3><p>{event.detail}</p>
                  <details><summary>Inspect {event.id} fixture record</summary>
                    <pre tabIndex={0} aria-label={`${event.id} synthetic JSON record`}><code>{JSON.stringify(event.record, null, 2)}</code></pre>
                  </details>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <div className="sentinel-analysis">
          <section className="sentinel-section" id="deterministic-findings" aria-labelledby="findings-heading">
            <h2 id="findings-heading">02 / Deterministic findings</h2>
            <p>Local fixture rules only. Exact field matches, scoped to this namespace and pod; no model, risk score or autonomous verdict.</p>
            {findings.map((finding) => (
              <article className="sentinel-panel" key={finding.id}>
                <span className="mono-label">Observed / {finding.id}</span>
                <h3>{finding.title}</h3><p>{finding.detail}</p>
                <a className="text-link" href={`#evidence-${finding.evidence}`}>Inspect evidence {finding.evidence} <ArrowUpRight size={14} aria-hidden="true" /></a>
              </article>
            ))}
          </section>
          <section className="sentinel-section" id="hypotheses" aria-labelledby="hypotheses-heading">
            <h2 id="hypotheses-heading">03 / Hypotheses, not conclusions</h2>
            <p>Authored investigation prompts, not AI output. Temporal proximity in one pod does not prove causation.</p>
            {sentinelHypotheses.map((hypothesis) => (
              <article className="sentinel-panel sentinel-hypothesis" key={hypothesis.title}>
                <span className="mono-label">Unverified / needs corroboration</span>
                <h3>{hypothesis.title}</h3><p>{hypothesis.detail}</p>
              </article>
            ))}
          </section>
        </div>

        <section className="sentinel-section" id="review-plan" aria-labelledby="review-heading">
          <div className="section-heading-row"><h2 id="review-heading">04 / Review-only remediation</h2><p>Proposal, not execution</p></div>
          <div className="sentinel-panel sentinel-review">
            <div><h3>Preserve → corroborate → approve</h3><p>No apply, isolate, delete or restart controls exist in this demo. These are review suggestions for a real investigation, not instructions executed against infrastructure.</p></div>
            <ol>
              <li>Preserve runtime, network and access records; establish provenance and retention before considering changes.</li>
              <li>Check approved debugging activity and correlate process identity with the denied flow. Confirm policy behavior independently.</li>
              <li>If corroborated, have an authorized responder review containment and workload hardening, with impact assessment, explicit approval and a rollback plan.</li>
              <li>Verify any separately approved change and document the outcome. This replay cannot demonstrate containment or recovery.</li>
            </ol>
          </div>
        </section>
        <p className="sentinel-endnote">Scope: one synthetic pod, two exact-match findings, no completeness guarantee. The linked repository is a separate implementation; this page does not attest to its runtime behavior or live integrations.</p>
      </div>
    </>
  );
}
