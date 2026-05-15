'use client'

import React, { useRef } from 'react'
import { cn } from '../../lib/cn'

export interface OTPInputProps {
  length?: 4 | 6
  value?: string
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  label?: string
  helperText?: string
  className?: string
  style?: React.CSSProperties
}

export function OTPInput({
  length = 6, value = '', onChange, error, disabled, label, helperText, className,
  style,
}: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(i: number, char: string) {
    if (!/^\d*$/.test(char)) return
    const chars = value.split('')
    chars[i] = char.slice(-1) || ''
    const next = chars.join('').slice(0, length)
    onChange?.(next)
    if (char && i < length - 1) refs.current[i + 1]?.focus()
  }

  function onKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }

  function onPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange?.(text)
    refs.current[Math.min(text.length, length - 1)]?.focus()
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}
        style={style}>
      {label && <span className="text-footnote font-medium text-label-primary">{label}</span>}
      <div className="flex gap-2.5">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ''}
            disabled={disabled}
            onPaste={i === 0 ? onPaste : undefined}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
            className={cn(
              'w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all focus:scale-105',
              error
                ? 'border-red-300 focus:border-red-500 bg-red-50/30 text-red-600'
                : value[i]
                ? 'border-[color:var(--primary,#000080)] bg-[color:var(--primary,#000080)]/5 text-[color:var(--primary,#000080)]'
                : 'border-gray-200 focus:border-[color:var(--primary,#000080)] bg-white text-label-primary',
              disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            )}
            style={{ height: 52 }}
          />
        ))}
      </div>
      {(error || helperText) && (
        <p className={cn('text-[11px]', error ? 'text-red-500' : 'text-label-tertiary')}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}
