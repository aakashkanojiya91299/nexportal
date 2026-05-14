'use client'

import React, { useEffect, useRef } from 'react'
import { useTheme } from '../../theme/ThemeProvider'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number; opacity: number
  color: string
}

export function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = [theme.primary, theme.accent, theme.success]
    const particles: Particle[] = []
    let animId: number

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const rand = (min: number, max: number) => Math.random() * (max - min) + min
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `${r},${g},${b}`
    }

    for (let i = 0; i < 40; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      particles.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        vx: rand(-0.2, 0.2),
        vy: rand(-0.2, 0.2),
        r: rand(1, 2.5),
        opacity: rand(0.2, 0.5),
        color: color.startsWith('#') ? hexToRgb(color) : '0,0,128',
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [theme.primary, theme.accent, theme.success])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
