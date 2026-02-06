import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { signup } from '@/lib/apis/auth'
import { loginInternal, logoutInternal } from '@/lib/apis/auth-internal'
import { useAuth } from '@/lib/context/AuthContext'
import { getQueryClient } from '@/lib/react-query/client'
import { ReqLogin, ReqSignup, ResLogin, ResSignup } from '@/lib/types/api/auth'

export const loginMutation: UseMutationOptions<ResLogin, Error, ReqLogin> = {
  mutationFn: loginInternal,
}

export const signupMutation: UseMutationOptions<ResSignup, Error, ReqSignup> = {
  mutationFn: signup,
}

export const useLoginMutation = () => {
  const { setUser } = useAuth()
  const router = useRouter()

  return useMutation({
    ...loginMutation,
    onSuccess: (data) => {
      // 1. Context 업데이트
      setUser(data.user)
      // 2. 페이지 이동
      router.push('/courses')
    },
  })
}

export const useLogoutMutation = () => {
  const { setUser } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: logoutInternal,
    onSuccess: () => {
      // 1. Context 초기화
      setUser(null)
      // 2. 쿼리 캐시 초기화
      const queryClient = getQueryClient()
      queryClient.clear()
      // 3. 페이지 이동
      router.push('/login')
    },
  })
}

export const useSignUpMutation = () => {
  const { setUser } = useAuth()
  const router = useRouter()
  const { mutateAsync: login } = useMutation(loginMutation)

  return useMutation({
    mutationFn: signup,
    onSuccess: async (data, variables) => {
      // 0. 성공 메시지 표시
      toast.success(data.message || '회원가입이 완료되었습니다.')

      // 1. 회원가입 성공 후 자동 로그인
      try {
        const loginResponse = await login({
          email: variables.email,
          password: variables.password,
        })

        // 2. Context 업데이트
        setUser(loginResponse.user)

        // 3. 페이지 이동
        router.push('/courses')
      } catch (error) {
        console.error('Auto login failed after signup:', error)
        router.push('/login')
      }
    },
  })
}
