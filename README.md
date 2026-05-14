# `@lucifer91299/ui` + `create-portal-app`

> Next.js 15 portal design system + CLI scaffolder — animated login, dashboard layout, JWT auth, and full theming out of the box.

---

## Table of Contents

- [What's in the box](#whats-in-the-box)
- [Quick Start — New Project (CLI)](#quick-start--new-project-cli)
  - [Interactive mode](#interactive-mode)
  - [Non-interactive mode (--yes)](#non-interactive-mode---yes)
  - [All CLI flags](#all-cli-flags)
  - [CLI defaults](#cli-defaults)
  - [Generated project structure](#generated-project-structure)
  - [Demo credentials](#demo-credentials)
- [Quick Start — Existing Project](#quick-start--existing-project)
  - [1. Install](#1-install)
  - [2. Tailwind config](#2-tailwind-config)
  - [3. Import styles](#3-import-styles)
  - [4. Theme config](#4-theme-config)
  - [5. Root layout](#5-root-layout)
  - [6. Middleware (auth guard)](#6-middleware-auth-guard)
  - [7. Auth API routes](#7-auth-api-routes)
- [Components](#components)
  - [LoginPage (Animated)](#loginpage-animated)
  - [LoginPageSimple (Clean)](#loginpagesimple-clean)
  - [DashboardLayout](#dashboardlayout)
  - [UI Primitives](#ui-primitives)
- [Auth Hooks](#auth-hooks)
  - [useJwtAuth](#usejwtauth)
  - [useMultiRoleAuth](#usemultiroleauth)
  - [useLaravelSessionAuth](#uselaravelsessionauth)
- [Theming](#theming)
  - [createTheme](#createtheme)
  - [Built-in theme presets](#built-in-theme-presets)
  - [ThemeProvider](#themeprovider)
  - [Design tokens (Tailwind classes)](#design-tokens-tailwind-classes)
- [Server exports](#server-exports)
- [Local development (npm link)](#local-development-npm-link)
- [Package info](#package-info)

---

## What's in the box

| Package | npm | Description |
|---------|-----|-------------|
| `@lucifer91299/ui` | [![npm](https://img.shields.io/npm/v/@lucifer91299/ui)](https://www.npmjs.com/package/@lucifer91299/ui) | React component library — login pages, dashboard layout, auth hooks, design system |
| `create-portal-app` | [![npm](https://img.shields.io/npm/v/@lucifer91299/create-portal-app)](https://www.npmjs.com/package/@lucifer91299/create-portal-app) | CLI scaffolder — generates a complete Next.js 15 portal in seconds |

**Stack the CLI generates:**

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 3 with the `@lucifer91299/ui` preset
- `@lucifer91299/ui` component library
- framer-motion 12 (animations)
- jose (JWT)
- Redux Toolkit + TanStack Query (if selected)
- Built-in demo auth (`admin@demo.com` / `password123`) — no backend required

---

## Quick Start — New Project (CLI)

### Interactive mode

```bash
npx @lucifer91299/create-portal-app my-portal
```

The CLI walks you through each option one by one with arrow-key menus.

### Non-interactive mode (`--yes`)

```bash
npx @lucifer91299/create-portal-app my-portal --yes
```

Skips every prompt and uses the defaults listed below. Ready in under 5 seconds.

```bash
# Override specific defaults while skipping the rest
npx @lucifer91299/create-portal-app my-portal --yes --login=simple --sidebar=rail
npx @lucifer91299/create-portal-app my-portal --yes --primary=#E11D48 --accent=#F59E0B
npx @lucifer91299/create-portal-app my-portal --yes --auth=laravel
```

### All CLI flags

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `[project-name]` | any string | `my-portal` | Output folder name |
| `--yes`, `-y` | — | — | Skip all prompts, use defaults |
| `--auth=` | `jwt` \| `multi-role` \| `laravel` | `jwt` | Auth strategy |
| `--login=` | `animated` \| `simple` | `animated` | Login page style |
| `--sidebar=` | `full` \| `rail` \| `both` | `full` | Sidebar variant |
| `--primary=` | `#hex` | `#000080` | Primary brand colour |
| `--accent=` | `#hex` | `#FF9933` | Accent colour |
| `--success=` | `#hex` | `#138808` | Success colour |
| `--api-url=` | URL | `http://localhost:3000` | Backend API URL (written to `.env.local`) |
| `--pm=` | `npm` \| `pnpm` \| `yarn` | `npm` | Package manager for install instructions |
| `--local-ui=` | relative path | — | Use a local build of `@lucifer91299/ui` (dev only) |
| `--help`, `-h` | — | — | Show help and exit |

### CLI defaults

When `--yes` is used without overrides:

```
Auth mode   : jwt (cookie-based JWT, with demo /api/auth/* routes)
Login style : animated (floating orbs + particles + tricolor stripe)
Sidebar     : full (wide sidebar with nav groups and labels)
Primary     : #000080  (navy blue)
Accent      : #FF9933  (saffron)
Success     : #138808  (green)
State mgmt  : redux-query (Redux Toolkit + TanStack Query)
Package mgr : npm
```

### Generated project structure

```
my-portal/
├── src/
│   ├── app/
│   │   ├── layout.tsx            ← root layout with ThemeProvider + CSS imports
│   │   ├── globals.css           ← Tailwind directives only
│   │   ├── page.tsx              ← redirects / to /login
│   │   ├── login/
│   │   │   └── page.tsx          ← LoginPage (animated) or LoginPageSimple
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        ← DashboardLayout + useJwtAuth
│   │   │   └── page.tsx          ← dashboard home
│   │   └── api/
│   │       └── auth/
│   │           ├── login/route.ts  ← POST — issues JWT cookie (demo data)
│   │           ├── user/route.ts   ← GET  — validates JWT, returns payload
│   │           └── logout/route.ts ← POST — clears cookie
│   ├── components/
│   │   └── nav-config.tsx        ← navGroups definition
│   ├── lib/
│   │   └── api.ts                ← axios client with auth header
│   ├── store/                    ← Redux store + auth slice (if redux-query)
│   ├── middleware.ts             ← JWT edge middleware (protects /dashboard)
│   └── theme.config.ts          ← createTheme({ primary, accent, ... })
├── public/
│   └── brand/
│       └── logo.svg              ← placeholder logo (swap with your own)
├── tailwind.config.ts
├── next.config.ts                ← transpilePackages: ['@lucifer91299/ui']
└── .env.local                    ← NEXT_PUBLIC_API_URL, JWT_SECRET
```

### Demo credentials

The generated project ships with working dummy auth — no backend needed:

```
Email    : admin@demo.com
Password : password123
```

The `/api/auth/login` route uses `jose` to sign a JWT and sets an `httpOnly` cookie. The `/api/auth/user` route verifies it. The middleware protects `/dashboard`. **Change `JWT_SECRET` in `.env.local` before deploying.**

After generation:

```bash
cd my-portal
npm install
npm run dev
# → http://localhost:3000
# → /login   (use admin@demo.com / password123)
# → /dashboard (auto-protected by middleware)
```

---

## Quick Start — Existing Project

### 1. Install

```bash
npm install @lucifer91299/ui framer-motion jose
```

> **Required peer deps:** `react >=18`, `next >=14`, `framer-motion ^12`, `jose ^5`, `tailwindcss ^3`, `lucide-react`

### 2. Tailwind config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import preset from '@lucifer91299/ui/tailwind/preset'

export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    // include SDK dist so Tailwind can see SDK classes
    './node_modules/@lucifer91299/ui/dist/index.js',
  ],
} satisfies Config
```

> Do **not** add brand colours to `tailwind.config.ts` — they are set via CSS variables by `ThemeProvider`. Adding them here will break theming.

**Add to `next.config.ts`:**

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lucifer91299/ui'],
}

export default nextConfig
```

> `transpilePackages` is required for Next.js to compile the SDK's JSX/TSX correctly when using `npm link` or `file:` references. Safe to keep even with the published npm package.

### 3. Import styles

In your root `layout.tsx` (not `globals.css`):

```tsx
// src/app/layout.tsx
import '@lucifer91299/ui/styles/components.css'  // SDK pre-built component styles
import './globals.css'                            // your own globals
```

Your `globals.css` should only contain Tailwind directives:

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> Import `@lucifer91299/ui/styles/components.css` from the dist build (not the source). Importing raw source CSS from `node_modules` can cause Tailwind directive errors in some Next.js versions.

### 4. Theme config

```ts
// src/theme.config.ts
import { createTheme } from '@lucifer91299/ui'

export default createTheme({
  primary:        '#000080',   // navy
  accent:         '#FF9933',   // saffron
  success:        '#138808',   // green
  projectName:    'My Portal',
  logoSrc:        '/brand/logo.svg',
  sidebar:        'full',      // 'full' | 'rail' | 'both'
  loginStyle:     'animated',  // 'animated' | 'simple'
})
```

All fields are optional — any field you omit falls back to the SDK default.

### 5. Root layout

```tsx
// src/app/layout.tsx
import '@lucifer91299/ui/styles/components.css'
import './globals.css'
import { ThemeProvider } from '@lucifer91299/ui'
import theme from '@/theme.config'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 6. Middleware (auth guard)

```ts
// src/middleware.ts
import { jwtMiddleware } from '@lucifer91299/ui/server'

export default jwtMiddleware({
  cookieName:     'access_token',
  jwtSecret:      process.env.JWT_SECRET!,
  protectedPaths: ['/dashboard'],
  loginPath:      '/login',
})

export const config = {
  matcher: ['/((?!_next|public|favicon.ico).*)'],
}
```

> Import from `@lucifer91299/ui/server` — this export is Edge Runtime safe (uses `jose`, no Node.js APIs).

### 7. Auth API routes

Minimum three routes needed. Copy these into your project:

**`src/app/api/auth/login/route.ts`**
```ts
import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Replace with your real user lookup
  if (email !== 'admin@demo.com' || password !== 'password123') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret')
  const token = await new SignJWT({ sub: '1', name: 'Admin', role: 'Admin', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
```

**`src/app/api/auth/user/route.ts`**
```ts
import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const store = await cookies()
  const token = store.get('access_token')?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret')
    const { payload } = await jwtVerify(token, secret)
    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
```

**`src/app/api/auth/logout/route.ts`**
```ts
import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('access_token', '', { maxAge: 0, path: '/' })
  return res
}
```

---

## Components

### LoginPage (Animated)

Full-screen animated login with floating parallax orbs, particle canvas background, and an animated tricolor stripe entrance. Best for institutional / government portals.

```tsx
import { LoginPage } from '@lucifer91299/ui'

<LoginPage
  projectName="My Portal"
  logoSrc="/brand/logo.svg"
  onSubmit={async ({ identifier, password }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier, password }),
    })
    if (!res.ok) throw new Error('Invalid credentials')
  }}
  isLoading={false}
  error={null}
  forgotPasswordHref="/forgot-password"       // optional
  poweredBy={{                                  // optional footer badge
    logoSrc: '/brand/powered-by.svg',
    text: 'Powered by STSPL',
    href: 'https://stspl.com',
  }}
/>
```

> The input field label is **Identifier** (accepts email or username). Uses `identifier` key in `onSubmit` — not `email`.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projectName` | `string` | Yes | Shown in the card header |
| `logoSrc` | `string` | Yes | Path to logo image |
| `onSubmit` | `({ identifier, password }) => Promise<void>` | Yes | Called on form submit; throw to show error |
| `isLoading` | `boolean` | No | Shows spinner on button |
| `error` | `string \| null` | No | Error message below form |
| `forgotPasswordHref` | `string` | No | Link for "Forgot password?" |
| `poweredBy` | `{ logoSrc, text, href }` | No | Footer powered-by badge |

---

### LoginPageSimple (Clean)

Minimal gradient card login. Optional role-select splash screen after login (for multi-role portals like coach + judge).

```tsx
import { LoginPageSimple } from '@lucifer91299/ui'
import { User, Shield } from 'lucide-react'

<LoginPageSimple
  projectName="My Portal"
  logoSrc="/brand/logo.svg"
  onSubmit={async ({ email, password }) => {
    const data = await login(email, password)
    // return { role: 'both' } to trigger RoleSelectSplash
    // return { role: 'admin' } to skip role selection
    return { role: data.role }
  }}
  roles={[
    { key: 'coach', label: 'Continue as Coach', description: 'Manage athletes', icon: <User /> },
    { key: 'judge', label: 'Continue as Judge', description: 'Score events', icon: <Shield /> },
  ]}
  onRoleSelect={(role) => router.push(`/dashboard/${role}`)}
  isLoading={false}
  error={null}
/>
```

> The input field label is **Email** (uses `email` key in `onSubmit`).

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projectName` | `string` | Yes | |
| `logoSrc` | `string` | Yes | |
| `onSubmit` | `({ email, password }) => Promise<{ role?: string }>` | Yes | Return `{ role: 'both' }` to show role splash |
| `roles` | `RoleOption[]` | No | Role options for the splash screen |
| `onRoleSelect` | `(role: string) => void` | No | Called when user picks a role |
| `isLoading` | `boolean` | No | |
| `error` | `string \| null` | No | |

---

### DashboardLayout

Responsive sidebar + topbar layout. Handles navigation, user info, logout, and mobile drawer automatically.

```tsx
// src/app/dashboard/layout.tsx
'use client'

import { DashboardLayout, useJwtAuth } from '@lucifer91299/ui'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

const navGroups = [
  {
    heading: 'Main',
    groupIcon: <LayoutDashboard className="w-3.5 h-3.5" />,
    items: [
      { label: 'Dashboard', href: '/dashboard',          icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Users',     href: '/dashboard/users',    icon: <Users className="w-4 h-4" /> },
      { label: 'Settings',  href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading, logout } = useJwtAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>

  return (
    <DashboardLayout
      navGroups={navGroups}
      sidebar="full"                    // 'full' | 'rail' | 'both'
      projectName="My Portal"
      logoSrc="/brand/logo.svg"
      user={{ name: String(user?.name ?? 'User'), role: String(user?.role ?? '') }}
      pathname={pathname}
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  )
}
```

**Sidebar variants:**

| Value | Description |
|-------|-------------|
| `full` | Wide sidebar with group headings, nav labels, and collapsible groups |
| `rail` | Icon-only narrow sidebar (hover to expand tooltip) |
| `both` | Full sidebar on desktop, rail on mobile/tablet |

**`NavGroup` type:**

```ts
type NavItem = {
  label:    string
  href:     string
  icon:     React.ReactNode
  badge?:   string | number   // notification badge
  children?: NavItem[]        // nested nav items
}

type NavGroup = {
  heading:   string
  groupIcon: React.ReactNode
  items:     NavItem[]
}
```

---

### UI Primitives

```tsx
import { Button, Input, Badge, Card, AlertBanner, LoadingSpinner } from '@lucifer91299/ui'

// Button
<Button variant="primary" size="md" loading={false}>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Link style</Button>
<Button variant="danger">Delete</Button>

// Input — Apple-style filled input (gray bg, no border, focus ring)
<Input label="Email" type="email" placeholder="you@example.com" error="Required" />

// Badge
<Badge variant="primary">Active</Badge>
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>

// Card
<Card className="p-6">Content here</Card>
<Card bordered>Bordered card</Card>

// AlertBanner
<AlertBanner variant="error" message="Something went wrong" />
<AlertBanner variant="success" message="Saved successfully" />

// LoadingSpinner
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" color="primary" />
```

---

## Auth Hooks

### useJwtAuth

Validates an `httpOnly` cookie JWT by calling a `/api/auth/user` endpoint. Auto-redirects to login on 401. Re-validates every 5 minutes.

```ts
import { useJwtAuth } from '@lucifer91299/ui'

const { user, authenticated, loading, logout } = useJwtAuth({
  userApiPath:      '/api/auth/user',   // default
  loginPath:        '/login',           // default
  validateInterval: 5 * 60 * 1000,     // default — 5 min
})

// user: AuthUser | null  →  { id, name, role, email, ...any JWT payload field }
// authenticated: boolean
// loading: boolean       (true on first render until first validate() completes)
// logout(): void         (clears cookie via POST /api/auth/logout, redirects)
```

> Use this in `dashboard/layout.tsx` — not in individual pages. Call it once at the layout level.

### useMultiRoleAuth

For portals where a user can be both coach AND judge (separate cookies per role).

```ts
import { useMultiRoleAuth } from '@lucifer91299/ui'

const { activeRoles, currentRole, selectRole, loading } = useMultiRoleAuth({
  roles:        ['coach', 'judge'],
  cookiePrefix: 'portal_',   // cookies: portal_coach_token, portal_judge_token
  loginPath:    '/login',
})

// activeRoles: string[]   — which roles the user is logged in as
// currentRole: string     — the currently active role
// selectRole(role): void  — switch active role
```

### useLaravelSessionAuth

For Next.js frontends backed by a Laravel API (uses Laravel's `/api/user` endpoint with session cookie).

```ts
import { useLaravelSessionAuth } from '@lucifer91299/ui'

const { user, authenticated, loading, logout } = useLaravelSessionAuth({
  laravelUrl: process.env.NEXT_PUBLIC_LARAVEL_URL!,
  loginPath:  '/login',
})
```

---

## Theming

### createTheme

Merge your overrides with the SDK default. Every field is optional.

```ts
import { createTheme } from '@lucifer91299/ui'

export default createTheme({
  // Brand colours — hex values only
  primary:   '#E11D48',         // rose
  accent:    '#F59E0B',         // amber
  success:   '#10B981',         // emerald

  // Soft + hover variants are auto-derived if you only set the base colour.
  // Override explicitly if needed:
  'primary-soft':  'rgba(225, 29, 72, 0.12)',
  'primary-hover': 'rgba(225, 29, 72, 0.9)',

  // Layout
  sidebar:     'rail',      // 'full' | 'rail' | 'both'
  loginStyle:  'simple',   // 'animated' | 'simple'

  // Identity
  projectName:     'My App',
  projectSubtitle: 'Admin Panel',
  logoSrc:         '/brand/logo.svg',
  logoAlt:         'My App Logo',

  // Footer powered-by (optional — shown on login page)
  poweredByLogoSrc: '/brand/powered-by.svg',
  poweredByText:    'Powered by STSPL',
  poweredByHref:    'https://stspl.com',

  // Typography
  fontFamily:   "'Inter', system-ui, sans-serif",

  // Border radius preset
  borderRadius: 'apple',   // 'apple' (8–28px) | 'rounded' (4–16px) | 'sharp' (2–8px)
})
```

### Built-in theme presets

```ts
import { createTheme, builtInThemes } from '@lucifer91299/ui'

// Use a preset as a base and override specific fields
export default createTheme({
  ...builtInThemes.dark,        // indigo / amber / emerald, rail sidebar
  projectName: 'My SaaS App',
})

export default createTheme({
  ...builtInThemes.minimal,     // slate / blue / green, 'both' sidebar
  projectName: 'Corporate Tool',
})
```

| Preset | Primary | Accent | Success | Sidebar | Login |
|--------|---------|--------|---------|---------|-------|
| `default` | `#000080` navy | `#FF9933` saffron | `#138808` green | `full` | `animated` |
| `dark` | `#6366F1` indigo | `#F59E0B` amber | `#10B981` emerald | `rail` | `simple` |
| `minimal` | `#0F172A` slate | `#3B82F6` blue | `#22C55E` green | `both` | `simple` |

### ThemeProvider

Injects CSS variables on a wrapper `<div>`. Must wrap your entire app (place in root layout).

```tsx
import { ThemeProvider } from '@lucifer91299/ui'
import theme from '@/theme.config'

// Inside root layout:
<ThemeProvider theme={theme}>
  {children}
</ThemeProvider>
```

> CSS variables set: `--primary`, `--primary-soft`, `--primary-hover`, `--accent`, `--accent-soft`, `--accent-hover`, `--success`, `--success-soft`, `--success-hover`. These power all Tailwind brand classes (`bg-primary`, `text-accent`, etc.).

### Design tokens (Tailwind classes)

All classes are available after adding the preset to `tailwind.config.ts`.

**Brand colours** (driven by CSS variables from ThemeProvider):

| Class | CSS variable |
|-------|-------------|
| `bg-primary` / `text-primary` | `--primary` |
| `bg-primary-soft` / `text-primary-soft` | `--primary-soft` |
| `bg-accent` / `text-accent` | `--accent` |
| `bg-success` / `text-success` | `--success` |

**Surfaces (neutral, Tailwind-native):**

| Class | Role |
|-------|------|
| `bg-surface-primary` | White / page background |
| `bg-surface-secondary` | Light gray card / panel |
| `bg-surface-tertiary` | Dividers, inputs |

**Text labels:**

| Class | Role |
|-------|------|
| `text-label-primary` | Main body text |
| `text-label-secondary` | Supporting text |
| `text-label-tertiary` | Placeholder / disabled |

**Typography:**

| Class | Size / Weight |
|-------|--------------|
| `text-display` | 32px / 700 |
| `text-title1` | 24px / 600 |
| `text-title2` | 20px / 600 |
| `text-body` | 15px / 400 |
| `text-callout` | 14px / 500 |
| `text-subhead` | 13px / 400 |
| `text-footnote` | 12px / 400 |

**Border radius** (set by `borderRadius` in theme):

| Class | `apple` | `rounded` | `sharp` |
|-------|---------|-----------|---------|
| `rounded-sm` | 8px | 4px | 2px |
| `rounded` | 12px | 8px | 4px |
| `rounded-md` | 14px | 10px | 4px |
| `rounded-lg` | 16px | 12px | 6px |
| `rounded-xl` | 20px | 14px | 6px |
| `rounded-2xl` | 28px | 16px | 8px |

**Shadows:**

```
shadow-sm  shadow  shadow-md  shadow-lg  shadow-xl
```

---

## Server exports

The `/server` entry point is Edge Runtime safe. Import only from here in `middleware.ts`.

```ts
import { jwtMiddleware } from '@lucifer91299/ui/server'
```

**Available server exports:**

| Export | Description |
|--------|-------------|
| `jwtMiddleware(options)` | Next.js edge middleware — verifies `httpOnly` cookie JWT, redirects to login on 401 |

**`jwtMiddleware` options:**

```ts
jwtMiddleware({
  cookieName:     'access_token',      // cookie to read JWT from
  jwtSecret:      process.env.JWT_SECRET!,
  protectedPaths: ['/dashboard'],      // array of path prefixes to protect
  loginPath:      '/login',            // where to redirect on 401
})
```

---

## Local development (npm link)

When developing the SDK and a consumer app simultaneously:

```bash
# 1. Build the SDK
cd packages/ui
npm run build

# 2. Link it globally
npm link

# 3. In your app, link the SDK
cd /path/to/my-portal
npm link @lucifer91299/ui

# 4. Keep rebuilding on changes
cd packages/ui
npm run build     # run this after each SDK change
```

Or use the CLI's `--local-ui` flag when scaffolding:

```bash
npx @lucifer91299/create-portal-app my-portal --yes --local-ui=../../ui
# generates: "@lucifer91299/ui": "file:../../ui" in package.json
```

> After `npm install` in the consumer app, re-link if the symlink was overwritten:
> ```bash
> npm link @lucifer91299/ui
> ```

---

## Package info

```
packages/
├── ui/                  → @lucifer91299/ui (component library)
│   ├── src/
│   │   ├── components/  → Button, Input, Badge, Card, LoginPage, DashboardLayout …
│   │   ├── hooks/       → useJwtAuth, useMultiRoleAuth, useLaravelSessionAuth
│   │   ├── theme/       → createTheme, ThemeProvider, builtInThemes
│   │   ├── auth/        → types
│   │   ├── styles/      → components.css (source), globals.css
│   │   ├── tailwind/    → preset.ts
│   │   └── server.ts    → jwtMiddleware (Edge Runtime)
│   └── dist/            → built output (CJS + ESM + types + CSS)
│
└── create-portal-app/   → @lucifer91299/create-portal-app (CLI)
    ├── src/
    │   ├── cli/
    │   │   └── index.ts → arg parsing, prompts, scaffold() runner
    │   └── templates/
    │       └── index.ts → all file generators (genPackageJson, genLoginPage …)
    └── dist/
        └── cli/index.js → built CLI entry (#!/usr/bin/env node)
```

**npm scope:** `@lucifer91299` — published under the `lucifer91299` npm account.

**GitHub:** [aakashkanojiya91299/nexportal](https://github.com/aakashkanojiya91299/nexportal)
