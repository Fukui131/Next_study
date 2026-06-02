'use client'

import { useState } from 'react'

interface Task {
  id: number
  title: string
  body: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (d: Date | string) => {
    const date = d instanceof Date ? d : new Date(d)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
  }

  const incompleteTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

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

  const renderTaskItem = (task: Task) => (
    <li
      key={task.id}
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm ${task.completed ? 'opacity-70' : ''}`}
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
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
        <span>作成: {formatDate(task.createdAt)}</span>
        <span>更新: {formatDate(task.updatedAt)}</span>
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
  )

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : null}

      {/* 未完了タスク */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">未完了タスク</h2>
        <div className="space-y-5">
          {incompleteTasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-slate-700">未完了のタスクはありません。</div>
          ) : (
            <ul className="space-y-5">{incompleteTasks.map(renderTaskItem)}</ul>
          )}
        </div>
      </section>

      {/* 完了済みタスク */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">完了済みタスク</h2>
        <div className="space-y-5">
          {completedTasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-slate-700">完了済みのタスクはありません。</div>
          ) : (
            <ul className="space-y-5">{completedTasks.map(renderTaskItem)}</ul>
          )}
        </div>
      </section>
    </div>
  )
}
