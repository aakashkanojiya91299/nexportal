'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  size?: 'sm' | 'md'
  className?: string
  id?: string
}

export function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled,
  label,
  description,
  size = 'md',
  className,
  id,
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const isOn = isControlled ? checked : internal
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  function toggle() {
    if (disabled) return
    const next = !isOn
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={isOn}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          'relative flex-shrink-0 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
          size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
          isOn
            ? 'focus:ring-[color:var(--primary,#000080)]/40'
            : 'focus:ring-gray-300',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        style={{
          background: isOn ? 'var(--primary, #000080)' : '#D1D5DB',
        }}
      >
        <span
          className={cn(
            'absolute top-0.5 block rounded-full bg-white shadow-sm transition-transform duration-200',
            size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
            isOn
              ? size === 'sm' ? 'translate-x-4' : 'translate-x-5'
              : 'translate-x-0.5',
          )}
        />
      </button>
      {(label || description) && (
        <label htmlFor={switchId} className={cn('flex flex-col', !disabled && 'cursor-pointer')}>
          {label && (
            <span className="text-callout font-medium text-label-primary leading-tight">{label}</span>
          )}
          {description && (
            <span className="text-[11px] text-label-tertiary mt-0.5">{description}</span>
          )}
        </label>
      )}
    </div>
  )
}
