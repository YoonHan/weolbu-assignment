'use client'

import { CourseHeader } from '@/lib/components/course/CourseHeader/CourseHeader'
import { CourseList } from '@/lib/components/course/CourseList/CourseList'

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <CourseHeader />

      <CourseList />
    </div>
  )
}
