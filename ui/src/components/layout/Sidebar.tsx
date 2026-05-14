'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronRight, LogOut, Menu, X, Shield } from 'lucide-react'
import { cn } from '../../lib/cn'
import { BrandLogo } from './BrandLogo'
import { TricolorBar } from './TricolorBar'
import type { NavGroup, UserInfo } from './types'

export interface SidebarProps {
  navGroups: NavGroup[]
  projectName: string
  logoSrc: string
  logoAlt?: string
  user: UserInfo
  pathname: string
  collapsed?: boolean
  onLogout: () => void
  className?: string
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

export function Sidebar({
  navGroups,
  projectName,
  logoSrc,
  logoAlt,
  user,
  pathname,
  collapsed = false,
  onLogout,
  className,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null)

  const showTooltip = useCallback(
    (e: React.MouseEvent, label: string) => {
      if (!collapsed || typeof window === 'undefined' || window.innerWidth < 1024) return
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setTooltip({ label, top: rect.top + rect.height / 2, left: rect.right + 12 })
    },
    [collapsed],
  )
  const hideTooltip = useCallback(() => setTooltip(null), [])

  useEffect(() => {
    let active: string | null = null
    navGroups.forEach((g) => {
      if (g.items.length > 1 && g.items.some((item) => isActive(pathname, item.href))) {
        active = g.heading
      }
    })
    setOpenSection(active)
  }, [pathname, navGroups])

  const activeStyle = {
    background: 'linear-gradient(to right, var(--primary, #000080), color-mix(in srgb, var(--primary, #000080) 80%, transparent))',
    color: '#fff',
  }

  const SidebarBody = (
    <aside
      className={cn(
        'flex flex-col h-full bg-white border-r border-separator-opaque overflow-hidden transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      <TricolorBar />

      {/* Brand header */}
      <div className={cn(
        'flex-shrink-0 flex items-center border-b border-separator-opaque',
        collapsed ? 'justify-center p-3' : 'gap-3 px-6 py-5',
      )}>
        <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size={collapsed ? 'sm' : 'md'} />
        {!collapsed && (
          <div>
            <h1 className="text-callout font-bold" style={{ color: 'var(--primary, #000080)' }}>
              {projectName}
            </h1>
            <p className="text-footnote text-label-secondary">{user.role}</p>
          </div>
        )}
      </div>

      {/* User role chip */}
      <div className={cn('flex-shrink-0 border-b border-separator-opaque px-4 py-3', collapsed && 'px-2 py-2')}>
        <div className={cn(
          'flex items-center rounded gap-2 px-3 py-2',
          collapsed && 'justify-center',
        )} style={{ background: 'var(--primary-soft, rgba(0,0,128,0.08))' }}>
          <Shield className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--primary, #000080)' }} />
          {!collapsed && (
            <span className="truncate text-callout font-medium" style={{ color: 'var(--primary, #000080)' }}>
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className={cn('flex-1 overflow-y-auto overflow-x-hidden py-2', collapsed ? 'px-2' : 'px-3')}>
        {navGroups.map((group, gi) => {
          const isMulti = group.items.length > 1
          const expanded = openSection === group.heading

          if (!isMulti) {
            const item = group.items[0]
            const active = isActive(pathname, item.href)
            return (
              <div key={group.heading} className={gi > 0 ? 'mt-2' : ''}>
                <a
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  onMouseEnter={(e) => showTooltip(e, item.label)}
                  onMouseLeave={hideTooltip}
                  className={cn(
                    'relative flex items-center gap-2.5 rounded text-callout font-medium transition-all duration-200',
                    collapsed ? 'h-9 w-9 justify-center p-0' : 'px-3 py-2',
                    !active && 'text-label-secondary hover:bg-surface-secondary hover:text-label-primary',
                  )}
                  style={active ? activeStyle : undefined}
                >
                  <span className={cn('flex-shrink-0', active ? 'text-white' : 'text-label-tertiary')}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge != null && (
                    <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-caption1 text-white">
                      {item.badge}
                    </span>
                  )}
                </a>
              </div>
            )
          }

          return (
            <div key={group.heading} className={gi > 0 ? 'mt-2' : ''}>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setOpenSection((p) => p === group.heading ? null : group.heading)}
                  className="mb-0.5 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-surface-secondary/80"
                >
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-sm"
                    style={{ background: 'var(--primary-soft, rgba(0,0,128,0.08))', color: 'var(--primary, #000080)' }}
                  >
                    {group.groupIcon}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-caption1 font-semibold uppercase tracking-wider text-label-secondary">
                    {group.heading}
                  </span>
                  <ChevronDown className={cn('h-3.5 w-3.5 flex-shrink-0 text-label-tertiary transition-transform duration-200', expanded && 'rotate-180')} />
                </button>
              )}
              {collapsed && (
                <div className="my-1.5 flex justify-center">
                  <span className="block h-px w-5 bg-separator-opaque" />
                </div>
              )}

              <div className={cn(
                !collapsed && expanded ? 'space-y-0.5 border-l-2 pl-2.5 ml-3.5' : !collapsed ? 'hidden' : 'space-y-0.5',
              )} style={!collapsed && expanded ? { borderColor: 'var(--accent-soft, rgba(255,153,51,0.35))' } : undefined}>
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <div key={item.href} className={collapsed ? 'flex justify-center' : ''}>
                      <a
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        onMouseEnter={(e) => showTooltip(e, item.label)}
                        onMouseLeave={hideTooltip}
                        className={cn(
                          'relative flex items-center gap-2 rounded text-subhead font-medium transition-all duration-200',
                          collapsed ? 'h-9 w-9 justify-center p-0' : 'px-2.5 py-1.5',
                          !active && 'text-label-secondary hover:bg-surface-secondary hover:text-label-primary',
                        )}
                        style={active ? activeStyle : undefined}
                      >
                        <span className={cn('flex-shrink-0 h-4 w-4', active ? 'text-white' : 'text-label-tertiary')}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && active && <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-80 text-white" />}
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div className={cn('flex-shrink-0 border-t border-separator-opaque', collapsed ? 'px-2 py-2' : 'px-4 py-3')}>
        <button
          type="button"
          onClick={onLogout}
          onMouseEnter={(e) => showTooltip(e, 'Log out')}
          onMouseLeave={hideTooltip}
          className={cn(
            'group relative flex w-full items-center rounded text-callout font-medium text-red-500 transition-colors hover:bg-red-50',
            collapsed ? 'h-10 w-10 justify-center p-0' : 'gap-3 px-4 py-2.5',
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">Log out</span>}
        </button>
      </div>

      <TricolorBar />
    </aside>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-separator-opaque bg-white/95 shadow-sm backdrop-blur-sm lg:hidden">
        <TricolorBar />
        <div className="flex items-center justify-between px-4 py-2">
          <button
            type="button"
            onClick={() => setIsMobileOpen((v) => !v)}
            className="rounded p-2 text-label-secondary transition-colors hover:bg-surface-secondary"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2">
            <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="sm" />
            <span className="text-callout font-semibold" style={{ color: 'var(--primary, #000080)' }}>
              {projectName}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 z-40 h-screen pt-14 lg:hidden transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {SidebarBody}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-screen sticky top-0">
        {SidebarBody}
      </div>

      {/* Tooltip portal */}
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
