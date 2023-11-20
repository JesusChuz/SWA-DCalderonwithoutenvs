import { DashboardCards } from '../enums/DashboardCards';
import { Themes } from '../enums/Themes';

export interface UserPreferencesDto {
  Theme: Themes;
  DashboardCards: DashboardCards[];
}
