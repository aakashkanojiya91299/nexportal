'use client'

import React, { useState } from 'react'
import { cn } from '../../lib/cn'

// ── Social icon SVGs ─────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163Zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231ZM17.083 19.77h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface FooterSocialLink {
  label: string
  href: string
  icon: React.ReactNode
  brandColor: string
}

export interface PageFooterProps {
  organizationName?: string
  logoSrc?: string
  logoAlt?: string
  poweredByText?: string
  poweredByLogoSrc?: string
  poweredByHref?: string
  socialLinks?: FooterSocialLink[]
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: 'WhatsApp',  href: '#', icon: <WhatsAppIcon />,  brandColor: '#25D366' },
  { label: 'Facebook',  href: '#', icon: <FacebookIcon />,  brandColor: '#1877F2' },
  { label: 'Instagram', href: '#', icon: <InstagramIcon />, brandColor: '#E4405F' },
  { label: 'X',         href: '#', icon: <XIcon />,         brandColor: '#000000' },
]

function SocialIcon({ link }: { link: FooterSocialLink }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color:       hovered ? link.brandColor : undefined,
        borderColor: hovered ? `${link.brandColor}55` : undefined,
        boxShadow:   hovered ? `0 4px 12px ${link.brandColor}33` : undefined,
      }}
      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-150 hover:-translate-y-0.5"
    >
      {link.icon}
    </a>
  )
}

// ── PageFooter ───────────────────────────────────────────────────────────────

export function PageFooter({
  organizationName = 'My Portal',
  logoSrc,
  logoAlt = 'Logo',
  poweredByText = 'Powered by',
  poweredByLogoSrc,
  poweredByHref = '#',
  socialLinks = DEFAULT_SOCIAL_LINKS,
  className,
  style,
}: PageFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className={cn('shrink-0 px-3 pb-3', className)} style={style}>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          {/* Left: org name + copyright */}
          <div className="flex items-center gap-2 min-w-0">
            {logoSrc && <img src={logoSrc} alt={logoAlt} className="w-6 h-6 object-contain shrink-0" />}
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-gray-700">{organizationName}</span>
              <span className="text-[10px] text-gray-400">&copy; {year} &middot; All rights reserved</span>
            </div>
          </div>

          {/* Center: social icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((l) => <SocialIcon key={l.label} link={l} />)}
            </div>
          )}

          {/* Right: powered by */}
          {poweredByHref && (
            <a
              href={poweredByHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:opacity-70 transition-opacity shrink-0"
            >
              <span>{poweredByText}</span>
              {poweredByLogoSrc && <img src={poweredByLogoSrc} alt="powered by" className="h-4 w-auto" />}
            </a>
          )}
        </div>
        <div className="tricolor-bar" />
      </div>
    </footer>
  )
}
