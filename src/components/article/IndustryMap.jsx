import { useState } from 'react';
import { renderShortNames } from './majorShortNames.jsx';

const maps = {
  cs: {
    label: 'CS/AI',
    subtitle: '从算力与基础软件，到大模型平台，再到行业应用',
    layers: [
      {
        title: '基础层',
        nodes: [
          {
            id: 'compute',
            name: '算力与 AI 芯片',
            tagline: 'GPU/NPU、智算中心、云算力',
            desc: '大模型训练与推理的底座，连接芯片、服务器、智算中心与云算力。',
            companies: '英伟达、华为昇腾、寒武纪、阿里云、腾讯云',
            majors: '计算机、智能、微电子/IC',
            roles: 'AI 芯片、系统、云平台',
          },
          {
            id: 'data',
            name: '数据与基础软件',
            tagline: '数据库、OS、编译器、数据平台',
            desc: '数据库、操作系统、编译器、数据平台与开发工具，决定上层应用的效率与可靠性。',
            companies: '阿里、腾讯、华为、字节、开源社区',
            majors: '计算机、软工',
            roles: '基础软件、数据库、编译器',
          },
        ],
      },
      {
        title: '模型/平台层',
        nodes: [
          {
            id: 'llm',
            name: '大模型与多模态',
            tagline: 'LLM、多模态、Agent、训练/推理',
            desc: 'LLM、视觉、语音、多模态与 Agent；覆盖模型训练、对齐、推理和评测。',
            companies: '字节、阿里、腾讯、百度、商汤、智谱',
            majors: '智能、计算机',
            roles: '算法、研究、训练/推理工程',
          },
          {
            id: 'cloud',
            name: '云与工具链',
            tagline: '云平台、MLOps、模型服务',
            desc: '云平台、MLOps、开发框架与模型服务，把模型变成可交付的产品。',
            companies: '阿里云、腾讯云、华为云、字节',
            majors: '计算机、软工',
            roles: '云原生、平台工程、MLOps',
          },
          {
            id: 'security',
            name: '安全与系统',
            tagline: '网络安全、系统软件、隐私计算',
            desc: '网络安全、系统软件、隐私计算与风控，保障 AI 系统的可靠性与合规。',
            companies: '奇安信、深信服、华为、阿里',
            majors: '计算机、软工',
            roles: '安全、系统、隐私计算',
          },
        ],
      },
      {
        title: '应用层',
        nodes: [
          {
            id: 'internet',
            name: '互联网/内容',
            tagline: '搜索、推荐、电商、内容生成',
            desc: '搜索、推荐、社交、电商、游戏与内容生成，是 AI 最大的商业化场景。',
            companies: '字节、腾讯、阿里、百度、美团、京东、快手',
            majors: '计算机、智能、软工',
            roles: '后端、推荐、算法、产品',
          },
          {
            id: 'fintech',
            name: '金融科技/量化',
            tagline: '银行科技、券商、公募、风控',
            desc: '银行科技、券商、公募、风控与量化交易，需要低延迟系统和数据建模。',
            companies: '头部券商、公募基金、银行科技部门',
            majors: '计算机、智能、信计',
            roles: '量化、风控、金融系统',
          },
          {
            id: 'robot',
            name: '机器人/自动驾驶',
            tagline: '具身智能、机器视觉、自动驾驶',
            desc: '具身智能、机器视觉、决策规划与车载系统，是 AI 与物理世界结合的方向。',
            companies: '大疆、比亚迪、蔚来、理想、华为车 BU',
            majors: '智能、计算机、电子',
            roles: '机器人算法、自动驾驶、嵌入式',
          },
          {
            id: 'health',
            name: '医疗/生物信息',
            tagline: '医学影像、生物信息、脑机接口',
            desc: '医学影像、生物信息、脑机接口与医疗电子，是 AI 与生命科学的交叉方向。',
            companies: '联影、迈瑞、脑机接口企业',
            majors: '智能、计算机、电子',
            roles: '医学影像、生物信息、脑机',
          },
        ],
      },
    ],
  },
  ee: {
    label: 'EE/MEE/IC/通信',
    subtitle: '从材料设备，到芯片设计/EDA、制造封测，再到模组终端与行业应用',
    layers: [
      {
        title: '材料/设备',
        nodes: [
          {
            id: 'material',
            name: '半导体材料',
            tagline: '硅片、光刻胶、电子特气、靶材',
            desc: '硅片、光刻胶、电子特气、靶材等上游材料，决定器件与制程的天花板。',
            companies: '沪硅产业、安集科技、南大光电',
            majors: '微电子/IC、应物',
            roles: '材料、工艺、器件',
          },
          {
            id: 'equipment',
            name: '半导体设备',
            tagline: '光刻、刻蚀、薄膜、量测',
            desc: '光刻、刻蚀、薄膜、量测等设备，是先进制程的瓶颈环节。',
            companies: '北方华创、中微公司、ASML、应用材料',
            majors: '微电子/IC、应物',
            roles: '设备、工艺、机械/光学',
          },
        ],
      },
      {
        title: '设计/EDA',
        nodes: [
          {
            id: 'design',
            name: '芯片设计',
            tagline: '数字/模拟、射频、AI 芯片、SoC',
            desc: '数字/模拟、射频、AI 芯片与 SoC，把系统需求变成可制造的硅片。',
            companies: '华为海思、韦尔股份、寒武纪、地平线',
            majors: '集成电路、微电子、电子',
            roles: '数字/模拟 IC、验证、架构',
          },
          {
            id: 'eda',
            name: 'EDA',
            tagline: '设计自动化、仿真、验证',
            desc: '设计自动化、仿真、验证与布局布线，是芯片设计的工具链。',
            companies: 'Cadence、Synopsys、西门子 EDA、华大九天、概伦电子',
            majors: '集成电路、计算机',
            roles: 'EDA 研发、算法、软件',
          },
        ],
      },
      {
        title: '制造/封测',
        nodes: [
          {
            id: 'foundry',
            name: '晶圆制造',
            tagline: '先进逻辑、存储、特色工艺',
            desc: '先进逻辑、存储与特色工艺，重资产、长周期、强工艺。',
            companies: '中芯国际、长江存储、长鑫存储、华虹',
            majors: '微电子、集成电路、应物',
            roles: '工艺、器件、良率、设备',
          },
          {
            id: 'packaging',
            name: '封装测试',
            tagline: '先进封装、Chiplet、测试',
            desc: '先进封装、Chiplet 与测试，是后摩尔时代提升系统性能的关键环节。',
            companies: '长电科技、通富微电、华天科技',
            majors: '微电子、集成电路',
            roles: '封装、测试、可靠性',
          },
        ],
      },
      {
        title: '模组/终端/应用',
        nodes: [
          {
            id: 'telecom',
            name: '通信/网络',
            tagline: '5G/6G、光通信、卫星、路由',
            desc: '5G/6G、光通信、卫星通信与路由交换，连接设备商与运营商。',
            companies: '华为、中兴、中国移动/电信/联通、中国电科',
            majors: '电子科学、电子工程、信班',
            roles: '射频、基带、光通信、网络',
          },
          {
            id: 'consumer',
            name: '消费电子/汽车电子',
            tagline: '手机、可穿戴、智能汽车、车载芯片',
            desc: '手机、可穿戴、智能汽车与车载芯片，是芯片到终端的最后一公里。',
            companies: '小米、OPPO/vivo、比亚迪、蔚来、理想',
            majors: '电子、微电子/IC',
            roles: '硬件、嵌入式、车载系统',
          },
          {
            id: 'photonics',
            name: '光电子/量子',
            tagline: '光通信、激光、量子技术',
            desc: '光通信、激光与量子技术，关注光子与量子信息的工程化。',
            companies: '光通信企业、量子科技企业、科研院所',
            majors: '应物、电子、信班',
            roles: '光电子、量子、器件',
          },
          {
            id: 'defense',
            name: '医疗/工业/航天',
            tagline: '医疗电子、工业控制、航天/军工',
            desc: '医疗电子、工业控制、航天与军工，强调高可靠与长周期。',
            companies: '联影、迈瑞、航天科技/科工、中国电科',
            majors: '电子、应物、信班',
            roles: '医疗电子、控制、航天',
          },
        ],
      },
    ],
  },
};

export default function IndustryMap() {
  const [tab, setTab] = useState('cs');
  const map = maps[tab];
  const [selectedId, setSelectedId] = useState(map.layers[0].nodes[0].id);
  const selected = map.layers.flatMap((layer) => layer.nodes).find((node) => node.id === selectedId) ?? map.layers[0].nodes[0];
  const selectedLayer = map.layers.find((layer) => layer.nodes.includes(selected))?.title ?? '';

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setSelectedId(maps[nextTab].layers[0].nodes[0].id);
  };

  return (
    <section className="my-8 rounded-2xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-bold">产业链分层</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{map.subtitle}</p>
        </div>
        <div className="flex gap-2">
          {Object.entries(maps).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => switchTab(key)}
              aria-pressed={tab === key}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                tab === key
                  ? key === 'cs'
                    ? 'border-red-700 bg-red-700 text-white'
                    : 'border-amber-600 bg-amber-500 text-white'
                  : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[11px] text-zinc-400">点击节点查看对应专业、代表单位与岗位。</p>

      <div className={`mt-3 grid gap-3 ${tab === 'cs' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
        {map.layers.map((layer, layerIndex) => (
          <div
            key={layer.title}
            className={`relative rounded-xl border p-3 ${
              tab === 'cs'
                ? 'border-red-100 bg-red-50/30 dark:border-red-900/40 dark:bg-red-950/10'
                : 'border-amber-100 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-950/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-semibold tracking-[0.14em] ${
                  tab === 'cs' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'
                }`}
              >
                {String(layerIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{layer.title}</span>
            </div>
            <div className="mt-2 space-y-2">
              {layer.nodes.map((node) => {
                const active = node.id === selected.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setSelectedId(node.id)}
                    onFocus={() => setSelectedId(node.id)}
                    onClick={() => setSelectedId(node.id)}
                    aria-pressed={active}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      active
                        ? tab === 'cs'
                          ? 'border-red-400 bg-white text-red-900 shadow-sm dark:border-red-700 dark:bg-zinc-900 dark:text-red-200'
                          : 'border-amber-400 bg-white text-amber-900 shadow-sm dark:border-amber-700 dark:bg-zinc-900 dark:text-amber-200'
                        : 'border-zinc-200 bg-white/70 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300'
                    }`}
                  >
                    <span className="font-medium">{node.name}</span>
                    <span className="mt-0.5 block text-[11px] leading-5 text-zinc-500">{node.tagline}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60" aria-live="polite">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{selected.name}</span>
          <span className="text-[11px] text-zinc-400">{selectedLayer}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{selected.desc}</p>
        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <div>
            <dt className="text-zinc-400">代表单位</dt>
            <dd className="mt-0.5 leading-5 text-zinc-600 dark:text-zinc-300">{selected.companies}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">对应专业</dt>
            <dd className="mt-0.5 leading-5 text-zinc-600 dark:text-zinc-300">{renderShortNames(selected.majors)}</dd>
          </div>
          <div>
            <dt className="text-zinc-400">典型岗位</dt>
            <dd className="mt-0.5 leading-5 text-zinc-600 dark:text-zinc-300">{selected.roles}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-zinc-400">按产业链环节整理；单位为例示，不是完整名单。</p>
    </section>
  );
}