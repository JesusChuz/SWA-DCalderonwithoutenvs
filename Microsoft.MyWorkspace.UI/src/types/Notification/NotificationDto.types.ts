import { NotificationStatus } from '../enums/NotificationStatus';
import { NotificationType } from '../enums/NotificationType';

export interface NotificationDto {
  ID: string;
  UserID: string;
  Title: string;
  Message: string;
  Details: string;
  CreatedOn: string;
  Status: NotificationStatus;
  Type: NotificationType;
  IsCreateOperation: boolean;
}
