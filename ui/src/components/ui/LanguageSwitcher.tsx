'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Languages } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface LanguageOption {
  code: string
  label: string
  /** Short display label shown on the button (e.g. "EN") */
  shortLabel?: string
  /** Optional native-script label (e.g. "हिन्दी") */
  nativeLabel?: string
}

export interface LanguageSwitcherProps {
  /** Available language options */
  options: LanguageOption[]
  /** Currently active language code */
  value: string
  onChange: (code: string) => void
  /** 'sm' compact icon-only | 'md' label + chevron (default) */
  size?: 'sm' | 'md'
  /** Lighter style for dark/colored backgrounds */
  onDark?: boolean
  /** Open the menu upwards (useful in footer) */
  dropUp?: boolean
  className?: string
}

const DEFAULT_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English',  shortLabel: 'EN' },
  { code: 'hi', label: 'हिन्दी',   shortLabel: 'HI', nativeLabel: 'हिन्दी' },
]

export function LanguageSwitcher({
  options = DEFAULT_OPTIONS,
  value,
  onChange,
  size = 'md',
  onDark = false,
  dropUp = false,
  className,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const active = options.find((o) => o.code === value) ?? options[0]

  const triggerBase = cn(
    'flex items-center gap-1.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    size === 'sm' ? 'p-1.5' : 'px-2.5 py-1.5',
    onDark
      ? 'text-white/70 hover:text-white hover:bg-white/10'
      : 'text-label-secondary hover:text-label-primary hover:bg-black/[0.04]',
  )

  const menuBase = cn(
    'absolute z-50 w-40 overflow-hidden rounded-xl border border-separator-opaque bg-white shadow-xl',
    dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
    'right-0',
  )

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <button type="button" onClick={() => setOpen((v) => !v)} className={triggerBase} aria-label="Switch language">
        <Languages className={cn('flex-shrink-0', size === 'sm' ? 'h-4 w-4' : 'h-3.5 w-3.5')} />
        {size === 'md' && (
          <>
            <span className="text-[12px] font-semibold">{active.shortLabel ?? active.code.toUpperCase()}</span>
            <ChevronDown className={cn('h-3 w-3 flex-shrink-0 transition-transform duration-200', open && 'rotate-180')} />
          </>
        )}
      </button>

      {open && (
        <div className={menuBase} style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          <div className="py-1">
            {options.map((opt) => {
              const isActive = opt.code === value
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => { onChange(opt.code); setOpen(false) }}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] transition-colors',
                    isActive
                      ? 'font-semibold text-[color:var(--primary,#000080)] bg-[color:var(--primary-soft,rgba(0,0,128,0.06))]'
                      : 'text-label-primary hover:bg-gray-50',
                  )}
                >
                  <span className="w-6 text-center text-[11px] font-bold text-label-tertiary">
                    {opt.shortLabel ?? opt.code.toUpperCase()}
                  </span>
                  <span className="flex-1 truncate">{opt.nativeLabel ?? opt.label}</span>
                  {isActive && <Check className="h-3.5 w-3.5 flex-shrink-0 text-[color:var(--primary,#000080)]" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
