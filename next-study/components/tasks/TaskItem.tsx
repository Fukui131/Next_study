import { TaskActionButtons } from '@/components/tasks/TaskActionButtons'
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge'
import type { Task } from '@/types/task'

interface TaskItemProps {
  task: Task
  disabled: boolean
  onToggleCompleted: (task: Task) => Promise<void>
  onDeleteTask: (task: Task) => Promise<void>
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '日時不明'
  }

  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function TaskItem({ task, disabled, onToggleCompleted, onDeleteTask }: TaskItemProps) {
  const titleClassName = task.completed
    ? 'text-slate-500 line-through'
    : 'text-slate-950'

  const bodyClassName = task.completed
    ? 'text-slate-500 line-through'
    : 'text-slate-700'

  return (
    <li className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${task.completed ? 'opacity-80' : ''}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`break-words text-lg font-semibold ${titleClassName}`}>{task.title}</h2>
            <TaskStatusBadge completed={task.completed} />
          </div>
          <p className={`mt-2 whitespace-pre-wrap break-words text-sm leading-6 ${bodyClassName}`}>
            {task.body}
          </p>
        </div>
        <span className="inline-flex shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          ID: {task.id}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span>作成: {formatDate(task.createdAt)}</span>
        <span>更新: {formatDate(task.updatedAt)}</span>
      </div>
      <TaskActionButtons
        task={task}
        disabled={disabled}
        onToggleCompleted={onToggleCompleted}
        onDeleteTask={onDeleteTask}
      />
    </li>
  )
}
