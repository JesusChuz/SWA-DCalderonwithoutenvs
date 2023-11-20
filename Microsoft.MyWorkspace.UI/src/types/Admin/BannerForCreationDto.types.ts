import { MessageBarType } from '@fluentui/react';

export interface BannerForCreationDto {
  Text: string;
  Type: MessageBarType;
  Published: boolean;
  Truncated: boolean;
  Multiline: boolean;
}
