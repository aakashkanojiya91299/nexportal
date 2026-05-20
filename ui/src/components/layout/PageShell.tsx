import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface PageShellProps {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  controls?: ReactNode
  breadcrumbs?: ReactNode
  backButton?: ReactNode
  className?: string
  style?: React.CSSProperties
  controlsClassName?: string
}

export function PageShell({
  title,
  subtitle,
  actions,
  controls,
  breadcrumbs,
  backButton,
  className,
  style,
  controlsClassName,
}: PageShellProps) {
  return (
    <div className={cn('mb-6 lg:mb-8', className)} style={style}>
      {breadcrumbs}
      <div className="flex flex-row flex-wrap items-start justify-between gap-x-4 gap-y-2 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          {backButton}
          <div className="min-w-0">
            <h1 className="text-title1 font-bold tracking-tight text-label-primary">{title}</h1>
            {subtitle && (
              <p className="text-body text-label-secondary mt-1 max-w-2xl leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="shrink-0 flex flex-wrap gap-2 justify-end">{actions}</div>
        )}
      </div>
      {controls && (
        <div className={cn(
          'rounded-lg border border-separator-opaque bg-white shadow-sm p-4',
          'flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap',
          controlsClassName,
        )}>
          {controls}
        </div>
      )}
    </div>
  )
}
