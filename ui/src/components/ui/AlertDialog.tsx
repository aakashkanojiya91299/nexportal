'use client'

/**
 * AlertDialog — composable destructive-confirmation dialog.
 *
 * Identical API to shadcn/ui AlertDialog.
 * Built on top of the existing DialogRoot / DialogContent primitives
 * so theming, animations, and portal behaviour are inherited automatically.
 *
 * Usage:
 *   <AlertDialog>
 *     <AlertDialogTrigger asChild><Button variant="danger">Delete</Button></AlertDialogTrigger>
 *     <AlertDialogContent>
 *       <AlertDialogHeader>
 *         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
 *         <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
 *       </AlertDialogHeader>
 *       <AlertDialogFooter>
 *         <AlertDialogCancel>Cancel</AlertDialogCancel>
 *         <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
 *       </AlertDialogFooter>
 *     </AlertDialogContent>
 *   </AlertDialog>
 */

import React, { type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  type DialogRootProps,
  type DialogTriggerProps,
  type DialogContentProps,
} from './Dialog'

// ─── Root (re-exports DialogRoot) ─────────────────────────────────────────────

export type AlertDialogProps = DialogRootProps
export const AlertDialog = DialogRoot

// ─── Trigger (re-exports DialogTrigger) ──────────────────────────────────────

export type AlertDialogTriggerProps = DialogTriggerProps
export const AlertDialogTrigger = DialogTrigger

// ─── Content ─────────────────────────────────────────────────────────────────

export interface AlertDialogContentProps extends Omit<DialogContentProps, 'size'> {
  children: ReactNode
  className?: string
}

export function AlertDialogContent({ children, className, ...props }: AlertDialogContentProps) {
  return (
    <DialogContent
      size="sm"
      hideCloseButton
      className={cn('gap-0', className)}
      {...props}
    >
      {children}
    </DialogContent>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export interface AlertDialogHeaderProps { children: ReactNode; className?: string }
export function AlertDialogHeader({ children, className }: AlertDialogHeaderProps) {
  return (
    <DialogHeader className={cn('border-none pb-0', className)}>
      {children}
    </DialogHeader>
  )
}

// ─── Title ────────────────────────────────────────────────────────────────────

export interface AlertDialogTitleProps { children: ReactNode; className?: string }
export function AlertDialogTitle({ children, className }: AlertDialogTitleProps) {
  return <DialogTitle className={className}>{children}</DialogTitle>
}

// ─── Description ──────────────────────────────────────────────────────────────

export interface AlertDialogDescriptionProps { children: ReactNode; className?: string }
export function AlertDialogDescription({ children, className }: AlertDialogDescriptionProps) {
  return <DialogDescription className={cn('mt-1.5 px-6 pb-4', className)}>{children}</DialogDescription>
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export interface AlertDialogFooterProps { children: ReactNode; className?: string }
export function AlertDialogFooter({ children, className }: AlertDialogFooterProps) {
  return <DialogFooter className={className}>{children}</DialogFooter>
}

// ─── Action (confirm button — renders a button that does NOT auto-close) ──────

export interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

export function AlertDialogAction({ children, className, ...props }: AlertDialogActionProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-[13px] font-medium',
        'bg-red-500 text-white hover:bg-red-600 transition-colors',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Cancel (close button) ────────────────────────────────────────────────────

export interface AlertDialogCancelProps {
  children: ReactNode
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export function AlertDialogCancel({ children, className, onClick }: AlertDialogCancelProps) {
  return (
    <DialogClose asChild>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center justify-center rounded-lg px-4 py-2 text-[13px] font-medium',
          'border border-separator-opaque bg-white text-label-primary hover:bg-fill-secondary transition-colors',
          'disabled:opacity-50 disabled:pointer-events-none',
          className,
        )}
      >
        {children}
      </button>
    </DialogClose>
  )
}
