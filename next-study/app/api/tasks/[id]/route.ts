import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

interface TaskUpdatePayload {
  completed?: boolean
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const taskId = Number(id)
  if (Number.isNaN(taskId)) {
    return NextResponse.json({ error: '無効なタスクIDです。' }, { status: 400 })
  }

  try {
    const body = (await request.json()) as TaskUpdatePayload
    if (typeof body.completed !== 'boolean') {
      return NextResponse.json({ error: 'completed フィールドが必要です。' }, { status: 400 })
    }

    const completed = body.completed
    const data: { completed: boolean } = { completed }
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data,
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error(`PATCH /api/tasks/${id} error:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const taskId = Number(id)
  if (Number.isNaN(taskId)) {
    return NextResponse.json({ error: '無効なタスクIDです。' }, { status: 400 })
  }

  try {
    await prisma.task.delete({ where: { id: taskId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/tasks/${id} error:`, error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
