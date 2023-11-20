import { UserPreferencesDto } from './UserPreferencesDto.types';

export interface UserProfileDto {
  ID: string;
  AcceptedAgreements: string[];
  GivenName: string;
  Surname: string;
  Mail: string;
  RuntimeExtensionHoursRemaining: number;
  QuotaWeek: number;
  SeenFeatures: string[];
  DisplayNewUserWalkthrough: boolean;
  Preferences: UserPreferencesDto;
}
