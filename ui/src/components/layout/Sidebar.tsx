'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronRight, LogOut, Menu, X, Settings, ChevronsLeft, ChevronsRight } from 'lucide-react'
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
  onToggleCollapse?: () => void
  onLogout: () => void
  className?: string
  style?: React.CSSProperties
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
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

export function Sidebar({
  navGroups,
  projectName,
  logoSrc,
  logoAlt,
  user,
  pathname,
  collapsed = false,
  onToggleCollapse,
  onLogout,
  className,
  style,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) setMobileMenuOpen(false)
    }
    if (mobileMenuOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [mobileMenuOpen])

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
    background: 'linear-gradient(135deg, var(--primary, #000080) 0%, color-mix(in srgb, var(--primary, #000080) 80%, #1e3a8a) 100%)',
    color: '#fff',
    boxShadow: '0 2px 8px color-mix(in srgb, var(--primary, #000080) 30%, transparent)',
  }

  const makeSidebarBody = (showHeader: boolean) => (
    <aside
      className={cn(
        'flex flex-col h-full bg-white border-r border-separator-opaque overflow-hidden transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-72',
        className,
      )}
      style={style}
    >
      {/* ── Header (desktop only) ───────────────────────────────────────── */}
      {showHeader && (
        <div className="flex-shrink-0">
          <TricolorBar animated shimmer />
          <div
            className={cn(
              'flex items-center border-b border-separator-opaque',
              collapsed ? 'flex-col justify-center px-2 py-3 gap-2' : 'gap-3 px-4 py-3',
            )}
          >
            <div className={cn('flex items-center gap-3 min-w-0', collapsed ? 'justify-center w-full' : 'flex-1')}>
              <div
                className={cn(
                  'flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden',
                  collapsed ? 'w-10 h-10' : 'w-14 h-14',
                )}
              >
                <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size={collapsed ? 'sm' : 'lg'} />
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <h1 className="text-subhead font-bold truncate leading-tight" style={{ color: 'var(--primary, #000080)' }}>
                    {projectName}
                  </h1>
                  <p className="text-[10px] font-medium text-label-tertiary uppercase tracking-wider mt-0.5">Admin Portal</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          collapsed ? 'py-3 px-2' : 'py-3 px-3',
        )}
      >
        {navGroups.map((group, gi) => {
          const isMulti = group.items.length > 1
          const expanded = openSection === group.heading

          if (!isMulti) {
            const item = group.items[0]
            const active = isActive(pathname, item.href)
            return (
              <div key={group.heading} className={gi > 0 ? 'mt-1' : ''}>
                <a
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  onMouseEnter={(e) => showTooltip(e, item.label)}
                  onMouseLeave={hideTooltip}
                  className={cn(
                    'relative flex items-center rounded-xl text-callout font-medium transition-all duration-200',
                    collapsed ? 'h-10 w-10 justify-center mx-auto p-0' : 'gap-3 px-3 py-2.5',
                    !active && 'text-label-secondary hover:bg-surface-secondary/80 hover:text-label-primary',
                  )}
                  style={active ? activeStyle : undefined}
                >
                  <span className={cn('flex-shrink-0 w-[18px] h-[18px]', active ? 'text-white' : 'text-label-tertiary')}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge != null && (
                    <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white leading-none">
                      {item.badge}
                    </span>
                  )}
                </a>
              </div>
            )
          }

          return (
            <div key={group.heading} className={gi > 0 ? 'mt-3' : ''}>
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setOpenSection((p) => p === group.heading ? null : group.heading)}
                  className="mb-1 flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-secondary/60"
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
                    style={{ background: 'var(--primary-soft, rgba(0,0,128,0.08))', color: 'var(--primary, #000080)' }}
                  >
                    {group.groupIcon}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[10px] font-bold uppercase tracking-widest text-label-tertiary">
                    {group.heading}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 flex-shrink-0 text-label-quaternary transition-transform duration-200',
                      expanded && 'rotate-180',
                    )}
                  />
                </button>
              )}
              {collapsed && (
                <div className="my-2 flex justify-center">
                  <span className="block h-px w-6 bg-separator-opaque" />
                </div>
              )}

              <div
                className={cn(
                  !collapsed && expanded
                    ? 'space-y-0.5 border-l-2 pl-3 ml-4'
                    : !collapsed
                    ? 'hidden'
                    : 'space-y-1',
                )}
                style={
                  !collapsed && expanded
                    ? { borderColor: 'var(--accent-soft, rgba(255,153,51,0.4))' }
                    : undefined
                }
              >
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
                          'relative flex items-center rounded-xl text-subhead font-medium transition-all duration-200',
                          collapsed ? 'h-10 w-10 justify-center p-0' : 'gap-3 px-3 py-2',
                          !active && 'text-label-secondary hover:bg-surface-secondary/80 hover:text-label-primary',
                        )}
                        style={active ? activeStyle : undefined}
                      >
                        <span className={cn('flex-shrink-0 w-4 h-4', active ? 'text-white' : 'text-label-tertiary')}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {!collapsed && active && (
                          <ChevronRight className="h-3 w-3 flex-shrink-0 text-white/70" />
                        )}
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* ── Footer (logout) ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-separator-opaque">
        {collapsed ? (
          <div className="flex justify-center py-3 px-2">
            <button
              type="button"
              onClick={onLogout}
              title="Logout"
              onMouseEnter={(e) => showTooltip(e, 'Logout')}
              onMouseLeave={hideTooltip}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="px-3 py-3">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-callout font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              Logout
            </button>
          </div>
        )}
        <TricolorBar animated shimmer />
      </div>
    </aside>
  )

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-separator-opaque bg-white/95 shadow-sm backdrop-blur-sm lg:hidden">
        <TricolorBar animated shimmer />
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-label-secondary transition-colors hover:bg-surface-secondary"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
            >
              <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="md" />
            </div>
          </div>
          {/* Mobile profile menu */}
          <div ref={mobileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-full focus:outline-none"
            >
              <UserAvatar name={user.name} size="sm" />
            </button>
            {mobileMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white shadow-xl border border-separator-opaque overflow-hidden z-[60]"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                <div className="px-4 py-3 border-b border-separator-opaque" style={{ background: 'var(--primary-soft, rgba(0,0,128,0.05))' }}>
                  <p className="text-callout font-semibold text-label-primary truncate">{user.name}</p>
                  <p className="text-[11px] text-label-tertiary truncate">{user.role}</p>
                </div>
                <div className="py-1.5">
                  <a
                    href="/dashboard/settings"
                    onClick={() => { setMobileMenuOpen(false); setIsMobileOpen(false) }}
                    className="flex items-center gap-3 px-4 py-2.5 text-callout font-medium text-label-secondary hover:bg-surface-secondary/80 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-label-tertiary" />
                    Settings
                  </a>
                </div>
                <div className="border-t border-separator-opaque py-1.5">
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); setIsMobileOpen(false); onLogout() }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-callout font-medium text-red-500 hover:bg-red-50/80 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile drawer — no logo/name header (already in mobile top bar) */}
      <div
        className={cn(
          'fixed top-0 left-0 z-40 h-screen pt-[52px] lg:hidden transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {makeSidebarBody(false)}
      </div>

      {/* Desktop sidebar — full header with logo and name */}
      <div className="hidden lg:flex h-screen sticky top-0">
        {makeSidebarBody(true)}
      </div>

      {/* Floating collapse toggle — desktop only, fixed at sidebar right edge */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'hidden lg:flex items-center justify-center',
            'fixed top-1/2 -translate-y-1/2 z-50',
            'w-6 h-6 rounded-full bg-white border border-separator-opaque shadow-md',
            'text-label-tertiary hover:text-label-primary hover:shadow-lg hover:scale-110',
            'transition-all duration-300 ease-in-out',
            collapsed ? 'left-[60px]' : 'left-[276px]',
          )}
        >
          {collapsed
            ? <ChevronsRight className="w-3 h-3" />
            : <ChevronsLeft className="w-3 h-3" />
          }
        </button>
      )}

      {/* Tooltip portal */}
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
