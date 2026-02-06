import { API_ENDPOINTS } from '@/lib/constants/api'
import { apiClient } from '@/lib/http/client'
import { ReqBatchEnrollment, ResBatchEnrollment } from '@/lib/types/api/enrollment'

export const batchEnroll = async (data: ReqBatchEnrollment): Promise<ResBatchEnrollment> => {
  const response = await apiClient.post<ResBatchEnrollment>(
    API_ENDPOINTS.enrollments.batch.index,
    data
  )
  return response.data
}
