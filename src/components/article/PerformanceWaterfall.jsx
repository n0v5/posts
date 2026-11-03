import { useState } from 'react';

const TOTAL = 930;
const LCP_AT = 900;

const PHASES = [
  {
    id: 'dns',
    label: 'DNS',
    start: 0,
    duration: 40,
    color: 'bg-sky-400',
    detail: '把域名解析成 IP。解析慢或 TTL 配置不当，会让后续所有步骤一起推迟。',
    fix: '检查解析服务、TTL、CDN CNAME 与本地 DNS 缓存。',
  },
  {
    id: 'tcp',
    label: 'TCP',
    start: 40,
    duration: 40,
    color: 'bg-cyan-400',
    detail: '建立传输连接。高延迟或丢包会放大握手成本。',
    fix: '使用 CDN/边缘节点、HTTP/2 或 HTTP/3，减少新建连接。',
  },
  {
    id: 'tls',
    label: 'TLS',
    start: 80,
    duration: 60,
    color: 'bg-teal-400',
    detail: '证书验证与密钥协商。证书链、OCSP 和中间盒都可能增加耗时。',
    fix: '启用 TLS 1.3、会话复用、OCSP stapling 与证书链优化。',
  },
  {
    id: 'ttfb',
    label: 'TTFB',
    start: 140,
    duration: 280,
    color: 'bg-indigo-400',
    detail: '服务器处理并返回首字节。它可能包含应用逻辑、数据库查询、缓存访问或第三方 API。',
    fix: '看服务端 p95/p99、慢查询、N+1、锁等待、缓存命中与依赖超时。',
  },
  {
    id: 'html',
    label: 'HTML',
    start: 420,
    duration: 80,
    color: 'bg-violet-400',
    detail: '下载 HTML 文档。过大的 HTML 会推迟解析与发现关键资源。',
    fix: '流式输出、压缩、减少内联体积、避免在首屏塞入大段数据。',
  },
  {
    id: 'assets',
    label: '关键资源',
    start: 500,
    duration: 250,
    color: 'bg-amber-400',
    detail: 'CSS、字体、首屏 JS 等阻塞渲染的资源。资源越多、越大，首屏越晚。',
    fix: '代码分割、tree-shaking、预加载关键资源、字体子集与延迟非关键脚本。',
  },
  {
    id: 'render',
    label: '渲染',
    start: 750,
    duration: 180,
    color: 'bg-orange-400',
    detail: '解析、布局、绘制与合成。主线程长任务会阻塞渲染与交互。',
    fix: '减少长任务、避免布局抖动、用 transform/opacity 做动画、虚拟列表。',
  },
];

export default function PerformanceWaterfall() {
  const [activeId, setActiveId] = useState('ttfb');
  const phase = PHASES.find((item) => item.id === activeId) ?? PHASES[3];

  return (
    <section
      className="visual-breakout my-8 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7"
      aria-labelledby="performance-waterfall-title"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Performance waterfall
          </p>
          <h3 id="performance-waterfall-title" className="text-lg font-bold tracking-tight">
            性能瀑布：时间是花在哪一段的
          </h3>
          <p className="mt-1 text-base font-semibold leading-6 text-zinc-700 dark:text-zinc-300">
            先找最大的一段，不要平均优化。
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            点击阶段查看优化方向；柱状图是示意数据，线上要看 p75/p95 与真实用户监控。
          </p>
        </div>
        <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] text-zinc-400 dark:border-zinc-700">
          示意总时长 {TOTAL} ms
        </span>
      </div>

      <div className="space-y-1.5" role="group" aria-label="性能阶段">
        {PHASES.map((item) => {
          const selected = item.id === activeId;
          const left = (item.start / TOTAL) * 100;
          const width = (item.duration / TOTAL) * 100;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(item.id)}
              className={`grid w-full grid-cols-[86px_1fr] items-center gap-2 rounded-lg px-1 py-1 text-left transition sm:grid-cols-[110px_1fr] ${
                selected ? 'bg-zinc-100 dark:bg-zinc-800/60' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
              }`}
            >
              <span className="pl-1">
                <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.label}</span>
                <span className="block text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">{item.duration}ms</span>
              </span>
              <span className="relative block h-7 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800/60">
                <span
                  className={`absolute top-0 h-full rounded-md ${item.color} ${selected ? 'opacity-100' : 'opacity-70'}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  aria-hidden="true"
                />
              </span>
            </button>
          );
        })}

        <div className="grid grid-cols-[86px_1fr] items-center gap-2 px-1 py-1 sm:grid-cols-[110px_1fr]">
          <span className="pl-1">
            <span className="block text-xs font-medium text-rose-500 dark:text-rose-400">LCP 标记</span>
            <span className="block text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">{LCP_AT}ms</span>
          </span>
          <span
            className="relative block h-7 rounded-md bg-zinc-100 dark:bg-zinc-800/60"
            aria-label={`LCP 出现在 ${LCP_AT} 毫秒`}
          >
            <span
              className="absolute inset-y-0 border-l-2 border-dashed border-rose-500"
              style={{ left: `${(LCP_AT / TOTAL) * 100}%` }}
              aria-hidden="true"
            />
            <span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-rose-500"
              style={{ left: `${(LCP_AT / TOTAL) * 100}%` }}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{phase.label}</h4>
        <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{phase.detail}</p>
        <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">优先动作：</span>
          {phase.fix}
        </p>
      </div>

      <p className="mt-3 text-xs leading-5 text-zinc-400">
        LCP 是相对导航开始的时间点，不是一段独立的耗时；文本 LCP 常在渲染中确定，图片 LCP 还可能受下载时机影响。同一段耗时在不同链路上也可能重叠，先用真实数据定位最大瓶颈，再优化。
      </p>
    </section>
  );
}
