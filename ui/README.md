# `@lucifer91299/ui`

> Next.js 15 portal design system — animated login, dashboard layout, JWT auth hooks, and full theming out of the box.

[![npm version](https://img.shields.io/npm/v/@lucifer91299/ui)](https://www.npmjs.com/package/@lucifer91299/ui)
[![npm downloads](https://img.shields.io/npm/dm/@lucifer91299/ui)](https://www.npmjs.com/package/@lucifer91299/ui)

**Scaffold a full portal in seconds using the CLI:**

```bash
npx create-portal-app my-portal --yes
```

---

## Table of Contents

- [Install](#install)
- [Setup (5 steps)](#setup-5-steps)
- [Components](#components)
  - [LoginPage (Animated)](#loginpage-animated)
  - [LoginPageSimple (Clean)](#loginpagesimple-clean)
  - [DashboardLayout](#dashboardlayout)
  - [UI Primitives](#ui-primitives)
- [Auth Hooks](#auth-hooks)
  - [useJwtAuth](#usejwtauth)
  - [useMultiRoleAuth](#usemultiroleauth)
  - [useLaravelSessionAuth](#uselaravelsessionauth)
- [Auth API routes](#auth-api-routes)
- [Middleware](#middleware)
- [Theming](#theming)
  - [createTheme — all options](#createtheme--all-options)
  - [Built-in presets](#built-in-presets)
  - [ThemeProvider](#themeprovider)
  - [Design tokens](#design-tokens)
- [Server exports](#server-exports)
- [Local development](#local-development)

---

## Install

```bash
npm install @lucifer91299/ui framer-motion jose
```

**Required peer deps:** `react >=18`, `next >=14`, `framer-motion ^12`, `jose ^5`, `tailwindcss ^3`, `lucide-react`

---

## Setup (5 steps)

### 1. `next.config.ts`

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lucifer91299/ui'],
}

export default nextConfig
```

### 2. `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss'
import preset from '@lucifer91299/ui/tailwind/preset'

export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@lucifer91299/ui/dist/index.js',
  ],
} satisfies Config
```

> Do **not** add brand colours here — they are injected via CSS variables by `ThemeProvider`.

### 3. `src/theme.config.ts`

```ts
import { createTheme } from '@lucifer91299/ui'

export default createTheme({
  primary:     '#000080',
  accent:      '#FF9933',
  success:     '#138808',
  projectName: 'My Portal',
  logoSrc:     '/brand/logo.svg',
  sidebar:     'full',      // 'full' | 'rail' | 'both'
  loginStyle:  'animated',  // 'animated' | 'simple'
})
```

### 4. `src/app/layout.tsx`

```tsx
import '@lucifer91299/ui/styles/components.css'
import './globals.css'
import { ThemeProvider } from '@lucifer91299/ui'
import theme from '@/theme.config'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

### 5. `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> Import `@lucifer91299/ui/styles/components.css` in `layout.tsx`, not in `globals.css`. Importing SDK source CSS from `node_modules` can trigger Tailwind directive errors.

---

## Components

### LoginPage (Animated)

Full-screen login with floating parallax orbs, particle canvas, and an animated tricolor stripe. Best for institutional portals.

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
  forgotPasswordHref="/forgot-password"
  poweredBy={{ logoSrc: '/brand/powered-by.svg', text: 'Powered by STSPL', href: 'https://stspl.com' }}
/>
```

> The field is called `identifier` in `onSubmit` — not `email`. It accepts both email and username.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projectName` | `string` | Yes | Shown in the card header |
| `logoSrc` | `string` | Yes | Logo image path |
| `onSubmit` | `({ identifier, password }) => Promise<void>` | Yes | Throw to show an error |
| `isLoading` | `boolean` | No | Shows spinner on button |
| `error` | `string \| null` | No | Error message below the form |
| `forgotPasswordHref` | `string` | No | "Forgot password?" link |
| `poweredBy` | `{ logoSrc, text, href }` | No | Footer powered-by badge |

---

### LoginPageSimple (Clean)

Minimal gradient card login. Optionally shows a role-select splash after login.

```tsx
import { LoginPageSimple } from '@lucifer91299/ui'
import { User, Shield } from 'lucide-react'

<LoginPageSimple
  projectName="My Portal"
  logoSrc="/brand/logo.svg"
  onSubmit={async ({ email, password }) => {
    const data = await login(email, password)
    return { role: data.role } // return 'both' to show RoleSelectSplash
  }}
  roles={[
    { key: 'coach', label: 'Continue as Coach', description: 'Manage athletes', icon: <User /> },
    { key: 'judge', label: 'Continue as Judge', description: 'Score events',   icon: <Shield /> },
  ]}
  onRoleSelect={(role) => router.push(`/dashboard/${role}`)}
  isLoading={false}
  error={null}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `projectName` | `string` | Yes | |
| `logoSrc` | `string` | Yes | |
| `onSubmit` | `({ email, password }) => Promise<{ role?: string }>` | Yes | Return `{ role: 'both' }` to show role splash |
| `roles` | `RoleOption[]` | No | Role options for splash screen |
| `onRoleSelect` | `(role: string) => void` | No | Called when user picks a role |
| `isLoading` | `boolean` | No | |
| `error` | `string \| null` | No | |

---

### DashboardLayout

Responsive sidebar + topbar. Handles navigation, user info, logout, and mobile drawer automatically.

```tsx
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
      sidebar="full"
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
| `full` | Wide sidebar with group headings, labels, and collapsible groups |
| `rail` | Icon-only narrow sidebar |
| `both` | Full on desktop, rail on mobile |

**`NavGroup` / `NavItem` types:**

```ts
type NavItem = {
  label:     string
  href:      string
  icon:      React.ReactNode
  badge?:    string | number  // notification badge
  children?: NavItem[]        // nested items
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

<Button variant="primary" size="md">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Link style</Button>
<Button variant="danger">Delete</Button>

<Input label="Email" type="email" placeholder="you@example.com" error="Required" />

<Badge variant="primary">Active</Badge>
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>

<Card className="p-6">Content</Card>
<Card bordered>Bordered card</Card>

<AlertBanner variant="error" message="Something went wrong" />
<AlertBanner variant="success" message="Saved" />

<LoadingSpinner size="sm" />
<LoadingSpinner size="md" color="primary" />
```

---

## Auth Hooks

### useJwtAuth

Validates an `httpOnly` cookie JWT by calling `/api/auth/user`. Auto-redirects on 401. Re-validates every 5 minutes.

```ts
import { useJwtAuth } from '@lucifer91299/ui'

const { user, authenticated, loading, logout } = useJwtAuth({
  userApiPath:      '/api/auth/user',  // default
  loginPath:        '/login',          // default
  validateInterval: 5 * 60 * 1000,    // default — 5 min
})

// user            → AuthUser | null  ({ id, name, role, email, ...JWT payload })
// authenticated   → boolean
// loading         → boolean (true until first validate resolves)
// logout()        → clears cookie via POST /api/auth/logout, redirects to loginPath
```

> Call this once at the `dashboard/layout.tsx` level, not in individual pages.

### useMultiRoleAuth

For portals where a user holds multiple roles simultaneously (e.g. coach + judge), each stored in a separate cookie.

```ts
import { useMultiRoleAuth } from '@lucifer91299/ui'

const { activeRoles, currentRole, selectRole, loading } = useMultiRoleAuth({
  roles:        ['coach', 'judge'],
  cookiePrefix: 'portal_',  // cookies: portal_coach_token, portal_judge_token
  loginPath:    '/login',
})
```

### useLaravelSessionAuth

For Next.js frontends backed by a Laravel API.

```ts
import { useLaravelSessionAuth } from '@lucifer91299/ui'

const { user, authenticated, loading, logout } = useLaravelSessionAuth({
  laravelUrl: process.env.NEXT_PUBLIC_LARAVEL_URL!,
  loginPath:  '/login',
})
```

---

## Auth API routes

Three routes are required in your Next.js app. Copy and adjust:

**`src/app/api/auth/login/route.ts`**

```ts
import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // TODO: replace with real user lookup
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
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
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

## Middleware

Protect routes at the edge — no backend round-trip.

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

> Always import from `@lucifer91299/ui/server` in `middleware.ts` — that entry uses only Edge Runtime-compatible APIs.

---

## Theming

### createTheme — all options

```ts
import { createTheme } from '@lucifer91299/ui'

export default createTheme({
  // Brand colours (hex)
  primary:          '#000080',
  accent:           '#FF9933',
  success:          '#138808',

  // Soft + hover overrides (optional — auto-derived from base if omitted)
  'primary-soft':   'rgba(0, 0, 128, 0.12)',
  'primary-hover':  'rgba(0, 0, 128, 0.9)',
  'accent-soft':    'rgba(255, 153, 51, 0.12)',
  'accent-hover':   'rgba(255, 153, 51, 0.9)',
  'success-soft':   'rgba(19, 136, 8, 0.12)',
  'success-hover':  'rgba(19, 136, 8, 0.9)',

  // Layout
  sidebar:          'full',      // 'full' | 'rail' | 'both'
  loginStyle:       'animated',  // 'animated' | 'simple'

  // Identity
  projectName:      'My Portal',
  projectSubtitle:  '',
  logoSrc:          '/brand/logo.svg',
  logoAlt:          'Portal Logo',

  // Footer powered-by (shown on login page)
  poweredByLogoSrc: '/brand/powered-by.svg',
  poweredByText:    'Powered by',
  poweredByHref:    '#',

  // Typography
  fontFamily:       "'Inter', system-ui, sans-serif",

  // Border radius preset
  borderRadius:     'apple',  // 'apple' | 'rounded' | 'sharp'
})
```

All fields are optional — unset fields fall back to SDK defaults.

### Built-in presets

```ts
import { createTheme, builtInThemes } from '@lucifer91299/ui'

createTheme({ ...builtInThemes.dark,    projectName: 'My SaaS' })
createTheme({ ...builtInThemes.minimal, projectName: 'Corp Tool' })
```

| Preset | Primary | Accent | Success | Sidebar | Login |
|--------|---------|--------|---------|---------|-------|
| `default` | `#000080` navy | `#FF9933` saffron | `#138808` green | `full` | `animated` |
| `dark` | `#6366F1` indigo | `#F59E0B` amber | `#10B981` emerald | `rail` | `simple` |
| `minimal` | `#0F172A` slate | `#3B82F6` blue | `#22C55E` green | `both` | `simple` |

### ThemeProvider

Injects brand CSS variables into the page. Place in root layout, wrapping all children.

```tsx
<ThemeProvider theme={theme}>{children}</ThemeProvider>
```

CSS variables injected: `--primary`, `--primary-soft`, `--primary-hover`, `--accent`, `--accent-soft`, `--accent-hover`, `--success`, `--success-soft`, `--success-hover`.

### Design tokens

**Brand** (powered by CSS variables):

| Class | Variable |
|-------|----------|
| `bg-primary` / `text-primary` | `--primary` |
| `bg-primary-soft` | `--primary-soft` |
| `bg-accent` / `text-accent` | `--accent` |
| `bg-success` / `text-success` | `--success` |

**Surfaces:**

| Class | Role |
|-------|------|
| `bg-surface-primary` | Page / white |
| `bg-surface-secondary` | Card / panel |
| `bg-surface-tertiary` | Input / divider |

**Text:**

| Class | Role |
|-------|------|
| `text-label-primary` | Main text |
| `text-label-secondary` | Supporting |
| `text-label-tertiary` | Placeholder |

**Typography:**

| Class | Size |
|-------|------|
| `text-display` | 32px 700 |
| `text-title1` | 24px 600 |
| `text-title2` | 20px 600 |
| `text-body` | 15px 400 |
| `text-callout` | 14px 500 |
| `text-subhead` | 13px 400 |
| `text-footnote` | 12px 400 |

**Border radius** (`borderRadius` preset in theme):

| Class | `apple` | `rounded` | `sharp` |
|-------|---------|-----------|---------|
| `rounded-sm` | 8px | 4px | 2px |
| `rounded` | 12px | 8px | 4px |
| `rounded-md` | 14px | 10px | 4px |
| `rounded-lg` | 16px | 12px | 6px |
| `rounded-xl` | 20px | 14px | 6px |
| `rounded-2xl` | 28px | 16px | 8px |

**Shadows:** `shadow-sm` `shadow` `shadow-md` `shadow-lg` `shadow-xl`

---

## Server exports

```ts
// Only import from this path in middleware.ts (Edge Runtime safe)
import { jwtMiddleware } from '@lucifer91299/ui/server'
```

| Export | Description |
|--------|-------------|
| `jwtMiddleware(options)` | Verifies httpOnly cookie JWT, redirects to login on 401 |

---

## Local development

```bash
# In the SDK repo
cd packages/ui
npm run build
npm link

# In your app
npm link @lucifer91299/ui

# Rebuild SDK after changes
cd packages/ui && npm run build
```

Or scaffold with a local path reference:

```bash
npx create-portal-app my-portal --yes --local-ui=../../ui
```

---

**GitHub:** [aakashkanojiya91299/nexportal](https://github.com/aakashkanojiya91299/nexportal)  
**CLI:** [`create-portal-app`](https://www.npmjs.com/package/@lucifer91299/create-portal-app)
