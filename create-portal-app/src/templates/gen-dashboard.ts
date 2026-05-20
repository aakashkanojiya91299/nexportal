import type { ScaffoldOptions } from './types'

export function genDashboardLayout(_o: ScaffoldOptions): string {
  return `import { navGroups } from '@/components/layout/nav-config'
import { DashboardShell } from './_components/dashboard-shell'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navGroups={navGroups}>
      {children}
    </DashboardShell>
  )
}
`
}

export function genDashboardShell(o: ScaffoldOptions): string {
  const authHook = o.authMode === 'multi-role' ? 'useMultiRoleAuth' : 'useJwtAuth'
  const authCall = o.authMode === 'multi-role' ? 'useMultiRoleAuth({ roles: [] })' : 'useJwtAuth()'
  return `'use client'

import { DashboardLayout, ${authHook}, type NavGroup } from '@lucifer91299/ui'
import { usePathname } from 'next/navigation'
import { ContentSkeleton } from './content-skeleton'

interface Props {
  navGroups: NavGroup[]
  children: React.ReactNode
}

export function DashboardShell({ navGroups, children }: Props) {
  const pathname = usePathname()
  const { user, loading, logout } = ${authCall}

  const breadcrumbs = pathname
    .replace('/dashboard', '')
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      href: i < arr.length - 1 ? '/dashboard/' + arr.slice(0, i + 1).join('/') : undefined,
    }))

  return (
    <DashboardLayout
      navGroups={navGroups}
      sidebar="${o.sidebarStyle}"
      projectName="${o.projectName}"
      logoSrc="/brand/logo.svg"
      notificationsEndpoint="/api/notifications"
      settingsHref="/dashboard/settings"
      user={{ name: String((user as any)?.name ?? 'User'), role: String((user as any)?.role ?? '') }}
      pathname={pathname}
      onLogout={logout}
      breadcrumbs={breadcrumbs}
    >
      {loading ? <ContentSkeleton /> : children}
    </DashboardLayout>
  )
}
`
}

export function genContentSkeleton(): string {
  return `import { Skeleton, SkeletonCard } from '@lucifer91299/ui'

export function ContentSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SkeletonCard lines={5} />
        </div>
        <SkeletonCard lines={4} />
      </div>
    </div>
  )
}
`
}
