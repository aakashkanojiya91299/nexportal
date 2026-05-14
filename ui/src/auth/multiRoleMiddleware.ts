import type { NextRequest } from 'next/server'
import type { MultiRoleMiddlewareConfig } from './types'

/**
 * Factory: returns a Next.js middleware function that passes the request if
 * ANY of the expected role cookies is a valid JWT.
 *
 * @example
 * // src/middleware.ts
 * import { multiRoleMiddleware } from '@nexportal/ui'
 * export default multiRoleMiddleware({
 *   roles: ['coach', 'judge'],
 *   cookiePrefix: 'portal_',
 *   protectedPaths: ['/dashboard'],
 *   loginPath: '/login',
 * })
 */
export function multiRoleMiddleware({
  roles,
  cookiePrefix = '',
  protectedPaths,
  loginPath = '/login',
}: MultiRoleMiddlewareConfig) {
  return async function middleware(request: NextRequest) {
    const { NextResponse } = await import('next/server')
    const { pathname } = request.nextUrl

    const isProtected = protectedPaths.some(
      (p) => pathname === p || pathname.startsWith(p + '/'),
    )
    if (!isProtected) return NextResponse.next()

    const hasValidToken = roles.some((role) => {
      const cookieName = `${cookiePrefix}${role}_token`
      return !!request.cookies.get(cookieName)?.value
    })

    if (hasValidToken) return NextResponse.next()

    const url = request.nextUrl.clone()
    url.pathname = loginPath
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
}
