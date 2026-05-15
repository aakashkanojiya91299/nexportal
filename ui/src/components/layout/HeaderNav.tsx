'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, LogOut, Menu, Settings, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { BrandLogo } from './BrandLogo'
import { TricolorBar } from './TricolorBar'
import type { NavGroup, UserInfo } from './types'

export interface HeaderNavProps {
  navGroups: NavGroup[]
  projectName: string
  logoSrc: string
  logoAlt?: string
  user: UserInfo
  pathname: string
  onLogout: () => void
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

function groupHasActive(pathname: string, group: NavGroup): boolean {
  return group.items.some((item) => isActive(pathname, item.href))
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

/* ── Profile dropdown ─────────────────────────────────────────────────────── */
function ProfileMenu({ user, onLogout }: { user: UserInfo; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-black/[0.04] focus:outline-none"
      >
        <div className="hidden text-right sm:block">
          <p className="text-[13px] font-semibold leading-tight text-label-primary">{user.name}</p>
          <p className="text-[11px] leading-tight text-label-tertiary">{user.role}</p>
        </div>
        <UserAvatar name={user.name} />
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 flex-shrink-0 text-label-quaternary transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-separator-opaque bg-white shadow-xl"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <div
            className="border-b border-separator-opaque px-4 py-3.5"
            style={{ background: 'var(--primary-soft, rgba(0,0,128,0.05))' }}
          >
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold leading-tight text-label-primary">{user.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-label-tertiary">{user.role}</p>
              </div>
            </div>
          </div>
          <div className="py-1.5">
            <a
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-label-secondary transition-colors hover:bg-surface-secondary/80 hover:text-label-primary"
            >
              <Settings className="h-4 w-4 flex-shrink-0 text-label-tertiary" />
              Settings
            </a>
          </div>
          <div className="border-t border-separator-opaque py-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout() }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-500 transition-colors hover:bg-red-50/80"
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

/* ── Dropdown menu (portaled) ─────────────────────────────────────────────── */
interface DropdownMenuProps {
  group: NavGroup
  rect: { top: number; left: number; width: number }
  pathname: string
  onClose: () => void
}

function DropdownMenu({ group, rect, pathname, onClose }: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[200] overflow-hidden rounded-2xl border border-separator-opaque bg-white shadow-xl"
      style={{
        top: rect.top,
        left: rect.left,
        minWidth: Math.max(rect.width, 200),
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="py-1.5">
        {group.items.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors',
                active
                  ? 'font-semibold text-[color:var(--primary,#000080)]'
                  : 'text-label-secondary hover:bg-surface-secondary/80 hover:text-label-primary',
              )}
            >
              {item.icon && <span className={cn('flex-shrink-0', active ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary')}>{item.icon}</span>}
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[color:var(--primary,#000080)]" />}
            </a>
          )
        })}
      </div>
    </div>,
    document.body,
  )
}

/* ── Mobile drawer ────────────────────────────────────────────────────────── */
function MobileDrawer({
  navGroups, pathname, user, onLogout, onClose,
}: {
  navGroups: NavGroup[]
  pathname: string
  user: UserInfo
  onLogout: () => void
  onClose: () => void
}) {
  const [openSection, setOpenSection] = useState<string | null>(null)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className="fixed left-0 top-0 z-[100] h-screen w-72 overflow-y-auto bg-white shadow-2xl lg:hidden">
        <TricolorBar />
        {/* Header */}
        <div className="flex items-center justify-between border-b border-separator-opaque px-4 py-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo src="/brand/logo.svg" alt="Logo" size="md" />
            <span className="text-[13px] font-bold text-label-primary">{user.name}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-label-secondary hover:bg-surface-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 py-3 space-y-0.5">
          {navGroups.map((group) => {
            const isOpen = openSection === group.heading
            const active = groupHasActive(pathname, group)

            if (group.items.length === 1) {
              const item = group.items[0]
              const itemActive = isActive(pathname, item.href)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors',
                    itemActive
                      ? 'font-semibold text-white'
                      : 'text-label-secondary hover:bg-surface-secondary hover:text-label-primary',
                  )}
                  style={itemActive ? { background: 'var(--primary, #000080)' } : {}}
                >
                  <span className={cn('flex-shrink-0', itemActive ? 'text-white' : 'text-label-tertiary')}>{item.icon}</span>
                  {item.label}
                </a>
              )
            }

            return (
              <div key={group.heading}>
                <button
                  type="button"
                  onClick={() => setOpenSection(isOpen ? null : group.heading)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors',
                    active
                      ? 'font-semibold text-[color:var(--primary,#000080)]'
                      : 'text-label-secondary hover:bg-surface-secondary hover:text-label-primary',
                  )}
                >
                  <span className={cn('flex-shrink-0', active ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary')}>{group.groupIcon}</span>
                  <span className="flex-1 text-left">{group.heading}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 flex-shrink-0 text-label-tertiary transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>
                {isOpen && (
                  <div className="mt-0.5 ml-3 space-y-0.5 border-l-2 border-separator-opaque pl-3">
                    {group.items.map((item) => {
                      const itemActive = isActive(pathname, item.href)
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors',
                            itemActive
                              ? 'font-semibold text-[color:var(--primary,#000080)]'
                              : 'text-label-tertiary hover:bg-surface-secondary hover:text-label-primary',
                          )}
                        >
                          <span className={cn('flex-shrink-0', itemActive ? 'text-[color:var(--primary,#000080)]' : 'text-label-quaternary')}>{item.icon}</span>
                          {item.label}
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-separator-opaque p-3 mt-4">
          <button
            type="button"
            onClick={() => { onClose(); onLogout() }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Main HeaderNav ───────────────────────────────────────────────────────── */
export function HeaderNav({
  navGroups,
  projectName,
  logoSrc,
  logoAlt,
  user,
  pathname,
  onLogout,
}: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const closeMenu = useCallback(() => {
    setOpenMenu(null)
    setMenuRect(null)
  }, [])

  // Close on route change
  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  const navPill = 'flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap'
  const navIdle = 'text-label-secondary hover:bg-black/[0.04] hover:text-label-primary'
  const navOn   = 'font-semibold text-[color:var(--primary,#000080)] bg-[color:var(--primary-soft,rgba(0,0,128,0.08))]'

  return (
    <>
      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-separator-opaque bg-white/95 shadow-sm backdrop-blur-sm lg:hidden">
        <TricolorBar />
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="md" />
            <span className="text-[13px] font-bold text-label-primary">{projectName}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-label-secondary hover:bg-surface-secondary transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <MobileDrawer
          navGroups={navGroups}
          pathname={pathname}
          user={user}
          onLogout={onLogout}
          onClose={() => setMobileOpen(false)}
        />
      )}

      {/* ── Desktop header bar ───────────────────────────────────────────── */}
      <header className="hidden lg:flex flex-col flex-shrink-0 sticky top-0 z-40 bg-white border-b border-separator-opaque shadow-sm">
        <TricolorBar />
        <div className="flex h-12 items-center gap-2 px-4">

          {/* Logo + brand */}
          <a
            href="/dashboard"
            className="group flex flex-shrink-0 items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 transition-all duration-200 hover:bg-black/[0.04] mr-1"
          >
            <span className="rounded-xl bg-white p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.05)_inset] ring-1 ring-black/[0.04] transition-all duration-200 group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.08),0_0_0_1px_rgba(var(--primary-rgb,0,0,128),0.25)]">
              <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="md" />
            </span>
            <span className="text-[14px] font-bold tracking-tight text-label-primary">{projectName}</span>
          </a>

          {/* Divider */}
          <div className="mx-1 h-6 w-px flex-shrink-0 bg-separator-opaque" aria-hidden />

          {/* Nav pills */}
          <nav className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navGroups.map((group) => {
                const GroupIcon = group.groupIcon

                if (group.items.length === 1) {
                  const item = group.items[0]
                  const active = isActive(pathname, item.href)
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={cn(navPill, active ? navOn : navIdle)}
                    >
                      <span className={cn('flex-shrink-0', active ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary')}>{item.icon}</span>
                      {item.label}
                    </a>
                  )
                }

                const menuOpen = openMenu === group.heading
                const active = groupHasActive(pathname, group)

                return (
                  <div key={group.heading} className="relative flex-shrink-0">
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) triggerRefs.current.set(group.heading, el)
                        else triggerRefs.current.delete(group.heading)
                      }}
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                      onClick={(e) => {
                        if (menuOpen) { closeMenu(); return }
                        const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                        setMenuRect({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 200) })
                        setOpenMenu(group.heading)
                      }}
                      onMouseEnter={(e) => {
                        if (openMenu && openMenu !== group.heading) {
                          const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                          setMenuRect({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 200) })
                          setOpenMenu(group.heading)
                        }
                      }}
                      className={cn(navPill, menuOpen || active ? navOn : navIdle)}
                    >
                      <span className={cn('flex-shrink-0', menuOpen || active ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary')}>{group.groupIcon}</span>
                      <span className="max-w-[8rem] truncate">{group.heading}</span>
                      <ChevronDown className={cn('h-3 w-3 flex-shrink-0 transition-transform duration-200', menuOpen ? 'rotate-180 text-[color:var(--primary,#000080)]' : 'text-label-tertiary')} />
                    </button>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Profile menu */}
          <div className="ml-2 flex-shrink-0">
            <ProfileMenu user={user} onLogout={onLogout} />
          </div>
        </div>
      </header>

      {/* Portaled dropdown */}
      {openMenu && menuRect && (() => {
        const group = navGroups.find((g) => g.heading === openMenu)
        if (!group) return null
        return (
          <DropdownMenu
            group={group}
            rect={menuRect}
            pathname={pathname}
            onClose={closeMenu}
          />
        )
      })()}
    </>
  )
}
