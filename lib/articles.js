export const articles = [
  {
    slug: "devsecops-evidence-before-deployment",
    title: "A green pipeline needs an evidence boundary",
    excerpt: "How I connected Terraform mock plans, tested OPA guardrails and runtime image scans without requiring a cloud subscription or claiming a deployment.",
    category: "DevSecOps · Policy as code · Engineering case study",
    date: "2026-10-18",
    readTime: "8 min read",
    lead: "I built the Azure DevSecOps Policy Pipeline to answer a narrow engineering question: how much of a delivery contract can be verified before obtaining cloud credentials? The result is executable code, not an Azure environment: a dependency-free HTTP application, a mocked infrastructure plan, explicit policy decisions and independently scanned runtime artifacts.",
    sections: [
      {
        heading: "Start with the decision, not a wall of scanner logos",
        paragraphs: [
          "My acceptance contract separates application behavior, declared infrastructure intent and artifact contents. Node tests exercise HTTP routes and error behavior. Terraform validates provider schemas and six mock-plan assertions. OPA evaluates topology-specific guardrails against the extracted plan. Checkov inspects Terraform and the Dockerfile; Trivy inspects the filesystem and built image. These layers observe different failure modes and are not interchangeable.",
          "I kept the demo application intentionally small: a static engineering dashboard, a health endpoint and a read-only controls inventory. There is no login, persistence or external API call. Adding those features just to make the example look larger would create untested operational obligations and distract from the delivery contract.",
        ],
        bullets: [
          "Inputs: source revision, committed provider lockfile, Terraform test events and a locally built runtime image.",
          "Decisions: explicit pass/fail results for mandatory jobs; skipped optional tools remain visibly not run.",
          "Outputs: test logs, extracted mock plan, scanner reports and a CycloneDX software bill of materials, with seven-day artifact retention.",
          "Non-goals: cloud provisioning, production identity, compliance certification, automatic remediation and a proven scalable service.",
        ],
      },
      {
        heading: "Connect the policy to the plan actually generated",
        paragraphs: [
          "The subtle failure is not always a weak policy. It is a strong policy evaluating the wrong input. A hand-written passing fixture could remain green after the infrastructure changed. I therefore consume Terraform's verbose JSONL test stream, extract exactly one nonempty test_plan event and evaluate that object with OPA.",
          "The extractor rejects malformed events, multiple plans, empty changes and an existing output file. Exclusive file creation prevents a local rerun from silently reusing stale output. This is a useful consistency boundary, not a cryptographic attestation. CI must also require Terraform to exit successfully before extraction.",
        ],
        code: {
          caption: "From the repository root, after Terraform initialization; reports/plan.json must not already exist",
          text: "mkdir -p reports\nterraform -chdir=infra test -verbose -json > reports/terraform-test.jsonl &&\n  node scripts/extract-plan.js reports/terraform-test.jsonl reports/plan.json &&\n  .tools/opa eval --fail --data policy/terraform.rego \\\n    --input reports/plan.json 'data.terraform.guardrails.allow == true'",
        },
      },
      {
        heading: "Refuse unknown and weakened intent",
        paragraphs: [
          "The Rego rules expect this reference topology's managed resource types and required security values. Missing or unknown settings are not permission to proceed. The rules reject deletions, unsupported managed types, mutable image references, missing tags, insecure transport, basic publishing authentication, weakened policy definitions and disabled assignment enforcement.",
          "Twelve named OPA tests mutate a known-good plan, including several variants within individual tests. This is more useful than proving only that the happy-path fixture passes. It still does not make the rules a general Azure compliance engine: another topology needs a reviewed extension and corresponding refusal tests.",
        ],
        code: {
          caption: "Inspect denial reasons separately from the blocking allow decision",
          text: ".tools/opa test policy -v\n.tools/opa eval --format pretty --data policy/terraform.rego \\\n  --input reports/plan.json 'data.terraform.guardrails.deny'",
        },
      },
      {
        heading: "The image scan found something the application audit could not",
        paragraphs: [
          "The application has no production npm dependencies. That did not make its image clean. The initial image scan found high-severity vulnerabilities in packages shipped with the base image's npm toolchain, including brace-expansion, http-cache-semantics and undici. The application audit and image scan were looking at different dependency inventories.",
          "My fix was to remove npm and Yarn from the final runtime filesystem because this server does not need a package manager to execute. CI asserts that their launchers are absent, runs a non-root, read-only smoke test and scans the resulting image again. I did not suppress unfixed findings or claim to have patched the upstream base layers.",
          "A separate first-run failure was a startup race: curl reached the container before its HTTP listener was ready. A bounded readiness retry handles that transient condition; it does not turn repeated connection failures into success. Both failures changed the implementation before the reference run passed.",
        ],
        callout: "Scan the artifact that will execute. A dependency-free package manifest says nothing about utilities inherited from its runtime image.",
      },
      {
        heading: "Make the aggregate gate explain every skip",
        paragraphs: [
          "The final required job rejects failed, cancelled or unexpectedly skipped mandatory jobs. Snyk is explicitly optional: it runs only when enabled for trusted non-PR events and requires a token. Enabling the variable without credentials fails; leaving it disabled means not run, not no vulnerabilities.",
          "The workflow uses read-only repository permissions, pinned direct action revisions and no cloud credentials. It does not publish images, apply Terraform or configure repository administration. A green workflow does not stop a maintainer merging a failing branch unless the required job is separately enforced through branch protection or a ruleset.",
          "Four Checkov exceptions are documented per resource with their rationale. Exceptions are part of the review surface, not proof that the corresponding operational risks disappeared. Scanner service or database failures remain failures rather than empty successful reports.",
        ],
      },
      {
        heading: "Evidence from one revision is not a permanent guarantee",
        paragraphs: [
          "At revision 4aefdf1de98fa4742ab42dee15c388f6e59cb90e on 2026-10-18, local validation passed 11 Node tests and 12 OPA tests; the linked GitHub Actions run passed every mandatory job. Snyk was intentionally skipped. Those are dated results, not a claim that the current branch or vulnerability database will always pass.",
          "Reports expire after seven days. The run remains a useful execution record, but an expired artifact cannot be inspected as though it were retained evidence. Reproduce the commands against the revision being reviewed and inspect current findings before relying on it.",
        ],
      },
      {
        heading: "What I would require before a real deployment",
        paragraphs: [
          "Mocked planning cannot verify RBAC, Azure Policy alias behavior or propagation, regional capacity, image pulls, health probes or diagnostic delivery. The supplied image input is deliberately a digest-pinned base Node image, not the built application image; applying the template would not deploy this server.",
          "The next stage needs an approved deployment design, a published and scanned application artifact, real identity and backend configuration, cost and capacity checks, runtime verification and a production security review. The example premium plan would incur charges. There is no apply job, and terraform apply is not a demo step.",
          "I would keep proposal, authorization and execution separate as that stage grows. The project is strongest when its boundary is precise: reproducible checks of declared intent and runtime contents before deployment, not an invented story about live cloud enforcement.",
        ],
      },
    ],
    references: [
      { label: "Source and reproducible setup", url: "https://github.com/DrOSAlchemist/azure-devsecops-policy-pipeline" },
      { label: "Implementation walkthrough", url: "https://github.com/DrOSAlchemist/azure-devsecops-policy-pipeline/blob/4aefdf1de98fa4742ab42dee15c388f6e59cb90e/docs/engineering.md" },
      { label: "Dated verification run (2026-10-18)", url: "https://github.com/DrOSAlchemist/azure-devsecops-policy-pipeline/actions/runs/39172532890" },
      { label: "Exact pipeline at the verified revision", url: "https://github.com/DrOSAlchemist/azure-devsecops-policy-pipeline/blob/4aefdf1de98fa4742ab42dee15c388f6e59cb90e/.github/workflows/ci.yml" },
      { label: "Guardrail mutation tests", url: "https://github.com/DrOSAlchemist/azure-devsecops-policy-pipeline/blob/4aefdf1de98fa4742ab42dee15c388f6e59cb90e/policy/terraform_test.rego" },
      { label: "Scoped scanner exceptions", url: "https://github.com/DrOSAlchemist/azure-devsecops-policy-pipeline/blob/4aefdf1de98fa4742ab42dee15c388f6e59cb90e/docs/security-exceptions.md" },
      { label: "Remediation and maintenance record", url: "https://github.com/DrOSAlchemist/azure-devsecops-policy-pipeline/blob/4aefdf1de98fa4742ab42dee15c388f6e59cb90e/docs/operations.md" },
    ],
  },
  {
    slug: "evidence-backed-agentic-sre",
    title: "An SRE agent should propose, not authorize",
    excerpt: "A quota incident demo that separates evidence, diagnosis, bounded proposals and verified recovery—with a manual path when AI is unavailable.",
    category: "SRE · AI guardrails · Security",
    date: "2026-10-06",
    readTime: "5 min read",
    lead: "The first Agentic SRE Platform release is an offline, synthetic control-loop demonstrator. It connects Pending pods, failed NodeClaims, EC2 limit errors and quota usage without giving an AI model production credentials or pretending that a Terraform proposal is a resolved incident.",
    sections: [
      {
        heading: "A symptom is not a root cause",
        paragraphs: [
          "Pending pods can result from taints, affinity, storage, insufficient regional capacity or an IAM denial. The quota diagnosis requires every modeled causal signal: Pending pods, failed NodeClaims, a recognized EC2 limit error and usage at or above the supported Standard On-Demand vCPU quota. Missing or contradictory signals produce an undetermined diagnosis, not a quota change.",
          "The current input is a scoped synthetic snapshot with strict fields and a 15-minute freshness limit. It does not authenticate AWS or Kubernetes provenance. A live collector would need per-source timestamps, event identifiers, instance-family quota coverage and trusted account, region and cluster attribution before its output could support operational decisions.",
        ],
      },
      {
        heading: "Keep the action boundary deterministic",
        paragraphs: [
          "The proposal generator emits a fixed Terraform Service Quotas resource for the allowlisted Standard On-Demand EC2 quota. The target must exceed the current value and cannot exceed twice that value or 1024 vCPUs. It never runs Terraform, changes Kubernetes resources or creates a GitHub pull request.",
          "An optional operator-supplied explanation JSON can describe the established evidence, but it cannot change the diagnosis or evidence IDs. This is an offline boundary, not a live model integration or a general prompt-injection defense. Accepted prose remains untrusted and does not select actions.",
        ],
      },
      {
        heading: "A request is not effective capacity",
        paragraphs: [
          "Submitting a quota request does not guarantee approval, and an approved quota does not guarantee an available EC2 instance. The demo remains awaiting recovery until a newer observation confirms the effective quota, successful launches, no Pending pods, no failed NodeClaims, cleared launch errors and application health.",
          "SQLite transactions persist the investigation, proposal and verification history. Identical investigation and proposal replay is idempotent; conflicting evidence or targets are rejected. Audit events are appended by the application, but the database is local, unencrypted and writable by its owner—not an immutable compliance ledger.",
        ],
      },
      {
        heading: "Test the refusal paths, not just the happy path",
        bullets: [
          "The 19-test suite covers malformed input, duplicate keys, oversized files, stale evidence and future timestamps.",
          "Alternative IAM and capacity failures must not produce quota proposals.",
          "Forged explanation evidence, changed incident scope and excessive quota targets are rejected.",
          "Each recovery signal is tested independently; a proposal alone cannot satisfy recovery.",
          "Ruff, Bandit and Python 3.12/3.13 CI checks complement the tests; they are not a penetration test or production certification.",
        ],
      },
      {
        heading: "Connect GitOps without making AI a dependency",
        paragraphs: [
          "The roadmap separates an Argo CD delivery plane from the investigation plane. Keycloak supplies operator identity, Harbor stores images, Vault supplies short-lived secrets, and admission policies would enforce approved registries and signatures. Those integrations are designed, not deployed by this release.",
          "A future read-only investigator may propose a bounded PR through a separately scoped GitHub App. A human approves the complete plan; a protected workflow executes it; independent observations verify recovery over a stability window. Argo CD reconciles Kubernetes, while a separate Terraform workflow handles cloud quota requests. Manual alerts and the incident runbook must still function if every AI component is unavailable.",
        ],
        callout: "A useful SRE agent narrows uncertainty. It does not turn generated prose into authority or remove the operator's fallback path.",
      },
    ],
    references: [
      { label: "Runnable demo and scope", url: "https://github.com/DrOSAlchemist/agentic-sre-platform" },
      { label: "Policy and recovery tests", url: "https://github.com/DrOSAlchemist/agentic-sre-platform/tree/main/tests" },
      { label: "Security boundaries and limitations", url: "https://github.com/DrOSAlchemist/agentic-sre-platform/blob/main/docs/security-model.md" },
      { label: "GitOps architecture and integration stages", url: "https://github.com/DrOSAlchemist/agentic-sre-platform/blob/main/docs/architecture.md" },
      { label: "Agent-independent manual runbook", url: "https://github.com/DrOSAlchemist/agentic-sre-platform/blob/main/docs/runbook.md" },
    ],
  },
  {
    slug: "queue-driven-gpu-inference",
    title: "From a queued prompt to a GPU node at zero",
    excerpt: "The project research note reports a T4 Spot cold-start reduction from 659 to 338 seconds with persistent model storage and a GKE Secondary Boot Disk.",
    category: "AI infrastructure · Kubernetes",
    date: "2026-09-30",
    readTime: "5 min read",
    lead: "The repository's 2026-04-05 research record reports 659 seconds from queue spike to first token on an 11 GB baked image, compared with 338 seconds using persistent model storage plus a GKE Secondary Boot Disk. That result describes a T4 Spot run in us-east1-d—not a guarantee for other GPUs, regions or workloads.",
    references: [
      { label: "Dated cold-start research record and reproduction notes", url: "https://github.com/DrOSAlchemist/keda-scale-zero-gpu-inference/blob/main/docs/cold-start-optimization.md" },
      { label: "Inference implementation and deployment guide", url: "https://github.com/DrOSAlchemist/keda-scale-zero-gpu-inference" },
    ],
    sections: [
      {
        heading: "Keep the request alive while compute is absent",
        paragraphs: [
          "The gateway accepts a prompt, writes a job to Redis and returns an ID immediately. A client polls for pending, completed or failed status instead of holding an HTTP connection through node provisioning and model load. This separates request intake from GPU availability, but Redis and the gateway remain online and continue to cost money while the GPU is off.",
          "The CPU worker moves each job into a processing list before calling vLLM's completions endpoint. KEDA watches both the waiting and processing lists for the worker and vLLM Deployments. That second trigger matters: once the worker takes the last item, an empty waiting list must not cause the model to disappear during inference.",
        ],
      },
      {
        heading: "Give an interrupted job a way back",
        paragraphs: [
          "On restart, the single worker requeues unfinished items from the processing list. It writes the result and acknowledges the item in one Redis transaction. A crash after vLLM generates a response can still repeat inference, so this is at-least-once processing, not exactly-once execution. The worker is deliberately limited to one replica until recovery ownership is designed for multiple consumers.",
          "Redis uses append-only persistence on a volume to improve recovery, but it is not a guarantee against every storage failure. Results expire after five minutes; clients need to poll within that window.",
        ],
      },
      {
        heading: "Separate pod scaling from node scaling",
        paragraphs: [
          "KEDA scales the CPU worker and GPU-backed vLLM pods from zero when a job appears. On a configured GKE cluster, the pending vLLM pod's GPU request is what should prompt the node pool autoscaler to add a GPU VM. Kubernetes manifests alone cannot create that pool, install drivers or prove a scale-to-zero node cycle; the repository includes the prerequisite and deployment steps rather than hiding them in an application diagram.",
          "The model cache lives on a persistent volume so weights can survive pod and node churn after the initial download. Separating the approximately 3.5 GB of Qwen weights from the approximately 8 GB vLLM runtime also makes the runtime image suitable for a GKE Secondary Boot Disk cache.",
        ],
      },
      {
        heading: "Measure the complete cycle before optimizing",
        paragraphs: [
          "The repository includes a concurrent submit-and-poll driver, a bounded cold/warm/full-zero capture script, Redis queue metrics and Prometheus scrape targets for vLLM. The capture refuses to call a run cold unless both pods and the GPU pool begin at zero. It records cluster events and returns nonzero if jobs fail or the node does not scale down.",
          "Local tests exercise the request/result contract, failed jobs and recovery from an interrupted item. The measured T4 Spot run in us-east1-d reduced queue-spike-to-first-token time from 659 seconds to 338 seconds. The PV-only improvement is an estimate, not an isolated benchmark; the two optimizations were measured together. The remaining time is mostly GPU VM bring-up and loading weights from the network-attached PVC into VRAM. The full build and deployment record is in the repository's cold-start research note, while DCGM data and other hardware-specific results remain environment-specific.",
        ],
        callout: "A GPU node at zero is only one part of the bill. A useful demonstration shows the queue, the pod, the node and the remaining always-on services on the same clock.",
      },
    ],
  },
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