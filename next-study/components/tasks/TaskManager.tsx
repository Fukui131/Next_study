'use client'

import { useCallback, useMemo, useState } from 'react'
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskList } from '@/components/tasks/TaskList'
import { TaskSearchInput } from '@/components/tasks/TaskSearchInput'
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
  const [searchKeyword, setSearchKeyword] = useState('')
  const normalizedSearchKeyword = searchKeyword.trim().toLocaleLowerCase()

  const filteredTasks = useMemo(() => {
    if (!normalizedSearchKeyword) {
      return tasks
    }

    return tasks.filter((task) =>
      task.title.toLocaleLowerCase().includes(normalizedSearchKeyword),
    )
  }, [tasks, normalizedSearchKeyword])

  const handleCreateTask = useCallback(
    async (request: CreateTaskRequest) => createTask(request),
    [createTask],
  )

  const handleUpdateTask = useCallback(
    async (task: Task, request: CreateTaskRequest) => {
      await updateTask(task.id, request)
    },
    [updateTask],
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
      <TaskSearchInput
        value={searchKeyword}
        totalCount={tasks.length}
        resultCount={filteredTasks.length}
        onChange={setSearchKeyword}
      />
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        disabled={isMutating}
        emptyMessage={
          normalizedSearchKeyword
            ? '検索条件に一致する Task はありません。'
            : 'Task が見つかりませんでした。'
        }
        onRetry={refetch}
        onUpdateTask={handleUpdateTask}
        onToggleCompleted={handleToggleCompleted}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}
