import { useState } from 'react';

const STAGES = [
  {
    step: '01',
    short: '静态页面',
    quote: '我想让朋友看到我拍的照片。',
    caption: '你先做了一个小网站。',
    problem: '还没有人访问，也还没有数据要保存。',
    solution: '写页面，买域名，传到静态托管。',
    engineer: 'HTML/CSS/JS 写出页面，DNS 把域名指向静态托管；朋友打开链接就能看。',
    jargon: ['HTML/CSS/JS', 'DNS', '静态托管'],
    notYet: ['数据库', '后端框架', 'React'],
    chapter: '第 2 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS'],
    added: ['浏览器', 'DNS', '静态托管', 'HTML/CSS'],
  },
  {
    step: '02',
    short: '图片加速',
    quote: '照片越来越多，外地朋友说打开很慢。',
    caption: '图片成了第一个真正的瓶颈。',
    problem: '图片太大，而且离用户太远。',
    solution: '压缩图片，放对象存储，前面加 CDN。',
    engineer: '图片压缩后放进对象存储，由 CDN 在离用户更近的节点缓存；缓存没命中时再回源。',
    jargon: ['对象存储', 'CDN', '缓存命中', '回源'],
    notYet: ['应用服务器'],
    chapter: '第 2、7 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS', '对象存储', 'CDN'],
    added: ['对象存储', 'CDN'],
  },
  {
    step: '03',
    short: '后端与数据库',
    quote: '我想自己发文章，让朋友在下面评论。',
    caption: '第一次需要后台。',
    problem: '内容要保存下来，还要能被多人读写。',
    solution: '加应用服务、API 和数据库。',
    engineer: '浏览器调 API，应用服务校验后把文章和评论写进数据库；页面可以在服务端生成。',
    jargon: ['API', 'REST', '数据库', 'ORM', 'SSR/SSG'],
    notYet: ['缓存'],
    chapter: '第 3、5、6 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS', '对象存储', 'CDN', '应用服务', 'API', '数据库', 'SSR/SSG'],
    added: ['应用服务', 'API', '数据库', 'SSR/SSG'],
  },
  {
    step: '04',
    short: '登录与权限',
    quote: '朋友想注册、收藏，我也要决定谁能看什么。',
    caption: '登录和权限进入主线。',
    problem: '不知道请求是谁发的，也不知道他能做什么。',
    solution: '会话或令牌记住身份，再加上权限检查。',
    engineer: '登录后发 Cookie/Session 或 JWT；每个请求都检查身份，并按资源归属和角色判断权限。',
    jargon: ['Cookie', 'Session', 'JWT', 'CORS', 'RBAC'],
    notYet: ['OAuth/SSO（除非第三方登录）'],
    chapter: '第 5.6、8 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS', '对象存储', 'CDN', '应用服务', 'API', '数据库', 'SSR/SSG', '认证/权限'],
    added: ['认证/权限'],
  },
  {
    step: '05',
    short: '前端工程',
    quote: '团队加入了，页面和交互越来越复杂。',
    caption: '前端开始工程化。',
    problem: '多人协作、重复 UI、构建和状态越来越乱。',
    solution: '组件框架、构建工具、包管理和状态管理。',
    engineer: '用 React/Vue 组织组件，用构建工具和包管理保证可交付；多端数据开始考虑 BFF 聚合。',
    jargon: ['组件', '构建工具', '包管理', '状态管理', 'BFF'],
    notYet: ['更复杂的跨端方案'],
    chapter: '第 4 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS', '对象存储', 'CDN', '应用服务', 'API', '数据库', 'SSR/SSG', '认证/权限', '组件/构建', 'BFF'],
    added: ['组件/构建', 'BFF'],
  },
  {
    step: '06',
    short: '缓存与队列',
    quote: '访问量上来了，评论、邮件和图片处理都变慢。',
    caption: '性能和稳定性成为主线。',
    problem: '热点数据、慢查询和同步任务互相拖累。',
    solution: '缓存、读写分离、队列，加上可观测性。',
    engineer: '热点数据进缓存，读请求走副本，慢任务丢进队列；先用指标、日志和追踪找到真正的瓶颈。',
    jargon: ['缓存', '负载均衡', '读写分离', '消息队列', 'SLO', 'RUM'],
    notYet: ['平台团队才需要的部署方式'],
    chapter: '第 4.10、6、7 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS', '对象存储', 'CDN', '应用服务', 'API', '数据库', 'SSR/SSG', '认证/权限', '组件/构建', 'BFF', '缓存', '队列', '可观测性'],
    added: ['缓存', '队列', '可观测性'],
  },
  {
    step: '07',
    short: '多租户与实时',
    quote: '我想收费，给不同客户独立空间，还要实时通知。',
    caption: '网站变成了 SaaS。',
    problem: '要隔离租户、处理订阅账单，还要实时同步状态。',
    solution: '多租户模型、支付订阅和实时连接。',
    engineer: '用 tenant_id 或独立 schema 隔离数据，接支付订阅，用 WebSocket/SSE 推送通知，开始处理合规。',
    jargon: ['多租户', '订阅支付', 'WebSocket', 'SSE', 'GDPR', 'SOC 2'],
    notYet: ['平台团队才需要的部署方式'],
    chapter: '第 5.10、6.6、9.5 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS', '对象存储', 'CDN', '应用服务', 'API', '数据库', 'SSR/SSG', '认证/权限', '组件/构建', 'BFF', '缓存', '队列', '可观测性', '多租户/支付', '实时'],
    added: ['多租户/支付', '实时'],
  },
  {
    step: '08',
    short: 'AI 应用',
    quote: '我想让 AI 自动总结照片故事，回答朋友的问题。',
    caption: 'AI 进入产品。',
    problem: '模型不知道你的内容，也管不住成本、延迟和错误。',
    solution: '检索、模型、工具和评估一起上。',
    engineer: '把内容做 embedding/检索，通过 AI Gateway 调模型，按需调用工具；用 eval 和配额控制质量与成本。',
    jargon: ['Embedding', 'RAG', '向量库', 'AI Gateway', 'MCP', 'Eval'],
    notYet: ['自训练模型'],
    chapter: '第 5.11、6.5 章',
    active: ['浏览器', 'DNS', '静态托管', 'HTML/CSS', '对象存储', 'CDN', '应用服务', 'API', '数据库', 'SSR/SSG', '认证/权限', '组件/构建', 'BFF', '缓存', '队列', '可观测性', '多租户/支付', '实时', '向量库', 'AI Gateway'],
    added: ['向量库', 'AI Gateway'],
  },
];

const ARCHITECTURE = [
  { label: '入口', nodes: ['浏览器', 'DNS', '静态托管', 'CDN'] },
  { label: '内容', nodes: ['HTML/CSS', '对象存储'] },
  { label: '应用', nodes: ['应用服务', 'API', 'SSR/SSG', '认证/权限', '组件/构建', 'BFF', '实时'] },
  { label: '数据', nodes: ['数据库', '缓存', '队列', '多租户/支付', '向量库'] },
  { label: '运维与智能', nodes: ['可观测性', 'AI Gateway'] },
];

export default function GrowthStory() {
  const [index, setIndex] = useState(0);
  const stage = STAGES[index];
  const isFirst = index === 0;
  const isLast = index === STAGES.length - 1;

  return (
    <section
      className="visual-breakout my-8 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7"
      aria-labelledby="growth-story-title"
    >
      <div className="mb-4">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Story-driven map
        </p>
        <h3 id="growth-story-title" className="text-lg font-bold tracking-tight">
          一个摄影网站的长大过程
        </h3>
        <p className="mt-1 text-base font-semibold leading-6 text-zinc-700 dark:text-zinc-300">
          同一个网站，需求每加一次，只多一个技术名词。
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          点一步，看架构长出来；绿色 NEW 是这一步刚引入的东西。
        </p>
      </div>

      <div className="grid items-start gap-3 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="group" aria-label="需求阶段">
            {STAGES.map((item, itemIndex) => {
              const selected = itemIndex === index;
              return (
                <button
                  key={item.step}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setIndex(itemIndex)}
                  className={`rounded-xl border px-2 py-2 text-left transition ${
                    selected
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                      : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
                  }`}
                >
                  <span className={`block text-[9px] font-bold tabular-nums ${selected ? 'opacity-60' : 'text-zinc-400'}`}>
                    STEP {item.step}
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold leading-4">{item.short}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950/60" aria-live="polite">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">用户说</p>
            <p className="mt-1 rounded-xl rounded-bl-sm bg-zinc-100 px-3 py-2 text-base font-semibold leading-7 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 sm:text-lg">
              “{stage.quote}”
            </p>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">工程师翻译</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-[15px] sm:leading-7">{stage.engineer}</p>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400">这一步新增的黑话</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {stage.jargon.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300"
                >
                  {term}
                </span>
              ))}
            </div>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">这一步还不需要</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {stage.notYet.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-dashed border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-400 dark:border-zinc-700 dark:text-zinc-500"
                >
                  {term}
                </span>
              ))}
            </div>

            <p className="mt-3 border-t border-zinc-100 pt-2 text-xs text-zinc-400 dark:border-zinc-800">
              对应章节：{stage.chapter}
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-white/70 p-3 [background-image:radial-gradient(circle,rgba(113,113,122,0.18)_1px,transparent_1px)] [background-size:18px_18px] dark:border-zinc-700 dark:bg-zinc-950/40 dark:[background-image:radial-gradient(circle,rgba(161,161,170,0.16)_1px,transparent_1px)]">
          <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400">
            <span>同一张架构图</span>
            <span className="tabular-nums">{index + 1} / {STAGES.length}</span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${((index + 1) / STAGES.length) * 100}%` }}
            />
          </div>

          <div className="mt-3 space-y-2" aria-label={`第 ${index + 1} 步当前架构`}>
            {ARCHITECTURE.map((group) => {
              const nodes = group.nodes.filter((node) => stage.active.includes(node));
              if (nodes.length === 0) return null;
              return (
                <div key={group.label} className="rounded-lg border border-dashed border-zinc-200 bg-white/60 p-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-400">{group.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {nodes.map((node) => {
                      const isNew = stage.added.includes(node);
                      return (
                        <span
                          key={node}
                          className={`relative rounded-md border px-2 py-1 text-xs leading-4 transition ${
                            isNew
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300 ring-offset-1 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200 dark:ring-emerald-900 dark:ring-offset-zinc-950'
                              : 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300'
                          }`}
                        >
                          {node}
                          {isNew && (
                            <span className="ml-1 rounded bg-emerald-500 px-1 py-0.5 text-[8px] font-bold leading-none text-white">
                              NEW
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIndex(0)}
              className="text-xs text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              回到起点
            </button>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setIndex((value) => Math.max(0, value - 1))}
                disabled={isFirst}
                className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={() => setIndex((value) => Math.min(STAGES.length - 1, value + 1))}
                disabled={isLast}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:border-indigo-800"
              >
                {isLast ? '已经到 AI 这一步' : '再加一个需求 →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border-l-4 border-indigo-400 bg-white/60 px-3 py-2 dark:border-indigo-700 dark:bg-zinc-950/40">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 sm:text-base">“{stage.caption}”</p>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400 sm:text-sm sm:leading-6">
          <span className="font-semibold text-rose-600 dark:text-rose-400">问题：</span>{stage.problem}
          <span className="mx-1 text-zinc-300 dark:text-zinc-600">→</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">解法：</span>{stage.solution}
        </p>
      </div>

      <p className="mt-2 text-[11px] leading-5 text-zinc-400">
        真实项目可能跳步、回退或并行；这个演示只表达“需求 → 新黑话”的因果关系，不表示每个产品都必须走完。
      </p>
    </section>
  );
}
