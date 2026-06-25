# Vigil — Executive Brief for Splunk AI Foundations
## A 15–20 Minute Leadership Read

**Audience:** Jon Elli · Splunk AI Toolkit team (Sonal Pardeshi's org)
**Author:** Bharat Namatherdhala
**Date:** May 2026
**Companion:** [`docs/prd.md`](./prd.md) — full PRD for deep reference

---

## What Vigil Is — In Three Sentences

**Vigil is the canonical first sophisticated template for Splunk AI Toolkit Agent Builder.** It is a 7-state Finite State Machine that orchestrates a network incident investigation across Splunk MCP and Cisco Catalyst MCP, grounded by Pinecone Retrieval-Augmented Generation and a foundation-model forecasting layer (Cisco Time Series Model + Chronos), with built-in human-in-loop confidence routing and a Pydantic JSON audit trail per investigation. I built it specifically to be **the kind of sophisticated, auditable, foundation-model-grounded workflow Agent Builder's template ecosystem should host** — not a competitor to Agent Builder, but the proof-of-concept of what its templates can be.

---

## The Customer Problem — Splunk's Own Data

Four problems. Every statement is grounded in Splunk's own 2025–2026 published research — not industry-analyst speculation.

| # | Problem | Splunk Source | Vigil's Answer |
|:-:|---|---|---|
| 1 | **False positive fatigue** | 55% of orgs · 32% of analyst day on false alarms · 94% of CISOs cite as top burnout driver *(State of Security 2025, CISO Report)* | Phase 2.5 pre-triage suppresses 35–40% at zero tokens, sub-millisecond |
| 2 | **Manual fragmented investigation** | 81% name disconnected tools as #1 slowdown · ~$58K per incident *(Dimitri McKay, Splunk)* | Splunk + Cisco MCPs in one loop, 47 min → 35 sec |
| 3 | **Tool sprawl** | 78% say tools disconnected · 59% cite tool maintenance as #1 SOC inefficiency *(State of Security 2025, Kirsty Paine)* | A reasoning layer, not another platform |
| 4 | **Reactive ops are dead** | *"Traditional reactive operations are no longer enough"* (Craig Robin, 2026 Predictions); *"Agentic AI lets organizations get ahead of incidents"* (Kamal Hathi) | Phase 4 forecasting, up to 10h ahead |

**Customer-advocacy signal:** I started with Splunk's own publications by name. Every claim above is a citation, not market research.

---

## Why Now — Three Signals Converging

1. **Splunk AI Toolkit Agent Builder is in private preview right now** — the agentic-template platform ecosystem is happening, this quarter
2. **Cisco AgenticOps shipping in 2025–2026** — Cisco's parent-company stack is the GA runtime
3. **Cisco Time Series Model launched 24 November 2025** *(Sonal Pardeshi + Liang Gou)* — v1.0 due early 2026, open-weights, observability-tuned

**Vigil was built at exactly the moment all three converge.** It is the working application of CTSM, designed to run on Agent Builder, that will live inside a Cisco AI Canvas Workflow Template at GA.

---

## Five Product-Judgment Decisions That Matter

Senior leaders evaluate PMs on *how decisions get made*. Here are the five non-obvious calls — each defensible by reasoning, not vibes.

### 1. Finite State Machine, not free-form agent

**Decision:** 7-state explicit FSM with threshold-based transitions.
**Reason:** **Auditability.** Every SUPPRESSED, REMEDIATING, ESCALATING decision cites the rule that fired. LangGraph or CrewAI give you the workflow primitive but the LLM controls transitions — for live network infrastructure, that's the wrong default. The FSM enforces a senior engineer's investigation methodology consistently. **When AI Canvas ships, the FSM maps to a Canvas template — no rewrite.**

### 2. Pre-triage as rules, not a small ML classifier

**Decision:** Explicit if-then logic for the first filter (35–40% of alerts hit it).
**Reason:** **Pre-triage is *logical filtering*, not *pattern recognition*.** The decision ("did three signals corroborate, or just one repeating one?") is articulable. ML's edge is finding patterns humans cannot articulate; here the patterns are already articulated. **Putting a foundation model where rules are correct is cargo-cult AI — and it's the kind of anti-pattern Agent Builder's developer SDK should actively discourage.**

### 3. Constrained mode (schema enforcement) over fine-tuning

**Decision:** Same base model, two prompting strategies — measure both, choose the constrained one.
**Reason:** **0.91 precision, no training pipeline.** Schema enforcement is the actual lever — prompt engineering, not fine-tuning. It's the right default for an Agent Builder template ecosystem where customers can't afford to maintain fine-tuned models per workflow.

### 4. Hybrid CTSM + Chronos, not single model

**Decision:** Use CTSM for point forecasts (BGP MASE 0.80, best in class); Chronos for probability distribution.
**Reason:** **Necessity until Cisco ships the quantile API change** — one hour of work on their side per the launch blog (Sonal's own product). Filed as Priority 0 in my engineering roadmap. The hybrid disappears once Cisco ships the API.

### 5. MCP-guided orchestrator, not gateway pattern

**Decision:** Vigil's manifest tells the foundation-model agent which tools to call; Vigil doesn't proxy MCP calls itself.
**Reason:** **Client-side orchestration** — same pattern as Adobe AEM Skills MCP shipped in production. Lower latency, better tool discoverability, cleaner failure semantics. Matches how Splunk Agent Builder's template registry should work.

---

## How Vigil Fits Splunk AI Toolkit Agent Builder

**This is the most important section. Agent Builder is the platform. Vigil is a canonical sophisticated template that runs on it.**

| Agent Builder Capability / Roadmap Item | Vigil Status |
|---|:---:|
| Template ecosystem (announced roadmap) | ✅ **Vigil IS the canonical first template — network incident commander** |
| Human-in-loop approvals (announced roadmap) | ✅ **Already shipped — FSM confidence-band routing with per-team thresholds** |
| MCP server expansion to Snowflake, Databricks, AWS (announced roadmap) | ✅ **Already integrates Splunk MCP + Cisco Catalyst MCP — same MCP-guided pattern** |
| Native SPL invocation (shipped) | ⏳ Not yet wired — Vigil runs via API today; Agent Builder integration would expose `\| vigil scenario=packet_loss` |
| Plain-English goal definition (shipped) | ⏳ Current FSM is code; v2 markdown/YAML manifest aligns with Agent Builder's approach |
| Runs inside Splunk compliance boundary (shipped) | ⏳ Production deployment work — architecture is RBAC-passthrough already |
| Conversational follow-ups (announced roadmap) | ⏳ Not yet — would build with Agent Builder team |

**The pitch in one sentence:** *I built Vigil specifically to be the template that lives in your registry. Agent Builder ships the platform; Vigil ships as Template #1 — network incident commander, fully measured, production-ready architecture, three of your roadmap items already solved.*

---

## Measurable Outcomes

| Metric | Result | Signal It Sends |
|---|:---:|---|
| False positives suppressed at zero tokens | **35–40%** | Zero-token efficiency at scale |
| Precision of investigation outcome | **0.91** (vs 0.55 unconstrained) | Matches Cisco Deep Network Model target — today |
| Cost per investigation | **~$0.010–$0.014** (80–85% off baseline) | Cloud margin discipline |
| Annual saving at 10K alerts/day | **~$620K** vs unconstrained | Unit economics fluency |
| Forecast trigger lead time | Up to **18 min** before alert | Phase 4 forecasting actually fires before incidents |
| MTTR (Priority 2) | **47 min → 35 sec** | Speed is the downstream effect; outcome metrics lead |

All measured across four reference scenarios in the war-room UI. Mock data — acknowledged up-front in any demo.

---

## What I'd Do in My First 90 Days

**Weeks 1–4:** Read every Splunk State of Security and Observability report; sit in on Agent Builder design partner calls; write a one-pager on the top 5 jobs-to-be-done for the template ecosystem. Validate with five preview-customer interviews.

**Weeks 5–8:** Identify the three highest-leverage Agent Builder template categories — network operations is one; what are the other two (security threat hunting? capacity planning? compliance audit?). Define the success metrics for each.

**Weeks 9–12:** Ship one visible win — Vigil itself as the canonical first network-operations template, with case study and benchmark. Plus the framework documentation that lets community partners ship their own templates against the same standard.

**The discipline:** Senior Staff PMs earn credibility through shipped artifacts in the first quarter, not strategy documents.

---

## The Strategic Question

Splunk AI Toolkit Agent Builder is in private preview now. Cisco AgenticOps ships in 2026. Cisco Time Series Model v1.0 ships in early 2026. The agentic-template platform is the right bet, the timing is right, and Sonal's team is being built right now.

**The question I want to leave you with: who builds Template #1 — the canonical sophisticated workflow that proves what Agent Builder can do — and how do we make that the network incident commander I've already built and measured?**

That's the role I want.

---

## If You Have More Time — Three Deeper Reads

- **`docs/prd.md`** — full PRD with all architecture, governance, competitive landscape (548 lines, ~30 min)
- **`splunk_evals.ipynb`** — CTSM vs Chronos vs TimesFM benchmark + the 4-priority engineering roadmap (notebook walkthrough, ~20 min)
- **`docs/competitive-landscape.md`** — 25+ vendors, market map, three defensible advantages (~15 min)

---

## Quick Answers to Likely Questions

**Q: "How does Vigil compare to Splunk Agent Builder?"**
> Complementary, not competitive. Agent Builder is the platform that runs templates. Vigil is what one sophisticated, production-grade template looks like — with FSM, RAG, foundation-model forecasting, evaluator, and audit trail. Agent Builder ships the runtime; Vigil ships as the first canonical workflow on it.

**Q: "Why didn't you just build Vigil on Agent Builder?"**
> Agent Builder is in private preview — I didn't have access. I built the workflow architecture that becomes a canonical Agent Builder template once it ships publicly. The MCP-guided pattern, the manifest concept, the human-in-loop confidence routing — all align with where Agent Builder is going.

**Q: "What would you contribute to Agent Builder in the first six months?"**
> Three things. (1) **The first canonical template** — network incident commander, fully measured. (2) **Template authoring standards** — how a sophisticated template should be structured (FSM, RAG, evaluator, audit trail), based on what I learned building Vigil. (3) **Two more templates** in different categories — likely security threat hunting and capacity planning — to seed the ecosystem before public GA.

**Q: "What's the hardest product decision you've made on Vigil?"**
> Pre-triage as rules, not ML. A small classifier might marginally improve recall on edge cases — at the cost of latency, opacity, and adding a training pipeline. I chose rules because **pre-triage is logical filtering, not pattern recognition** — the patterns are articulable, so a model is the wrong tool. Putting a foundation model where rules are correct is the cargo-cult AI thinking Agent Builder's developer SDK should actively discourage.

**Q: "What concerns you most about this strategy?"**
> Cisco Deep Network Model timeline slipping past 2026. The platform's competitive positioning assumes Cisco ships foundation models we can productize. Mitigation: structure everything so the model layer is swappable — that's what Vigil's 3p model abstraction already does. The orchestration and audit-trail layers don't depend on which foundation model is underneath.
