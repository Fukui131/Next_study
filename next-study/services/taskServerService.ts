import { taskRepository } from '@/repositories/taskRepository'
import type {
  CreateTaskRequest,
  DeleteTaskRequest,
  Task,
  TaskRecord,
  UpdateTaskRequest,
} from '@/types/task'

export class TaskServiceError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'TaskServiceError'
    this.statusCode = statusCode
  }
}

function toTask(record: TaskRecord): Task {
  return {
    id: record.id,
    title: record.title,
    body: record.body,
    completed: record.completed,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

function validateTaskId(id: number): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new TaskServiceError('無効なタスクIDです。', 400)
  }
}

function normalizeCreateRequest(request: CreateTaskRequest): CreateTaskRequest {
  const title = request.title.trim()
  const body = request.body.trim()

  if (!title || !body) {
    throw new TaskServiceError('title と body の両方を入力してください。', 400)
  }

  return { title, body }
}

function normalizeUpdateRequest(request: UpdateTaskRequest): UpdateTaskRequest {
  const data: UpdateTaskRequest = {}

  if (request.title !== undefined) {
    const title = request.title.trim()

    if (!title) {
      throw new TaskServiceError('title を入力してください。', 400)
    }

    data.title = title
  }

  if (request.body !== undefined) {
    const body = request.body.trim()

    if (!body) {
      throw new TaskServiceError('body を入力してください。', 400)
    }

    data.body = body
  }

  if (request.completed !== undefined) {
    if (typeof request.completed !== 'boolean') {
      throw new TaskServiceError('completed は真偽値で指定してください。', 400)
    }

    data.completed = request.completed
  }

  if (data.title === undefined && data.body === undefined && data.completed === undefined) {
    throw new TaskServiceError('更新する項目を指定してください。', 400)
  }

  return data
}

async function getTasks(): Promise<Task[]> {
  const tasks = await taskRepository.findMany()
  return tasks.map(toTask)
}

async function createTask(request: CreateTaskRequest): Promise<Task> {
  const data = normalizeCreateRequest(request)
  const createdTask = await taskRepository.create(data)
  return toTask(createdTask)
}

async function updateTask(id: number, request: UpdateTaskRequest): Promise<Task> {
  validateTaskId(id)
  const data = normalizeUpdateRequest(request)
  const updatedTask = await taskRepository.update(id, data)

  if (!updatedTask) {
    throw new TaskServiceError('タスクが見つかりませんでした。', 404)
  }

  return toTask(updatedTask)
}

async function deleteTask(request: DeleteTaskRequest): Promise<DeleteTaskRequest> {
  validateTaskId(request.id)
  const deletedTask = await taskRepository.delete(request.id)

  if (!deletedTask) {
    throw new TaskServiceError('タスクが見つかりませんでした。', 404)
  }

  return { id: request.id }
}

export const taskServerService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}
