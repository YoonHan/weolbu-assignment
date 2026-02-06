import { UseMutationOptions } from '@tanstack/react-query'

import { createCourse, enrollCourse } from '@/lib/apis/course'
import { getQueryClient } from '@/lib/react-query/client'
import { ReqCreateCourse, ResCourse } from '@/lib/types/api/course'

import { courseQueryKeys } from './query'

export const createCourseMutation: UseMutationOptions<ResCourse, Error, ReqCreateCourse> = {
  mutationFn: createCourse,
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: courseQueryKeys.all })
  },
}

export const enrollMutation: UseMutationOptions<void, Error, number> = {
  mutationFn: enrollCourse,
  onSuccess: () => {
    // Invalidate course list and detail
    getQueryClient().invalidateQueries({ queryKey: courseQueryKeys.all })
  },
}
