const segments = [
  { key: 'public', label: '公共基础', className: 'bg-zinc-300 dark:bg-zinc-600' },
  { key: 'required', label: '专业必修', className: 'bg-red-700 dark:bg-red-500' },
  { key: 'elective', label: '选修', className: 'bg-amber-400' },
];

export default function CreditBars({ items, caption }) {
  return (
    <figure className="my-6 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-5">
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
        {segments.map((segment) => (
          <span key={segment.key} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${segment.className}`} aria-hidden="true" />
            {segment.label}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const total = item.total || item.public + item.required + item.elective;
          return (
            <div key={item.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{item.label}</span>
                <span className="text-xs tabular-nums text-zinc-500">{total} 学分</span>
              </div>
              <div
                className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
                role="img"
                aria-label={`${item.label}：公共基础 ${item.public}，专业必修 ${item.required}，选修 ${item.elective}`}
              >
                {segments.map((segment) => (
                  <div
                    key={segment.key}
                    className={segment.className}
                    style={{ width: `${(item[segment.key] / total) * 100}%` }}
                    title={`${segment.label} ${item[segment.key]} 学分`}
                  />
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-zinc-500">
                {segments.map((segment) => (
                  <span key={segment.key}>
                    {segment.label} {item[segment.key]}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {caption && (
        <figcaption className="mt-4 border-t border-zinc-100 pt-3 text-[11px] leading-5 text-zinc-400 dark:border-zinc-800">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
