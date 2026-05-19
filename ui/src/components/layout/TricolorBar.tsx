'use client'

import React from 'react'
import { cn } from '../../lib/cn'
import { useTheme } from '../../theme/ThemeProvider'

export interface TricolorBarProps {
  /** Override 3-zone colors. Defaults to [accent, white, success] from theme. */
  colors?: [string, string, string]
  /** One-time left-to-right entrance sweep animation. */
  animated?: boolean
  /** Continuous infinite shimmer — background-position slides across the bar. */
  shimmer?: boolean
  height?: number
  className?: string
  style?: React.CSSProperties
}

export function TricolorBar({ colors, animated = false, shimmer = false, height = 3, className, style }: TricolorBarProps) {
  const theme = useTheme()
  const [c1, c2, c3] = colors ?? [theme.accent, '#ffffff', theme.success]

  const barStyle: React.CSSProperties = shimmer
    ? {
        height,
        position: 'relative',
        overflow: 'hidden',
        // Pass resolved colors as CSS custom properties so the pseudo-element can use them
        ['--tc1' as string]: c1,
        ['--tc2' as string]: c2,
        ['--tc3' as string]: c3,
      }
    : {
        height,
        background: `linear-gradient(to right, ${c1} 33.33%, ${c2} 33.33% 66.66%, ${c3} 66.66%)`,
      }

  return (
    <div
      style={{ ...barStyle, ...style }}
      className={cn(shimmer && 'tricolor-shimmer', animated && !shimmer && 'tricolor-sweep', className)}
      aria-hidden="true"
    />
  )
}
