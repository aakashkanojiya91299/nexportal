'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { AuthUser, LaravelAuthOptions, UseJwtAuthResult } from '../auth/types'

const DEFAULT_VALIDATE_INTERVAL = 5 * 60 * 1000

/**
 * Hook for Laravel session-based authentication.
 *
 * Calls your Next.js `/api/auth/user` route (which uses `laravel-session-sdk`
 * to validate the `laravel_session` cookie against the Laravel session store).
 *
 * On 401: redirects to the Laravel login page.
 *
 * Requires `laravel-session-sdk` to be installed in the host project and wired
 * up in the user API route. This hook itself has no direct dependency on the SDK.
 *
 * @example
 * const { user, authenticated, loading, logout } = useLaravelSessionAuth({
 *   laravelUrl: process.env.NEXT_PUBLIC_LARAVEL_URL!,
 * })
 */
export function useLaravelSessionAuth({
  userApiPath = '/api/auth/user',
  laravelUrl,
  loginPath,
  validateInterval = DEFAULT_VALIDATE_INTERVAL,
}: LaravelAuthOptions): UseJwtAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  const redirectToLogin = useCallback(() => {
    if (typeof window === 'undefined') return
    const dest = loginPath ?? `${laravelUrl}/login`
    window.location.href = dest
  }, [laravelUrl, loginPath])

  const validate = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(userApiPath, { signal: controller.signal, credentials: 'include' })
      if (res.status === 401) { setUser(null); redirectToLogin(); return }
      if (!res.ok) { setUser(null); return }
      const data = (await res.json()) as AuthUser
      setUser(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [userApiPath, redirectToLogin])

  useEffect(() => {
    validate()
    const id = setInterval(validate, validateInterval)
    return () => { clearInterval(id); abortRef.current?.abort() }
  }, [validate, validateInterval])

  const logout = useCallback(async () => {
    setUser(null)
    redirectToLogin()
  }, [redirectToLogin])

  return { user, loading, authenticated: user !== null, logout }
}
