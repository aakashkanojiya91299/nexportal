'use client'

import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Collapsible — expandable / collapsible content with smooth animation.
 * Matches shadcn/ui Collapsible API.
 *
 * Usage:
 *   <Collapsible open={isOpen} onOpenChange={setIsOpen}>
 *     <CollapsibleTrigger asChild>
 *       <Button variant="ghost">Toggle <ChevronsUpDown /></Button>
 *     </CollapsibleTrigger>
 *     <CollapsibleContent>
 *       ...hidden content...
 *     </CollapsibleContent>
 *   </Collapsible>
 */

// ─── Context ──────────────────────────────────────────────────────────────────

interface CollapsibleCtx {
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled: boolean
}

const CollapsibleContext = createContext<CollapsibleCtx | null>(null)

function useCollapsibleCtx() {
  const ctx = useContext(CollapsibleContext)
  if (!ctx) throw new Error('CollapsibleTrigger/CollapsibleContent must be inside <Collapsible>')
  return ctx
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface CollapsibleProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
  style,
}: CollapsibleProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen! : uncontrolled

  function handleChange(next: boolean) {
    if (disabled) return
    if (!isControlled) setUncontrolled(next)
    onOpenChange?.(next)
  }

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: handleChange, disabled }}>
      <div
        data-state={open ? 'open' : 'closed'}
        className={cn('', className)}
        style={style}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export interface CollapsibleTriggerProps {
  children: ReactNode
  className?: string
  asChild?: boolean
}

export function CollapsibleTrigger({ children, className, asChild }: CollapsibleTriggerProps) {
  const { open, onOpenChange, disabled } = useCollapsibleCtx()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as any).props?.onClick?.(e)
        onOpenChange(!open)
      },
      'aria-expanded': open,
      'data-state': open ? 'open' : 'closed',
      disabled: disabled || undefined,
    })
  }

  return (
    <button
      type="button"
      onClick={() => onOpenChange(!open)}
      aria-expanded={open}
      data-state={open ? 'open' : 'closed'}
      disabled={disabled}
      className={cn('flex w-full items-center justify-between', className)}
    >
      {children}
    </button>
  )
}

// ─── Content (animated expand/collapse) ──────────────────────────────────────

export interface CollapsibleContentProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function CollapsibleContent({ children, className, style }: CollapsibleContentProps) {
  const { open } = useCollapsibleCtx()
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>(open ? 'auto' : 0)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    if (open) {
      setVisible(true)
      const scrollH = el.scrollHeight
      setHeight(scrollH)
      const t = setTimeout(() => setHeight('auto'), 260)
      return () => clearTimeout(t)
    } else {
      // Snap from auto → pixel so we can animate to 0
      const scrollH = el.scrollHeight
      setHeight(scrollH)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0)
        })
      })
      const t = setTimeout(() => setVisible(false), 260)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible && height === 0) return null

  return (
    <div
      data-state={open ? 'open' : 'closed'}
      style={{
        height: height === 'auto' ? 'auto' : `${height}px`,
        overflow: 'hidden',
        transition: 'height 260ms cubic-bezier(0.4,0,0.2,1)',
        ...style,
      }}
    >
      <div ref={contentRef} className={cn('pb-1', className)}>
        {children}
      </div>
    </div>
  )
}
