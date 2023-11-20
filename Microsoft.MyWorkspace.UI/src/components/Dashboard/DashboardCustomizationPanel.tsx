import * as React from 'react';
import {
  Checkbox,
  DefaultButton,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  useTheme,
  Text,
} from '@fluentui/react';
import { DashboardCards } from 'src/types/enums/DashboardCards';
import { useSelector } from 'react-redux';
import {
  getCatalogUserProfile,
  getFeatureFlagExtendWorkspaceRuntime,
  getFeatureFlagTour,
} from 'src/store/selectors';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';
import { getDashboardStyles } from './Dashboard.styles';
import { InfoButton } from '../GeneralComponents/InfoButton';
import { Default_UserPreferencesDto } from 'src/data/Default_UserPreferencesDto';

interface ICardMap {
  [key: string]: DashboardCards;
}

interface IProps {
  isSelectionPanelOpen: boolean;
  setIsSelectionPanelOpen: (isOpen: boolean) => void;
  saveCardsCallback: (cards: DashboardCards[]) => void;
  warningDialogOpen: boolean;
  setWarningDialogOpen: (isOpen: boolean) => void;
}

export const DashboardCustomizationPanel = (props: IProps) => {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const userProfile = useSelector(getCatalogUserProfile);
  const userPreferences = userProfile.Preferences;
  const storedGridOrder = userPreferences?.DashboardCards ?? [
    ...Default_UserPreferencesDto.DashboardCards,
  ];
  const [dashboardCards, setDashboardCards] = React.useState([
    ...storedGridOrder,
  ]);
  const [hasChanges, setHasChanges] = React.useState(false);
  const extendWorkspaceRuntimeEnabled = useSelector(
    getFeatureFlagExtendWorkspaceRuntime
  );
  const featureFlagTour = useSelector(getFeatureFlagTour);

  const cardMapper = React.useMemo(() => {
    const values: ICardMap = {
      'Workspace Count Overview': DashboardCards.WorkspaceCountOverviewCard,
      'New Features': DashboardCards.FeatureAnnouncementCard,
      'Workspace Deletion': DashboardCards.WorkspaceDeletionCard,
      'Workspace Status Overview': DashboardCards.WorkspaceStatusOverviewCard,
      'Jit Status Overview': DashboardCards.JitStatusOverviewCard,
      'Documentation Page': DashboardCards.DocumentationCard,
    };
    if (featureFlagTour) {
      values['MyWorkspace Tour'] = DashboardCards.TourCard;
    }
    if (extendWorkspaceRuntimeEnabled) {
      values['Workspace Shutdown Schedule'] =
        DashboardCards.WorkspaceShutdownScheduleCard;
    }
    return values;
  }, [featureFlagTour, extendWorkspaceRuntimeEnabled]);

  const closePanel = (ev?: React.SyntheticEvent<HTMLElement, Event>) => {
    if (ev.nativeEvent) {
      hasChanges
        ? props.setWarningDialogOpen(true)
        : props.setIsSelectionPanelOpen(false);
    }
  };

  const addCard = (card: DashboardCards) => {
    setDashboardCards(dashboardCards.concat([card]));
  };

  const removeCard = (card: DashboardCards) => {
    const index = dashboardCards.indexOf(card);
    if (index !== -1) {
      setDashboardCards(dashboardCards.filter((c) => c !== card));
    }
  };

  const handleCheckBox = (card: DashboardCards) => {
    dashboardCards.indexOf(card) !== -1 ? removeCard(card) : addCard(card);
    setHasChanges(true);
  };

  const onRenderFooterContent = () => (
    <Stack horizontal verticalAlign='end'>
      <DefaultButton
        className={commonStyles.flexItem}
        onClick={() => {
          hasChanges
            ? props.setWarningDialogOpen(true)
            : props.setIsSelectionPanelOpen(false);
        }}
      >
        Cancel
      </DefaultButton>
      <PrimaryButton
        className={commonStyles.flexItem}
        disabled={!hasChanges}
        onClick={() => {
          props.saveCardsCallback(dashboardCards);
          props.setIsSelectionPanelOpen(false);
          setHasChanges(false);
        }}
      >
        Save
      </PrimaryButton>
    </Stack>
  );

  return (
    <Panel
      isFooterAtBottom={true}
      isOpen={props.isSelectionPanelOpen}
      onDismiss={closePanel}
      closeButtonAriaLabel='Close'
      headerText={`Dashboard Customization`}
      type={PanelType.medium}
      isLightDismiss={true}
      onRenderFooterContent={onRenderFooterContent}
    >
      <Stack>
        <p>
          Select which dashboard cards you would like to add to your personal
          dashboard.
        </p>
        {Object.entries(cardMapper).map(([key, c]) => (
          <Checkbox
            className={styles.dashboardPanelCheckBox}
            key={key}
            label={key}
            checked={dashboardCards.indexOf(c) != -1}
            onChange={() => {
              handleCheckBox(c);
            }}
          ></Checkbox>
        ))}
        <Stack horizontal verticalAlign='center'>
          <InfoButton
            buttonId='infobutton-no-workspaces'
            calloutTitle='Dashboard Cards Not Displaying'
            calloutBody={
              <Text>
                Please note, some cards will not display unless you have a
                workspace deployed.
              </Text>
            }
          />
          <Text>
            {
              'Please note, some cards will not display unless you have a workspace deployed.'
            }
          </Text>
        </Stack>
      </Stack>
    </Panel>
  );
};
