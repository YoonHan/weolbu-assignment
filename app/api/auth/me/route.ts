import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME } from '@/lib/constants/auth'
import { ResLogin } from '@/lib/types/api/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
      const response = NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
      response.cookies.delete(AUTH_COOKIE_NAME)
      return response
    }

    // 쿠키 정보 파싱
    try {
      // login 시 저장된 데이터를 통째로 파싱
      const loginData = JSON.parse(token) as ResLogin

      if (loginData.user) {
        return NextResponse.json(loginData.user)
      }

      throw new Error('User info not found in token')
    } catch {
      // 레거시 JWT 형식인 경우 (필요 시 유지) 또는 파싱 실패 시
      try {
        const base64Payload = token.split('.')[1]
        if (base64Payload) {
          const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf8')
          const user = JSON.parse(decodedPayload)
          return NextResponse.json(user)
        }
      } catch (err) {
        console.error('Failed to parse legacy token:', err)
      }

      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
  } catch (error: unknown) {
    console.error('Auth verification error:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
