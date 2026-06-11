# Hao Yang Interview Prep — Comprehensive Playbook
## 30-Minute Conversation with Splunk's Head of AI

**Format:** 30-minute strategic conversation (not a demo)
**Audience:** Hao Yang — leads data scientists, AI engineers, and PMs · architect of Splunk's AI direction
**Goal:** Demonstrate peer-level strategic engagement with the direction he has published, not feature-walkthrough thinking
**Approach:** Talk strategy, keep `splunk_evals.ipynb` open as the one fallback artifact

---

## What Hao Is Actually Evaluating

He has hired many PMs. He knows the patterns. In 30 minutes he is looking for four signals:

| Signal | What It Looks Like in Conversation |
|---|---|
| **Can you have a peer-level AI strategy conversation?** | You answer with specifics, not buzzwords. You cite your own benchmark numbers when relevant. You acknowledge what you don't know honestly. |
| **Have you engaged with his published work specifically?** | You quote him back at him. You extend his frameworks ("you said machines speak physics — does that apply to logs as a different modality?"). You reference Sonal + Liang's launch by name. |
| **Do you think like a PM at AI Foundations level?** | You think in platform / template / ecosystem, not features. You think in unit economics. You think in defensibility (data moat, customer fine-tuning, MCP standards). |
| **Are you someone Sonal's team would want to work with?** | You ask substantive questions back. You're confident but not combative. You acknowledge gaps in your prototype before he points them out. You're additive, not competitive. |

---

## 30-Minute Conversation Structure

This is the realistic shape — adjust if he steers differently.

| Block | Minutes | What Happens |
|---|:-:|---|
| Pleasantries + context | 2–3 | Hellos · he sets the frame ("I have 30 min, walk me through what you've built / what brings you here") |
| **Your opening citation + thesis** | 1–2 | The scripted opening below — name his work, state thesis, propose agenda |
| **Strategic back-and-forth (his lead)** | 15–18 | This is the real evaluation. Topics will be his choice. Be ready to go deep on any of the eight themes |
| **Notebook reference (if asked)** | 3–4 | CTSM benchmark + engineering roadmap — only if he asks "show me what you built" |
| **Your questions to him** | 3–5 | Two or three well-aimed questions — most important section after his lead |
| Wrap | 1 | Logistics, next steps |

**You drive maybe 3–5 minutes total.** The other 25 minutes is him leading. **Your job is to make every answer substantive, every question peer-level.**

---

## The Opening — Word-by-Word (40 seconds)

Memorize this. It should land smoothly on the first try.

> *"Thanks for the time. Before I built Vigil, I read your Security Predictions 2026 — your line about MTTR becoming a snapshot of how late we were — your CTO blog on domain-specific small language models, and the Cisco Time Series Model launch announcement Sonal and Liang co-authored. Vigil is a working application of that direction: pre-triage as the needle-in-the-ocean filter at zero tokens, CTSM and Chronos for foundation-model forecasting, schema enforcement as the domain-specific small-model thesis — 0.91 precision with no fine-tuning. Mock data, single-engineer prototype, but every architectural choice traces back to something you've published. I figured the more useful conversation is your questions and how I'd think about your roadmap — not a demo walkthrough. Where would you like to start?"*

**Why this works:**
- Cites three of his specific publications by name in the first 15 seconds
- States the thesis (working application of his direction)
- Acknowledges what's mock up-front (credibility deposit)
- Hands him the steering wheel — "where would you like to start?"
- **No demo offered.** That's deliberate.

---

## Strategic Topics to Prepare in Depth

Hao might steer to any of these. Be ready to talk for 3–5 minutes on each.

### A. Time-Series Foundation Models (highest probability)

This is his core technical area. Be ready to discuss:

- **Architecture lineage:** CTSM extends TimesFM (decoder-only transformer, multiresolution); Chronos uses T5 encoder-decoder treating time-series as tokenized "language"; both are transformer foundation models from the same family as LLMs
- **Your benchmark findings:** CTSM 0.967 overall MASE (wins), but **packet drop is 1.27 — worse than naive baseline** because burst-pattern signals are underrepresented in CTSM training
- **Your four-priority roadmap to address gaps** (the one in `splunk_evals.ipynb` cell 61):
  - P0: Cisco exposes quantile outputs via API (1 hour fix on their side, unblocks Continuous Ranked Probability Score)
  - P1: Test CTSM with multiresolution input on real Splunk telemetry (your architecture's signature feature)
  - P2: Continued pre-training on burst-pattern data
  - P3: Supervised fine-tuning on labeled Splunk incident windows (the customer-data moat)
- **Why hybrid CTSM + Chronos today:** necessity until Cisco exposes quantiles, not preference

### B. The Multi-Agent / MCP-Standard Future

His explicit framing in the interview transcript. Be ready to discuss:

- **Why MCP as open standard wins:** vendor lock-in is the failure mode for agent platforms; MCP makes Splunk Agent Builder additive to existing customer infrastructure rather than replacement
- **Vigil's orchestrator pattern:** foundation-model agent at the top, Vigil MCP in the middle holding the manifest, Splunk MCP + Cisco Catalyst MCP + any-other-MCP at the bottom
- **Why "Vigil doesn't call Splunk MCP — the agent does":** client-side orchestration matches AEM Skills MCP pattern in production
- **What multi-agent will actually look like:** specialized templates (Vigil = network incident commander, Template #2 = threat hunting, Template #3 = capacity planning) all coordinating through MCP via the same orchestrator pattern

### C. Predictive vs Reactive Operations

His explicit framing — "shouldn't be the case to begin with that we're reactive." Be ready to discuss:

- **Why forecasting changes the unit of work:** today's SOC chases alerts; tomorrow's SOC reviews predictions
- **The three trigger types Vigil ships:** THRESHOLD (P50 breach), TRAJECTORY (slow drift), UNCERTAINTY (P90 widens — *the widening uncertainty itself is the signal*, no statistical-anomaly competitor has this)
- **Lead time:** Vigil's forecast triggers fire up to 18 minutes before the alert system would have
- **The False Positive scenario as proof:** forecast stays all-green, alert suppressed before FSM runs — model confirms the alert is noise before any reasoning happens

### D. Customer-Specific Fine-Tuning + AI Toolkit

He's clear: *"No single model works for everyone."* Be ready to discuss:

- **Vigil's feedback loop:** every investigation = labeled training example (FSM final state + forecast snapshot + actual outcome)
- **180,000 labeled examples in six months** at 1K investigations/day — the customer-specific anomaly signature corpus
- **The moat dynamic:** base CTSM stays third-party; the labeled corpus is first-party; over time, the corpus is the moat
- **AI Toolkit fit:** "expanding ML Toolkit to AI Toolkit" — Vigil's feedback corpus is exactly the kind of fine-tuning data the AI Toolkit interface is built around

### E. Scale + Unit Economics

His "needle in the ocean" framing. Be ready to discuss:

- **Pre-triage as the ocean filter:** 35–40% of alerts dropped at zero tokens, sub-millisecond — *not* an ML classifier (that breaks at 100K alerts/day on cost alone)
- **Three cost levers stacked:** schema enforcement (57% off) + prompt caching (90% discount on cached tokens) + Haiku tiering for routing states + Sonnet for HYPOTHESIZING = $0.012 per investigation
- **At 10K alerts/day:** $620K/year saved vs unconstrained
- **At 100K alerts/day:** $6.2M/year saved — and this is where the "rules where rules are correct" decision pays off most

### F. What Belongs in Splunk vs. What Belongs Outside

Hao's instinct: *"Splunk is platform agnostic, ingest all data, datadriven."* Be ready to discuss:

- **What stays inside Splunk's compliance boundary:** Splunk MCP, Pinecone (or self-hosted Qdrant), the audit-trail JSON
- **What lives outside:** foundation-model inference (Claude / Cisco DNM), MCP servers for non-Splunk tools (ServiceNow, PagerDuty)
- **The RBAC passthrough:** Vigil inherits Splunk user permissions, no privilege escalation
- **Why this matters:** Splunk Agent Builder's main differentiator vs external agent studios is exactly this — runs inside compliance boundary

---

## Anticipated Questions — His → Yours

Twelve questions ranked by likelihood. Memorize answers to the first six.

### Most Likely (prepare verbatim)

**Q1 — "Why did you choose CTSM as primary forecaster?"**
> "Three reasons. My benchmark shows CTSM wins on Border Gateway Protocol — MASE 0.80, the highest-stakes signal for network incident detection. It's trained on the right data — 300B+ datapoints, observability-tuned. And it's open-weights, self-hostable on customer GPUs. **The one limitation today is the public API returns single point forecasts — quantile outputs are architecturally there per the launch blog Sonal and Liang co-authored. That's a one-hour API change on Cisco's side, filed as Priority 0 in my engineering roadmap.** Until that ships, I use Chronos for the probability distribution. The hybrid disappears the day Cisco ships the API."

**Q2 — "Where does the packet drop weakness come from? How would you fix it?"**
> "Training data gap. CTSM is trained on smooth observability metrics — CPU, memory, request latency. Burst-pattern signals like packet drop are underrepresented. **Fix follows your own playbook: continued pre-training on burst-pattern data** — same move Cisco made to build CTSM from TimesFM. **But before that, Priority 1 is testing multiresolution input on real Splunk telemetry** — your architecture's signature feature, which my benchmark didn't exercise because the synthetic series weren't structured with both resolutions. Multiresolution may close the gap with zero training. If not, Priority 2 generates 100K synthetic burst-pattern series for continued pre-training from CTSM's open-weights checkpoint."

**Q3 — "How would you scale Vigil to 100K alerts per day?"**
> "Three levers in series. Pre-triage filters 35–40% at zero tokens, sub-millisecond — the ocean filter. Schema enforcement on the remaining 60% delivers 0.91 precision at 57% lower tokens. Then prompt caching plus Haiku tiering for routing states drops per-investigation cost from $0.056 to ~$0.012 — 80–85% off. **At 100K alerts/day that's roughly $6.2M annual saving versus unconstrained baseline.** Unit economics is the gate. If pre-triage was an ML classifier instead of rules, the whole stack breaks at scale — every alert burns inference cost."

**Q4 — "How does Vigil fit AI Toolkit / Agent Builder?"**
> "Vigil is what a sophisticated template should look like — FSM, RAG, evaluator, audit trail, foundation-model forecasting. **Three of Agent Builder's announced roadmap items already shipped in Vigil: template ecosystem (Vigil is Template #1), human-in-loop approvals (FSM confidence-band routing), broader MCP integration (Splunk + Cisco Catalyst).** Four remaining items — native SPL invocation, plain-English goal definition, compliance-boundary execution, conversational follow-ups — are exactly the integration work I want to do with the team."

**Q5 — "What surprised you building this?"**
> "Two things. First, **TimesFM is unusable for Border Gateway Protocol** — MASE 1.14, worse than copying yesterday's number forward. That's a finding the team should know about — generic time-series foundation models don't work; observability-tuned matters. Second, **schema enforcement does more work than I expected**. I went in thinking precision lift would come from fine-tuning. It came from prompting — 0.55 to 0.91 with zero training. **The lesson for the developer SDK: make schema enforcement the default, not the optimization.**"

**Q6 — "What worries you most about the strategy?"**
> "Cisco Deep Network Model timeline slipping past 2026. The competitive positioning assumes Cisco ships foundation models we can productize. If it slips, three options — wait, partner with Anthropic and Google more deeply, or invest in our own training (out of scope at this level). **Mitigation: structure the platform so the model layer is swappable.** Vigil's 3p model abstraction already does that — schema enforcement preserves the precision contract across the swap."

### Probable (have answer ready)

**Q7 — "What's your view on conversational follow-ups for agents?"**
> "Vigil's audit trail already enables it. FSM produces a structured JSON record per investigation — every transition, every tool call, every retrieval, every confidence score. Conversational follow-up reads from that record, surfaces specific evidence the user asks about, never re-runs tools. **Compound value: same record, multiple conversations — SRE asks one question, security asks another, manager asks a third, all grounded in the same auditable JSON.** That's where Agent Builder's value compounds beyond chatbot."

**Q8 — "Why a Finite State Machine, not LangGraph or free-form agent?"**
> "Auditability. Every SUPPRESSED, REMEDIATING, ESCALATING decision cites the threshold rule that fired — not LLM judgment. Free-form frameworks give you the workflow primitive but the LLM controls transitions; on live network infrastructure that's the wrong default. **The FSM enforces a senior engineer's investigation methodology consistently — and when AI Canvas ships, the FSM maps to a Canvas template with no rewrite.**"

**Q9 — "How do you decide what's a rule versus what's a model?"**
> "Logical filtering versus pattern recognition. Pre-triage answers 'did three corroborating signals fire or just one repeating one?' That's articulable if-then logic. Foundation models earn their cost when patterns can't be articulated. **Putting a model where rules are correct is cargo-cult AI — exactly the anti-pattern an AI Toolkit developer SDK should actively discourage.**"

### Possible (prep one line)

**Q10 — "What did you not build, and why?"**
> "Native SPL invocation. Agent Builder is private preview, so I didn't have access. I built the workflow architecture that becomes a template once Agent Builder ships publicly."

**Q11 — "How would you measure success for the platform?"**
> "Three KPIs. Adoption depth — investigations per customer per day, percent of alerts touched by templates. Outcome quality — suppression rate, autonomous triage precision, audit-trail completeness. Ecosystem velocity — templates in the registry, time from skill submission to availability. **MTTR is downstream — outcome-based measures lead, per your own 2026 predictions.**"

**Q12 — "First 90 days at Splunk?"**
> "Weeks 1–4: read every State of Security and Observability report; sit in on Agent Builder design partner calls; one-pager on top 5 jobs-to-be-done for the template ecosystem. Weeks 5–8: identify three highest-leverage template categories. Weeks 9–12: ship one visible win — Vigil itself as canonical Template #1, plus framework documentation for community contributions. **Shipped artifacts in the first quarter, not strategy documents.**"

---

## ★ Questions YOU Should Ask Hao — The Most Important Section

Senior interviews are evaluated as much on the questions you ask as the answers you give. **Have five questions ready, ask two or three depending on time.** Order them by priority — ask your strongest first.

### Tier 1 — Ask If You Only Have Time for One

**Q1 — "What is the hardest unresolved technical problem your team is working on right now that you'd want a new PM to engage with on day one?"**

This question does five things at once:
- Signals you want to be additive, not duplicative
- Invites him to talk shop at peer level
- Surfaces what he actually values
- Tests whether the role has real product autonomy
- Gives you a research thread for any follow-up rounds

### Tier 2 — Strong Substantive Questions

**Q2 — "You said in the interview that machines speak physics, not human language — different patterns for CPU, memory, network traffic. How does that thinking apply to non-time-series modalities like logs or traces? Is there a 'physics of logs' equivalent that would need its own foundation model?"**

Extends his framework, shows you've read him carefully, and asks a genuinely interesting question about the AI Toolkit's coverage strategy.

**Q3 — "My CTSM benchmark shows packet drop scoring 1.27 MASE — worse than naive baseline — because burst-pattern signals are underrepresented in training data. How is your team thinking about coverage for burst-pattern observability signals? Is that a continued pre-training problem, a multiresolution input problem, or something else?"**

Directly engages with his domain expertise on a specific, verifiable finding from your work. Shows technical depth + product judgment in the same question.

**Q4 — "What's the most important anti-pattern the Agent Builder developer SDK needs to actively discourage as customers and partners ship templates? What's the cargo-cult AI thing you worry about most?"**

Shows you think about ecosystem health, not just feature shipping. Likely to spark a real conversation about template authoring standards (which is part of what you'd contribute).

### Tier 3 — Strategic Bets

**Q5 — "Six months from now, when Agent Builder ships publicly, what does 'this is working' look like? What metric would tell you the template ecosystem has product-market fit versus stalling?"**

Tests his own framing of success — gives you a clear definition of what your job would be if hired.

**Q6 — "Cisco AI Canvas and Splunk Agent Builder are both shipping in 2026. How do you see the boundary between them evolving as both mature — is there a clean separation, or do you expect overlap that needs resolving?"**

Asks the hardest strategic question in the room. Only ask if conversation is going great and you have rapport. If asked, listen carefully — his answer reveals how he thinks about the Cisco partnership at the org level.

### Tier 4 — Tactical / Role-Specific

**Q7 — "Which of your design partners would you want a new PM spending time with first — and why those specifically?"**

Practical question, gets you intel on the customers driving the roadmap, signals you'd hit the ground running.

**Q8 — "What's the most common failure mode for PMs joining this team in their first six months?"**

Direct question, invites him to be honest about pitfalls. Shows you're thinking about how to succeed, not just whether to take the role.

### Questions to AVOID Asking

| Don't ask | Why |
|---|---|
| "How big is the team?" | Public information, signals you didn't research |
| "What's the comp range?" | Recruiter territory, not interviewer |
| "Tell me about the company culture" | Generic, low-signal |
| "What's your favorite thing about working here?" | Reverses the evaluation, you should be running the question |
| Anything that could have been Googled | Wastes scarce interview time |
| "Will I be working with Sonal directly?" | Org chart question, ask the recruiter |

---

## Hao's Eight Themes Mapped to Vigil

For each theme he raised in his interview, Vigil has a direct correspondence. Be able to switch to any of these in a conversation.

| Hao Theme | Vigil's Answer (one line) |
|---|---|
| Needle in the ocean (scale) | Pre-triage filters 35–40% at zero tokens before any model call |
| Cross-component correlation | Splunk MCP + Cisco Catalyst MCP in one investigation loop |
| Predictive, not reactive | Phase 4 forecast triggers up to 18 minutes ahead of alerts |
| Can't pre-write playbooks | FSM transitions deterministic but tool sequencing dynamic; novel cases default-to-escalate |
| Machines speak physics | CTSM + Chronos are time-series language models; different physics → different models per signal |
| Foundation models zero-shot + multiscale | CTSM Priority 1 is multiresolution input on real Splunk telemetry |
| Customer-specific fine-tuning | Feedback loop produces labeled corpus — 180K examples in six months |
| Multi-agent + MCP open standard | Vigil's orchestrator pattern; foundation-model agent at top, Vigil MCP middle, MCPs at bottom |

---

## Phrases to Use — His Own Language

Drop his exact phrases at the right moments. Recognition signals.

| His phrase | Where to use it |
|---|---|
| *"Needle in the ocean"* | Explaining pre-triage's job |
| *"Machines speak physics"* | Time-series foundation models' rationale |
| *"Better together"* | Splunk + Cisco data integration |
| *"AI to enable people to do more"* | Human-in-loop framing |
| *"Multiscale analysis... unit of thinking"* | CTSM multiresolution feature |
| *"Open standard like MCP"* | Orchestrator pattern |
| *"No single model works for everyone"* | Customer-specific fine-tuning |
| *"Snapshot of how late we were"* | MTTR replaced by outcome metrics |

---

## What to AVOID

| Don't say | Why |
|---|---|
| "Vigil is better than Splunk's AI Toolkit" | AI Toolkit is HIS product. Vigil is a template that runs on it. |
| "CTSM has weaknesses" without immediately following with the roadmap fix | The weakness is Sonal's product. Lead with the fix. |
| "I'd rebuild Agent Builder if I joined" | Implicit critique of his team. Position as additive. |
| "Foundation models will replace [X]" | He's nuanced — *"LLMs + reasoning models + frontier time-series models all putting together"*. Don't oversimplify. |
| "Mock data" repeated more than twice | Acknowledge once at the start. Then talk about architecture as real (because it is). |
| "I think the team should..." | You're not on the team yet. Frame as questions: "How does the team think about X?" |
| Walking through the war-room UI uninvited | He's evaluating strategy, not features. Skip the demo. |

---

## The 24-Hour Sprint — Hour-by-Hour Prep

If the interview is tomorrow.

| Time | What to Do |
|---|---|
| **T−24h** | Read this entire prep doc once, end to end. Read Hao's interview transcript once. |
| **T−20h** | Read the Director Brief (`docs/director-brief.md`) once cold. |
| **T−12h** | Re-read `splunk_evals.ipynb` Key Findings + Engineering Roadmap (the bottom sections). Time yourself — should be 15 minutes max. |
| **T−6h** | Practice the opening (40 seconds) twice out loud. **Not silently — out loud.** |
| **T−4h** | Practice answering Q1 (CTSM choice) and Q2 (packet drop weakness) out loud. Time each — aim for 60 seconds per answer. |
| **T−2h** | Print or screenshot your three Tier-1 questions to Hao. You will forget them otherwise. |
| **T−1h** | Phone on Do Not Disturb. Close Slack. Re-read his interview transcript one more time. |
| **T−30m** | Open the four tabs (notebook · Director Brief · this doc · war-room UI). Do not look at them again until the call. |
| **T−15m** | Glass of water. Stop reading. Walk around. |
| **T−5m** | Open the call link. Smile. |

---

## What to Have Open During the Call

| Tab | Purpose |
|---|---|
| `splunk_evals.ipynb` | The one artifact you might share — only if asked |
| `docs/hao-yang-interview-prep.md` (this doc) | Glance at the Questions-to-Ask list during a pause |
| `docs/prd.md` (10-min version) | If he asks for a written summary |
| Vigil war-room UI | **Closed.** Do not show unless he explicitly asks for a demo. |

---

## Closing the Conversation

In the last 2 minutes, do these three things:

1. **Ask one substantive question** (from your Tier 1 list) if you haven't yet
2. **Land your closing line:**
> *"I built Vigil as the canonical first template for the world you're describing. The role I want is to ship Template #1 publicly, define what good looks like for the template ecosystem, and seed it before Agent Builder GA. That's exactly the work you're set up to do here."*
3. **Ask about next steps** — "What's the next stage of the process, and what should I prepare for?"

Don't ramble in the wrap. Two minutes max. End early if you have to.

---

## The One Thing to Remember

**Hao is evaluating whether you can have a peer-level AI strategy conversation, not whether you can demo features.** Every answer should be substantive, every question should be peer-level, every reference should be specific. The candidates who get hired at his level are the ones who treated the interview as a conversation, not a presentation.

Talk strategy. Have the notebook open as your safety net. Skip the UI. Ask the questions you've prepared.

You've done the work. The interview is just where you let him see it.
