import type { SessionRouteConfig } from './types'

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Factory: returns Next.js App Router route handlers for setting and clearing
 * an httpOnly JWT cookie on the same domain as your Next.js app.
 *
 * @example
 * // src/app/api/auth/session/route.ts
 * import { sessionRoute } from '@nexportal/ui'
 * export const { POST, DELETE } = sessionRoute({ cookieName: 'access_token' })
 */
export function sessionRoute({ cookieName, maxAge = DEFAULT_MAX_AGE }: SessionRouteConfig) {
  async function POST(request: Request) {
    const { NextResponse } = await import('next/server')
    try {
      const { token } = (await request.json()) as { token?: string }
      if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

      const res = NextResponse.json({ ok: true })
      res.cookies.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
      })
      return res
    } catch {
      return NextResponse.json({ error: 'bad request' }, { status: 400 })
    }
  }

  async function DELETE() {
    const { NextResponse } = await import('next/server')
    const res = NextResponse.json({ ok: true })
    res.cookies.set(cookieName, '', { maxAge: 0, path: '/' })
    return res
  }

  return { POST, DELETE }
}

/**
 * Alias: factory for just the logout route (DELETE + POST both clear the cookie).
 *
 * @example
 * // src/app/api/auth/logout/route.ts
 * import { logoutRoute } from '@nexportal/ui'
 * export const { POST } = logoutRoute({ cookieName: 'access_token' })
 */
export function logoutRoute({ cookieName }: Pick<SessionRouteConfig, 'cookieName'>) {
  async function POST() {
    const { NextResponse } = await import('next/server')
    const res = NextResponse.json({ ok: true })
    res.cookies.set(cookieName, '', { maxAge: 0, path: '/' })
    return res
  }
  return { POST }
}
