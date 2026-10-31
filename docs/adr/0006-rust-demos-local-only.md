# Rust 教程不在页面内执行真实 Rust 代码

本页是静态、单文件、可离线的专题页，浏览器无法直接运行 Rust。为了让页面保持零外部依赖、可离线、无编译服务与第三方代码执行风险，决定不内嵌 Rust Playground/iframe、不接编译服务、不把 Rust 编译器编译为 WASM；交互演示只用本地 JS 模拟概念（所有权/借用、生命周期、trait 分派、迭代器、`?` 传播、线程/通道、Future 状态机）。std-only 代码块提供指向 `play.rust-lang.org` 的空白外链；需要 Tokio/FFI/PyO3 的示例只给代码与环境徽标。备选方案是内嵌 Playground 或构建期把示例编译为 WASM，但前者破坏离线与零外部请求，后者会引入 Rust 工具链依赖、显著增大体积，且无法覆盖 async/FFI 等真实场景。
