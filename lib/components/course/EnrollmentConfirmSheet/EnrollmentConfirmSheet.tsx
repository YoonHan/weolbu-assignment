'use client'

import { Button } from '@/lib/components/ui/Button/Button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/lib/components/ui/Sheet/Sheet'
import { ResCourse } from '@/lib/types/api/course'

interface EnrollmentConfirmSheetProps {
  open: boolean
  selectedCourses: ResCourse[]
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function EnrollmentConfirmSheet({
  open,
  selectedCourses,
  isPending,
  onOpenChange,
  onConfirm,
}: EnrollmentConfirmSheetProps) {
  const totalPrice = selectedCourses.reduce((sum, course) => sum + course.price, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-auto max-h-[90vh] w-full max-w-2xl mx-auto overflow-y-auto rounded-t-[20px] pb-12"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>수강 신청 확인</SheetTitle>
          <SheetDescription>선택하신 강의 정보를 확인해주세요.</SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {selectedCourses.map((course) => (
              <div
                key={course.id}
                className="flex justify-between items-center text-sm border-b pb-2 last:border-b-0"
              >
                <span className="font-medium truncate mr-4">{course.title}</span>
                <span className="shrink-0 whitespace-nowrap">
                  {course.price.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
            <span>총 결제 금액</span>
            <span className="text-primary">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>

        <SheetFooter className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="font-bold"
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button className="font-bold" size="lg" onClick={onConfirm} disabled={isPending}>
            {isPending ? '신청 중...' : '최종 신청하기'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
