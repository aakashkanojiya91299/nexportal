'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface SocialLink {
  icon: ReactNode
  href: string
  label: string
  /** Brand hover color, e.g. "#25D366" for WhatsApp */
  brand?: string
}

export interface SocialLinksProps {
  links: SocialLink[]
  className?: string
  style?: React.CSSProperties
}

export function SocialLinks({ links, className, style }: SocialLinksProps) {
  if (!links.length) return null
  return (
    <div className={cn('flex items-center gap-3', className)} style={style}>
      {links.map(({ icon, href, label }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm
                     text-label-secondary hover:text-label-primary hover:shadow
                     transition-all duration-200"
        >
          {icon}
        </a>
      ))}
    </div>
  )
}
