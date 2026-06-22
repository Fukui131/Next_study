'use client'

import { useId } from 'react'

interface TaskSearchInputProps {
  value: string
  totalCount: number
  resultCount: number
  onChange: (value: string) => void
}

export function TaskSearchInput({
  value,
  totalCount,
  resultCount,
  onChange,
}: TaskSearchInputProps) {
  const inputId = useId()
  const hasKeyword = value.trim().length > 0

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            タスク検索
          </label>
          <input
            id={inputId}
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            placeholder="タスク名で検索"
          />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm text-slate-600">
            表示: {resultCount} / {totalCount} 件
          </span>
          {hasKeyword ? (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              クリア
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
