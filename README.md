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

## Presentation dataset

The credential fixtures include five initial examples and 50 additional SecretBench-inspired examples for demonstrating secret-finding triage, true-secret versus false-positive labels, file types, and credential lifecycle context. All 55 are fabricated presentation records, not rows imported from SecretBench; they contain no secret values and must not be presented as benchmark measurements. The 50 new demo rows use a fixed 8/42 label split for illustrative variety, not to reproduce SecretBench prevalence. SecretBench itself is a 2023 benchmark of 97,479 labeled candidate findings from 818 GitHub repositories, including 15,084 findings labeled as true secrets. See the [SecretBench project and dataset details](https://github.com/setu1421/SecretBench).

SecretBench is useful for the project's secret-detection and triage examples. It does not provide the identity, session, workflow, cloud-event, or revocation-check history needed to evaluate the broader Credential-to-Cloud research questions, so those still require separate synthetic scenarios or a suitably licensed identity/event dataset.
