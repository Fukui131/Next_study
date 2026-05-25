"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Task {
  id: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/tasks')
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data = (await res.json()) as Task[]
        setTasks(data)
      } catch (err) {
        setError((err as Error).message || '予期せぬエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">このページは CSR (Client Side Rendering) 版です</p>
            <p className="mt-2 text-slate-600">ブラウザ側で API fetch を行っています。初回表示時は空の状態からデータを取得し、更新後に一覧が表示されます。</p>
            <Link href="/tasks-ssr" className="mt-4 inline-flex rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
              SSR版を見る
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold text-slate-900">Task 一覧（CSR）</h1>
              <p className="mt-2 text-slate-600">このページはクライアントサイドで API から Task を取得します。</p>
            </div>

            <div className="space-y-5">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-slate-700">読み込み中...</div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">エラー: {error}</div>
          ) : tasks.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 text-slate-700">Task が見つかりませんでした。</div>
          ) : (
            <ul className="space-y-5">
              {tasks.map((task) => (
                <li key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-medium text-slate-900">{task.title}</h2>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">ID: {task.id}</span>
                  </div>
                  <p className="mt-2 text-slate-700">{task.body}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span>作成: {new Date(task.createdAt).toLocaleString()}</span>
                    <span>更新: {new Date(task.updatedAt).toLocaleString()}</span>
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
