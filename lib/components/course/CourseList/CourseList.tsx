'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/lib/components/ui/Button/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/lib/components/ui/Select/Select'
import { batchEnrollMutation } from '@/lib/queries/enrollments/mutation'
import { ResCourse } from '@/lib/types/api/course'

import { CourseDetailSheet } from '../CourseDetailSheet/CourseDetailSheet'
import { EnrollmentConfirmSheet } from '../EnrollmentConfirmSheet/EnrollmentConfirmSheet'
import { CourseListContent } from './CourseListContent'
import { CourseListSkeleton } from './CourseListSkeleton'

export function CourseList() {
  const [sort, setSort] = useState<string>('recent')
  const [selectedCourses, setSelectedCourses] = useState<ResCourse[]>([])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null)

  const selectedIds = new Set(selectedCourses.map((c) => c.id))
  const { mutate: batchEnroll, isPending: isRegistering } = useMutation(batchEnrollMutation)
  const router = useRouter()

  const handleSortChange = (value: string) => {
    setSort(value)
    setSelectedCourses([])
  }

  const toggleSelection = (course: ResCourse, checked: boolean) => {
    if (checked) {
      setSelectedCourses((prev) => [...prev, course])
    } else {
      setSelectedCourses((prev) => prev.filter((c) => c.id !== course.id))
    }
  }

  const handleShowDetail = (courseId: number) => {
    setSelectedDetailId(courseId)
  }

  const handleRegister = () => {
    if (selectedCourses.length === 0) return
    setIsConfirmOpen(true)
  }

  const onConfirmRegister = () => {
    batchEnroll(
      { courseIds: selectedCourses.map((c) => c.id) },
      {
        onSuccess: (response) => {
          const successCount = response.success.length
          const failCount = response.failed.length

          if (successCount > 0) {
            toast.success(`${successCount}건 신청 완료`, {
              description: failCount > 0 ? `${failCount}건 실패` : undefined,
            })
          } else if (failCount > 0) {
            toast.error(`${failCount}건 신청 실패`)
          }

          setSelectedCourses([])
          setIsConfirmOpen(false)
          router.refresh()
        },
        onError: (err) => {
          toast.error('수강 신청 중 오류가 발생했습니다', {
            description: err.message,
          })
        },
      }
    )
  }

  return (
    <div className="space-y-4 pb-10">
      <div className="flex justify-between items-center bg-background sticky top-0 z-10 py-2 border-b -mx-4 px-4">
        <h2 className="text-lg font-bold">강의 목록</h2>
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">최신 등록순</SelectItem>
            <SelectItem value="popular">신청자 많은 순</SelectItem>
            <SelectItem value="rate">신청률 높은 순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Suspense key={`courses-list-${sort}`} fallback={<CourseListSkeleton />}>
        <CourseListContent
          sort={sort}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onShowDetail={handleShowDetail}
        />
      </Suspense>

      <EnrollmentConfirmSheet
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        selectedCourses={selectedCourses}
        onConfirm={onConfirmRegister}
        isPending={isRegistering}
      />

      <CourseDetailSheet
        courseId={selectedDetailId}
        open={!!selectedDetailId}
        onOpenChange={(open) => !open && setSelectedDetailId(null)}
      />

      {/* 수강 신청 플로팅 버튼 */}
      {selectedCourses.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg flex flex-col gap-3 container mx-auto max-w-md">
          <span className="font-bold">{selectedCourses.length}개 강의 선택됨</span>
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setSelectedCourses([])}>
              전체 선택 해제
            </Button>
            <Button className="flex-1" onClick={handleRegister}>
              수강 신청하기
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
