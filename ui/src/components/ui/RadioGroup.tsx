'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
  label?: string
  error?: string
  orientation?: 'vertical' | 'horizontal'
  className?: string
  name?: string
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onChange,
  disabled,
  label,
  error,
  orientation = 'vertical',
  className,
  name,
}: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? '')
  const isControlled = value !== undefined
  const selected = isControlled ? value : internal
  const groupName = name ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'radio-group'

  function select(v: string) {
    if (disabled) return
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-callout font-medium text-label-primary">{label}</span>
      )}
      <div
        role="radiogroup"
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        )}
      >
        {options.map((opt) => {
          const isChecked = selected === opt.value
          const isDisabled = disabled || opt.disabled
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isChecked}
              disabled={isDisabled}
              onClick={() => select(opt.value)}
              name={groupName}
              className={cn(
                'flex items-start gap-2.5 text-left focus:outline-none rounded-lg',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150',
                  'h-[18px] w-[18px]',
                )}
                style={
                  isChecked
                    ? { borderColor: 'var(--primary, #000080)' }
                    : { borderColor: '#D1D5DB' }
                }
              >
                {isChecked && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: 'var(--primary, #000080)' }}
                  />
                )}
              </span>
              <span className="flex flex-col">
                <span className="text-callout font-medium text-label-primary leading-tight">{opt.label}</span>
                {opt.description && (
                  <span className="text-[11px] text-label-tertiary mt-0.5">{opt.description}</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
