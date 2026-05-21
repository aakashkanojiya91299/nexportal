export interface JwtPayload {
  sub: string | number
  [key: string]: unknown
}

export interface AuthUser {
  id: string | number
  [key: string]: unknown
}

export interface JwtMiddlewareConfig {
  cookieName: string
  jwtSecret: string
  /** Paths that require authentication. Supports prefix matching. */
  protectedPaths: string[]
  /** Where to redirect unauthenticated users. Default: '/login' */
  loginPath?: string
  /**
   * Where to redirect an already-authenticated user who lands on `loginPath`.
   * Respects the `?redirect=` query param when present.
   * If omitted, authenticated users on the login page are not redirected.
   */
  redirectAuthenticatedTo?: string
}

export interface MultiRoleMiddlewareConfig {
  roles: string[]
  /** Cookie will be `${cookiePrefix}${role}_token`. Default: '' */
  cookiePrefix?: string
  protectedPaths: string[]
  /** Where to redirect unauthenticated users. Default: '/login' */
  loginPath?: string
  /**
   * Where to redirect an already-authenticated user who lands on `loginPath`.
   * Respects the `?redirect=` query param when present.
   * If omitted, authenticated users on the login page are not redirected.
   */
  redirectAuthenticatedTo?: string
}

export interface UseJwtAuthOptions {
  /** API route that returns the current user. Default: '/api/auth/user' */
  userApiPath?: string
  /** Redirect to this path on 401. Default: '/login' */
  loginPath?: string
  /** Polling interval ms. Default: 300_000 (5 min) */
  validateInterval?: number
  /**
   * sessionStorage key used to persist user across remounts (back nav, Strict Mode).
   * Set to null to disable caching. Default: 'jwt_auth_user'
   */
  cacheKey?: string | null
}

export interface UseJwtAuthResult {
  user: AuthUser | null
  loading: boolean
  authenticated: boolean
  logout: () => Promise<void>
}

export interface UseMultiRoleAuthOptions {
  roles: string[]
  cookiePrefix?: string
  userApiPath?: string
  loginPath?: string
}

export interface UseMultiRoleAuthResult {
  activeRoles: string[]
  currentRole: string | null
  selectRole: (role: string) => void
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

export interface SessionRouteConfig {
  cookieName: string
  /** Cookie max-age in seconds. Default: 7 days */
  maxAge?: number
}

export interface LaravelAuthOptions {
  userApiPath?: string
  laravelUrl: string
  loginPath?: string
  validateInterval?: number
}
