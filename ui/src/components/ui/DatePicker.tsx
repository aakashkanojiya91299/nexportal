'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  format, parse, isValid, startOfMonth, addMonths, subMonths,
  setMonth, setYear, startOfDay, isBefore, isAfter, isSameDay,
  isToday as fnsIsToday, getDay, getDaysInMonth, getMonth, getYear,
  endOfMonth,
} from 'date-fns'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type Surface = 'days' | 'months' | 'years'

export interface DatePickerProps {
  value?: string
  onChange?: (iso: string) => void
  label?: React.ReactNode
  labelRight?: React.ReactNode
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  minDate?: string
  maxDate?: string
  excludeWeekends?: boolean
  excludeDates?: string[]
  className?: string
  containerClassName?: string
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ── DatePicker ────────────────────────────────────────────────────────────────

export function DatePicker({
  value, onChange,
  label, labelRight,
  placeholder = 'DD/MM/YYYY',
  error, helperText,
  disabled = false, required,
  disableFuture, disablePast,
  minDate, maxDate,
  excludeWeekends, excludeDates,
  className, containerClassName,
}: DatePickerProps) {
  const [open, setOpen]             = useState(false)
  const [surface, setSurface]       = useState<Surface>('days')
  const [visibleMonth, setVisible]  = useState<Date>(() => new Date())
  const [yearBase, setYearBase]     = useState(() => Math.floor(new Date().getFullYear() / 12) * 12)
  const containerRef = useRef<HTMLDivElement>(null)

  const date = useMemo(() => {
    if (!value) return undefined
    const d = parse(value, 'yyyy-MM-dd', new Date())
    return isValid(d) ? d : undefined
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Reset surface when opened
  useEffect(() => {
    if (!open) return
    setSurface('days')
    const base = date ?? new Date()
    setVisible(startOfMonth(base))
    setYearBase(Math.floor(getYear(base) / 12) * 12)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Disable logic ──────────────────────────────────────────────────────────
  const isDayDisabled = useCallback((d: Date): boolean => {
    const today = startOfDay(new Date())
    if (disablePast && isBefore(startOfDay(d), today)) return true
    if (disableFuture && isAfter(startOfDay(d), today)) return true
    if (minDate) {
      const min = parse(minDate, 'yyyy-MM-dd', new Date())
      if (isValid(min) && isBefore(startOfDay(d), startOfDay(min))) return true
    }
    if (maxDate) {
      const max = parse(maxDate, 'yyyy-MM-dd', new Date())
      if (isValid(max) && isAfter(startOfDay(d), startOfDay(max))) return true
    }
    if (excludeWeekends) {
      const dow = getDay(d)
      if (dow === 0 || dow === 6) return true
    }
    if (excludeDates) {
      for (const s of excludeDates) {
        const ex = parse(s, 'yyyy-MM-dd', new Date())
        if (isValid(ex) && isSameDay(d, ex)) return true
      }
    }
    return false
  }, [disableFuture, disablePast, minDate, maxDate, excludeWeekends, excludeDates])

  const isMonthDisabled = useCallback((year: number, monthIdx: number): boolean => {
    const start = startOfMonth(new Date(year, monthIdx, 1))
    const end   = endOfMonth(start)
    const today = startOfDay(new Date())
    if (disablePast && isBefore(end, today)) return true
    if (disableFuture && isAfter(start, today)) return true
    return false
  }, [disableFuture, disablePast])

  const isYearDisabled = useCallback((year: number): boolean => {
    const nowY = new Date().getFullYear()
    if (disablePast && year < nowY) return true
    if (disableFuture && year > nowY) return true
    return false
  }, [disableFuture, disablePast])

  // ── Calendar grid cells ────────────────────────────────────────────────────
  const cells = useMemo(() => {
    const firstDow = getDay(startOfMonth(visibleMonth)) // 0=Sun
    const totalDays = getDaysInMonth(visibleMonth)
    const blanks: null[] = Array(firstDow).fill(null)
    const days = Array.from({ length: totalDays }, (_, i) => i + 1)
    return [...blanks, ...days] as (null | number)[]
  }, [visibleMonth])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectDay = (day: number) => {
    const d = new Date(getYear(visibleMonth), getMonth(visibleMonth), day)
    if (isDayDisabled(d)) return
    onChange?.(format(d, 'yyyy-MM-dd'))
    setOpen(false)
  }

  const handleSelectMonth = (monthIdx: number) => {
    const year = getYear(visibleMonth)
    if (isMonthDisabled(year, monthIdx)) return
    setVisible(startOfMonth(new Date(year, monthIdx, 1)))
    setSurface('days')
  }

  const handleSelectYear = (year: number) => {
    if (isYearDisabled(year)) return
    setVisible((prev) => startOfMonth(setYear(setMonth(prev, getMonth(prev)), year)))
    setYearBase(Math.floor(year / 12) * 12)
    setSurface('months')
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const inputId = typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)} ref={containerRef}>
      {(label || labelRight) && (
        <div className="flex items-center justify-between min-h-[24px]">
          {label && (
            <label htmlFor={inputId} className={cn('text-subhead font-medium', error ? 'text-red-500' : 'text-label-primary')}>
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          {labelRight && <div className="shrink-0">{labelRight}</div>}
        </div>
      )}

      {/* Trigger button */}
      <div className="relative">
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'input-base w-full flex items-center justify-between text-left',
            error && 'input-base-error',
            !date && 'text-label-tertiary',
            date && 'text-label-primary',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
        >
          <span>{date ? format(date, 'dd/MM/yyyy') : placeholder}</span>
          <CalendarIcon className="h-4 w-4 text-label-tertiary flex-shrink-0 ml-2" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-2xl border border-separator shadow-lg overflow-hidden w-72">

            {/* Days surface */}
            {surface === 'days' && (
              <div className="p-3">
                {/* Month/Year navigation */}
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={() => setVisible((v) => subMonths(v, 1))}
                    className="p-1.5 rounded-lg hover:bg-surface-secondary text-label-secondary transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => setSurface('months')}
                      className="text-callout font-bold px-1.5 py-0.5 rounded-lg hover:bg-surface-secondary transition-colors"
                      style={{ color: 'var(--primary, #000080)' }}>
                      {MONTH_SHORT[getMonth(visibleMonth)]}
                    </button>
                    <span className="text-label-tertiary text-callout">–</span>
                    <button type="button" onClick={() => setSurface('years')}
                      className="text-callout font-bold px-1.5 py-0.5 rounded-lg hover:bg-surface-secondary transition-colors tabular-nums"
                      style={{ color: 'var(--primary, #000080)' }}>
                      {getYear(visibleMonth)}
                    </button>
                  </div>
                  <button type="button" onClick={() => setVisible((v) => addMonths(v, 1))}
                    className="p-1.5 rounded-lg hover:bg-surface-secondary text-label-secondary transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAY_NAMES.map((n) => (
                    <span key={n} className="text-caption1 font-semibold text-label-tertiary text-center py-1">{n}</span>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-y-0.5">
                  {cells.map((day, idx) => {
                    if (day === null) return <span key={`b-${idx}`} />
                    const d = new Date(getYear(visibleMonth), getMonth(visibleMonth), day)
                    const isSelected  = date ? isSameDay(d, date) : false
                    const isDisabled  = isDayDisabled(d)
                    const isTodayDay  = fnsIsToday(d)
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelectDay(day)}
                        className={cn(
                          'w-full aspect-square flex items-center justify-center rounded-lg text-callout font-medium transition-colors',
                          isSelected && 'text-white',
                          !isSelected && isTodayDay && 'border font-bold',
                          !isSelected && !isDisabled && 'hover:bg-surface-secondary',
                          isDisabled && 'text-label-quaternary cursor-not-allowed',
                          !isSelected && !isDisabled && !isTodayDay && 'text-label-primary',
                        )}
                        style={isSelected ? { background: 'var(--primary, #000080)' } : isTodayDay ? { borderColor: 'var(--primary, #000080)', color: 'var(--primary, #000080)' } : undefined}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {/* Clear + Today shortcuts */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-separator">
                  <button type="button" onClick={() => { onChange?.(''); setOpen(false) }}
                    className="text-caption1 text-label-tertiary hover:text-label-secondary transition-colors">
                    Clear
                  </button>
                  <button type="button" onClick={() => { onChange?.(format(new Date(), 'yyyy-MM-dd')); setOpen(false) }}
                    className="text-caption1 font-medium transition-colors"
                    style={{ color: 'var(--primary, #000080)' }}>
                    Today
                  </button>
                </div>
              </div>
            )}

            {/* Months surface */}
            {surface === 'months' && (
              <div className="p-3 w-72">
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={() => setSurface('days')}
                    className="text-caption1 font-medium transition-colors hover:underline"
                    style={{ color: 'var(--primary, #000080)' }}>
                    ← Back
                  </button>
                  <span className="text-callout font-bold text-label-primary tabular-nums">{getYear(visibleMonth)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MONTH_SHORT.map((m, i) => {
                    const dis = isMonthDisabled(getYear(visibleMonth), i)
                    const sel = date && getMonth(date) === i && getYear(date) === getYear(visibleMonth)
                    return (
                      <button
                        key={m} type="button"
                        disabled={dis}
                        onClick={() => handleSelectMonth(i)}
                        className={cn(
                          'py-2.5 rounded-xl text-callout font-medium transition-colors',
                          sel && 'text-white',
                          !sel && !dis && 'text-label-primary hover:bg-surface-secondary border border-transparent hover:border-separator',
                          dis && 'text-label-quaternary cursor-not-allowed',
                        )}
                        style={sel ? { background: 'var(--primary, #000080)' } : undefined}
                      >
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Years surface */}
            {surface === 'years' && (
              <div className="p-3 w-72">
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={() => setSurface('months')}
                    className="text-caption1 font-medium transition-colors hover:underline"
                    style={{ color: 'var(--primary, #000080)' }}>
                    ← Back
                  </button>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setYearBase((b) => b - 12)}
                      className="p-1 rounded-lg hover:bg-surface-secondary text-label-secondary transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-callout font-semibold text-label-primary tabular-nums px-1">
                      {yearBase}–{yearBase + 11}
                    </span>
                    <button type="button" onClick={() => setYearBase((b) => b + 12)}
                      className="p-1 rounded-lg hover:bg-surface-secondary text-label-secondary transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }, (_, k) => yearBase + k).map((year) => {
                    const dis = isYearDisabled(year)
                    const sel = date && getYear(date) === year
                    return (
                      <button
                        key={year} type="button"
                        disabled={dis}
                        onClick={() => handleSelectYear(year)}
                        className={cn(
                          'py-2.5 rounded-xl text-callout font-medium tabular-nums transition-colors',
                          sel && 'text-white',
                          !sel && !dis && 'text-label-primary hover:bg-surface-secondary border border-transparent hover:border-separator',
                          dis && 'text-label-quaternary cursor-not-allowed',
                        )}
                        style={sel ? { background: 'var(--primary, #000080)' } : undefined}
                      >
                        {year}
                      </button>
                    )
                  })}
                </div>
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
