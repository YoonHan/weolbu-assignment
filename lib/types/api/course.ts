export interface ResCourse {
  id: number
  title: string
  description: string
  instructorName: string
  maxStudents: number
  currentStudents: number
  availableSeats: number
  isFull: boolean
  price: number
  createdAt: string
}

export interface ReqCreateCourse {
  title: string
  description?: string
  instructorName: string
  maxStudents: number
  price: number
}

export interface ReqGetCourses {
  page?: number
  size?: number
  sort?: string
}
