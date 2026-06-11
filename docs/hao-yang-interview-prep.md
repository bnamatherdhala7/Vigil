# Hao Yang Interview Prep
## Splunk Head of AI · Interview with Bharat Namatherdhala

**Stakes:** Highest of the series. Hao leads the data scientists, AI engineers, and PMs Sonal's team reports into. Vigil's PRD cites his published positions extensively — every claim has to land cleanly.
**Goal:** Show that Vigil is a working application of *his* published vision — not generic agent-builder marketing, but a serious technical engagement with the direction he has set.

---

## How to Open the Interview

Cite his work by name in the first 60 seconds. He has been quoted extensively in Vigil's PRD; he should know within a minute that you have read him carefully.

> *"Before I built Vigil, I read your Security Predictions 2026, your CTO blog on domain-specific small language models, and the Cisco Time Series Model launch announcement Sonal and Liang co-authored. Vigil is a working application of the direction you have laid out — pre-triage at zero tokens for the 'needle in the ocean' problem, foundation-model forecasting for the predictive shift, schema-enforced constrained mode as the domain-specific small-model thesis. Mock data for the demo, single-engineer prototype, but every architectural choice traces back to a specific position you've published."*

---

## Hao's Eight Themes Mapped to Vigil

Every theme from his interview transcript with a direct Vigil correspondence.

### 1. "Needle in the Ocean" — Scale Problem

> Hao: *"Terabytes... petabytes of data every day. Needles in the haystack — now needle in the ocean."*

**Vigil's answer:** Phase 2.5 Pre-Triage is the **ocean-filter**. Rules-based, zero tokens, sub-millisecond. **35–40% of alerts suppressed before any model call.** At enterprise scale, that's the only way to make the agentic layer affordable — running the FSM on every alert would burn the compute budget by Tuesday. **Putting a foundation model where rules are correct is exactly the anti-pattern.**

### 2. Cross-Component Correlation Is the Hard Part

> Hao: *"Networks, cloud, databases, SaaS, on-prem — any incident could be triggered by small things elsewhere in your infrastructure. The combinatorial effect... that's where AI needs to help."*

**Vigil's answer:** Splunk MCP (logs) + Cisco Catalyst MCP (topology + telemetry) bridged in **one investigation loop**. The FSM at HYPOTHESIZING explicitly correlates across stacks — *"single source IP > 60% egress → ESCALATING"* needs both Splunk's traffic data AND Cisco Catalyst's topology to fire.

### 3. Predictive, Not Reactive

> Hao: *"Today we're very much still in reactive mode... war room, eyes on you, every second counts. We're using AI assistants to troubleshoot faster — but shouldn't be the case to begin with. AI should tell you 'this part of the system looks shaky right now'."*

**Vigil's answer:** **Phase 4 Proactive Forecasting Layer.** CTSM (point forecast) + Chronos (probability distribution) run continuously, forecasting up to 10 hours ahead. **Three trigger types: THRESHOLD (P50 breach), TRAJECTORY (slow drift), UNCERTAINTY (P90 widens dangerously).** All three fire before the alerting system would have. The False Positive scenario in the war-room UI stays all-green — the model confirms the alert is noise before the FSM runs.

### 4. Can't Pre-Write Playbooks for Modern Infrastructure

> Hao: *"In a manufacturing line, small number of well-defined steps. You can have playbooks for what could go wrong. But in a modern infrastructure with hundreds of different systems, you can't write a playbook for what can go wrong. You have to analyze on the fly, dynamically come up with response plans."*

**Vigil's answer:** The FSM **transitions are deterministic**, but the **tool sequencing within each state is dynamic** — Claude picks which tool to call based on the evidence so far, constrained by the per-state allowlist. The threshold rules at HYPOTHESIZING are pre-defined (single IP > 60%, blast radius, incident memory match) but **novel scenarios default-to-ESCALATING** — that's the *"never guess on live infrastructure"* principle. Pre-defined where pre-definable, dynamic where it has to be.

### 5. "Machines Speak Physics"

> Hao: *"Today's LLMs trained on human language. Machines don't speak that language — machines speak physics. CPU vs memory vs network traffic — very different patterns, but within each category there is its own physics governing how things work."*

**Vigil's answer:** This is exactly the rationale for **time-series foundation models**. CTSM and Chronos are *time-series language models* — same transformer architecture as LLMs, just trained on time-series tokens instead of text. **Vigil benchmarked all three the week CTSM dropped.** CTSM wins on Border Gateway Protocol (MASE 0.80, best in class). Chronos wins on probability calibration (CTSM API blocks CRPS measurement today — Priority 0 in the engineering roadmap). **Different physics for different signals — different models for different physics.**

### 6. Time Series Foundation Models — Zero-Shot, Multiscale

> Hao: *"Today's anomaly detection: everything has to be configured in advance, every device, every metric — prohibitively expensive to maintain. Foundation models do zero configurations — trained on massive data, breadth of knowledge, multiscale analysis."*

**Vigil's answer:** This is exactly the **packet drop weakness in my CTSM benchmark.** CTSM scores MASE 1.27 on packet drop — *worse than naive baseline*. Root cause: CTSM was trained predominantly on smooth observability metrics (CPU, memory, request latency); burst-pattern signals like packet drop are underrepresented. **My Priority 1 in the engineering roadmap is to test CTSM with multiresolution input on real Splunk telemetry — your own architecture's signature feature.** Multiresolution may close the gap with zero training. If it doesn't, Priority 2 is continued pre-training on burst patterns.

### 7. Customize for Customer's Own Data Environment (AI Toolkit)

> Hao: *"No single model works for everyone. We give customers the ability to fine-tune models for their own data. AI Toolkit lets people use the same environment to fine-tune."*

**Vigil's answer:** The Phase 4 feedback loop. **Every investigation produces a labeled training example** — FSM final state + forecast snapshot + actual outcome. 1,000 investigations/day = 180,000 labeled examples in six months covering the customer's specific anomaly signatures. **Base model stays 3p; the labeled corpus is 1p — over time, that corpus is the proprietary moat.** This is Priority 3 in the model evaluation roadmap, gated on having enough labeled history.

### 8. Multi-Agent World — MCP as Open Standard

> Hao: *"In the future, multi-agent world. Specialized agents, general-purpose or specially-built models. Need a unified data layer — single source of truth. And agents interact via open standard like MCP. We're launching Splunk's own MCP servers."*

**Vigil's answer:** **Vigil's orchestrator pattern is exactly this.** Foundation-model agent (Claude today, Cisco Deep Network Model at GA) sits at the top. **Vigil MCP** is the orchestrator — manifest tells the agent which tools to call. Downstream: Splunk MCP + Cisco Catalyst MCP + any other MCP. **Vigil doesn't call Splunk MCP — the agent does.** Multi-agent ready: each future agent (threat hunter, capacity planner, compliance auditor) is another template that reuses the same orchestrator pattern.

---

## Anticipated Questions — Hao-Specific

These are the questions Hao is most likely to ask, with prepared answers.

### Q1: "Why did you choose CTSM as your primary forecaster?"

> "Three reasons. First, my benchmark: CTSM wins on Border Gateway Protocol — MASE 0.80, the highest-stakes network signal for incident detection. Second, CTSM was trained on the right data — 300B+ datapoints, observability-tuned. Third, it's open-weights — self-hostable on customer GPUs, no Application Programming Interface dependency. The one limitation today is the public API returns point forecasts only — quantile outputs are architecturally there per the launch blog Sonal and Liang co-authored. **That's a one-hour API change on Cisco's side that I've filed as Priority 0 in my model-evaluation roadmap.** Until that ships, I use Chronos for the probability distribution. The hybrid disappears the day Cisco ships the API."

### Q2: "Where does your packet drop weakness come from? How would you fix it?"

> "Training data gap. CTSM is trained predominantly on smooth observability metrics — CPU, memory, request latency. Burst-pattern signals like packet drop are underrepresented. The fix follows your own playbook: **continued pre-training on burst-pattern data.** Same move Cisco made to build CTSM from TimesFM — add observability data on top of the base model. **My Priority 2 in the engineering roadmap: generate 100K burst-pattern series, format as multiresolution pairs, run continued pre-training from CTSM's open-weights checkpoint.** But before that, **Priority 1** is to test whether multiresolution input alone closes the gap — your architecture's signature feature, which the benchmark didn't exercise because the synthetic series weren't structured with both resolutions. Real Splunk telemetry has both."

### Q3: "How would you scale this to 100K alerts per day?"

> "Three levers in series. **Pre-triage filters 35–40% at zero tokens** — that's the ocean-filter, sub-millisecond. **Schema enforcement on the remaining 60% delivers 0.91 precision at 57% lower tokens** than unconstrained. **Then prompt caching plus Haiku tiering for routing states** drops production cost per investigation from $0.056 to ~$0.012 — 80–85% off. At 100K alerts/day, that's roughly $4.4M/year saved versus unconstrained baseline. **Unit economics is the gate. If pre-triage was an ML classifier instead of rules, the whole stack breaks at scale — every alert burns inference cost.**"

### Q4: "How would you contribute to AI Toolkit / Agent Builder?"

> "Three deliverables, all customer-facing, in Q1. **Template #1**: Vigil itself published in the Agent Builder registry — network incident commander, fully measured, customer reference. **Template authoring standards**: documentation of what a sophisticated template should look like — Finite State Machine plus Retrieval-Augmented Generation plus evaluator plus audit trail — so the community can ship templates against the same standard. **Two more templates**: security threat hunting and capacity planning, in adjacent categories, measured against the same benchmark framework as Vigil. **My discipline: shipped artifacts in the first quarter, not strategy documents.** The point of having me on the team is to seed the template ecosystem before public GA."

### Q5: "What did you learn from building this that surprised you?"

> "Two things. **One: TimesFM is unusable for Border Gateway Protocol forecasting.** MASE 1.14 — worse than copying yesterday's value forward. That's a non-obvious finding that should warn the Splunk team away from generic time-series foundation models — domain matters, observability-tuned matters. **Two: schema enforcement does more work than I expected.** I went in thinking the precision lift would come from fine-tuning. It came from prompting. 0.55 → 0.91 with zero training. That's the most important lesson for Agent Builder's developer SDK: **make schema enforcement the default, not the optimization.**"

### Q6: "What worries you most about the strategy?"

> "Cisco Deep Network Model timeline slipping past 2026. The platform's competitive positioning assumes Cisco ships foundation models that we productize. If that slips, we either wait, partner with Anthropic and Google more deeply to fill the gap, or invest in our own training — out of scope for an application-layer company. **Mitigation: structure the platform so the model layer is swappable.** Vigil's 3p model abstraction already does that — orchestration and audit-trail layers don't depend on which foundation model is underneath. Schema enforcement preserves the precision contract across the swap."

### Q7: "What's your view on conversational follow-ups for agents?"

> "Vigil's audit trail already enables it. The FSM produces a structured JSON record per investigation — every transition, every tool call, every retrieval, every confidence score. A conversational follow-up reads from that record, surfaces the specific evidence the user asks about, never re-runs the underlying tools. **The compound value: same record, multiple conversations — SRE asks one question, manager asks another, security asks a third, all grounded in the same auditable JSON.** That's where Agent Builder's value compounds beyond what a chatbot can do."

---

## Phrases to Use — Hao's Own Language

When you cite his framings, use his exact phrases. They're memorable to him and they signal you've read him carefully.

| Hao's phrase | Where to drop it |
|---|---|
| *"Needle in the ocean"* | When explaining pre-triage's job |
| *"Machines speak physics"* | When explaining why time-series foundation models exist |
| *"Better together"* | When explaining the Splunk + Cisco data integration |
| *"AI to enable people to do more"* | When framing the FSM's human-in-loop |
| *"Multiscale analysis... unit of thinking"* | When discussing CTSM's multiresolution feature |
| *"Open standard like MCP"* | When discussing the orchestrator pattern |
| *"No single model works for everyone"* | When discussing customer-specific fine-tuning |

---

## What to AVOID

| Don't say | Why |
|---|---|
| "Vigil is better than Splunk's AI Toolkit" | Toolkit is *his* product. Vigil is a template that runs on it. |
| "Cisco Time Series Model has weaknesses" without immediately following with the fix | The weakness IS Sonal's product. Lead with the roadmap to address it. |
| "I'd rebuild Agent Builder if I joined" | Implicit critique of his team. Position as additive. |
| "Foundation models will replace [X traditional ML]" | He's nuanced — *"large reasoning models + frontier time series models all putting together"*. Don't oversimplify. |
| "Mock data" repeated more than twice | Acknowledge once at the start. Then talk about the architecture as real (because it is). |

---

## PRD Enhancements I'd Recommend Based on the Interview

Three targeted additions to align Vigil's PRD more tightly with Hao's published positions. All small, all high-signal.

### 1. Add a "Needle in the Ocean" framing to the Pre-Triage section

The PRD's Pre-Triage description says "suppress 35–40% at zero tokens." Hao's framing is bigger: **scale problem, ocean filter.** A one-sentence addition aligning with his published language would land.

### 2. Add a "Machines speak physics" framing to the Foundation-Model section

The PRD describes CTSM and Chronos as "time-series language models — same transformer architecture as LLMs, trained on time-series tokens instead of text." That's correct but generic. Adding Hao's *"machines speak physics"* framing makes it sound less like a stock description and more like an engaged engagement with his thinking.

### 3. Add multi-agent / template ecosystem to The Bottom Line

Hao explicitly frames the future as a *"multi-agent world... specialized agents working together via MCP."* The Bottom Line currently closes on the AI Canvas + DNM swap story. Adding a sentence about the multi-agent template ecosystem closes the loop with his framing.

**My recommendation:** Apply these three small enhancements before the interview. Roughly 15 minutes of editing, high-signal alignment with the most-cited author in the PRD.

---

## Application Recommendation

**No application changes needed for this interview.** Hao is the architect of the strategy — he's evaluating product thinking, not UI polish. The PRD enhancements above are higher-leverage uses of prep time than any visual change.

If asked about the demo specifically: walk through the existing war-room UI, emphasize the **Forecast Strip** (proactive forecasting) and the **Full Trace overlay** (audit trail). Those are the two visuals that map directly to his framings.

---

## Pre-Interview Checklist

- [ ] Read this prep doc end-to-end once cold
- [ ] Re-read the Hao Yang interview transcript with this doc next to it — verify every claim
- [ ] Re-read `splunk_evals.ipynb` Key Findings section once
- [ ] Have `docs/prd.md` (10-min) open on second monitor as the demo doc
- [ ] Have `splunk_evals.ipynb` open for the model evaluation deep-dive if asked
- [ ] Apply the three PRD enhancements if you have time
- [ ] Phone on Do Not Disturb
- [ ] One sentence of intro practiced cold: *"I read your Security Predictions 2026 and the CTSM launch blog..."*
- [ ] The closing line: *"I want to build Template #1 for AI Toolkit and seed the template ecosystem before public GA."*
