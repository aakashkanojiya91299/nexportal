'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle, Award, Bell, Check, CheckCheck,
  Clock, FileText, X,
} from 'lucide-react'

export interface NotificationItem {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  linkUrl?: string
}

export interface NotificationBellProps {
  /** GET endpoint that returns NotificationItem[] (or { items: [...] } / { notifications: [...] }) */
  apiEndpoint: string
  /** Called when a notification with a linkUrl is clicked */
  onNavigate?: (url: string) => void
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(diff / 3600000)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(diff / 86400000)
  if (d < 7)  return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function iconForType(type: string) {
  if (type.endsWith('.approved') || type.endsWith('.renewed') || type.endsWith('.issued'))
    return <Check className="w-4 h-4 text-emerald-600" />
  if (type.endsWith('.rejected') || type.endsWith('.revoked'))
    return <X className="w-4 h-4 text-red-600" />
  if (type.includes('.renewal_'))
    return <Clock className="w-4 h-4 text-amber-600" />
  if (type.includes('.award.'))
    return <Award className="w-4 h-4" style={{ color: 'var(--accent, #FF9933)' }} />
  if (type.includes('course'))
    return <FileText className="w-4 h-4 text-sky-600" />
  if (type.startsWith('admin.'))
    return <AlertCircle className="w-4 h-4" style={{ color: 'var(--primary, #000080)' }} />
  return <Bell className="w-4 h-4 text-gray-500" />
}

export function NotificationBell({ apiEndpoint, onNavigate }: NotificationBellProps) {
  const [isOpen,    setIsOpen]    = useState(false)
  const [items,     setItems]     = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; maxHeight: number } | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef    = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const unreadCount = items.filter(n => !n.isRead).length

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(apiEndpoint, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : (data.items ?? data.notifications ?? []))
      }
    } catch { /* silent */ }
    finally { setIsLoading(false) }
  }, [apiEndpoint])

  useEffect(() => { fetchItems() }, [fetchItems])

  // Outside-click closes dropdown
  useEffect(() => {
    if (!isOpen) return
    function onDown(e: MouseEvent) {
      const t = e.target as Node
      if (!wrapperRef.current?.contains(t) && !menuRef.current?.contains(t)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [isOpen])

  // Smart dropdown positioning
  useEffect(() => {
    if (!isOpen) return
    const update = () => {
      if (!triggerRef.current) return
      const r = triggerRef.current.getBoundingClientRect()
      const w = Math.min(340, window.innerWidth - 16)
      const spaceBelow = window.innerHeight - r.bottom - 8
      const spaceAbove = r.top - 8
      const openDown = spaceBelow >= 300 || spaceBelow >= spaceAbove
      const top = openDown
        ? r.bottom + 6
        : r.top - Math.min(460, spaceAbove) - 6
      const left      = Math.max(8, Math.min(r.right - w, window.innerWidth - w - 8))
      const maxHeight = openDown ? Math.min(460, spaceBelow) : Math.min(460, spaceAbove)
      setMenuStyle({ top, left, maxHeight })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [isOpen])

  const handleItemClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      setItems(prev => prev.map(i => i.id === n.id ? { ...i, isRead: true } : i))
      try { await fetch(`${apiEndpoint}/${n.id}/read`, { method: 'PATCH', credentials: 'include' }) } catch {}
    }
    setIsOpen(false)
    if (n.linkUrl) {
      if (onNavigate) onNavigate(n.linkUrl)
      else window.location.href = n.linkUrl
    }
  }

  const handleMarkAllRead = async () => {
    setItems(prev => prev.map(n => ({ ...n, isRead: true })))
    try { await fetch(`${apiEndpoint}/read-all`, { method: 'PATCH', credentials: 'include' }) } catch {}
  }

  const handleDismiss = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setItems(prev => prev.filter(n => n.id !== id))
    try { await fetch(`${apiEndpoint}/${id}`, { method: 'DELETE', credentials: 'include' }) } catch {}
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(v => !v)}
        className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && menuStyle && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: menuStyle.top,
            left: menuStyle.left,
            width: Math.min(340, window.innerWidth - 16),
            zIndex: 200000,
          }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <TricolorAccent />

          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs hover:underline flex items-center gap-1"
                style={{ color: 'var(--accent, #FF9933)' }}
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: Math.max(220, menuStyle.maxHeight - 80), overflowY: 'auto' }}>
            {isLoading && items.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-gray-500">Loading…</div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {items.slice(0, 20).map(n => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -96 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className={`relative border-b border-gray-50 overflow-hidden ${!n.isRead ? 'bg-blue-50/50' : 'bg-white'}`}
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick(n)}
                      className="w-full text-left px-4 py-3 pr-10 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">{iconForType(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm text-gray-900 ${!n.isRead ? 'font-medium' : ''}`}>{n.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-[11px] text-gray-400">{formatTimeAgo(n.createdAt)}</span>
                          </div>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={e => handleDismiss(e, n.id)}
                      className="absolute right-2 top-3 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {items.length > 20 && (
            <div className="px-4 py-2 border-t border-gray-100 text-center">
              <span className="text-xs text-gray-500">Showing latest 20 of {items.length}</span>
            </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}

function TricolorAccent() {
  return (
    <div
      style={{
        height: 3,
        background: 'linear-gradient(90deg, #FF9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%)',
      }}
    />
  )
}
