import { Card, CardContent, CardHeader } from '@/lib/components/ui/Card/Card'
import { Skeleton } from '@/lib/components/ui/Skeleton/Skeleton'

export function CourseItemSkeleton() {
  return (
    <Card className="opacity-60">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex gap-3 w-full">
          <Skeleton className="h-4 w-4 mt-1" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
