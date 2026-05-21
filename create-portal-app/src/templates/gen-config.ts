import type { ScaffoldOptions } from './types'

export function genPackageJson(o: ScaffoldOptions): string {
  const deps: Record<string, string> = {
    '@lucifer91299/ui': o.localUiPath ? `file:${o.localUiPath}` : '^1.1.77',
    '@dnd-kit/core': '^6.3.1',
    '@dnd-kit/sortable': '^10.0.0',
    '@dnd-kit/utilities': '^3.2.2',
    'next': '^16.2.6',
    'react': '^19.0.0',
    'react-dom': '^19.0.0',
    'framer-motion': '^12.0.0',
    'echarts': '^5.5.1',
    'echarts-for-react': '^3.0.2',
    'recharts': '^3.8.1',
    'axios': '^1.7.9',
    '@tanstack/react-query': '^5.64.1',
    'jose': '^5.9.6',
    'clsx': '^2.1.1',
    'tailwind-merge': '^2.5.5',
    'lucide-react': '^0.469.0',
  }

  if (o.stateManagement === 'redux-query') {
    deps['@reduxjs/toolkit'] = '^2.5.0'
    deps['react-redux'] = '^9.2.0'
  }
  if (o.authMode === 'laravel') deps['laravel-session-sdk'] = '^1.4.9'
  if (o.includeI18n) deps['next-intl'] = '^3.26.3'

  const devDeps: Record<string, string> = {
    'typescript': '^5.7.3',
    '@types/node': '^22.10.7',
    '@types/react': '^19.0.7',
    '@types/react-dom': '^19.0.3',
    'tailwindcss': '^3.4.17',
    'postcss': '^8.4.49',
    'autoprefixer': '^10.4.20',
  }

  return JSON.stringify({
    name: o.projectName,
    version: '0.1.0',
    private: true,
    description: o.projectDescription,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
      typecheck: 'tsc --noEmit',
    },
    dependencies: deps,
    devDependencies: devDeps,
  }, null, 2)
}

export function genTailwindConfig(_o: ScaffoldOptions): string {
  return `import type { Config } from 'tailwindcss'
import preset from '@lucifer91299/ui/tailwind/preset'

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@lucifer91299/ui/dist/index.js',
  ],
  plugins: [],
}

export default config
`
}

export function genThemeConfig(o: ScaffoldOptions): string {
  return `import { createTheme } from '@lucifer91299/ui'

export default createTheme({
  primary:          '${o.primaryColor}',
  accent:           '${o.accentColor}',
  success:          '${o.successColor}',
  logoSrc:          '${o.brandLogoPath || '/brand/logo.svg'}',
  poweredByLogoSrc: '/brand/powered-by-logo.svg',
  poweredByText:    'Powered by',
  projectName:      '${o.projectName}',
  sidebar:          '${o.sidebarStyle}',
  loginStyle:       '${o.loginStyle}',
})
`
}

export function genEnvLocal(o: ScaffoldOptions): string {
  const lines: string[] = []
  if (o.authMode === 'jwt' || o.authMode === 'multi-role') {
    lines.push(`NEXT_PUBLIC_API_URL=${o.apiUrl ?? 'http://localhost:3000'}`)
    if (o.authMode === 'jwt') {
      lines.push(`JWT_SECRET=${o.jwtSecret ?? 'change-me-in-production'}`)
    }
  }
  if (o.authMode === 'laravel') {
    lines.push(`NEXT_PUBLIC_LARAVEL_URL=${o.laravelUrl ?? 'http://localhost:8000'}`)
    lines.push(`SESSION_DB_HOST=${o.dbHost ?? '127.0.0.1'}`)
    lines.push(`SESSION_DB_PORT=${o.dbPort ?? '3306'}`)
    lines.push(`SESSION_DB_NAME=${o.dbName ?? 'laravel'}`)
    lines.push(`SESSION_DB_USER=${o.dbUser ?? 'root'}`)
    lines.push(`SESSION_DB_PASS=${o.dbPassword ?? ''}`)
  }
  return lines.join('\n') + '\n'
}

export function genNextConfig(o: ScaffoldOptions): string {
  const apiHost = o.apiUrl
    ? (() => { try { return new URL(o.apiUrl).hostname } catch { return 'localhost' } })()
    : 'localhost'

  return `import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static:  180,
    },
  },
  images: {
    remotePatterns: [],
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://${apiHost}:3000',
    'http://${apiHost}:3001',
  ],
}

export default config
`
}

export function genGlobalsCSS(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;
`
}
