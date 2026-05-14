// ── Theme ──────────────────────────────────────────────────────────────────
export { createTheme } from './theme/createTheme'
export { ThemeProvider, useTheme } from './theme/ThemeProvider'
export { builtInThemes, defaultTheme } from './theme/defaults'
export type { PortalTheme, ThemeOverrides, SidebarVariant, LoginStyle, BorderRadiusPreset } from './theme/types'

// ── Auth types ────────────────────────────────────────────────────────────
export type {
  UseJwtAuthOptions,
  UseJwtAuthResult,
  UseMultiRoleAuthOptions,
  UseMultiRoleAuthResult,
  AuthUser,
  JwtPayload,
  LaravelAuthOptions,
} from './auth/types'

// ── Auth hooks ────────────────────────────────────────────────────────────
export { useJwtAuth } from './hooks/useJwtAuth'
export { useMultiRoleAuth } from './hooks/useMultiRoleAuth'
export { useLaravelSessionAuth } from './hooks/useLaravelSessionAuth'

// ── UI primitives ─────────────────────────────────────────────────────────
export { Button } from './components/ui/Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/ui/Button'
export { Input } from './components/ui/Input'
export type { InputProps } from './components/ui/Input'
export { Badge } from './components/ui/Badge'
export type { BadgeVariant } from './components/ui/Badge'
export { Card } from './components/ui/Card'
export type { CardProps } from './components/ui/Card'
export { AlertBanner } from './components/ui/AlertBanner'
export { LoadingSpinner } from './components/ui/LoadingSpinner'
export { DataTable, StatusBadge, ActionButtons } from './components/ui/DataTable'
export type { DataTableProps, TableColumn, StatusBadgeProps, ActionButtonsProps } from './components/ui/DataTable'
export { Select } from './components/ui/Select'
export type { SelectProps, SelectOption } from './components/ui/Select'
export { DatePicker } from './components/ui/DatePicker'
export type { DatePickerProps } from './components/ui/DatePicker'

// ── Charts (requires recharts peer dependency) ────────────────────────────────
export { PortalBarChart } from './components/charts/BarChart'
export type { PortalBarChartProps, ChartSeries } from './components/charts/BarChart'
export { PortalLineChart } from './components/charts/LineChart'
export type { PortalLineChartProps } from './components/charts/LineChart'
export { PortalAreaChart } from './components/charts/AreaChart'
export type { PortalAreaChartProps } from './components/charts/AreaChart'
export { PortalDonutChart } from './components/charts/DonutChart'
export type { PortalDonutChartProps, DonutSlice } from './components/charts/DonutChart'

// ── Brand / layout components ─────────────────────────────────────────────
export { BrandLogo } from './components/layout/BrandLogo'
export type { BrandLogoProps, LogoSize } from './components/layout/BrandLogo'
export { TricolorBar } from './components/layout/TricolorBar'
export type { TricolorBarProps } from './components/layout/TricolorBar'
export { SocialLinks } from './components/layout/SocialLinks'
export type { SocialLinksProps, SocialLink } from './components/layout/SocialLinks'
export { PoweredBy } from './components/layout/PoweredBy'
export type { PoweredByProps } from './components/layout/PoweredBy'
export { Sidebar } from './components/layout/Sidebar'
export type { SidebarProps } from './components/layout/Sidebar'
export { SidebarRail } from './components/layout/SidebarRail'
export type { SidebarRailProps } from './components/layout/SidebarRail'
export { DashboardLayout } from './components/layout/DashboardLayout'
export type { DashboardLayoutProps } from './components/layout/DashboardLayout'
export type { NavItem, NavGroup, UserInfo, PoweredByConfig } from './components/layout/types'
export { PageShell } from './components/layout/PageShell'
export type { PageShellProps } from './components/layout/PageShell'
export { Breadcrumbs } from './components/layout/Breadcrumbs'
export type { BreadcrumbsProps, BreadcrumbItem } from './components/layout/Breadcrumbs'
export { PageFooter } from './components/layout/PageFooter'
export type { PageFooterProps, FooterSocialLink } from './components/layout/PageFooter'

// ── Login components ──────────────────────────────────────────────────────
export { LoginPage } from './components/login/LoginPage'
export type { LoginPageProps } from './components/login/LoginPage'
export { LoginPageSimple } from './components/login/LoginPageSimple'
export type { LoginPageSimpleProps, RegisterLink } from './components/login/LoginPageSimple'
export { LoginCard } from './components/login/LoginCard'
export { LoginHeader } from './components/login/LoginHeader'
export { RoleSelectSplash } from './components/login/RoleSelectSplash'
export type { RoleSelectSplashProps, RoleOption } from './components/login/RoleSelectSplash'
export { ParticleBg } from './components/login/ParticleBg'

// ── Utilities ─────────────────────────────────────────────────────────────
export { cn } from './lib/cn'
