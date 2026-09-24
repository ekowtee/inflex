# Phase 5 Report — The interior pages

**Branch:** `phase-5-interior`, ten commits off `5780dad`.
**From:** the interior session, 24 September 2026.
**For:** the spine session, which picks the branch up next, and the owner for the decisions in Sections 5 and 6.

All ten tasks are complete. No pull request opened, nothing merged.

---

## 1. Gate

| Gate item | Result |
|---|---|
| `npx next build` passes | **Yes.** Compiles and prerenders every route. (`npm run build` also runs `prisma generate`, which still fails with `EPERM` while the owner's dev server holds the engine DLL. Unrelated to this branch and unchanged since Phase 2.) |
| `npx eslint src/app` 0 errors | **Yes.** 6 warnings, all pre-existing in `src/app/admin/*` and present on `main`. None in anything this branch touched. |
| `npx tsc --noEmit` clean | **Yes.** No `any` anywhere in the branch. |
| `npm test` passes | **Yes.** 87 passing, 0 failing. |
| `perf-gate --bundles` passes; shell grows ≤ 3 KB gz | **Yes.** Table in Section 2. |
| No interior route loads the environment chunk | **Yes.** Measured from the network panel on all twelve routes; no request matching `three`/`environment` on any of them. |
| Every interior H1 is `type-display-l` | **Yes.** Script output in Section 3. |
| `grep -rnE "border-l-[2-9]\|border-l-\[[2-9]" src/app --include=*.tsx` finds nothing outside admin | **Yes.** No matches at all, inside admin or out. |
| `git diff main` empty for the locked paths | **Yes.** Empty for `src/three`, `src/motion`, `Header.tsx`, `Footer.tsx`, `academy/data.ts`, and also for `src/app/page.tsx`, `src/proxy.ts`, `src/lib`, `.github`, `scripts` and `prisma`. |
| Every Obsidian band carries `data-header-dark` | **Yes.** Checked in the browser on all twelve routes; zero `.band-obsidian` elements without it. |
| Keyboard: everything reachable in visual order, focus visible on both registers | **Yes, with one note.** Section 4. |
| Reduced motion: every page reads complete | **Yes.** Section 4. |
| Screenshots at 1280 and 390 px | [docs/phase5/](docs/phase5/), 24 files. Index in Section 9. |

Two routes this branch rewrote fall outside the brief's screenshot list and so were checked separately after the fact: `/resources` and `/case-studies/[id]`. Both pass every automated check above, and both turned up the grid problem recorded in Section 7.8.

---

## 2. Bundles

`node scripts/perf-gate.mjs --bundles` after `npx next build`, both branches measured the same way:

| | `main` | `phase-5-interior` | Budget |
|---|---|---|---|
| Route shell | 165.3 KB gz | **165.4 KB gz** | 205 KB gz |
| Motion chunk | 49.1 KB gz | 49.1 KB gz | 60 KB |
| Environment chunk | 144.1 KB gz | 144.1 KB gz | 190 KB |
| Preloaded fonts | 46.1 KB | 46.1 KB | 48 KB |
| `public/` total | 5975.5 KB | **5341.1 KB** | 15360 KB |

The shell grew **0.1 KB gz** against a 3 KB allowance. Thirty-odd pages and components were rewritten and almost none of it reached the bundle, because almost none of it is client code: `PageHero`, `AskBand`, `SolutionPage`, `ServicePage`, `PartnerColumns`, `ClientRoster`, `Leaders`, `Blog`, `FeaturedJobs`, `DomainCard`, `ProgrammeCard`, `LevelBadge`, `ProgrammeDetailsSidebar`, `AudienceSwitcher`, `RelatedTraining`, `SolutionPartners` and `ExitLink` are all server components. What client code was removed — `MainPartners`' five-second carousel timer, `Partners`' marquee, `AcademyHero` — roughly cancels what the contact form's extraction added.

`public/` is 634 KB lighter: nine unused hero photographs moved out of the served folder.

---

## 3. The H1 script

Run in a headless browser against the production build, one H1 expected per route, `type-display-l` required:

```
ok    1 h1  type-display-l text-silver-100  <- /about
ok    1 h1  type-display-l text-silver-100  <- /solutions
ok    1 h1  type-display-l text-silver-100  <- /solutions/network-infrastructure
ok    1 h1  type-display-l text-silver-100  <- /services
ok    1 h1  type-display-l text-silver-100  <- /services/managed
ok    1 h1  type-display-l text-silver-100  <- /academy
ok    1 h1  type-display-l text-silver-100  <- /academy/ai-intelligent-systems
ok    1 h1  type-display-l text-silver-100  <- /academy/ai-intelligent-systems/ai-foundations
ok    1 h1  type-display-l text-silver-100  <- /careers
ok    1 h1  type-display-l text-silver-100  <- /case-study
ok    1 h1  type-display-l text-silver-100  <- /contact
ok    1 h1  type-display-l mt-6 max-w-[20ch] text-silver-100  <- 404
```

Four pages had a heading problem before this, not just a styling one, and all four are fixed by the hero taking the H1:

- **`/solutions`** opened with an `<h2>` and put its `<h1>` in a section halfway down the page.
- **`/services`** and **`/resources`** did the same.
- **`/about`** and **`/contact`** each carried a **second** `<h1>` — "Your Strategic Technology Partner" on About, and "Our Clients" inside the `Partners` ticker on Contact.

In every case both lines are kept: the hero's line becomes the H1, the other keeps its place as an H2. No copy was written or removed to achieve it.

---

## 4. Keyboard and reduced motion

**Focus rings.** Every focusable element inside `<main>` on all thirteen routes carries a visible ring, measured as outline contrast against the band it actually sits on. No failures. The Obsidian rule (`.on-obsidian :focus-visible` → silver) covers the new dark bands because every one of them carries `.on-obsidian` alongside `.band-obsidian`.

**Tab order.** Matches visual order everywhere except two places, and both are correct rather than broken: on `/contact` and on a programme page the tab moves from the bottom of the main column (x=32) to the top of the aside beside it (x=913). That is main-content-then-aside, which is the reading order a two-column layout should have. Within each column the order is strictly top to bottom.

**Reduced motion.** Under `prefers-reduced-motion: reduce`, all thirteen routes read complete: zero un-revealed `Reveal`s, zero elements with text at `opacity: 0` or `visibility: hidden`, and the word count matches the full-motion render.

The caveat recorded in `PHASE2_REPORT.md` §4 still applies and is unchanged by this branch: `Reveal` reveals on intersection rather than at load, so content below the fold appears as the reader arrives at it rather than being present at `scrollY: 0`. It appears instantly rather than animating. Fixing that is a change to `src/motion/`, which this branch may not touch.

---

## 5. Copy: what was kept, what was removed, and what needs you

Copy was kept verbatim everywhere except Tasks 8 and 10, which carry approved lines. **Four things were removed**, none of them because of taste, and each needs a nod:

**1. About: the "10 Years Of Experience" roundel.** A red circle floating over a photograph. It is a red badge, which the redesign does not allow, and the number is wrong: the same page dates the founding to 2012 and its own H1 counts eighty combined years. Removing the badge removed its text. **If you want the claim back, it needs a current number and a treatment that is not a red roundel.**

**2. Careers: the "Search Job" field.** An `<input>` with no state, no handler and no `<form>` around it. It searched nothing. The paragraph beside it is kept.

**3. Contact FAQ: the "Free Consultation" box.** A red box floating over a photograph with a phone icon in a circle and a `<button>` that did nothing. "Free" is the one word `COPY_DECK.md` §8.3 says the offer must never use, and the box repeated the phone number the page already gives twice.

**4. Services index: the logo in a box.** The company logo inside a bordered, shadowed white card beside the opening copy. Not copy, and a card the rules no longer allow.

**Three live promises now on interior pages, for you to confirm or change:**

- **"an average of 10+ years of enterprise delivery experience"** — on every programme page's practitioner band. A time-anchored claim about people, which is exactly what the 22 September decision removed from the home page. Still live; a replacement is drafted in `PHASE5_COPY.md` §2.
- **"within two working days"** — the For Organisations enquiry form. Unchanged, and already live before this branch.
- **"within one working day"** — the contact form's success message. Approved copy, now shown.

---

## 6. Questions I could not answer

**1. Three dead links on `/careers`** — `src/app/careers/page.tsx:60`, `:88`, `:94`. Two point at `/jobs` and one at `/internships`. Neither route exists, and neither does a redirect (`src/proxy.ts` and `next.config` have none). They 404 today and did before this branch. I left the hrefs exactly as they were: pointing them at `/contact` would change what the page offers, and building the routes is not this branch's call. **Decide: build the routes, redirect them, or repoint the links.**

**2. Three placeholder articles on `/resources`** — `src/app/components/Blog.tsx:21`, `:29`, `:37`. All three `link` fields are `"#"`. Their titles describe work ("Boosting User Engagement by 40%") that does not correspond to anything in `src/app/data.ts`. Left as they are.

**3. `/services` does not link to its own three sub-pages.** Each of the four delivery models has a call to action pointing at `/contact`, and the three that have a page — `/services/professional`, `/managed`, `/support` — are reachable only from the header dropdown. I kept the existing hrefs rather than repointing them, since that changes what each button does. **Worth a decision.**

**4. `/academy/for-organizations` posts to a `mailto:`.** `action="mailto:sales@inflexions.tech"` with `encType="text/plain"` opens the visitor's mail client and works badly or not at all on most of them. The contact form next door posts to `/api/contact`. Out of scope here, but the two enquiry paths are not equivalent and the Academy one is the weaker.

**5. `Formation 5` is "the mark" for About.** The brief's mapping gives About formation 5. That is the formation the home page's Beat 8 morphs into as its full stop. Using it as a still on About is what the brief asks for; flagging it in case the mark is meant to stay unique to the ask.

### Answers (owner, 24 September 2026)

1. **Build them.** Done. `/jobs` lists the three roles from `src/app/careers/roles.ts`, which is now shared with Featured Jobs so the two cannot drift. Featured Jobs opens each role at `/jobs#{id}`. `/internships` says how to apply and names no programme details. Both are static and in the sitemap. Applications go by mailto to `info@inflexions.tech`, with the role in the subject, because an application needs a CV and the contact form takes no attachments.
2. **The owner will supply the articles.** The placeholders are left as they are until then.
3. **Yes.** Professional, Managed and Support now open their own pages. Digital Transformation Advisory has no page, so its button stays on `/contact`.
4. **Yes.** `TrainingEnquiryForm.tsx` posts to `/api/contact` with the subject "Academy / training", with the honeypot and Turnstile. Organisation and name map across; team size, domains, format, timeline and notes are composed into the message. The fields and labels are unchanged.
5. **Keep it there.** Unchanged.

**New copy, awaiting sign-off.** The role descriptions are the approved ones. Everything below is new:

- `/jobs` lead: "Apply by email with your CV. The role is already in the subject line, so it reaches the right team."
- `/jobs` buttons: "Apply for this role", "Send an open application".
- `/jobs` closing line: "Not your role? Send your CV to info@inflexions.tech and tell us the work you want to do."
- `/internships` lead: "Early in your career and want to work on enterprise infrastructure? Tell us who you are and what you want to learn."
- `/internships` body: "Email your CV to info@inflexions.tech with "Internship" in the subject line. Add a short note on what you are studying, the area you want to work in and when you are available."
- `/internships` list "The work is in": Network engineering, Cloud, Cybersecurity. Link: "Qualified already? See the open roles."
- Enquiry success: "Received. Our Academy team will be in touch within two working days to design your engagement." This reuses the page's own promise.
- Enquiry failure: "… Nothing was sent. Try again, or email sales@inflexions.tech and we will pick it up from there."

**Also needs you.** The Featured Jobs photographs, now also on `/jobs`, are Tesla material: a car-factory robot, battery cells, and a circuit board printed "TESLA". The same three were on `/careers` before this branch. They need replacing with the site's own images. Also confirm whether applications should go to a dedicated careers address rather than `info@`.

---

## 7. Deleted, moved, and changed beyond the brief

**Components deleted** (each only after nothing imported it):

| File | Why |
|---|---|
| `Banner.tsx` | Replaced by `AskBand` on sixteen pages. |
| `MainPartners.tsx` | The autoplaying carousel; replaced by `PartnerColumns` on `/solutions`. |
| `AcademyHero.tsx` | Replaced by `PageHero`. |
| `Partners.tsx`, `partners.css` | The CSS marquee; replaced by `ClientRoster` on `/about` and `/contact`. |
| `ClientStrip.tsx` | Already unused before this branch. |
| `leaders.css` | The `Leaders` card deck's stylesheet. |

**Components added:** `PageHero`, `AskBand`, `PartnerColumns`, `ClientRoster`, `SolutionPage`, `ServicePage`, and `contact/ContactForm.tsx`.

**Still unused, and left alone:** `FeatureSection.tsx`, `MultiCardSection.tsx` and `SolutionsGrid.tsx` had no importers before this branch and still have none. They were not made unused by this work, so deleting them was not this branch's call.

**Images moved out of `public/`** — nine, all to `assets-src/unreferenced/` keeping their paths. Nothing under `public/` was deleted.

`about/aboutbg.webp`, `about/vidmin.webp`, `career/careerbg.webp`, `career/careersbg.webp`, `career/faq.webp`, `case/casebg.webp`, `contactbg.webp`, `hero/map.webp`, `services/Servicesbg.webp`, `vidmiin.webp`.

Note that `.gitignore:49` excludes `assets-src/unreferenced/`, by the project's own convention ("Archive them elsewhere before deleting the working copy"), so these show in `git diff` as deletions from `public/` with no matching addition. **Nothing is lost: every one of them has its master committed in `assets-src/originals/`** — verified file by file. One of them, `vidmin.webp`, was moved with `git mv` and so got staged against that convention; it has been untracked so the directory is uniformly ignored.

**Changed beyond what the brief asked, with reasons:**

1. **`.photo-grade` landed in the Task 3 commit rather than Task 7.** Every page from Task 3 onward references it, so it had to exist before the pages that use it.
2. **Contact's form moved into `contact/ContactForm.tsx`.** The page was `"use client"` in its entirety for the sake of one form; splitting it lets the page be a server component and keeps the form's behaviour untouched.
3. **Contact's fields gained labels.** They had placeholders only, which disappear on first keystroke — so the one question the offer promises to come prepared for was gone by the time it was being answered. Fields, names and the POST are unchanged.
4. **The four pillar pages and the three service pages were each collapsed onto one shared layout** (`SolutionPage`, `ServicePage`). They were copies of one layout that had drifted apart in the details; as copies, the tokens would have had to be got right four and three times.
5. **A dead status test was removed on the case-study detail page.** It compared `study.status` to a lower-case `"completed"` that `data.ts` never contains, so the delivered study rendered in the "in progress" amber. The pill went with the redesign; the bug went with it.
6. **`/solutions`' photo strip was folded into the four domain entries.** The strip repeated the four domains that were already listed above it, as pictures with a red "Premium Solutions" label. Folding the photographs into the entries keeps every image and removes the duplication.
7. **Five grids were made count-aware** (`components/entryGrid.ts`). Found by rendering `/resources` and `/case-studies/[id]`, which the brief's screenshot list did not cover and which nothing but tsc had seen. Several lists are shorter than the grid they sat in: there are two case studies, so "Related Case Studies" is always exactly one entry in three columns; two of the four Academy domains hold two programmes, so their catalogue and their "Related Programmes" under-fill too; and `/resources` has two whitepapers. Each left a row two-thirds empty, which reads as content that failed to load. The grid now stops where the entries do. Verified across fifteen routes: no grid anywhere has fewer children than columns.

8. **`PageHero` carries no scrim over the formation still.** The brief describes the still and the copy column overlapping. Measured across all five stills, the left 45% of the frame has a maximum luminance of 7 of 255, so the copy already has its contrast and a wash would only dim the object the band exists to show.

---

## 8. For the spine session

`/solutions`' hero renders `<div data-core-slot class="absolute inset-0" aria-hidden="true">` as the first child of the section, behind the copy (`PageHero.tsx:96`). Nothing mounts into it. The band is plain Obsidian until you do.

Every interior Obsidian band carries `data-header-dark`, including the ones added inside `SolutionPage`, `ServicePage`, the Academy pages, About, Careers and the 404. The first-paint register flash on interior routes is still there and still yours.

---

## 9. Screenshots

In [docs/phase5/](docs/phase5/), full page, at 1280 px and 390 px, taken against the production build so no dev toolbar appears:

`about`, `solutions`, `solutions-pillar` (Network Infrastructure), `services`, `services-managed`, `academy`, `academy-domain` (AI & Intelligent Systems), `academy-programme` (AI Foundations), `careers`, `case-study`, `contact`, `404` — each as `<name>-1280.png` and `<name>-390.png`.

---

## 10. Commits

```
62a67fe phase5(copy): Variant B drafts for sign-off
a357a0b phase5(404): not on the network
8c30287 phase5(parts): photo grade, buttons, FAQ
9563ed3 phase5(services): index and service pages
72ebfc1 phase5(pages): about, careers, case studies, resources
9f72008 phase5(academy): landing, domains, programmes, for organisations
2701bcc phase5(solutions): index, pillars, partner columns shared, carousel gone
8e3af1c phase5(contact): approved lines and form
9b20f93 phase5(ask): AskBand replaces Banner
6d2ce2a phase5(hero): PageHero with formation stills
```

Tasks 1, 2 and 8 were done first as the brief's §8 orders, then 3, 5, 6, 4, 7, 9, 10; the commit order above is the order they landed.
