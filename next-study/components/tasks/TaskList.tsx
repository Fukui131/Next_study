import { TaskItem } from '@/components/tasks/TaskItem'
import type { Task } from '@/types/task'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  disabled: boolean
  onRetry: () => Promise<void>
  onToggleCompleted: (task: Task) => Promise<void>
  onDeleteTask: (task: Task) => Promise<void>
}

interface TaskSectionProps {
  title: string
  emptyMessage: string
  tasks: Task[]
  disabled: boolean
  onToggleCompleted: (task: Task) => Promise<void>
  onDeleteTask: (task: Task) => Promise<void>
}

function TaskSection({
  title,
  emptyMessage,
  tasks,
  disabled,
  onToggleCompleted,
  onDeleteTask,
}: TaskSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-900">{title}</h2>
      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          {emptyMessage}
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              disabled={disabled}
              onToggleCompleted={onToggleCompleted}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export function TaskList({
  tasks,
  loading,
  error,
  disabled,
  onRetry,
  onToggleCompleted,
  onDeleteTask,
}: TaskListProps) {
  const incompleteTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="space-y-6">
      {error ? (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <p>エラー: {error}</p>
          <button
            type="button"
            onClick={() => void onRetry()}
            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            再読み込み
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          読み込み中
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          Task が見つかりませんでした。
        </div>
      ) : (
        <div className="space-y-8">
          <TaskSection
            title="未完了タスク"
            emptyMessage="未完了のタスクはありません。"
            tasks={incompleteTasks}
            disabled={disabled}
            onToggleCompleted={onToggleCompleted}
            onDeleteTask={onDeleteTask}
          />
          <TaskSection
            title="完了済みタスク"
            emptyMessage="完了済みのタスクはありません。"
            tasks={completedTasks}
            disabled={disabled}
            onToggleCompleted={onToggleCompleted}
            onDeleteTask={onDeleteTask}
          />
        </div>
      )}
    </div>
  )
}
