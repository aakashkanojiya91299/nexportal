'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  label?: React.ReactNode
  labelRight?: React.ReactNode
  placeholder?: string
  searchPlaceholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  searchable?: boolean
  maxDisplay?: number
  selectAll?: boolean
  required?: boolean
  className?: string
  containerClassName?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  labelRight,
  placeholder = 'Select options…',
  searchPlaceholder = 'Search…',
  error,
  helperText,
  disabled = false,
  searchable = false,
  maxDisplay = 3,
  selectAll = false,
  required,
  className,
  containerClassName,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  // Group options if any have a group key
  const grouped = useMemo(() => {
    const map = new Map<string, MultiSelectOption[]>()
    filtered.forEach((o) => {
      const key = o.group ?? ''
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(o)
    })
    return map
  }, [filtered])

  const allSelected = options.every((o) => o.disabled || value.includes(o.value))
  const someSelected = value.length > 0

  function toggle(val: string) {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  function toggleAll() {
    if (allSelected) {
      onChange([])
    } else {
      onChange(options.filter((o) => !o.disabled).map((o) => o.value))
    }
  }

  function remove(val: string, e: React.MouseEvent) {
    e.stopPropagation()
    onChange(value.filter((v) => v !== val))
  }

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search on open
  useEffect(() => {
    if (open && searchable) {
      const t = setTimeout(() => searchRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
    if (!open) setQuery('')
    return undefined
  }, [open, searchable])

  const selectedLabels = value
    .map((v) => options.find((o) => o.value === v)?.label)
    .filter(Boolean) as string[]

  const visibleChips = selectedLabels.slice(0, maxDisplay)
  const overflowCount = selectedLabels.length - visibleChips.length

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
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex w-full items-center gap-2 rounded-apple border bg-white px-3 py-2 min-h-[2.75rem]',
            'text-body transition-all focus:outline-none focus:ring-4 flex-wrap',
            error
              ? 'border-red-400 focus:ring-red-50 focus:border-red-400'
              : 'border-separator-opaque focus:ring-primary/5 focus:border-primary',
            open && !error && 'border-primary ring-4 ring-primary/5',
            disabled && 'opacity-50 cursor-not-allowed bg-surface-secondary',
            className,
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-0">
            {visibleChips.length === 0 ? (
              <span className="text-label-tertiary truncate">{placeholder}</span>
            ) : (
              <>
                {visibleChips.map((lbl) => {
                  const opt = options.find((o) => o.label === lbl)
                  return (
                    <span
                      key={opt?.value}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[12px] font-medium text-white shrink-0"
                      style={{ background: 'var(--primary, #000080)' }}
                    >
                      {lbl}
                      <span
                        role="button"
                        onClick={(e) => opt && remove(opt.value, e)}
                        className="hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </span>
                  )
                })}
                {overflowCount > 0 && (
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-semibold shrink-0"
                    style={{ background: 'var(--primary-soft, rgba(0,0,128,0.1))', color: 'var(--primary, #000080)' }}
                  >
                    +{overflowCount} more
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1">
            {someSelected && !disabled && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); onChange([]) }}
                className="text-label-quaternary hover:text-label-secondary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className={cn('h-4 w-4 text-label-tertiary transition-transform duration-150', open && 'rotate-180')} />
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-apple border border-separator-opaque bg-white shadow-xl overflow-hidden">
            {/* Search */}
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

            {/* Select all */}
            {selectAll && !query && (
              <div className="border-b border-surface-tertiary">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-body text-left hover:bg-surface-secondary transition-colors"
                >
                  {/* Checkbox */}
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors"
                    style={
                      allSelected
                        ? { background: 'var(--primary,#000080)', borderColor: 'var(--primary,#000080)' }
                        : someSelected
                        ? { background: 'var(--primary,#000080)', borderColor: 'var(--primary,#000080)' }
                        : { borderColor: '#D1D5DB' }
                    }
                  >
                    {allSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                    {!allSelected && someSelected && (
                      <span className="h-0.5 w-2 bg-white rounded-full" />
                    )}
                  </span>
                  <span className={cn('font-medium', allSelected ? 'text-label-primary' : 'text-label-secondary')}>
                    {allSelected ? 'Deselect all' : 'Select all'}
                  </span>
                  {someSelected && (
                    <span
                      className="ml-auto text-[11px] font-semibold rounded-full px-2 py-0.5"
                      style={{ background: 'var(--primary-soft,rgba(0,0,128,0.1))', color: 'var(--primary,#000080)' }}
                    >
                      {value.length} / {options.length}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Options list */}
            <ul className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 && (
                <li className="px-3 py-3 text-body text-label-tertiary text-center">No options found</li>
              )}

              {Array.from(grouped.entries()).map(([group, items]) => (
                <React.Fragment key={group}>
                  {group && (
                    <li className="px-3 pt-2 pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-label-quaternary">
                        {group}
                      </span>
                    </li>
                  )}
                  {items.map((opt) => {
                    const isSelected = value.includes(opt.value)
                    return (
                      <li key={opt.value}>
                        <button
                          type="button"
                          disabled={opt.disabled}
                          onClick={() => toggle(opt.value)}
                          className={cn(
                            'flex w-full items-center gap-3 px-3 py-2.5 text-body text-left transition-colors',
                            'hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed',
                            isSelected && 'bg-primary-soft/50',
                          )}
                        >
                          {/* Checkbox */}
                          <span
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all duration-150"
                            style={
                              isSelected
                                ? { background: 'var(--primary,#000080)', borderColor: 'var(--primary,#000080)' }
                                : { borderColor: '#D1D5DB' }
                            }
                          >
                            {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                          </span>
                          <span className={cn('flex-1 truncate', isSelected ? 'font-medium text-label-primary' : 'text-label-secondary')}>
                            {opt.label}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </React.Fragment>
              ))}
            </ul>

            {/* Footer: count + clear */}
            {value.length > 0 && (
              <div className="border-t border-surface-tertiary px-3 py-2 flex items-center justify-between">
                <span className="text-[12px] text-label-tertiary">
                  {value.length} selected
                </span>
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-[12px] font-medium text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear all
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
