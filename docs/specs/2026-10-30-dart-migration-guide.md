# 《Dart 迁移指南：从 C++/Python 到 Dart》规格说明

- 状态：Implemented（v1.0，2026-10-30）
- 日期：2026-10-30
- 目标产物：`src/pages/dart/index.html`
- 对外地址：`https://n0v5.github.io/posts/dart/`
- Dart 基线：Dart 3.13（本机验证版本 3.13.5 stable）
- 关联文档：`CONTEXT.md`、`docs/adr/0001-standalone-single-file-html5-guide.md`、`docs/adr/0002-ai-demos-local-only.md`、`docs/adr/0003-dart-guide-single-file.md`、`docs/adr/0004-dart-demos-local-only.md`

## 1. 问题陈述

博客目前有两类内容：数学/物理类的 Astro 内容集合文章，以及《AI 时代的 HTML5 超级大全》这一独立单文件专题页。缺少一份面向已有工程经验读者的 Dart 教程。

目标读者已经会 C++ 与 Python，不需要从“什么是变量”讲起。他们真正需要的是：

- 把已有心智模型映射到 Dart：类型推断、值/引用语义、OOP、泛型、内存管理、并发。
- 识别 Dart 真正不同的地方：健全空安全、mixin/extension/class modifiers、records/patterns、单线程事件循环、Stream、Isolate 无共享内存、JIT/AOT/Wasm 多目标。
- 能直接动手写 Dart，而不是读完仍停留在概念层。

现有 Astro 文章布局无法承载超长目录、章节内迁移卡、交互演示与整页下载；因此需要一个与 HTML5 大全同级的独立专题页。它是“迁移指南”，不是 Dart 规范译本，也不是 Flutter 教程。

## 2. 方案概述

在 `src/pages/dart/index.html` 交付一个单文件自包含页面：

- 内联全部 CSS/JS，零外部资源请求；可下载后用浏览器离线打开。
- 沿用 HTML5 大全的页面骨架（吸顶目录、全文搜索、阅读进度、代码复制、跟随系统亮暗），主色替换为 Dart 蓝。
- 信息架构为“导言 + 8 个主题部分 + 附录”，每章包含：一句话结论、概念讲解、完整示例、迁移卡、原理侧栏、常见坑。
- 6 个本地可视化演示，只用 JS 模拟概念，不执行真实 Dart 代码；Dart 代码块提供复制按钮与 DartPad 外链。
- 以 Dart 3.13 稳定特性为基线，版本敏感语法显式标注（records/patterns/class modifiers 3.0、extension types 3.3、dot shorthands 3.10、primary constructors 3.13）。
- 通过顶栏“Dart”、首页专题双卡、`public/.llms.txt` 接入；不进入内容集合、`feed.json` 或文章源码查看页。

### 2.1 复用的接缝

优先复用 HTML5 专题页已有的 DOM 契约，不新造一套：

- `#guide-toc` + `[data-chapter]`：目录高亮与章节扫描。
- `[data-demo]` + `data-demo-id`：演示懒初始化与编号。
- `.code-block` / `.code-copy` / `pre code`：代码复制与高亮。
- `#search-dialog` / `#search-input` / `#search-results`：全文搜索。
- `[data-download-guide]`、`#reading-progress`：下载与阅读进度。
- `BaseLayout` 顶栏、首页专题区、`public/.llms.txt`：站点入口。

验证尽量发生在最高接缝：构建后的 `/posts/dart/index.html` 与真实浏览器交互，而不是内部函数。

## 3. 用户故事

### US-01 打开与基本阅读

作为读者，我可以直接打开 `/posts/dart/`，在无构建错误、无控制台报错的情况下阅读全部内容。

验收：

- 构建后存在 `dist/dart/index.html`，路由 `/posts/dart/` 可访问。
- `<html lang="zh-CN">`、`<title>`、description、canonical、OG、JSON-LD 正确。
- 关闭 JavaScript 后，正文、标题、目录锚点仍可阅读和跳转。
- 首屏不发起任何外部网络请求；无外部字体、图片、脚本、样式或 iframe。
- 页面无重复 ID，所有页内锚点可解析。

### US-02 目录、进度与回到顶部

作为读者，我可以按“部分 → 章节”导航，并随时知道阅读位置。

验收：

- 桌面端左侧吸顶目录；移动端为可折叠目录，点击条目后自动收起。
- 滚动时当前章节高亮；顶部阅读进度条随滚动更新。
- 底部提供“回到顶部”入口。
- 目录链接全部使用真实 `href="#id"`，无 JS 也可跳转。

### US-03 全文搜索

作为读者，我可以用键盘或按钮搜索整页内容并跳转到命中章节。

验收：

- `Ctrl/Cmd + K`、`/` 或点击搜索按钮打开原生 `<dialog>`。
- 搜索索引首次打开时才构建，覆盖所有 `[data-chapter]` 的标题、所属部分与正文文本。
- 支持 ↑/↓ 选择、Enter 跳转、Esc 关闭；无结果时给出明确提示。
- 命中关键词用 `<mark>` 高亮；结果通过 DOM 节点构造，不注入未转义 HTML。
- 关闭后焦点回到触发元素。

### US-04 章节结构与迁移叙事

作为有 C++/Python 背景的读者，我能在每章获得一致的信息结构，并立刻看到与已有知识的映射。

验收每章至少包含：

- 一句话结论（`.lead`）。
- 核心概念与必要原理。
- 至少一个完整、可运行的 Dart 示例（标注版本敏感语法）。
- 一张“如果你来自 C++/Python”迁移卡（`.migration`）。
- 一个“底层原理”侧栏（`.principle`），覆盖该章相关的类型/内存/并发/编译机制。
- 1–3 条常见坑。
- 需要时给出延伸阅读链接。

迁移卡只解释心智模型差异；完整语法/API 对照集中在附录映射表，避免正文重复。

### US-05 本地可视化演示

作为读者，我可以操作 6 个概念演示，理解 Dart 的行为而不是只看静态代码。

验收：

- 固定 6 个演示：
  - D01 类型推断与 `final`/`const`（1.2）。
  - D02 空安全流分析（2.2）。
  - D03 集合管道：collection if/for、spread、`map`/`where`（4.1）。
  - D04 模式匹配与 sealed 穷尽（4.3）。
  - D05 事件循环、微任务与事件队列（5.1）。
  - D06 Isolate 消息传递（6.1）。
- 演示只在进入视口后初始化（IntersectionObserver），页面初始不运行计时器或动画。
- 每个演示提供可重置的确定性操作，不依赖随机数或网络。
- 演示不执行真实 Dart 代码，不下载运行时；界面上明确标注“本地模拟，未执行 Dart”。
- 输出变化通过节流的 `aria-live="polite"` 播报；离开视口时暂停动画；尊重 `prefers-reduced-motion`。
- 不支持的浏览器/环境给出可读降级说明，不抛未捕获异常。

### US-06 代码阅读、复制与 DartPad

作为读者，我可以阅读带语言标识和语法着色的 Dart 代码，并一键复制或到 DartPad 运行。

验收：

- 每个代码块有语言标签、标题、复制按钮与复制成功/失败反馈。
- 内置轻量 Dart 高亮器（注释、字符串、关键字、数字、类型/函数名）；高亮失败时回退纯文本，不破坏内容。
- 可在 DartPad 运行的 Dart 代码块头提供“DartPad”外链，打开 `https://dartpad.dev/` 新标签页；不生成 gist、不内嵌编辑器，界面说明“复制代码后粘贴运行”。需要 Flutter、FFI 或本地进程的代码块不提供 DartPad 外链，并用环境徽标标注。
- 复制优先 `navigator.clipboard`，失败时用隐藏 textarea 降级。
- 代码块可横向滚动，不撑破移动端布局。

### US-07 下载与离线

作为读者，我可以下载整份指南，离线打开，核心内容与演示不依赖网络。

验收：

- 页头与页脚提供“下载本页 HTML”，保存为 `dart-migration-guide.html`。
- 页面内无外部资源引用；断网后通过 `file://` 打开，正文、目录、搜索、演示、复制均可使用。
- DartPad 与延伸阅读属于可选外部链接，离线不可用时不影响阅读，界面不作“必须联网”的暗示。
- 本地文件模式下点击下载链接时给出“使用浏览器另存为”的提示。

### US-08 主题、视觉与动效

作为读者，页面自动适配系统亮/暗模式，并保持与 HTML5 专题页的家族感。

验收：

- 使用 `color-scheme: light dark` 与 `prefers-color-scheme`；不提供手动主题切换。
- 沿用 HTML5 大全的排版、组件、圆角、边框与动效骨架；主色为 Dart 蓝（亮色 `#0175C2` 一类，暗色使用更亮的蓝），辅色为青/蓝绿，不使用 HTML5 页的靛紫渐变。
- 文本/背景对比度达到 WCAG AA；状态不只依赖颜色。
- `prefers-reduced-motion: reduce` 下关闭非必要动画；打印样式隐藏导航与演示控件。

### US-09 可访问性

作为使用键盘或屏幕阅读器的读者，我可以完整使用目录、搜索、演示与代码复制。

验收：

- 提供 skip link；焦点可见；焦点顺序合理；原生 dialog 管理焦点。
- 所有按钮/输入有可访问名称；表单控件有 label；动态输出使用 `aria-live`。
- 标题层级连续；landmark 结构清晰；无重复 ID。
- 演示的视觉信息有文本等价物，不只靠 Canvas/颜色传达。

### US-10 移动端

作为手机读者，段落、代码和演示都能舒适阅读。

验收：

- 375px 宽度下无页面级横向溢出；代码块内部可横向滚动。
- 目录可折叠；点击目录项后自动收起。
- 交互控件触控目标不小于 44×44px（视觉尺寸可更小但点击区域足够）。
- 演示画布/网格自适应容器宽度，不依赖固定像素宽度。

### US-11 博客入口

作为博客访客，我能从顶栏或首页发现并进入 Dart 指南。

验收：

- `BaseLayout` 顶栏新增“Dart”，指向 `/posts/dart/`（带 base 前缀），位于“HTML5”之后。
- 首页专题区扩展为双卡（HTML5 / Dart），Dart 卡包含标题、简介、演示数量与 CTA；视觉层级与现有卡片一致。
- 页面顶栏提供“← 博客”，页脚提供首页、feed、llms.txt 与本页下载。
- 既有首页、HTML5 专题页、文章页与 feed.json 功能不受影响。

### US-12 Agent 可读性

作为 AI Agent，我能理解页面结构、主题与机器可读入口。

验收：

- 页面有合法 JSON-LD（`TechArticle`），headline/description/datePublished/dateModified/author/isPartOf/mainEntityOfPage 正确。
- 语义结构清晰：`header`/`main`/`aside`/`section`/`footer`，章节标题层级连续。
- `public/.llms.txt` 在“专题”下新增 Dart 条目，包含 URL、标题、Dart 3 基线、覆盖范围与“单文件”说明。
- 页面提供指向 `feed.json`、`llms.txt` 与官方文档的链接。
- 核心信息以文本承载，不依赖 Canvas/图片。

### US-13 内容准确性与版本基线

作为读者，我可以相信示例能跑、版本标注可信、C++/Python 对照没有明显误导。

验收：

- 正文以 Dart 3.13 稳定版为基线；版本敏感特性标注引入版本：
  - records / patterns / class modifiers / switch expressions / if-case：Dart 3.0。
  - extension types：Dart 3.3。
  - dot shorthands：Dart 3.10。
  - primary constructors：Dart 3.13。
- 所有承诺“可运行”的完整示例（含 `main()`）在本地 Dart 3.13.5 下通过 `dart analyze` 与 `dart run`；纯片段标注“片段”，不承诺独立运行。
- 需要 Flutter SDK 的 Widget 示例、需要本地 C 库的 FFI 示例、需要网络/平台能力的内容显式标注“未在本页执行/需相应环境”。
- 示例使用 `dart format` 风格（2 空格缩进），不使用 Dart 2 时代的多余 `new`，不把 `dynamic` 当作默认选择。
- C++/Python 对照说明运行时前提（如 CPython/PyPy、C++ 标准与 ABI），避免绝对化表述。

### US-14 构建与回归

作为维护者，我可以安全地发布页面而不破坏博客。

验收：

- `pnpm build` 成功，新增 `/posts/dart/index.html`；原有页面与路由数量不变。
- 不修改 `package.json`，不新增 npm 依赖，不改动 Astro 配置与构建流程。
- 静态审计通过：无外部资源引用、无 iframe、无重复 ID、锚点可解析、演示数量为 6、文件体积在预算内（≤ 250 KB）。
- 既有 `/posts/`、`/posts/html5/`、文章页、`feed.json`、`source/` 页面回归正常。

## 4. 已定决策

| 决策 | 选择 | 理由/约束 |
| --- | --- | --- |
| 交付形态 | 独立单文件 HTML | 超长内容 + 自定目录/搜索 + 可下载离线；与 HTML5 专题页一致 |
| 页面位置 | `src/pages/dart/index.html` | Astro 原样输出到 `dist/dart/`，URL 为 `/posts/dart/` |
| 标题 | 《Dart 迁移指南：从 C++/Python 到 Dart》 | 明确“迁移”定位，避免变成泛 Dart 教程 |
| 视觉 | 复用 HTML5 骨架，Dart 蓝 + 青/蓝绿辅色 | 家族感一致，又能区分两个专题 |
| 内容体量 | 导言 + 8 个主题部分 + 附录 | 覆盖语言、并发、工具链与生态，可作长期参考 |
| 对照组织 | 章节内迁移卡 + 附录映射表 | 阅读时即时映射，查阅时集中速查 |
| 深度 | 实践主线 + 原理侧栏 | 满足 C++/Python 读者对类型、内存、并发的疑问，不写成编译器教材 |
| 演示 | 6 个本地可视化模拟 + DartPad 外链 | 零外部依赖、离线可用；不内嵌真实运行时 |
| DartPad 链接 | 指向空白 `dartpad.dev`，复制粘贴运行 | 不创建外部 gist、不依赖第三方存储，避免死链与隐私问题 |
| Flutter 边界 | 概览 + 最小 Widget 示例 | 保留真实用途画面，明确不承担 Flutter 教学 |
| 内容基线 | Dart 3.13 稳定特性 | 本机 3.13.5 可验证；新语法按版本标注 |
| 博客接入 | 顶栏 + 首页双卡 + llms.txt | 保证可发现性，不污染文章流 |
| 内容集合 | 不进入 `src/content/blog` | 独立文档形态；不进入 feed 与源码查看 |
| 依赖 | 零新增 npm 依赖、零外部资源 | 单文件、可离线、构建稳定 |
| 语言 | 中文正文，英文标识符/API 名 | 与现有博客一致 |

## 5. 信息架构

页面共 9 个部分（导言 + 8 个主题）+ 附录。每个部分有导语；每章有编号、锚点与 `[data-chapter]`。

### Part 0 · 导言

- 0.1 为什么用已有经验学 Dart（`why-dart`）：Dart 的定位、适用场景、与 C++/Python 的关系。
- 0.2 一页心智模型（`mental-model`）：编译/运行、类型、内存、并发、包管理五组映射。
- 0.3 如何使用本页（`how-to-use`）：版本标签、迁移卡、原理侧栏、演示约定、DartPad 与下载。

### Part 1 · 语言基础与类型系统

- 1.1 入口与项目结构（`entry-structure`）：`main`、顶层声明、`import`/`export`/`part`、库。
- 1.2 变量、推断与 `final`/`const`（`variables-types`）：`var`/`final`/`const`、`dynamic`/`Object`、C++ `auto` 与 Python 动态类型对照。**D01**。
- 1.3 内建类型（`builtin-types`）：`int`/`double`/`num`/`String`/`bool`/`List`/`Set`/`Map`；`int` 在原生 64 位、Web 53 位安全整数；String 为 UTF-16 序列。
- 1.4 Records（`records`）：位置/命名字段、值语义、解构；对照 `std::tuple` 与 Python `tuple`/`namedtuple`。
- 1.5 函数（`functions`）：位置/命名/可选参数、`required`、默认值、一等函数、闭包、箭头函数；没有重载。
- 1.6 类型系统（`type-system`）：健全类型、泛型具体化、协变、`typedef`、`dynamic` vs `Object?`；对照 C++ 模板与 Python typing。

### Part 2 · 空安全

- 2.1 可空与非空（`null-safety-basics`）：`String` vs `String?`，默认非空；对照 C++ 指针/`std::optional` 与 Python `None`。
- 2.2 操作符与流分析（`null-operators`）：`?.`、`??`、`??=`、`!`、类型提升、私有 final 字段提升。**D02**。
- 2.3 `late` 与延迟初始化（`late`）：适用场景、运行时错误、与 C++ 未初始化变量/Python `None` 的区别。
- 2.4 集合与空安全（`collections-null`）：`List<String?>` vs `List<String>?`、空安全 API 设计。
- 2.5 迁移旧代码（`migration-null`）：sound null safety、迁移工具、常见报错与修法。
- 原理侧栏：健全性（soundness）与运行时检查；与“可选类型 + 运行时 None”对照。

### Part 3 · OOP 与代码复用

- 3.1 类与构造器（`classes-constructors`）：默认/命名/factory/const 构造器、初始化列表、`super` 参数、primary constructors（3.13）。
- 3.2 继承、抽象类与隐式接口（`inheritance-interfaces`）：`extends`/`implements`/`abstract`；没有 `interface` 关键字。
- 3.3 Mixin（`mixins`）：`mixin`/`with`/`on`、线性化、方法解析；对照 C++ 多继承与 Python MRO。
- 3.4 Extension（`extensions`）：扩展方法/属性/运算符、静态分派、命名冲突；对照自由函数与 monkey patch。
- 3.5 Class modifiers（`class-modifiers`）：`sealed`/`base`/`final`/`interface`/`mixin` 的 API 边界用途。
- 3.6 相等性与运算符（`equality`）：`==`/`hashCode` 契约、没有默认结构相等；对照 `operator==` 与 `__eq__`。
- 原理侧栏：对象引用语义、GC、`final` 字段与不可变对象的关系。

### Part 4 · 集合与模式匹配

- 4.1 集合与集合管道（`collections`）：字面量、spread、collection if/for、`map`/`where`/`fold`、惰性 `Iterable` vs 急切 `List`。**D03**。
- 4.2 高阶函数与推导式对照（`higher-order`）：C++ ranges、Python 推导式与 Dart 集合管道的取舍。
- 4.3 模式匹配（`patterns`）：`switch` 语句/表达式、`if-case`、解构 records/list/map/object、guard、逻辑模式。**D04**。
- 4.4 sealed 与穷尽性（`sealed-exhaustive`）：状态建模、编译器穷尽检查；对照 `std::variant` + `visit` 与 Python `match`。
- 4.5 集合常见坑（`collection-pitfalls`）：`==` 是引用相等、`const` 集合不可变、`Iterable` 惰性、Map 顺序。
- 原理侧栏：`const` 规范化、集合的引用语义与性能直觉。

### Part 5 · 异步

- 5.1 事件循环（`event-loop`）：event queue、microtask queue、同步/异步边界；Dart 单线程事件循环 + Isolate。**D05**。
- 5.2 Future 与 async/await（`futures`）：`Future.value/error`、`then/catchError/whenComplete`、`await` 暂停/恢复、错误传播。
- 5.3 组合与超时（`future-combinators`）：`Future.wait`、`Future.any`、`Future.delayed`、`.timeout`、`eagerError`。
- 5.4 Stream（`streams`）：单订阅 vs 广播、`listen`/`await for`、`StreamController`、`async*`/`yield`、`transform`。
- 5.5 与 C++/Python 异步对照（`async-compare`）：`std::future`/线程、`asyncio`/`Task`、GIL；强调 async 不是多线程。
- 原理侧栏：Zone、未捕获异步错误、微任务顺序。

### Part 6 · Isolate 并发

- 6.1 Isolate 模型（`isolate-model`）：独立堆与事件循环、无共享内存、消息传递；对照 C++ 线程共享内存与 Python GIL/multiprocessing。**D06**。
- 6.2 `Isolate.run` 与长驻 worker（`isolate-run`）：一次性任务、`SendPort`/`ReceivePort`、错误与生命周期。
- 6.3 消息与性能（`messages-performance`）：可发送对象、复制成本、`TransferableTypedData`、批量消息。
- 6.4 常见架构（`isolate-architecture`）：UI isolate + 计算 isolate、任务队列、取消与超时。
- 6.5 何时不该用 Isolate（`when-not-isolate`）：I/O 密集用 async 即可；小消息高频通信的成本。
- 原理侧栏：isolate group、平台线程映射、GC 与内存隔离。

### Part 7 · 工具链、测试与编译产物

- 7.1 SDK 与项目（`sdk-project`）：`dart create`、`pubspec.yaml`、package layout、`pub get/add`、lockfile。
- 7.2 静态工具（`analyze-format`）：`dart analyze`、`dart format`、`dart fix`、`analysis_options.yaml`、lints；对照 clang-tidy/ruff/mypy。
- 7.3 测试（`testing`）：`package:test`、`test`/`expect`/`group`、异步测试、mock、覆盖率；对照 GoogleTest/pytest。
- 7.4 编译与运行（`compilation`）：`dart run`、JIT、AOT（`dart compile exe`）、dart2js、WasmGC、tree shaking；对照 C++ 编译与 Python 解释。
- 7.5 DevTools 与调试（`devtools`）：断点、堆快照、CPU profile；对照 gdb/perf/py-spy。
- 原理侧栏：kernel/AOT snapshot、热重载原理（Flutter）。

### Part 8 · 生态与边界

- 8.1 pub.dev 与包管理（`pub-dev`）：语义化版本、caret 约束、平台约束、包成熟度判断。
- 8.2 Flutter（`flutter`）：Dart 的主要下游、最小 `StatelessWidget` 示例、响应式/状态管理一句带过；明确“不教 Flutter”。
- 8.3 服务端与 CLI（`server-cli`）：`dart:io`、shelf/dart_frog 简介、编译单文件可执行。
- 8.4 与 C++/Python 互操作（`interop`）：`dart:ffi`（C ABI）、`Process`、JSON/stdio；适用边界。
- 8.5 继续学习路径（`learning-path`）：Flutter / 服务端 / 工具链三条路线与官方资源。
- 原理侧栏：VM / JS / Wasm 三种运行时形态与取舍。

### 附录

- A. C++/Python/Dart 映射表（`mapping-table`）：入口、变量、空值、字符串、集合、函数、类、继承、mixin、泛型、异常、异步、线程、包管理、构建、测试、格式化。
- B. 常见坑清单（`pitfalls`）：集合相等、`const`、`late`、`!`、async 不是线程、单订阅 Stream、Web `int` 精度、UTF-16 长度、扩展静态分派等。
- C. 术语表（`glossary`）。
- D. 延伸阅读（`further-reading`）：dart.dev、api.dart.dev、pub.dev、language evolution、Flutter 文档。
- E. 版本记录（`changelog`）：v1.0 · 2026-10-30。
- F. 下载与离线（`download-info`）。

## 6. 演示清单

| ID | 位置 | 演示内容 | 交互方式 | 数据/实现 |
| --- | --- | --- | --- | --- |
| D01 | 1.2 | 类型推断与 `final`/`const` | 选择字面量/表达式，查看推断类型、可变性与 `const` 合法性 | 本地规则表 + DOM |
| D02 | 2.2 | 空安全流分析 | 选择可空变量与操作序列，逐步显示类型提升/未提升 | 本地状态机 + 文本 |
| D03 | 4.1 | 集合管道 | 勾选 collection if/for、spread、`map`/`where`，查看每步输出 | 本地数组 + 文本 |
| D04 | 4.3 | 模式匹配与 sealed 穷尽 | 选择输入变体，展示命中的分支与绑定变量；切换 sealed 子类看穷尽提示 | 本地数据 + 流程图 |
| D05 | 5.1 | 事件循环与微任务 | 添加事件/微任务，单步/运行/重置，展示队列顺序 | 本地队列 + Canvas/DOM |
| D06 | 6.1 | Isolate 消息传递 | 向 worker isolate 发消息，观察复制、队列与回传 | 本地双队列动画 |

所有演示统一使用 `[data-demo]`、`data-demo-id`、`.demo-head/.demo-body/.demo-output` 结构；D05/D06 可用 Canvas 或 DOM 动画，但必须提供文本状态。

## 7. 内容生产规则

- 每个完整示例以 `void main()` 或可测试函数为入口，能独立复制到 DartPad 运行。
- 代码注释使用中文；标识符、API 名保持英文；输出用 `// =>` 或单独输出块表示。
- 版本敏感语法在代码块标题或徽标中标注（如“Dart 3.13+”），并在正文说明旧写法。
- 迁移卡统一格式：左列“你可能熟悉的写法/心智模型”，右列“Dart 的做法与原因”，下方一句“最容易踩的坑”。
- 原理侧栏只讲与本章行为直接相关的机制（如空安全健全性、GC、事件循环、isolate 内存隔离、AOT/JIT），不展开编译器实现细节。
- 不把 Flutter、FFI、服务端写成教程；它们只作为“Dart 能去哪里”的边界说明。
- 官方文档链接只放在延伸阅读与必要术语处，正文不堆链接。

## 8. 测试决策

### 8.1 构建与静态审计

- `pnpm build` 成功；检查 `dist/dart/index.html` 存在且可访问。
- 静态扫描页面：无 `<script src>`、`<link rel="stylesheet" href="http`、`@import`、`url(http`、外部字体、`<iframe>`；外部 `<a>` 链接允许。
- 扫描重复 `id`；校验目录、正文锚点与 `href="#..."` 全部可解析。
- 校验 `[data-demo]` 数量为 6、`data-demo-id` 唯一；演示文件不含网络请求。

### 8.2 内容验证

- 将所有完整示例抽取到临时 Dart 项目，在 Dart 3.13.5 下执行 `dart analyze`；含输出的示例执行 `dart run` 并核对结果。
- Flutter Widget 示例标注“需 Flutter SDK，未在本页执行”；FFI 示例标注“需本地 C 库”。
- 版本标注核对：3.0 / 3.3 / 3.10 / 3.13 特性与正文一致。
- C++/Python 对照抽查：确认没有把 CPython 特性当成 Python 规范、没有把某编译器扩展当成 C++ 标准。

### 8.3 浏览器验收

- 使用 `pnpm dev` 或 `pnpm preview`，在 Chrome 中打开 `/posts/dart/`。
- 检查控制台无报错、无外部资源请求；首屏无演示动画启动。
- 逐项操作：目录跳转与高亮、阅读进度、Ctrl/Cmd+K 搜索、代码复制、下载、6 个演示的重置/单步/输出、暗色模式、375px 宽度。
- 键盘走查：skip link、目录、搜索 dialog、演示控件、代码复制；焦点可见。
- 无障碍：标题层级、landmark、可访问名称、`aria-live`、对比度（Lighthouse Accessibility ≥ 95）。
- 回归：首页、HTML5 专题、文章页、feed.json、source 页正常。

### 8.4 离线验收

- 保存 `dart-migration-guide.html` 后断开网络，用浏览器打开：正文、目录、搜索、6 个演示、复制可用。
- 确认外部链接（DartPad、官方文档）只是链接，不阻塞离线阅读。

## 9. 明确不做

- 不做 Flutter 教程；只保留生态章概览与最小 Widget 示例。
- 不在页面内执行真实 Dart，不内嵌 DartPad/iframe，不接编译服务或后端。
- 不做账号、进度同步、评论、收藏。
- 不做自动判分练习；可以有“动手试试”提示，但不做练习系统。
- 不写完整 Dart API 参考或语言规范译本。
- 不做英文版或 i18n。
- 不做 C++/Python → Dart 自动转换工具。
- 不进入内容集合、`feed.json`、文章源码查看页。
- 不新增 npm 依赖，不改 Astro 配置与构建流程。
- 不提供手动主题切换；跟随系统。
- 不把现有 HTML5 专题页迁移到 Dart 蓝主题。

## 10. 补充说明与风险

- Dart 版本演进较快：正文以 3.13 为基线并标注引入版本；未来升级时优先更新版本徽标与“版本记录”，不改整体架构。
- DartPad 外链打开空白编辑器，代码需手动粘贴；界面上明确说明，避免读者误以为会预加载示例。
- 单文件页面体积预算 250 KB；通过演示懒初始化、无图片/字体依赖控制体积。
- C++/Python 对照是概念映射，不是等价性证明；需要说明运行时/标准差异的地方必须说明。
- Flutter/FFI 示例无法在纯 Dart 环境验证，必须显式标注环境要求。
- 页面是教程不是规范：遇到语言细节争议，以 Dart 官方文档与本地 3.13.5 行为为准。

## 11. 交付顺序

1. 搭建页面骨架：CSS 变量与 Dart 蓝主题、header、hero、目录、搜索、进度、代码复制、下载。
2. 完成 Part 0–2 内容与 D01/D02。
3. 完成 Part 3–5 内容与 D03/D04/D05。
4. 完成 Part 6–8、附录与 D06。
5. 接入顶栏、首页双卡、llms.txt；补 JSON-LD 与元信息。
6. 内容验证、静态审计、浏览器/离线/回归验收，更新版本记录。

## 12. 验证记录

- 构建：`pnpm build` 成功，生成 `dist/dart/index.html`，`/posts/dart/`、首页、HTML5 页、文章页、`feed.json`、`source/` 与 `.llms.txt` 均返回 200。
- Dart 示例：36 个 Dart 代码块中，32 个非环境受限示例在 Dart 3.13.5 下通过 `dart analyze`，并执行核对输出；Flutter、FFI、服务端监听、本地进程示例按环境要求标注。
- 静态审计：无重复 ID，63 个目录/正文锚点全部可解析，6 个 `[data-demo]`，无外部资源请求，文件 244.6 KB（预算 250 KB）。
- 浏览器/交互：6 个演示均按 IntersectionObserver 懒初始化并通过交互检查；搜索、目录高亮、阅读进度、复制（含降级）、390px 移动端布局、桌面双主题、`file://` 离线阅读均通过；无控制台异常。
- 无障碍：单 H1、标题层级无跳级、无未命名按钮/控件/链接、45 个原理侧栏使用 `role="note"` 不污染 landmark、表格 `th` 均有 `scope="col"`、skip link 与搜索焦点恢复可用。
- Lighthouse（移动模拟）：Performance 96、Accessibility 100、Best Practices 100、SEO 100。
