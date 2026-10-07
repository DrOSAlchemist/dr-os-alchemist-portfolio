export const portfolioOwner = "DrOSAlchemist";

export const featuredProjects = [
  {
    name: "agentic-sre-platform",
    title: "Evidence-backed agentic SRE",
    category: "SRE / AI GUARDRAILS / SECURE DELIVERY",
    description: "An offline EC2 quota incident demonstrator with deterministic diagnosis, policy-bounded Terraform proposals, SQLite audit history and recovery verification.",
    tags: ["Python", "SRE", "Terraform proposals", "AI guardrails", "GitOps roadmap"],
    status: "Offline demonstrator",
    evidence: "19 tests plus Ruff and Bandit checks; CI on Python 3.12 and 3.13.",
    limitation: "Live AWS, model calls and GitOps deployments are roadmap items. Static checks are not a security audit.",
    evidencePath: "tests",
    noteSlug: "evidence-backed-agentic-sre",
  },
  {
    name: "keda-scale-zero-gpu-inference",
    title: "Queue-driven GPU inference",
    category: "AI INFRASTRUCTURE / KUBERNETES / FINOPS",
    description: "A FastAPI and Redis queue that wakes CPU workers and GPU vLLM pods with KEDA, with interrupted-job replay and a GKE deployment guide.",
    tags: ["Python", "KEDA", "Redis", "vLLM", "Kubernetes", "GKE"],
    status: "Documented cloud measurement",
    evidence: "The research note reports 659 → 338 seconds from queue spike to first token for a GKE T4 Spot run in us-east1-d on 2026-04-05.",
    limitation: "Persistent storage and Secondary Boot Disk were measured together; no isolated PV-only or optimized L4 benchmark.",
    evidencePath: "docs/cold-start-optimization.md",
    noteSlug: "queue-driven-gpu-inference",
  },
  {
    name: "dns-migration-automation",
    title: "Multi-cloud DNS migration automation",
    category: "CLOUD / NETWORK / AUTOMATION",
    description: "Provider-neutral zone validation, record diffs, snapshots, recovery attempts, propagation checks and read-only IPAM lookup across Cloudflare, Route 53, Google Cloud DNS, Azure DNS and TCPWave.",
    tags: ["Python", "AWS", "Azure", "Google Cloud", "Cloudflare", "IPAM"],
    status: "Automation implementation",
    evidence: "Repository documents validation, change planning and recovery paths.",
    limitation: "Provider-specific behavior and propagation require environment-level verification.",
    evidencePath: "README.md",
    noteSlug: "ipam-backed-dns-changes",
  },
  {
    name: "dynamo-log-report-fix",
    title: "Agent-task integrity & log validation",
    category: "AI WORKFLOWS / DATA / SECURITY",
    description: "A Terminal-Bench log-report task hardened with a digest-pinned container, removal of a leaked reference solution, and an independent verifier that recomputes metrics from the source log.",
    tags: ["Python", "Agent evaluation", "Data validation", "Supply-chain hygiene"],
    status: "Verification implementation",
    evidence: "Public task code exposes the independent verification approach.",
    limitation: "Task-specific safeguards do not establish general model safety or a complete supply-chain audit.",
    evidencePath: "README.md",
  },
  {
    name: "sre-helm-chart",
    title: "SRE deployment with Kubernetes & Helm",
    category: "SRE / CONTAINERS / DATA",
    description: "A Helm-based deployment of an Elixir Phoenix application with PostgreSQL, environment configuration, database migrations, health probes and public ingress.",
    tags: ["Kubernetes", "Helm", "Docker", "PostgreSQL", "SRE"],
    status: "Deployment reference",
    evidence: "Repository contains the chart and deployment configuration.",
    limitation: "A chart is not evidence of production availability or tested disaster recovery.",
    evidencePath: "README.md",
  },
  {
    name: "devops-mlops-reference-platform",
    title: "DevOps / MLOps reference platform",
    category: "AI WORKFLOWS / SRE / FINOPS",
    description: "A local-first workflow policy scanner and cost-report CLI with guarded provider examples, multi-cloud Terraform, Helm deployment and observability starters.",
    tags: ["AI guardrails", "Python", "Terraform", "Kubernetes", "Prometheus", "FinOps"],
    status: "Local-first reference",
    evidence: "Policy rules, unsafe examples and testable CLI contracts are documented in the repository.",
    limitation: "Checks validate declared configuration; they do not prove runtime enforcement or provider prompt-injection protection.",
    evidencePath: "README.md",
  },
];

export function projectUrl(project) {
  return `https://github.com/${portfolioOwner}/${project.name}`;
}

export function evidenceUrl(project) {
  return `${projectUrl(project)}/${project.evidencePath.endsWith(".md") ? "blob" : "tree"}/main/${project.evidencePath}`;
}
