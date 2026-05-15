'use client'

import React, { createContext, useContext, useState } from 'react'
import { cn } from '../../lib/cn'

interface TabsContextValue {
  active: string
  setActive: (v: string) => void
  variant: 'line' | 'pill' | 'card'
}

const TabsContext = createContext<TabsContextValue>({
  active: '',
  setActive: () => {},
  variant: 'line',
})

export interface TabsProps {
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  variant?: 'line' | 'pill' | 'card'
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Tabs({
  defaultValue,
  value,
  onChange,
  variant = 'line',
  children,
  className,
  style,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? '')
  const isControlled = value !== undefined
  const active = isControlled ? value : internal

  function setActive(v: string) {
    if (!isControlled) setInternal(v)
    onChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ active, setActive, variant }}>
      <div className={cn('flex flex-col', className)}
        style={style}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function TabsList({ children, className }: TabsListProps) {
  const { variant } = useContext(TabsContext)

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-0.5',
        variant === 'line' && 'border-b border-separator-opaque',
        variant === 'pill' && 'bg-surface-secondary rounded-xl p-1 gap-1',
        variant === 'card' && 'bg-white rounded-xl border border-separator-opaque p-1 gap-1 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function TabsTrigger({ value, children, disabled, className }: TabsTriggerProps) {
  const { active, setActive, variant } = useContext(TabsContext)
  const isActive = active === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setActive(value)}
      className={cn(
        'relative flex items-center gap-1.5 text-callout font-medium transition-all duration-150 focus:outline-none whitespace-nowrap',
        disabled && 'cursor-not-allowed opacity-50',

        variant === 'line' && cn(
          'px-4 py-2.5 border-b-2 -mb-px',
          isActive
            ? 'text-label-primary border-[color:var(--primary,#000080)]'
            : 'text-label-tertiary border-transparent hover:text-label-secondary hover:border-separator-opaque',
        ),

        variant === 'pill' && cn(
          'px-4 py-1.5 rounded-lg',
          isActive
            ? 'bg-white text-label-primary shadow-sm'
            : 'text-label-tertiary hover:text-label-secondary',
        ),

        variant === 'card' && cn(
          'px-4 py-1.5 rounded-lg',
          isActive
            ? 'text-white shadow-sm'
            : 'text-label-tertiary hover:text-label-secondary',
        ),
        className,
      )}
      style={
        variant === 'card' && isActive
          ? { background: 'var(--primary, #000080)' }
          : undefined
      }
    >
      {children}
    </button>
  )
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function TabsContent({ value, children, className, style }: TabsContentProps) {
  const { active } = useContext(TabsContext)
  if (active !== value) return null
  return (
    <div role="tabpanel" className={cn('mt-4', className)} style={style}>
      {children}
    </div>
  )
}
