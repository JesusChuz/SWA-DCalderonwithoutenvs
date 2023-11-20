import { NotificationDto } from '../types/Notification/NotificationDto.types';
import dayjs from 'dayjs';
import { NotificationStatus } from '../types/enums/NotificationStatus';
import { NotificationType } from '../types/enums/NotificationType';
import { ItemDisplayStatus } from '@coherence-design-system/controls/lib';
import { INotificationItem } from '@coherence-design-system/notification-center';

export const convertNotificationDtoToNotificationListItem = (
  notifications: NotificationDto[]
): INotificationItem[] => {
  return notifications.map(
    (notification) =>
      ({
        itemKey: notification.ID,
        timestamp: dayjs(notification.CreatedOn).toDate(),
        notificationStatus:
          notification.Status === NotificationStatus.Unread ? 'Unread' : 'Read',
        title: notification.Title,
        description: `${notification.Message} ${
          notification.Details !== undefined ? notification.Details : ''
        }`,
        isExpandable: notification.Details !== undefined,
        displayStatus: getNotificationDisplayStatus(notification.Status),
        iconProps: { iconName: getNotificationSubjectIcon(notification.Type) },
      } as INotificationItem)
  );
};

const getNotificationDisplayStatus = (
  notificationStatus: NotificationStatus
): ItemDisplayStatus => {
  if (notificationStatus === NotificationStatus.Dismissed) {
    return 'dismiss';
  }
  return notificationStatus === NotificationStatus.Unread ? 'new' : 'old';
};

export const getNotificationSubjectIcon = (
  notificationType: NotificationType
): string => {
  switch (notificationType) {
    case NotificationType.Success:
      return 'green-check-mark';
    case NotificationType.Failure:
      return 'red-error-icon';
    case NotificationType.Information:
      return 'blue-info-icon';
    case NotificationType.Announcement:
      return 'Megaphone';
    case NotificationType.Critical:
      return 'yellow-warning-icon';
    default:
      return '';
  }
};
