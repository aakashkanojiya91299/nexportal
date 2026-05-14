'use client'

import { DashboardLayout, useJwtAuth } from '@nexportal/ui'
import { usePathname } from 'next/navigation'
import { navGroups } from '@/components/nav-config'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading, logout } = useJwtAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <DashboardLayout
      navGroups={navGroups}
      sidebar="full"
      projectName="Portal Demo"
      logoSrc="/brand/logo.svg"
      user={{ name: String(user?.name ?? 'Admin'), role: String(user?.role ?? 'Admin') }}
      pathname={pathname}
      onLogout={logout}
    >
      {children}
    </DashboardLayout>
  )
}
