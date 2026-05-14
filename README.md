# `@nexportal/ui` + `create-portal-app`

Generic portal UI SDK — components, design system, auth hooks, and a project scaffolder for Next.js.

---

## Quick Start (new project)

```bash
npx create-portal-app my-portal
cd my-portal
npm install
npm run dev
```

Answer the CLI prompts → get a running Next.js 15 authenticated portal in under 2 minutes.

---

## Quick Start (existing project)

```bash
npm install @nexportal/ui
```

**`tailwind.config.ts`**
```ts
import preset from '@nrai/ui/tailwind/preset'
export default {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
}
```

**`src/app/globals.css`**
```css
@import '@nrai/ui/styles/globals.css';
```

**`theme.config.ts`**
```ts
import { createTheme } from '@nrai/ui'
export default createTheme({
  primary: '#000080',
  accent:  '#FF9933',
  success: '#138808',
  projectName: 'My Portal',
  logoSrc: '/brand/logo.svg',
  sidebar: 'full',
  loginStyle: 'animated',
})
```

**`src/app/layout.tsx`**
```tsx
import { ThemeProvider } from '@nrai/ui'
import theme from '@/theme.config'

export default function RootLayout({ children }) {
  return (
    <html><body>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </body></html>
  )
}
```

---

## Login Pages

### Animated (Sale style — orbs + particles + tricolor)

```tsx
import { LoginPage } from '@nrai/ui'

<LoginPage
  projectName="My Portal"
  logoSrc="/brand/logo.svg"
  onSubmit={async ({ identifier, password }) => { /* call your API */ }}
  isLoading={false}
  error={null}
  forgotPasswordHref="/forgot-password"
  poweredBy={{ logoSrc: '/brand/powered-by.svg', text: 'Powered by', href: 'https://example.com' }}
/>
```

### Simple (C&J style — clean gradient card)

```tsx
import { LoginPageSimple, RoleSelectSplash } from '@nrai/ui'
import { User, Shield } from 'lucide-react'

<LoginPageSimple
  projectName="My Portal"
  logoSrc="/brand/logo.svg"
  onSubmit={async ({ email, password }) => {
    const data = await login(email, password)
    return { role: data.role }  // return 'both' to show RoleSelectSplash
  }}
  isLoading={false}
  error={null}
  roles={[
    { key: 'coach', label: 'Continue as Coach', description: 'Coach dashboard', icon: <User /> },
    { key: 'judge', label: 'Continue as Judge', description: 'Judge dashboard', icon: <Shield /> },
  ]}
  onRoleSelect={(role) => router.push(`/dashboard/${role}`)}
/>
```

---

## Dashboard Layout

```tsx
import { DashboardLayout } from '@nrai/ui'
import { LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navGroups = [{
  heading: 'Main',
  groupIcon: <LayoutDashboard className="w-3.5 h-3.5" />,
  items: [{ label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }],
}]

export default function Layout({ children }) {
  const pathname = usePathname()
  return (
    <DashboardLayout
      navGroups={navGroups}
      sidebar="full"      // 'full' | 'rail' | 'both'
      projectName="My Portal"
      logoSrc="/brand/logo.svg"
      user={{ name: 'John', role: 'Admin' }}
      pathname={pathname}
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  )
}
```

---

## Auth — JWT mode

```ts
// src/middleware.ts
import { jwtMiddleware } from '@nrai/ui'
export default jwtMiddleware({
  cookieName: 'access_token',
  jwtSecret: process.env.JWT_SECRET!,
  protectedPaths: ['/dashboard'],
  loginPath: '/login',
})
export const config = { matcher: ['/((?!_next|public).*)'] }

// src/app/api/auth/session/route.ts
import { sessionRoute } from '@nrai/ui'
export const { POST, DELETE } = sessionRoute({ cookieName: 'access_token' })

// src/app/api/auth/logout/route.ts
import { logoutRoute } from '@nrai/ui'
export const { POST } = logoutRoute({ cookieName: 'access_token' })

// In a component
import { useJwtAuth } from '@nrai/ui'
const { user, authenticated, loading, logout } = useJwtAuth()
```

## Auth — Multi-role mode

```ts
// src/middleware.ts
import { multiRoleMiddleware } from '@nrai/ui'
export default multiRoleMiddleware({
  roles: ['coach', 'judge'],
  cookiePrefix: 'portal_',   // cookies: portal_coach_token, portal_judge_token
  protectedPaths: ['/dashboard'],
})

// In a component
import { useMultiRoleAuth } from '@nrai/ui'
const { activeRoles, currentRole, selectRole } = useMultiRoleAuth({
  roles: ['coach', 'judge'],
  cookiePrefix: 'portal_',
})
```

## Auth — Laravel session mode

```ts
// In a component
import { useLaravelSessionAuth } from '@nrai/ui'
const { user, authenticated, logout } = useLaravelSessionAuth({
  laravelUrl: process.env.NEXT_PUBLIC_LARAVEL_URL!,
})
```

---

## Design Tokens (Tailwind classes)

| Category | Classes |
|---------|---------|
| Brand   | `bg-primary` `text-primary` `bg-accent` `bg-success` `bg-primary-soft` |
| Surface | `bg-surface-primary` `bg-surface-secondary` `bg-surface-tertiary` |
| Text    | `text-label-primary` `text-label-secondary` `text-label-tertiary` |
| Type    | `text-display` `text-title1` `text-title2` `text-body` `text-callout` `text-subhead` `text-footnote` |
| Radius  | `rounded-sm`(8px) `rounded`(12px) `rounded-md`(14px) `rounded-lg`(16px) `rounded-xl`(20px) `rounded-2xl`(28px) |
| Shadow  | `shadow-sm` `shadow` `shadow-md` `shadow-lg` `shadow-xl` |

---

## Built-in Themes

```ts
import { builtInThemes } from '@nrai/ui'

// default  — navy / saffron / green (institutional)
// dark     — indigo / amber / emerald (modern SaaS)
// minimal  — slate / blue / green (clean corporate)

createTheme({ ...builtInThemes.dark, projectName: 'My App' })
```

---

## Package Locations

```
packages/
├── ui/                 @nrai/ui — component library
└── create-portal-app/  create-portal-app — CLI scaffolder
```
