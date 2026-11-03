import { useState } from 'react';

const STEPS = [
  {
    name: '请求进入业务后端',
    detail: '用户请求先经过业务后端的鉴权、租户隔离、配额、输入校验与 PII 处理。不要从浏览器直接携带模型密钥。',
  },
  {
    name: '编排与路由',
    detail: 'AI 编排层选择模型、prompt 版本、上下文与工具；AI Gateway 可以统一处理供应商密钥、缓存、重试、降级与用量。',
  },
  {
    name: '检索资料（可选）',
    detail: '需要外部知识时，把问题向量化，在向量库或搜索引擎中检索片段，经过过滤与重排后放进上下文。',
  },
  {
    name: '调用模型',
    detail: '向模型供应商或自托管模型发送请求；流式返回时逐段展示，注意超时、限流、成本与内容安全。',
  },
  {
    name: '工具调用（可选）',
    detail: '模型请求调用内部 API 或函数，应用以最小权限执行并把结果回传给模型。MCP 是一种工具/数据接入协议。',
  },
  {
    name: '输出与防护',
    detail: '对输出做结构化校验、敏感信息过滤、引用检查与人工兜底；把检索内容视为不可信，防范提示注入。',
  },
  {
    name: '评估与观测',
    detail: '记录 prompt/模型版本、延迟、token、成本、工具调用与质量指标；离线 eval 与线上反馈共同判断是否回归。',
  },
];

function Actor({ title, sub, tone = 'zinc' }) {
  const tones = {
    zinc: 'border-zinc-200 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200',
    amber: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200',
  };
  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${tones[tone]}`}>
      <p className="text-xs font-bold">{title}</p>
      <p className="mt-0.5 text-[10px] opacity-70">{sub}</p>
    </div>
  );
}

export default function AIPipeline() {
  const [active, setActive] = useState(1);
  const step = STEPS[active] ?? STEPS[0];

  return (
    <section
      className="visual-breakout my-8 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7"
      aria-labelledby="ai-pipeline-title"
    >
      <div className="mb-4">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          AI application stack
        </p>
        <h3 id="ai-pipeline-title" className="text-lg font-bold tracking-tight">
          AI 应用链路：模型只是其中一环
        </h3>
        <p className="mt-1 text-base font-semibold leading-6 text-zinc-700 dark:text-zinc-300">
          模型只是链路中的一环，评估和降级才是产品。
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          小项目可以没有网关、检索或工具；面向生产时，鉴权、配额、评估与观测不应缺席。
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-zinc-400">
          <Actor title="用户" sub="浏览器 / App" />
          <span aria-hidden="true">→</span>
          <Actor title="业务后端" sub="鉴权 · 配额 · PII" tone="indigo" />
          <span aria-hidden="true">→</span>
          <Actor title="编排 / 网关" sub="路由 · 缓存 · 降级" tone="emerald" />
          <span aria-hidden="true">→</span>
          <Actor title="模型" sub="供应商 / 自托管" tone="amber" />
        </div>
        <div className="mt-2 grid gap-2 text-center sm:grid-cols-3">
          <Actor title="检索 / 向量库" sub="RAG · 重排 · 过滤" />
          <Actor title="工具 / 内部 API" sub="MCP · function calling" />
          <Actor title="评估 / 观测" sub="eval · trace · 成本" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <ol className="space-y-1.5" style={{ listStyle: 'none', paddingLeft: 0 }} aria-label="AI 应用步骤">
          {STEPS.map((item, index) => {
            const selected = index === active;
            return (
              <li key={item.name}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(index)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    selected
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-100'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    selected ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
            Step {String(active + 1).padStart(2, '0')}
          </p>
          <h4 className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">{step.name}</h4>
          <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{step.detail}</p>
          <p className="mt-4 border-t border-zinc-200 pt-3 text-xs leading-6 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            模型是外部依赖：要设计超时、重试、降级、供应商切换与成本上限。对检索内容和工具结果保持不信任。
          </p>
        </div>
      </div>
    </section>
  );
}
