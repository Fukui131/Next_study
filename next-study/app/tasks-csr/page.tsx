"use client"

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'

interface Task {
  id: number
  title: string
  body: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

interface TaskCreatePayload {
  title: string
  body: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setError(null)
      setLoading(true)

      try {
        const res = await fetch('/api/tasks')
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data = (await res.json()) as Task[]
        if (!cancelled) setTasks(data)
      } catch (err) {
        if (!cancelled) setError((err as Error).message || '予期せぬエラーが発生しました')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !body.trim()) {
      setFormError('タイトルと本文を入力してください。')
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim() } satisfies TaskCreatePayload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error ?? `API error: ${res.status}`)
      }

      setTasks((current) => [data as Task, ...current])
      setTitle('')
      setBody('')
      setIsFormOpen(false)
    } catch (err) {
      setFormError((err as Error).message || 'タスクの追加に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleCompleted(taskId: number, completed: boolean) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      })

      const updatedTask = await res.json()
      if (!res.ok) {
        throw new Error(updatedTask?.error ?? `API error: ${res.status}`)
      }

      setTasks((current) =>
        current.map((task) => (task.id === taskId ? (updatedTask as Task) : task)),
      )
    } catch (err) {
      setError((err as Error).message || 'タスクの更新に失敗しました。')
    }
  }

  async function deleteTask(taskId: number) {
    if (!window.confirm('このタスクを削除してもよろしいですか？')) {
      return
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error ?? `API error: ${res.status}`)
      }
      setTasks((current) => current.filter((task) => task.id !== taskId))
    } catch (err) {
      setError((err as Error).message || 'タスクの削除に失敗しました。')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <p className="text-lg font-semibold text-slate-900">このページは CSR版です</p>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">データ取得はブラウザ側(fetch)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">Task追加もブラウザ操作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">完了切替もブラウザ操作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">削除もブラウザ操作</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">初回表示後にAPI通信が発生します</span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">フォームについて</p>
                <ul className="mt-2 space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">「＋タスクを追加」を押すとフォームが開きます</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">入力後にPOST APIを呼び出します</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sm font-bold text-slate-900">•</span>
                    <span className="text-sm">追加後は再読み込みせず一覧更新されます</span>
                  </li>
                </ul>
              </div>
            </div>
            <Link href="/tasks-ssr" className="mt-4 inline-flex rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
              SSR版を見る
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold text-slate-900">Task 一覧（CSR）</h1>
              <p className="mt-2 text-slate-600">このページはクライアントサイドで API から Task を取得します。</p>
            </div>

            {/* フォーム開閉ボタン */}
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <span>{isFormOpen ? '−' : '+'}</span>
              <span>{isFormOpen ? 'キャンセル' : 'タスクを追加'}</span>
            </button>

            {/* フォーム（アニメーション付き） */}
            <div
              className={`space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-200 ${
                isFormOpen ? 'mb-6 max-h-96 overflow-visible opacity-100' : 'max-h-0 overflow-hidden opacity-0'
              }`}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                    タイトル
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    placeholder="タスクのタイトルを入力"
                  />
                </div>
                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-slate-700">
                    本文
                  </label>
                  <textarea
                    id="body"
                    name="body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    placeholder="タスクの内容を入力"
                    rows={4}
                  />
                </div>
                {formError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{formError}</div>
                ) : null}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {submitting ? '送信中...' : 'Task を追加'}
                </button>
              </form>
            </div>

            {/* Task 一覧 */}
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
                    <li
                      key={task.id}
                      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm ${task.completed ? 'opacity-80' : ''}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className={`text-xl font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                              {task.title}
                            </h2>
                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                              {task.completed ? '完了済み' : '未完了'}
                            </span>
                          </div>
                          <p className={`mt-2 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{task.body}</p>
                        </div>
                        <span className="inline-flex shrink-0 rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">ID: {task.id}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>作成: {new Date(task.createdAt).toLocaleString()}</span>
                        <span>更新: {new Date(task.updatedAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCompleted(task.id, task.completed)}
                          className={`rounded-2xl px-4 py-2 text-sm font-medium text-white transition ${task.completed ? 'bg-slate-500 hover:bg-slate-600' : 'bg-emerald-700 hover:bg-emerald-800'}`}
                        >
                          {task.completed ? '未完了に戻す' : '完了にする'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                          削除
                        </button>
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
