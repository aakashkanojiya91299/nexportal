'use client'

import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { LogOut } from 'lucide-react'
import { cn } from '../../lib/cn'
import { BrandLogo } from './BrandLogo'
import { TricolorBar } from './TricolorBar'
import type { NavGroup, UserInfo } from './types'

export interface SidebarRailProps {
  navGroups: NavGroup[]
  logoSrc: string
  logoAlt?: string
  projectName: string
  user: UserInfo
  pathname: string
  onLogout: () => void
  className?: string
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
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

export function SidebarRail({
  navGroups,
  logoSrc,
  logoAlt,
  projectName,
  user,
  pathname,
  onLogout,
  className,
}: SidebarRailProps) {
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null)

  const showTooltip = useCallback((e: React.MouseEvent, label: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltip({ label, top: rect.top + rect.height / 2, left: rect.right + 12 })
  }, [])

  const hideTooltip = useCallback(() => setTooltip(null), [])

  const activeStyle = {
    background: 'linear-gradient(135deg, var(--primary, #000080) 0%, color-mix(in srgb, var(--primary, #000080) 80%, #1e3a8a) 100%)',
    color: '#fff',
    boxShadow: '0 2px 8px color-mix(in srgb, var(--primary, #000080) 30%, transparent)',
  }

  const allItems = navGroups.flatMap((g) => g.items)

  return (
    <>
      <aside
        className={cn(
          'flex flex-col h-screen sticky top-0 bg-white border-r border-separator-opaque w-[72px]',
          className,
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0">
          <TricolorBar />
          <div className="flex justify-center py-4 border-b border-separator-opaque">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary-soft, rgba(0,0,128,0.08))' }}
            >
              <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="sm" />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1">
          {allItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={(e) => showTooltip(e, item.label)}
                onMouseLeave={hideTooltip}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 mx-auto',
                  !active && 'text-label-tertiary hover:bg-surface-secondary hover:text-label-secondary',
                )}
                style={active ? activeStyle : undefined}
                aria-label={item.label}
              >
                <span className={cn('h-[18px] w-[18px]', active ? 'text-white' : '')}>
                  {item.icon}
                </span>
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-separator-opaque">
          <div className="flex flex-col items-center gap-2 py-3 px-2">
            <UserAvatar name={user.name} />
            <button
              type="button"
              onClick={onLogout}
              onMouseEnter={(e) => showTooltip(e, 'Sign out')}
              onMouseLeave={hideTooltip}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <TricolorBar />
        </div>
      </aside>

      {tooltip && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] whitespace-nowrap rounded-lg px-2.5 py-1.5 text-caption1 font-semibold text-white shadow-lg"
            style={{
              top: tooltip.top,
              left: tooltip.left,
              transform: 'translateY(-50%)',
              background: 'var(--primary, #000080)',
            }}
          >
            {tooltip.label}
            <div
              className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45"
              style={{ background: 'var(--primary, #000080)' }}
            />
          </div>,
          document.body,
        )
      }
    </>
  )
}
