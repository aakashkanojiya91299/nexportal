import { jwtMiddleware } from '@nexportal/ui/server'

export default jwtMiddleware({
  cookieName:     'access_token',
  jwtSecret:      process.env.JWT_SECRET ?? 'demo-secret-key',
  protectedPaths: ['/dashboard'],
  loginPath:      '/login',
})

export const config = { matcher: ['/((?!_next|public|api).*)'] }
