'use client'

import React from 'react'
import { Check } from 'lucide-react'
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
}

export function Stepper({ steps, current, orientation = 'horizontal', className, style }: StepperProps) {
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
      </div>
    )
  }

  // Horizontal
  return (
    <div className={cn('flex items-start', className)}
        style={style}>
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
  )
}
