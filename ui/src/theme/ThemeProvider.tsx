'use client'

import React, { createContext, useContext, type ReactNode } from 'react'
import { defaultTheme } from './defaults'
import type { PortalTheme } from './types'

const ThemeContext = createContext<PortalTheme>(defaultTheme)

export function useTheme(): PortalTheme {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  theme?: Partial<PortalTheme>
  children: ReactNode
}

/**
 * Wrap your app (or a subtree) with ThemeProvider to inject CSS variables
 * and make the theme available to all @lucifer91299/ui components via useTheme().
 *
 * CSS variables injected on the wrapper div:
 *   --primary, --primary-soft, --primary-hover
 *   --accent,  --accent-soft,  --accent-hover
 *   --success, --success-soft, --success-hover
 *
 * @example
 * // app/layout.tsx
 * import { ThemeProvider } from '@lucifer91299/ui'
 * import theme from '@/theme.config'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ThemeProvider theme={theme}>{children}</ThemeProvider>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function ThemeProvider({ theme = {}, children }: ThemeProviderProps) {
  const resolved: PortalTheme = { ...defaultTheme, ...theme }

  const cssVars: Record<string, string> = {
    '--primary':         resolved.primary,
    '--primary-soft':    resolved['primary-soft'],
    '--primary-hover':   resolved['primary-hover'],
    '--accent':          resolved.accent,
    '--accent-soft':     resolved['accent-soft'],
    '--accent-hover':    resolved['accent-hover'],
    '--success':         resolved.success,
    '--success-soft':    resolved['success-soft'],
    '--success-hover':   resolved['success-hover'],
  }

  return (
    <ThemeContext.Provider value={resolved}>
      <div style={cssVars as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
