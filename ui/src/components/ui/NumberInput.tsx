'use client'

import React, { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface NumberInputProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  helperText?: string
  error?: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function NumberInput({
  value: controlled,
  defaultValue = 0,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  label,
  helperText,
  error,
  disabled,
  className,
  style,
}: NumberInputProps) {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : internal

  function set(next: number) {
    const v = Math.min(max, Math.max(min, next))
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  const btnBase = cn(
    'flex items-center justify-center w-9 h-9 rounded-lg transition-colors flex-shrink-0',
    'border border-separator-opaque bg-surface-secondary text-label-secondary',
    'hover:bg-surface-tertiary hover:text-label-primary',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface-secondary',
  )

  return (
    <div className={cn('flex flex-col gap-1.5', className)}
        style={style}>
      {label && (
        <span className={cn('text-subhead font-medium', error ? 'text-red-500' : 'text-label-primary')}>
          {label}
        </span>
      )}

      <div className="flex items-center gap-2 w-full max-w-xs sm:w-fit">
        <button
          type="button"
          onClick={() => set(value - step)}
          disabled={disabled || value <= min}
          className={btnBase}
          aria-label="Decrease"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) set(n) }}
          className={cn(
            'flex-1 sm:flex-none sm:w-28 h-9 min-w-0 text-center text-sm font-semibold text-label-primary bg-surface-primary',
            'border rounded-lg outline-none transition-colors tabular-nums',
            'focus:ring-2 focus:ring-[color:var(--primary,#000080)]/20',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            error
              ? 'border-red-400 focus:border-red-400'
              : 'border-separator-opaque focus:border-[color:var(--primary,#000080)]',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />

        <button
          type="button"
          onClick={() => set(value + step)}
          disabled={disabled || value >= max}
          className={btnBase}
          aria-label="Increase"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {(error || helperText) && (
        <p className={cn('text-footnote', error ? 'text-red-500' : 'text-label-tertiary')}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}
