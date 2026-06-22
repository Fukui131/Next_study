'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { taskService } from '@/services/taskService'
import type { CreateTaskRequest, DeleteTaskRequest, Task, UpdateTaskRequest } from '@/types/task'

interface UseTasksOptions {
  initialTasks?: Task[]
  initialError?: string | null
  fetchOnMount?: boolean
}

interface UseTasksReturn {
  loading: boolean
  error: string | null
  tasks: Task[]
  isMutating: boolean
  createTask: (request: CreateTaskRequest) => Promise<Task>
  updateTask: (id: number, request: UpdateTaskRequest) => Promise<Task>
  deleteTask: (request: DeleteTaskRequest) => Promise<DeleteTaskRequest>
  refetch: () => Promise<void>
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const initialTasks = options.initialTasks ?? []
  const initialError = options.initialError ?? null
  const fetchOnMount = options.fetchOnMount ?? true
  const mountedRef = useRef(false)

  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [loading, setLoading] = useState(fetchOnMount)
  const [error, setError] = useState<string | null>(initialError)
  const [isMutating, setIsMutating] = useState(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const fetchedTasks = await taskService.getTasks()

      if (mountedRef.current) {
        setTasks(fetchedTasks)
      }
    } catch (caughtError) {
      if (mountedRef.current) {
        setError(toErrorMessage(caughtError, 'タスクの読み込みに失敗しました。'))
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!fetchOnMount) {
      return
    }

    let cancelled = false

    async function loadInitialTasks() {
      try {
        const fetchedTasks = await taskService.getTasks()

        if (!cancelled && mountedRef.current) {
          setTasks(fetchedTasks)
          setError(null)
        }
      } catch (caughtError) {
        if (!cancelled && mountedRef.current) {
          setError(toErrorMessage(caughtError, 'タスクの読み込みに失敗しました。'))
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false)
        }
      }
    }

    void loadInitialTasks()

    return () => {
      cancelled = true
    }
  }, [fetchOnMount])

  const createTask = useCallback(async (request: CreateTaskRequest) => {
    setIsMutating(true)
    setError(null)

    try {
      const createdTask = await taskService.createTask(request)

      if (mountedRef.current) {
        setTasks((currentTasks) => [createdTask].concat(currentTasks))
      }

      return createdTask
    } catch (caughtError) {
      const message = toErrorMessage(caughtError, 'タスクの追加に失敗しました。')

      if (mountedRef.current) {
        setError(message)
      }

      if (caughtError instanceof Error) {
        throw caughtError
      }

      throw new Error(message)
    } finally {
      if (mountedRef.current) {
        setIsMutating(false)
      }
    }
  }, [])

  const updateTask = useCallback(async (id: number, request: UpdateTaskRequest) => {
    setIsMutating(true)
    setError(null)

    try {
      const updatedTask = await taskService.updateTask(id, request)

      if (mountedRef.current) {
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task.id === id ? updatedTask : task)),
        )
      }

      return updatedTask
    } catch (caughtError) {
      const message = toErrorMessage(caughtError, 'タスクの更新に失敗しました。')

      if (mountedRef.current) {
        setError(message)
      }

      if (caughtError instanceof Error) {
        throw caughtError
      }

      throw new Error(message)
    } finally {
      if (mountedRef.current) {
        setIsMutating(false)
      }
    }
  }, [])

  const deleteTask = useCallback(async (request: DeleteTaskRequest) => {
    setIsMutating(true)
    setError(null)

    try {
      const deletedTask = await taskService.deleteTask(request)

      if (mountedRef.current) {
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== request.id))
      }

      return deletedTask
    } catch (caughtError) {
      const message = toErrorMessage(caughtError, 'タスクの削除に失敗しました。')

      if (mountedRef.current) {
        setError(message)
      }

      if (caughtError instanceof Error) {
        throw caughtError
      }

      throw new Error(message)
    } finally {
      if (mountedRef.current) {
        setIsMutating(false)
      }
    }
  }, [])

  return {
    loading,
    error,
    tasks,
    isMutating,
    createTask,
    updateTask,
    deleteTask,
    refetch,
  }
}
