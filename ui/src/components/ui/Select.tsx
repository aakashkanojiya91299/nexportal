'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Check, Search, Plus, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
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
  clearable?: boolean
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
  clearable = false,
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

  // Group options if any have a group key
  const grouped = useMemo(() => {
    const map = new Map<string, SelectOption[]>()
    filtered.forEach((o) => {
      const key = o.group ?? ''
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(o)
    })
    return map
  }, [filtered])

  useEffect(() => {
    if (open && searchable) {
      const id = setTimeout(() => searchRef.current?.focus(), 50)
      return () => clearTimeout(id)
    }
    if (!open) setQuery('')
    return undefined
  }, [open, searchable])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleSelect(val: string) {
    onChange(val)
    setOpen(false)
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('')
  }

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
          <span className={cn('truncate flex-1 text-left', !selected && 'text-label-tertiary')}>
            {selected ? selected.label : placeholder}
          </span>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {clearable && selected && !disabled && (
              <span
                role="button"
                onClick={handleClear}
                className="text-label-quaternary hover:text-label-secondary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className={cn('h-4 w-4 text-label-tertiary transition-transform duration-150', open && 'rotate-180')} />
          </div>
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-apple border border-separator-opaque bg-white shadow-xl overflow-hidden">
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
                    const isSelected = value === opt.value
                    return (
                      <li key={opt.value}>
                        <button
                          type="button"
                          disabled={opt.disabled}
                          onClick={() => handleSelect(opt.value)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 text-body text-left transition-colors',
                            'hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed',
                            isSelected && 'bg-primary-soft/50',
                          )}
                        >
                          <span className={cn('truncate', isSelected ? 'text-primary font-medium' : 'text-label-secondary')}>
                            {opt.label}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" style={{ color: 'var(--primary, #000080)' }} />}
                        </button>
                      </li>
                    )
                  })}
                </React.Fragment>
              ))}
            </ul>

            {onAddNew && (
              <div className="border-t border-surface-tertiary py-1">
                <button
                  type="button"
                  onClick={() => { onAddNew(); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-body hover:bg-primary-soft transition-colors"
                  style={{ color: 'var(--primary, #000080)' }}
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
