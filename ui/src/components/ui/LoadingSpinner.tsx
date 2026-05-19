'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export type LoadingSpinnerVariant = 'default' | 'dual' | 'white'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: LoadingSpinnerVariant
  className?: string
  style?: React.CSSProperties
}

const sizeClass: Record<string, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

/**
 * LoadingSpinner
 *
 * variant="default"  — single border-t-transparent spin (original)
 * variant="dual"     — two concentric rings: primary outer, accent inner (reverse)
 * variant="white"    — dual-ring in white (for dark/colored backgrounds)
 */
export function LoadingSpinner({ size = 'md', variant = 'default', className, style }: LoadingSpinnerProps) {
  if (variant === 'dual' || variant === 'white') {
    const isWhite = variant === 'white'
    return (
      <span
        className={cn('relative inline-flex flex-shrink-0 items-center justify-center', sizeClass[size], className)}
        style={style}
        role="status"
        aria-label="Loading"
      >
        {/* Outer ring */}
        <span
          className={cn(
            'absolute inset-0 rounded-full border-2 border-transparent animate-spin',
            isWhite ? 'border-t-white' : 'border-t-[color:var(--primary,#000080)]',
          )}
          style={{ animationDuration: '0.8s' }}
        />
        {/* Inner ring (reverse) */}
        <span
          className={cn(
            'absolute rounded-full border-2 border-transparent animate-spin',
            isWhite ? 'border-b-white/60' : 'border-b-[color:var(--accent,#FF9933)]',
          )}
          style={{
            inset: '15%',
            animationDuration: '1.2s',
            animationDirection: 'reverse',
          }}
        />
      </span>
    )
  }

  // default single-ring
  const borderSize = size === 'xs' ? 'border' : 'border-2'
  return (
    <span
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin flex-shrink-0',
        borderSize,
        sizeClass[size],
        className,
      )}
      style={style}
      role="status"
      aria-label="Loading"
    />
  )
}

/* ── PageLoader ──────────────────────────────────────────────────────────── */

export interface PageLoaderProps {
  label?: string
  className?: string
}

/**
 * Full-screen centered loading state — typically used as an auth/route gate.
 */
export function PageLoader({ label = 'Loading…', className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center bg-surface-secondary',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" variant="dual" />
        <p className="text-callout text-label-secondary">{label}</p>
      </div>
    </div>
  )
}
