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

async function update(id: number, data: UpdateTaskRequest): Promise<TaskRecord> {
  return prisma.task.update({
    where: { id },
    data,
  })
}

async function deleteTask(id: number): Promise<TaskRecord> {
  return prisma.task.delete({
    where: { id },
  })
}

export const taskRepository = {
  findMany,
  findById,
  create,
  update,
  delete: deleteTask,
}
