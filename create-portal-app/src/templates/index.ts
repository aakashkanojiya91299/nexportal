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
    '@lucifer91299/ui': o.localUiPath ? `file:${o.localUiPath}` : '^1.1.57',
    '@dnd-kit/core': '^6.3.1',
    '@dnd-kit/sortable': '^10.0.0',
    '@dnd-kit/utilities': '^3.2.2',
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
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@lucifer91299/ui/dist/index.js',
  ],
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

export function genNextConfig(o: ScaffoldOptions): string {
  const apiHost = o.apiUrl
    ? (() => {
        try { return new URL(o.apiUrl).hostname } catch { return 'localhost' }
      })()
    : 'localhost'

  return `import type { NextConfig } from 'next'

const config: NextConfig = {
  transpilePackages: ['@lucifer91299/ui'],
  images: {
    remotePatterns: [
      // Add remote image domains here, e.g.:
      // { protocol: 'https', hostname: 'example.com' },
    ],
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://${apiHost}:3000',
    'http://${apiHost}:3001',
  ],
}

export default config
`
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

  if (!isAnimated) {
    return `'use client'

import { LoginPageSimple } from '@lucifer91299/ui'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (creds: { email: string; password: string }) => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.email, password: creds.password }),
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
    <LoginPageSimple
      projectName="${o.projectName}"
      projectSubtitle="Sign in to your account"
      logoSrc="/brand/logo.svg"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      registerLinks={[
        { label: 'Create account', href: '/register' },
      ]}
    />
  )
}
`
  }

  return `'use client'

import { AuthPageShell, TricolorBar, Button } from '@lucifer91299/ui'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react'

// ── Social icon SVGs (inline — brand colour applied on hover) ─────────────────
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163Zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  )
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231ZM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

// ── Social link button ────────────────────────────────────────────────────────
function SocialIconLink({ label, href, brand, icon }: {
  label: string; href: string; brand: string; icon: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        color:       hovered ? brand         : undefined,
        borderColor: hovered ? brand + '55'  : undefined,
        boxShadow:   hovered ? '0 6px 18px ' + brand + '33' : undefined,
      }}
      className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 focus:outline-none"
    >
      {icon}
    </a>
  )
}

const SOCIAL_LINKS = [
  { label: 'WhatsApp',  href: '#', brand: '#25D366', icon: <WhatsAppIcon /> },
  { label: 'Facebook',  href: '#', brand: '#1877F2', icon: <FacebookIcon /> },
  { label: 'Instagram', href: '#', brand: '#E4405F', icon: <InstagramIcon /> },
  { label: 'X',         href: '#', brand: '#000000', icon: <XIcon /> },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Login() {
  const [identifier,   setIdentifier]   = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading,    setIsLoading]    = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!identifier.trim()) { setError('Email is required'); return }
    if (!password.trim())   { setError('Password is required'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier.trim(), password }),
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
    <AuthPageShell
      backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
      ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
      poweredBy={{ logoSrc: '/brand/powered-by-logo.svg', text: 'Powered by', href: '#' }}
    >
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* ── Logo + title ── */}
        <div className="mb-5 flex items-center gap-3.5">
          <img
            src="/brand/logo.svg"
            alt="${o.projectName} logo"
            className="w-14 h-14 object-contain rounded-full flex-shrink-0"
          />
          <div className="flex flex-col leading-tight">
            <h1
              className="text-[19px] font-bold tracking-tight whitespace-nowrap"
              style={{ color: 'var(--primary, #000080)', letterSpacing: '-0.01em' }}
            >
              ${o.projectName}
            </h1>
            <p className="text-[13px] text-gray-400 mt-1">Sign in to continue</p>
          </div>
        </div>

        {/* ── Card — tricolor bar covers both start and end corners ── */}
        <div
          className="w-full bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
        >
          {/* Top tricolor */}
          <TricolorBar height={3} animated shimmer />

          <div className="px-7 py-5">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Email ── */}
              <div>
                <label htmlFor="identifier" className="block text-subhead font-medium text-label-primary mb-2">
                  Email address
                </label>
                <input
                  id="identifier"
                  type="email"
                  value={identifier}
                  onChange={e => { setIdentifier(e.target.value); setError(null) }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="input-base"
                />
              </div>

              {/* ── Password ── */}
              <div>
                <label htmlFor="password" className="block text-subhead font-medium text-label-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(null) }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={'input-base' + (password ? ' pr-11' : '')}
                  />
                  {password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* ── Error banner ── */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* ── Submit ── */}
              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-11 text-sm font-semibold"
                  isLoading={isLoading}
                >
                  {!isLoading && (
                    <span className="flex items-center justify-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>

              {/* ── Forgot password ── */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-sm font-semibold transition-colors duration-150 focus:outline-none"
                  style={{ color: 'var(--primary, #000080)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent, #FF9933)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--primary, #000080)')}
                >
                  Forgot Password?
                </button>
              </div>

            </form>
          </div>

          {/* Bottom tricolor (reversed) — covers end corner same as CJ admin */}
          <div style={{ transform: 'scaleX(-1)' }}>
            <TricolorBar height={3} animated shimmer />
          </div>
        </div>

        {/* ── Registration link ── */}
        <div className="mt-5 flex items-center justify-center">
          <a
            href="/register"
            className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors duration-150 focus:outline-none"
            style={{ color: 'var(--primary, #000080)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent, #FF9933)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--primary, #000080)')}
          >
            Create account <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        {/* ── Social links ── */}
        <div className="mt-5 flex flex-col items-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gray-400 mb-3">
            Connect with us
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(link => (
              <SocialIconLink key={link.label} {...link} />
            ))}
          </div>
        </div>

      </div>
    </AuthPageShell>
  )
}
`
}

export function genForgotPasswordPage(o: ScaffoldOptions): string {
  return `'use client'

import { ForgotPasswordPage } from '@lucifer91299/ui'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (email: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Could not send reset link'); return }
      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ForgotPasswordPage
      // ── Identity ──────────────────────────────────────────────────────────
      projectName="${o.projectName}"
      projectSubtitle="Reset your password"
      logoSrc="/brand/logo.svg"
      logoAlt="${o.projectName} logo"
      logoSize={56}

      // ── State ─────────────────────────────────────────────────────────────
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      isSuccess={isSuccess}

      // ── Success screen text ───────────────────────────────────────────────
      successMessage="Check your email"
      successSubMessage="We've sent a password reset link to your email address. Follow the link to create a new password."

      // ── Navigation ────────────────────────────────────────────────────────
      onBackToLogin={() => router.push('/login')}
      backToLoginHref="/login"

      // ── Powered-by badge ──────────────────────────────────────────────────
      poweredBy={{
        logoSrc: "/brand/powered-by-logo.svg",
        text: "Powered by",
        href: "#",
      }}

      // ── Background ────────────────────────────────────────────────────────
      // backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
      // ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
      // socialLinks={[...]}
    />
  )
}
`
}

export function genResetPasswordPage(o: ScaffoldOptions): string {
  return `'use client'

import { ResetPasswordPage } from '@lucifer91299/ui'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function ResetPasswordContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const token        = searchParams.get('token') ?? ''

  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid]           = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [isSuccess, setIsSuccess]       = useState(false)

  // Validate token on mount
  useEffect(() => {
    if (!token) { setIsValidating(false); return }
    fetch(\`/api/auth/reset-password/validate?token=\${encodeURIComponent(token)}\`)
      .then(r => r.json())
      .then(d => setIsValid(d.valid === true))
      .catch(() => setIsValid(false))
      .finally(() => setIsValidating(false))
  }, [token])

  const handleSubmit = async (password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Could not reset password'); return }
      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ResetPasswordPage
      // ── Identity ──────────────────────────────────────────────────────────
      projectName="${o.projectName}"
      projectSubtitle="Set a new password"
      logoSrc="/brand/logo.svg"
      logoAlt="${o.projectName} logo"
      logoSize={56}

      // ── Token validation state ─────────────────────────────────────────────
      isValidating={isValidating}
      isValid={isValid}

      // ── Form state ────────────────────────────────────────────────────────
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      isSuccess={isSuccess}

      // ── Password rules ────────────────────────────────────────────────────
      minPasswordLength={6}

      // ── Custom messages ───────────────────────────────────────────────────
      validatingMessage="Checking reset link…"
      invalidMessage="Reset link expired"
      invalidSubMessage="This reset link is invalid, expired, or has already been used. Please request a new one."
      successMessage="Password updated"
      successSubMessage="Your password has been changed. You can now sign in with your new password."

      // ── Navigation ────────────────────────────────────────────────────────
      onBackToLogin={() => router.push('/login')}
      backToLoginHref="/login"

      // ── Powered-by badge ──────────────────────────────────────────────────
      poweredBy={{
        logoSrc: "/brand/powered-by-logo.svg",
        text: "Powered by",
        href: "#",
      }}

      // ── Background ────────────────────────────────────────────────────────
      // backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
      // ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
    />
  )
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
`
}

export function genRegisterPage(o: ScaffoldOptions): string {
  return `'use client'

import { RegisterPage } from '@lucifer91299/ui'
import { Input, Select, PhoneInput } from '@lucifer91299/ui'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  { label: 'Account',  description: 'Email and password' },
  { label: 'Profile',  description: 'Personal details' },
  { label: 'Review',   description: 'Confirm and submit' },
]

export default function Register() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading]     = useState(false)
  const [error, setError]             = useState<string | null>(null)

  // Form state
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [role, setRole]         = useState('')

  const handleNext = () => {
    setError(null)
    // Add your step validation here
    if (currentStep === 0 && !email) { setError('Email is required'); return }
    if (currentStep === 0 && !password) { setError('Password is required'); return }
    if (currentStep === 1 && !name) { setError('Name is required'); return }
    setCurrentStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone, role }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Registration failed'); return }
      router.replace('/login')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RegisterPage
      // ── Identity ──────────────────────────────────────────────────────────
      projectName="${o.projectName}"
      projectSubtitle="Create your account"
      logoSrc="/brand/logo.svg"
      logoAlt="${o.projectName} logo"
      logoSize={40}

      // ── Steps ─────────────────────────────────────────────────────────────
      steps={STEPS}
      currentStep={currentStep}

      // ── Navigation ────────────────────────────────────────────────────────
      onNext={handleNext}
      onBack={() => { setError(null); setCurrentStep(s => s - 1) }}
      onSubmit={handleSubmit}
      nextLabel="Continue"
      backLabel="Back"
      submitLabel="Create Account"
      isLoading={isLoading}
      error={error}

      // ── Login link ────────────────────────────────────────────────────────
      onLoginLink={() => router.push('/login')}
      loginLabel="Already have an account? Sign in"

      // ── Layout ────────────────────────────────────────────────────────────
      maxWidth="max-w-2xl"

      // ── Powered-by badge ──────────────────────────────────────────────────
      poweredBy={{
        logoSrc: "/brand/powered-by-logo.svg",
        text: "Powered by",
        href: "#",
      }}

      // ── Background ────────────────────────────────────────────────────────
      // backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
      // ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
      // socialLinks={[...]}
    >
      {/* ── Step 1: Account ─────────────────────────────────────────────── */}
      {currentStep === 0 && (
        <>
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
          />
        </>
      )}

      {/* ── Step 2: Profile ─────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <>
          <Input
            label="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Priya Mehta"
          />
          <PhoneInput
            label="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <Select
            label="Role"
            value={role}
            onChange={setRole}
            options={[
              { value: 'member',  label: 'Member'  },
              { value: 'manager', label: 'Manager' },
            ]}
          />
        </>
      )}

      {/* ── Step 3: Review ──────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="space-y-3">
          <div className="bg-surface-secondary rounded-xl p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-label-tertiary">Email</span>
              <span className="font-medium text-label-primary">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-label-tertiary">Name</span>
              <span className="font-medium text-label-primary">{name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-label-tertiary">Phone</span>
              <span className="font-medium text-label-primary">{phone || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-label-tertiary">Role</span>
              <span className="font-medium text-label-primary">{role || '—'}</span>
            </div>
          </div>
          <p className="text-xs text-label-tertiary text-center">
            Review your details above and click Create Account to proceed.
          </p>
        </div>
      )}
    </RegisterPage>
  )
}
`
}

export function genForgotPasswordRoute(): string {
  return `import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string }

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // TODO: implement your forgot-password logic here.
  // 1. Look up the user by email.
  // 2. Generate a secure reset token and store it (with expiry).
  // 3. Send a reset email containing: /reset-password?token=<token>
  //
  // Example with a backend API:
  // const res = await fetch(\`\${process.env.API_URL}/auth/forgot-password\`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email }),
  // })
  // if (!res.ok) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Always return 200 to avoid leaking whether the email exists.
  return NextResponse.json({ ok: true })
}
`
}

export function genResetPasswordRoutes(): string {
  return `import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token, password } = (await request.json()) as { token?: string; password?: string }

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
  }

  // TODO: implement your reset-password logic here.
  // 1. Look up the token in your store and check it hasn't expired.
  // 2. Hash the new password and update the user record.
  // 3. Invalidate / delete the token.
  //
  // Example with a backend API:
  // const res = await fetch(\`\${process.env.API_URL}/auth/reset-password\`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ token, password }),
  // })
  // if (!res.ok) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })

  return NextResponse.json({ ok: true })
}
`
}

export function genResetPasswordValidateRoute(): string {
  return `import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valid: false })
  }

  // TODO: validate the reset token.
  // Check that it exists in your store and hasn't expired.
  //
  // Example with a backend API:
  // const res = await fetch(\`\${process.env.API_URL}/auth/reset-password/validate?token=\${token}\`)
  // const data = await res.json()
  // return NextResponse.json({ valid: res.ok && data.valid })

  // Demo: treat any non-empty token as valid
  return NextResponse.json({ valid: token.length > 0 })
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
  return `import { LayoutDashboard, Settings, Users, Layers, ClipboardList, FormInput } from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Main',
    groupIcon: <LayoutDashboard className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard',    href: '/dashboard',                 icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Users',        href: '/dashboard/users',           icon: <Users className="h-4 w-4" /> },
      { label: 'Form Builder', href: '/dashboard/form-builder',    icon: <FormInput className="h-4 w-4" /> },
      { label: 'Components',   href: '/dashboard/components',      icon: <Layers className="h-4 w-4" /> },
      { label: 'Onboarding',   href: '/dashboard/onboarding',      icon: <ClipboardList className="h-4 w-4" /> },
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

  // Build breadcrumbs from pathname segments.
  // Replace this with a usePageBreadcrumbs() hook or context for dynamic routes.
  const breadcrumbs = pathname
    .replace('/dashboard', '')
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      href: i < arr.length - 1 ? '/dashboard/' + arr.slice(0, i + 1).join('/') : undefined,
    }))

  return (
    <DashboardLayout
      navGroups={navGroups}
      sidebar="${o.sidebarStyle}"
      projectName="${o.projectName}"
      logoSrc="/brand/logo.svg"
      user={{ name: String((user as any)?.name ?? 'User'), role: String((user as any)?.role ?? '') }}
      pathname={pathname}
      onLogout={logout}
      breadcrumbs={breadcrumbs}
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
  PageShell, Breadcrumbs, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, TricolorBar,
  Badge, StatusBadge, AlertBanner, LoadingSpinner, PageLoader,
  Button, Input, Select, Textarea, Switch, Checkbox, RadioGroup, DatePicker, DateTimePicker,
  Dialog, Tooltip, Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, Progress, Skeleton, SkeletonCard, SkeletonText,
  TableSkeleton, GridSkeleton, ProfileSkeleton, SettingsSkeleton,
  Separator, Avatar, AvatarGroup, DataTable, ActionButtons, Stepper,
  StatsCard, EmptyState, FileUpload,
  Drawer, OTPInput, NumberInput, Slider, TagInput, Timeline, Popover,
  PortalBarChart, PortalLineChart, PortalAreaChart, PortalDonutChart,
  AttendanceCalendar, PhoneInput, ProfilePhotoInput, DropdownMenu,
  ImageViewer, useImageViewer, NotificationBell,
  Combobox, ConfirmModal, AlertModal, DashboardFullPage, LanguageSwitcher,
} from '@lucifer91299/ui'
import { LayoutDashboard, Eye, Pencil, CheckCircle, Trash2 } from 'lucide-react'

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
  const [phone,        setPhone]        = useState('')
  const [phone2,       setPhone2]       = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [drawerSide,  setDrawerSide]  = useState<'right' | 'left'>('right')
  const [otpVal,      setOtpVal]      = useState('')
  const [numVal,      setNumVal]      = useState(5)
  const [sliderVal,   setSliderVal]   = useState(40)
  const [tagVal,      setTagVal]      = useState<string[]>(['React', 'TypeScript'])
  const [notifs, setNotifs] = useState([
    { id: '1', title: 'New member registered', message: 'Priya Mehta completed onboarding.', time: new Date(Date.now() - 1000 * 60 * 5),  read: false, type: 'success' as const },
    { id: '2', title: 'Payment received',      message: '₹12,500 credited for invoice #INV-0042.',  time: new Date(Date.now() - 1000 * 60 * 32), read: false, type: 'info'    as const },
    { id: '3', title: 'Report ready',          message: 'Monthly attendance report is available.', time: new Date(Date.now() - 1000 * 60 * 90), read: false, type: 'info'    as const },
    { id: '4', title: 'Server warning',        message: 'CPU usage exceeded 85% for 10 minutes.',  time: new Date(Date.now() - 1000 * 60 * 60 * 3), read: true,  type: 'warning' as const },
    { id: '5', title: 'Upload failed',         message: 'Could not process roster_final.xlsx.',    time: new Date(Date.now() - 1000 * 60 * 60 * 7), read: true,  type: 'error'   as const },
  ])
  // ── New component state ───────────────────────────────────────────────────
  const [comboVal,       setComboVal]       = useState('')
  const [confirmOpen2,   setConfirmOpen2]   = useState(false)
  const [confirmVariant, setConfirmVariant] = useState<'danger' | 'warning' | 'info' | 'success'>('warning')
  const [alertOpen,      setAlertOpen]      = useState(false)
  const [alertVariant,   setAlertVariant]   = useState<'error' | 'warning' | 'info' | 'success'>('info')
  const [language,       setLanguage]       = useState('en')

  return (
    <div className="p-6 space-y-14 max-w-5xl pb-20">

      <PageShell
        title="Component Gallery"
        subtitle="Every component in the @lucifer91299/ui SDK — live and interactive."
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

      {/* ── Card ────────────────────────────────────────────────────────── */}
      <Section id="cards" title="Card" subtitle="Composable card layout — root · header · title · description · content · footer.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Basic card</CardTitle>
              <CardDescription>Header with title and description</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-callout text-label-secondary">Body content goes inside CardContent. Combine with CardHeader and CardFooter as needed.</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Save</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated variant</CardTitle>
              <CardDescription>Use variant="elevated" for a prominent shadow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input label="Full name" placeholder="Priya Mehta" />
              <Input label="Email" type="email" placeholder="priya@example.com" />
            </CardContent>
            <CardFooter>
              <Button variant="primary" size="sm" className="w-full">Submit</Button>
            </CardFooter>
          </Card>
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
              onNext={() => setStepperStep(s => Math.min(s + 1, 3))}
              onBack={() => setStepperStep(s => Math.max(s - 1, 0))}
              onSubmit={() => alert('Form submitted!')}
              submitLabel="Submit Form"
            />
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

      {/* ── PhoneInput ────────────────────────────────────────────────────── */}
      <Section id="phoneinput" title="PhoneInput" subtitle="International phone number input with 250+ country flags and E.164 output.">
        <div className="max-w-xs space-y-4">
          <PhoneInput label="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <PhoneInput label="US number" defaultCountryIso="US" value={phone2} onChange={(e) => setPhone2(e.target.value)} />
          <PhoneInput label="With error" value="" onChange={() => {}} error="Please enter a valid phone number" />
        </div>
      </Section>

      {/* ── ProfilePhotoInput ─────────────────────────────────────────────── */}
      <Section id="profilephoto" title="ProfilePhotoInput" subtitle="Square drag-drop photo picker with preview and size validation.">
        <ProfilePhotoInput value={profilePhoto} onChange={setProfilePhoto} />
      </Section>

      {/* ── DropdownMenu ──────────────────────────────────────────────────── */}
      <Section id="dropdownmenu" title="DropdownMenu" subtitle="Portal-based action menu with smart positioning and item variants.">
        <DropdownMenu
          items={[
            { label: 'View details', icon: <Eye className="w-4 h-4" />, onClick: () => {} },
            { label: 'Edit', icon: <Pencil className="w-4 h-4" />, onClick: () => {} },
            { label: 'Approve', icon: <CheckCircle className="w-4 h-4" />, onClick: () => {}, variant: 'success' },
            { label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: () => {}, variant: 'danger' },
          ]}
        />
      </Section>

      {/* ── AttendanceCalendar ────────────────────────────────────────────── */}
      <Section id="attendance" title="AttendanceCalendar" subtitle="Two-month attendance calendar with pending changes, progress bar, and complete dialog.">
        <AttendanceCalendar
          status="active"
          startDate={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 15).toISOString().split('T')[0]}
          attendanceRecords={[]}
          presentDaysCount={18}
          requiredDays={60}
          onSave={async () => {}}
          onComplete={async () => {}}
        />
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
              <TabsTrigger value="overview" icon={<LayoutDashboard className="w-3.5 h-3.5" />}>Overview</TabsTrigger>
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
            <LoadingSpinner size="lg" />
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
            defaultPageSize={5}
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
            <>
              <Button variant="ghost"   size="sm" className="w-full sm:w-auto" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" className="w-full sm:w-auto" onClick={() => setDrawerOpen(false)}>Save changes</Button>
            </>
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

      {/* ── NotificationBell ────────────────────────────────────────────── */}
      <Section id="notifications" title="NotificationBell" subtitle="Animated bell with unread badge, dropdown list, mark-read, and mark-all-read.">
        {/* Demo as real header — overflow-visible so dropdown is not clipped */}
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-visible bg-white">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-800">Dashboard</p>
              <p className="text-[11px] text-gray-400">{notifs.filter(n => !n.read).length} unread notification{notifs.filter(n => !n.read).length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-gray-400">Click bell to open ↓</span>
              <NotificationBell
                notifications={notifs}
                onMarkRead={(id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
                onMarkAllRead={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}
                onViewAll={() => alert('Navigate to /notifications')}
              />
            </div>
          </div>
          <div className="px-5 py-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 font-medium">Empty state:</span>
              <NotificationBell notifications={[]} emptyMessage="You're all caught up!" />
            </div>
          </div>
        </div>
      </Section>

      {/* ── TricolorBar ─────────────────────────────────────────────────── */}
      <Section id="tricolor" title="TricolorBar" subtitle="Brand accent bar — appears in sidebar header/footer and login card.">
        <TricolorBar shimmer />
      </Section>

      {/* ── PageLoader ──────────────────────────────────────────────────── */}
      <Section id="page-loader" title="PageLoader + LoadingSpinner variants" subtitle="Full-screen loading gate + dual-ring and white spinner variants.">
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-8 items-start">
              <div className="rounded-xl border border-gray-200 overflow-hidden w-64 h-32 flex items-center justify-center bg-surface-secondary">
                <div className="flex flex-col items-center gap-3">
                  <LoadingSpinner size="lg" variant="dual" />
                  <p className="text-callout text-label-secondary">Loading…</p>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Spinner variants (lg)</Label>
                <Row>
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner size="lg" variant="default" />
                    <span className="text-[11px] text-label-tertiary">default</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <LoadingSpinner size="lg" variant="dual" />
                    <span className="text-[11px] text-label-tertiary">dual</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-gray-800 rounded-xl px-4 py-2">
                    <LoadingSpinner size="lg" variant="white" />
                    <span className="text-[11px] text-white/60">white</span>
                  </div>
                </Row>
                <Label>All sizes (dual)</Label>
                <Row>
                  {(['xs', 'sm', 'md', 'lg'] as const).map(s => (
                    <div key={s} className="flex flex-col items-center gap-1.5">
                      <LoadingSpinner size={s} variant="dual" />
                      <span className="text-[11px] text-label-tertiary">{s}</span>
                    </div>
                  ))}
                </Row>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ── Combobox ────────────────────────────────────────────────────── */}
      <Section id="combobox" title="Combobox" subtitle="Free-text input with a filtered suggestion dropdown. Type to search, or freely enter any value.">
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <Combobox
                label="Sport"
                value={comboVal}
                onChange={setComboVal}
                placeholder="Type or select…"
                options={[
                  { value: 'shooting', label: 'Shooting' },
                  { value: 'archery',  label: 'Archery' },
                  { value: 'boxing',   label: 'Boxing' },
                  { value: 'wrestling', label: 'Wrestling' },
                  { value: 'weightlifting', label: 'Weightlifting' },
                  { value: 'judo',     label: 'Judo' },
                  { value: 'badminton', label: 'Badminton' },
                  { value: 'tennis',   label: 'Tennis' },
                ]}
                helperText={comboVal ? \`Value: "\${comboVal}"\` : 'Start typing to filter options'}
              />
              <Combobox
                label="With error"
                value=""
                onChange={() => {}}
                placeholder="Required field"
                options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]}
                error
                errorText="This field is required"
              />
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ── ConfirmModal ────────────────────────────────────────────────── */}
      <Section id="confirm-modal" title="ConfirmModal" subtitle="Opinionated confirm dialog — danger / warning / info / success with optional summary table and loading state.">
        <Card>
          <CardContent>
            <div className="space-y-3">
              <Row>
                {(['danger', 'warning', 'info', 'success'] as const).map((v) => (
                  <Button
                    key={v}
                    variant={v === 'danger' ? 'danger' : 'outline'}
                    onClick={() => { setConfirmVariant(v); setConfirmOpen2(true) }}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </Button>
                ))}
              </Row>
              <p className="text-footnote text-label-tertiary">The <strong>Danger</strong> variant includes an optional summary table.</p>
            </div>
          </CardContent>
        </Card>
        <ConfirmModal
          isOpen={confirmOpen2}
          onClose={() => setConfirmOpen2(false)}
          onConfirm={() => setConfirmOpen2(false)}
          variant={confirmVariant}
          title={
            confirmVariant === 'danger' ? 'Delete record?' :
            confirmVariant === 'warning' ? 'Unsaved changes' :
            confirmVariant === 'success' ? 'Publish page?' : 'Confirm action'
          }
          message={[
            confirmVariant === 'danger' ? 'This action cannot be undone. All associated data will be removed.' :
            confirmVariant === 'warning' ? 'You have unsaved changes. Are you sure you want to leave?' :
            confirmVariant === 'success' ? 'The page will be visible to all users after publishing.' :
            'Are you sure you want to proceed with this action?',
            '• All related data will be affected.',
          ]}
          tableData={confirmVariant === 'danger' ? {
            headers: ['Item', 'Count'],
            rows: [['Members', 42], ['Licences', 7], ['Orders', 3]],
          } : undefined}
          confirmText={confirmVariant === 'danger' ? 'Delete' : confirmVariant === 'success' ? 'Publish' : 'Confirm'}
        />
      </Section>

      {/* ── AlertModal ──────────────────────────────────────────────────── */}
      <Section id="alert-modal" title="AlertModal" subtitle="Single-button acknowledgment dialog — error / warning / info / success.">
        <Card>
          <CardContent>
            <Row>
              {(['error', 'warning', 'info', 'success'] as const).map((v) => (
                <Button
                  key={v}
                  variant={v === 'error' ? 'danger' : 'outline'}
                  onClick={() => { setAlertVariant(v); setAlertOpen(true) }}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </Row>
          </CardContent>
        </Card>
        <AlertModal
          isOpen={alertOpen}
          onClose={() => setAlertOpen(false)}
          variant={alertVariant}
          title={
            alertVariant === 'error' ? 'Something went wrong' :
            alertVariant === 'warning' ? 'Heads up' :
            alertVariant === 'success' ? 'Done!' : 'Information'
          }
          message={
            alertVariant === 'error' ? 'The server returned a 500 error. Please try again later.' :
            alertVariant === 'warning' ? 'This action will affect 12 members.' :
            alertVariant === 'success' ? 'Your changes have been saved successfully.' :
            'Your session will expire in 10 minutes.'
          }
        />
      </Section>

      {/* ── Skeleton presets ────────────────────────────────────────────── */}
      <Section id="skeleton-presets" title="Skeleton Presets" subtitle="TableSkeleton · GridSkeleton · ProfileSkeleton · SettingsSkeleton — all built on the base Skeleton.">
        <div className="space-y-8">
          <div><Label>TableSkeleton (rows=4, cols=4)</Label><TableSkeleton rows={4} cols={4} /></div>
          <div><Label>GridSkeleton (count=3)</Label><GridSkeleton count={3} /></div>
          <div>
            <Label>ProfileSkeleton</Label>
            <div className="rounded-2xl border border-gray-100 bg-white p-6"><ProfileSkeleton /></div>
          </div>
          <div>
            <Label>SettingsSkeleton</Label>
            <div className="rounded-2xl border border-gray-100 bg-white p-6"><SettingsSkeleton /></div>
          </div>
        </div>
      </Section>

      {/* ── DashboardFullPage ───────────────────────────────────────────── */}
      <Section id="dashboard-full-page" title="DashboardFullPage" subtitle="Full-bleed gradient surface for add / edit / detail flows. Bleeds to the edges of the content area.">
        <Card>
          <CardContent>
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 180 }}>
              <DashboardFullPage className="!min-h-0 h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-title3 font-semibold text-label-primary">Full-bleed surface</p>
                  <p className="text-callout text-label-secondary mt-1">bg-gradient-to-b from-[#eceef2] via-[#e6e8ed] to-[#eef0f4]</p>
                </div>
              </DashboardFullPage>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ── Badge extended variants ─────────────────────────────────────── */}
      <Section id="badge-extended" title="Badge — Extended Variants" subtitle="New variants: expired · dead · navy · saffron · green (matching the sales frontend status system).">
        <Card>
          <CardContent className="space-y-4">
            <div>
              <Label>Original</Label>
              <Row>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="active">Active</Badge>
                <Badge variant="pending">Pending</Badge>
                <Badge variant="inactive">Inactive</Badge>
                <Badge variant="rejected">Rejected</Badge>
              </Row>
            </div>
            <div>
              <Label>New</Label>
              <Row>
                <Badge variant="expired">Expired</Badge>
                <Badge variant="dead">Dead</Badge>
                <Badge variant="navy">Navy</Badge>
                <Badge variant="saffron">Saffron</Badge>
                <Badge variant="green">Green</Badge>
              </Row>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* ── Card hoverable ──────────────────────────────────────────────── */}
      <Section id="card-hoverable" title="Card — Hoverable prop" subtitle="Pass hoverable for cursor-pointer + lift + primary-color border on hover.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card hoverable>
            <CardContent>
              <p className="font-semibold text-label-primary">Hoverable</p>
              <p className="text-callout text-label-secondary mt-1">Lift + border on hover</p>
            </CardContent>
          </Card>
          <Card hoverable variant="elevated">
            <CardContent>
              <p className="font-semibold text-label-primary">Elevated + hoverable</p>
              <p className="text-callout text-label-secondary mt-1">Stronger base shadow</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="font-semibold text-label-primary">Normal card</p>
              <p className="text-callout text-label-secondary mt-1">No hover effect</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── LanguageSwitcher ────────────────────────────────────────────── */}
      <Section id="language-switcher" title="LanguageSwitcher" subtitle="Generic i18n dropdown. Configurable options, size, onDark background, and dropUp direction.">
        <Card>
          <CardContent>
            <div className="flex flex-wrap gap-8 items-end">
              <div>
                <Label>Default (md)</Label>
                <LanguageSwitcher
                  options={[
                    { code: 'en', label: 'English', shortLabel: 'EN' },
                    { code: 'hi', label: 'हिन्दी',  shortLabel: 'HI', nativeLabel: 'हिन्दी' },
                    { code: 'mr', label: 'Marathi', shortLabel: 'MR', nativeLabel: 'मराठी' },
                  ]}
                  value={language}
                  onChange={setLanguage}
                />
              </div>
              <div>
                <Label>Compact (sm)</Label>
                <LanguageSwitcher
                  options={[
                    { code: 'en', label: 'English', shortLabel: 'EN' },
                    { code: 'hi', label: 'हिन्दी',  shortLabel: 'HI', nativeLabel: 'हिन्दी' },
                  ]}
                  value={language}
                  onChange={setLanguage}
                  size="sm"
                />
              </div>
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <Label>On dark</Label>
                <LanguageSwitcher
                  options={[
                    { code: 'en', label: 'English', shortLabel: 'EN' },
                    { code: 'hi', label: 'हिन्दी',  shortLabel: 'HI', nativeLabel: 'हिन्दी' },
                  ]}
                  value={language}
                  onChange={setLanguage}
                  onDark
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

    </div>
  )
}
`
}

export function genFormBuilderPage(): string {
  return `'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical, Copy, Trash2, Plus, X,
  AlignLeft, AlignJustify, Calendar, Paperclip,
  SeparatorHorizontal, CircleDot, CheckSquare, ChevronDownSquare,
  ChevronDown, ChevronLeft, ChevronRight,
  BookOpen, Save, Send, Settings, ListChecks, ShieldCheck, MapPin,
} from 'lucide-react'
import { Card, CardContent, Button, Input, Select, Textarea, Switch } from '@lucifer91299/ui'

// ── Types ─────────────────────────────────────────────────────────────────────

type QuestionType = 'short_answer' | 'paragraph' | 'multiple_choice' | 'checkboxes' | 'dropdown' | 'date' | 'file_upload' | 'section_header'
type PresetType   = 'name' | 'email' | 'contact_number' | 'aadhar_number' | 'residential_address' | 'date_of_birth' | 'state' | 'gender'

interface QuestionObject {
  id: string
  type: QuestionType
  label: string
  description?: string
  required: boolean
  options?: string[]
  order: number
  preset?: PresetType
}

interface PresetSelection {
  type: QuestionType
  preset?: PresetType
}

// ── Constants ─────────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
]

const GENDER_OPTIONS = ['male', 'female', 'other']

const PRESET_DEFAULT_LABELS: Record<string, string> = {
  name: 'Full Name', email: 'Email Address', contact_number: 'Contact Number',
  aadhar_number: 'Aadhar Card Number', residential_address: 'Residential Address',
  date_of_birth: 'Date of Birth', state: 'State', gender: 'Gender',
}

const PRESET_VALIDATION_INFO: Record<PresetType, string> = {
  name:                 'Letters, spaces, hyphens, apostrophes, and periods only',
  email:                'Must be a valid email address',
  contact_number:       '10-digit mobile number starting with 6, 7, 8, or 9',
  aadhar_number:        '12-digit Aadhar number',
  residential_address:  'Free-text address',
  date_of_birth:        'Valid past date required',
  state:                'Must match an entry from the states list',
  gender:               'Auto-filled from the user profile',
}

// ── Type options & icons ──────────────────────────────────────────────────────

interface TypeOption { value: QuestionType; label: string; subItems?: { preset: PresetType; label: string }[] }

const TYPE_OPTIONS: TypeOption[] = [
  { value: 'short_answer',    label: 'Short Answer',    subItems: [{ preset: 'name', label: 'Name' }, { preset: 'email', label: 'Email' }, { preset: 'contact_number', label: 'Contact Number' }, { preset: 'aadhar_number', label: 'Aadhar Number' }] },
  { value: 'paragraph',       label: 'Paragraph',       subItems: [{ preset: 'residential_address', label: 'Residential Address' }] },
  { value: 'dropdown',        label: 'Dropdown',        subItems: [{ preset: 'state', label: 'State' }] },
  { value: 'multiple_choice', label: 'Multiple Choice', subItems: [{ preset: 'gender', label: 'Gender' }] },
  { value: 'date',            label: 'Date',            subItems: [{ preset: 'date_of_birth', label: 'Date of Birth' }] },
  { value: 'checkboxes',      label: 'Checkboxes' },
  { value: 'file_upload',     label: 'File Upload' },
  { value: 'section_header',  label: 'Section Header' },
]

const TYPE_ICONS: Record<QuestionType, React.ReactNode> = {
  short_answer:    <AlignLeft className="w-3.5 h-3.5" />,
  paragraph:       <AlignJustify className="w-3.5 h-3.5" />,
  multiple_choice: <CircleDot className="w-3.5 h-3.5" />,
  checkboxes:      <CheckSquare className="w-3.5 h-3.5" />,
  dropdown:        <ChevronDownSquare className="w-3.5 h-3.5" />,
  date:            <Calendar className="w-3.5 h-3.5" />,
  file_upload:     <Paperclip className="w-3.5 h-3.5" />,
  section_header:  <SeparatorHorizontal className="w-3.5 h-3.5" />,
}

// ── PresetTypeSelector ────────────────────────────────────────────────────────

function PresetTypeSelector({ currentType, currentPreset, onSelect }: {
  currentType: QuestionType
  currentPreset?: PresetType
  onSelect: (s: PresetSelection) => void
}) {
  const [open, setOpen]               = useState(false)
  const [hoveredType, setHoveredType] = useState<QuestionType | null>(null)
  const [flyoutSide, setFlyoutSide]   = useState<'left' | 'right'>('left')
  const [expandedType, setExpandedType] = useState<QuestionType | null>(null)
  const [isTouch, setIsTouch]         = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)')
    setIsTouch(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    if (!open) return
    const h = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false); setHoveredType(null); setExpandedType(null)
      }
    }
    document.addEventListener('pointerdown', h)
    return () => document.removeEventListener('pointerdown', h)
  }, [open])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const subLabel = TYPE_OPTIONS.find(o => o.value === currentType)?.subItems?.find(s => s.preset === currentPreset)?.label
  const btnLabel = subLabel
    ? \`\${TYPE_OPTIONS.find(o => o.value === currentType)?.label} › \${subLabel}\`
    : (TYPE_OPTIONS.find(o => o.value === currentType)?.label ?? currentType)

  return (
    <div ref={containerRef} className="relative">
      <button type="button"
        onClick={() => { setOpen(o => !o); setHoveredType(null); setExpandedType(null) }}
        className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all min-w-[180px] focus:outline-none"
      >
        <span className="text-gray-400">{TYPE_ICONS[currentType]}</span>
        <span className="flex-1 text-left truncate">{btnLabel}</span>
        <ChevronDown className={\`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 \${open ? 'rotate-180' : ''}\`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
          {TYPE_OPTIONS.map((opt, idx) => {
            const isActive   = currentType === opt.value && !currentPreset
            const hasSubs    = !!(opt.subItems?.length)
            const showSep    = idx > 0 && !!(TYPE_OPTIONS[idx - 1].subItems?.length) && !hasSubs
            const isExpanded = isTouch && expandedType === opt.value
            return (
              <div key={opt.value}>
                {showSep && <div className="my-1 border-t border-gray-100" />}
                <div
                  className="relative"
                  onMouseEnter={!isTouch ? (e) => {
                    if (timerRef.current) clearTimeout(timerRef.current)
                    if (hasSubs) {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setFlyoutSide(rect.left - 184 > 8 ? 'left' : 'right')
                      timerRef.current = setTimeout(() => setHoveredType(opt.value), 80)
                    } else setHoveredType(null)
                  } : undefined}
                  onMouseLeave={!isTouch ? () => { if (timerRef.current) clearTimeout(timerRef.current) } : undefined}
                >
                  <button type="button"
                    onClick={() => {
                      onSelect({ type: opt.value, preset: undefined })
                      if (isTouch && hasSubs) { setExpandedType(p => p === opt.value ? null : opt.value) }
                      else { setOpen(false); setHoveredType(null); setExpandedType(null) }
                    }}
                    className={\`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors \${isActive ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}\`}
                  >
                    <span className={isActive ? 'text-gray-600' : 'text-gray-400'}>{TYPE_ICONS[opt.value]}</span>
                    <span className="flex-1 text-left">{opt.label}</span>
                    {hasSubs && (isTouch
                      ? <ChevronRight className={\`w-3 h-3 text-gray-300 flex-shrink-0 transition-transform \${isExpanded ? 'rotate-90' : ''}\`} />
                      : <ChevronLeft className="w-3 h-3 text-gray-300 flex-shrink-0" />
                    )}
                  </button>

                  {/* Desktop flyout */}
                  {!isTouch && hasSubs && hoveredType === opt.value && (
                    <div
                      className={\`absolute top-0 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 \${flyoutSide === 'left' ? 'right-full mr-1' : 'left-full ml-1'}\`}
                      onMouseEnter={() => { if (timerRef.current) clearTimeout(timerRef.current); setHoveredType(opt.value) }}
                      onMouseLeave={() => setHoveredType(null)}
                    >
                      {opt.subItems!.map(sub => {
                        const isSub = currentType === opt.value && currentPreset === sub.preset
                        return (
                          <button key={sub.preset} type="button"
                            onClick={() => { onSelect({ type: opt.value, preset: sub.preset }); setOpen(false); setHoveredType(null) }}
                            className={\`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors \${isSub ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}\`}
                          >
                            <span className={isSub ? 'text-gray-600' : 'text-gray-400'}>{TYPE_ICONS[opt.value]}</span>
                            {sub.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Mobile accordion */}
                {isTouch && hasSubs && isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/60">
                    {opt.subItems!.map(sub => {
                      const isSub = currentType === opt.value && currentPreset === sub.preset
                      return (
                        <button key={sub.preset} type="button"
                          onClick={() => { onSelect({ type: opt.value, preset: sub.preset }); setOpen(false); setExpandedType(null) }}
                          className={\`w-full flex items-center gap-2.5 pl-8 pr-3 py-2 text-sm transition-colors \${isSub ? 'bg-gray-100 text-gray-800 font-medium' : 'text-gray-500 hover:bg-gray-100'}\`}
                        >
                          <span className={isSub ? 'text-gray-600' : 'text-gray-400'}>{TYPE_ICONS[opt.value]}</span>
                          {sub.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── SortableQuestionCard ──────────────────────────────────────────────────────

function SortableQuestionCard({ question, onUpdate, onDuplicate, onDelete, hasError }: {
  question: QuestionObject
  onUpdate: (u: Partial<QuestionObject>) => void
  onDuplicate: () => void
  onDelete: () => void
  hasError?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  const isSectionHeader = question.type === 'section_header'

  const addOption    = () => onUpdate({ options: [...(question.options ?? []), \`Option \${(question.options?.length ?? 0) + 1}\`] })
  const updateOption = (i: number, v: string) => { const o = [...(question.options ?? [])]; o[i] = v; onUpdate({ options: o }) }
  const removeOption = (i: number) => onUpdate({ options: (question.options ?? []).filter((_, idx) => idx !== i) })

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={\`bg-white border rounded-xl shadow-sm transition-shadow \${isDragging ? 'shadow-lg' : 'hover:shadow-md'} \${hasError ? 'border-red-300' : 'border-gray-200'}\`}
    >
      {/* Top bar: drag handle + type selector */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
        <button type="button" {...attributes} {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none p-0.5"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-gray-400 select-none">
          {isSectionHeader ? 'Section Header' : 'Question'}
        </span>
        <div className="flex-1" />
        {!isSectionHeader && (
          <PresetTypeSelector
            currentType={question.type}
            currentPreset={question.preset}
            onSelect={({ type, preset }) => onUpdate({ type, preset })}
          />
        )}
      </div>

      {/* Label */}
      <div className="px-4 pt-4 pb-3">
        {isSectionHeader ? (
          <input type="text" placeholder="Section title" value={question.label}
            onChange={e => onUpdate({ label: e.target.value })}
            className="w-full text-lg font-bold border-0 border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-1.5 bg-transparent placeholder-gray-300"
          />
        ) : (
          <>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Question Label
            </label>
            <input type="text" placeholder="e.g. What is your full name?" value={question.label}
              onChange={e => onUpdate({ label: e.target.value })}
              className={\`w-full text-sm font-medium rounded-lg px-3 py-2.5 outline-none transition-all border \${
                hasError && !question.label.trim()
                  ? 'bg-red-50 border-red-300 placeholder-red-300 focus:ring-2 focus:ring-red-100'
                  : 'bg-gray-50 border-gray-200 placeholder-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
              }\`}
            />
            {hasError && !question.label.trim() && (
              <p className="text-xs text-red-500 mt-1.5 px-0.5">Question label is required before publishing.</p>
            )}
            {question.preset && (
              <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'var(--primary-soft, rgba(0,0,128,0.06))', border: '1px solid var(--primary-border, rgba(0,0,128,0.12))' }}>
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--primary, #000080)' }} />
                <span className="text-[11px] font-medium" style={{ color: 'var(--primary, #000080)' }}>Validation:</span>
                <span className="text-[11px]" style={{ color: 'var(--primary, #000080)', opacity: 0.7 }}>{PRESET_VALIDATION_INFO[question.preset]}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Body */}
      {!isSectionHeader && (
        <div className="px-4 pb-3 space-y-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Description <span className="normal-case font-normal text-gray-300">(optional)</span>
            </label>
            <Textarea
              value={question.description ?? ''}
              onChange={e => onUpdate({ description: e.target.value || undefined })}
              placeholder="Add helper text visible to the applicant..."
              rows={2}
            />
          </div>

          {/* Answer preview */}
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Answer preview</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {question.type === 'short_answer' && (
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm">
                <AlignLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-400 italic">Short answer text</span>
              </div>
            )}

            {question.type === 'paragraph' && (
              <div className="px-3.5 py-3 border border-gray-300 rounded-lg bg-white shadow-sm space-y-2 min-h-[70px]">
                {['w-full', 'w-5/6', 'w-3/4', 'w-2/5'].map((w, i) => (
                  <div key={i} className={\`h-2 bg-gray-200 rounded-full \${w}\`} />
                ))}
              </div>
            )}

            {question.type === 'date' && (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>DD / MM / YYYY</span>
              </div>
            )}

            {question.type === 'file_upload' && (
              <div className="py-5 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center space-y-1.5">
                <Paperclip className="w-5 h-5 text-gray-400 mx-auto" />
                <p className="text-sm font-medium text-gray-500">Click to upload or drag &amp; drop</p>
                <p className="text-xs text-gray-400">Any file type accepted</p>
              </div>
            )}

            {(question.type === 'multiple_choice' || question.type === 'checkboxes') && (
              <div className="space-y-1.5">
                {(question.preset === 'gender' ? GENDER_OPTIONS : question.options ?? []).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300">
                    {question.type === 'multiple_choice'
                      ? <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      : <span className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0" />
                    }
                    <input type="text" value={opt} placeholder={\`Option \${i + 1}\`}
                      onChange={e => updateOption(i, e.target.value)}
                      disabled={question.preset === 'gender'}
                      className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300"
                    />
                    {question.preset !== 'gender' && (
                      <button type="button" onClick={() => removeOption(i)}
                        disabled={(question.options?.length ?? 0) <= 1}
                        className="w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-0 transition-all flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {question.preset === 'gender'
                  ? <p className="text-xs text-gray-400 px-1">Gender options are auto-populated.</p>
                  : <button type="button" onClick={addOption}
                      className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-200 rounded-lg text-xs font-medium text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                    ><Plus className="w-3.5 h-3.5" /> Add option</button>
                }
              </div>
            )}

            {question.type === 'dropdown' && (
              question.preset === 'state'
                ? <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>States list ({INDIAN_STATES.length} options) — auto-populated</span>
                  </div>
                : <div className="space-y-1.5">
                    {(question.options ?? []).map((opt, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300">
                        <span className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 text-[11px] font-semibold text-gray-400 flex-shrink-0">{i + 1}</span>
                        <input type="text" value={opt} placeholder={\`Option \${i + 1}\`}
                          onChange={e => updateOption(i, e.target.value)}
                          className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-300"
                        />
                        <button type="button" onClick={() => removeOption(i)}
                          disabled={(question.options?.length ?? 0) <= 1}
                          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-400 hover:bg-red-50 disabled:opacity-0 transition-all flex-shrink-0"
                        ><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={addOption}
                      className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-gray-200 rounded-lg text-xs font-medium text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
                    ><Plus className="w-3.5 h-3.5" /> Add option</button>
                  </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end gap-1 px-3 py-2 border-t border-gray-100">
        {!isSectionHeader && (
          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer mr-2 select-none">
            <input type="checkbox" className="w-3.5 h-3.5"
              checked={question.required}
              onChange={e => onUpdate({ required: e.target.checked })}
            />
            Required
          </label>
        )}
        <button type="button" onClick={onDuplicate}
          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          title="Duplicate"
        ><Copy className="w-4 h-4" /></button>
        <button type="button" onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
          title="Delete"
        ><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function createQuestion(order: number): QuestionObject {
  return { id: generateId(), type: 'short_answer', label: '', required: false, order }
}

// ── FormBuilderPage ───────────────────────────────────────────────────────────

export default function FormBuilderPage() {
  const [activeTab, setActiveTab]       = useState<'questions' | 'settings'>('questions')
  const [title, setTitle]               = useState('')
  const [description, setDescription]   = useState('')
  const [targetAudience, setTarget]     = useState('all')
  const [paymentRequired, setPayment]   = useState(false)
  const [price, setPrice]               = useState('')
  const [questions, setQuestions]       = useState<QuestionObject[]>([createQuestion(0)])
  const [questionErrors, setQErrors]    = useState<Set<string>>(new Set())
  const [formErrors, setFormErrors]     = useState<{ title?: string; price?: string; questions?: string }>({})
  const [saved, setSaved]               = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = questions.findIndex(q => q.id === active.id)
    const to   = questions.findIndex(q => q.id === over.id)
    setQuestions(arrayMove(questions, from, to).map((q, i) => ({ ...q, order: i })))
  }

  const addQuestion = () => setQuestions(p => [...p, createQuestion(p.length)])

  const updateQuestion = (id: string, updates: Partial<QuestionObject>) => {
    if (updates.label?.trim()) {
      setQErrors(p => { const n = new Set(p); n.delete(id); return n })
      if (formErrors.questions) setFormErrors(p => ({ ...p, questions: undefined }))
    }
    setQuestions(p => p.map(q => {
      if (q.id !== id) return q
      const u = { ...q, ...updates }
      if (updates.type && updates.type !== q.type && !('preset' in updates)) u.preset = undefined
      if (!['multiple_choice', 'checkboxes', 'dropdown'].includes(u.type)) u.options = undefined
      if (['multiple_choice', 'checkboxes', 'dropdown'].includes(u.type) && !u.options?.length && u.preset !== 'state') u.options = ['Option 1']
      if ('preset' in updates) {
        if (updates.preset === 'state')  u.options = undefined
        if (updates.preset === 'gender') u.options = GENDER_OPTIONS
        if (!updates.preset && (q.preset === 'state' || q.preset === 'gender') && ['dropdown', 'multiple_choice'].includes(u.type)) u.options = ['Option 1']
        const isDefault = !q.label.trim() || Object.values(PRESET_DEFAULT_LABELS).includes(q.label.trim())
        if (updates.preset && isDefault) u.label = PRESET_DEFAULT_LABELS[updates.preset] ?? u.label
        else if (!updates.preset && isDefault) u.label = ''
      }
      return u
    }))
  }

  const duplicateQuestion = (id: string) => {
    const idx   = questions.findIndex(q => q.id === id)
    const clone = { ...questions[idx], id: generateId(), order: idx + 1 }
    setQuestions([...questions.slice(0, idx + 1), clone, ...questions.slice(idx + 1)].map((q, i) => ({ ...q, order: i })))
  }

  const deleteQuestion = (id: string) =>
    setQuestions(p => p.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i })))

  const validate = (forPublish: boolean) => {
    const e: typeof formErrors = {}
    if (!title.trim()) e.title = 'Please enter a form title.'
    if (paymentRequired && (!price || Number(price) <= 0)) e.price = 'Please enter a valid fee greater than 0.'
    const emptyIds = forPublish
      ? questions.filter(q => q.type !== 'section_header' && !q.label.trim()).map(q => q.id)
      : []
    if (emptyIds.length) e.questions = 'All questions must have a label before publishing.'
    return { errors: e, emptyIds }
  }

  const handleSave = () => {
    const { errors } = validate(false)
    if (Object.keys(errors).length) { setFormErrors(errors); return }
    setFormErrors({})
    setSaved(true)
    setTimeout(() => setSaved(false), 3500)
    // Replace with real API call:
    console.log('Draft payload:', { title, description, target_audience: targetAudience, payment_required: paymentRequired, price: paymentRequired ? Number(price) : undefined, questions })
  }

  const handlePublish = () => {
    const { errors, emptyIds } = validate(true)
    if (Object.keys(errors).length || emptyIds.length) {
      setFormErrors(errors); setQErrors(new Set(emptyIds))
      if (emptyIds.length && activeTab !== 'questions') setActiveTab('questions')
      return
    }
    setFormErrors({}); setQErrors(new Set())
    setSaved(true)
    setTimeout(() => setSaved(false), 3500)
    // Replace with real API call:
    console.log('Publish payload:', { title, description, target_audience: targetAudience, payment_required: paymentRequired, price: paymentRequired ? Number(price) : undefined, questions })
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--primary-soft, rgba(0,0,128,0.07))' }}>
          <BookOpen className="w-[18px] h-[18px]" style={{ color: 'var(--primary, #000080)' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-label-primary leading-tight">Form Builder</h1>
          <p className="text-xs text-label-tertiary">Build dynamic forms with drag &amp; drop questions</p>
        </div>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
          ✓ Form saved — check the browser console for the payload. Wire up your API in handleSave / handlePublish.
        </div>
      )}

      {/* Form title + description card */}
      <Card className="overflow-hidden">
        <div className="h-1" style={{ background: 'var(--primary, #000080)' }} />
        <CardContent className="pt-5 space-y-4">
          <div>
            <input type="text" placeholder="Form Title" value={title}
              onChange={e => { setTitle(e.target.value); if (formErrors.title) setFormErrors(p => ({ ...p, title: undefined })) }}
              className={\`w-full text-2xl font-bold border-0 border-b-2 focus:outline-none pb-2 bg-transparent placeholder-gray-300 \${formErrors.title ? 'border-red-400' : 'border-gray-200'}\`}
            />
            {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
          </div>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Form description (optional)" rows={2} />
        </CardContent>
      </Card>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {([
          { id: 'questions' as const, Icon: ListChecks, label: 'Questions' },
          { id: 'settings'  as const, Icon: Settings,   label: 'Settings'  },
        ]).map(({ id, Icon, label }) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)}
            className={\`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors \${activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}\`}
            style={activeTab === id ? { borderColor: 'var(--primary, #000080)', color: 'var(--primary, #000080)' } : undefined}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Questions tab */}
      {activeTab === 'questions' && (
        <div className="space-y-5">
          {formErrors.questions && <p className="text-red-500 text-sm px-1">{formErrors.questions}</p>}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
              {questions.map(q => (
                <SortableQuestionCard
                  key={q.id}
                  question={q}
                  onUpdate={u => updateQuestion(q.id, u)}
                  onDuplicate={() => duplicateQuestion(q.id)}
                  onDelete={() => deleteQuestion(q.id)}
                  hasError={questionErrors.has(q.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button type="button" onClick={addQuestion}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary, #000080)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
          >
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardContent className="pt-5 space-y-5">
            <Select
              label="Target Audience"
              value={targetAudience}
              onChange={setTarget}
              options={[
                { value: 'all',    label: 'All Users'    },
                { value: 'admin',  label: 'Admins Only'  },
                { value: 'member', label: 'Members Only' },
              ]}
            />

            <Switch
              label="Payment Required"
              description="Users must pay to submit this form"
              checked={paymentRequired}
              onChange={setPayment}
            />

            {paymentRequired && (
              <Input
                label="Fee Amount"
                type="number"
                min="0"
                placeholder="e.g. 500"
                value={price}
                onChange={e => { setPrice(e.target.value); if (formErrors.price) setFormErrors(p => ({ ...p, price: undefined })) }}
                error={formErrors.price}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Sticky action footer */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 py-3 flex justify-end gap-3">
        <Button variant="outline" onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Save as Draft
        </Button>
        <Button variant="primary" onClick={handlePublish} className="flex items-center gap-2">
          <Send className="w-4 h-4" /> Publish Now
        </Button>
      </div>
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
  const [dob,      setDob]      = useState('')
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
                <Switch label="Email alerts"  checked={notifs}     onChange={setNotifs} />
                <Switch label="Newsletter"    checked={newsletter} onChange={setNewsletter} />
                <Switch label="Dark mode"     checked={darkMode}   onChange={setDarkMode} />
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
