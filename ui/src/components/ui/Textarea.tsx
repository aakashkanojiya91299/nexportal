'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  labelRight?: React.ReactNode
  error?: string
  helperText?: string
  required?: boolean
}

export function Textarea({
  label,
  labelRight,
  error,
  helperText,
  required,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {(label || labelRight) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="text-callout font-medium text-label-primary">
              {label}
              {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
          )}
          {labelRight && <span className="text-[11px] text-label-tertiary">{labelRight}</span>}
        </div>
      )}
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          'w-full rounded-xl border px-3.5 py-3 text-callout text-label-primary placeholder:text-label-quaternary',
          'bg-white transition-all duration-150 resize-y min-h-[80px]',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          error
            ? 'border-red-400 focus:ring-red-400/30'
            : 'border-separator-opaque focus:ring-[color:var(--primary,#000080)]/20 focus:border-[color:var(--primary,#000080)]',
          props.disabled && 'cursor-not-allowed bg-surface-secondary opacity-60',
          className,
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn('text-[11px]', error ? 'text-red-500' : 'text-label-tertiary')}>
          {error ?? helperText}
        </p>
      )}
    </div>
  )
}
