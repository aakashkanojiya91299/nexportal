'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { X, AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '../../lib/cn'
import { LoadingSpinner } from './LoadingSpinner'

export type ConfirmModalVariant = 'danger' | 'warning' | 'info' | 'success'

export interface ConfirmModalTableData {
  headers: string[]
  rows: (string | number)[][]
}

export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  /** String (newline-separated) or array of lines. Lines starting with "•" are indented. */
  message: string | string[]
  /** Optional summary table rendered below the message */
  tableData?: ConfirmModalTableData
  confirmText?: string
  cancelText?: string
  variant?: ConfirmModalVariant
  isLoading?: boolean
}

const VARIANT_CONFIG: Record<ConfirmModalVariant, {
  bgIcon: string
  textIcon: string
  confirmBg: string
  Icon: React.ElementType
}> = {
  danger: {
    bgIcon: 'bg-red-50',
    textIcon: 'text-red-500',
    confirmBg: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
    Icon: AlertCircle,
  },
  warning: {
    bgIcon: 'bg-amber-50',
    textIcon: 'text-amber-500',
    confirmBg: 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500',
    Icon: AlertTriangle,
  },
  info: {
    bgIcon: 'bg-blue-50',
    textIcon: 'text-blue-500',
    confirmBg: 'bg-[color:var(--primary,#000080)] hover:bg-[color:var(--primary,#000080)]/90 focus-visible:ring-[color:var(--primary,#000080)]',
    Icon: Info,
  },
  success: {
    bgIcon: 'bg-green-50',
    textIcon: 'text-green-600',
    confirmBg: 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500',
    Icon: CheckCircle2,
  },
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  tableData,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen || typeof document === 'undefined') return null

  const lines = Array.isArray(message) ? message : String(message ?? '').split('\n')
  const { bgIcon, textIcon, confirmBg, Icon } = VARIANT_CONFIG[variant]

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full bg-white rounded-2xl border border-separator-opaque shadow-2xl overflow-hidden',
          tableData ? 'max-w-md' : 'max-w-sm',
        )}
        style={{ boxShadow: '0 24px 64px -12px rgba(0,0,0,0.2)' }}
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

            {/* Message lines */}
            <div className="mt-3 w-full text-left text-[14px] leading-relaxed text-label-secondary">
              {lines.map((line, idx) => {
                const isBullet = line.trim().startsWith('•')
                return (
                  <p
                    key={idx}
                    className={cn(idx > 0 && 'mt-2', isBullet && 'pl-4 -indent-4 text-label-tertiary font-medium')}
                  >
                    {line}
                  </p>
                )
              })}
            </div>

            {/* Optional table */}
            {tableData && (
              <div className="mt-5 w-full overflow-hidden rounded-xl border border-separator-opaque">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-separator-opaque bg-gray-50/80">
                      {tableData.headers.map((h, i) => (
                        <th
                          key={i}
                          className={cn(
                            'px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-label-tertiary',
                            i > 0 && 'text-right',
                          )}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-separator-opaque/30">
                    {tableData.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={cn(
                              'px-3 py-2.5 text-[12px] font-medium text-label-primary',
                              j === 0 ? 'max-w-[140px] truncate' : 'text-right tabular-nums',
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-11 rounded-xl border border-separator-opaque bg-white text-[14px] font-semibold text-label-primary transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'flex-1 h-11 rounded-xl text-[14px] font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 flex items-center justify-center gap-2',
                confirmBg,
              )}
            >
              {isLoading && <LoadingSpinner size="sm" variant="white" />}
              {isLoading ? 'Processing…' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
