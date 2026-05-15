export interface ScaffoldOptions {
  projectName: string
  projectDescription: string
  authMode: 'jwt' | 'multi-role' | 'laravel'
  loginStyle: 'animated' | 'simple'
  sidebarStyle: 'full' | 'rail' | 'both' | 'header'
  primaryColor: string
  accentColor: string
  successColor: string
  brandLogoPath: string
  /** Path to local @lucifer91299/ui for development (uses file: reference instead of registry) */
  localUiPath?: string
  apiUrl?: string
  jwtCookieName?: string
  jwtSecret?: string
  roles?: string[]
  laravelUrl?: string
  dbHost?: string
  dbPort?: string
  dbName?: string
  dbUser?: string
  dbPassword?: string
  includeI18n: boolean
  stateManagement: 'redux-query' | 'query-only'
  packageManager: 'npm' | 'pnpm' | 'yarn'
}

export function genPackageJson(o: ScaffoldOptions): string {
  const deps: Record<string, string> = {
    '@lucifer91299/ui': o.localUiPath ? `file:${o.localUiPath}` : '^1.1.19',
    'next': '^16.2.6',
    'react': '^19.0.0',
    'react-dom': '^19.0.0',
    'framer-motion': '^12.0.0',
    'recharts': '^3.8.1',
    'axios': '^1.7.9',
    '@tanstack/react-query': '^5.64.1',
    'jose': '^5.9.6',
    'clsx': '^2.1.1',
    'tailwind-merge': '^2.5.5',
    'lucide-react': '^0.469.0',
  }

  if (o.stateManagement === 'redux-query') {
    deps['@reduxjs/toolkit'] = '^2.5.0'
    deps['react-redux'] = '^9.2.0'
  }
  if (o.authMode === 'laravel') {
    deps['laravel-session-sdk'] = '^1.4.9'
  }
  if (o.includeI18n) {
    deps['next-intl'] = '^3.26.3'
  }

  const devDeps: Record<string, string> = {
    'typescript': '^5.7.3',
    '@types/node': '^22.10.7',
    '@types/react': '^19.0.7',
    '@types/react-dom': '^19.0.3',
    'tailwindcss': '^3.4.17',
    'postcss': '^8.4.49',
    'autoprefixer': '^10.4.20',
  }

  return JSON.stringify({
    name: o.projectName,
    version: '0.1.0',
    private: true,
    description: o.projectDescription,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      typecheck: 'tsc --noEmit',
    },
    dependencies: deps,
    devDependencies: devDeps,
  }, null, 2)
}

export function genTailwindConfig(_o: ScaffoldOptions): string {
  return `import type { Config } from 'tailwindcss'
import preset from '@lucifer91299/ui/tailwind/preset'

// Brand colors are set via ThemeProvider CSS variables (see src/theme.config.ts).
// Do NOT override color tokens here — that would bypass runtime theming.
const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [],
}

export default config
`
}

export function genThemeConfig(o: ScaffoldOptions): string {
  return `import { createTheme } from '@lucifer91299/ui'

export default createTheme({
  primary:          '${o.primaryColor}',
  accent:           '${o.accentColor}',
  success:          '${o.successColor}',
  logoSrc:          '${o.brandLogoPath || '/brand/logo.svg'}',
  poweredByLogoSrc: '/brand/powered-by-logo.svg',
  poweredByText:    'Powered by',
  projectName:      '${o.projectName}',
  sidebar:          '${o.sidebarStyle}',
  loginStyle:       '${o.loginStyle}',
})
`
}

export function genEnvLocal(o: ScaffoldOptions): string {
  const lines: string[] = []
  if (o.authMode === 'jwt' || o.authMode === 'multi-role') {
    lines.push(`NEXT_PUBLIC_API_URL=${o.apiUrl ?? 'http://localhost:3000'}`)
    if (o.authMode === 'jwt') {
      lines.push(`JWT_SECRET=${o.jwtSecret ?? 'change-me-in-production'}`)
    }
  }
  if (o.authMode === 'laravel') {
    lines.push(`NEXT_PUBLIC_LARAVEL_URL=${o.laravelUrl ?? 'http://localhost:8000'}`)
    lines.push(`SESSION_DB_HOST=${o.dbHost ?? '127.0.0.1'}`)
    lines.push(`SESSION_DB_PORT=${o.dbPort ?? '3306'}`)
    lines.push(`SESSION_DB_NAME=${o.dbName ?? 'laravel'}`)
    lines.push(`SESSION_DB_USER=${o.dbUser ?? 'root'}`)
    lines.push(`SESSION_DB_PASS=${o.dbPassword ?? ''}`)
  }
  return lines.join('\n') + '\n'
}

export function genGlobalsCSS(): string {
  return `/* Project-specific utilities — SDK component styles are in @lucifer91299/ui/styles/components.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
`
}

export function genRootLayout(o: ScaffoldOptions): string {
  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@lucifer91299/ui/styles/components.css'
import './globals.css'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '${o.projectName}',
  description: '${o.projectDescription}',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
`
}

export function genProviders(o: ScaffoldOptions): string {
  const imports: string[] = [
    `'use client'`,
    `import { type ReactNode } from 'react'`,
    `import { ThemeProvider } from '@lucifer91299/ui'`,
    `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'`,
    `import theme from '@/theme.config'`,
  ]
  const setup: string[] = [
    `const queryClient = new QueryClient()`,
  ]

  if (o.stateManagement === 'redux-query') {
    imports.push(`import { Provider as ReduxProvider } from 'react-redux'`)
    imports.push(`import { store } from '@/store'`)
  }

  const wrap = (inner: string) => {
    let result = inner
    result = `<QueryClientProvider client={queryClient}>${result}</QueryClientProvider>`
    if (o.stateManagement === 'redux-query') {
      result = `<ReduxProvider store={store}>${result}</ReduxProvider>`
    }
    result = `<ThemeProvider theme={theme}>${result}</ThemeProvider>`
    return result
  }

  return `${imports.join('\n')}

${setup.join('\n')}

export function Providers({ children }: { children: ReactNode }) {
  return (
    ${wrap('{children}')}
  )
}
`
}

export function genLoginPage(o: ScaffoldOptions): string {
  const isAnimated = o.loginStyle !== 'simple'
  const component  = isAnimated ? 'LoginPage' : 'LoginPageSimple'
  const credField  = isAnimated ? 'identifier' : 'email'

  const poweredByProp = isAnimated
    ? `      poweredBy={{
        logoSrc: "/brand/powered-by-logo.svg",
        text: "Powered by",
        href: "#",
      }}`
    : ''

  return `'use client'

import { ${component} } from '@lucifer91299/ui'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (creds: { ${credField}: string; password: string }) => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.${credField}, password: creds.password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid credentials'); return }
      router.replace('/dashboard')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <${component}
      projectName="${o.projectName}"
      projectSubtitle="Sign in to continue"
      logoSrc="/brand/logo.svg"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
${poweredByProp}
    />
  )
}
`
}

export function genLoginRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

// Demo credentials — replace this block with a real backend call
const DEMO_EMAIL    = 'admin@demo.com'
const DEMO_PASSWORD = 'password123'
const DEMO_USER     = { id: 1, name: 'Admin User', role: 'Admin', email: DEMO_EMAIL }

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string }

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'change-me-in-production')
  const token  = await new SignJWT({ sub: String(DEMO_USER.id), ...DEMO_USER })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('${cookieName}', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
`
}

export function genUserRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const store = await cookies()
  const token = store.get('${cookieName}')?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'change-me-in-production')
    const { payload } = await jwtVerify(token, secret)
    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
`
}

export function genMiddleware(o: ScaffoldOptions): string {
  if (o.authMode === 'multi-role') {
    const rolesArr = (o.roles ?? ['admin']).map((r) => `'${r}'`).join(', ')
    return `import { multiRoleMiddleware } from '@lucifer91299/ui/server'

export default multiRoleMiddleware({
  roles: [${rolesArr}],
  cookiePrefix: 'portal_',
  protectedPaths: ['/dashboard'],
  loginPath: '/login',
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
`
  }

  if (o.authMode === 'laravel') {
    return `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/dashboard']
const LOGIN = '/login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))
  if (!isProtected) return NextResponse.next()
  const session = request.cookies.get('laravel_session')?.value
  if (!session) return NextResponse.redirect(new URL(\`\${LOGIN}?redirect=\${pathname}\`, request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
`
  }

  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { jwtMiddleware } from '@lucifer91299/ui/server'

export default jwtMiddleware({
  cookieName: '${cookieName}',
  jwtSecret: process.env.JWT_SECRET!,
  protectedPaths: ['/dashboard'],
  loginPath: '/login',
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
`
}

export function genSessionRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { sessionRoute } from '@lucifer91299/ui/server'
export const { POST, DELETE } = sessionRoute({ cookieName: '${cookieName}' })
`
}

export function genLogoutRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { logoutRoute } from '@lucifer91299/ui/server'
export const { POST } = logoutRoute({ cookieName: '${cookieName}' })
`
}

export function genApiClient(o: ScaffoldOptions): string {
  return `import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  withCredentials: true,
  timeout: 15000,
})

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
`
}

export function genNavConfig(o: ScaffoldOptions): string {
  return `import { LayoutDashboard, Settings, Users, Layers, ClipboardList } from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Main',
    groupIcon: <LayoutDashboard className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard',  href: '/dashboard',            icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Users',      href: '/dashboard/users',      icon: <Users className="h-4 w-4" /> },
      { label: 'Components', href: '/dashboard/components', icon: <Layers className="h-4 w-4" /> },
      { label: 'Onboarding', href: '/dashboard/onboarding', icon: <ClipboardList className="h-4 w-4" /> },
    ],
  },
  {
    heading: 'Account',
    groupIcon: <Settings className="h-3.5 w-3.5" />,
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]
`
}

export function genDashboardLayout(o: ScaffoldOptions): string {
  return `'use client'

import { DashboardLayout, use${o.authMode === 'multi-role' ? 'MultiRoleAuth' : 'JwtAuth'} } from '@lucifer91299/ui'
import { usePathname } from 'next/navigation'
import { navGroups } from '@/components/layout/nav-config'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading, logout } = use${o.authMode === 'multi-role' ? 'MultiRoleAuth({ roles: [] })' : 'JwtAuth()'}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <DashboardLayout
      navGroups={navGroups}
      sidebar="${o.sidebarStyle}"
      projectName="${o.projectName}"
      logoSrc="/brand/logo.svg"
      user={{ name: String((user as any)?.name ?? 'User'), role: String((user as any)?.role ?? '') }}
      pathname={pathname}
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  )
}
`
}

export function genReduxStore(): string {
  return `import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
`
}

export function genAuthSlice(): string {
  return `import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  user: Record<string, unknown> | null
  authenticated: boolean
}

const initialState: AuthState = {
  token: null,
  user: null,
  authenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: Record<string, unknown> }>) {
      state.token = action.payload.token
      state.user = action.payload.user
      state.authenticated = true
    },
    logout(state) {
      state.token = null
      state.user = null
      state.authenticated = false
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
`
}

export function genRootPage(): string {
  return `import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
`
}

export function genDashboardHomePage(o: ScaffoldOptions): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, DataTable, StatusBadge, useJwtAuth, PortalBarChart, PortalAreaChart, PortalDonutChart, DatePicker } from '@lucifer91299/ui'
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react'

const stats = [
  { label: 'Total Users',  value: '2,847',   change: '+12%',  icon: Users,        bg: 'bg-blue-50',   fg: 'text-blue-600'   },
  { label: 'Revenue',      value: '₹48,295', change: '+8.2%', icon: TrendingUp,   bg: 'bg-green-50',  fg: 'text-green-600'  },
  { label: 'Orders',       value: '1,429',   change: '+5.1%', icon: ShoppingCart, bg: 'bg-orange-50', fg: 'text-orange-600' },
  { label: 'Active Now',   value: '94',      change: '+3',    icon: Activity,     bg: 'bg-purple-50', fg: 'text-purple-600' },
]

const MONTHLY = [
  { month: 'Jan', orders: 38, members: 120, revenue: 48 },
  { month: 'Feb', orders: 52, members: 134, revenue: 62 },
  { month: 'Mar', orders: 47, members: 128, revenue: 55 },
  { month: 'Apr', orders: 65, members: 156, revenue: 78 },
  { month: 'May', orders: 71, members: 172, revenue: 85 },
  { month: 'Jun', orders: 60, members: 160, revenue: 72 },
  { month: 'Jul', orders: 84, members: 198, revenue: 96 },
  { month: 'Aug', orders: 79, members: 185, revenue: 92 },
]

const STATUS_DONUT = [
  { name: 'Completed', value: 384, color: '#138808' },
  { name: 'Approved',  value: 213, color: '#000080' },
  { name: 'Pending',   value: 97,  color: '#FF9933' },
  { name: 'Rejected',  value: 42,  color: '#ef4444' },
]

const activity = [
  { id: 'ORD-001', user: 'Rahul Sharma',  action: 'New order placed',   time: '2 min ago',  status: 'pending'   },
  { id: 'ORD-002', user: 'Priya Mehta',   action: 'Payment received',   time: '14 min ago', status: 'paid'      },
  { id: 'ORD-003', user: 'Amit Patel',    action: 'Order approved',     time: '1 hr ago',   status: 'approved'  },
  { id: 'ORD-004', user: 'Sneha Iyer',    action: 'Account registered', time: '3 hr ago',   status: 'active'    },
  { id: 'ORD-005', user: 'Vikram Singh',  action: 'Order completed',    time: 'Yesterday',  status: 'completed' },
]

export default function DashboardHome() {
  const { user } = useJwtAuth()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate]     = useState('')

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-title1 text-label-primary font-semibold">
            Welcome back, {String(user?.name ?? 'Admin')} 👋
          </h1>
          <p className="text-body text-label-secondary mt-0.5">Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DatePicker value={fromDate} onChange={setFromDate} placeholder="From date" className="w-36" disableFuture />
          <span className="text-label-tertiary">–</span>
          <DatePicker value={toDate}   onChange={setToDate}   placeholder="To date"   className="w-36" disableFuture />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, bg, fg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-separator">
            <div className="flex items-center justify-between mb-3">
              <p className="text-subhead text-label-secondary">{label}</p>
              <div className={\`w-9 h-9 rounded-xl flex items-center justify-center \${bg} \${fg}\`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-title1 font-bold text-label-primary">{value}</p>
            <p className="text-footnote text-green-600 mt-0.5 font-medium">{change} this month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-separator shadow-sm p-5">
          <p className="text-headline font-semibold text-label-primary mb-1">Orders &amp; Members per Month</p>
          <p className="text-footnote text-label-tertiary mb-4">Current year overview</p>
          <PortalBarChart
            data={MONTHLY}
            xKey="month"
            series={[
              { key: 'orders',  name: 'Orders'  },
              { key: 'members', name: 'Members' },
            ]}
            height={220}
          />
        </div>
        <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
          <p className="text-headline font-semibold text-label-primary mb-1">Order Status</p>
          <p className="text-footnote text-label-tertiary mb-2">All time</p>
          <PortalDonutChart
            data={STATUS_DONUT}
            height={230}
            centerValue="764"
            centerLabel="Orders"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
        <p className="text-headline font-semibold text-label-primary mb-1">Revenue Trend (₹ thousands)</p>
        <p className="text-footnote text-label-tertiary mb-4">Monthly revenue</p>
        <PortalAreaChart
          data={MONTHLY}
          xKey="month"
          series={[{ key: 'revenue', name: 'Revenue (₹K)' }]}
          height={200}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-separator overflow-hidden">
        <div className="px-5 py-4 border-b border-separator">
          <h2 className="text-callout font-semibold text-label-primary">Recent Activity</h2>
        </div>
        <DataTable
          columns={[
            { key: 'id',     header: 'ID',     render: (r) => <span className="font-mono text-xs text-label-tertiary">{r.id}</span>   },
            { key: 'user',   header: 'User',   render: (r) => <span className="font-medium text-label-primary">{r.user}</span>       },
            { key: 'action', header: 'Action', render: (r) => <span className="text-label-secondary">{r.action}</span>               },
            { key: 'time',   header: 'Time',   render: (r) => <span className="text-label-tertiary">{r.time}</span>                   },
            { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} />                                        },
          ]}
          data={activity}
          keyExtractor={(r) => r.id}
        />
      </div>
    </div>
  )
}
`
}


export function genUsersPage(_o: ScaffoldOptions): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, Breadcrumbs, DataTable, StatusBadge, ActionButtons, Button, Input, Select } from '@lucifer91299/ui'
import { UserPlus, Search } from 'lucide-react'

type User = { id: number; name: string; email: string; role: string; status: string; joined: string }

const USERS: User[] = [
  { id: 1, name: 'Rahul Sharma',  email: 'rahul@example.com',  role: 'Admin',  status: 'active',   joined: '12 Jan 2024' },
  { id: 2, name: 'Priya Mehta',   email: 'priya@example.com',  role: 'Member', status: 'active',   joined: '03 Feb 2024' },
  { id: 3, name: 'Amit Patel',    email: 'amit@example.com',   role: 'Member', status: 'pending',  joined: '19 Mar 2024' },
  { id: 4, name: 'Sneha Iyer',    email: 'sneha@example.com',  role: 'Editor', status: 'active',   joined: '07 Apr 2024' },
  { id: 5, name: 'Vikram Singh',  email: 'vikram@example.com', role: 'Member', status: 'inactive', joined: '22 May 2024' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active',   label: 'Active'   },
  { value: 'pending',  label: 'Pending'  },
  { value: 'inactive', label: 'Inactive' },
]

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'Admin',  label: 'Admin'  },
  { value: 'Member', label: 'Member' },
  { value: 'Editor', label: 'Editor' },
]

export default function UsersPage() {
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')
  const [roleFilter, setRole]     = useState('')

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase()
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
    if (statusFilter && u.status !== statusFilter) return false
    if (roleFilter   && u.role   !== roleFilter)   return false
    return true
  })

  return (
    <div className="p-6">
      <PageShell
        title="Users"
        subtitle={\`\${filtered.length} of \${USERS.length} users\`}
        breadcrumbs={<Breadcrumbs items={[{ label: 'Users' }]} />}
        actions={
          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add User
          </Button>
        }
        controls={
          <>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                suffix={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-40">
              <Select options={STATUS_OPTIONS} value={statusFilter} onChange={setStatus} placeholder="Status" />
            </div>
            <div className="w-36">
              <Select options={ROLE_OPTIONS} value={roleFilter} onChange={setRole} placeholder="Role" />
            </div>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-separator shadow-sm overflow-hidden">
        <DataTable
          columns={[
            { key: 'id', header: '#', render: (_, i) => <span className="text-label-tertiary text-footnote">{i + 1}</span>, className: 'w-10' },
            {
              key: 'name', header: 'Name',
              render: (u: User) => (
                <div>
                  <p className="font-medium text-label-primary">{u.name}</p>
                  <p className="text-footnote text-label-tertiary">{u.email}</p>
                </div>
              ),
            },
            { key: 'role',   header: 'Role'   },
            { key: 'joined', header: 'Joined' },
            { key: 'status', header: 'Status', render: (u: User) => <StatusBadge status={u.status} /> },
            {
              key: 'actions', header: '', className: 'w-24',
              render: () => (
                <ActionButtons
                  showView showEdit showDelete
                  onView={() => {}} onEdit={() => {}} onDelete={() => {}}
                />
              ),
            },
          ]}
          data={filtered}
          keyExtractor={(u) => u.id}
          emptyMessage="No users match your filters."
        />
      </div>
    </div>
  )
}
`
}

export function genSettingsPage(o: ScaffoldOptions): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, Breadcrumbs, Card, Input, Select, Button, AlertBanner } from '@lucifer91299/ui'

const SIDEBAR_OPTIONS = [
  { value: 'full',   label: 'Full — wide sidebar with labels' },
  { value: 'rail',   label: 'Rail — icon-only narrow sidebar' },
  { value: 'both',   label: 'Both — full on desktop, rail on mobile' },
  { value: 'header', label: 'Header — horizontal top nav bar' },
]

export default function SettingsPage() {
  const [saved, setSaved]         = useState(false)
  const [projectName, setProject] = useState('${o.projectName}')
  const [sidebar, setSidebar]     = useState('${o.sidebarStyle}')
  const [apiUrl, setApiUrl]       = useState('${o.apiUrl}')

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      <PageShell
        title="Settings"
        subtitle="Configure your portal appearance and connection settings."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Settings' }]} />}
        actions={<Button variant="primary" onClick={handleSave}>Save changes</Button>}
      />

      {saved && <AlertBanner variant="success">Settings saved successfully.</AlertBanner>}

      <Card className="p-6">
        <h3 className="text-callout font-semibold text-label-primary mb-4">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project name"
            value={projectName}
            onChange={(e) => setProject(e.target.value)}
          />
          <Select
            label="Sidebar style"
            options={SIDEBAR_OPTIONS}
            value={sidebar}
            onChange={setSidebar}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-callout font-semibold text-label-primary mb-4">Connection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Backend API URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            helperText="Used by the API client for all requests."
          />
          <Input
            label="JWT cookie name"
            defaultValue="${o.jwtCookieName}"
            helperText="Must match the cookie set by your login route."
          />
        </div>
      </Card>
    </div>
  )
}
`
}

export function genComponentsShowcasePage(): string {
  return `'use client'

import React, { useState } from 'react'
import {
  PageShell, Breadcrumbs, Card, TricolorBar,
  Badge, StatusBadge, AlertBanner, LoadingSpinner,
  Button, Input, Select, Textarea, Switch, Checkbox, RadioGroup, DatePicker, DateTimePicker,
  Dialog, Tooltip, Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, Progress, Skeleton, SkeletonCard, SkeletonText,
  Separator, Avatar, AvatarGroup, DataTable, ActionButtons, Stepper,
  StatsCard, EmptyState, FileUpload,
  Drawer, OTPInput, NumberInput, Slider, TagInput, Timeline, Popover,
  PortalBarChart, PortalLineChart, PortalAreaChart, PortalDonutChart,
} from '@lucifer91299/ui'

// ── Demo data ────────────────────────────────────────────────────────────────

const BAR_DATA = [
  { month: 'Jan', revenue: 42, expenses: 28 },
  { month: 'Feb', revenue: 55, expenses: 31 },
  { month: 'Mar', revenue: 48, expenses: 29 },
  { month: 'Apr', revenue: 63, expenses: 35 },
  { month: 'May', revenue: 71, expenses: 38 },
  { month: 'Jun', revenue: 58, expenses: 32 },
]

const DONUT_DATA = [
  { label: 'Active',   value: 58 },
  { label: 'Pending',  value: 22 },
  { label: 'Inactive', value: 12 },
  { label: 'Blocked',  value: 8  },
]

const TABLE_DATA = [
  { id:  1, name: 'Priya Mehta',     role: 'Admin',   status: 'active',   joined: '12 Jan 2024' },
  { id:  2, name: 'Arjun Sharma',    role: 'Manager', status: 'pending',  joined: '03 Feb 2024' },
  { id:  3, name: 'Neha Gupta',      role: 'Viewer',  status: 'inactive', joined: '22 Mar 2024' },
  { id:  4, name: 'Ravi Patel',      role: 'Editor',  status: 'active',   joined: '05 Apr 2024' },
  { id:  5, name: 'Simran Kaur',     role: 'Manager', status: 'active',   joined: '18 May 2024' },
  { id:  6, name: 'Vikram Singh',    role: 'Viewer',  status: 'pending',  joined: '29 Jun 2024' },
  { id:  7, name: 'Ananya Iyer',     role: 'Editor',  status: 'active',   joined: '07 Jul 2024' },
  { id:  8, name: 'Karan Mehta',     role: 'Admin',   status: 'inactive', joined: '14 Aug 2024' },
  { id:  9, name: 'Pooja Reddy',     role: 'Viewer',  status: 'active',   joined: '02 Sep 2024' },
  { id: 10, name: 'Rahul Verma',     role: 'Manager', status: 'pending',  joined: '25 Sep 2024' },
  { id: 11, name: 'Divya Nair',      role: 'Editor',  status: 'active',   joined: '10 Oct 2024' },
  { id: 12, name: 'Aditya Joshi',    role: 'Viewer',  status: 'inactive', joined: '01 Nov 2024' },
]

const SELECT_OPTS = [
  { value: 'admin',   label: 'Administrator' },
  { value: 'manager', label: 'Manager'       },
  { value: 'viewer',  label: 'Viewer'        },
]

const RADIO_OPTS = [
  { value: 'monthly',   label: 'Monthly',   description: 'Billed every month' },
  { value: 'quarterly', label: 'Quarterly', description: 'Save 10% quarterly' },
  { value: 'annual',    label: 'Annual',    description: 'Save 25% annually'  },
]

const ACCORDION_ITEMS = [
  { value: 'q1', trigger: 'What components are included?',
    body: 'Buttons, inputs, selects, datepickers, charts, tables, modals, tabs, accordions, and more. Everything you need for a production admin portal.' },
  { value: 'q2', trigger: 'How do I theme the components?',
    body: 'Wrap your app in ThemeProvider with a createTheme() config. Every component reads CSS variables — no class overrides needed.' },
  { value: 'q3', trigger: 'Do I need recharts?',
    body: 'Only for chart components (PortalBarChart, PortalLineChart, etc.). Install it separately: npm install recharts' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({ id, title, subtitle, children }: {
  id?: string; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="space-y-4">
      <div>
        <h2 className="text-title3 font-bold text-label-primary">{title}</h2>
        {subtitle && <p className="text-callout text-label-tertiary mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-label-tertiary mb-3">
      {children}
    </p>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ComponentsPage() {
  const [dialogOpen,  setDialogOpen]  = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [tabVariant,  setTabVariant]  = useState<'line' | 'pill' | 'card'>('line')
  const [selectVal,    setSelectVal]    = useState('admin')
  const [multiVal,     setMultiVal]     = useState<string[]>([])
  const [multiGrouped, setMultiGrouped] = useState<string[]>([])
  const [radioVal,     setRadioVal]     = useState('monthly')
  const [sw1, setSw1] = useState(true)
  const [sw2, setSw2] = useState(false)
  const [cb1, setCb1] = useState(true)
  const [cb2, setCb2] = useState(false)
  const [dtVal,    setDtVal]    = useState('')
  const [dtVal12h, setDtVal12h] = useState('')
  const [dtValSec, setDtValSec] = useState('')
  const [stepperStep, setStepperStep] = useState(1)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [drawerSide,  setDrawerSide]  = useState<'right' | 'left'>('right')
  const [otpVal,      setOtpVal]      = useState('')
  const [numVal,      setNumVal]      = useState(5)
  const [sliderVal,   setSliderVal]   = useState(40)
  const [tagVal,      setTagVal]      = useState<string[]>(['React', 'TypeScript'])

  return (
    <div className="p-6 space-y-14 max-w-5xl pb-20">

      <PageShell
        title="Component Gallery"
        subtitle="Every component in the @lucifer91299/ui SDK — live and interactive."
        breadcrumbs={
          <Breadcrumbs items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Components' },
          ]} />
        }
      />

      {/* ── Buttons ─────────────────────────────────────────────────────── */}
      <Section id="buttons" title="Button" subtitle="5 semantic variants · 3 sizes · loading and disabled states.">
        <Card className="p-5 space-y-5">
          <div>
            <Label>Variants</Label>
            <Row>
              <Button variant="primary">Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="tinted">Tinted</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
            </Row>
          </div>
          <Separator />
          <div>
            <Label>Sizes</Label>
            <Row>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </Row>
          </div>
          <Separator />
          <div>
            <Label>States</Label>
            <Row>
              <Button variant="primary" isLoading>Saving…</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </Row>
          </div>
        </Card>
      </Section>

      {/* ── Badges ──────────────────────────────────────────────────────── */}
      <Section id="badges" title="Badge & StatusBadge" subtitle="Semantic chips for labels and workflow states.">
        <Card className="p-5 space-y-5">
          <div>
            <Label>Badge variants</Label>
            <Row>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="active">Active</Badge>
              <Badge variant="pending">Pending</Badge>
              <Badge variant="inactive">Inactive</Badge>
              <Badge variant="rejected">Rejected</Badge>
            </Row>
          </div>
          <Separator />
          <div>
            <Label>StatusBadge — all workflow states</Label>
            <Row>
              {['active','pending','approved','rejected','completed','paid','scheduled','inactive','cancelled'].map((s) => (
                <StatusBadge key={s} status={s} />
              ))}
            </Row>
          </div>
        </Card>
      </Section>

      {/* ── AlertBanner ─────────────────────────────────────────────────── */}
      <Section id="alerts" title="AlertBanner" subtitle="Contextual inline feedback messages.">
        <div className="space-y-3">
          <AlertBanner variant="info">Informational — your session expires in 30 minutes.</AlertBanner>
          <AlertBanner variant="success">Success — your changes have been saved successfully.</AlertBanner>
          <AlertBanner variant="warning">Warning — this action cannot be undone.</AlertBanner>
          <AlertBanner variant="error">Error — failed to connect to the server.</AlertBanner>
        </div>
      </Section>

      {/* ── Avatar ──────────────────────────────────────────────────────── */}
      <Section id="avatar" title="Avatar & AvatarGroup" subtitle="User profile images with initials fallback.">
        <Card className="p-5 space-y-5">
          <div>
            <Label>Sizes (xs → xl)</Label>
            <Row>
              <Avatar name="Priya Mehta"  size="xs" />
              <Avatar name="Arjun Sharma" size="sm" />
              <Avatar name="Neha Gupta"   size="md" />
              <Avatar name="Ravi Patel"   size="lg" />
              <Avatar name="Sunita Rao"   size="xl" />
            </Row>
          </div>
          <Separator />
          <div>
            <Label>AvatarGroup (max 4 visible)</Label>
            <AvatarGroup
              avatars={[
                { name: 'Priya Mehta'  },
                { name: 'Arjun Sharma' },
                { name: 'Neha Gupta'  },
                { name: 'Ravi Patel'  },
                { name: 'Sunita Rao'  },
                { name: 'Kiran Das'   },
              ]}
              max={4}
            />
          </div>
        </Card>
      </Section>

      {/* ── Inputs ──────────────────────────────────────────────────────── */}
      <Section id="inputs" title="Input, Select & Textarea" subtitle="Form controls with labels, helpers, and validation states.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full name"  placeholder="Priya Mehta" />
          <Input label="Email"      type="email" placeholder="priya@example.com" />
          <Input label="With error" error="This field is required" placeholder="..." />
          <Input label="Disabled"   disabled defaultValue="Read-only value" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Textarea label="Message" placeholder="Type your message here…" helperText="Max 500 characters." />
          <Textarea label="Message — error" error="Message is required" placeholder="..." />
        </div>
      </Section>

      {/* ── Select ──────────────────────────────────────────────────────── */}
      <Section id="select" title="Select" subtitle="Single and multi-select dropdowns with search, filters, and pill tags.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Single select"
            options={SELECT_OPTS}
            value={selectVal}
            onChange={setSelectVal}
            searchable
            clearable
            helperText="Searchable · clearable"
          />
          <Select
            label="Single select — disabled"
            options={SELECT_OPTS}
            value="manager"
            onChange={() => {}}
            disabled
          />
          <Select
            label="Multi-select"
            multiple
            options={SELECT_OPTS}
            value={multiVal}
            onChange={setMultiVal}
            placeholder="Pick one or more roles…"
            clearable
            helperText={multiVal.length ? \`Selected: \${multiVal.join(', ')}\` : 'Round pill tags · select-all · Done button'}
          />
          <Select
            label="Multi-select — with groups"
            multiple
            options={[
              { value: 'admin',     label: 'Administrator', group: 'Management' },
              { value: 'manager',   label: 'Manager',       group: 'Management' },
              { value: 'editor',    label: 'Editor',        group: 'Content'    },
              { value: 'viewer',    label: 'Viewer',        group: 'Content'    },
              { value: 'moderator', label: 'Moderator',     group: 'Content'    },
            ]}
            value={multiGrouped}
            onChange={setMultiGrouped}
            placeholder="Pick roles by group…"
            searchable
            clearable
          />
          <Select
            label="Select — error"
            options={SELECT_OPTS}
            value=""
            onChange={() => {}}
            placeholder="Choose a role…"
            error="Please select a role"
          />
        </div>
      </Section>

      {/* ── Switch, Checkbox, RadioGroup ────────────────────────────────── */}
      <Section id="toggles" title="Switch, Checkbox & RadioGroup" subtitle="Selection controls for settings and forms.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 space-y-4">
            <Label>Switch</Label>
            <Switch label="Email notifications" description="Receive daily digest emails" checked={sw1} onChange={setSw1} />
            <Switch label="SMS alerts"          description="Critical alerts only"        checked={sw2} onChange={setSw2} />
            <Switch label="Disabled"            disabled />
            <Separator />
            <Switch label="Error state" description="Toggle is required" error="You must enable notifications" />
          </Card>
          <Card className="p-5 space-y-4">
            <Label>Checkbox</Label>
            <Checkbox label="Accept terms"  description="I agree to the terms" checked={cb1} onChange={setCb1} />
            <Checkbox label="Subscribe"     description="Newsletter opt-in"    checked={cb2} onChange={setCb2} />
            <Checkbox label="Disabled"      disabled />
            <Checkbox label="Indeterminate" indeterminate />
            <Separator />
            <Checkbox label="Error state" error="You must accept the terms" />
          </Card>
          <Card className="p-5">
            <Label>RadioGroup</Label>
            <RadioGroup options={RADIO_OPTS} value={radioVal} onChange={setRadioVal} />
            <Separator className="my-4" />
            <Label>RadioGroup — error</Label>
            <RadioGroup options={RADIO_OPTS} value="" onChange={() => {}} error="Please select a billing cycle" />
          </Card>
        </div>
      </Section>

      {/* ── DatePicker ──────────────────────────────────────────────────── */}
      <Section id="datepicker" title="DatePicker" subtitle="3-level calendar (days → months → years) with past/future/weekend/specific-date constraints.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DatePicker label="Default"         placeholder="DD/MM/YYYY" />
          <DatePicker label="No future dates" disableFuture  helperText="Past dates only" />
          <DatePicker label="Weekdays only"   excludeWeekends helperText="Weekends disabled" />
          <DatePicker
            label="Specific dates disabled"
            excludeDates={[
              new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().slice(0, 10),
              new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString().slice(0, 10),
              new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString().slice(0, 10),
            ]}
            helperText="10th, 15th, 20th blocked"
          />
          <DatePicker
            label="With error"
            error="Date is required"
            placeholder="DD/MM/YYYY"
          />
        </div>
      </Section>

      {/* ── DateTimePicker ──────────────────────────────────────────────── */}
      <Section id="datetimepicker" title="DateTimePicker" subtitle="Full date + time picker — 12h/24h, minute steps, seconds, Now button, all date constraints.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DateTimePicker
            label="Date & Time (24h)"
            value={dtVal}
            onChange={setDtVal}
            helperText={dtVal ? \`Value: \${dtVal}\` : '24-hour format · minute step 5'}
            minuteStep={5}
          />
          <DateTimePicker
            label="12-hour format"
            value={dtVal12h}
            onChange={setDtVal12h}
            timeFormat="12h"
            helperText={dtVal12h ? \`Value: \${dtVal12h}\` : 'AM / PM toggle'}
          />
          <DateTimePicker
            label="No future · weekdays only"
            value={dtValSec}
            onChange={setDtValSec}
            showSeconds
            disableFuture
            excludeWeekends
            helperText={dtValSec ? \`Value: \${dtValSec}\` : 'disableFuture + excludeWeekends + showSeconds'}
          />
          <DateTimePicker
            label="With error"
            error="Schedule is required"
          />
        </div>
      </Section>

      {/* ── Stepper ─────────────────────────────────────────────────────── */}
      <Section id="stepper" title="Stepper" subtitle="Multi-step progress indicator — horizontal and vertical, complete / current / upcoming states.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-6 space-y-5">
            <Label>Horizontal (interactive)</Label>
            <Stepper
              steps={[
                { label: 'Personal Info',   description: 'Name & contact'   },
                { label: 'Organization',    description: 'Company details'  },
                { label: 'Preferences',     description: 'Notifications'    },
                { label: 'Review',          description: 'Confirm & submit' },
              ]}
              current={stepperStep}
            />
            <Separator />
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" disabled={stepperStep === 0} onClick={() => setStepperStep(s => s - 1)}>← Back</Button>
              <span className="text-xs text-label-tertiary flex-1 text-center">Step {stepperStep + 1} of 4</span>
              <Button variant="primary" size="sm" disabled={stepperStep === 4} onClick={() => setStepperStep(s => s + 1)}>Next →</Button>
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <Label>Vertical</Label>
            <Stepper
              orientation="vertical"
              steps={[
                { label: 'Personal Info',   description: 'Name, email & phone' },
                { label: 'Organization',    description: 'Company & role'      },
                { label: 'Preferences',     description: 'Notifications'       },
                { label: 'Review & Submit', description: 'Confirm details'     },
              ]}
              current={stepperStep}
            />
          </Card>
        </div>
      </Section>

      {/* ── Progress ────────────────────────────────────────────────────── */}
      <Section id="progress" title="Progress" subtitle="Progress bars in 4 semantic variants and 3 sizes.">
        <Card className="p-5 space-y-4">
          <Progress label="Default (68%)" value={68} showValue />
          <Progress label="Success (90%)" value={90} variant="success" showValue />
          <Progress label="Warning (45%)" value={45} variant="warning" showValue />
          <Progress label="Danger  (15%)" value={15} variant="danger"  showValue />
          <Separator label="sizes" />
          <Progress label="Large bar" value={60} size="lg" showValue />
          <Progress label="Small bar" value={60} size="sm" showValue />
        </Card>
      </Section>

      {/* ── Skeleton ────────────────────────────────────────────────────── */}
      <Section id="skeleton" title="Skeleton" subtitle="Loading placeholders while async content fetches.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12" rounded="full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4" width="75%" />
                <Skeleton className="h-3" width="50%" />
              </div>
            </div>
            <Skeleton className="h-28 w-full" rounded="lg" />
            <SkeletonText lines={2} />
          </Card>
        </div>
      </Section>

      {/* ── Separator ───────────────────────────────────────────────────── */}
      <Section id="separator" title="Separator" subtitle="Horizontal, vertical, and labelled dividers.">
        <Card className="p-5 space-y-4">
          <Separator />
          <Separator label="OR" />
          <div className="flex items-center gap-4 h-8">
            <span className="text-callout text-label-secondary">Section A</span>
            <Separator orientation="vertical" />
            <span className="text-callout text-label-secondary">Section B</span>
            <Separator orientation="vertical" />
            <span className="text-callout text-label-secondary">Section C</span>
          </div>
        </Card>
      </Section>

      {/* ── Tooltip ─────────────────────────────────────────────────────── */}
      <Section id="tooltip" title="Tooltip" subtitle="Hover hints in 4 placement directions.">
        <Card className="p-5">
          <Row>
            <Tooltip content="Appears on top"    placement="top">    <Button variant="outline" size="sm">Top</Button>    </Tooltip>
            <Tooltip content="Appears on bottom" placement="bottom"> <Button variant="outline" size="sm">Bottom</Button> </Tooltip>
            <Tooltip content="Appears on left"   placement="left">   <Button variant="outline" size="sm">Left</Button>   </Tooltip>
            <Tooltip content="Appears on right"  placement="right">  <Button variant="outline" size="sm">Right</Button>  </Tooltip>
          </Row>
        </Card>
      </Section>

      {/* ── Dialog ──────────────────────────────────────────────────────── */}
      <Section id="dialog" title="Dialog" subtitle="Modal overlays for forms and confirmations.">
        <Card className="p-5">
          <Row>
            <Button variant="primary" onClick={() => setDialogOpen(true)}>Open form dialog</Button>
            <Button variant="danger"  onClick={() => setConfirmOpen(true)}>Open confirm dialog</Button>
          </Row>
        </Card>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Edit profile"
          description="Update your name and role."
          size="md"
          footer={
            <>
              <Button variant="ghost"   onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setDialogOpen(false)}>Save changes</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input    label="Full name" defaultValue="Priya Mehta" />
            <Select   label="Role"      options={SELECT_OPTS} value={selectVal} onChange={setSelectVal} />
            <Textarea label="Bio"       placeholder="Tell us about yourself…" />
          </div>
        </Dialog>

        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Delete record"
          description="This will permanently delete the record. This cannot be undone."
          size="sm"
          footer={
            <>
              <Button variant="ghost"  onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setConfirmOpen(false)}>Delete</Button>
            </>
          }
        />
      </Section>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <Section id="tabs" title="Tabs" subtitle="Three visual variants: line, pill, card.">
        <div className="flex gap-2 mb-3">
          {(['line', 'pill', 'card'] as const).map((v) => (
            <Button key={v} variant={tabVariant === v ? 'primary' : 'outline'} size="sm"
              onClick={() => setTabVariant(v)}>
              {v}
            </Button>
          ))}
        </div>
        <Card className="p-5">
          <Tabs defaultValue="overview" variant={tabVariant}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <AlertBanner variant="info">Viewing the Overview tab.</AlertBanner>
            </TabsContent>
            <TabsContent value="analytics">
              <AlertBanner variant="success">Analytics data would appear here.</AlertBanner>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <Switch label="Dark mode"     description="Toggle dark theme" />
                <Switch label="Notifications" defaultChecked />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </Section>

      {/* ── Accordion ───────────────────────────────────────────────────── */}
      <Section id="accordion" title="Accordion" subtitle="Collapsible FAQ / info panels.">
        <Card className="px-5">
          <Accordion type="single" defaultValue="q1">
            {ACCORDION_ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value} trigger={item.trigger}>
                {item.body}
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </Section>

      {/* ── LoadingSpinner ──────────────────────────────────────────────── */}
      <Section id="spinner" title="LoadingSpinner" subtitle="Composable spinner in 4 sizes.">
        <Card className="p-5">
          <Row>
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
            <LoadingSpinner size="xl" />
            <Button variant="primary" isLoading>Loading state</Button>
          </Row>
        </Card>
      </Section>

      {/* ── DataTable ───────────────────────────────────────────────────── */}
      <Section id="datatable" title="DataTable & ActionButtons" subtitle="Typed table with global search, per-column filters, sort, pagination, and row actions.">
        <Card className="overflow-hidden">
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Name',
                sortable: true,
                searchable: true,
                render: (r: {name: string}) => <span className="font-semibold text-label-primary">{r.name}</span>,
              },
              {
                key: 'role',
                header: 'Role',
                sortable: true,
                filterOptions: [
                  { value: 'Admin',   label: 'Admin'   },
                  { value: 'Manager', label: 'Manager' },
                  { value: 'Editor',  label: 'Editor'  },
                  { value: 'Viewer',  label: 'Viewer'  },
                ],
              },
              {
                key: 'status',
                header: 'Status',
                filterOptions: [
                  { value: 'active',   label: 'Active'   },
                  { value: 'pending',  label: 'Pending'  },
                  { value: 'inactive', label: 'Inactive' },
                ],
                render: (r: {status: string}) => <StatusBadge status={r.status} />,
              },
              {
                key: 'joined',
                header: 'Joined',
                sortable: true,
                render: (r: {joined: string}) => <span className="text-label-tertiary text-[13px]">{r.joined}</span>,
              },
              {
                key: 'actions',
                header: '',
                render: () => <ActionButtons showView showEdit onView={() => {}} onEdit={() => {}} />,
              },
            ]}
            data={TABLE_DATA}
            keyExtractor={(r: {id: number}) => r.id}
            searchable
            searchPlaceholder="Search members…"
            pagination
            pageSize={5}
          />
        </Card>
      </Section>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <Section id="charts" title="Charts" subtitle="Bar, line, area, donut — built on recharts (npm install recharts).">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <p className="text-callout font-semibold text-label-primary mb-4">PortalBarChart</p>
            <PortalBarChart
              data={BAR_DATA}
              xKey="month"
              series={[{ key: 'revenue', name: 'Revenue' }, { key: 'expenses', name: 'Expenses' }]}
              height={200}
            />
          </Card>
          <Card className="p-5">
            <p className="text-callout font-semibold text-label-primary mb-4">PortalDonutChart</p>
            <PortalDonutChart data={DONUT_DATA} centerLabel="Total" centerValue={100} height={200} />
          </Card>
          <Card className="p-5">
            <p className="text-callout font-semibold text-label-primary mb-4">PortalLineChart</p>
            <PortalLineChart
              data={BAR_DATA}
              xKey="month"
              series={[{ key: 'revenue', name: 'Revenue' }]}
              height={200}
            />
          </Card>
          <Card className="p-5">
            <p className="text-callout font-semibold text-label-primary mb-4">PortalAreaChart</p>
            <PortalAreaChart
              data={BAR_DATA}
              xKey="month"
              series={[{ key: 'revenue', name: 'Revenue' }]}
              height={200}
            />
          </Card>
        </div>
      </Section>

      {/* ── StatsCard ───────────────────────────────────────────────────── */}
      <Section id="statscard" title="StatsCard" subtitle="KPI metric cards with icon, trend indicator, and 5 colour variants.">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value="₹4,82,900"
            subtitle="This financial year"
            trend={12.4}
            trendLabel="vs last year"
            variant="primary"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatsCard
            title="Active Users"
            value="1,284"
            trend={5.2}
            trendLabel="vs last month"
            variant="success"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <StatsCard
            title="Pending Tasks"
            value="38"
            trend={-8.1}
            trendLabel="vs last week"
            variant="warning"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatsCard
            title="Failed Jobs"
            value="7"
            trend={0}
            trendLabel="no change"
            variant="danger"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
        </div>
      </Section>

      {/* ── EmptyState ──────────────────────────────────────────────────── */}
      <Section id="emptystate" title="EmptyState" subtitle="Zero-data placeholders for tables, lists, and search results.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <EmptyState
              title="No results found"
              description="Try adjusting your search or filter to find what you're looking for."
              action={<Button variant="outline" size="sm">Clear filters</Button>}
            />
          </Card>
          <Card>
            <EmptyState
              icon={<svg className="w-6 h-6 text-label-tertiary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              title="No documents yet"
              description="Upload your first document to get started."
              action={<Button variant="primary" size="sm">Upload file</Button>}
            />
          </Card>
          <Card>
            <EmptyState
              icon={<svg className="w-6 h-6 text-label-tertiary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
              title="No notifications"
              description="You're all caught up! Check back later."
            />
          </Card>
        </div>
      </Section>

      {/* ── FileUpload ──────────────────────────────────────────────────── */}
      <Section id="fileupload" title="FileUpload" subtitle="Drag-and-drop file picker with size validation, file list, and error state.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card className="p-5">
            <FileUpload label="Upload document" helperText="PDF, DOCX or TXT · max 5 MB" accept=".pdf,.docx,.txt" maxSize={5 * 1024 * 1024} />
          </Card>
          <Card className="p-5">
            <FileUpload label="Profile photo" helperText="PNG, JPG or WEBP · max 2 MB" accept="image/*" maxSize={2 * 1024 * 1024} />
          </Card>
          <Card className="p-5">
            <FileUpload label="Multiple files" helperText="Any file type · multiple allowed" multiple />
          </Card>
          <Card className="p-5">
            <FileUpload label="With error" error="Please upload a valid document" accept=".pdf" />
          </Card>
        </div>
      </Section>

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <Section id="drawer" title="Drawer" subtitle="Animated side-panel overlay — slide in from right or left, three sizes, footer actions.">
        <Card className="p-5">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm" onClick={() => { setDrawerSide('right'); setDrawerOpen(true) }}>Right drawer (md)</Button>
            <Button variant="outline" size="sm" onClick={() => { setDrawerSide('left');  setDrawerOpen(true) }}>Left drawer (md)</Button>
          </div>
        </Card>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Edit member"
          description="Update the member's name, role and internal notes then save."
          side={drawerSide}
          size="md"
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="ghost"   size="sm" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => setDrawerOpen(false)}>Save changes</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input    label="Full name"  defaultValue="Priya Mehta" />
            <Select   label="Role"       options={SELECT_OPTS} value={selectVal} onChange={setSelectVal} />
            <Input    label="Email"      defaultValue="priya@example.com" type="email" />
            <Textarea label="Notes"      placeholder="Add internal notes…" rows={3} />
          </div>
        </Drawer>
      </Section>

      {/* ── OTPInput ────────────────────────────────────────────────────── */}
      <Section id="otp" title="OTPInput" subtitle="4 or 6-digit code input with auto-advance, backspace, and paste support.">
        <Card className="p-5 space-y-5">
          <div>
            <Label>6-digit code</Label>
            <OTPInput length={6} value={otpVal} onChange={setOtpVal} label="Verification code" helperText={otpVal.length === 6 ? \`Entered: \${otpVal}\` : 'Enter the 6-digit code sent to your email'} />
          </div>
          <Separator />
          <div>
            <Label>4-digit — error state</Label>
            <OTPInput length={4} value="12" error="Invalid code. Please try again." />
          </div>
        </Card>
      </Section>

      {/* ── NumberInput, Slider, TagInput ───────────────────────────────── */}
      <Section id="inputs2" title="NumberInput, Slider & TagInput" subtitle="Numeric stepper, range picker, and free-text tag entry.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 space-y-4">
            <Label>NumberInput</Label>
            <NumberInput label="Team size" value={numVal} onChange={setNumVal} min={1} max={100} helperText={\`Current: \${numVal}\`} />
            <NumberInput label="Disabled"   defaultValue={3} disabled />
            <NumberInput label="With error" defaultValue={0} error="Value must be at least 1" />
          </Card>
          <Card className="p-5 space-y-6">
            <Label>Slider</Label>
            <Slider label="Progress" value={sliderVal} onChange={setSliderVal} showValue valueFormat={v => \`\${v}%\`} />
            <Slider label="Budget" defaultValue={25000} min={0} max={100000} step={500} showValue valueFormat={v => \`₹\${v.toLocaleString()}\`} helperText="Max ₹1,00,000" />
            <Slider label="Disabled" defaultValue={60} disabled showValue />
          </Card>
          <Card className="p-5 space-y-4">
            <Label>TagInput</Label>
            <TagInput label="Skills" value={tagVal} onChange={setTagVal} placeholder="Type & press Enter…" helperText={\`\${tagVal.length} tag\${tagVal.length !== 1 ? 's' : ''} added\`} maxTags={8} />
            <TagInput label="With error" value={[]} onChange={() => {}} error="At least one tag required" />
          </Card>
        </div>
      </Section>

      {/* ── Timeline ────────────────────────────────────────────────────── */}
      <Section id="timeline" title="Timeline" subtitle="Activity feed — timestamped events with icon, variant colour, and description.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card className="p-5">
            <Label>Activity log</Label>
            <Timeline
              items={[
                { title: 'Account created',      timestamp: '2 min ago', variant: 'success', description: 'priya@example.com signed up'   },
                { title: 'Email verified',        timestamp: '1 min ago', variant: 'success', description: 'Verification link confirmed'   },
                { title: 'Profile incomplete',    timestamp: 'Just now',  variant: 'warning', description: 'Missing phone and company info' },
                { title: 'Login from new device', timestamp: 'Just now',  variant: 'info',    description: 'Chrome on macOS · Mumbai, IN' },
              ]}
            />
          </Card>
          <Card className="p-5">
            <Label>Approval workflow</Label>
            <Timeline
              items={[
                { title: 'Request submitted', timestamp: '10 Jan',  variant: 'default', description: 'Leave request for 15–20 Jan' },
                { title: 'Manager review',    timestamp: '11 Jan',  variant: 'info',    description: 'Rohan Mehta reviewing'       },
                { title: 'Approved',          timestamp: '12 Jan',  variant: 'success', description: 'Approved by Rohan Mehta'     },
                { title: 'HR notified',       timestamp: '12 Jan',  variant: 'success', description: 'Calendar updated'            },
                { title: 'Escalation raised', timestamp: 'Pending', variant: 'danger',  description: 'Auto-escalated after 48h'   },
              ]}
            />
          </Card>
        </div>
      </Section>

      {/* ── Popover ─────────────────────────────────────────────────────── */}
      <Section id="popover" title="Popover" subtitle="Lightweight positioned panel — click-triggered, closes on outside click.">
        <Card className="p-5">
          <Row>
            <Popover placement="top"    trigger={<Button variant="outline" size="sm">Top</Button>}    content={<p className="text-xs text-label-tertiary max-w-[160px]">Top-positioned popover.</p>} />
            <Popover placement="bottom" trigger={<Button variant="outline" size="sm">Bottom</Button>} content={<p className="text-xs text-label-tertiary max-w-[160px]">Bottom-positioned popover.</p>} />
            <Popover placement="right"  trigger={<Button variant="outline" size="sm">Right</Button>}  content={<p className="text-xs text-label-tertiary max-w-[160px]">Right-side popover.</p>} />
            <Popover placement="left"   trigger={<Button variant="outline" size="sm">Left</Button>}   content={<p className="text-xs text-label-tertiary max-w-[160px]">Left-side popover.</p>} />
          </Row>
        </Card>
      </Section>

      {/* ── TricolorBar ─────────────────────────────────────────────────── */}
      <Section id="tricolor" title="TricolorBar" subtitle="Brand accent bar — appears in sidebar header/footer and login card.">
        <TricolorBar />
      </Section>

    </div>
  )
}
`
}

export function genOnboardingPage(): string {
  return `'use client'

import React, { useState } from 'react'
import {
  Breadcrumbs, Card, Button, Separator,
  Input, Textarea, Select, DatePicker, DateTimePicker,
  Switch, Checkbox, RadioGroup, Slider, NumberInput, TagInput, FileUpload, OTPInput,
} from '@lucifer91299/ui'
import { CheckCircle2, User, Briefcase, Settings2, ShieldCheck } from 'lucide-react'

// ── Options ──────────────────────────────────────────────────────────────────

const COUNTRY_OPTS = [
  { value: 'in', label: 'India' },          { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' }, { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },         { value: 'sg', label: 'Singapore' },
  { value: 'ae', label: 'UAE' },            { value: 'de', label: 'Germany' },
]

const ROLE_OPTS = [
  { value: 'developer',  label: 'Developer'  },
  { value: 'designer',   label: 'Designer'   },
  { value: 'manager',    label: 'Manager'    },
  { value: 'analyst',    label: 'Analyst'    },
  { value: 'executive',  label: 'Executive'  },
  { value: 'other',      label: 'Other'      },
]

const DEPT_OPTS = [
  { value: 'eng',     label: 'Engineering'  },
  { value: 'product', label: 'Product'      },
  { value: 'design',  label: 'Design'       },
  { value: 'sales',   label: 'Sales'        },
  { value: 'support', label: 'Support'      },
]

const LANG_OPTS = [
  { value: 'en', label: 'English' }, { value: 'hi', label: 'Hindi' },
  { value: 'fr', label: 'French' },  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
]

const PLAN_OPTS = [
  { value: 'starter', label: 'Starter',      description: 'Up to 5 members · 10 GB storage' },
  { value: 'growth',  label: 'Growth',        description: 'Up to 25 members · 50 GB storage' },
  { value: 'scale',   label: 'Scale',         description: 'Unlimited members · 500 GB storage' },
]

// ── Section heading helper ────────────────────────────────────────────────────

function SectionHead({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-separator-opaque bg-surface-secondary/40">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-soft, rgba(0,0,128,0.07))' }}>
        <Icon className="w-3.5 h-3.5" style={{ color: 'var(--primary, #000080)' }} />
      </div>
      <div>
        <p className="text-callout font-semibold text-label-primary leading-tight">{title}</p>
        <p className="text-[11px] text-label-tertiary leading-tight">{subtitle}</p>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [submitted, setSubmitted] = useState(false)

  // Personal
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [dob,      setDob]      = useState<Date | null>(null)
  const [apptTime, setApptTime] = useState('')
  const [bio,      setBio]      = useState('')

  // Professional
  const [company,  setCompany]  = useState('')
  const [website,  setWebsite]  = useState('')
  const [jobRole,  setJobRole]  = useState('')
  const [dept,     setDept]     = useState('')
  const [country,  setCountry]  = useState('')
  const [teamSize, setTeamSize] = useState(10)
  const [expYears, setExpYears] = useState(3)
  const [skills,   setSkills]   = useState<string[]>([])

  // Preferences
  const [plan,       setPlan]       = useState('growth')
  const [language,   setLanguage]   = useState('en')
  const [workHours,  setWorkHours]  = useState(8)
  const [notifs,     setNotifs]     = useState(true)
  const [newsletter, setNewsletter] = useState(false)
  const [darkMode,   setDarkMode]   = useState(false)
  const [terms,      setTerms]      = useState(false)
  const [privacy,    setPrivacy]    = useState(false)
  const [marketing,  setMarketing]  = useState(false)

  // Security
  const [password,  setPassword]  = useState('')
  const [otpVal,    setOtpVal]    = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim())     e.name     = 'Full name is required'
    if (!email.trim())    e.email    = 'Email is required'
    if (!phone.trim())    e.phone    = 'Phone is required'
    if (!company.trim())  e.company  = 'Company is required'
    if (!jobRole)         e.jobRole  = 'Role is required'
    if (!country)         e.country  = 'Country is required'
    if (!password)        e.password = 'Password is required'
    if (!terms)           e.terms    = 'You must accept the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="h-1" style={{ background: 'var(--primary, #000080)' }} />
          <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--primary, #000080)' }}>
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-title3 font-bold text-label-primary">Profile saved, {name.split(' ')[0] || 'there'}!</h2>
              <p className="text-callout text-label-tertiary mt-1">Your account is set up and ready to go.</p>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="primary" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>Edit profile</Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-5">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Onboarding' }]} />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-title3 font-bold text-label-primary">Account Setup</h1>
            <p className="text-callout text-label-tertiary mt-0.5">Fill in your details to complete registration</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setErrors({})}>Clear errors</Button>
        </div>
      </div>

      <div className="space-y-4">

        {/* ── 1. Personal Information ───────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="h-1" style={{ background: 'var(--primary, #000080)' }} />
          <SectionHead icon={User} title="Personal Information" subtitle="Your basic contact details and identity" />
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Full name *"  value={name}  onChange={e => setName(e.target.value)}  placeholder="Priya Mehta"        error={errors.name} />
              <Input label="Email *"      value={email} onChange={e => setEmail(e.target.value)} placeholder="priya@example.com"  error={errors.email} type="email" />
              <Input label="Phone *"      value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"    error={errors.phone} />
              <DatePicker label="Date of birth" value={dob} onChange={setDob} placeholder="DD / MM / YYYY" />
            </div>
            <DateTimePicker label="Preferred onboarding call" value={apptTime} onChange={setApptTime} placeholder="Pick date & time" helperText="We'll schedule your welcome call at this time" />
            <Textarea label="Bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us a little about yourself — your background, interests, goals…" rows={2} />
            <FileUpload label="Profile photo" helperText="PNG, JPG or WEBP · max 2 MB" accept="image/*" maxSize={2 * 1024 * 1024} />
          </div>
        </Card>

        {/* ── 2. Professional Details ───────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="h-1" style={{ background: 'var(--primary, #000080)' }} />
          <SectionHead icon={Briefcase} title="Professional Details" subtitle="Your work context and expertise" />
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input  label="Company *"   value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp"            error={errors.company} />
              <Input  label="Website"     value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yoursite.com" />
              <Select label="Job role *"  options={ROLE_OPTS} value={jobRole} onChange={setJobRole} placeholder="Select role…"         error={errors.jobRole} />
              <Select label="Department"  options={DEPT_OPTS} value={dept}    onChange={setDept}    placeholder="Select department…" />
              <Select label="Country *"   options={COUNTRY_OPTS} value={country} onChange={setCountry} placeholder="Select country…"   error={errors.country} searchable />
              <Select label="Language"    options={LANG_OPTS}    value={language} onChange={setLanguage} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberInput label="Team size"         value={teamSize} onChange={setTeamSize} min={1} max={10000} helperText="Total headcount in your team" />
              <NumberInput label="Years of experience" value={expYears} onChange={setExpYears} min={0} max={50}   helperText="Professional experience in years" />
            </div>
            <Slider label="Availability (hrs/day)" value={workHours} onChange={setWorkHours} min={1} max={12} step={1} showValue valueFormat={v => \`\${v}h\`} helperText="How many hours per day are you available for collaboration?" />
            <TagInput label="Skills & technologies" value={skills} onChange={setSkills} placeholder="Type a skill & press Enter…" helperText="Add up to 12 skills (e.g. React, Python, Figma)" maxTags={12} />
          </div>
        </Card>

        {/* ── 3. Plan & Preferences ─────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="h-1" style={{ background: 'var(--primary, #000080)' }} />
          <SectionHead icon={Settings2} title="Plan & Preferences" subtitle="Choose your plan and notification settings" />
          <div className="p-5 space-y-4">
            <RadioGroup label="Select your plan" options={PLAN_OPTS} value={plan} onChange={setPlan} />
            <Separator />
            <div>
              <p className="text-[12px] font-semibold text-label-secondary uppercase tracking-wider mb-2">Notifications</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Switch label="Email alerts"  checked={notifs}     onChange={setNotifs}     helperText="Activity & security" />
                <Switch label="Newsletter"    checked={newsletter} onChange={setNewsletter} helperText="Monthly updates" />
                <Switch label="Dark mode"     checked={darkMode}   onChange={setDarkMode}   helperText="Use dark theme" />
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-[12px] font-semibold text-label-secondary uppercase tracking-wider mb-2">Agreements</p>
              <div className="space-y-2">
                <Checkbox
                  label="I agree to the Terms of Service *"
                  checked={terms} onChange={setTerms}
                  error={errors.terms}
                />
                <Checkbox
                  label="I have read and accept the Privacy Policy"
                  checked={privacy} onChange={setPrivacy}
                />
                <Checkbox
                  label="I'd like to receive product updates and offers"
                  checked={marketing} onChange={setMarketing}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ── 4. Security ───────────────────────────────────────────────────── */}
        <Card className="overflow-hidden">
          <div className="h-1" style={{ background: 'var(--primary, #000080)' }} />
          <SectionHead icon={ShieldCheck} title="Security" subtitle="Set your password and verify your identity" />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Password *"        value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Min 8 characters" error={errors.password} />
              <Input label="Confirm password"  defaultValue="" type="password" placeholder="Repeat password" />
            </div>
            <Separator />
            <div>
              <p className="text-[12px] font-semibold text-label-secondary uppercase tracking-wider mb-1">Two-factor verification</p>
              <p className="text-[12px] text-label-tertiary mb-3">Enter the 6-digit code sent to {email || 'your email'} to verify your address.</p>
              <OTPInput
                length={6}
                value={otpVal}
                onChange={setOtpVal}
                helperText={otpVal.length === 6 ? 'Code entered — ready to submit' : 'Check your inbox for the verification code'}
              />
            </div>
          </div>
        </Card>

        {/* ── Submit row ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" onClick={() => { setErrors({}); }}>Reset form</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>Cancel</Button>
            <Button variant="primary" onClick={() => { if (validate()) setSubmitted(true) }}>Complete setup →</Button>
          </div>
        </div>

      </div>
    </div>
  )
}
`
}
