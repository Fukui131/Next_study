export interface Task {
  id: number
  title: string
  body: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskRecord {
  id: number
  title: string
  body: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskRequest {
  title: string
  body: string
}

export interface UpdateTaskRequest {
  completed: boolean
}

export interface DeleteTaskRequest {
  id: number
}

export interface ApiSuccessResponse<T> {
  data: T
}

export interface ApiErrorResponse {
  error: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
