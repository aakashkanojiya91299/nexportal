'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Loader2,
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

export interface ResetPasswordPageProps {
  /** App / project name displayed in the page header */
  projectName: string
  /** Subtitle under the project name; default "Set a new password" */
  projectSubtitle?: string
  /** URL of the logo image */
  logoSrc?: string
  /** Alt text for the logo; falls back to projectName */
  logoAlt?: string
  /** Logo display size in px; default 56 */
  logoSize?: number

  /**
   * True while the page is verifying the reset token on initial mount.
   * Shows a spinner / loading state in the card.
   */
  isValidating?: boolean
  /**
   * Whether the reset token is valid.
   * Only read when `isValidating` is false.
   * Set to `false` to show the "link expired / invalid" screen.
   * Defaults to `true` so the form is shown immediately if you don't validate server-side.
   */
  isValid?: boolean
  /**
   * True after the password has been successfully updated.
   * Flip to true after `onSubmit` resolves successfully to show the success screen.
   */
  isSuccess?: boolean

  /**
   * Called with the new password when the form is submitted.
   * Throw an `Error` to display an error banner.
   */
  onSubmit: (password: string) => Promise<void>
  /** True while the submit request is in-flight */
  isLoading: boolean
  /** External / server error message */
  error?: string | null

  /** Primary success message; default "Password updated" */
  successMessage?: string
  /** Secondary success message */
  successSubMessage?: string
  /** Primary invalid-token message; default "Reset link expired" */
  invalidMessage?: string
  /** Secondary invalid-token message */
  invalidSubMessage?: string
  /** Text shown while validating the token; default "Checking reset link…" */
  validatingMessage?: string

  /**
   * Minimum password length enforced client-side.
   * An error banner is shown if the password is shorter.
   * Default: 6.
   */
  minPasswordLength?: number

  /**
   * Click handler for the "Back to Sign In" link (SPA navigation).
   * When omitted, `backToLoginHref` is used as a plain anchor href.
   */
  onBackToLogin?: () => void
  /** Href for the "Back to Sign In" anchor; default "/login" */
  backToLoginHref?: string

  /**
   * Social icon links below the card.
   * Each item: `{ label, href, icon: ReactNode, brand?: '#hex' }`.
   */
  socialLinks?: SocialLink[]
  /** Label above social icons; default "Connect with us" */
  socialLinksLabel?: string

  /** "Powered by" badge in the bottom-right corner */
  poweredBy?: { logoSrc: string; text?: string; href?: string }

  /**
   * Three RGB tuples for ambient glow blobs [top-right, bottom-left, center].
   * Default: saffron, green, navy.
   */
  ambientColors?: [AmbientColor, AmbientColor, AmbientColor]
  /** Override background CSS gradient */
  backgroundGradient?: string

  className?: string
  style?: React.CSSProperties
}

/* ── ResetPasswordPage ───────────────────────────────────────────────────── */

/**
 * Full-page "Reset Password" screen (set a new password after clicking an email link).
 *
 * Three internal states controlled by props:
 * 1. **Validating** (`isValidating=true`) — spinner while the token is being checked.
 * 2. **Invalid** (`isValidating=false, isValid=false`) — "link expired" message.
 * 3. **Form** (`isValidating=false, isValid=true`) — new-password form.
 * 4. **Success** (`isSuccess=true`) — confirmation screen.
 *
 * Minimal usage:
 * ```tsx
 * <ResetPasswordPage
 *   projectName="My Portal"
 *   logoSrc="/logo.png"
 *   isValidating={checking}
 *   isValid={tokenValid}
 *   isSuccess={done}
 *   onSubmit={async (pwd) => { await api.resetPassword(token, pwd) }}
 *   isLoading={loading}
 *   error={error}
 *   onBackToLogin={() => router.push('/login')}
 * />
 * ```
 *
 * Full usage with all props:
 * ```tsx
 * <ResetPasswordPage
 *   projectName="My Portal"
 *   projectSubtitle="Set a new password"
 *   logoSrc="/logo.png"
 *   logoAlt="My Portal Logo"
 *   logoSize={56}
 *   isValidating={checking}
 *   isValid={tokenValid}
 *   isSuccess={done}
 *   onSubmit={handleResetPassword}
 *   isLoading={isLoading}
 *   error={error}
 *   successMessage="Password updated"
 *   successSubMessage="You can now sign in with your new password."
 *   invalidMessage="Reset link expired"
 *   invalidSubMessage="This link is invalid or has already been used."
 *   validatingMessage="Checking reset link…"
 *   minPasswordLength={8}
 *   onBackToLogin={() => router.push('/login')}
 *   backToLoginHref="/login"
 *   socialLinks={socialLinks}
 *   socialLinksLabel="Connect with us"
 *   poweredBy={{ logoSrc: '/sts-logo.svg', href: 'https://stspl.com' }}
 *   ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
 *   backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
 * />
 * ```
 */
export function ResetPasswordPage({
  projectName,
  projectSubtitle = 'Set a new password',
  logoSrc,
  logoAlt,
  logoSize = 56,
  isValidating = false,
  isValid = true,
  isSuccess = false,
  onSubmit,
  isLoading,
  error,
  successMessage = 'Password updated',
  successSubMessage = 'Your password has been changed. You can now sign in with your new password.',
  invalidMessage = 'Reset link expired',
  invalidSubMessage = 'This reset link is invalid, expired, or has already been used. Please request a new one.',
  validatingMessage = 'Checking reset link…',
  minPasswordLength = 6,
  onBackToLogin,
  backToLoginHref = '/login',
  socialLinks,
  socialLinksLabel = 'Connect with us',
  poweredBy,
  ambientColors,
  backgroundGradient,
  className,
  style,
}: ResetPasswordPageProps) {
  const [password, setPassword]           = useState('')
  const [confirm, setConfirm]             = useState('')
  const [showPwd, setShowPwd]             = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const displayError = error ?? validationError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    if (!password) { setValidationError('Password is required'); return }
    if (password.length < minPasswordLength) {
      setValidationError(`Password must be at least ${minPasswordLength} characters`); return
    }
    if (password !== confirm) { setValidationError('Passwords do not match'); return }
    await onSubmit(password)
  }

  const glowRgb = (ambientColors ?? [[255, 153, 51]])[0].join(',')

  const backLink = onBackToLogin ? (
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
  )

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

              {/* ── Validating ── */}
              {isValidating && (
                <motion.div key="validating"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="py-10 flex flex-col items-center gap-3"
                >
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary, #000080)' }} />
                  <p className="text-sm text-gray-500">{validatingMessage}</p>
                </motion.div>
              )}

              {/* ── Invalid token ── */}
              {!isValidating && !isValid && (
                <motion.div key="invalid"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-2"
                >
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-7 h-7 text-red-500" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 mb-2">{invalidMessage}</h2>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{invalidSubMessage}</p>
                  {backLink}
                </motion.div>
              )}

              {/* ── Success ── */}
              {!isValidating && isValid && isSuccess && (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-2"
                >
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 mb-2">{successMessage}</h2>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">{successSubMessage}</p>
                  {backLink}
                </motion.div>
              )}

              {/* ── Form ── */}
              {!isValidating && isValid && !isSuccess && (
                <motion.form key="form"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  noValidate
                >
                  {/* Icon header */}
                  <div className="flex items-center gap-3 pb-1">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--primary-soft, rgba(0,0,128,0.08))', color: 'var(--primary, #000080)' }}
                    >
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Create a new password</p>
                      <p className="text-xs text-gray-400 mt-0.5">This link can be used only once</p>
                    </div>
                  </div>

                  {/* New password */}
                  <div className="w-full">
                    <label htmlFor="rp-password" className="block text-subhead font-medium text-label-primary mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="rp-password"
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setValidationError(null) }}
                        placeholder={`Minimum ${minPasswordLength} characters`}
                        autoComplete="new-password"
                        autoFocus
                        className="input-base pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPwd ? 'Hide password' : 'Show password'}
                        aria-pressed={showPwd}
                      >
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="w-full">
                    <label htmlFor="rp-confirm" className="block text-subhead font-medium text-label-primary mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="rp-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm}
                        onChange={e => { setConfirm(e.target.value); setValidationError(null) }}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className="input-base pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        aria-pressed={showConfirm}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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
                      {!isLoading && 'Reset Password'}
                    </Button>
                  </div>

                  {/* Back to login */}
                  <div className="text-center">{backLink}</div>
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
