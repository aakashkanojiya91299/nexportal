'use client'

import React, { useRef, useState, useCallback, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * ScrollArea — styled scroll container with a custom scrollbar track/thumb.
 * Matches shadcn/ui's ScrollArea API.
 *
 * Usage:
 *   <ScrollArea className="h-72 w-48">
 *     <div>...long content...</div>
 *     <ScrollBar />          ← optional, rendered automatically when needed
 *   </ScrollArea>
 *
 *   <ScrollArea orientation="horizontal" className="w-full">
 *     ...
 *   </ScrollArea>
 */

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both'
  /** Hide the scrollbar track (content still scrolls) */
  hideScrollbar?: boolean
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, orientation = 'vertical', hideScrollbar = false, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={style}
        {...props}
      >
        {/* Viewport */}
        <div
          className={cn(
            'h-full w-full rounded-[inherit]',
            orientation === 'vertical'   && 'overflow-y-auto overflow-x-hidden',
            orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
            orientation === 'both'       && 'overflow-auto',
            hideScrollbar && 'scrollbar-hide',
            // Custom thin scrollbar via CSS
            !hideScrollbar && [
              '[&::-webkit-scrollbar]:w-1.5',
              '[&::-webkit-scrollbar]:h-1.5',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:rounded-full',
              '[&::-webkit-scrollbar-thumb]:bg-black/15',
              '[&::-webkit-scrollbar-thumb:hover]:bg-black/25',
            ],
          )}
        >
          {children}
        </div>
      </div>
    )
  },
)
ScrollArea.displayName = 'ScrollArea'

// ─── ScrollBar (decorative — actual scrolling is handled by CSS) ──────────────

export interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal'
}

export const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical'   && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
        className,
      )}
      {...props}
    >
      <div className="relative flex-1 rounded-full bg-black/15" />
    </div>
  ),
)
ScrollBar.displayName = 'ScrollBar'
