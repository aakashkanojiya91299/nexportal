'use client'

import React from 'react'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface StepItem {
  label: string
  description?: string
}

export interface StepperProps {
  steps: StepItem[]
  /** 0-indexed active step. Pass steps.length to mark all complete. */
  current: number
  orientation?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  onNext?: () => void
  onBack?: () => void
  onSubmit?: () => void
  submitLabel?: string
  nextLabel?: string
  backLabel?: string
  isSubmitting?: boolean
}

export function Stepper({
  steps,
  current,
  orientation = 'horizontal',
  className,
  style,
  onNext,
  onBack,
  onSubmit,
  submitLabel,
  nextLabel,
  backLabel,
  isSubmitting,
}: StepperProps) {
  const navButtons = (onNext || onBack || onSubmit) ? (
    <div className="mt-6 flex items-center justify-between">
      <div>
        {onBack && current > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl text-callout font-medium border border-separator-opaque text-label-secondary hover:bg-surface-secondary transition-colors"
          >
            {backLabel ?? 'Back'}
          </button>
        )}
      </div>
      <div>
        {current < steps.length - 1 && onNext && (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2 rounded-xl text-callout font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--primary, #000080)' }}
          >
            {nextLabel ?? 'Next'}
          </button>
        )}
        {current === steps.length - 1 && onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-callout font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--success, #138808)' }}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitLabel ?? 'Submit'}
          </button>
        )}
      </div>
    </div>
  ) : null

  if (orientation === 'vertical') {
    return (
      <div className={cn('flex flex-col', className)} style={style}>
        {steps.map((step, i) => {
          const isComplete = i < current
          const isCurrent  = i === current
          const isLast     = i === steps.length - 1
          return (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold flex-shrink-0 transition-all duration-200',
                  isComplete
                    ? 'bg-[color:var(--primary,#000080)] border-[color:var(--primary,#000080)] text-white'
                    : isCurrent
                    ? 'border-[color:var(--primary,#000080)] bg-white text-[color:var(--primary,#000080)]'
                    : 'border-gray-300 bg-white text-gray-400',
                )}>
                  {isComplete ? <Check className="w-4 h-4" /> : <span>{i + 1}</span>}
                </div>
                {!isLast && (
                  <div className={cn(
                    'w-0.5 flex-1 min-h-8 my-1 transition-colors duration-200',
                    isComplete ? 'bg-[color:var(--primary,#000080)]' : 'bg-gray-200',
                  )} />
                )}
              </div>
              <div className={cn('pt-0.5', isLast ? 'pb-0' : 'pb-6')}>
                <p className={cn(
                  'text-sm font-semibold leading-tight',
                  isCurrent  ? 'text-[color:var(--primary,#000080)]'
                    : isComplete ? 'text-label-primary'
                    : 'text-label-tertiary',
                )}>{step.label}</p>
                {step.description && (
                  <p className="text-xs text-label-tertiary mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
        {navButtons}
      </div>
    )
  }

  // Horizontal
  return (
    <div className={cn('flex flex-col', className)} style={style}>
      <div className="flex items-start">
        {steps.map((step, i) => {
          const isComplete = i < current
          const isCurrent  = i === current
          const isLast     = i === steps.length - 1
          return (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-all duration-200',
                  isComplete
                    ? 'bg-[color:var(--primary,#000080)] border-[color:var(--primary,#000080)] text-white'
                    : isCurrent
                    ? 'border-[color:var(--primary,#000080)] bg-white text-[color:var(--primary,#000080)]'
                    : 'border-gray-300 bg-white text-gray-400',
                )}>
                  {isComplete ? <Check className="w-4 h-4" /> : <span>{i + 1}</span>}
                </div>
                <div className="mt-2 text-center" style={{ maxWidth: 96 }}>
                  <p className={cn(
                    'text-xs font-semibold leading-tight',
                    isCurrent  ? 'text-[color:var(--primary,#000080)]'
                      : isComplete ? 'text-label-primary'
                      : 'text-label-tertiary',
                  )}>{step.label}</p>
                  {step.description && (
                    <p className="text-[10px] text-label-tertiary mt-0.5 leading-tight">{step.description}</p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className={cn(
                  'flex-1 h-0.5 mt-4 mx-2 transition-colors duration-200',
                  isComplete ? 'bg-[color:var(--primary,#000080)]' : 'bg-gray-200',
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
      {navButtons}
    </div>
  )
}
