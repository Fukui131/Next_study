'use client'

import { useId, useState, type FormEvent } from 'react'
import type { Task, UpdateTaskRequest } from '@/types/task'

interface TaskEditFormProps {
  task: Task
  disabled: boolean
  onCancel: () => void
  onUpdateTask: (request: UpdateTaskRequest) => Promise<void>
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'タスクの更新に失敗しました。'
}

export function TaskEditForm({ task, disabled, onCancel, onUpdateTask }: TaskEditFormProps) {
  const idPrefix = useId()
  const [title, setTitle] = useState(task.title)
  const [body, setBody] = useState(task.body)
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
      await onUpdateTask({ title: nextTitle, body: nextBody })
      onCancel()
    } catch (error) {
      setFormError(toErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const isSubmitDisabled = disabled || submitting

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 border-t border-slate-200 pt-4"
    >
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
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {formError}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? '保存中' : '保存'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitDisabled}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
