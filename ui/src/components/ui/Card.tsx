'use client'

import React, { type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
  children: ReactNode
}

export function Card({ variant = 'default', children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(variant === 'elevated' ? 'card-elevated' : 'card', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
