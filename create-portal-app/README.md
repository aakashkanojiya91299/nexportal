# `create-portal-app`

> Scaffold a complete Next.js portal in seconds — pick a domain preset, get realistic demo data, animated login, dashboard layout, JWT auth, full theming, and a **built-in charts showcase (40 chart types)**. No backend required.

[![npm version](https://img.shields.io/npm/v/@lucifer91299/create-portal-app)](https://www.npmjs.com/package/@lucifer91299/create-portal-app)
[![npm downloads](https://img.shields.io/npm/dm/@lucifer91299/create-portal-app)](https://www.npmjs.com/package/@lucifer91299/create-portal-app)
[![license](https://img.shields.io/npm/l/@lucifer91299/create-portal-app)](https://github.com/aakashkanojiya91299/nexportal/blob/main/LICENSE)

---

## Quick start

```bash
npx @lucifer91299/create-portal-app my-portal
```

The CLI opens a fully interactive prompt — arrow keys to navigate, Enter to confirm, Ctrl+C to cancel:

```
┌  create-portal-app
│
◆  Project name
│  my-portal
◆  Preset template
│  ● E-commerce (Top Nav)     Header nav, products, orders
│  ○ E-commerce (Sidebar)     Sidebar nav, products, orders
│  ○ Admin Panel              Users, roles, audit log
│  ○ Talent Portal            Athletes, registrations, certificates
│  ○ Blank Starter            Clean base — you define the domain
◆  Include demo content?
│  ● Yes   Hardcoded realistic data (products, users, stats…)
│  ○ No    Empty pages, ready for your API
◆  Auth mode
│  ● JWT cookie        NestJS / Express / any backend
│  ○ Multi-role JWT    Separate cookies per role
│  ○ Laravel session   PHP Laravel backend
◆  Login page style
│  ● Animated   Floating orbs + particles + tricolor bar
│  ○ Simple     Clean gradient card (minimal)
◆  State management
│  ● Redux Toolkit + React Query   recommended
│  ○ React Query only
◆  Package manager
│  ● npm
│  ○ pnpm   faster installs
│  ○ yarn
│
◇  my-portal/ — 38 files created
│
◇  Next steps ──────────────╮
│                            │
│  cd my-portal              │
│  npm install               │
│  npm run dev               │
│                            │
├────────────────────────────╯
│
└  my-portal/ ready — 38 files  ·  E-commerce (Top Nav)  ·  auth: jwt  ·  #000080
```

Then:

```bash
cd my-portal
npm install
npm run dev
# → http://localhost:3000/login
# → admin@demo.com / password123
```

---

## Preset templates

Each preset bundles a domain-appropriate nav, sidebar/header layout, and (optionally) realistic demo pages. The layout is derived from the preset — you don't pick sidebar and preset separately.

| Preset | CLI flag | Layout | Demo pages | Always included |
|--------|----------|--------|------------|-----------------|
| E-commerce (Top Nav) | `--preset=ecom-header` | Header nav | Home · Products · Orders | **Charts** |
| E-commerce (Sidebar) | `--preset=ecom-sidebar` | Full sidebar | Home · Products · Orders | **Charts** |
| Admin Panel | `--preset=admin` | Full sidebar | Home · Users · Roles · Audit Log | **Charts** |
| Talent Portal | `--preset=talent` | Full sidebar | Home · Athletes · Registrations · Certificates | **Charts** |
| Blank Starter | `--preset=blank` | Your choice | Home · Users · Component Showcase · Form Builder · Onboarding | **Charts** |

> **Charts** (`/dashboard/charts`) is always generated for every preset — it shows all 36 Apache ECharts chart types with live sample data, grouped into 12 sections, so you can drop any chart straight into your pages.
>
> **Blank** also always includes the full component showcase so you can browse every available UI component.

---

## Demo content

When you choose **Include demo content**, each page ships with hardcoded realistic sample data — stat cards, charts, tables with 10–20 rows — so the portal looks production-ready on first `npm run dev`. Swap the hardcoded arrays for your real API calls whenever you're ready.

**Example — Talent Portal home (demo on):**
- 4 stat cards: Total Athletes, Registrations This Month, Certificates Issued, Active Events
- Bar chart: Monthly Registrations vs Certificates
- Donut chart: Registration status breakdown
- Recent registrations table with 10 rows and `StatusBadge`

**With demo off**: every page is a clean `PageShell` stub ready for your data.

**Charts showcase (always included — all presets):**

The `/dashboard/charts` page ships with all 40 chart types pre-populated with realistic sample data:

| # | Section | Charts |
|---|---------|--------|
| 1 | Line | `HCLineChart`, `HCSplineChart`, `HCStepLineChart`, `HCStackedLineChart` |
| 2 | Area | `HCAreaChart`, `HCAreaSplineChart`, `HCStackedAreaChart`, `HCAreaRangeChart` |
| 3 | Bar & Column | `HCColumnChart`, `HCBarChart`, `HCStackedColumnChart`, `HCStackedBarChart`, `HCColumnRangeChart`, `HCWaterfallChart` |
| 4 | Pie / Funnel | `HCPieChart`, `HCDonutChart`, `HCNightingaleChart`, `HCFunnelChart` |
| 5 | Scatter | `HCScatterChart`, `HCEffectScatterChart`, `HCBubbleChart`, `HCBoxPlotChart` |
| 6 | Candlestick | `HCCandlestickChart` |
| 7 | Gauges | `HCGaugeChart`, `HCSolidGaugeChart` |
| 8 | Heatmap | `HCHeatmapChart`, `HCCalendarHeatmapChart` |
| 9 | Hierarchy | `HCTreemapChart`, `HCTreeChart`, `HCSunburstChart` |
| 10 | Graph & Sankey | `HCGraphChart`, `HCSankeyChart` |
| 11 | Advanced | `HCParallelChart`, `HCThemeRiverChart`, `HCPictorialBarChart` |
| 12 | Radar | `HCPolarChart` |

All charts are themed via CSS variables (`--primary`, `--accent`, `--success`) and lazy-loaded with a skeleton placeholder. Peer deps needed in the generated app: `npm install echarts echarts-for-react`.

---

## Non-interactive (`--yes`)

Skip every prompt and use defaults:

```bash
npx @lucifer91299/create-portal-app my-portal --yes
```

Override specific options:

```bash
# Ecom sidebar preset, no demo content
npx @lucifer91299/create-portal-app my-shop --yes --preset=ecom-sidebar --no-demo

# Admin panel with Laravel auth
npx @lucifer91299/create-portal-app my-admin --yes --preset=admin --auth=laravel

# Custom brand colours
npx @lucifer91299/create-portal-app my-portal --yes --primary=#E11D48 --accent=#F59E0B

# Show all flags
npx @lucifer91299/create-portal-app --help
```

---

## All flags

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `[project-name]` | any string | `my-portal` | Output folder name |
| `--yes`, `-y` | — | — | Skip all prompts, use defaults |
| `--preset=` | `ecom-header` \| `ecom-sidebar` \| `admin` \| `talent` \| `blank` | `blank` | Domain preset (layout is derived from preset) |
| `--demo` | — | `true` with `--yes` | Include hardcoded demo content |
| `--no-demo` | — | — | Skip demo content — empty pages only |
| `--auth=` | `jwt` \| `multi-role` \| `laravel` | `jwt` | Auth strategy |
| `--login=` | `animated` \| `simple` | `animated` | Login page style |
| `--sidebar=` | `full` \| `rail` \| `header` | *(preset-derived)* | Only for `blank` preset |
| `--primary=` | `#hex` | `#000080` | Primary brand colour |
| `--accent=` | `#hex` | `#FF9933` | Accent colour |
| `--success=` | `#hex` | `#138808` | Success / green colour |
| `--api-url=` | URL | `http://localhost:3000` | Backend API URL (written to `.env.local`) |
| `--pm=` | `npm` \| `pnpm` \| `yarn` | `npm` | Package manager for install instructions |
| `--local-ui=` | relative path | — | Use a local `@lucifer91299/ui` build (dev mode) |
| `--help`, `-h` | — | — | Show help and exit |

---

## Defaults (when `--yes` is used)

```
Preset      : blank         clean base — you define the domain
Demo        : yes           hardcoded realistic demo data included
Auth mode   : jwt           cookie-based JWT, demo /api/auth/* routes
Login style : animated      floating orbs + particle canvas + tricolor stripe
Sidebar     : full          wide sidebar with nav groups and labels
Primary     : #000080       navy blue
Accent      : #FF9933       saffron
Success     : #138808       green
State mgmt  : redux-query   Redux Toolkit + TanStack Query
Package mgr : npm
```

---

## What gets generated

```
my-portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx              root layout — ThemeProvider + CSS imports
│   │   ├── globals.css             Tailwind directives only
│   │   ├── page.tsx                redirects / → /dashboard
│   │   ├── login/page.tsx          LoginPage (animated) or LoginPageSimple
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              DashboardLayout + useJwtAuth
│   │   │   ├── page.tsx                home (preset-specific stats + charts)
│   │   │   ├── settings/page.tsx       Settings page
│   │   │   │
│   │   │   │   ── preset-specific pages ──
│   │   │   ├── products/page.tsx       [ecom] product grid with stock badges
│   │   │   ├── orders/page.tsx         [ecom] orders table with filters
│   │   │   ├── users/page.tsx          [admin/blank] users table
│   │   │   ├── roles/page.tsx          [admin] roles management stub
│   │   │   ├── audit/page.tsx          [admin] audit log stub
│   │   │   ├── athletes/page.tsx       [talent] athletes table with sport filter
│   │   │   ├── registrations/page.tsx  [talent] registrations stub
│   │   │   ├── certificates/page.tsx   [talent] certificates stub
│   │   │   ├── charts/page.tsx         [ALL]   40 chart types showcase
│   │   │   ├── components/page.tsx     [blank] full component showcase
│   │   │   ├── onboarding/page.tsx     [blank] 4-section onboarding form
│   │   │   └── form-builder/page.tsx   [blank] drag-and-drop form builder
│   │   └── api/
│   │       └── auth/
│   │           ├── login/route.ts  POST — signs JWT, sets httpOnly cookie
│   │           ├── user/route.ts   GET  — verifies JWT, returns user payload
│   │           ├── session/route.ts
│   │           └── logout/route.ts POST — clears cookie
│   ├── components/layout/nav-config.tsx   navGroups (preset-appropriate links)
│   ├── lib/api.ts                          axios client
│   ├── store/                              Redux store + auth slice (redux-query mode)
│   ├── providers/index.tsx                 QueryClient + Redux Provider
│   ├── proxy.ts                            JWT edge middleware (guards /dashboard)
│   └── theme.config.ts                     createTheme({ primary, accent, … })
├── public/brand/
│   ├── logo.svg
│   └── powered-by-logo.svg
├── tailwind.config.ts
├── next.config.ts
└── .env.local                  NEXT_PUBLIC_API_URL, JWT_SECRET
```

---

## Demo credentials

The generated project works out of the box — no backend required:

```
Email    : admin@demo.com
Password : password123
```

The `/api/auth/login` route uses `jose` to sign a 7-day JWT and stores it in an `httpOnly` cookie.  
The `/api/auth/user` route verifies it.  
`proxy.ts` protects every path under `/dashboard`.

**Change `JWT_SECRET` in `.env.local` before you deploy.**

---

## Auth modes

### `jwt` (default)

Cookie-based JWT. Works with any backend (NestJS, Express, FastAPI, etc.) — or use the generated demo routes with no backend at all.

### `multi-role`

Each role gets its own cookie (`portal_coach_token`, `portal_judge_token`, …). A role-select splash screen is shown after login when the user holds multiple roles.

### `laravel`

Generates the Laravel session auth setup. Prompts for Laravel URL and DB credentials using a masked password field.

---

## Login styles

### `animated` (default)

Full-screen login with floating parallax orbs, particle canvas, animated tricolor stripe, and staggered card reveal. Best for institutional or high-impact portals.

### `simple`

Clean gradient card login with optional role-select splash. Best for SaaS or minimal designs.

---

## Sidebar variants

> The sidebar is **derived from the preset** for all presets except `blank`. Pass `--sidebar=` only when using `--preset=blank`.

| Value | Description |
|-------|-------------|
| `full` | Wide sidebar with group headings, nav labels, and collapsible sections. Includes mobile hamburger + drawer. |
| `rail` | Icon-only narrow sidebar |
| `header` | Horizontal top nav bar — logo + pill links + dropdown groups + profile menu |

---

## Stack generated

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 3** with `@lucifer91299/ui` preset
- **`@lucifer91299/ui` 1.1.77** — 90+ components, hooks, design system
- **Apache ECharts 6** (`echarts` + `echarts-for-react`) — 40 chart types, Apache-2.0 licence
- **framer-motion 12** — entrance animations
- **jose 5** — JWT sign + verify
- **Redux Toolkit + TanStack Query** (or React Query only)
- **lucide-react** — icons
- **@dnd-kit** — drag-and-drop (Form Builder page, blank preset)

---

## LAN / IP access in dev

The generated `next.config.ts` includes `allowedDevOrigins` so you can open the dev server from another device on your network without cross-origin errors.

```ts
// next.config.ts
allowedDevOrigins: [
  'http://localhost:3000',
  'http://192.168.1.155:3000',   // ← your LAN IP
],
```

> `crypto.randomUUID()` requires HTTPS or `localhost`. The Form Builder uses a `generateId()` helper that falls back to a `Math.random()`-based UUID v4 over plain HTTP, so everything works on LAN without SSL.

---

## Local development (use a local SDK build)

```bash
npx @lucifer91299/create-portal-app my-portal --yes --local-ui=../../packages/ui
# generates: "@lucifer91299/ui": "file:../../packages/ui" in package.json
```

---

## UI library

This CLI scaffolds projects using **`@lucifer91299/ui`**.  
See the full component and theming documentation at:

- [npm — @lucifer91299/ui](https://www.npmjs.com/package/@lucifer91299/ui)
- [GitHub — aakashkanojiya91299/nexportal](https://github.com/aakashkanojiya91299/nexportal)

---

## Changelog

### v1.1.38

**Charts showcase expanded to 40 types — bar variants, finance chart, watermark & download:**

- **4 new chart components**: `HCBarLabelRotationChart`, `HCDataZoomColumnChart`, `HCBrushColumnChart`, `HCFinanceChart`
- **`watermark` + `showDownload` props** added to every chart — overlay text and save-as-PNG button
- **UI version bump** — generated projects now use `@lucifer91299/ui@^1.1.77`
- **Charts showcase page** updated from 12 to 13 sections

| # | Section | Charts |
|---|---------|--------|
| 1 | Line | `HCLineChart`, `HCSplineChart`, `HCStepLineChart`, `HCStackedLineChart` |
| 2 | Area | `HCAreaChart`, `HCAreaSplineChart`, `HCStackedAreaChart`, `HCAreaRangeChart` |
| 3 | Bar & Column | `HCColumnChart`, `HCBarChart`, `HCStackedColumnChart`, `HCStackedBarChart`, `HCColumnRangeChart`, `HCWaterfallChart`, `HCBarLabelRotationChart`, `HCDataZoomColumnChart`, `HCBrushColumnChart` |
| 3b | Finance | `HCFinanceChart` (candlestick + volume + MA + DataZoom) |
| 4 | Pie / Funnel | `HCPieChart`, `HCDonutChart`, `HCNightingaleChart`, `HCFunnelChart` |
| 5 | Scatter | `HCScatterChart`, `HCEffectScatterChart`, `HCBubbleChart`, `HCBoxPlotChart` |
| 6 | Candlestick | `HCCandlestickChart` |
| 7 | Gauges | `HCGaugeChart`, `HCSolidGaugeChart` |
| 8 | Heatmap | `HCHeatmapChart`, `HCCalendarHeatmapChart` |
| 9 | Hierarchy | `HCTreemapChart`, `HCTreeChart`, `HCSunburstChart` |
| 10 | Graph & Sankey | `HCGraphChart`, `HCSankeyChart` |
| 11 | Advanced | `HCParallelChart`, `HCThemeRiverChart`, `HCPictorialBarChart` |
| 12 | Radar | `HCPolarChart` |

---

### v1.1.37

**Charts showcase expanded to 36 chart types:**

- **16 new chart components** added to `@lucifer91299/ui`: `HCStackedLineChart`, `HCStepLineChart`, `HCStackedAreaChart`, `HCStackedColumnChart`, `HCStackedBarChart`, `HCNightingaleChart`, `HCEffectScatterChart`, `HCCandlestickChart`, `HCTreeChart`, `HCSunburstChart`, `HCCalendarHeatmapChart`, `HCGraphChart`, `HCSankeyChart`, `HCParallelChart`, `HCThemeRiverChart`, `HCPictorialBarChart`
- **`EChartsCharts.tsx` split** into 7 focused files (≤400 lines each) for readability: `EChartsBase`, `EChartsLine`, `EChartsBar`, `EChartsPie`, `EChartsScatter`, `EChartsGaugeHeatmap`, `EChartsHierarchy`, `EChartsFlowAdvanced`
- **Charts showcase page updated** from 7 sections to 12 sections covering all ECharts series types
- **UI version bump** — generated projects now use `@lucifer91299/ui@^1.1.76`

| # | Section | Charts |
|---|---------|--------|
| 1 | Line | `HCLineChart`, `HCSplineChart`, `HCStepLineChart`, `HCStackedLineChart` |
| 2 | Area | `HCAreaChart`, `HCAreaSplineChart`, `HCStackedAreaChart`, `HCAreaRangeChart` |
| 3 | Bar & Column | `HCColumnChart`, `HCBarChart`, `HCStackedColumnChart`, `HCStackedBarChart`, `HCColumnRangeChart`, `HCWaterfallChart` |
| 4 | Pie / Funnel | `HCPieChart`, `HCDonutChart`, `HCNightingaleChart`, `HCFunnelChart` |
| 5 | Scatter | `HCScatterChart`, `HCEffectScatterChart`, `HCBubbleChart`, `HCBoxPlotChart` |
| 6 | Candlestick | `HCCandlestickChart` |
| 7 | Gauges | `HCGaugeChart`, `HCSolidGaugeChart` |
| 8 | Heatmap | `HCHeatmapChart`, `HCCalendarHeatmapChart` |
| 9 | Hierarchy | `HCTreemapChart`, `HCTreeChart`, `HCSunburstChart` |
| 10 | Graph & Sankey | `HCGraphChart`, `HCSankeyChart` |
| 11 | Advanced | `HCParallelChart`, `HCThemeRiverChart`, `HCPictorialBarChart` |
| 12 | Radar | `HCPolarChart` |

---

### v1.1.36

**Charts showcase — available in every preset:**

- **New page `/dashboard/charts`** generated for all 5 presets (`ecom-header`, `ecom-sidebar`, `admin`, `talent`, `blank`), always — regardless of `includeDemo`. Shows all 20 Apache ECharts chart types with realistic sample data grouped into 7 sections.
- **New "Showcase" nav group** added to all 4 nav configs (`genEcomNav`, `genAdminNav`, `genTalentNav`, `genBlankNav`) — a `LineChart` icon group with a single "Charts" link to `/dashboard/charts`.
- **New template file** `src/templates/gen-charts-showcase.ts` — `genChartsShowcasePage()` exports the fully-typed TSX generator.
- **Apache ECharts peer deps note** — generated README / stack docs reference `echarts` + `echarts-for-react` (Apache-2.0, open source).
- **UI version bump** — generated projects now use `@lucifer91299/ui@^1.1.73` (switched from Highcharts to Apache ECharts under the hood).

**Charts showcase sections:**

| # | Section | Charts |
|---|---------|--------|
| 1 | Line & Spline | `HCLineChart`, `HCSplineChart` |
| 2 | Area | `HCAreaChart`, `HCAreaSplineChart`, `HCAreaRangeChart` |
| 3 | Bar & Column | `HCColumnChart`, `HCBarChart`, `HCColumnRangeChart`, `HCWaterfallChart` |
| 4 | Pie, Donut & Funnel | `HCPieChart`, `HCDonutChart`, `HCFunnelChart` |
| 5 | Scatter, Bubble & Box Plot | `HCScatterChart`, `HCBubbleChart`, `HCBoxPlotChart` |
| 6 | Gauges | `HCGaugeChart`, `HCSolidGaugeChart` |
| 7 | Heatmap, Treemap & Radar | `HCHeatmapChart`, `HCTreemapChart`, `HCPolarChart` |

---

### v1.1.35

**Preset templates — pick your domain, get a running app:**

- **5 preset templates**: `ecom-header` (E-commerce top nav), `ecom-sidebar` (E-commerce sidebar), `admin` (Admin Panel), `talent` (Talent Portal), `blank` (clean starter). Each preset bundles a domain-specific nav config, layout variant, and demo pages.
- **Layout derived from preset**: sidebar style is inferred automatically (`ecom-header → header`, `ecom-sidebar / admin / talent → full`, `blank → user's choice`). `--sidebar=` flag only applies to `blank`.
- **Demo content mode**: new `--demo` / `--no-demo` flag (interactive `includeDemo` prompt). When on, every page ships with hardcoded realistic sample data — stat cards, bar charts, donut charts, tables with 10–20 rows. When off, pages are clean stubs.
- **Domain-specific home pages** (demo on):
  - `ecom`: revenue, orders, top products stat cards + monthly bar chart + status donut + recent orders table
  - `admin`: users, signups, activity stat cards + monthly signups chart + role distribution donut + audit events table
  - `talent`: athletes, registrations, certificates stat cards + registrations chart + status donut + recent registrations table
  - `blank`: generic stats + bar chart + donut + activity table (always generic home)
- **Domain-specific entity pages** (demo on):
  - `ecom`: Products page (12-card grid with stock badges), Orders page (10-row table, search + status filter)
  - `admin`: Users page (8-row table, role + status filter), Roles page (stub), Audit Log page (stub)
  - `talent`: Athletes page (8-row table, sport filter), Registrations page (stub), Certificates page (stub)
  - `blank`: Users page, Component Showcase, Form Builder, Onboarding (always included)
- **`SidebarVariant` `'both'` removed**: follows the `@lucifer91299/ui` v1.1.71 change. Sidebar defaults to `full` (handles mobile via built-in hamburger + drawer).
- **New CLI flags**: `--preset=`, `--demo`, `--no-demo`
- **Outro message** now shows preset label: `my-portal/ ready — 38 files · Talent Portal · auth: jwt · #000080`
- **Template refactor**: monolithic `templates/index.ts` (3901 lines) split into 12 focused files under `src/templates/` — `types.ts`, `gen-config.ts`, `gen-auth.ts`, `gen-dashboard.ts`, `gen-nav.ts`, `gen-state.ts`, `gen-pages.ts`, `gen-login.ts`, `gen-legacy.ts`, `gen-demo/demo-ecom.ts`, `gen-demo/demo-admin.ts`, `gen-demo/demo-talent.ts`
- **UI version bump** — generated projects now use `@lucifer91299/ui@^1.1.71`

### v1.1.25
- **Form Builder page** — generated project now includes `/dashboard/form-builder`: drag-and-drop form builder with sortable question cards (`@dnd-kit`), 8 question types, preset fields, required toggle, and a settings tab
- **LAN/IP dev access** — `next.config.ts` now sets `allowedDevOrigins` for LAN access without cross-origin errors
- **`crypto.randomUUID` fix** — replaced bare `crypto.randomUUID()` calls with a `generateId()` helper that falls back over plain HTTP
- **UI version bump** — generated projects now use `@lucifer91299/ui@^1.1.43`

### v1.1.14
- **UI version bump** — generated projects now use `@lucifer91299/ui@^1.1.22`

### v1.1.13
- **Onboarding page wider layout** — form container expanded from `max-w-3xl` to `max-w-5xl`

### v1.1.12
- **Onboarding page redesigned** — single full-form using every component with 4 card sections

### v1.1.11
- **Onboarding page** — `/dashboard/onboarding`: 4-step multi-step form
- **`header` sidebar variant** — `--sidebar=header` scaffolds horizontal top nav
- **UI version bump** — generated projects now use `@lucifer91299/ui@^1.1.19`

### v1.1.10
- **Components showcase** — all new components included: `StatsCard`, `EmptyState`, `FileUpload`, `Drawer`, `OTPInput`, `NumberInput`, `Slider`, `TagInput`, `Timeline`, `Popover`

### v1.1.9
- **Components showcase** — `error` prop demonstrated for every form component
- **DateTimePicker** — added to scaffold with 4-demo section

### v1.1.8
- **Interactive CLI** — replaced raw readline with `@clack/prompts`

### v1.1.7
- **Windows directory creation fix**, `--yes` mode stateManagement bug fix, error handling improvements

### v1.1.6
- Updated component showcase with full DataTable and multiselect demos

### v1.0.7
- Removed `PageFooter` from generated dashboard layout

### v1.0.6
- Generated project now includes Users and Settings pages; Windows folder creation fix

### v1.0.2
- Renamed scope from `@nexportal` → `@lucifer91299`; default login style changed to `animated`; added `--local-ui` flag

### v1.0.1
- Initial public release
