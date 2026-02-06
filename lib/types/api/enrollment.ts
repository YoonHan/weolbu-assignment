export interface ResSuccessItem {
  enrollmentId: number
  courseId: number
  courseTitle: string
}

export interface ResFailedItem {
  courseId: number
  reason: string
}

export interface ReqBatchEnrollment {
  courseIds: number[]
}

export interface ResBatchEnrollment {
  success: ResSuccessItem[]
  failed: ResFailedItem[]
}
