'use client'

import React, { type ReactNode, useState, useRef, useEffect } from 'react'
import { LogOut, Settings, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Sidebar } from './Sidebar'
import { SidebarRail } from './SidebarRail'
import { PageFooter } from './PageFooter'
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
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl border border-separator-opaque overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-100"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}
        >
          {/* User info header */}
          <div
            className="px-4 py-3.5 border-b border-separator-opaque"
            style={{ background: 'var(--primary-soft, rgba(0,0,128,0.05))' }}
          >
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} />
              <div className="min-w-0">
                <p className="text-callout font-semibold text-label-primary truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-label-tertiary truncate mt-0.5">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            <a
              href={settingsHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-callout font-medium text-label-secondary hover:bg-surface-secondary/80 hover:text-label-primary transition-colors"
            >
              <Settings className="h-4 w-4 flex-shrink-0 text-label-tertiary" />
              Settings
            </a>
          </div>

          <div className="border-t border-separator-opaque py-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout() }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-callout font-medium text-red-500 hover:bg-red-50/80 transition-colors"
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

        {/* Desktop top header bar */}
        <header className="flex-shrink-0 hidden lg:flex items-center justify-between h-14 px-6 bg-white border-b border-separator-opaque">
          {/* Left: current section name */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-callout font-semibold text-label-primary capitalize">
              {pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </div>

          {/* Right: profile menu */}
          <ProfileMenu user={user} onLogout={onLogout} />
        </header>

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
