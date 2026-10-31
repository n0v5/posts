# 《从 Flutter 出发：UI/UX 与前端界面通用入门》规格说明

- 状态：Implemented（v1.0，2026-10-31）
- 日期：2026-10-31
- 目标产物：`src/pages/uiux/index.html`
- 对外地址：`https://n0v5.github.io/posts/uiux/`
- 版本基线：Flutter 3.47.7 stable / Dart 3.13.5 / Material 3
- 关联文档：`CONTEXT.md`、`docs/adr/0007-uiux-guide-single-file.md`、`docs/adr/0008-uiux-no-flutter-runtime.md`

## 1. 问题陈述

博客已有 HTML5、Dart、Rust 三个单文件专题页，但缺少一篇面向工程师的 UI/UX 与前端界面通用入门。

目标读者会 C++/Python，也可能写 Flutter，但真正需要的是：

- 一套不依赖具体框架的界面模型：用户任务、结构布局、视觉语言、组件状态、交互反馈、无障碍、设计系统、需求表达；
- 在 AI 时代，能把“做一个好看的面板”翻译成结构、token、状态、验收标准，让人或 AI 可执行；
- 读完后再上手任何 UI 框架（包括 Qt/QML、SwiftUI、Compose、React），能靠同一套问题清单快速迁移。

用户明确要求：**先通用模型（Act I），再 Flutter 实战（Act II）**；正文不写 Qt 代码或 Qt 专属章节；用 Flutter 作为参考实现，而不是课程主体或页面运行时。

## 2. 方案概述

在 `src/pages/uiux/index.html` 交付一个单文件自包含专题页：

- 内联全部 CSS/JS，零外部资源请求，可下载离线；
- **Part 0 导言 + Act I（6 个主题）+ Act II（3 个主题）+ 附录**，共 60 个章节（54 个内容章节 + 6 个附录章节）；
- 一条 **Running Example（设备任务面板）** 贯穿全页；
- 每章用 **四契约** 检查：Structure / Style / State / Semantics；
- 12 个本地实验室，全部 HTML/CSS/JS 模拟，不执行真实 Flutter、不调用模型；
- 16 个 Flutter 参考代码块，在 Flutter 3.47.7 下通过 `flutter analyze` / `flutter test` / `dart format`；
- 迁移工作表只给通用问题与 Flutter 示例，目标框架列留空，**正文无 Qt/QML 代码**；
- 顶栏新增 UI/UX；首页专题区改为 2×2 网格；`.llms.txt` 增加条目；不进入 feed/source。

## 3. 用户故事

### US-01 打开与阅读
- 构建后存在 `dist/uiux/index.html`，`/posts/uiux/` 返回 200。
- title/description/canonical/OG/JSON-LD 正确；中英文混排、代码块、表格可读。
- 关闭 JS 后正文、标题、目录锚点仍可阅读和跳转。
- 首屏无外部资源请求。

### US-02 目录与进度
- 桌面左侧吸顶目录；移动端可折叠。
- 当前章节高亮；顶部阅读进度更新；提供回到顶部。
- 目录链接全部是真实锚点，无 JS 可用。

### US-03 全文搜索
- Ctrl/Cmd+K、`/` 或按钮打开原生 dialog。
- 索引首次打开时构建；标题/部分/正文可搜；支持上下选择、Enter、Esc；无结果有提示；关闭后焦点回到触发元素。
- 结果用 `<mark>` 高亮，不注入未转义 HTML。

### US-04 章节结构
每章至少包含：一句话结论（`.lead`）、概念讲解、至少一个视觉/代码/表格、四契约检查（`.contract-strip`/`.contract-grid`）、需求描述或验收示例（`.spec-card`）、1–3 条常见坑。Running Example 在相关章节复用。

### US-05 12 个本地实验室
- D01 需求简报生成器；D02 形容词→token；D03 组件树与约束；D04 间距/对齐/层级；D05 字号/色彩角色；D06 对比度；D07 状态矩阵；D08 异步状态机；D09 响应式断点；D10 导航与过渡；D11 无障碍；D12 设计评审/迁移工作表。
- 全部懒初始化；确定性；输出可复制；`aria-live`；减少动效；无网络；无真实 Flutter/模型调用。

### US-06 Flutter 参考代码
- 16 个 Flutter 代码块带 `data-code-id`，覆盖三棵树、约束、Flex/Stack/滚动、响应式、项目/DevTools、M3 主题、token、setState、共享状态、FutureBuilder、表单/导航/动效、Semantics、动态字体、测试、性能、capstone。
- 在 Flutter 3.47.7 下 `flutter analyze --fatal-infos` 无问题；测试示例通过；`dart format` 无差异。
- 页面不内嵌 Flutter Web、不运行 Flutter。

### US-07 下载与离线
- 页头/页脚下载 `uiux-guide.html`；`file://` 打开后正文、目录、搜索、12 个演示、代码高亮可用。
- 外部文档链接可选，不阻塞离线阅读。

### US-08 视觉与主题
- Flutter 蓝 + 青绿/珊瑚辅色 + zinc 灰阶；同一套学术排版；亮暗跟随系统；无手动切换。
- 页面自身示范 UI/UX：网格/标尺/色板/状态矩阵；对比度 AA；尊重减少动效；打印样式可用。

### US-09 可访问性
- skip link；单 H1；标题层级连续；landmark 清晰；原理侧栏 `role="note"`；表格 `th scope="col"`。
- 控件有可访问名称；动态输出 `aria-live`；搜索焦点恢复；键盘可操作。
- 12 个演示的视觉信息有文本等价物。

### US-10 移动端
- UI/UX 页在 320/375/390 无页面级横向溢出；代码块内部滚动；演示控件自适应。
- 首页 2×2 专题网格在 390 单列、640/768 两列、1440 两列；总高差一致。
- BaseLayout 顶栏在 `<640px` 为两行：品牌行 + 横向可滚动导航；6 个链接、44px 触控目标；桌面保持一行。

### US-11 博客入口
- 顶栏新增 UI/UX；首页第四张专题卡（Flutter/cyan）；llms.txt 增加条目；不进入 feed/source。
- HTML5、Dart、Rust、文章页、首页回归正常。

### US-12 Agent 可读性
- JSON-LD `TechArticle`；语义结构；`llms.txt` 条目；core content 文本化。
- 页面提供 feed.json、llms.txt、返回博客入口。

### US-13 内容准确性与边界
- Flutter 代码在 3.47.7 下验证；Material 3；正文不写 Qt/QML 代码；迁移工作表目标列留空。
- AI 生成器标注“本地模板，未调用模型”；实时演示标注“本地模拟，不运行 Flutter”。
- 设计参考包括 NN/g、WCAG 2.2、Material 3、Flutter 官方文档、Thinking in React、Elm Architecture、Specification by Example 等；正文只引用可在线核对的一手文档。

### US-14 构建与回归
- `pnpm build` 成功，共 8 个页面；UI/UX 路由与现有路由 200。
- 不新增 npm 依赖；不改 Astro 配置；页面 247.5 KB（预算 650 KB）。
- 静态审计：无重复 ID、73 个锚点可解析、60 章节、12 演示、16 个 Flutter 代码块、无外部资源请求。

## 4. 已定决策

| 决策 | 选择 |
| --- | --- |
| 交付形态 | 单文件 Standalone 页 `src/pages/uiux/index.html` |
| 标题/路径 | 《从 Flutter 出发：UI/UX 与前端界面通用入门》 / `/posts/uiux/` |
| 教学主线 | 先通用模型（Act I），再 Flutter 实战（Act II） |
| 组织框架 | Running Example + 四契约 + 三层抽象 + 两幕结构 |
| Flutter 定位 | 参考实现，不在页面运行；不内嵌 Flutter Web |
| Qt/QML | 正文不写代码或专属章节；迁移工作表通用、目标列留空 |
| 实验室 | 12 个本地 HTML/CSS/JS 实验室，输出可复制产物 |
| 视觉 | Flutter 蓝 + M3 青绿/珊瑚 + zinc；学术排版 |
| 入口 | 顶栏 + 首页 2×2 专题网格 + llms.txt |
| 内容集合 | 不进入 feed/source |
| 依赖 | 零新增 npm 依赖、零外部资源 |
| 体积 | ≤ 650 KB 软预算 |
| 版本 | Flutter 3.47.7 / Dart 3.13.5 / Material 3 |

## 5. 信息架构

- Part 0：`why-uiux`、`from-flutter`、`ui-mental-model`
- Act I：
  - Part 1 用户/任务/需求：`users-goals`、`jobs-tasks`、`information-architecture`、`flows-edge-cases`
  - Part 2 结构与布局：`component-tree`、`constraints-layout`、`grid-spacing`、`alignment-grouping`、`visual-hierarchy`、`responsive-adaptive`
  - Part 3 视觉语言：`typography`、`color-roles`、`contrast-readability`、`icons-shape`、`elevation-surfaces`、`motion-tokens`
  - Part 4 组件/状态/交互：`component-anatomy`、`buttons-actions`、`inputs-forms`、`navigation`、`lists-cards-empty`、`dialogs-destructive`、`affordance-validation`、`transitions-optimistic`
  - Part 5 无障碍与语义：`wcag-pour`、`keyboard-focus`、`semantics-screenreader`、`noncolor-dynamic-type`、`touch-zoom-motion`
  - Part 6 设计系统/需求/迁移：`token-layers`、`component-api`、`theming-governance`、`brief-schema`、`acceptance-criteria`、`ai-portability`
- Act II：
  - Part 7 Flutter 心智模型与布局：`flutter-three-trees`、`flutter-constraints`、`flutter-flex-stack-scroll`、`flutter-responsive`、`flutter-project-devtools`
  - Part 8 Flutter 视觉/状态/交互：`flutter-theme-m3`、`flutter-tokens`、`flutter-state-local`、`flutter-state-shared`、`flutter-async-states`、`flutter-forms-nav-motion`
  - Part 9 Flutter 无障碍/测试/交付：`flutter-semantics-focus`、`flutter-a11y`、`flutter-testing`、`flutter-performance`、`flutter-capstone`
- 附录：`checklists`、`mapping-worksheet`、`glossary`、`references`、`changelog`、`download-info`

## 6. 实验室清单

| ID | 位置 | 产物 |
| --- | --- | --- |
| D01 | 6.4 | 可复制的需求简报 + Given/When/Then + 本地模板声明 |
| D02 | 6.1/6.3 | 形容词→token 表 + 实时预览 + 对比度提示 |
| D03 | 2.1/2.2 | 组件树 + 约束读数 + Flutter 参考代码 |
| D04 | 2.3–2.5 | 间距/对齐/层级参数 + 眯眼测试 |
| D05 | 3.1/3.2 | 字号阶梯 + 色彩角色 + 色板 |
| D06 | 3.3 | WCAG 对比度结果与建议 |
| D07 | 4.1–4.3 | 状态矩阵 + 语义说明 |
| D08 | 4.8 | 异步状态机 + 验收建议 |
| D09 | 2.6 | 断点读数 + 布局变化 |
| D10 | 4.4/4.8 | 导航路径 + 动效参数 |
| D11 | Part 5 | 焦点/触控/动效/对比度检查 |
| D12 | 6.6 | 设计评审 + 空白迁移工作表 |

## 7. 内容生产规则

- 正文不写 Qt/QML 代码；迁移工作表只给通用问题与 Flutter 示例。
- 实时演示是本地模拟，不执行 Flutter；Flutter 代码块是参考实现，需在 Flutter 工程中运行。
- AI 生成器只使用本地模板，不调用模型、不接收 API Key。
- Flutter 代码固定 3.47.7；不使用已弃用 API；优先 `withValues`、`ColorScheme.fromSeed`、`MediaQuery.sizeOf`、`LayoutBuilder`。
- 术语与设计参考只引用可在线核对的一手文档；书籍作为附录延伸阅读。
- 视觉示例必须服务概念：色板、标尺、状态矩阵、树、对比度结果，不做纯装饰。
- 每章有需求描述或验收示例；验收优先 Given/When/Then。
- 不堆 API 清单；Act I 不出现 Flutter API，Act II 不重复通用理论。

## 8. 测试与验证记录

- 构建：`pnpm build` 成功，共 8 个页面；`/posts/uiux/`、首页、HTML5、Dart、Rust、文章页、feed、source、llms.txt 均 200。
- Flutter：16 个代码块抽取到临时 Flutter 3.47.7 工程，`flutter analyze --fatal-infos` 无问题；`flutter test` 1/1 通过；`dart format --set-exit-if-changed` 通过；页面代码块已回写为格式化版本。
- 静态审计：172 个 ID 无重复；73 个锚点全部可解析；60 章节（54 内容 + 6 附录）；12 个演示；16 个 Flutter 代码块；无外部资源/iframe；页面 247.5 KB。
- 浏览器：12 个演示全部懒初始化并完成交互；搜索 `token` 命中 18 条；目录高亮与进度正常；代码复制成功；320/375/390/1440 无页面级横向溢出；亮/暗主题正常；无控制台异常、无外部请求。
- 离线：`file://` 打开 `dist/uiux/index.html`，12 个演示、搜索、高亮可用，无异常；仅 file 请求。
- 首页/导航：6 个顶栏链接；390/375/320 两行导航无溢出（导航宽度自适应）；首页 2×2 网格在 1440/768 为两列、390 为单列；UI/UX 卡点击进入 `/posts/uiux/`；llms 已收录，feed 未收录。
- Lighthouse（移动模拟）：Performance 96、Accessibility 100、Best Practices 100、SEO 100。

## 9. 明确不做

- 不在正文写 Qt/QML 代码或 Qt 专属章节。
- 不内嵌 Flutter Web、不接编译服务、不在页面运行真实 Flutter。
- 不做 Flutter API 大全或完整 App 工程；不覆盖所有 Material 组件。
- 不做账号、评论、进度同步、自动判分。
- 不做模型调用、不接收 API Key；AI 生成器只是本地模板。
- 不进入 `feed.json`、`source/`；不新增 npm 依赖。
- 不做英文版或 i18n。
- 不把现有 HTML5/Dart/Rust 页面改成 Flutter 蓝主题。

## 10. 风险与边界

- UI/UX 概念范围极大：用 Running Example + 四契约 + 两幕控制；附录承载检查清单。
- Flutter API 漂移：固定 3.47.7，逐条 analyze/test；不追新特性。
- 演示复杂度：12 个实验室每个约 40–100 行 JS；输出可复制产物；懒初始化。
- 页面体积：247.5 KB，低于 650 KB 预算；无图片/字体依赖。
- 导航/首页改动影响全局：已在 320/375/390/768/1440 验证；后续修改需回归。
- AI 演示误解：所有生成器标注“本地模板，未调用模型”。
- 迁移工作表不提供目标框架答案：这是有意的边界，读者需自己填写，避免把某种框架当成标准答案。

## 11. 主要参考

- NN/g 10 Usability Heuristics、WCAG 2.2、WAI-ARIA APG
- Material Design 3、Flutter 官方文档（Architecture / Layout / State / A11y / Testing / Performance）
- Apple Human Interface Guidelines、Microsoft Fluent 2
- Every Layout、Atomic Design、Design Tokens Format
- Thinking in React、The Elm Architecture
- Specification by Example、User Story Mapping、Gherkin
- Google PAIR People + AI Guidebook、Microsoft HAX Guidelines

## 12. 交付顺序

1. 单文件壳与 Flutter 蓝主题、TOC、搜索、进度、复制、下载。
2. Act I Part 0–4 与 D03/D04/D05/D06/D07/D08/D09/D10。
3. Act I Part 5–6 与 D01/D02/D11/D12。
4. Act II Part 7–9 与 16 个 Flutter 参考代码块。
5. 临时 Flutter 工程 analyze/test/format，回写格式化代码。
6. 顶栏移动端两行导航、首页 2×2、llms.txt。
7. 构建、静态审计、浏览器/离线/Lighthouse、回归。
8. spec/ADR/CONTEXT 与清理（本文件即验证记录）。
