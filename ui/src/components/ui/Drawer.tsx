'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'full'
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const SIZES = { sm: 'w-72', md: 'w-96', lg: 'w-[32rem]', full: 'w-screen' }

export function Drawer({
  open, onClose, title, description, side = 'right', size = 'md',
  footer, children, className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'absolute top-0 bottom-0 flex flex-col bg-white shadow-2xl',
        side === 'right' ? 'right-0' : 'left-0',
        SIZES[size],
        className,
      )}>
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <div>
              {title && <h2 className="text-callout font-semibold text-label-primary">{title}</h2>}
              {description && <p className="text-[11px] text-label-tertiary mt-0.5">{description}</p>}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-label-tertiary transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="border-t border-gray-100 px-5 py-4 flex-shrink-0 bg-gray-50/50">{footer}</div>
        )}
      </div>
    </div>
  )
}
