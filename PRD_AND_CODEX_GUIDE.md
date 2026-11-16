# Credential-to-Cloud
## Product Requirements Document & Codex Implementation Guide

**Document status:** Initial product specification  
**Version:** 1.0  
**Date:** 16 November 2026  
**Product type:** Localhost cybersecurity research prototype  
**Repository:** https://github.com/Nox-Invicte/srmp-proj  
**Primary implementation:** Next.js (JavaScript) + FastAPI (Python) + PostgreSQL  
**Operating mode:** Local development; synthetic data only

---

## 1. Executive summary

Credential-to-Cloud is a research prototype for studying how developer and automation credentials move through a software delivery environment and how credential lifecycle context can improve detection and investigation of suspicious access.

The system models a controlled developer-to-cloud path:

1. Developer workstation or automation identity
2. Source-code repository
3. CI/CD workflow
4. Federated identity or cloud role
5. Cloud resources and audit events

The prototype combines three related research capabilities:

- **Credential lifecycle-aware detection:** interpret authentication and API events in the context of credential ownership, version, lifecycle state, and risk.
- **Revocation assurance:** distinguish a credential being marked revoked in an inventory from evidence that participating downstream test services no longer accept it.
- **Cross-layer attack-chain reconstruction:** connect endpoint, repository, CI/CD, identity, and cloud events using explicit identifiers and provenance rather than relying on timestamp proximity alone.

The initial deliverable is a local application with a working security dashboard, synthetic credential inventory, lifecycle transitions, event ingestion, explainable detections, a controlled scenario simulator, and an investigation timeline. No live provider credentials or production cloud access are required.

## 2. Product vision

Provide a reproducible experimental environment in which a student or security researcher can model credential lifecycle events, generate controlled developer-to-cloud activity, compare event-only detection with lifecycle-aware detection, and inspect how well an attack chain can be reconstructed from cross-layer telemetry.

### 2.1 Problem statement

A credential can remain technically usable or have downstream access paths even after an operator believes it has been rotated or revoked. Meanwhile, an authentication or cloud API event may be technically valid but suspicious in context—for example, use of an old credential version after rotation, activity by an unassigned owner, or access by a credential marked as suspected compromised.

Security telemetry is also distributed across endpoints, repositories, CI/CD platforms, identity providers, and cloud audit systems. Normalizing logs is useful, but normalization alone does not prove that events belong to the same causal chain.

The prototype will make these relationships explicit and measurable in a controlled environment.

### 2.2 Research gaps addressed

**Gap A — Cross-environment credential revocation assurance**

Primary-provider revocation or an inventory status change does not by itself establish that every dependent session, cache, downstream service, or federated access path has become unusable. The prototype will test revocation against explicitly configured synthetic downstream test services and record evidence and limitations.

**Gap B — Credential lifecycle state-aware threat detection**

Conventional event rules and SIEM enrichment can provide useful context. The research question is whether a formal credential lifecycle representation adds measurable value to event correlation and prioritization.

**Gap C — Cross-layer developer-to-cloud attack attribution**

Telemetry normalization and correlation standards already exist. The research question is whether explicit credential, identity, session, workflow, and experiment relationships improve attack-chain reconstruction compared with timestamp-only and simpler identity-based baselines.

These are research questions, not claims that existing security products or standards lack these capabilities.

## 3. Goals and non-goals

### 3.1 Goals

1. Provide a local, understandable dashboard for credential posture and security events.
2. Maintain a synthetic credential inventory with owners, providers, environments, versions, and lifecycle history.
3. Represent lifecycle transitions explicitly and validate allowed transitions.
4. Simulate rotation and revocation workflows without contacting real providers.
5. Record downstream test-service acceptance checks and distinguish verified invalidity from unsupported or inconclusive checks.
6. Ingest and normalize synthetic security events from endpoint, repository, CI/CD, identity, and cloud layers.
7. Compare conventional event-only rules with lifecycle-aware detection.
8. Produce explainable risk scores and detection evidence.
9. Reconstruct attack timelines using explicit identifiers and confidence labels.
10. Evaluate detection and reconstruction with reproducible synthetic scenarios and ground truth.
11. Run entirely on localhost without Docker or cloud services as a prerequisite.

### 3.2 Non-goals for the initial prototype

- Production secrets management or storage of real secrets.
- Connecting to real GitHub, AWS, Azure, GCP, npm, or endpoint accounts.
- Executing malware, malicious packages, credential theft, persistence, or exploitation.
- Real credential revocation or cloud IAM changes.
- A production SIEM, SOAR, EDR, or identity governance replacement.
- Guaranteed detection of all attacks or universal proof of revocation.
- Multi-tenant SaaS, billing, enterprise SSO, or high availability.
- Kubernetes, distributed deployment, or cloud hosting in the first milestone.

## 4. Users and primary workflows

### 4.1 Researcher / administrator

Can create synthetic credentials, assign owners and environments, run scenarios, inspect lifecycle histories, view detections, and export experiment evidence.

### 4.2 Analyst / investigator

Can search events and alerts, inspect detection explanations, review revocation evidence, and reconstruct a sequence of related events.

The first version may use a single local administrator experience. Authentication and role-based access control are not prerequisites for localhost research use; do not expose the app to a public network without adding them.

### 4.3 Core user journeys

**Journey 1 — Review credential posture**
1. Open Overview.
2. Review total, active, high-risk, and orphaned credentials.
3. Filter inventory by lifecycle state, provider, owner, or environment.
4. Open a credential and inspect versions and lifecycle history.

**Journey 2 — Simulate rotation and verify revocation**
1. Select a synthetic credential.
2. Create a new version and mark the old version as rotation pending / grace period according to the scenario.
3. Initiate simulated revocation.
4. Run acceptance checks against configured synthetic downstream services.
5. Review each result and evidence.
6. Mark the version Verified Invalid only when the required checks support that conclusion; otherwise retain Pending, Still Accepted, Verification Failed, or Not Supported.

**Journey 3 — Run a detection scenario**
1. Select a named synthetic scenario.
2. Generate deterministic events with a unique experiment ID.
3. Run event-only baseline rules.
4. Run lifecycle-aware detection.
5. Compare alerts and evaluation metrics.
6. Inspect the explanation and contributing events.

**Journey 4 — Investigate an attack chain**
1. Open a detection.
2. Follow its related credential, actor, session, workflow, and experiment references.
3. Inspect the ordered event timeline.
4. Review which links are explicit and which are heuristic.
5. Export a report containing evidence, uncertainty, and missing telemetry.

## 5. Product scope and feature requirements

Priority definitions:
- **P0:** required for the first usable local prototype.
- **P1:** required for research evaluation after the first vertical slice.
- **P2:** later enhancement.

### 5.1 Dashboard and navigation

**P0**
- Dark, responsive security operations dashboard.
- Persistent sidebar navigation.
- Overview cards for credential count, active credentials, high-risk credentials, and open detections.
- Lifecycle distribution visualization.
- Recent detections and recent events.
- Credential inventory preview.
- Clear local-prototype / synthetic-data banner.
- Loading, empty, error, and success states.

**P1**
- Date-range and environment filters.
- Dashboard metrics computed from backend data, not hardcoded constants.
- Links from metric cards to filtered module views.

### 5.2 Credential inventory

**P0**
- List synthetic credentials with stable ID, name, provider, credential type, owner, environment, lifecycle state, risk attributes, created time, last-used time, and description.
- Search by name, ID, owner, provider.
- Filter by lifecycle state, environment, and provider.
- Credential detail view with versions and lifecycle history.
- Create and edit synthetic credential metadata.
- Do not store actual credential values, secrets, tokens, passwords, or private keys.

**P1**
- Bulk import/export of metadata-only synthetic records.
- Ownership and expiry review indicators.
- Credential dependency relationships.

### 5.3 Credential lifecycle engine

The lifecycle engine is a domain service, not UI-only state manipulation.

Required lifecycle states:
- Provisioned
- Active
- Rotation Pending
- Grace Period
- Revocation Pending
- Revoked
- Verified Invalid

Risk attributes that may coexist with lifecycle state:
- Suspected Compromised
- Orphaned
- High Privilege
- Expired / Past Expiry

Do not force risk attributes into the lifecycle state enum. For example, a credential can be Active and Suspected Compromised at the same time.

**P0**
- Define allowed transitions in one backend state machine.
- Record every transition as an append-only lifecycle event.
- Require actor, timestamp, reason, source, and experiment ID where applicable.
- Reject invalid transitions with a useful API error.
- Keep credential versions separate from the parent credential record.
- Show lifecycle history in the UI.

Suggested transitions (validate and document any extensions):

| From | Allowed next state |
|---|---|
| Provisioned | Active, Revocation Pending |
| Active | Rotation Pending, Revocation Pending, Expired |
| Rotation Pending | Grace Period, Active, Revocation Pending |
| Grace Period | Revocation Pending, Active |
| Revocation Pending | Revoked, Active (only with documented cancellation) |
| Revoked | Verified Invalid, Revocation Pending (re-check only; do not silently reactivate) |
| Verified Invalid | No reactivation; create a new credential version instead |

The table is an initial domain policy. Implement transitions centrally and test them.

### 5.4 Revocation assurance

**P0**
- Model one or more downstream synthetic test services associated with a credential or version.
- Simulate revocation requests and downstream acceptance checks.
- Store each check with service, credential version, check time, method, result, evidence summary, and error details.
- Supported result values:
  - Verified Invalid
  - Still Accepted
  - Verification Failed
  - Not Supported
  - Pending
- Show evidence per service and an aggregate outcome.
- Never infer Verified Invalid solely because the credential record says Revoked.
- Do not claim that all provider sessions, caches, or federated paths are covered. State the scope of configured test services.

**P1**
- Retry and time-bound verification.
- Coverage percentage across configured test services.
- Report residual acceptance and time-to-invalidation.

### 5.5 Security event ingestion and normalization

**P0**
- Accept synthetic events through a backend API and scenario generator.
- Validate events with a schema.
- Preserve original source metadata and normalized fields.
- Use UTC timestamps internally.
- Assign unique event IDs.
- Include experiment ID to isolate each scenario run.

Minimum normalized event fields:
- event_id
- timestamp
- source_layer (endpoint, repository, ci_cd, identity, cloud, registry, application)
- source_product
- event_type
- action
- actor_id
- credential_id (nullable)
- credential_version_id (nullable)
- session_id (nullable)
- repository_id (nullable)
- workflow_id / execution_id (nullable)
- cloud_role_id (nullable)
- resource_id (nullable)
- source_address (synthetic or anonymized)
- outcome
- experiment_id
- raw_metadata (JSON object, sanitized)

Unknown values must remain null/unknown. Do not fabricate identifiers to make a correlation succeed.

### 5.6 Threat detection

**P0**
- Implement a conventional event-only baseline.
- Implement lifecycle-aware rules using credential state and risk attributes.
- Create alerts with severity, confidence, status, explanation, rule ID, related event IDs, credential references, and timestamps.
- Provide a human-readable explanation for every alert.
- Make rules deterministic and unit-testable.

Initial detection rules:
1. Use of a credential marked Suspected Compromised.
2. Use of an old credential version after rotation / grace period closure.
3. Use of a credential in Revocation Pending, Revoked, or Verified Invalid state.
4. Activity by an Orphaned credential owner.
5. Unexpected cloud-sensitive action following a suspicious CI/CD event.
6. Unusual cross-layer sequence for a scenario's known ground truth.
7. Excessive privilege or sensitive resource access where the synthetic event data explicitly supports the finding.

Avoid asserting malicious intent from one weak signal. Use severity and confidence separately.

### 5.7 Explainable risk scoring

Initial weights are hypotheses to be evaluated, not validated constants:

| Dimension | Initial weight |
|---|---:|
| Credential lifecycle context | 30% |
| Event sensitivity | 25% |
| Sequence context | 20% |
| Identity / ownership context | 15% |
| Revocation verification context | 10% |

Each dimension is normalized to 0–100. Compute a weighted score from documented features. Missing data must not silently be treated as zero-risk; represent missingness and explain its effect.

Initial bands:
- 0–29: Low
- 30–59: Medium
- 60–79: High
- 80–100: Critical

Make weights and thresholds configurable. Store score components and rule explanations so a researcher can reproduce the result. Compare alternative weights during evaluation.

### 5.8 Cross-layer correlation and attack-chain reconstruction

**P0**
- Correlate using explicit links where available: credential ID/version, actor ID, session ID, repository ID, workflow/execution ID, cloud role ID, resource ID, and experiment ID.
- Use timestamp windows only as supporting heuristics, never as proof of causality.
- Store link method, confidence, and evidence for every event-to-event relationship.
- Render an ordered investigation timeline.
- Display missing expected stages from scenario ground truth.

**P1**
- Compare timestamp-only, identity-based, and explicit-provenance correlation baselines.
- Report link precision/recall and reconstruction completeness.

### 5.9 Scenario simulator

Provide deterministic, repeatable scenarios. Every run gets a unique experiment ID and known ground truth.

1. **Normal developer activity:** expected developer, repository, CI, and cloud events.
2. **Credential rotation:** new version provisioned, old version in grace period, old version invalidation checks.
3. **Residual credential usage:** old version is used after rotation / revocation begins.
4. **Suspected credential compromise:** credential risk attribute is set and later use is generated.
5. **Developer-to-cloud attack simulation:** synthetic suspicious package/install signal, repository identity use, CI workflow, federated role assumption, cloud enumeration, and resource access. No malware or real package execution.
6. **Orphaned credential abuse:** activity associated with an unassigned synthetic owner.

**P0**
- Generate events locally only.
- Seed reproducible data.
- Provide scenario description, expected stages, generated events, and ground truth.
- Allow clearing/resetting demo data with confirmation.

### 5.10 Investigation and reporting

**P0**
- Alert detail with severity, confidence, explanation, score components, and related events.
- Timeline ordered by event timestamp.
- Link evidence and link method.
- Show uncertainty and missing telemetry.
- Basic JSON or CSV export for synthetic experiment evidence.

**P1**
- Downloadable Markdown investigation report.
- Experiment comparison report.

## 6. Information architecture and screens

1. **Overview** — posture metrics, lifecycle distribution, recent alerts, recent events, revocation assurance summary.
2. **Credentials** — searchable inventory and credential detail.
3. **Lifecycle** — state transitions, version history, risk attributes.
4. **Revocation checks** — downstream services, check results, evidence, aggregate assurance.
5. **Event monitor** — normalized event stream with filters and detail drawer.
6. **Threat detections** — alert list, severity/confidence filters, rule explanations.
7. **Investigations** — event relationships, evidence, timeline, missing stages.
8. **Attack chains** — scenario-level chain visualization and reconstruction status.
9. **Scenarios** — run, inspect, compare, and reset deterministic scenarios.
10. **Reports** — export experiment and investigation findings.
11. **Settings** — local prototype configuration, rule thresholds, scoring weights.

All screens must use a shared application shell and consistent visual system. Ensure keyboard focus, readable contrast, accessible labels, responsive layouts, and useful empty/error states.

## 7. Technical architecture

### 7.1 Selected stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js 16, React, JavaScript | Dashboard and user interaction |
| Styling | Tailwind CSS 4 | Layout and visual system |
| Backend API | Python + FastAPI | Domain logic and REST endpoints |
| Database | PostgreSQL | Durable prototype data |
| ORM / migrations | SQLAlchemy + Alembic (recommended) | Persistence and schema evolution |
| Validation | Pydantic | Request and response validation |
| Charts | Recharts or a compatible React chart library | Metrics and distributions |
| Testing | ESLint, Next build, pytest | Quality checks |

No Docker, cloud deployment, Redis, or external telemetry integration is required for the first release. The application must be runnable with local processes.

### 7.2 Architecture boundaries

- Next.js owns UI rendering, navigation, and frontend interaction.
- FastAPI owns lifecycle transitions, revocation logic, event normalization, detection, risk scoring, correlation, and reporting.
- PostgreSQL is the system of record.
- The browser must not implement authoritative lifecycle or risk decisions.
- The frontend calls FastAPI over HTTP/JSON.
- Do not duplicate business rules in React components or Next.js route handlers.
- Keep domain services independent of HTTP handlers so they can be unit-tested.
- Use a single local database initially, with clear repository/service boundaries.
- Preserve original event evidence and lifecycle history; avoid destructive updates to audit records.

### 7.3 Suggested repository structure

Adapt to the existing repository rather than blindly recreating it.

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
├── docs/
│   ├── architecture.md
│   ├── data-dictionary.md
│   └── research-methodology.md
└── .env.example
```

### 7.4 Local development ports

- Next.js: `http://localhost:3000`
- FastAPI: `http://localhost:8000`
- FastAPI OpenAPI docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

Configure the frontend API base URL through a public frontend environment variable such as `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`. Never put secrets in `NEXT_PUBLIC_*` variables.

## 8. Data model

Use UUID primary keys where appropriate, UTC timestamps, foreign keys, indexes for common filters, and explicit nullable fields. Use migrations for schema changes.

### 8.1 Core entities

**Credential**
- id
- name
- provider
- credential_type
- owner_id / owner_name
- environment
- lifecycle_state
- risk_attributes (structured JSON or normalized relation)
- created_at
- expires_at (nullable)
- last_used_at (nullable)
- description

**CredentialVersion**
- id
- credential_id
- version_label
- lifecycle_state
- created_at
- activated_at (nullable)
- revoked_at (nullable)
- verified_invalid_at (nullable)
- supersedes_version_id (nullable)
- metadata (non-secret only)

Never store a credential's actual token or secret value.

**LifecycleEvent**
- id
- credential_id
- credential_version_id (nullable)
- from_state
- to_state
- actor
- reason
- source
- occurred_at
- experiment_id (nullable)
- metadata

**Service**
- id
- name
- service_type
- supported_check_method
- enabled
- configuration (synthetic/non-secret only)

**RevocationCheck**
- id
- credential_version_id
- service_id
- result
- checked_at
- method
- evidence_summary
- error_detail (nullable)
- experiment_id (nullable)

**SecurityEvent**
- id
- timestamp
- source_layer
- source_product
- event_type
- action
- actor_id
- credential_id (nullable)
- credential_version_id (nullable)
- session_id (nullable)
- repository_id (nullable)
- workflow_id (nullable)
- cloud_role_id (nullable)
- resource_id (nullable)
- source_address (nullable)
- outcome
- experiment_id
- raw_metadata (sanitized JSON)

**DetectionRule**
- id
- name
- description
- enabled
- rule_type
- severity
- configuration

**Alert**
- id
- rule_id
- title
- severity
- confidence
- status
- risk_score
- score_components
- explanation
- credential_id (nullable)
- experiment_id (nullable)
- created_at
- acknowledged_at (nullable)
- resolved_at (nullable)

**AlertEvent**
- alert_id
- event_id
- relationship
- evidence

**AttackChain**
- id
- name
- scenario_type
- experiment_id
- ground_truth
- reconstruction_status
- created_at

**AttackChainEvent**
- attack_chain_id
- event_id
- sequence_index
- stage
- link_method
- link_confidence
- evidence

**Experiment**
- id
- scenario_name
- seed
- started_at
- completed_at
- configuration
- ground_truth
- notes

### 8.2 Data integrity principles

- Use foreign keys for known relationships.
- Do not invent missing identities or event links.
- Keep event and lifecycle history append-only where practical.
- Store scenario seed and configuration to reproduce outputs.
- Use transaction boundaries for lifecycle transitions.
- Ensure every generated event is associated with an experiment.
- Sanitize metadata and prohibit real secrets.

## 9. API contract (initial proposal)

Use versioned endpoints under `/api/v1`. Return consistent JSON errors with a stable error code and message.

### Health
- `GET /api/v1/health` — service health and database connectivity.

### Credentials
- `GET /api/v1/credentials` — list, search, and filter.
- `POST /api/v1/credentials` — create synthetic metadata record.
- `GET /api/v1/credentials/{credential_id}` — detail, versions, history.
- `PATCH /api/v1/credentials/{credential_id}` — update permitted metadata only.

### Lifecycle
- `POST /api/v1/credentials/{credential_id}/transitions` — request validated transition.
- `GET /api/v1/credentials/{credential_id}/lifecycle` — lifecycle history.
- `POST /api/v1/credentials/{credential_id}/versions` — create new synthetic version.

### Revocation
- `GET /api/v1/revocation/checks` — list checks.
- `POST /api/v1/revocation/checks/run` — run synthetic downstream acceptance checks.
- `GET /api/v1/revocation/credentials/{credential_id}` — aggregate evidence.

### Events and detections
- `GET /api/v1/events` — query normalized events.
- `POST /api/v1/events` — ingest synthetic event batch.
- `GET /api/v1/alerts` — list detections.
- `GET /api/v1/alerts/{alert_id}` — detail and evidence.
- `POST /api/v1/detections/run` — evaluate selected events or experiment.

### Scenarios and investigations
- `GET /api/v1/scenarios` — list scenarios.
- `POST /api/v1/scenarios/{scenario_name}/run` — generate deterministic synthetic experiment.
- `GET /api/v1/experiments/{experiment_id}` — experiment summary.
- `GET /api/v1/experiments/{experiment_id}/attack-chain` — reconstructed chain and links.
- `GET /api/v1/experiments/{experiment_id}/metrics` — evaluation metrics.

Implement endpoints only when their underlying service behavior exists. Do not create mock success responses that imply an operation was performed when it was not.

## 10. Synthetic datasets and threat scenarios

All examples must use fabricated names, identifiers, IP ranges reserved for documentation/testing, and non-functional placeholder values. Do not include real tokens or secrets.

Each scenario must define:
- Scenario name and purpose
- Initial credential inventory
- Initial lifecycle states and risk attributes
- Ordered ground-truth stages
- Generated events
- Expected detections
- Expected event relationships
- Expected missing-data behavior
- Random seed / reproducibility controls

### 10.1 Example developer-to-cloud scenario

A safe synthetic sequence may contain:
1. Synthetic package installation warning event on a developer workstation.
2. Synthetic repository access by a developer identity.
3. Synthetic CI workflow execution.
4. Synthetic OIDC federation event for a test role.
5. Synthetic cloud identity lookup.
6. Synthetic object-storage enumeration.
7. Synthetic sensitive-resource access event.

These are generated records only. Do not install a malicious package, steal a token, assume a cloud role, or access a real resource.

## 11. Research methodology and evaluation

The prototype must support controlled comparison, not just demonstrate a visually convincing dashboard.

### 11.1 Baselines

1. **Event-only baseline:** rules use event fields and event sequence without credential lifecycle state.
2. **Lifecycle-aware detector:** same event stream enriched with lifecycle state, version, owner, and revocation verification context.
3. **Timestamp-only correlation:** candidate links based primarily on temporal proximity.
4. **Identity-based correlation:** links using actor / credential / session identifiers where available.
5. **Explicit-provenance correlation:** links using credential version, workflow execution, session, role, resource, and experiment references with recorded evidence.

### 11.2 Detection metrics

- Precision
- Recall
- F1-score
- False-positive rate
- False-negative rate
- Detection latency
- Alert volume per experiment
- Severity prioritization quality

Use a clearly defined ground-truth label for each event and scenario. Explain how true positives, false positives, true negatives, and false negatives are counted.

### 11.3 Revocation assurance metrics

- Check outcome accuracy against synthetic service ground truth
- Residual acceptance detection rate
- False verified-invalid rate (must be zero in valid tests)
- Verification latency
- Downstream service coverage
- Inconclusive / unsupported check rate

### 11.4 Reconstruction metrics

- Event-link precision and recall
- Attack-chain stage coverage
- Correct ordering rate
- Attribution accuracy
- Missing-stage detection
- Investigation time (if measured through a repeatable protocol)

### 11.5 Experimental controls

- Use deterministic seeds.
- Keep train/tune/test scenarios separate if model tuning is introduced.
- Document all rules, weights, thresholds, and dataset versions.
- Run multiple trials where randomness is used.
- Report limitations and synthetic-data bias.
- Do not claim real-world efficacy from synthetic experiments alone.

## 12. Security, privacy, and safety requirements

1. Synthetic data only by default.
2. Never request, store, log, or commit real credentials, access tokens, private keys, or passwords.
3. Include `.env`, local database files, generated secrets, and caches in `.gitignore` as appropriate.
4. Provide `.env.example` with placeholders only.
5. No live cloud provider calls or production integrations in the initial prototype.
6. No malware, exploit code, credential harvesting, persistence, or unauthorized access workflows.
7. Keep local services bound to localhost during development unless the user explicitly configures otherwise.
8. Do not expose FastAPI debug endpoints or permissive CORS to public networks.
9. Validate and sanitize event metadata.
10. Do not include sensitive values in logs or error messages.
11. Mark simulated results clearly in UI and exports.
12. A status label is not proof of technical invalidity; only configured test evidence can support the prototype's verified-invalid result.

## 13. Non-functional requirements

- **Maintainability:** separate UI, API, domain logic, persistence, and scenario generation.
- **Reproducibility:** deterministic scenarios and documented seeds.
- **Explainability:** every alert has rule, reason, evidence, and score components.
- **Auditability:** lifecycle transitions and revocation checks retain history.
- **Usability:** common dashboard actions discoverable; clear feedback and empty states.
- **Accessibility:** keyboard navigation, visible focus, semantic HTML, sufficient contrast, labels.
- **Performance:** comfortably supports thousands of synthetic events on a typical student laptop; optimize only when measurements justify it.
- **Reliability:** invalid lifecycle transitions and malformed events fail safely with useful errors.
- **Portability:** local setup documented for Windows, macOS, and Linux where practical.

## 14. Milestones and implementation order

Build vertical slices. Do not implement every screen as disconnected mock data.

### Milestone 0 — Repository and developer experience
- Inspect current repository, `AGENTS.md`, package scripts, and installed versions.
- Preserve existing Next.js scaffold and configuration.
- Add product documentation and backend skeleton.
- Add safe ignore rules and environment examples.
- Document local setup.

**Acceptance:** repository instructions are followed; frontend and backend start locally; no secrets are committed.

### Milestone 1 — Frontend shell and dashboard
- Shared sidebar, header, responsive layout, typography, color tokens.
- Overview page and navigation to module placeholders.
- Synthetic inventory and event fixtures isolated from components.
- Loading, empty, and error states.

**Acceptance:** `npm run lint` and `npm run build` pass; dashboard renders at localhost:3000; no console errors in normal use.

### Milestone 2 — FastAPI and PostgreSQL foundation
- FastAPI health endpoint.
- Database connection and migrations.
- Credential and credential-version models.
- Seed synthetic records.
- Frontend API client and credential list/detail.

**Acceptance:** frontend displays database-backed credentials; backend tests pass; seed can be repeated safely.

### Milestone 3 — Lifecycle engine
- State machine and transition validation.
- Append-only lifecycle event history.
- UI transition workflow and history.

**Acceptance:** valid transitions persist; invalid transitions return errors; tests cover every allowed transition and representative rejected transitions.

### Milestone 4 — Revocation assurance simulator
- Synthetic downstream service adapters.
- Check result persistence and evidence.
- Aggregate status rules.
- Revocation UI.

**Acceptance:** a credential cannot become Verified Invalid from a status update alone; service checks determine evidence outcome; still-accepted and inconclusive cases are visible.

### Milestone 5 — Event ingestion and scenario generator
- Normalized event schema and API.
- Deterministic scenario definitions and seeds.
- Event monitor and experiment detail.

**Acceptance:** scenarios produce reproducible event sets with experiment IDs and expected ground truth.

### Milestone 6 — Detection and risk engine
- Event-only baseline rules.
- Lifecycle-aware rules.
- Configurable scoring and explanations.
- Alert list and detail.

**Acceptance:** tests prove lifecycle context changes the expected cases; each alert references evidence; metrics can be calculated against scenario labels.

### Milestone 7 — Correlation and investigations
- Explicit event relationship model.
- Baseline correlation modes.
- Attack-chain timeline and missing-stage display.

**Acceptance:** correlation links carry method and evidence; timestamp proximity alone is not represented as proven causality.

### Milestone 8 — Evaluation, reports, and polish
- Experiment metrics and comparison view.
- JSON/CSV/Markdown export.
- Documentation, accessibility, responsive review, and test coverage.

**Acceptance:** a complete scenario can be run, detected, investigated, compared against baselines, and exported.

## 15. Definition of done

A feature is done only when:
- It satisfies an explicit requirement in this document.
- Domain logic is not embedded solely in UI code.
- Inputs are validated and errors are handled.
- Tests cover normal, boundary, and failure cases.
- UI displays real API state or clearly labeled fixture data.
- No secrets or live-provider calls are introduced.
- Relevant docs and API schemas are updated.
- Lint, build, and relevant tests pass.
- The Codex summary identifies files changed, commands run, results, and known limitations.

## 16. Local setup and run instructions

### 16.1 Prerequisites

- Node.js LTS compatible with the installed Next.js version.
- npm (package lock is already present).
- Python 3.11+ recommended.
- PostgreSQL installed and running locally.

Docker is optional, not required.

### 16.2 Frontend

From repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npm run build
```

### 16.3 Backend (once implemented)

From repository root:

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

### 16.4 Database

Create a local PostgreSQL database named `credential_to_cloud`. Configure the backend connection string in a local, ignored `backend/.env` file. Use `backend/.env.example` as the template. Never commit the populated file.

The exact migration and seed commands must be documented when the database layer is implemented.

## 17. Instructions for VS Code Codex

This section is an explicit working contract for the coding agent.

### 17.1 First actions

1. Read this entire document.
2. Read `AGENTS.md` and all repository-specific instructions.
3. Inspect the repository tree, package.json, lockfile, Next.js configuration, existing app files, and git status.
4. **Important:** this repository uses Next.js `16.4.6` and React `19.3.0` at the time this document was prepared. The repository's `AGENTS.md` states that this Next.js version has breaking changes and requires reading the relevant documentation from the installed package under `node_modules/next/dist/docs/` before writing code. Follow that instruction. Do not assume older Next.js APIs or conventions.
5. Summarize the current state and propose the smallest next implementation slice before making broad changes.

### 17.2 Coding rules

- Use JavaScript, not TypeScript, unless the project owner explicitly changes this requirement.
- Use Next.js App Router and the conventions supported by the installed Next.js version.
- Keep components small and focused.
- Keep domain logic in FastAPI services, not React components.
- Use semantic HTML and accessible controls.
- Prefer existing dependencies; justify any new dependency.
- Do not add Docker as a requirement.
- Do not introduce cloud deployment or live integrations.
- Do not hardcode dashboard metrics once API integration exists.
- Never create real-looking usable secrets. Use obvious placeholders such as `SYNTHETIC_TOKEN_DO_NOT_USE` only if a token-shaped test fixture is unavoidable; preferably store metadata only.
- Keep synthetic fixtures in dedicated fixture/seed modules.
- Use environment variables for local configuration and provide example files with placeholders.
- Preserve existing files and user changes. Do not overwrite or delete work without inspecting it and explaining why.
- Avoid unrelated refactors.
- Keep API contracts and data models documented.
- Use migrations for database schema changes.
- Add tests alongside domain behavior.

### 17.3 Work incrementally

For each task:
1. State the milestone and acceptance criteria being addressed.
2. Inspect relevant files and version-specific documentation.
3. Implement one coherent vertical slice.
4. Run focused tests.
5. Run `npm run lint` and `npm run build` for frontend changes.
6. Run pytest for backend changes.
7. Review the diff for accidental changes, secrets, and generated artifacts.
8. Update documentation if behavior or setup changed.
9. Report exactly what was changed, what was tested, results, and remaining work.

Do not claim a test passed unless it was actually run and its result observed. If a dependency, database, or service is unavailable, say so and provide the exact command needed.

### 17.4 Git workflow

- Work on a feature branch; do not commit directly to `main` unless explicitly requested.
- Make small, descriptive commits when asked.
- Never force-push or rewrite history without explicit permission.
- Do not merge pull requests without approval.
- Before modifying files, inspect `git status`.
- Never stage local secrets, databases, virtual environments, build output, or dependency directories.

Suggested branch names:
- `feature/dashboard-shell`
- `feature/credential-inventory`
- `feature/lifecycle-engine`
- `feature/revocation-assurance`
- `feature/event-ingestion`
- `feature/lifecycle-detection`
- `feature/attack-correlation`

### 17.5 Initial Codex task prompt

After reading this document and repository instructions, start with Milestone 0 and Milestone 1 only. Inspect the current repository and installed Next.js 16.4.6 documentation before editing. Preserve the existing scaffold and existing user changes. Build a polished responsive dark SOC-style dashboard for Credential-to-Cloud using JavaScript and the installed Tailwind CSS version. Use clearly labeled synthetic fixture data, not live provider data. Include the navigation and Overview experience described in this PRD, and scaffold other module routes only as useful placeholders. Do not implement the FastAPI detection engine yet. Run lint and production build, fix issues, and report changed files and test results. Do not proceed to later milestones without reviewing the first slice.

### 17.6 Suggested follow-up prompts

- "Implement the credential inventory UI and API contract from the PRD. Keep data synthetic and add tests."
- "Implement the FastAPI health endpoint, PostgreSQL connection, migrations, and credential read APIs."
- "Implement the credential lifecycle state machine with transition validation and comprehensive unit tests."
- "Implement revocation assurance using synthetic downstream services. Ensure Verified Invalid requires successful acceptance checks."
- "Implement deterministic scenario generation with experiment IDs and ground truth."
- "Implement event-only and lifecycle-aware detection as separate comparable modes."
- "Implement explainable risk scoring with configurable weights and tests."
- "Implement explicit-provenance event correlation and compare it with timestamp-only correlation."
- "Implement experiment evaluation metrics and an investigation report."

## 18. Known limitations and research caveats

- Synthetic scenarios cannot establish real-world detection performance on their own.
- Provider-specific revocation semantics differ; this prototype only makes claims about its configured test services.
- A token's primary status does not necessarily describe all dependent sessions or caches.
- A normalized event schema does not prove causality.
- Correlation confidence must be visible and explainable.
- Initial risk weights and thresholds are hypotheses; evaluate them empirically.
- Credential lifecycle states and risk attributes are separate dimensions.
- The prototype is a research instrument, not a production security control.

## 19. Initial acceptance checklist

### First runnable milestone
- [ ] Repository and Next.js-specific instructions inspected.
- [ ] Existing app scaffold preserved.
- [ ] Responsive dark dashboard shell implemented.
- [ ] Overview metrics use clearly identified synthetic fixtures.
- [ ] Navigation links to all planned modules.
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
This PRD is the source of truth for the initial Credential-to-Cloud localhost research prototype. If a requirement changes, update this document and record the reason rather than silently diverging from it.
