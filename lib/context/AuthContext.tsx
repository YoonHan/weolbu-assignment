'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { getMeInternal } from '@/lib/apis/auth-internal'
import { UserInfo } from '@/lib/types/api/auth'

interface AuthContextType {
  user: UserInfo | null
  loading: boolean
  setUser: (user: UserInfo | null) => void
  setLoading: (loading: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const hydrate = async () => {
      try {
        const userObj = await getMeInternal()
        setUser(userObj)
      } catch {
        // 인증 실패 시 로그인 화면으로 이동 (로그인/회원가입 페이지 제외)
        if (pathname !== '/login' && pathname !== '/signup') {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    hydrate()
  }, [router, pathname])

  return (
    <AuthContext.Provider value={{ user, loading, setUser, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
