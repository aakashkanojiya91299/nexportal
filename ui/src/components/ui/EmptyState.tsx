'use client'

import React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function EmptyState({ icon, title, description, action, className, style }: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3 py-12 px-6 text-center',
      className,
    )} style={style}>
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        {icon ?? <Inbox className="w-6 h-6 text-label-tertiary" />}
      </div>
      <div className="space-y-1 max-w-xs">
        <p className="text-callout font-semibold text-label-primary">{title}</p>
        {description && (
          <p className="text-footnote text-label-tertiary">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
