import { CourseItemSkeleton } from '@/lib/components/course/CourseItem/CourseItemSkeleton'

export function CourseListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <CourseItemSkeleton key={i} />
      ))}
    </div>
  )
}
