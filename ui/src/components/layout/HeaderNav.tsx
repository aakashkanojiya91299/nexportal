'use client'

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronRight, LogOut, Menu, Settings, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { BrandLogo } from './BrandLogo'
import { TricolorBar } from './TricolorBar'
import type { NavGroup, NavItem, UserInfo } from './types'

export interface HeaderNavProps {
  navGroups: NavGroup[]
  projectName: string
  logoSrc: string
  logoAlt?: string
  user: UserInfo
  pathname: string
  onLogout: () => void
  /**
   * If provided, a settings gear icon is shown on the right side of the header
   * and is highlighted when the current pathname starts with this href.
   */
  configHref?: string
  /** Label/tooltip for the settings icon (default: "Settings") */
  configLabel?: string
  /** href for the Settings item in the profile dropdown (default: /dashboard/settings) */
  settingsHref?: string
  /** Client-side navigation — pass `router.push` from Next.js to avoid full page reloads */
  onNavigate?: (href: string) => void
  /** Applied to the desktop sticky header wrapper */
  className?: string
  /** Applied to the desktop sticky header wrapper */
  style?: React.CSSProperties
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

function groupHasActive(pathname: string, group: NavGroup): boolean {
  return group.items.some((item) => isActive(pathname, item.href))
}


/* ── Profile dropdown ─────────────────────────────────────────────────────── */
function ProfileMenu({
  user, onLogout, settingsHref = '/dashboard/settings', onNavigate,
}: {
  user: UserInfo
  onLogout: () => void
  settingsHref?: string
  onNavigate?: (href: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initials = user.name
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase() || user.name.slice(0, 2).toUpperCase()

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
      {/* Pill trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 rounded-full border bg-white px-2 py-1.5 shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          open
            ? 'border-[color:var(--primary,#000080)]/20 ring-1 ring-[color:var(--primary,#000080)]/10 shadow-md'
            : 'border-black/[0.08] hover:border-[color:var(--primary,#000080)]/15 hover:shadow-md',
        )}
      >
        {/* Saffron gradient avatar — matches reference exactly */}
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold shadow-inner ring-2 ring-white select-none"
          style={{
            background: 'linear-gradient(135deg, var(--accent, #FF9933) 0%, color-mix(in srgb, var(--accent, #FF9933) 70%, #ffb347) 100%)',
            color: 'var(--primary, #000080)',
          }}
        >
          {initials}
        </div>
        <div className="hidden text-left xl:block">
          <p className="max-w-[9rem] truncate text-[12px] font-semibold leading-tight text-label-primary">
            {user.name}
          </p>
          <p className="max-w-[9rem] truncate text-[10px] font-medium leading-tight text-label-tertiary capitalize">
            {user.role}
          </p>
        </div>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 flex-shrink-0 text-label-tertiary transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[190px] w-max max-w-[260px] overflow-hidden rounded-xl border border-black/[0.08] animate-slide-up"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
            boxShadow: '0 20px 48px -12px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.9) inset',
          }}
        >
          {/* Header — gradient matches reference */}
          <div
            className="border-b border-black/[0.06] px-4 py-3"
            style={{ background: 'linear-gradient(90deg, #ffffff, #fafbfc, color-mix(in srgb, var(--accent,#FF9933) 6%, transparent))' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-md ring-2 ring-white select-none"
                style={{ background: 'var(--primary, #000080)' }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-label-primary leading-tight">{user.name}</p>
                <p className="truncate text-[11px] text-label-tertiary mt-0.5 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <a
              href={settingsHref}
              onClick={(e) => { setOpen(false); if (onNavigate) { e.preventDefault(); onNavigate(settingsHref) } }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-label-primary transition-colors hover:bg-[color:var(--primary,#000080)]/[0.06] hover:text-[color:var(--primary,#000080)]"
            >
              <Settings className="h-4 w-4 flex-shrink-0 text-label-tertiary" />
              Settings
            </a>
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout() }}
              className="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
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

/* ── Portaled dropdown ────────────────────────────────────────────────────── */
interface DropdownMenuProps {
  group: NavGroup
  rect: { top: number; left: number; width: number }
  pathname: string
  onClose: () => void
  onNavigate?: (href: string) => void
}

function DropdownMenu({ group, rect, pathname, onClose, onNavigate }: DropdownMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const flyoutPanelRef = useRef<HTMLDivElement>(null)
  const [flyoutItem, setFlyoutItem] = useState<NavItem | null>(null)
  const [flyoutRect, setFlyoutRect] = useState<{ top: number; left: number } | null>(null)
  const flyoutCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openFlyout = useCallback((triggerEl: HTMLElement, item: NavItem) => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current)
    const mainRect = ref.current?.getBoundingClientRect()
    const r = triggerEl.getBoundingClientRect()
    setFlyoutRect({ top: r.top, left: (mainRect?.right ?? r.right) + 4 })
    setFlyoutItem(item)
  }, [])

  const scheduleFlyoutClose = useCallback(() => {
    flyoutCloseTimer.current = setTimeout(() => {
      setFlyoutItem(null)
      setFlyoutRect(null)
    }, 140)
  }, [])

  const cancelFlyoutClose = useCallback(() => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current)
  }, [])

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const target = e.target as Node
      const inMain = ref.current?.contains(target)
      const inFlyout = flyoutPanelRef.current?.contains(target)
      if (!inMain && !inFlyout) onClose()
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (flyoutItem) { setFlyoutItem(null); setFlyoutRect(null) }
        else onClose()
      }
    }
    document.addEventListener('mousedown', onOutside)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onOutside)
      document.removeEventListener('keydown', onEsc)
    }
  }, [onClose, flyoutItem])

  useEffect(() => () => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current)
  }, [])

  if (typeof document === 'undefined') return null

  const winW = typeof window !== 'undefined' ? window.innerWidth : 1200

  return (
    <>
      {createPortal(
        <div
          ref={ref}
          className="fixed z-[200] overflow-hidden rounded-xl border border-black/[0.08] bg-white animate-slide-up"
          style={{
            top: rect.top,
            left: Math.max(8, Math.min(rect.left, winW - 252)),
            width: 236,
            boxShadow: '0 20px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.9) inset',
          }}
          role="menu"
        >
          {/* Left accent bar */}
          <div
            className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl"
            style={{ background: 'linear-gradient(to bottom, var(--accent,#FF9933), color-mix(in srgb, var(--accent,#FF9933) 60%, transparent), transparent)' }}
          />

          <div className="px-3 pt-2.5 pb-1.5 pl-5">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-label-tertiary">{group.heading}</p>
          </div>

          <div className="px-2 pb-2">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href)
              const hasSub = !!(item.subItems && item.subItems.length > 0)
              const isFlyoutOpen = flyoutItem?.href === item.href

              if (hasSub) {
                return (
                  <div
                    key={item.href}
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={isFlyoutOpen}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 pl-3 text-[12px] font-medium transition-all duration-150 select-none',
                      isFlyoutOpen || active
                        ? 'bg-[color:var(--primary,#000080)]/[0.08] text-[color:var(--primary,#000080)]'
                        : 'text-label-primary hover:bg-[color:var(--primary,#000080)]/[0.08] hover:text-[color:var(--primary,#000080)]',
                    )}
                    onMouseEnter={(e) => openFlyout(e.currentTarget, item)}
                    onMouseLeave={scheduleFlyoutClose}
                  >
                    {item.icon && (
                      <span className={cn(
                        'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md',
                        isFlyoutOpen || active
                          ? 'bg-[color:var(--primary,#000080)]/[0.1] text-[color:var(--primary,#000080)]'
                          : 'bg-[color:var(--primary,#000080)]/[0.06] text-[color:var(--primary,#000080)]/70',
                      )}>
                        {item.icon}
                      </span>
                    )}
                    <span className="flex-1 truncate">{item.label}</span>
                    <ChevronRight className={cn(
                      'h-3.5 w-3.5 flex-shrink-0 transition-colors',
                      isFlyoutOpen ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary',
                    )} />
                  </div>
                )
              }

              return (
                <a
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={(e) => { onClose(); if (onNavigate) { e.preventDefault(); onNavigate(item.href) } }}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 pl-3 text-[12px] font-medium transition-all duration-150',
                    active
                      ? 'bg-[color:var(--primary,#000080)] text-white shadow-[0_4px_14px_-4px_rgba(0,0,128,0.3)]'
                      : 'text-label-primary hover:bg-[color:var(--primary,#000080)]/[0.08] hover:text-[color:var(--primary,#000080)]',
                  )}
                >
                  {item.icon && (
                    <span className={cn(
                      'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md',
                      active ? 'bg-white/20 text-white' : 'bg-[color:var(--primary,#000080)]/[0.06] text-[color:var(--primary,#000080)]/70',
                    )}>
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-white/70" />}
                </a>
              )
            })}
          </div>
        </div>,
        document.body,
      )}

      {/* Flyout sub-panel */}
      {flyoutItem && flyoutRect && createPortal(
        <div
          ref={flyoutPanelRef}
          className="fixed z-[201] overflow-hidden rounded-xl border border-black/[0.08] bg-white animate-slide-up"
          style={{
            top: flyoutRect.top,
            left: Math.max(8, Math.min(flyoutRect.left, winW - 240)),
            width: 220,
            boxShadow: '0 20px 50px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.9) inset',
          }}
          onMouseEnter={cancelFlyoutClose}
          onMouseLeave={scheduleFlyoutClose}
        >
          {/* Saffron top accent */}
          <div
            className="h-[3px] w-full"
            style={{ background: 'linear-gradient(90deg, var(--accent,#FF9933), color-mix(in srgb, var(--accent,#FF9933) 50%, transparent))' }}
          />
          <div className="px-3 pt-2 pb-1.5">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-label-tertiary">{flyoutItem.label}</p>
          </div>
          <div className="px-2 pb-2">
            {flyoutItem.subItems?.map((sub) => {
              const active = isActive(pathname, sub.href)
              return (
                <a
                  key={sub.href}
                  href={sub.href}
                  role="menuitem"
                  onClick={(e) => {
                    setFlyoutItem(null); setFlyoutRect(null); onClose()
                    if (onNavigate) { e.preventDefault(); onNavigate(sub.href) }
                  }}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 pl-3 text-[12px] font-medium transition-all duration-150',
                    active
                      ? 'bg-[color:var(--primary,#000080)] text-white shadow-[0_4px_14px_-4px_rgba(0,0,128,0.3)]'
                      : 'text-label-primary hover:bg-[color:var(--primary,#000080)]/[0.08] hover:text-[color:var(--primary,#000080)]',
                  )}
                >
                  {sub.icon && (
                    <span className={cn(
                      'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md',
                      active ? 'bg-white/20 text-white' : 'bg-[color:var(--primary,#000080)]/[0.06] text-[color:var(--primary,#000080)]/70',
                    )}>
                      {sub.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{sub.label}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-white/70" />}
                </a>
              )
            })}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

/* ── Mobile drawer ────────────────────────────────────────────────────────── */
function MobileDrawer({
  navGroups, pathname, user, onLogout, onClose, onNavigate, logoSrc, logoAlt, projectName,
}: {
  navGroups: NavGroup[]
  pathname: string
  user: UserInfo
  onLogout: () => void
  onClose: () => void
  onNavigate?: (href: string) => void
  logoSrc: string
  logoAlt?: string
  projectName: string
}) {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [openSubItem, setOpenSubItem] = useState<string | null>(null)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className="fixed left-0 top-0 z-[100] h-screen w-72 overflow-y-auto bg-white shadow-2xl lg:hidden flex flex-col">
        <TricolorBar animated shimmer />
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-separator-opaque px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span
              className="rounded-xl bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04]"
            >
              <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="md" />
            </span>
            <span className="text-[13px] font-bold tracking-tight text-[color:var(--primary,#000080)]">
              {projectName}
            </span>
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
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {navGroups.map((group) => {
            const isOpen = openSection === group.heading
            const active = groupHasActive(pathname, group)

            if (group.items.length === 1) {
              const item = group.items[0]
              const itemActive = isActive(pathname, item.href)
              const hasSub = !!(item.subItems && item.subItems.length > 0)
              const subOpen = openSubItem === item.href
              return (
                <div key={item.href}>
                  {hasSub ? (
                    <button
                      type="button"
                      onClick={() => setOpenSubItem(subOpen ? null : item.href)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors',
                        itemActive || subOpen
                          ? 'font-semibold text-[color:var(--primary,#000080)]'
                          : 'text-label-secondary hover:bg-surface-secondary hover:text-label-primary',
                      )}
                    >
                      <span className={cn('flex-shrink-0', itemActive || subOpen ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary')}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown className={cn('h-3.5 w-3.5 flex-shrink-0 text-label-tertiary transition-transform duration-200', subOpen && 'rotate-180')} />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => { onClose(); if (onNavigate) { e.preventDefault(); onNavigate(item.href) } }}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                        itemActive
                          ? 'font-semibold text-white shadow-[0_4px_12px_-2px_rgba(0,0,128,0.3)]'
                          : 'text-label-secondary hover:bg-surface-secondary hover:text-label-primary',
                      )}
                      style={itemActive ? {
                        background: 'linear-gradient(135deg, var(--primary, #000080) 0%, color-mix(in srgb, var(--primary, #000080) 80%, var(--accent, #FF9933)) 100%)',
                      } : {}}
                    >
                      <span className={cn('flex-shrink-0', itemActive ? 'text-white' : 'text-label-tertiary')}>
                        {item.icon}
                      </span>
                      {item.label}
                    </a>
                  )}
                  {hasSub && subOpen && (
                    <div
                      className="mt-0.5 ml-3 space-y-0.5 pl-3"
                      style={{ borderLeft: '2px solid color-mix(in srgb, var(--primary,#000080) 20%, transparent)' }}
                    >
                      {item.subItems!.map((sub) => {
                        const subActive = isActive(pathname, sub.href)
                        return (
                          <a
                            key={sub.href}
                            href={sub.href}
                            onClick={(e) => { onClose(); if (onNavigate) { e.preventDefault(); onNavigate(sub.href) } }}
                            className={cn(
                              'flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors',
                              subActive
                                ? 'font-semibold text-[color:var(--primary,#000080)]'
                                : 'text-label-tertiary hover:bg-surface-secondary hover:text-label-primary',
                            )}
                          >
                            <span className={cn('flex-shrink-0', subActive ? 'text-[color:var(--primary,#000080)]' : 'text-label-quaternary')}>
                              {sub.icon}
                            </span>
                            {sub.label}
                            {subActive && <ChevronRight className="ml-auto h-3 w-3 flex-shrink-0 text-[color:var(--primary,#000080)]/60" />}
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
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
                  <span className={cn('flex-shrink-0', active ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary')}>
                    {group.groupIcon}
                  </span>
                  <span className="flex-1 text-left">{group.heading}</span>
                  <ChevronDown
                    className={cn('h-3.5 w-3.5 flex-shrink-0 text-label-tertiary transition-transform duration-200', isOpen && 'rotate-180')}
                  />
                </button>
                {isOpen && (
                  <div
                    className="mt-0.5 ml-3 space-y-0.5 pl-3"
                    style={{ borderLeft: '2px solid color-mix(in srgb, var(--accent,#FF9933) 35%, transparent)' }}
                  >
                    {group.items.map((item) => {
                      const itemActive = isActive(pathname, item.href)
                      const hasSub = !!(item.subItems && item.subItems.length > 0)
                      const subOpen = openSubItem === item.href
                      return (
                        <div key={item.href}>
                          {hasSub ? (
                            <button
                              type="button"
                              onClick={() => setOpenSubItem(subOpen ? null : item.href)}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors',
                                itemActive || subOpen
                                  ? 'font-semibold text-[color:var(--primary,#000080)]'
                                  : 'text-label-tertiary hover:bg-surface-secondary hover:text-label-primary',
                              )}
                            >
                              <span className={cn('flex-shrink-0', itemActive || subOpen ? 'text-[color:var(--primary,#000080)]' : 'text-label-quaternary')}>
                                {item.icon}
                              </span>
                              <span className="flex-1 text-left">{item.label}</span>
                              <ChevronDown className={cn('h-3.5 w-3.5 flex-shrink-0 text-label-tertiary/60 transition-transform duration-200', subOpen && 'rotate-180')} />
                            </button>
                          ) : (
                            <a
                              href={item.href}
                              onClick={(e) => { onClose(); if (onNavigate) { e.preventDefault(); onNavigate(item.href) } }}
                              className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors',
                                itemActive
                                  ? 'font-semibold text-[color:var(--primary,#000080)]'
                                  : 'text-label-tertiary hover:bg-surface-secondary hover:text-label-primary',
                              )}
                            >
                              <span className={cn('flex-shrink-0', itemActive ? 'text-[color:var(--primary,#000080)]' : 'text-label-quaternary')}>
                                {item.icon}
                              </span>
                              {item.label}
                              {itemActive && <ChevronRight className="ml-auto h-3 w-3 flex-shrink-0 text-[color:var(--primary,#000080)]/60" />}
                            </a>
                          )}
                          {hasSub && subOpen && (
                            <div
                              className="mt-0.5 ml-3 space-y-0.5 pl-3"
                              style={{ borderLeft: '2px solid color-mix(in srgb, var(--primary,#000080) 15%, transparent)' }}
                            >
                              {item.subItems!.map((sub) => {
                                const subActive = isActive(pathname, sub.href)
                                return (
                                  <a
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={(e) => { onClose(); if (onNavigate) { e.preventDefault(); onNavigate(sub.href) } }}
                                    className={cn(
                                      'flex items-center gap-3 rounded-xl px-3 py-1.5 text-[12px] font-medium transition-colors',
                                      subActive
                                        ? 'font-semibold text-[color:var(--primary,#000080)]'
                                        : 'text-label-quaternary hover:bg-surface-secondary hover:text-label-primary',
                                    )}
                                  >
                                    <span className={cn('flex-shrink-0', subActive ? 'text-[color:var(--primary,#000080)]' : 'text-label-quaternary/70')}>
                                      {sub.icon}
                                    </span>
                                    {sub.label}
                                    {subActive && <ChevronRight className="ml-auto h-3 w-3 flex-shrink-0 text-[color:var(--primary,#000080)]/60" />}
                                  </a>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-separator-opaque p-3">
          <button
            type="button"
            onClick={() => { onClose(); onLogout() }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
        <TricolorBar />
      </div>
    </>
  )
}

/* ── HeaderNav ────────────────────────────────────────────────────────────── */
export function HeaderNav({
  navGroups,
  projectName,
  logoSrc,
  logoAlt,
  user,
  pathname,
  onLogout,
  configHref,
  configLabel = 'Settings',
  settingsHref = '/dashboard/settings',
  onNavigate,
  className,
  style,
}: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const closeMenu = useCallback(() => {
    setOpenMenu(null)
    setMenuRect(null)
  }, [])

  // Sync menuRect on scroll/resize while open
  useLayoutEffect(() => {
    if (!openMenu) { setMenuRect(null); return }
    const update = () => {
      const el = triggerRefs.current.get(openMenu)
      if (!el) return
      const r = el.getBoundingClientRect()
      setMenuRect({ top: r.bottom + 8, left: r.left, width: Math.max(r.width, 232) })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [openMenu])

  // Lock body scroll while a dropdown is open (prevents scrollbar jump + scroll-behind)
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (openMenu) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : ''
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [openMenu])

  // Close on route change
  useEffect(() => { closeMenu() }, [pathname, closeMenu])

  const configActive = configHref ? pathname.startsWith(configHref) : false

  // Nav pill styles — exact match with reference
  const navPill =
    'flex flex-shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#FF9933)]/70 focus-visible:ring-offset-2'
  const navIdle =
    'text-label-secondary hover:bg-[color:var(--primary,#000080)]/[0.08] hover:text-[color:var(--primary,#000080)] ring-1 ring-transparent hover:ring-[color:var(--primary,#000080)]/20'
  const navOn =
    'bg-[color:var(--primary,#000080)]/[0.22] text-[color:var(--primary,#000080)] font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[color:var(--primary,#000080)]/35'

  return (
    <>
      {/* ── Mobile top bar ───────────────────────────────────────────────── */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-separator-opaque bg-white/95 shadow-sm backdrop-blur-sm lg:hidden">
        <TricolorBar animated shimmer />
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="md" />
            <span className="text-[13px] font-bold tracking-tight text-[color:var(--primary,#000080)]">{projectName}</span>
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
          onNavigate={onNavigate}
          logoSrc={logoSrc}
          logoAlt={logoAlt}
          projectName={projectName}
        />
      )}

      {/* ── Desktop header ───────────────────────────────────────────────── */}
      <header
        className={cn('relative z-40 hidden flex-shrink-0 flex-col lg:flex', className)}
        style={style}
      >
        {/* Main bar — layered radial gradient background matching reference */}
        <div
          className="flex h-[3.25rem] items-center gap-2 border-b border-black/[0.06] px-5 sm:px-6"
          style={{
            background: [
              'radial-gradient(ellipse 120% 160% at 50% -40%, #ffffff 0%, transparent 55%)',
              'radial-gradient(ellipse 80% 100% at 100% 50%, rgba(255,255,255,0.9), transparent 45%)',
              'radial-gradient(ellipse 60% 80% at 0% 100%, color-mix(in srgb, var(--accent,#FF9933) 6%, transparent), transparent 50%)',
              'linear-gradient(180deg, #ffffff 0%, #fafafa 45%, #f3f4f6 100%)',
            ].join(', '),
            boxShadow: 'inset 0 1px 0 #ffffff, inset 0 -1px 0 rgba(0,0,0,0.04), 0 4px 24px -8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Logo + brand */}
          <a
            href="/dashboard"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('/dashboard') } }}
            className="group flex flex-shrink-0 items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 transition-all duration-200 hover:bg-white/80"
          >
            <span
              className="rounded-xl bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04] transition-[box-shadow] duration-200 group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,153,51,0.25)]"
            >
              <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="sm" />
            </span>
            <span className="text-[13px] font-bold tracking-tight text-[color:var(--primary,#000080)]">
              {projectName}
            </span>
          </a>

          {/* Divider */}
          <div
            className="mx-0.5 h-7 w-px flex-shrink-0"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1), transparent)' }}
            aria-hidden
          />

          {/* Nav pills */}
          <nav className="flex min-w-0 flex-1 items-center">
            <div className="flex min-h-0 min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {navGroups.map((group) => {
                if (group.items.length === 1) {
                  const item = group.items[0]
                  const active = isActive(pathname, item.href)
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(item.href) } }}
                      className={cn(navPill, active ? navOn : navIdle)}
                    >
                      <span
                        className={cn(
                          'flex-shrink-0',
                          active ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary',
                        )}
                      >
                        {item.icon}
                      </span>
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
                        setMenuRect({ top: r.bottom + 8, left: r.left, width: Math.max(r.width, 232) })
                        setOpenMenu(group.heading)
                      }}
                      onMouseEnter={(e) => {
                        if (openMenu && openMenu !== group.heading) {
                          const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
                          setMenuRect({ top: r.bottom + 8, left: r.left, width: Math.max(r.width, 232) })
                          setOpenMenu(group.heading)
                        }
                      }}
                      className={cn(navPill, menuOpen || active ? navOn : navIdle)}
                    >
                      <span
                        className={cn(
                          'flex-shrink-0 h-3.5 w-3.5',
                          menuOpen || active ? 'text-[color:var(--primary,#000080)]' : 'text-label-tertiary',
                        )}
                      >
                        {group.groupIcon}
                      </span>
                      <span className="max-w-[10rem] truncate">{group.heading}</span>
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 flex-shrink-0 transition-transform duration-200',
                          menuOpen || active ? 'text-[color:var(--primary,#000080)]/70' : 'text-label-tertiary',
                          menuOpen && 'rotate-180',
                        )}
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Right controls */}
          <div className="ml-1 flex flex-shrink-0 items-center gap-2 border-l border-black/[0.08] pl-3">
            {/* Optional settings/config icon */}
            {configHref && (
              <a
                href={configHref}
                title={configLabel}
                aria-label={configLabel}
                onClick={(e) => { if (onNavigate && configHref) { e.preventDefault(); onNavigate(configHref) } }}
                className={cn(
                  'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  configActive
                    ? 'border-[color:var(--primary,#000080)]/25 text-[color:var(--primary,#000080)] shadow-[0_2px_10px_-2px_rgba(0,0,128,0.25)] ring-1 ring-[color:var(--primary,#000080)]/15'
                    : 'border-black/[0.08] text-label-secondary hover:border-[color:var(--primary,#000080)]/20 hover:text-[color:var(--primary,#000080)] hover:shadow-md',
                )}
              >
                <Settings
                  className={cn('h-4 w-4 flex-shrink-0', configActive && 'text-[color:var(--primary,#000080)]')}
                  strokeWidth={configActive ? 2.25 : 2}
                  aria-hidden
                />
              </a>
            )}

            {/* Profile */}
            <ProfileMenu
              user={user}
              onLogout={onLogout}
              settingsHref={settingsHref}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        {/* TricolorBar at the bottom of header — matching reference exactly */}
        <TricolorBar animated shimmer />
      </header>

      {/* Dark frosted overlay when any nav dropdown is open */}
      {openMenu !== null && typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className="fixed left-0 right-0 bottom-0"
            style={{
              top: '3.25rem',
              zIndex: 190,
              background: 'rgba(0,0,0,0.42)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              animation: 'fadeIn 200ms cubic-bezier(0.22,1,0.36,1) forwards',
            }}
          />,
          document.body,
        )}

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
            onNavigate={onNavigate}
          />
        )
      })()}
    </>
  )
}
