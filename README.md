# DrOSAlchemist

A multi-page portfolio for AI/ML infrastructure, Kubernetes, network systems and platform security. Built with the Next.js Pages Router, locally bundled typefaces, and a live public-repository view backed by GitHub's REST API.

## Routes

- `/` — systems-focused portfolio home
- `/about` — profile, principles and areas of focus
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

The projects page reads `GITHUB_USERNAME` on the server, defaulting to `DrOSAlchemist`. It lists only public, non-fork, non-archived repositories and caches the response at the CDN for one hour. No GitHub token is needed or exposed to browsers.

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
an OS-assigned port, verifies home/projects rendering when the live account lookup
fails, checks article evidence and the sitemap, and stops that server. It requires
outbound access to the public GitHub API; a network failure follows the same
unavailable path. CI runs it after the build.

## Netlify

`netlify.toml` sets the production build command and Node version. Netlify detects Next.js and applies its maintained adapter automatically; this project intentionally does not pin an adapter version. To enable continuous deployment, connect this GitHub repository as a site in the Netlify dashboard and select `main` as the production branch. Netlify will build production deploys from `main` and deploy previews for pull requests. The GitHub Actions workflow independently runs content tests, lint and build checks on Ubuntu 24.04 with SHA-pinned Node 24 actions, read-only repository permissions and a job timeout.

Optionally set `GITHUB_USERNAME` in Netlify environment variables to use a different public account for the live stream. Curated links still target the owner in `lib/projects.js`; update that catalog separately if adapting this site. No deploy token or account credential belongs in the repository.

## Brand

The mark combines two crossing signal paths around a catalyst point. Colors, type, voice and usage notes are in [docs/brand-identity.md](docs/brand-identity.md). The profile image is a locally cached public GitHub avatar.
