# `@lucifer91299/ui`

> Next.js 15 portal design system — animated login, dashboard layout, JWT auth hooks, full theming, and 30+ production-ready components.

[![npm version](https://img.shields.io/npm/v/@lucifer91299/ui)](https://www.npmjs.com/package/@lucifer91299/ui)
[![npm downloads](https://img.shields.io/npm/dm/@lucifer91299/ui)](https://www.npmjs.com/package/@lucifer91299/ui)
[![license](https://img.shields.io/npm/l/@lucifer91299/ui)](https://github.com/aakashkanojiya91299/nexportal/blob/main/LICENSE)

**Scaffold a full portal in seconds using the CLI:**

```bash
npx @lucifer91299/create-portal-app my-portal
```

---

## Table of Contents

- [Install](#install)
- [Setup (5 steps)](#setup-5-steps)
- [Components](#components)
  - [Button](#button)
  - [Input & Textarea](#input--textarea)
  - [Select](#select)
  - [DatePicker](#datepicker)
  - [DateTimePicker](#datetimepicker)
  - [Switch, Checkbox, RadioGroup](#switch-checkbox-radiogroup)
  - [Badge & StatusBadge](#badge--statusbadge)
  - [DataTable](#datatable)
  - [Card, Separator, AlertBanner](#card-separator-alertbanner)
  - [Dialog](#dialog)
  - [Tabs](#tabs)
  - [Accordion](#accordion)
  - [Tooltip](#tooltip)
  - [Avatar & AvatarGroup](#avatar--avatargroup)
  - [Progress, Skeleton, LoadingSpinner](#progress-skeleton-loadingspinner)
  - [Toast](#toast)
  - [Charts](#charts)
  - [LoginPage (Animated)](#loginpage-animated)
  - [LoginPageSimple (Clean)](#loginpagesimple-clean)
  - [DashboardLayout](#dashboardlayout)
- [Auth Hooks](#auth-hooks)
- [Auth API routes](#auth-api-routes)
- [Middleware / proxy.ts](#middleware--proxyts)
- [Theming](#theming)
- [Server exports](#server-exports)
- [Local development](#local-development)

---

## Install

```bash
npm install @lucifer91299/ui framer-motion jose
# Charts (optional)
npm install recharts
```

**Required peer deps:** `react >=18`, `next >=14`, `framer-motion >=10`, `tailwindcss >=3`

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

> Import `@lucifer91299/ui/styles/components.css` in `layout.tsx`, not in `globals.css`. Importing SDK CSS from `node_modules` can trigger Tailwind directive errors.

---

## Components

### Button

```tsx
import { Button } from '@lucifer91299/ui'

<Button variant="primary">Save</Button>
<Button variant="accent">Highlight</Button>
<Button variant="tinted">Tinted</Button>
<Button variant="outline">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Link style</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>   {/* default */}
<Button size="lg">Large</Button>

<Button isLoading>Saving…</Button>
<Button disabled>Disabled</Button>
```

---

### Input & Textarea

```tsx
import { Input, Textarea } from '@lucifer91299/ui'

<Input label="Full name" placeholder="Priya Mehta" />
<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Password" type="password" />
<Input label="With error" error="This field is required" />
<Input label="Disabled" disabled defaultValue="Read-only" />
<Input label="With right label" labelRight={<a href="#">Forgot?</a>} />

<Textarea label="Message" placeholder="Type here…" helperText="Max 500 chars" />
<Textarea label="With error" error="Message is required" />
```

---

### Select

Supports single select and multi-select with pill tags, search, grouped options, select-all, and clear.

```tsx
import { Select } from '@lucifer91299/ui'

const options = [
  { value: 'admin',   label: 'Administrator' },
  { value: 'manager', label: 'Manager'       },
  { value: 'viewer',  label: 'Viewer'        },
]

{/* Single */}
<Select
  label="Role"
  options={options}
  value={value}
  onChange={setValue}
  searchable
  clearable
/>

{/* Multi-select — pill tags, select-all, Done button */}
<Select
  label="Roles"
  multiple
  options={options}
  value={values}          // string[]
  onChange={setValues}    // (values: string[]) => void
  placeholder="Pick roles…"
  clearable
  helperText={values.length ? `${values.length} selected` : ''}
/>

{/* Grouped */}
<Select
  label="Team member"
  multiple
  options={[
    { value: 'admin',   label: 'Admin',   group: 'Management' },
    { value: 'manager', label: 'Manager', group: 'Management' },
    { value: 'editor',  label: 'Editor',  group: 'Content'    },
  ]}
  value={values}
  onChange={setValues}
  searchable
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `options` | `SelectOption[]` | `{ value, label, disabled?, group? }` |
| `multiple` | `true` | Enable multi-select mode |
| `value` | `string` or `string[]` | Controlled value |
| `onChange` | `(v) => void` | `string` for single, `string[]` for multi |
| `searchable` | `boolean` | Show search input in dropdown |
| `clearable` | `boolean` | Show clear button |
| `error` | `string` | Red border + error message below |
| `onAddNew` | `() => void` | Show "Add new…" footer row |
| `maxTagsShown` | `number` | Max pill tags before "+N more" (default `3`) |

---

### DatePicker

3-level calendar (days → months → years). Supports uncontrolled mode, past/future/weekend/specific date constraints.

```tsx
import { DatePicker } from '@lucifer91299/ui'

{/* Uncontrolled — no value/onChange needed */}
<DatePicker label="Pick a date" />

{/* Controlled */}
<DatePicker
  label="Start date"
  value={date}          // 'yyyy-MM-dd'
  onChange={setDate}
/>

{/* Constraints */}
<DatePicker label="No future dates"  disableFuture />
<DatePicker label="No past dates"    disablePast />
<DatePicker label="Weekdays only"    excludeWeekends />
<DatePicker label="Range"            minDate="2024-01-01" maxDate="2024-12-31" />

{/* Specific dates disabled */}
<DatePicker
  label="Blocked dates"
  excludeDates={['2024-12-25', '2024-12-26', '2025-01-01']}
  helperText="Holidays disabled"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | `'yyyy-MM-dd'`. Omit for uncontrolled mode |
| `onChange` | `(iso: string) => void` | Called on day select or Clear |
| `disableFuture` | `boolean` | Block all dates after today |
| `disablePast` | `boolean` | Block all dates before today |
| `minDate` / `maxDate` | `string` | `'yyyy-MM-dd'` range bounds |
| `excludeWeekends` | `boolean` | Disable Sat + Sun |
| `excludeDates` | `string[]` | Specific `'yyyy-MM-dd'` dates to block |
| `error` | `string` | Red border + error message below |

Disabled dates render with strikethrough, ash background, and muted colour.

---

### DateTimePicker

All `DatePicker` features plus a time spinner — 12h/24h format, minute step, optional seconds, minTime/maxTime, and a **Now** button.

```tsx
import { DateTimePicker } from '@lucifer91299/ui'

{/* 24-hour, 5-minute steps (uncontrolled) */}
<DateTimePicker
  label="Schedule"
  minuteStep={5}
/>

{/* 12-hour format with AM/PM toggle */}
<DateTimePicker
  label="Meeting time"
  value={dt}             // 'yyyy-MM-dd HH:mm'
  onChange={setDt}
  timeFormat="12h"
/>

{/* With seconds */}
<DateTimePicker
  label="Exact time"
  value={dt}
  onChange={setDt}
  showSeconds
  helperText={dt}        // shows 'yyyy-MM-dd HH:mm:ss'
/>

{/* All date constraints work identically to DatePicker */}
<DateTimePicker
  label="Workday only"
  disableFuture
  excludeWeekends
  excludeDates={['2025-05-01']}
  minTime="09:00"
  maxTime="18:00"
  minuteStep={15}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | `'yyyy-MM-dd HH:mm'` or `'yyyy-MM-dd HH:mm:ss'`. Omit for uncontrolled |
| `onChange` | `(v: string) => void` | — | |
| `timeFormat` | `'12h' \| '24h'` | `'24h'` | 12h shows AM/PM toggle |
| `minuteStep` | `number` | `1` | Step size for minute spinner (e.g. 5, 10, 15, 30) |
| `showSeconds` | `boolean` | `false` | Add seconds spinner; value format becomes `HH:mm:ss` |
| `minTime` / `maxTime` | `string` | — | `'HH:mm'` allowed time range (shown as helper) |
| `disableFuture` | `boolean` | — | Same as DatePicker |
| `disablePast` | `boolean` | — | Same as DatePicker |
| `minDate` / `maxDate` | `string` | — | Same as DatePicker |
| `excludeWeekends` | `boolean` | — | Same as DatePicker |
| `excludeDates` | `string[]` | — | Same as DatePicker |
| `error` | `string` | — | Red border + error message below |

**UI flow:** Click the trigger → pick a date in the calendar (highlights the selection) → adjust time spinners with ▲/▼ → press **Done** to commit. **Now** button sets both date and time to the current moment. **Clear** resets the value.

---

### Switch, Checkbox, RadioGroup

All three support an `error` prop — renders the label/indicator in red with an error message below.

```tsx
import { Switch, Checkbox, RadioGroup } from '@lucifer91299/ui'

<Switch label="Email notifications" description="Daily digest" checked={on} onChange={setOn} />
<Switch label="Disabled" disabled />
<Switch label="Required" error="You must enable notifications" />

<Checkbox label="Accept terms" description="I agree" checked={checked} onChange={setChecked} />
<Checkbox label="Indeterminate" indeterminate />
<Checkbox label="Required" error="You must accept the terms" />

<RadioGroup
  label="Billing cycle"
  options={[
    { value: 'monthly',   label: 'Monthly',   description: 'Billed every month' },
    { value: 'quarterly', label: 'Quarterly', description: 'Save 10%' },
    { value: 'annual',    label: 'Annual',    description: 'Save 25%' },
  ]}
  value={cycle}
  onChange={setCycle}
  orientation="vertical"   // 'vertical' | 'horizontal'
/>

{/* RadioGroup with validation error */}
<RadioGroup
  options={options}
  value=""
  onChange={setCycle}
  error="Please select a billing cycle"
/>
```

---

### Badge & StatusBadge

```tsx
import { Badge, StatusBadge } from '@lucifer91299/ui'

<Badge variant="primary">Primary</Badge>
<Badge variant="active">Active</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="inactive">Inactive</Badge>
<Badge variant="rejected">Rejected</Badge>

{/* Auto-styled workflow states */}
<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="approved" />
<StatusBadge status="rejected" />
<StatusBadge status="completed" />
<StatusBadge status="paid" />
<StatusBadge status="scheduled" />
<StatusBadge status="cancelled" />
```

---

### DataTable

Fully-featured table with sorting, global search, per-column filters, row selection, pagination, and a toolbar slot.

```tsx
import { DataTable, StatusBadge, ActionButtons } from '@lucifer91299/ui'

const columns = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
    searchable: true,
    render: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    filterOptions: [
      { value: 'active',   label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <ActionButtons
        showEdit
        showDelete
        onEdit={() => openEdit(row)}
        onDelete={() => deleteRow(row.id)}
      />
    ),
  },
]

<DataTable
  title="Members"
  description="All registered users"
  columns={columns}
  data={rows}
  keyExtractor={(r) => r.id}
  searchable
  searchPlaceholder="Search by name…"
  pagination
  defaultPageSize={10}
  pageSizeOptions={[5, 10, 25, 50]}
  selectable
  onSelectionChange={(selected) => console.log(selected)}
  striped
  toolbar={<Button size="sm">Export CSV</Button>}
/>
```

**`TableColumn` props:**

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string` | Unique identifier, used for sort |
| `header` | `string` | Column header text |
| `render` | `(row) => ReactNode` | Cell renderer |
| `sortable` | `boolean` | Enable sort on this column |
| `searchable` | `boolean` | Include in global search |
| `filterOptions` | `{ value, label }[]` | Per-column dropdown filter |
| `width` | `string` | e.g. `'80px'` |
| `align` | `'left' \| 'center' \| 'right'` | |

**`ActionButtons` props:** `showView`, `showEdit`, `showDelete`, `showApprove`, `showReject` — each paired with an `on*` handler.

---

### Card, Separator, AlertBanner

```tsx
import { Card, Separator, AlertBanner } from '@lucifer91299/ui'

<Card className="p-6">Content</Card>

<Separator />
<Separator label="OR" />
<Separator orientation="vertical" />   {/* use in a flex row */}

<AlertBanner variant="info">Your session expires in 30 minutes.</AlertBanner>
<AlertBanner variant="success">Changes saved.</AlertBanner>
<AlertBanner variant="warning">This action cannot be undone.</AlertBanner>
<AlertBanner variant="error">Failed to connect to the server.</AlertBanner>
```

---

### Dialog

```tsx
import { Dialog } from '@lucifer91299/ui'

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Edit profile"
  description="Update your name and role."
  size="md"   // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={save}>Save</Button>
    </>
  }
>
  <Input label="Full name" />
</Dialog>
```

---

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@lucifer91299/ui'

<Tabs defaultValue="overview" variant="line">  {/* 'line' | 'pill' | 'card' */}
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="analytics">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
</Tabs>
```

---

### Accordion

```tsx
import { Accordion, AccordionItem } from '@lucifer91299/ui'

<Accordion type="single" defaultValue="q1">
  <AccordionItem value="q1" trigger="What's included?">
    Buttons, inputs, selects, date pickers, charts, tables, and more.
  </AccordionItem>
  <AccordionItem value="q2" trigger="How do I theme it?">
    Wrap your app in ThemeProvider with createTheme().
  </AccordionItem>
</Accordion>
```

---

### Tooltip

```tsx
import { Tooltip } from '@lucifer91299/ui'

<Tooltip content="Helpful hint" placement="top">
  <Button variant="outline">Hover me</Button>
</Tooltip>
```

`placement`: `'top'` | `'bottom'` | `'left'` | `'right'`

---

### Avatar & AvatarGroup

```tsx
import { Avatar, AvatarGroup } from '@lucifer91299/ui'

<Avatar name="Priya Mehta" size="md" />   {/* xs | sm | md | lg */}
<Avatar src="/priya.jpg" name="Priya Mehta" />

<AvatarGroup
  avatars={[{ name: 'Priya' }, { name: 'Arjun' }, { name: 'Neha' }]}
  max={3}
/>
```

---

### Progress, Skeleton, LoadingSpinner

```tsx
import { Progress, Skeleton, SkeletonCard, SkeletonText, LoadingSpinner } from '@lucifer91299/ui'

<Progress label="Upload" value={68} showValue />
<Progress value={90} variant="success" size="lg" />
<Progress value={45} variant="warning" />
<Progress value={15} variant="danger"  size="sm" />

<SkeletonCard />
<SkeletonText lines={3} />
<Skeleton className="h-12 w-12" rounded="full" />

<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
```

---

### Toast

```tsx
import { ToastProvider, useToast } from '@lucifer91299/ui'

// In root layout:
<ToastProvider>{children}</ToastProvider>

// In any component:
const { toast } = useToast()

toast({ title: 'Saved!',    variant: 'success' })
toast({ title: 'Error',     variant: 'error',   description: 'Something went wrong' })
toast({ title: 'Heads up',  variant: 'warning' })
toast({ title: 'FYI',       variant: 'info' })
```

---

### Charts

Requires `recharts` peer dependency (`npm install recharts`).

```tsx
import { PortalBarChart, PortalLineChart, PortalAreaChart, PortalDonutChart } from '@lucifer91299/ui'

const data = [
  { month: 'Jan', revenue: 42, expenses: 28 },
  { month: 'Feb', revenue: 55, expenses: 31 },
]

<PortalBarChart
  data={data}
  xKey="month"
  series={[
    { key: 'revenue',  name: 'Revenue'  },
    { key: 'expenses', name: 'Expenses' },
  ]}
  height={240}
/>

<PortalLineChart  data={data} xKey="month" series={[{ key: 'revenue', name: 'Revenue' }]} height={240} />
<PortalAreaChart  data={data} xKey="month" series={[{ key: 'revenue', name: 'Revenue' }]} height={240} />

{/* DonutChart accepts both name and label fields */}
<PortalDonutChart
  data={[
    { label: 'Active',   value: 58 },
    { label: 'Pending',  value: 22 },
    { label: 'Inactive', value: 20 },
  ]}
  centerLabel="Total"
  centerValue={100}
  height={240}
/>
```

---

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
/>
```

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

---

## Auth Hooks

### useJwtAuth

Validates an `httpOnly` cookie JWT by calling `/api/auth/user`. Auto-redirects on 401.

```ts
import { useJwtAuth } from '@lucifer91299/ui'

const { user, authenticated, loading, logout } = useJwtAuth({
  userApiPath:      '/api/auth/user',  // default
  loginPath:        '/login',          // default
  validateInterval: 5 * 60 * 1000,    // default — re-validates every 5 min
})
```

### useMultiRoleAuth

For portals where a user holds multiple roles simultaneously (e.g. coach + judge), each stored in a separate cookie.

```ts
import { useMultiRoleAuth } from '@lucifer91299/ui'

const { activeRoles, currentRole, selectRole, loading } = useMultiRoleAuth({
  roles:        ['coach', 'judge'],
  cookiePrefix: 'portal_',
  loginPath:    '/login',
})
```

### useLaravelSessionAuth

```ts
import { useLaravelSessionAuth } from '@lucifer91299/ui'

const { user, authenticated, loading, logout } = useLaravelSessionAuth({
  laravelUrl: process.env.NEXT_PUBLIC_LARAVEL_URL!,
  loginPath:  '/login',
})
```

---

## Auth API routes

**`src/app/api/auth/login/route.ts`**

```ts
import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
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
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/',
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

## Middleware / proxy.ts

Protect routes at the edge — no backend round-trip. The file is named `proxy.ts` (Next.js convention).

```ts
// src/proxy.ts
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

> Always import from `@lucifer91299/ui/server` in `proxy.ts` — that entry uses only Edge Runtime-compatible APIs (no dynamic `await import()`).

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

  // Soft + hover overrides (optional — auto-derived if omitted)
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

### Design tokens

**Brand (CSS variables):**

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
| `text-label-quaternary` | Muted |

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
| `text-caption1` | 11px 400 |

**Border radius** (`borderRadius` in theme):

| Class | `apple` | `rounded` | `sharp` |
|-------|---------|-----------|---------|
| `rounded-lg` | 16px | 12px | 6px |
| `rounded-xl` | 20px | 14px | 6px |
| `rounded-2xl` | 28px | 16px | 8px |

---

## Server exports

```ts
// Only import from this path in proxy.ts (Edge Runtime safe)
import { jwtMiddleware, multiRoleMiddleware } from '@lucifer91299/ui/server'
```

---

## Local development

```bash
cd packages/ui
npm run build

# Patch directly into an app's node_modules (no publish needed)
cp -r dist path/to/my-app/node_modules/@lucifer91299/ui/

# Or scaffold with a local path reference
npx @lucifer91299/create-portal-app my-portal --yes --local-ui=../../packages/ui
```

---

**GitHub:** [aakashkanojiya91299/nexportal](https://github.com/aakashkanojiya91299/nexportal)  
**CLI:** [`create-portal-app`](https://www.npmjs.com/package/@lucifer91299/create-portal-app)

---

## Changelog

### v1.1.16
- **`Switch`** — added `error` prop: red toggle track, red label, error message below (matching Checkbox / RadioGroup behaviour)
- **All form components** now consistently support `error` prop: `Input`, `Textarea`, `Select`, `DatePicker`, `DateTimePicker`, `Switch`, `Checkbox`, `RadioGroup`

### v1.1.15
- **`DateTimePicker`** — new component combining the full DatePicker calendar with a time spinner (12h/24h, minuteStep, showSeconds, Now button). All DatePicker constraints work identically (`disableFuture`, `excludeWeekends`, `excludeDates`, etc.)
- **`Select` rewrite** — proper multiselect with pill tags, select-all, Done button, grouped options, round dropdown (`rounded-2xl`), round option rows (`rounded-xl`)
- **`DatePicker`** — uncontrolled mode (works without `value`/`onChange`), improved disabled-date styling (strikethrough + ash background), `excludeDates` for specific date blocking
- **`DataTable`** — fixed `setState`-in-render crash when `onSelectionChange` was provided; added pagination, selectable rows
- **`RadioGroup`** — removed blue focus ring outline on selected option
- **`DonutChart`** — accepts both `name` and `label` fields in `DonutSlice`
- **Auth middleware** — fixed Edge Runtime crash: `jwtMiddleware` and `multiRoleMiddleware` now use static `import { NextResponse }` instead of dynamic `await import('next/server')`
- **`proxy.ts`** — scaffolded file renamed from `middleware.ts` to match Next.js convention

### v1.0.7
- Removed `PageFooter` from `DashboardLayout` wrapper
- Redesigned components showcase with stats cards, all Badge variants, live DataTable

### v1.0.6
- Added `DataTable`, `StatusBadge`, `ActionButtons`, `Select`, `PageShell`, `Breadcrumbs`, `PageFooter`
- Improved `Input`: `labelRight`, `suffix`, required asterisk

### v1.0.1
- Initial public release
