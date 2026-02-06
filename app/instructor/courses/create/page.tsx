import { CreateCourseForm } from '@/lib/components/course/CreateCourseForm/CreateCourseForm'

export default function CreateCoursePage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <CreateCourseForm />
    </div>
  )
}
