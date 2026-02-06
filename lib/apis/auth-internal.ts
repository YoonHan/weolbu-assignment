import { ReqLogin, ResLogin, UserInfo } from '@/lib/types/api/auth'

export const loginInternal = async (userData: ReqLogin): Promise<ResLogin> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '로그인 실패')
  }

  return response.json()
}

export const logoutInternal = async (): Promise<void> => {
  const response = await fetch('/api/auth/logout', { method: 'POST' })
  if (!response.ok) {
    throw new Error('로그아웃 실패')
  }
}

export const getMeInternal = async (): Promise<UserInfo> => {
  const response = await fetch('/api/auth/me')
  if (!response.ok) {
    throw new Error('인증 실패')
  }
  return response.json()
}
