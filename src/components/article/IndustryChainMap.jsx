import { useState } from 'react';

const LAYERS = [
  {
    id: 'standards',
    name: '标准与协议',
    examples: 'W3C · WHATWG · TC39 · IETF · Khronos',
    provides: '互操作规则：HTTP、HTML、CSS、ECMAScript、TLS 等。',
    money: '会员费、赞助、生态影响力；标准本身通常不直接收费。',
    relation: '定义接口，由浏览器、运行时与平台实现。下游的实现差异会反馈回标准讨论。',
    color: 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/30',
  },
  {
    id: 'infra',
    name: '基础设施',
    examples: '云厂商 · CDN · 芯片 · 数据中心 · DNS/CA',
    provides: '算力、存储、网络、分发、域名与证书信任。',
    money: '按量计费、企业合同、流量与订阅。',
    relation: '支撑运行时和平台；出口流量、网络质量与区域覆盖会直接影响上层体验。',
    color: 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/30',
  },
  {
    id: 'runtime',
    name: '运行时与开源',
    examples: '浏览器引擎 · Node/Bun/Deno · Linux · CNCF',
    provides: '代码执行环境、系统能力、容器编排与开源基础设施。',
    money: '赞助、托管服务、支持合同、企业雇佣维护者。',
    relation: '框架与工具依赖运行时；开源项目常由下游公司资助或雇佣维护。',
    color: 'border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-950/30',
  },
  {
    id: 'framework',
    name: '框架与工具',
    examples: 'React/Vue · Next/Nuxt · Vite · ORM · 数据库',
    provides: '开发构件、构建工具、数据访问与部署适配。',
    money: '开源核心 + 托管、支持服务、培训与生态影响力。',
    relation: '被平台和交付团队组合使用；框架团队也可能向上做托管平台。',
    color: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30',
  },
  {
    id: 'platform',
    name: '平台与 SaaS',
    examples: 'Vercel · Cloudflare · Supabase · Stripe · Sentry',
    provides: '把部署、数据、支付、认证、观测等能力打包成可购买的服务。',
    money: '订阅、按量、交易抽成、企业合同。',
    relation: '整合上游能力，向下游提供 SLA 与运维抽象；锁定与退出成本是关键评估项。',
    color: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30',
  },
  {
    id: 'delivery',
    name: '交付与集成',
    examples: '企业研发 · 外包/代理 · SaaS 产品 · 独立开发者',
    provides: '把通用能力组合成具体产品、行业方案与运维服务。',
    money: '薪资、项目费、订阅收入、交易收入。',
    relation: '直接面向用户；需求与故障反馈沿链路上传，影响框架与平台优先级。',
    color: 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30',
  },
  {
    id: 'users',
    name: '最终用户',
    examples: '消费者 · 企业客户 · 开发者',
    provides: '需求、使用数据、反馈与付费。',
    money: '为产品、服务或平台付费。',
    relation: '价值链的终点，也是需求的起点；付费大体从下往上流动。',
    color: 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30',
  },
];

export default function IndustryChainMap() {
  const [activeId, setActiveId] = useState('framework');
  const layer = LAYERS.find((item) => item.id === activeId) ?? LAYERS[3];

  return (
    <section
      className="visual-breakout my-8 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7"
      aria-labelledby="industry-chain-title"
    >
      <div className="mb-4">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Value chain
        </p>
        <h3 id="industry-chain-title" className="text-lg font-bold tracking-tight">
          Web 产业上下游
        </h3>
        <p className="mt-1 text-base font-semibold leading-6 text-zinc-700 dark:text-zinc-300">
          依赖向下，付费向上；上游不是更高级。
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          越基础的层越靠上游，越接近最终交付的层越靠下游；点击任意层看它提供什么、怎么赚钱。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <ol className="space-y-1.5" style={{ listStyle: 'none', paddingLeft: 0 }} aria-label="产业结构">
          {LAYERS.map((item, index) => {
            const selected = item.id === activeId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveId(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                    selected
                      ? `${item.color} shadow-sm`
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="text-[10px] font-bold tabular-nums text-zinc-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                    <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">{item.examples}</span>
                  </span>
                  <span aria-hidden="true" className="ml-auto text-xs text-zinc-300 dark:text-zinc-600">
                    ↓
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className={`rounded-xl border p-4 ${layer.color}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-70">Selected layer</p>
          <h4 className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">{layer.name}</h4>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                提供什么
              </dt>
              <dd className="mt-1 leading-6 text-zinc-700 dark:text-zinc-300">{layer.provides}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                怎么赚钱
              </dt>
              <dd className="mt-1 leading-6 text-zinc-700 dark:text-zinc-300">{layer.money}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                与相邻层的关系
              </dt>
              <dd className="mt-1 leading-6 text-zinc-700 dark:text-zinc-300">{layer.relation}</dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-zinc-400">
        同一家公司可能横跨多层：云厂商也做运行时与框架，框架团队也做托管平台。上游/下游描述的是依赖方向，不是技术水平高低。
      </p>
    </section>
  );
}
