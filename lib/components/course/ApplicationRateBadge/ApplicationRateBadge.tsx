import { Badge } from '@/lib/components/ui/Badge/Badge'
import { cn } from '@/lib/utils/cn'

interface ApplicationRateBadgeProps {
  currentStudents: number
  maxStudents: number
  className?: string
}

export function ApplicationRateBadge({
  currentStudents,
  maxStudents,
  className,
}: ApplicationRateBadgeProps) {
  const applicationRate = Math.round((currentStudents / maxStudents) * 100)
  const isFull = currentStudents >= maxStudents

  const getBadgeVariant = () => {
    if (isFull) return 'destructive'
    if (applicationRate < 50) return 'pastel-low'
    if (applicationRate < 80) return 'pastel-medium'
    return 'pastel-high'
  }

  return (
    <Badge variant={getBadgeVariant()} className={cn(className)}>
      신청률 {applicationRate}%
    </Badge>
  )
}
