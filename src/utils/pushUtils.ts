import { AppState, PermissionsAndroid, Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Notification } from '@/types/Notification';

export const clearAllDeliveredNotifications = async () => {
  if (Platform.OS === 'ios') {
    await notifee.cancelAllNotifications();
  }
};

export const updateBadgeCount = async ({ count = 0 }) => {
  if (Platform.OS === 'ios' && count >= 0) {
    await notifee.setBadgeCount(count);
  }
};

export const requestAndroidNotificationPermission = async () => {
  const needsPermission = Platform.OS === 'android' && Number(Platform.Version) >= 33;
  if (!needsPermission) {
    return;
  }

  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  const granted = await PermissionsAndroid.check(permission);
  if (!granted) {
    await PermissionsAndroid.request(permission);
  }
};

export const displayAndroidNotification = async (notification: Notification) => {
  if (Platform.OS !== 'android' || AppState.currentState === 'active') {
    return;
  }

  const { pushMessageTitle } = notification;
  if (!pushMessageTitle) {
    return;
  }

  try {
    const channelId = await notifee.createChannel({
      id: 'chatwoot_messages',
      name: 'Chatwoot messages',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'Chatwoot',
      body: pushMessageTitle,
      android: {
        channelId,
        pressAction: { id: 'default' },
      },
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};
