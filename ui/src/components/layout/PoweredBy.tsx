'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface PoweredByProps {
  logoSrc: string
  text?: string
  href?: string
  className?: string
}

export function PoweredBy({ logoSrc, text = 'Powered by', href = '#', className }: PoweredByProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-4 right-4 z-20 flex items-center gap-1.5 hover:opacity-80 transition-opacity',
        className,
      )}
    >
      <span className="text-caption1 font-black uppercase tracking-widest text-label-tertiary">
        {text}
      </span>
      <img
        src={logoSrc}
        alt={text}
        height={16}
        className="h-4 w-auto object-contain"
      />
    </a>
  )
}
