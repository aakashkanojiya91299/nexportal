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

export function SidebarRail({
  navGroups,
  logoSrc,
  logoAlt,
  projectName,
  user: _user,
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
    background: 'var(--primary, #000080)',
    color: '#fff',
  }

  const allItems = navGroups.flatMap((g) => g.items)

  return (
    <>
      <aside
        className={cn(
          'flex flex-col h-screen sticky top-0 bg-white border-r border-separator-opaque w-16',
          className,
        )}
      >
        <TricolorBar />

        <div className="flex-shrink-0 flex justify-center py-3 border-b border-separator-opaque">
          <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="sm" />
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-1">
          {allItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={(e) => showTooltip(e, item.label)}
                onMouseLeave={hideTooltip}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded transition-all duration-200 mx-auto',
                  !active && 'text-label-secondary hover:bg-surface-secondary hover:text-label-primary',
                )}
                style={active ? activeStyle : undefined}
                aria-label={item.label}
              >
                <span className={cn('h-4 w-4', active ? 'text-white' : 'text-label-tertiary')}>
                  {item.icon}
                </span>
              </a>
            )
          })}
        </nav>

        <div className="flex-shrink-0 flex justify-center border-t border-separator-opaque py-2">
          <button
            type="button"
            onClick={onLogout}
            onMouseEnter={(e) => showTooltip(e, 'Log out')}
            onMouseLeave={hideTooltip}
            className="flex h-10 w-10 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-50"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <TricolorBar />
      </aside>

      {tooltip && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] whitespace-nowrap rounded px-2.5 py-1.5 text-caption1 font-medium text-white shadow"
            style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)', background: 'var(--primary, #000080)' }}
          >
            {tooltip.label}
            <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45" style={{ background: 'var(--primary, #000080)' }} />
          </div>,
          document.body,
        )
      }
    </>
  )
}
