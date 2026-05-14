'use client'

import React, { forwardRef, type InputHTMLAttributes } from 'react'
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number') {
        let val = e.target.value.replace(/[^0-9.]/g, '')
        const parts = val.split('.')
        if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('')
        e.target.value = val
      }
      onChange?.(e)
    }

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
            type={type === 'number' ? 'text' : type}
            inputMode={type === 'number' ? (rest.inputMode ?? 'numeric') : rest.inputMode}
            onChange={handleChange}
            className={cn(
              'input-base',
              error && 'input-base-error',
              suffix && 'pr-10',
              className,
            )}
            {...rest}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-label-tertiary">
              {suffix}
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
