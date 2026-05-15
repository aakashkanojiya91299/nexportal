'use client'

import React from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  error?: string
  size?: 'sm' | 'md'
  className?: string
  style?: React.CSSProperties
  id?: string
}

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate,
  onChange,
  disabled,
  label,
  description,
  error,
  size = 'md',
  className,
  style,
  id,
}: CheckboxProps) {
  const [internal, setInternal] = React.useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internal
  const checkboxId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  function toggle() {
    if (disabled) return
    const next = !isChecked
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const isActive = isChecked || indeterminate

  return (
    <div className={cn('flex items-start gap-2.5', className)}
        style={style}>
      <button
        type="button"
        role="checkbox"
        id={checkboxId}
        aria-checked={indeterminate ? 'mixed' : isChecked}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'flex-shrink-0 rounded-md border-2 transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1',
          size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
          isActive
            ? 'focus:ring-[color:var(--primary,#000080)]/40'
            : 'focus:ring-gray-300',
          error && !isActive
            ? 'border-red-400'
            : undefined,
          disabled && 'cursor-not-allowed opacity-50',
        )}
        style={
          isActive
            ? { background: 'var(--primary, #000080)', borderColor: 'var(--primary, #000080)' }
            : { background: 'white', borderColor: error ? undefined : '#D1D5DB' }
        }
      >
        {indeterminate ? (
          <Minus className={cn('text-white', size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} strokeWidth={3} />
        ) : isChecked ? (
          <Check className={cn('text-white', size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} strokeWidth={3} />
        ) : null}
      </button>
      {(label || description) && (
        <label htmlFor={checkboxId} className={cn('flex flex-col', !disabled && 'cursor-pointer')}>
          {label && (
            <span className={cn('font-medium text-label-primary leading-tight', size === 'sm' ? 'text-[13px]' : 'text-callout')}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-label-tertiary mt-0.5">{description}</span>
          )}
          {error && (
            <span className="text-[11px] text-red-500 mt-0.5">{error}</span>
          )}
        </label>
      )}
    </div>
  )
}
