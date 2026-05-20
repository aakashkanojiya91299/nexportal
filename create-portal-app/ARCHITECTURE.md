# create-portal-app — Architecture & Coding Rules

## What this package does

`create-portal-app` is a CLI scaffolder that generates a fully working Next.js portal
application. Users run one command and get a production-ready app with auth, layout,
routing, and — if they pick demo mode — realistic sample content they can immediately see
and customize.

---

## Coding rules (enforced for every file in this package)

1. **Max 600 lines per file.** Split by concern: types, generators, cli logic, prompt flows.
2. **No runtime dependencies inside generated templates.** Every import in generated code
   must come from the user's installed packages, not this CLI package.
3. **No inline secrets.** `.env.local` gets placeholder values. Never put real keys in templates.
4. **TypeScript strict.** All generator functions are typed. `ScaffoldOptions` is the
   single source of truth for what the CLI collects.
5. **Deterministic output.** Same `ScaffoldOptions` → same files, every time. No random values.
6. **Vulnerability-free generated code.** No `dangerouslySetInnerHTML`, no `eval`, no
   unvalidated env reads in client components, no exposed secrets in client bundles.

---

## File structure (source)

```
src/
  cli/
    index.ts          ← entry point, arg parsing, scaffold orchestration   (≤600 lines)
    prompt.ts         ← interactive prompts with @clack/prompts             (≤600 lines)
  templates/
    types.ts          ← ScaffoldOptions interface only
    index.ts          ← re-exports all generators
    gen-config.ts     ← package.json, tsconfig, tailwind, next.config      (≤600 lines)
    gen-auth.ts       ← API routes: login, logout, session, user, forgot    (≤600 lines)
    gen-layout.ts     ← root layout, providers, globals.css                (≤600 lines)
    gen-dashboard.ts  ← dashboard layout.tsx, shell, skeleton              (≤600 lines)
    gen-pages.ts      ← home, settings, users (generic blank)              (≤600 lines)
    gen-demo/
      index.ts        ← re-exports all demo generators
      demo-ecom.ts    ← E-commerce demo pages                              (≤600 lines)
      demo-admin.ts   ← Admin panel demo pages                             (≤600 lines)
      demo-talent.ts  ← Talent portal demo pages                           (≤600 lines)
    gen-nav.ts        ← nav-config per preset                              (≤600 lines)
    gen-state.ts      ← redux store, auth slice                            (≤600 lines)
```

---

## Preset templates

A preset bundles domain + default layout + nav groups + demo content in one choice.

| Preset key     | Label                        | Default layout | Domain content              |
|----------------|------------------------------|----------------|-----------------------------|
| `ecom-header`  | E-commerce (Top Nav)         | `header`       | Products, Orders, Customers |
| `ecom-sidebar` | E-commerce (Sidebar)         | `full`         | Products, Orders, Customers |
| `admin`        | Admin Panel                  | `full`         | Users, Roles, Audit, Settings |
| `talent`       | Talent Portal                | `full`         | Athletes, Registrations, Certs |
| `blank`        | Blank Starter (user picks layout) | user choice | Components showcase only |

`ScaffoldOptions.preset` drives which nav groups and demo pages are generated.

---

## SSR layout pattern (enforced in all generated apps)

```
src/app/dashboard/
  layout.tsx                    ← Server Component — imports navGroups, passes to DashboardShell
  _components/
    dashboard-shell.tsx         ← 'use client' — useJwtAuth, shows skeleton while loading
    content-skeleton.tsx        ← 'use client' — Skeleton/SkeletonCard from @lucifer91299/ui
  page.tsx                      ← Server Component (or Client if it needs data)
```

**Why**: `navGroups` and layout chrome (sidebar, header) are static — they never depend on
auth state, so they can be sent as HTML immediately. Only the content area needs the JWT
user, so only that part is a Client Component with a skeleton loader.

---

## Layout variants (after `both` removal)

| Value      | Desktop              | Mobile                              |
|------------|----------------------|-------------------------------------|
| `full`     | Wide sidebar (collapsible to icon-only via toggle) | Mobile topbar with hamburger → overlay drawer |
| `rail`     | Icon-only narrow sidebar | Mobile topbar with hamburger → overlay drawer |
| `header`   | Sticky top nav bar   | Collapses to hamburger → dropdown or drawer |

**`both` is removed** — it rendered two separate sidebars and caused duplicate icon sidebars
on certain breakpoints. The `full` sidebar handles responsive behavior internally.

### Mobile topbar (all sidebar variants)
- Renders only on `< lg` screens (`lg:hidden`)
- Left: hamburger button → opens sidebar as overlay drawer
- Center: logo + project name
- Right: notification bell + user avatar

---

## Demo mode

When `ScaffoldOptions.includeDemo === true`, generated pages contain realistic hardcoded
sample data inline (no API calls). Goal: developer sees a real-looking UI on first `npm run dev`.

Demo content per preset:

| Preset        | Demo pages generated                                         |
|---------------|--------------------------------------------------------------|
| `ecom-*`      | Products grid (12 items), Orders table (20 rows), Revenue chart |
| `admin`       | Users table (15 rows), Audit log (10 entries), Role cards   |
| `talent`      | Athletes table (20 rows), Registration pipeline, Cert count  |
| `blank`       | Components showcase (all UI primitives, no domain data)      |

Demo data is never fetched — it's a `const` array at the top of the page file.
Developer deletes it and replaces with real API calls.

---

## ScaffoldOptions (source of truth)

```ts
interface ScaffoldOptions {
  projectName: string
  projectDescription: string

  // Preset
  preset: 'ecom-header' | 'ecom-sidebar' | 'admin' | 'talent' | 'blank'
  includeDemo: boolean

  // Auth
  authMode: 'jwt' | 'multi-role' | 'laravel'
  apiUrl?: string
  jwtCookieName?: string
  jwtSecret?: string
  roles?: string[]
  laravelUrl?: string
  dbHost?: string; dbPort?: string; dbName?: string
  dbUser?: string; dbPassword?: string

  // Design
  loginStyle: 'animated' | 'simple'
  sidebarStyle: 'full' | 'rail' | 'header'   // 'both' removed
  primaryColor: string
  accentColor: string
  successColor: string
  brandLogoPath: string

  // Options
  includeI18n: boolean
  stateManagement: 'redux-query' | 'query-only'
  packageManager: 'npm' | 'pnpm' | 'yarn'
  localUiPath?: string
}
```

---

## CLI prompt flow

```
1. Project name + description
2. Preset selection  ← NEW (replaces separate sidebar question for non-blank)
3. Include demo content?  ← NEW
4. Auth mode → auth-specific follow-ups
5. Brand colours (primary, accent, success, logo)
6. State management
7. Package manager
```

For `blank` preset only: ask sidebar style (full / rail / header).
For all other presets: sidebarStyle is derived from preset.

---

## Security rules for generated code

- JWT secret read only in **server-side** API routes — never in client components
- Cookies set with `httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production'`
- No `process.env.*` reads directly in `'use client'` files
- All user inputs going into HTML use React's JSX (never template string innerHTML)
- API proxy middleware validates method and strips hop-by-hop headers
