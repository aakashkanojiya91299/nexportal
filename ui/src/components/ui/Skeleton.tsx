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

/* ── TableSkeleton ───────────────────────────────────────────────────────── */

export interface TableSkeletonProps {
  rows?: number
  cols?: number
  className?: string
}

export function TableSkeleton({ rows = 5, cols = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn('w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-b border-gray-50 last:border-0">
                {Array.from({ length: cols }).map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-5">
                    <Skeleton
                      className={cn(
                        'h-4 w-full max-w-[120px]',
                        colIdx === 0 && 'w-32',
                        colIdx === 1 && 'w-40',
                      )}
                    />
                    {colIdx === 1 && <Skeleton className="mt-2 h-3 w-24 opacity-60" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── GridSkeleton ────────────────────────────────────────────────────────── */

export function GridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-1/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" rounded="full" />
            <Skeleton className="h-6 w-16" rounded="full" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── ProfileSkeleton ─────────────────────────────────────────────────────── */

export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse space-y-8', className)}>
      <div className="flex flex-col items-start gap-8 md:flex-row">
        <Skeleton className="h-32 w-32 shrink-0 rounded-2xl" />
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" rounded="full" />
            <Skeleton className="h-8 w-24" rounded="full" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-6">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SettingsSkeleton ────────────────────────────────────────────────────── */

export function SettingsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse space-y-8', className)}>
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="w-full space-y-3 lg:w-72">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
        <div className="w-full flex-1">
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
