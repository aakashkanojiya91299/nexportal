'use client'

import React, { useEffect, useState } from 'react'
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
  const [visible, setVisible] = useState(false)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (open) {
      setRendered(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return
    }
    setVisible(false)
    const t = setTimeout(() => setRendered(false), 280)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!rendered) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute top-0 bottom-0 flex flex-col bg-white shadow-2xl transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
          side === 'right' ? 'right-0' : 'left-0',
          SIZES[size],
          className,
        )}
        style={{
          transform: visible
            ? 'translateX(0)'
            : side === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-separator-opaque flex-shrink-0">
          <div className="min-w-0">
            {title && <h2 className="text-callout font-semibold text-label-primary">{title}</h2>}
            {description && <p className="text-[12px] text-label-tertiary mt-0.5 leading-relaxed">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-surface-secondary text-label-tertiary hover:text-label-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-separator-opaque px-5 py-4 flex-shrink-0 bg-surface-secondary/50">{footer}</div>
        )}
      </div>
    </div>
  )
}
