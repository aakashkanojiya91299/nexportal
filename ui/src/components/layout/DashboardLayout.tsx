'use client'

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Sidebar } from './Sidebar'
import { SidebarRail } from './SidebarRail'
import { TricolorBar } from './TricolorBar'
import type { NavGroup, UserInfo, PoweredByConfig } from './types'
import type { SidebarVariant } from '../../theme/types'

export interface DashboardLayoutProps {
  navGroups: NavGroup[]
  sidebar: SidebarVariant
  projectName: string
  logoSrc: string
  logoAlt?: string
  user: UserInfo
  pathname: string
  onLogout: () => void
  poweredBy?: PoweredByConfig
  children: ReactNode
  className?: string
}

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white select-none"
      style={{ background: 'var(--primary, #000080)' }}
    >
      {initials || '?'}
    </span>
  )
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

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {sidebar === 'full' && <Sidebar {...commonProps} />}
      {sidebar === 'rail' && <SidebarRail {...commonProps} />}
      {sidebar === 'both' && (
        <>
          <div className="hidden lg:flex"><Sidebar {...commonProps} /></div>
          <div className="flex lg:hidden"><SidebarRail {...commonProps} /></div>
        </>
      )}

      {/* ── Right side: top-bar + content ────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top header bar */}
        <header className="flex-shrink-0 hidden lg:flex items-center justify-between h-14 px-6 bg-white border-b border-separator-opaque">
          {/* Left: current section name derived from pathname */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-callout font-semibold text-label-primary capitalize">
              {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </div>

          {/* Right: user info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-callout font-semibold text-label-primary leading-tight">{user.name}</p>
              <p className="text-[11px] text-label-tertiary leading-tight">{user.role}</p>
            </div>
            <UserAvatar name={user.name} />
          </div>
        </header>

        {/* Main content */}
        <main className={cn(
          'flex-1 overflow-auto',
          sidebar !== 'rail' && 'pt-[52px] lg:pt-0',
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
