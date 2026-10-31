# 《AI 时代的 HTML5 超级大全》规格说明

- 状态：Draft（待用户确认）
- 日期：2026-10-27
- 目标产物：`src/pages/html5/index.html`
- 对外地址：`https://n0v5.github.io/posts/html5/`
- 关联文档：`CONTEXT.md`、`docs/adr/0001-standalone-single-file-html5-guide.md`、`docs/adr/0002-ai-demos-local-only.md`

## 1. 问题陈述

博客目前只有零散的数学/物理文章，缺少一份能系统展示现代 Web 平台能力、又能作为长期参考的 HTML5 大全。目标不是再写一篇普通文章，而是交付一个独立、自包含、可离线保存、带大量可运行演示的 HTML5 旗舰页面；同时把“AI 时代”作为贯穿视角：语义化 HTML 如何服务 LLM/Agent、浏览器内置 AI 如何被使用、AI 生成的界面如何保持可访问与可验证。

现有 Astro 内容集合与文章布局不适合承载这种超长、强交互、单文件分发的页面，因此页面本身使用纯 HTML/CSS/JS 实现，只通过导航与首页卡片接入博客。

## 2. 方案概述

在 `src/pages/html5/index.html` 交付一个单文件自包含页面：

- 内联全部 CSS/JS，零外部依赖、零外部资源请求；可直接下载并用浏览器打开。
- 采用“能力域 + 入门路径”的信息架构，覆盖 10 个内容部分 + 附录。
- 提供吸顶目录、全文搜索、阅读进度、代码复制、下载本页、亮/暗跟随系统。
- 约 30+ 个旗舰演示；需要服务端或硬件的 API 以代码 + 特性检测 + 降级提示呈现。
- AI 相关演示只做浏览器内置 AI 的特性检测与模拟流式输出，不调用外部模型、不接受 API Key。
- 通过博客顶栏“HTML5”入口和首页旗舰卡片接入；`.llms.txt` 增加该页面索引。

页面是独立文档，不进入 Astro 内容集合，因此不出现在 `feed.json` 与文章源码查看页中；页面自身提供“下载本页 HTML”。

## 3. 用户故事与验收条件

### US-01 打开与基本阅读

作为读者，我可以直接打开 `/posts/html5/`，在无构建错误、无控制台报错的情况下阅读全部内容。

验收：

- 静态构建后存在 `dist/html5/index.html`，HTTP 200。
- 页面标题、描述、语言（`zh-CN`）、canonical 正确。
- 关闭 JavaScript 后，正文、标题、目录锚点仍可阅读和跳转。
- 首屏不发起任何外部网络请求。

### US-02 目录导航

作为读者，我可以按“部分 → 章节”浏览，并随时知道自己在哪。

验收：

- 桌面端左侧吸顶目录；移动端为可展开/抽屉式目录。
- 目录链接使用真实锚点，无 JS 也可跳转。
- 滚动时当前章节高亮；顶部有阅读进度条。
- 提供“回到顶部”入口。

### US-03 全文搜索

作为读者，我可以用键盘或按钮搜索整页内容并跳转到命中章节。

验收：

- `Ctrl/Cmd + K`、`/` 或点击搜索按钮打开搜索对话框（原生 `<dialog>`）。
- 输入关键词后展示分组结果（部分/章节 + 摘要），支持键盘上下选择与回车跳转。
- 无结果时显示明确提示；搜索索引在首次打开时才构建，避免拖慢首屏。
- 搜索结果用 `<mark>` 高亮，且不会注入未转义 HTML。

### US-04 章节结构与 AI 视角

作为读者，我能在每一章获得一致的信息结构，并理解该能力在 AI 时代的意义。

验收每章至少包含：

- 一句话结论。
- 核心概念/原理。
- 最小可运行代码。
- 对应演示（或“需服务端/硬件”的说明与代码）。
- 兼容性标签与降级方式。
- 1–3 条常见坑。
- “AI 视角”短评。
- 延伸阅读链接（MDN / 规范 / web.dev 等）。

### US-05 交互演示

作为读者，我可以亲自操作演示，而不是只看静态截图。

验收：

- 至少 30 个 `[data-demo]` 演示，覆盖语义、表单、媒体、图形、存储、网络、Worker、设备、AI 检测等。
- 演示只在进入视口后初始化（IntersectionObserver 懒启动），页面初始不运行重型动画。
- 需要权限的演示必须由用户点击触发，并解释权限用途；拒绝授权时显示可读降级提示。
- 不支持某 API 时显示“当前浏览器不支持 + 替代方案”，不抛未捕获异常。
- 离开视口时暂停动画/计时器；尊重 `prefers-reduced-motion`。

### US-06 代码阅读与复制

作为读者，我可以阅读带语言标识和语法着色的代码，并一键复制。

验收：

- 每个代码块有语言标签、复制按钮、复制成功反馈。
- 语法高亮由内置的轻量高亮器完成（仅 HTML/CSS/JS），不依赖外部库；高亮失败时回退为纯文本。
- 复制使用 `navigator.clipboard`，失败时使用隐藏 textarea 降级。
- 代码块可横向滚动，不撑破移动端布局。

### US-07 下载与离线

作为读者，我可以下载整份 HTML5 大全，离线打开，核心内容与演示不依赖网络。

验收：

- 页脚“下载本页 HTML”通过 `download` 属性保存为 `html5-almanac.html`。
- 文件内无外部字体、图片、脚本、样式或 iframe；断开网络后打开，核心内容仍可用。
- 需要 HTTPS/权限的演示（摄像头、剪贴板、内置 AI 等）明确标注环境要求。

### US-08 主题与动效

作为读者，页面自动适配我的系统亮/暗模式，并尊重减少动效偏好。

验收：

- 使用 `color-scheme: light dark` 与 `prefers-color-scheme`；无手动主题切换（本页定位为跟随系统）。
- 动画只用于反馈与层级过渡，不阻塞阅读；`prefers-reduced-motion: reduce` 下关闭非必要动画。
- 文本/背景对比度达到 WCAG AA；状态不只依赖颜色。

### US-09 可访问性

作为使用键盘或屏幕阅读器的读者，我可以完整使用目录、搜索、演示与代码复制。

验收：

- 提供 skip link；焦点可见；焦点顺序合理；原生 dialog 管理焦点。
- 所有按钮/输入有可访问名称；表单有 label；结果为 `aria-live` 区域。
- 标题层级连续；landmark 结构清晰；无重复 ID。
- 演示输出变化使用节流的 `aria-live` 提示，避免逐帧朗读。

### US-10 移动端

作为手机读者，段落、代码和演示都能舒适阅读。

验收：

- 375px 宽度下无页面级横向溢出；代码块内部可横向滚动。
- 目录可折叠；点击目录项后自动收起。
- 交互控件触控目标不小于 44×44px（视觉尺寸可更小但有足够点击区域）。
- 演示画布自适应容器宽度。

### US-11 博客入口

作为博客访客，我能从顶栏或首页发现并进入大全。

验收：

- `BaseLayout` 顶栏新增“HTML5”链接，指向 `/posts/html5/`（带 base 前缀）。
- 首页在“最近文章”上方新增旗舰卡片，含标题、简介、演示数量与 CTA。
- 大全页头提供“返回博客”链接。
- 既有路由与文章页功能不受影响。

### US-12 Agent 可读性

作为 AI Agent，我能理解这个页面的结构和主题，并找到机器可读入口。

验收：

- 页面有合法 JSON-LD（`TechArticle`）与语义化结构。
- `public/.llms.txt` 增加本页 URL、标题、主题与“单文件 HTML”说明。
- 页面提供指向 `feed.json`、`llms.txt` 与进一步阅读的链接。
- 不依赖 Canvas/图片承载核心信息；内容以文本为主。

### US-13 AI 演示边界

作为读者，我清楚哪些 AI 能力是真实检测、哪些是模拟输出。

验收：

- 内置 AI 演示只做特性检测与用户触发的本地调用（若可用），并在不可用时解释状态。
- 模拟流式聊天显著标注“模拟输出（未调用模型）”，支持停止/重试，演示 `aria-live` 与流式渲染。
- 页面不索取 API Key，不向任何外部模型服务发送内容，不自动下载大模型。

### US-14 构建与回归

作为维护者，我可以安全地修改页面而不破坏博客。

验收：

- `pnpm build` 成功，生成新增的 `/posts/html5/index.html`，原有页面数量与路由不变。
- 页面文件无新增 npm 依赖，不改动 `package.json`。
- 静态审计通过：无外部资源引用、无重复 ID、锚点可解析、演示数量达标、文件体积在预算内。

## 4. 已定决策

| 决策 | 选择 | 理由/约束 |
| --- | --- | --- |
| 交付形态 | 独立单页 HTML | 超长 + 强交互 + 可下载；不受 Astro 模板限制 |
| 页面位置 | `src/pages/html5/index.html` | Astro 作为静态 HTML 页面原样输出到 `dist/html5/`，URL 为 `/posts/html5/` |
| 技术封装 | 单文件自包含，内联 CSS/JS | 零依赖、可离线、可直接分发 |
| 外部资源 | 禁止外部字体/图片/脚本/样式/CDN | 离线可用、隐私与稳定性 |
| 内容定位 | HTML5 为主，AI 贯穿 + 前沿一章 | 保持“HTML5 大全”主题不失焦 |
| 目录组织 | 能力域 + 入门路径 | 既可顺序阅读，也可作为参考手册 |
| 演示程度 | 约 30+ 个旗舰演示 | 重点章节可交互；服务端/硬件 API 代码 + 检测 + 降级 |
| 视觉 | 学术文档 + AI 蓝紫点缀；跟随系统亮/暗 | 与博客 zinc 体系一致，长文可读性优先 |
| AI 调用 | 仅浏览器内置 AI + 模拟流式 | 无后端、无密钥、无外部请求；隐私与稳定性 |
| 博客接入 | 顶栏“HTML5” + 首页旗舰卡片 | 保证可发现性，同时不污染文章流 |
| 内容集合 | 不进入 `src/content/blog` | 独立文档形态；不进入 feed 与文章源码页 |
| 语言 | 中文正文，英文 API/代码术语 | 与现有博客一致 |

## 5. 信息架构

页面由 10 个内容部分 + 附录组成，每部分包含导语、章节、演示与“AI 视角”框。

### 第 0 部分：导言

- 0.1 什么是“HTML5”：从 2014 规范到 HTML Living Standard。
- 0.2 AI 时代的 Web：语义化、可访问、可组合、隐私优先、渐进增强、可验证。
- 0.3 使用指南：支持标签、演示约定、代码复制与下载、离线限制。

### 第 1 部分：文档与语义

- 1.1 文档骨架与 `<head>`：doctype、charset、viewport、title、meta、OG、canonical。
- 1.2 语义元素与文档大纲：header/nav/main/article/section/aside/footer/figure/time/address。
- 1.3 链接、图像与嵌入：a、img、picture/source、iframe/sandbox、loading。
- 1.4 表格与数据语义：caption、scope、data、time。
- 1.5 可访问性：ARIA、landmarks、焦点、live regions、inert、对比度。
- 1.6 Agent 可读性：语义 DOM、JSON-LD、稳定选择器、llms.txt、结构化表单。
- 1.7 AI 视角：语义 HTML 是模型与 Agent 的公共接口。

### 第 2 部分：表单与交互

- 2.1 表单基础与输入类型。
- 2.2 原生校验与 Constraint Validation API。
- 2.3 datalist/select/output/progress/meter。
- 2.4 `<dialog>`、Popover API、`<details>` 与焦点管理。
- 2.5 文件、拖放、剪贴板、Web Share。
- 2.6 Agent 友好表单：label、name、autocomplete、错误信息、机器可填充。

### 第 3 部分：媒体

- 3.1 audio/video/source/track/poster/preload。
- 3.2 字幕、无障碍与媒体语义。
- 3.3 Media Session、Picture-in-Picture、Fullscreen。
- 3.4 Web Audio 与 MediaRecorder。
- 3.5 getUserMedia、captureStream、屏幕捕获。
- 3.6 WebRTC / WebCodecs / MSE 概览。
- 3.7 AI 视角：语音、字幕、转写与本地媒体处理。

### 第 4 部分：图形与视觉

- 4.1 SVG：可缩放、可访问、可交互。
- 4.2 Canvas 2D：像素、动画、高清屏、OffscreenCanvas。
- 4.3 WebGL：着色器与 GPU 图形。
- 4.4 WebGPU：现代 GPU 图形与计算。
- 4.5 CSS/WAAPI/View Transitions/滚动驱动动画。
- 4.6 AI 视角：生成视觉、数据可视化与本地 GPU 推理。

### 第 5 部分：存储与离线

- 5.1 Cookie、Web Storage、存储配额与分区。
- 5.2 localStorage / sessionStorage。
- 5.3 IndexedDB。
- 5.4 Cache API。
- 5.5 OPFS 与 File System Access。
- 5.6 PWA：manifest、Service Worker、离线策略。
- 5.7 AI 视角：local-first、模型缓存、数据主权。

### 第 6 部分：网络与实时

- 6.1 fetch / Request / Response / AbortController。
- 6.2 Streams 与流式 UI。
- 6.3 SSE / WebSocket / WebTransport。
- 6.4 WebRTC 数据通道。
- 6.5 在线/离线事件、Background Sync、Push。
- 6.6 AI 视角：token 流、重试、背压、取消。

### 第 7 部分：Worker 与性能

- 7.1 Web Worker、SharedWorker、Worklets。
- 7.2 Service Worker 与缓存策略（代码为主）。
- 7.3 scheduler、requestIdleCallback、MessageChannel。
- 7.4 Performance API、Observers、Core Web Vitals。
- 7.5 资源提示、懒加载、content-visibility、containment。
- 7.6 AI 视角：把推理搬出主线程。

### 第 8 部分：设备、安全与隐私

- 8.1 设备能力与权限模型。
- 8.2 地理位置、摄像头、麦克风、屏幕捕获。
- 8.3 通知、Wake Lock、Fullscreen、Share、Vibration。
- 8.4 文件系统与硬件：WebUSB / Web Bluetooth / Serial / HID / NFC / MIDI。
- 8.5 Payment Request、WebAuthn、Credential Management。
- 8.6 安全：同源、CORS、CSP、Trusted Types、SRI、iframe sandbox。
- 8.7 隐私：存储分区、指纹面、Permissions Policy、数据最小化。
- 8.8 AI 视角：Agent 权限、prompt injection、内容溯源。

### 第 9 部分：AI 时代的前沿

- 9.1 浏览器内置 AI：Prompt / Summarizer / Translator / Language Detector / Writer / Rewriter。
- 9.2 端侧推理：WebNN、WebGPU、WebAssembly。
- 9.3 Agentic Web 与 WebMCP（实验性）。
- 9.4 让页面被 Agent 使用：语义、可操作契约、llms.txt、feed.json。
- 9.5 AI 生成 UI 与人类监督。
- 9.6 流式 AI 界面与可访问性。
- 9.7 Agent 安全：prompt injection、工具权限、沙箱。
- 9.8 现在采用 vs 观望。

### 附录

- A. 浏览器支持矩阵（按能力域，不写死版本号）。
- B. API 索引 A–Z（跳转对应章节）。
- C. 术语表。
- D. 延伸阅读（MDN、WHATWG、W3C、web.dev、Can I Use、Chrome AI 文档）。
- E. 版本与更新记录（v1.0，2026-10-27）。
- F. 下载 / 离线说明。

## 6. 页面骨架与交互

### 6.1 页面结构

1. Skip link：`跳到正文`。
2. 顶栏：站名、返回博客、搜索按钮、下载入口、阅读进度条。
3. 主布局：左侧吸顶目录 + 中间正文；桌面端内容宽度约 760px，侧栏约 240px。
4. 正文：Hero（标题、副标题、版本、支持标签图例）→ 10 个部分 → 附录。
5. 页脚：下载本页、查看 feed/llms、返回博客、更新日期。
6. 移动端：顶部工具栏 + 可展开目录 + 单列正文；目录项点击后自动收起。

### 6.2 目录

- 目录为静态 HTML，保证无 JS 可跳转。
- 每个部分可折叠；当前章节由 IntersectionObserver 高亮。
- 目录链接使用 `#chapter-id`；滚动位置考虑吸顶高度（scroll-margin-top）。
- 移动端使用原生 `<details>` 或按钮 + `aria-expanded`，不引入外部库。

### 6.3 搜索

- 原生 `<dialog>`；输入框、结果列表、结果计数、快捷键提示。
- 首次打开时从 DOM 构建索引（标题 + 段落文本），不重复存储内容。
- 搜索：大小写不敏感、中文按子串匹配、结果按部分分组；最多 20 条。
- 键盘：↑/↓ 选择，Enter 跳转，Esc 关闭；结果点击后关闭并滚动。
- 使用 `textContent` 与安全 DOM 构建，禁止拼接未转义 HTML。

### 6.4 阅读进度

- 顶部 2–3px 渐变进度条，`aria-hidden="true"`；正文旁可选百分比文本。
- 使用 `requestAnimationFrame` 节流滚动计算；减少动效时不显示过渡动画。

### 6.5 代码块

- 代码块结构：`figure > figcaption(语言 + 复制按钮) + pre > code`。
- 内置轻量高亮器支持 HTML/CSS/JS；其他语言按纯文本展示。
- 复制按钮写入剪贴板；成功反馈 1.5s；失败降级并提示手动选择。
- 代码块背景在亮/暗主题下均使用深色，保证可读性。

### 6.6 主题与系统偏好

- 仅跟随系统：`prefers-color-scheme`、`prefers-reduced-motion`、`prefers-contrast`。
- 提供“系统偏好演示”卡片，展示当前媒体查询状态，作为教学演示（不改变全站主题）。

### 6.7 下载

- 页脚 `<a href="/posts/html5/" download="html5-almanac.html">`。
- 页面无外部资源，下载文件可离线打开；需要 HTTPS/权限的演示标注限制。

## 7. 演示清单

共 37 个演示，覆盖 9 个能力域；所有演示使用 `[data-demo]` 容器与 `[data-demo-id]` 标记。

| ID | 所在章节 | 演示内容 | 依赖/降级 |
| --- | --- | --- | --- |
| D01 | 1.2 / 1.5 | 文档大纲与 landmark 检查器 | 读取当前页面，无降级需求 |
| D02 | 1.6 | JSON-LD 编辑器与解析结果 | 解析失败显示错误 |
| D03 | 2.2 | 表单原生校验 playground | 无 JS 时仍可提交并看到浏览器校验 |
| D04 | 2.6 | 表单 → Agent JSON 视图 | 需 JS；显示可访问名称与类型 |
| D05 | 2.4 | dialog / popover / inert 焦点管理 | 不支持 Popover 时隐藏对应按钮 |
| D06 | 2.5 | 文件拖放与元数据检查 | 支持 File API；无拖放时用文件选择 |
| D07 | 2.5 | 剪贴板与 Web Share | 非安全上下文/不支持时提示 |
| D08 | 3.1 | canvas.captureStream → video + WebVTT 字幕 | 不支持 captureStream 时显示静态说明 |
| D09 | 3.4 | Web Audio 振荡器 + 频谱可视化 | AudioContext 不可用则降级提示 |
| D10 | 3.5 | getUserMedia 摄像头预览 | 需权限/HTTPS；拒绝时提示 |
| D11 | 3.7 | SpeechSynthesis 朗读 | 不支持时隐藏按钮 |
| D12 | 4.1 | SVG 交互图（hover/键盘） | 纯 HTML/SVG，无降级需求 |
| D13 | 4.2 | Canvas 2D 波形/粒子 + 高清屏 | 减少动效时静态渲染 |
| D14 | 4.3 | WebGL 片元着色器 | 无 WebGL 时显示错误与替代方案 |
| D15 | 4.4 | WebGPU adapter 信息与能力检测 | 无 WebGPU 时降级到 WebGL 提示 |
| D16 | 4.5 | CSS 动画 vs WAAPI 对比 | 无 WAAPI 时仅 CSS 动画 |
| D17 | 4.5 | View Transitions / 滚动驱动动画检测 | 不支持时使用普通过渡 |
| D18 | 5.2 | localStorage/sessionStorage 实验室 | 隐私模式失败时提示 |
| D19 | 5.3 | IndexedDB 键值存储 | 不可用时提示替代方案 |
| D20 | 5.4 | Cache API 存取 | 不可用/非安全上下文提示 |
| D21 | 5.5 | OPFS 写入/读取 | 不支持时隐藏写操作 |
| D22 | 5.1 | 存储配额估算 | 不支持时显示“未知” |
| D23 | 6.1 | fetch + AbortController | 使用 data URL，不依赖外网 |
| D24 | 6.2 | ReadableStream 模拟 token 流 | 不支持 Streams 时退回定时器 |
| D25 | 6.3 | 模拟 WebSocket 消息 UI | 标注“模拟”，不连接服务器 |
| D26 | 6.5 | 在线/离线状态指示 | 始终可用 |
| D27 | 7.1 | Web Worker 计算与进度 | 不支持 Worker 时主线程演示 |
| D28 | 7.4 | Intersection/Resize/Mutation Observer 实验室 | 各自特性检测 |
| D29 | 7.4 | Performance API 计时面板 | 不支持时显示基础时间 |
| D30 | 8.2 | 地理位置 | 需权限/HTTPS；拒绝时提示 |
| D31 | 8.3 | 通知权限 | 需权限/HTTPS；拒绝时提示 |
| D32 | 8.3 | Wake Lock / Fullscreen | 各自特性检测 |
| D33 | 8.1 / 8.4 | 设备能力检测矩阵（含 USB/蓝牙/串口等） | 仅检测，不连接设备 |
| D34 | 9.1 | 内置 AI 能力面板（Prompt/Summarizer/Translator/Detector） | 逐项检测；不自动下载模型 |
| D35 | 9.6 | 模拟 AI 聊天流式输出 | 明确标注模拟；支持停止 |
| D36 | 9.4 | 页面结构 → Agent 可读 JSON | 无 JS 时展示静态示例 |
| D37 | 0.3 / 4.5 | 系统偏好面板（主题/减少动效/对比度） | 仅展示 matchMedia 状态 |

非交互、代码为主的 API：Service Worker 注册、PWA 安装、SharedWorker、WebTransport、WebRTC 数据通道、WebCodecs、WebNN 推理、WebXR、WebUSB、Web Bluetooth、Web Serial、WebHID、WebNFC、WebMIDI、Payment Request、WebAuthn、Idle Detection、File System Access、屏幕捕获。它们在各章节中有完整代码、限制说明与能力检测入口（D33）。

## 8. 内容规范

### 8.1 章节模板

每章按以下顺序组织：

1. 标题与一句话结论。
2. 为什么重要（含“AI 视角”一两句）。
3. 核心概念/原理（必要时用表格或对比）。
4. 最小可运行代码。
5. 演示（若无实时演示，给出可运行代码与环境说明）。
6. 兼容性与降级（标签 + 特性检测建议）。
7. 常见坑（1–3 条）。
8. 延伸阅读（2–4 条外部链接）。

### 8.2 支持标签

- 稳定：主流浏览器可用，无需特殊权限。
- 实验：规范草案/flag/origin trial，明确提示不要用于生产关键路径。
- 受限：仅部分浏览器、需要权限、硬件或 HTTPS。
- 需服务端：静态页无法独立演示，给出代码与自建服务建议。

标签按特性检测动态展示；正文避免写死版本号，统一注明“以实际特性检测为准”。

### 8.3 AI 视角

每章必须回答“这与 AI 时代有什么关系”，例如：

- 语义化 → LLM/Agent 解析、检索、稳定操作契约。
- 表单 → Agent 可填充、可验证的人机协作界面。
- 媒体 → 语音/字幕/转写/本地处理。
- 图形 → 生成视觉、数据可视化、GPU 推理。
- 存储 → local-first、模型缓存、隐私。
- 网络 → 流式 token、取消、重试、背压。
- Worker/性能 → 把推理移出主线程，保持交互流畅。
- 设备/安全 → 权限、prompt injection、内容溯源。
- AI 前沿 → 内置 AI、WebMCP、端侧推理与人类监督。

### 8.4 准确性

- 不复制 MDN/规范原文；用自己的话解释并链接来源。
- WebMCP、Prompt API、WebNN 等标注实验性；不宣称已标准化。
- 不写“所有浏览器都支持”；使用“特性检测 + 降级”表述。
- 所有演示在页面内真实可运行或明确标注“模拟/需服务端”。
- 不包含外部模型调用、不索取密钥、不上传用户输入。

### 8.5 语言与排版

- 中文正文，英文 API 与代码标识；中文使用全角标点。
- 段落短，避免营销腔和空泛总结。
- 每部分开头有一段 2–4 句导语，说明该部分解决什么问题。
- 代码注释保持精简，只在非显然处解释。

## 9. 视觉与响应式

### 9.1 设计语言

- 学术文档排版 + 少量 AI 蓝紫渐变点缀；不使用霓虹/玻璃拟态作为主体。
- 亮色：背景 zinc-50、正文 zinc-900、弱化 zinc-500、边框 zinc-200。
- 暗色：背景 zinc-950、正文 zinc-50、弱化 zinc-400、边框 zinc-800。
- AI 强调色：靛蓝 → 紫罗兰渐变（如 `#6366f1 → #8b5cf6`），仅用于进度条、部分标题装饰、演示卡上边线。
- 支持标签颜色：稳定绿、实验琥珀、受限灰、需服务端蓝；同时使用文字标签，不只依赖颜色。

### 9.2 字体与排版

- UI/导航：系统无衬线字体栈。
- 正文：系统衬线字体栈（Georgia / Songti SC / Noto Serif CJK / serif），字号 16–18px，行高 1.75。
- 代码：系统等宽字体栈（ui-monospace, SFMono-Regular, Menlo, Consolas）。
- 标题层级清晰；长文最大宽度约 760px；段落间距充足。

### 9.3 布局

- 桌面：左侧 240px 目录 + 内容；最大宽度 1200px。
- 平板/手机：目录收起为顶部抽屉；单列。
- 代码块、表格、画布容器允许内部横向滚动，不允许撑破页面。
- 触控目标至少 44px；按钮/链接有明确 hover/focus/active 状态。

### 9.4 动效

- 过渡 150–250ms；入场最多轻微淡入/上移。
- Canvas/演示在不可见时暂停；减少动效时停止自动播放。
- 搜索/目录高亮使用即时状态，不做夸张动画。

## 10. 技术实现约束

### 10.1 文件与依赖

- 唯一交付文件：`src/pages/html5/index.html`。
- 内联 `<style>` 与 `<script>`；不新增 npm 依赖、不使用 CDN、不使用外部字体/图片/图标库。
- 图标使用内联 SVG；示例图片使用内联 SVG/渐变/Canvas 生成；视频演示使用 Canvas 流。

### 10.2 JavaScript 架构

- 单个 IIFE 或少量命名空间模块；无框架、无构建步骤。
- 初始化顺序：基础 UI（目录/进度/复制/下载）→ 搜索索引（首次需要时）→ 演示懒初始化。
- 演示以 `data-demo-id` 注册初始化函数；通过 IntersectionObserver 触发；提供 `destroy`/暂停能力。
- 所有 DOM 操作优先 `textContent`/`createElement`，禁止 `innerHTML` 拼接用户输入。
- 所有特性检测在运行时完成；不使用 `eval`/`new Function`。

### 10.3 性能

- 首屏不初始化离屏演示；初始脚本只注册监听。
- 搜索索引延迟构建；对输入做 120ms 防抖。
- 滚动进度用 rAF 节流；避免布局抖动。
- 软预算：单个 HTML 文件 ≤ 500KB（未压缩），硬上限 800KB；正文目标 3–6 万字。
- 目标：Lighthouse 移动端 Performance ≥ 90，Accessibility / Best Practices / SEO ≥ 95。

### 10.4 单文件限制

- Service Worker 需要独立脚本，无法在单文件中真实注册；只提供代码与说明。
- PWA 安装依赖 manifest 与 SW；同理只提供代码与限制说明。
- 需要服务端的 WebSocket/SSE/WebTransport/WebRTC 信令/推送等，只做模拟 UI 或代码说明。
- 部分设备 API 需要 HTTPS、权限或硬件；页面只做检测与提示。
- 不在页面中内联大模型或二进制媒体；Canvas/Web Audio 生成演示内容。

### 10.5 安全

- 无外部脚本；不收集/上传用户数据；演示数据只存本机（用户主动触发）。
- 文本输出一律转义；模拟 AI 输出不使用不可信 HTML。
- 权限请求必须由用户手势触发，并先说明用途。
- 不在页面中存储 API Key（本页也不接受 Key）。

## 11. 博客集成

1. `src/layouts/BaseLayout.astro`：在顶栏“首页/关于”之间或之后新增“HTML5”链接，`href={`${baseUrl}html5/`}`。
2. `src/pages/index.astro`：在“最近文章”上方新增旗舰卡片；标题“AI 时代的 HTML5 超级大全”，说明覆盖能力域、演示数量与 AI 视角，CTA 指向 `/posts/html5/`。
3. `public/.llms.txt`：在“文章”之外新增“## 专题”段落，列出本页 URL、简介与“单文件 HTML、可离线”说明。
4. 大全页页头/页脚提供“← 返回博客”（`/posts/`）。
5. 不修改 `feed.json`、文章源码页、内容集合；本页属于独立专题。

## 12. 测试决策

### 12.1 稳定接缝

按优先级复用/定义以下接缝：

- 路由接缝：`/posts/html5/` 返回构建后的静态 HTML；`dist/html5/index.html` 存在。
- 页面 DOM 契约：
  - `#html5-guide`（根容器）
  - `#guide-toc` + `[data-toc-link]`
  - `#search-dialog`、`#search-input`、`#search-results`
  - `#reading-progress`
  - `[data-demo][data-demo-id]`
  - `[data-copy-code]`
  - `[data-download-guide]`
- 博客集成契约：
  - 顶栏 `a[data-nav="html5"]`
  - 首页 `[data-featured="html5"]`
  - `.llms.txt` 包含 `/posts/html5/`
- 内容锚点：每个章节 ID 唯一，目录链接可解析。

### 12.2 静态审计

构建后执行一次性检查（脚本可由实现者临时运行，不新增测试框架）：

- 文件存在，体积在预算内。
- 无外部 `script src`、外部 `link rel=stylesheet`、外部 `@import`、外部图片/iframe/字体；引用的外链仅出现在正文链接。
- 无重复 ID；所有 `href="#..."` 均有目标；标题层级连续。
- 所有按钮/表单控件有可访问名称；图片/内联 SVG 有 `role`/`aria-label`。
- JSON-LD 可解析；页面包含 title/description/canonical/OG/theme-color。
- `[data-demo]` 数量 ≥ 30；10 个部分均存在。
- 页面 HTML 中无 API Key、无外部模型端点。

### 12.3 浏览器验证

使用 Qoder in-app browser（或等价 Chromium）逐项验证：

- 首屏无 console error；无外部网络请求。
- 搜索打开、输入、结果、键盘选择、跳转。
- 目录滚动高亮、移动端目录开合（可用 CSS/宽度模拟或设备模式）。
- 阅读进度随滚动变化。
- 逐个演示 smoke test：D01–D37，至少确认无异常、可交互或正确降级。
- 代码复制成功/降级；下载链接指向 `/posts/html5/` 且带文件名。
- 亮/暗主题（系统偏好）；减少动效（如可模拟）。
- 375px 视口无页面级横向溢出；触控目标尺寸。
- 关闭 JS 后正文与目录可用、演示显示降级文案。
- 构建后的页面与 dev 行为一致（以 `pnpm preview` 为准）。

### 12.4 完成定义

- 所有 US-01–US-14 验收项通过。
- `pnpm build` 成功；原有路由不回归。
- 浏览器测试清单全部通过，无未捕获异常。
- 无外部依赖/请求；文件体积在预算内。
- 代码通过格式与可读性检查；无调试日志、无死代码。
- 关键决策已落盘到 `CONTEXT.md` 与 ADR。

## 13. 明确不做

- 不做真实 LLM 调用、不接受 API Key、不接第三方模型服务。
- 不做后端、数据库、账号体系或云端存储。
- 不引入任何外部 CSS/JS/字体/图标/CDN。
- 不做多页专题站或 Astro 内容集合文章；不进入 `feed.json`/文章源码页。
- 不承诺 Service Worker/PWA 在本页中真实安装（单文件限制，代码 + 说明）。
- 不连接真实 WebSocket/SSE/WebTransport/WebRTC 信令服务器（模拟或代码）。
- 不做 WebUSB/蓝牙/串口等真实设备配对（仅检测 + 代码）。
- 不覆盖 HTML/Web 平台的全部 API；以大纲为准，强调实用与可运行。
- 不做 i18n、PDF 导出、完整打印书排版（仅基础打印样式）。
- 不新增自动化测试框架或构建步骤。
- 本次规格阶段不提交/不推送代码。

## 14. 风险与缓解

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| 浏览器 API 支持差异 | 演示失败 | 运行时特性检测 + 降级提示；关键内容不依赖演示 |
| 单文件体积过大 | 首屏慢 | 懒初始化、延迟搜索索引、无外部资源；500KB 软预算 |
| Service Worker/PWA 无法单文件运行 | 功能缺口 | 明确标注限制，提供代码与自建部署说明 |
| 内置 AI 不可用/需下载 | AI 演示失败 | 只检测状态，不自动下载；提供降级与模拟 |
| WebMCP 等实验标准变化 | 内容过时 | 标注实验性、注明日期、链接规范 |
| 超长页面维护困难 | 后续更新成本 | 清晰章节 ID/结构、版本记录、统一章节模板 |
| 大量演示影响可访问性 | 屏幕阅读器/键盘体验 | 原生控件、aria-live 节流、焦点管理、减少动效 |
| GitHub Pages 缓存 | 更新延迟 | 正常刷新/等待；页面无构建哈希依赖 |
| 测试环境无可见视口 | 无法截图 | 使用 DOM/交互脚本验证；必要时用户手动目检 |

## 15. 实施顺序

1. 搭建单文件页面骨架：设计 token、顶栏、目录、正文容器、页脚、skip link、亮暗系统。
2. 实现基础交互：目录高亮、阅读进度、代码高亮/复制、下载、搜索（延迟索引）。
3. 编写第 0、1、2 部分与对应演示，建立章节模板与演示注册机制。
4. 编写第 3–5 部分与演示（媒体、图形、存储）。
5. 编写第 6–9 部分与演示（网络、Worker/性能、设备/安全、AI 前沿）。
6. 编写附录：支持矩阵、API 索引、术语、延伸阅读、版本记录。
7. 集成博客：BaseLayout 导航、首页卡片、`.llms.txt`。
8. 静态审计 + 浏览器逐项验证 + 性能/可访问性检查 + 修复。
9. 记录/更新 CONTEXT.md 与 ADR，交付变更清单。

## 16. 完成清单

- [ ] `src/pages/html5/index.html` 单文件完成，无外部资源。
- [ ] 10 个部分 + 附录完整；正文达到目标篇幅。
- [ ] 至少 30 个演示可运行或正确降级。
- [ ] 目录/搜索/进度/复制/下载/亮暗/减少动效全部可用。
- [ ] 博客顶栏入口、首页卡片、`.llms.txt` 集成完成。
- [ ] `pnpm build` 成功，原有路由无回归。
- [ ] 静态审计与浏览器验收通过。
- [ ] 可访问性与性能目标达成。
- [ ] 决策文档已更新。
