'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Bell, Check, CheckCheck, Info,
  AlertTriangle, CheckCircle, XCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/cn'

/* ──────────────── Types ─────────────────────────────────────────────────── */

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationItem {
  id: string
  title: string
  message?: string
  time: Date | string
  read: boolean
  type?: NotificationType
  href?: string
  /** URL for a small avatar image shown instead of the type icon */
  avatar?: string
}

export interface NotificationBellProps {
  notifications: NotificationItem[]
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
  onNotificationClick?: (item: NotificationItem) => void
  onViewAll?: () => void
  emptyMessage?: string
  title?: string
  /** Max items shown before "View all" footer (default 8) */
  maxVisible?: number
  className?: string
}

/* ──────────────── Helpers ───────────────────────────────────────────────── */

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  info:    <Info         className="w-3.5 h-3.5 text-blue-500" />,
  success: <CheckCircle  className="w-3.5 h-3.5 text-green-500" />,
  warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  error:   <XCircle      className="w-3.5 h-3.5 text-red-500" />,
}

const TYPE_BG: Record<NotificationType, string> = {
  info:    'bg-blue-100',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  error:   'bg-red-100',
}

const TYPE_DOT: Record<NotificationType, string> = {
  info:    'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
}

function TimeAgo({ time }: { time: Date | string }) {
  const d = typeof time === 'string' ? new Date(time) : time
  return <>{formatDistanceToNow(d, { addSuffix: true })}</>
}

/* ──────────────── NotificationBell ─────────────────────────────────────── */

export function NotificationBell({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
  onViewAll,
  emptyMessage = 'No notifications yet',
  title = 'Notifications',
  maxVisible = 8,
  className,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount    = notifications.filter(n => !n.read).length
  const visible        = notifications.slice(0, maxVisible)
  const hasMore        = notifications.length > maxVisible

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const handleItemClick = useCallback((item: NotificationItem) => {
    if (!item.read) onMarkRead?.(item.id)
    onNotificationClick?.(item)
    if (item.href) setOpen(false)
  }, [onMarkRead, onNotificationClick])

  return (
    <div ref={containerRef} className={cn('relative', className)}>

      {/* ── Bell button ── */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ ['--tw-ring-color' as string]: 'var(--primary, #000080)' }}
      >
        <motion.div
          animate={unreadCount > 0 && !open
            ? { rotate: [0, -14, 14, -9, 9, 0] }
            : { rotate: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <Bell className="w-5 h-5" />
        </motion.div>

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 leading-none select-none"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ── Dropdown panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit   ={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 z-[9999] overflow-hidden"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)' }}
          >

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{title}</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto overscroll-contain divide-y divide-gray-50">
              {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">{emptyMessage}</p>
                </div>
              ) : (
                visible.map(item => {
                  const t = item.type ?? 'info'
                  const itemContent = (
                    <>
                      {/* Icon / avatar */}
                      <div className="flex-shrink-0 mt-0.5">
                        {item.avatar ? (
                          <img src={item.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', TYPE_BG[t])}>
                            {TYPE_ICON[t]}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            'text-[13px] leading-snug',
                            item.read ? 'font-normal text-gray-700' : 'font-semibold text-gray-900',
                          )}>
                            {item.title}
                          </p>
                          {!item.read && (
                            <span className={cn('flex-shrink-0 w-2 h-2 rounded-full mt-1', TYPE_DOT[t])} />
                          )}
                        </div>
                        {item.message && (
                          <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2">{item.message}</p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1">
                          <TimeAgo time={item.time} />
                        </p>
                      </div>

                      {/* Per-item mark-read button */}
                      {!item.read && onMarkRead && (
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); e.preventDefault(); onMarkRead(item.id) }}
                          className="flex-shrink-0 self-center p-1 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
                          aria-label="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )

                  const rowClass = cn(
                    'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-100 focus:outline-none',
                    item.read ? 'bg-white hover:bg-gray-50 focus:bg-gray-50' : 'bg-blue-50/40 hover:bg-blue-50/70 focus:bg-blue-50/70',
                  )

                  return item.href ? (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleItemClick(item)}
                      className={rowClass}
                    >
                      {itemContent}
                    </a>
                  ) : (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleItemClick(item)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleItemClick(item) } }}
                      className={rowClass}
                    >
                      {itemContent}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {(onViewAll || hasMore) && (
              <div className="border-t border-gray-100 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => { onViewAll?.(); setOpen(false) }}
                  className="w-full text-center text-[12px] font-semibold py-0.5 transition-colors duration-150 focus:outline-none"
                  style={{ color: 'var(--primary, #000080)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--accent, #FF9933)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--primary, #000080)')}
                >
                  View all notifications
                  {hasMore && ` (${notifications.length - maxVisible} more)`}
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
