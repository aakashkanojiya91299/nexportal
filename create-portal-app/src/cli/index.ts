import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import * as p from '@clack/prompts'
import type { ScaffoldOptions } from '../templates/types'
import { sidebarFromPreset } from '../templates/types'
import {
  genPackageJson, genTailwindConfig, genThemeConfig, genEnvLocal,
  genNextConfig, genGlobalsCSS, genRootLayout, genProviders,
  genLoginPage, genForgotPasswordPage, genResetPasswordPage, genRegisterPage,
  genLoginRoute, genUserRoute, genMiddleware, genSessionRoute,
  genLogoutRoute, genApiClient, genForgotPasswordRoute,
  genResetPasswordRoutes, genResetPasswordValidateRoute,
  genNavConfig, genDashboardLayout, genDashboardShell, genDashboardLoading, genContentSkeleton,
  genReduxStore, genAuthSlice, genRootPage, genSettingsPage, genGenericHomePage,
  genDashboardHomePage,
  genEcomProductsPage, genEcomOrdersPage,
  genAdminUsersPage,
  genTalentAthletesPage,
  genUsersPage, genComponentsShowcasePage, genFormBuilderPage, genOnboardingPage,
} from '../templates'
import { genChartsShowcasePage } from '../templates/gen-charts-showcase'

// ── File helpers ───────────────────────────────────────────────────────────────

function write(filePath: string, content: string) {
  const dir = dirname(filePath)
  if (dir) mkdirSync(dir, { recursive: true })
  writeFileSync(filePath, content, 'utf-8')
}

function handleFsError(err: unknown, context: string): never {
  const e = err as NodeJS.ErrnoException
  if (e.code === 'EACCES' || e.code === 'EPERM') {
    p.cancel(`Permission denied — try a directory where you have write access.\n  Path: ${context}`)
  } else if (e.code === 'ENAMETOOLONG') {
    p.cancel(`Path too long — use a shorter project name.\n  Path: ${context}`)
  } else {
    p.cancel(`Failed to create project: ${e.message ?? String(err)}`)
  }
  process.exit(1)
}

function countFiles(dir: string): number {
  let n = 0
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    n += statSync(full).isDirectory() ? countFiles(full) : 1
  }
  return n
}

// ── Arg parsing ────────────────────────────────────────────────────────────────

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

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULTS = {
  projectDescription: 'My portal application',
  authMode:           'jwt'        as ScaffoldOptions['authMode'],
  loginStyle:         'animated'   as ScaffoldOptions['loginStyle'],
  sidebarStyle:       'full'       as ScaffoldOptions['sidebarStyle'],
  preset:             'blank'      as ScaffoldOptions['preset'],
  primaryColor:       '#000080',
  accentColor:        '#FF9933',
  successColor:       '#138808',
  brandLogoPath:      'brand/logo.svg',
  apiUrl:             'http://localhost:3000',
  jwtCookieName:      'access_token',
  jwtSecret:          'change-me-in-production',
  stateManagement:    'redux-query' as ScaffoldOptions['stateManagement'],
  packageManager:     'npm'        as ScaffoldOptions['packageManager'],
}

// ── Cancel guard ───────────────────────────────────────────────────────────────

function noCancel<T>(value: T | symbol): T {
  if (p.isCancel(value)) { p.cancel('Operation cancelled.'); process.exit(0) }
  return value
}

const onCancel = () => { p.cancel('Operation cancelled.'); process.exit(0) }

// ── Interactive prompts ────────────────────────────────────────────────────────

async function runPrompts(projectNameArg?: string): Promise<ScaffoldOptions> {
  p.intro(' create-portal-app ')

  // ── Project ────────────────────────────────────────────────────────────────
  const projectName = projectNameArg?.trim() ||
    noCancel(await p.text({
      message:      'Project name',
      placeholder:  'my-portal',
      defaultValue: 'my-portal',
      validate:     (v) => (v ?? '').trim() ? undefined : 'Project name cannot be empty',
    }))

  const projectDescription = noCancel(await p.text({
    message:      'Project description',
    placeholder:  DEFAULTS.projectDescription,
    defaultValue: DEFAULTS.projectDescription,
  }))

  // ── Preset ─────────────────────────────────────────────────────────────────
  const preset = noCancel(await p.select({
    message: 'Application template',
    options: [
      { value: 'ecom-header',  label: 'E-commerce — Top Nav',   hint: 'Products, Orders, Customers — header layout' },
      { value: 'ecom-sidebar', label: 'E-commerce — Sidebar',   hint: 'Products, Orders, Customers — sidebar layout' },
      { value: 'admin',        label: 'Admin Panel',            hint: 'Users, Roles, Audit Log — sidebar layout' },
      { value: 'talent',       label: 'Talent Portal',          hint: 'Athletes, Registrations, Certs — sidebar layout' },
      { value: 'blank',        label: 'Blank Starter',          hint: 'Components showcase only, you choose layout' },
    ],
  })) as ScaffoldOptions['preset']

  // ── Demo content ───────────────────────────────────────────────────────────
  const includeDemo = noCancel(await p.confirm({
    message:      preset === 'blank'
      ? 'Include components showcase & demo pages?'
      : 'Include demo content? (realistic sample data so your app looks real on first run)',
    initialValue: true,
  }))

  // ── Auth ───────────────────────────────────────────────────────────────────
  const authMode = noCancel(await p.select({
    message: 'Auth mode',
    options: [
      { value: 'jwt',        label: 'JWT cookie',      hint: 'NestJS / Express / any backend' },
      { value: 'multi-role', label: 'Multi-role JWT',  hint: 'Separate cookies per role' },
      { value: 'laravel',    label: 'Laravel session', hint: 'PHP Laravel backend' },
    ],
  }))

  let apiUrl        = DEFAULTS.apiUrl
  let jwtCookieName = DEFAULTS.jwtCookieName
  let jwtSecret     = DEFAULTS.jwtSecret
  let roles: string[] | undefined
  let laravelUrl: string | undefined
  let dbHost: string | undefined, dbPort: string | undefined
  let dbName: string | undefined, dbUser: string | undefined, dbPassword: string | undefined

  if (authMode === 'jwt') {
    const r = await p.group({
      apiUrl:        () => p.text({ message: 'Backend API URL', placeholder: DEFAULTS.apiUrl,        defaultValue: DEFAULTS.apiUrl }),
      jwtCookieName: () => p.text({ message: 'Cookie name',     placeholder: DEFAULTS.jwtCookieName, defaultValue: DEFAULTS.jwtCookieName }),
      jwtSecret:     () => p.text({ message: 'JWT secret',      placeholder: DEFAULTS.jwtSecret,     defaultValue: DEFAULTS.jwtSecret }),
    }, { onCancel })
    apiUrl = r.apiUrl as string; jwtCookieName = r.jwtCookieName as string; jwtSecret = r.jwtSecret as string
  }

  if (authMode === 'multi-role') {
    const r = await p.group({
      rolesRaw: () => p.text({ message: 'Role names (comma separated)', placeholder: 'coach, judge', defaultValue: 'coach, judge' }),
      apiUrl:   () => p.text({ message: 'Backend API URL', placeholder: DEFAULTS.apiUrl, defaultValue: DEFAULTS.apiUrl }),
    }, { onCancel })
    roles  = (r.rolesRaw as string).split(',').map(s => s.trim()).filter(Boolean)
    if (!roles.length) roles = ['admin']
    apiUrl = r.apiUrl as string
  }

  if (authMode === 'laravel') {
    const r = await p.group({
      laravelUrl: () => p.text({ message: 'Laravel URL',       placeholder: 'http://localhost:8000', defaultValue: 'http://localhost:8000' }),
      dbHost:     () => p.text({ message: 'Database host',     placeholder: '127.0.0.1',             defaultValue: '127.0.0.1' }),
      dbPort:     () => p.text({ message: 'Database port',     placeholder: '3306',                  defaultValue: '3306' }),
      dbName:     () => p.text({ message: 'Database name',     placeholder: 'laravel',               defaultValue: 'laravel' }),
      dbUser:     () => p.text({ message: 'Database user',     placeholder: 'root',                  defaultValue: 'root' }),
      dbPassword: () => p.password({ message: 'Database password' }),
    }, { onCancel })
    laravelUrl = r.laravelUrl as string; dbHost = r.dbHost as string; dbPort = r.dbPort as string
    dbName = r.dbName as string; dbUser = r.dbUser as string; dbPassword = r.dbPassword as string
  }

  // ── Design ─────────────────────────────────────────────────────────────────
  const loginStyle = noCancel(await p.select({
    message: 'Login page style',
    options: [
      { value: 'animated', label: 'Animated', hint: 'Floating orbs + particles + tricolor bar' },
      { value: 'simple',   label: 'Simple',   hint: 'Clean gradient card (minimal)' },
    ],
  }))

  // Sidebar: only ask for blank preset, others are derived from preset
  let sidebarStyle = sidebarFromPreset(preset as ScaffoldOptions['preset'], DEFAULTS.sidebarStyle)
  if (preset === 'blank') {
    sidebarStyle = noCancel(await p.select({
      message: 'Sidebar style',
      options: [
        { value: 'full',   label: 'Full',   hint: 'Wide sidebar, collapses to icon-only + mobile drawer' },
        { value: 'rail',   label: 'Rail',   hint: 'Icon-only narrow sidebar' },
        { value: 'header', label: 'Header', hint: 'Top nav bar with horizontal links' },
      ],
    })) as ScaffoldOptions['sidebarStyle']
  }

  // ── Brand colours ──────────────────────────────────────────────────────────
  p.log.info('Brand colours — press Enter to keep defaults')
  const colours = await p.group({
    primaryColor:  () => p.text({ message: 'Primary colour',  placeholder: DEFAULTS.primaryColor,  defaultValue: DEFAULTS.primaryColor }),
    accentColor:   () => p.text({ message: 'Accent colour',   placeholder: DEFAULTS.accentColor,   defaultValue: DEFAULTS.accentColor }),
    successColor:  () => p.text({ message: 'Success colour',  placeholder: DEFAULTS.successColor,  defaultValue: DEFAULTS.successColor }),
    brandLogoPath: () => p.text({ message: 'Logo (public/)',  placeholder: DEFAULTS.brandLogoPath, defaultValue: DEFAULTS.brandLogoPath }),
  }, { onCancel })

  // ── Options ────────────────────────────────────────────────────────────────
  const includeI18n = noCancel(await p.confirm({ message: 'Include i18n (translations)?', initialValue: false }))

  const stateManagement = noCancel(await p.select({
    message: 'State management',
    options: [
      { value: 'redux-query', label: 'Redux Toolkit + React Query', hint: 'recommended' },
      { value: 'query-only',  label: 'React Query only' },
    ],
  }))

  const packageManager = noCancel(await p.select({
    message: 'Package manager',
    options: [
      { value: 'npm',  label: 'npm' },
      { value: 'pnpm', label: 'pnpm', hint: 'faster installs' },
      { value: 'yarn', label: 'yarn' },
    ],
  }))

  return {
    projectName:        projectName        as string,
    projectDescription: projectDescription as string,
    preset:             preset             as ScaffoldOptions['preset'],
    includeDemo:        includeDemo        as boolean,
    authMode:           authMode           as ScaffoldOptions['authMode'],
    loginStyle:         loginStyle         as ScaffoldOptions['loginStyle'],
    sidebarStyle,
    primaryColor:       colours.primaryColor  as string,
    accentColor:        colours.accentColor   as string,
    successColor:       colours.successColor  as string,
    brandLogoPath:      colours.brandLogoPath as string,
    apiUrl, jwtCookieName, jwtSecret, roles,
    laravelUrl, dbHost, dbPort, dbName, dbUser, dbPassword,
    includeI18n:     includeI18n     as boolean,
    stateManagement: stateManagement as ScaffoldOptions['stateManagement'],
    packageManager:  packageManager  as ScaffoldOptions['packageManager'],
  }
}

// ── Scaffold ───────────────────────────────────────────────────────────────────

function scaffold(opts: ScaffoldOptions): number {
  const outDir = join(process.cwd(), opts.projectName)

  if (existsSync(outDir)) {
    p.cancel(`Directory "${opts.projectName}" already exists.`)
    process.exit(1)
  }

  const f = (rel: string) => join(outDir, rel)
  function w(filePath: string, content: string) {
    try { write(filePath, content) }
    catch (err) { handleFsError(err, filePath) }
  }

  // ── Config files ───────────────────────────────────────────────────────────
  w(f('package.json'),           genPackageJson(opts))
  w(f('tailwind.config.ts'),     genTailwindConfig(opts))
  w(f('src/theme.config.ts'),    genThemeConfig(opts))
  w(f('.env.local'),             genEnvLocal(opts))
  w(f('.env.example'),           genEnvLocal(opts).replace(/=.+/g, '='))
  w(f('postcss.config.mjs'),     `export default { plugins: { tailwindcss: {}, autoprefixer: {} } }\n`)
  w(f('next.config.ts'),         genNextConfig(opts))
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

  // ── App shell ──────────────────────────────────────────────────────────────
  w(f('src/app/globals.css'),    genGlobalsCSS())
  w(f('src/app/layout.tsx'),     genRootLayout(opts))
  w(f('src/app/page.tsx'),       genRootPage())
  w(f('src/providers/index.tsx'),genProviders(opts))
  w(f('src/lib/api.ts'),         genApiClient(opts))
  w(f('src/proxy.ts'),            genMiddleware(opts))

  // ── Auth pages ─────────────────────────────────────────────────────────────
  w(f('src/app/login/page.tsx'),           genLoginPage(opts))
  w(f('src/app/forgot-password/page.tsx'), genForgotPasswordPage(opts))
  w(f('src/app/reset-password/page.tsx'),  genResetPasswordPage(opts))
  w(f('src/app/register/page.tsx'),        genRegisterPage(opts))

  // ── Auth API routes ────────────────────────────────────────────────────────
  w(f('src/app/api/auth/login/route.ts'),                       genLoginRoute(opts))
  w(f('src/app/api/auth/user/route.ts'),                        genUserRoute(opts))
  w(f('src/app/api/auth/session/route.ts'),                     genSessionRoute(opts))
  w(f('src/app/api/auth/logout/route.ts'),                      genLogoutRoute(opts))
  w(f('src/app/api/auth/forgot-password/route.ts'),             genForgotPasswordRoute())
  w(f('src/app/api/auth/reset-password/route.ts'),              genResetPasswordRoutes())
  w(f('src/app/api/auth/reset-password/validate/route.ts'),     genResetPasswordValidateRoute())

  // ── Dashboard core ─────────────────────────────────────────────────────────
  w(f('src/components/layout/nav-config.tsx'),             genNavConfig(opts))
  w(f('src/app/dashboard/layout.tsx'),                      genDashboardLayout(opts))
  w(f('src/app/dashboard/loading.tsx'),                     genDashboardLoading())
  w(f('src/app/dashboard/_components/dashboard-shell.tsx'), genDashboardShell(opts))
  w(f('src/app/dashboard/_components/content-skeleton.tsx'),genContentSkeleton())
  w(f('src/app/dashboard/page.tsx'),                       genDashboardHomePage(opts))
  w(f('src/app/dashboard/settings/page.tsx'),              genSettingsPage(opts))

  // ── Charts showcase — always written for every preset ─────────────────────
  w(f('src/app/dashboard/charts/page.tsx'), genChartsShowcasePage())

  // ── Preset-specific pages ──────────────────────────────────────────────────
  if (opts.preset === 'ecom-header' || opts.preset === 'ecom-sidebar') {
    if (opts.includeDemo) {
      w(f('src/app/dashboard/products/page.tsx'),  genEcomProductsPage())
      w(f('src/app/dashboard/orders/page.tsx'),    genEcomOrdersPage())
    }
  }

  if (opts.preset === 'admin') {
    w(f('src/app/dashboard/users/page.tsx'), opts.includeDemo ? genAdminUsersPage() : genUsersPage(opts))
    if (opts.includeDemo) {
      w(f('src/app/dashboard/roles/page.tsx'),   genGenericPlaceholderPage('Roles', 'Manage user roles and permissions.'))
      w(f('src/app/dashboard/audit/page.tsx'),   genGenericPlaceholderPage('Audit Log', 'Track all admin actions.'))
    }
  }

  if (opts.preset === 'talent') {
    if (opts.includeDemo) {
      w(f('src/app/dashboard/athletes/page.tsx'),       genTalentAthletesPage())
      w(f('src/app/dashboard/registrations/page.tsx'),  genGenericPlaceholderPage('Registrations', 'Manage athlete registrations.'))
      w(f('src/app/dashboard/certificates/page.tsx'),   genGenericPlaceholderPage('Certificates', 'View and issue certificates.'))
    }
  }

  if (opts.preset === 'blank') {
    w(f('src/app/dashboard/users/page.tsx'), genUsersPage(opts))
    if (opts.includeDemo) {
      w(f('src/app/dashboard/components/page.tsx'),   genComponentsShowcasePage())
      w(f('src/app/dashboard/form-builder/page.tsx'), genFormBuilderPage())
      w(f('src/app/dashboard/onboarding/page.tsx'),   genOnboardingPage())
    }
  }

  // ── State management ───────────────────────────────────────────────────────
  if (opts.stateManagement === 'redux-query') {
    w(f('src/store/index.ts'),      genReduxStore())
    w(f('src/store/auth.slice.ts'), genAuthSlice())
  }

  // ── Brand assets ───────────────────────────────────────────────────────────
  const initial = opts.projectName.charAt(0).toUpperCase()
  w(f('public/brand/logo.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${opts.primaryColor}"/><text x="32" y="40" font-size="24" text-anchor="middle" fill="#fff" font-family="system-ui">${initial}</text></svg>`)
  w(f('public/brand/powered-by-logo.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 24"><text y="18" font-size="12" font-family="system-ui" fill="#888">powered</text></svg>`)

  return countFiles(outDir)
}

function genGenericPlaceholderPage(title: string, subtitle: string): string {
  return `'use client'

import { PageShell } from '@lucifer91299/ui'

export default function Page() {
  return (
    <div className="p-6">
      <PageShell title="${title}" subtitle="${subtitle}" />
      <div className="mt-8 flex items-center justify-center h-48 bg-white rounded-2xl border border-separator shadow-sm">
        <p className="text-label-tertiary text-sm">Replace this with your ${title.toLowerCase()} content.</p>
      </div>
    </div>
  )
}
`
}

// ── Finish output ──────────────────────────────────────────────────────────────

function showSuccess(opts: ScaffoldOptions, fileCount: number) {
  const cmds = {
    npm:  { install: 'npm install',  dev: 'npm run dev' },
    pnpm: { install: 'pnpm install', dev: 'pnpm dev' },
    yarn: { install: 'yarn',         dev: 'yarn dev' },
  }[opts.packageManager]

  p.note(
    [`cd ${opts.projectName}`, cmds.install, cmds.dev].join('\n'),
    'Next steps',
  )

  const presetLabel = {
    'ecom-header':  'E-commerce (Top Nav)',
    'ecom-sidebar': 'E-commerce (Sidebar)',
    'admin':        'Admin Panel',
    'talent':       'Talent Portal',
    'blank':        'Blank Starter',
  }[opts.preset]

  p.outro(
    `${opts.projectName}/ ready — ${fileCount} files  ·  ${presetLabel}  ·  auth: ${opts.authMode}  ·  ${opts.primaryColor}`,
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2))

  if (flags['help'] || flags['h']) {
    process.stdout.write([
      '',
      '  Usage:  npx @lucifer91299/create-portal-app [project-name] [options]',
      '',
      '  No options    → interactive prompts',
      '',
      '  --yes, -y     Skip prompts, use defaults',
      '  --preset=     ecom-header | ecom-sidebar | admin | talent | blank',
      '  --demo        Include demo content (default: true with --yes)',
      '  --no-demo     Skip demo content',
      '  --auth=       jwt | multi-role | laravel',
      '  --login=      animated | simple',
      '  --sidebar=    full | rail | header  (only for blank preset)',
      '  --primary=#   Primary brand colour',
      '  --accent=#    Accent colour',
      '  --api-url=    Backend API URL',
      '  --pm=         npm | pnpm | yarn',
      '  --local-ui=   Path to local @lucifer91299/ui',
      '',
      '  Examples:',
      '    npx @lucifer91299/create-portal-app',
      '    npx @lucifer91299/create-portal-app my-shop --yes --preset=ecom-sidebar',
      '    npx @lucifer91299/create-portal-app my-admin --yes --preset=admin --no-demo',
      '',
    ].join('\n'))
    process.exit(0)
  }

  const projectNameArg = positional[0]

  if (flags['yes'] || flags['y']) {
    const name   = projectNameArg || 'my-portal'
    const preset = (flags['preset'] as ScaffoldOptions['preset']) ?? DEFAULTS.preset
    const includeDemo = flags['no-demo'] ? false : true
    const chosenSidebar = (flags['sidebar'] as ScaffoldOptions['sidebarStyle']) ?? DEFAULTS.sidebarStyle
    const opts: ScaffoldOptions = {
      projectName:        name,
      projectDescription: DEFAULTS.projectDescription,
      preset,
      includeDemo,
      authMode:           (flags['auth']    as ScaffoldOptions['authMode'])     ?? DEFAULTS.authMode,
      loginStyle:         (flags['login']   as ScaffoldOptions['loginStyle'])   ?? DEFAULTS.loginStyle,
      sidebarStyle:       sidebarFromPreset(preset, chosenSidebar),
      primaryColor:       (flags['primary'] as string) ?? DEFAULTS.primaryColor,
      accentColor:        (flags['accent']  as string) ?? DEFAULTS.accentColor,
      successColor:       DEFAULTS.successColor,
      brandLogoPath:      DEFAULTS.brandLogoPath,
      apiUrl:             (flags['api-url'] as string) ?? DEFAULTS.apiUrl,
      jwtCookieName:      DEFAULTS.jwtCookieName,
      jwtSecret:          DEFAULTS.jwtSecret,
      includeI18n:        false,
      stateManagement:    DEFAULTS.stateManagement,
      packageManager:     (flags['pm'] as ScaffoldOptions['packageManager']) ?? DEFAULTS.packageManager,
      localUiPath:        (flags['local-ui'] as string) ?? undefined,
    }

    p.intro(' create-portal-app ')
    const spin = p.spinner()
    spin.start(`Scaffolding ${name}/…`)
    const count = scaffold(opts)
    spin.stop(`${name}/ — ${count} files created`)
    showSuccess(opts, count)
    process.exit(0)
  }

  const opts = await runPrompts(projectNameArg)
  opts.localUiPath = (flags['local-ui'] as string) ?? undefined

  const spin = p.spinner()
  spin.start(`Scaffolding ${opts.projectName}/…`)
  const count = scaffold(opts)
  spin.stop(`${opts.projectName}/ — ${count} files created`)
  showSuccess(opts, count)
  process.exit(0)
}

main().catch((err) => {
  p.cancel(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
