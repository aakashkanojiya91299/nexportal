'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Upload, X, FileText, Image, File } from 'lucide-react'
import { cn } from '../../lib/cn'

function formatBytes(bytes: number): string {
  if (bytes < 1024)           return `${bytes} B`
  if (bytes < 1024 * 1024)    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ file }: { file: File }) {
  if (file.type.startsWith('image/'))          return <Image    className="w-4 h-4 text-blue-500" />
  if (file.type === 'application/pdf')         return <FileText className="w-4 h-4 text-red-500"  />
  return <File className="w-4 h-4 text-gray-400" />
}

export interface FileUploadProps {
  label?: string
  helperText?: string
  error?: string
  /** e.g. "image/*,.pdf" */
  accept?: string
  multiple?: boolean
  /** Max file size in bytes */
  maxSize?: number
  onChange?: (files: File[]) => void
  className?: string
  style?: React.CSSProperties
}

export function FileUpload({
  label,
  helperText,
  error,
  accept,
  multiple,
  maxSize,
  onChange,
  className,
  style,
}: FileUploadProps) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [files,    setFiles]    = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [sizeErr,  setSizeErr]  = useState<string | null>(null)

  const addFiles = useCallback((list: FileList | null) => {
    if (!list) return
    const arr = Array.from(list)
    if (maxSize) {
      const bad = arr.find(f => f.size > maxSize)
      if (bad) { setSizeErr(`"${bad.name}" exceeds the ${formatBytes(maxSize)} limit`); return }
    }
    setSizeErr(null)
    const next = multiple ? [...files, ...arr] : arr.slice(0, 1)
    setFiles(next)
    onChange?.(next)
  }, [files, multiple, maxSize, onChange])

  function remove(i: number) {
    const next = files.filter((_, idx) => idx !== i)
    setFiles(next)
    onChange?.(next)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const displayError = error || sizeErr

  return (
    <div className={cn('flex flex-col gap-1.5', className)}
        style={style}>
      {label && (
        <span className="text-footnote font-medium text-label-primary">{label}</span>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 cursor-pointer transition-colors',
          dragging
            ? 'border-[color:var(--primary,#000080)] bg-[color:var(--primary,#000080)]/5'
            : displayError
            ? 'border-red-300 bg-red-50/40 hover:bg-red-50/70'
            : 'border-gray-300 bg-gray-50/50 hover:border-[color:var(--primary,#000080)]/60 hover:bg-[color:var(--primary,#000080)]/5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={e => addFiles(e.target.files)}
        />
        <Upload className={cn('w-7 h-7', displayError ? 'text-red-400' : 'text-label-tertiary')} />
        <div className="text-center pointer-events-none">
          <p className="text-callout font-medium text-label-primary">
            {dragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-[11px] text-label-tertiary mt-0.5">
            or{' '}
            <span className="text-[color:var(--primary,#000080)] font-medium">click to browse</span>
            {maxSize ? ` · max ${formatBytes(maxSize)}` : ''}
            {accept  ? ` · ${accept}` : ''}
          </p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-0.5">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 py-2">
              <FileIcon file={file} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-label-primary truncate">{file.name}</p>
                <p className="text-[10px] text-label-tertiary">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); remove(i) }}
                className="p-0.5 rounded text-label-tertiary hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {(displayError || helperText) && (
        <p className={cn('text-[11px]', displayError ? 'text-red-500' : 'text-label-tertiary')}>
          {displayError || helperText}
        </p>
      )}
    </div>
  )
}
