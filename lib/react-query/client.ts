import { QueryClient } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 전역 설정: 데이터가 자동으로 다시 요청되지 않도록 설정
        staleTime: Infinity,
        gcTime: 1000 * 60 * 30, // 30분 동안 캐시 유지
        retry: false, // 실패 시 재시도 안함
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새로운 쿼리 클라이언트를 생성합니다
    return makeQueryClient()
  } else {
    // 브라우저: 클라이언트가 없다면 새로운 쿼리 클라이언트를 생성합니다 (Singleton 패턴)
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
