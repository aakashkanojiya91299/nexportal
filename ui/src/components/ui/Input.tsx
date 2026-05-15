'use client'

import React, { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  labelRight?: React.ReactNode
  error?: string
  helperText?: string
  suffix?: React.ReactNode
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelRight, error, helperText, suffix, containerClassName, className, id, required, type, onChange, ...rest }, ref) => {
    const inputId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const isPassword = type === 'password'
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number') {
        let val = e.target.value.replace(/[^0-9.]/g, '')
        const parts = val.split('.')
        if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('')
        e.target.value = val
      }
      onChange?.(e)
    }

    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type === 'number' ? 'text' : type
    const rightSlot = isPassword ? (
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword(v => !v)}
        className="flex items-center justify-center text-label-tertiary hover:text-label-primary transition-colors"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    ) : suffix

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {(label || labelRight) && (
          <div className="flex items-center justify-between min-h-[24px]">
            {label && (
              <label htmlFor={inputId} className={cn('text-subhead font-medium', error ? 'text-red-500' : 'text-label-primary')}>
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            {labelRight && <div className="shrink-0">{labelRight}</div>}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            required={required}
            type={resolvedType}
            inputMode={type === 'number' ? (rest.inputMode ?? 'numeric') : rest.inputMode}
            onChange={handleChange}
            className={cn(
              'input-base',
              error && 'input-base-error',
              rightSlot && 'pr-10',
              className,
            )}
            {...rest}
          />
          {rightSlot && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-label-tertiary">
              {rightSlot}
            </div>
          )}
        </div>
        {error && <p className="text-footnote text-red-500">{error}</p>}
        {helperText && !error && <p className="text-footnote text-label-secondary">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
