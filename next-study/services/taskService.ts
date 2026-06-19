import type {
  ApiResponse,
  CreateTaskRequest,
  DeleteTaskRequest,
  Task,
  UpdateTaskRequest,
} from '@/types/task'

const TASKS_API_PATH = '/api/tasks'

export class TaskApiError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'TaskApiError'
    this.statusCode = statusCode
  }
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T> | null> {
  try {
    return (await response.json()) as ApiResponse<T>
  } catch {
    return null
  }
}

function getErrorMessage<T>(payload: ApiResponse<T> | null, fallback: string): string {
  if (payload && 'error' in payload) {
    return payload.error
  }

  return fallback
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(input, init)
  } catch {
    throw new TaskApiError('ネットワークエラーが発生しました。', 0)
  }

  const payload = await parseResponse<T>(response)

  if (!response.ok) {
    throw new TaskApiError(
      getErrorMessage(payload, `API エラーが発生しました。status: ${response.status}`),
      response.status,
    )
  }

  if (!payload || !('data' in payload)) {
    throw new TaskApiError('API レスポンスの形式が正しくありません。', response.status)
  }

  return payload.data
}

async function getTasks(): Promise<Task[]> {
  return request<Task[]>(TASKS_API_PATH)
}

async function createTask(data: CreateTaskRequest): Promise<Task> {
  return request<Task>(TASKS_API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

async function updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
  return request<Task>(`${TASKS_API_PATH}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

async function deleteTask(data: DeleteTaskRequest): Promise<DeleteTaskRequest> {
  return request<DeleteTaskRequest>(`${TASKS_API_PATH}/${data.id}`, {
    method: 'DELETE',
  })
}

export const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}
