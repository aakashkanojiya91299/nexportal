'use client'

import { type ReactNode } from 'react'
import { ThemeProvider } from '@lucifer91299/ui'
import theme from '@/theme.config'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
