# `@lucifer91299/ui`

> Next.js 15 portal design system — animated login, dashboard layout, JWT auth hooks, full theming, and 65+ production-ready components. Includes `TricolorBar` with sweep and infinite shimmer animations.

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
- [Styling Components](#styling-components)
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
  - [Drawer](#drawer)
  - [Tabs](#tabs)
  - [Accordion](#accordion)
  - [Tooltip & Popover](#tooltip--popover)
  - [Avatar & AvatarGroup](#avatar--avatargroup)
  - [Progress, Skeleton, LoadingSpinner, PageLoader](#progress-skeleton-loadingspinner-pageloader)
  - [Combobox](#combobox)
  - [ConfirmModal](#confirmmodal)
  - [AlertModal](#alertmodal)
  - [Skeleton Presets](#skeleton-presets)
  - [Toast](#toast)
  - [StatsCard & EmptyState](#statscard--emptystate)
  - [FileUpload](#fileupload)
  - [OTPInput](#otpinput)
  - [NumberInput](#numberinput)
  - [Slider](#slider)
  - [TagInput](#taginput)
  - [Timeline](#timeline)
  - [Charts](#charts)
  - [ImageViewer](#imageviewer)
  - [DropdownMenu](#dropdownmenu)
  - [PhoneInput](#phoneinput)
  - [ProfilePhotoInput](#profilephotoinput)
  - [AttendanceCalendar](#attendancecalendar)
  - [LoginPage (Animated)](#loginpage-animated)
  - [LoginPageSimple (Clean)](#loginpagesimple-clean)
  - [DashboardLayout](#dashboardlayout)
  - [HeaderNav](#headernav)
  - [DashboardFullPage](#dashboardfullpage)
  - [LanguageSwitcher](#languageswitcher)
  - [Layout Primitives](#layout-primitives)
- [Auth Hooks](#auth-hooks)
- [Auth API routes](#auth-api-routes)
- [Middleware / proxy.ts](#middleware--proxyts)
- [Theming](#theming)
- [Server exports](#server-exports)
- [Local development](#local-development)
- [Changelog](#changelog)

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
  sidebar:     'full',      // 'full' | 'rail' | 'both' | 'header'
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

## Styling Components

Every component in this library supports **both** `className` and `style` props on its root element. This makes it trivial to override defaults using Tailwind classes or inline CSS without fighting specificity.

### `className` — Tailwind / CSS classes

```tsx
<StatsCard className="border-2 border-blue-500 shadow-xl" ... />
<Dialog className="max-w-2xl" ... />
<PortalBarChart className="rounded-2xl bg-white p-4" ... />
```

### `style` — Inline CSS (React.CSSProperties)

```tsx
<LoginPage style={{ background: 'linear-gradient(to bottom, #001, #003)' }} ... />
<DashboardLayout style={{ '--primary': '#7c3aed' } as React.CSSProperties} ... />
<Tooltip style={{ background: '#333', borderRadius: 8 }} ... />
```

### CSS Variable overrides via `style`

Because the theme system uses CSS variables, you can override individual token values per-component:

```tsx
<StatsCard
  style={{ '--primary': '#e11d48', '--primary-soft': 'rgba(225,29,72,0.1)' } as React.CSSProperties}
  variant="primary"
  ...
/>
```

### Component `className` / `style` coverage

| Component | `className` | `style` | Notes |
|-----------|:-----------:|:-------:|-------|
| `Button` | ✓ | ✓ | via `ButtonHTMLAttributes` |
| `Input` | ✓ | ✓ | via `InputHTMLAttributes`; wraps `<input>` |
| `Textarea` | ✓ | ✓ | via `TextareaHTMLAttributes` |
| `Card` | ✓ | ✓ | via `HTMLAttributes<HTMLDivElement>` |
| `Select` | ✓ | ✓ | applied to trigger button |
| `MultiSelect` | ✓ | ✓ | applied to trigger button |
| `DatePicker` | ✓ | ✓ | applied to trigger button |
| `DateTimePicker` | ✓ | ✓ | applied to trigger button |
| `Switch` | ✓ | ✓ | applied to root wrapper |
| `Checkbox` | ✓ | ✓ | applied to root wrapper |
| `RadioGroup` | ✓ | ✓ | applied to root wrapper |
| `Badge` | ✓ | ✓ | |
| `AlertBanner` | ✓ | ✓ | |
| `Separator` | ✓ | ✓ | all 3 orientation branches |
| `Dialog` | ✓ | ✓ | merged with default box-shadow |
| `Drawer` | ✓ | ✓ | merged with slide transform |
| `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` | ✓ | ✓ | |
| `Accordion` / `AccordionItem` | ✓ | ✓ | |
| `Tooltip` | ✓ | ✓ | merged with positioning + background |
| `Popover` | ✓ | ✓ | applied to content panel |
| `Avatar` / `AvatarGroup` | ✓ | ✓ | merged with initials background |
| `Progress` | ✓ | ✓ | |
| `Skeleton` / `SkeletonText` / `SkeletonCard` | ✓ | ✓ | merged with width/height |
| `LoadingSpinner` | ✓ | ✓ | |
| `StatsCard` | ✓ | ✓ | |
| `EmptyState` | ✓ | ✓ | |
| `FileUpload` | ✓ | ✓ | |
| `OTPInput` | ✓ | ✓ | |
| `NumberInput` | ✓ | ✓ | |
| `Slider` | ✓ | ✓ | |
| `TagInput` | ✓ | ✓ | |
| `Timeline` | ✓ | ✓ | |
| `DataTable` | ✓ | ✓ | |
| `Stepper` | ✓ | ✓ | |
| `PortalBarChart` | ✓ | ✓ | merged with width/height |
| `PortalLineChart` | ✓ | ✓ | merged with width/height |
| `PortalAreaChart` | ✓ | ✓ | merged with width/height |
| `PortalDonutChart` | ✓ | ✓ | merged with width/height |
| `ImageViewer` | ✓ | ✓ | applied to root overlay |
| `DropdownMenu` | — | — | portal-rendered, no root element |
| `PhoneInput` | ✓ | — | applied to number `<input>` |
| `ProfilePhotoInput` | ✓ | ✓ | applied to root wrapper |
| `AttendanceCalendar` | ✓ | ✓ | applied to root wrapper |
| `LoginPage` | ✓ | ✓ | merged with gradient background |
| `LoginPageSimple` | ✓ | ✓ | |
| `RoleSelectSplash` | ✓ | ✓ | |
| `DashboardLayout` | ✓ | ✓ | |
| `Sidebar` | ✓ | ✓ | |
| `SidebarRail` | ✓ | ✓ | |
| `HeaderNav` | ✓ | ✓ | applied to desktop sticky `<header>` |
| `PageShell` | ✓ | ✓ | |
| `PageFooter` | ✓ | ✓ | |
| `BrandLogo` | ✓ | ✓ | |
| `TricolorBar` | ✓ | ✓ | merged with bar gradient/height; `shimmer` uses pseudo-element |
| `SocialLinks` | ✓ | ✓ | |
| `PoweredBy` | ✓ | ✓ | |

---

## Components

### Button

```tsx
import { Button } from '@lucifer91299/ui'

<Button variant="primary">Save</Button>
<Button variant="accent">Highlight</Button>
<Button variant="tinted">Tinted</Button>
<Button variant="secondary">Secondary</Button>  {/* bordered, primary colour */}
<Button variant="gray">Gray</Button>            {/* gray fill */}
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="plain">Plain / link</Button>   {/* text-only, hover underline */}
<Button variant="danger">Delete</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>   {/* default */}
<Button size="lg">Large</Button>

<Button isLoading>Saving…</Button>
<Button disabled>Disabled</Button>
```

| Variant | Appearance |
|---|---|
| `primary` | Solid — CSS-variable primary colour |
| `accent` | Solid — CSS-variable accent colour |
| `tinted` | Soft primary-colour fill |
| `secondary` | White background, primary-colour border & text |
| `gray` | Gray-100 fill, secondary label text |
| `outline` | White with opaque separator border |
| `ghost` | Transparent, secondary label text |
| `plain` | Fully transparent, hover underline |
| `danger` | Red-500 fill |

---

### Input & Textarea

`type="password"` automatically renders an Eye / EyeOff toggle button — no extra props needed.

```tsx
import { Input, Textarea } from '@lucifer91299/ui'

<Input label="Full name" placeholder="Priya Mehta" />
<Input label="Email" type="email" placeholder="you@example.com" />

{/* Password — toggle button appears automatically */}
<Input label="Password" type="password" />
<Input label="Confirm password" type="password" />

<Input label="With error" error="This field is required" />
<Input label="Disabled" disabled defaultValue="Read-only" />
<Input label="With right label" labelRight={<a href="#">Forgot?</a>} />
<Input label="With suffix icon" suffix={<SearchIcon className="w-4 h-4" />} />

<Textarea label="Message" placeholder="Type here…" helperText="Max 500 chars" />
<Textarea label="With error" error="Message is required" />
```

| Prop | Type | Description |
|------|------|-------------|
| `type` | `string` | `"password"` auto-shows Eye/EyeOff toggle |
| `suffix` | `ReactNode` | Icon/element rendered on the right (ignored when `type="password"`) |
| `label` | `ReactNode` | Field label |
| `labelRight` | `ReactNode` | Right-aligned label slot (e.g. "Forgot password?") |
| `error` | `string` | Red border + error message below |
| `helperText` | `string` | Helper text (hidden when `error` is set) |

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
| `minTime` / `maxTime` | `string` | — | `'HH:mm'` allowed time range |
| `disableFuture` | `boolean` | — | Same as DatePicker |
| `disablePast` | `boolean` | — | Same as DatePicker |
| `minDate` / `maxDate` | `string` | — | Same as DatePicker |
| `excludeWeekends` | `boolean` | — | Same as DatePicker |
| `excludeDates` | `string[]` | — | Same as DatePicker |
| `error` | `string` | — | Red border + error message below |

**UI flow:** Click trigger → pick date → adjust time spinners with ▲/▼ → press **Done**. **Now** sets both to current moment. **Clear** resets.

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

{/* Original variants */}
<Badge variant="primary">Primary</Badge>
<Badge variant="active">Active</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="inactive">Inactive</Badge>
<Badge variant="rejected">Rejected</Badge>

{/* Extended variants (sales frontend parity) */}
<Badge variant="expired">Expired</Badge>    {/* neutral ring */}
<Badge variant="dead">Dead</Badge>          {/* dark/filled */}
<Badge variant="navy">Navy</Badge>          {/* primary soft */}
<Badge variant="saffron">Saffron</Badge>    {/* accent soft */}
<Badge variant="green">Green</Badge>        {/* success soft */}

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

| Variant | Style |
|---------|-------|
| `active` | Green |
| `pending` | Amber |
| `inactive` | Gray |
| `rejected` | Red |
| `primary` | Primary color |
| `expired` | Neutral + ring |
| `dead` | Dark filled |
| `navy` | Primary soft bg |
| `saffron` | Accent soft bg |
| `green` | Success soft bg |

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

`Card` now accepts a `hoverable` prop for cursor-pointer + hover lift + primary-color border highlight.

```tsx
<Card hoverable>
  <CardContent>Click me!</CardContent>
</Card>

<Card hoverable variant="elevated">
  <CardContent>Elevated + hoverable</CardContent>
</Card>
```

### Card, Separator, AlertBanner (original)

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

### Drawer

Side-panel overlay with smooth slide-in/out animation. Opens from left or right, supports header, scrollable body, and sticky footer.

```tsx
import { Drawer } from '@lucifer91299/ui'

const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Edit user"
  description="Update details and save."
  side="right"   // 'left' | 'right'
  size="md"      // 'sm' | 'md' | 'lg' | 'full'
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={save}>Save</Button>
    </>
  }
>
  <Input label="Full name" />
  <Input label="Email" type="email" />
</Drawer>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called on backdrop click or Escape |
| `title` | `string` | — | Panel header title |
| `description` | `string` | — | Subtitle below title |
| `side` | `'left' \| 'right'` | `'right'` | Which edge the panel slides from |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Panel width (`w-72` / `w-96` / `w-[32rem]` / `w-screen`) |
| `footer` | `ReactNode` | — | Sticky footer content |
| `className` | `string` | — | Extra classes on the panel |

Escape key closes the drawer. Backdrop click also closes.

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

### Tooltip & Popover

```tsx
import { Tooltip, Popover } from '@lucifer91299/ui'

<Tooltip content="Helpful hint" placement="top">
  <Button variant="outline">Hover me</Button>
</Tooltip>

{/* Popover — click-triggered, outside-click dismiss */}
<Popover
  placement="bottom"   // 'top' | 'bottom' | 'left' | 'right'
  trigger={<Button variant="outline" size="sm">More info</Button>}
  content={
    <div className="space-y-1">
      <p className="text-callout font-medium">Details</p>
      <p className="text-footnote text-label-tertiary">Some extra context here.</p>
    </div>
  }
/>
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

### Progress, Skeleton, LoadingSpinner, PageLoader

```tsx
import {
  Progress, Skeleton, SkeletonCard, SkeletonText,
  TableSkeleton, GridSkeleton, ProfileSkeleton, SettingsSkeleton,
  LoadingSpinner, PageLoader,
} from '@lucifer91299/ui'

<Progress label="Upload" value={68} showValue />
<Progress value={90} variant="success" size="lg" />
<Progress value={45} variant="warning" />
<Progress value={15} variant="danger"  size="sm" />

{/* Base skeletons */}
<SkeletonCard />
<SkeletonText lines={3} />
<Skeleton className="h-12 w-12" rounded="full" />

{/* Spinner variants */}
<LoadingSpinner size="md" variant="default" />   {/* single ring (original) */}
<LoadingSpinner size="md" variant="dual" />       {/* primary outer + accent inner (reverse) */}
<LoadingSpinner size="md" variant="white" />      {/* white — for dark backgrounds */}

{/* Full-screen loading gate */}
<PageLoader label="Loading…" />
```

### Skeleton Presets

Full-page skeleton layouts for common dashboard patterns.

```tsx
import { TableSkeleton, GridSkeleton, ProfileSkeleton, SettingsSkeleton } from '@lucifer91299/ui'

{/* Configurable rows × cols table */}
<TableSkeleton rows={5} cols={5} />

{/* Grid of card skeletons */}
<GridSkeleton count={6} />

{/* Profile: avatar + info + detail grid */}
<ProfileSkeleton />

{/* Settings: sidebar tabs + content panel */}
<SettingsSkeleton />
```

| Component | Props |
|---|---|
| `TableSkeleton` | `rows` (default 5), `cols` (default 5), `className` |
| `GridSkeleton` | `count` (default 6), `className` |
| `ProfileSkeleton` | `className` |
| `SettingsSkeleton` | `className` |

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

### StatsCard & EmptyState

```tsx
import { StatsCard, EmptyState } from '@lucifer91299/ui'
import { Users, TrendingUp } from 'lucide-react'

<StatsCard
  title="Total Users"
  value="1,284"
  subtitle="Registered accounts"
  trend={{ direction: 'up', value: '+12%', label: 'vs last month' }}
  icon={<Users className="w-5 h-5" />}
  variant="primary"   // 'default' | 'primary' | 'success' | 'warning' | 'danger'
/>

<EmptyState
  icon={<Users className="w-8 h-8" />}
  title="No users yet"
  description="Invite team members to get started."
  action={<Button variant="primary">Invite user</Button>}
/>
```

---

### FileUpload

Drag-and-drop file picker with size validation, file list with remove buttons, accept filter, and error state.

```tsx
import { FileUpload } from '@lucifer91299/ui'

<FileUpload
  label="Profile photo"
  accept="image/*"
  maxSizeMB={2}
  helperText="PNG or JPG, max 2 MB"
  onChange={(files) => setFiles(files)}
/>

<FileUpload
  label="Documents"
  multiple
  accept=".pdf,.doc,.docx"
  maxSizeMB={10}
  error="File too large"
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `accept` | `string` | MIME types or extensions (e.g. `"image/*"`, `".pdf"`) |
| `multiple` | `boolean` | Allow multiple files |
| `maxSizeMB` | `number` | Max file size in MB — shows error if exceeded |
| `onChange` | `(files: File[]) => void` | Called when file list changes |
| `error` | `string` | Red border + error message |

---

### OTPInput

4 or 6-digit code boxes with auto-advance, backspace navigation, paste support, and error state.

```tsx
import { OTPInput } from '@lucifer91299/ui'

{/* 6-digit (default) */}
<OTPInput
  label="Verification code"
  length={6}
  value={otp}
  onChange={setOtp}
  helperText="Enter the code sent to your email"
/>

{/* 4-digit with error */}
<OTPInput
  label="PIN"
  length={4}
  value={pin}
  onChange={setPin}
  error="Incorrect PIN — try again"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | `4 \| 6` | `6` | Number of digit boxes |
| `value` | `string` | — | Controlled value |
| `onChange` | `(v: string) => void` | — | Called on each digit change |
| `error` | `string` | — | Red boxes + error message |

---

### NumberInput

+/− stepper input with min/max/step constraints, controlled and uncontrolled modes, error state.

```tsx
import { NumberInput } from '@lucifer91299/ui'

<NumberInput
  label="Quantity"
  value={qty}
  onChange={setQty}
  min={1}
  max={100}
  step={1}
/>

<NumberInput
  label="Budget (₹ thousands)"
  value={budget}
  onChange={setBudget}
  min={0}
  max={500}
  step={10}
  helperText="0 – 500"
/>

<NumberInput label="Disabled" value={5} disabled />
<NumberInput label="With error" value={0} error="Must be at least 1" />
```

---

### Slider

Range slider with track fill, custom thumb, value format callback, min/max labels, and show-value toggle.

```tsx
import { Slider } from '@lucifer91299/ui'

<Slider
  label="Volume"
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  step={1}
  showValue
/>

<Slider
  label="Price range"
  value={price}
  onChange={setPrice}
  min={0}
  max={1000}
  step={50}
  valueFormat={(v) => `₹${v.toLocaleString()}`}
  showValue
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number` | Controlled value |
| `onChange` | `(v: number) => void` | |
| `min` / `max` | `number` | Range bounds |
| `step` | `number` | Increment size |
| `showValue` | `boolean` | Show current value above thumb |
| `valueFormat` | `(v: number) => string` | Custom value display (e.g. currency) |

---

### TagInput

Free-text tag entry — press Enter or comma to add, Backspace to remove last, optional `maxTags` limit.

```tsx
import { TagInput } from '@lucifer91299/ui'

<TagInput
  label="Skills"
  value={tags}
  onChange={setTags}
  placeholder="Add a skill…"
  helperText="Press Enter or comma to add"
/>

<TagInput
  label="Keywords"
  value={keywords}
  onChange={setKeywords}
  maxTags={5}
  helperText="Max 5 keywords"
  error={keywords.length === 0 ? 'Add at least one keyword' : undefined}
/>
```

---

### Timeline

Activity feed with dot/icon, 5 colour variants, timestamps, and descriptions.

```tsx
import { Timeline, TimelineItem } from '@lucifer91299/ui'

<Timeline>
  <TimelineItem
    title="Account created"
    description="Welcome to the portal"
    time="2025-01-15 09:00"
    variant="success"   // 'default' | 'primary' | 'success' | 'warning' | 'danger'
  />
  <TimelineItem
    title="Profile updated"
    description="Name and role changed"
    time="2025-01-16 14:30"
    variant="primary"
  />
  <TimelineItem
    title="Password reset"
    time="2025-01-18 11:00"
    variant="warning"
  />
</Timeline>
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
    { key: 'revenue',  name: 'Revenue',  color: '#7c3aed' },
    { key: 'expenses', name: 'Expenses', color: '#e11d48' },
  ]}
  height={240}
  legendTextColor="#444"
/>

<PortalLineChart  data={data} xKey="month" series={[{ key: 'revenue', name: 'Revenue' }]} height={240} legendTextColor="#666" />
<PortalAreaChart  data={data} xKey="month" series={[{ key: 'revenue', name: 'Revenue' }]} height={240} />

{/* DonutChart — fully customisable indication colors */}
<PortalDonutChart
  data={[
    { label: 'Active',   value: 58, color: '#138808' },
    { label: 'Pending',  value: 22, color: '#FF9933' },
    { label: 'Inactive', value: 20, color: '#000080' },
  ]}
  centerLabel="Total"
  centerValue={100}
  centerValueColor="#1a1a1a"
  centerLabelColor="#888"
  legendTextColor="#555"
  height={240}
/>
```

**Chart series color resolution order:**
1. `series[i].color` (or `data[i].color` for DonutChart) — **explicit override**
2. CSS variables `--primary`, `--accent`, `--success` — from your `ThemeProvider`
3. Built-in fallback palette (`#000080`, `#FF9933`, `#138808`, `#6366f1`, …)

**Chart props reference:**

| Prop | Bar | Line | Area | Donut | Description |
|------|:---:|:----:|:----:|:-----:|-------------|
| `height` | ✓ | ✓ | ✓ | ✓ | Chart height in px (default `280`) |
| `showGrid` | ✓ | ✓ | ✓ | — | Show grid lines |
| `showLegend` | ✓ | ✓ | ✓ | ✓ | Show legend |
| `legendTextColor` | ✓ | ✓ | ✓ | ✓ | Legend label text color (default `#555`) |
| `rounded` | ✓ | — | — | — | Rounded bar tops |
| `showDots` | — | ✓ | — | — | Show data dots |
| `curved` | — | ✓ | — | — | Smooth curve |
| `stacked` | — | — | ✓ | — | Stack areas |
| `centerLabel` | — | — | — | ✓ | Text inside donut |
| `centerValue` | — | — | — | ✓ | Number inside donut |
| `centerValueColor` | — | — | — | ✓ | Center value text color (default `#1a1a1a`) |
| `centerLabelColor` | — | — | — | ✓ | Center label text color (default `#888`) |
| `innerRadius` | — | — | — | ✓ | Inner ring radius (default `58%`) |
| `outerRadius` | — | — | — | ✓ | Outer ring radius (default `78%`) |
| `className` | ✓ | ✓ | ✓ | ✓ | CSS class on wrapper div |
| `style` | ✓ | ✓ | ✓ | ✓ | Inline style on wrapper div |

---

### ImageViewer

Full-screen portal overlay for viewing images and PDFs. Supports zoom, rotate, download, keyboard shortcuts, and optional authenticated fetching via `useCredentials`.

```tsx
import { ImageViewer, useImageViewer } from '@lucifer91299/ui'

// Standalone — pass src directly
const [open, setOpen] = useState(false)

<button onClick={() => setOpen(true)}>View photo</button>

<ImageViewer
  src="/uploads/athlete-photo.jpg"
  alt="Athlete photo"
  open={open}
  onClose={() => setOpen(false)}
/>

// Hook — convenient open/close helper
const { open, src, alt, openViewer, closeViewer } = useImageViewer()

<button onClick={() => openViewer('/uploads/cert.pdf', 'Certificate')}>View PDF</button>

<ImageViewer src={src} alt={alt} open={open} onClose={closeViewer} />

// Authenticated fetch — loads image via blob URL using credentials cookie
<ImageViewer
  src="/api/private/photo.jpg"
  alt="Private photo"
  open={open}
  onClose={closeViewer}
  useCredentials
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Image or PDF URL |
| `alt` | `string` | `''` | Alt text / aria-label |
| `open` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called on Escape or backdrop click |
| `useCredentials` | `boolean` | `false` | Fetch via `credentials: 'include'` and display as blob URL |

**Keyboard shortcuts:** `Escape` = close · `+` = zoom in · `-` = zoom out

---

### DropdownMenu

Portal-based action menu triggered by a `MoreVertical` icon (or custom trigger). Auto-flips up/down based on viewport space. Closes on outside click, scroll, resize, and Escape.

```tsx
import { DropdownMenu } from '@lucifer91299/ui'
import { Edit, Trash2, Eye } from 'lucide-react'

<DropdownMenu
  items={[
    { label: 'View',   icon: <Eye className="w-4 h-4" />,    onClick: () => view(row) },
    { label: 'Edit',   icon: <Edit className="w-4 h-4" />,   onClick: () => edit(row) },
    { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: () => del(row),  variant: 'danger' },
  ]}
/>

// Custom trigger
<DropdownMenu
  trigger={<Button size="sm" variant="outline">Actions</Button>}
  items={[
    { label: 'Approve', onClick: approve, variant: 'success' },
    { label: 'Reject',  onClick: reject,  variant: 'danger'  },
  ]}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `items` | `DropdownMenuItem[]` | Menu items array |
| `trigger` | `ReactNode` | Custom trigger element (defaults to `MoreVertical` icon button) |

**`DropdownMenuItem` fields:**

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Menu item text |
| `icon` | `ReactNode` | Optional leading icon |
| `onClick` | `() => void` | Click handler |
| `variant` | `'default' \| 'success' \| 'danger' \| 'warning'` | Color variant |
| `disabled` | `boolean` | Disable the item |

---

### PhoneInput

Country flag picker + international dial code + phone number input. 250+ countries, India pinned at top, auto-formats number for storage as `+<dialCode><nationalNumber>`.

```tsx
import { PhoneInput } from '@lucifer91299/ui'

<PhoneInput
  label="Mobile number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}  // value is '+919876543210'
/>

// Pre-select a country
<PhoneInput
  label="Mobile number"
  defaultCountryIso="US"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

// With error + helper
<PhoneInput
  label="WhatsApp number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  error="Invalid phone number"
  helperText="Include country code"
/>

// Listen for country changes
<PhoneInput
  label="Phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  onCountryChange={(country) => console.log(country.name, country.dialCode)}
/>
```

The `onChange` value is always a full E.164-style string: `+919876543210`. Store this directly; it round-trips safely through `splitPhoneNumber` if you need to display parts separately.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Full phone string e.g. `'+919876543210'` |
| `onChange` | `(e: ChangeEvent) => void` | — | `e.target.value` is the formatted E.164 string |
| `defaultCountryIso` | `string` | `'IN'` | ISO2 code for initial country selection |
| `onCountryChange` | `(country: PhoneCountry) => void` | — | Fires when the user switches country |
| `label` | `string` | — | Field label |
| `error` | `string` | — | Red border + error message |
| `helperText` | `string` | — | Helper text (hidden when error is set) |

**Phone utilities** (also exported directly):

```ts
import { splitPhoneNumber, validatePhoneNumber, formatPhoneForStorage, PHONE_COUNTRIES } from '@lucifer91299/ui'

const { country, nationalNumber } = splitPhoneNumber('+919876543210')
// country.name → 'India', country.dialCode → '+91', nationalNumber → '9876543210'

const ok = validatePhoneNumber('+919876543210')  // true / false
```

---

### ProfilePhotoInput

Square drag-drop photo picker with live preview and remove button. Validates file type and size client-side.

```tsx
import { ProfilePhotoInput } from '@lucifer91299/ui'

const [photo, setPhoto] = useState<File | null>(null)

<ProfilePhotoInput
  value={photo}
  onChange={setPhoto}
/>

// With constraints + error forwarding
<ProfilePhotoInput
  value={photo}
  onChange={setPhoto}
  maxSizeMb={2}
  accept="image/jpeg,image/png"
  error={errors.photo}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `File \| null` | — | Currently selected file |
| `onChange` | `(file: File \| null) => void` | — | Called when file is selected or removed |
| `maxSizeMb` | `number` | `5` | Max file size in MB |
| `accept` | `string` | `'image/jpeg,image/png,image/webp'` | Accepted MIME types |
| `error` | `string` | — | Error message shown below the picker |

---

### AttendanceCalendar

Two-month side-by-side attendance calendar for tracking daily present/absent records. Manages pending (unsaved) changes locally with an amber ring indicator, then flushes them via an `onSave` callback. Supports a "not started" empty state, a "completed" read-only state, a progress bar, and a confirm dialog for completing the period.

```tsx
import { AttendanceCalendar } from '@lucifer91299/ui'
import type { AttendanceRecord } from '@lucifer91299/ui'

// Not started — shows empty state + Start button
<AttendanceCalendar
  status="not_started"
  onStart={async () => {
    await api.startInternship()
    // after this resolves the parent should re-fetch and pass status="active"
  }}
/>

// Active — two-month calendar with attendance marking
<AttendanceCalendar
  status="active"
  startDate="2025-01-15"
  attendanceRecords={records}   // AttendanceRecord[]
  presentDaysCount={42}
  requiredDays={60}
  onSave={async (changes) => {
    // changes: Map<string, 'present' | 'absent' | undefined>
    for (const [date, status] of changes) {
      await api.markAttendance({ date, status })
    }
  }}
  onComplete={async (remark) => {
    await api.completeInternship({ remark })
  }}
/>

// Completed — read-only view with progress
<AttendanceCalendar
  status="completed"
  startDate="2025-01-15"
  completedAt="2025-04-20"
  attendanceRecords={records}
  presentDaysCount={60}
  requiredDays={60}
  notes="Excellent performance throughout the internship."
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'not_started' \| 'active' \| 'completed'` | — | Controls which view is rendered |
| `startDate` | `string` | — | `'YYYY-MM-DD'` — required for active/completed |
| `attendanceRecords` | `AttendanceRecord[]` | `[]` | Saved records from the server |
| `presentDaysCount` | `number` | `0` | Count shown in the progress bar |
| `requiredDays` | `number` | `60` | Target days for completion |
| `completedAt` | `string` | — | `'YYYY-MM-DD'` — shown when completed |
| `notes` | `string` | — | Admin notes shown below the calendar |
| `onSave` | `(changes: Map<string, 'present' \| 'absent' \| undefined>) => Promise<void>` | — | Save pending changes; component shows loading state until promise resolves |
| `onComplete` | `(remark?: string) => Promise<void>` | — | Confirm-complete callback |
| `onStart` | `() => Promise<void>` | — | Start button callback (not_started state only) |

**Day click cycle:** unmarked → present (✓ green) → absent (✕ red) → unmarked. Days before `startDate` or in the future are non-interactive. All clicks accumulate as pending changes (amber ring) until the user clicks **Save Attendance**.

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
  poweredBy={{ logoSrc: '/brand/powered-by.svg', text: 'Powered by STSPL', href: 'https://xyz.com' }}
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

Responsive layout supporting four sidebar variants. Handles navigation, user info, logout, and mobile drawer automatically.

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
      sidebar="full"   // 'full' | 'rail' | 'both' | 'header'
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
| `full` | Wide sidebar with group headings, nav labels, and collapsible sections |
| `rail` | Icon-only narrow sidebar |
| `both` | Full on desktop, rail on mobile/tablet |
| `header` | Horizontal top nav bar — see [HeaderNav](#headernav) |

> `icon` and `groupIcon` accept **pre-rendered JSX** (`ReactNode`), not component types. Always pass `<Icon className="w-4 h-4" />`, not `Icon`.

---

### HeaderNav

Horizontal top navigation bar — logo + brand name, scrollable pill links, dropdown groups, a profile menu, and an optional settings gear icon. Used automatically when `sidebar="header"` is passed to `DashboardLayout`.

Now matches the **sales frontend** style: gradient background, `TricolorBar shimmer` at the **bottom** of the bar, `rounded-full` nav pills, polished profile button with name + role visible.

```tsx
import { HeaderNav } from '@lucifer91299/ui'

<HeaderNav
  navGroups={navGroups}
  projectName="My Portal"
  logoSrc="/brand/logo.svg"
  user={{ name: 'Admin User', role: 'Admin' }}
  pathname={pathname}
  onLogout={logout}
  configHref="/dashboard/settings"  // optional — shows settings gear icon
  configLabel="Settings"
/>
```

**Layout behaviour:**
- **Desktop** (`lg+`): Logo | brand name | divider | scrollable pill links (groups with one item → direct pill; groups with multiple items → dropdown button with portaled menu) | profile avatar + dropdown
- **Mobile** (`< lg`): Compact top bar with hamburger → slide-in drawer with collapsible group sections

**`NavGroup` and `NavItem` types:**

```ts
type NavItem = {
  label: string
  href: string
  icon?: ReactNode        // pre-rendered JSX, e.g. <LayoutDashboard className="w-4 h-4" />
}

type NavGroup = {
  heading?: string
  groupIcon?: ReactNode   // pre-rendered JSX
  items: NavItem[]
}
```

---

### Combobox

Free-text input with a filtered suggestion dropdown. The user can type freely (autocomplete) or pick from the filtered list.

```tsx
import { Combobox } from '@lucifer91299/ui'

const [sport, setSport] = useState('')

<Combobox
  label="Sport"
  value={sport}
  onChange={setSport}
  placeholder="Type or select…"
  options={[
    { value: 'shooting',  label: 'Shooting' },
    { value: 'archery',   label: 'Archery' },
    { value: 'boxing',    label: 'Boxing' },
    { value: 'wrestling', label: 'Wrestling' },
  ]}
  helperText="Type to filter or enter a custom value"
/>

{/* With error */}
<Combobox
  label="Category"
  value={cat}
  onChange={setCat}
  options={options}
  error
  errorText="This field is required"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Current text (free text or selected label) |
| `onChange` | `(v: string) => void` | — | Called on every keystroke or option click |
| `options` | `ComboboxOption[]` | — | `{ value, label, disabled? }` |
| `label` | `string` | — | Field label |
| `placeholder` | `string` | `'Type or select…'` | |
| `error` | `boolean` | `false` | Red border |
| `errorText` | `string` | — | Error message below |
| `helperText` | `string` | — | Helper text (hidden when errorText is set) |
| `maxDropdownHeight` | `number` | `260` | Max px height of dropdown list |

---

### ConfirmModal

Opinionated confirm dialog with 4 variants, multi-line message support, optional summary table, and a loading state on the confirm button.

```tsx
import { ConfirmModal } from '@lucifer91299/ui'

const [open, setOpen] = useState(false)

<Button variant="danger" onClick={() => setOpen(true)}>Delete</Button>

<ConfirmModal
  isOpen={open}
  onClose={() => setOpen(false)}
  onConfirm={async () => { await deleteRecord(); setOpen(false) }}
  variant="danger"         // 'danger' | 'warning' | 'info' | 'success'
  title="Delete record?"
  message={[
    'This action cannot be undone.',
    '• All associated data will be removed.',
  ]}
  confirmText="Delete"
  cancelText="Cancel"
  isLoading={deleting}
/>

{/* With optional summary table */}
<ConfirmModal
  isOpen={open}
  onClose={() => setOpen(false)}
  onConfirm={confirm}
  variant="warning"
  title="Process renewal?"
  message="The following members will be renewed:"
  tableData={{
    headers: ['Member', 'Fee'],
    rows: [['Priya Mehta', '₹2,500'], ['Arjun Sharma', '₹2,500']],
  }}
  confirmText="Proceed"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Backdrop click / cancel button |
| `onConfirm` | `() => void` | — | Confirm button click |
| `variant` | `'danger' \| 'warning' \| 'info' \| 'success'` | `'warning'` | Icon + confirm button colour |
| `title` | `string` | — | Modal heading |
| `message` | `string \| string[]` | — | Body text. Array items separated by lines; items starting with `•` are indented |
| `tableData` | `{ headers: string[], rows: (string\|number)[][] }` | — | Optional summary table below message |
| `confirmText` | `string` | `'Confirm'` | |
| `cancelText` | `string` | `'Cancel'` | |
| `isLoading` | `boolean` | `false` | Shows spinner + "Processing…" on confirm button |

---

### AlertModal

Single-button acknowledgment dialog. Use when no cancel action is needed — just an "Okay" to dismiss.

```tsx
import { AlertModal } from '@lucifer91299/ui'

<AlertModal
  isOpen={alertOpen}
  onClose={() => setAlertOpen(false)}
  variant="error"   // 'error' | 'warning' | 'info' | 'success'
  title="Something went wrong"
  message="The server returned a 500 error. Please try again later."
/>

{/* Multi-line message */}
<AlertModal
  isOpen={alertOpen}
  onClose={() => setAlertOpen(false)}
  variant="success"
  title="Done!"
  message={['Your changes have been saved.', 'An email confirmation has been sent.']}
  okText="Got it"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Dismiss / backdrop click |
| `variant` | `'error' \| 'warning' \| 'info' \| 'success'` | `'info'` | Icon + button colour |
| `title` | `string` | — | Modal heading |
| `message` | `string \| string[]` | — | Body text |
| `okText` | `string` | `'Okay'` | Dismiss button label |

---

### DashboardFullPage

Full-bleed gradient surface for add / edit / detail flows. Bleeds edge-to-edge inside the dashboard content area.

```tsx
import { DashboardFullPage, dashboardFullPageSurfaceClass } from '@lucifer91299/ui'

{/* Component */}
<DashboardFullPage>
  <PageShell title="Add Product" actions={<Button>Save</Button>} />
  {/* form content */}
</DashboardFullPage>

{/* Class string — apply to an existing element */}
<div className={dashboardFullPageSurfaceClass}>
  ...
</div>
```

The component applies `-mx-6 -mt-6` bleed, a subtle `bg-gradient-to-b from-[#eceef2] via-[#e6e8ed] to-[#eef0f4]` background, and `min-h-[calc(100dvh-3.5rem)]` so it fills the viewport.

---

### LanguageSwitcher

Generic i18n dropdown. Accepts any list of language options and fires `onChange` with the selected code. Framework-agnostic — wire it to any i18n library.

```tsx
import { LanguageSwitcher } from '@lucifer91299/ui'

const [lang, setLang] = useState('en')

<LanguageSwitcher
  options={[
    { code: 'en', label: 'English',  shortLabel: 'EN' },
    { code: 'hi', label: 'हिन्दी',   shortLabel: 'HI', nativeLabel: 'हिन्दी' },
    { code: 'mr', label: 'Marathi',  shortLabel: 'MR', nativeLabel: 'मराठी' },
  ]}
  value={lang}
  onChange={setLang}
/>

{/* Compact icon-only */}
<LanguageSwitcher options={options} value={lang} onChange={setLang} size="sm" />

{/* For dark headers/footers */}
<LanguageSwitcher options={options} value={lang} onChange={setLang} onDark />

{/* Open upwards (footer placement) */}
<LanguageSwitcher options={options} value={lang} onChange={setLang} dropUp />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `LanguageOption[]` | EN + HI | `{ code, label, shortLabel?, nativeLabel? }` |
| `value` | `string` | — | Active language code |
| `onChange` | `(code: string) => void` | — | |
| `size` | `'sm' \| 'md'` | `'md'` | `sm` = icon-only, `md` = shortLabel + chevron |
| `onDark` | `boolean` | `false` | Lighter text/hover for dark backgrounds |
| `dropUp` | `boolean` | `false` | Open menu upward (for footer placement) |

---

### Layout Primitives

Smaller building-block components you can use inside or outside the dashboard layout.

```tsx
import {
  BrandLogo,
  TricolorBar,
  SocialLinks,
  PoweredBy,
  PageShell,
  PageFooter,
} from '@lucifer91299/ui'

{/* Logo — sizes: 'sm' (32px) | 'md' (48px) | 'lg' (64px) | 'xl' (80px) */}
<BrandLogo src="/brand/logo.svg" alt="My Portal" size="xl" className="rounded-xl" />

{/* One-time left-to-right entrance sweep */}
<TricolorBar animated height={4} />

{/* Continuous infinite shimmer (matches admin frontend style) */}
<TricolorBar shimmer height={3} />

{/* Override colors */}
<TricolorBar colors={['#e11d48', '#ffffff', '#2563eb']} height={3} />

{/* Shimmer with custom colors */}
<TricolorBar shimmer colors={['#e11d48', '#ffffff', '#2563eb']} height={4} />

{/* Social media links row */}
<SocialLinks
  links={[
    { icon: <Instagram className="w-4 h-4" />, href: 'https://instagram.com/...', label: 'Instagram' },
  ]}
  className="gap-4"
/>

{/* "Powered by" fixed badge */}
<PoweredBy logoSrc="/brand/powered-by.svg" text="Powered by" href="https://xyz.com" />

{/* Page title + subtitle + actions area */}
<PageShell
  title="Athletes"
  subtitle="Manage registered athletes"
  actions={<Button>Add Athlete</Button>}
  breadcrumbs={<Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Athletes' }]} />}
/>

{/* Footer with org name, logo, and social links */}
<PageFooter
  organizationName="My Portal"
  logoSrc="/brand/logo.svg"
  poweredByText="Powered by"
  poweredByLogoSrc="/brand/powered-by.svg"
  poweredByHref="https://xyz.com"
/>
```

| Component | Key props |
|-----------|-----------|
| `BrandLogo` | `src`, `alt`, `size` (`sm`/`md`/`lg`/`xl`), `className`, `style` |
| `TricolorBar` | `colors`, `animated`, `shimmer`, `height`, `className`, `style` |
| `SocialLinks` | `links` (`{ icon, href, label }`), `className`, `style` |
| `PoweredBy` | `logoSrc`, `text`, `href`, `className`, `style` |
| `PageShell` | `title`, `subtitle`, `actions`, `controls`, `breadcrumbs`, `backButton`, `className`, `style` |
| `PageFooter` | `organizationName`, `logoSrc`, `poweredByText`, `poweredByLogoSrc`, `poweredByHref`, `socialLinks`, `className`, `style` |
| `Separator` | `orientation` (`horizontal`/`vertical`), `label`, `className`, `style` |
| `Stepper` | `steps`, `current`, `orientation` (`horizontal`/`vertical`), `className`, `style` |
| `Timeline` | `items` (`{ title, description?, timestamp?, icon?, variant? }`), `className`, `style` |

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
  sidebar:          'full',      // 'full' | 'rail' | 'both' | 'header'
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

### v1.1.54
- **Button** — added `secondary`, `gray`, `plain` variants (sales-frontend parity)
- **HeaderNav** — exported as a standalone component (`import { HeaderNav } from '@lucifer91299/ui'`)
- **Fix** — `groupIcon` rendered as ReactNode correctly (was accidentally typed as component)

### v1.1.53

**New components (sales frontend parity):**

- **`PageLoader`** — full-screen centered loading state with dual-ring spinner + label. Exported alongside `LoadingSpinner`.
- **`LoadingSpinner` — `variant` prop** — new `variant="dual"` (primary outer ring + accent inner ring, reverse spin) and `variant="white"` (for dark backgrounds). Original single-ring is `variant="default"`.
- **`Combobox`** — free-text input with a portal-positioned filtered suggestion dropdown. Supports `label`, `error`, `errorText`, `helperText`, `disabled`, `maxDropdownHeight`.
- **`ConfirmModal`** — opinionated confirm dialog with `danger`/`warning`/`info`/`success` variants, multi-line message, optional `tableData` summary, and `isLoading` state on confirm button.
- **`AlertModal`** — single-button acknowledgment dialog. Same 4 variants; `okText` prop.
- **`TableSkeleton`** — configurable rows × cols skeleton table.
- **`GridSkeleton`** — responsive grid of card skeletons.
- **`ProfileSkeleton`** — avatar + info + 6-cell detail grid layout.
- **`SettingsSkeleton`** — sidebar tabs + wide content panel layout.
- **`DashboardFullPage`** — full-bleed gradient surface (`-mx-6 -mt-6`) for add/edit/detail flows. Also exports `dashboardFullPageSurfaceClass` string.
- **`LanguageSwitcher`** — generic i18n dropdown with `options`, `size` (`sm`/`md`), `onDark`, `dropUp` props.

**Updates:**

- **`Badge`** — added `expired`, `dead`, `navy`, `saffron`, `green` variants (parity with sales frontend status system).
- **`Card`** — added `hoverable` prop: cursor-pointer + hover lift + primary-color border highlight.
- **`HeaderNav`** — redesigned to match sales frontend: gradient background, `TricolorBar shimmer` moved to **bottom** of bar, `rounded-full` nav pills, polished profile button with name+role, optional `configHref`/`configLabel` settings gear icon.
- **All `TricolorBar` usages inside the library** (`Sidebar`, `HeaderNav`, `DashboardLayout`, `SidebarRail`, `LoginCard`) updated to include `shimmer` prop.

### v1.1.44

- **`TricolorBar` — `shimmer` prop**: new `shimmer?: boolean` prop adds a continuous infinite shimmer animation where the background-position slides slowly across the bar (60 s, ease-in-out, infinite). Resolved theme colors are passed as `--tc1`/`--tc2`/`--tc3` CSS custom properties to a `::before` pseudo-element so the animation respects the active theme. Works alongside custom `colors`. `animated` (one-time entrance sweep) and `shimmer` (infinite loop) are independent — pass whichever variant suits the context. CSS keyframe `tricolorShimmer` added to both `globals.css` and `dist/styles/components.css`.

### v1.1.33

- **`NotificationBell` — new component**: animated bell button with unread count badge (spring-pop animation), framer-motion dropdown panel, per-item mark-as-read (✓ button), mark-all-read, and a "View all" footer link. Notification items support `type` (`info` / `success` / `warning` / `error`) with matching icon and dot colours, optional `avatar` image, `href` for linked notifications, and relative time via `date-fns`. Empty state shown when the list is empty. Props: `notifications`, `onMarkRead`, `onMarkAllRead`, `onNotificationClick`, `onViewAll`, `emptyMessage`, `title`, `maxVisible`, `className`. Exported as `NotificationBell`, `NotificationBellProps`, `NotificationItem`, `NotificationType`.
- **`LoginPage` — dynamic ambient colors + logo fix**: new `ambientColors` prop (`[AmbientColor, AmbientColor, AmbientColor]`) lets callers override the three background glow blob colors (defaults to saffron / green / navy tricolor palette). New `backgroundGradient` prop overrides the default parchment gradient. New `logoSize` prop (default `56`) replaces the invalid `h-30 w-30` Tailwind class (those utility classes don't exist in Tailwind's default scale). Logo glow tracks the first ambient color. `AmbientColor` (`[number, number, number]` RGB tuple), `LoginRole`, and `RegistrationLink` are now exported from the package. The role-select splash also accepts and forwards the new ambient / gradient props.

### v1.1.32

- **`DataTable` — matches C&J frontend exactly**: outer card uses `border-gray-200 shadow-sm`; header row uses `bg-gray-50` (was `bg-surface-secondary/60` tint); header cells use `font-medium text-gray-500 px-4` (was `font-semibold text-label-tertiary px-3`); data cells use `text-gray-900 px-4` and `col.style` (was incorrectly applying the root `style` prop to every cell); row dividers changed from `border-separator-opaque/40` → `border-gray-100`; row hover changed from `hover:bg-surface-secondary` → `hover:bg-gray-50`; search input uses `border-gray-200 bg-gray-50`; pagination bar uses `border-gray-200 bg-gray-50/50`; skeleton rows use `border-gray-100`.
- **`NumberInput` — big-number + mobile responsive**: input width changed from `w-16` (64 px) to `flex-1 sm:w-28` (112 px on ≥sm). Container changed from `w-fit` to `w-full max-w-xs sm:w-fit` so it fills available space on mobile without overflowing. Input and buttons both `h-9` for consistent alignment.
- **`StatsCard` — mobile responsive**: layout changed from stacked icon-then-text to `flex justify-between` with icon floated right. Value font scales: `text-xl sm:text-2xl lg:text-3xl`; value uses `break-all` to prevent overflow. Padding `p-4 sm:p-5`. Title and subtitle truncate on narrow columns. Trend row wraps on small screens. Card gets `min-w-0` to participate in CSS grid correctly. Border changed from `border-gray-200/80` → `border-gray-200`.

### v1.1.31

- **`DashboardLayout` — breadcrumbs in header + animation**: desktop header bar now accepts three new props: `breadcrumbs?: BreadcrumbItem[]`, `breadcrumbHomeHref?: string`, `breadcrumbHomeLabel?: string`. When provided, breadcrumbs render on the left side of the header card; the profile menu stays on the right. Header card structure updated to match the C&J frontend exactly — `bg-white rounded-2xl border border-gray-200 shadow-sm`; the tricolor bar is wrapped in its own `overflow-hidden rounded-t-2xl` div so it clips to card corners without clipping the profile dropdown. Header card slides in on mount via `animate-in fade-in slide-in-from-top-2 duration-300 ease-out`. Scaffold template (`genDashboardLayout`) auto-derives breadcrumbs from pathname segments.

### v1.1.30

- **`DateTimePicker` — clock hand fix**: clock hand and selection circle now render correctly in 24h mode (previously `display12H` was passing raw 0–23 values that didn't match the 1–12 item array, so `indexOf` returned -1 and no hand was drawn). Fixed by always converting to 12h display and using `ampm` state for AM/PM both in 12h and 24h modes. AM/PM toggle now also visible in clock mode for 24h pickers. Selected hour number now shows white text (was `transparent`, making it invisible on the primary-coloured selection circle).
- **`AttendanceCalendar` — cell UX**: active unmarked days now render white with a border (`bg-white border border-separator-opaque`) instead of `bg-surface-tertiary` (which looked identical to blocked days). Blocked/future/pre-start days get `opacity-60` to visually de-emphasise them. Day cell content simplified to the date number only — background colour (green = present, red = absent, white = unmarked, grey = blocked) communicates status clearly without cramped 8 px two-line text. Removed stray `bg-primary` class from the Start Internship button (style attribute already provides the colour).
- **`OTPInput` — 6-digit mobile layout**: box widths and heights are now responsive (`w-10 h-11 sm:w-11 sm:h-14`) and the gap shrinks on mobile (`gap-1.5 sm:gap-2.5`). Six boxes on a 320 px screen: 6 × 40 + 5 × 6 = 270 px — no longer overflows. Removed the fixed `style={{ height: 52 }}` override.

### v1.1.29

- **`DateTimePicker` — clock-face time picker**: replaced the ▲/▼ spinner with a Material-style circular clock. Hour view shown first (1–12 around the face), clicking a number auto-advances to the minute view. Active hour/minute shown as highlighted pill at the top. AM/PM stacked toggle for 12h mode. Toggle icon (keyboard ↔ clock) switches to text-input spinner mode. Popup widened to `w-80`.
- **`DataTable` — card wrapper**: the table is now wrapped in a `rounded-2xl border overflow-hidden bg-white` card. Header cells use `uppercase tracking-wider text-[11px]` and lighter background. Row borders subtler.
- **`DashboardLayout` header** — fixed dropdown clipping: removed `overflow-hidden` from header card; `TricolorBar` gets `rounded-t-2xl`; dropdown `z-[60]`.
- **`Tabs` — fade animation + icon support**: `TabsContent` fades in (`animate-in fade-in-0 duration-200`) when active. New `animation` prop (`'fade'` | `'none'`). `TabsTrigger` accepts `icon?: ReactNode` rendered before the label.
- **`Stepper` — navigation buttons**: new optional props `onNext`, `onBack`, `onSubmit`, `submitLabel`, `nextLabel`, `backLabel`, `isSubmitting` render a Back/Next/Submit button row below the step track. Submit button appears dynamically on the last step with a loading spinner when `isSubmitting` is true.
- **Showcase** — updated `create-portal-app` templates: version bumped to `^1.1.28`; added showcase sections for `PhoneInput`, `ProfilePhotoInput`, `DropdownMenu`, `AttendanceCalendar`; Stepper uses built-in nav buttons; Tabs show icon usage.

### v1.1.28

- **`AttendanceCalendar`** — two-month side-by-side calendar for tracking daily present/absent records; local pending-change state with amber ring indicator; `onSave` / `onComplete` / `onStart` async callbacks; progress bar + required-days counter; confirm dialog for completing; `not_started` empty state; read-only `completed` mode; fully responsive (single-month on mobile)
- **`DashboardLayout` header** — redesigned from a flush full-width bar to a padded rounded card (`rounded-2xl` with `border shadow-sm`) with a `TricolorBar` stripe at the top, matching the C&J frontend header style

### v1.1.27

- **`ImageViewer` + `useImageViewer`** — full-screen portal overlay for images and PDFs with zoom, rotate, download, keyboard shortcuts (`Escape`, `+`, `-`), and `useCredentials` prop for authenticated blob-URL fetching
- **`DropdownMenu`** — portal-based action menu triggered by `MoreVertical` icon or a custom trigger; auto-flips up/down based on viewport, four item variants (`default`, `success`, `danger`, `warning`), closes on outside click/scroll/Escape
- **`PhoneInput`** — international phone number field with 250+ country flags, dial code picker (India pinned at top), E.164 output format, `onCountryChange` callback
- **`ProfilePhotoInput`** — square drag-drop photo picker with live preview, remove button, max-size and MIME-type validation
- **Phone utilities exported** — `PHONE_COUNTRIES`, `DEFAULT_PHONE_COUNTRY`, `splitPhoneNumber`, `formatPhoneForStorage`, `validatePhoneNumber`, `getCountryFlag` and `PhoneCountry` type all available as top-level exports
- **Sidebar collapse button** — replaced header-bar toggle with a floating circle button fixed at the sidebar's right edge (matches C&J frontend pattern); uses `ChevronsLeft` / `ChevronsRight` icons, animates left position between collapsed (`60px`) and expanded (`276px`) states
- **Sidebar logo** — removed `ring-2` border and tinted background from the logo container in both the desktop sidebar and mobile top bar

### v1.1.26

- **Universal `className` + `style` props** — every public component now accepts both `className?: string` and `style?: React.CSSProperties`. Existing `inline style` objects (e.g. box-shadow in `Dialog`, transform in `Drawer`, background in `Avatar`) are merged via `{ ...defaultStyle, ...style }` so consumer styles override without losing animation or defaults
- **Chart legend & indicator colors fully customisable**
  - `PortalBarChart`, `PortalLineChart`, `PortalAreaChart` — new `legendTextColor` prop (default `#555`)
  - `PortalDonutChart` — new `legendTextColor`, `centerValueColor` (default `#1a1a1a`), and `centerLabelColor` (default `#888`) props
  - Series/slice colors use: `series[i].color` → CSS `--primary`/`--accent`/`--success` → built-in palette
- **`LoginPage`** — login page logo bumped from `h-12 w-12` (48 px) to `h-20 w-20` (80 px); glow bloom enlarged to match
- **`RoleSelectSplash`** — added `className` + `style` props
- **`HeaderNav`** — added `className` + `style` props (applied to desktop sticky `<header>`)
- **README** — new [Styling Components](#styling-components) section with full coverage table, CSS variable override examples, and expanded [Charts](#charts) props reference; new [Layout Primitives](#layout-primitives) section

### v1.1.25
- **Logo sizes increased** — `LoginHeader` bumped to `xl` (80 px); `Sidebar` expanded header container `w-14 h-14` with `size="lg"`, mobile top bar `w-10 h-10` with `size="md"`; `HeaderNav` desktop, mobile top bar, and mobile drawer all bumped from `sm` (32 px) to `md` (48 px)

### v1.1.23
- **`jwtMiddleware`** — new `redirectAuthenticatedTo` option: authenticated users who land on `loginPath` are automatically redirected to this path (or the `?redirect=` query param when present). Eliminates the need for manual wrapper logic in `proxy.ts`
- **`multiRoleMiddleware`** — same `redirectAuthenticatedTo` support as `jwtMiddleware`
- **`ToastProvider`** — fixed hydration mismatch caused by `typeof document !== 'undefined'` guard; portal now renders after mount via `useEffect` so server and client HTML always match

### v1.1.22
- **`NumberInput` redesign** — replaced wide single-pill layout with three separate compact elements: `−` button | value input | `+` button. Buttons are 32×32 px rounded squares with independent border, background, and hover states. Input is a fixed-width `64px` bordered field. Label now uses `text-subhead` to match all other form components. Component uses `w-fit` so it never stretches to fill the container

### v1.1.21
- **`Input` password toggle** — `type="password"` now automatically renders an Eye / EyeOff visibility button inside the input. No extra props required; works in all existing password fields

### v1.1.20
- **`HeaderNav`** — new horizontal top nav bar component for `sidebar="header"` layout: logo + brand, scrollable pill links, portaled dropdown groups, mobile hamburger drawer
- **`Drawer` animation** — smooth slide-in/out transitions (translate + opacity, 280 ms cubic-bezier ease) on both open and close
- **`SidebarVariant`** extended — `'full' | 'rail' | 'both' | 'header'`; `DashboardLayout` renders `HeaderNav` when `sidebar="header"`

### v1.1.19
- **`Drawer`** — side-panel overlay (left/right, sm/md/lg/full sizes, header, footer, Escape-to-close)
- **`OTPInput`** — 4 or 6-digit code boxes with auto-advance, backspace nav, paste support, error state
- **`NumberInput`** — +/− stepper input with min/max/step, controlled/uncontrolled, error state
- **`Slider`** — range slider with track fill, custom thumb, `valueFormat`, `showValue`, min/max labels
- **`TagInput`** — free-text tag entry (Enter/comma to add, Backspace to remove last, maxTags limit)
- **`Timeline`** — activity feed with dot/icon, 5 colour variants, timestamps, descriptions
- **`Popover`** — click-triggered floating panel, 4 placements, outside-click dismiss

### v1.1.17
- **`StatsCard`** — KPI metric card with value, subtitle, trend indicator (up/down/flat), icon slot, 5 colour variants
- **`EmptyState`** — zero-data placeholder with icon, title, description, and optional action button
- **`FileUpload`** — drag-and-drop file picker with size validation, file list with remove, accept filter, error state

### v1.1.16
- **`Switch`** — added `error` prop: red toggle track, red label, error message below (matching Checkbox / RadioGroup behaviour)
- **All form components** now consistently support `error` prop: `Input`, `Textarea`, `Select`, `DatePicker`, `DateTimePicker`, `Switch`, `Checkbox`, `RadioGroup`

### v1.1.15
- **`DateTimePicker`** — new component combining the full DatePicker calendar with a time spinner (12h/24h, minuteStep, showSeconds, Now button). All DatePicker constraints work identically
- **`Select` rewrite** — proper multiselect with pill tags, select-all, Done button, grouped options, round dropdown
- **`DatePicker`** — uncontrolled mode, improved disabled-date styling, `excludeDates` for specific date blocking
- **`DataTable`** — fixed `setState`-in-render crash; added pagination, selectable rows
- **`RadioGroup`** — removed blue focus ring outline on selected option
- **`DonutChart`** — accepts both `name` and `label` fields in `DonutSlice`
- **Auth middleware** — fixed Edge Runtime crash with static `import { NextResponse }`

### v1.0.7
- Removed `PageFooter` from `DashboardLayout` wrapper
- Redesigned components showcase with stats cards, all Badge variants, live DataTable

### v1.0.6
- Added `DataTable`, `StatusBadge`, `ActionButtons`, `Select`, `PageShell`, `Breadcrumbs`, `PageFooter`
- Improved `Input`: `labelRight`, `suffix`, required asterisk

### v1.0.1
- Initial public release
