'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  /** Visually mutes the label (e.g. for disabled fields) */
  disabled?: boolean
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, disabled, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-[13px] font-medium text-label-primary leading-none',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
        disabled && 'opacity-60 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
      )}
    </label>
  ),
)
Label.displayName = 'Label'
