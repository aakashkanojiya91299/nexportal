'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeVariant =
  | 'active'
  | 'pending'
  | 'inactive'
  | 'rejected'
  | 'primary'
  | 'expired'
  | 'dead'
  | 'navy'
  | 'saffron'
  | 'green'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

const variantClass: Record<BadgeVariant, string> = {
  // pre-existing (CSS utility classes from theme)
  active:   'badge-active',
  pending:  'badge-pending',
  inactive: 'badge-inactive',
  rejected: 'badge-rejected',
  primary:  'badge-primary',
  // new variants — inline Tailwind (no CSS utility needed)
  expired:  'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-neutral-100 text-neutral-800 ring-1 ring-inset ring-neutral-200',
  dead:     'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-neutral-800 text-white',
  navy:     'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[color:var(--primary-soft,rgba(0,0,128,0.08))] text-[color:var(--primary,#000080)]',
  saffron:  'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-[color:var(--accent-soft,rgba(255,153,51,0.12))] text-[color:var(--accent,#FF9933)]',
  green:    'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-green-100 text-green-700',
}

export function Badge({ variant = 'primary', children, className, style }: BadgeProps) {
  return (
    <span className={cn(variantClass[variant], className)} style={style}>
      {children}
    </span>
  )
}
