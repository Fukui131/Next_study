'use client'

import { useCallback } from 'react'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskList } from '@/components/tasks/TaskList'
import { useTasks } from '@/hooks/useTasks'
import type { CreateTaskRequest, Task } from '@/types/task'

interface TaskManagerProps {
  initialTasks?: Task[]
  initialError?: string | null
  fetchOnMount: boolean
}

export function TaskManager({ initialTasks, initialError, fetchOnMount }: TaskManagerProps) {
  const {
    tasks,
    loading,
    error,
    isMutating,
    createTask,
    updateTask,
    deleteTask,
    refetch,
  } = useTasks({
    initialTasks,
    initialError,
    fetchOnMount,
  })

  const handleCreateTask = useCallback(
    async (request: CreateTaskRequest) => createTask(request),
    [createTask],
  )

  const handleToggleCompleted = useCallback(
    async (task: Task) => {
      try {
        await updateTask(task.id, { completed: !task.completed })
      } catch {
        return
      }
    },
    [updateTask],
  )

  const handleDeleteTask = useCallback(
    async (task: Task) => {
      if (!window.confirm('このタスクを削除してもよろしいですか？')) {
        return
      }

      try {
        await deleteTask({ id: task.id })
      } catch {
        return
      }
    },
    [deleteTask],
  )

  return (
    <div className="space-y-6">
      <TaskForm disabled={isMutating} onCreateTask={handleCreateTask} />
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        disabled={isMutating}
        onRetry={refetch}
        onToggleCompleted={handleToggleCompleted}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}
