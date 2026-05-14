'use client'

import React, { useState } from 'react'
import { cn } from '../../lib/cn'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  shape?: 'circle' | 'square'
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-[13px]',
  lg: 'h-12 w-12 text-[15px]',
  xl: 'h-16 w-16 text-[18px]',
}

export function Avatar({ src, alt, name, size = 'md', shape = 'circle', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const initials = name
    ? name.split(' ').map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase()
    : '?'

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? 'avatar'}
        onError={() => setImgError(true)}
        className={cn('flex-shrink-0 object-cover', sizeClasses[size], shapeClass, className)}
      />
    )
  }

  return (
    <span
      className={cn(
        'flex flex-shrink-0 items-center justify-center font-bold text-white select-none',
        sizeClasses[size],
        shapeClass,
        className,
      )}
      style={{ background: 'var(--primary, #000080)' }}
      aria-label={name}
    >
      {initials}
    </span>
  )
}

export interface AvatarGroupProps {
  avatars: Pick<AvatarProps, 'src' | 'name' | 'alt'>[]
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarGroup({ avatars, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const extra = avatars.length - max

  return (
    <div className={cn('flex items-center', className)}>
      {visible.map((a, i) => (
        <div
          key={i}
          className="ring-2 ring-white -ml-2 first:ml-0"
          style={{ zIndex: visible.length - i }}
        >
          <Avatar {...a} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div
          className={cn(
            'ring-2 ring-white -ml-2 flex items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600',
            sizeClasses[size],
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}
