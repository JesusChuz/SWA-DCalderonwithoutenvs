import * as React from 'react';
import {
  CommandBar,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  useTheme,
  Text,
  ICommandBarItemProps,
} from '@fluentui/react';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';
import { getDashboardStyles } from './Dashboard.styles';
import {
  getAzureWorkspacesLoadingStatus,
  getUserWorkspaceInsightsLoading,
  getFeatureFlagExtendWorkspaceRuntime,
  getFeatureFlagDashboardDnD,
  getCatalogUserProfile,
  getFeatureFlagTour,
  getAzureWorkspaces,
} from '../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardCards } from 'src/types/enums/DashboardCards';
import { DashboardCustomizationPanel } from './DashboardCustomizationPanel';
import clsx from 'clsx';
import DraggableGrid, { DraggableGridHandle, DraggableItem } from 'ruuri';
import { PreferencesLocalStorageKey } from 'src/shared/Constants';
import { setItem } from 'src/shared/LocalStorageHelper';
import { usePreferences } from 'src/hooks/usePreferences';
import { updatePreferences } from 'src/store/actions';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { Default_UserPreferencesDto } from 'src/data/Default_UserPreferencesDto';
import {
  DocumentationCard,
  JitStatusOverviewCard,
  NewFeatureCard,
  NoWorkspaceCard,
  TourCard,
  WorkspaceCountOverviewCard,
  WorkspaceDeletionCard,
  WorkspaceShutdownScheduleCard,
  WorkspaceStatusOverviewCard,
} from './Cards';

export const Dashboard = (): JSX.Element => {
  const [isSelectionPanelOpen, setIsSelectionPanelOpen] = React.useState(false);
  const [warningDialogOpen, setWarningDialogOpen] = React.useState(false);

  const userProfile = useSelector(getCatalogUserProfile);
  const gridRef = React.useRef<DraggableGridHandle>();
  const theme = useTheme();
  const dispatch = useDispatch();
  const commonStyles = getCommonStyles(theme);
  const styles = getDashboardStyles(theme);

  const preferences = usePreferences((newPreferences) => {
    dispatch(
      updatePreferences({ ...userProfile, Preferences: newPreferences })
    );
  });

  const [cards, setCards] = React.useState(
    preferences?.DashboardCards ?? [
      ...Default_UserPreferencesDto.DashboardCards,
    ]
  );
  const [reRenderTrigger, setReRenderTrigger] = React.useState(false);
  const workspacesIsLoading = useSelector(getAzureWorkspacesLoadingStatus);
  const userWorkspaceInsightsLoading = useSelector(
    getUserWorkspaceInsightsLoading
  );
  const extendWorkspaceRuntimeEnabled = useSelector(
    getFeatureFlagExtendWorkspaceRuntime
  );
  const featureFlagTour = useSelector(getFeatureFlagTour);
  const featureFlagDnD = useSelector(getFeatureFlagDashboardDnD);
  const allWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const haveWorkspace = React.useMemo(() => {
    return allWorkspaces?.length > 0;
  }, [allWorkspaces]);

  const displayNoWorkspacesCard = React.useMemo(() => {
    return (
      cards.indexOf(DashboardCards.WorkspaceDeletionCard) !== -1 ||
      cards.indexOf(DashboardCards.WorkspaceStatusOverviewCard) !== -1 ||
      cards.indexOf(DashboardCards.JitStatusOverviewCard) !== -1
    );
  }, [cards]);

  const cardMapper = (cardType: DashboardCards) => {
    switch (cardType) {
      case DashboardCards.WorkspaceCountOverviewCard:
        return <WorkspaceCountOverviewCard />;
      case DashboardCards.TourCard:
        return featureFlagTour && <TourCard />;
      case DashboardCards.FeatureAnnouncementCard:
        return <NewFeatureCard />;
      case DashboardCards.WorkspaceDeletionCard:
        return haveWorkspace && <WorkspaceDeletionCard />;
      case DashboardCards.WorkspaceStatusOverviewCard:
        return haveWorkspace && <WorkspaceStatusOverviewCard />;
      case DashboardCards.JitStatusOverviewCard:
        return haveWorkspace && <JitStatusOverviewCard />;
      case DashboardCards.DocumentationCard:
        return <DocumentationCard />;
      case DashboardCards.WorkspaceShutdownScheduleCard:
        return (
          haveWorkspace &&
          extendWorkspaceRuntimeEnabled && <WorkspaceShutdownScheduleCard />
        );
      case DashboardCards.None:
        return !haveWorkspace && displayNoWorkspacesCard && <NoWorkspaceCard />;
      default:
        return <></>;
    }
  };

  const [initialLoad, setInitialLoad] = React.useState(true);

  const updateDashboardCards = (cards: DashboardCards[]) => {
    setItem(PreferencesLocalStorageKey, {
      ...preferences,
      DashboardCards: cards,
    });
  };

  const save = () => {
    if (gridRef.current) {
      const cards = gridRef.current.grid.getItems();
      const order = cards.map((card) =>
        card
          .getElement()
          .querySelector('.draggable-item-content')
          .getAttribute('id')
      );
      const newOrder = order.map((i, index) => parseInt(i));
      updateDashboardCards(newOrder);
      setCards(newOrder);
    }
  };

  React.useEffect(() => {
    setInitialLoad(false);
  }, [workspacesIsLoading, userWorkspaceInsightsLoading]);

  React.useEffect(() => {
    if (
      preferences?.DashboardCards &&
      (preferences.DashboardCards.length !== cards.length ||
        preferences.DashboardCards.some((c) => cards.indexOf(c) === -1) ||
        cards.some((c) => preferences.DashboardCards.indexOf(c) === -1))
    ) {
      setCards([...preferences.DashboardCards]);
      setReRenderTrigger((v) => !v);
    }
  }, [cards, preferences?.DashboardCards]);

  const commandBarItems: ICommandBarItemProps[] = React.useMemo(() => {
    const commandBarItems: ICommandBarItemProps[] = [
      {
        key: 'SelectDashboardCards',
        iconProps: { iconName: 'ColumnOptions' },
        text: 'Select Dashboard Cards',
        onClick: () => setIsSelectionPanelOpen(!isSelectionPanelOpen),
        ['data-custom-parentid']: 'SelectDashboardCards',
      },
    ];
    return commandBarItems;
  }, []);

  const grid = React.useMemo(() => {
    return (
      <DraggableGrid
        id='gridDisplayed'
        ref={gridRef}
        onDragReleaseEnd={save}
        dragEnabled={featureFlagDnD}
      >
        {cards.map((c) => (
          <DraggableItem id={c.toString()} key={c}>
            {cardMapper(c)}
          </DraggableItem>
        ))}
      </DraggableGrid>
    );
  }, [
    reRenderTrigger,
    featureFlagDnD,
    haveWorkspace,
    displayNoWorkspacesCard,
    extendWorkspaceRuntimeEnabled,
    featureFlagTour,
    preferences?.Theme,
  ]);

  return (
    <>
      <DashboardCustomizationPanel
        isSelectionPanelOpen={isSelectionPanelOpen}
        setIsSelectionPanelOpen={setIsSelectionPanelOpen}
        saveCardsCallback={updateDashboardCards}
        warningDialogOpen={warningDialogOpen}
        setWarningDialogOpen={setWarningDialogOpen}
      ></DashboardCustomizationPanel>
      {initialLoad && (workspacesIsLoading || userWorkspaceInsightsLoading) ? (
        <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
      ) : (
        <div>
          <Stack className={styles.container}>
            <Text as='h1' variant='xxLarge'>
              Dashboard
            </Text>
            <CommandBar
              styles={{ root: { padding: 0 } }}
              items={commandBarItems}
            />

            <div className={clsx(styles.dashBoardContainer)}>{grid}</div>

            <Dialog
              hidden={!warningDialogOpen}
              dialogContentProps={{
                type: DialogType.normal,
                title: 'Warning',
                closeButtonAriaLabel: 'Close',
                subText: 'You have not saved your selected dashboard cards',
              }}
            >
              <DialogFooter>
                <DefaultButton
                  onClick={() => setWarningDialogOpen(false)}
                  text='Cancel'
                />
                <PrimaryButton
                  onClick={() => {
                    setWarningDialogOpen(false);
                    setIsSelectionPanelOpen(false);
                  }}
                  text='Continue'
                />
              </DialogFooter>
            </Dialog>
          </Stack>
        </div>
      )}
    </>
  );
};

export default Dashboard;
