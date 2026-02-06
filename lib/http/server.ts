import axios from 'axios'
import { cookies } from 'next/headers'

import { AUTH_COOKIE_NAME } from '@/lib/constants/auth'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/api'

export const serverApiClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 쿠키에서 토큰을 가져와 Authorization 헤더에 추가
serverApiClient.interceptors.request.use(async (config) => {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (token && config.headers) {
    let accessToken = token
    try {
      // 쿠키가 JSON 형식인 경우 accessToken 추출
      const parsed = JSON.parse(token)
      if (parsed.accessToken) {
        accessToken = parsed.accessToken
      }
    } catch {
      // JSON 형식이 아닌 경우 기존 값 그대로 사용
    }

    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
