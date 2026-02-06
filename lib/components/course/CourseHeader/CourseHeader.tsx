'use client'

import { LogOut, Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/lib/components/ui/Button/Button'
import { useAuth } from '@/lib/context/AuthContext'
import { useLogoutMutation } from '@/lib/queries/auth/mutation'

import { CourseHeaderSkeleton } from './CourseHeaderSkeleton'

export function CourseHeader() {
  const { user, loading } = useAuth()
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation()

  if (loading) {
    return <CourseHeaderSkeleton />
  }

  return (
    <div className="mb-10 w-full flex flex-col gap-8">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">강의 수강 신청</h1>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="shrink-0 h-9 gap-2"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </Button>
          )}
        </div>
        {user && (
          <p className="text-muted-foreground text-sm">
            안녕하세요, <span className="font-semibold text-foreground">{user.name}</span>님!
          </p>
        )}
      </div>

      {user?.role === 'INSTRUCTOR' && (
        <div className="flex sm:justify-end">
          <Link href="/instructor/courses/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto shadow-sm gap-2" size="lg">
              <Plus className="h-4 w-4" />
              강의 개설하기
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
