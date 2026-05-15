import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { MultiRoleMiddlewareConfig } from './types'

/**
 * Factory: returns a Next.js proxy/middleware function that passes the request
 * if ANY of the expected role cookies is present, and optionally redirects
 * already-authenticated users away from the login page.
 *
 * @example
 * // src/proxy.ts
 * import { multiRoleMiddleware } from '@lucifer91299/ui/server'
 * export default multiRoleMiddleware({
 *   roles: ['coach', 'judge'],
 *   cookiePrefix: 'portal_',
 *   protectedPaths: ['/dashboard'],
 *   loginPath: '/login',
 *   redirectAuthenticatedTo: '/dashboard',
 * })
 * export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'] }
 */
export function multiRoleMiddleware({
  roles,
  cookiePrefix = '',
  protectedPaths,
  loginPath = '/login',
  redirectAuthenticatedTo,
}: MultiRoleMiddlewareConfig) {
  return async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl

    const hasAnyToken = roles.some((role) => {
      const cookieName = `${cookiePrefix}${role}_token`
      return !!request.cookies.get(cookieName)?.value
    })

    // Redirect authenticated users away from the login page
    if (redirectAuthenticatedTo && pathname === loginPath) {
      if (hasAnyToken) {
        const destination = searchParams.get('redirect') ?? redirectAuthenticatedTo
        return NextResponse.redirect(new URL(destination, request.url))
      }
      return NextResponse.next()
    }

    // Guard protected paths
    const isProtected = protectedPaths.some(
      (p) => pathname === p || pathname.startsWith(p + '/'),
    )
    if (!isProtected) return NextResponse.next()

    if (hasAnyToken) return NextResponse.next()

    const url = request.nextUrl.clone()
    url.pathname = loginPath
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
}
