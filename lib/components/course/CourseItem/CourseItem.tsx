import { motion } from 'framer-motion'

import { ApplicationRateBadge } from '@/lib/components/course/ApplicationRateBadge/ApplicationRateBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card/Card'
import { Checkbox } from '@/lib/components/ui/Checkbox/Checkbox'
import { ResCourse } from '@/lib/types/api/course'
import { cn } from '@/lib/utils/cn'

interface CourseItemProps {
  course: ResCourse
  isSelected: boolean
  onToggle: (course: ResCourse, checked: boolean) => void
  onShowDetail: (courseId: number) => void
}

const MotionCard = motion.create(Card)

export function CourseItem({ course, isSelected, onToggle, onShowDetail }: CourseItemProps) {
  // const applicationRate = Math.round((course.currentStudents / course.maxStudents) * 100)
  const isFull = course.currentStudents >= course.maxStudents

  const handleCardClick = () => {
    onShowDetail(course.id)
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (!isFull) {
      onToggle(course, checked)
    }
  }

  return (
    <MotionCard
      className={cn(
        'transition-colors',
        'cursor-pointer hover:bg-accent/5',
        isFull && 'opacity-60',
        isSelected && 'border-primary bg-white shadow-sm'
      )}
      onClick={handleCardClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ touchAction: 'manipulation' }}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0 gap-4">
        <div className="flex gap-3 min-w-0">
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`course-${course.id}`}
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              disabled={isFull}
              className="mt-1"
            />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base font-bold leading-tight">
              <span>{course.title}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{course.instructorName}</p>
          </div>
        </div>
        <div className="text-right shrink-0 whitespace-nowrap">
          <p className="font-semibold">{course.price.toLocaleString()}원</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-2 items-center">
            <ApplicationRateBadge
              currentStudents={course.currentStudents}
              maxStudents={course.maxStudents}
            />
            <span className="text-muted-foreground text-sm">
              ({course.currentStudents}/{course.maxStudents}명)
            </span>
          </div>
          {isFull && (
            <span className="text-xs font-bold text-red-500 border border-red-500 px-2 py-0.5 rounded-full">
              마감
            </span>
          )}
        </div>
      </CardContent>
    </MotionCard>
  )
}
