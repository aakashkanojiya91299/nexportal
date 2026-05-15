'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  width?: string | number
  height?: string | number
}

export function Skeleton({ className, style, rounded = 'md', width, height }: SkeletonProps) {
  const roundedClass = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  }[rounded]

  return (
    <div
      className={cn('animate-pulse bg-gray-100', roundedClass, className)}
      style={{ width, height, ...style }}
    />
  )
}

export function SkeletonText({ lines = 3, className, style }: { lines?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('space-y-2', className)} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn('rounded-2xl border border-gray-100 bg-white p-5 space-y-4', className)} style={style}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}
