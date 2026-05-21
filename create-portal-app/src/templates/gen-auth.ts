import type { ScaffoldOptions } from './types'

export function genLoginRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

// Demo credentials — replace with a real backend call
const DEMO_EMAIL    = 'admin@demo.com'
const DEMO_PASSWORD = 'password123'
const DEMO_USER     = { id: 1, name: 'Admin User', role: 'Admin', email: DEMO_EMAIL }

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string }

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'change-me-in-production')
  const token  = await new SignJWT({ sub: String(DEMO_USER.id), ...DEMO_USER })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('${cookieName}', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return res
}
`
}

export function genUserRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const store = await cookies()
  const token = store.get('${cookieName}')?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'change-me-in-production')
    const { payload } = await jwtVerify(token, secret)
    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
`
}

export function genMiddleware(o: ScaffoldOptions): string {
  if (o.authMode === 'multi-role') {
    const rolesArr = (o.roles ?? ['admin']).map((r) => `'${r}'`).join(', ')
    return `import { multiRoleMiddleware } from '@lucifer91299/ui/server'

export default multiRoleMiddleware({
  roles: [${rolesArr}],
  cookiePrefix: 'portal_',
  protectedPaths: ['/dashboard'],
  loginPath: '/login',
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
`
  }

  if (o.authMode === 'laravel') {
    return `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/dashboard']
const LOGIN = '/login'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))
  if (!isProtected) return NextResponse.next()
  const session = request.cookies.get('laravel_session')?.value
  if (!session) return NextResponse.redirect(new URL(\`\${LOGIN}?redirect=\${pathname}\`, request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
`
  }

  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { jwtMiddleware } from '@lucifer91299/ui/server'

export default jwtMiddleware({
  cookieName: '${cookieName}',
  jwtSecret: process.env.JWT_SECRET!,
  protectedPaths: ['/dashboard'],
  loginPath: '/login',
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
`
}

export function genSessionRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { sessionRoute } from '@lucifer91299/ui/server'
export const { POST, DELETE } = sessionRoute({ cookieName: '${cookieName}' })
`
}

export function genLogoutRoute(o: ScaffoldOptions): string {
  const cookieName = o.jwtCookieName ?? 'access_token'
  return `import { logoutRoute } from '@lucifer91299/ui/server'
export const { POST } = logoutRoute({ cookieName: '${cookieName}' })
`
}

export function genForgotPasswordRoute(): string {
  return `import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string }
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

  // TODO: look up user, generate secure token, send reset email
  // Always return 200 to avoid leaking whether the email exists.
  return NextResponse.json({ ok: true })
}
`
}

export function genResetPasswordRoutes(): string {
  return `import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token, password } = (await request.json()) as { token?: string; password?: string }
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
  }

  // TODO: validate token, hash new password, update user, invalidate token
  return NextResponse.json({ ok: true })
}
`
}

export function genResetPasswordValidateRoute(): string {
  return `import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ valid: false })

  // TODO: validate token against your store
  return NextResponse.json({ valid: token.length > 0 })
}
`
}

export function genApiClient(_o: ScaffoldOptions): string {
  return `import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  withCredentials: true,
  timeout: 15000,
})

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
`
}
