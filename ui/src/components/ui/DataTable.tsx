'use client'

import React, { type ReactNode } from 'react'
import { Eye, CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn'

// ── Column definition ────────────────────────────────────────────────────────

export interface TableColumn<T> {
  key: string
  header: string
  render?: (item: T, index: number) => ReactNode
  className?: string
}

// ── DataTable ────────────────────────────────────────────────────────────────

export interface DataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  emptyMessage?: string
  isLoading?: boolean
  loadingRows?: number
  className?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  isLoading = false,
  loadingRows = 5,
  className,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-tertiary">
              {columns.map((col) => (
                <th key={col.key} className={cn('px-4 py-3 text-left text-xs font-medium text-label-tertiary uppercase tracking-wider', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-tertiary">
            {Array.from({ length: loadingRows }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-surface-secondary rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-body text-label-tertiary">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-tertiary">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-left text-xs font-medium text-label-tertiary uppercase tracking-wider', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-tertiary">
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              className={cn('transition-colors hover:bg-surface-secondary', onRowClick && 'cursor-pointer')}
            >
              {columns.map((col) => (
                <td
                  key={`${keyExtractor(item)}-${col.key}`}
                  className={cn('px-4 py-3 text-body text-label-primary', col.className)}
                >
                  {col.render
                    ? col.render(item, index)
                    : ((item as Record<string, unknown>)[col.key]?.toString() ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── StatusBadge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  approved:  'bg-green-100 text-green-800',
  active:    'bg-green-100 text-green-800',
  rejected:  'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
  inactive:  'bg-gray-100 text-gray-600',
  draft:     'bg-gray-100 text-gray-600',
  paid:      'bg-blue-100 text-blue-800',
  scheduled: 'bg-purple-100 text-purple-800',
  completed: 'bg-emerald-100 text-emerald-800',
}

export interface StatusBadgeProps {
  status?: string | null
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = (status ?? '').toLowerCase()
  const style = STATUS_STYLES[key] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', style, className)}>
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
  showView = false, showApprove = false, showReject = false, showEdit = false, showDelete = false,
  disabled = false, approveDisabled = false, rejectDisabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      {showView && onView && (
        <button onClick={onView} disabled={disabled} title="View"
          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      )}
      {showApprove && onApprove && (
        <button onClick={onApprove} disabled={disabled || approveDisabled} title="Approve"
          className="p-1.5 rounded-md text-green-600 hover:bg-green-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">
          <CheckCircle className="w-4 h-4" />
        </button>
      )}
      {showReject && onReject && (
        <button onClick={onReject} disabled={disabled || rejectDisabled} title="Reject"
          className="p-1.5 rounded-md text-orange-500 hover:bg-orange-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors">
          <XCircle className="w-4 h-4" />
        </button>
      )}
      {showEdit && onEdit && (
        <button onClick={onEdit} disabled={disabled} title="Edit"
          className="p-1.5 rounded-md text-label-secondary hover:bg-surface-secondary disabled:opacity-50 transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
      )}
      {showDelete && onDelete && (
        <button onClick={onDelete} disabled={disabled} title="Delete"
          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
