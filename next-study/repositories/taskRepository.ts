import { Prisma } from '@/app/generated/prisma'
import prisma from '@/lib/prisma'
import type { CreateTaskRequest, TaskRecord, UpdateTaskRequest } from '@/types/task'

async function findMany(): Promise<TaskRecord[]> {
  return prisma.task.findMany({
    orderBy: { id: 'desc' },
  })
}

async function findById(id: number): Promise<TaskRecord | null> {
  return prisma.task.findUnique({
    where: { id },
  })
}

async function create(data: CreateTaskRequest): Promise<TaskRecord> {
  return prisma.task.create({
    data,
  })
}

function isRecordNotFoundError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

async function update(id: number, data: UpdateTaskRequest): Promise<TaskRecord | null> {
  try {
    return await prisma.task.update({
      where: { id },
      data,
    })
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return null
    }

    throw error
  }
}

async function deleteTask(id: number): Promise<TaskRecord | null> {
  try {
    return await prisma.task.delete({
      where: { id },
    })
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      return null
    }

    throw error
  }
}

export const taskRepository = {
  findMany,
  findById,
  create,
  update,
  delete: deleteTask,
}
