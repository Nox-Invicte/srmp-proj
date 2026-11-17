# Credential-to-Cloud

A localhost cybersecurity research prototype for synthetic credential lifecycle, revocation assurance, and cross-layer event investigations. The current release is the Milestone 1 dashboard shell. It uses fabricated fixture data only; there are no provider connections or real credential values.

## Run the frontend

Requirements: Node.js compatible with the installed Next.js 16.4.6 version and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `Ctrl+C` to stop the development server.

## Checks

```bash
npm run lint
npm run build
```

## Current scope

- Responsive dark security operations overview and module navigation.
- Overview cards, lifecycle distribution, synthetic detections and event activity.
- Searchable credential preview with lifecycle-state filtering.
- Local-only scenario affordance, clearly identified as a prototype.

Metrics and inventory rows are fixtures for the first UI milestone. FastAPI, PostgreSQL, credential transitions, persistent experiments, and connected module pages have not been implemented yet. See [PRD_AND_CODEX_GUIDE.md](./PRD_AND_CODEX_GUIDE.md) for the staged requirements.
