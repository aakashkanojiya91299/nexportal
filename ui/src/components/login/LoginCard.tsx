'use client'

import React, { forwardRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { TricolorBar } from '../layout/TricolorBar'

interface LoginCardProps {
  children: ReactNode
  className?: string
}

export const LoginCard = forwardRef<HTMLDivElement, LoginCardProps>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl shadow-xl overflow-hidden login-parallax-card',
        className,
      )}
    >
      <TricolorBar animated shimmer />
      <div className="p-8">{children}</div>
      <TricolorBar shimmer />
    </div>
  ),
)

LoginCard.displayName = 'LoginCard'
