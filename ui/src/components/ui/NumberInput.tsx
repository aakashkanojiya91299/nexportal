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
}: NumberInputProps) {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : internal

  function set(next: number) {
    const v = Math.min(max, Math.max(min, next))
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <span className="text-footnote font-medium text-label-primary">{label}</span>}
      <div className={cn(
        'inline-flex items-center rounded-xl border-2 overflow-hidden transition-colors',
        error ? 'border-red-300' : 'border-gray-200 focus-within:border-[color:var(--primary,#000080)]',
        disabled && 'opacity-50',
      )}>
        <button
          type="button"
          onClick={() => set(value - step)}
          disabled={disabled || value <= min}
          className="px-3 py-2.5 text-label-secondary hover:bg-gray-50 disabled:opacity-40 transition-colors border-r border-gray-200 flex-shrink-0"
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
          className="w-16 text-center text-sm font-semibold text-label-primary bg-transparent outline-none py-2 px-1 tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => set(value + step)}
          disabled={disabled || value >= max}
          className="px-3 py-2.5 text-label-secondary hover:bg-gray-50 disabled:opacity-40 transition-colors border-l border-gray-200 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      {(error || helperText) && (
        <p className={cn('text-[11px]', error ? 'text-red-500' : 'text-label-tertiary')}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}
