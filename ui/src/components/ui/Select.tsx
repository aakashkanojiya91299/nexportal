'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Check, Search, Plus, ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

interface SelectCommonProps {
  options: SelectOption[]
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
  maxTagsShown?: number
}

interface SingleSelectProps extends SelectCommonProps {
  multiple?: false
  value?: string
  onChange?: (value: string) => void
}

interface MultiSelectProps extends SelectCommonProps {
  multiple: true
  value?: string[]
  onChange?: (values: string[]) => void
}

export type SelectProps = SingleSelectProps | MultiSelectProps

export function Select(props: SelectProps) {
  const {
    options,
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
    maxTagsShown = 3,
  } = props

  const multiple = props.multiple === true
  const singleValue = !multiple ? ((props as SingleSelectProps).value ?? '') : ''
  const multiValues = multiple ? ((props as MultiSelectProps).value ?? []) : []

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedSingle = !multiple ? options.find((o) => o.value === singleValue) : null
  const selectedMulti = multiple ? options.filter((o) => multiValues.includes(o.value)) : []

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options
    const q = query.trim().toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query, searchable])

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
    if (!multiple) {
      ;(props as SingleSelectProps).onChange?.(val)
      setOpen(false)
    } else {
      const mp = props as MultiSelectProps
      const current = mp.value ?? []
      mp.onChange?.(current.includes(val) ? current.filter((v) => v !== val) : [...current, val])
    }
  }

  function handleClearSingle(e: React.MouseEvent) {
    e.stopPropagation()
    ;(props as SingleSelectProps).onChange?.('')
  }

  function handleClearAll(e: React.MouseEvent) {
    e.stopPropagation()
    ;(props as MultiSelectProps).onChange?.([])
  }

  function handleRemoveTag(val: string, e: React.MouseEvent) {
    e.stopPropagation()
    const mp = props as MultiSelectProps
    const current = mp.value ?? []
    mp.onChange?.(current.filter((v) => v !== val))
  }

  const enabledOptions = options.filter((o) => !o.disabled)

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
            'flex w-full items-center gap-2 rounded-xl border bg-white px-3 min-h-[2.75rem]',
            multiple && selectedMulti.length > 0 ? 'py-2' : 'py-2.5',
            'text-body transition-all focus:outline-none focus:ring-4',
            error
              ? 'border-red-400 focus:ring-red-50 focus:border-red-400'
              : 'border-separator-opaque focus:ring-primary/5 focus:border-primary',
            open && !error && 'border-primary ring-4 ring-primary/5',
            disabled && 'opacity-50 cursor-not-allowed bg-surface-secondary',
            className,
          )}
        >
          {/* Trigger label */}
          {!multiple ? (
            <span className={cn('truncate flex-1 text-left', !selectedSingle && 'text-label-tertiary')}>
              {selectedSingle ? selectedSingle.label : placeholder}
            </span>
          ) : selectedMulti.length === 0 ? (
            <span className="flex-1 text-left text-label-tertiary">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {selectedMulti.slice(0, maxTagsShown).map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{ background: 'color-mix(in srgb, var(--primary, #000080) 10%, transparent)', color: 'var(--primary, #000080)' }}
                >
                  <span className="truncate max-w-[80px]">{opt.label}</span>
                  <span
                    role="button"
                    onClick={(e) => handleRemoveTag(opt.value, e)}
                    className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </span>
                </span>
              ))}
              {selectedMulti.length > maxTagsShown && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-surface-secondary text-label-secondary">
                  +{selectedMulti.length - maxTagsShown} more
                </span>
              )}
            </div>
          )}

          {/* Right icons */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {clearable && !multiple && selectedSingle && !disabled && (
              <span
                role="button"
                onClick={handleClearSingle}
                className="text-label-quaternary hover:text-label-secondary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            {clearable && multiple && selectedMulti.length > 0 && !disabled && (
              <span
                role="button"
                onClick={handleClearAll}
                className="text-caption1 text-label-tertiary hover:text-label-secondary transition-colors font-medium px-0.5"
              >
                Clear
              </span>
            )}
            <ChevronDown className={cn('h-4 w-4 text-label-tertiary transition-transform duration-200', open && 'rotate-180')} />
          </div>
        </button>

        {open && (
          <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-separator-opaque bg-white shadow-xl overflow-hidden">

            {/* Search bar */}
            {searchable && (
              <div className="px-2 pt-2 pb-1">
                <div className="flex items-center gap-2 rounded-xl bg-surface-secondary px-2.5 py-1.5 text-label-tertiary">
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

            {/* Multi: select-all row */}
            {multiple && options.length > 0 && (
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-separator-opaque/40">
                <span className="text-[11px] text-label-quaternary">
                  {selectedMulti.length} of {options.length} selected
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    const mp = props as MultiSelectProps
                    if (selectedMulti.length === enabledOptions.length) {
                      mp.onChange?.([])
                    } else {
                      mp.onChange?.(enabledOptions.map((o) => o.value))
                    }
                  }}
                  className="text-[11px] font-semibold transition-opacity hover:opacity-70"
                  style={{ color: 'var(--primary, #000080)' }}
                >
                  {selectedMulti.length === enabledOptions.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
            )}

            {/* Options list */}
            <ul className="max-h-56 overflow-y-auto px-1.5 py-1.5">
              {filtered.length === 0 && (
                <li className="px-3 py-2.5 text-body text-label-tertiary text-center">No options found</li>
              )}
              {Array.from(grouped.entries()).map(([group, items]) => (
                <React.Fragment key={group}>
                  {group && (
                    <li className="px-2.5 pt-2 pb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-label-quaternary">
                        {group}
                      </span>
                    </li>
                  )}
                  {items.map((opt) => {
                    const isSelected = multiple ? multiValues.includes(opt.value) : singleValue === opt.value
                    return (
                      <li key={opt.value}>
                        <button
                          type="button"
                          disabled={opt.disabled}
                          onClick={() => handleSelect(opt.value)}
                          className={cn(
                            'w-full flex items-center gap-2.5 px-2.5 py-2 text-body text-left rounded-xl transition-colors',
                            'hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed',
                            isSelected && !multiple && 'bg-primary-soft/40',
                          )}
                        >
                          {multiple && (
                            <span
                              className={cn(
                                'flex-shrink-0 w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center transition-all',
                                isSelected ? 'border-primary' : 'border-[#ccc]',
                              )}
                              style={isSelected ? { background: 'var(--primary, #000080)', borderColor: 'var(--primary, #000080)' } : undefined}
                            >
                              {isSelected && <Check className="w-2 h-2 text-white" strokeWidth={3.5} />}
                            </span>
                          )}
                          <span className={cn(
                            'truncate flex-1 text-[13px]',
                            isSelected && !multiple ? 'font-medium' : 'text-label-secondary',
                          )}
                            style={isSelected && !multiple ? { color: 'var(--primary, #000080)' } : undefined}
                          >
                            {opt.label}
                          </span>
                          {isSelected && !multiple && (
                            <Check className="w-3.5 h-3.5 shrink-0 ml-auto" style={{ color: 'var(--primary, #000080)' }} />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </React.Fragment>
              ))}
            </ul>

            {/* Add new */}
            {onAddNew && (
              <div className="px-1.5 pb-1.5">
                <button
                  type="button"
                  onClick={() => { onAddNew(); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-[13px] rounded-xl hover:bg-surface-secondary transition-colors"
                  style={{ color: 'var(--primary, #000080)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {addNewLabel}
                </button>
              </div>
            )}

            {/* Multi: done footer */}
            {multiple && (
              <div className="flex items-center justify-between px-3 py-2 border-t border-separator-opaque/40">
                <span className="text-[11px] text-label-quaternary">
                  {selectedMulti.length > 0 ? `${selectedMulti.length} selected` : 'None selected'}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 rounded-full text-[12px] font-semibold text-white transition-opacity hover:opacity-85"
                  style={{ background: 'var(--primary, #000080)' }}
                >
                  Done
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
