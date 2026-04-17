# Inflexions Academy: Strategy & Implementation Plan

## Context

A director proposed adding Training to the Inflexions portfolio, targeting individuals and institutions across AI, cybersecurity, cloud, infrastructure, and digital strategy. The user wants this designed as a scalable offering -- decoupled from individual directors -- and seamlessly integrated into the website. This plan addresses both the strategic framing (McKinsey lens) and brand integration (Droga5 lens).

---

## Part 1: Strategic Assessment

### Why This Is a Strong Move

1. **Revenue diversification**: Training is high-margin, recurring, and counter-cyclical to project-based consulting.
2. **Pipeline generation**: Training creates awareness --> trust --> consulting engagements. A CTO who sends engineers to an Inflexions cloud course will think of Inflexions when they need a cloud migration partner.
3. **Credibility signal**: Having a structured academy says "we don't just implement -- we teach." It positions Inflexions above generalist vendors.
4. **Market fit**: Ghana and West Africa have massive IT skills gaps. Corporate L&D budgets are growing. International certifications (ISO 27001, CISA, CISM) are in high demand.

### Where Training Sits in the Value Chain

Training is NOT a fifth Solution pillar or a fourth Service type. It is a **third top-level offering category**:

| Category | Question it answers | Examples |
|---|---|---|
| **Solutions** | "What do we build?" | Network Infra, Cloud, Security, Data |
| **Services** | "How do we engage?" | Professional, Managed, Support, Advisory |
| **Academy** | "How do we upskill?" | AI & LLMs, InfoSec, Cloud Ops, Strategy |

Training has its own buyer personas (L&D managers, individual professionals), its own sales cycle, and its own pricing model. It deserves its own top-level presence.

### Naming: "Inflexions Academy"

- "Academy" signals structured, rigorous learning -- not ad-hoc workshops.
- It creates a sub-brand that can scale independently.
- It mirrors the naming convention of established IT training arms (Cisco Networking Academy, AWS Academy).
- "Training" feels transactional; "Academy" implies curriculum, progression, and institutional weight.

---

## Part 2: Training Domain Taxonomy (Person-Independent)

Four competency domains, each with sub-tracks. No instructor names -- any qualified instructor slots in.

### Domain 1: AI & Intelligent Systems
- AI Foundations (Basic / Intermediate)
- Advanced LLM Engineering
- AI for Industry (Healthcare, Advertising & Marketing, Education, DevOps, Finance, Insurance)
- AI-era Business Strategy

### Domain 2: Infrastructure & Cloud
- Network Architecture (Design, Implementation, Optimization)
- Data Centre Design & HCI
- Virtualization & Containerization (VMware, Kubernetes, Docker)
- Cloud Operations (AWS / GCP / Azure -- per provider)
- Linux Systems Administration (Basic / Intermediate)
- Windows Server Administration (Basic / Intermediate)

### Domain 3: Cybersecurity & Compliance
- Information Security Fundamentals
- Security Operations (Intermediate)
- Advanced Security Architecture
- Governance, Risk & Compliance (GRC)
- ISO 27001 Implementation & Auditing
- CISA / CISM Exam Preparation

### Domain 4: Digital Strategy & Transformation
- Marketing & Digital Communications Strategy
- Digital Transformation for Startups
- Enterprise Digital Strategy
- Data-Driven Decision Making
- Starting a Business to Succeed

---

## Part 3: Dual Audience Strategy

Two audiences -- individuals and corporates -- served from one catalog:

- **Badge differentiation**: Programmes tagged "Open Enrolment" (individuals) or "Enterprise Programme" (corporates) or both.
- **Dual CTAs on every programme**: "Register as Individual" + "Request Corporate Training."
- **Dedicated `/academy/for-organizations` page** speaking to L&D buyers: custom curricula, on-site delivery, ROI reporting, volume pricing.

---

## Part 4: Navigation & Discovery

**Header.tsx is UNLOCKED for this task** -- Academy gets full nav visibility.

### Header Changes (`src/app/components/Header.tsx`)
- Add "Academy" as a **dropdown nav item** after "Services", following the exact same pattern as Solutions/Services dropdowns.
- Add `academyDropdownOpen` state alongside the existing dropdown states.
- Dropdown submenu items:
  - AI & Intelligent Systems (`/academy/ai-intelligent-systems`)
  - Infrastructure & Cloud (`/academy/infrastructure-cloud`)
  - Cybersecurity & Compliance (`/academy/cybersecurity-compliance`)
  - Digital Strategy (`/academy/digital-strategy`)
  - For Organizations (`/academy/for-organizations`)
- Nav order becomes: Home, About, Solutions, Services, **Academy**, Case study, Careers

### Additional Discovery Points
1. **Footer**: Add "Academy" link in the Company column.
2. **Homepage**: New "Develop Your Edge" section between IntelligentAutomation and MainPartners.
3. **Cross-links**: Each Solution detail page gets a "Related Training" callout before the Banner.
4. **SEO/Direct traffic**: `/academy` pages optimised for search.

---

## Part 5: Route Architecture

```
/academy                              -- Landing page
/academy/ai-intelligent-systems       -- Domain page
/academy/infrastructure-cloud         -- Domain page
/academy/cybersecurity-compliance     -- Domain page
/academy/digital-strategy             -- Domain page
/academy/[domain]/[programme]         -- Programme detail page (dynamic)
/academy/for-organizations            -- Corporate training page
```

---

## Part 6: Page Designs

### `/academy` -- Landing Page
1. **Hero**: Full-width bg image, dark overlay. "Inflexions Academy" + "Expert-led training in AI, cybersecurity, cloud, and digital strategy."
2. **Audience Switcher**: Two cards -- "For Individuals" and "For Organizations" with value props and CTAs.
3. **Domain Cards Grid**: 4-column grid showing the 4 domains (icon, title, programme count, "Explore" link). Reuse `ComprehensiveSolutions` pattern.
4. **Featured Programmes**: 3-column grid of highlighted programmes with level badges.
5. **Why Inflexions Academy**: 4 differentiators (Practitioner-Led, Enterprise-Grade Curriculum, Flexible Delivery, Certification Pathways). Reuse `InflexionsAdvantage` pattern.
6. **CTA Banner**: Reuse `Banner` component.

### `/academy/[domain]` -- Domain Page
1. **Hero**: Domain-specific image, title, subtitle.
2. **Overview**: Text + image section (like solution overview).
3. **Programme Catalog**: Grid of ProgrammeCards (title, level badge, duration, format, CTA).
4. **Benefits**: 3-column icon card grid.
5. **Cross-link**: "See how our expertise powers enterprise solutions" linking to related Solution pages.
6. **CTA Banner**.

### `/academy/[domain]/[programme]` -- Programme Detail
1. **Breadcrumb + Hero**: Programme title, domain tag, level badge.
2. **Overview**: Description, learning objectives (CheckCircle bullets), target audience, prerequisites.
3. **Curriculum Accordion**: Collapsible module list (adapt `Faq` accordion pattern).
4. **Sticky Sidebar** (desktop): Duration, format, dates, pricing, dual CTAs.
5. **Instructor Credential Strip**: "Delivered by certified practitioners with 10+ years of enterprise experience" -- collective, not individual.
6. **Related Programmes**: 3-card grid.
7. **CTA Banner**.

### `/academy/for-organizations` -- Corporate Page
1. **Hero**: "Transform Your Workforce."
2. **Value Props**: 3-column grid (Custom Curricula, On-Site Delivery, Measurable ROI).
3. **Process**: 4-step (Assess, Design, Deliver, Measure) -- numbered like the services page.
4. **Domain Overview**: 4-card grid.
5. **Enterprise Enquiry Form**: Company, contact, team size, domains (multi-select), format, timeline.
6. **CTA Banner**.

---

## Part 7: Scope -- Lean Launch (2-3 Programmes per Domain)

~10 total programmes to start. Suggested initial catalogue:

**AI & Intelligent Systems** (3):
- AI Foundations (Beginner)
- Advanced LLM Engineering (Advanced)
- AI for Industry Applications (Intermediate)

**Infrastructure & Cloud** (3):
- Cloud Operations: AWS & Azure (Intermediate)
- Network Architecture Fundamentals (Beginner)
- Virtualization & Containerization (Intermediate)

**Cybersecurity & Compliance** (2):
- Information Security Fundamentals (Beginner)
- ISO 27001 Implementation & Auditing (Advanced)

**Digital Strategy & Transformation** (2):
- Marketing & Digital Communications Strategy (Intermediate)
- Starting a Business to Succeed (Beginner)

---

## Part 8: Implementation Phases

### Phase 1: Data Layer & Core Components
- Create `src/app/academy/data.ts` -- Typed data for domains and programmes (no database; static data)
- Create components:
  - `src/app/components/AcademyHero.tsx`
  - `src/app/components/DomainCard.tsx`
  - `src/app/components/ProgrammeCard.tsx`
  - `src/app/components/LevelBadge.tsx`
  - `src/app/components/CurriculumAccordion.tsx` (adapt Faq pattern)
  - `src/app/components/ProgrammeDetailsSidebar.tsx`
  - `src/app/components/AudienceSwitcher.tsx`

### Phase 2: Academy Pages
- `src/app/academy/layout.tsx` + `page.tsx` -- Landing page
- `src/app/academy/[domain]/page.tsx` -- Domain pages (dynamic, rendered from data.ts)
- `src/app/academy/[domain]/[programme]/page.tsx` -- Programme detail pages
- `src/app/academy/for-organizations/page.tsx` -- Corporate page

### Phase 3: Site Integration
- **Edit** `src/app/components/Header.tsx` -- Add Academy dropdown nav item (new state, submenu with 5 items)
- **Edit** `src/app/components/Footer.tsx` -- Add "Academy" link
- **Create** `src/app/components/AcademyPromo.tsx` -- Homepage section
- **Edit** `src/app/page.tsx` -- Insert AcademyPromo between IntelligentAutomation and MainPartners
- **Create** `src/app/components/RelatedTraining.tsx` -- Cross-link component
- **Edit** 4 solution detail pages -- Add RelatedTraining before Banner

### Phase 4: SEO & Polish
- Add `public/assets/academy/` images
- Update sitemap with academy routes
- Add Course schema.org JSON-LD to programme pages

---

## Part 9: Component Reuse Map

| Existing Pattern | Reuse For | File Reference |
|---|---|---|
| Solution page hero | AcademyHero | `src/app/solutions/cloud-services/page.tsx:41-63` |
| ComprehensiveSolutions grid | Domain cards grid | `src/app/components/ComprehensiveSolutions.tsx` |
| InflexionsAdvantage cards | "Why Academy" section | `src/app/components/InflexionsAdvantage.tsx` |
| Banner CTA | All academy page footers | `src/app/components/Banner.tsx` |
| Faq accordion | CurriculumAccordion | `src/app/components/Faq.tsx` |
| Services numbered steps | Corporate "How It Works" | `src/app/services/page.tsx` |
| CheckCircle bullet lists | Learning objectives | Solution overview sections |

---

## Part 10: Key Design Decisions

1. **Static data, no CMS/LMS**: This is a marketing site. All programme content lives in `data.ts`. No login, no progress tracking, no video. Course delivery happens off-platform.
2. **Person-independent**: No instructor profiles. Credibility through domain descriptions, collective certifications, and outcomes.
3. **Header unlocked for Academy**: New dropdown nav item added after Services, following existing dropdown pattern.
4. **`generateStaticParams`**: All dynamic routes pre-rendered at build time from data.ts.
5. **Tailwind v4 conventions**: Inline classes, `max-w-7xl` container, brand colour tokens.

---

## Verification Plan
1. `rm -rf .next && npm run dev` -- Verify all academy routes render without errors
2. Navigate every route: `/academy`, each domain, at least 2 programme pages, `/academy/for-organizations`
3. Verify footer link works
4. Verify homepage section renders and links correctly
5. Verify solution page cross-links render
6. Responsive check: mobile, tablet, desktop
7. `npm run build` -- Confirm static generation succeeds for all dynamic routes
