# 《Rust 迁移指南：从 C++/Python 到 Rust》规格说明

- 状态：Implemented（v1.0，2026-10-31）
- 日期：2026-10-31
- 目标产物：`src/pages/rust/index.html`
- 对外地址：`https://n0v5.github.io/posts/rust/`
- 版本基线：Rust 1.99.1 stable（2026-10-15）、Edition 2024；本机验证工具链 Rust 1.96.1
- 关联文档：`CONTEXT.md`、`docs/adr/0003-dart-guide-single-file.md`、`docs/adr/0004-dart-demos-local-only.md`、`docs/adr/0005-rust-guide-single-file.md`、`docs/adr/0006-rust-demos-local-only.md`

## 1. 问题陈述

博客已有数学/物理文章、HTML5 大全与 Dart 迁移指南，但缺少一份面向 C++/Python 开发者的 Rust 指南。

Rust 的学习难点不在语法，而在所有权、借用、生命周期、trait 分派、`Send/Sync`、`Future`/`Pin` 与 unsafe 边界。通用的 Rust 教程往往从零讲起，无法利用读者已有的工程经验；而只讲语法的速查表又无法解释 borrow checker 为什么报错、何时该用 `clone`/`Rc<RefCell<_>>`、async 为什么需要运行时。

本项目的目标不是再写一本 Rust 参考书，而是交付一个独立专题页：用 C++/Python 的心智模型做映射，把 Rust 真正不同的地方讲透，并给出可编译、可验证的示例、迁移卡、原理侧栏和本地可视化演示。页面需要超长目录、全文搜索、代码复制、Rust Playground 外链与离线下载，现有 Astro 文章布局无法承载，因此采用与 HTML5/Dart 专题页一致的单文件 Standalone 形态。

## 2. 方案概述

在 `src/pages/rust/index.html` 交付一个单文件自包含页面：

- 内联全部 CSS/JS，零外部资源请求；可下载后用浏览器离线打开。
- 沿用 HTML5/Dart 专题页的页面骨架（吸顶目录、全文搜索、阅读进度、代码复制、跟随系统亮暗），主色替换为 Rust 橙。
- 信息架构为“导言 + 10 个主题部分 + 附录”，每章包含：一句话结论、概念讲解、完整示例、迁移卡、原理侧栏、常见坑。
- 7 个本地可视化演示，只用 JS 模拟概念，不执行真实 Rust；可在 Playground 运行的 std-only 代码块提供 `play.rust-lang.org` 外链。
- 以 Rust 1.99.1 / Edition 2024 为页面基线；所有可运行示例只使用本机 1.96.1 已稳定的特性，并逐条通过 `cargo check` / `cargo test`。
- 通过顶栏“Rust”、首页第三张专题卡、`public/.llms.txt` 接入；不进入内容集合、`feed.json` 或文章源码查看页。

### 2.1 复用的接缝

优先复用 HTML5/Dart 专题页已有的 DOM 契约，不新造一套：

- `#guide-toc` + `[data-chapter]`：目录高亮与章节扫描。
- `[data-demo]` + `data-demo-id`：演示懒初始化与编号。
- `.code-block` / `.code-copy` / `pre code`：代码复制与高亮。
- `#search-dialog` / `#search-input` / `#search-results`：全文搜索。
- `[data-download-guide]`、`#reading-progress`：下载与阅读进度。
- `BaseLayout` 顶栏、首页专题区、`public/.llms.txt`：站点入口。

验证尽量发生在最高接缝：构建后的 `/posts/rust/index.html`、真实浏览器交互，以及本地 Cargo 验证工作区。

## 3. 用户故事

### US-01 打开与基本阅读

作为读者，我可以直接打开 `/posts/rust/`，在无构建错误、无控制台报错的情况下阅读全部内容。

验收：

- 构建后存在 `dist/rust/index.html`，路由 `/posts/rust/` 可访问。
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
- 支持 ↑/↓ 选择、Enter 跳转、Esc 关闭；无结果时给出明确提示，按 Enter 不误关闭。
- 命中关键词用 `<mark>` 高亮；结果通过 DOM 节点构造，不注入未转义 HTML。
- 关闭后焦点回到触发元素。

### US-04 章节结构与迁移叙事

作为有 C++/Python 背景的读者，我能在每章获得一致的信息结构，并立刻看到与已有知识的映射。

验收每章至少包含：

- 一句话结论（`.lead`）。
- 核心概念与必要原理。
- 至少一个完整、可编译的 Rust 示例（标注 Edition/特性版本）。
- 一张“如果你来自 C++/Python”迁移卡（`.migration`）。
- 一个“底层原理”侧栏（`.principle`），覆盖该章相关的所有权/类型/并发/编译机制。
- 1–3 条常见坑。
- 需要时给出延伸阅读链接。

迁移卡只解释心智模型差异；完整语法/API 对照集中在附录映射表，避免正文重复。

### US-05 七个本地可视化演示

作为读者，我可以操作 7 个概念演示，理解 Rust 的行为而不是只看静态代码。

验收：

- 固定 7 个演示：
  - D01 所有权与借用时间线（Part 3）。
  - D02 生命周期区间（Part 4）。
  - D03 泛型单态化 vs `dyn Trait`（Part 5）。
  - D04 迭代器管道（Part 6）。
  - D05 `?` 错误传播（Part 6）。
  - D06 线程、锁与通道（Part 7）。
  - D07 Future 状态机与 `poll`/`Waker`（Part 8）。
- 演示只在进入视口后初始化（IntersectionObserver），页面初始不运行计时器或动画。
- 每个演示提供可重置的确定性操作，不依赖随机数或网络。
- 演示不执行真实 Rust 代码，不下载编译器或运行时；界面上明确标注“本地模拟，未执行 Rust”。
- 输出变化通过节流的 `aria-live="polite"` 播报；离开视口时暂停动画；尊重 `prefers-reduced-motion`。
- 不支持的浏览器/环境给出可读降级说明，不抛未捕获异常。

### US-06 代码阅读、复制与 Playground

作为读者，我可以阅读带语言标识和语法着色的 Rust 代码，并一键复制或到 Playground 运行。

验收：

- 每个代码块有语言标签、标题、复制按钮与复制成功/失败反馈。
- 内置轻量 Rust 高亮器（注释、字符串、关键字、数字、类型/函数名）；高亮失败时回退纯文本。
- 可在 Playground 运行的 std-only Rust 代码块头提供“Playground”外链，打开 `https://play.rust-lang.org/` 新标签页；不生成 gist、不内嵌编辑器，界面说明“复制代码后粘贴运行”。
- 需要 Tokio、外部 crate、FFI、PyO3、Flutter 类环境的代码块不提供 Playground 外链，并用环境徽标标注。
- 复制优先 `navigator.clipboard`，失败时用隐藏 textarea 降级。
- 代码块可横向滚动，不撑破移动端布局。

### US-07 下载与离线

作为读者，我可以下载整份指南，离线打开，核心内容与演示不依赖网络。

验收：

- 页头与页脚提供“下载本页 HTML”，保存为 `rust-migration-guide.html`。
- 页面内无外部资源引用；断网后通过 `file://` 打开，正文、目录、搜索、演示、复制均可使用。
- Playground 与官方文档属于可选外部链接，离线不可用时不影响阅读。
- 本地文件模式下点击下载链接时给出“使用浏览器另存为”的提示。

### US-08 主题、视觉与动效

作为读者，页面自动适配系统亮/暗模式，并保持与 HTML5/Dart 专题页的家族感。

验收：

- 使用 `color-scheme: light dark` 与 `prefers-color-scheme`；不提供手动主题切换。
- 沿用 HTML5/Dart 的排版、组件、圆角、边框与动效骨架；主色为 Rust 橙（亮色 `#CE422B` 一类，暗色使用更亮的橙），辅色为琥珀与石墨灰。
- 文本/背景对比度达到 WCAG AA；状态不只依赖颜色。
- `prefers-reduced-motion: reduce` 下关闭非必要动画；打印样式隐藏导航与演示控件。

### US-09 可访问性

作为使用键盘或屏幕阅读器的读者，我可以完整使用目录、搜索、演示与代码复制。

验收：

- 提供 skip link；焦点可见；焦点顺序合理；原生 dialog 管理焦点并恢复触发元素。
- 所有按钮/输入有可访问名称；表单控件有 label；动态输出使用 `aria-live`。
- 标题层级连续；landmark 结构清晰；无重复 ID；原理侧栏使用 `role="note"`，不产生数十个 complementary landmark。
- 演示的视觉信息有文本等价物，不只靠 Canvas/颜色传达。

### US-10 移动端

作为手机读者，段落、代码和演示都能舒适阅读。

验收：

- 375px 宽度下无页面级横向溢出；代码块内部可横向滚动。
- 目录可折叠；点击目录项后自动收起。
- 交互控件触控目标不小于 44×44px（视觉尺寸可更小但点击区域足够）。
- 演示画布/网格自适应容器宽度，不依赖固定像素宽度。

### US-11 博客入口

作为博客访客，我能从顶栏或首页发现并进入 Rust 指南。

验收：

- `BaseLayout` 顶栏新增“Rust”，指向 `/posts/rust/`（带 base 前缀），位于“Dart”之后。
- 首页专题区新增第三张卡（Rust），包含标题、简介、演示数量与 CTA；视觉层级与现有卡片一致。
- 页面顶栏提供“← 博客”，页脚提供首页、feed、llms.txt 与本页下载。
- 既有首页、HTML5、Dart 专题页、文章页与 feed.json 功能不受影响。

### US-12 Agent 可读性

作为 AI Agent，我能理解页面结构、主题与机器可读入口。

验收：

- 页面有合法 JSON-LD（`TechArticle`），headline/description/datePublished/dateModified/author/isPartOf/mainEntityOfPage 正确。
- 语义结构清晰：`header`/`main`/`aside`/`section`/`footer`，章节标题层级连续。
- `public/.llms.txt` 在“专题”下新增 Rust 条目，包含 URL、标题、Rust 1.99/Edition 2024 基线、覆盖范围与“单文件”说明。
- 页面提供指向 `feed.json`、`llms.txt` 与官方文档的链接。
- 核心信息以文本承载，不依赖 Canvas/图片。

### US-13 内容准确性与版本基线

作为读者，我可以相信示例能编译、版本标注可信、C++/Python 对照没有明显误导。

验收：

- 页面基线为 Rust 1.99.1 / Edition 2024；正文只使用本机 1.96.1 已稳定的语言特性，不依赖 1.97–1.99 新特性。
- 所有承诺“可运行”的完整示例通过 `cargo check` / `cargo test`；纯片段标注“片段”，不承诺独立运行。
- 需要 Tokio、外部 crate、FFI、PyO3、C 编译器、Miri 或特定平台的示例显式标注环境要求，不冒充本地已验证。
- 版本敏感特性标注 Edition/版本；不使用 nightly-only 特性作为正文示例。
- C++/Python 对照说明运行时前提（如 CPython/PyPy、C++ 标准与 ABI），避免绝对化表述。
- 编译器错误展示是“典型错误示意”，不声称逐字匹配某个 Rust 版本。

### US-14 Rust 安全边界

作为读者，我能清楚区分 safe Rust、unsafe Rust 与 FFI 的责任边界。

验收：

- 正文默认使用 safe Rust；`unsafe` 只出现在 unsafe/FFI 章节与必要说明中。
- 每个 `unsafe` 示例包含 `// SAFETY:` 注释，说明满足的前置条件与不变量。
- 不展示已知不健全（unsound）的模式；FFI 示例说明所有权、空指针、panic 跨边界与内存释放责任。
- 若运行 Miri，记录结果；若环境不可用，明确标注“未运行 Miri”，不声称已验证。
- FFI/PyO3 示例不把“能编译”等同于“运行时安全”。

### US-15 构建与回归

作为维护者，我可以安全地发布页面而不破坏博客。

验收：

- `pnpm build` 成功，新增 `/posts/rust/index.html`；原有页面与路由数量不变。
- 不修改 `package.json`，不新增 npm 依赖，不改动 Astro 配置与构建流程。
- 静态审计通过：无外部资源引用、无 iframe、无重复 ID、锚点可解析、演示数量为 7、章节数量符合信息架构、文件体积在预算内（≤ 450 KB）。
- 既有 `/posts/`、`/posts/html5/`、`/posts/dart/`、文章页、`feed.json`、`source/` 页面回归正常。

## 4. 已定决策

| 决策 | 选择 | 理由/约束 |
| --- | --- | --- |
| 交付形态 | 独立单文件 HTML | 超长内容 + 自定目录/搜索 + 可下载离线；与 HTML5/Dart 专题页一致 |
| 页面位置 | `src/pages/rust/index.html` | Astro 原样输出到 `dist/rust/`，URL 为 `/posts/rust/` |
| 标题 | 《Rust 迁移指南：从 C++/Python 到 Rust》 | 与 Dart 迁移指南形成系列，突出已有经验迁移 |
| 视觉 | 复用 HTML5/Dart 骨架，Rust 橙 + 琥珀 + 石墨灰 | 家族感一致，又能区分三个专题 |
| 内容体量 | 导言 + 10 个主题部分 + 附录 | 深挖所有权、生命周期、类型建模、并发、async、unsafe/FFI/宏与工程化 |
| 对照组织 | 章节内迁移卡 + 附录映射表 | 阅读时即时映射，查阅时集中速查 |
| 深度 | 实践主线 + 原理侧栏 | 满足 C++/Python 读者对所有权、生命周期、`Send/Sync`、`Pin` 的疑问 |
| 演示 | 7 个本地可视化模拟 + Playground 外链 | 零外部依赖、离线可用；不内嵌真实 Rust 编译器 |
| Playground 链接 | 指向空白 `play.rust-lang.org`，复制粘贴运行 | std-only 示例；不生成 gist、不依赖第三方存储 |
| 真实执行 | 页面内不执行 Rust | 不做 WASM rustc、不接编译服务、不嵌 iframe |
| 版本基线 | Rust 1.99.1 / Edition 2024；示例在 1.96.1 验证 | 只使用稳定特性，避免 nightly 与版本漂移 |
| 异步生态 | 以 Tokio 1.x 为主 | 生态主流；不把已停止维护的运行时作为主推荐 |
| Unsafe/FFI | 安全契约优先；示例带 `// SAFETY:` | 不展示 unsound 模式；Miri 能跑则记录，不能跑则标注 |
| 博客接入 | 顶栏 + 首页第三卡 + llms.txt | 保证可发现性，不污染文章流 |
| 内容集合 | 不进入 `src/content/blog` | 独立文档形态；不进入 feed 与源码查看 |
| 依赖 | 零新增 npm 依赖、零外部资源 | 单文件、可离线、构建稳定 |
| 体积 | ≤ 450 KB | 10 部分深挖的预算；超出时合并章节或删减重复示例 |
| 语言 | 中文正文，英文标识符/API 名 | 与现有博客一致 |

## 5. 信息架构

页面共 11 个部分（导言 + 10 个主题）+ 附录。每个部分有导语；每章有编号、锚点与 `[data-chapter]`。

### Part 0 · 导言

- 0.1 Rust 是什么、不是什么（`rust-what`）：无 GC 内存安全、零成本抽象、无稳定 ABI、编译器驱动；适用与不适用场景。
- 0.2 一页心智模型（`rust-mental-model`）：所有权、借用、生命周期、move/copy、trait、`Result`、`Send/Sync`、async 五组映射。
- 0.3 版本、Edition 与使用方式（`rust-how-to-use`）：Rust 1.99.1、Edition 2024、rustup/cargo、页面约定、Playground 与离线。

### Part 1 · 工具链与项目

- 1.1 rustup、rustc 与 cargo（`rustup-rustc-cargo`）：分工、工具链通道、组件、rust-analyzer。
- 1.2 创建项目与 Cargo.toml（`cargo-project`）：`cargo new`、依赖、features、workspace、lockfile、MSRV、edition。
- 1.3 第一个程序与日常命令（`cargo-commands`）：`run/test/fmt/clippy/doc`；读编译错误的顺序。
- 1.4 crate、package 与 module（`crates-packages-modules`）：边界、可见性、crates.io、docs.rs、Playground。
- 1.5 与 C++/Python 工程对照（`toolchain-compare`）：CMake/Conan/vcpkg、pip/venv 与 cargo 的对应关系。

### Part 2 · 语法与类型系统

- 2.1 变量、可变性与 shadowing（`variables-mutability`）：`let`/`let mut`、常量、静态量、表达式导向。
- 2.2 标量与复合类型（`scalar-compound-types`）：整数溢出、浮点、`char`、tuple、数组、类型推断、`as`。
- 2.3 String、&str 与切片（`strings-slices`）：UTF-8、索引、`chars/bytes`、`format!`、字符串所有权。
- 2.4 函数与控制流（`functions-control-flow`）：表达式、`if`/`loop`/`while`/`for`、`match`、`if let`、`while let`、`let else`。
- 2.5 模块、路径与可见性（`modules-visibility`）：`mod`、`pub`、`use`、`crate`/`super`/`self`。
- 2.6 模式匹配与解构（`patterns-match`）：范围、守卫、绑定、match ergonomics、穷尽性。

### Part 3 · 所有权与借用

- 3.1 所有权三条规则（`ownership-rules`）：单一所有者、移动、作用域结束 `drop`；与 GC 的区别。
- 3.2 Move、Copy 与 Clone（`move-copy-clone`）：Copy 类型、显式 Clone、部分移动、`mem::take/replace`。
- 3.3 借用与 NLL（`borrowing-nll`）：`&T` / `&mut T` 别名互斥、借用范围、典型冲突与修法。**D01**。
- 3.4 所有权 API 设计（`ownership-api-design`）：返回所有权、参数用 `&str`/`&[T]`、`impl AsRef`、何时可以 `clone`。
- 3.5 与 C++/Python 的对照（`ownership-compare`）：RAII/智能指针/移动语义、Python 引用与 GC。

### Part 4 · 生命周期与智能指针

- 4.1 生命周期标注与省略（`lifetimes`）：`'a`、输入/输出关系、elision、结构体中的引用。**D02**。
- 4.2 常见生命周期错误（`lifetime-errors`）：返回引用、结构体借用、闭包捕获、`'static` 的真实含义。
- 4.3 Box、Rc、Arc 与 Weak（`box-rc-arc`）：独占、共享、循环引用与弱引用。
- 4.4 内部可变性（`interior-mutability`）：`Cell`、`RefCell`、`Mutex`、`RwLock`、`Cow`；运行时检查的代价。
- 4.5 自引用与 Pin（`pin-self-reference`）：为什么需要 `Pin`、异步 Future 的自引用；优先重构数据布局。

### Part 5 · 结构体、枚举、Trait 与泛型

- 5.1 Struct 与方法（`structs-impl`）：三种 struct、`impl`、关联函数、`Self`。
- 5.2 Enum 与 Option（`enums-option`）：代数数据类型、带数据的 variant、`Option<T>`、穷尽 match。
- 5.3 Trait（`traits`）：定义、实现、默认方法、bounds、supertrait、关联类型、孤儿规则/coherence。
- 5.4 泛型与单态化（`generics`）：泛型函数/类型、`where`、const generics、GAT、`impl Trait`。**D03**。
- 5.5 常用标准 trait 与 derive（`std-traits-derive`）：Debug/Display/Clone/Copy/PartialEq/Eq/Hash/Default/From/Into/Iterator；运算符重载。
- 5.6 静态分派 vs 动态分派（`dispatch-dyn`）：`impl Trait`、`dyn Trait`、对象安全、vtable、`Box<dyn Error>`。

### Part 6 · 错误、集合、迭代器与闭包

- 6.1 Option、Result 与 `?`（`option-result`）：可恢复错误、`From` 转换、组合子、panic 的边界。**D05**。
- 6.2 自定义错误（`custom-errors`）：枚举错误、`thiserror`、`anyhow`、`Box<dyn Error>`、错误上下文。
- 6.3 集合（`collections`）：Vec/VecDeque/HashMap/BTreeMap/HashSet/BTreeSet、entry API、容量。
- 6.4 迭代器（`iterators`）：`iter/into_iter/iter_mut`、惰性适配器、`map/filter/fold/collect`、自定义 Iterator。**D04**。
- 6.5 闭包（`closures`）：捕获方式、`Fn`/`FnMut`/`FnOnce`、`move`、返回闭包、闭包与线程。

### Part 7 · 并发

- 7.1 线程（`threads`）：`thread::spawn`、`join`、move 闭包、scoped threads、panic 传播。
- 7.2 共享状态（`shared-state`）：`Arc<Mutex<T>>`、`RwLock`、锁中毒、死锁、`MutexGuard` 生命周期。
- 7.3 通道（`channels`）：mpsc、crossbeam channel、所有权转移、背压。**D06**。
- 7.4 数据并行（`data-parallelism`）：rayon、`par_iter`、工作窃取、何时不该并行。
- 7.5 Send、Sync 与线程/async 分工（`send-sync`）：编译期并发约束、CPU 密集 vs I/O 密集、`spawn_blocking`。

### Part 8 · Async Rust

- 8.1 Future 与 poll（`futures-poll`）：惰性 Future、`Context`、`Waker`、async/await 脱糖；std 不提供运行时。**D07**。
- 8.2 Tokio 运行时（`tokio-runtime`）：`#[tokio::main]`、`spawn`、`JoinHandle`、单线程/多线程运行时。
- 8.3 异步 I/O、超时与取消（`async-io`）：`select!`/`join!`、`timeout`、取消安全性。
- 8.4 Stream（`streams`）：`Stream`、`StreamExt`、背压、`while let Some`。
- 8.5 常见坑（`async-pitfalls`）：跨 `await` 持锁、Future 的 `Send`、async 中阻塞、`Pin`/自引用、async trait 限制。

### Part 9 · Unsafe、FFI 与宏

- 9.1 Unsafe Rust（`unsafe-rust`）：五种能力、安全契约、UB、Miri；`unsafe` 不是关闭检查。
- 9.2 FFI 与 C ABI（`ffi`）：`extern "C"`、`#[repr(C)]`、`no_mangle`、bindgen/cxx、PyO3；所有权与 panic 边界。
- 9.3 宏（`macros`）：`macro_rules!`、卫生性、`macro_export`、过程宏、`syn`/`quote`；何时不该用宏。
- 9.4 Edition 2024 与安全边界（`unsafe-boundaries`）：`unsafe extern`、`static mut` 限制、Miri 工作流、FFI 检查清单。

### Part 10 · 工程化、性能与生态

- 10.1 Cargo features、workspace 与发布（`cargo-features-workspace`）：features、profiles、MSRV、semver、发布 crate。
- 10.2 测试与基准（`testing-bench`）：单元/集成/文档测试、nextest、proptest、criterion、覆盖率。
- 10.3 性能与剖析（`performance`）：profiling、分配器、零成本抽象的边界、release 配置。
- 10.4 生态地图（`ecosystem-map`）：axum、clap、serde、Tokio、wasm-bindgen、Embassy、wgpu。
- 10.5 学习路径与下一步（`learning-path`）：Rustlings → Book → 小 CLI → 测试 → 并发 → async → 真实项目。

### 附录

- A. C++/Python/Rust 映射表（`mapping-table`）：变量、类型、字符串、集合、函数、OOP、泛型、错误、并发、async、内存、构建、测试、包管理。
- B. 常见坑清单（`pitfalls`）：borrow checker、`clone`、`String`/`&str`、整数溢出、`unwrap`、跨 `await` 持锁、`'static`、`Rc`/`Send`、`RefCell`、`unsafe`。
- C. 术语表（`glossary`）：ownership、borrowing、lifetime、move、Copy/Clone、trait、monomorphization、dyn、object safety、coherence、Send/Sync、Pin、Future、Waker、Miri、UB。
- D. 学习资源（`further-reading`）。
- E. 版本记录（`changelog`）：v1.0 · 2026-10-31。
- F. 下载与离线（`download-info`）。

## 6. 演示清单

| ID | 位置 | 演示内容 | 交互方式 | 数据/实现 |
| --- | --- | --- | --- | --- |
| D01 | 3.3 | 所有权与借用时间线 | 移动、共享借用、可变借用、修改/读取，实时显示合法/冲突 | 本地状态机 + 文本/时间线 |
| D02 | 4.1 | 生命周期区间 | 选择函数签名与调用，展示引用存活区间与 `'a` 约束 | 本地区间图 + 文本 |
| D03 | 5.4 | 泛型单态化 vs `dyn Trait` | 切换静态/动态分派，展示单态化与 vtable 差异 | 本地数据 + 对比卡 |
| D04 | 6.4 | 迭代器管道 | 逐步执行 `map/filter/collect`，展示惰性与消费 | 本地数组 + 文本 |
| D05 | 6.1 | `?` 错误传播 | 逐步展开 Result 链，显示提前返回与 From 转换 | 本地状态机 + 文本 |
| D06 | 7.3 | 线程、锁与通道 | 将值 move 进线程、加锁、发送消息，观察所有权转移 | 本地双队列/锁时间线 |
| D07 | 8.1 | Future 状态机 | 单步 `poll`，观察 Pending/Ready/Waker 与任务唤醒 | 本地状态机 + 队列 |

所有演示统一使用 `[data-demo]`、`data-demo-id`、`.demo-head/.demo-body/.demo-output` 结构；D01/D02/D06/D07 可用 Canvas 或 DOM 动画，但必须提供文本状态。

## 7. 内容生产规则

- 每个完整示例以 `fn main()` 或可测试函数为入口，能独立复制到 Cargo 项目/Playground 运行。
- 代码注释使用中文；标识符、API 名保持英文；输出用 `// =>` 或单独输出块表示。
- 版本敏感语法在代码块标题或徽标中标注（Edition 2024、Rust 1.xx+），并在正文说明旧写法。
- 迁移卡统一格式：C++ / Python / Rust 三列，下方一句“最容易踩的坑”；附录映射表不重复正文叙事。
- 原理侧栏只讲与本章行为直接相关的机制（所有权检查、drop glue、单态化、vtable、Send/Sync、Pin/Waker、UB），不展开编译器实现细节。
- 默认使用 safe Rust；`unsafe` 只出现在 Part 9 与必要说明中，每个示例带 `// SAFETY:` 注释。
- 异步示例以 Tokio 为主；需要外部 crate 的示例在独立 Cargo 项目中验证，并标注依赖；std-only 示例才提供 Playground 外链。
- 编译器错误展示为“典型错误示意”，不复制具体版本输出；解释错误原因与修法。
- C++/Python 对照说明前提（C++ 标准/编译器、CPython/PyPy）；不使用“Rust 完全替代 C++/Python”这类绝对化表述。
- 不使用已停止维护的运行时/库作为主推荐；不推荐 `unwrap()` 作为生产错误处理。
- 示例通过 `rustfmt` 格式化；完整示例通过 `cargo clippy`，除教学目的需要展示的警告外不保留明显 lint。
- 不引用外部图片；必要图示用内联 SVG/CSS/Canvas。
- 计划 54 个内容章节 + 6 个附录章节；实际 46 个 Rust 代码块（另含 TOML/Shell 配置块）、45 个可运行示例 + 1 个 FFI 编译示例；页面体积预算 ≤ 450 KB。

## 8. 测试决策

### 8.1 构建与静态审计

- `pnpm build` 成功；检查 `dist/rust/index.html` 存在且可访问。
- 静态扫描页面：无 `<script src>`、`<link rel="stylesheet" href="http`、`@import`、`url(http`、外部字体、`<iframe>`；外部 `<a>` 链接允许。
- 扫描重复 `id`；校验目录、正文锚点与 `href="#..."` 全部可解析。
- 校验 `[data-demo]` 数量为 7、`data-demo-id` 唯一；演示文件不含网络请求。
- 校验章节数量与 Part 0–10 + 附录的 TOC 一致。

### 8.2 Rust 内容验证

- 建立临时 Cargo workspace/多个 crate，将完整示例按章节放入 `src/bin/` 或 `tests/`；执行：
  - `cargo check --workspace`
  - `cargo test`
  - `cargo clippy --workspace -- -D warnings`（教学性警告单独说明）
  - `cargo fmt --check`
- Tokio/rayon/serde/clap/axum 等外部 crate 示例在独立 crate 中验证，固定主版本并提交 Cargo.lock。
- FFI 示例尽量用本地 C 编译器构建一个小型 C 库验证；若环境不可用，标注“未编译/未运行”。
- PyO3 示例标注需要 Python/PyO3；若环境可用则至少 `cargo check`。
- Unsafe 示例逐个附安全契约；若 nightly + Miri 可用，运行 `cargo +nightly miri test` 并记录；否则标注“未运行 Miri”。
- 编译器错误示意不承诺与某个 Rust 版本逐字一致；如引用具体错误码，需在本地验证。

### 8.3 浏览器验收

- 使用 `pnpm dev` 或 `pnpm preview`，在 Chrome 中打开 `/posts/rust/`。
- 检查控制台无报错、无外部资源请求；首屏无演示动画启动。
- 逐项操作：目录跳转与高亮、阅读进度、Ctrl/Cmd+K 搜索、代码复制、下载、7 个演示的重置/单步/输出、暗色模式、375px 宽度。
- 键盘走查：skip link、目录、搜索 dialog、演示控件、代码复制；焦点可见；Esc 关闭搜索并恢复焦点。
- 无障碍：标题层级、landmark、可访问名称、`aria-live`、对比度；Lighthouse Accessibility ≥ 95（目标 100）。
- 回归：首页、HTML5、Dart、文章页、feed.json、source 页正常。

### 8.4 离线验收

- 保存 `rust-migration-guide.html` 后断开网络，用浏览器打开：正文、目录、搜索、7 个演示、复制可用。
- 确认 Playground/官方文档只是链接，不阻塞离线阅读。

### 8.5 性能与体积

- Lighthouse（移动模拟）：Performance ≥ 95、Accessibility ≥ 95、Best Practices ≥ 95、SEO ≥ 95。
- 页面体积 ≤ 450 KB；演示懒初始化；无外部请求。

## 9. 明确不做

- 不做 Rust 语言规范译本或 Rustonomicon 替代品；不覆盖所有标准库 API。
- 不做完整的宏教程、所有 async 运行时对比、嵌入式/游戏/图形/GUI 专章；只在生态地图中点到。
- 不在页面内执行真实 Rust：不内嵌 Rust Playground/iframe、不跑 WASM rustc、不接编译服务。
- 不做账号、进度同步、评论、收藏、自动判分练习。
- 不做 C++/Python → Rust 自动转换工具。
- 不做英文版或 i18n。
- 不进入内容集合、`feed.json`、文章源码查看页。
- 不新增 npm 依赖，不改 Astro 配置与构建流程。
- 不提供手动主题切换；跟随系统。
- 不使用 nightly-only 特性作为正文示例；不声称 Miri/FFI 已验证但实际未运行。
- 不把现有 HTML5/Dart 专题页迁移到 Rust 橙主题。

## 10. 参考资料

### 官方一手资料

- The Rust Programming Language：https://doc.rust-lang.org/book/
- Rust by Example：https://doc.rust-lang.org/rust-by-example/
- The Rust Reference：https://doc.rust-lang.org/reference/
- The Rustonomicon：https://doc.rust-lang.org/nomicon/
- Asynchronous Programming in Rust：https://rust-lang.github.io/async-book/
- The Cargo Book：https://doc.rust-lang.org/cargo/
- The Edition Guide：https://doc.rust-lang.org/edition-guide/
- std API 文档：https://doc.rust-lang.org/std/
- Clippy lint 列表：https://rust-lang.github.io/rust-clippy/master/
- Rust Playground：https://play.rust-lang.org/
- crates.io：https://crates.io/
- docs.rs：https://docs.rs/
- Rust releases：https://releases.rs/
- Rust Blog：https://blog.rust-lang.org/

### 深入与社区

- Rustlings：https://github.com/rust-lang/rustlings
- A half hour to learn Rust：https://fasterthanli.me/articles/a-half-hour-to-learn-rust
- Learn Rust With Entirely Too Many Linked Lists：https://rust-unofficial.github.io/too-many-lists/
- Rust Atomics and Locks：https://marabos.nl/atomics/
- Rust Design Patterns：https://rust-unofficial.github.io/patterns/
- The Little Book of Rust Macros：https://veykril.github.io/tlborm/
- The Rust Performance Book：https://nnethercote.github.io/perf-book/
- Tokio tutorial：https://tokio.rs/tokio/tutorial

### 互操作与工程

- bindgen：https://rust-lang.github.io/rust-bindgen/
- cxx：https://cxx.rs/
- PyO3：https://pyo3.rs/
- serde：https://serde.rs/
- clap：https://docs.rs/clap/
- axum：https://github.com/tokio-rs/axum
- nextest：https://nexte.st/
- proptest：https://proptest-rs.github.io/proptest/
- criterion：https://bheisler.github.io/criterion.rs/book/
- Miri：https://github.com/rust-lang/miri
- wasm-bindgen：https://rustwasm.github.io/wasm-bindgen/
- Embassy：https://embassy.dev/

### 对照资料

- cppreference：https://en.cppreference.com/
- C++ Core Guidelines：https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines
- Rust for C++ programmers：https://github.com/nrc/r4cppp
- Python 3 文档：https://docs.python.org/3/
- asyncio 文档：https://docs.python.org/3/library/asyncio.html

## 11. 补充说明与风险

- Rust 版本演进较快：页面以 1.99.1 / Edition 2024 为基线，示例在 1.96.1 验证；未来升级时优先更新版本徽标与“版本记录”，不改变整体架构。
- Rust Playground 对第三方 crate/平台能力的支持有限：仅 std-only 示例提供外链；Tokio/FFI/PyO3 示例必须标注环境。
- 10 部分深挖会带来约 380–450 KB 的单文件体积；通过演示懒初始化、无图片/字体依赖、删减重复示例控制体积。
- borrow checker 的错误文本随版本变化：正文使用“典型错误示意”，不承诺逐字匹配。
- unsafe/FFI 示例存在真实安全风险：必须附安全契约；Miri 不可用时明确标注；不展示未经验证的 unsafe 模式。
- FFI 在 Windows 上涉及 `.dll`/MSVC、在其他平台涉及 `.so`/`.dylib`；示例需标注平台差异。
- C++/Python 对照是概念映射，不是等价性证明；涉及标准/运行时差异时必须说明。
- 首页第三张专题卡会让专题区更长；在移动端需要检查 5 个顶栏链接是否换行/溢出，必要时调整导航间距。
- 页面是教程不是规范：遇到语言细节争议，以 Rust 官方文档与本地 1.96.1 的编译器行为为准。

## 12. 交付顺序

1. 搭建页面骨架：CSS 变量与 Rust 橙主题、header、hero、目录、搜索、进度、代码复制、Playground 外链、下载。
2. 完成 Part 0–3 内容与 D01。
3. 完成 Part 4–6 内容与 D02/D03/D04/D05。
4. 完成 Part 7–8 内容与 D06/D07。
5. 完成 Part 9–10、附录与版本记录。
6. 接入顶栏、首页第三卡、llms.txt；补 JSON-LD 与元信息。
7. Rust 示例验证、静态审计、浏览器/离线/回归验收、Lighthouse 与最终清理。

## 13. 验证记录

- 构建：`pnpm build` 成功，生成 `dist/rust/index.html`；`/posts/rust/`、首页、HTML5、Dart、文章页、`feed.json`、`source/` 与 `.llms.txt` 均返回 200；Rust 页未进入 feed。
- Rust 示例：46 个页面 Rust 代码块全部通过 `cargo check`；45 个可运行示例执行通过；测试示例的 2 个测试通过；`cargo clippy` 对页面示例无警告。FFI 示例仅编译（需 C 库，未运行）；Miri/PyO3 未在本机运行，页面未声称已验证。
- 静态审计：无重复 ID；74 个目录/正文锚点可解析；60 个章节（54 个内容章节 + 6 个附录章节）；7 个演示；46 个 Rust 代码块；39 个 Playground 外链；无外部资源请求；页面 280.5 KB（预算 450 KB）。
- 浏览器/交互：7 个演示均按 IntersectionObserver 懒初始化并通过交互检查；搜索（`ownership` 命中 2 条）、目录高亮、阅读进度、复制（含降级）、390px 移动端、桌面双主题、`file://` 离线阅读均通过；无控制台异常与外部请求。
- Lighthouse（移动模拟）：Performance 96、Accessibility 100、Best Practices 100、SEO 100。
