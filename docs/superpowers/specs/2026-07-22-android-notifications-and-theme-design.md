# Android Background Notifications and Theme Design

## Goal

Display Chatwoot push messages as Android system notifications while the app is backgrounded or terminated, and let a signed-in user switch the Settings interface between light and dark appearances.

## Scope

- Android only for background notifications.
- Create a Notifee notification channel and display data-only FCM messages on that channel.
- Do not duplicate FCM notifications that Android has already rendered from a notification payload.
- Persist `light` or `dark` in the existing Redux settings state.
- Provide a component-only `useTheme` hook and apply it to the Settings screen and its settings-list components.
- The first theme slice covers the visible Settings surface and status bar. Other feature screens retain their existing colors until individually moved to semantic theme tokens.

## Architecture

`App.tsx` registers the background FCM handler at module load. The handler delegates parsing and Android display to a focused push utility; the utility creates the `chatwoot_messages` channel before displaying a local notification.

The settings reducer owns the persisted theme choice. `useTheme` reads it through the existing typed Redux selector and returns semantic colors and the Android status-bar mode. Components consume the hook rather than using a global mutable Tailwind configuration.

## Data Flow

1. FCM receives a data-only Chatwoot message while Android has backgrounded or terminated the app.
2. The entry-point handler ignores messages with an FCM notification payload, preventing duplicate alerts.
3. The handler parses the existing `data.payload` or legacy `data.notification` data, creates the Android channel if needed, then displays a local notification using `pushMessageTitle`.
4. A user changes Appearance in Settings; Redux persists `light` or `dark`; Settings components re-render with `useTheme` tokens.

## Failure Handling

- Invalid or absent Chatwoot payloads do not create a notification.
- Notification display failures are captured by Sentry and do not crash the background handler.
- The app retains the existing light theme if a persisted theme is not `dark`.

## Verification

The user workspace instructions prohibit running test, build, or environment-check commands unless requested. Verification is therefore limited to static review of changed imports, TypeScript interfaces, and the final diff.
