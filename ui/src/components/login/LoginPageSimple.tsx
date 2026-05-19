'use client'

import React, { useState, useCallback } from 'react'
import {
  motion, AnimatePresence,
  useMotionValue, useSpring,
} from 'framer-motion'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { LoginCard } from './LoginCard'
import { LoginHeader } from './LoginHeader'
import { ParticleBg } from './ParticleBg'
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

  onSubmit: (creds: { email: string; password: string }) => Promise<{ role?: string }>
  isLoading: boolean
  error: string | null

  roles?: RoleOption[]
  onRoleSelect?: (roleKey: string) => void

  registerLinks?: RegisterLink[]

  className?: string
  style?: React.CSSProperties
}

function useParallax() {
  const nx = useMotionValue(0.5)
  const ny = useMotionValue(0.5)
  const sx = useSpring(nx, { stiffness: 45, damping: 18 })
  const sy = useSpring(ny, { stiffness: 45, damping: 18 })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    nx.set(e.clientX / window.innerWidth)
    ny.set(e.clientY / window.innerHeight)
  }, [nx, ny])

  return { sx, sy, onMouseMove }
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
  const { onMouseMove } = useParallax()

  const displayError = error ?? validationError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    if (!email.trim())    { setValidationError('Email is required'); return }
    if (!password.trim()) { setValidationError('Password is required'); return }
    const result = await onSubmit({ email: email.trim(), password })
    if (result?.role === 'both' && roles?.length) setShowRoleSplash(true)
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
      className={cn('relative h-screen overflow-hidden flex items-center justify-center', className)}
      style={style}
      onMouseMove={onMouseMove}
    >
      {/* Animated mesh background */}
      <div className="login-bg" />
      <div className="login-bg-grid" />

      {/* Ambient orbs */}
      <div className="login-parallax-orbs">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
        <div className="login-bg-orb login-bg-orb-3" />
      </div>

      {/* Particle canvas */}
      <ParticleBg />

      {/* Center content */}
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center">

        {/* Logo + title */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full mb-6"
        >
          <LoginHeader
            logoSrc={logoSrc}
            logoAlt={logoAlt}
            projectName={projectName}
            projectSubtitle={projectSubtitle}
          />
        </motion.div>

        {/* Login card — shimmer tricolor top + bottom */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full"
        >
          <LoginCard>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

              <AnimatePresence>
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{displayError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-11"
                  isLoading={isLoading}
                >
                  {!isLoading && (
                    <span className="flex items-center justify-center gap-2">
                      Sign In <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </LoginCard>
        </motion.div>

        {/* Register / extra links */}
        {registerLinks && registerLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-5 flex flex-row items-center justify-center gap-3 flex-wrap"
          >
            {registerLinks.map(({ label, href }, i) => (
              <div key={href} className="flex items-center gap-3">
                {i > 0 && <span className="text-gray-300 text-sm">|</span>}
                <a
                  href={href}
                  className="text-[13px] font-semibold hover:underline transition-colors duration-150"
                  style={{ color: 'var(--primary, #000080)' }}
                >
                  {label}
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
