'use client'

import React, {
  useState, useRef, useCallback, useEffect, type ReactNode,
} from 'react'
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform,
  type MotionValue,
} from 'framer-motion'
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import type { SocialLink } from '../layout/SocialLinks'

/* ──────────────── Public types ─────────────────────────────────────────── */

export interface RegistrationLink {
  label: string
  href: string
  isOpen: boolean
  isLoading?: boolean
}

export interface LoginRole {
  key: string
  label: string
  sublabel?: string
  icon: ReactNode
  /** Hex accent colour for this role, e.g. "#FF9933" */
  accent: string
  /** "r,g,b" string for rgba() usage, e.g. "255,153,51" */
  accentRgb: string
  /** Soft background, e.g. "rgba(255,153,51,0.12)" */
  accentSoft: string
}

export interface LoginPageProps {
  projectName: string
  projectSubtitle?: string
  logoSrc?: string
  logoAlt?: string

  /**
   * Called on submit. Throw an Error to set the error state.
   * Multi-role portals: return `{ pendingRoles: Record<string, string> }`
   * (token map keyed by role) to trigger the role-select splash.
   */
  onSubmit: (
    creds: { identifier: string; password: string }
  ) => Promise<{ pendingRoles?: Record<string, string> } | void>
  isLoading: boolean
  error: string | null

  identifierLabel?: string
  identifierType?: 'text' | 'email'
  identifierPlaceholder?: string
  passwordPlaceholder?: string

  /** Opens forgot-password flow; if omitted the link is hidden */
  onForgotPassword?: () => void
  forgotPasswordLabel?: string

  /**
   * Multi-role portals: provide role definitions.
   * When `onSubmit` returns `{ pendingRoles }` the role-select splash appears.
   */
  roles?: LoginRole[]
  onRoleSelect?: (roleKey: string, tokens: Record<string, string>) => Promise<void>

  /** Optional registration links shown below the card */
  registrationLinks?: RegistrationLink[]

  /** Bottom-right "powered by" badge */
  poweredBy?: { logoSrc: string; text?: string; href?: string }

  /** Social links shown below the card */
  socialLinks?: SocialLink[]
  socialLinksLabel?: string

  className?: string
  style?: React.CSSProperties
}

/* ──────────────── Particle canvas ─────────────────────────────────────── */

interface Particle {
  x: number; y: number; vx: number; vy: number
  baseVx: number; baseVy: number; r: number; colorIdx: number
}

const P_COLORS: [number, number, number][] = [
  [255, 153,  51],
  [ 19, 136,   8],
  [  0,   0, 128],
  [140, 120, 200],
  [160, 140,  80],
]
const LINK_DIST  = 130
const REPEL_DIST = 115

function ParticleCanvas({ mouseRef }: { mouseRef: React.RefObject<{ x: number; y: number }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef  = useRef<number>(0)
  const ptsRef    = useRef<Particle[]>([])

  const init = useCallback((w: number, h: number) => {
    const count = Math.min(Math.floor((w * h) / 13000), 85)
    ptsRef.current = Array.from({ length: count }, () => {
      const vx = (Math.random() - 0.5) * 0.38
      const vy = (Math.random() - 0.5) * 0.38
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx, vy, baseVx: vx, baseVy: vy,
        r: Math.random() * 1.8 + 0.7,
        colorIdx: Math.floor(Math.random() * P_COLORS.length),
      }
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      init(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      const { width: W, height: H } = canvas
      ctx.clearRect(0, 0, W, H)
      const pts = ptsRef.current
      const mx = mouseRef.current?.x ?? -9999
      const my = mouseRef.current?.y ?? -9999

      for (const p of pts) {
        const mdx = p.x - mx, mdy = p.y - my
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < REPEL_DIST && mdist > 0) {
          const s = ((REPEL_DIST - mdist) / REPEL_DIST) * 3.0
          p.vx += (mdx / mdist) * s * 0.11
          p.vy += (mdy / mdist) * s * 0.11
        }
        p.vx += (p.baseVx - p.vx) * 0.03
        p.vy += (p.baseVy - p.vy) * 0.03
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 3.5) { p.vx = (p.vx / spd) * 3.5; p.vy = (p.vy / spd) * 3.5 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(110,105,140,${(1 - d / LINK_DIST) * 0.12})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (const p of pts) {
        const [r, g, b] = P_COLORS[p.colorIdx]
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5)
        grad.addColorStop(0, `rgba(${r},${g},${b},0.1)`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},0.42)`; ctx.fill()
      }

      frameRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [init, mouseRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  )
}

/* ──────────────── Ambient glow blobs ───────────────────────────────────── */

function AmbientGlobs({ sx, sy }: { sx: MotionValue<number>; sy: MotionValue<number> }) {
  const b1x = useTransform(sx, [0, 1], [-22,  22])
  const b1y = useTransform(sy, [0, 1], [-16,  16])
  const b2x = useTransform(sx, [0, 1], [ 16, -16])
  const b2y = useTransform(sy, [0, 1], [ 10, -10])
  const b3x = useTransform(sx, [0, 1], [ -8,   8])
  const b3y = useTransform(sy, [0, 1], [  6,  -6])
  return (
    <>
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ top: '-12%', right: '-10%', width: '40vw', aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(255,153,51,0.09) 0%, transparent 65%)',
          filter: 'blur(52px)', x: b1x, y: b1y }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ bottom: '-14%', left: '-12%', width: '38vw', aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(19,136,8,0.07) 0%, transparent 65%)',
          filter: 'blur(56px)', x: b2x, y: b2y }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ top: '38%', left: '38%', width: '26vw', aspectRatio: '1',
          background: 'radial-gradient(circle, rgba(0,0,128,0.04) 0%, transparent 65%)',
          filter: 'blur(60px)', x: b3x, y: b3y }}
        animate={{ scale: [1, 1.07, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 7 }} />
    </>
  )
}

/* ──────────────── Tricolor stripe ──────────────────────────────────────── */

function TricolorStripe({ reverse = false }: { reverse?: boolean }) {
  return (
    <div
      className="tricolor-bar tricolor-sweep"
      style={reverse ? { transform: 'scaleX(-1)', transformOrigin: 'right' } : undefined}
    />
  )
}

/* ──────────────── Parallax hook ────────────────────────────────────────── */

function useParallax() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const nx = useMotionValue(0.5)
  const ny = useMotionValue(0.5)
  const sx = useSpring(nx, { stiffness: 45, damping: 18 })
  const sy = useSpring(ny, { stiffness: 45, damping: 18 })
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
    nx.set(e.clientX / window.innerWidth)
    ny.set(e.clientY / window.innerHeight)
  }, [nx, ny])
  return { mouseRef, sx, sy, onMouseMove }
}

/* ──────────────── Social icon link (brand-color hover) ─────────────────── */

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

/* ──────────────── Role-select accent bar ────────────────────────────────── */

function RoleAccentBar({ hoverState, roles }: { hoverState: string | null; roles: LoginRole[] }) {
  const first = roles[0]
  const last  = roles[roles.length - 1]
  return (
    <div className="relative overflow-hidden rounded-full" style={{ width: 80, height: 4 }}>
      <motion.div className="tricolor-bar-inner"
        animate={{ opacity: hoverState ? 0 : 1 }} transition={{ duration: 0.3 }} />
      <motion.div className="absolute inset-0"
        style={{ background: first?.accent ?? 'var(--accent, #FF9933)' }}
        initial={{ x: '-100%' }}
        animate={{ x: hoverState === first?.key ? '0%' : '-100%' }}
        transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }} />
      {roles.length > 1 && (
        <motion.div className="absolute inset-0"
          style={{ background: last?.accent ?? 'var(--success, #138808)' }}
          initial={{ x: '100%' }}
          animate={{ x: hoverState === last?.key ? '0%' : '100%' }}
          transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }} />
      )}
    </div>
  )
}

/* ──────────────── Role-select splash ────────────────────────────────────── */

function RoleSelectContent({
  roles, logoSrc, logoAlt, projectName, onSelect,
}: {
  roles: LoginRole[]
  logoSrc?: string; logoAlt?: string; projectName: string
  onSelect: (key: string) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="relative z-10 flex flex-col items-center select-none">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center mb-16">
        {logoSrc && (
          <img src={logoSrc} alt={logoAlt ?? projectName} className="h-16 w-auto object-contain" />
        )}
        <h1 className="mt-5 font-bold tracking-tight"
          style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--primary, #000080)' }}>
          Who's continuing?
        </h1>
        <p className="mt-1.5 text-sm text-gray-400">Select a profile to access your dashboard</p>
      </motion.div>

      <div className="flex gap-12">
        {roles.map(({ key, label, sublabel, icon, accent, accentRgb, accentSoft }, i) => {
          const isHovered = hovered === key
          return (
            <motion.button key={key}
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              whileTap={{ scale: 0.94 }}
              onHoverStart={() => setHovered(key)} onHoverEnd={() => setHovered(null)}
              onClick={() => onSelect(key)}
              className="flex flex-col items-center gap-4 cursor-pointer focus:outline-none"
              aria-label={`Continue as ${label}`}>
              <motion.div className="relative flex items-center justify-center overflow-hidden"
                style={{ width: 148, height: 148, borderRadius: 16, background: accentSoft }}
                animate={{
                  scale: isHovered ? 1.08 : 1,
                  y: isHovered ? -6 : 0,
                  boxShadow: isHovered
                    ? `0 0 0 3.5px ${accent}, 0 16px 48px rgba(${accentRgb},0.22)`
                    : '0 2px 18px rgba(0,0,0,0.06)',
                }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 35% 28%, rgba(${accentRgb},0.22) 0%, transparent 68%)`,
                    opacity: isHovered ? 1 : 0.5, transition: 'opacity 0.22s',
                  }} />
                <motion.div animate={{ scale: isHovered ? 1.12 : 1 }} transition={{ duration: 0.22 }}>
                  <span style={{ color: accent, display: 'flex' }}>{icon}</span>
                </motion.div>
              </motion.div>
              <div className="flex flex-col items-center gap-0.5">
                <motion.p className="text-base font-semibold"
                  animate={{ color: isHovered ? accent : '#1a2240' }} transition={{ duration: 0.18 }}>
                  {label}
                </motion.p>
                {sublabel && (
                  <motion.p className="text-xs text-gray-400"
                    animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.18 }}>
                    {sublabel}
                  </motion.p>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.65, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="mt-14" style={{ transformOrigin: 'center' }}>
        <RoleAccentBar hoverState={hovered} roles={roles} />
      </motion.div>
    </motion.div>
  )
}

function RoleSelectSplashView({
  roles, logoSrc, logoAlt, projectName, onSelect, onCancel,
}: {
  roles: LoginRole[]
  logoSrc?: string; logoAlt?: string; projectName: string
  onSelect: (key: string) => void
  onCancel: () => void
}) {
  const { mouseRef, sx, sy, onMouseMove } = useParallax()
  return (
    <div className="h-screen overflow-hidden relative flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)' }}
      onMouseMove={onMouseMove}>
      <ParticleCanvas mouseRef={mouseRef as React.RefObject<{ x: number; y: number }>} />
      <AmbientGlobs sx={sx} sy={sy} />
      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={onCancel} aria-label="Sign out"
        className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-gray-200 text-gray-500 hover:text-gray-800 shadow-sm backdrop-blur-sm transition-all duration-150 focus:outline-none text-sm font-medium">
        <X className="w-3.5 h-3.5" />
        Sign out
      </motion.button>
      <RoleSelectContent
        roles={roles} logoSrc={logoSrc} logoAlt={logoAlt}
        projectName={projectName} onSelect={onSelect} />
    </div>
  )
}

/* ──────────────── Main LoginPage ────────────────────────────────────────── */

export function LoginPage({
  projectName, projectSubtitle = 'Sign in to continue',
  logoSrc, logoAlt,
  onSubmit, isLoading, error,
  identifierLabel = 'Email address', identifierType = 'email',
  identifierPlaceholder = 'you@example.com',
  passwordPlaceholder = 'Enter your password',
  onForgotPassword, forgotPasswordLabel = 'Forgot Password?',
  roles, onRoleSelect,
  registrationLinks,
  poweredBy,
  socialLinks, socialLinksLabel = 'Connect with us',
  className,
  style,
}: LoginPageProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showRoleSelect, setShowRoleSelect] = useState(false)
  const [pendingTokens, setPendingTokens] = useState<Record<string, string> | null>(null)

  const { mouseRef, sx, sy, onMouseMove } = useParallax()

  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.scrollbarGutter
    html.style.scrollbarGutter = 'auto'
    return () => { html.style.scrollbarGutter = prev }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    if (!identifier.trim()) { setValidationError(`${identifierLabel} is required`); return }
    if (!password.trim())   { setValidationError('Password is required'); return }
    const result = await onSubmit({ identifier: identifier.trim(), password })
    if (result?.pendingRoles && roles?.length) {
      setPendingTokens(result.pendingRoles)
      setShowRoleSelect(true)
    }
  }

  const handleRoleSelect = async (roleKey: string) => {
    if (onRoleSelect && pendingTokens) {
      await onRoleSelect(roleKey, pendingTokens)
    }
    setShowRoleSelect(false)
    setPendingTokens(null)
  }

  const displayError = error ?? validationError

  if (showRoleSelect && roles) {
    return (
      <RoleSelectSplashView
        roles={roles} logoSrc={logoSrc} logoAlt={logoAlt} projectName={projectName}
        onSelect={handleRoleSelect}
        onCancel={() => { setShowRoleSelect(false); setPendingTokens(null) }} />
    )
  }

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6',
        className,
      )}
      style={{ background: 'linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)', ...style }}
      onMouseMove={onMouseMove}
    >
      <ParticleCanvas mouseRef={mouseRef as React.RefObject<{ x: number; y: number }>} />
      <AmbientGlobs sx={sx} sy={sy} />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

        {/* ── Logo + title ── */}
        <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-5">
          <div className="flex items-center gap-3.5">
            {logoSrc && (
              <div className="relative flex-shrink-0">
                <motion.div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,153,51,0.2) 0%, transparent 70%)',
                    filter: 'blur(22px)', transform: 'scale(2.0)',
                  }}
                  animate={{ opacity: [0.45, 0.8, 0.45] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
                <img src={logoSrc} alt={logoAlt ?? projectName}
                  className="h-30 w-30 object-contain rounded-full relative" />
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <motion.h1 initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[19px] font-bold tracking-tight whitespace-nowrap"
                style={{ color: 'var(--primary, #000080)', letterSpacing: '-0.01em' }}>
                {projectName}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="text-[13px] text-gray-400 mt-1">
                {projectSubtitle}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* ── Card ── */}
        <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
          className="w-full bg-white rounded-2xl overflow-hidden">

          <TricolorStripe />

          <div className="px-7 py-5">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Identifier */}
              <div className="w-full">
                <label htmlFor="identifier"
                  className="block text-subhead font-medium text-label-primary mb-2">
                  {identifierLabel}
                </label>
                <input
                  id="identifier"
                  type={identifierType}
                  value={identifier}
                  onChange={e => { setIdentifier(e.target.value); setValidationError(null) }}
                  placeholder={identifierPlaceholder}
                  autoComplete={identifierType === 'email' ? 'email' : 'username'}
                  className="input-base"
                />
              </div>

              {/* Password */}
              <div className="w-full">
                <label htmlFor="password"
                  className="block text-subhead font-medium text-label-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setValidationError(null) }}
                    placeholder={passwordPlaceholder}
                    autoComplete="current-password"
                    className={cn('input-base', password && 'pr-11')}
                  />
                  {password && (
                    <button type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{displayError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div className="pt-1">
                <Button type="submit" variant="primary"
                  className="w-full h-11 text-sm font-semibold" isLoading={isLoading}>
                  {!isLoading && (
                    <span className="flex items-center justify-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>

              {/* Forgot password */}
              {onForgotPassword && (
                <div className="text-right">
                  <button type="button" onClick={onForgotPassword}
                    className="text-sm font-semibold transition-colors duration-150"
                    style={{ color: 'var(--primary, #000080)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent, #FF9933)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--primary, #000080)')}>
                    {forgotPasswordLabel}
                  </button>
                </div>
              )}

            </form>
          </div>

          <TricolorStripe reverse />
        </motion.div>

        {/* ── Registration links ── */}
        {registrationLinks && registrationLinks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-5 flex flex-row items-center justify-center gap-3 w-full">
            {registrationLinks.map((link, i) => (
              <div key={link.label} className="flex items-center gap-3">
                {i > 0 && <span className="text-gray-300 text-sm">|</span>}
                {link.isLoading ? (
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                    Checking...
                  </span>
                ) : !link.isOpen ? (
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400" title="Registration closed">
                    <Lock className="w-3.5 h-3.5" />
                    {link.label}
                  </span>
                ) : (
                  <a href={link.href}
                    className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors duration-150 focus:outline-none"
                    style={{ color: 'var(--primary, #000080)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent, #FF9933)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--primary, #000080)')}>
                    {link.label}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Social links ── */}
        {socialLinks && socialLinks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-5 flex flex-col items-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gray-400 mb-3">
              {socialLinksLabel}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(link => <SocialIconLink key={link.label} link={link} />)}
            </div>
          </motion.div>
        )}

      </div>

      {/* ── Powered by ── */}
      {poweredBy && (
        <motion.a
          href={poweredBy.href ?? '#'} target="_blank" rel="noopener noreferrer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute bottom-5 right-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-gray-200 hover:border-gray-300 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 hover:text-gray-600 shadow-sm backdrop-blur-sm transition-all duration-150"
          aria-label={poweredBy.text ?? 'Powered by'}>
          <span>{poweredBy.text ?? 'Powered by'}</span>
          <img src={poweredBy.logoSrc} alt="" className="h-3.5 w-auto" />
        </motion.a>
      )}
    </div>
  )
}
