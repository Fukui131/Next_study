import Link from 'next/link'
import prisma from '../../lib/prisma'
import TaskForm from './TaskForm'
import TaskList from './TaskList'

interface Task {
  id: number
  title: string
  body: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

async function getTasks(): Promise<Task[]> {
  return prisma.task.findMany({ orderBy: { id: 'desc' } }) as Promise<Task[]>
}

export default async function TasksSSRPage() {
  let tasks: Task[] = []
  let fetchError: string | null = null

  try {
    tasks = await getTasks()
  } catch (error) {
    console.error('SSR task fetch error:', error)
    fetchError = 'タスクの読み込み中に問題が発生しました。'
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <p className="text-lg font-semibold text-slate-900">このページは SSR版です</p>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">一覧取得はSSR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">追加・完了・削除はCSR操作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">操作後に一覧更新される</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">このページについて</p>
                <p className="mt-2 text-sm text-slate-600">
                  サーバーサイドで Task データを取得して、初回表示時に HTML を生成しています。Task の追加・完了・削除はブラウザ側で実行されます。
                </p>
              </div>
            </div>
            <Link
              href="/tasks"
              className="mt-4 inline-flex rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              CSR版を見る
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900">Task 一覧（SSR）</h1>
              <p className="mt-2 text-slate-600">このページはサーバーで Task を取得して、初回表示時に HTML を生成します。</p>
            </div>

            {/* Task 追加フォーム */}
            <div className="mb-8">
              <TaskForm />
            </div>

            {/* Task 一覧 */}
            <div className="space-y-5">
              {fetchError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{fetchError}</div>
              ) : tasks.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-slate-700">Task が見つかりませんでした。</div>
              ) : (
                <TaskList initialTasks={tasks} />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
