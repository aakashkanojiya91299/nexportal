import type { Config } from 'tailwindcss'
import { join } from 'path'

/**
 * @lucifer91299/ui Tailwind preset
 *
 * Usage in tailwind.config.ts:
 *   presets: [require('@lucifer91299/ui/tailwind/preset')]
 *
 * Override any token by extending in your own theme — the preset uses `extend`
 * so your project colors are merged, not replaced.
 *
 * Color tokens use CSS variables so ThemeProvider can swap them at runtime:
 *   --primary, --accent, --success (and their -soft, -rgb variants)
 */

const preset: Config = {
  // Scan SDK's own dist bundle so all utility classes used in components are generated
  content: [
    join(__dirname, '..', 'index.js'),
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette ─────────────────────────────────────────────────────
        // Values are CSS var references so ThemeProvider can override at runtime.
        // Fallback values match the default theme (dark navy / saffron / green).
        primary: 'var(--primary, #000080)',
        'primary-soft': 'var(--primary-soft, rgba(0,0,128,0.12))',
        'primary-hover': 'var(--primary-hover, rgba(0,0,128,0.9))',

        accent: 'var(--accent, #FF9933)',
        'accent-soft': 'var(--accent-soft, rgba(255,153,51,0.12))',
        'accent-hover': 'var(--accent-hover, rgba(255,153,51,0.9))',

        success: 'var(--success, #138808)',
        'success-soft': 'var(--success-soft, rgba(19,136,8,0.12))',
        'success-hover': 'var(--success-hover, rgba(19,136,8,0.9))',

        // ── Surface hierarchy ─────────────────────────────────────────────────
        surface: {
          primary:   '#ffffff',
          secondary: '#f5f5f7',
          tertiary:  '#fbfbfd',
        },

        // ── Text hierarchy ────────────────────────────────────────────────────
        label: {
          primary:   '#1d1d1f',
          secondary: '#86868b',
          tertiary:  '#aeaeb2',
        },

        // ── Dividers ──────────────────────────────────────────────────────────
        separator: {
          DEFAULT: 'rgba(0, 0, 0, 0.06)',
          opaque:  '#d2d2d7',
        },
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: [
          'var(--font-sans, Inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },

      // Apple HIG-inspired type scale
      fontSize: {
        display:  ['38px', { lineHeight: '1.08',  letterSpacing: '-0.003em', fontWeight: '600' }],
        title1:   ['22px', { lineHeight: '1.14',  letterSpacing: '0.007em',  fontWeight: '600' }],
        title2:   ['18px', { lineHeight: '1.18',  letterSpacing: '0.016em',  fontWeight: '600' }],
        title3:   ['16px', { lineHeight: '1.2',   letterSpacing: '0.012em',  fontWeight: '600' }],
        headline: ['14px', { lineHeight: '1.29',  letterSpacing: '-0.022em', fontWeight: '600' }],
        body:     ['14px', { lineHeight: '1.47',  letterSpacing: '-0.022em', fontWeight: '400' }],
        callout:  ['13px', { lineHeight: '1.38',  letterSpacing: '-0.02em',  fontWeight: '400' }],
        subhead:  ['12px', { lineHeight: '1.33',  letterSpacing: '-0.016em', fontWeight: '400' }],
        footnote: ['11px', { lineHeight: '1.38',  letterSpacing: '-0.006em', fontWeight: '400' }],
        caption1: ['10px', { lineHeight: '1.33',  letterSpacing: '0',        fontWeight: '400' }],
        caption2: ['9px',  { lineHeight: '1.27',  letterSpacing: '0.006em',  fontWeight: '400' }],
      },

      // ── Border radius — Apple HIG scale ──────────────────────────────────
      borderRadius: {
        sm:   '8px',
        DEFAULT: '12px',
        md:   '14px',
        lg:   '16px',
        xl:   '20px',
        '2xl':'28px',
        full: '9999px',
      },

      // ── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        sm:   '0 1px 2px rgba(0, 0, 0, 0.04)',
        DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md:   '0 4px 16px rgba(0, 0, 0, 0.08)',
        lg:   '0 8px 32px rgba(0, 0, 0, 0.1)',
        xl:   '0 16px 48px rgba(0, 0, 0, 0.12)',
        none: 'none',
      },

      // ── Easing ────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        reveal: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      // ── Animation durations ───────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '200ms',
        fast:    '150ms',
        slow:    '300ms',
        slower:  '500ms',
      },

      // ── Keyframe animations ───────────────────────────────────────────────
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        stepForward: {
          from: { opacity: '0', transform: 'translateX(28px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        stepBackward: {
          from: { opacity: '0', transform: 'translateX(-28px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        loginReveal: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        tricolorSweep: {
          from: { transform: 'scaleX(0)' },
          to:   { transform: 'scaleX(1)' },
        },
        meshMove: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        orbDrift1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)',        opacity: '0.55' },
          '25%':      { transform: 'translate(60px, -50px) scale(1.15)', opacity: '0.7' },
          '50%':      { transform: 'translate(20px, 40px) scale(0.9)',  opacity: '0.45' },
          '75%':      { transform: 'translate(-40px, -20px) scale(1.1)', opacity: '0.65' },
        },
        orbDrift2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)',         opacity: '0.5' },
          '25%':      { transform: 'translate(-50px, 40px) scale(1.1)', opacity: '0.65' },
          '50%':      { transform: 'translate(30px, -60px) scale(0.95)', opacity: '0.4' },
          '75%':      { transform: 'translate(50px, 20px) scale(1.12)', opacity: '0.6' },
        },
        orbDrift3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)',           opacity: '0.4' },
          '33%':      { transform: 'translate(-30px, -45px) scale(1.08)', opacity: '0.55' },
          '66%':      { transform: 'translate(40px, 30px) scale(0.92)',   opacity: '0.5' },
        },
        scannerSweep: {
          '0%, 100%': { top: '2%',  opacity: '0.3' },
          '50%':      { top: '98%', opacity: '1' },
        },
      },

      animation: {
        'fade-in':       'fadeIn 0.2s ease-smooth',
        'slide-up':      'slideUp 0.3s ease-smooth',
        'scale-in':      'scaleIn 0.2s ease-spring',
        'step-forward':  'stepForward 0.32s ease-smooth both',
        'step-backward': 'stepBackward 0.32s ease-smooth both',
        'mesh-move':     'meshMove 20s ease infinite',
        'orb-1':         'orbDrift1 16s ease-in-out infinite',
        'orb-2':         'orbDrift2 18s ease-in-out infinite',
        'orb-3':         'orbDrift3 14s ease-in-out infinite',
        'scanner-sweep': 'scannerSweep 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default preset
