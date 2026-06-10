import { TaskManager } from '@/components/tasks/TaskManager'
import { TaskPageHeader } from '@/components/tasks/TaskPageHeader'

export default function TasksCSRPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <TaskPageHeader
        title="Task 一覧（CSR）"
        description="ブラウザで初回データを取得する Task CRUD です。"
        switchHref="/tasks-ssr"
        switchLabel="SSR版を見る"
      />
      <section className="mx-auto max-w-4xl px-4 py-8">
        <TaskManager fetchOnMount={true} />
      </section>
    </main>
  )
}
