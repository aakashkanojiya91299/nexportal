'use client'

import React, { type ReactNode, useState, useMemo, useCallback } from 'react'
import {
  Eye, CheckCircle, XCircle, Pencil, Trash2,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, SlidersHorizontal, X, Check,
} from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Column definition ────────────────────────────────────────────────────────

export interface TableColumn<T = any> {
  key: string
  header: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (item: any, index: number) => ReactNode
  className?: string
  headerClassName?: string
  sortable?: boolean
  searchable?: boolean
  filterOptions?: { value: string; label: string }[]
  width?: string
  align?: 'left' | 'center' | 'right'
}

// ── DataTable props ──────────────────────────────────────────────────────────

export interface DataTableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
  isLoading?: boolean
  loadingRows?: number
  className?: string
  onRowClick?: (item: T) => void
  // Search
  searchable?: boolean
  searchPlaceholder?: string
  // Pagination
  pagination?: boolean
  defaultPageSize?: number
  pageSizeOptions?: number[]
  // Selection
  selectable?: boolean
  onSelectionChange?: (items: T[]) => void
  // Appearance
  striped?: boolean
  compact?: boolean
  stickyHeader?: boolean
  title?: string
  description?: string
  toolbar?: ReactNode
}

type SortDir = 'asc' | 'desc' | null

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100]

// ── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  isLoading = false,
  loadingRows = 5,
  className,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search…',
  pagination = false,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  selectable = false,
  onSelectionChange,
  striped = false,
  compact = false,
  stickyHeader = false,
  title,
  description,
  toolbar,
}: DataTableProps<T>) {

  const [globalSearch,   setGlobalSearch]   = useState('')
  const [columnFilters,  setColumnFilters]  = useState<Record<string, string>>({})
  const [sortKey,        setSortKey]        = useState<string | null>(null)
  const [sortDir,        setSortDir]        = useState<SortDir>(null)
  const [page,           setPage]           = useState(1)
  const [pageSize,       setPageSize]       = useState(defaultPageSize)
  const [selected,       setSelected]       = useState<Set<string | number>>(new Set())
  const [openFilter,     setOpenFilter]     = useState<string | null>(null)

  // ── Filtered + sorted data ─────────────────────────────────────────────────
  const processed = useMemo(() => {
    let rows = [...data]

    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase()
      rows = rows.filter((row) =>
        columns.some((col) => {
          const val = row[col.key]
          return val != null && String(val).toLowerCase().includes(q)
        })
      )
    }

    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val.trim()) return
      const q = val.toLowerCase()
      rows = rows.filter((row) => {
        const v = row[key]
        return v != null && String(v).toLowerCase().includes(q)
      })
    })

    if (sortKey && sortDir) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return rows
  }, [data, globalSearch, columnFilters, sortKey, sortDir, columns])

  const totalRows   = processed.length
  const totalPages  = pagination ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1
  const visibleRows = pagination
    ? processed.slice((page - 1) * pageSize, page * pageSize)
    : processed

  const activeFiltersCount =
    Object.values(columnFilters).filter(Boolean).length + (globalSearch ? 1 : 0)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleGlobalSearch = useCallback((v: string) => {
    setGlobalSearch(v)
    setPage(1)
  }, [])

  const handleColumnFilter = useCallback((key: string, v: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: v }))
    setPage(1)
  }, [])

  const clearAllFilters = useCallback(() => {
    setGlobalSearch('')
    setColumnFilters({})
    setPage(1)
  }, [])

  function handleSort(key: string) {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
    else if (sortDir === 'asc') setSortDir('desc')
    else { setSortKey(null); setSortDir(null) }
  }

  // ── Selection ──────────────────────────────────────────────────────────────
  function toggleRow(id: string | number) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
    onSelectionChange?.(data.filter((r) => next.has(keyExtractor(r))))
  }

  function toggleAll() {
    const allIds = visibleRows.map(keyExtractor)
    const allSel = allIds.every((id) => selected.has(id))
    const next = new Set(selected)
    allIds.forEach((id) => (allSel ? next.delete(id) : next.add(id)))
    setSelected(next)
    onSelectionChange?.(data.filter((r) => next.has(keyExtractor(r))))
  }

  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((r) => selected.has(keyExtractor(r)))
  const someSelected = selected.size > 0

  // ── Pagination page numbers ────────────────────────────────────────────────
  const pageNumbers = useMemo<(number | '…')[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const nums: (number | '…')[] = [1]
    if (page > 3) nums.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i)
    if (page < totalPages - 2) nums.push('…')
    nums.push(totalPages)
    return nums
  }, [page, totalPages])

  const hasColumnControls = columns.some((c) => c.searchable || c.filterOptions?.length)
  const rowHeight = compact ? 'py-2' : 'py-3'

  return (
    <div className={cn('flex flex-col', className)}>

      {/* ── Top toolbar ──────────────────────────────────────────────────── */}
      {(title || description || searchable || toolbar) && (
        <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-separator-opaque">
          <div className="min-w-0 flex-1">
            {title       && <p className="text-callout font-semibold text-label-primary leading-tight">{title}</p>}
            {description && <p className="text-footnote text-label-tertiary mt-0.5">{description}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {toolbar}
            {searchable && (
              <div className="flex items-center gap-2 rounded-apple border border-separator-opaque bg-surface-secondary px-2.5 py-1.5 min-w-[220px] focus-within:border-primary/40 transition-colors">
                <Search className="h-3.5 w-3.5 text-label-quaternary shrink-0" />
                <input
                  value={globalSearch}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full text-footnote text-label-primary placeholder:text-label-quaternary bg-transparent outline-none"
                />
                {globalSearch && (
                  <button onClick={() => handleGlobalSearch('')} className="text-label-quaternary hover:text-label-secondary transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Selection announcement bar ────────────────────────────────────── */}
      {selectable && someSelected && (
        <div
          className="flex items-center justify-between px-4 py-2 text-footnote font-medium"
          style={{ background: 'var(--primary,#000080)', color: '#fff' }}
        >
          <span>{selected.size} row{selected.size !== 1 ? 's' : ''} selected</span>
          <button
            onClick={() => { setSelected(new Set()); onSelectionChange?.([]) }}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-footnote">
          <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>

            {/* Main header row */}
            <tr className="border-b border-separator-opaque bg-surface-secondary">
              {selectable && (
                <th className="w-10 px-3 py-2.5 text-left">
                  <SelectBox
                    checked={allVisibleSelected}
                    indeterminate={!allVisibleSelected && someSelected}
                    onClick={toggleAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    'px-3 py-2.5 font-semibold text-label-secondary tracking-wide text-left',
                    col.align === 'center' && 'text-center',
                    col.align === 'right'  && 'text-right',
                    col.sortable && 'cursor-pointer select-none hover:text-label-primary transition-colors',
                    col.headerClassName,
                  )}
                >
                  <div className={cn(
                    'flex items-center gap-1.5',
                    col.align === 'center' && 'justify-center',
                    col.align === 'right'  && 'justify-end',
                  )}>
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="shrink-0">
                        {sortKey === col.key && sortDir === 'asc'  ? <ChevronUp   className="h-3 w-3" style={{ color: 'var(--primary,#000080)' }} /> :
                         sortKey === col.key && sortDir === 'desc' ? <ChevronDown  className="h-3 w-3" style={{ color: 'var(--primary,#000080)' }} /> :
                         <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />}
                      </span>
                    )}
                    {(col.searchable || col.filterOptions?.length) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenFilter(openFilter === col.key ? null : col.key)
                        }}
                        className="p-0.5 rounded transition-colors shrink-0"
                        style={
                          columnFilters[col.key] || openFilter === col.key
                            ? { color: 'var(--primary,#000080)' }
                            : {}
                        }
                      >
                        <SlidersHorizontal className={cn(
                          'h-3 w-3 transition-opacity',
                          columnFilters[col.key] || openFilter === col.key ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                        )} />
                      </button>
                    )}
                    {columnFilters[col.key] && (
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: 'var(--primary,#000080)' }}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>

            {/* Column filter row — only rendered when a filter icon is open */}
            {hasColumnControls && columns.some((c) => openFilter === c.key) && (
              <tr className="border-b border-separator-opaque bg-surface-secondary/60">
                {selectable && <td />}
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-1.5 align-top">
                    {openFilter === col.key && col.searchable && !col.filterOptions?.length && (
                      <div className="flex items-center gap-1.5 rounded border border-separator-opaque bg-white px-2 py-1 focus-within:border-primary/40 transition-colors">
                        <Search className="h-3 w-3 text-label-quaternary shrink-0" />
                        <input
                          autoFocus
                          value={columnFilters[col.key] ?? ''}
                          onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                          placeholder={`Filter ${col.header.toLowerCase()}…`}
                          className="w-full text-[11px] text-label-primary placeholder:text-label-quaternary bg-transparent outline-none"
                        />
                        {columnFilters[col.key] && (
                          <button
                            onClick={() => handleColumnFilter(col.key, '')}
                            className="text-label-quaternary hover:text-label-secondary transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                    )}
                    {openFilter === col.key && col.filterOptions?.length && (
                      <div className="flex flex-wrap gap-1 py-0.5">
                        <FilterChip
                          active={!columnFilters[col.key]}
                          onClick={() => handleColumnFilter(col.key, '')}
                          label="All"
                        />
                        {col.filterOptions.map((opt) => (
                          <FilterChip
                            key={opt.value}
                            active={columnFilters[col.key] === opt.value}
                            onClick={() =>
                              handleColumnFilter(
                                col.key,
                                columnFilters[col.key] === opt.value ? '' : opt.value,
                              )
                            }
                            label={opt.label}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {/* Loading skeleton */}
            {isLoading && Array.from({ length: loadingRows }).map((_, i) => (
              <tr key={i} className="border-b border-separator-opaque/50">
                {selectable && (
                  <td className="px-3 py-2.5">
                    <div className="h-4 w-4 rounded bg-gray-100 animate-pulse" />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-3', rowHeight)}>
                    <div
                      className="h-3.5 rounded-full bg-gray-100 animate-pulse"
                      style={{ width: `${45 + (i * 13 + col.key.length * 7) % 45}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}

            {/* Empty state */}
            {!isLoading && visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-14 text-center"
                >
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="h-12 w-12 rounded-full bg-surface-secondary flex items-center justify-center">
                      <Search className="h-5 w-5 text-label-quaternary" />
                    </div>
                    <p className="text-body text-label-tertiary">{emptyMessage}</p>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-footnote font-semibold transition-opacity hover:opacity-70"
                        style={{ color: 'var(--primary,#000080)' }}
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading && visibleRows.map((item, index) => {
              const id = keyExtractor(item)
              const isSelected = selected.has(id)
              return (
                <tr
                  key={id}
                  onClick={() => {
                    onRowClick?.(item)
                    if (selectable) toggleRow(id)
                  }}
                  className={cn(
                    'border-b border-separator-opaque/50 transition-colors',
                    striped && index % 2 === 1 && 'bg-surface-secondary/30',
                    isSelected && 'bg-primary-soft/20',
                    (onRowClick || selectable) && 'cursor-pointer',
                    'hover:bg-surface-secondary',
                  )}
                >
                  {selectable && (
                    <td
                      className="px-3 py-2.5"
                      onClick={(e) => { e.stopPropagation(); toggleRow(id) }}
                    >
                      <SelectBox checked={isSelected} />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 text-label-primary',
                        rowHeight,
                        col.align === 'center' && 'text-center',
                        col.align === 'right'  && 'text-right',
                        col.className,
                      )}
                    >
                      {col.render
                        ? col.render(item, index)
                        : (item[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination bar ───────────────────────────────────────────────── */}
      {pagination && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-separator-opaque flex-wrap">

          {/* Left: count + page size */}
          <div className="flex items-center gap-4">
            <span className="text-footnote text-label-tertiary tabular-nums">
              {totalRows === 0
                ? 'No results'
                : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalRows)} of ${totalRows.toLocaleString()}`}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-footnote text-label-quaternary">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="border border-separator-opaque rounded-lg px-2 py-1 text-footnote text-label-primary bg-white outline-none cursor-pointer hover:border-primary/30 transition-colors"
              >
                {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Right: page buttons */}
          <div className="flex items-center gap-0.5">
            <PageBtn onClick={() => setPage(1)}               disabled={page === 1}          icon={<ChevronsLeft  className="h-3.5 w-3.5" />} />
            <PageBtn onClick={() => setPage((p) => p - 1)}   disabled={page === 1}          icon={<ChevronLeft   className="h-3.5 w-3.5" />} />

            {pageNumbers.map((p, i) =>
              p === '…' ? (
                <span key={`el-${i}`} className="px-1.5 text-footnote text-label-quaternary select-none">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={cn(
                    'min-w-[30px] h-7 px-1.5 rounded-lg text-footnote font-medium transition-colors tabular-nums',
                    page === p ? 'text-white' : 'text-label-secondary hover:bg-surface-secondary',
                  )}
                  style={page === p ? { background: 'var(--primary,#000080)' } : {}}
                >
                  {p}
                </button>
              )
            )}

            <PageBtn onClick={() => setPage((p) => p + 1)}   disabled={page >= totalPages}  icon={<ChevronRight  className="h-3.5 w-3.5" />} />
            <PageBtn onClick={() => setPage(totalPages)}      disabled={page >= totalPages}  icon={<ChevronsRight className="h-3.5 w-3.5" />} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function SelectBox({
  checked, indeterminate, onClick,
}: { checked: boolean; indeterminate?: boolean; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors cursor-pointer"
      style={
        checked || indeterminate
          ? { background: 'var(--primary,#000080)', borderColor: 'var(--primary,#000080)' }
          : { borderColor: '#D1D5DB' }
      }
    >
      {checked      && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
      {indeterminate && !checked && <span className="h-0.5 w-2 bg-white rounded-full" />}
    </span>
  )
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-colors',
        active ? 'text-white' : 'border-gray-200 text-label-tertiary hover:border-gray-300',
      )}
      style={active ? { background: 'var(--primary,#000080)', borderColor: 'var(--primary,#000080)', color: '#fff' } : {}}
    >
      {label}
    </button>
  )
}

function PageBtn({
  onClick, disabled, icon,
}: { onClick: () => void; disabled: boolean; icon: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-1.5 rounded-lg text-label-tertiary hover:text-label-primary hover:bg-surface-secondary transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  )
}

// ── StatusBadge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  active:    { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200'   },
  approved:  { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200'   },
  completed: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200'    },
  paid:      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  scheduled: { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200'  },
  pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
  inactive:  { bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-200'    },
  draft:     { bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-200'    },
  rejected:  { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200'     },
  cancelled: { bg: 'bg-red-50',     text: 'text-red-500',     border: 'border-red-200'     },
}

export interface StatusBadgeProps {
  status?: string | null
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = (status ?? '').toLowerCase()
  const s   = STATUS_STYLES[key]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide capitalize',
        s ? `${s.bg} ${s.text} ${s.border}` : 'bg-gray-100 text-gray-600 border-gray-200',
        className,
      )}
    >
      {status ?? '—'}
    </span>
  )
}

// ── ActionButtons ────────────────────────────────────────────────────────────

export interface ActionButtonsProps {
  onView?:    () => void
  onApprove?: () => void
  onReject?:  () => void
  onEdit?:    () => void
  onDelete?:  () => void
  showView?:    boolean
  showApprove?: boolean
  showReject?:  boolean
  showEdit?:    boolean
  showDelete?:  boolean
  disabled?:        boolean
  approveDisabled?: boolean
  rejectDisabled?:  boolean
}

export function ActionButtons({
  onView, onApprove, onReject, onEdit, onDelete,
  showView = false, showApprove = false, showReject = false,
  showEdit = false, showDelete = false,
  disabled = false, approveDisabled = false, rejectDisabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {showView && (
        <ActionBtn onClick={onView} disabled={disabled} title="View"
          hoverClass="hover:text-blue-600 hover:bg-blue-50">
          <Eye className="w-4 h-4" />
        </ActionBtn>
      )}
      {showApprove && (
        <ActionBtn onClick={onApprove} disabled={disabled || approveDisabled} title="Approve"
          hoverClass="hover:text-green-600 hover:bg-green-50">
          <CheckCircle className="w-4 h-4" />
        </ActionBtn>
      )}
      {showReject && (
        <ActionBtn onClick={onReject} disabled={disabled || rejectDisabled} title="Reject"
          hoverClass="hover:text-orange-500 hover:bg-orange-50">
          <XCircle className="w-4 h-4" />
        </ActionBtn>
      )}
      {showEdit && (
        <ActionBtn onClick={onEdit} disabled={disabled} title="Edit"
          hoverClass="hover:text-label-primary hover:bg-surface-secondary">
          <Pencil className="w-4 h-4" />
        </ActionBtn>
      )}
      {showDelete && (
        <ActionBtn onClick={onDelete} disabled={disabled} title="Delete"
          hoverClass="hover:text-red-500 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </ActionBtn>
      )}
    </div>
  )
}

function ActionBtn({
  onClick, disabled, title, hoverClass, children,
}: { onClick?: () => void; disabled?: boolean; title: string; hoverClass: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded-lg text-label-quaternary transition-colors',
        hoverClass,
        disabled && 'opacity-30 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  )
}
