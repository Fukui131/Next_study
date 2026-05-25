import { NextResponse } from 'next/server'
import { PrismaClient as PrismaClientCtor } from '../../generated/prisma/client'
import type { PrismaClient } from '../../generated/prisma/client'

declare global {
  // allow global caching in development to avoid creating many clients
  var __prisma: PrismaClient | undefined
}

const prisma: PrismaClient = global.__prisma ?? new (PrismaClientCtor as unknown as new () => PrismaClient)()
if (process.env.NODE_ENV !== 'production') global.__prisma = prisma

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