'use client'

import React from 'react'
import { BrandLogo } from '../layout/BrandLogo'
import { cn } from '../../lib/cn'

interface LoginHeaderProps {
  logoSrc: string
  logoAlt?: string
  projectName: string
  projectSubtitle?: string
  className?: string
}

export function LoginHeader({ logoSrc, logoAlt, projectName, projectSubtitle, className }: LoginHeaderProps) {
  return (
    <div className={cn('flex flex-row items-center justify-center gap-4 mb-8 login-stagger-1', className)}>
      <BrandLogo src={logoSrc} alt={logoAlt ?? projectName} size="lg" className="flex-shrink-0" />
      <div className="flex flex-col">
        <h1 className="text-title1 font-semibold text-label-primary login-stagger-2 leading-tight"
            style={{ color: 'var(--primary, #000080)' }}>
          {projectName}
        </h1>
        {projectSubtitle && (
          <p className="text-body text-label-secondary mt-0.5 login-stagger-2">{projectSubtitle}</p>
        )}
      </div>
    </div>
  )
}
