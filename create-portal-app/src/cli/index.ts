import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { ask, select, closePrompt } from './prompt'
import type { ScaffoldOptions } from '../templates'
import {
  genPackageJson, genTailwindConfig, genThemeConfig, genEnvLocal,
  genGlobalsCSS, genRootLayout, genProviders, genLoginPage,
  genLoginRoute, genUserRoute,
  genMiddleware, genSessionRoute, genLogoutRoute, genApiClient,
  genNavConfig, genDashboardLayout, genReduxStore, genAuthSlice,
  genRootPage, genDashboardHomePage, genUsersPage, genSettingsPage,
  genComponentsShowcasePage,
} from '../templates'

function write(filePath: string, content: string) {
  const dir = dirname(filePath)
  if (dir) mkdirSync(dir, { recursive: true })
  writeFileSync(filePath, content, 'utf-8')
}

function handleFsError(err: unknown, context: string): never {
  const e = err as NodeJS.ErrnoException
  if (e.code === 'EACCES' || e.code === 'EPERM') {
    log(`\nError: Permission denied — ${context}`)
    log('Try running from a directory where you have write access.\n')
  } else if (e.code === 'ENAMETOOLONG') {
    log(`\nError: Path too long — ${context}`)
    log('On Windows, enable long path support or use a shorter project name / working directory.\n')
  } else {
    log(`\nError creating project: ${e.message ?? String(err)}\n`)
  }
  process.exit(1)
}

function log(msg: string) { process.stdout.write(msg + '\n') }

function parseArgs(argv: string[]) {
  const flags: Record<string, string | boolean> = {}
  const positional: string[] = []
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [key, ...rest] = arg.slice(2).split('=')
      flags[key] = rest.length ? rest.join('=') : true
    } else {
      positional.push(arg)
    }
  }
  return { flags, positional }
}

const DEFAULTS = {
  projectDescription: 'My portal application',
  authMode:           'jwt'        as ScaffoldOptions['authMode'],
  loginStyle:         'animated'   as ScaffoldOptions['loginStyle'],
  sidebarStyle:       'full'       as ScaffoldOptions['sidebarStyle'],
  primaryColor:       '#000080',
  accentColor:        '#FF9933',
  successColor:       '#138808',
  brandLogoPath:      'brand/logo.svg',
  apiUrl:             'http://localhost:3000',
  jwtCookieName:      'access_token',
  jwtSecret:          'change-me-in-production',
  includeI18n:        false,
  stateManagement:    'redux-query' as ScaffoldOptions['stateManagement'],
  packageManager:     'npm'         as ScaffoldOptions['packageManager'],
}

async function runPrompts(projectNameArg?: string): Promise<ScaffoldOptions> {
  process.stderr.write('\n  create-portal-app — Next.js authenticated portal scaffolder\n')
  process.stderr.write('  ─────────────────────────────────────────────────────────\n\n')

  // ── Project ────────────────────────────────────────────────────────────────
  const projectName = projectNameArg?.trim()
    || await ask('Project name', 'my-portal')

  const projectDescription = await ask('Project description', DEFAULTS.projectDescription)

  // ── Auth mode ──────────────────────────────────────────────────────────────
  const authMode = await select('Auth mode?', [
    { value: 'jwt',        label: 'JWT cookie',      hint: 'NestJS / Express / any backend' },
    { value: 'multi-role', label: 'Multi-role JWT',  hint: 'Separate cookies per role (coach + judge etc.)' },
    { value: 'laravel',    label: 'Laravel session', hint: 'PHP Laravel backend' },
  ])

  let apiUrl        = DEFAULTS.apiUrl
  let jwtCookieName = DEFAULTS.jwtCookieName
  let jwtSecret     = DEFAULTS.jwtSecret
  let roles: string[] | undefined
  let laravelUrl: string | undefined
  let dbHost: string | undefined
  let dbPort: string | undefined
  let dbName: string | undefined
  let dbUser: string | undefined
  let dbPassword: string | undefined

  if (authMode === 'jwt') {
    apiUrl        = await ask('Backend API URL',    DEFAULTS.apiUrl)
    jwtCookieName = await ask('Cookie name',        DEFAULTS.jwtCookieName)
    jwtSecret     = await ask('JWT secret',         DEFAULTS.jwtSecret)
  }

  if (authMode === 'multi-role') {
    const raw = await ask('Role names (comma separated)', 'coach, judge')
    roles = raw.split(',').map((r) => r.trim()).filter(Boolean)
    if (!roles.length) roles = ['admin']
    apiUrl = await ask('Backend API URL', DEFAULTS.apiUrl)
  }

  if (authMode === 'laravel') {
    laravelUrl = await ask('Laravel URL',     'http://localhost:8000')
    dbHost     = await ask('Database host',   '127.0.0.1')
    dbPort     = await ask('Database port',   '3306')
    dbName     = await ask('Database name',   'laravel')
    dbUser     = await ask('Database user',   'root')
    dbPassword = await ask('Database password', '')
  }

  // ── Design ─────────────────────────────────────────────────────────────────
  const loginStyle = await select('Login page style?', [
    { value: 'animated', label: 'Animated', hint: 'floating orbs + particle background + tricolor bar' },
    { value: 'simple',   label: 'Simple',   hint: 'clean gradient card (minimal)' },
  ])

  const sidebarStyle = await select('Sidebar style?', [
    { value: 'full', label: 'Full',  hint: 'wide sidebar with labels and collapsible groups' },
    { value: 'rail', label: 'Rail',  hint: 'icon-only narrow sidebar' },
    { value: 'both', label: 'Both',  hint: 'full on desktop, rail on mobile' },
  ])

  // ── Brand colours ──────────────────────────────────────────────────────────
  process.stderr.write('\nBrand colours (press Enter to keep default):\n')
  const primaryColor  = await ask('Primary colour  ', DEFAULTS.primaryColor)
  const accentColor   = await ask('Accent colour   ', DEFAULTS.accentColor)
  const successColor  = await ask('Success colour  ', DEFAULTS.successColor)
  const brandLogoPath = await ask('Logo path in public/', DEFAULTS.brandLogoPath)

  // ── Options ────────────────────────────────────────────────────────────────
  const includeI18nRaw = await select('Include i18n (translations)?', [
    { value: 'no',  label: 'No'  },
    { value: 'yes', label: 'Yes' },
  ])

  const stateManagement = await select('State management?', [
    { value: 'redux-query', label: 'Redux Toolkit + React Query' },
    { value: 'query-only',  label: 'React Query only' },
  ])

  const packageManager = await select('Package manager?', [
    { value: 'npm',  label: 'npm'  },
    { value: 'pnpm', label: 'pnpm' },
    { value: 'yarn', label: 'yarn' },
  ])

  closePrompt()

  return {
    projectName,
    projectDescription,
    authMode,
    loginStyle,
    sidebarStyle,
    primaryColor,
    accentColor,
    successColor,
    brandLogoPath,
    apiUrl, jwtCookieName, jwtSecret, roles,
    laravelUrl, dbHost, dbPort, dbName, dbUser, dbPassword,
    includeI18n:     includeI18nRaw === 'yes',
    stateManagement: stateManagement as ScaffoldOptions['stateManagement'],
    packageManager:  packageManager  as ScaffoldOptions['packageManager'],
  }
}

function scaffold(opts: ScaffoldOptions) {
  const outDir = join(process.cwd(), opts.projectName)

  if (existsSync(outDir)) {
    log(`\nError: directory "${opts.projectName}" already exists.\n`)
    process.exit(1)
  }

  log(`\nCreating ${opts.projectName}/ ...\n`)

  const f = (rel: string) => join(outDir, rel)

  function w(filePath: string, content: string) {
    try { write(filePath, content) }
    catch (err) { handleFsError(err, filePath) }
  }

  w(f('package.json'),           genPackageJson(opts))
  w(f('tailwind.config.ts'),     genTailwindConfig(opts))
  w(f('src/theme.config.ts'),    genThemeConfig(opts))
  w(f('.env.local'),             genEnvLocal(opts))
  w(f('.env.example'),           genEnvLocal(opts).replace(/=.+/g, '='))
  w(f('postcss.config.mjs'),     `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }\n`)
  w(f('next.config.ts'),         `import type { NextConfig } from 'next'\nconst config: NextConfig = {\n  transpilePackages: ['@lucifer91299/ui'],\n}\nexport default config\n`)
  w(f('tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true,
      skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true,
      module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true,
      isolatedModules: true, jsx: 'preserve', incremental: true,
      plugins: [{ name: 'next' }], paths: { '@/*': ['./src/*'] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }, null, 2))

  w(f('src/app/globals.css'),                    genGlobalsCSS())
  w(f('src/app/layout.tsx'),                     genRootLayout(opts))
  w(f('src/app/page.tsx'),                       genRootPage())
  w(f('src/app/login/page.tsx'),                 genLoginPage(opts))
  w(f('src/app/dashboard/layout.tsx'),           genDashboardLayout(opts))
  w(f('src/app/dashboard/page.tsx'),             genDashboardHomePage(opts))
  w(f('src/app/dashboard/users/page.tsx'),            genUsersPage(opts))
  w(f('src/app/dashboard/settings/page.tsx'),         genSettingsPage(opts))
  w(f('src/app/dashboard/components/page.tsx'),       genComponentsShowcasePage())
  w(f('src/app/api/auth/login/route.ts'),         genLoginRoute(opts))
  w(f('src/app/api/auth/user/route.ts'),          genUserRoute(opts))
  w(f('src/app/api/auth/session/route.ts'),       genSessionRoute(opts))
  w(f('src/app/api/auth/logout/route.ts'),        genLogoutRoute(opts))
  w(f('src/providers/index.tsx'),                genProviders(opts))
  w(f('src/lib/api.ts'),                         genApiClient(opts))
  w(f('src/components/layout/nav-config.tsx'),   genNavConfig(opts))
  w(f('src/proxy.ts'),                           genMiddleware(opts))

  if (opts.stateManagement === 'redux-query') {
    w(f('src/store/index.ts'),      genReduxStore())
    w(f('src/store/auth.slice.ts'), genAuthSlice())
  }

  const initial = opts.projectName.charAt(0).toUpperCase()
  w(f('public/brand/logo.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${opts.primaryColor}"/><text x="32" y="40" font-size="24" text-anchor="middle" fill="#fff" font-family="system-ui">${initial}</text></svg>`)
  w(f('public/brand/powered-by-logo.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 24"><text y="18" font-size="12" font-family="system-ui" fill="#888">powered</text></svg>`)

  const cmds = {
    npm:  { install: 'npm install',  dev: 'npm run dev' },
    pnpm: { install: 'pnpm install', dev: 'pnpm dev' },
    yarn: { install: 'yarn',         dev: 'yarn dev' },
  }[opts.packageManager]

  const count = countFiles(outDir)
  log(`✔  ${opts.projectName}/ — ${count} files created`)
  log(``)
  log(`   Theme:   ${opts.primaryColor}  ${opts.accentColor}  ${opts.successColor}`)
  log(`   Auth:    ${opts.authMode}`)
  log(`   Login:   ${opts.loginStyle}`)
  log(`   Sidebar: ${opts.sidebarStyle}`)
  log(``)
  log(`Next steps:`)
  log(`  cd ${opts.projectName}`)
  log(`  ${cmds.install}`)
  log(`  ${cmds.dev}`)
  log(``)
}

function countFiles(dir: string): number {
  const { readdirSync, statSync } = require('fs') as typeof import('fs')
  let n = 0
  for (const e of readdirSync(dir)) {
    const full = join(dir, e)
    n += statSync(full).isDirectory() ? countFiles(full) : 1
  }
  return n
}

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2))

  if (flags['help'] || flags['h']) {
    log('Usage:  npx @lucifer91299/create-portal-app [project-name] [options]')
    log('')
    log('  Without options  → interactive prompts for all settings')
    log('')
    log('  --yes, -y        Skip all prompts, use defaults immediately')
    log('  --auth=jwt|multi-role|laravel')
    log('  --login=animated|simple')
    log('  --sidebar=full|rail|both')
    log('  --primary=#hex   Primary brand colour')
    log('  --accent=#hex    Accent colour')
    log('  --success=#hex   Success colour')
    log('  --api-url=URL    Backend API URL')
    log('  --pm=npm|pnpm|yarn')
    log('  --local-ui=PATH  Use local @lucifer91299/ui (file: reference, for development)')
    log('')
    log('Examples:')
    log('  npx @lucifer91299/create-portal-app')
    log('  npx @lucifer91299/create-portal-app my-portal')
    log('  npx @lucifer91299/create-portal-app my-portal --yes')
    log('  npx @lucifer91299/create-portal-app my-portal --yes --auth=laravel --primary=#E11D48')
    log('  npx @lucifer91299/create-portal-app my-portal --yes --local-ui=../../ui')
    process.exit(0)
  }

  const projectNameArg = positional[0]

  // ── --yes mode: skip all prompts ──────────────────────────────────────────
  if (flags['yes'] || flags['y']) {
    closePrompt()
    const name = projectNameArg || 'my-portal'
    const opts: ScaffoldOptions = {
      projectName:        name,
      projectDescription: DEFAULTS.projectDescription,
      authMode:           (flags['auth']    as ScaffoldOptions['authMode'])     ?? DEFAULTS.authMode,
      loginStyle:         (flags['login']   as ScaffoldOptions['loginStyle'])   ?? DEFAULTS.loginStyle,
      sidebarStyle:       (flags['sidebar'] as ScaffoldOptions['sidebarStyle']) ?? DEFAULTS.sidebarStyle,
      primaryColor:       (flags['primary'] as string)                          ?? DEFAULTS.primaryColor,
      accentColor:        (flags['accent']  as string)                          ?? DEFAULTS.accentColor,
      successColor:       (flags['success'] as string)                          ?? DEFAULTS.successColor,
      brandLogoPath:      DEFAULTS.brandLogoPath,
      apiUrl:             (flags['api-url'] as string)                          ?? DEFAULTS.apiUrl,
      jwtCookieName:      DEFAULTS.jwtCookieName,
      jwtSecret:          DEFAULTS.jwtSecret,
      includeI18n:        false,
      stateManagement:    DEFAULTS.stateManagement,
      packageManager:     (flags['pm'] as ScaffoldOptions['packageManager'])    ?? DEFAULTS.packageManager,
      localUiPath:        (flags['local-ui'] as string)                         ?? undefined,
    }
    log('create-portal-app — using defaults (--yes)')
    scaffold(opts)
    process.exit(0)
  }

  // ── Interactive mode: ask everything ─────────────────────────────────────
  const opts = await runPrompts(projectNameArg)
  opts.localUiPath = (flags['local-ui'] as string) ?? undefined
  scaffold(opts)
  process.exit(0)
}

main().catch((err) => {
  closePrompt()
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
