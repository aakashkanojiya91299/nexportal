'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/cn'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface PopoverProps {
  trigger: React.ReactElement
  content: React.ReactNode
  placement?: PopoverPlacement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const PLACEMENT: Record<PopoverPlacement, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  right:  'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Popover({
  trigger, content, placement = 'bottom', open: controlled, onOpenChange, className,
}: PopoverProps) {
  const [internal, setInternal] = useState(false)
  const isControlled = controlled !== undefined
  const open = isControlled ? controlled : internal
  const ref = useRef<HTMLDivElement>(null)

  function toggle() {
    const next = !open
    if (!isControlled) setInternal(next)
    onOpenChange?.(next)
  }

  function close() {
    if (!isControlled) setInternal(false)
    onOpenChange?.(false)
  }

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex">
      {React.cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, { onClick: toggle })}
      {open && (
        <div className={cn(
          'absolute z-50 min-w-max rounded-xl border border-gray-200 bg-white shadow-lg p-3',
          PLACEMENT[placement],
          className,
        )}>
          {content}
        </div>
      )}
    </div>
  )
}
