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
    '@lucifer91299/ui': o.localUiPath ? `file:${o.localUiPath}` : '^1.0.0',
    'next': '^15.3.0',
    'react': '^19.0.0',
    'react-dom': '^19.0.0',
    'framer-motion': '^12.0.0',
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
  return `import { LayoutDashboard, Settings, User } from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Main',
    groupIcon: <LayoutDashboard className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    heading: 'Account',
    groupIcon: <User className="h-3.5 w-3.5" />,
    items: [
      { label: 'Profile', href: '/dashboard/profile', icon: <User className="h-4 w-4" /> },
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]
`
}

export function genDashboardLayout(o: ScaffoldOptions): string {
  return `'use client'

import { DashboardLayout } from '@lucifer91299/ui'
import { use${o.authMode === 'multi-role' ? 'MultiRoleAuth' : 'JwtAuth'} } from '@lucifer91299/ui'
import { usePathname } from 'next/navigation'
import { navGroups } from '@/components/layout/nav-config'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = use${o.authMode === 'multi-role' ? 'MultiRoleAuth({ roles: [] })' : 'JwtAuth()'}

  return (
    <DashboardLayout
      navGroups={navGroups}
      sidebar="${o.sidebarStyle}"
      projectName="${o.projectName}"
      logoSrc="/brand/logo.svg"
      user={{ name: (user as any)?.name ?? 'User', role: (user as any)?.role ?? '' }}
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
  return `import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react'

const stats = [
  { label: 'Total Users',  value: '2,847',   change: '+12%', icon: Users },
  { label: 'Revenue',      value: '₹48,295', change: '+8.2%', icon: TrendingUp },
  { label: 'Orders',       value: '1,429',   change: '+5.1%', icon: ShoppingCart },
  { label: 'Active Now',   value: '94',      change: '+3',    icon: Activity },
]

const activity = [
  { id: 'ORD-001', user: 'Rahul Sharma',  action: 'New order placed',   time: '2 min ago',  status: 'Pending' },
  { id: 'ORD-002', user: 'Priya Mehta',   action: 'Payment received',   time: '14 min ago', status: 'Paid' },
  { id: 'ORD-003', user: 'Amit Patel',    action: 'Order approved',     time: '1 hr ago',   status: 'Approved' },
  { id: 'ORD-004', user: 'Sneha Iyer',    action: 'Account registered', time: '3 hr ago',   status: 'Active' },
  { id: 'ORD-005', user: 'Vikram Singh',  action: 'Order completed',    time: 'Yesterday',  status: 'Completed' },
]

const statusColors: Record<string, string> = {
  Pending:   'bg-yellow-100 text-yellow-800',
  Paid:      'bg-blue-100   text-blue-800',
  Approved:  'bg-green-100  text-green-800',
  Active:    'bg-purple-100 text-purple-800',
  Completed: 'bg-gray-100   text-gray-700',
}

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      <div className="page-header">
        <h1 className="page-title">${o.projectName}</h1>
        <p className="text-body text-label-secondary">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-subhead text-label-secondary">{label}</p>
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-title1 font-bold text-label-primary">{value}</p>
            <p className="text-footnote text-green-600 mt-1 font-medium">{change} this month</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-callout font-semibold text-label-primary">Recent Activity</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-label-secondary text-subhead">
            <tr>
              <th className="px-5 py-3 text-left font-medium">ID</th>
              <th className="px-5 py-3 text-left font-medium">User</th>
              <th className="px-5 py-3 text-left font-medium">Action</th>
              <th className="px-5 py-3 text-left font-medium">Time</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activity.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-label-secondary">{row.id}</td>
                <td className="px-5 py-3.5 font-medium text-label-primary">{row.user}</td>
                <td className="px-5 py-3.5 text-label-secondary">{row.action}</td>
                <td className="px-5 py-3.5 text-label-tertiary">{row.time}</td>
                <td className="px-5 py-3.5">
                  <span className={\`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold \${statusColors[row.status] ?? ''}\`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
`
}
