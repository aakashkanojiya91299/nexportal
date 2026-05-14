'use client'

import { LoginPageSimple } from '@nexportal/ui'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginSimple() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (creds: { email: string; password: string }): Promise<{ role?: string }> => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid credentials'); return {} }
      router.replace('/dashboard')
      return {}
    } catch {
      setError('Login failed. Please try again.')
      return {}
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoginPageSimple
      projectName="Portal Demo"
      projectSubtitle="Simple login — clean gradient card"
      logoSrc="/brand/logo.svg"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  )
}
