import { renderShortNames } from './majorShortNames.jsx';

export default function DataTable({ columns, rows, caption }) {
  return (
    <figure className="my-6">
      <p className="mb-1 text-[11px] text-zinc-400 sm:hidden">左右滑动查看完整表格</p>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table
          className="w-full min-w-[680px] border-collapse text-sm"
          style={{ display: 'table' }}
        >
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-3 py-2 font-semibold ${
                    column.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {renderShortNames(column.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-3 py-2.5 ${column.align === 'right' ? 'text-right tabular-nums' : ''} ${
                      column.nowrap ? 'whitespace-nowrap' : ''
                    }`}
                  >
                    {renderShortNames(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[11px] leading-5 text-zinc-400">
          {renderShortNames(caption)}
        </figcaption>
      )}
    </figure>
  );
}
