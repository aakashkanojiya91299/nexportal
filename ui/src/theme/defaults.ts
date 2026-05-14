import type { PortalTheme } from './types'

const defaultTheme: PortalTheme = {
  primary:          '#000080',
  'primary-soft':   'rgba(0, 0, 128, 0.12)',
  'primary-hover':  'rgba(0, 0, 128, 0.9)',
  accent:           '#FF9933',
  'accent-soft':    'rgba(255, 153, 51, 0.12)',
  'accent-hover':   'rgba(255, 153, 51, 0.9)',
  success:          '#138808',
  'success-soft':   'rgba(19, 136, 8, 0.12)',
  'success-hover':  'rgba(19, 136, 8, 0.9)',
  logoSrc:          '/brand/logo.svg',
  logoAlt:          'Portal Logo',
  poweredByLogoSrc: '/brand/powered-by-logo.svg',
  poweredByText:    'Powered by',
  poweredByHref:    '#',
  projectName:      'Portal',
  projectSubtitle:  '',
  sidebar:          'full',
  loginStyle:       'animated',
  fontFamily:       "'Inter', system-ui, sans-serif",
  borderRadius:     'apple',
}

/** Built-in theme presets — extend or override in createTheme() */
export const builtInThemes = {
  /** Default: dark navy / saffron / green (institutional) */
  default: defaultTheme,

  /** Dark: indigo / amber / emerald (modern SaaS) */
  dark: {
    ...defaultTheme,
    primary:          '#6366F1',
    'primary-soft':   'rgba(99, 102, 241, 0.12)',
    'primary-hover':  'rgba(99, 102, 241, 0.9)',
    accent:           '#F59E0B',
    'accent-soft':    'rgba(245, 158, 11, 0.12)',
    'accent-hover':   'rgba(245, 158, 11, 0.9)',
    success:          '#10B981',
    'success-soft':   'rgba(16, 185, 129, 0.12)',
    'success-hover':  'rgba(16, 185, 129, 0.9)',
    sidebar:          'rail' as const,
    loginStyle:       'simple' as const,
  },

  /** Minimal: slate / blue / green (clean corporate) */
  minimal: {
    ...defaultTheme,
    primary:          '#0F172A',
    'primary-soft':   'rgba(15, 23, 42, 0.1)',
    'primary-hover':  'rgba(15, 23, 42, 0.85)',
    accent:           '#3B82F6',
    'accent-soft':    'rgba(59, 130, 246, 0.12)',
    'accent-hover':   'rgba(59, 130, 246, 0.9)',
    success:          '#22C55E',
    'success-soft':   'rgba(34, 197, 94, 0.12)',
    'success-hover':  'rgba(34, 197, 94, 0.9)',
    sidebar:          'both' as const,
    loginStyle:       'simple' as const,
  },
} satisfies Record<string, PortalTheme>

export { defaultTheme }
