import type { ScaffoldOptions } from './types'

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

// ── Page ─────────────────────────────────────────────────────────────────────
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
      // ── Identity ────────────────────────────────────────────────────────
      projectName="${o.projectName}"
      projectSubtitle="Reset your password"
      logoSrc="/brand/logo.svg"
      logoAlt="${o.projectName} logo"
      logoSize={56}

      // ── State ───────────────────────────────────────────────────────────────
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      isSuccess={isSuccess}

      // ── Success screen text ─────────────────────────────────────────────────
      successMessage="Check your email"
      successSubMessage="We've sent a password reset link to your email address. Follow the link to create a new password."

      // ── Navigation ──────────────────────────────────────────────────────────
      onBackToLogin={() => router.push('/login')}
      backToLoginHref="/login"

      // ── Powered-by badge ────────────────────────────────────────────────────
      poweredBy={{
        logoSrc: "/brand/powered-by-logo.svg",
        text: "Powered by",
        href: "#",
      }}

      // ── Background ──────────────────────────────────────────────────────────
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
      // ── Identity ────────────────────────────────────────────────────────
      projectName="${o.projectName}"
      projectSubtitle="Set a new password"
      logoSrc="/brand/logo.svg"
      logoAlt="${o.projectName} logo"
      logoSize={56}

      // ── Token validation state ─────────────────────────────────────────────
      isValidating={isValidating}
      isValid={isValid}

      // ── Form state ──────────────────────────────────────────────────────────
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      isSuccess={isSuccess}

      // ── Password rules ──────────────────────────────────────────────────────
      minPasswordLength={6}

      // ── Custom messages ─────────────────────────────────────────────────────
      validatingMessage="Checking reset link…"
      invalidMessage="Reset link expired"
      invalidSubMessage="This reset link is invalid, expired, or has already been used. Please request a new one."
      successMessage="Password updated"
      successSubMessage="Your password has been changed. You can now sign in with your new password."

      // ── Navigation ──────────────────────────────────────────────────────────
      onBackToLogin={() => router.push('/login')}
      backToLoginHref="/login"

      // ── Powered-by badge ────────────────────────────────────────────────────
      poweredBy={{
        logoSrc: "/brand/powered-by-logo.svg",
        text: "Powered by",
        href: "#",
      }}

      // ── Background ──────────────────────────────────────────────────────────
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
      // ── Identity ────────────────────────────────────────────────────────
      projectName="${o.projectName}"
      projectSubtitle="Create your account"
      logoSrc="/brand/logo.svg"
      logoAlt="${o.projectName} logo"
      logoSize={40}

      // ── Steps ────────────────────────────────────────────────────────────────
      steps={STEPS}
      currentStep={currentStep}

      // ── Navigation ──────────────────────────────────────────────────────────
      onNext={handleNext}
      onBack={() => { setError(null); setCurrentStep(s => s - 1) }}
      onSubmit={handleSubmit}
      nextLabel="Continue"
      backLabel="Back"
      submitLabel="Create Account"
      isLoading={isLoading}
      error={error}

      // ── Login link ──────────────────────────────────────────────────────────
      onLoginLink={() => router.push('/login')}
      loginLabel="Already have an account? Sign in"

      // ── Layout ───────────────────────────────────────────────────────────────
      maxWidth="max-w-2xl"

      // ── Powered-by badge ────────────────────────────────────────────────────
      poweredBy={{
        logoSrc: "/brand/powered-by-logo.svg",
        text: "Powered by",
        href: "#",
      }}

      // ── Background ──────────────────────────────────────────────────────────
      // backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
      // ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
      // socialLinks={[...]}
    >
      {/* ── Step 1: Account ─────────────────────────────────────────────────── */}
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

      {/* ── Step 2: Profile ─────────────────────────────────────────────────── */}
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

      {/* ── Step 3: Review ──────────────────────────────────────────────────── */}
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
