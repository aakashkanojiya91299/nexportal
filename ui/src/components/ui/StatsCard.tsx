'use client'

import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  /** Percentage change. Positive = up (green), negative = down (red), 0 = flat. Omit to hide trend. */
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  className?: string
  style?: React.CSSProperties
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel = 'vs last period',
  icon,
  variant = 'default',
  className,
  style,
}: StatsCardProps) {
  const hasTrend = trend !== undefined && trend !== null
  const trendUp   = hasTrend && trend > 0
  const trendDown = hasTrend && trend < 0

  const iconBg = {
    default: 'bg-gray-100 text-label-secondary',
    primary: 'bg-[color:var(--primary,#000080)]/10 text-[color:var(--primary,#000080)]',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger:  'bg-red-100 text-red-600',
  }[variant]

  return (
    <div className={cn(
      'flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm min-w-0',
      className,
    )} style={style}>
      {/* Top row: icon (if present) floated right alongside title */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-label-tertiary truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-label-primary mt-1 leading-none tabular-nums break-all">{value}</p>
          {subtitle && <p className="text-[11px] sm:text-xs text-label-tertiary mt-1 truncate">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn('w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
            {icon}
          </div>
        )}
      </div>

      {hasTrend && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className={cn(
            'flex items-center gap-0.5 text-xs font-semibold',
            trendUp   ? 'text-green-600' : trendDown ? 'text-red-500' : 'text-label-tertiary',
          )}>
            {trendUp   && <TrendingUp   className="w-3.5 h-3.5" />}
            {trendDown && <TrendingDown className="w-3.5 h-3.5" />}
            {!trendUp && !trendDown && <Minus className="w-3.5 h-3.5" />}
            <span>{trendUp ? '+' : ''}{trend}%</span>
          </div>
          <span className="text-[10px] text-label-tertiary">{trendLabel}</span>
        </div>
      )}
    </div>
  )
}
