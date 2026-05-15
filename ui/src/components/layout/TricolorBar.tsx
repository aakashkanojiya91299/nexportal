'use client'

import React from 'react'
import { cn } from '../../lib/cn'
import { useTheme } from '../../theme/ThemeProvider'

export interface TricolorBarProps {
  /** Override 3-zone colors. Defaults to [accent, white, success] from theme. */
  colors?: [string, string, string]
  animated?: boolean
  height?: number
  className?: string
  style?: React.CSSProperties
}

export function TricolorBar({ colors, animated = false, height = 3, className, style }: TricolorBarProps) {
  const theme = useTheme()
  const [c1, c2, c3] = colors ?? [theme.accent, '#ffffff', theme.success]

  const barStyle: React.CSSProperties = {
    height,
    background: `linear-gradient(to right, ${c1} 33.33%, ${c2} 33.33% 66.66%, ${c3} 66.66%)`,
  }

  return (
    <div
      style={{ ...barStyle, ...style }}
      className={cn(animated && 'tricolor-sweep', className)}
      aria-hidden="true"
    />
  )
}
