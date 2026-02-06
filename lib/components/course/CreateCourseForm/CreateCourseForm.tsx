'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

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

const createCourseSchema = z.object({
  title: z.string().min(1, '강의명을 입력해주세요'),
  maxStudents: z.coerce
    .number()
    .min(1, '최대 수강 인원은 1명 이상이어야 합니다')
    .max(1000, '최대 수강 인원은 1000명까지 가능합니다')
    .int('정수만 입력 가능합니다'),
  price: z.coerce
    .number()
    .min(0, '가격은 0원 이상이어야 합니다')
    .max(10000000, '가격은 최대 1,000만원까지 가능합니다')
    .int('정수만 입력 가능합니다'),
})

type CreateCourseValues = z.infer<typeof createCourseSchema>

import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/lib/context/AuthContext'
import { createCourseMutation } from '@/lib/queries/courses/mutation'

export function CreateCourseForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { mutate: createCourse, isPending } = useMutation(createCourseMutation)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCourseSchema),
  })

  const onSubmit = (data: CreateCourseValues) => {
    setError(null)
    createCourse(
      {
        ...data,
        instructorName: user?.name || 'Unknown Instructor',
      },
      {
        onSuccess: () => {
          router.push('/courses')
        },
        onError: (err: unknown) => {
          if (axios.isAxiosError(err)) {
            const message =
              err.response?.data?.message || '강의 개설에 실패했습니다. 다시 시도해주세요.'
            setError(message)
          } else {
            setError('강의 개설에 실패했습니다. 다시 시도해주세요.')
          }
        },
      }
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>강의 개설</CardTitle>
        <CardDescription>새로운 강의를 개설합니다. 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">강의명</Label>
            <Input id="title" placeholder="강의명을 입력하세요" {...register('title')} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="maxStudents">최대 수강 인원</Label>
            <Input
              id="maxStudents"
              type="number"
              placeholder="예: 10"
              {...register('maxStudents')}
            />
            {errors.maxStudents && (
              <p className="text-sm text-red-500">{errors.maxStudents.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">가격 (원)</Label>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  id="price"
                  type="text"
                  placeholder="예: 200,000"
                  value={value ? value.toLocaleString() : ''}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, '')
                    if (rawValue === '' || /^\d+$/.test(rawValue)) {
                      onChange(rawValue === '' ? 0 : Number(rawValue))
                    }
                  }}
                />
              )}
            />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? '개설 중...' : '강의 개설하기'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
