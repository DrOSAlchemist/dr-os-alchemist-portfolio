export const articles = [
  {
    slug: "gpu-aware-kubernetes-scheduling",
    title: "Make the GPU a first-class citizen in Kubernetes",
    excerpt: "A practical scheduling model for mixed training and inference workloads, from device discovery to queue policy.",
    category: "Kubernetes · AI/ML",
    date: "2026-09-18",
    readTime: "7 min read",
    lead: "GPU capacity is too expensive to schedule by accident. Treat accelerators as a platform resource with workload classes, isolation boundaries and an observable queue, not as a node label that application teams have to reverse-engineer.",
    sections: [
      {
        heading: "Start with workload shape, not a GPU count",
        paragraphs: [
          "Training jobs are elastic, long-running and often checkpointable. Online inference is latency-sensitive, bursty and sensitive to noisy neighbors. A cluster that gives both workloads the same queue and the same priority is making an architectural decision; it is just making it invisibly.",
          "Name a small set of workload classes first: interactive experiments, batch training, and production inference are a useful starting point. For each class, decide its latency objective, preemption policy, accelerator profile and maximum queue time. These are service-level choices, not scheduler trivia.",
        ],
      },
      {
        heading: "Make hardware pools explicit",
        paragraphs: [
          "Separate nodes by the hardware they actually offer: memory size, architecture, interconnect and partitioning mode matter as much as the accelerator model. Use labels for selection and taints to keep general workloads from consuming reserved capacity. The policy should be managed with the node-pool definition so it stays reviewable alongside the cluster.",
          "Where the hardware supports partitioning, publish those profiles as distinct capacity. A small inference slice and a full training device are different products, even when they share a card. Keep the device plugin and driver versions pinned to the node image and roll them as a tested unit.",
        ],
      },
      {
        heading: "Queues need fairness and a way out",
        paragraphs: [
          "A queue prevents a burst of experiments from turning into a thundering herd, but FIFO alone can strand short jobs behind a large training run. Add per-team quotas, bounded priorities and a documented preemption policy. Reserve a floor for production inference, then let training borrow unused capacity only when the reclaim path is understood.",
          "Autoscaling must agree with the queue. Scale from pending accelerator requests and provisioning delay, not CPU utilization on nodes that are already full. Track unschedulable time separately from provisioning time; they point to different fixes.",
        ],
      },
      {
        heading: "Measure the whole request path",
        paragraphs: [
          "Collect accelerator utilization and memory alongside queue age, time-to-first-token, batch size, pod placement and model revision. A GPU at 95% utilization is not automatically healthy if the serving queue is growing or tail latency is breaching its objective.",
          "Put the signals on one dashboard with workload class and team dimensions. That makes capacity conversations concrete: the question becomes which workload is waiting, for what profile, and for how long.",
        ],
      },
      {
        heading: "A rollout checklist",
        bullets: [
          "Validate drivers, device plugin and node labels on a canary pool before admitting production jobs.",
          "Set quota and priority defaults that prevent one namespace from consuming the fleet.",
          "Exercise node loss, image pull failure and model warm-up in a non-production environment.",
          "Alert on queue age and inference latency, not just node health.",
        ],
        callout: "A useful GPU platform makes the right placement the easy default and makes scarce capacity visible before it becomes an incident.",
      },
    ],
  },
  {
    slug: "safe-model-rollouts",
    title: "A safer release path for models on Kubernetes",
    excerpt: "Treat model rollout as a control loop: version the artifact, shift traffic deliberately and let service signals decide what happens next.",
    category: "AI/ML · Delivery",
    date: "2026-09-05",
    readTime: "6 min read",
    lead: "A model deployment is not just a container update. The artifact, tokenizer, serving image, runtime flags and traffic policy together define what a user experiences. A safe release path versions that whole unit and has a measurable way to stop or reverse a rollout.",
    sections: [
      {
        heading: "Version the serving contract",
        paragraphs: [
          "Give each candidate an immutable artifact reference and record the runtime image digest, model checksum, tokenizer version and inference configuration beside it. A friendly model alias can point at the active version, but it should never be the only identifier in logs or deployment history.",
          "This makes a regression diagnosable. If output quality or latency changes, the team can tell whether the model, runtime, prompt wrapper or hardware profile changed, instead of comparing two mutable tags called latest.",
        ],
      },
      {
        heading: "Shift a small amount of traffic first",
        paragraphs: [
          "Bring up the candidate without sending user traffic, run a smoke suite against its health and inference endpoints, then direct a small canary slice to it. A service mesh, gateway or application-level router can make the split; the important part is that the routing decision is observable and reversible.",
          "Warm the model before measuring. Cold-start downloads, kernel compilation and cache fill are real production costs, but they should not be confused with steady-state latency. Record both separately.",
        ],
      },
      {
        heading: "Gate on service and product signals",
        paragraphs: [
          "Use a short list of bounded signals: error rate, queue depth, time-to-first-token, tail latency and a task-specific quality check. Compare the canary with the current version over a representative sample. A generic HTTP health check cannot detect a semantically broken model response.",
          "If a gate fails, stop the traffic increase and route back to the stable version automatically. Keep the previous deployment available until the new one has passed its observation window; deleting it immediately saves little and removes the simplest recovery path.",
        ],
      },
      {
        heading: "Keep the release auditable",
        paragraphs: [
          "Attach the rollout decision to the commit or release record: candidate digest, traffic percentages, gate thresholds, observed values and operator override. This is valuable during an incident and during the later conversation about whether a model is ready for a wider audience.",
        ],
        callout: "Canary is not a percentage. It is a bounded experiment with a control, a decision rule and a clear rollback action.",
      },
    ],
  },
  {
    slug: "ipam-backed-dns-changes",
    title: "DNS-as-code needs an IPAM feedback loop",
    excerpt: "Validated zone files are a start; address ownership, drift detection and rollback turn DNS automation into an operational control.",
    category: "Networking · Platform",
    date: "2026-08-21",
    readTime: "6 min read",
    lead: "A record file can be perfectly formatted and still point at the wrong service. DNS automation becomes trustworthy when it checks address ownership against IPAM, compares desired state with the live zone and captures the previous state before making a change.",
    sections: [
      {
        heading: "Make ownership a precondition",
        paragraphs: [
          "Before accepting an A or AAAA record, resolve the address to its most-specific allocation and verify that the allocation belongs to the intended environment or service. A broad network match is useful context, but it is not proof that a host address is available or correctly assigned.",
          "Keep the IPAM lookup read-only in the change path unless the allocation lifecycle is explicitly designed. DNS automation should not silently allocate an address as a side effect of creating a record.",
        ],
      },
      {
        heading: "Diff at the record-set boundary",
        paragraphs: [
          "DNS providers manage record sets, not isolated text lines. Group records by owner and type, require a consistent TTL, then compare the complete set of values. That makes replacement semantics visible: adding one address to an A set may replace the set, not append to an arbitrary list.",
          "Preserve provider-owned records such as apex SOA and nameserver data. If a zone uses aliases, weighted routing or health-check metadata that the migration tool does not understand, fail closed instead of flattening it into a simpler representation.",
        ],
      },
      {
        heading: "Snapshot, apply, verify",
        paragraphs: [
          "The operational sequence should be boring: validate the input, inspect the proposed diff, save the current state, apply the exact reviewed changes and check answers through more than one resolver. If the write fails partway through, attempt to restore the snapshot and report the recovery result clearly.",
          "Propagation checks tell you whether the sampled resolvers return the expected values. They do not prove every recursive cache has expired, so TTL planning and a controlled cutover window still matter.",
        ],
      },
      {
        heading: "Keep the audit trail useful",
        paragraphs: [
          "Record the zone, change identifier, operator, source revision, before-state snapshot and resolver results. Store secrets outside the zone file and keep production snapshots out of source control. These details turn a migration from a one-off script into a reviewable operations workflow.",
        ],
        callout: "The best rollback is one you can identify, validate and execute without reconstructing the old zone from memory.",
      },
    ],
  },
];

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug);
}