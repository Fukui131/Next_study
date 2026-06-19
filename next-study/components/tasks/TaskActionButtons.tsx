import type { Task } from '@/types/task'

interface TaskActionButtonsProps {
  task: Task
  disabled: boolean
  onToggleCompleted: (task: Task) => Promise<void>
  onDeleteTask: (task: Task) => Promise<void>
}

export function TaskActionButtons({
  task,
  disabled,
  onToggleCompleted,
  onDeleteTask,
}: TaskActionButtonsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => void onToggleCompleted(task)}
        disabled={disabled}
        className={`min-h-10 rounded-lg px-4 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${
          task.completed ? 'bg-slate-600 hover:bg-slate-700' : 'bg-emerald-700 hover:bg-emerald-800'
        }`}
      >
        {task.completed ? '未完了に戻す' : '完了にする'}
      </button>
      <button
        type="button"
        onClick={() => void onDeleteTask(task)}
        disabled={disabled}
        className="min-h-10 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
      >
        削除
      </button>
    </div>
  )
}
