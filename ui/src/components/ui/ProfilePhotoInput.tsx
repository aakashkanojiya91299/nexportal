'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { UserRound, Camera, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface ProfilePhotoInputProps {
  value: File | null
  onChange: (file: File | null) => void
  onInvalidFile?: (message: string) => void
  error?: string
  /** Square size in px — defaults to 112 */
  size?: number
  /** Max file size in MB — defaults to 5 */
  maxSizeMb?: number
  /** Accepted MIME types — defaults to image/jpeg, image/png, image/webp */
  accept?: string[]
  className?: string
}

function validateFile(file: File | null, maxBytes: number, allowed: Set<string>): string | null {
  if (!file) return null
  if (!allowed.has(file.type)) return `Unsupported file type. Allowed: ${[...allowed].map((t) => t.split('/')[1]).join(', ')}`
  if (file.size > maxBytes) return `File is too large. Max size: ${Math.round(maxBytes / 1024 / 1024)} MB`
  return null
}

export function ProfilePhotoInput({
  value, onChange, onInvalidFile, error, size = 112, maxSizeMb = 5,
  accept = ['image/jpeg', 'image/png', 'image/webp'], className,
}: ProfilePhotoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [internalError, setInternalError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!value) {
      setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null })
    }
  }, [value])

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const processFile = useCallback((file: File | null) => {
    setInternalError(null)
    const err = validateFile(file, maxSizeMb * 1024 * 1024, new Set(accept))
    if (err) { setInternalError(err); onInvalidFile?.(err); return }
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url })
    }
    onChange(file)
  }, [onChange, onInvalidFile, maxSizeMb, accept])

  const displayError = error || internalError

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files?.[0] ?? null) }}
          aria-label="Upload profile photo"
          style={{ width: size, height: size }}
          className={cn(
            'rounded-xl overflow-hidden border-2 transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
            'flex items-center justify-center cursor-pointer',
            previewUrl ? 'border-primary/40 shadow-md' : [
              'border-dashed border-separator-opaque bg-surface-secondary',
              'hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm',
            ],
            isDragging && 'border-primary bg-primary/8 scale-[1.03] shadow-md',
            displayError && !previewUrl && 'border-red-300 bg-red-50/40',
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Profile photo preview" className="w-full h-full object-cover" />
          ) : (
            <UserRound
              className={cn('transition-colors duration-200', displayError ? 'text-red-200' : 'text-label-quaternary')}
              style={{ width: size * 0.48, height: size * 0.48 }}
              strokeWidth={1.2}
            />
          )}
        </button>

        {!previewUrl && (
          <div className={cn('absolute bottom-0.5 right-0.5 rounded-full p-[5px] shadow pointer-events-none ring-2 ring-white', displayError ? 'bg-red-400 text-white' : 'bg-primary text-white')}>
            <Camera className="w-3 h-3" />
          </div>
        )}
        {previewUrl && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); setInternalError(null) }}
            aria-label="Remove photo"
            className="absolute -top-0.5 -right-0.5 rounded-full p-[5px] bg-white border border-separator-opaque shadow ring-1 ring-white/50 text-label-tertiary hover:text-red-500 hover:border-red-200 transition-colors duration-150"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          onChange={(e) => { processFile(e.target.files?.[0] ?? null); e.target.value = '' }}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      <div className="text-center space-y-0.5">
        {previewUrl ? (
          <p className="text-xs font-medium text-primary">Photo ready</p>
        ) : (
          <>
            <p className="text-xs font-semibold text-label-secondary">Profile Photo</p>
            <p className="text-[11px] text-label-tertiary leading-tight">JPEG / PNG / WebP · max {maxSizeMb} MB</p>
          </>
        )}
        {displayError && <p className="text-[11px] text-red-500 font-medium pt-0.5">{displayError}</p>}
      </div>
    </div>
  )
}
