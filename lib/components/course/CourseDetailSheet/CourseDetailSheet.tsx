'use client'

import { useQuery } from '@tanstack/react-query'
import { Calendar, User, Users } from 'lucide-react'
import * as React from 'react'

import { ApplicationRateBadge } from '@/lib/components/course/ApplicationRateBadge/ApplicationRateBadge'
import { Badge } from '@/lib/components/ui/Badge/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card/Card'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/lib/components/ui/Sheet/Sheet'
import { Skeleton } from '@/lib/components/ui/Skeleton/Skeleton'
import { courseDetailQueryOptions } from '@/lib/queries/courses/query'

interface CourseDetailSheetProps {
  courseId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CourseDetailSheet({ courseId, open, onOpenChange }: CourseDetailSheetProps) {
  const { data: course, isLoading } = useQuery({
    ...courseDetailQueryOptions(courseId ?? 0),
    enabled: !!courseId && open,
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-auto max-h-[90vh] w-full max-w-2xl mx-auto overflow-y-auto rounded-t-[20px] pb-12"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>강의 상세 정보</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 pb-10">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : course ? (
          <div className="space-y-6 pb-10">
            <Card className="border-none shadow-none">
              <CardHeader className="p-0 space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {course.currentStudents >= course.maxStudents ? (
                      <Badge variant="destructive">마감</Badge>
                    ) : (
                      <Badge variant="secondary">모집중</Badge>
                    )}
                    <ApplicationRateBadge
                      currentStudents={course.currentStudents}
                      maxStudents={course.maxStudents}
                    />
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight">{course.title}</CardTitle>
                </div>
                <div className="pt-2">
                  <p className="text-2xl font-bold text-primary">
                    {course.price.toLocaleString()}원
                  </p>
                </div>

                <div className="flex flex-col gap-3 text-sm border-t pt-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16 shrink-0">강사</span>
                      <span className="font-semibold text-foreground">{course.instructorName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16 shrink-0">개설일</span>
                      <span className="font-semibold text-foreground">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16 shrink-0">수강</span>
                      <span className="font-semibold text-foreground">
                        {course.currentStudents} / {course.maxStudents}명
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-6 mt-6 border-t">
                <div className="space-y-2">
                  <h3 className="font-semibold text-base">강의 소개</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            강의 정보를 찾을 수 없습니다.
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
