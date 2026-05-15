# `create-portal-app`

> Scaffold a complete Next.js 15 authenticated portal in seconds — animated login, dashboard layout, JWT auth, and full theming. No backend required.

[![npm version](https://img.shields.io/npm/v/@lucifer91299/create-portal-app)](https://www.npmjs.com/package/@lucifer91299/create-portal-app)
[![npm downloads](https://img.shields.io/npm/dm/@lucifer91299/create-portal-app)](https://www.npmjs.com/package/@lucifer91299/create-portal-app)
[![license](https://img.shields.io/npm/l/@lucifer91299/create-portal-app)](https://github.com/aakashkanojiya91299/nexportal/blob/main/LICENSE)

---

## Quick start

```bash
npx @lucifer91299/create-portal-app my-portal
```

The CLI opens a fully interactive prompt — arrow keys to navigate, Enter to confirm, Ctrl+C to cancel at any point:

```
┌  create-portal-app
│
◆  Project name
│  my-portal
◆  Auth mode
│  ● JWT cookie        NestJS / Express / any backend
│  ○ Multi-role JWT    Separate cookies per role (coach + judge…)
│  ○ Laravel session   PHP Laravel backend
◆  Login page style
│  ● Animated   Floating orbs + particles + tricolor bar
│  ○ Simple     Clean gradient card (minimal)
◆  Sidebar style
│  ● Full   Wide sidebar with labels and collapsible groups
│  ○ Rail   Icon-only narrow sidebar
│  ○ Both   Full on desktop, rail on mobile
◆  State management
│  ● Redux Toolkit + React Query   recommended
│  ○ React Query only
◆  Package manager
│  ● npm
│  ○ pnpm   faster installs
│  ○ yarn
│
⠙  Scaffolding my-portal/…
◇  my-portal/ — 29 files created
│
◇  Next steps ──────────────╮
│                            │
│  cd my-portal              │
│  npm install               │
│  npm run dev               │
│                            │
├────────────────────────────╯
│
└  my-portal/ ready — 29 files · auth: jwt · #000080
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

## Non-interactive (`--yes`)

Skip every prompt and use defaults:

```bash
npx @lucifer91299/create-portal-app my-portal --yes
```

Override specific options while skipping the rest:

```bash
# Change login style and sidebar
npx @lucifer91299/create-portal-app my-portal --yes --login=simple --sidebar=rail

# Custom brand colours
npx @lucifer91299/create-portal-app my-portal --yes --primary=#E11D48 --accent=#F59E0B --success=#10B981

# Laravel backend
npx @lucifer91299/create-portal-app my-portal --yes --auth=laravel

# Show all flags
npx @lucifer91299/create-portal-app --help
```

---

## All flags

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `[project-name]` | any string | `my-portal` | Output folder name |
| `--yes`, `-y` | — | — | Skip all prompts, use defaults |
| `--auth=` | `jwt` \| `multi-role` \| `laravel` | `jwt` | Auth strategy |
| `--login=` | `animated` \| `simple` | `animated` | Login page style |
| `--sidebar=` | `full` \| `rail` \| `both` | `full` | Sidebar variant |
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
│   │   ├── page.tsx                redirects / → /login
│   │   ├── login/
│   │   │   └── page.tsx            LoginPage (animated) or LoginPageSimple
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          DashboardLayout + useJwtAuth
│   │   │   ├── page.tsx            dashboard home page
│   │   │   ├── users/page.tsx      Users management page
│   │   │   ├── settings/page.tsx   Settings page
│   │   │   └── components/page.tsx Full component showcase
│   │   └── api/
│   │       └── auth/
│   │           ├── login/route.ts  POST — signs JWT, sets httpOnly cookie
│   │           ├── user/route.ts   GET  — verifies JWT, returns user payload
│   │           ├── session/route.ts
│   │           └── logout/route.ts POST — clears cookie
│   ├── components/
│   │   └── layout/nav-config.tsx   navGroups definition
│   ├── lib/
│   │   └── api.ts                  axios client
│   ├── store/                      Redux store + auth slice (redux-query mode)
│   ├── providers/index.tsx         QueryClient + Redux Provider
│   ├── proxy.ts                    JWT edge middleware (guards /dashboard)
│   └── theme.config.ts             createTheme({ primary, accent, … })
├── public/
│   └── brand/
│       ├── logo.svg                placeholder — replace with your logo
│       └── powered-by-logo.svg
├── tailwind.config.ts
├── next.config.ts                  transpilePackages: ['@lucifer91299/ui']
└── .env.local                      NEXT_PUBLIC_API_URL, JWT_SECRET
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

Full-screen login with:
- Floating parallax orbs in brand colours
- Particle canvas background
- Animated tricolor stripe entrance
- Staggered card reveal

Best for institutional, government, or high-impact portals.

### `simple`

Clean gradient card login with optional role-select splash. Best for SaaS or minimal designs.

---

## Sidebar variants

| Value | Description |
|-------|-------------|
| `full` | Wide sidebar with group headings, nav labels, and collapsible sections |
| `rail` | Icon-only narrow sidebar |
| `both` | Full on desktop, rail on mobile/tablet |

---

## Stack generated

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS 3** with `@lucifer91299/ui` preset
- **`@lucifer91299/ui`** — components, hooks, design system
- **framer-motion 12** — entrance animations
- **jose 5** — JWT sign + verify
- **Redux Toolkit + TanStack Query** (or React Query only)
- **lucide-react** — icons

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

### v1.1.8
- **Interactive CLI** — replaced raw readline with `@clack/prompts`: arrow-key selection for all choice prompts, password masking for DB credentials, grouped prompts (JWT config, DB config, brand colours), live spinner during file creation, bordered next-steps box on completion
- **Windows fix** — `p.cancel()` / `p.isCancel()` replace `readline.close()`, eliminating terminal-hang on completion
- Removed `prompt.ts` (readline wrapper) entirely

### v1.1.7
- **Windows directory creation fix** — process now calls `process.exit(0)` after scaffold completes, preventing terminal freeze caused by open readline listeners
- **`--yes` mode**: `stateManagement` was incorrectly reading `flags['pm']` (the package manager flag) — fixed to always use default
- **Error handling** — `EPERM`/`EACCES` (permission denied) and `ENAMETOOLONG` (Windows MAX_PATH) now show friendly messages instead of a raw Node.js stack trace
- Scaffolded file renamed `middleware.ts` → `proxy.ts` (Next.js convention)

### v1.1.6
- Updated generated component showcase with full DataTable (25 rows, pagination, sort, filters, row selection) and multiselect Select demos

### v1.0.7
- Removed `PageFooter` from generated dashboard layout — no double footer
- Template generates cleaner layout; `PageFooter` can be added manually where needed

### v1.0.6
- Generated project now includes Users and Settings pages
- Fixed Windows folder creation bug (`path.dirname` instead of `lastIndexOf('/')`)
- CLI help text corrected to `npx @lucifer91299/create-portal-app`

### v1.0.2
- Renamed scope from `@nexportal` → `@lucifer91299`
- Added per-package README files (shown on npm)
- Default login style changed to `animated`
- Added `--local-ui` flag for local SDK development

### v1.0.1
- Initial public release
