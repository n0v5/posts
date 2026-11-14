import { useMemo, useState } from 'react';

const familyOrder = [
  '计算机族',
  '智能族',
  '软件工程族',
  '电子信息族',
  '微电子与集成电路族',
  '应用物理族',
  '信班专项',
];

const programs = [
  { id: '08', family: '计算机族', track: 'CS/AI', name: '计算机科学与技术', degree: '理学学士（计算机科学与技术）', total: 138, required: 54, elective: 35, badges: [] },
  { id: '09', family: '计算机族', track: 'CS/AI', name: '计算机科学与技术（图灵班）', degree: '理学学士（计算机科学与技术）', total: 141, required: 61, elective: 31, badges: ['图灵班'] },
  { id: '11', family: '计算机族', track: 'CS/AI', name: '信息与计算科学（计算机方向）', degree: '理学学士（信息与计算科学）', total: 138, required: 54, elective: 35, badges: ['强基'] },
  { id: '12', family: '计算机族', track: 'CS/AI', name: '信息与计算科学（图灵班）', degree: '理学学士（信息与计算科学）', total: 141, required: 61, elective: 31, badges: ['强基', '图灵班'] },
  { id: '13', family: '智能族', track: 'CS/AI', name: '信息与计算科学（智能方向）', degree: '理学学士（信息与计算科学）', total: 138, required: 54, elective: 35, badges: ['强基'] },
  { id: '14', family: '智能族', track: 'CS/AI', name: '信息与计算科学（智班）', degree: '理学学士（信息与计算科学）', total: 141, required: 65, elective: 27, badges: ['强基', '智班'] },
  { id: '15', family: '智能族', track: 'CS/AI', name: '智能科学与技术', degree: '理学学士（智能科学与技术）', total: 138, required: 55, elective: 34, badges: [] },
  { id: '16', family: '智能族', track: 'CS/AI', name: '智能科学与技术（智班）', degree: '理学学士（智能科学与技术）', total: 141, required: 63, elective: 29, badges: ['智班'] },
  { id: '10', family: '软件工程族', track: 'CS/AI', name: '软件工程', degree: '工学学士（软件工程）', total: 138, required: 51, elective: 38, badges: [] },
  { id: '01', family: '电子信息族', track: 'EE/MEE/IC', name: '电子信息科学与技术', degree: '理学学士（电子信息科学与技术）', total: 138, required: 55, elective: 34, badges: [] },
  { id: '02', family: '电子信息族', track: 'EE/MEE/IC', name: '电子信息工程', degree: '理学学士（电子信息工程）', total: 138, required: 55, elective: 34, badges: [] },
  { id: '03', family: '微电子与集成电路族', track: 'EE/MEE/IC', name: '微电子科学与工程', degree: '理学学士（微电子科学与工程）', total: 138, required: 56, elective: 33, badges: [] },
  { id: '04', family: '微电子与集成电路族', track: 'EE/MEE/IC', name: '集成电路设计与集成系统', degree: '理学学士（集成电路设计与集成系统）', total: 138, required: 56, elective: 33, badges: [] },
  { id: '06', family: '应用物理族', track: 'EE/MEE/IC', name: '应用物理学', degree: '理学学士（应用物理学）', total: 138, required: 69, elective: 20, badges: ['强基'] },
  { id: '07', family: '应用物理族', track: 'EE/MEE/IC', name: '应用物理学（信班）', degree: '理学学士（应用物理学）', total: 141, required: 53, elective: 39, badges: ['强基', '信班'] },
  { id: '05', family: '信班专项', track: 'EE/MEE/IC', name: '电子信息科学类实验班（信班）', degree: '理学/工学（按毕业专业）', total: 141, required: 45, elective: 47, badges: ['信班'] },
];

const trackOptions = ['全部', 'CS/AI', 'EE/MEE/IC'];
const badgeOptions = ['全部', '强基', '图灵班', '智班', '信班'];
const sortOptions = [
  { label: '按族', value: 'family' },
  { label: '总学分 ↑', value: 'total' },
  { label: '必修 ↑', value: 'required' },
  { label: '选修 ↓', value: 'elective' },
];

const badgeTone = {
  强基: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300',
  图灵班: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/70 dark:bg-indigo-950/30 dark:text-indigo-300',
  智班: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300',
  信班: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-300',
};

export default function MajorOverview() {
  const [track, setTrack] = useState('全部');
  const [badge, setBadge] = useState('全部');
  const [sort, setSort] = useState('family');

  const rows = useMemo(() => {
    const filtered = programs.filter(
      (program) =>
        (track === '全部' || program.track === track) &&
        (badge === '全部' || program.badges.includes(badge)),
    );
    return [...filtered].sort((a, b) => {
      if (sort === 'total') return a.total - b.total || a.id.localeCompare(b.id);
      if (sort === 'required') return a.required - b.required || a.id.localeCompare(b.id);
      if (sort === 'elective') return b.elective - a.elective || a.id.localeCompare(b.id);
      return familyOrder.indexOf(a.family) - familyOrder.indexOf(b.family) || a.id.localeCompare(b.id);
    });
  }, [track, badge, sort]);

  return (
    <section className="my-8 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-bold">16 个方案总览</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            按培养方案重合度合并为 6 个专业族；强基/精英班是族内变量。
          </p>
        </div>
        <span className="text-xs tabular-nums text-zinc-400" aria-live="polite">
          显示 {rows.length} / {programs.length}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <FilterRow label="主线" options={trackOptions} value={track} onChange={setTrack} />
        <FilterRow label="标签" options={badgeOptions} value={badge} onChange={setBadge} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">排序</span>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSort(option.value)}
              aria-pressed={sort === option.value}
              className={`rounded-full border px-2.5 py-1 text-xs transition ${
                sort === option.value
                  ? 'border-red-700 bg-red-700 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-zinc-400 sm:hidden">左右滑动查看完整表格</p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-800">
              <th className="py-2 pr-3 font-semibold">专业（含学位）</th>
              <th className="py-2 pr-3 font-semibold">族</th>
              <th className="py-2 pr-3 text-right font-semibold">总学分</th>
              <th className="py-2 pr-3 text-right font-semibold">必修</th>
              <th className="py-2 pr-3 text-right font-semibold">选修</th>
              <th className="py-2 font-semibold">标签</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((program) => (
              <tr key={program.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                <td className="py-2.5 pr-3">
                  <div>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{program.name}</span>
                    <span className="ml-1.5 text-[11px] text-zinc-400">{program.id}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] leading-5 text-zinc-400">{program.degree}</div>
                </td>
                <td className="py-2.5 pr-3 text-xs text-zinc-500">{program.family}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{program.total}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{program.required}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{program.elective}</td>
                <td className="py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {program.badges.map((item) => (
                      <span
                        key={item}
                        className={`rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${
                          badgeTone[item]
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-zinc-400">
        必修 = 专业基础 + 专业核心 + 论文；选修 = 专业选修 + 自主选修。总学分按公共基础 49 学分计；方案允许 43-49。07 应用物理学（信班）按母专业标注强基。05 信班按毕业专业选择：集成电路设计与集成系统（信班）为工学学士，其余三个信班出口为理学学士。
      </p>
    </section>
  );
}

function FilterRow({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">{label}</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`rounded-full border px-2.5 py-1 text-xs transition ${
            value === option
              ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
              : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
