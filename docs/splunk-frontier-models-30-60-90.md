# 30 / 60 / 90 Day Plan — Splunk Foundation Models (PM Track)

> **Context.** Product Manager joining Splunk's foundation-models team, covering time-series forecasting (Cisco/Splunk TSFM, Cisco APEX), log reasoning, and observability foundation models generally. The team's outputs are *models that other Splunk products consume* (SAIA, SPL Copilot, ITSI, Observability Cloud) — so this PM role is closer to "platform PM for model APIs" than "feature PM for end-user surface."
>
> The three phases are **absorb → own → lead**. Each has explicit outcomes, not just activities. PM-specific artifacts (PRDs, customer research, strategy docs) replace the IC artifacts (PRs, design docs, benchmarks) — but the discipline of measurable outcomes is the same.

---

## Guiding Principles

Five anchors that decisions get judged against for the first 90 days:

1. **Customer signal beats internal opinion.** In a foundation-model team, the loudest voice in the room is usually the ML lead with the most impressive demo. Your job as PM is to hold the mirror: *does this actually solve a problem a customer will pay for?* Book customer conversations in week one.
2. **PRDs are the reasoning artifact.** In an IC-heavy team, a PRD gets read more carefully than any Slack thread. Ship a good one in the first 45 days — it's your credentialing artifact with engineering.
3. **Assume every model choice has a governance story.** Splunk's data is customer telemetry. Any training-data or inference-boundary question — provenance, PII, tenant isolation, EU vs. US data residency — is a real question, not a paperwork question. Ask what "safe to ship" means to your legal + compliance partners before you have to.
4. **Positioning is more of your job than roadmap.** The team already has a technical roadmap; where they need a PM is in answering "why should a customer pay for our TSFM when Amazon Chronos-2 is Apache-licensed?" — a positioning question, not a capability question.
5. **Show your work.** Every stakeholder conversation, every customer call, every prioritization decision produces a written artifact (a Notion page, a doc, an email) that outlasts the meeting. Six weeks in, when someone says "what did Enterprise Customer X actually say?", you have the transcript.

---

## Days 1–30 — Absorb

### Team & Stakeholders

The PM stakeholder graph is different from an IC's. Map it explicitly:

- **Direct partners:** eng lead, engineering manager, design lead (if the team has one), UX researcher
- **Adjacent PMs:** SAIA / SPL Copilot / ITSI / Observability Cloud / SOAR — everyone whose product surface *consumes* the models
- **Go-to-market:** field-facing PMM, one AE covering enterprise customers, one CSM (customer success manager) with an AI/AIOps portfolio
- **Executive:** your manager, your manager's manager, the VP of AI / Platform (whoever the exec sponsor of the foundation-models bet is)
- **Analyst relations:** the person who briefs Gartner / Forrester on Splunk's AI story — foundation-model positioning goes through them

Book 30-min intros with every name above in the first three weeks. **Don't wait for them to schedule.**

### Product Portfolio & Roadmap

Before proposing anything, learn:

- What models are **shipped and monetized** today? (Which SKUs, which customer segments, what's the attach rate?)
- What's in **evaluation / private preview**?
- What's on the **quarterly roadmap** — and which items are technical vs. product-driven?
- Where does each model surface in the customer's product experience? (A model that only lights up in a hidden Observability Cloud feature has different PM levers than one exposed in the SAIA chat.)
- Which **downstream product PMs** are net-detractors of the model team, and why? (Every foundation-model team has at least one internal skeptic. Meet them first.)

### Customer & Competitive Landscape

Foundation models for observability are in an active competitive window. Get fluent in it:

**Direct competitors (time-series):**
- **Datadog Toto 2.0** — currently #3 on GIFT-Eval, positioned specifically for observability/AIOps. Read Datadog's public materials on Toto (blog posts, `.ddconf` talks). This is the model that shows up in Splunk-vs-Datadog RFPs.
- **Amazon Chronos-2** — #1 on GIFT-Eval, Apache 2.0. The "why not just use it" question is real; every field conversation will surface it eventually.
- **Google TimesFM 2.5** — #2 on GIFT-Eval, also Apache 2.0. Enterprise customers running on GCP will ask about it.
- **Salesforce Moirai 2.0** — CC-BY-NC-4.0 on weights, which matters for customer redistribution.

**Direct competitors (log reasoning / observability agents):**
- Datadog Bits AI, Grafana AI (Grafana 12 rollout), Elastic AI Assistant, New Relic AI, Dynatrace Davis CoPilot, ServiceNow Now Assist
- AWS Q Developer's observability surface

**Ask your PMM:** which two of these are in the most active competitive deals right now? Those are your priority reads.

**Ask CS:** which customers are currently referenced in Splunk AI-Assistant case studies? Their raw feedback (unfiltered by marketing) is the fastest read on what's actually working.

### Read the Existing Product Artifacts

- Every PRD the team has shipped in the last 12 months
- The last two `.conf` foundation-model announcements + the transcripts if available
- Splunk's most recent AI Predictions / State of Security / State of Observability reports (customer voice, packaged)
- The internal roadmap deck for the current fiscal year
- Analyst briefings from the last two Gartner / Forrester / IDC cycles that mention Splunk AI

### Reading List (PM Craft + Domain Context)

Pick 3–4 from each list. Not one-a-week — deep-read a few:

**PM craft:**
- *Inspired* — Marty Cagan (product discovery discipline)
- *Working Backwards* — Amazon's PR/FAQ methodology (relevant because Splunk's internal PM culture increasingly mirrors it)
- *The Hard Thing About Hard Things* — Horowitz (for the "hard prioritization call" chapters, not the founder narrative)
- *Escaping the Build Trap* — Melissa Perri (outcome-driven PM, especially for platform PM roles)

**Foundation-model context (skim, don't deep-read):**
- Chronos-2, TimesFM 2.5, Toto 2.0 model cards + accompanying blog posts (competitive intel, not architecture study)
- The GIFT-Eval benchmark methodology paper (understand the yardstick that ranks Splunk against competitors)
- One recent Anthropic/OpenAI/Google-DeepMind post on eval methodology (frames how the industry talks about "is the model better")

**Domain / competitive:**
- Datadog `.ddconf` 2025 + 2026 keynotes (their AI positioning is the sharpest of Splunk's direct competitors)
- Gartner Magic Quadrant for AIOps + Observability, current edition
- Splunk's own quarterly earnings AI mentions (what's the CFO promising the street?)

### Signals This Phase Is Working

- You can explain **three customer segments** the team's models serve, what problem each has, and which competitor they're most tempted by
- You've completed **5–8 customer or prospect conversations** with someone from CS or the field on the call
- Every recurring 1:1 has a running Notion / doc page (not just calendar invites)
- You've caught yourself starting a sentence with "the customer we talked to last week said…" and it lands

**Anti-signal:** if you're catching yourself explaining *transformer architecture* to peers in month one, you're absorbing on the wrong axis. Redirect to the customer and pricing questions.

---

## Days 31–60 — Own

### Take Product-Surface Ownership

Pick **one** product surface to become the PM owner for. Best candidates given the team scope:

- **The TSFM API surface** — pricing, packaging, docs, developer experience for internal + external consumers
- **One vertical use case** — e.g., "TSFM for network telemetry" (Cisco Catalyst integration) or "TSFM for security anomaly detection"
- **The competitive-response workstream** — Datadog Toto specifically. If Splunk needs a coherent field story on Toto vs. our TSFM, that story doesn't write itself.
- **The evaluation + benchmarking narrative** — Splunk isn't on GIFT-Eval yet. That gap has product implications (analysts ask about it). Owning "get us on the leaderboard, and be public about the numbers" is a real workstream.

**Criterion:** something that (a) is under-owned today, (b) has an eng partner ready to move on it, (c) has a customer or exec asking about it, and (d) can produce a measurable outcome in 30 days.

**Anti-pattern:** owning a workstream that only the eng team cares about, or only your exec sponsor cares about — you need *both* sides pulling. Alignment on both sides is what makes a workstream shippable.

### Ship One PRD

By day 60, one PRD circulated → reviewed → committed. Structure:

- **Problem statement** in customer language ("Enterprise SREs monitoring 10K+ time series can't get useful forecasts on <90-day-old signals because…")
- **Success metric** — a customer or business outcome, not a model metric ("30-day retention of TSFM-forecast users increases from X% to Y%")
- **Scope** — what's in, what's explicitly out
- **Dependencies** — eng team, design, GTM, legal
- **Rollout** — private preview → GA path, with the gate criteria at each phase
- **Risks** — the top three, with mitigation owners
- **Ask** — headcount, budget, air cover from the exec sponsor

This is your credentialing artifact. Circulate it broadly at day 45; iterate to committed state by day 60.

### Run One Customer Research Effort

Pick a research question the team hasn't answered:
- "How do our enterprise customers currently handle time-series forecasting today, before Splunk?"
- "What's the buyer's mental model for 'AI-powered' AIOps features — do they trust it, do they need it explained, do they want to see the math?"
- "What does the Toto vs. TSFM conversation actually sound like in a competitive RFP?"

Talk to **8–12 customers or prospects** in 3–4 weeks. Publish a synthesis doc. This becomes the reference document the team cites for the next quarter — real PM value.

### Drive One Prioritization Decision

At day 45–55, there's usually a live tradeoff on the roadmap. Make it your job to write the one-pager that closes it. Structure:
- The decision to be made
- Options considered (with a "third option" that isn't obviously wrong)
- Recommendation + rationale
- Reversibility (is this a one-way door?)
- Owner + timeline

The value here is less the decision than the reputation for driving decisions — most PMs let these linger; the ones who close them get trusted with harder ones.

### Cross-Team Relationships

- **SAIA / SPL Copilot PMs** — biggest downstream consumers of your models. Weekly or biweekly touchpoint.
- **Observability Cloud + ITSI PMs** — same category. Time-series forecasts feed into their surfaces.
- **PMM + Field PMs** — the customer story goes through them; make sure the story you're building matches the story sales is telling.
- **Analyst Relations** — one conversation, understand what Gartner is currently asking about, and what Splunk's response is.

### Signals This Phase Is Working

- Your manager can name the workstream you own without prompting
- One PRD in "committed" state, not just "draft"
- Two adjacent-team PMs have referenced your customer research in their planning
- You've been included in a customer call you didn't set up yourself
- The eng lead is coming to *you* to negotiate scope, not the other way around

---

## Days 61–90 — Lead

### Own Quarterly Planning for One Workstream

Q4 (or Q1 of the fiscal year — whichever is next) planning cycle: own the planning for one workstream end-to-end.

- **Inputs** — customer research, competitive intel, eng capacity, exec priorities, GTM commitments
- **Output** — a committed set of deliverables with owners, milestones, and gate criteria
- **Communication** — a written narrative document, not a slide deck (Splunk / Amazon PM norm)

The workstream you owned in month two becomes the workstream you're planning for in month three. This is how PMs graduate from "shipping the current thing" to "shaping the next thing."

### Author a Product Strategy Doc

Not a quarterly plan — a **12–18 month strategy** for one specific bet. Structure:

- **Where the market is going** (customer trend + competitive trend, backed by real data)
- **Where Splunk should place its bet** (specific positioning, not "AI is important")
- **What we build vs. buy vs. partner** — real answer, not "we'll figure it out"
- **How we know if it's working** — leading indicators (product metrics) + lagging indicators (revenue, retention, competitive win rate)
- **Timeline + investment** — headcount, compute, GTM support
- **What we're *not* doing** — every strategy is a set of "no"s dressed up as "yeses"

Circulate at week 10. Iterate on feedback in weeks 11–12. Land as a decision at week 13.

### Become the "Voice of the Customer" for One Area

By day 90, one specific product question should route to you:
- "Ask Bharat what enterprise SREs actually want from time-series forecasting"
- "Ask Bharat what the Toto competitive response looks like in the field"
- "Ask Bharat what the packaging model for foundation-model inference should be"

Ownership of a *question* — not just a workstream — is the mark of a senior PM. Questions outlast projects.

### Set 6-Month Goals with Your Manager

By day 85, a written 6-month goal doc:
- 3–4 outcome-based goals (not activity-based — "reach X% adoption of feature Y" not "ship feature Y")
- Quarterly milestones for each
- What "exceeds expectations" looks like
- Support required: air cover, budget, headcount

Managers rarely push for this doc; PMs who write it become the ones whose scope grows.

### Signals This Phase Is Working

- Your name appears in a leadership doc you didn't write
- A senior IC or another PM asks for your opinion on their PRD before shipping it
- Your workstream is referenced in a skip-level or leadership all-hands update
- You've been asked to represent the team at a customer briefing or analyst call
- The competitive intel you produced is being cited in exec-level positioning conversations

---

## Recurring Cadence to Establish

| Rhythm | Meeting |
|---|---|
| **Weekly** | 1:1 with manager (30 min), eng partner sync (30 min), design partner sync if applicable (30 min), team standup, weekly team meeting |
| **Biweekly** | Adjacent PM sync (rotate through 4–6 counterparts across the quarter), CS / field feedback loop, PMM alignment |
| **Monthly** | Skip-level 1:1 (30 min), competitive intel review, retro on the previous month's plan, analyst briefing prep (if in cycle) |
| **Quarterly** | Written self-review, 6-month goal check-in, scope / comp conversation, roadmap review with exec sponsor |

**Direct customer contact** should never be less than 2 conversations per month, even in the busiest quarters. When it drops below that, your intuition is drifting from the market.

---

## What NOT to Do (In Priority Order)

1. **Don't try to be a technical peer to engineering.** You'll never win. Be a great *partner* instead — the PM who asks the sharpest customer questions, not the second-best ML question. Deep-learning-paper deep dives are engineering's job; making sure the paper's approach solves a customer problem is yours.
2. **Don't skip customer conversations because "the team already knows the customer."** Team-internal folklore about the customer decays fast, especially in a hot market. Every month you go without direct customer contact, your model of the market drifts.
3. **Don't propose new features in month one.** You don't know the eng constraints, the compute budget, the platform limits, or the commercial model yet. Feature proposals in month one signal missing context, not initiative.
4. **Don't over-commit in month two.** Owning one product surface deeply beats owning three shallowly. Say no to the second workstream even if it flatters you — the senior PMs at Splunk will notice and respect the "no."
5. **Don't skip writing.** Every customer call, every stakeholder decision, every competitive read — write it down. Six weeks later, the delta between PMs who wrote and PMs who didn't is enormous, and PMs are judged on written artifacts more than any other role.
6. **Don't confuse Slack presence with progress.** Answering messages fast is not the same as shipping a PRD. Block 3–4 hour deep-work windows daily; a PRD you keep restarting is worse than the PRD you finish.
7. **Don't fight the internal politics on day one.** Every foundation-model team has an internal "should we just wrap open-source Chronos" faction and a "we should build our own moat" faction. Neither is wrong. Understand both positions before you take one.

---

## Post-90: The Q2 Question

At day 90, the question shifts from "am I ramping successfully?" to "what am I *known for* at Splunk?" Most PMs don't answer this deliberately — they end up known for whatever they were assigned. PMs who *choose* their signature area at month three end up 6–12 months ahead of peers at the same tenure.

Signature area candidates (biased toward foundation-model-team scope):

- **AIOps foundation-model positioning** — the PM who owns Splunk's answer to Datadog Toto, from field enablement through analyst positioning through packaging. Directly addresses a competitive gap.
- **Enterprise packaging + pricing for model inference** — how does foundation-model consumption get priced for Splunk customers? Per-forecast, per-workspace, bundled? This is a research and design problem masquerading as a pricing problem.
- **Build-vs-buy strategy for the model portfolio** — Chronos-2 is Apache 2.0 and #1 on the leaderboard. The strategic call on which models Splunk should build vs. wrap vs. license is a real PM decision. Somebody has to own it.
- **Voice-of-customer for foundation-model UX** — customers don't trust AI they don't understand. The PM who owns "how do we make foundation-model outputs auditable and trustable in a customer's product experience" carries a Splunk-specific advantage (audit trail is part of Splunk's core value prop).

Any of these are defensible signature areas. Pick before you're pigeon-holed into one.
