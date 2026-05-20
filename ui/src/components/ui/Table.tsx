'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Raw semantic table primitives — identical API to shadcn/ui Table.
 *
 * Usage:
 *   <Table>
 *     <TableCaption>A list of your recent invoices.</TableCaption>
 *     <TableHeader>
 *       <TableRow>
 *         <TableHead>Invoice</TableHead>
 *         <TableHead className="text-right">Amount</TableHead>
 *       </TableRow>
 *     </TableHeader>
 *     <TableBody>
 *       <TableRow>
 *         <TableCell>INV-001</TableCell>
 *         <TableCell className="text-right">$250.00</TableCell>
 *       </TableRow>
 *     </TableBody>
 *     <TableFooter>
 *       <TableRow>
 *         <TableCell>Total</TableCell>
 *         <TableCell className="text-right">$250.00</TableCell>
 *       </TableRow>
 *     </TableFooter>
 *   </Table>
 */

// ─── Table ────────────────────────────────────────────────────────────────────

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Wraps the table in a div with overflow-auto for horizontal scroll */
  scrollable?: boolean
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, scrollable = true, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-[13px]', className)}
        {...props}
      />
    )
    if (!scrollable) return table
    return (
      <div className="relative w-full overflow-auto rounded-xl border border-separator-opaque">
        {table}
      </div>
    )
  },
)
Table.displayName = 'Table'

// ─── TableHeader ──────────────────────────────────────────────────────────────

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-fill-secondary/60 [&_tr]:border-b [&_tr]:border-separator-opaque', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

// ─── TableBody ────────────────────────────────────────────────────────────────

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0 divide-y divide-separator-opaque', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

// ─── TableFooter ──────────────────────────────────────────────────────────────

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-separator-opaque bg-fill-secondary/40 font-medium',
      '[&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

// ─── TableRow ─────────────────────────────────────────────────────────────────

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'transition-colors hover:bg-fill-secondary/50 data-[state=selected]:bg-fill-secondary',
      className,
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

// ─── TableHead ────────────────────────────────────────────────────────────────

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle text-[11px] font-semibold uppercase tracking-wider',
      'text-label-tertiary whitespace-nowrap',
      '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

// ─── TableCell ────────────────────────────────────────────────────────────────

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'px-4 py-3 align-middle text-label-secondary',
      '[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

// ─── TableCaption ─────────────────────────────────────────────────────────────

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-[12px] text-label-tertiary', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'
