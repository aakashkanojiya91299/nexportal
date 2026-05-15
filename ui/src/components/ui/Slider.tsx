'use client'

import React, { useState } from 'react'
import { cn } from '../../lib/cn'

export interface SliderProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  valueFormat?: (v: number) => string
  helperText?: string
  disabled?: boolean
  className?: string
}

export function Slider({
  value: controlled,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue,
  valueFormat = v => String(v),
  helperText,
  disabled,
  className,
}: SliderProps) {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = controlled !== undefined
  const value = isControlled ? controlled : internal
  const pct = Math.round(((value - min) / (max - min)) * 100)

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const n = Number(e.target.value)
    if (!isControlled) setInternal(n)
    onChange?.(n)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-footnote font-medium text-label-primary">{label}</span>}
          {showValue && (
            <span className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-full bg-[color:var(--primary,#000080)]/10 text-[color:var(--primary,#000080)]">
              {valueFormat(value)}
            </span>
          )}
        </div>
      )}
      <div className="relative flex items-center h-6">
        {/* Track */}
        <div className="relative w-full h-1.5 rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${pct}%`, background: disabled ? '#9CA3AF' : 'var(--primary, #000080)' }}
          />
        </div>
        {/* Native input (invisible, handles all interaction) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handle}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed h-full z-10"
        />
        {/* Thumb */}
        <div
          className={cn(
            'absolute w-4 h-4 rounded-full bg-white border-2 shadow-md pointer-events-none transition-all',
            disabled ? 'border-gray-400' : '',
          )}
          style={{
            left: `calc(${pct}% - 8px)`,
            borderColor: disabled ? '#9CA3AF' : 'var(--primary, #000080)',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-label-quaternary">
        <span>{valueFormat(min)}</span>
        <span>{valueFormat(max)}</span>
      </div>
      {helperText && <p className="text-[11px] text-label-tertiary -mt-1">{helperText}</p>}
    </div>
  )
}
