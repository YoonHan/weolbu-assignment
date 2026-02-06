import { UseMutationOptions } from '@tanstack/react-query'

import { batchEnroll } from '@/lib/apis/enrollment'
// Assuming we want to invalidate courses upon enrollment
import { courseQueryKeys } from '@/lib/queries/courses/query'
import { getQueryClient } from '@/lib/react-query/client'
import { ReqBatchEnrollment, ResBatchEnrollment } from '@/lib/types/api/enrollment'

export const batchEnrollMutation: UseMutationOptions<
  ResBatchEnrollment,
  Error,
  ReqBatchEnrollment
> = {
  mutationFn: batchEnroll,
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: courseQueryKeys.all })
  },
}
