'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface ProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  animated?: boolean
  className?: string
  style?: React.CSSProperties
}

const variantColors: Record<NonNullable<ProgressProps['variant']>, string> = {
  default: 'var(--primary, #000080)',
  success: 'var(--success, #16a34a)',
  warning: '#f59e0b',
  danger: '#ef4444',
}

const sizeClasses: Record<NonNullable<ProgressProps['size']>, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function Progress({
  value,
  max = 100,
  label,
  showValue,
  size = 'md',
  variant = 'default',
  animated,
  className,
  style,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const color = variantColors[variant]

  return (
    <div className={cn('flex flex-col gap-1.5', className)}
        style={style}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-callout font-medium text-label-primary">{label}</span>}
          {showValue && (
            <span className="text-[11px] font-semibold text-label-tertiary tabular-nums">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn('w-full overflow-hidden rounded-full bg-gray-100', sizeClasses[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            animated && 'animate-pulse',
          )}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
