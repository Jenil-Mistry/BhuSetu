# 🖥️ BhuSetu Frontend: Developer Guide & Status Report

This document details the frontend implementation of the **BhuSetu** platform, including technology choices, architectural structure, completed features, running instructions, and the pending development roadmap.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Webpack) | `16.2.6` | Server/Client components, dynamic routing, metadata |
| **Language** | TypeScript | `^5.0` | Strict type safety for statutory entities and API models |
| **Runtime UI** | React | `19.2.4` | Component lifecycle and hooks |
| **Styling** | Tailwind CSS (v4) & `@tailwindcss/postcss` | `^4.0` | High-fidelity government design system tokens |
| **Components** | Radix UI Primitives | `^1.6.7` | Accessible dialogs, tabs, popovers, accordions |
| **Icons** | Lucide React | `^1.39.0` | Standardized iconography |
| **GIS Mapping** | MapLibre GL JS | `^5.1.0` | Hardware-accelerated cadastral vector tile visualization |
| **Theming** | `next-themes` | `^0.4.6` | Light / Dark mode compatibility |

---

## 📁 Frontend Directory Structure

```text
frontend/
├── app/
│   ├── layout.tsx                # Root layout with font configuration & AuthProvider
│   ├── globals.css               # Design tokens, CSS variables, government theme accents
│   ├── page.tsx                  # Public Government Landing & Citizen Inquiry Page
│   ├── login/
│   │   └── page.tsx              # Role-based multi-stakeholder SSO login page
│   └── dashboard/
│       ├── layout.tsx            # Protected dashboard shell with sticky topbar & role pill
│       ├── page.tsx              # Dynamic router redirecting to the user's active role view
│       ├── cala/page.tsx         # Competent Authority Land Acquisition (CALA / Collector)
│       ├── pia/page.tsx          # Project Implementing Agency (NHAI / MoRTH Executive)
│       ├── revenue-officer/page.tsx # Field Verification, Khasra Survey & Geotagging
│       ├── compensation/page.tsx # DBT Payment Disbursement, PFMS Matrix, Solatium
│       ├── rehabilitation/page.tsx # R&R PAF Census, Resettlement Colony Allotments
│       ├── gis/page.tsx          # MapLibre GIS Cadastral Viewer with RoW Overlays
│       ├── audit/page.tsx        # Tamper-evident Audit Logs & Transactional Outbox
│       ├── reports/page.tsx      # Exportable Statutory MIS & Gazette Registers
│       ├── citizen/page.tsx      # Landowner tracking & Objection filing portal
│       ├── projects/page.tsx     # National Acquisition Corridor Pipeline & Milestones
│       └── notifications/page.tsx # Gazette S.O. Publication Tracker & Alerts
├── components/
│   ├── layout/
│   │   ├── app-header.tsx        # Official MoRTH / Digital India government banner & nav
│   │   └── dashboard-nav.tsx     # Role-aware sidebar / top navigation bar
│   ├── views/
│   │   ├── cala-collector-view.tsx    # Section 11/15/19 statutory hearing queues
│   │   ├── pia-executive-view.tsx     # Proposal drafting & DPR KML alignment submission
│   │   ├── revenue-officer-view.tsx   # Ground survey checklist & photo evidence upload
│   │   ├── citizen-paf-view.tsx       # Landowner claim verification & compensation status
│   │   └── central-authority-view.tsx # National dashboard & inter-state project health
│   └── theme-provider.tsx        # Theme hydration provider
├── lib/
│   ├── api.ts                    # Resilient typed API client with offline fallback
│   ├── mock-data.ts              # Rich synthetic Indian cadastral and statutory datasets
│   ├── auth-context.tsx          # Active stakeholder role switching & session state
│   └── utils.ts                  # Tailwind class merge utility (cn)
├── hooks/                        # Custom reusable React hooks
├── types/                        # Custom TypeScript ambient declarations
└── public/                       # National emblems, logos, and static assets
```

---

## 🔌 API Integration & Offline Fallback Architecture

The frontend connects to the FastAPI backend via [`frontend/lib/api.ts`](file:///c:/Users/yg159/OneDrive/Desktop/sih/BhuSetu/frontend/lib/api.ts).

### How it works:
1. **Target URL**: Resolves `NEXT_PUBLIC_API_URL` or defaults to `http://localhost:8000/api/v1`.
2. **Auto-Header Injection**: Injects role-based authorization headers (`Authorization: Bearer <role>`) depending on the active stakeholder persona selected in [`auth-context.tsx`](file:///c:/Users/yg159/OneDrive/Desktop/sih/BhuSetu/frontend/lib/auth-context.tsx).
3. **Resilient Offline Fallback**:
   - Each network call has a **3.5-second timeout** controller.
   - If the backend is restarting, offline, or returns an HTTP error, the client gracefully returns realistic synthetic data from [`mock-data.ts`](file:///c:/Users/yg159/OneDrive/Desktop/sih/BhuSetu/frontend/lib/mock-data.ts).
   - **Result**: The UI never crashes or hangs with blank screens during live demos or network interruptions.

---

## ✅ What Has Been Implemented

### 1. Streamlined Public Portal (`/`) & Authentication Gateway (`/login`)
- **Clear Audience Separation**: Dedicated, prominent entry paths for Citizens / Landowners (`/login?type=citizen`) and Authorities / Departments (`/login?type=authority`).
- **Core Platform Capabilities**: Highlights three distinct capabilities (Workflow Visibility, GIS-Assisted Spatial Verification, and Compensation / R&R Monitoring) with legally accurate language.
- **Statutory Lifecycle Guide**: Outlines the 4 key stages governed by the RFCTLARR Act, 2013 (Section 11 Preliminary Notification, Section 15 Hearing of Objections, Section 19 Acquisition Declaration, Section 23/30 Awards).
- **GIGW-Compliant Header & Footer**: Replaced session-dependent "Go to Official Dashboard" button on public pages with standardized login actions, verified official links, and institutional metadata via `lib/site-config.ts`.
- **Privacy by Design**: Removed unauthenticated public Khasra queries to prevent unauthorized data exposure; landowners securely inspect itemized awards and DBT status via the authenticated Citizen portal (`/dashboard/citizen`).

### 2. Multi-Stakeholder Role Portals (`/dashboard/*`)
- **CALA / Land Acquisition Collector**:
  - Hearing schedule management with disposition recording.
  - Section 19 declaration issuance modal with area validation.
  - Award summary approval with automated 100% solatium computation.
- **PIA / NHAI Executive Portal**:
  - Proposal initiation wizard with estimated budget and hectare inputs.
  - DPR Alignment KML file upload zone.
  - Timeline tracker visualizing SLA adherence and pending actions.
- **Revenue Officer / Amin / Field Surveyor**:
  - Cadastral survey queue with field verification checklists.
  - Geo-tagged camera photo upload simulator for boundary demarcation.
  - Encroachment and disputed title flagging mechanism.
- **Compensation & Financial Disbursement**:
  - Multi-tier statutory compensation assessment matrix.
  - PFMS Direct Benefit Transfer (DBT) batch generator with one-click payment dispatch.
  - Bank account validation badge and payment reconciliation status.
- **Rehabilitation & Resettlement (R&R)**:
  - PAF (Project Affected Family) census enumeration register.
  - Entitlement matrix (Resettlement housing, one-time rehabilitation grant, subsistence allowance).
- **Cadastral GIS Engine (`/dashboard/gis`)**:
  - MapLibre GL map instance with vector tile raster styling.
  - Cadastral parcel boundary overlays with color coding by status.
  - Right-of-Way (RoW) buffer visualizer.
  - Interactive parcel inspector displaying owner name, area, and valuation.
- **Immutable Audit Trail (`/dashboard/audit`)**:
  - Real-time audit log viewer showing timestamp, actor, role, and action performed.
  - Correlation ID and cryptographic event digest display.
- **Reports & Statutory MIS (`/dashboard/reports`)**:
  - Visual charts showing acquisition velocity, compensation disbursement percentages, and dispute distributions.
  - One-click CSV export for official record keeping.

---

## 🚀 What Remains To Be Done (Frontend Roadmap)

Incoming frontend developers should focus on the following backlog items:

### Priority 1: High Impact for Hackathon / Production
1. **Interactive GIS Drawing & Splitting Tool (`/dashboard/gis`)**:
   - *Current State*: MapLibre renders pre-defined GeoJSON parcels.
   - *Pending Task*: Integrate Mapbox Draw / MapLibre-GL-Draw plugin to allow surveyors to physically draw split boundaries or carve out sub-khasras on screen.
2. **Real Authentication & JWT Token Refresh**:
   - *Current State*: Handled via role switcher in `auth-context.tsx` with mock bearer tokens.
   - *Pending Task*: Integrate NextAuth.js or Supabase Auth to handle real OTP-based login, JWT refresh rotation, and protected server-side route middleware.
3. **Automated PDF Award & Notice Generation**:
   - *Current State*: Notices are shown in HTML dialogs.
   - *Pending Task*: Implement `@react-pdf/renderer` or backend PDF conversion to dynamically generate printable, bilingual (Hindi/English) Form 7 / Form 8 Gazette notices with official government seals.

### Priority 2: Enhancements & Polish
4. **WebSocket / SSE for Real-time DBT Status**:
   - *Current State*: Polling / page refresh required to see updated payment states.
   - *Pending Task*: Connect to a WebSocket or Server-Sent Events (SSE) stream from the backend to display animated real-time status pulses when PFMS batches transition from `PROCESSING` to `SUCCESS`.
5. **Multilingual Localization (i18n)**:
   - *Current State*: English UI only.
   - *Pending Task*: Add `next-intl` to support Hindi (Devanagari) and regional languages (e.g. Gujarati, Marathi, Punjabi) for rural landowner accessibility.
6. **End-to-End Test Suite**:
   - *Current State*: Static typechecking passing (`npm run typecheck`).
   - *Pending Task*: Add Playwright tests for the critical citizen search and CALA approval user journeys.

---

## 🏃 Setup & Development Commands

### 1. Environment Configuration
Create a `.env.local` file in `frontend/`:
```bash
# MapLibre Vector Tile Style URL
NEXT_PUBLIC_MAP_STYLE_URL=https://demotiles.maplibre.org/style.json

# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Access at [http://localhost:3000](http://localhost:3000).

### 4. Code Quality & Typecheck
```bash
# Run TypeScript typecheck (Zero errors verified)
npm run typecheck

# Run ESLint check
npm run lint

# Format codebase with Prettier & Tailwind sort
npm run format
```
