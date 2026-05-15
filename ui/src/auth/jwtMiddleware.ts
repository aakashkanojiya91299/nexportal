import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { JwtMiddlewareConfig } from './types'

const SECRET_CACHE = new Map<string, Uint8Array>()

function encodeSecret(secret: string): Uint8Array {
  if (!SECRET_CACHE.has(secret)) {
    SECRET_CACHE.set(secret, new TextEncoder().encode(secret))
  }
  return SECRET_CACHE.get(secret)!
}

async function verifyJwt(token: string, secret: string): Promise<boolean> {
  try {
    await jwtVerify(token, encodeSecret(secret))
    return true
  } catch {
    return false
  }
}

/**
 * Factory: returns a Next.js proxy/middleware function that:
 *  - Guards `protectedPaths` — redirects unauthenticated users to `loginPath`
 *  - Optionally guards `loginPath` — redirects already-authenticated users to
 *    `redirectAuthenticatedTo` (or the `?redirect=` param when present)
 *
 * @example
 * // src/proxy.ts
 * import { jwtMiddleware } from '@lucifer91299/ui/server'
 * export default jwtMiddleware({
 *   cookieName: 'access_token',
 *   jwtSecret: process.env.JWT_SECRET!,
 *   protectedPaths: ['/dashboard'],
 *   loginPath: '/login',
 *   redirectAuthenticatedTo: '/dashboard',
 * })
 * export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'] }
 */
export function jwtMiddleware({
  cookieName,
  jwtSecret,
  protectedPaths,
  loginPath = '/login',
  redirectAuthenticatedTo,
}: JwtMiddlewareConfig) {
  return async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl
    const token = request.cookies.get(cookieName)?.value

    // Redirect authenticated users away from the login page
    if (redirectAuthenticatedTo && pathname === loginPath) {
      if (token && (await verifyJwt(token, jwtSecret))) {
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

    if (token && (await verifyJwt(token, jwtSecret))) {
      return NextResponse.next()
    }

    const url = request.nextUrl.clone()
    url.pathname = loginPath
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
}
