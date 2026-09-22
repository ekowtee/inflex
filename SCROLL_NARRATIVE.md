# Inflexions I.T. — Scroll Narrative

**Narrative design review and redesign of the home page journey, first frame to final call to action**
**Prepared:** 21 September 2026
**Audience:** the coding agent building the redesign, and the owner who signs off copy
**Owner decisions, 21 September 2026:** the written follow-up in the offer is confirmed. MTN Ghana (Project UBIA) is included on the home page as work in progress, because the build can be inspected today; it is presented as such, not as delivered.
**Supersedes:** Section 7 (home page chapter table) of `CREATIVE_DIRECTION_3D.md`. Everything else in that document stands: the Core, the registers, the motion tokens, the tiers, the build phases, the gates.

---

## 0. Verdict

**The current site loses trust at the second screen and never gets it back.** The client ticker under the hero shows placeholder companies (Acme Group, Zenith Corp, NOVA, DSTRKT4) while the real roster (British Airways, CEIBS, ATC, Blu, Innovaddb, Ninani, Lifeforms) is coded in `ClientStrip.tsx` and mounted nowhere. The testimonials are invented people at invented companies with stock faces. A CTO who recognises one placeholder name discounts every claim that follows. No amount of 3D repairs that.

**The plan I wrote in the creative direction fixes the surface and repeats the structural mistake.** It puts real proof (the Blu Telecom case) at chapter 04, roughly eight screens down, after a four-screen pinned product sequence. The visitor's third question is "why should I believe you?" and the plan answers their fourth question first. It also runs four reading-room blocks back to back, sends the buyer through the Academy door before the ask, and offers two different things at the top and bottom of the page.

**The redesign below** is nine beats, about ten viewports, readable in ninety seconds. Proof arrives by the third screen. One offer, stated the same way twice. Every beat answers exactly one visitor question and ends with exactly one exit. The side doors (Academy, Careers) come after the ask, not before it.

---

## 1. The offer

### 1.1 What the page currently asks for

| Location | Offer | Problem |
|---|---|---|
| Hero | "Get Your Free IT Assessment" | Commodity. Every managed-service provider in Accra offers a free assessment. To a CTO it reads as "we will find things wrong and quote you". It also promises a deliverable the page never describes. |
| Closing banner | "Book a 30-minute AI readiness session with our Solutions Architect. No pitch — just a clear path to intelligent operations." | Better in every way: a time, a role, a promise of no pitch. But it narrows the whole company to AI, and it is a *different offer* from the hero. A visitor who scrolls the full page is asked for two things. |
| Academy promo (mid-page) | "Explore Programmes" and "Enterprise Training" | A third ask, aimed at a different buyer, placed before the primary ask is made. |

Three offers on one page is no offer.

### 1.2 The one offer

Everything on the home page drives to a single action, described the same way at the top and the bottom:

> **Book a 30-minute architecture review.**
> With a Solutions Architect, not a salesperson. No pitch. You leave with a written view of what to fix first.

Why this and not the two existing lines:
- "Architecture review" is the language of the buyer. It signals engineering, covers all four pillars, and is what a CTO would actually put in a calendar.
- "Thirty minutes" and "not a salesperson" remove the two fears: time and being sold to.
- "A written view of what to fix first" gives the visitor something to *get*, which the free assessment never did. It is also the beginning of the consulting funnel the brand book describes.

**Confirmed by the owner on 21 September 2026.** The written follow-up is an operational commitment the team has made. Ship the full three-sentence offer. The contact form and the lead-handling process must be able to deliver it (see Section 9, item 8).

The button label is **Book the review** everywhere. The hero and the close use identical wording so that the page feels like one request, made twice, with proof in between.

---

## 2. The visitor's question ladder

A first-time enterprise visitor asks these questions in this order. A page earns the right to the next question only by answering the current one. The table shows where each is answered today, in the creative-direction plan, and in the redesign.

| # | Question | Current site | Creative-direction plan | Redesign |
|---|---|---|---|---|
| 1 | Where am I, and is this for me? | Hero. Partially: no location, no "who for". | Ch. 00 with eyebrow. | Beat 0, first frame. |
| 2 | Who else trusts them? | Ticker of placeholders. **Fails.** | Ch. 00b, but it reuses `assets/clients` (the placeholders). **Fails.** | Beat 1, real roster, second screen. |
| 3 | Why should I believe you? | Never. No case study on the home page. **Fails.** | Ch. 04 at ~780 vh. **Too late.** | Beat 3 at ~240 vh. Trust is won here. |
| 4 | What exactly would you do for me? | Four-pillar grid at ~2 screens, before any proof. | Ch. 02, pinned 400 vh, before proof. | Beat 4, pinned 320 vh, after proof. |
| 5 | Why you and not the others I am comparing? | "Why 50+ Enterprises Trust" cards with generic titles. Weak. | Ch. 03, same cards re-set. Still generic. | Beat 5, the Not / Instead ledger from the brand book. |
| 6 | What is my risk? | Partner logos, placeholder testimonials. | Partner wall, testimonials. | Beat 6 partner wall. Beat 7 voices only if real. |
| 7 | What do I do now, and what will it cost me? | Two different offers. | Two different offers. | Beat 8, one offer, friction removed. |
| — | Something for a different visitor (learner, candidate) | Academy mid-page, careers in nav. | Academy mid-page. | Beat 9, after the ask. |

---

## 3. Where trust is won, and where it is lost

### 3.1 The moment trust is won

For this audience, trust is not won by motion. It is won at the first **specific, checkable, local** fact. On the redesigned page that moment is Beat 3, when the visitor reads:

> A carrier-grade 4G LTE core and a Tier III data centre for Blu Telecommunications, delivered from scoping to commercial pilot in 2014. Lead independent ICT consultant on MTN Ghana's Project UBIA, a Tier III data centre and Industry 5.0 hub at Accra Digital Centre, under way today.

Two Tier III data centres: one carrier-grade and live since 2014, one for the country's largest telco and a ministry, standing on site now. Nobody else in the local comparison set can put that sentence on their home page. It arrives at about 240 vh, roughly the third screen, immediately after the claim it substantiates.

Project UBIA is shown as work in progress, and the card says so in its eyebrow. The owner's reasoning, which the copy leans into: the build exists and can be inspected today, so "in progress" is itself a proof point rather than a hedge. The card must never imply completion. When the project completes, only the eyebrow and one sentence change.

Secondary trust moments, in order of weight: the real client roster at Beat 1 (British Airways and CEIBS are recognisable to a Ghanaian executive), the partner wall at Beat 6, and the founding year and experience counters at Beat 3.

### 3.2 Where trust is currently lost

These must be fixed before any motion work ships, because motion amplifies whatever is on the page.

1. **Placeholder clients on the live home page.** `src/app/components/Partners.tsx` renders NOVA, Belle Vista, Niobe, Rabito Clinic, DSTRKT4, Acme Group, Zenith Corp, and Labianca from `public/assets/clients/`. "Acme" is the universal placeholder name. This block sits directly under a hero that says "Why 50+ Enterprises Trust Inflexions". Replace with the roster in `ClientStrip.tsx` and `public/logos/`. Confirm each logo is licensed for use.
2. **Placeholder testimonials.** `TestimonialSlider.tsx` quotes Ama Serwaa of Zenith Retail, John Kwame Boadu of GreenLeaf Logistics, and Sarah Nana Adjoa of AquaPure Solutions, with stock portraits from `assets/Testimonials/`. An enterprise buyer assumes these are invented and then assumes everything else is. The block is cut until real, attributable quotes exist (rules in Beat 7).
3. **The hologram hero.** Covered in the creative direction. It signals stock, and stock signals small.
4. **Two offers.** Covered in Section 1.
5. **"Free IT assessment".** Commodity language on a premium page.
6. **The 50+ claim beside fake logos.** Once the roster is real, the number is credible. Until then the number does damage.

---

## 4. Review of the current journey

Block order as rendered by `src/app/page.tsx`.

| # | Block | Visitor question it addresses | What it does | Verdict |
|---|---|---|---|---|
| 1 | `HeroBanner` | 1 | Stock photo, headline, lead, "Free IT Assessment". No location, no scroll cue. | Headline and lead are good. Image and offer are not. |
| 2 | `Partners` ticker | 2 | Placeholder logos in an infinite marquee. | **Trust lost.** Replace roster, kill marquee. |
| 3 | `StrategicPartnerSection` | 4 (and a little of 5) | "From Legacy Burden to Competitive Edge", paragraph, four check-marked pills, a button. | Right idea, weak execution. The pills are the same "four things" grammar as the next two blocks. |
| 4 | `ComprehensiveSolutions` + `SwapGrid` | 4 | Four photo cards, a cut-out shape, "Four Pillars. Zero Gaps." | Best line on the site attached to the weakest layout. Hover moves layout. |
| 5 | `InflexionsAdvantage` | 5 | Four photo cards, text hidden until hover on desktop. "Why 50+ Enterprises Trust Inflexions." | Titles are generic ("Build a Rock-Solid Foundation"). The heading promises reasons; the cards give adjectives. Third "four things" grid in a row. |
| 6 | `IntelligentAutomation` | 4 again | Four AI capability cards. | Fourth grid of four. Overlaps with the Data-centric pillar. Fatigue. |
| 7 | `AcademyPromo` | a different visitor | Full-width navy band with two CTAs. | Interrupts the buyer's journey before proof or the ask. Wrong position. |
| 8 | `MainPartners` | 6 | Technology partner logos. | Fine, but it is the second logo strip. |
| 9 | `TestimonialSlider` | 6 | Invented people. | **Trust lost.** Cut. |
| 10 | `CallToAction` | 7 | Photo band, "Stop Patching. Start Performing.", second offer. | Best copy on the page attached to a different offer than the hero. |

Structural diagnosis: four consecutive grids of four, no proof anywhere, two logo strips, three offers, and the strongest asset the company has (two Tier III data centres) absent from the page.

---

## 5. Review of the creative-direction plan (self-critique)

The ten-chapter table in `CREATIVE_DIRECTION_3D.md` Section 7 solved the visual problems and kept the narrative ones.

| Flaw | Where | Fix in the redesign |
|---|---|---|
| Proof at chapter 04, ~780 vh, after a 400 vh pinned product sequence | Ch. 02 → 03 → 04 | Proof moves to Beat 3 at ~240 vh, before the pillars. |
| Trust strip reuses `assets/clients`, the placeholder set | Ch. 00b | Beat 1 uses the `ClientStrip` roster. |
| Four reading-room blocks in a row (Advantage, Proof, then after a short dark chapter: Academy, Partners, Voices) | Ch. 03–08 | Ivory run is capped at two beats before a register change. |
| Academy before the ask | Ch. 06 | Beat 9, after the ask. |
| Separate AI chapter duplicating the Data-centric pillar and adding a fifth "four things" | Ch. 05 | Folded into Beat 5 as a single row. |
| Two offers (assessment at 00, AI session at 09) | Ch. 00 and 09 | One offer, Section 1. |
| Generic "Advantage" cards kept | Ch. 03 | Replaced by the Not / Instead ledger. |
| Twelve viewports | total | About ten, with the pinned section shortened from 400 to 320 vh. |
| Testimonials kept with no source check | Ch. 08 | Conditional on real quotes. |

What the plan got right and the redesign keeps: the poster-first arrival, the noise-to-order resolve as the first big motion, the pinned pillars with one object, the register alternation, the mark reveal as the payoff, and the rule that copy triggers once while the scene scrubs.

---

## 6. The redesigned journey

Ten beats. Scroll positions are in viewport heights of the page. Total is about 1,090 vh on desktop. Registers alternate so the eye never spends more than two beats in one world.

For every beat the specification is the same five things: the question it answers, **the reveal** (what the eye lands on first and in what order), **the carry** (the motion cue that moves the eye to the next beat), **the copy beat** (the one line that has to land), and **the exit** (the single link out to depth).

**The carry device.** One recurring motif joins the whole page: **the thread**. In the Core it is the ember path that lights along the inflection line. On the page it is a 1 px vertical ember line, 48 px tall, that draws downward at the end of each Obsidian beat and points into the next. In Ivory beats the same job is done by the 2 px red left border that draws top-to-bottom on the beat's key card. The visitor never sees a chapter simply stop. Something always points down.

### Beat 0 — Arrival (0 to 100 vh, Obsidian)

- **Question:** Where am I, and is this for me?
- **Reveal, in order:** (1) eyebrow `Enterprise IT integration · Accra · Since 2012`, (2) H1 line by line, (3) the Core poster already present behind, crossfading to live, (4) lead, (5) the offer and button, (6) scroll cue.
- **Copy:**
  - H1: **Intelligent Infrastructure That Never Sleeps** (approved)
  - Lead: "We design, deploy, and manage AI-driven networks, cloud, and security — with intelligent automation that keeps you ahead, not just online." (approved)
  - Offer line under the lead, Body size, `silver-300`: "Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch." **(new)**
  - Button: **Book the review** **(new)**
  - Scroll cue text: **See the work ↓** **(new)**
- **Carry:** the scroll cue is the thread itself, 1 px, growing from 0 to 32 px and fading every 2.4 s. It stops on first scroll. The Core's ember nodes along the inflection line pulse slowly toward the lower right, where Beat 1 will enter.
- **Exit:** the button, to `/contact`. Nothing else is clickable in the hero.
- **Word budget:** 55.

### Beat 1 — Trusted by (100 to 130 vh, Obsidian)

- **Question:** Who else trusts them?
- **Reveal:** eyebrow `Trusted by`, then the roster sliding in from the right as the visitor scrolls, monochrome silver.
- **Roster:** British Airways, CEIBS, ATC, Blu Telecommunications, Innovaddb, Ninani, Lifeforms, from `public/logos/`, approved by the owner on 21 September 2026. The MTN logo is **not** in the roster (owner decision, same date); MTN is named in Beat 3 only.
- **Copy:** none beyond the eyebrow. Logos are the copy.
- **Carry:** the last logo to arrive sits at the right edge; the thread draws down from beneath it into Beat 2's eyebrow position at the left. The eye is walked right-to-left-and-down in one movement.
- **Exit:** none. This beat is not a destination.
- **Motion:** scrubbed slide, 0.4 px per px of scroll, then hold. No marquee. Never loops.

### Beat 2 — The turning point (130 to 240 vh, Obsidian)

- **Question:** What do you actually do?
- **Reveal:** (1) eyebrow `01 — The inflection point`, (2) H2 in two lines, (3) the Core, which at 130 vh is displaced by noise and at 240 vh has resolved to the clean inflection sheet with the ember line lit left to right, (4) body, (5) exit link.
- **Copy:**
  - H2: **We engineer the inflection point.** (approved, brand book master narrative)
  - Body: "Legacy systems drain budget. Threats escalate. Data exists everywhere and informs nothing. Most vendors add products. **We integrate** — so network, cloud, security, and data work as one intelligent system." (assembled from approved brand book Act 1 and Act 2; the bold is the beat)
- **The copy beat that lands:** "Most vendors add products. We integrate." Two sentences, seven words. This is the whole positioning.
- **Carry:** the ember line finishing its left-to-right run *is* the carry. As it reaches the right edge it drops: a single ember node detaches, falls 48 px, and becomes the thread that leads into Beat 3. This is the one place the thread is born from the object rather than drawn on the page.
- **Exit:** **How we integrate →** to `/about`.
- **Motion:** noise-to-order is scrubbed to scroll. Copy triggers once at 20% visible. This is the most important motion on the site and it must be readable at any scroll speed: the resolve completes over 110 vh so a fast scroller still sees order arrive.
- **Word budget:** 60.

### Beat 3 — The receipt (240 to 360 vh, Obsidian)

- **Question:** Why should I believe you? **Trust is won here.**
- **Reveal:** (1) eyebrow `02 — Proof`, (2) H2, (3) two case cards side by side, each with its red left border drawing top to bottom, (4) the counter row, (5) exit.
- **Copy:**
  - H2: **We have done this at national scale. Twice.** **(new)**
  - Card A, eyebrow `2014 · Delivered`: **Blu Telecommunications** — "Ghana's new broadband entrant needed a national 4G LTE core network and a Tier III data centre, under startup pressure and aggressive timelines. We led it from scoping and vendor evaluation to a live commercial pilot — at 50 Mbps per device, a national benchmark at launch." (condensed from `data.ts`, id 2)
  - Card B, eyebrow `2026 · In progress · Accra Digital Centre`: **MTN Ghana, Project UBIA** — "Lead independent ICT consultant for a Tier III data centre and Industry 5.0 innovation hub, for the Ministry of Communication, Digital Technology and Innovation. Architecture, data centre design, and delivery oversight — under way on site today." (condensed from `data.ts`, id 1; last clause **new**)
  - Counters, Telemetry style: `2012` Founded in Accra · `80+` Years combined experience · `50+` Enterprise clients (approved figures)
- **The copy beat that lands:** the H2. It is the only headline on the page that is a pure fact, and "twice" says the first one was not luck.
- **The in-progress rule:** Card B's eyebrow always carries `In progress` until completion. The body never uses "delivered", "completed", or "built". "Under way on site today" is the strongest permitted phrasing. On completion, change the eyebrow to `2026 · Delivered` and the last clause to "delivered on site at Accra Digital Centre". Nothing else moves.
- **Carry:** the two red borders draw at the same moment; the counters run; then the thread draws down from between the two cards into Beat 4. The Core, which has been sitting behind at 70% opacity, begins its morph from Inflection toward Lattice in the last 20 vh of this beat, so the pillars chapter arrives already in motion.
- **Exit:** **Read both case studies →** to `/case-study`. Each card also links to its own page by numeric id (`/case-studies/2`, `/case-studies/1`).
- **Register:** stays Obsidian. The visitor is not released to the reading room until trust is won.
- **Word budget:** 105.

### Beat 4 — Four pillars, zero gaps (360 to 680 vh, Obsidian, pinned)

- **Question:** What exactly would you do for me?
- **Reveal:** eyebrow `03 — Four Pillars. Zero Gaps.`, then a sticky index of four rows on the left. As each 80 vh sub-range begins, its row brightens, its ember dot lights, and its value proposition and partner line reveal beneath it while the Core morphs to that pillar's formation on the right.
- **Copy per row** (value propositions approved, Tier 2; partner lines from `SolutionPartners.tsx`):
  1. **Network Infrastructure** — "Secure, high-performance LAN, WAN, SD-WAN, and wireless solutions engineered for reliability at enterprise scale." `Cisco · Huawei · HP · Dell · Lenovo`
  2. **Data Security** — "End-to-end threat protection, compliance frameworks, and 24/7 monitoring that safeguard your most critical assets." `Sophos · ESET · Cloudflare · Cisco · Microsoft`
  3. **Cloud Services** — "Strategic cloud migration, hybrid integration, and managed services across AWS, Azure, and Google Cloud." `Microsoft · Google · Amazon · DigitalOcean · Red Hat`
  4. **Data-centric Solutions** — "Advanced analytics, AI-driven insights, and data governance that turn raw information into strategic advantage." `Google · Anthropic · OpenAI · xAI · Microsoft · Amazon`
- **The copy beat that lands:** the eyebrow, because the object is proving it. The visitor watches one structure become four things without ever coming apart. The partner lines answer the engineer's question ("do they actually know Azure?") without a paragraph.
- **Carry:** on the fourth formation (Plane), the tallest ember-capped column sits at the lower right. When the pin releases, the column's ember cap detaches and becomes the thread into Beat 5. The register crossfades to Ivory over the release.
- **Exit:** each row's name links to its pillar page. One exit per row, four in total, which is the one allowed exception to the single-exit rule because the rows are four destinations.
- **Motion:** morphs scrubbed with 0.8 s smoothing. First and last 20% of each sub-range hold still. Camera orbits 18° per formation. Keyboard: the rows are focusable; focus scrolls to the sub-range.
- **Mobile (below 1024 px):** no pin. Four stacked blocks, each with its formation poster as a 56 vw image above the row copy. Same copy, same order.
- **Word budget:** 120, spread across four holds.

### Beat 5 — The difference (680 to 800 vh, Ivory)

- **Question:** Why you and not the others I am comparing?
- **Reveal:** (1) eyebrow `04 — Why Inflexions`, (2) H2, (3) the ledger: three lines on the left that strike through as they enter, three lines on the right that reveal after each strike, (4) the intelligence row, (5) exit.
- **Copy** (from the brand book's "What we are NOT / What we ARE", currently unused anywhere on the site):
  - H2: **Not a reseller. Not a generalist. Not a lock-in.** **(new, assembled from approved)**
  - Ledger, left column, struck through as they enter:
    - "A reseller putting logos on boxes."
    - "A generalist that outsources the real work."
    - "A vendor that locks you in and layers on cost."
  - Ledger, right column, each revealed after its strike:
    - **Engineering-led.** "80+ years of combined integration experience, and the architects do the work."
    - **Vendor-neutral.** "The architecture serves your business, not a vendor's quota."
    - **Privately owned.** "Zero bureaucracy. Personal accountability. Faster than firms five times our size."
  - Intelligence row, below the ledger, one line: eyebrow `AI in every layer` · **Intelligence is not a feature. It is the fabric.** **(new)** · then four terms as links: `Predictive Analytics · Process Automation · Data Strategy & Architecture · AI Integration` (from `IntelligentAutomation.tsx`), all to `/solutions/data-centric-solutions`.
- **The copy beat that lands:** the strike-throughs. Saying what you are not, and crossing it out in front of the reader, is the most confident move on the page. It is also the direct answer to Inlaks, CWG, and the reseller tier.
- **Carry:** the strike-through lines draw left to right, 400 ms each, which walks the eye to the right column. The third right-column line reveals last and its red left border continues 48 px below the ledger into the intelligence row. That border is the Ivory thread.
- **Exit:** **Why enterprises choose us →** to `/about`. The four AI terms are secondary links, not the exit.
- **Word budget:** 110.

### Beat 6 — Partners (800 to 860 vh, Ivory)

- **Question:** What is my risk? Are they backed?
- **Reveal:** two eyebrows, `Infrastructure partners` and `Intelligence partners`, then two logo columns from `public/assets/partners/`, greyscale at 60%, 100% on hover.
- **Copy:** eyebrows only.
- **Carry:** none needed. The beat is short and quiet by design; the Ivory register itself is the rest before the final Obsidian beat. The thread resumes at the top of Beat 8.
- **Exit:** none.
- **Column assignment (proposed, needs confirmation):** Intelligence: Anthropic, OpenAI, Google, xAI, Microsoft. Infrastructure: Cisco, Huawei, HP, Dell, Lenovo, Sophos, ESET, Cloudflare, Amazon, DigitalOcean, Red Hat, Avaya, Hikvision, Schneider.

### Beat 7 — Voices (860 to 920 vh, Ivory) — **conditional**

- **Runs only if** at least two quotes exist that meet all of: a named person, a real title, a real company that appears in the roster or case studies, written permission on file, and no stock photograph (use a two-letter monogram on `obsidian-800`).
- **If the condition is not met, the beat is omitted and Beat 6 flows straight into Beat 8.** Do not fill it with placeholders. Do not fill it with a generic "what clients say" and unnamed quotes.
- **If it runs:** one quote at a time, Display L, attribution in Eyebrow style, previous and next as text buttons, no autoplay, 320 ms crossfade.
- **Question:** What is it like to work with them?
- **Exit:** the attribution links to the relevant case study if one exists.

### Beat 8 — The ask (920 to 1030 vh, Obsidian)

- **Question:** What do I do now, and what will it cost me?
- **Reveal:** (1) the thread draws down from the top edge of the beat into the eyebrow, (2) eyebrow `Every engagement is an inflection point.` (approved, internal promise), (3) H2, (4) the Core completing its morph into the mark behind the text, bloom rising, (5) offer block, (6) button, (7) telemetry line.
- **Copy:**
  - H2: **Stop Patching. Start Performing.** (approved)
  - Offer, Body L: "Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch. You leave with a written view of what to fix first." **(new; last sentence needs sign-off, Section 1)**
  - Button: **Book the review**
  - Telemetry: `Accra, Ghana · +233 20 888 9270 · info@inflexions.tech`
- **The copy beat that lands:** the H2, which has been earned by everything above it. On the current site the same line sits on a stock photo with no proof above it.
- **Carry:** none. This is the destination. The mark reveal is the visual full stop.
- **Exit:** the button, to `/contact`. The telemetry line's email and phone are live links but visually quiet.
- **Motion:** morph from Inflection (reset silently while the canvas was hidden in Beats 5 to 7) to Mark across the first 60 vh. Bloom 0.55 → 0.9 over 1.2 s, the only place bloom rises. CTA magnetic within 6 px.

### Beat 9 — Side doors (1030 to 1090 vh, Ivory)

- **Question:** for the visitor who is not the buyer: is there something here for me?
- **Reveal:** two equal panels on `#F7F8FA`, each with an eyebrow, a Display-size line, one sentence, one link.
  - Left, eyebrow `Inflexions Academy`: **Develop Your Edge.** (approved) "Expert-led training in AI, cybersecurity, cloud, and digital strategy — for professionals and enterprise teams." → **Explore programmes** to `/academy`.
  - Right, eyebrow `Careers`: **Build it with us.** **(new)** "Engineers who want to work on the infrastructure a country runs on." → **Open roles** to `/careers`.
- **Why after the ask:** the buyer has been asked and answered. The learner and the candidate have their own doors, and they are not asked to walk past them on the way to the buyer's decision. The Academy still has its nav entry, its landing page, and the `RelatedTraining` cross-links on every pillar page; the home page's job is the buyer.
- **Carry:** none. Footer follows.

### Footer (1090 vh to end, Obsidian)

Existing footer on `obsidian-900`. The Core fades out and unmounts.

### 6.1 Rhythm check

| Beat | Register | Screens | Tempo |
|---|---|---|---|
| 0 Arrival | Obsidian | 1.0 | still |
| 1 Trusted by | Obsidian | 0.3 | glide |
| 2 Turning point | Obsidian | 1.1 | the big resolve |
| 3 Receipt | Obsidian | 1.2 | counters, borders |
| 4 Pillars | Obsidian, pinned | 3.2 | four morphs |
| 5 Difference | Ivory | 1.2 | strikes |
| 6 Partners | Ivory | 0.6 | rest |
| 7 Voices | Ivory | 0.6 or 0 | rest |
| 8 The ask | Obsidian | 1.1 | the reveal |
| 9 Side doors | Ivory | 0.6 | quiet |

Five Obsidian screens of tension in a row is the maximum; it is broken exactly when trust has been won and the product has been shown. Ivory never runs longer than three beats. The final Obsidian beat is short, so the payoff does not outstay the decision.

### 6.2 Reading time

At a typical scroll pace the journey is 75 to 95 seconds. Total copy on the page, excluding logos and the pinned sub-ranges that are read one at a time, is under 600 words.

---

## 7. Copy sheet

> **Baseline: Variant A (Precision) of `COPY_DECK.md`, approved by the owner on 22 September 2026.** Every line below is the shipping copy. Status shows provenance: **Approved** (brand book or existing site, verbatim), **Fact** (assembled from approved facts), **A** (new line from the deck, approved with the variant). Variant B is approved (22 September 2026) for the Academy and Careers surfaces, including the two side-door panels in Beat 9, and for campaigns and social. The Academy and Careers page copy is rewritten in the B tone during Phase 5.

| Beat | Element | Text | Status |
|---|---|---|---|
| 0 | Eyebrow | Enterprise IT integration · Accra · Since 2012 | A |
| 0 | H1 | Engineered for the enterprises that can't afford to guess. | A (adapted from the approved About lead) |
| 0 | Lead | Network, cloud, security and data — engineered as one system, run by the team that built a national LTE core and two Tier III data centres. | Fact |
| 0 | Offer line | Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch. | Confirmed |
| 0 | Button | Book the review | Confirmed |
| 0 | Scroll cue | See the work ↓ | A |
| 1 | Eyebrow | Trusted by | A |
| 1 | Caption | Enterprises across telecoms, aviation, education, finance and infrastructure. | A |
| 2 | Eyebrow | 01 — The inflection point | A |
| 2 | H2 | We engineer the inflection point. | Approved |
| 2 | Body | Legacy systems drain budget. Threats escalate. Data exists everywhere and informs nothing. Most vendors add products. We integrate — so network, cloud, security and data work as one intelligent system. | Fact |
| 2 | Exit | How we integrate → | A |
| 3 | Eyebrow | 02 — Proof | A |
| 3 | H2 | We have done this at national scale. Twice. | Fact |
| 3 | Card A | Blu Telecommunications, 2014 · Delivered. A new broadband entrant needed a national 4G LTE core and a Tier III data centre, on startup timelines. We led it from scoping and vendor evaluation to a live commercial pilot — 50 Mbps per device, the national benchmark at launch. | Fact |
| 3 | Card A footer | Scoping · Vendor evaluation · Core build · NOC and BSS/OSS · Commercial pilot | Fact |
| 3 | Card B | MTN Ghana, Project UBIA, 2026 · In progress · Accra Digital Centre. Lead independent ICT consultant for a Tier III data centre and Industry 5.0 innovation hub, for the Ministry of Communication, Digital Technology and Innovation. Architecture, data centre design and delivery oversight — under way on site today. | Fact |
| 3 | Card B footer | Architecture · Tier III design · Delivery oversight | Fact |
| 3 | Counters | 2012 — Founded, Accra · 80+ — Years combined experience · 50+ — Enterprise clients · Cisco · Microsoft · AWS · CompTIA — Certified | Fact |
| 3 | Counter captions | Founded in Accra. Headquartered here still. / Combined years in systems integration, not in sales. / Enterprise engagements since 2012. / Certified across Cisco, Microsoft, AWS and CompTIA. ISO 27001 principles in every delivery. | A |
| 3 | Exit | Read both case studies → | A |
| 4 | Eyebrow | 03 — Four Pillars. Zero Gaps. | Approved |
| 4 | Row leads | The layer everything else assumes. / Monitored, not just installed. / Migrated without a cutover you notice. / Data that informs a decision, or it is noise. | A |
| 4 | Rows | Four value propositions | Approved (brand book Tier 2) |
| 4 | Partner lines | Per row, from SolutionPartners | Existing data |
| 5 | Eyebrow | 04 — Why Inflexions | A |
| 5 | H2 | Not a reseller. Not a generalist. Not a lock-in. | Fact |
| 5 | Ledger left | A reseller putting logos on boxes. / A generalist that outsources the real work. / A vendor that locks you in and layers on cost. | Approved (brand book 1.2) |
| 5 | Ledger right | Engineering-led. 80+ years of combined integration experience, and the architects do the work. / Vendor-neutral. We recommend what works, not what pays us the highest margin. / Privately owned. Zero bureaucracy. Personal accountability. Faster than firms five times our size. | Fact |
| 5 | AI row | AI in every layer · Intelligence is not a feature. It is the fabric. · Predictive Analytics · Process Automation · Data Strategy & Architecture · AI Integration | A; terms existing |
| 5 | Exit | Why enterprises choose us → | A |
| 6 | Eyebrows | Infrastructure partners / Intelligence partners | A |
| 6 | Captions | Multi-vendor by design. The architecture serves you, not a quota. / Frontier AI labs alongside the infrastructure vendors. Few regional integrators can show both columns. | A |
| 8 | Eyebrow | Every engagement is an inflection point. | Approved |
| 8 | H2 | Stop Patching. Start Performing. | Approved |
| 8 | Offer | Book a 30-minute architecture review. With a Solutions Architect, not a salesperson. No pitch. You leave with a written view of what to fix first. | Confirmed |
| 8 | Pricing frame | Fixed-scope projects. Two-week discovery, then a milestone plan and a price before any work begins. Typical delivery 4 to 12 weeks. / SLA-backed managed retainers. Tiers set to your risk tolerance. 24/7 monitoring, monthly reporting, a named account manager. / No lock-in. Vendor-neutral by policy. Thirty-day hypercare after every go-live, and the documentation to leave if you ever want to. | A (documentation handover is now a live promise) |
| 8 | Friction line | No cost. No obligation. One conversation. | A |
| 8 | Button | Book the review | Confirmed |
| 8 | Telemetry | Accra, Ghana · +233 20 888 9270 · info@inflexions.tech | Existing |
| 9 | Academy | Develop Your Edge. / The same engineers who build the systems teach them — AI, cybersecurity, cloud and digital strategy, for you or your whole team. / Explore programmes | Approved / B (approved 22 Sep 2026 for Academy surfaces) / existing |
| 9 | Careers | Build the thing the country runs on. / If you want your work to be a data centre, a national network, or the system a ministry depends on — this is the room. / Open roles | B (approved 22 Sep 2026 for Careers surfaces) |
| /contact | H1 | Book your architecture review. | A |
| /contact | Lead | Thirty minutes, a Solutions Architect, no pitch. Tell us what you are running and what worries you, and we will come prepared. | A |
| /contact | Message label | What are you running, and what worries you? | A |
| /contact | Submit | Request the review | A |
| /contact | Success | Received. A Solutions Architect will reply within one working day to fix a time. If it is urgent, call +233 20 888 9270. | A (one working day is now a live promise) |
| 404 | Headline / line | That page is not on the network. / Try the navigation, or go back to the start. | A |
| Footer | Strap | Enterprise IT integration · Accra, Ghana · Since 2012 | A |

Writing rules that apply: active voice, second person for the client, first person plural for Inflexions, em dash as the momentum mark, British spelling, title case headings, no empty superlatives. Every line above follows them.

**Operational promises now carried by the copy** (the team must be able to keep each one): a written view of what to fix first after every review; a reply within one working day of a form submission; full documentation handover on every engagement; the review at no cost and no obligation.

---

## 8. Instructions for the coding agent

These are deltas against `CREATIVE_DIRECTION_3D.md`. Where the two documents disagree on the home page, this one wins.

### 8.1 Before any motion work (do this in Phase 0)

1. **Done on the live site, 21 September 2026.** `src/app/components/Partners.tsx` now renders the seven real clients from `public/logos/`, and `partners.css` was corrected for seven items with `object-fit: contain`. `public/assets/clients/` is no longer referenced and can be deleted in Phase 0.
2. Remove `TestimonialSlider` from `src/app/page.tsx`. Keep the component file until Beat 7's condition is decided. Remove `assets/Testimonials/test1-3.png` from anything served.
3. Change both existing CTAs (hero and closing) to the single offer wording in Section 1. The wording is confirmed; only the lines marked New in Section 7 still await sign-off.

### 8.2 Chapter mapping (Phase 2 onward)

| Creative-direction chapter | Becomes | Change |
|---|---|---|
| 00 Arrival | Beat 0 | Add offer line and scroll cue text. Single button. |
| 00b Trust strip | Beat 1 | Real roster. Range 100 to 130 vh. |
| 01 Turning point | Beat 2 | Range 130 to 240 vh. Add the ember-node-to-thread carry. |
| 04 Proof | **Beat 3, moved up** | Range 240 to 360 vh. Obsidian, not Ivory. Two cards (Blu delivered, MTN in progress), not one. Counters move here from the Advantage chapter. |
| 02 Four pillars | Beat 4 | Range 360 to 680 vh (80 per pillar, was 100). Add partner lines. Add the column-cap-to-thread carry. |
| 03 Advantage | **Cut** | Replaced by Beat 5. Counters relocated to Beat 3. `InflexionsAdvantage.tsx` and the `mid/` images are no longer used on the home page. |
| 05 Intelligence | **Folded** into Beat 5 | One row, four term links. No separate chapter, no `uFocus` hover link to the Core (the Core is hidden in Ivory). Remove the `uFocus` uniform requirement. |
| 06 Academy | **Moved** to Beat 9 | After the ask. Half-width panel beside Careers. |
| 07 Partners | Beat 6 | Range 800 to 860 vh. |
| 08 Voices | Beat 7, conditional | See condition. Default is omitted. |
| 09 The mark | Beat 8 | Range 920 to 1030 vh. Offer block replaces the AI-session copy. |
| (none) | Beat 5, new | `home/Difference.tsx`: ledger with strike-through draw, intelligence row. |
| (none) | Beat 9, new | `home/SideDoors.tsx`: Academy and Careers panels. |

Component list for `src/app/components/home/` becomes: `Arrival`, `TrustedBy`, `TurningPoint`, `Receipt`, `Pillars`, `Difference`, `PartnerWall`, `Voices` (conditional), `TheAsk`, `SideDoors`.

### 8.3 The thread

Implement once as `src/motion/Thread.tsx`: a 1 px, 48 px tall vertical line in `ember` on Obsidian and `red-500` on Ivory, positioned at the end of a beat, that draws top-to-bottom over 480 ms with `ease.out` when its beat's exit link has revealed. It accepts an `x` prop (left, centre, right, or a pixel offset) so each beat can place it where the carry needs it. In Beat 2 and Beat 4 the thread is triggered by the Core: `store.threadAt = { x, y }` is written by the scene when the ember node or column cap reaches its detachment point, and the page positions the thread at that projected screen point. In Beat 8 the thread draws first, before the eyebrow.

### 8.4 The strike-through

In `Difference.tsx`, each left-column line has a pseudo-element `::after` at 50% height, `1.5px` tall, `neutral-900`, `transform: scaleX(0)` with `transform-origin: left`, animated to `scaleX(1)` over 400 ms with `ease.out` when the line is 30% visible. The matching right-column line reveals 120 ms after its strike completes. Reduced motion: strikes are present at load, no animation.

### 8.5 Timeline ranges for `src/three/core/timeline.ts`

| Range (vh) | Formation from → to | Canvas |
|---|---|---|
| 0 – 130 | 0 → 0, noise 0 | visible |
| 130 – 240 | 0 → 0, noise 0.35 → 0, ember line 0 → 1 | visible |
| 240 – 340 | 0 hold | visible, 70% opacity |
| 340 – 360 | 0 → 1 begins | visible, back to 100% |
| 360 – 680 | 1 → 2 → 3 → 4, pinned | visible |
| 680 – 710 | fade to 0, reset to formation 0 while hidden | fading, then paused (`frameloop="demand"`) |
| 710 – 920 | hidden | paused |
| 920 – 980 | 0 → 5 | visible, bloom 0.55 → 0.9 |
| 980 – 1030 | 5 hold | visible |
| 1030 – end | fade to 0 | fading, then unmount |

### 8.6 Mobile journey

Same ten beats, same order, same copy. Beat 4 unpinned (four stacked blocks with posters). Beat 3 cards stack, Blu first. Beat 5 ledger stacks: each struck line is followed immediately by its instead line. Beat 9 panels stack. Tier C devices see posters at every Obsidian beat with the same composition as the live scene.

### 8.7 What not to change

The offer wording is not to be softened, split, or duplicated. No beat gets a second exit. No grid of four cards anywhere on the home page. No chapter is added between Beat 3 and Beat 4. The Academy does not move above the ask.

---

## 9. Open decisions for the owner

1. ~~The written follow-up promise in the offer.~~ **Decided 21 September 2026: confirmed.**
2. ~~Client logo permissions for the seven existing clients.~~ **Decided 21 September 2026: approved, and live.**
3. ~~MTN Ghana on the home page.~~ **Decided 21 September 2026: named in Beat 3 as work in progress; MTN logo is not added to the roster.** Still open: written confirmation that MTN and the Ministry may be named on the home page.
4. **Testimonials.** Are there two real, attributable quotes with permission? If not, Beat 7 is omitted.
5. **Partner column assignment** as proposed in Beat 6.
6. **Counter values** 2012, 80+, 50+ reconfirmed.
7. ~~New copy lines.~~ **Decided 22 September 2026: Variant A of `COPY_DECK.md` approved in full; Section 7 is now the baseline.**
8. **Delivering the written follow-up.** Decide who writes it, the template, and the turnaround. The page does not promise a timeframe; do not add one unless the team will keep it.
