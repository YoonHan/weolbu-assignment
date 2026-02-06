import { API_ENDPOINTS } from '@/lib/constants/api'
import { apiClient } from '@/lib/http/client'
import { ReqLogin, ReqSignup, ResLogin, ResSignup, UserInfo } from '@/lib/types/api/auth'

export const login = async (data: ReqLogin): Promise<ResLogin> => {
  const response = await apiClient.post<ResLogin>(API_ENDPOINTS.users.login.index, data)
  return response.data
}

export const signup = async (data: ReqSignup): Promise<ResSignup> => {
  const response = await apiClient.post<ResSignup>(API_ENDPOINTS.users.signup.index, data)
  return response.data
}

export const getMe = async (): Promise<UserInfo> => {
  const response = await apiClient.get<UserInfo>(API_ENDPOINTS.users.me.index)
  return response.data
}
