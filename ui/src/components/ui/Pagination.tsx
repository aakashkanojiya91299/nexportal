'use client'

import React, { type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Standalone Pagination — identical API surface to shadcn/ui Pagination.
 *
 * Low-level composable:
 *   <Pagination>
 *     <PaginationContent>
 *       <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
 *       <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
 *       <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
 *       <PaginationItem><PaginationEllipsis /></PaginationItem>
 *       <PaginationItem><PaginationNext href="#" /></PaginationItem>
 *     </PaginationContent>
 *   </Pagination>
 *
 * High-level controlled:
 *   <PaginationBar page={2} total={50} pageSize={10} onPageChange={setPage} />
 */

// ─── Low-level primitives ─────────────────────────────────────────────────────

export const Pagination = React.forwardRef<HTMLElement, React.ComponentProps<'nav'>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  ),
)
Pagination.displayName = 'Pagination'

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
)
PaginationContent.displayName = 'PaginationContent'

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  ),
)
PaginationItem.displayName = 'PaginationItem'

export interface PaginationLinkProps extends React.ComponentProps<'a'> {
  isActive?: boolean
  disabled?: boolean
}

export function PaginationLink({ className, isActive, disabled, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors select-none',
        isActive
          ? 'pointer-events-none font-semibold text-white'
          : 'text-label-secondary hover:bg-fill-secondary hover:text-label-primary',
        disabled && 'pointer-events-none opacity-40',
        className,
      )}
      style={isActive ? { backgroundColor: 'var(--primary, #000080)' } : undefined}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      aria-label="Go to previous page"
      className={cn(
        'inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[13px] font-medium',
        'text-label-secondary hover:bg-fill-secondary hover:text-label-primary transition-colors select-none',
        props['aria-disabled'] && 'pointer-events-none opacity-40',
        className,
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </a>
  )
}

export function PaginationNext({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      aria-label="Go to next page"
      className={cn(
        'inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[13px] font-medium',
        'text-label-secondary hover:bg-fill-secondary hover:text-label-primary transition-colors select-none',
        props['aria-disabled'] && 'pointer-events-none opacity-40',
        className,
      )}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </a>
  )
}

export function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn('flex h-8 w-8 items-center justify-center text-label-tertiary', className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

// ─── High-level controlled PaginationBar ─────────────────────────────────────

export interface PaginationBarProps {
  /** Current page (1-based) */
  page: number
  /** Total number of items */
  total: number
  /** Items per page */
  pageSize: number
  onPageChange: (page: number) => void
  /** How many page numbers to show on each side of current (default 1) */
  siblingCount?: number
  className?: string
  showInfo?: boolean
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function PaginationBar({
  page,
  total,
  pageSize,
  onPageChange,
  siblingCount = 1,
  className,
  showInfo = true,
}: PaginationBarProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const from = Math.min((page - 1) * pageSize + 1, total)
  const to   = Math.min(page * pageSize, total)

  // Build page numbers with ellipsis
  const leftSibling  = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, totalPages)

  const showLeftDots  = leftSibling > 2
  const showRightDots = rightSibling < totalPages - 1

  let pages: (number | 'left-dots' | 'right-dots')[]

  if (!showLeftDots && !showRightDots) {
    pages = range(1, totalPages)
  } else if (!showLeftDots) {
    const leftItems = range(1, rightSibling + 1)
    pages = [...leftItems, 'right-dots', totalPages]
  } else if (!showRightDots) {
    const rightItems = range(leftSibling - 1, totalPages)
    pages = [1, 'left-dots', ...rightItems]
  } else {
    const middle = range(leftSibling, rightSibling)
    pages = [1, 'left-dots', ...middle, 'right-dots', totalPages]
  }

  return (
    <div className={cn('flex items-center justify-between gap-4 flex-wrap', className)}>
      {showInfo && (
        <p className="text-[12px] text-label-tertiary">
          Showing <span className="font-medium text-label-secondary">{from}–{to}</span> of{' '}
          <span className="font-medium text-label-secondary">{total}</span>
        </p>
      )}
      <Pagination className="mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page <= 1}
              onClick={(e) => { e.preventDefault(); if (page > 1) onPageChange(page - 1) }}
            />
          </PaginationItem>

          {pages.map((p, i) => {
            if (p === 'left-dots' || p === 'right-dots') {
              return <PaginationItem key={`dots-${i}`}><PaginationEllipsis /></PaginationItem>
            }
            return (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => { e.preventDefault(); onPageChange(p) }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page >= totalPages}
              onClick={(e) => { e.preventDefault(); if (page < totalPages) onPageChange(page + 1) }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
