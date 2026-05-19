'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check, Search } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  /** Current text value (free text or a selected option's label) */
  value: string
  onChange: (value: string) => void
  /** Label shown above the input */
  label?: string
  placeholder?: string
  disabled?: boolean
  /** Show error ring */
  error?: boolean
  errorText?: string
  helperText?: string
  className?: string
  inputClassName?: string
  /** Max height of the dropdown list (default 260px) */
  maxDropdownHeight?: number
}

export function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = 'Type or select…',
  disabled = false,
  error = false,
  errorText,
  helperText,
  className,
  inputClassName,
  maxDropdownHeight = 260,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  const filteredOptions = useMemo(() => {
    if (!value) return options
    const q = value.toLowerCase().trim()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, value])

  // Position dropdown below input using a portal so it isn't clipped
  const updatePosition = () => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    setDropdownStyle({
      position: 'fixed',
      top: r.bottom + 4,
      left: r.left,
      width: r.width,
      zIndex: 9999,
    })
  }

  useEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (wrapRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleSelect = (opt: ComboboxOption) => {
    if (opt.disabled) return
    onChange(opt.label)
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'ArrowDown' && !open) setOpen(true)
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-footnote font-semibold text-label-primary">{label}</label>
      )}

      <div ref={wrapRef} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            'w-full rounded-xl border bg-white px-3 py-2.5 pr-10 text-[14px] text-label-primary placeholder:text-label-tertiary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
              : 'border-separator-opaque focus:border-[color:var(--primary,#000080)] focus:ring-[color:var(--primary,#000080)]/10',
            disabled && 'cursor-not-allowed opacity-50 bg-gray-50',
            inputClassName,
          )}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-label-tertiary">
          {value ? (
            <Search className="h-4 w-4" />
          ) : (
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} />
          )}
        </span>
      </div>

      {/* Portaled dropdown */}
      {open && !disabled && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="overflow-hidden rounded-xl border border-separator-opaque bg-white shadow-xl"
            style={{ ...dropdownStyle, maxHeight: maxDropdownHeight + 8 }}
          >
            <div
              className="overflow-y-auto p-1 flex flex-col gap-0.5"
              style={{ maxHeight: maxDropdownHeight }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const selected = value === opt.label || value === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onMouseDown={(e) => { e.preventDefault(); handleSelect(opt) }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-left transition-colors',
                        selected
                          ? 'bg-[color:var(--primary-soft,rgba(0,0,128,0.08))] font-semibold text-[color:var(--primary,#000080)]'
                          : 'text-label-primary hover:bg-gray-50',
                        opt.disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent',
                      )}
                    >
                      <span>{opt.label}</span>
                      {selected && <Check className="h-3.5 w-3.5 flex-shrink-0 text-[color:var(--primary,#000080)]" />}
                    </button>
                  )
                })
              ) : (
                <div className="px-3 py-4 text-center text-[12px] text-label-tertiary italic">
                  {value ? `No matches for "${value}"` : 'No suggestions available'}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}

      {(errorText || helperText) && (
        <p className={cn('text-[12px]', errorText ? 'text-red-500' : 'text-label-tertiary')}>
          {errorText || helperText}
        </p>
      )}
    </div>
  )
}
