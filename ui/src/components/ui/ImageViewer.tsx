'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

export interface ImageViewerProps {
  src: string
  alt?: string
  isOpen: boolean
  onClose: () => void
  useCredentials?: boolean
}

export function ImageViewer({ src, alt = 'Image', isOpen, onClose, useCredentials = false }: ImageViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [blobSrc, setBlobSrc] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 3))
    if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.5))
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  useEffect(() => {
    if (!isOpen) {
      setScale(1)
      setRotation(0)
      setBlobSrc(null)
      setImageLoading(false)
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !src || !useCredentials) return
    if (src.toLowerCase().split('?')[0].endsWith('.pdf')) return
    let cancelled = false
    setImageLoading(true)
    fetch(src, { credentials: 'include' })
      .then((res) => { if (!res.ok) throw new Error('Failed'); return res.blob() })
      .then((blob) => {
        if (!cancelled) {
          const url = URL.createObjectURL(blob)
          blobUrlRef.current = url
          setBlobSrc(url)
          setImageLoading(false)
        }
      })
      .catch(() => { if (!cancelled) { setBlobSrc(src); setImageLoading(false) } })
    return () => {
      cancelled = true
      if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    }
  }, [src, isOpen, useCredentials])

  if (!mounted || !isOpen) return null

  const isPdf = src.toLowerCase().split('?')[0].endsWith('.pdf')
  const displaySrc = useCredentials ? (blobSrc || '') : src

  const handleDownload = async () => {
    try {
      if (useCredentials) {
        const res = await fetch(src, { credentials: 'include' })
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = alt
        document.body.appendChild(a); a.click()
        document.body.removeChild(a); URL.revokeObjectURL(url)
      } else {
        const a = document.createElement('a')
        a.href = src; a.download = alt; a.target = '_blank'
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
      }
    } catch { window.open(src, '_blank') }
  }

  return createPortal(
    <div className="fixed inset-0 flex flex-col" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />

      {/* Header */}
      <div className="relative flex items-center justify-between px-4 py-3 bg-black/50" style={{ zIndex: 100001 }}>
        <span className="text-white text-sm font-medium truncate max-w-[50%]">{alt}</span>
        <div className="flex items-center gap-2">
          {!isPdf && (
            <>
              <button onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Zoom out (-)">
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-white text-sm min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale((s) => Math.min(s + 0.25, 3))} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Zoom in (+)">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={() => setRotation((r) => (r + 90) % 360)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Rotate">
                <RotateCw className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1" />
            </>
          )}
          <button onClick={handleDownload} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Download">
            <Download className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors" title="Close (Esc)">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-auto" style={{ zIndex: 100000 }}>
        {isPdf ? (
          <iframe src={src} title={alt} className="w-full h-full bg-white rounded-lg" style={{ maxWidth: '90vw', maxHeight: 'calc(100vh - 80px)' }} />
        ) : imageLoading ? (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displaySrc} alt={alt} className="max-w-[90vw] object-contain transition-transform duration-200"
            style={{ maxHeight: 'calc(100vh - 100px)', transform: `scale(${scale}) rotate(${rotation}deg)` }} />
        )}
      </div>
    </div>,
    document.body,
  )
}

export function useImageViewer() {
  const [state, setState] = useState({ isOpen: false, src: '', alt: '' })
  return {
    ...state,
    openViewer: (src: string, alt = 'Image') => setState({ isOpen: true, src, alt }),
    closeViewer: () => setState((prev) => ({ ...prev, isOpen: false })),
  }
}
