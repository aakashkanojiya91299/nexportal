import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import type { JwtMiddlewareConfig } from './types'

/**
 * Factory: returns a Next.js middleware function that guards protected paths
 * using a JWT stored in an httpOnly cookie.
 *
 * @example
 * // src/middleware.ts
 * import { jwtMiddleware } from '@nexportal/ui'
 * export default jwtMiddleware({
 *   cookieName: 'access_token',
 *   jwtSecret: process.env.JWT_SECRET!,
 *   protectedPaths: ['/dashboard'],
 *   loginPath: '/login',
 * })
 * export const config = { matcher: ['/((?!_next|favicon.ico|api/auth).*)'] }
 */
export function jwtMiddleware({
  cookieName,
  jwtSecret,
  protectedPaths,
  loginPath = '/login',
}: JwtMiddlewareConfig) {
  return async function middleware(request: NextRequest) {
    const { NextResponse } = await import('next/server')
    const { pathname } = request.nextUrl

    const isProtected = protectedPaths.some(
      (p) => pathname === p || pathname.startsWith(p + '/'),
    )
    if (!isProtected) return NextResponse.next()

    const token = request.cookies.get(cookieName)?.value
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = loginPath
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(jwtSecret))
      return NextResponse.next()
    } catch {
      const url = request.nextUrl.clone()
      url.pathname = loginPath
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }
}
