'use client'

import React, { type ReactNode, useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Sidebar } from './Sidebar'
import { SidebarRail } from './SidebarRail'
import { HeaderNav } from './HeaderNav'
import { PageFooter } from './PageFooter'
import { TricolorBar } from './TricolorBar'
import { Breadcrumbs } from './Breadcrumbs'
import { NotificationBell } from './NotificationBell'
import type { BreadcrumbItem } from './Breadcrumbs'
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
  /** Breadcrumb items rendered on the left side of the desktop header bar */
  breadcrumbs?: BreadcrumbItem[]
  breadcrumbHomeHref?: string
  breadcrumbHomeLabel?: string
  /** Start the sidebar in collapsed state (persisted to localStorage) */
  defaultCollapsed?: boolean
  /** href for the Settings link in the header (default: /dashboard/settings) */
  settingsHref?: string
  /** Show the Settings icon button in the header bar (default: true) */
  showSettings?: boolean
  /** API endpoint for the notification bell — e.g. "/api/notifications". Omit to hide the bell. */
  notificationsEndpoint?: string
  /** Show the Notification Bell in the header bar (default: true when notificationsEndpoint is set) */
  showNotifications?: boolean
  /** Called when a notification with a linkUrl is clicked */
  onNavigate?: (url: string) => void
  /** Extra nodes rendered in the desktop header bar, between breadcrumbs and the profile menu */
  headerActions?: ReactNode
  className?: string
  style?: React.CSSProperties
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
      className="flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white select-none h-9 w-9 text-[13px]"
      style={{
        background: 'linear-gradient(135deg, var(--primary, #000080) 0%, color-mix(in srgb, var(--primary, #000080) 60%, var(--accent, #FF9933)) 100%)',
      }}
    >
      {initials || '?'}
    </span>
  )
}

function UserChip({ user }: { user: UserInfo }) {
  return (
    <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl bg-gray-50 border border-gray-100">
      <UserAvatar name={user.name} />
      <div className="text-left hidden sm:block">
        <p className="text-[13px] font-semibold text-gray-900 leading-tight">{user.name}</p>
        <p className="text-[11px] text-gray-400 leading-tight capitalize">{user.role}</p>
      </div>
    </div>
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
  poweredBy,
  children,
  breadcrumbs,
  breadcrumbHomeHref,
  breadcrumbHomeLabel,
  defaultCollapsed = false,
  settingsHref = '/dashboard/settings',
  showSettings = true,
  notificationsEndpoint,
  showNotifications = true,
  onNavigate,
  headerActions,
  className,
  style,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  // Persist + restore collapse state from localStorage (client-only)
  useEffect(() => {
    const saved = localStorage.getItem('ui-sidebar-collapsed')
    if (saved !== null) setCollapsed(saved === 'true')
  }, [])

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('ui-sidebar-collapsed', String(next))
  }

  const commonProps = { navGroups, logoSrc, logoAlt, projectName, user, pathname, onLogout }

  /* ── Header layout ──────────────────────────────────────────────────────── */
  if (sidebar === 'header') {
    return (
      <div className={cn('flex flex-col min-h-screen bg-surface-secondary', className)} style={style}>
        <HeaderNav {...commonProps} settingsHref={settingsHref} />
        <main className="flex-1 overflow-auto pt-[52px] lg:pt-0">
          {children}
        </main>
        <PageFooter
          organizationName={projectName}
          logoSrc={logoSrc}
          logoAlt={logoAlt}
          poweredByText={poweredBy?.text}
          poweredByLogoSrc={poweredBy?.logoSrc}
          poweredByHref={poweredBy?.href}
        />
      </div>
    )
  }

  return (
    <div className={cn('flex min-h-screen bg-surface-secondary', className)} style={style}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {sidebar === 'full' && <Sidebar {...commonProps} collapsed={collapsed} onToggleCollapse={toggleCollapsed} />}
      {sidebar === 'rail' && <SidebarRail {...commonProps} />}
      {sidebar === 'both' && (
        <>
          <div className="hidden lg:flex"><Sidebar {...commonProps} collapsed={collapsed} onToggleCollapse={toggleCollapsed} /></div>
          <div className="flex lg:hidden"><SidebarRail {...commonProps} /></div>
        </>
      )}

      {/* ── Right side: top-bar + content ────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Desktop top header bar */}
        <div className="hidden lg:block flex-shrink-0 px-4 pt-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm animate-slide-up" style={{ animationDuration: '0.35s', animationTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', animationFillMode: 'both' }}>
            {/* Top tricolor — start corner */}
            <div className="overflow-hidden rounded-t-2xl">
              <TricolorBar height={3} animated shimmer />
            </div>
            <div className="px-5 py-3 flex items-center justify-between gap-4">
              {/* Left: breadcrumbs */}
              <div className="min-w-0 flex-1">
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <Breadcrumbs
                    items={breadcrumbs}
                    homeHref={breadcrumbHomeHref}
                    homeLabel={breadcrumbHomeLabel}
                    className="mb-0"
                  />
                )}
              </div>
              {/* Right: notification bell + settings + separator + user chip */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {headerActions}
                {showNotifications && notificationsEndpoint && (
                  <NotificationBell
                    apiEndpoint={notificationsEndpoint}
                    onNavigate={onNavigate}
                  />
                )}
                {showSettings && (
                  <a
                    href={settingsHref}
                    title="Settings"
                    aria-label="Settings"
                    className={cn(
                      'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      pathname.startsWith(settingsHref)
                        ? 'border-[color:var(--primary,#000080)]/25 text-[color:var(--primary,#000080)] shadow-[0_2px_10px_-2px_rgba(0,0,128,0.25)] ring-1 ring-[color:var(--primary,#000080)]/15'
                        : 'border-black/[0.08] text-label-secondary hover:border-[color:var(--primary,#000080)]/20 hover:text-[color:var(--primary,#000080)] hover:shadow-md',
                    )}
                  >
                    <Settings
                      className={cn('h-4 w-4 flex-shrink-0', pathname.startsWith(settingsHref) && 'text-[color:var(--primary,#000080)]')}
                      strokeWidth={pathname.startsWith(settingsHref) ? 2.25 : 2}
                      aria-hidden
                    />
                  </a>
                )}
                {/* Separator — only shown when at least one icon is visible */}
                {(showSettings || (showNotifications && notificationsEndpoint)) && (
                  <div
                    className="h-7 w-px flex-shrink-0 mx-1"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.12), transparent)' }}
                    aria-hidden
                  />
                )}
                <UserChip user={user} />
              </div>
            </div>
            {/* Bottom tricolor — end corner (reversed) */}
            <div className="overflow-hidden rounded-b-2xl" style={{ transform: 'scaleX(-1)' }}>
              <TricolorBar height={3} animated shimmer />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className={cn(
          'flex-1 overflow-auto',
          sidebar !== 'rail' && 'pt-[52px] lg:pt-0',
        )}>
          {children}
        </main>

        {/* Footer */}
        <PageFooter
          organizationName={projectName}
          logoSrc={logoSrc}
          logoAlt={logoAlt}
          poweredByText={poweredBy?.text}
          poweredByLogoSrc={poweredBy?.logoSrc}
          poweredByHref={poweredBy?.href}
        />
      </div>
    </div>
  )
}
