'use client'

import { LoginPage } from '@lucifer91299/ui'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginAnimated() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (creds: { identifier: string; password: string }) => {
    setError(null)
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: creds.identifier, password: creds.password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Invalid credentials'); return }
      router.replace('/dashboard')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoginPage
      projectName="Portal Demo"
      projectSubtitle="Animated login — orbs + particles + tricolor"
      logoSrc="/brand/logo.svg"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
      poweredBy={{ logoSrc: '/brand/powered-by.svg', text: 'Powered by @lucifer91299/ui' }}
    />
  )
}
