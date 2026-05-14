'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

type AlertVariant = 'error' | 'warning' | 'info' | 'success'

interface AlertBannerProps {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<AlertVariant, string> = {
  error:   'bg-red-50 border border-red-200 text-red-700',
  warning: 'bg-amber-50 border border-amber-200 text-amber-700',
  info:    'bg-blue-50 border border-blue-200 text-blue-700',
  success: 'bg-green-50 border border-green-200 text-green-700',
}

export function AlertBanner({ variant = 'info', children, className }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className={cn('rounded px-4 py-3 text-callout', variantStyles[variant], className)}
    >
      {children}
    </div>
  )
}
