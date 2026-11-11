import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { featuredProjects, projectUrl } from "../lib/projects.js";
import { deriveSentinelFindings, sentinelPath, sentinelReplay, sentinelRepository, sentinelHypotheses } from "../lib/sentinel.js";

test("Sentinel card links the replay and separate source without live or model claims", () => {
  const project = featuredProjects.find((item) => item.name === "alchemist-sentinel");
  assert.equal(project.demoPath, sentinelPath);
  assert.equal(projectUrl(project), sentinelRepository);
  assert.match(project.status, /Replay-only/);
  assert.match(project.limitation, /No live cluster, real AI inference or write actions/);
  assert.match(project.limitation, /review-only/);
});

test("synthetic replay has ordered evidence and findings linked to exact records", () => {
  assert.equal(sentinelReplay.events.length, 3);
  const ids = sentinelReplay.events.map((event) => event.id);
  assert.equal(new Set(ids).size, ids.length);
  const timestamps = sentinelReplay.events.map((event) => Date.parse(event.time));
  assert.ok(timestamps.every(Number.isFinite));
  assert.deepEqual(timestamps, [...timestamps].sort((a, b) => a - b));
  assert.ok(sentinelReplay.events.every((event) => event.source.startsWith("Synthetic")));
  const before = JSON.stringify(sentinelReplay);
  const findings = deriveSentinelFindings(sentinelReplay);
  assert.deepEqual(findings.map(({ id, evidence }) => ({ id, evidence })), [
    { id: "F01", evidence: "E02" }, { id: "F02", evidence: "E03" },
  ]);
  assert.equal(JSON.stringify(sentinelReplay), before);
  assert.deepEqual(deriveSentinelFindings(sentinelReplay), findings);
  assert.equal(sentinelHypotheses.length, 2);
  assert.match(sentinelHypotheses[1].detail, /exfiltration is not established/);
});

test("rules do not invent findings for missing, allowed or different-workload evidence", () => {
  assert.deepEqual(deriveSentinelFindings({ ...sentinelReplay, events: [] }), []);
  const allowed = structuredClone(sentinelReplay);
  allowed.events[1].record.executable = "/app/server";
  allowed.events[2].record.verdict = "ALLOW";
  assert.deepEqual(deriveSentinelFindings(allowed), []);
  for (const field of ["namespace", "pod"]) {
    const unrelated = structuredClone(sentinelReplay);
    unrelated.events.forEach((event) => { event.record[field] = "unrelated"; });
    assert.deepEqual(deriveSentinelFindings(unrelated), []);
  }
});

test("replay route has no data fetching, external inference or write controls", () => {
  const source = readFileSync(new URL("../pages/projects/alchemist-sentinel.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\b(fetch|useEffect|getServerSideProps|getInitialProps)\s*\(|<form\b|<button\b|onClick=|localStorage|sessionStorage|dangerouslySetInnerHTML/);
  assert.match(source, /Replay only · synthetic evidence/);
  assert.match(source, /not AI output/);
  assert.match(source, /No apply, isolate, delete or restart controls/);
});
