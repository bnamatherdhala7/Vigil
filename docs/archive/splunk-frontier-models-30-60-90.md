# 30 / 60 / 90 Day Plan — Splunk Frontier Models Team

> **Context.** Joining the Splunk frontier-models team, working on log reasoning, time-series forecasting, and observability foundation models. Previous depth: agentic systems, retrieval, evaluator design (Vigil). Coming into a research-adjacent product team where the deliverable is *models that other Splunk products consume*, not end-user features.
>
> The three phases are **absorb → own → lead**. Each phase has a specific measurable outcome, not just activities.

---

## Guiding Principles

Five anchors that decisions get judged against for the first 90 days:

1. **Ship something small in the first two weeks.** A one-file bug fix, a benchmark improvement, a doc PR. Establishes credibility and reveals the review + deploy loop before you need to move something ambitious through it.
2. **Learn the eval infra before proposing new models.** In a frontier-models team, the eval harness is the reasoning artifact. Anyone can gesture at a model idea; someone who deeply understands the eval harness can ship one.
3. **Assume every dataset has a governance story.** Splunk's data is customer telemetry. Any training data question — provenance, PII handling, tenant isolation — is a real question, not a paperwork question. Learn who to ask and what the answer usually looks like *before* you propose an experiment that needs new data.
4. **Prefer measurable improvements to novel architectures.** The team likely already has "let's try Model X" ideas queued. A 3% improvement in an existing metric with a defensible cause is more valuable in month one than a shiny alternative approach.
5. **Show your work.** Every experiment produces a written artifact — a doc, a wiki page, a Notion note — that outlasts the Slack conversation. Six weeks in, when someone says "did we ever try Y?", they should be able to find your answer.

---

## Days 1–30 — Absorb

### Codebase & Team

- **First week:** repo tour with the person who reviews your first PR. Read the top-level READMEs of every repo the team owns before touching any file.
- Identify the **five people** you'll interact with most weekly (usually: manager, tech lead, adjacent-team PM, data lead, one senior IC). Book recurring 1:1s in week one; do not wait for them to schedule.
- Attend every recurring meeting for the first month — even the ones that "won't apply to your work." Presence in month one is how you learn who owns what.
- Read the last **six months** of team announcements, design docs, and post-mortems. Write down every acronym you don't recognize and ask.

### Model Portfolio & Roadmap

Understand the full portfolio before proposing anything:
- What models are **in production** (shipped, running against customer data)?
- What's in **R&D / evaluation** (not shipped, being measured)?
- What's on the **6-month roadmap** — and importantly, what's *not* on it that senior people wish were?
- Where does the team's work meet **Splunk AI Toolkit / Splunk AI Assistant / SPL Copilot / SAIA**? These are the downstream consumers.

### Data Pipeline & Eval Infra

The single most important thing to internalize this month:

- **Where does training data come from?** Real customer data, synthetic, licensed, public? Under what governance?
- **How is quality measured?** What are the offline benchmarks? What are the online metrics?
- **What eval harnesses exist?** Get one of them running end-to-end on your laptop by day 15.
- **What's the failure mode?** Read the last three "the model got worse in production" investigations. Every team has some.

### Reading List (Foundation Time-Series & Log Reasoning)

Don't try to read all of these in month one — pick 4–5, deep-read them:

**Time-series foundation models (Splunk's forecasting angle):**
- Chronos (Amazon Science, 2024) — zero-shot forecasting via LLM tokenization
- Moirai (Salesforce, 2024) — universal forecasting with multi-scale patching
- TimesFM (Google, 2024) — 200M-parameter time-series foundation model
- Lag-Llama (ServiceNow, 2024) — probabilistic time-series with LLaMA architecture
- Cisco Time Series Model announcement (2025) — competitor / partner context

**Log reasoning / semi-structured text:**
- LogPPT (2023) — prompt-based log parsing
- LogGPT, DivLog, LILAC — recent log parsing benchmarks
- BigLog (Huawei, 2024) — foundation model for log analytics
- Splunk's own SPL/log analysis papers if any have been published

**Observability foundation models context:**
- Recent Splunk AI announcements + `.conf` talks from the last two events
- Datadog Bits AI + AWS Q Developer for competitive framing
- Foundation-model-for-observability positioning papers (Grafana, Chronosphere, New Relic)

### Signals This Phase Is Working

- You can explain the team's model portfolio to an outsider in 5 minutes
- One PR merged
- Every recurring 1:1 has a running notes doc
- You've caught yourself asking a question that would have been better asked in month one — that's the signal you're absorbing

---

## Days 31–60 — Own

### Take Component Ownership

Pick **one** deliverable to own end-to-end. Best candidates:

- A specific eval / benchmark harness that's under-loved
- A data-quality dashboard for a training pipeline
- One evaluation dimension for an existing model (e.g., calibration for the time-series forecaster)
- A regression suite for a model release

The criterion: something that (a) needs owner attention, (b) doesn't have a strong current owner, (c) is small enough to make measurable progress on in 30 days, and (d) touches the metrics the team already cares about.

**Anti-pattern:** owning a project that's *not* on the team's roadmap. Owning something the team ignores is worse than not owning anything — it advertises misalignment.

### Ship One Real Improvement

By day 60, ship one non-trivial change with a measured outcome:
- "Improved calibration on the forecaster's P90 predictions by X%" — with the before/after eval numbers
- "Reduced the eval harness runtime from N hours to M minutes"
- "Added Y benchmark to our regression suite, caught Z bugs in the last release"

Publish the numbers in a written doc, tagged for the team.

### Cross-Team Relationships

- Meet the **Splunk AI Toolkit / Assistant / SAIA** team leads. Understand what they need from your team's models.
- Meet the **Observability Cloud + ITSI + IT Service Intelligence** counterparts — they're often the biggest downstream consumers of time-series models.
- Meet the **security research** team if log-reasoning models are touching security data.
- Aim for 15 min introductions, not deep-dives. Goal is knowing who to page, not becoming their peer.

### Signals This Phase Is Working

- Manager can point to "the person who owns X" and mean you
- Two PRs merged into a service other than your primary component
- You've been invited to a meeting you didn't schedule yourself
- You've written one doc that a peer bookmarked or forwarded

---

## Days 61–90 — Lead

### Own a Workstream End-to-End

Take one initiative from **proposal → experiment → evaluation → handoff-to-prod-or-decommission**. This is the difference between "I fixed a bug in the eval harness" (month 2 outcome) and "I ran the calibration-improvement workstream that shipped to prod in Q4" (month 3 outcome).

Success criteria for your workstream doc:
- **Problem statement** that a senior IC agrees is worth solving
- **Success metric** with a specific target
- **Baseline number** measured *before* changes
- **Experiment plan** with a decision point (ship / kill / iterate)
- **Post-mortem** at the end, whether it shipped or didn't

### Author a Design Doc for a Q4+ Initiative

Not something you'll implement in month three — something you're *proposing* for the next quarter. This is how you graduate from "shipping ticket work" to "shaping team direction."

Structure:
- One-paragraph problem
- Why now (external + internal drivers)
- Proposed approach (with alternatives considered)
- Cost estimate (person-weeks + compute)
- Risk register
- Ask (specific: 2 engineers for 6 weeks, or budget for X GPUs, or air cover for a customer conversation)

Circulate at week 10. Iterate on feedback in weeks 11–12. Land as a decision in week 13.

### Establish Signature Area

By day 90, you should be the **go-to person** for one specific thing:
- "Ask Bharat about time-series calibration"
- "Ask Bharat about the log-reasoning eval harness"
- "Ask Bharat about our SPL copilot benchmarks"

Signature areas are earned, not claimed. If people are already routing questions to you at day 90, you're there. If not, don't force it — pick a smaller thing next quarter.

### Set 6-Month Goals with Your Manager

By day 85, have a written 6-month goal doc with your manager:
- 3–4 goals with quarterly milestones
- What "exceeds expectations" looks like on each
- What support you need from the manager (air cover, budget, headcount)

This is *your* forcing function. Managers rarely push for this doc; ICs who write it are rare and valued.

### Signals This Phase Is Working

- Your name appears in a design doc you didn't write
- A senior IC asks *your* opinion on their design doc
- Your manager references your workstream in a skip-level or team-wide update
- You've been asked to give a talk at a team meeting

---

## Recurring Cadence to Establish

| Rhythm | What |
|---|---|
| **Weekly** | 1:1 with manager (30 min), 1:1 with tech lead (30 min), team standup, team meeting |
| **Biweekly** | 1:1 with one adjacent-team peer (rotate through 4–6 people over the quarter), data-team sync |
| **Monthly** | Skip-level 1:1 (30 min), retro on the previous month's plan, reading group / paper club (if it exists — start one if not) |
| **Quarterly** | Written self-review, 6-month goal check-in, comp/scope conversation |

---

## What NOT to Do (In Priority Order)

1. **Don't rewrite existing code in month one.** Every senior IC has watched a new hire attempt to "clean up" a codebase and shipped nothing else that quarter. Add before you subtract.
2. **Don't propose a new model architecture in month one.** You don't know the eval curves, the data constraints, the compute budget, or the customer segments yet. Proposals in month one signal missing context, not initiative.
3. **Don't chase every shiny paper.** In an evaluation-driven team, the discipline is knowing which papers to *ignore*. Frontier-model output is noisy — most published claims don't hold up in production observability data.
4. **Don't over-commit in month two.** Owning one component well beats owning three components poorly. Say no to the second workstream even if it flatters you.
5. **Don't skip writing.** Every experiment, every 1:1 with a stakeholder, every design decision — write it down. Six weeks later the delta between engineers who wrote and engineers who didn't is enormous.
6. **Don't confuse Slack presence for progress.** Answering messages fast is not the same as shipping. Block 3–4 hour deep-work windows daily and defend them.

---

## Post-90: The Q2 Question

At day 90, the question shifts from "am I ramping successfully?" to "what am I *known for* at Splunk?" Most people don't answer this deliberately — they end up known for whatever they got assigned. The engineers who *choose* their signature area at month three end up 6–12 months ahead of peers at the same tenure.

Signature area candidates (biased toward Vigil-adjacent depth):
- **Agentic reasoning over observability data** — the SAIA / SPL Copilot / autonomous-triage space, where Vigil is a directly applicable prior
- **Time-series foundation models for enterprise** — Chronos / TimesFM / Moirai adapted to Splunk-scale telemetry
- **Evaluation methodology for observability models** — how do you measure "the model got better" when the ground truth is contested and the tail is heavy?
- **Log reasoning at scale** — semi-structured text is where Splunk has data advantages nobody else has

Any of these are defensible signature areas. Pick before you're pigeon-holed into one.
