import Link from 'next/link'

interface TaskPageHeaderProps {
  title: string
  description: string
  switchHref: string
  switchLabel: string
}

export function TaskPageHeader({
  title,
  description,
  switchHref,
  switchLabel,
}: TaskPageHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <Link
          href={switchHref}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          {switchLabel}
        </Link>
      </div>
    </header>
  )
}
