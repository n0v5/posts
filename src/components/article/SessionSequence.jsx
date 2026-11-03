const ACTORS = ['浏览器', 'Lenslog 服务器', 'Session 存储'];
const SHORT = ['浏览器', '服务器', 'Session'];

const STEPS = [
  { from: 0, to: 1, label: 'POST /login（用户名、密码）' },
  { from: 1, to: 2, label: '校验通过，创建 session_id' },
  { from: 2, to: 1, label: 'session_id → uid = 42' },
  { from: 1, to: 0, label: '200 + Set-Cookie: session_id=…; HttpOnly' },
  { from: 0, to: 1, label: 'POST /api/favorite（浏览器自动带 Cookie）' },
  { from: 1, to: 2, label: '查 session_id 对应谁' },
  { from: 2, to: 1, label: 'uid = 42' },
  { from: 1, to: 0, label: '200 收藏成功' },
];

const TONES = [
  'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-200',
  'border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200',
  'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200',
];

export default function SessionSequence() {
  return (
    <figure className="visual-breakout my-7 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-6">
      <figcaption className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Sequence · login → favorite
        </p>
        <p className="mt-1 text-base font-semibold text-zinc-800 dark:text-zinc-100">
          一张 Cookie + Session 的往返图
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          从上到下按时间读；每一行表示“谁向谁发消息”。
        </p>
      </figcaption>

      <div className="grid grid-cols-3 gap-2">
        {ACTORS.map((actor, index) => (
          <div
            key={actor}
            className={`rounded-lg border px-2 py-1.5 text-center text-xs font-bold ${TONES[index]}`}
          >
            {actor}
          </div>
        ))}
      </div>

      <ol className="mt-4 space-y-2" style={{ listStyle: 'none', paddingLeft: 0 }}>
        {STEPS.map((step, index) => (
          <li key={`${step.label}-${index}`} className="grid gap-1 sm:grid-cols-[150px_1fr] sm:items-start sm:gap-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 sm:pt-2">
              <span className="text-sky-700 dark:text-sky-300">{SHORT[step.from]}</span>
              <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-600">→</span>
              <span className="text-indigo-700 dark:text-indigo-300">{SHORT[step.to]}</span>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs leading-5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300">
              <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                {index + 1}
              </span>
              {step.label}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-xs leading-5 text-zinc-400">
        登录后浏览器只保存随机的 session_id；真正的 uid 在服务器/Session 存储里。每次请求自动带 Cookie，服务端查出用户，再决定这次收藏记给谁。
      </p>
    </figure>
  );
}
