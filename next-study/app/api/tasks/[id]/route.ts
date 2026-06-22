import { NextResponse } from 'next/server'
import { taskServerService, TaskServiceError } from '@/services/taskServerService'
import type { ApiResponse, DeleteTaskRequest, Task, UpdateTaskRequest } from '@/types/task'

function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>({ data }, { status })
}

function errorResponse(error: string, status: number): NextResponse<ApiResponse<never>> {
  return NextResponse.json<ApiResponse<never>>({ error }, { status })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isUpdateTaskRequest(value: unknown): value is UpdateTaskRequest {
  if (!isRecord(value)) {
    return false
  }

  const hasTitle = 'title' in value
  const hasBody = 'body' in value
  const hasCompleted = 'completed' in value

  if (!hasTitle && !hasBody && !hasCompleted) {
    return false
  }

  return (
    (!hasTitle || typeof value.title === 'string') &&
    (!hasBody || typeof value.body === 'string') &&
    (!hasCompleted || typeof value.completed === 'boolean')
  )
}

function parseTaskId(id: string): number | null {
  const taskId = Number(id)

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return null
  }

  return taskId
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

function handleTaskError(error: unknown, label: string): NextResponse<ApiResponse<never>> {
  if (error instanceof TaskServiceError) {
    return errorResponse(error.message, error.statusCode)
  }

  console.error(label, error)
  return errorResponse('Internal Server Error', 500)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const taskId = parseTaskId(id)

  if (taskId === null) {
    return errorResponse('無効なタスクIDです。', 400)
  }

  try {
    const body = await readJson(request)

    if (!isUpdateTaskRequest(body)) {
      return errorResponse('更新する項目の形式が正しくありません。', 400)
    }

    const updatedTask = await taskServerService.updateTask(taskId, body)

    return successResponse<Task>(updatedTask)
  } catch (error) {
    return handleTaskError(error, `PATCH /api/tasks/${id} error:`)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const taskId = parseTaskId(id)

  if (taskId === null) {
    return errorResponse('無効なタスクIDです。', 400)
  }

  try {
    const deletedTask = await taskServerService.deleteTask({ id: taskId })
    return successResponse<DeleteTaskRequest>(deletedTask)
  } catch (error) {
    return handleTaskError(error, `DELETE /api/tasks/${id} error:`)
  }
}

export const runtime = 'nodejs'
