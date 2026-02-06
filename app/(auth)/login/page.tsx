'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { LoginForm } from '@/lib/components/auth/LoginForm/LoginForm'
import { useAuth } from '@/lib/context/AuthContext'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/courses')
    }
  }, [user, loading, router])

  if (loading || user) return null

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <LoginForm />
    </div>
  )
}
