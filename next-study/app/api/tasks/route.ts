import { NextResponse } from 'next/server'
import { taskServerService, TaskServiceError } from '@/services/taskServerService'
import type { ApiResponse, CreateTaskRequest, Task } from '@/types/task'

function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>({ data }, { status })
}

function errorResponse(error: string, status: number): NextResponse<ApiResponse<never>> {
  return NextResponse.json<ApiResponse<never>>({ error }, { status })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCreateTaskRequest(value: unknown): value is CreateTaskRequest {
  return isRecord(value) && typeof value.title === 'string' && typeof value.body === 'string'
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

export async function GET() {
  try {
    const tasks = await taskServerService.getTasks()
    return successResponse<Task[]>(tasks)
  } catch (error) {
    return handleTaskError(error, 'GET /api/tasks error:')
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)

    if (!isCreateTaskRequest(body)) {
      return errorResponse('title と body は文字列で指定してください。', 400)
    }

    const createdTask = await taskServerService.createTask(body)

    return successResponse<Task>(createdTask, 201)
  } catch (error) {
    return handleTaskError(error, 'POST /api/tasks error:')
  }
}

export const runtime = 'nodejs'
