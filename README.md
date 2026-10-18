# DrOSAlchemist

A multi-page portfolio for AI/ML infrastructure, Kubernetes, network systems and platform security. Built with the Next.js Pages Router, locally bundled typefaces, and a live public-repository view backed by GitHub's REST API.

## Routes

- `/` — systems-focused portfolio home
- `/about` — personal profile, engineering lab workbench, experiment protocol and evidence contract
- `/projects` — curated evidence cards plus automatically refreshed public GitHub repositories for `DrOSAlchemist`
- `/writing` — AI/ML, Kubernetes, security boundaries and networking field notes
- `/writing/[slug]` — statically generated articles
- `/contact` — public GitHub contact route

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Run `npm test`, `npm run lint`, `npm run build` and then `npm run test:rendered` before publishing.
Content tests use Node's built-in runner without additional test dependencies.

The projects page reads `GITHUB_USERNAME` on the server, defaulting to `DrOSAlchemist`. It lists only public, non-fork, non-archived repositories. Search matches all entered terms across names, descriptions and topics; language filtering and recent/name/star sorting run locally without additional API requests. The initial HTML includes the full fetched list, so repository links remain available without JavaScript.

The server fetches up to five 100-item GitHub pages using a shared six-second deadline, validates the response fields used by the UI, deduplicates page overlaps and sorts by push time. It requests an additional page when a page is full; exhausting the bound fails visibly rather than presenting a partial account count as complete. Concurrent upstream changes can still shift pagination; this is a public directory, not an atomic account snapshot. No GitHub token is needed or exposed to browsers.

Successful responses allow one-hour CDN caching plus stale-while-revalidate for up to one day; the actual edge cache behavior depends on the hosting adapter. Failed lookups return a visible unavailable state, log a bounded reason/status without response bodies, and use `Cache-Control: no-store` so an outage response is not cached as an empty account. Rate limits, malformed data, timeout, API errors and pagination limits are tested. There is no persistent last-good snapshot or retry loop; curated evidence and a direct profile link remain the fallback.

The home page also curates featured public repositories, including Agentic SRE
Platform's offline quota investigation demo. Its card distinguishes implemented
diagnosis, proposal and recovery controls from the planned live AWS, AI and secure
GitOps integrations. `lib/projects.js` is the shared evidence catalog used by
`components/FeaturedProjects.js` on both home and projects pages. Curated links
remain visible if GitHub's API is unavailable; live counts then say "Unavailable,"
not zero. Curated cards are editorial records, not live repository availability checks.

Every featured project includes an implementation status, inspectable evidence and
a limitation. Update these together when the underlying repository changes. The GPU
result is attributed to its dated research record (GKE T4 Spot, us-east1-d,
2026-04-05, 659 to 338 seconds); it was not independently reproduced for this site.
Articles can include named HTTPS references via `references` in `lib/articles.js`.
The SRE design note links the implementation, policy tests, security model and
agent-independent runbook.

`npm test` checks catalog identity, evidence fields, linked article existence,
benchmark scope, offline SRE boundaries and article reference contracts. These
checks are not a vulnerability audit, live deployment test or external-link monitor.
After a production build, `npm run test:rendered` starts its own loopback server on
an OS-assigned port, verifies home/projects rendering during both successful and failed
account lookups, checks article evidence, code blocks, section anchors, escaped API
content, navigation and the sitemap, and stops that server. A test-only Node preload
intercepts GitHub fetches inside that subprocess; these checks need no GitHub network
access and add no production mock mode. CI runs them after the build.

## Engineering case studies and navigation

The About page doubles as an engineering lab hub, not a browser execution
environment. `lib/labs.js` defines three bounded exercises: pinned DevSecOps
Node verification, portfolio failure-path verification and read-only GPU
measurement inspection. Each records prerequisites, execution scope, exact
commands, expected observations, a failure check, follow-up work and limitations.
The DevSecOps starter does not run the complete scanner pipeline; the GPU exercise
does not rerun a cloud benchmark. No lab command provisions cloud resources.

Use fresh clone directories and review source before execution. The DevSecOps
exercise pins the verified revision; the moving-main exercises print the checked
out revision for the reader's notebook. Their outputs are expected observations,
not a live lab-status dashboard. Keep source changes and these contracts aligned.
`tests/labs.test.js` checks the exercise schema, scoped claims and absence of
provisioning commands; production render tests verify all section targets and
exercise fields even during feed failure.

The DevSecOps case study connects the delivery contract to actual Terraform test
events, OPA mutation tests, the runtime-image remediation and a dated CI run.
Its immutable revision links distinguish historical evidence from the moving main
branch. It states that Snyk was skipped, Azure was not deployed, branch protection
is a separate administrative control and artifacts expire. Do not update a
verification claim without checking its linked revision and run.

Long field notes have a table of contents, stable per-section anchor targets and
keyboard-scrollable code examples. Add optional `code: { caption, text }` to an
article section for plain-text snippets; React escapes them rather than injecting
HTML. The primary navigation exposes projects, writing and about directly, marks
the active route and includes a keyboard skip-to-content link. Home-section links
remain available for skills and automation. Preserve the existing brand rather
than adding unsupported certifications, employment claims or performance metrics.

## Netlify

`netlify.toml` sets the production build command and Node version. Netlify detects Next.js and applies its maintained adapter automatically; this project intentionally does not pin an adapter version. To enable continuous deployment, connect this GitHub repository as a site in the Netlify dashboard and select `main` as the production branch. Netlify will build production deploys from `main` and deploy previews for pull requests. The GitHub Actions workflow independently runs content tests, lint and build checks on Ubuntu 24.04 with SHA-pinned Node 24 actions, read-only repository permissions and a job timeout.

Optionally set `GITHUB_USERNAME` in Netlify environment variables to use a different public account for the live stream. Curated links still target the owner in `lib/projects.js`; update that catalog separately if adapting this site. No deploy token or account credential belongs in the repository.

## Brand

The mark combines two crossing signal paths around a catalyst point. Colors, type, voice and usage notes are in [docs/brand-identity.md](docs/brand-identity.md). The profile image is a locally cached public GitHub avatar.
