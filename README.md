# DrOSAlchemist

A multi-page portfolio for AI/ML infrastructure, Kubernetes, network systems and platform security. Built with the Next.js Pages Router, locally bundled typefaces, and a live public-repository view backed by GitHub's REST API.

## Routes

- `/` — systems-focused portfolio home
- `/about` — profile, principles and areas of focus
- `/projects` — automatically refreshed public GitHub repositories for `DrOSAlchemist`
- `/writing` — AI/ML, Kubernetes and networking field notes
- `/writing/[slug]` — statically generated articles
- `/contact` — public GitHub contact route

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Run `npm run lint` and `npm run build` before publishing.

The projects page reads `GITHUB_USERNAME` on the server, defaulting to `DrOSAlchemist`. It lists only public, non-fork, non-archived repositories and caches the response at the CDN for one hour. No GitHub token is needed or exposed to browsers.

## Netlify

`netlify.toml` sets the production build command and Node version. Netlify detects Next.js and applies its maintained adapter automatically; this project intentionally does not pin an adapter version. To enable continuous deployment, connect this GitHub repository as a site in the Netlify dashboard and select `main` as the production branch. Netlify will build production deploys from `main` and deploy previews for pull requests. The GitHub Actions workflow independently runs lint and build checks.

Optionally set `GITHUB_USERNAME` in Netlify environment variables to use a different public account. No deploy token or account credential belongs in the repository.

## Brand

The mark combines two crossing signal paths around a catalyst point. Colors, type, voice and usage notes are in [docs/brand-identity.md](docs/brand-identity.md). The profile image is a locally cached public GitHub avatar.
