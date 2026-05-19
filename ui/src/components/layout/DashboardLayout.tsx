'use client'

import React, { type ReactNode, useState, useRef, useEffect } from 'react'
import { LogOut, Settings, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Sidebar } from './Sidebar'
import { SidebarRail } from './SidebarRail'
import { HeaderNav } from './HeaderNav'
import { PageFooter } from './PageFooter'
import { TricolorBar } from './TricolorBar'
import { Breadcrumbs } from './Breadcrumbs'
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
  /** href for the Settings link in the header-variant profile dropdown (default: /dashboard/settings) */
  settingsHref?: string
  className?: string
  style?: React.CSSProperties
}

function UserAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white select-none',
        size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-[13px]',
      )}
      style={{ background: 'var(--primary, #000080)' }}
    >
      {initials || '?'}
    </span>
  )
}

interface ProfileMenuProps {
  user: UserInfo
  onLogout: () => void
  settingsHref?: string
}

function ProfileMenu({ user, onLogout, settingsHref = '/dashboard/settings' }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleOutside)
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface-secondary/80 focus:outline-none"
      >
        <div className="text-right hidden sm:block">
          <p className="text-callout font-semibold text-label-primary leading-tight">{user.name}</p>
          <p className="text-[11px] text-label-tertiary leading-tight">{user.role}</p>
        </div>
        <UserAvatar name={user.name} />
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 flex-shrink-0 text-label-quaternary transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-separator-opaque overflow-hidden z-[60] animate-in fade-in-0 zoom-in-95 duration-100"
          style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)' }}
        >
          {/* Top tricolor stripe */}
          <TricolorBar height={3} animated shimmer />

          {/* User info header — solid primary, fully opaque */}
          <div
            className="px-4 py-3.5 border-b border-white/10"
            style={{ background: 'var(--primary, #000080)' }}
          >
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} />
              <div className="min-w-0">
                <p className="text-callout font-semibold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-white/70 truncate mt-0.5">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <a
              href={settingsHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-callout font-medium text-label-primary hover:bg-surface-secondary transition-colors"
            >
              <Settings className="h-4 w-4 flex-shrink-0 text-label-secondary" />
              Settings
            </a>
          </div>

          <div className="border-t border-separator-opaque py-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout() }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-callout font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-slide-up" style={{ animationDuration: '0.35s', animationTimingFunction: 'cubic-bezier(0.22,1,0.36,1)', animationFillMode: 'both' }}>
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
              {/* Right: profile menu */}
              <div className="flex-shrink-0">
                <ProfileMenu user={user} onLogout={onLogout} />
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
