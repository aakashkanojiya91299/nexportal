'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'default' | 'success' | 'danger' | 'warning'
  disabled?: boolean
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[]
  trigger?: ReactNode
  triggerClassName?: string
}

const variantStyles: Record<string, string> = {
  default:  'text-label-primary hover:bg-surface-secondary',
  success:  'text-green-700 hover:bg-green-50',
  danger:   'text-red-600 hover:bg-red-50',
  warning:  'text-yellow-700 hover:bg-yellow-50',
}

const MENU_WIDTH = 168

function computePlacement(triggerRect: DOMRect) {
  const gap = 4
  const pad = 8
  const menuHeight = 44 * 5 // rough estimate
  const spaceBelow = window.innerHeight - triggerRect.bottom - gap - pad
  const spaceAbove = triggerRect.top - gap - pad
  const openUp = spaceBelow < Math.min(menuHeight, 180) && spaceAbove > spaceBelow

  const right = triggerRect.right
  const left = Math.min(
    Math.max(right - MENU_WIDTH, pad),
    window.innerWidth - MENU_WIDTH - pad,
  )
  const top = openUp
    ? Math.max(pad, triggerRect.top - Math.min(menuHeight, spaceAbove) - gap)
    : triggerRect.bottom + gap

  const maxHeight = openUp ? spaceAbove : spaceBelow
  return { top, left, maxHeight: Math.max(80, maxHeight) }
}

export function DropdownMenu({ items, trigger, triggerClassName }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; maxHeight: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    document.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  if (items.length === 0) return null

  const handleOpen = () => {
    if (!triggerRef.current) return
    setCoords(computePlacement(triggerRef.current.getBoundingClientRect()))
    setOpen((v) => !v)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded-lg border border-separator text-label-tertiary',
          'bg-white hover:bg-surface-secondary hover:text-label-primary transition-colors',
          triggerClassName,
        )}
      >
        {trigger ?? <MoreVertical className="w-4 h-4" />}
      </button>

      {open && coords && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'fixed', top: coords.top, left: coords.left, zIndex: 9999, minWidth: MENU_WIDTH, maxHeight: coords.maxHeight }}
          className="bg-white rounded-xl border border-separator-opaque shadow-lg py-1 overflow-y-auto"
        >
          {items.map((item, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={() => { item.onClick(); setOpen(false) }}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-callout font-medium transition-colors',
                'disabled:opacity-50 disabled:pointer-events-none',
                variantStyles[item.variant ?? 'default'],
              )}
            >
              {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  )
}
