export interface ScaffoldOptions {
  projectName: string
  projectDescription: string

  // Template preset — drives nav, demo pages, and default sidebar
  preset: 'ecom-header' | 'ecom-sidebar' | 'admin' | 'talent' | 'blank'
  includeDemo: boolean

  // Auth
  authMode: 'jwt' | 'multi-role' | 'laravel'
  loginStyle: 'animated' | 'simple'
  apiUrl?: string
  jwtCookieName?: string
  jwtSecret?: string
  roles?: string[]
  laravelUrl?: string
  dbHost?: string
  dbPort?: string
  dbName?: string
  dbUser?: string
  dbPassword?: string

  // Design
  sidebarStyle: 'full' | 'rail' | 'header'
  primaryColor: string
  accentColor: string
  successColor: string
  brandLogoPath: string

  // Options
  includeI18n: boolean
  stateManagement: 'redux-query' | 'query-only'
  packageManager: 'npm' | 'pnpm' | 'yarn'

  /** Path to local @lucifer91299/ui for development (uses file: reference) */
  localUiPath?: string
}

/** Derive the sidebar style from the preset — only blank lets user choose */
export function sidebarFromPreset(preset: ScaffoldOptions['preset'], chosen: ScaffoldOptions['sidebarStyle']): ScaffoldOptions['sidebarStyle'] {
  if (preset === 'ecom-header') return 'header'
  if (preset === 'ecom-sidebar') return 'full'
  if (preset === 'admin') return 'full'
  if (preset === 'talent') return 'full'
  return chosen
}
