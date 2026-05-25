import Link from 'next/link'
import prisma from '../../lib/prisma'

interface Task {
  id: number
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

async function getTasks(): Promise<Task[]> {
  return prisma.task.findMany({ orderBy: { id: 'desc' } })
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
            <p className="text-lg font-semibold text-slate-900">このページは SSR (Server Side Rendering) 版です</p>
            <p className="mt-2 text-slate-600">サーバー側でデータ取得をして、初回表示時に HTML を生成しています。DevTools の Network タブで最初の HTML レスポンスと API 呼び出しの違いを確認できます。</p>
            <Link href="/tasks" className="mt-4 inline-flex rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
              CSR版を見る
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold text-slate-900">Task 一覧（SSR）</h1>
              <p className="mt-2 text-slate-600">このページはサーバーで Task を取得して、初回表示時に HTML を生成します。</p>
            </div>

            <div className="space-y-5">
          {fetchError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {fetchError}
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-slate-700">
              Task が見つかりませんでした。
            </div>
          ) : (
            <ul className="space-y-5">
              {tasks.map((task) => (
                <li key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-medium text-slate-900">{task.title}</h2>
                      <p className="mt-2 text-slate-700">{task.body}</p>
                    </div>
                    <span className="mt-3 inline-flex shrink-0 rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 sm:mt-0">
                      ID: {task.id}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>作成: {task.createdAt.toLocaleString()}</span>
                    <span>更新: {task.updatedAt.toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
