import { useState } from 'react';

const STAGES = [
  {
    name: '提交',
    detail: 'PR/MR 触发流水线，分支保护要求评审与检查通过。',
    output: '可追溯的变更与评审记录',
    fail: '冲突、缺少评审、提交信息与变更范围不符',
  },
  {
    name: '安装',
    detail: '按锁文件安装依赖，复用缓存；限制安装脚本与依赖来源。',
    output: '可复现的依赖树',
    fail: '锁文件不一致、Registry 不可用、恶意 postinstall',
  },
  {
    name: '静态检查',
    detail: 'lint、格式检查、TypeScript 类型检查；快速失败，节省后续资源。',
    output: '代码规范与类型报告',
    fail: '类型错误、未使用变量、格式漂移',
  },
  {
    name: '测试',
    detail: '单元、集成、契约与关键 E2E；按风险分配，不追求全量组合。',
    output: '测试报告与覆盖率趋势',
    fail: '不稳定测试、测试数据污染、契约漂移',
  },
  {
    name: '构建',
    detail: '生成静态产物、容器镜像或函数包；产物应不可变并可追溯来源。',
    output: '带版本/摘要的构建产物',
    fail: '环境变量缺失、构建不可复现、产物体积超标',
  },
  {
    name: '安全扫描',
    detail: 'SAST、依赖成分分析、镜像扫描、密钥扫描；生成 SBOM。',
    output: '漏洞与许可证报告',
    fail: '高危依赖、镜像基础层漏洞、泄露的密钥',
  },
  {
    name: '预发',
    detail: '部署到接近生产的预发环境，执行迁移、冒烟测试与配置校验。',
    output: '可发布的候选版本',
    fail: '配置不一致、迁移失败、测试数据差异',
  },
  {
    name: '发布',
    detail: '按滚动、蓝绿、金丝雀或特性开关放量；保留回滚路径。',
    output: '新版本进入生产',
    fail: '灰度指标异常、回滚不兼容、容量不足',
  },
  {
    name: '观测',
    detail: '看错误率、延迟、SLO 与业务指标；异常时回滚或关闭开关。',
    output: '发布结果与事故记录',
    fail: '告警噪音、缺少业务指标、回滚演练不足',
  },
];

const STRATEGIES = [
  {
    name: '滚动发布',
    flow: '旧实例 → 逐批替换 → 全部新实例',
    good: '实现简单，资源占用平稳',
    watch: '发布期间新旧版本并存，接口与数据库要兼容',
  },
  {
    name: '蓝绿部署',
    flow: '绿环境待命 → 切流量 → 蓝环境保留',
    good: '切换与回滚快，验证完整环境',
    watch: '需要双倍资源，数据库迁移仍需兼容',
  },
  {
    name: '金丝雀',
    flow: '小流量新版本 → 看指标 → 逐步放量',
    good: '把故障影响限制在少量用户',
    watch: '需要可靠指标与流量切分，样本量要足够',
  },
  {
    name: '特性开关',
    flow: '代码先上线 → 开关关闭 → 按用户/租户开启',
    good: '部署与发布解耦，可快速关闭',
    watch: '开关会积累技术债，必须清理与审计',
  },
];

export default function DeployPipeline() {
  const [activeStage, setActiveStage] = useState(4);
  const [activeStrategy, setActiveStrategy] = useState(0);
  const stage = STAGES[activeStage] ?? STAGES[0];
  const strategy = STRATEGIES[activeStrategy] ?? STRATEGIES[0];

  return (
    <section
      className="visual-breakout my-8 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-7"
      aria-labelledby="deploy-pipeline-title"
    >
      <div className="mb-4">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Delivery pipeline
        </p>
        <h3 id="deploy-pipeline-title" className="text-lg font-bold tracking-tight">
          CI/CD 流水线与发布策略
        </h3>
        <p className="mt-1 text-base font-semibold leading-6 text-zinc-700 dark:text-zinc-300">
          部署不等于发布，发布不等于用户已经用上。
        </p>
        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          点击阶段查看它产出什么、常在哪里失败；部署是把版本放到环境，发布是让用户真正用上。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5" role="group" aria-label="CI/CD 阶段">
        {STAGES.map((item, index) => {
          const selected = index === activeStage;
          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveStage(index)}
              className={`rounded-xl border px-2 py-2 text-center text-xs font-semibold transition ${
                selected
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
              }`}
            >
              <span className="block text-[9px] font-bold opacity-60">{String(index + 1).padStart(2, '0')}</span>
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">做什么</p>
          <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{stage.detail}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">产出</p>
          <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-200">{stage.output}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-900 dark:bg-rose-950/30">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-rose-600 dark:text-rose-400">常见失败</p>
          <p className="mt-1 text-sm leading-6 text-rose-800 dark:text-rose-200">{stage.fail}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="发布策略">
          {STRATEGIES.map((item, index) => {
            const selected = index === activeStrategy;
            return (
              <button
                key={item.name}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveStrategy(index)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  selected
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{strategy.flow}</p>
          <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
            <p className="leading-6 text-emerald-700 dark:text-emerald-300">
              <span className="font-semibold">适合：</span>{strategy.good}
            </p>
            <p className="leading-6 text-amber-700 dark:text-amber-300">
              <span className="font-semibold">要小心：</span>{strategy.watch}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
