# Android ActionCable Notifications and Theme Design

## Goal

Display Chatwoot ActionCable notifications as Android system notifications while the app process is backgrounded, and let a signed-in user switch the Settings interface between light and dark appearances.

## Scope

- Android only for background notifications while the process is alive.
- Create a Notifee notification channel and display `notification.created` ActionCable events on that channel.
- Request `POST_NOTIFICATIONS` on Android 13 and later.
- Do not use Firebase, FCM, `google-services.json`, or Google configuration in the Android build.
- Persist `light` or `dark` in the existing Redux settings state.
- Provide a component-only `useTheme` hook and apply it to the Settings screen and its settings-list components.
- The first theme slice covers the visible Settings surface and status bar. Other feature screens retain their existing colors until individually moved to semantic theme tokens.

## Architecture

The ActionCable connector receives server-side notification events. When the app is not active, it delegates Android display to a focused push utility; the utility creates the `chatwoot_messages` channel before displaying a local notification.

The settings reducer owns the persisted theme choice. `useTheme` reads it through the existing typed Redux selector and returns semantic colors and the Android status-bar mode. Components consume the hook rather than using a global mutable Tailwind configuration.

## Data Flow

1. ActionCable receives a Chatwoot `notification.created` event while the Android process is alive.
2. The connector updates Redux and, when the app is backgrounded, calls the local notification utility.
3. The utility creates the Android channel if needed and displays a local notification using `pushMessageTitle`.
4. A user changes Appearance in Settings; Redux persists `light` or `dark`; Settings components re-render with `useTheme` tokens.

## Failure Handling

- Active app sessions do not create a duplicate system notification.
- Notification display failures are captured by Sentry and do not crash the ActionCable event handler.
- Android may suspend the connection in Doze, after process termination, or during long background periods; delivery is therefore best-effort.
- The app retains the existing light theme if a persisted theme is not `dark`.

## Verification

The user workspace instructions prohibit running test, build, or environment-check commands unless requested. Verification is therefore limited to static review of changed imports, TypeScript interfaces, and the final diff.
