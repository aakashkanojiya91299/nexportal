'use client'

import React, { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface TagInputProps {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  label?: string
  helperText?: string
  error?: string
  maxTags?: number
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export function TagInput({
  value = [],
  onChange,
  placeholder = 'Type and press Enter…',
  label,
  helperText,
  error,
  maxTags,
  disabled,
  className,
  style,
}: TagInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(raw: string) {
    const tag = raw.trim()
    if (!tag || value.includes(tag)) { setInput(''); return }
    if (maxTags && value.length >= maxTags) return
    onChange?.([...value, tag])
    setInput('')
  }

  function removeTag(i: number) {
    onChange?.(value.filter((_, idx) => idx !== i))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
    if (e.key === 'Backspace' && !input && value.length > 0) removeTag(value.length - 1)
  }

  const atMax = !!(maxTags && value.length >= maxTags)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}
        style={style}>
      {label && <span className="text-footnote font-medium text-label-primary">{label}</span>}
      <div
        onClick={() => !disabled && inputRef.current?.focus()}
        className={cn(
          'flex flex-wrap gap-1.5 rounded-xl border-2 px-3 py-2 min-h-[44px] cursor-text transition-colors',
          error ? 'border-red-300 focus-within:border-red-400'
            : 'border-gray-200 focus-within:border-[color:var(--primary,#000080)]',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
        )}
      >
        {value.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[color:var(--primary,#000080)]/10 text-[color:var(--primary,#000080)]">
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeTag(i) }}
                className="hover:text-red-500 transition-colors leading-none"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
        {!atMax && (
          <input
            ref={inputRef}
            value={input}
            disabled={disabled}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => input.trim() && addTag(input)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[100px] text-sm text-label-primary placeholder:text-label-tertiary bg-transparent outline-none py-0.5"
          />
        )}
        {atMax && <span className="text-xs text-label-tertiary self-center ml-1">Max {maxTags} tags</span>}
      </div>
      {(error || helperText) && (
        <p className={cn('text-[11px]', error ? 'text-red-500' : 'text-label-tertiary')}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}
