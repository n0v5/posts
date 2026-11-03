const styles = {
  eli5: {
    label: '人话版',
    icon: '◎',
    box: 'border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/70 dark:bg-indigo-950/25',
    head: 'text-indigo-700 dark:text-indigo-300',
  },
  metaphor: {
    label: '可以这样想',
    icon: '◇',
    box: 'border-teal-200 bg-teal-50/60 dark:border-teal-900/70 dark:bg-teal-950/20',
    head: 'text-teal-700 dark:text-teal-300',
  },
  tip: {
    label: '怎么用',
    icon: '→',
    box: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/70 dark:bg-emerald-950/20',
    head: 'text-emerald-700 dark:text-emerald-300',
  },
  warning: {
    label: '注意',
    icon: '!',
    box: 'border-amber-200 bg-amber-50/70 dark:border-amber-900/70 dark:bg-amber-950/20',
    head: 'text-amber-700 dark:text-amber-300',
  },
  pitfall: {
    label: '常见误解',
    icon: '×',
    box: 'border-rose-200 bg-rose-50/60 dark:border-rose-900/70 dark:bg-rose-950/20',
    head: 'text-rose-700 dark:text-rose-300',
  },
  note: {
    label: '补一句',
    icon: '·',
    box: 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60',
    head: 'text-zinc-600 dark:text-zinc-400',
  },
};

export function Callout({ type = 'note', title, limit, children }) {
  const s = styles[type] ?? styles.note;
  return (
    <div role="note" className={`my-6 rounded-2xl border p-4 sm:p-5 ${s.box}`}>
      <div className={`mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold uppercase tracking-[0.16em] ${s.head}`}>
        <span aria-hidden="true" className="text-sm">{s.icon}</span>
        <span>{s.label}</span>
        {title && (
          <span className="text-sm font-semibold normal-case tracking-normal">· {title}</span>
        )}
      </div>
      <div className="text-[15px] leading-7 text-zinc-700 [&_p]:my-1 dark:text-zinc-300">
        {children}
      </div>
      {limit && (
        <p className="mt-3 border-t border-black/10 pt-2 text-xs leading-6 text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          <span className="font-semibold text-zinc-600 dark:text-zinc-300">比喻的边界：</span>
          {limit}
        </p>
      )}
    </div>
  );
}

export function DeepDive({ title = '技术细节', children }) {
  return (
    <details className="group my-6 rounded-2xl border border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-zinc-800 marker:hidden dark:text-zinc-200 sm:px-5">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="text-xs text-zinc-400">▸</span>
          {title}
        </span>
        <span className="text-xs font-normal text-zinc-400">
          <span className="group-open:hidden">展开</span>
          <span className="hidden group-open:inline">收起</span>
        </span>
      </summary>
      <div className="border-t border-zinc-200 px-4 py-4 text-sm leading-7 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300 sm:px-5 [&_p]:my-2">
        {children}
      </div>
    </details>
  );
}

export function Badge({ children, tone = 'zinc' }) {
  const tones = {
    zinc: 'border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400',
    indigo: 'border-indigo-200 text-indigo-600 dark:border-indigo-900 dark:text-indigo-300',
    emerald: 'border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300',
    amber: 'border-amber-200 text-amber-700 dark:border-amber-900 dark:text-amber-300',
    rose: 'border-rose-200 text-rose-700 dark:border-rose-900 dark:text-rose-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium leading-5 ${tones[tone] ?? tones.zinc}`}>
      {children}
    </span>
  );
}
