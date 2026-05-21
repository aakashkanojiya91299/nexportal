'use client'

import React, { type ReactNode, useState, useMemo, useCallback } from 'react'
import {
  Eye, CheckCircle, XCircle, Pencil, Trash2,
  ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Search, X, ArrowUpDown, SlidersHorizontal,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { Checkbox }   from './Checkbox'
import { TableSkeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { Button }     from './Button'
import { Tooltip }    from './Tooltip'
import { Badge }      from './Badge'

// ── Column definition ────────────────────────────────────────────────────────

export interface TableColumn<T = any> {
  key: string
  header: string
  render?: (item: any, index: number) => ReactNode
  className?: string
  style?: React.CSSProperties
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
  style?: React.CSSProperties
  onRowClick?: (item: T) => void
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: boolean
  defaultPageSize?: number
  pageSizeOptions?: number[]
  selectable?: boolean
  onSelectionChange?: (items: T[], keys: (string | number)[]) => void
  /** Controlled: pass a set of row keys to override internal selection state */
  selectedKeys?: (string | number)[]
  /** Extra ReactNode rendered inside the blue selection bar (e.g. bulk-action buttons) */
  selectionActions?: React.ReactNode
  striped?: boolean
  compact?: boolean
  stickyHeader?: boolean
  title?: string
  description?: string
  toolbar?: ReactNode
  /**
   * Render any action(s) per row — pass <ActionButtons />, <DropdownMenu />,
   * or any custom ReactNode. Automatically appends a right-aligned "Actions" column.
   * The column header label can be changed with `actionsHeader`.
   *
   * @example
   * rowActions={(item) => (
   *   <ActionButtons showView showEdit
   *     onView={() => router.push(`/item/${item.id}`)}
   *     onEdit={() => handleEdit(item)}
   *   />
   * )}
   *
   * @example
   * rowActions={(item) => (
   *   <DropdownMenu items={[
   *     { label: 'View',   icon: <Eye />,    onClick: () => handleView(item)   },
   *     { label: 'Delete', icon: <Trash2 />, onClick: () => handleDelete(item), variant: 'danger' },
   *   ]} />
   * )}
   */
  rowActions?: (item: T, index: number) => ReactNode
  /** Header label for the actions column (default: empty — no header text) */
  actionsHeader?: string
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
  loadingRows = 6,
  className,
  style,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search…',
  pagination = false,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  selectable = false,
  onSelectionChange,
  selectedKeys: controlledSelectedKeys,
  selectionActions,
  striped = false,
  compact = false,
  stickyHeader = false,
  title,
  description,
  toolbar,
  rowActions,
  actionsHeader = '',
}: DataTableProps<T>) {

  const [globalSearch,  setGlobalSearch]  = useState('')
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [sortKey,       setSortKey]       = useState<string | null>(null)
  const [sortDir,       setSortDir]       = useState<SortDir>(null)
  const [page,          setPage]          = useState(1)
  const [pageSize,      setPageSize]      = useState(defaultPageSize)
  const [internalSelected, setInternalSelected] = useState<Set<string | number>>(new Set())
  const isControlled = controlledSelectedKeys !== undefined
  const selected = isControlled ? new Set(controlledSelectedKeys) : internalSelected
  const [openFilter,    setOpenFilter]    = useState<string | null>(null)

  // ── Filtered + sorted data ──────────────────────────────────────────────────
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

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleGlobalSearch = useCallback((v: string) => { setGlobalSearch(v); setPage(1) }, [])
  const handleColumnFilter = useCallback((key: string, v: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: v })); setPage(1)
  }, [])
  const clearAllFilters = useCallback(() => {
    setGlobalSearch(''); setColumnFilters({}); setPage(1)
  }, [])

  function handleSort(key: string) {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc') }
    else if (sortDir === 'asc') setSortDir('desc')
    else { setSortKey(null); setSortDir(null) }
  }

  // ── Selection ───────────────────────────────────────────────────────────────
  function applyNext(next: Set<string | number>) {
    if (!isControlled) setInternalSelected(next)
    const keys = [...next]
    onSelectionChange?.(data.filter((r) => next.has(keyExtractor(r))), keys)
  }
  function toggleRow(id: string | number) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    applyNext(next)
  }
  function toggleAll() {
    const allIds = visibleRows.map(keyExtractor)
    const allSel = allIds.every((id) => selected.has(id))
    const next = new Set(selected)
    allIds.forEach((id) => (allSel ? next.delete(id) : next.add(id)))
    applyNext(next)
  }

  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((r) => selected.has(keyExtractor(r)))
  const someSelected = selected.size > 0

  // ── Pagination pages ────────────────────────────────────────────────────────
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
  const cellPadY = compact ? 'py-2' : 'py-3'
  const totalColspan = columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)

  if (isLoading) {
    const colCount = Math.max(totalColspan, 1)
    return (
      <div
        className={cn('flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden', className)}
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)', ...style }}
      >
        {(title || description || searchable || toolbar) && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
            <div className="min-w-0 flex-1">
              {title       && <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>}
              {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
            {toolbar && <div className="flex items-center gap-2 shrink-0">{toolbar}</div>}
          </div>
        )}
        <TableSkeleton rows={loadingRows} cols={colCount} className="border-0 shadow-none rounded-none" />
      </div>
    )
  }

  return (
    <div
      className={cn('flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden', className)}
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)', ...style }}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      {(title || description || searchable || toolbar || activeFiltersCount > 0) && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
          <div className="min-w-0 flex-1">
            {title       && <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>}
            {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            {toolbar}
            {/* Clear filters — Button ghost sm */}
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
              </Button>
            )}
            {/* Search input — custom inline (Input component is form-oriented, this is inline toolbar search) */}
            {searchable && (
              <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 min-w-[200px] focus-within:border-gray-300 focus-within:bg-white transition-all">
                <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <input
                  value={globalSearch}
                  onChange={(e) => handleGlobalSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs text-gray-700 placeholder:text-gray-400 outline-none"
                />
                {globalSearch && (
                  <button onClick={() => handleGlobalSearch('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Selection announcement bar ──────────────────────────────────────── */}
      {selectable && someSelected && (
        <div
          className="flex items-center justify-between gap-3 px-4 py-2 text-xs font-medium text-white"
          style={{ background: 'var(--primary,#000080)' }}
        >
          <span>{selected.size} row{selected.size !== 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-3">
            {selectionActions}
            <button
              onClick={() => applyNext(new Set())}
              className="text-white/70 hover:text-white underline underline-offset-2 transition-colors text-xs"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>

            {/* Header row */}
            <tr className="border-b border-gray-200 bg-gray-50">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  {/* Checkbox component — size sm, no label */}
                  <Checkbox
                    size="sm"
                    checked={allVisibleSelected}
                    indeterminate={!allVisibleSelected && someSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col) => {
                const isActive = sortKey === col.key
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                      col.align === 'center' && 'text-center',
                      col.align === 'right'  && 'text-right',
                      col.sortable && 'cursor-pointer select-none hover:text-gray-700 transition-colors',
                      isActive && 'text-gray-800',
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
                          {isActive && sortDir === 'asc' ? (
                            <ChevronUp   className="h-3.5 w-3.5" style={{ color: 'var(--primary,#000080)' }} />
                          ) : isActive && sortDir === 'desc' ? (
                            <ChevronDown className="h-3.5 w-3.5" style={{ color: 'var(--primary,#000080)' }} />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                          )}
                        </span>
                      )}
                      {(col.searchable || col.filterOptions?.length) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenFilter(openFilter === col.key ? null : col.key)
                          }}
                          className={cn(
                            'p-0.5 rounded transition-colors shrink-0',
                            columnFilters[col.key] || openFilter === col.key
                              ? 'opacity-100'
                              : 'opacity-30 hover:opacity-60',
                          )}
                          style={
                            columnFilters[col.key] || openFilter === col.key
                              ? { color: 'var(--primary,#000080)' }
                              : {}
                          }
                        >
                          <SlidersHorizontal className="h-3 w-3" />
                        </button>
                      )}
                      {columnFilters[col.key] && (
                          <span
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ background: 'var(--accent,#FF9933)' }}
                          />
                        )}
                    </div>
                  </th>
                )
              })}
              {/* Actions column header */}
              {rowActions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-px whitespace-nowrap">
                  {actionsHeader}
                </th>
              )}
            </tr>

            {/* Column filter row */}
            {hasColumnControls && columns.some((c) => openFilter === c.key) && (
              <tr className="border-b border-gray-100 bg-white">
                {selectable && <td />}
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2 align-top">
                    {openFilter === col.key && col.searchable && !col.filterOptions?.length && (
                      <div className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2.5 py-1.5 focus-within:border-gray-300 focus-within:bg-white transition-all">
                        <Search className="h-3 w-3 text-gray-400 shrink-0" />
                        <input
                          autoFocus
                          value={columnFilters[col.key] ?? ''}
                          onChange={(e) => handleColumnFilter(col.key, e.target.value)}
                          placeholder={`Filter ${col.header.toLowerCase()}…`}
                          className="w-full text-xs text-gray-700 placeholder:text-gray-400 bg-transparent outline-none"
                        />
                        {columnFilters[col.key] && (
                          <button onClick={() => handleColumnFilter(col.key, '')} className="text-gray-400 hover:text-gray-600">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                    )}
                    {openFilter === col.key && col.filterOptions?.length && (
                      <div className="flex flex-wrap gap-1">
                        <FilterChip active={!columnFilters[col.key]} onClick={() => handleColumnFilter(col.key, '')} label="All" />
                        {col.filterOptions.map((opt) => (
                          <FilterChip
                            key={opt.value}
                            active={columnFilters[col.key] === opt.value}
                            onClick={() =>
                              handleColumnFilter(col.key, columnFilters[col.key] === opt.value ? '' : opt.value)
                            }
                            label={opt.label}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                ))}
                {rowActions && <td />}
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-gray-200">

            {/* Empty state — uses EmptyState component */}
            {visibleRows.length === 0 && (
              <tr>
                  <td colSpan={totalColspan}>
                  <EmptyState
                    icon={<Search className="w-6 h-6 text-label-tertiary" />}
                    title={emptyMessage}
                    description={activeFiltersCount > 0 ? 'Try adjusting your filters to find what you\'re looking for.' : undefined}
                    action={
                      activeFiltersCount > 0 ? (
                        <Button variant="primary" size="sm" onClick={clearAllFilters}>
                          Clear filters
                        </Button>
                      ) : undefined
                    }
                  />
                </td>
              </tr>
            )}

            {/* Data rows — matching C&J px-4 py-3 row height */}
            {visibleRows.map((item, index) => {
              const id = keyExtractor(item)
              const isSelected = selected.has(id)
              const isClickable = !!(onRowClick || selectable)
              return (
                <tr
                  key={id}
                  onClick={() => { onRowClick?.(item); if (selectable) toggleRow(id) }}
                  className={cn(
                    'group transition-all duration-150',
                    striped && index % 2 === 1 && !isSelected ? 'bg-gray-50/40' : 'bg-white',
                    isSelected
                      ? 'bg-[color:var(--primary,#000080)]/[0.04]'
                      : isClickable
                        ? 'hover:bg-gray-50/80'
                        : 'hover:bg-gray-50/60',
                    isClickable && 'cursor-pointer',
                  )}
                  style={
                    isSelected
                      ? { boxShadow: 'inset 3px 0 0 var(--primary,#000080)' }
                      : undefined
                  }
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLTableRowElement).style.boxShadow = 'inset 3px 0 0 rgba(0,0,0,0.08)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLTableRowElement).style.boxShadow = ''
                    }
                  }}
                >
                  {selectable && (
                    <td
                      className="px-4 py-3"
                      onClick={(e) => { e.stopPropagation(); toggleRow(id) }}
                    >
                      {/* Checkbox component — size sm */}
                      <Checkbox
                        size="sm"
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 text-sm text-gray-900',
                        cellPadY,
                        col.align === 'center' && 'text-center',
                        col.align === 'right'  && 'text-right',
                        col.className,
                      )}
                      style={col.style}
                    >
                      {col.render ? col.render(item, index) : (item[col.key] ?? '—')}
                    </td>
                  ))}
                  {/* Row actions cell — stop propagation so clicks don't trigger onRowClick */}
                  {rowActions && (
                    <td
                      className={cn('px-3 text-right', cellPadY)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowActions(item, index)}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination — uses Button component ──────────────────────────────── */}
      {pagination && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-gray-200 flex-wrap bg-gray-50">
          {/* Left: count + page size */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 tabular-nums">
              {totalRows === 0
                ? 'No results'
                : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalRows)} of ${totalRows.toLocaleString()}`}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
                className="rounded border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-700 outline-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Right: page buttons — Button ghost/primary sm */}
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="sm" disabled={page === 1}         onClick={() => setPage(1)}>
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" disabled={page === 1}         onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>

            {pageNumbers.map((p, i) =>
              p === '…' ? (
                <span key={`el-${i}`} className="px-1.5 text-xs text-gray-400 select-none">…</span>
              ) : (
                <Button
                  key={p}
                  size="sm"
                  variant={page === p ? 'primary' : 'ghost'}
                  onClick={() => setPage(p as number)}
                  className="min-w-[28px] tabular-nums"
                >
                  {p}
                </Button>
              )
            )}

            <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── FilterChip (internal only) ────────────────────────────────────────────────

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-colors',
        active ? 'text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300',
      )}
      style={active ? { background: 'var(--primary,#000080)', borderColor: 'var(--primary,#000080)' } : {}}
    >
      {label}
    </button>
  )
}

// ── StatusBadge — uses Badge component with mapped variants ───────────────────

const STATUS_TO_BADGE: Record<string, {
  variant: 'active' | 'pending' | 'inactive' | 'rejected' | 'primary' | 'navy' | 'saffron' | 'green'
}> = {
  active:    { variant: 'active'   },
  approved:  { variant: 'active'   },
  completed: { variant: 'navy'     },
  paid:      { variant: 'green'    },
  scheduled: { variant: 'primary'  },
  pending:   { variant: 'pending'  },
  review:    { variant: 'navy'     },
  inactive:  { variant: 'inactive' },
  draft:     { variant: 'inactive' },
  rejected:  { variant: 'rejected' },
  cancelled: { variant: 'rejected' },
  blocked:   { variant: 'rejected' },
}

export interface StatusBadgeProps {
  status?: string | null
  className?: string
  style?: React.CSSProperties
}

export function StatusBadge({ status, className, style }: StatusBadgeProps) {
  const key    = (status ?? '').toLowerCase()
  const config = STATUS_TO_BADGE[key]
  return (
    <Badge
      variant={config?.variant ?? 'inactive'}
      className={cn('capitalize', className)}
      style={style}
    >
      {status ?? '—'}
    </Badge>
  )
}

// ── ActionButtons — matching C&J individual icon-button style, wrapped in Tooltip ──

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
  showView    = false,
  showApprove = false,
  showReject  = false,
  showEdit    = false,
  showDelete  = false,
  disabled        = false,
  approveDisabled = false,
  rejectDisabled  = false,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {showView && (
        <Tooltip content="View" placement="top">
          <button
            type="button"
            onClick={onView}
            disabled={disabled}
            aria-label="View"
            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
      {showApprove && (
        <Tooltip content="Approve" placement="top">
          <button
            type="button"
            onClick={onApprove}
            disabled={disabled || approveDisabled}
            aria-label="Approve"
            className="p-1.5 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
      {showReject && (
        <Tooltip content="Reject" placement="top">
          <button
            type="button"
            onClick={onReject}
            disabled={disabled || rejectDisabled}
            aria-label="Reject"
            className="p-1.5 rounded-md text-orange-500 hover:bg-orange-50 hover:text-orange-600 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
      {showEdit && (
        <Tooltip content="Edit" placement="top">
          <button
            type="button"
            onClick={onEdit}
            disabled={disabled}
            aria-label="Edit"
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
      {showDelete && (
        <Tooltip content="Delete" placement="top">
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            aria-label="Delete"
            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
    </div>
  )
}
