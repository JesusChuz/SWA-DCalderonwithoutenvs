import { UserPreferencesDto } from 'src/types/Catalog/UserPreferencesDto.types';
import { DashboardCards } from 'src/types/enums/DashboardCards';
import { Themes } from 'src/types/enums/Themes';

export const Default_UserPreferencesDto: UserPreferencesDto = {
  Theme: Themes.Light,
  DashboardCards: [
    DashboardCards.None,
    DashboardCards.WorkspaceAgeStalenessCard,
    DashboardCards.WorkspaceStatusOverviewCard,
    DashboardCards.JitStatusOverviewCard,
    DashboardCards.DocumentationCard,
    DashboardCards.WorkspaceShutdownScheduleCard,
    DashboardCards.WorkspaceCountOverviewCard,
    DashboardCards.TourCard,
    DashboardCards.WorkspaceDeletionCard,
    DashboardCards.FeatureAnnouncementCard,
    DashboardCards.ComplianceUpdateCard,
  ],
};
