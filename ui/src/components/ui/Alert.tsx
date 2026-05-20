'use client'

import React, { useState, type ReactNode } from 'react'
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

// ─── Variants ─────────────────────────────────────────────────────────────────

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive'

const variantStyles: Record<AlertVariant, string> = {
  default:     'bg-fill-secondary border-separator-opaque text-label-primary',
  info:        'bg-blue-50 border-blue-200 text-blue-900',
  success:     'bg-green-50 border-green-200 text-green-900',
  warning:     'bg-amber-50 border-amber-200 text-amber-900',
  destructive: 'bg-red-50 border-red-200 text-red-900',
}

const variantIconStyles: Record<AlertVariant, string> = {
  default:     'text-label-tertiary',
  info:        'text-blue-500',
  success:     'text-green-500',
  warning:     'text-amber-500',
  destructive: 'text-red-500',
}

const variantIcons: Record<AlertVariant, React.FC<{ className?: string }>> = {
  default:     Info,
  info:        Info,
  success:     CheckCircle2,
  warning:     AlertTriangle,
  destructive: AlertCircle,
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  children?: ReactNode
  /** Show a × dismiss button; when clicked the alert unmounts itself */
  dismissible?: boolean
  /** Custom icon — pass null to hide the icon */
  icon?: ReactNode | null
  className?: string
  style?: React.CSSProperties
}

export function Alert({
  variant = 'default',
  title,
  children,
  dismissible = false,
  icon,
  className,
  style,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const DefaultIcon = variantIcons[variant]
  const showIcon    = icon !== null

  return (
    <div
      role="alert"
      className={cn(
        'relative flex gap-3 rounded-xl border px-4 py-3.5',
        variantStyles[variant],
        className,
      )}
      style={style}
    >
      {/* Icon */}
      {showIcon && (
        <span className={cn('mt-0.5 shrink-0', variantIconStyles[variant])}>
          {icon ?? <DefaultIcon className="h-4 w-4" />}
        </span>
      )}

      {/* Body */}
      <div className="min-w-0 flex-1">
        {title && (
          <p className="text-[13px] font-semibold leading-snug mb-0.5">{title}</p>
        )}
        {children && (
          <div className="text-[13px] leading-relaxed opacity-90">{children}</div>
        )}
      </div>

      {/* Dismiss */}
      {dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 ml-auto p-0.5 rounded-md opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── AlertTitle / AlertDescription sub-elements ───────────────────────────────

export interface AlertTitleProps { children: ReactNode; className?: string }
export function AlertTitle({ children, className }: AlertTitleProps) {
  return (
    <p className={cn('text-[13px] font-semibold leading-snug', className)}>{children}</p>
  )
}

export interface AlertDescriptionProps { children: ReactNode; className?: string }
export function AlertDescription({ children, className }: AlertDescriptionProps) {
  return (
    <div className={cn('text-[13px] leading-relaxed opacity-90', className)}>{children}</div>
  )
}
