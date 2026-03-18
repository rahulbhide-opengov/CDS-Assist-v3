# Infrastructure & Tooling

Quick reference for Docker, Kubernetes, CI, and testing setup.

## Prerequisites

- **Docker / K8s**: For Dockerfile and ee-deploy to work, the project must have `npm run build` (React Vite app). Add to `package.json` if missing.
- **GitHub Pages**: Enable Pages in repo Settings → Pages → Source: GitHub Actions.
- **Storybook**: `npm i -D @storybook/react-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-interactions @mui/material @emotion/react @emotion/styled`
- **Playwright**: `npm i -D @playwright/test && npx playwright install`
- **Vitest + React**: `npm i -D @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom`

## File Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build → nginx serve on 8080 |
| `nginx/default.conf` | SPA routing, gzip, asset caching |
| `devspace.yaml` | DevSpace config for ephemeral K8s |
| `ee-deploy/*` | K8s Deployment, Service, Ingress |
| `.github/workflows/*` | GH Pages deploy, Docker build to GHCR |
| `.storybook/*` | Storybook 9 + CDS theme |
| `vitest.config.ts` | Unit tests, jsdom, coverage |
| `playwright.config.ts` | E2E tests, chromium/firefox/webkit |
