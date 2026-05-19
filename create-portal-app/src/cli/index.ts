import { existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import * as p from '@clack/prompts'
import type { ScaffoldOptions } from '../templates'
import {
  genPackageJson, genTailwindConfig, genThemeConfig, genEnvLocal,
  genNextConfig, genGlobalsCSS, genRootLayout, genProviders, genLoginPage,
  genLoginRoute, genUserRoute,
  genMiddleware, genSessionRoute, genLogoutRoute, genApiClient,
  genNavConfig, genDashboardLayout, genReduxStore, genAuthSlice,
  genRootPage, genDashboardHomePage, genUsersPage, genSettingsPage,
  genComponentsShowcasePage, genFormBuilderPage, genOnboardingPage,
  genForgotPasswordPage, genResetPasswordPage, genRegisterPage,
  genForgotPasswordRoute, genResetPasswordRoutes, genResetPasswordValidateRoute,
} from '../templates'

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
    p.cancel(`Path too long — use a shorter project name or working directory.\n  Path: ${context}`)
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
  authMode:           'jwt'          as ScaffoldOptions['authMode'],
  loginStyle:         'animated'     as ScaffoldOptions['loginStyle'],
  sidebarStyle:       'full'         as ScaffoldOptions['sidebarStyle'],
  primaryColor:       '#000080',
  accentColor:        '#FF9933',
  successColor:       '#138808',
  brandLogoPath:      'brand/logo.svg',
  apiUrl:             'http://localhost:3000',
  jwtCookieName:      'access_token',
  jwtSecret:          'change-me-in-production',
  stateManagement:    'redux-query'  as ScaffoldOptions['stateManagement'],
  packageManager:     'npm'          as ScaffoldOptions['packageManager'],
}

// ── Cancel guard ───────────────────────────────────────────────────────────────

function noCancel<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel('Operation cancelled.')
    process.exit(0)
  }
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

  // ── Auth ───────────────────────────────────────────────────────────────────
  const authMode = noCancel(await p.select({
    message: 'Auth mode',
    options: [
      { value: 'jwt',        label: 'JWT cookie',      hint: 'NestJS / Express / any backend' },
      { value: 'multi-role', label: 'Multi-role JWT',  hint: 'Separate cookies per role (coach + judge…)' },
      { value: 'laravel',    label: 'Laravel session', hint: 'PHP Laravel backend' },
    ],
  }))

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
    const r = await p.group({
      apiUrl:        () => p.text({ message: 'Backend API URL', placeholder: DEFAULTS.apiUrl,        defaultValue: DEFAULTS.apiUrl }),
      jwtCookieName: () => p.text({ message: 'Cookie name',     placeholder: DEFAULTS.jwtCookieName, defaultValue: DEFAULTS.jwtCookieName }),
      jwtSecret:     () => p.text({ message: 'JWT secret',      placeholder: DEFAULTS.jwtSecret,     defaultValue: DEFAULTS.jwtSecret }),
    }, { onCancel })
    apiUrl        = r.apiUrl        as string
    jwtCookieName = r.jwtCookieName as string
    jwtSecret     = r.jwtSecret     as string
  }

  if (authMode === 'multi-role') {
    const r = await p.group({
      rolesRaw: () => p.text({ message: 'Role names (comma separated)', placeholder: 'coach, judge', defaultValue: 'coach, judge' }),
      apiUrl:   () => p.text({ message: 'Backend API URL', placeholder: DEFAULTS.apiUrl, defaultValue: DEFAULTS.apiUrl }),
    }, { onCancel })
    roles  = (r.rolesRaw as string).split(',').map((s) => s.trim()).filter(Boolean)
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
    laravelUrl = r.laravelUrl as string
    dbHost     = r.dbHost     as string
    dbPort     = r.dbPort     as string
    dbName     = r.dbName     as string
    dbUser     = r.dbUser     as string
    dbPassword = r.dbPassword as string
  }

  // ── Design ─────────────────────────────────────────────────────────────────
  const loginStyle = noCancel(await p.select({
    message: 'Login page style',
    options: [
      { value: 'animated', label: 'Animated', hint: 'Floating orbs + particles + tricolor bar' },
      { value: 'simple',   label: 'Simple',   hint: 'Clean gradient card (minimal)' },
    ],
  }))

  const sidebarStyle = noCancel(await p.select({
    message: 'Sidebar style',
    options: [
      { value: 'full',   label: 'Full',   hint: 'Wide sidebar with labels and collapsible groups' },
      { value: 'rail',   label: 'Rail',   hint: 'Icon-only narrow sidebar' },
      { value: 'both',   label: 'Both',   hint: 'Full on desktop, rail on mobile' },
      { value: 'header', label: 'Header', hint: 'Top nav bar with horizontal pill links + dropdowns' },
    ],
  }))

  // ── Brand colours ──────────────────────────────────────────────────────────
  p.log.info('Brand colours — press Enter to keep defaults')
  const colours = await p.group({
    primaryColor:  () => p.text({ message: 'Primary colour',       placeholder: DEFAULTS.primaryColor,  defaultValue: DEFAULTS.primaryColor }),
    accentColor:   () => p.text({ message: 'Accent colour',        placeholder: DEFAULTS.accentColor,   defaultValue: DEFAULTS.accentColor }),
    successColor:  () => p.text({ message: 'Success colour',       placeholder: DEFAULTS.successColor,  defaultValue: DEFAULTS.successColor }),
    brandLogoPath: () => p.text({ message: 'Logo path in public/', placeholder: DEFAULTS.brandLogoPath, defaultValue: DEFAULTS.brandLogoPath }),
  }, { onCancel })

  // ── Options ────────────────────────────────────────────────────────────────
  const includeI18n = noCancel(await p.confirm({
    message:      'Include i18n (translations)?',
    initialValue: false,
  }))

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
    authMode:           authMode           as ScaffoldOptions['authMode'],
    loginStyle:         loginStyle         as ScaffoldOptions['loginStyle'],
    sidebarStyle:       sidebarStyle       as ScaffoldOptions['sidebarStyle'],
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

  w(f('src/app/globals.css'),                                    genGlobalsCSS())
  w(f('src/app/layout.tsx'),                                     genRootLayout(opts))
  w(f('src/app/page.tsx'),                                       genRootPage())
  w(f('src/app/login/page.tsx'),                                 genLoginPage(opts))
  w(f('src/app/forgot-password/page.tsx'),                       genForgotPasswordPage(opts))
  w(f('src/app/reset-password/page.tsx'),                        genResetPasswordPage(opts))
  w(f('src/app/register/page.tsx'),                              genRegisterPage(opts))
  w(f('src/app/dashboard/layout.tsx'),                           genDashboardLayout(opts))
  w(f('src/app/dashboard/page.tsx'),                             genDashboardHomePage(opts))
  w(f('src/app/dashboard/users/page.tsx'),                       genUsersPage(opts))
  w(f('src/app/dashboard/settings/page.tsx'),                    genSettingsPage(opts))
  w(f('src/app/dashboard/components/page.tsx'),                  genComponentsShowcasePage())
  w(f('src/app/dashboard/form-builder/page.tsx'),                genFormBuilderPage())
  w(f('src/app/dashboard/onboarding/page.tsx'),                  genOnboardingPage())
  w(f('src/app/api/auth/login/route.ts'),                        genLoginRoute(opts))
  w(f('src/app/api/auth/user/route.ts'),                         genUserRoute(opts))
  w(f('src/app/api/auth/session/route.ts'),                      genSessionRoute(opts))
  w(f('src/app/api/auth/logout/route.ts'),                       genLogoutRoute(opts))
  w(f('src/app/api/auth/forgot-password/route.ts'),              genForgotPasswordRoute())
  w(f('src/app/api/auth/reset-password/route.ts'),               genResetPasswordRoutes())
  w(f('src/app/api/auth/reset-password/validate/route.ts'),      genResetPasswordValidateRoute())
  w(f('src/providers/index.tsx'),                      genProviders(opts))
  w(f('src/lib/api.ts'),                               genApiClient(opts))
  w(f('src/components/layout/nav-config.tsx'),         genNavConfig(opts))
  w(f('src/proxy.ts'),                                 genMiddleware(opts))

  if (opts.stateManagement === 'redux-query') {
    w(f('src/store/index.ts'),      genReduxStore())
    w(f('src/store/auth.slice.ts'), genAuthSlice())
  }

  const initial = opts.projectName.charAt(0).toUpperCase()
  w(f('public/brand/logo.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${opts.primaryColor}"/><text x="32" y="40" font-size="24" text-anchor="middle" fill="#fff" font-family="system-ui">${initial}</text></svg>`)
  w(f('public/brand/powered-by-logo.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 24"><text y="18" font-size="12" font-family="system-ui" fill="#888">powered</text></svg>`)

  return countFiles(outDir)
}

// ── Finish output ──────────────────────────────────────────────────────────────

function showSuccess(opts: ScaffoldOptions, fileCount: number) {
  const cmds = {
    npm:  { install: 'npm install',  dev: 'npm run dev' },
    pnpm: { install: 'pnpm install', dev: 'pnpm dev' },
    yarn: { install: 'yarn',         dev: 'yarn dev' },
  }[opts.packageManager]

  p.note(
    [
      `cd ${opts.projectName}`,
      cmds.install,
      cmds.dev,
    ].join('\n'),
    'Next steps',
  )

  p.outro(
    `${opts.projectName}/ ready — ${fileCount} files  ·  auth: ${opts.authMode}  ·  ${opts.primaryColor}`,
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const { flags, positional } = parseArgs(process.argv.slice(2))

  // ── Help ──────────────────────────────────────────────────────────────────
  if (flags['help'] || flags['h']) {
    process.stdout.write([
      '',
      '  Usage:  npx @lucifer91299/create-portal-app [project-name] [options]',
      '',
      '  No options    → interactive prompts (arrow-key selection)',
      '',
      '  --yes, -y     Skip prompts, use defaults',
      '  --auth=       jwt | multi-role | laravel',
      '  --login=      animated | simple',
      '  --sidebar=    full | rail | both | header',
      '  --primary=#   Primary brand colour',
      '  --accent=#    Accent colour',
      '  --success=#   Success colour',
      '  --api-url=    Backend API URL',
      '  --pm=         npm | pnpm | yarn',
      '  --local-ui=   Path to local @lucifer91299/ui (for development)',
      '',
      '  Examples:',
      '    npx @lucifer91299/create-portal-app',
      '    npx @lucifer91299/create-portal-app my-portal --yes',
      '    npx @lucifer91299/create-portal-app my-portal --yes --auth=laravel',
      '',
    ].join('\n'))
    process.exit(0)
  }

  const projectNameArg = positional[0]

  // ── --yes / non-interactive mode ──────────────────────────────────────────
  if (flags['yes'] || flags['y']) {
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

    p.intro(' create-portal-app ')
    const spin = p.spinner()
    spin.start(`Scaffolding ${name}/…`)
    const count = scaffold(opts)
    spin.stop(`${name}/ — ${count} files created`)
    showSuccess(opts, count)
    process.exit(0)
  }

  // ── Interactive mode ──────────────────────────────────────────────────────
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
