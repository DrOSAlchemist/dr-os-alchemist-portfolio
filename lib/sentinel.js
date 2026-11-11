export const sentinelPath = "/projects/alchemist-sentinel";
export const sentinelRepository = "https://github.com/DrOSAlchemist/alchemist-sentinel";

export const sentinelReplay = {
  id: "SYN-001",
  namespace: "demo-checkout",
  pod: "checkout-api-replay",
  baseline: "This synthetic application is expected to run /app/server, not an interactive shell.",
  events: [
    {
      id: "E01", time: "2026-11-10T14:32:00Z", source: "Synthetic workload inventory",
      title: "Workload context established",
      detail: "The replay inventory associates checkout-api-replay with the demo-checkout namespace.",
      record: { namespace: "demo-checkout", pod: "checkout-api-replay", expectedProcess: "/app/server" },
    },
    {
      id: "E02", time: "2026-11-10T14:32:04Z", source: "Synthetic runtime event",
      title: "Unexpected shell observed",
      detail: "A /bin/sh process appears in the application container, outside the declared replay baseline.",
      record: { namespace: "demo-checkout", pod: "checkout-api-replay", type: "process", executable: "/bin/sh", parent: "/app/server" },
    },
    {
      id: "E03", time: "2026-11-10T14:32:06Z", source: "Synthetic network-policy verdict",
      title: "Outbound connection blocked",
      detail: "The fixture records a denied TCP connection to documentation-only address 203.0.113.42:443 from the same pod.",
      record: { namespace: "demo-checkout", pod: "checkout-api-replay", type: "connection", destination: "203.0.113.42:443", verdict: "DENY" },
    },
  ],
};

// These fixture rules establish observations, not intent or a causal process-to-flow link.
export function deriveSentinelFindings(replay) {
  const sameWorkload = (event) => event.record.namespace === replay.namespace && event.record.pod === replay.pod;
  return replay.events.filter(sameWorkload).flatMap((event) => {
    if (event.record.type === "process" && event.record.executable === "/bin/sh") {
      return [{ id: "F01", title: "Shell outside the declared baseline", evidence: event.id, detail: "Exact executable match: /bin/sh. This rule does not establish who launched it or why." }];
    }
    if (event.record.type === "connection" && event.record.verdict === "DENY") {
      return [{ id: "F02", title: "Denied outbound connection", evidence: event.id, detail: "Exact verdict match: DENY. The fixture does not show a successful connection or data transfer." }];
    }
    return [];
  });
}

export const sentinelHypotheses = [
  { title: "Possible unauthorized command execution", detail: "The shell could indicate compromise, but an approved debugging session is also possible. Review access and exec audit records before attributing intent." },
  { title: "Possible attempted external communication", detail: "The denied flow could be related to the shell or an unrelated application action. Process-to-flow attribution and destination context are missing; exfiltration is not established." },
];
