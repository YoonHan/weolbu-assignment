import axios from 'axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { API_ENDPOINTS } from '@/lib/constants/api'
import { AUTH_COOKIE_NAME } from '@/lib/constants/auth'
import { serverApiClient } from '@/lib/http/server'
import { ResLogin } from '@/lib/types/api/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await serverApiClient.post<ResLogin>(API_ENDPOINTS.users.login.index, body)
    const data = response.data

    // 보안을 위해 로그인 정보를 HttpOnly 쿠키에 저장합니다.
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // 만료 시간 설정 (예: 1일)
      maxAge: 60 * 60 * 24,
    })

    // accessToken을 제외한 사용자 정보만 클라이언트에 반환합니다.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accessToken: _accessToken, ...user } = data
    return NextResponse.json(user)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || '로그인에 실패했습니다.' },
        { status: error.response?.status || 500 }
      )
    }
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: 500 })
  }
}
