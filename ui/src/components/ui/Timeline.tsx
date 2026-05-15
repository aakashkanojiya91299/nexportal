'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface TimelineItem {
  title: string
  description?: string
  timestamp?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const DOT: Record<string, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
}

const ICON_BG: Record<string, string> = {
  default: 'bg-gray-100 text-gray-500',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-amber-100 text-amber-600',
  danger:  'bg-red-100 text-red-600',
  info:    'bg-blue-100 text-blue-600',
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, i) => {
        const v      = item.variant ?? 'default'
        const isLast = i === items.length - 1
        return (
          <div key={i} className="flex gap-4">
            {/* Dot + connector */}
            <div className="flex flex-col items-center flex-shrink-0">
              {item.icon
                ? (
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ring-2 ring-white shadow-sm', ICON_BG[v])}>
                    <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>
                  </div>
                )
                : (
                  <div className={cn('w-3 h-3 rounded-full flex-shrink-0 mt-1 ring-2 ring-white shadow-sm', DOT[v])} />
                )
              }
              {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1 mb-1" />}
            </div>
            {/* Content */}
            <div className={cn('min-w-0', isLast ? 'pb-0' : 'pb-5')}>
              <div className="flex items-baseline flex-wrap gap-x-2">
                <p className="text-sm font-semibold text-label-primary">{item.title}</p>
                {item.timestamp && (
                  <span className="text-[10px] text-label-quaternary whitespace-nowrap">{item.timestamp}</span>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-label-tertiary mt-0.5 leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
