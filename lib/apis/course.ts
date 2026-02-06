import { API_ENDPOINTS } from '@/lib/constants/api'
import { apiClient } from '@/lib/http/client'
import { ResPage } from '@/lib/types/api/common'
import { ReqCreateCourse, ReqGetCourses, ResCourse } from '@/lib/types/api/course'

export const getCourses = async (params: ReqGetCourses): Promise<ResPage<ResCourse>> => {
  const response = await apiClient.get<ResPage<ResCourse>>(API_ENDPOINTS.courses.index, { params })
  return response.data
}

export const getCourseDetail = async (id: number): Promise<ResCourse> => {
  const response = await apiClient.get<ResCourse>(API_ENDPOINTS.courses.id(id))
  return response.data
}

export const createCourse = async (data: ReqCreateCourse): Promise<ResCourse> => {
  const response = await apiClient.post<ResCourse>(API_ENDPOINTS.courses.index, data)
  return response.data
}

export const enrollCourse = async (id: number): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.courses.enroll(id))
}
