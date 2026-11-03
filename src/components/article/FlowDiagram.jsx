export default function FlowDiagram({ title, caption, steps, note }) {
  return (
    <figure className="visual-breakout my-7 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-6">
      <figcaption className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Flow · {title}
        </p>
        {caption && (
          <p className="mt-1 text-base font-semibold leading-6 text-zinc-800 dark:text-zinc-100">{caption}</p>
        )}
      </figcaption>

      <div className="flex flex-col gap-1 sm:flex-row sm:items-stretch">
        {steps.map((step, index) => (
          <div key={step.title} className="contents">
            <div
              className={`flex-1 rounded-xl border p-3 ${
                step.tone === 'problem'
                  ? 'border-rose-200 bg-rose-50/70 dark:border-rose-900/70 dark:bg-rose-950/20'
                  : step.tone === 'fix'
                    ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/70 dark:bg-emerald-950/20'
                    : 'border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-950/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] font-bold text-zinc-500 dark:bg-zinc-900/70 dark:text-zinc-300">
                  {index + 1}
                </span>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{step.title}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-300">{step.detail}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center py-0.5 text-zinc-300 dark:text-zinc-600 sm:px-1 sm:py-0">
                <span className="text-xs sm:hidden">↓</span>
                <span className="hidden text-sm sm:inline">→</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {note && <p className="mt-3 text-xs leading-5 text-zinc-400">{note}</p>}
    </figure>
  );
}
