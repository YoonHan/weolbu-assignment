export interface ResPage<T> {
  totalPages: number
  totalElements: number
  size: number
  content: T[]
  number: number
  first: boolean
  last: boolean
  empty: boolean
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
}

export interface ResError {
  code: string
  message: string
  timestamp: string
}
