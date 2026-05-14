'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AuthUser, UseMultiRoleAuthOptions, UseMultiRoleAuthResult } from '../auth/types'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

/**
 * Hook for multi-role JWT authentication — each role has its own cookie.
 *
 * Reads `${cookiePrefix}${role}_token` cookies on mount to determine which
 * roles are active. If the user has more than one active role, show
 * `<RoleSelectSplash>` and call `selectRole` on pick.
 *
 * @example
 * const { activeRoles, currentRole, selectRole, user, logout } = useMultiRoleAuth({
 *   roles: ['coach', 'judge'],
 *   cookiePrefix: 'portal_',
 * })
 */
export function useMultiRoleAuth({
  roles,
  cookiePrefix = '',
  userApiPath = '/api/auth/user',
  loginPath = '/login',
}: UseMultiRoleAuthOptions): UseMultiRoleAuthResult {
  const [activeRoles, setActiveRoles] = useState<string[]>([])
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = roles.filter((role) => !!getCookie(`${cookiePrefix}${role}_token`))
    setActiveRoles(found)
    if (found.length === 1) setCurrentRole(found[0])
    setLoading(false)
  }, [roles, cookiePrefix])

  useEffect(() => {
    if (!currentRole) return
    fetch(`${userApiPath}?role=${currentRole}`, { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401) {
          if (typeof window !== 'undefined') {
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(window.location.pathname)}`
          }
          return
        }
        if (!res.ok) return
        const data = (await res.json()) as AuthUser
        setUser(data)
      })
      .catch(() => {/* ignore */})
  }, [currentRole, userApiPath, loginPath])

  const selectRole = useCallback((role: string) => {
    if (activeRoles.includes(role)) setCurrentRole(role)
  }, [activeRoles])

  const logout = useCallback(async () => {
    for (const role of roles) {
      try {
        await fetch(`/api/auth/logout?role=${role}`, { method: 'POST', credentials: 'include' })
      } catch { /* ignore */ }
    }
    setUser(null)
    setCurrentRole(null)
    if (typeof window !== 'undefined') window.location.href = loginPath
  }, [roles, loginPath])

  return { activeRoles, currentRole, selectRole, user, loading, logout }
}
