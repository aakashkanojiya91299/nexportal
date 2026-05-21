'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { AuthUser, UseJwtAuthOptions, UseJwtAuthResult } from '../auth/types'

const DEFAULT_VALIDATE_INTERVAL = 5 * 60 * 1000 // 5 min

/**
 * Hook for JWT httpOnly cookie authentication.
 *
 * On mount: calls `userApiPath` to check the current session.
 * Every `validateInterval` ms: re-validates.
 * On 401: redirects to `loginPath`.
 *
 * @example
 * const { user, authenticated, loading, logout } = useJwtAuth({
 *   userApiPath: '/api/auth/user',
 *   loginPath: '/login',
 * })
 */
export function useJwtAuth({
  userApiPath = '/api/auth/user',
  loginPath = '/login',
  validateInterval = DEFAULT_VALIDATE_INTERVAL,
  cacheKey = 'jwt_auth_user',
}: UseJwtAuthOptions = {}): UseJwtAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  const cacheUser = useCallback((data: AuthUser | null) => {
    if (!cacheKey || typeof window === 'undefined') return
    if (data) sessionStorage.setItem(cacheKey, JSON.stringify(data))
    else sessionStorage.removeItem(cacheKey)
  }, [cacheKey])

  const validate = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(userApiPath, { signal: controller.signal, credentials: 'include' })
      if (res.status === 401) {
        setUser(null)
        cacheUser(null)
        if (typeof window !== 'undefined') {
          window.location.href = `${loginPath}?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        return
      }
      if (!res.ok) { setUser(null); cacheUser(null); return }
      const data = (await res.json()) as AuthUser
      setUser(data)
      cacheUser(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [userApiPath, loginPath, cacheUser])

  // Seed from sessionStorage after hydration so the UI shows the cached name
  // immediately without waiting for validate() — no SSR mismatch since this
  // runs only on the client after React has reconciled the server HTML.
  useEffect(() => {
    if (!cacheKey) return
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) setUser(prev => prev ?? (JSON.parse(cached) as AuthUser))
    } catch { /* ignore */ }
  }, [cacheKey])

  useEffect(() => {
    validate()
    const id = setInterval(validate, validateInterval)
    return () => {
      clearInterval(id)
      abortRef.current?.abort()
    }
  }, [validate, validateInterval])

  const logout = useCallback(async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }) } catch { /* ignore */ }
    setUser(null)
    cacheUser(null)
    if (typeof window !== 'undefined') window.location.href = loginPath
  }, [loginPath, cacheUser])

  return { user, loading, authenticated: user !== null, logout }
}
