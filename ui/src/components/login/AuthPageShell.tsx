'use client'

import React, {
  useRef, useCallback, useEffect, type ReactNode,
} from 'react'
import {
  motion,
  useMotionValue, useSpring, useTransform,
  type MotionValue,
} from 'framer-motion'
import { cn } from '../../lib/cn'

/**
 * RGB color tuple used for the three ambient glow blobs.
 * Example: `[255, 153, 51]` for saffron.
 */
export type AmbientColor = [number, number, number]

const DEFAULT_AMBIENT: [AmbientColor, AmbientColor, AmbientColor] = [
  [255, 153,  51],  // saffron   — top-right
  [ 19, 136,   8],  // green     — bottom-left
  [  0,   0, 128],  // navy      — center
]

/* ── Particle canvas (mouse-repel + constellation lines) ─────────────────── */

interface Particle {
  x: number; y: number
  vx: number; vy: number
  baseVx: number; baseVy: number
  r: number; colorIdx: number
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

function ParticleCanvas({
  mouseRef,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>
}) {
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

/* ── Ambient glow blobs (mouse-parallax) ─────────────────────────────────── */

function AmbientGlobs({
  sx, sy,
  colors = DEFAULT_AMBIENT,
}: {
  sx: MotionValue<number>
  sy: MotionValue<number>
  colors?: [AmbientColor, AmbientColor, AmbientColor]
}) {
  const [c1, c2, c3] = colors
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
          background: `radial-gradient(circle, rgba(${c1[0]},${c1[1]},${c1[2]},0.09) 0%, transparent 65%)`,
          filter: 'blur(52px)', x: b1x, y: b1y }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ bottom: '-14%', left: '-12%', width: '38vw', aspectRatio: '1',
          background: `radial-gradient(circle, rgba(${c2[0]},${c2[1]},${c2[2]},0.07) 0%, transparent 65%)`,
          filter: 'blur(56px)', x: b2x, y: b2y }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.55, 0.9, 0.55] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ top: '38%', left: '38%', width: '26vw', aspectRatio: '1',
          background: `radial-gradient(circle, rgba(${c3[0]},${c3[1]},${c3[2]},0.04) 0%, transparent 65%)`,
          filter: 'blur(60px)', x: b3x, y: b3y }}
        animate={{ scale: [1, 1.07, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 7 }} />
    </>
  )
}

/* ── AuthPageShell ────────────────────────────────────────────────────────── */

export interface AuthPageShellProps {
  /** Page content — centered on the animated background */
  children: ReactNode
  /**
   * Override the default beige gradient background.
   * Any valid CSS `background` value, e.g. `'linear-gradient(150deg, #fff 0%, #f0f 100%)'`.
   */
  backgroundGradient?: string
  /**
   * Three RGB tuples for the ambient glow blobs: [top-right, bottom-left, center].
   * Defaults to saffron / green / navy (Indian tricolor palette).
   * Example: `[[255,153,51],[19,136,8],[0,0,128]]`
   */
  ambientColors?: [AmbientColor, AmbientColor, AmbientColor]
  /**
   * "Powered by" badge rendered in the bottom-right corner.
   * Provide at least a `logoSrc`; `text` defaults to "Powered by".
   */
  poweredBy?: {
    /** URL for the powered-by logo */
    logoSrc: string
    /** Badge label text; default "Powered by" */
    text?: string
    /** Link href; opens in a new tab */
    href?: string
  }
  className?: string
  style?: React.CSSProperties
}

/**
 * Shared shell for all auth pages.
 * Provides the animated particle background, ambient glow blobs,
 * mouse-parallax, and optional powered-by badge.
 *
 * Use it to build custom auth pages:
 * ```tsx
 * <AuthPageShell poweredBy={{ logoSrc: '/sts-logo.svg', href: 'https://stspl.com' }}>
 *   <div className="relative z-10 w-full max-w-sm">
 *     ...your form...
 *   </div>
 * </AuthPageShell>
 * ```
 */
export function AuthPageShell({
  children,
  backgroundGradient,
  ambientColors,
  poweredBy,
  className,
  style,
}: AuthPageShellProps) {
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const nx = useMotionValue(0.5)
  const ny = useMotionValue(0.5)
  const sx = useSpring(nx, { stiffness: 45, damping: 18 })
  const sy = useSpring(ny, { stiffness: 45, damping: 18 })

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      nx.set(e.clientX / window.innerWidth)
      ny.set(e.clientY / window.innerHeight)
    },
    [nx, ny],
  )

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6',
        className,
      )}
      style={{
        background: backgroundGradient
          ?? 'linear-gradient(150deg, #f7f6f3 0%, #f1efe9 55%, #f5f2ed 100%)',
        ...style,
      }}
      onMouseMove={onMouseMove}
    >
      <ParticleCanvas mouseRef={mouseRef as React.RefObject<{ x: number; y: number }>} />
      <AmbientGlobs sx={sx} sy={sy} colors={ambientColors} />

      {children}

      {poweredBy && (
        <motion.a
          href={poweredBy.href ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="absolute bottom-5 right-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-white/70 hover:bg-white border border-gray-200 hover:border-gray-300
            text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 hover:text-gray-600
            shadow-sm backdrop-blur-sm transition-all duration-150"
          aria-label={poweredBy.text ?? 'Powered by'}
        >
          <span>{poweredBy.text ?? 'Powered by'}</span>
          <img src={poweredBy.logoSrc} alt="" className="h-3.5 w-auto" />
        </motion.a>
      )}
    </div>
  )
}
