import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  try {
    // Fetch all tasks from PostgreSQL via Prisma
    const tasks = await prisma.task.findMany({ orderBy: { id: 'desc' } })
    return NextResponse.json(tasks)
  } catch (error) {
    // Log the error on the server and return a safe message to the client
    // (don't leak internal details)
    console.error('GET /api/tasks error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'