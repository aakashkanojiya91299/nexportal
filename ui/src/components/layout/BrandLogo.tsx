'use client'

import React from 'react'
import { cn } from '../../lib/cn'

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

export interface BrandLogoProps {
  src: string
  alt?: string
  size?: LogoSize
  className?: string
  style?: React.CSSProperties
}

const sizeMap: Record<LogoSize, { width: number; height: number; className: string }> = {
  sm: { width: 32,  height: 32,  className: 'w-8 h-8' },
  md: { width: 48,  height: 48,  className: 'w-12 h-12' },
  lg: { width: 64,  height: 64,  className: 'w-16 h-16' },
  xl: { width: 80,  height: 80,  className: 'w-20 h-20' },
}

export function BrandLogo({ src, alt = 'Logo', size = 'md', className, style }: BrandLogoProps) {
  const { width, height, className: sizeClass } = sizeMap[size]
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-contain flex-shrink-0', sizeClass, className)}
      style={style}
    />
  )
}
