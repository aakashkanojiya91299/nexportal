'use client'

import React, { createContext, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

interface AccordionContextValue {
  open: string[]
  toggle: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue>({
  open: [],
  toggle: () => {},
  type: 'single',
})

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onChange,
  children,
  className,
  style,
}: AccordionProps) {
  const toArray = (v?: string | string[]) =>
    v === undefined ? [] : Array.isArray(v) ? v : [v]

  const [internal, setInternal] = useState<string[]>(toArray(defaultValue))
  const isControlled = value !== undefined
  const open = isControlled ? toArray(value) : internal

  function toggle(val: string) {
    let next: string[]
    if (type === 'single') {
      next = open.includes(val) ? [] : [val]
    } else {
      next = open.includes(val) ? open.filter((v) => v !== val) : [...open, val]
    }
    if (!isControlled) setInternal(next)
    onChange?.(type === 'single' ? (next[0] ?? '') : next)
  }

  return (
    <AccordionContext.Provider value={{ open, toggle, type }}>
      <div className={cn('flex flex-col divide-y divide-separator-opaque', className)}
        style={style}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  trigger: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function AccordionItem({ value, trigger, children, disabled, className, style }: AccordionItemProps) {
  const { open, toggle } = useContext(AccordionContext)
  const isOpen = open.includes(value)

  return (
    <div className={cn('py-1', className)} style={style}>
      <button
        type="button"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && toggle(value)}
        className={cn(
          'flex w-full items-center justify-between gap-4 py-3 text-left text-callout font-medium text-label-primary transition-colors hover:text-[color:var(--primary,#000080)] focus:outline-none',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <span>{trigger}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 flex-shrink-0 text-label-tertiary transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[2000px] opacity-100 pb-3' : 'max-h-0 opacity-0',
        )}
      >
        <div className="text-callout text-label-secondary">{children}</div>
      </div>
    </div>
  )
}
