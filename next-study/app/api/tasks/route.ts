import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

interface TaskCreatePayload {
  title: string
  body: string
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({ orderBy: { id: 'desc' } })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('GET /api/tasks error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TaskCreatePayload

    if (!body.title?.trim() || !body.body?.trim()) {
      return NextResponse.json(
        { error: 'title と body の両方を入力してください。' },
        { status: 400 },
      )
    }

    const newTask = await prisma.task.create({
      data: {
        title: body.title.trim(),
        body: body.body.trim(),
      },
    })

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('POST /api/tasks error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
