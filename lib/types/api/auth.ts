export type UserRole = 'STUDENT' | 'INSTRUCTOR'

export interface UserInfo {
  id: number
  email: string
  name: string
  phone: string
  role: UserRole
}

export interface ReqSignup {
  email: string
  name: string
  password: string
  phone: string
  role: UserRole
}

export interface ResSignup extends UserInfo {
  message: string
}

export interface ReqLogin {
  email: string
  password: string
}

export interface ResLogin {
  accessToken: string
  tokenType: string
  user: UserInfo
}
