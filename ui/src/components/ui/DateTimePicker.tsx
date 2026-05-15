'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  format, parse, isValid, startOfMonth, addMonths, subMonths,
  setMonth, setYear, startOfDay, isBefore, isAfter, isSameDay,
  isToday as fnsIsToday, getDay, getDaysInMonth, getMonth, getYear,
  endOfMonth,
} from 'date-fns'
import { CalendarIcon, Clock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Types ─────────────────────────────────────────────────────────────────────

type Surface = 'days' | 'months' | 'years'

export interface DateTimePickerProps {
  /** Combined date+time value. Format: 'yyyy-MM-dd HH:mm' (or 'yyyy-MM-dd HH:mm:ss' if showSeconds) */
  value?: string
  onChange?: (value: string) => void
  label?: React.ReactNode
  labelRight?: React.ReactNode
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  // Date constraints
  disableFuture?: boolean
  disablePast?: boolean
  minDate?: string
  maxDate?: string
  excludeWeekends?: boolean
  excludeDates?: string[]
  // Time options
  timeFormat?: '12h' | '24h'
  minuteStep?: number
  showSeconds?: boolean
  minTime?: string
  maxTime?: string
  className?: string
  style?: React.CSSProperties
  containerClassName?: string
}

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function pad2(n: number) { return String(n).padStart(2, '0') }

// ── DateTimePicker ─────────────────────────────────────────────────────────────

export function DateTimePicker({
  value: valueProp, onChange: onChangeProp,
  label, labelRight,
  placeholder,
  error, helperText,
  disabled = false, required,
  disableFuture, disablePast,
  minDate, maxDate,
  excludeWeekends, excludeDates,
  timeFormat = '24h',
  minuteStep = 1,
  showSeconds = false,
  minTime, maxTime,
  className, containerClassName, style,
}: DateTimePickerProps) {
  const resolvedPlaceholder = placeholder ?? (showSeconds ? 'DD/MM/YYYY HH:MM:SS' : 'DD/MM/YYYY HH:MM')
  const valueFormat = showSeconds ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd HH:mm'

  // Uncontrolled support
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = useState<string>('')
  const value = isControlled ? valueProp! : internalValue

  function emitChange(v: string) {
    if (!isControlled) setInternalValue(v)
    onChangeProp?.(v)
  }

  // Parse committed value
  const parsedDate = useMemo(() => {
    if (!value) return undefined
    const d = parse(value, valueFormat, new Date())
    return isValid(d) ? d : undefined
  }, [value, valueFormat])

  // ── Calendar state ─────────────────────────────────────────────────────────
  const [open, setOpen]            = useState(false)
  const [surface, setSurface]      = useState<Surface>('days')
  const [visibleMonth, setVisible] = useState<Date>(() => new Date())
  const [yearBase, setYearBase]    = useState(() => Math.floor(new Date().getFullYear() / 12) * 12)

  // ── Draft time state (local while picker is open) ──────────────────────────
  const [draftDate, setDraftDate]     = useState<Date | undefined>(undefined)
  const [draftHours, setDraftHours]   = useState(0)
  const [draftMinutes, setDraftMin]   = useState(0)
  const [draftSeconds, setDraftSec]   = useState(0)
  const [ampm, setAmpm]               = useState<'AM' | 'PM'>('AM')

  const containerRef = useRef<HTMLDivElement>(null)

  // Init drafts when picker opens
  useEffect(() => {
    if (!open) return
    setSurface('days')
    const base = parsedDate ?? new Date()
    setVisible(startOfMonth(base))
    setYearBase(Math.floor(getYear(base) / 12) * 12)
    setDraftDate(parsedDate)
    setDraftHours(base.getHours())
    setDraftMin(base.getMinutes())
    setDraftSec(base.getSeconds())
    setAmpm(base.getHours() >= 12 ? 'PM' : 'AM')
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

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
    if (excludeWeekends && (getDay(d) === 0 || getDay(d) === 6)) return true
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

  // ── Calendar grid ──────────────────────────────────────────────────────────
  const cells = useMemo(() => {
    const firstDow  = getDay(startOfMonth(visibleMonth))
    const totalDays = getDaysInMonth(visibleMonth)
    return [...Array<null>(firstDow).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)] as (null | number)[]
  }, [visibleMonth])

  // ── Time helpers ───────────────────────────────────────────────────────────
  const displayHours = timeFormat === '12h' ? (draftHours % 12 || 12) : draftHours

  function adjustHours(delta: number) {
    if (timeFormat === '12h') {
      const display12 = draftHours % 12 || 12
      let next12 = display12 + delta
      if (next12 < 1) next12 = 12
      if (next12 > 12) next12 = 1
      const next24 = ampm === 'PM' ? (next12 === 12 ? 12 : next12 + 12) : (next12 === 12 ? 0 : next12)
      setDraftHours(next24)
    } else {
      setDraftHours((h) => (h + delta + 24) % 24)
    }
  }

  function adjustMinutes(delta: number) {
    const step = minuteStep > 0 ? minuteStep : 1
    setDraftMin((m) => ((m + delta * step) % 60 + 60) % 60)
  }

  function adjustSeconds(delta: number) {
    setDraftSec((s) => (s + delta + 60) % 60)
  }

  function toggleAmPm() {
    setAmpm((a) => {
      const next = a === 'AM' ? 'PM' : 'AM'
      setDraftHours((h) => {
        if (next === 'PM' && h < 12) return h + 12
        if (next === 'AM' && h >= 12) return h - 12
        return h
      })
      return next
    })
  }

  // ── Build value string ─────────────────────────────────────────────────────
  function buildValue(d: Date, h: number, m: number, s: number): string {
    const dateStr = format(d, 'yyyy-MM-dd')
    if (showSeconds) return `${dateStr} ${pad2(h)}:${pad2(m)}:${pad2(s)}`
    return `${dateStr} ${pad2(h)}:${pad2(m)}`
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleSelectDay(day: number) {
    const d = new Date(getYear(visibleMonth), getMonth(visibleMonth), day)
    if (isDayDisabled(d)) return
    setDraftDate(d)
  }

  function handleSelectMonth(monthIdx: number) {
    const year = getYear(visibleMonth)
    if (isMonthDisabled(year, monthIdx)) return
    setVisible(startOfMonth(new Date(year, monthIdx, 1)))
    setSurface('days')
  }

  function handleSelectYear(year: number) {
    if (isYearDisabled(year)) return
    setVisible((prev) => startOfMonth(setYear(setMonth(prev, getMonth(prev)), year)))
    setYearBase(Math.floor(year / 12) * 12)
    setSurface('months')
  }

  function handleNow() {
    const now = new Date()
    const step = minuteStep > 0 ? minuteStep : 1
    const h = now.getHours()
    const m = Math.round(now.getMinutes() / step) * step % 60
    const s = now.getSeconds()
    setDraftDate(now)
    setDraftHours(h)
    setDraftMin(m)
    setDraftSec(s)
    setAmpm(h >= 12 ? 'PM' : 'AM')
    setVisible(startOfMonth(now))
  }

  function handleDone() {
    if (draftDate) {
      emitChange(buildValue(draftDate, draftHours, draftMinutes, draftSeconds))
    }
    setOpen(false)
  }

  function handleClear() {
    emitChange('')
    setOpen(false)
  }

  // ── Display ────────────────────────────────────────────────────────────────
  const displayValue = useMemo(() => {
    if (!parsedDate) return ''
    const dateStr = format(parsedDate, 'dd/MM/yyyy')
    const h = parsedDate.getHours()
    const m = parsedDate.getMinutes()
    const s = parsedDate.getSeconds()
    if (timeFormat === '12h') {
      const h12 = h % 12 || 12
      const ap  = h >= 12 ? 'PM' : 'AM'
      return showSeconds
        ? `${dateStr}  ${pad2(h12)}:${pad2(m)}:${pad2(s)} ${ap}`
        : `${dateStr}  ${pad2(h12)}:${pad2(m)} ${ap}`
    }
    return showSeconds
      ? `${dateStr}  ${pad2(h)}:${pad2(m)}:${pad2(s)}`
      : `${dateStr}  ${pad2(h)}:${pad2(m)}`
  }, [parsedDate, timeFormat, showSeconds])

  // Draft date string for day-cell selection highlight
  const draftDateStr = draftDate ? format(draftDate, 'yyyy-MM-dd') : ''

  const inputId = typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined

  // ── Render ─────────────────────────────────────────────────────────────────
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

      <div className="relative">
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'input-base w-full flex items-center justify-between text-left',
            error && 'input-base-error',
            !parsedDate && 'text-label-tertiary',
            parsedDate && 'text-label-primary',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
          style={style}
        >
          <span>{displayValue || resolvedPlaceholder}</span>
          <div className="flex items-center gap-1 text-label-tertiary flex-shrink-0 ml-2">
            <CalendarIcon className="h-4 w-4" />
            <Clock className="h-3.5 w-3.5" />
          </div>
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-2xl border border-separator shadow-lg overflow-hidden w-72">

            {/* ── Days surface ── */}
            {surface === 'days' && (
              <div className="p-3">
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

                <div className="grid grid-cols-7 mb-1">
                  {DAY_NAMES.map((n) => (
                    <span key={n} className="text-caption1 font-semibold text-label-tertiary text-center py-1">{n}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-0.5">
                  {cells.map((day, idx) => {
                    if (day === null) return <span key={`b-${idx}`} />
                    const d = new Date(getYear(visibleMonth), getMonth(visibleMonth), day)
                    const isSelected = draftDateStr === format(d, 'yyyy-MM-dd')
                    const isDisabled = isDayDisabled(d)
                    const isTodayDay = fnsIsToday(d)
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSelectDay(day)}
                        className={cn(
                          'w-full aspect-square flex items-center justify-center rounded-lg text-callout font-medium transition-colors',
                          isSelected && 'text-white',
                          !isSelected && isTodayDay && !isDisabled && 'border font-bold',
                          !isSelected && !isDisabled && 'hover:bg-surface-secondary',
                          isDisabled && 'text-[#c0c4cc] bg-[#f4f5f7] cursor-not-allowed line-through opacity-60',
                          !isSelected && !isDisabled && !isTodayDay && 'text-label-primary',
                        )}
                        style={
                          isSelected
                            ? { background: 'var(--primary, #000080)' }
                            : isTodayDay && !isDisabled
                            ? { borderColor: 'var(--primary, #000080)', color: 'var(--primary, #000080)' }
                            : undefined
                        }
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Months surface ── */}
            {surface === 'months' && (
              <div className="p-3">
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
                    const sel = draftDate && getMonth(draftDate) === i && getYear(draftDate) === getYear(visibleMonth)
                    return (
                      <button key={m} type="button" disabled={dis}
                        onClick={() => handleSelectMonth(i)}
                        className={cn(
                          'py-2.5 rounded-xl text-callout font-medium transition-colors',
                          sel && 'text-white',
                          !sel && !dis && 'text-label-primary hover:bg-surface-secondary border border-transparent hover:border-separator',
                          dis && 'text-[#c0c4cc] bg-[#f4f5f7] cursor-not-allowed line-through opacity-60',
                        )}
                        style={sel ? { background: 'var(--primary, #000080)' } : undefined}>
                        {m}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Years surface ── */}
            {surface === 'years' && (
              <div className="p-3">
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
                    const sel = draftDate && getYear(draftDate) === year
                    return (
                      <button key={year} type="button" disabled={dis}
                        onClick={() => handleSelectYear(year)}
                        className={cn(
                          'py-2.5 rounded-xl text-callout font-medium tabular-nums transition-colors',
                          sel && 'text-white',
                          !sel && !dis && 'text-label-primary hover:bg-surface-secondary border border-transparent hover:border-separator',
                          dis && 'text-[#c0c4cc] bg-[#f4f5f7] cursor-not-allowed line-through opacity-60',
                        )}
                        style={sel ? { background: 'var(--primary, #000080)' } : undefined}>
                        {year}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Time section (only on days surface) ── */}
            {surface === 'days' && (
              <>
                <div className="border-t border-separator" />
                <div className="px-3 pt-2.5 pb-2">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-label-secondary">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Time</span>
                    </div>
                    <button type="button" onClick={handleNow}
                      className="text-[11px] font-semibold transition-opacity hover:opacity-70"
                      style={{ color: 'var(--primary, #000080)' }}>
                      Now
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1">
                    <TimeSpinner value={displayHours} onUp={() => adjustHours(1)} onDown={() => adjustHours(-1)} />
                    <span className="text-label-secondary font-bold text-[18px] leading-none mb-3">:</span>
                    <TimeSpinner value={draftMinutes} onUp={() => adjustMinutes(1)} onDown={() => adjustMinutes(-1)} />
                    {showSeconds && (
                      <>
                        <span className="text-label-secondary font-bold text-[18px] leading-none mb-3">:</span>
                        <TimeSpinner value={draftSeconds} onUp={() => adjustSeconds(1)} onDown={() => adjustSeconds(-1)} />
                      </>
                    )}
                    {timeFormat === '12h' && (
                      <button
                        type="button"
                        onClick={toggleAmPm}
                        className="ml-1.5 self-center px-2.5 py-1.5 rounded-xl text-[12px] font-bold border-2 transition-all hover:opacity-80"
                        style={{ borderColor: 'var(--primary, #000080)', color: 'var(--primary, #000080)' }}
                      >
                        {ampm}
                      </button>
                    )}
                  </div>

                  {(minTime || maxTime) && (
                    <p className="text-center text-[10px] text-label-tertiary mt-1.5">
                      {minTime && maxTime ? `${minTime} – ${maxTime}` : minTime ? `From ${minTime}` : `Until ${maxTime}`}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between px-3 py-2 border-t border-separator">
                  <button type="button" onClick={handleClear}
                    className="text-caption1 text-label-tertiary hover:text-label-secondary transition-colors">
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleDone}
                    disabled={!draftDate}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-[12px] font-semibold text-white transition-opacity',
                      draftDate ? 'hover:opacity-85' : 'opacity-40 cursor-not-allowed',
                    )}
                    style={{ background: 'var(--primary, #000080)' }}
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-footnote text-red-500">{error}</p>}
      {helperText && !error && <p className="text-footnote text-label-secondary">{helperText}</p>}
    </div>
  )
}

// ── TimeSpinner ────────────────────────────────────────────────────────────────

interface TimeSpinnerProps {
  value: number
  onUp: () => void
  onDown: () => void
}

function TimeSpinner({ value, onUp, onDown }: TimeSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        onClick={onUp}
        className="w-9 h-6 flex items-center justify-center rounded-lg hover:bg-surface-secondary text-label-tertiary hover:text-label-primary transition-colors"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <div className="w-10 h-9 flex items-center justify-center rounded-xl bg-surface-secondary text-[16px] font-bold tabular-nums text-label-primary select-none">
        {pad2(value)}
      </div>
      <button
        type="button"
        onClick={onDown}
        className="w-9 h-6 flex items-center justify-center rounded-lg hover:bg-surface-secondary text-label-tertiary hover:text-label-primary transition-colors"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  )
}
