import { Skeleton } from '@/lib/components/ui/Skeleton/Skeleton'

export function CourseHeaderSkeleton() {
  return (
    <div className="mb-10 w-full flex flex-col gap-8">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">강의 수강 신청</h1>
          {/* Logout button skeleton placeholder - often not needed if small, but let's keep title row height consistent */}
          <Skeleton className="h-9 w-24 shrink-0" />
        </div>
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="flex sm:justify-end">
        {/* 'Create Course' button skeleton - h-10 to match size='lg' */}
        <Skeleton className="w-full sm:w-[130px] h-10" />
      </div>
    </div>
  )
}
