# Agent Prompt

> Act as a senior frontend engineer and product designer. First inspect the existing BhuSetu Next.js frontend and preserve the current dashboard routes and reusable components. Implement the landing-page redesign described in this document, using the attached screenshots only as visual references and treating the numbered user requirements as the source of truth. Keep the landing page concise, accessible, responsive, and credible for an Indian Government/SIH demonstration. Do not fabricate official emblems, ministries, legal claims, Gazette records, integrations, or authentication. Reuse the existing `AuthContext` only for demo behavior until real authentication is connected, and clearly separate UI role selection from enforceable backend RBAC. After implementation, run typecheck, lint, and a production build, then manually verify desktop/mobile layout, keyboard navigation, login routing, and removal of the specified sections.

# BhuSetu Landing Page Implementation Plan

## 1. Objective

Redesign the public landing page to make it clearer, shorter, more credible, and easier to use for two primary audiences:

1. Citizens / affected families who need access to their acquisition information.
2. Authorities and project stakeholders who need to sign in to their scoped workspaces.

This plan changes the public landing experience only. Existing dashboard functionality and routes should remain intact unless a small shared-header or authentication change is required for consistency.

## 2. Current implementation baseline

The relevant files are:

- `frontend/app/page.tsx`: the landing page currently owns the hero, fake public Khasra search, Gazette data, role gateway, stakeholder pillars, legal framework, and footer.
- `frontend/components/layout/app-header.tsx`: shared public header, Government of India text, ministry text, branding icon, and the `Go to Official Dashboard` / login action.
- `frontend/app/login/page.tsx`: existing login and demo role selection experience.
- `frontend/lib/auth-context.tsx`: preset roles persisted in `localStorage`; this is demo persona switching, not real authentication or security.
- `frontend/app/layout.tsx`: currently loads Inter through `next/font/google` and applies it globally.
- `docs/FRONTEND.md`: existing frontend handover/status documentation that should be updated after implementation.

The landing page is currently too dense and mixes public information, internal role selection, legal explanation, hardcoded records, and authenticated-console navigation. The redesign should give each concern one clear home.

## 3. Important content and credibility issue

The supplied SIH problem statement identifies the organization as the **Ministry of Rural Development**, while the current UI repeatedly presents BhuSetu as a **MoRTH/NHAI** initiative. This is not a cosmetic detail. It affects the ministry name, emblem, footer ownership, official links, terminology, and evaluator credibility.

Before implementing official branding:

- Confirm which ministry/department is the source of truth for the team’s SIH submission.
- Use one approved organization name consistently in the header, hero, footer, metadata, and documentation.
- Do not display an official emblem or claim NIC ownership/hosting unless the team has permission and the claim is true.
- If the prototype supports multiple acquiring bodies, describe BhuSetu as a national platform and show the responsible ministry as configurable metadata rather than hardcoding MoRTH.

## 4. Proposed landing-page structure

```text
Government identity header
  - approved emblem or neutral placeholder
  - BhuSetu name
  - confirmed ministry/department name
  - compact navigation
  - Login button

Hero
  - short one-line value proposition
  - two-sentence explanation
  - Citizen Login and Authority Login actions
  - one restrained trust line

How BhuSetu works
  - Proposal and workflow tracking
  - GIS parcel verification
  - Compensation and R&R monitoring

Optional public-information strip
  - only verified, non-sensitive platform facts

Compact statutory context
  - plain-language explanation of the governing process
  - link to a dedicated resources/help page if needed

Footer
  - confirmed ownership
  - contact/help links
  - privacy/accessibility policies
  - official external resources only where verified
```

The landing page should not be a second dashboard. Detailed Gazette registers, parcel search, internal role portals, project metrics, and statutory records belong behind the appropriate route.

## 5. Requirement-by-requirement implementation plan

### 5.1 Fonts do not look good

**Current issue:** `layout.tsx` applies Inter globally. The landing page also uses many tiny labels, `font-mono` numbers, heavy uppercase tracking, and several competing text sizes. Devanagari text is not given a deliberate font strategy.

**Implementation:**

- Select one readable UI family and one optional display family; do not introduce a collection of decorative fonts.
- Use a font with reliable Devanagari support if Hindi remains visible. If the project cannot bundle a licensed font, use a deliberate system fallback stack rather than relying on accidental browser fallback.
- Define typography tokens for `body`, `heading`, `label`, `button`, and `metadata` in `globals.css`.
- Reduce the number of micro-labels and avoid uppercase text for long phrases.
- Reserve monospace for official references, IDs, dates, and tabular values—not normal marketing copy.
- Check line-height, text measure, and contrast at 320px, 768px, and desktop widths.
- Keep the header and dashboard typography compatible; do not make the landing page use an unrelated visual language.

**Acceptance:** headings remain readable without awkward wrapping, body copy is comfortable at normal zoom, and Hindi/English text does not fall back to visibly mismatched glyphs.

### 5.2 Too much text

**Current issue:** the landing page has a long hero paragraph, an announcement ticker, a role gateway, a Khasra search, stakeholder pillars, a Gazette table, a legal framework, and a large footer. Several sections repeat the same statutory/government message.

**Implementation:**

- Replace the hero paragraph with a maximum of two short sentences.
- Keep one primary statement and two audience-specific calls to action.
- Remove or move operational details instead of shrinking them into unreadable text.
- Replace the current three trust badges with at most three short, verifiable capabilities.
- Remove the statutory announcement ticker from the landing page unless it is driven by verified live data and has a clear user benefit.
- Use progressive disclosure: link to detail pages rather than placing every detail in the first public screen.
- Remove fake or unverified numerical counters from the public page, or label them explicitly as demonstration data.

**Acceptance:** a first-time visitor can understand what BhuSetu is, choose the correct login path, and find help without reading a long document.

### 5.3 Citizen and authority login paths

**Current issue:** most role links in the landing page route to the same `/login` page, while the page presents four internal roles alongside citizens. This exposes implementation roles before the visitor has identified their audience.

**Implementation:**

- Make the two top-level paths explicit:
  - `Citizen / Affected Family Login`
  - `Authority / Department Login`
- Route both actions to `/login` with a query or state parameter, for example `/login?type=citizen` and `/login?type=authority`.
- On the login page, show the selected audience first.
- For authorities, show the internal role choices only after selecting the authority path: PIA, CALA/Collector, Revenue Officer, Central/Monitoring Authority, and other approved roles.
- For citizens, show the citizen-specific method available in the prototype, such as mobile/OTP or a clearly labeled demo flow. Do not claim Aadhaar authentication unless it is actually integrated and legally approved.
- Preserve direct dashboard routes for development, but do not expose them as the primary public landing action.
- Support a clear back action so users can switch between Citizen and Authority without losing context.

**Acceptance:** a citizen never has to choose an administrative role, and an authority understands that role selection controls workspace access rather than granting permission by itself.

### 5.4 RBAC

**Current issue:** `auth-context.tsx` uses preset users and `localStorage` to simulate login. This is acceptable for a visual demo but is not RBAC and must not be described as secure authentication.

**Frontend implementation:**

- Create a typed role/capability configuration shared by login, navigation, and dashboard entry points.
- Define capabilities such as `project:create`, `proposal:review`, `parcel:verify`, `compensation:manage`, `rr:manage`, `reports:view`, and `audit:view`.
- Render only the navigation and actions allowed by the current demo role.
- Add a protected dashboard layout/route guard that redirects unauthenticated users to `/login`.
- Remove arbitrary role switching from normal production UI. Keep it behind an explicit `Demo mode` control for the SIH presentation.
- Never treat `localStorage`, a hidden button, a URL parameter, or a frontend role value as a security boundary.

**Backend dependency:** real RBAC must be enforced by the FastAPI backend using verified identity, role/capability assignments, and administrative scope. The frontend should consume the authenticated user/capabilities from the backend rather than inventing authorization.

**Acceptance:** changing a UI role cannot grant access to protected backend data, and the frontend clearly distinguishes demo persona switching from real authentication.

### 5.5 Emblem and Government name

**Current issue:** `AppHeader` currently uses a `Layers` icon as a brand mark and includes Government of India/MoRTH text. A generic icon is not an official emblem, and the ministry mismatch described in Section 3 must be resolved.

**Implementation:**

- Confirm the responsible ministry/department before changing copy.
- If an approved emblem asset is available, add it under `frontend/public/` with accessible alt text and a suitable compact lockup.
- If no approved asset is available, use a neutral geometric BhuSetu mark and plain text such as `Government of India` only where factually appropriate. Do not draw or download a lookalike emblem.
- Display the ministry/department name in a restrained secondary line, not as an oversized claim.
- Use one source-of-truth configuration object for organization name, department, external links, and footer ownership so the header and footer cannot diverge.
- Remove unsupported claims such as “hosted by NIC” or “Secure NIC Node” unless verified.

**Acceptance:** branding is visually credible, accessible, consistent across header/footer/metadata, and factually aligned with the SIH submission.

### 5.6 Replace “Go to Official Dashboard” with login

**Current issue:** the public header conditionally renders `Go to Official Dashboard` when a demo user exists, matching screenshot #6. That is confusing on a public landing page and makes the demo session state leak into the public navigation.

**Implementation:**

- On public pages, replace the conditional dashboard button with one `Login` button or a compact `Citizen | Authority Login` split action.
- Keep “Open dashboard” inside authenticated dashboard screens and, if needed, after successful login.
- If a user returns to the landing page while authenticated, the public header may show a small profile/session indicator, but the requested primary action should remain login-oriented and must not be labeled “Official Dashboard.”
- Ensure the mobile header has the same behavior.

**Acceptance:** screenshot #6 no longer appears on the landing page and the login entry point is always obvious.

### 5.7 Remove the “Official Gateway” section

**Current issue:** screenshot #7 corresponds to the large role card in `page.tsx` around the “Official Gateway” / “Statutory Role Portals” block. It duplicates the login page and makes the landing page look like an internal console selector.

**Implementation:**

- Remove the entire right-side role gateway card, not only the heading.
- Rebalance the hero into a single-column or a simple hero-plus-login-choice layout.
- Move role-specific descriptions to the login page or an authenticated “Role help” panel.
- Do not leave orphaned imports, role arrays, or layout gaps after removing the card.

**Acceptance:** the hero has one coherent purpose and no duplicate role portal list appears on the public landing page.

### 5.8 Remove the public Khasra section

**Current issue:** screenshot #8 corresponds to the public Khasra inquiry section around `#citizen-inquiry`. It currently uses hardcoded state, district, village, owner, award, payment, and Gazette result data with a `setTimeout`, which can be mistaken for a real public land-record service.

**Implementation:**

- Remove the Khasra state, fake search handler, result object, form, and public inquiry section from the landing page.
- Remove the hero CTA and header link that point to `#citizen-inquiry`.
- Preserve the citizen tracking capability in `/dashboard/citizen` or create a dedicated authenticated/publicly approved status route after the real API and privacy model are ready.
- Do not expose owner names, compensation amounts, bank/payment state, or land records publicly without an approved access and redaction model.
- If a demo search is required for evaluation, place it in a clearly labeled demo/status page and use synthetic data with a visible “Demo data” label.

**Acceptance:** no public Khasra form or hardcoded owner/payment result exists on the landing page, and citizens still have a discoverable authenticated path for status tracking.

### 5.9 Redesign “Legal & Statutory Compliance Framework”

**Current issue:** screenshot #9 presents three cards as if BhuSetu itself guarantees legal compliance and real-time external synchronization. Statements such as “Mandatory 100% Solatium,” “zero-leakage DBT,” and live Bhoomi/Bhulekh synchronization may be legally, jurisdictionally, or technically conditional.

**Implementation:**

- Replace the current compliance claim section with a compact, plain-language section titled something like `How BhuSetu supports the acquisition process`.
- Use three capability cards:
  1. `Workflow visibility` — tracks submissions, reviews, decisions, and milestones.
  2. `GIS-assisted verification` — connects project extents with parcel evidence and spatial checks.
  3. `Compensation and R&R monitoring` — records assessments, payment status, possession, and rehabilitation progress.
- Use “supports,” “tracks,” and “helps verify” instead of “ensures,” “guarantees,” or “enforces” unless the claim is backed by an approved requirement.
- Move detailed Act/section explanations to a dedicated `Resources` or `Help` page with source references and a visible disclaimer that the platform is not legal advice.
- Ensure the legal wording matches the confirmed ministry, acquisition authority, and applicable statute. Do not mix the RFCTLARR Act and the National Highways Act as if they were interchangeable.
- Keep the design visually lighter: three cards maximum, shorter copy, no dense paragraph blocks.

**Acceptance:** the section explains product value without presenting unverified legal guarantees or integrations as current facts.

### 5.10 Remove “The Gazette of India” from the landing page

#### What the Gazette means in this project

The Gazette of India is the Government of India’s official publication for certain government notifications, orders, rules, appointments, and statutory notices. A Gazette reference or PDF can be evidence that a notification was officially published. “Extraordinary” generally refers to a special publication issued outside the ordinary periodic issue schedule; it does not mean that every record shown in a prototype is automatically an official Gazette record.

For land acquisition, publication may involve the Gazette of India, a State Gazette, or another legally prescribed publication channel depending on the acquiring authority, project, statute, and notification stage. Therefore, the label “The Gazette of India” is not universally correct for every land-acquisition record.

#### Decision for this landing-page redesign

Remove the full Gazette section from the landing page. This matches the user’s request and reduces clutter. It should not be deleted from the product concept entirely.

Move verified Gazette/publication records to one of these locations:

- `dashboard/notifications` for authorized officers managing notifications.
- `dashboard/reports` for statutory registers and exports.
- A dedicated public `Public Notices` page only after the records, source URLs, publication type, access rules, and document authenticity are defined.

If a public link is retained later, use neutral language such as `Official notifications and public notices` and show the publication authority/type per record. Link only to verified official documents. Do not use hardcoded rows or fake download alerts.

#### Code changes implied

- Remove `gazetteNotices` and its table from `frontend/app/page.tsx`.
- Remove the Gazette ticker and `View All Gazettes` landing anchor unless a verified announcement service is available.
- Remove the hero/header navigation link to `#gazette-notices`.
- Decide separately whether the footer’s external eGazette link is useful as an `Official resources` link. It should not be presented as BhuSetu-owned data, and it must be verified before release.
- Retain Gazette references in a record’s detail view only when they come from the backend or are visibly marked as synthetic demo data.

## 6. Component and state refactor

The current `page.tsx` is a large client component because it owns the fake Khasra search. After removing that feature:

- Make `page.tsx` as close to a server component as practical; keep only genuinely interactive components client-side.
- Extract reusable landing components such as `LandingHero`, `AudienceLoginActions`, `CapabilityCards`, `StatutoryContext`, and `GovernmentFooter`.
- Centralize organization/branding metadata in a typed configuration module.
- Remove unused imports from `lucide-react` after section removal.
- Keep `AppHeader` responsible for navigation and branding, not landing-page business content.
- Keep login role selection in `frontend/app/login/page.tsx` and share typed role metadata with dashboard navigation.

## 7. Recommended implementation order

1. Resolve ministry/ownership and emblem/content approvals.
2. Capture a baseline screenshot and run the existing frontend typecheck/lint/build.
3. Refactor branding/configuration and shared public header.
4. Replace the public header dashboard action with login.
5. Remove the Official Gateway, Khasra, Gazette, and old compliance sections.
6. Build the shorter hero and citizen/authority login actions.
7. Add the compact capability/statutory-context section.
8. Update `/login` to honor `citizen` versus `authority` entry context.
9. Add frontend route/capability guards for demo roles without treating them as real security.
10. Update `docs/FRONTEND.md` and remove stale landing-page claims.
11. Run automated checks and perform responsive/accessibility review.

## 8. Validation checklist

### Visual

- No “Go to Official Dashboard” button on the public landing page.
- No “Official Gateway” card.
- No public Khasra search section.
- No Gazette table or Gazette ticker on the landing page.
- Statutory context is compact and uses cautious, accurate wording.
- Hero is understandable within a few seconds and has two clear login choices.
- Header contains approved/neutral branding and the confirmed government organization name.
- Layout works at 320px, 768px, 1024px, and wide desktop sizes.

### Accessibility

- All buttons and links have meaningful accessible names.
- Keyboard focus is visible and order is logical.
- Heading hierarchy is valid: one page `h1`, then section `h2`s.
- Color contrast meets the project’s accessibility target.
- Emblem/logo has accurate alt text or is marked decorative.
- Reduced-motion preferences are respected for animations.

### Functional

- Citizen Login routes to the citizen login context.
- Authority Login routes to the authority role-selection context.
- Back navigation preserves or resets context intentionally.
- Authenticated dashboard routes still work.
- Demo role switching remains clearly labeled and does not claim real security.
- No stale anchors point to removed sections.
- No fake `alert()` download/search behavior remains on the landing page.

### Code quality

- `npm run typecheck` passes.
- `npm run lint` passes without introducing suppressions.
- `npm run build` succeeds.
- Unused state, imports, and hardcoded Gazette/Khasra data are removed.
- `docs/FRONTEND.md` describes the new landing-page behavior accurately.

## 9. Out of scope for this redesign

- Implementing real OTP, Aadhaar, government SSO, or identity verification.
- Implementing backend RBAC enforcement.
- Connecting to live land records, PFMS, Gazette, or state portals.
- Publishing an official Government of India emblem without approval.
- Reworking authenticated dashboard information architecture.
- Adding predictive analytics or legal decision automation.

These may be future work, but the landing page must not imply that they already exist.

![Point 5.6 - Replace "Go to Official Dashboard" with Login](WhatsApp%20Image%202026-09-04%20at%205.44.02%20PM.jpeg)  
![Point 5.7 - Remove the "Official Gateway" Section](WhatsApp%20Image%202026-09-04%20at%205.44.02%20PM%20(1).jpeg)  
![Point 5.8 - Remove the Public Khasra Section](WhatsApp%20Image%202026-09-04%20at%205.44.02%20PM%20(2).jpeg)  
![Point 5.9 - Redesign Legal & Statutory Compliance](WhatsApp%20Image%202026-09-04%20at%205.44.03%20PM.jpeg)  
![Point 5.10 - Remove Gazette Table from Landing Page](WhatsApp%20Image%202026-09-04%20at%205.44.03%20PM%20(1).jpeg)
