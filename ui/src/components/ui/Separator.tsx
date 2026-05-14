'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}

export function Separator({ orientation = 'horizontal', label, className }: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-separator-opaque', className)}
      />
    )
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)} role="separator">
        <div className="flex-1 h-px bg-separator-opaque" />
        <span className="text-[11px] font-medium text-label-tertiary uppercase tracking-wider whitespace-nowrap">
          {label}
        </span>
        <div className="flex-1 h-px bg-separator-opaque" />
      </div>
    )
  }

  return (
    <div
      role="separator"
      className={cn('h-px w-full bg-separator-opaque', className)}
    />
  )
}
