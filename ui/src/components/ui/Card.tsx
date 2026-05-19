'use client'

import React, { forwardRef, type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/* ── Card (root) ────────────────────────────────────────────────────────────── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
  /**
   * When true, the card gets a hover lift + border highlight effect.
   * Also sets cursor to pointer.
   */
  hoverable?: boolean
  children: ReactNode
}

export function Card({ variant = 'default', hoverable, children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        variant === 'elevated' ? 'card-elevated' : 'card',
        hoverable && [
          'cursor-pointer border border-transparent',
          'transition-all duration-200',
          'hover:border-[color:var(--primary,#000080)]/20 hover:shadow-lg hover:-translate-y-px',
        ],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ── CardHeader ─────────────────────────────────────────────────────────────── */

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-separator-opaque', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

/* ── CardTitle ──────────────────────────────────────────────────────────────── */

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-title3 font-semibold text-label-primary', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

/* ── CardDescription ────────────────────────────────────────────────────────── */

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-callout text-label-tertiary mt-0.5', className)}
      {...props}
    />
  ),
)
CardDescription.displayName = 'CardDescription'

/* ── CardContent ────────────────────────────────────────────────────────────── */

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4', className)}
      {...props}
    />
  ),
)
CardContent.displayName = 'CardContent'

/* ── CardFooter ─────────────────────────────────────────────────────────────── */

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-separator-opaque', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'
