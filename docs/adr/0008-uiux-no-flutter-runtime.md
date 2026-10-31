# UI/UX 页面不运行真实 Flutter

本页是静态、单文件、可离线的专题页，浏览器无法直接运行 Flutter；Flutter Web 构建产物大且多文件，内嵌会破坏零外部依赖与离线阅读。因此决定：实时演示全部用本地 HTML/CSS/JS 模拟（布局、状态、对比度、无障碍、需求简报等），Flutter 只作为参考实现出现在代码块中，并在本机 Flutter 3.47.7 / Dart 3.13.5 下通过 `flutter analyze` 与 `flutter test` 验证。备选方案是内嵌 Flutter Web、接编译服务或把示例编译为 WASM，但都会引入外部资源、构建依赖或运行时限制，且不适合本页的通用 UI/UX 教学定位。
