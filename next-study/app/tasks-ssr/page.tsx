import { headers } from 'next/headers'
import { TaskManager } from '@/components/tasks/TaskManager'
import { TaskPageHeader } from '@/components/tasks/TaskPageHeader'
import type { ApiResponse, Task } from '@/types/task'

const TASKS_REVALIDATE_SECONDS = 30

export const revalidate = 30

interface TasksFetchResult {
  tasks: Task[]
  error: string | null
}

async function getBaseUrl(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? `localhost:${process.env.PORT ?? '3000'}`
  const protocol = headersList.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')

  return `${protocol}://${host}`
}

async function getTasks(): Promise<TasksFetchResult> {
  const baseUrl = await getBaseUrl()

  try {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      next: { revalidate: TASKS_REVALIDATE_SECONDS },
    })
    const payload = (await response.json()) as ApiResponse<Task[]>

    if (!response.ok) {
      return {
        tasks: [],
        error: 'error' in payload ? payload.error : 'タスクの読み込みに失敗しました。',
      }
    }

    if (!('data' in payload)) {
      return {
        tasks: [],
        error: 'API レスポンスの形式が正しくありません。',
      }
    }

    return {
      tasks: payload.data,
      error: null,
    }
  } catch (error) {
    console.error('SSR task fetch error:', error)

    return {
      tasks: [],
      error: 'タスクの読み込み中に問題が発生しました。',
    }
  }
}

export default async function TasksSSRPage() {
  const { tasks, error } = await getTasks()

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <TaskPageHeader
        title="Task 一覧（SSR）"
        description="サーバーで初回データを取得する Task CRUD です。"
        switchHref="/tasks-csr"
        switchLabel="CSR版を見る"
      />
      <section className="mx-auto max-w-4xl px-4 py-8">
        <TaskManager initialTasks={tasks} initialError={error} fetchOnMount={false} />
      </section>
    </main>
  )
}
