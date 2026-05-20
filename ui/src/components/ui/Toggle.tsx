'use client'

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Toggle — a two-state pressed button.
 * ToggleGroup — group of mutually exclusive (or multi-select) toggles.
 *
 * Matches shadcn/ui Toggle + ToggleGroup API.
 *
 * Usage:
 *   <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
 *     <Bold className="h-4 w-4" />
 *   </Toggle>
 *
 *   <ToggleGroup type="single" value={align} onValueChange={setAlign}>
 *     <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
 *     <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
 *     <ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
 *   </ToggleGroup>
 */

// ─── Toggle ───────────────────────────────────────────────────────────────────

export type ToggleVariant = 'default' | 'outline'
export type ToggleSize    = 'sm' | 'md' | 'lg'

const toggleBase = [
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'data-[state=on]:font-semibold',
]

const toggleVariants: Record<ToggleVariant, string> = {
  default: cn(
    'bg-transparent text-label-secondary hover:bg-fill-secondary hover:text-label-primary',
    'data-[state=on]:text-white',
  ),
  outline: cn(
    'border border-separator-opaque bg-transparent text-label-secondary',
    'hover:bg-fill-secondary hover:text-label-primary',
    'data-[state=on]:border-transparent data-[state=on]:text-white',
  ),
}

const toggleSizes: Record<ToggleSize, string> = {
  sm: 'h-8 px-2.5 text-[12px]',
  md: 'h-9 px-3 text-[13px]',
  lg: 'h-10 px-4 text-[14px]',
}

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  variant?: ToggleVariant
  size?: ToggleSize
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    variant = 'default',
    size = 'md',
    className,
    children,
    style,
    ...props
  }, ref) => {
    const [uncontrolled, setUncontrolled] = useState(defaultPressed)
    const isControlled = controlledPressed !== undefined
    const isOn = isControlled ? controlledPressed! : uncontrolled

    function toggle() {
      if (!isControlled) setUncontrolled(!isOn)
      onPressedChange?.(!isOn)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isOn}
        data-state={isOn ? 'on' : 'off'}
        onClick={toggle}
        className={cn(toggleBase, toggleVariants[variant], toggleSizes[size], className)}
        style={isOn ? { backgroundColor: 'var(--primary, #000080)', ...style } : style}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Toggle.displayName = 'Toggle'

// ─── ToggleGroup context ──────────────────────────────────────────────────────

interface ToggleGroupCtx {
  type: 'single' | 'multiple'
  value: string | string[]
  onValueChange: (v: string) => void
  variant: ToggleVariant
  size: ToggleSize
}

const ToggleGroupContext = createContext<ToggleGroupCtx | null>(null)

function useToggleGroupCtx() {
  const ctx = useContext(ToggleGroupContext)
  if (!ctx) throw new Error('ToggleGroupItem must be inside <ToggleGroup>')
  return ctx
}

// ─── ToggleGroup ──────────────────────────────────────────────────────────────

export interface ToggleGroupSingleProps {
  type: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: ToggleVariant
  size?: ToggleSize
  children: ReactNode
  className?: string
}

export interface ToggleGroupMultipleProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  variant?: ToggleVariant
  size?: ToggleSize
  children: ReactNode
  className?: string
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

export function ToggleGroup({
  type,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = 'default',
  size = 'md',
  children,
  className,
}: ToggleGroupProps) {
  const [uncontrolled, setUncontrolled] = useState<string | string[]>(
    defaultValue ?? (type === 'multiple' ? [] : ''),
  )
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue! : uncontrolled

  function handleChange(v: string) {
    if (type === 'single') {
      const next = value === v ? '' : v
      if (!isControlled) setUncontrolled(next)
      ;(onValueChange as ((val: string) => void) | undefined)?.(next)
    } else {
      const arr  = value as string[]
      const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
      if (!isControlled) setUncontrolled(next)
      ;(onValueChange as ((val: string[]) => void) | undefined)?.(next)
    }
  }

  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange: handleChange, variant, size }}>
      <div
        role="group"
        className={cn('flex items-center gap-1', className)}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
}

// ─── ToggleGroupItem ──────────────────────────────────────────────────────────

export interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  variant?: ToggleVariant
  size?: ToggleSize
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, variant, size, className, children, style, ...props }, ref) => {
    const ctx = useToggleGroupCtx()
    const v  = variant ?? ctx.variant
    const s  = size    ?? ctx.size
    const isOn = Array.isArray(ctx.value)
      ? ctx.value.includes(value)
      : ctx.value === value

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isOn}
        data-state={isOn ? 'on' : 'off'}
        onClick={() => ctx.onValueChange(value)}
        className={cn(toggleBase, toggleVariants[v], toggleSizes[s], className)}
        style={isOn ? { backgroundColor: 'var(--primary, #000080)', ...style } : style}
        {...props}
      >
        {children}
      </button>
    )
  },
)
ToggleGroupItem.displayName = 'ToggleGroupItem'
