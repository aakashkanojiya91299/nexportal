'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ChevronDown, Check, Search, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  label?: React.ReactNode
  labelRight?: React.ReactNode
  placeholder?: string
  searchPlaceholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  searchable?: boolean
  onAddNew?: () => void
  addNewLabel?: string
  required?: boolean
  className?: string
  containerClassName?: string
}

export function Select({
  options,
  value,
  onChange,
  label,
  labelRight,
  placeholder = 'Select an option…',
  searchPlaceholder = 'Search…',
  error,
  helperText,
  disabled = false,
  searchable = false,
  onAddNew,
  addNewLabel = 'Add new…',
  required,
  className,
  containerClassName,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options
    const q = query.trim().toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query, searchable])

  useEffect(() => {
    if (open && searchable) {
      const id = setTimeout(() => searchRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
    if (!open) setQuery('')
    return undefined
  }, [open, searchable])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)} ref={containerRef}>
      {(label || labelRight) && (
        <div className="flex items-center justify-between min-h-[24px]">
          {label && (
            <span className={cn('text-subhead font-medium', error ? 'text-red-500' : 'text-label-primary')}>
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </span>
          )}
          {labelRight && <div className="shrink-0">{labelRight}</div>}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex w-full items-center justify-between rounded-apple border bg-white px-3 py-2.5 min-h-[2.75rem]',
            'text-body transition-all focus:outline-none focus:ring-4',
            error
              ? 'border-red-400 focus:ring-red-50 focus:border-red-400'
              : 'border-separator-opaque focus:ring-primary/5 focus:border-primary',
            open && !error && 'border-primary ring-4 ring-primary/5',
            disabled && 'opacity-50 cursor-not-allowed bg-surface-secondary',
            className,
          )}
        >
          <span className={cn('truncate', !selected && 'text-label-tertiary')}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className={cn('w-4 h-4 text-label-tertiary shrink-0 ml-2 transition-transform duration-150', open && 'rotate-180')} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-apple border border-separator-opaque bg-white shadow-lg overflow-hidden">
            {searchable && (
              <div className="px-3 py-2 border-b border-surface-tertiary">
                <div className="flex items-center gap-2 text-label-tertiary">
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full text-body text-label-primary placeholder:text-label-tertiary bg-transparent outline-none"
                  />
                </div>
              </div>
            )}

            <ul className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-3 py-2 text-body text-label-tertiary text-center">No options found</li>
              )}
              {filtered.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-body text-left transition-colors',
                      'hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed',
                      value === opt.value && 'text-primary font-medium',
                    )}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>

            {onAddNew && (
              <div className="border-t border-surface-tertiary py-1">
                <button
                  type="button"
                  onClick={() => { onAddNew(); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-body text-primary hover:bg-primary-soft transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {addNewLabel}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-footnote text-red-500">{error}</p>}
      {helperText && !error && <p className="text-footnote text-label-secondary">{helperText}</p>}
    </div>
  )
}
