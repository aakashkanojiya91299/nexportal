'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Sidebar } from './Sidebar'
import { SidebarRail } from './SidebarRail'
import type { NavGroup, UserInfo, PoweredByConfig } from './types'
import type { SidebarVariant } from '../../theme/types'

export interface DashboardLayoutProps {
  /** Nav groups rendered in the sidebar */
  navGroups: NavGroup[]
  /** 'full' = wide sidebar, 'rail' = icon-only, 'both' = full on lg+, rail on <lg */
  sidebar: SidebarVariant
  projectName: string
  logoSrc: string
  logoAlt?: string
  user: UserInfo
  /** Current pathname — use Next.js usePathname() in your layout */
  pathname: string
  onLogout: () => void
  poweredBy?: PoweredByConfig
  children: ReactNode
  className?: string
}

export function DashboardLayout({
  navGroups,
  sidebar,
  projectName,
  logoSrc,
  logoAlt,
  user,
  pathname,
  onLogout,
  children,
  className,
}: DashboardLayoutProps) {
  const commonProps = { navGroups, logoSrc, logoAlt, projectName, user, pathname, onLogout }

  return (
    <div className={cn('flex min-h-screen bg-surface-secondary', className)}>
      {sidebar === 'full' && (
        <Sidebar {...commonProps} />
      )}
      {sidebar === 'rail' && (
        <SidebarRail {...commonProps} />
      )}
      {sidebar === 'both' && (
        <>
          <div className="hidden lg:flex">
            <Sidebar {...commonProps} />
          </div>
          <div className="flex lg:hidden">
            <SidebarRail {...commonProps} />
          </div>
        </>
      )}

      <main className={cn(
        'flex-1 overflow-auto',
        sidebar !== 'rail' && 'pt-14 lg:pt-0',  // offset mobile top bar
      )}>
        {children}
      </main>
    </div>
  )
}
