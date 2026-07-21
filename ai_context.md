# AI Context

## 当前约束

- 后台通知当前仅实现 Android。
- Android 应在后台或进程被系统回收后显示 Chatwoot 推送。
- 换肤首期只提供手动 `light` 与 `dark` 切换。
- 主题必须通过 React Hook 在组件内读取；TypeScript 编译为 JavaScript 不改变 Hook 的运行时行为。
- 未经主人要求，不执行 build、lint、test 或环境检查命令。
- Android GitHub Actions 构建依赖仓库 Secret `ANDROID_GOOGLE_SERVICES_JSON`，工作流将其还原为临时 `google-services.json`。

## 已实施

- `App.tsx` 在模块加载时注册 Android 后台 FCM 处理器。
- `useTheme` 为设置页提供持久化主题颜色和状态栏样式。
