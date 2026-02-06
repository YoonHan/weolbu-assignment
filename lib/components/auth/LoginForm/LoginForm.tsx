'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Alert, AlertDescription, AlertTitle } from '@/lib/components/ui/Alert/Alert'
import { Button } from '@/lib/components/ui/Button/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/lib/components/ui/Card/Card'
import { Input } from '@/lib/components/ui/Input/Input'
import { Label } from '@/lib/components/ui/Label/Label'
import { useLoginMutation } from '@/lib/queries/auth/mutation'

const loginSchema = z.object({
  email: z.email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const { mutate: login, isPending } = useLoginMutation()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginValues) => {
    setError(null)
    login(data, {
      onError: (err: unknown) => {
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.message || '로그인에 실패했습니다.'
          setError(message)
        } else {
          setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
        }
      },
    })
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>이메일과 비밀번호를 확인해주세요</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>서비스 이용을 위해 로그인해주세요.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '로그인 중...' : '로그인'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                회원가입하기
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
