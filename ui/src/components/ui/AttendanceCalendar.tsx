'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, GraduationCap, Info, Save, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface AttendanceRecord {
  date: string
  status: 'present' | 'absent'
}

export interface AttendanceCalendarProps {
  /** 'not_started' shows the empty-state with an optional Start button */
  status: 'not_started' | 'active' | 'completed'
  /** 'YYYY-MM-DD' — required when status is 'active' or 'completed' */
  startDate?: string
  attendanceRecords?: AttendanceRecord[]
  presentDaysCount?: number
  /** Total days needed to complete. Default: 60 */
  requiredDays?: number
  completedAt?: string
  notes?: string
  /**
   * Called when the user clicks "Save Attendance".
   * Receives a Map of date → desired status (undefined = clear/unmark).
   * Should return a promise; the component shows a loading state until it resolves.
   */
  onSave?: (changes: Map<string, 'present' | 'absent' | undefined>) => Promise<void>
  /**
   * Called when the user confirms "Complete".
   * Receives an optional remark string.
   */
  onComplete?: (remark?: string) => Promise<void>
  /** Called when the user clicks "Start Internship" (not_started state). */
  onStart?: () => Promise<void>
  className?: string
  style?: React.CSSProperties
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

function toYMD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ── Component ──────────────────────────────────────────────────────────────

export function AttendanceCalendar({
  status,
  startDate,
  attendanceRecords = [],
  presentDaysCount = 0,
  requiredDays = 60,
  completedAt,
  notes,
  onSave,
  onComplete,
  onStart,
  className,
  style,
}: AttendanceCalendarProps) {
  const [saving, setSaving] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [starting, setStarting] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [remark, setRemark] = useState('')
  const [pendingChanges, setPendingChanges] = useState<Map<string, 'present' | 'absent' | undefined>>(new Map())

  const today = new Date()
  const todayYMD = toYMD(today)
  const [offset, setOffset] = useState(0)

  const leftDate = new Date(today.getFullYear(), today.getMonth() + offset)
  const leftYear = leftDate.getFullYear()
  const leftMonth = leftDate.getMonth()

  const rightDate = new Date(today.getFullYear(), today.getMonth() + offset + 1)
  const rightYear = rightDate.getFullYear()
  const rightMonth = rightDate.getMonth()

  const attendanceMap = new Map<string, 'present' | 'absent'>()
  attendanceRecords.forEach((r) => attendanceMap.set(r.date, r.status))

  const effectiveStartDate = startDate ?? todayYMD
  const startMonthOffset =
    (new Date(effectiveStartDate).getFullYear() - today.getFullYear()) * 12 +
    (new Date(effectiveStartDate).getMonth() - today.getMonth())

  const canGoPrev = offset > startMonthOffset
  const canGoNext = offset < 0
  const hasPendingChanges = pendingChanges.size > 0
  const monthRangeLabel = `${MONTH_NAMES[leftMonth]} ${leftYear} – ${MONTH_NAMES[rightMonth]} ${rightYear}`

  const handleDayClick = useCallback(
    (dateStr: string) => {
      if (status !== 'active') return
      if (dateStr > todayYMD) return
      if (dateStr < effectiveStartDate) return

      setPendingChanges((prev) => {
        const effectiveStatus = prev.has(dateStr) ? prev.get(dateStr) : attendanceMap.get(dateStr)
        const nextStatus: 'present' | 'absent' | undefined =
          effectiveStatus === undefined ? 'present'
          : effectiveStatus === 'present' ? 'absent'
          : undefined

        const next = new Map(prev)
        const savedStatus = attendanceMap.get(dateStr)
        if (nextStatus === savedStatus) {
          next.delete(dateStr)
        } else {
          next.set(dateStr, nextStatus)
        }
        return next
      })
    },
    [status, effectiveStartDate, todayYMD, attendanceMap],
  )

  const handleSave = async () => {
    if (!onSave || pendingChanges.size === 0) return
    setSaving(true)
    try {
      await onSave(new Map(pendingChanges))
      setPendingChanges(new Map())
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = async () => {
    if (!onComplete) return
    setCompleting(true)
    try {
      await onComplete(remark.trim() || undefined)
      setShowCompleteDialog(false)
      setRemark('')
    } finally {
      setCompleting(false)
    }
  }

  const handleStart = async () => {
    if (!onStart) return
    setStarting(true)
    try {
      await onStart()
    } finally {
      setStarting(false)
    }
  }

  // ── Not started ───────────────────────────────────────────────────────────
  if (status === 'not_started') {
    return (
      <div className={cn('py-16 text-center space-y-4', className)} style={style}>
        <GraduationCap className="w-10 h-10 mx-auto text-label-quaternary" />
        <div>
          <p className="text-callout font-medium text-label-primary">No internship started yet</p>
          <p className="text-footnote mt-1 text-label-tertiary">
            Start an internship to begin tracking attendance.
          </p>
        </div>
        {onStart && (
          <button
            type="button"
            onClick={handleStart}
            disabled={starting}
            className="inline-flex items-center gap-2 px-4 py-2 text-callout font-medium rounded-xl
              text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ background: 'var(--primary, #000080)' }}
          >
            {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
            Start Internship
          </button>
        )}
      </div>
    )
  }

  // ── Month renderer ────────────────────────────────────────────────────────
  const renderMonth = (year: number, month: number) => {
    const days = getDaysInMonth(year, month)
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    const blanks = Array(firstDayOfWeek).fill(null)

    return (
      <div className="flex-1 min-w-0">
        <h3 className="text-subhead font-semibold text-center text-label-primary mb-3">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-[10px] font-medium text-label-tertiary py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {blanks.map((_, i) => <div key={`b-${i}`} />)}
          {days.map((day) => {
            const ymd = toYMD(day)
            const isFuture = ymd > todayYMD
            const isBeforeStart = ymd < effectiveStartDate
            const isBlocked = isFuture || isBeforeStart || status === 'completed'

            const isPending = pendingChanges.has(ymd)
            const dayStatus = isPending ? pendingChanges.get(ymd) : attendanceMap.get(ymd)

            let bg = 'bg-white border border-separator-opaque text-label-primary'
            if (dayStatus === 'present') bg = 'bg-green-500 text-white border-transparent'
            if (dayStatus === 'absent') bg = 'bg-red-400 text-white border-transparent'
            if (isBlocked && !dayStatus) bg = 'bg-surface-secondary text-label-quaternary border-transparent opacity-60'

            return (
              <button
                key={ymd}
                type="button"
                disabled={isBlocked || saving}
                onClick={() => handleDayClick(ymd)}
                aria-label={
                  isBeforeStart
                    ? `${ymd} — before internship start`
                    : isFuture
                    ? `${ymd} — future date`
                    : dayStatus === 'present'
                    ? `${ymd} — present (click to change)`
                    : dayStatus === 'absent'
                    ? `${ymd} — absent (click to change)`
                    : `${ymd} — unmarked (click to mark present)`
                }
                className={cn(
                  'relative aspect-square rounded text-[11px] font-medium transition-all',
                  bg,
                  !isBlocked && 'hover:opacity-80 cursor-pointer',
                  isBlocked && 'cursor-default',
                  saving && 'opacity-50',
                  isPending && 'ring-2 ring-amber-400 ring-offset-1',
                )}
                title={
                  isBeforeStart
                    ? 'Before internship start'
                    : isFuture
                    ? 'Future date'
                    : isPending
                    ? `${dayStatus ?? 'unmarked'} (unsaved) — click to change`
                    : dayStatus
                    ? `${dayStatus} — click to change`
                    : 'Click to mark present'
                }
              >
                {day.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Full calendar ─────────────────────────────────────────────────────────
  const progressPct = Math.min((presentDaysCount / requiredDays) * 100, 100)
  const daysLeft = Math.max(requiredDays - presentDaysCount, 0)

  return (
    <div className={cn('space-y-6', className)} style={style}>

      {/* Status + progress bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-footnote font-medium',
              status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800',
            )}>
              {status === 'completed' ? 'Completed' : 'Active'}
            </span>
            {startDate && (
              <span className="text-footnote text-label-tertiary">
                Started {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
            {completedAt && (
              <span className="text-footnote text-label-tertiary">
                · Completed {new Date(completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
            <div className="h-2 w-full max-w-sm bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-footnote font-medium text-label-primary">
              {presentDaysCount} / {requiredDays} days present
            </span>
          </div>
        </div>

        {status === 'active' && (
          <div className="flex w-full flex-col gap-2 md:w-auto md:items-end">
            {onComplete && (
              <button
                type="button"
                onClick={() => setShowCompleteDialog(true)}
                disabled={presentDaysCount < requiredDays}
                className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 text-footnote font-medium rounded-lg md:w-auto
                  bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Complete Internship
              </button>
            )}
            {presentDaysCount < requiredDays && (
              <p className="text-footnote text-label-tertiary md:text-right">
                {daysLeft} more day{daysLeft !== 1 ? 's' : ''} needed to complete
              </p>
            )}
            {hasPendingChanges && onSave && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 text-footnote font-medium rounded-lg md:w-auto
                  bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                {saving ? 'Saving…' : `Save Attendance (${pendingChanges.size})`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2 text-footnote text-label-tertiary sm:flex sm:flex-wrap sm:items-center sm:gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-green-500 inline-flex items-center justify-center text-white font-bold text-[10px]" aria-hidden="true">✓</span>
            Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-red-400 inline-flex items-center justify-center text-white font-bold text-[10px]" aria-hidden="true">✕</span>
            Absent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-surface-tertiary inline-flex items-center justify-center text-label-quaternary text-[10px]" aria-hidden="true">—</span>
            Unmarked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-surface-secondary ring-2 ring-amber-400 ring-offset-1 inline-block" aria-hidden="true" />
            Unsaved change
          </span>
        </div>
        {status === 'active' && (
          <div
            className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-footnote text-sky-950 shadow-sm sm:px-4"
            role="note"
          >
            <span className="flex h-5 shrink-0 items-center text-sky-600" aria-hidden="true">
              <Info className="h-4 w-4" />
            </span>
            <p className="min-w-0 flex-1 leading-relaxed">
              <span className="font-semibold text-sky-900">Marking attendance</span>
              {' '}Click days to cycle: unmarked → present (✓) → absent (✕) → unmarked.
            </p>
          </div>
        )}
      </div>

      {/* Calendar — desktop (two-month side-by-side with arrows) */}
      <div className="space-y-3">
        <p className="text-center text-footnote font-medium text-label-secondary md:hidden">{monthRangeLabel}</p>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setOffset((o) => o - 1)}
            disabled={!canGoPrev}
            className="p-2 rounded-lg border border-separator-opaque text-label-secondary hover:bg-surface-secondary
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 grid grid-cols-2 gap-6 bg-white border border-separator-opaque rounded-xl p-4">
            {renderMonth(leftYear, leftMonth)}
            <div className="border-l border-separator-opaque pl-6">
              {renderMonth(rightYear, rightMonth)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOffset((o) => o + 1)}
            disabled={!canGoNext}
            className="p-2 rounded-lg border border-separator-opaque text-label-secondary hover:bg-surface-secondary
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar — mobile (single month) */}
        <div className="grid grid-cols-1 gap-2 md:hidden">
          <div className="bg-white border border-separator-opaque rounded-xl p-3">
            {renderMonth(leftYear, leftMonth)}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOffset((o) => o - 1)}
              disabled={!canGoPrev}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-separator-opaque text-label-secondary hover:bg-surface-secondary
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-callout"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => setOffset((o) => o + 1)}
              disabled={!canGoNext}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-separator-opaque text-label-secondary hover:bg-surface-secondary
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-callout"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {notes && (
        <p className="text-footnote text-label-tertiary bg-surface-secondary rounded-xl px-3 py-2">
          <span className="font-medium">Notes:</span> {notes}
        </p>
      )}

      {/* Complete dialog */}
      {showCompleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !completing && setShowCompleteDialog(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-callout font-semibold text-label-primary">Complete Internship</h2>
                <p className="text-footnote text-label-tertiary mt-0.5">Add a remark before marking this internship as complete.</p>
              </div>
              <button
                type="button"
                onClick={() => !completing && setShowCompleteDialog(false)}
                className="text-label-quaternary hover:text-label-secondary transition-colors mt-0.5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-footnote font-medium text-label-primary">
                Remark <span className="text-label-quaternary font-normal">(optional)</span>
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="e.g. Completed all required days successfully."
                rows={4}
                className="w-full px-3 py-2.5 text-callout rounded-xl border border-separator-opaque bg-surface-secondary
                  focus:outline-none focus:ring-2 focus:border-green-400
                  resize-none placeholder:text-label-quaternary transition"
                style={{ '--tw-ring-color': 'rgba(34,197,94,0.3)' } as React.CSSProperties}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCompleteDialog(false)}
                disabled={completing}
                className="px-4 py-2 text-callout font-medium rounded-xl border border-separator-opaque
                  text-label-secondary hover:bg-surface-secondary disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={completing}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-callout font-medium rounded-xl
                  bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Confirm Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
