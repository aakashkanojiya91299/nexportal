'use client'

import React, {
  useEffect, useRef, useState, useCallback,
  createContext, useContext,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

// ─── Context ──────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogCtx() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog sub-components must be used inside <DialogRoot>')
  return ctx
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface DialogRootProps {
  /** Controlled open state */
  open?: boolean
  /** Initial open state (uncontrolled) */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function DialogRoot({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DialogRootProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen! : uncontrolled

  const handleChange = useCallback((next: boolean) => {
    if (!isControlled) setUncontrolled(next)
    onOpenChange?.(next)
  }, [isControlled, onOpenChange])

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleChange }}>
      {children}
    </DialogContext.Provider>
  )
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export interface DialogTriggerProps {
  children: ReactNode
  /** Pass true to forward click to the child element instead of wrapping */
  asChild?: boolean
}

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
  const { onOpenChange } = useDialogCtx()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as any).props?.onClick?.(e)
        onOpenChange(true)
      },
    })
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  )
}

// ─── Portal ───────────────────────────────────────────────────────────────────

export interface DialogPortalProps {
  children: ReactNode
  /** Custom mount container; defaults to document.body */
  container?: HTMLElement
}

export function DialogPortal({ children, container }: DialogPortalProps) {
  if (typeof document === 'undefined') return null
  return createPortal(children, container ?? document.body)
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-[200] bg-black/50 backdrop-blur-[2px]',
        className,
      )}
      {...props}
    />
  ),
)
DialogOverlay.displayName = 'DialogOverlay'

// ─── Content ──────────────────────────────────────────────────────────────────

const contentSizes = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  '2xl': 'max-w-4xl',
  full: 'max-w-none w-full',
}

export type DialogSize = keyof typeof contentSizes

export interface DialogContentProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  /** Preset max-width ('sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full') */
  size?: DialogSize
  /** True full-screen — no rounded corners, covers entire viewport */
  fullScreen?: boolean
  /** Hides the built-in × close button */
  hideCloseButton?: boolean
  /** Called on Escape key; call e.preventDefault() to stop the dialog closing */
  onEscapeKeyDown?: (e: KeyboardEvent) => void
  /** Called when clicking the overlay; return false to prevent close */
  onPointerDownOutside?: () => void
}

export function DialogContent({
  children,
  className,
  style,
  size = 'md',
  fullScreen = false,
  hideCloseButton = false,
  onEscapeKeyDown,
  onPointerDownOutside,
}: DialogContentProps) {
  const { open, onOpenChange } = useDialogCtx()
  const panelRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [rendered, setRendered] = useState(false)

  // Enter / exit animation lifecycle
  useEffect(() => {
    if (open) {
      setRendered(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      document.body.style.overflow = 'hidden'
    } else {
      setVisible(false)
      const t = setTimeout(() => {
        setRendered(false)
        document.body.style.overflow = ''
      }, 220)
      return () => clearTimeout(t)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      onEscapeKeyDown?.(e)
      if (!e.defaultPrevented) onOpenChange(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onOpenChange, onEscapeKeyDown])

  if (!rendered || typeof document === 'undefined') return null

  const isFS = fullScreen || size === 'full'

  return (
    <DialogPortal>
      {/* Overlay */}
      <DialogOverlay
        className={cn('transition-opacity duration-220', visible ? 'opacity-100' : 'opacity-0')}
        onClick={() => { onPointerDownOutside?.(); onOpenChange(false) }}
      />

      {/* Centering wrapper */}
      <div
        className={cn(
          'fixed z-[201]',
          isFS ? 'inset-0' : 'inset-0 flex items-center justify-center p-4',
        )}
        style={{ pointerEvents: 'none' }}
      >
        {/* Panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative flex flex-col bg-white pointer-events-auto',
            'transition-all duration-220 ease-out',
            isFS
              ? 'w-full h-full rounded-none'
              : cn('w-full rounded-2xl shadow-2xl max-h-[90vh]', contentSizes[size]),
            visible
              ? 'opacity-100 translate-y-0 scale-100'
              : isFS
                ? 'opacity-0 translate-y-6'
                : 'opacity-0 translate-y-3 scale-[0.97]',
            className,
          )}
          style={isFS ? style : { boxShadow: '0 24px 64px rgba(0,0,0,0.18)', ...style }}
        >
          {/* Built-in × button */}
          {!hideCloseButton && (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className={cn(
                'absolute top-4 right-4 z-10',
                'flex h-8 w-8 items-center justify-center rounded-lg',
                'text-label-tertiary hover:bg-surface-secondary hover:text-label-primary transition-colors',
              )}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {children}
        </div>
      </div>
    </DialogPortal>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export interface DialogHeaderProps {
  children: ReactNode
  className?: string
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 px-6 py-5 pr-14',
        'border-b border-separator-opaque flex-shrink-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── Title ────────────────────────────────────────────────────────────────────

export interface DialogTitleProps {
  children: ReactNode
  className?: string
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('text-subhead font-semibold text-label-primary leading-snug', className)}>
      {children}
    </h2>
  )
}

// ─── Description ──────────────────────────────────────────────────────────────

export interface DialogDescriptionProps {
  children: ReactNode
  className?: string
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn('text-[13px] text-label-tertiary leading-relaxed', className)}>
      {children}
    </p>
  )
}

// ─── Body (scrollable content area) ──────────────────────────────────────────

export interface DialogBodyProps {
  children: ReactNode
  className?: string
  /** Remove default padding */
  noPadding?: boolean
}

export function DialogBody({ children, className, noPadding }: DialogBodyProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto min-h-0', !noPadding && 'px-6 py-5', className)}>
      {children}
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export interface DialogFooterProps {
  children: ReactNode
  className?: string
  /** Left-align instead of right-align */
  align?: 'left' | 'right' | 'between'
}

export function DialogFooter({ children, className, align = 'right' }: DialogFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-6 py-4',
        'border-t border-separator-opaque flex-shrink-0 bg-surface-secondary/40 rounded-b-2xl',
        align === 'right'   && 'justify-end',
        align === 'left'    && 'justify-start',
        align === 'between' && 'justify-between',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── Close ────────────────────────────────────────────────────────────────────

export interface DialogCloseProps {
  children: ReactNode
  asChild?: boolean
}

export function DialogClose({ children, asChild }: DialogCloseProps) {
  const { onOpenChange } = useDialogCtx()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        ;(children as any).props?.onClick?.(e)
        onOpenChange(false)
      },
    })
  }

  return (
    <button type="button" onClick={() => onOpenChange(false)}>
      {children}
    </button>
  )
}

// ─── Backward-compatible all-in-one Dialog ────────────────────────────────────
// Keeps the original API (open / onClose / title / description / size / footer / children)
// so every existing usage continues to work without changes.

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  /** 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' */
  size?: DialogSize
  /** True full-screen overlay — no rounded corners */
  fullScreen?: boolean
  children?: ReactNode
  footer?: ReactNode
  hideCloseButton?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  fullScreen = false,
  children,
  footer,
  hideCloseButton,
  className,
  style,
}: DialogProps) {
  return (
    <DialogRoot open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent
        size={size}
        fullScreen={fullScreen}
        hideCloseButton={hideCloseButton}
        className={className}
        style={style}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children && <DialogBody>{children}</DialogBody>}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </DialogRoot>
  )
}
