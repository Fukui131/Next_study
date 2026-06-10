'use client'

import { useId, useState, type FormEvent } from 'react'
import type { CreateTaskRequest, Task } from '@/types/task'

interface TaskFormProps {
  disabled: boolean
  onCreateTask: (request: CreateTaskRequest) => Promise<Task>
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'タスクの追加に失敗しました。'
}

export function TaskForm({ disabled, onCreateTask }: TaskFormProps) {
  const idPrefix = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextTitle = title.trim()
    const nextBody = body.trim()

    if (!nextTitle || !nextBody) {
      setFormError('タイトルと本文を入力してください。')
      return
    }

    setSubmitting(true)
    setFormError(null)

    try {
      await onCreateTask({ title: nextTitle, body: nextBody })
      setTitle('')
      setBody('')
      setIsOpen(false)
    } catch (error) {
      setFormError(toErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const isSubmitDisabled = disabled || submitting

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        {isOpen ? 'キャンセル' : 'タスクを追加'}
      </button>

      {isOpen ? (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor={`${idPrefix}-title`} className="block text-sm font-medium text-slate-700">
              タイトル
            </label>
            <input
              id={`${idPrefix}-title`}
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              placeholder="タスクのタイトルを入力"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-body`} className="block text-sm font-medium text-slate-700">
              本文
            </label>
            <textarea
              id={`${idPrefix}-body`}
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              placeholder="タスクの内容を入力"
              rows={4}
            />
          </div>
          {formError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? '送信中' : 'Task を追加'}
          </button>
        </form>
      ) : null}
    </section>
  )
}
