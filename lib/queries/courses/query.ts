import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'

import { getCourseDetail, getCourses } from '@/lib/apis/course'
import { ReqGetCourses } from '@/lib/types/api/course'

export const courseQueryKeys = {
  all: ['courses'] as const,
  list: (params: ReqGetCourses) => [...courseQueryKeys.all, 'list', params] as const,
  detail: (id: number) => [...courseQueryKeys.all, 'detail', id] as const,
}

export const coursesInfiniteQueryOptions = (params: ReqGetCourses) =>
  infiniteQueryOptions({
    queryKey: courseQueryKeys.list(params),
    queryFn: ({ pageParam = 0 }) => getCourses({ ...params, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  })

export const courseDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: courseQueryKeys.detail(id),
    queryFn: () => getCourseDetail(id),
    enabled: !!id,
  })
