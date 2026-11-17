# Credential-to-Cloud
## Product Requirements Document (PRD) and VS Code Codex Instructions

**Version:** 1.0  
**Date:** 16 November 2026  
**Project:** Credential-to-Cloud  
**Repository:** https://github.com/Nox-Invicte/srmp-proj  
**Purpose:** Localhost cybersecurity research prototype  
**Stack:** Next.js (JavaScript) + FastAPI (Python) + PostgreSQL  
**Data policy:** Synthetic credentials and synthetic telemetry only

---

## 1. Executive summary

Credential-to-Cloud is a cybersecurity research prototype for studying how developer and automation credentials can be abused across developer environments, source-code repositories, CI/CD pipelines, identity federation, and cloud infrastructure.

The prototype focuses on three connected research areas:

1. **Credential lifecycle-aware detection:** determine whether incorporating credential lifecycle state, version, ownership, and revocation context improves detection compared with conventional event-only rules.
2. **Cross-environment credential revocation assurance:** distinguish an administrative status change from evidence that configured downstream test services no longer accept a credential.
3. **Cross-layer attack-chain reconstruction:** correlate endpoint, repository, CI/CD, identity, and cloud events using explicit identity and provenance relationships, rather than treating timestamp proximity as proof of causality.

The first deliverable is a local application with a professional security operations dashboard, synthetic credential inventory, lifecycle tracking, revocation simulation, event ingestion, explainable detections, scenario simulation, and investigation timelines.

The application must run on localhost. Docker and cloud deployment are optional and are not prerequisites.

## 2. Product vision and problem statement

A developer credential may remain usable in a downstream service, cached session, or dependent access path after an operator believes it has been rotated or revoked. A technically valid authentication or cloud API event can also be suspicious when interpreted in context—for example, when an old credential version is used after rotation, an unassigned owner is active, or a credential is marked as suspected compromised.

At the same time, security telemetry is distributed across endpoints, repositories, CI/CD systems, identity providers, and cloud audit sources. Normalizing these records does not by itself prove that events belong to one causal attack chain.

Credential-to-Cloud provides a controlled, reproducible environment to model these problems and evaluate potential improvements.

### 2.1 Research questions

- **RQ1 — Revocation assurance:** Can downstream acceptance checks identify residual usable access paths that a primary-provider or inventory status check does not establish?
- **RQ2 — Lifecycle-aware detection:** Does incorporating credential lifecycle context improve detection precision, recall, F1-score, false-positive rate, or detection latency compared with conventional event-only detection?
- **RQ3 — Cross-layer attribution:** Do explicit credential, identity, session, workflow, and provenance relationships improve attack-chain reconstruction compared with timestamp-only and simpler identity-based correlation?

These are questions to investigate, not claims that existing security products or standards lack these capabilities.

## 3. Goals

- Build a localhost research application with a coherent, professional cybersecurity dashboard.
- Maintain a synthetic credential inventory with owner, provider, environment, versions, lifecycle state, and risk attributes.
- Implement a validated credential lifecycle state machine.
- Preserve lifecycle history as audit evidence.
- Simulate credential rotation and revocation without contacting real providers.
- Verify credential invalidity only through configured synthetic downstream service acceptance checks.
- Ingest and normalize synthetic endpoint, repository, CI/CD, identity, and cloud events.
- Implement event-only and lifecycle-aware detection baselines.
- Produce explainable alerts and configurable risk scores.
- Correlate events using explicit identifiers and provenance.
- Reconstruct attack timelines and show missing telemetry.
- Evaluate results against deterministic scenario ground truth.
- Keep the setup simple enough to run locally on a student development machine.

## 4. Non-goals

The initial prototype is not intended to:

- Store or manage real API keys, access tokens, passwords, or private keys.
- Connect to real GitHub, AWS, Azure, GCP, npm, or endpoint accounts.
- Perform real credential revocation or cloud IAM changes.
- Execute malware, malicious packages, credential theft, persistence, or exploitation.
- Replace a production SIEM, SOAR, EDR, secrets manager, or identity governance platform.
- Guarantee detection of all attacks or universal credential revocation.
- Provide production multi-tenancy, high availability, enterprise SSO, or billing.
- Require Kubernetes, Redis, Docker, or cloud hosting for the first release.

## 5. Users and workflows

### 5.1 Researcher / administrator

Creates synthetic credentials, configures scenarios, runs experiments, reviews lifecycle history, inspects detections, and exports evidence.

### 5.2 Analyst / investigator

Searches events and alerts, reviews detection explanations, examines revocation evidence, and reconstructs event timelines.

The first version may use a single local administrator experience. Do not expose the application publicly without adding suitable authentication, authorization, and deployment security.

### 5.3 Primary workflows

**Credential posture**
1. Open Overview.
2. Review credential counts, active credentials, high-risk credentials, and open detections.
3. Search and filter the inventory.
4. Open a credential to inspect versions, risk attributes, and lifecycle history.

**Rotation and revocation assurance**
1. Select a synthetic credential.
2. Create a new version and move the old version through the appropriate rotation/grace-period state.
3. Initiate simulated revocation.
4. Run checks against configured synthetic downstream services.
5. Review service-by-service results and evidence.
6. Mark a version Verified Invalid only when the required checks support that conclusion.

**Detection experiment**
1. Select a deterministic scenario.
2. Generate synthetic events with a unique experiment ID.
3. Run event-only baseline detection.
4. Run lifecycle-aware detection.
5. Compare alerts and evaluation metrics.
6. Inspect alert explanations and contributing events.

**Attack-chain investigation**
1. Open an alert or experiment.
2. Follow credential, actor, session, repository, workflow, role, and experiment references.
3. Inspect the event timeline.
4. Review explicit and heuristic links separately.
5. Export findings with evidence, uncertainty, and missing telemetry.

## 6. Functional requirements

Priority:
- **P0:** required for the first usable prototype.
- **P1:** required for research evaluation.
- **P2:** future enhancement.

### 6.1 Dashboard and navigation

**P0**
- Dark, responsive SOC-style application shell.
- Persistent sidebar navigation and top header.
- Overview metrics: total credentials, active credentials, high-risk credentials, open detections.
- Lifecycle distribution.
- Recent detections and recent security events.
- Credential inventory preview.
- Clear banner identifying the app as a local research prototype using synthetic data.
- Useful loading, empty, error, and success states.

**P1**
- Date, provider, and environment filters.
- Metrics computed from backend data rather than hardcoded values.
- Links from summary cards to filtered module views.

### 6.2 Credential inventory

**P0**
- List credentials with ID, name, provider, type, owner, environment, lifecycle state, risk attributes, created time, expiry, and last-used time.
- Search by name, ID, owner, and provider.
- Filter by state, environment, and provider.
- Credential detail page with versions and lifecycle history.
- Create and edit synthetic metadata.
- Never store actual credential values.

**P1**
- Metadata-only import/export.
- Ownership and expiry review indicators.
- Credential dependency relationships.

### 6.3 Credential lifecycle engine

Lifecycle states:

- Provisioned
- Active
- Rotation Pending
- Grace Period
- Revocation Pending
- Revoked
- Verified Invalid

Risk attributes are separate and may coexist with lifecycle state:

- Suspected Compromised
- Orphaned
- High Privilege
- Expired / Past Expiry

For example, a credential may be Active and Suspected Compromised at the same time. Do not force these orthogonal risk attributes into the lifecycle enum.

**P0**
- Central backend state machine with allowed-transition validation.
- Append-only lifecycle event history.
- Each transition records actor, timestamp, reason, source, and experiment ID when applicable.
- Invalid transitions return a useful error.
- Credential versions are separate from the parent credential.
- UI displays lifecycle history.

Suggested initial transitions:

| From | Allowed next state |
|---|---|
| Provisioned | Active, Revocation Pending |
| Active | Rotation Pending, Revocation Pending, Expired |
| Rotation Pending | Grace Period, Active, Revocation Pending |
| Grace Period | Revocation Pending, Active |
| Revocation Pending | Revoked, Active only with documented cancellation |
| Revoked | Verified Invalid after sufficient verification evidence |
| Verified Invalid | No reactivation; create a new credential version |

Implement transitions centrally and test them. This is an initial domain policy and may be refined with documented rationale.

### 6.4 Revocation assurance

**P0**
- Model synthetic downstream test services associated with a credential version.
- Simulate revocation and downstream acceptance checks.
- Persist service, credential version, check time, method, result, and evidence.
- Supported outcomes:
  - Verified Invalid
  - Still Accepted
  - Verification Failed
  - Not Supported
  - Pending
- Show evidence per service and aggregate status.
- Do not infer Verified Invalid solely because an inventory record says Revoked.
- Clearly state that verification covers only configured test services.

**P1**
- Retry and time-bound verification.
- Downstream service coverage percentage.
- Residual acceptance and time-to-invalidation reports.

### 6.5 Security event ingestion

**P0**
- Accept synthetic events through API and scenario generator.
- Validate and normalize event schemas.
- Preserve source metadata.
- Use UTC timestamps internally.
- Assign unique event IDs.
- Associate every scenario event with an experiment ID.

Minimum event fields:

- `event_id`
- `timestamp`
- `source_layer` (endpoint, repository, CI/CD, identity, cloud, registry, application)
- `source_product`
- `event_type`
- `action`
- `actor_id`
- `credential_id` (nullable)
- `credential_version_id` (nullable)
- `session_id` (nullable)
- `repository_id` (nullable)
- `workflow_id` / `execution_id` (nullable)
- `cloud_role_id` (nullable)
- `resource_id` (nullable)
- `source_address` (synthetic/anonymized)
- `outcome`
- `experiment_id`
- `raw_metadata` (sanitized JSON)

Unknown values remain null or unknown. Do not invent identifiers to force correlation.

### 6.6 Threat detection

**P0**
- Conventional event-only baseline.
- Lifecycle-aware rules using credential state, version, owner, and risk attributes.
- Alerts contain severity, confidence, status, explanation, rule ID, related event IDs, credential reference, and timestamps.
- Every alert has a human-readable explanation.
- Rules are deterministic and unit-testable.

Initial rules:
1. Use of a credential marked Suspected Compromised.
2. Use of an old credential version after rotation/grace-period closure.
3. Use of a credential in Revocation Pending, Revoked, or Verified Invalid state.
4. Activity associated with an Orphaned credential owner.
5. Sensitive cloud action following a suspicious CI/CD event.
6. Unusual cross-layer sequence supported by the scenario ground truth.
7. Excessive privilege or sensitive resource access when explicitly represented in synthetic event data.

Do not infer malicious intent from one weak signal. Keep severity and confidence distinct.

### 6.7 Explainable risk scoring

Initial weights are hypotheses to evaluate, not validated constants:

| Dimension | Initial weight |
|---|---:|
| Credential lifecycle context | 30% |
| Event sensitivity | 25% |
| Sequence context | 20% |
| Identity / ownership context | 15% |
| Revocation verification context | 10% |

Normalize each dimension to 0–100 and calculate a documented weighted score. Missing information must not silently become zero risk; represent missingness and explain its effect.

Initial bands:

- 0–29: Low
- 30–59: Medium
- 60–79: High
- 80–100: Critical

Make weights and thresholds configurable. Persist score components and explanations to support reproducibility.

### 6.8 Cross-layer correlation and attack-chain reconstruction

**P0**
- Correlate using explicit identifiers where available: credential ID/version, actor ID, session ID, repository ID, workflow/execution ID, cloud role ID, resource ID, and experiment ID.
- Timestamp windows may support a heuristic but must never be presented as proof of causality.
- Every relationship records link method, confidence, and evidence.
- Render an ordered investigation timeline.
- Show missing expected stages where scenario ground truth is available.

**P1**
- Compare timestamp-only, identity-based, and explicit-provenance correlation.
- Report link precision/recall and reconstruction completeness.

### 6.9 Scenario simulator

Provide six deterministic scenarios:

1. **Normal developer activity:** expected developer, repository, CI, and cloud events.
2. **Credential rotation:** new version provisioned, old version enters grace period, and invalidation checks occur.
3. **Residual credential usage:** old version is used after rotation or revocation begins.
4. **Suspected credential compromise:** credential risk attribute is set and later use is generated.
5. **Developer-to-cloud attack simulation:** synthetic package/install warning, repository identity use, CI workflow, federated role assumption, cloud enumeration, and resource access.
6. **Orphaned credential abuse:** activity associated with an unassigned synthetic owner.

No malware or real package execution is permitted.

**P0**
- Local event generation only.
- Reproducible seed and unique experiment ID per run.
- Scenario description, expected stages, generated events, and ground truth.
- Reset/clear demo data with confirmation.

### 6.10 Investigations and reporting

**P0**
- Alert detail with severity, confidence, explanation, score components, and related events.
- Timeline ordered by event timestamp.
- Relationship evidence and link method.
- Visible uncertainty and missing telemetry.
- JSON or CSV export of synthetic experiment evidence.

**P1**
- Markdown investigation report.
- Experiment comparison report.

## 7. Screens and information architecture

1. **Overview** — posture metrics, lifecycle distribution, detections, events, revocation summary.
2. **Credentials** — searchable inventory and credential detail.
3. **Lifecycle** — state transitions, version history, risk attributes.
4. **Revocation Checks** — downstream services, check results, evidence, aggregate assurance.
5. **Event Monitor** — normalized event stream, filters, event detail.
6. **Threat Detections** — alert list, severity/confidence filters, explanations.
7. **Investigations** — relationships, evidence, timeline, missing stages.
8. **Attack Chains** — scenario-level chain visualization and reconstruction status.
9. **Scenarios** — run, inspect, compare, and reset deterministic scenarios.
10. **Reports** — export experiment and investigation findings.
11. **Settings** — local configuration, rule thresholds, scoring weights.

Use a shared design system. Provide keyboard focus, semantic HTML, accessible labels, readable contrast, and responsive layouts.

## 8. Technical architecture

### 8.1 Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js 16, React, JavaScript | Dashboard and user interaction |
| Styling | Tailwind CSS 4 | Layout and visual system |
| Backend | Python + FastAPI | Domain logic and REST API |
| Database | PostgreSQL | Persistent prototype data |
| ORM/migrations | SQLAlchemy + Alembic (recommended) | Persistence and schema evolution |
| Validation | Pydantic | API validation |
| Charts | Recharts or compatible React chart library | Metrics and distributions |
| Tests | ESLint, Next build, pytest | Quality checks |

Do not require Docker, cloud hosting, Redis, or external telemetry integrations in the first release.

### 8.2 Boundaries

- Next.js owns UI rendering, navigation, and frontend interactions.
- FastAPI owns lifecycle transitions, revocation logic, event normalization, detection, scoring, correlation, and reporting.
- PostgreSQL is the system of record.
- The browser must not implement authoritative lifecycle or risk decisions.
- Frontend calls FastAPI over HTTP/JSON.
- Keep domain logic out of React components and Next.js route handlers.
- Keep domain services independently unit-testable.
- Preserve event evidence and lifecycle history; avoid destructive audit updates.

### 8.3 Suggested repository structure

Adapt this to the existing repository. Do not replace its current configuration without inspecting it.

```text
srmp-proj/
├── AGENTS.md
├── README.md
├── PRD_AND_CODEX_GUIDE.md
├── package.json
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── credentials/
│   │   │   ├── lifecycle/
│   │   │   ├── revocation/
│   │   │   ├── events/
│   │   │   ├── detections/
│   │   │   ├── investigations/
│   │   │   ├── attack-chains/
│   │   │   ├── scenarios/
│   │   │   └── reports/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── credentials/
│   │   ├── events/
│   │   └── ui/
│   ├── lib/
│   │   ├── api.js
│   │   └── formatters.js
│   └── hooks/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── credential_service.py
│   │   │   ├── lifecycle_engine.py
│   │   │   ├── revocation_engine.py
│   │   │   ├── event_service.py
│   │   │   ├── detection_engine.py
│   │   │   ├── risk_engine.py
│   │   │   └── correlation_engine.py
│   │   ├── simulators/
│   │   └── seed/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── database/
│   └── seed.sql
├── datasets/
│   ├── scenarios/
│   └── generated/
└── docs/
    ├── architecture.md
    ├── data-dictionary.md
    └── research-methodology.md
```

### 8.4 Local ports

- Next.js: `http://localhost:3000`
- FastAPI: `http://localhost:8000`
- FastAPI docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

Use `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` for the frontend API base URL. Never put secrets in `NEXT_PUBLIC_*` variables.

## 9. Data model

Use UUID primary keys where appropriate, UTC timestamps, foreign keys, indexes for common filters, and explicit nullable fields. Use migrations for schema changes.

### 9.1 Core entities

**Credential**
- id, name, provider, credential_type
- owner_id / owner_name
- environment
- lifecycle_state
- risk_attributes
- created_at, expires_at, last_used_at
- description

**CredentialVersion**
- id, credential_id, version_label
- lifecycle_state
- created_at, activated_at, revoked_at, verified_invalid_at
- supersedes_version_id
- non-secret metadata

**LifecycleEvent**
- id, credential_id, credential_version_id
- from_state, to_state
- actor, reason, source, occurred_at
- experiment_id, metadata

**Service**
- id, name, service_type
- supported_check_method, enabled
- synthetic/non-secret configuration

**RevocationCheck**
- id, credential_version_id, service_id
- result, checked_at, method
- evidence_summary, error_detail, experiment_id

**SecurityEvent**
- id, timestamp, source_layer, source_product
- event_type, action, actor_id
- credential_id, credential_version_id
- session_id, repository_id, workflow_id
- cloud_role_id, resource_id, source_address
- outcome, experiment_id, sanitized raw_metadata

**DetectionRule**
- id, name, description, enabled
- rule_type, severity, configuration

**Alert**
- id, rule_id, title, severity, confidence, status
- risk_score, score_components, explanation
- credential_id, experiment_id
- created_at, acknowledged_at, resolved_at

**AlertEvent**
- alert_id, event_id, relationship, evidence

**AttackChain**
- id, name, scenario_type, experiment_id
- ground_truth, reconstruction_status, created_at

**AttackChainEvent**
- attack_chain_id, event_id, sequence_index, stage
- link_method, link_confidence, evidence

**Experiment**
- id, scenario_name, seed
- started_at, completed_at
- configuration, ground_truth, notes

### 9.2 Data integrity

- Use foreign keys for known relationships.
- Do not invent missing identities or links.
- Keep event and lifecycle history append-only where practical.
- Store scenario seed and configuration.
- Associate generated events with an experiment.
- Sanitize metadata and prohibit real secrets.

## 10. Initial API contract

Use versioned endpoints under `/api/v1`. Return consistent JSON errors with stable error codes and useful messages.

### Health
- `GET /api/v1/health` — service and database health.

### Credentials
- `GET /api/v1/credentials` — list, search, filter.
- `POST /api/v1/credentials` — create synthetic metadata.
- `GET /api/v1/credentials/{credential_id}` — detail, versions, history.
- `PATCH /api/v1/credentials/{credential_id}` — update permitted metadata only.

### Lifecycle
- `POST /api/v1/credentials/{credential_id}/transitions` — validated transition.
- `GET /api/v1/credentials/{credential_id}/lifecycle` — history.
- `POST /api/v1/credentials/{credential_id}/versions` — create synthetic version.

### Revocation
- `GET /api/v1/revocation/checks` — list checks.
- `POST /api/v1/revocation/checks/run` — synthetic downstream checks.
- `GET /api/v1/revocation/credentials/{credential_id}` — aggregate evidence.

### Events and detections
- `GET /api/v1/events` — query normalized events.
- `POST /api/v1/events` — ingest synthetic event batch.
- `GET /api/v1/alerts` — list alerts.
- `GET /api/v1/alerts/{alert_id}` — alert detail and evidence.
- `POST /api/v1/detections/run` — evaluate selected events or experiment.

### Scenarios and investigations
- `GET /api/v1/scenarios` — list scenarios.
- `POST /api/v1/scenarios/{scenario_name}/run` — run deterministic experiment.
- `GET /api/v1/experiments/{experiment_id}` — experiment summary.
- `GET /api/v1/experiments/{experiment_id}/attack-chain` — reconstructed chain.
- `GET /api/v1/experiments/{experiment_id}/metrics` — evaluation metrics.

Only implement endpoints when their underlying behavior exists. Do not return mock success responses that imply an operation was performed when it was not.

## 11. Synthetic scenarios

All sample names, identifiers, addresses, and data must be fabricated. Never use real tokens or secrets.

Every scenario defines:
- Purpose and name
- Initial credential inventory
- Initial lifecycle states and risk attributes
- Ordered ground-truth stages
- Generated events
- Expected detections
- Expected relationships
- Expected missing-data behavior
- Random seed / reproducibility controls

### 11.1 Developer-to-cloud scenario

A safe synthetic sequence may contain:
1. Synthetic package installation warning on a developer workstation.
2. Synthetic repository access by a developer identity.
3. Synthetic CI workflow execution.
4. Synthetic OIDC federation event for a test role.
5. Synthetic cloud identity lookup.
6. Synthetic object-storage enumeration.
7. Synthetic sensitive-resource access event.

These are generated records only. Do not install malicious packages, steal tokens, assume real cloud roles, or access real resources.

## 12. Research methodology and evaluation

### 12.1 Baselines

1. **Event-only baseline:** event fields and event sequence, without credential lifecycle state.
2. **Lifecycle-aware detector:** same event stream enriched with lifecycle state, version, owner, and revocation context.
3. **Timestamp-only correlation:** candidate links primarily based on temporal proximity.
4. **Identity-based correlation:** links using actor, credential, or session identifiers.
5. **Explicit-provenance correlation:** links using credential version, workflow execution, session, role, resource, and experiment references with recorded evidence.

### 12.2 Detection metrics

- Precision
- Recall
- F1-score
- False-positive rate
- False-negative rate
- Detection latency
- Alert volume per experiment
- Severity prioritization quality

Define event-level ground truth and explain how TP, FP, TN, and FN are counted.

### 12.3 Revocation metrics

- Check outcome accuracy against synthetic service ground truth
- Residual acceptance detection rate
- False verified-invalid rate (must be zero in valid tests)
- Verification latency
- Downstream service coverage
- Inconclusive / unsupported check rate

### 12.4 Reconstruction metrics

- Event-link precision and recall
- Attack-chain stage coverage
- Correct ordering rate
- Attribution accuracy
- Missing-stage detection
- Investigation time, if measured with a repeatable protocol

### 12.5 Experimental controls

- Use deterministic seeds.
- Keep tuning and evaluation scenarios separate if tuning is introduced.
- Document rules, weights, thresholds, and dataset versions.
- Run repeated trials when randomness is used.
- Report synthetic-data bias and limitations.
- Do not claim real-world effectiveness from synthetic experiments alone.

## 13. Safety and security requirements

1. Synthetic data only by default.
2. Never request, store, log, or commit real credentials, access tokens, private keys, or passwords.
3. Ignore `.env`, local database files, generated secrets, virtual environments, and caches.
4. Provide `.env.example` files with placeholders only.
5. No live provider calls or production integrations in the initial prototype.
6. No malware, exploit code, credential harvesting, persistence, or unauthorized access workflows.
7. Bind local services to localhost during development unless explicitly configured otherwise.
8. Do not expose debug endpoints or permissive CORS to public networks.
9. Validate and sanitize event metadata.
10. Do not leak sensitive values in logs or errors.
11. Mark simulated results in UI and exports.
12. An inventory status is not proof of technical invalidity; only configured test evidence can support Verified Invalid.

## 14. Non-functional requirements

- **Maintainability:** separate UI, API, domain logic, persistence, and scenario generation.
- **Reproducibility:** deterministic scenarios and documented seeds.
- **Explainability:** every alert has rule, reason, evidence, and score components.
- **Auditability:** lifecycle transitions and revocation checks retain history.
- **Usability:** clear navigation, feedback, empty states, and responsive layouts.
- **Accessibility:** keyboard navigation, visible focus, semantic HTML, sufficient contrast.
- **Performance:** comfortably support thousands of synthetic events on a typical student laptop.
- **Reliability:** invalid transitions and malformed events fail safely.
- **Portability:** document local setup for Windows, macOS, and Linux where practical.

## 15. Milestones and implementation order

Build coherent vertical slices. Do not create disconnected mock screens for every module.

### Milestone 0 — Repository and developer experience
- Inspect repository, `AGENTS.md`, package scripts, and installed versions.
- Preserve the existing Next.js scaffold and configuration.
- Add backend skeleton and project documentation.
- Add safe ignore rules and environment examples.
- Document local setup.

**Acceptance:** instructions are followed; frontend and backend can start locally; no secrets are committed.

### Milestone 1 — Frontend shell and dashboard
- Shared sidebar, header, responsive layout, typography, and color tokens.
- Overview page and navigation to module placeholders.
- Synthetic fixtures isolated from UI components.
- Loading, empty, and error states.

**Acceptance:** lint and production build pass; dashboard renders at localhost:3000; no normal-use console errors.

### Milestone 2 — FastAPI and PostgreSQL foundation
- FastAPI health endpoint.
- Database connection and migrations.
- Credential and credential-version models.
- Synthetic seed records.
- Frontend API client and credential list/detail.

**Acceptance:** frontend displays database-backed credentials; backend tests pass; seeding is repeatable.

### Milestone 3 — Lifecycle engine
- State machine and transition validation.
- Append-only lifecycle history.
- UI transition workflow and history.

**Acceptance:** valid transitions persist; invalid transitions return errors; tests cover allowed and rejected transitions.

### Milestone 4 — Revocation assurance simulator
- Synthetic downstream service adapters.
- Check result persistence and evidence.
- Aggregate outcome rules.
- Revocation UI.

**Acceptance:** status updates alone cannot produce Verified Invalid; test-service checks determine evidence outcomes; residual acceptance and inconclusive results are visible.

### Milestone 5 — Event ingestion and scenario generator
- Normalized event schema and API.
- Deterministic scenario definitions and seeds.
- Event monitor and experiment detail.

**Acceptance:** scenarios produce reproducible event sets with experiment IDs and ground truth.

### Milestone 6 — Detection and risk engine
- Event-only baseline.
- Lifecycle-aware rules.
- Configurable scoring and explanations.
- Alert list and detail.

**Acceptance:** tests prove lifecycle context changes expected cases; alerts reference evidence; metrics calculate against scenario labels.

### Milestone 7 — Correlation and investigations
- Explicit event relationship model.
- Baseline correlation modes.
- Attack-chain timeline and missing-stage display.

**Acceptance:** links carry method and evidence; timestamp proximity alone is never presented as proven causality.

### Milestone 8 — Evaluation, reports, and polish
- Experiment metrics and comparison view.
- JSON/CSV/Markdown export.
- Documentation, accessibility, responsive review, and test coverage.

**Acceptance:** a complete scenario can be run, detected, investigated, compared with baselines, and exported.

## 16. Definition of done

A feature is complete only when:
- It satisfies a requirement in this document.
- Domain logic is not embedded solely in UI code.
- Inputs are validated and errors handled.
- Tests cover normal, boundary, and failure cases.
- UI displays API state or clearly labeled fixture data.
- No secrets or live-provider calls are introduced.
- Relevant docs and API schemas are updated.
- Lint, build, and relevant tests pass.
- The implementation summary lists files changed, commands run, results, and known limitations.

## 17. Local setup

### 17.1 Prerequisites

- Node.js LTS compatible with the installed Next.js version.
- npm.
- Python 3.11+ recommended.
- PostgreSQL installed and running locally.

Docker is optional.

### 17.2 Frontend

From repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Checks:

```bash
npm run lint
npm run build
```

### 17.3 Backend (once implemented)

**Windows PowerShell**

```powershell
py -3 -m venv backend/.venv
backend/.venv/Scripts/Activate.ps1
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend
```

**macOS / Linux**

```bash
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
uvicorn app.main:app --reload --app-dir backend
```

Open `http://localhost:8000/docs`.

### 17.4 Database

Create a local PostgreSQL database named `credential_to_cloud`. Configure the connection string in an ignored local `backend/.env` file using `backend/.env.example` as a template. Never commit the populated file.

Document exact migration and seed commands when the database layer is implemented.

## 18. VS Code Codex implementation instructions

This section is the working contract for Codex in VS Code.

### 18.1 First actions

1. Read this entire document.
2. Read `AGENTS.md` and all repository-specific instructions.
3. Inspect the repository tree, package.json, lockfile, Next.js configuration, existing app files, and `git status`.
4. The repository currently uses Next.js `16.4.6` and React `19.3.0` (verify current installed versions before relying on this statement).
5. The repository's `AGENTS.md` says this Next.js version has breaking changes and requires reading relevant documentation from the installed package under `node_modules/next/dist/docs/` before writing code. Follow this instruction. Do not assume older Next.js APIs or conventions.
6. Summarize the current state and propose the smallest next implementation slice before broad changes.

### 18.2 Coding rules

- Use JavaScript, not TypeScript, unless the project owner explicitly changes this requirement.
- Use Next.js App Router and conventions supported by the installed version.
- Keep components small and focused.
- Keep domain logic in FastAPI services, not React components.
- Use semantic HTML and accessible controls.
- Prefer existing dependencies; justify new dependencies.
- Do not add Docker as a requirement.
- Do not introduce cloud deployment or live integrations.
- Do not hardcode dashboard metrics after API integration exists.
- Use clearly synthetic fixture data; never create real-looking usable secrets.
- Prefer metadata-only credential records and never store secret values.
- Keep fixtures in dedicated modules.
- Use environment variables for local configuration and provide placeholder example files.
- Preserve existing files and user changes. Inspect before modifying or deleting.
- Avoid unrelated refactors.
- Keep API contracts and data models documented.
- Use migrations for database schema changes.
- Add tests alongside domain behavior.

### 18.3 Incremental work loop

For every task:

1. State the milestone and acceptance criteria being addressed.
2. Inspect relevant files and version-specific documentation.
3. Implement one coherent vertical slice.
4. Run focused tests.
5. Run `npm run lint` and `npm run build` for frontend changes.
6. Run `pytest` for backend changes.
7. Review the diff for accidental changes, secrets, and generated artifacts.
8. Update documentation when behavior or setup changes.
9. Report exactly what changed, what was tested, results, and remaining work.

Never claim a test passed unless it was actually run and the result observed. If a dependency, database, or service is unavailable, say so and provide the exact command needed.

### 18.4 Git workflow

- Work on a feature branch; do not commit directly to `main` unless explicitly requested.
- Make small descriptive commits when requested.
- Never force-push or rewrite history without explicit permission.
- Do not merge pull requests without approval.
- Inspect `git status` before modifying files.
- Never stage local secrets, databases, virtual environments, build output, or dependency directories.

Suggested branches:
- `feature/dashboard-shell`
- `feature/credential-inventory`
- `feature/lifecycle-engine`
- `feature/revocation-assurance`
- `feature/event-ingestion`
- `feature/lifecycle-detection`
- `feature/attack-correlation`

### 18.5 Initial Codex prompt

After reading this document and repository instructions, start with Milestone 0 and Milestone 1 only. Inspect the current repository and the installed Next.js documentation for the installed version before editing. Preserve the existing scaffold and user changes. Build a polished, responsive dark SOC-style dashboard for Credential-to-Cloud using JavaScript and the installed Tailwind version. Use clearly labeled synthetic fixture data, not live provider data. Include the navigation and Overview experience described in this PRD, and scaffold other module routes only as useful placeholders. Do not implement the FastAPI detection engine yet. Run lint and production build, fix issues, and report changed files and test results. Do not proceed to later milestones without reviewing the first slice.

### 18.6 Follow-up Codex prompts

- "Implement the credential inventory UI and API contract from the PRD. Keep data synthetic and add tests."
- "Implement the FastAPI health endpoint, PostgreSQL connection, migrations, and credential read APIs."
- "Implement the credential lifecycle state machine with transition validation and comprehensive unit tests."
- "Implement revocation assurance using synthetic downstream services. Verified Invalid must require successful acceptance checks."
- "Implement deterministic scenario generation with experiment IDs and ground truth."
- "Implement event-only and lifecycle-aware detection as separate comparable modes."
- "Implement explainable risk scoring with configurable weights and tests."
- "Implement explicit-provenance event correlation and compare it with timestamp-only correlation."
- "Implement experiment evaluation metrics and an investigation report."

## 19. Initial acceptance checklist

### First runnable milestone
- [ ] Repository and Next.js-specific instructions inspected.
- [ ] Existing app scaffold preserved.
- [ ] Responsive dark dashboard shell implemented.
- [ ] Overview metrics use clearly identified synthetic fixtures.
- [ ] Navigation links to planned modules.
- [ ] Credential inventory supports search and lifecycle filtering.
- [ ] Scenario simulation is local-only and visibly labeled.
- [ ] No real credentials or provider integrations.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] README includes local run instructions.

### Research prototype completion
- [ ] FastAPI and PostgreSQL operate locally.
- [ ] Credential lifecycle transitions are validated and audited.
- [ ] Revocation assurance stores downstream evidence.
- [ ] Event ingestion validates normalized schemas.
- [ ] Six deterministic synthetic scenarios are available.
- [ ] Event-only and lifecycle-aware detectors can be compared.
- [ ] Risk scores are explainable and configurable.
- [ ] Correlation modes are evaluated against ground truth.
- [ ] Investigation timeline shows link evidence and uncertainty.
- [ ] Metrics and reports are exportable.
- [ ] Tests and limitations are documented.

---

**End of document.**  
This PRD is the source of truth for the initial Credential-to-Cloud localhost research prototype. Update it when requirements change, and record the reason rather than silently diverging from it.
