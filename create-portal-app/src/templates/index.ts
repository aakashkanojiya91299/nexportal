// ── Types ─────────────────────────────────────────────────────────────────────
export type { ScaffoldOptions } from './types'
export { sidebarFromPreset } from './types'

// ── Config generators ─────────────────────────────────────────────────────────
export {
  genPackageJson, genTailwindConfig, genThemeConfig,
  genEnvLocal, genNextConfig, genGlobalsCSS,
} from './gen-config'

// ── Auth route generators ─────────────────────────────────────────────────────
export {
  genLoginRoute, genUserRoute, genMiddleware, genSessionRoute,
  genLogoutRoute, genForgotPasswordRoute, genResetPasswordRoutes,
  genResetPasswordValidateRoute, genApiClient,
} from './gen-auth'

// ── Dashboard generators ──────────────────────────────────────────────────────
export { genDashboardLayout, genDashboardShell, genDashboardLoading, genContentSkeleton } from './gen-dashboard'

// ── Nav generators ────────────────────────────────────────────────────────────
export { genNavConfig } from './gen-nav'

// ── State generators ──────────────────────────────────────────────────────────
export { genReduxStore, genAuthSlice } from './gen-state'

// ── Page generators ───────────────────────────────────────────────────────────
export {
  genRootPage, genRootLayout, genProviders,
  genSettingsPage, genGenericHomePage,
} from './gen-pages'

// ── Login / auth page generators (re-exported from legacy index for compat) ───
export {
  genLoginPage, genForgotPasswordPage, genResetPasswordPage, genRegisterPage,
} from './gen-login'

// ── Demo generators ───────────────────────────────────────────────────────────
export {
  genEcomHomePage, genEcomProductsPage, genEcomOrdersPage,
  genAdminHomePage, genAdminUsersPage,
  genTalentHomePage, genTalentAthletesPage,
} from './gen-demo'

// ── Blank demo (showcase, form builder, onboarding) ──────────────────────────
export {
  genComponentsShowcasePage, genFormBuilderPage, genOnboardingPage,
  genUsersPage,
} from './gen-legacy'

// ── Charts showcase (all 20 Apache ECharts chart types) ───────────────────────
export { genChartsShowcasePage } from './gen-charts-showcase'

// ── Preset-aware home page helper ─────────────────────────────────────────────
import type { ScaffoldOptions } from './types'
import { genEcomHomePage, genAdminHomePage, genTalentHomePage } from './gen-demo'
import { genGenericHomePage } from './gen-pages'

export function genDashboardHomePage(o: ScaffoldOptions): string {
  if (!o.includeDemo) return genGenericHomePage()
  if (o.preset === 'ecom-header' || o.preset === 'ecom-sidebar') return genEcomHomePage()
  if (o.preset === 'admin') return genAdminHomePage()
  if (o.preset === 'talent') return genTalentHomePage()
  return genGenericHomePage()
}
