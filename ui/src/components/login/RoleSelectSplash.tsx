'use client'

import React, { type ReactNode } from 'react'
import { BrandLogo } from '../layout/BrandLogo'

export interface RoleOption {
  key: string
  label: string
  description: string
  icon: ReactNode
}

export interface RoleSelectSplashProps {
  logoSrc: string
  logoAlt?: string
  projectName: string
  message?: string
  roles: RoleOption[]
  onSelect: (roleKey: string) => void
}

export function RoleSelectSplash({
  logoSrc,
  logoAlt,
  projectName,
  message = 'You have multiple roles. Choose how to continue.',
  roles,
  onSelect,
}: RoleSelectSplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-secondary to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="lg" />
          </div>
          <h1 className="text-title2 font-semibold" style={{ color: 'var(--primary, #000080)' }}>
            {projectName}
          </h1>
          <p className="text-body text-label-secondary mt-1">{message}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => onSelect(role.key)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200"
              style={{
                borderColor: 'var(--primary-soft, rgba(0,0,128,0.2))',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary, #000080)'
                e.currentTarget.style.background = 'var(--primary-soft, rgba(0,0,128,0.05))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-soft, rgba(0,0,128,0.2))'
                e.currentTarget.style.background = ''
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--primary-soft, rgba(0,0,128,0.1))' }}
              >
                <span style={{ color: 'var(--primary, #000080)' }}>
                  {role.icon}
                </span>
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--primary, #000080)' }}>
                  {role.label}
                </p>
                <p className="text-subhead text-label-secondary mt-0.5">{role.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
