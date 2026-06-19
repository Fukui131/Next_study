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

function validateUpdateRequest(request: UpdateTaskRequest): UpdateTaskRequest {
  if (typeof request.completed !== 'boolean') {
    throw new TaskServiceError('completed フィールドが必要です。', 400)
  }

  return { completed: request.completed }
}

async function ensureTaskExists(id: number): Promise<void> {
  const task = await taskRepository.findById(id)

  if (!task) {
    throw new TaskServiceError('タスクが見つかりませんでした。', 404)
  }
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
  const data = validateUpdateRequest(request)
  await ensureTaskExists(id)
  const updatedTask = await taskRepository.update(id, data)
  return toTask(updatedTask)
}

async function deleteTask(request: DeleteTaskRequest): Promise<DeleteTaskRequest> {
  validateTaskId(request.id)
  await ensureTaskExists(request.id)
  await taskRepository.delete(request.id)
  return { id: request.id }
}

export const taskServerService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}
