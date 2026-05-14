'use client'

import { type ReactNode } from 'react'
import { ThemeProvider } from '@nexportal/ui'
import theme from '@/theme.config'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
