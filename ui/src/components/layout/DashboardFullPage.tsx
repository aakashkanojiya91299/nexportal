'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Utility class string for a full-bleed dashboard surface.
 * Use directly when you need just the class (e.g. on an existing element).
 */
export const dashboardFullPageSurfaceClass =
  'animate-fade-in -mx-6 -mt-6 max-w-none box-border px-5 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 pb-8 pt-5 min-h-[calc(100dvh-3.5rem)] bg-gradient-to-b from-[#eceef2] via-[#e6e8ed] to-[#eef0f4] border-b border-black/[0.06]'

export interface DashboardFullPageProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * DashboardFullPage
 *
 * Full-bleed gradient page surface used for detail / add / edit flows.
 * Bleeds to the edges of the dashboard content area.
 *
 * @example
 * <DashboardFullPage>
 *   <PageShell title="Add Product" />
 *   ...
 * </DashboardFullPage>
 */
export function DashboardFullPage({ children, className, style }: DashboardFullPageProps) {
  return (
    <div className={cn(dashboardFullPageSurfaceClass, className)} style={style}>
      {children}
    </div>
  )
}
