import { NotificationDto } from '../../types/Notification/NotificationDto.types';
import { NotificationStatus } from '../../types/enums/NotificationStatus';
import { NotificationType } from '../../types/enums/NotificationType';

export const NotificationTestData: NotificationDto = {
  ID: '',
  UserID: '',
  Title: '',
  Message: '',
  Details: '',
  CreatedOn: '',
  Status: NotificationStatus.Unread,
  Type: NotificationType.Information,
  IsCreateOperation: true,
};

export const getTestNotificationDto = (
  properties: Partial<NotificationDto> = {}
): NotificationDto => {
  return {
    ...NotificationTestData,
    ...properties,
  };
};
