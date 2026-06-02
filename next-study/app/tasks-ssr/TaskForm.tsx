'use client'

import { useState, type FormEvent } from 'react'

interface TaskCreatePayload {
  title: string
  body: string
}

export default function TaskForm() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !body.trim()) {
      setFormError('タイトルと本文を入力してください。')
      return
    }

    setSubmitting(true)
    setFormError(null)
    setSuccessMessage(null)

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

      setTitle('')
      setBody('')
      setIsFormOpen(false)
      setSuccessMessage(`「${(data as { title: string }).title}」が追加されました！`)
      
      // 2秒後にページをリロード（SSR的に最新データを取得）
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setFormError((err as Error).message || 'タスクの追加に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      {/* フォーム開閉ボタン */}
      <button
        type="button"
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        <span>{isFormOpen ? '−' : '+'}</span>
        <span>{isFormOpen ? 'キャンセル' : 'タスクを追加'}</span>
      </button>

      {/* フォーム（アニメーション付き） */}
      <div
        className={`space-y-4 transition-all duration-200 ${
          isFormOpen ? 'max-h-96 overflow-visible opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ssr-title" className="block text-sm font-medium text-slate-700">
              タイトル
            </label>
            <input
              id="ssr-title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              placeholder="タスクのタイトルを入力"
            />
          </div>
          <div>
            <label htmlFor="ssr-body" className="block text-sm font-medium text-slate-700">
              本文
            </label>
            <textarea
              id="ssr-body"
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
          {successMessage ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{successMessage}</div>
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

      {/* 説明 */}
      <div className="mt-4 rounded-xl border border-slate-300 bg-white p-4">
        <p className="text-sm font-medium text-slate-700">💡 このフォームについて</p>
        <p className="mt-2 text-sm text-slate-600">
          このページはサーバーサイドで Task データを取得していますが、<strong>フォーム送信はブラウザ（CSR）で実行</strong>されます。ボタンをクリックするとブラウザがサーバーに POST リクエストを送信し、新しい Task が追加されます。
        </p>
      </div>
    </div>
  )
}
