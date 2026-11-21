export function PageHeader({ title, description, children }) {
  return (
    <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-[12px] leading-5 text-muted">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </header>
  )
}
