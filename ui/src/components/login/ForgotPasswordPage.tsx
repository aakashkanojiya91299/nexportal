'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Mail,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { AuthPageShell, type AmbientColor } from './AuthPageShell'
import type { SocialLink } from '../layout/SocialLinks'

/* ── Shared internals ────────────────────────────────────────────────────── */

function TricolorStripe({ reverse = false }: { reverse?: boolean }) {
  return (
    <div
      className="tricolor-bar tricolor-sweep"
      style={reverse ? { transform: 'scaleX(-1)', transformOrigin: 'right' } : undefined}
    />
  )
}

function SocialIconLink({ link }: { link: SocialLink }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        color:       hovered && link.brand ? link.brand          : undefined,
        borderColor: hovered && link.brand ? `${link.brand}55`   : undefined,
        boxShadow:   hovered && link.brand ? `0 6px 18px ${link.brand}33` : undefined,
      }}
      className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 focus:outline-none"
    >
      {link.icon}
    </a>
  )
}

/* ── Props ───────────────────────────────────────────────────────────────── */

export interface ForgotPasswordPageProps {
  /** App / project name displayed in the page header */
  projectName: string
  /** Subtitle under the project name; default "Reset your password" */
  projectSubtitle?: string
  /** URL of the logo image shown next to the project name */
  logoSrc?: string
  /** Alt text for the logo; falls back to projectName */
  logoAlt?: string
  /** Logo display size in px; default 56 */
  logoSize?: number

  /**
   * Called with the validated email when the user submits.
   * Throw an `Error` (or return a rejected promise) to show an error banner.
   */
  onSubmit: (email: string) => Promise<void>
  /** True while the submit network request is in-flight */
  isLoading: boolean
  /** External / server error message — displayed in the error banner */
  error?: string | null

  /**
   * When true the success confirmation screen replaces the form.
   * Set this to true after `onSubmit` resolves successfully.
   */
  isSuccess?: boolean
  /** Primary success message; default "Check your email" */
  successMessage?: string
  /** Secondary success message shown below successMessage */
  successSubMessage?: string

  /**
   * Click handler for the "Back to Sign In" link.
   * Use this for SPA client-side navigation (e.g. `router.push('/login')`).
   * When omitted, `backToLoginHref` is used as a plain anchor href.
   */
  onBackToLogin?: () => void
  /** Href for the "Back to Sign In" anchor; default "/login" */
  backToLoginHref?: string

  /**
   * Social icon links rendered below the card with a label.
   * Each item: `{ label, href, icon: ReactNode, brand?: '#hex' }`.
   * The `brand` color is used for hover glow + icon tint.
   */
  socialLinks?: SocialLink[]
  /** Label above social icons; default "Connect with us" */
  socialLinksLabel?: string

  /**
   * "Powered by" badge in the bottom-right corner.
   * Provide `logoSrc` and optionally `text` / `href`.
   */
  poweredBy?: { logoSrc: string; text?: string; href?: string }

  /**
   * Three RGB tuples for the ambient glow blobs [top-right, bottom-left, center].
   * Default: saffron, green, navy.
   * Example: `[[255,153,51],[19,136,8],[0,0,128]]`
   */
  ambientColors?: [AmbientColor, AmbientColor, AmbientColor]

  /** Override the page background CSS gradient */
  backgroundGradient?: string

  className?: string
  style?: React.CSSProperties
}

/* ── ForgotPasswordPage ──────────────────────────────────────────────────── */

/**
 * Full-page "Forgot Password" screen that matches the LoginPage animated design.
 *
 * Minimal usage:
 * ```tsx
 * <ForgotPasswordPage
 *   projectName="My Portal"
 *   logoSrc="/logo.png"
 *   onSubmit={async (email) => { await api.forgotPassword(email) }}
 *   isLoading={loading}
 *   error={error}
 *   isSuccess={sent}
 *   onBackToLogin={() => router.push('/login')}
 * />
 * ```
 *
 * Full usage with all props:
 * ```tsx
 * <ForgotPasswordPage
 *   projectName="My Portal"
 *   projectSubtitle="Reset your password"
 *   logoSrc="/logo.png"
 *   logoAlt="My Portal Logo"
 *   logoSize={56}
 *   onSubmit={handleForgotPassword}
 *   isLoading={isLoading}
 *   error={error}
 *   isSuccess={isSuccess}
 *   successMessage="Check your email"
 *   successSubMessage="We sent a reset link to your inbox."
 *   onBackToLogin={() => router.push('/login')}
 *   backToLoginHref="/login"
 *   socialLinks={[
 *     { label: 'WhatsApp', href: '#', icon: <WhatsAppIcon />, brand: '#25D366' },
 *   ]}
 *   socialLinksLabel="Connect with us"
 *   poweredBy={{ logoSrc: '/sts-logo.svg', text: 'Powered by', href: 'https://stspl.com' }}
 *   ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
 *   backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
 * />
 * ```
 */
export function ForgotPasswordPage({
  projectName,
  projectSubtitle = 'Reset your password',
  logoSrc,
  logoAlt,
  logoSize = 56,
  onSubmit,
  isLoading,
  error,
  isSuccess = false,
  successMessage = 'Check your email',
  successSubMessage = "We've sent a password reset link to your email address. Follow the link to create a new password.",
  onBackToLogin,
  backToLoginHref = '/login',
  socialLinks,
  socialLinksLabel = 'Connect with us',
  poweredBy,
  ambientColors,
  backgroundGradient,
  className,
  style,
}: ForgotPasswordPageProps) {
  const [email, setEmail]                 = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const displayError = error ?? validationError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    if (!email.trim()) { setValidationError('Email address is required'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError('Enter a valid email address'); return
    }
    await onSubmit(email.trim())
  }

  const glowRgb = (ambientColors ?? [[255, 153, 51]])[0].join(',')

  return (
    <AuthPageShell
      backgroundGradient={backgroundGradient}
      ambientColors={ambientColors}
      poweredBy={poweredBy}
      className={className}
      style={style}
    >
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* ── Logo + title ── */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-5"
        >
          <div className="flex items-center gap-3.5">
            {logoSrc && (
              <div className="relative flex-shrink-0">
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, rgba(${glowRgb},0.2) 0%, transparent 70%)`,
                    filter: 'blur(22px)', transform: 'scale(2.0)',
                  }}
                  animate={{ opacity: [0.45, 0.8, 0.45] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <img
                  src={logoSrc}
                  alt={logoAlt ?? projectName}
                  className="object-contain rounded-full relative"
                  style={{ width: logoSize, height: logoSize }}
                />
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <motion.h1
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[19px] font-bold tracking-tight whitespace-nowrap"
                style={{ color: 'var(--primary, #000080)', letterSpacing: '-0.01em' }}
              >
                {projectName}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="text-[13px] text-gray-400 mt-1"
              >
                {projectSubtitle}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
          className="w-full bg-white rounded-2xl overflow-hidden"
        >
          <TricolorStripe />

          <div className="px-7 py-6">
            <AnimatePresence mode="wait">

              {/* ── Success state ── */}
              {isSuccess ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-2"
                >
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 mb-2">{successMessage}</h2>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{successSubMessage}</p>
                  {onBackToLogin ? (
                    <button
                      type="button"
                      onClick={onBackToLogin}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150 focus:outline-none"
                      style={{ color: 'var(--primary, #000080)' }}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </button>
                  ) : (
                    <a
                      href={backToLoginHref}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150"
                      style={{ color: 'var(--primary, #000080)' }}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </a>
                  )}
                </motion.div>
              ) : (

              /* ── Form state ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  noValidate
                >
                  {/* Icon header */}
                  <div className="flex items-center gap-3 pb-1">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--primary-soft, rgba(0,0,128,0.08))', color: 'var(--primary, #000080)' }}
                    >
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Enter your email</p>
                      <p className="text-xs text-gray-400 mt-0.5">We'll send a reset link right away</p>
                    </div>
                  </div>

                  {/* Email input */}
                  <div className="w-full">
                    <label
                      htmlFor="fp-email"
                      className="block text-subhead font-medium text-label-primary mb-2"
                    >
                      Email address
                    </label>
                    <input
                      id="fp-email"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setValidationError(null) }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      autoFocus
                      className="input-base"
                    />
                  </div>

                  {/* Error banner */}
                  <AnimatePresence>
                    {displayError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{displayError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <div className="pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full h-11 text-sm font-semibold"
                      isLoading={isLoading}
                    >
                      {!isLoading && (
                        <span className="flex items-center justify-center gap-2">
                          Send Reset Link <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Back to login */}
                  <div className="text-center">
                    {onBackToLogin ? (
                      <button
                        type="button"
                        onClick={onBackToLogin}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold transition-colors duration-150 focus:outline-none"
                        style={{ color: 'var(--primary, #000080)' }}
                      >
                        <ArrowLeft className="w-3 h-3" /> Back to Sign In
                      </button>
                    ) : (
                      <a
                        href={backToLoginHref}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold transition-colors duration-150"
                        style={{ color: 'var(--primary, #000080)' }}
                      >
                        <ArrowLeft className="w-3 h-3" /> Back to Sign In
                      </a>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <TricolorStripe reverse />
        </motion.div>

        {/* ── Social links ── */}
        {socialLinks && socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-5 flex flex-col items-center"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gray-400 mb-3">
              {socialLinksLabel}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(link => (
                <SocialIconLink key={link.label} link={link} />
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </AuthPageShell>
  )
}
