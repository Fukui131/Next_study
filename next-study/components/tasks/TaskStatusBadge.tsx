interface TaskStatusBadgeProps {
  completed: boolean
}

export function TaskStatusBadge({ completed }: TaskStatusBadgeProps) {
  const className = completed
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    : 'bg-slate-100 text-slate-700 ring-slate-200'

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${className}`}>
      {completed ? '完了済み' : '未完了'}
    </span>
  )
}
