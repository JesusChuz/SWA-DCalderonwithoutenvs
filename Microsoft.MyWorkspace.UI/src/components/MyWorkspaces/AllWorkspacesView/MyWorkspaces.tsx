import * as React from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Stack,
  Text,
  Spinner,
  SpinnerSize,
  CommandBar,
  ICommandBarItemProps,
  useTheme,
} from '@fluentui/react';

import useDashboardSettings, {
  DashboardSettings,
  setDashboardSettings,
} from '../../../shared/DashboardSettings';

import { WorkspacesListView } from './WorkspacesListView';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { getAllWorkspacesStyles } from './AllWorkspacesView.styles';
import { NoWorkspaces } from '../NoWorkspaces';
import { JitRDPDetailsPanel } from '../JitRDP/JitRDPDetailsPanel';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  getAllWorkspacesPatchingSummaryLoading,
  getAzureWorkspaces,
  getAzureWorkspacesLoadedFirstTime,
} from '../../../store/selectors/azureWorkspaceSelectors';
import { TourModal } from './TourModal';
import {
  getJitEnabled,
  getIfNewFeaturesExist,
} from '../../../store/selectors/catalogSelectors';
import {
  getFeatureFlagAzureCustom,
  getFeatureFlagFeatureAnnouncement,
  getFeatureFlagTour,
  getModernRdpDownloadLink,
  getFeatureFlagNewUserWalkthrough,
} from '../../../store/selectors/configSelectors';
import { NewFeatureAnnouncement } from '../NewFeatureAnnouncement/NewFeatureAnnouncement';
import { downloadModernRDP } from '../../../shared/utilities/DownloadUtil';
import { NewUserWalkthrough } from '../NewUserWalkthrough/NewUserWalkthrough';
import {
  fetchAllWorkspacesPatchingSummary,
  fetchAzureWorkspaces,
} from '../../../store/actions';
import { getUserRoleAssignmentSegmentId } from '../../../store/selectors';

interface JitProps {
  open: boolean;
  workspaceID: string;
  highlightID?: string;
}

export const MyWorkspaces = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAllWorkspacesStyles(theme);
  const history = useHistory();
  const allWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const allWorkspacesLoadedFirstTime: boolean = useSelector(
    getAzureWorkspacesLoadedFirstTime
  );
  const settings: DashboardSettings = useDashboardSettings();
  const [jitProps, setJitProps] = React.useState<JitProps>({
    open: false,
    workspaceID: null,
  });
  const jitEnabled = useSelector(getJitEnabled);
  const featureFlagAzureCustom = useSelector(getFeatureFlagAzureCustom);
  const featureFlagFeatureAnnouncement = useSelector(
    getFeatureFlagFeatureAnnouncement
  );
  const featureFlagTour = useSelector(getFeatureFlagTour);
  const featureFlagNewUserWalkthrough = useSelector(
    getFeatureFlagNewUserWalkthrough
  );
  const modernRdpUrl: string = useSelector(getModernRdpDownloadLink);
  const [isTourModalOpen, setIsTourModalOpen] = React.useState(false);
  const hasNewFeature: boolean = useSelector(getIfNewFeaturesExist);
  const segmentId = useSelector(getUserRoleAssignmentSegmentId);
  const allWorkspacesPatchingSummaryLoading = useSelector(
    getAllWorkspacesPatchingSummaryLoading
  );

  const updateColumnSetting = (
    ev:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLElement>,
    column: string
  ) => {
    ev && ev.preventDefault();

    const newColumns = { ...settings.listViewColumns };
    newColumns[column] =
      newColumns[column] === undefined ? false : !newColumns[column];

    setDashboardSettings('listViewColumns', newColumns);
  };

  const openJit = (workspaceID: string, id?: string) => {
    setJitProps({ open: true, workspaceID, highlightID: id });
  };

  const closeJit = (id?: string) => {
    setJitProps({ open: false, workspaceID: null, highlightID: id });
  };

  const leftItems: ICommandBarItemProps[] = React.useMemo(() => {
    const newWorkspaceSubMenuItems: ICommandBarItemProps[] = [
      {
        key: 'templateAzureWorkspace',
        text: 'Template Workspace',
        onClick: () => {
          history.push('/NewWorkspace/Template');
        },
        isSelected: location.pathname === '/NewWorkspace/Template',
      },
    ];
    if (featureFlagAzureCustom) {
      newWorkspaceSubMenuItems.unshift({
        key: 'customAzureWorkspace',
        text: 'Custom Workspace',
        onClick: () => {
          history.push('/NewWorkspace/Custom');
        },
        isSelected: location.pathname === '/NewWorkspace/Custom',
      });
    }
    const commandBarItems: ICommandBarItemProps[] = [
      {
        key: 'New Workspace',
        text: 'New Workspace',
        iconProps: { iconName: 'Add' },
        subMenuProps: {
          items: newWorkspaceSubMenuItems,
        },
      },
    ];
    if (modernRdpUrl) {
      commandBarItems.push({
        key: 'DownloadModernRDP',
        iconProps: { iconName: 'Download' },
        text: 'Download ModernRDP',
        onClick: () => downloadModernRDP(modernRdpUrl),
        ['data-custom-parentid']: 'Download ModernRDP',
      });
    }
    commandBarItems.push({
      key: 'Restart',
      name: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      text: 'Refresh',
      ariaLabel: 'Refresh',
      onClick: () => {
        dispatch(fetchAzureWorkspaces(true));
      },
    });
    return commandBarItems;
  }, [featureFlagAzureCustom, modernRdpUrl]);

  const rightItems: ICommandBarItemProps[] = React.useMemo(() => {
    const commandBarItems: ICommandBarItemProps[] = [
      {
        key: 'Columns',
        iconProps: { iconName: 'ColumnOptions' },
        text: 'Column Options',
        subMenuProps: {
          items: [
            {
              key: 'description',
              text: 'Description',
              isChecked:
                settings.listViewColumns['description'] === undefined
                  ? true
                  : settings.listViewColumns['description'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'description'),
            },
            {
              key: 'geography',
              text: 'Geography',
              isChecked:
                settings.listViewColumns['geography'] === undefined
                  ? true
                  : settings.listViewColumns['geography'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'geography'),
            },
            {
              key: 'region',
              text: 'Region',
              isChecked:
                settings.listViewColumns['region'] === undefined
                  ? true
                  : settings.listViewColumns['region'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'region'),
            },
            {
              key: 'owner',
              text: 'Owner',
              isChecked:
                settings.listViewColumns['OwnerEmail'] === undefined
                  ? true
                  : settings.listViewColumns['OwnerEmail'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'OwnerEmail'),
            },
            {
              key: 'workspaceID',
              text: 'Workspace ID',
              isChecked:
                settings.listViewColumns['workspaceID'] === undefined
                  ? true
                  : settings.listViewColumns['workspaceID'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'workspaceID'),
            },
            {
              key: 'sharedOwners',
              text: 'Shared Owners',
              isChecked:
                settings.listViewColumns['sharedOwners'] === undefined
                  ? true
                  : settings.listViewColumns['sharedOwners'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'sharedOwners'),
            },
            {
              key: 'created',
              text: 'Created',
              isChecked:
                settings.listViewColumns['Created'] === undefined
                  ? true
                  : settings.listViewColumns['Created'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'Created'),
            },
            {
              key: 'machines',
              text: 'Machines',
              isChecked:
                settings.listViewColumns['machines'] === undefined
                  ? true
                  : settings.listViewColumns['machines'],
              canCheck: true,
              onClick: (
                ev:
                  | React.MouseEvent<HTMLElement, MouseEvent>
                  | React.KeyboardEvent<HTMLElement>
              ) => updateColumnSetting(ev, 'machines'),
            },
          ],
        },
      },
    ];
    if (featureFlagTour) {
      commandBarItems.unshift({
        key: 'Tour',
        iconProps: { iconName: 'SeeDo' },
        text: 'Take a Tour',
        onClick: () => setIsTourModalOpen(!isTourModalOpen),
      });
    }
    return commandBarItems;
  }, [settings, featureFlagTour]);

  React.useEffect(() => {
    if (allWorkspaces && !allWorkspacesPatchingSummaryLoading) {
      dispatch(fetchAllWorkspacesPatchingSummary(segmentId));
    }
  }, [allWorkspaces]);

  return (
    <>
      {featureFlagNewUserWalkthrough && <NewUserWalkthrough />}
      {featureFlagFeatureAnnouncement && hasNewFeature && (
        <NewFeatureAnnouncement />
      )}
      <Stack className={styles.container}>
        <Text as='h1' variant='xxLarge'>
          Workspaces
        </Text>
        {featureFlagTour && (
          <TourModal
            isTourModalOpen={isTourModalOpen}
            setIsTourModalOpen={setIsTourModalOpen}
            data-custom-parentid='Take a Tour'
            data-custom-id='Take a Tour Button'
          />
        )}
        <CommandBar
          styles={{ root: { padding: 0 } }}
          items={leftItems}
          farItems={rightItems}
        />
        {allWorkspacesLoadedFirstTime ? (
          <>
            {allWorkspaces === null || allWorkspaces.length === 0 ? (
              <NoWorkspaces />
            ) : (
              <WorkspacesListView openJit={openJit} />
            )}
          </>
        ) : (
          <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
        )}
      </Stack>

      {jitEnabled && (
        <JitRDPDetailsPanel
          open={jitProps.open}
          workspaceID={jitProps.workspaceID}
          closeJit={closeJit}
          highlightID={jitProps.highlightID}
        />
      )}
    </>
  );
};

export { MyWorkspaces as default };
