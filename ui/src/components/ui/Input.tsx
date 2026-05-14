'use client'

import React, { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, containerClassName, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-subhead font-medium text-label-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('input-base', error && 'input-base-error', className)}
          {...rest}
        />
        {error && <p className="text-footnote text-red-500">{error}</p>}
        {helperText && !error && <p className="text-footnote text-label-secondary">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
