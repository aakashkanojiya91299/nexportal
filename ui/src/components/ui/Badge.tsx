'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeVariant = 'active' | 'pending' | 'inactive' | 'rejected' | 'primary'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

const variantClass: Record<BadgeVariant, string> = {
  active:   'badge-active',
  pending:  'badge-pending',
  inactive: 'badge-inactive',
  rejected: 'badge-rejected',
  primary:  'badge-primary',
}

export function Badge({ variant = 'primary', children, className, style }: BadgeProps) {
  return (
    <span className={cn(variantClass[variant], className)} style={style}>
      {children}
    </span>
  )
}
