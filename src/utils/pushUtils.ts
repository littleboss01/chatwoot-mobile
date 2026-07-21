import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { NOTIFICATION_TYPES } from '@/constants';
import { Notification } from '@/types/Notification';
import { transformNotification } from '@/utils/camelCaseKeys';

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

export const findConversationLinkFromPush = ({
  notification,
  installationUrl,
}: {
  notification: Notification;
  installationUrl: string;
}) => {
  const { notificationType } = notification;

  if (NOTIFICATION_TYPES.includes(notificationType)) {
    const { primaryActor, primaryActorId, primaryActorType } = notification;
    let conversationId = null;
    if (primaryActorType === 'Conversation') {
      conversationId = primaryActor.id;
    } else if (primaryActorType === 'Message') {
      conversationId = primaryActor.conversationId;
    }
    if (conversationId) {
      const conversationLink = `${installationUrl}/app/accounts/1/conversations/${conversationId}/${primaryActorId}/${primaryActorType}`;
      return conversationLink;
    }
  }
  return;
};

interface FCMMessage {
  data?: {
    payload?: string;
    notification?: string;
  };
  notification?: object;
}

export const findNotificationFromFCM = ({ message }: { message: FCMMessage }) => {
  try {
    if (message.data?.payload) {
      const parsedPayload = JSON.parse(message.data.payload);
      return parsedPayload.data?.notification ?? null;
    }

    if (message.data?.notification) {
      return JSON.parse(message.data.notification);
    }
  } catch (error) {
    Sentry.captureException(error);
  }

  return null;
};

export const displayAndroidBackgroundNotification = async (message: FCMMessage) => {
  if (Platform.OS !== 'android' || message.notification) {
    return;
  }

  const notification = findNotificationFromFCM({ message });
  if (!notification) {
    return;
  }

  try {
    const pushMessageTitle = transformNotification(notification).pushMessageTitle;
    if (!pushMessageTitle) {
      return;
    }

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
