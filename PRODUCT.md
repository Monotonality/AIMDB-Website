# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js + Supabase + Vercel (confirmed by user, 2026-10-01). Greenfield — the repository contained no `package.json`, no `app/`, and no framework config at the start of design work. Tailwind + global CSS variables for the token layer.

## Users

Four permission tiers, verbatim from the roadmap: **Public**, **Applicant**, **Member**, **Admin**.

- **Public** — unauthenticated visitor. The event calendar is explicitly open to them "without requiring authentication" (roadmap line 31).
- **Applicant** — a prospective student who has started or submitted an application. The only tier with a defined lifecycle: `Draft` → `Submitted / Awaiting Review` → `Accepted` / `Denied`.
- **Member** — an applicant whose application was approved. Approval "converts user profile status to marked full member" (line 86). Carries the `Member` flag.
- **Admin** — reviews applications, marks dues paid, manages events and expenses. No individual or job title is ever named as the approver in any document; the only actor named is the collective "administrative"/"admin".

Officers are **page content, not a permission tier**. An Officers Page is required (line 110) but no `Officer` tier exists in the four-tier list. Whether officers hold `Admin` is undecided.

Profile fields confirmed: Full Name, Expected Graduation Date, Academic Year (Freshman, Sophomore, Junior, Senior, Graduate), Major / Academic Track.

## Product Purpose

From roadmap line 4, verbatim: "The primary goal is to establish a unified digital portal to streamline member onboarding, manage membership dues/finances, facilitate event sharing, and maintain public visibility."

Four stated goals: member onboarding, dues/finances, event sharing, public visibility.

The club's own description of its purpose (email line 5): "Our club is dedicated to exploring the intersection of Artificial Intelligence and In-Memory Database (AIMDB) technologies, providing members with opportunities to engage in hands-on projects, industry-focused discussions, networking events, workshops, and other enriching activities."

**Success is not defined.** No metric, KPI, target number, timeline, or launch date appears in any document. The only completion criteria are feature and QA checks: verify the four permission tiers, and conduct responsive testing across modern browsers and mobile devices.

The product is deliberately dual-audience — an internal operations tool and an external public surface — and that duality comes from line 4 itself.

## Positioning

The distinct mechanism is a **tracked recruitment funnel rather than an open-membership club**. Email line 134: "Clear Recruitment Pipeline: Implementing a simple 4-step onboarding funnel to convert interested students into active, tracked members."

The roadmap's application state machine is the concrete expression of that funnel. The 4-state tracker is the mechanism a generic club site would not have.

Secondary, from email line 136: "Internal Operations & ERP: Leveraging a centralized tracking system for attendance, rosters, and forms to keep administrative overhead low." Note that attendance, rosters, and forms are **not** roadmap features — see Constraints.

The organizing problem, email line 9: "With our previous officers having graduated, we are looking to our current members to bring fresh ideas, enthusiasm, and leadership to help shape the club's future."

**No competitive differentiation claim exists in any document.** There is no "unlike other clubs" framing and no competitor comparison. Email line 133 is about campus recognition, not differentiation.

## Operating Context

- **Semesters**: Fall / Spring only (lines 37, 100). No academic calendar or term dates.
- **Dues**: tracked per member, filterable by semester and year, with a financial overview of total collected against itemized expenses. **The dues amount is never stated in any document.**
- **Events**: CRUD with location, time, description, and link. Event types named across the documents: hands-on projects, industry-focused discussions, networking events, workshops, and "foundational introductory events to help new members build baseline technical knowledge."
- **Semester kickoff ritual**, email line 13: "To kick off the semester, we will be scheduling an in-person meeting with all current members to discuss upcoming activities, membership expectations, and leadership opportunities."
- **Auth**: email/password or magic links (line 20) — method undecided.
- **Institution**: University of Texas at Dallas, Naveen Jindal School of Management, Department of Information Systems. Real course codes appearing in member data: ITSS 3300, ITSS 4300, ITSS 4355.
- **Faculty advisor**: Naser Islam, Associate Professor of Practice, Academic Advisor of the AIMDB. Named in email correspondence; **never assigned a permission tier or a workflow step** in the roadmap.

## Capabilities and Constraints

Required schemas: `Users`, `Applications`, `Events`, `Dues`, `Expenses`. Routes: `/login`, `/signup`, `/profile`, `/apply`, and an events endpoint.

**Undecided by the user or the source documents:**
- Event calendar URL architecture: `events.aimdb.org` subdomain or a path-based `/events` (line 30, "or" left open).
- Auth method: email/password or magic link (line 20).
- Whether `Officer` is a fifth tier or a subset of `Admin`.
- Event publish states — "create, update, and publish" (line 40) is never enumerated, unlike application states.
- Whether the Faculty Advisor has any workflow role.

**Known scope gaps — required by the roadmap but with no content to fill them:**
- **Officers Page has no source data.** Zero officer names or titles exist in any readable file; the previous board graduated. User decision: design the page and its empty state now, populate later. Do not fabricate a board.
- **Dues amount** — tracked but never priced. Any finance-facing copy is blocked on this.
- **Mission statement** — the landing page requires "an overview of AIMDB mission" (line 46); the sentence itself has never been written. Email line 5 is the closest existing text.
- **Expense seed data** — schema required, no records exist.
- **Past events, event history, and photographs** — none exist. Every event in every document is future-tense. The assets folder contains logos only.

**Out of scope for the MVP (user decision, 2026-10-01):**
- "AIMDB Accelerate," the 8-week mentorship program proposed in email line 138. It is real and intended for officer succession, but it has no schema, route, page, or spec in the roadmap. Excluded so the product record does not overstate capability. Revisit after MVP.
- Also absent from the roadmap, for the same reason: the 7-member executive board restructure (line 135), attendance tracking / ERP (line 136), and early-semester introductory programming (line 137). These belong to an organizational scope, not the website MVP.

**Mandatory sequence** (line 64, verbatim): "Design aesthetics, style guide creation, and base component architecture must be completed first to ensure visual and functional consistency before developing application logic."

## Brand Commitments

- **Name**: AI & In-Memory Database Club, AIMDB, at UTD.
- **Logo**: a complete set exists in `AIMDB Assets/` — an editable vector source (`.ai`), horizontal and stacked lockups in `.svg` and `.jpg`, and a full-title mark. Binding commitment: use the existing assets; do not commission or generate a new logo.
- **Palette**: `AIMDB Assets/AIMDB Colors.txt` gives exactly three values — Light Blue `#669DFF`, Dark Blue `#001F54`, White `#F0F8FF`. These three are the only colors present in the logo SVGs.
  - Note a naming discrepancy: the colors file labels `#F0F8FF` as "White", the roadmap calls it "Surface Neutral"/"Light Neutral". Same hex, two names.
  - **Measured contrast, computed 2026-10-01** (WCAG 2.2 relative luminance):
    - `#001F54` on `#F0F8FF` — **14.79:1**, passes AAA
    - `#669DFF` on `#F0F8FF` — **2.5:1**, fails AA for body text (4.5:1) *and* fails the 3:1 large-text and non-text-component threshold
  - Consequence: `#669DFF` cannot carry text on the light surface. It is usable for borders, focus rings, large non-text graphics, and dark-surface accents only. This is a hard constraint on the token layer, not a preference.
- **Typography direction**: "Clean, modern sans-serif typography paired with high-contrast UI components and consistent border radii across forms, cards, and modal components" (line 16).
- **UGC templates**: email line 133 commits to "a unified style guide (logo, typography, and templates) to increase campus recognition and streamline member-generated content." Member-generated posts are expected to stay on brand. Bind future social/collateral work.
- **UTD affiliation**: roadmap line 15 references "UTD Comet Orange / Modern Neutral accents." Not present in the three-color asset file. Unresolved whether it enters the palette.

## Evidence on Hand

Real, usable:
- **Complete logo set** — `AIMDB Assets/`: `AIMDB Logo.ai`, `AIMDB Logo with Text.svg/.jpg`, `AIMDB Logo Stack.svg/.jpg`, `AIMDB Full Title.svg`, `AIMDB Logo Full Title.jpg`.
- **Palette file** — `AIMDB Assets/AIMDB Colors.txt`.
- **19-member roster** — `AIMDB Assets/background Context.txt` lines 218–467. 19 people, 11 M / 8 F. Columns: Number, Gender, Last Name, First Name, UTD Email, Course. Courses: ITSS 3300 ×10, ITSS 4355 ×7, ITSS 4300 ×2.
  - **Caveats: the file ends immediately after row 19 and appears truncated. It carries no officer titles. It contains real student PII — publishing it is a privacy decision, not a content decision, and must not be assumed.**
- **Contact details** — Naser Islam, `naser.islam@utdallas.edu`, 972.883.5025, JSOM 2.415 (email lines 32–34). Sufficient for the Contact Page.
- **Strategy proposal PDF** — `AIMDB Assets/AIMDB Strategic Restructuring Proposal (1) (1).pdf`, 137 KB, the attachment referenced at email line 139. **Unread.** Lines 133–138 are a summary of it, so the PDF is the likely richest source for positioning and any dates or budget. Open it before relying on the organizational claims above.

**Future work must not fabricate:** officer names and titles, member testimonials, past events or dates, attendance figures, expense records, dues amounts, member counts as a marketing statistic, or any logo wall.

## Product Principles

1. **Design system before logic.** The sequence is fixed by the source document; aesthetics and component architecture are not a later polish step.
2. **Accuracy over aspiration.** Where the roadmap requires content that does not exist — officers, dues amounts, past events — build the honest empty state and leave it unpopulated rather than inventing plausible data.
3. **One visual authority for two registers.** The same tokens must carry a public marketing surface and a dense internal admin panel without drifting into two inconsistent products.
4. **The funnel is the mechanism.** Application state is a first-class, visible part of the product, not hidden plumbing.
5. **Verified contrast, not decorative contrast.** "High-contrast" is a measurable commitment. The palette already fails AA at `#669DFF` on `#F0F8FF`; every further pairing gets computed, not eyeballed.

## Accessibility & Inclusion

**WCAG 2.2 AA** is an explicit product constraint, confirmed by the user 2026-10-01. Nothing in the source documents commits to any standard; "high-contrast UI components" (line 16) is a visual instruction with no threshold attached. This adoption is a product decision, recorded here so it stops being an assumption.

Practical consequences already known:
- `#669DFF` on `#F0F8FF` measures 2.5:1 and is unusable for text. Text colors must come from `#001F54` and derived steps.
- Responsive layout testing across browsers and mobile devices is a stated completion criterion (line 113).