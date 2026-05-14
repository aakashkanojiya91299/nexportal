import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  homeHref?: string
  homeLabel?: string
  className?: string
}

export function Breadcrumbs({ items, homeHref = '/dashboard', homeLabel = 'Home', className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex flex-wrap items-center gap-1 text-footnote text-label-tertiary mb-3', className)}
    >
      <a href={homeHref} className="hover:text-primary transition-colors inline-flex items-center gap-0.5">
        <Home className="w-3.5 h-3.5 shrink-0" />
        <span>{homeLabel}</span>
      </a>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="contents">
          <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
          {item.href ? (
            <a href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-label-secondary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
