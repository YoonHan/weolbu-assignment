export const API_ENDPOINTS = {
  users: {
    login: {
      index: '/users/login',
    },
    signup: {
      index: '/users/signup',
    },
    me: {
      index: '/users/me',
    },
  },
  courses: {
    index: '/courses',
    id: (id: number | string) => `/courses/${id}`,
    enroll: (id: number | string) => `/courses/${id}/enroll`,
  },
  enrollments: {
    batch: {
      index: '/enrollments/batch',
    },
  },
}
