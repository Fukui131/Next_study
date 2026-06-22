import { TaskManager } from '@/components/tasks/TaskManager'
import { TaskPageHeader } from '@/components/tasks/TaskPageHeader'
import { taskServerService, TaskServiceError } from '@/services/taskServerService'
import type { Task } from '@/types/task'

export const revalidate = 30

interface TasksFetchResult {
  tasks: Task[]
  error: string | null
}

async function getTasks(): Promise<TasksFetchResult> {
  try {
    const tasks = await taskServerService.getTasks()
    return {
      tasks,
      error: null,
    }
  } catch (error) {
    if (error instanceof TaskServiceError) {
      return {
        tasks: [],
        error: error.message,
      }
    }

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
