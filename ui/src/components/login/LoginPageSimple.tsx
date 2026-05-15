'use client'

import React, { useState, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { BrandLogo } from '../layout/BrandLogo'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { RoleSelectSplash, type RoleOption } from './RoleSelectSplash'

export interface RegisterLink {
  label: string
  href: string
}

export interface LoginPageSimpleProps {
  projectName: string
  projectSubtitle?: string
  logoSrc: string
  logoAlt?: string

  /** Called on submit — return { role } when multiple roles are possible */
  onSubmit: (creds: { email: string; password: string }) => Promise<{ role?: string }>
  isLoading: boolean
  error: string | null

  /** If provided, shown as role-select splash when login returns role='both' or multiple */
  roles?: RoleOption[]
  onRoleSelect?: (roleKey: string) => void

  /** Extra links below the form (e.g. register coach, set password) */
  registerLinks?: RegisterLink[]

  className?: string
  style?: React.CSSProperties
}

export function LoginPageSimple({
  projectName,
  projectSubtitle = 'Sign in to your account',
  logoSrc,
  logoAlt,
  onSubmit,
  isLoading,
  error,
  roles,
  onRoleSelect,
  registerLinks,
  className,
  style,
}: LoginPageSimpleProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showRoleSplash, setShowRoleSplash] = useState(false)

  const displayError = error ?? validationError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    if (!email.trim())    { setValidationError('Email is required'); return }
    if (!password.trim()) { setValidationError('Password is required'); return }

    const result = await onSubmit({ email: email.trim(), password })
    if (result?.role === 'both' && roles?.length) {
      setShowRoleSplash(true)
    }
  }

  if (showRoleSplash && roles?.length && onRoleSelect) {
    return (
      <RoleSelectSplash
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        projectName={projectName}
        roles={roles}
        onSelect={onRoleSelect}
      />
    )
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-surface-secondary to-white flex items-center justify-center p-4',
        className,
      )}
      style={style}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="lg" />
          </div>
          <h1 className="text-title2 font-semibold" style={{ color: 'var(--primary, #000080)' }}>
            {projectName}
          </h1>
          <p className="text-body text-gray-600 mt-1">{projectSubtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            {displayError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{displayError}</p>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {registerLinks && registerLinks.length > 0 && (
            <div className="mt-6 space-y-2 text-center">
              {registerLinks.map(({ label, href }) => (
                <p key={href} className="text-subhead text-label-secondary">
                  <a
                    href={href}
                    className="font-medium hover:underline"
                    style={{ color: 'var(--primary, #000080)' }}
                  >
                    {label}
                  </a>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
