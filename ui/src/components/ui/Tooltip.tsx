'use client'

import React, { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: React.ReactNode
  placement?: TooltipPlacement
  delay?: number
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

interface Position { top: number; left: number }

export function Tooltip({
  content,
  placement = 'top',
  delay = 300,
  disabled,
  children,
  className,
}: TooltipProps) {
  const [pos, setPos] = useState<Position | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const show = useCallback(
    (e: React.MouseEvent | React.FocusEvent) => {
      if (disabled) return
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        const GAP = 8
        let top = 0, left = 0
        if (placement === 'top')    { top = rect.top - GAP; left = rect.left + rect.width / 2 }
        if (placement === 'bottom') { top = rect.bottom + GAP; left = rect.left + rect.width / 2 }
        if (placement === 'left')   { top = rect.top + rect.height / 2; left = rect.left - GAP }
        if (placement === 'right')  { top = rect.top + rect.height / 2; left = rect.right + GAP }
        setPos({ top, left })
      }, delay)
    },
    [disabled, delay, placement],
  )

  const hide = useCallback(() => {
    clearTimeout(timer.current)
    setPos(null)
  }, [])

  const transformMap: Record<TooltipPlacement, string> = {
    top: 'translate(-50%, -100%)',
    bottom: 'translate(-50%, 0%)',
    left: 'translate(-100%, -50%)',
    right: 'translate(0%, -50%)',
  }

  const arrowClass: Record<TooltipPlacement, string> = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 rotate-45',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 rotate-45',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 rotate-45',
  }

  return (
    <>
      <span
        className="inline-flex items-center"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {pos && typeof document !== 'undefined' &&
        createPortal(
          <div
            className={cn(
              'pointer-events-none fixed z-[9999] whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-white shadow-lg',
              className,
            )}
            style={{
              top: pos.top,
              left: pos.left,
              transform: transformMap[placement],
              background: 'var(--primary, #000080)',
            }}
          >
            {content}
            <div
              className={cn('absolute h-2 w-2', arrowClass[placement])}
              style={{ background: 'var(--primary, #000080)' }}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
