'use client'

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  children?: React.ReactNode
  footer?: React.ReactNode
  hideCloseButton?: boolean
  className?: string
}

const sizeClasses: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)]',
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  hideCloseButton,
  className,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        className={cn(
          'relative w-full rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]',
          sizeClasses[size],
          className,
        )}
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-separator-opaque flex-shrink-0">
            <div className="min-w-0">
              {title && (
                <h2 id="dialog-title" className="text-subhead font-semibold text-label-primary leading-snug">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-[13px] text-label-tertiary">{description}</p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-label-tertiary hover:bg-surface-secondary hover:text-label-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        {children && (
          <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-separator-opaque flex-shrink-0 bg-surface-secondary/40 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
