# Vigil — Director Brief
## Splunk AI Toolkit Agent Builder Context

**5–10 minute leadership read** · Bharat Namatherdhala · June 2026
**Companion:** [`docs/prd.md`](./prd.md) (full PRD) · [`docs/jon-elli-brief.md`](./jon-elli-brief.md) (PM-deep brief)

---

## The Thesis in One Paragraph

**Splunk AI Toolkit Agent Builder is the platform. Vigil is the canonical first sophisticated template that runs on it.** Vigil is a 7-state Finite State Machine workflow that orchestrates a network incident investigation across Splunk MCP and Cisco Catalyst MCP, grounded by Pinecone Retrieval-Augmented Generation and a Cisco Time Series Model + Chronos forecasting layer, with built-in human-in-loop confidence routing and a Pydantic JSON audit trail per investigation. Three of Agent Builder's announced roadmap items (template ecosystem, human-in-loop approvals, broader MCP integration) are already shipped in Vigil. **The role I want: build Template #1, define the template authoring standards, seed the ecosystem before public General Availability.**

---

## Why Now — Three Signals Converging

| Signal | Status | Why It Matters |
|---|---|---|
| **Splunk AI Toolkit Agent Builder** | Private preview, expanding | The agentic-template platform ecosystem is being built right now — Sonal's team |
| **Cisco AgenticOps** | Roadmap, shipping 2025–2026 | The parent-company runtime (Canvas + Skills Registry + Deep Network Model) |
| **Cisco Time Series Model** | Launched 24 Nov 2025, v1.0 early 2026 | The observability-tuned foundation model — Sonal Pardeshi and Liang Gou co-authored the launch |

The strategic window opens in the next 6–12 months. Vigil was built specifically at this convergence point.

---

## The Customer Pain — Splunk's Own Data

| # | Problem | Splunk Source | Vigil's Answer |
|:-:|---|---|---|
| 1 | **55%** of orgs report too many false positives · **94%** of CISOs cite as top burnout driver | State of Security 2025, CISO Report | Phase 2.5 pre-triage suppresses **35–40% at zero tokens** |
| 2 | **81%** of SOC pros name disconnected tools as #1 slowdown · **$58K** per incident | Dimitri McKay, Splunk | Splunk + Cisco MCPs in one loop — **47 min → 35 sec** |
| 3 | **78%** of orgs say tools are disconnected · 59% cite tool maintenance as #1 SOC inefficiency | State of Security 2025, Kirsty Paine | A reasoning layer, not another platform — same RBAC, same data |
| 4 | *"Traditional reactive operations are no longer enough"* | Craig Robin, Splunk 2026 Predictions | Phase 4 forecasting layer — up to **10 hours ahead** |

Every problem statement is cited from Splunk's own publications by author name. **Customer empathy is not an opinion — it's a citation.**

---

## What I Built — Mapped Against the Agent Builder Roadmap

This is the most important table in the brief.

| Agent Builder Capability / Roadmap Item | Vigil Status |
|---|:---:|
| **Template ecosystem** *(announced roadmap)* | ✅ **Vigil IS Template #1 — network incident commander, fully measured** |
| **Human-in-loop approvals** *(announced roadmap)* | ✅ **Shipped — FSM confidence-band routing, per-team thresholds** |
| **Broader MCP server support** *(announced roadmap)* | ✅ **Splunk MCP + Cisco Catalyst MCP integrated; pattern works for Snowflake, Databricks, AWS** |
| Plain-English goal definition *(shipped)* | ⏳ FSM in code today; v2 markdown / YAML manifest aligns with Agent Builder's approach |
| Native SPL invocation from search bar *(shipped)* | ⏳ Architecture supports it — integration work with Agent Builder team |
| Runs inside Splunk compliance boundary *(shipped)* | ⏳ RBAC passthrough already implemented; production deployment work needed |
| Conversational follow-ups *(announced roadmap)* | ⏳ Would build with Agent Builder team |

**Three of your published roadmap items are already shipped in Vigil. The remaining four are exactly the Agent Builder integration work I want to do.**

---

## Three Product Decisions Worth Examining

How a PM makes calls is more revealing than what was built. Three non-obvious decisions, each defensible by reasoning:

**1. Pre-triage as rules, not ML.** The first filter that processes 35–40% of alerts is explicit if-then logic — no model inference. Reason: pre-triage is **logical filtering, not pattern recognition**. The decision ("did three signals corroborate or just one repeating one?") is articulable. ML's edge is finding patterns humans can't articulate. **Putting a foundation model where rules are correct is cargo-cult AI — exactly the anti-pattern Agent Builder's developer SDK should actively discourage in its template authoring standards.**

**2. Hybrid CTSM + Chronos, not single model.** Cisco Time Series Model for the point forecast (best Border Gateway Protocol MASE = 0.80, beats Chronos and TimesFM). Chronos for the probability distribution (because CTSM's public API returns single points only). Reason: quantile output is a one-hour API change on Cisco's side — per the launch blog Sonal Pardeshi co-authored. **Filed as Priority 0 in my engineering roadmap. The hybrid disappears once Cisco ships the API.**

**3. MCP-guided orchestrator, not gateway.** Vigil's manifest tells the foundation-model agent which tools to call; Vigil doesn't proxy MCP calls itself. Reason: **client-side orchestration matches the Adobe AEM Skills MCP pattern that's already shipping in production.** Lower latency, better tool discoverability, cleaner failure semantics. Same architecture Agent Builder's template registry should use.

---

## Measurable Outcomes

| Metric | Result | What It Signals |
|---|:---:|---|
| False positives suppressed at zero tokens | **35–40%** | Zero-token efficiency at scale |
| Precision (constrained vs unconstrained) | **0.91 vs 0.55** | Matches Cisco Deep Network Model target — today |
| Cost per investigation | **~$0.010–$0.014** | 80–85% off unconstrained baseline |
| Annual saving at 10K alerts/day | **~$620K** | Unit economics fluency |
| Forecast trigger lead time | Up to **18 min** before alert | Proactive, not reactive |
| MTTR Priority 2 | **47 min → 35 sec** | Speed is downstream of decision quality |

All measured across four reference scenarios. Mock data — acknowledged up-front in any demo.

---

## What I'd Ship in Q1 at Splunk

Three deliverables, all customer-facing, all aligned to Agent Builder General Availability:

1. **Vigil as Template #1** — published in the Agent Builder template registry, with case study, benchmark, and one design-partner customer reference.
2. **Template authoring standards** — written documentation of what a sophisticated template should look like (FSM + RAG + evaluator + audit trail), based on what I learned building Vigil. **This becomes the foundation for community contributions to the template ecosystem.**
3. **Two more templates in adjacent categories** — likely security threat hunting and capacity planning — to seed the ecosystem before public GA. Each measured against the same benchmark framework as Vigil.

**The discipline:** Senior PMs earn credibility through shipped artifacts in the first quarter, not strategy documents.

---

## The Strategic Question

Splunk AI Toolkit Agent Builder is in private preview now. Cisco AgenticOps ships in 2026. Cisco Time Series Model v1.0 ships in early 2026. The window for the agentic-template platform is open right now.

**Who builds Template #1 — and how do we make it the network incident commander I've already shipped, measured, and benchmarked against the rest of the foundation-model market?**

That's the role I want.

---

## Quick Reference — If You Want to Go Deeper

- **[`docs/prd.md`](./prd.md)** — full PRD with architecture, governance, competitive landscape (~30 min read)
- **[`splunk_evals.ipynb`](../splunk_evals.ipynb)** — CTSM benchmark + 4-priority engineering roadmap
- **[`docs/jon-elli-brief.md`](./jon-elli-brief.md)** — 15–20 min peer-PM brief with deeper product-decision rationale
- **[`docs/competitive-landscape.md`](./competitive-landscape.md)** — 25+ vendors, market quadrant, three defensible advantages
