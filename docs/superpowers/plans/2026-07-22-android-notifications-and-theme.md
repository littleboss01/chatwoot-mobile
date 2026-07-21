# Android ActionCable Notifications and Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show Android notifications from a live ActionCable connection while backgrounded and add persisted light/dark appearance switching to Settings.

**Architecture:** The ActionCable connector invokes a Notifee-based local notification utility when the app is backgrounded. Redux owns the persisted theme preference, and a typed React hook supplies Settings with semantic colors instead of a global mutable Tailwind theme.

**Tech Stack:** Expo 53, React Native 0.79, TypeScript, Redux Toolkit, redux-persist, ActionCable, Notifee.

## Global Constraints

- Android notification handling is best-effort while the app process is alive.
- Do not use Firebase, FCM, or Google configuration.
- Preserve the existing `light | dark | system` type, but only write `light` or `dark` from the new control.
- Do not run build, test, lint, dependency-install, or environment-check commands unless the user requests them.

---

### Task 1: Android ActionCable notification delivery

**Files:**
- Modify: `app.config.ts`
- Modify: `src/utils/actionCable.ts`
- Modify: `src/utils/pushUtils.ts`

**Interfaces:**
- Consumes: ActionCable `NotificationCreatedResponse` events.
- Produces: `displayAndroidNotification(notification): Promise<void>`.

- [x] Remove Firebase and FCM initialization from the Android application.
- [x] Declare Android notification permission in `app.config.ts`.
- [x] Add a Notifee notification channel and an Android permission request in `pushUtils.ts`.
- [x] Display `notification.created` events using `pushMessageTitle` when the app is not active and capture unexpected failures with Sentry.

### Task 2: Persisted settings appearance

**Files:**
- Create: `src/theme/useTheme.ts`
- Modify: `src/theme/index.ts`
- Modify: `src/store/settings/settingsSlice.ts`
- Modify: `src/screens/settings/SettingsScreen.tsx`
- Modify: `src/screens/settings/SettingsHeader.tsx`
- Modify: `src/components-next/list-components/SettingsList.tsx`
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/zh_CN.json`

**Interfaces:**
- Consumes: `selectTheme(state): Theme`.
- Produces: `setTheme(theme: Theme)` and `useTheme(): { colors; isDark; statusBarStyle }`.

- [x] Add the `setTheme` settings reducer.
- [x] Define light and dark semantic Settings colors and expose them from `useTheme`.
- [x] Add an Appearance row that toggles between light and dark and shows the selected value.
- [x] Replace Settings-surface hard-coded colors with hook-provided semantic colors.
- [x] Add English and Simplified Chinese labels for Appearance, Light, and Dark.

### Task 3: Static review and task completion

**Files:**
- Modify: `todo.txt`

- [x] Inspect the final diff for import correctness, interface consistency, and the confirmed requirements.
- [x] Mark both completed entries in `todo.txt` only after the implementation is finished.
