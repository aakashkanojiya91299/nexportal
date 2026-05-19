'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { X, AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '../../lib/cn'

export type AlertModalVariant = 'error' | 'warning' | 'info' | 'success'

export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  /** String (newline-separated) or array of lines */
  message: string | string[]
  variant?: AlertModalVariant
  /** Label for the dismiss button (default: "Okay") */
  okText?: string
}

const VARIANT_CONFIG: Record<AlertModalVariant, { bgIcon: string; textIcon: string; btnBg: string; Icon: React.ElementType }> = {
  error: {
    bgIcon: 'bg-red-50',
    textIcon: 'text-red-500',
    btnBg: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
    Icon: AlertCircle,
  },
  warning: {
    bgIcon: 'bg-amber-50',
    textIcon: 'text-amber-500',
    btnBg: 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500',
    Icon: AlertTriangle,
  },
  info: {
    bgIcon: 'bg-blue-50',
    textIcon: 'text-blue-500',
    btnBg: 'bg-[color:var(--primary,#000080)] hover:bg-[color:var(--primary,#000080)]/90 focus-visible:ring-[color:var(--primary,#000080)]',
    Icon: Info,
  },
  success: {
    bgIcon: 'bg-green-50',
    textIcon: 'text-green-600',
    btnBg: 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500',
    Icon: CheckCircle2,
  },
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  okText = 'Okay',
}: AlertModalProps) {
  if (!isOpen || typeof document === 'undefined') return null

  const lines = Array.isArray(message) ? message.map(String) : String(message ?? '').split('\n')
  const { bgIcon, textIcon, btnBg, Icon } = VARIANT_CONFIG[variant]

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-separator-opaque bg-white"
        style={{ boxShadow: '0 24px 64px -12px rgba(0,0,0,0.18)' }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-label-tertiary hover:bg-gray-100 transition-colors focus:outline-none"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={cn('mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full', bgIcon, textIcon)}>
              <Icon className="w-6 h-6" />
            </div>

            {/* Title */}
            <h3 className="text-[17px] font-bold text-label-primary tracking-tight">{title}</h3>

            {/* Message */}
            <div className="mt-3 w-full max-w-[18rem] text-[14px] leading-relaxed text-label-secondary">
              {lines.map((line, idx) => (
                <p key={idx} className={cn(idx > 0 && 'mt-2')}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* OK button */}
          <div className="mt-8">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'w-full h-11 rounded-xl text-[14px] font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                btnBg,
              )}
            >
              {okText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
