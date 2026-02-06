import axios from 'axios'

const isServer = typeof window === 'undefined'
const BASE_URL = isServer
  ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/proxy'
  : '/api/proxy'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 서버 레이어(Next.js API Routes)를 통해 HttpOnly 쿠키를 설정하고, 브라우저가 이를 자동으로 포함하도록 합니다.

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증되지 않은 접근 처리 (예: 토큰 삭제, 로그인 페이지로 리다이렉트)
      // 현재는 단순 거절
    }
    return Promise.reject(error)
  }
)
