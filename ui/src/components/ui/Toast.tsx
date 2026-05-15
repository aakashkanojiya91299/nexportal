'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  dismiss: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  error: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
}

function ToastComponent({
  item,
  onDismiss,
}: {
  item: ToastItem
  onDismiss: (id: string) => void
}) {
  const variant = item.variant ?? 'info'
  const cfg = variantConfig[variant]

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-lg min-w-[280px] max-w-sm',
        cfg.bg,
        cfg.border,
      )}
      style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
    >
      <span className={cn('flex-shrink-0 mt-0.5', cfg.color)}>{cfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-callout font-semibold text-label-primary leading-tight">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 text-[12px] text-label-secondary">{item.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="flex-shrink-0 p-0.5 rounded text-label-tertiary hover:text-label-primary transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [mounted, setMounted] = useState(false)
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => { setMounted(true) }, [])

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const duration = item.duration ?? 4000
      setToasts((prev) => [...prev, { ...item, id }])
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-2 items-end">
            {toasts.map((item) => (
              <ToastComponent key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}
