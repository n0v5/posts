import { useState } from 'react';

const STAGES = [
  {
    id: 'dns',
    label: 'DNS',
    short: '域名 → IP',
    actor: '浏览器 ↔ 递归解析器 ↔ 权威 DNS',
    does: '把域名翻译成 IP 地址，并按 TTL 缓存结果。它是 HTTP 请求之前的寻址步骤。',
    not: 'DNS 不是 HTTP 的一部分；域名注册商和 DNS 托管商也可以是两家。',
    fail: 'NXDOMAIN、TTL 未生效、解析到旧 IP、权威/递归配置错误。',
    terms: 'A/AAAA/CNAME、TTL、递归解析、权威 DNS',
  },
  {
    id: 'tls',
    label: 'TCP / TLS',
    short: '连接与加密',
    actor: '浏览器 ↔ 服务器',
    does: '建立可靠连接；TLS 验证证书并协商加密。HTTP/3 改用基于 UDP 的 QUIC。',
    not: 'HTTPS 不是另一种 HTTP，而是 HTTP over TLS；TLS 也不负责应用层鉴权。',
    fail: '证书过期或域名不匹配、握手失败、TLS 版本不兼容、中间盒干扰。',
    terms: 'TCP、UDP、QUIC、TLS 1.3、SNI、证书链',
  },
  {
    id: 'edge',
    label: 'CDN / WAF',
    short: '缓存与过滤',
    actor: '边缘节点 ↔ 源站',
    does: '在离用户更近的节点提供缓存内容；WAF 过滤恶意流量；部分逻辑在边缘执行。',
    not: 'CDN 不等于边缘函数；WAF 也不替代应用层的身份与权限校验。',
    fail: '缓存误命中个性化响应、purge 未生效、回源超时、WAF 误杀正常请求。',
    terms: '缓存键、TTL、回源、PoP、WAF、边缘函数',
  },
  {
    id: 'gateway',
    label: 'LB / 网关',
    short: '分发与治理',
    actor: '流量入口 ↔ 应用实例',
    does: '负载均衡在实例间分发流量；API 网关集中做鉴权、限流、路由、配额与观测。',
    not: '负载均衡不是 API 网关；反向代理不一定是 BFF；BFF 是面向前端的聚合层。',
    fail: '502/504、连接池耗尽、限流误伤、路由规则错误、证书终止配置错误。',
    terms: 'L4/L7、反向代理、API Gateway、BFF、连接池',
  },
  {
    id: 'app',
    label: '应用服务',
    short: '业务逻辑',
    actor: '路由 ↔ 中间件 ↔ 业务代码',
    does: '解析路由、校验输入、执行鉴权与业务规则，调用数据库、缓存、队列或外部 API。',
    not: '框架不是业务本身；HTTP 中间件也不是消息中间件。',
    fail: '未捕获异常、CPU 阻塞事件循环、依赖超时、重试风暴、权限遗漏。',
    terms: '中间件、路由、DTO/校验、幂等、限流',
  },
  {
    id: 'data',
    label: '数据与依赖',
    short: '持久化与异步',
    actor: '数据库 / 缓存 / 队列 / 外部服务',
    does: '读写数据库、命中间存、投递异步任务，或调用第三方服务。',
    not: '缓存不是数据库；消息队列也不提供跨库事务。',
    fail: '慢查询、N+1、锁等待、缓存击穿、消息积压、第三方超时。',
    terms: '索引、事务、连接池、缓存、消息队列',
  },
  {
    id: 'response',
    label: '响应',
    short: 'HTML / JSON / 流',
    actor: '服务器 → 浏览器',
    does: '返回状态码、头部与响应体；浏览器解析、渲染、水合或更新客户端状态。',
    not: 'HTTP 200 不代表业务成功；CORS 失败也可能让请求在浏览器侧表现为不可读。',
    fail: '内容类型错误、压缩/缓存配置错误、CORS、水合不匹配、主线程长任务。',
    terms: '状态码、Content-Type、Cache-Control、CORS、hydration',
  },
];

export default function RequestJourney() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <section
      className="visual-breakout my-8 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7"
      aria-labelledby="request-journey-title"
    >
      <div className="mb-4">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Request lifecycle
        </p>
        <h3 id="request-journey-title" className="text-lg font-bold tracking-tight">
          一次请求的旅程
        </h3>
        <p className="mt-1 text-base font-semibold leading-6 text-zinc-700 dark:text-zinc-300">
          先确认请求停在哪一段，再谈性能或安全。
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          点击阶段查看职责、边界与典型故障；真实系统可能省略、合并或重复某些阶段。
        </p>
      </div>

      <div className="grid w-full min-w-0 grid-cols-2 gap-1.5 sm:flex sm:overflow-x-auto sm:pb-2" role="group" aria-label="请求阶段">
        {STAGES.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(index)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center transition sm:min-w-[92px] sm:shrink-0 sm:flex-1 ${
                selected
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
              }`}
            >
              <span className={`text-[10px] font-bold ${selected ? 'opacity-70' : 'text-zinc-400'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold">{item.label}</span>
              <span className={`text-[10px] leading-4 ${selected ? 'opacity-70' : 'text-zinc-400'}`}>
                {item.short}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {String(active + 1).padStart(2, '0')} · {stage.label}
          </h4>
          <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            {stage.actor}
          </span>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
              它在做什么
            </dt>
            <dd className="mt-1 leading-6 text-zinc-600 dark:text-zinc-300">{stage.does}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-600 dark:text-amber-400">
              它不是什么
            </dt>
            <dd className="mt-1 leading-6 text-zinc-600 dark:text-zinc-300">{stage.not}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-rose-600 dark:text-rose-400">
              典型故障
            </dt>
            <dd className="mt-1 leading-6 text-zinc-600 dark:text-zinc-300">{stage.fail}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-400">
              对应术语
            </dt>
            <dd className="mt-1 leading-6 text-zinc-600 dark:text-zinc-300">{stage.terms}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-3 text-xs leading-5 text-zinc-400">
        排障提示：先确认请求停在哪一段，再讨论"性能"或"安全"。跨层猜测通常会把问题带到错误的团队。
      </p>
    </section>
  );
}
