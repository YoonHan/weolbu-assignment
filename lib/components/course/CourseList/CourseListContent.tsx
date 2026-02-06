'use client'

import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { CourseItem } from '@/lib/components/course/CourseItem/CourseItem'
import { coursesInfiniteQueryOptions } from '@/lib/queries/courses/query'
import { ResCourse } from '@/lib/types/api/course'

interface CourseListContentProps {
  sort: string
  selectedIds: Set<number>
  onToggleSelection: (course: ResCourse, checked: boolean) => void
  onShowDetail: (courseId: number) => void
}

export function CourseListContent({
  sort,
  selectedIds,
  onToggleSelection,
  onShowDetail,
}: CourseListContentProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    coursesInfiniteQueryOptions({
      size: 10,
      sort,
    })
  )

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const courses = data?.pages.flatMap((page) => page.content) || []

  return (
    <div className="space-y-3">
      {courses.map((course: ResCourse, index: number) => (
        <CourseItem
          key={`${course.id}-${index}`}
          course={course}
          isSelected={selectedIds.has(course.id)}
          onToggle={onToggleSelection}
          onShowDetail={onShowDetail}
        />
      ))}
      {courses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">등록된 강의가 없습니다.</div>
      )}

      {/* 로딩 표시 (다음 페이지 로딩 시에만 표시) */}
      {isFetchingNextPage && (
        <div className="text-center py-4 text-muted-foreground">로딩 중...</div>
      )}

      {/* 데이터 없음 안내 */}
      {!hasNextPage && courses.length > 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm">
          모든 강의를 다 불러왔어요.
        </div>
      )}

      {/* 무한 스크롤 감지 영역 */}
      <div ref={ref} className="h-10 invisible" />
    </div>
  )
}
