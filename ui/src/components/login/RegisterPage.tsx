'use client'

import React, { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'
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
  const [hovered, setHovered] = React.useState(false)
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

/* ── StepIndicator ───────────────────────────────────────────────────────── */

function StepIndicator({
  steps,
  current,
}: {
  steps: { label: string }[]
  current: number
}) {
  return (
    <div className="flex items-center w-full mb-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center min-w-max mx-auto">
        {steps.map((step, i) => {
          const isComplete = i < current
          const isCurrent  = i === current
          const isLast     = i === steps.length - 1
          return (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all duration-300',
                  isComplete
                    ? 'border-transparent text-white'
                    : isCurrent
                    ? 'bg-white text-[color:var(--primary,#000080)] border-[color:var(--primary,#000080)]'
                    : 'bg-white/60 text-gray-400 border-gray-300',
                )}
                  style={isComplete ? { background: 'var(--primary, #000080)' } : undefined}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={cn(
                  'mt-1.5 text-[10px] font-semibold whitespace-nowrap',
                  isCurrent  ? 'text-white'
                    : isComplete ? 'text-white/80'
                    : 'text-white/50',
                )}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={cn(
                  'w-8 h-0.5 mx-2 flex-shrink-0 rounded transition-all duration-300',
                  isComplete ? 'bg-white/80' : 'bg-white/25',
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

/* ── Props ───────────────────────────────────────────────────────────────── */

export interface RegisterStep {
  /** Short label shown in the step progress bar */
  label: string
  /** Optional description shown as a subtitle inside the card */
  description?: string
}

export interface RegisterPageProps {
  /** App / project name displayed in the header bar */
  projectName: string
  /** Subtitle under the project name; default "Create your account" */
  projectSubtitle?: string
  /** URL of the logo image */
  logoSrc?: string
  /** Alt text for the logo; falls back to projectName */
  logoAlt?: string
  /** Logo display size in px; default 40 */
  logoSize?: number

  /** Step definitions for the progress indicator (minimum 1) */
  steps: RegisterStep[]
  /** 0-indexed currently active step */
  currentStep: number

  /**
   * Called when the "Next" button is clicked.
   * Use this to validate the current step before advancing.
   */
  onNext?: () => void
  /** Called when the "Back" button is clicked */
  onBack?: () => void
  /** Called when the "Submit" button is clicked on the last step */
  onSubmit?: () => void

  /** Label for the Next button; default "Next" */
  nextLabel?: string
  /** Label for the Back button; default "Back" */
  backLabel?: string
  /** Label for the Submit button on the final step; default "Submit" */
  submitLabel?: string

  /**
   * True while a next/submit async action is in-flight.
   * Disables nav buttons and shows a spinner on the active action button.
   */
  isLoading?: boolean
  /** External error message shown in a red banner above the nav buttons */
  error?: string | null

  /**
   * Form content for the current step.
   * Rendered inside the white card between the step header and nav buttons.
   * Use any form inputs here — they're not wrapped in a `<form>` tag.
   */
  children: ReactNode

  /**
   * Callback for the "Already have an account? Sign in" link.
   * Use for SPA navigation. When omitted, `loginHref` is used.
   */
  onLoginLink?: () => void
  /** Href for the login link; default "/login" */
  loginHref?: string
  /** Label for the login link; default "Already have an account? Sign in" */
  loginLabel?: string

  /**
   * Social icon links below the card.
   * Each item: `{ label, href, icon: ReactNode, brand?: '#hex' }`.
   */
  socialLinks?: SocialLink[]
  /** Label above social icons; default "Connect with us" */
  socialLinksLabel?: string

  /** "Powered by" badge in bottom-right corner */
  poweredBy?: { logoSrc: string; text?: string; href?: string }

  /**
   * Three RGB tuples for ambient glow blobs [top-right, bottom-left, center].
   * Default: saffron, green, navy.
   */
  ambientColors?: [AmbientColor, AmbientColor, AmbientColor]
  /** Override background CSS gradient */
  backgroundGradient?: string

  /**
   * Tailwind max-width class for the form card.
   * Default: "max-w-2xl". Use "max-w-xl", "max-w-3xl", etc.
   */
  maxWidth?: string

  className?: string
  style?: React.CSSProperties
}

/* ── RegisterPage ────────────────────────────────────────────────────────── */

/**
 * Full-page multi-step registration shell.
 * Provides the animated background, a step progress bar, and card chrome.
 * Drop your form fields as `children` — they render inside the white card.
 *
 * Minimal usage:
 * ```tsx
 * <RegisterPage
 *   projectName="My Portal"
 *   logoSrc="/logo.png"
 *   steps={[{ label: 'Account' }, { label: 'Details' }, { label: 'Review' }]}
 *   currentStep={step}
 *   onNext={handleNext}
 *   onBack={handleBack}
 *   onSubmit={handleSubmit}
 *   isLoading={loading}
 *   error={error}
 * >
 *   {step === 0 && <Step1Fields />}
 *   {step === 1 && <Step2Fields />}
 *   {step === 2 && <ReviewSummary />}
 * </RegisterPage>
 * ```
 *
 * Full usage with all props:
 * ```tsx
 * <RegisterPage
 *   projectName="My Portal"
 *   projectSubtitle="Create your account"
 *   logoSrc="/logo.png"
 *   logoAlt="My Portal"
 *   logoSize={40}
 *   steps={[
 *     { label: 'Account',  description: 'Basic info & password' },
 *     { label: 'Profile',  description: 'Personal details' },
 *     { label: 'Review',   description: 'Confirm & submit' },
 *   ]}
 *   currentStep={currentStep}
 *   onNext={handleNext}
 *   onBack={handleBack}
 *   onSubmit={handleSubmit}
 *   nextLabel="Continue"
 *   backLabel="Go Back"
 *   submitLabel="Create Account"
 *   isLoading={isLoading}
 *   error={error}
 *   onLoginLink={() => router.push('/login')}
 *   loginHref="/login"
 *   loginLabel="Already have an account? Sign in"
 *   socialLinks={socialLinks}
 *   socialLinksLabel="Connect with us"
 *   poweredBy={{ logoSrc: '/sts-logo.svg', href: 'https://stspl.com' }}
 *   ambientColors={[[255,153,51],[19,136,8],[0,0,128]]}
 *   backgroundGradient="linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)"
 *   maxWidth="max-w-2xl"
 * >
 *   {currentStep === 0 && <AccountStep />}
 *   {currentStep === 1 && <ProfileStep />}
 *   {currentStep === 2 && <ReviewStep />}
 * </RegisterPage>
 * ```
 */
export function RegisterPage({
  projectName,
  projectSubtitle = 'Create your account',
  logoSrc,
  logoAlt,
  logoSize = 40,
  steps,
  currentStep,
  onNext,
  onBack,
  onSubmit,
  nextLabel = 'Next',
  backLabel = 'Back',
  submitLabel = 'Submit',
  isLoading = false,
  error,
  children,
  onLoginLink,
  loginHref = '/login',
  loginLabel = 'Already have an account? Sign in',
  socialLinks,
  socialLinksLabel = 'Connect with us',
  poweredBy,
  ambientColors,
  backgroundGradient,
  maxWidth = 'max-w-2xl',
  className,
  style,
}: RegisterPageProps) {
  const isLastStep   = currentStep === steps.length - 1
  const currentStepConfig = steps[currentStep]

  return (
    <AuthPageShell
      backgroundGradient={backgroundGradient}
      ambientColors={ambientColors}
      poweredBy={poweredBy}
      className={className}
      style={style}
    >
      <div className={cn('relative z-10 w-full flex flex-col items-center', maxWidth)}>

        {/* ── Header bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full mb-3 px-1"
        >
          {/* Logo + project name row */}
          <div className="flex items-center gap-3 mb-5">
            {logoSrc && (
              <img
                src={logoSrc}
                alt={logoAlt ?? projectName}
                className="object-contain rounded-full flex-shrink-0"
                style={{ width: logoSize, height: logoSize }}
              />
            )}
            <div className="flex flex-col leading-tight">
              <h1
                className="text-[17px] font-bold tracking-tight text-white"
                style={{ letterSpacing: '-0.01em', textShadow: '0 1px 8px rgba(0,0,0,0.15)' }}
              >
                {projectName}
              </h1>
              <p className="text-[12px] text-white/70 mt-0.5">{projectSubtitle}</p>
            </div>
          </div>

          {/* Step progress bar */}
          <div
            className="w-full rounded-2xl px-5 py-4"
            style={{ background: 'var(--primary, #000080)', boxShadow: '0 4px 20px rgba(0,0,128,0.25)' }}
          >
            <StepIndicator steps={steps} current={currentStep} />
          </div>
        </motion.div>

        {/* ── Form card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
          className="w-full bg-white rounded-2xl overflow-hidden"
        >
          <TricolorStripe />

          <div className="px-6 sm:px-8 py-6">
            {/* Step heading inside card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'var(--primary, #000080)' }}
                  >
                    {currentStep + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {currentStepConfig?.label}
                    </p>
                    {currentStepConfig?.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{currentStepConfig.description}</p>
                    )}
                  </div>
                </div>

                {/* Consumer-provided fields */}
                <div className="space-y-4">
                  {children}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── Error banner ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Navigation buttons ── */}
            {(onBack || onNext || onSubmit) && (
              <div className="mt-6 flex items-center justify-between gap-3">
                {/* Back */}
                <div>
                  {onBack && currentStep > 0 && (
                    <button
                      type="button"
                      onClick={onBack}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {backLabel}
                    </button>
                  )}
                </div>

                {/* Next / Submit */}
                <div>
                  {!isLastStep && onNext && (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={onNext}
                      isLoading={isLoading}
                      className="px-6 h-10 text-sm font-semibold"
                    >
                      {!isLoading && (
                        <span className="flex items-center gap-1.5">
                          {nextLabel} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </Button>
                  )}
                  {isLastStep && onSubmit && (
                    <Button
                      type="button"
                      onClick={onSubmit}
                      isLoading={isLoading}
                      className="px-6 h-10 text-sm font-semibold"
                      style={{ background: 'var(--success, #138808)' }}
                    >
                      {!isLoading && (
                        <span className="flex items-center gap-1.5">
                          {submitLabel} <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <TricolorStripe reverse />
        </motion.div>

        {/* ── Login link ── */}
        {(onLoginLink || loginHref) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="mt-4 text-center"
          >
            {onLoginLink ? (
              <button
                type="button"
                onClick={onLoginLink}
                className="text-[13px] font-semibold transition-colors duration-150 focus:outline-none"
                style={{ color: 'var(--primary, #000080)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent, #FF9933)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--primary, #000080)')}
              >
                {loginLabel}
              </button>
            ) : (
              <a
                href={loginHref}
                className="text-[13px] font-semibold transition-colors duration-150"
                style={{ color: 'var(--primary, #000080)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent, #FF9933)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--primary, #000080)')}
              >
                {loginLabel}
              </a>
            )}
          </motion.div>
        )}

        {/* ── Social links ── */}
        {socialLinks && socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
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
