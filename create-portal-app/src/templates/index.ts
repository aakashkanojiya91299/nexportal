export interface ScaffoldOptions {
  projectName: string
  projectDescription: string
  authMode: 'jwt' | 'multi-role' | 'laravel'
  loginStyle: 'animated' | 'simple'
  sidebarStyle: 'full' | 'rail' | 'both'
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
    '@lucifer91299/ui': o.localUiPath ? `file:${o.localUiPath}` : '^1.0.7',
    'next': '^15.3.0',
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
import { useState } from 'react'
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
  return `import { LayoutDashboard, Settings, Users, FileText } from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Main',
    groupIcon: <LayoutDashboard className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard', href: '/dashboard',       icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Users',     href: '/dashboard/users', icon: <Users className="h-4 w-4" /> },
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

import { useState } from 'react'
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

import { useState } from 'react'
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

import { useState } from 'react'
import { PageShell, Breadcrumbs, Card, Input, Select, Button, AlertBanner } from '@lucifer91299/ui'

const SIDEBAR_OPTIONS = [
  { value: 'full', label: 'Full — wide sidebar with labels' },
  { value: 'rail', label: 'Rail — icon-only narrow sidebar' },
  { value: 'both', label: 'Both — full on desktop, rail on mobile' },
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

      {saved && <AlertBanner variant="success" message="Settings saved successfully." />}

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
