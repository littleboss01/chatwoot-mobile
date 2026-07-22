# AI Context

## 当前约束

- 后台通知当前仅实现 Android，且仅在应用进程存活时尽力送达。
- 换肤首期只提供手动 `light` 与 `dark` 切换。
- 主题必须通过 React Hook 在组件内读取；TypeScript 编译为 JavaScript 不改变 Hook 的运行时行为。
- 未经主人要求，不执行 build、lint、test 或环境检查命令。
- Android GitHub Actions 构建不依赖 Google/Firebase 配置。
- Android GitHub Actions 通过 ABI Split 仅打包 `arm64-v8a` 的 Release APK。
- Android GitHub Actions 不上传 Sentry Source Map，避免缺少 Sentry 组织与凭据导致打包失败。
- Android GitHub Actions 的 Release 构建将 Gradle Daemon 堆设为 4GiB，避免依赖收集阶段内存耗尽。
- `@notifee/react-native` 9.x 没有 Expo Config Plugin；其 Android 自动链接不得在 `react-native.config.js` 中禁用。

## 已实施

- ActionCable 的 `notification.created` 事件在应用非前台时触发 Android 本地通知。
- `useTheme` 为设置页提供持久化主题颜色和状态栏样式。
