import * as React from 'react';
import {
  Pivot,
  Stack,
  PrimaryButton,
  DefaultButton,
  IPivotItemProps,
  FontIcon,
  Spinner,
  SpinnerSize,
  useTheme,
  PivotItem,
} from '@fluentui/react';

import { useDispatch, useSelector } from 'react-redux';
import { GeneralPropertiesPanel } from './GeneralPropertiesPanel';
import { OwnersPropertiesPanel } from './OwnersPropertiesPanel';
import {
  getCommonStyles,
  PivotStyles,
} from '../../../GeneralComponents/CommonStyles';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import {
  getFeatureFlagComplianceMonitoring,
  getFeatureFlagExternalConnectivity,
  getFeatureFlagExternalConnectivityDNS,
  getFeatureFlagMultipleSubnet,
  getFeatureFlagSchedule,
  getUserRoleAssignmentConstraint,
} from '../../../../store/selectors';
import { ResourceState } from '../../../../types/AzureWorkspace/enums/ResourceState';
import { ExternalConnectivityPropertiesPanel } from './ExternalConnectivityPropertiesPanel';
import { JitPropertiesPanel } from './JitPropertiesPanel';
import { DnsPropertiesPanel } from './DnsPropertiesPanel';
import { SchedulePropertiesPanel } from './SchedulePropertiesPanel';
import { CompliancePropertiesPanel } from './CompliancePropertiesPanel';
import { AdminTasksPanel } from './AdminComponents/AdminTasksPanel';
import { AdminFirewallPanel } from './AdminComponents/AdminFirewallPanel';
import { WorkspacePropertiesTab } from './WorkspacePropertiesTabs.utils';
import {
  editableWorkspaceResetChanges,
  editableWorkspaceSaveChanges,
} from '../../../../store/actions/editableWorkspaceActions';
import { NetworkConfigurationPanel } from './NetworkConfigurationPanel';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  getEditableWorkspace,
  getEditableWorkspaceHasChanges,
  getEditableWorkspaceIsValid,
  getEditableWorkspaceNameError,
  getEditableWorkspaceSaving,
  getEditableWorkspaceScheduledWorkspaceJobChanges,
  getEditWorkspaceIsAdminSelection,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import { TelemetryGraphPage } from './AdminComponents/TelemetryGraph/TelemetryGraphPage';
import { Prompt, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useQuery } from '../../../../shared/useQuery';
import { PivotItemErrorBoundaryWrapper } from 'src/components/GeneralComponents/ErrorBoundary/PivotItemErrorBoundaryWrapper';

export const WorkspacePropertiesTabs = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const workspaceNameError = useSelector(getEditableWorkspaceNameError);
  const isAdminSelection = useSelector(getEditWorkspaceIsAdminSelection);
  const changes = useSelector(getEditableWorkspaceHasChanges);
  const scheduledWorkspaceJobChanges = useSelector(
    getEditableWorkspaceScheduledWorkspaceJobChanges
  );
  const valid = useSelector(getEditableWorkspaceIsValid);
  const saving = useSelector(getEditableWorkspaceSaving);
  const externalConnectivityFeatureFlag = useSelector(
    getFeatureFlagExternalConnectivity
  );
  const dnsFeatureFlag = useSelector(getFeatureFlagExternalConnectivityDNS);
  const scheduleFeatureFlag = useSelector(getFeatureFlagSchedule);
  const complianceMonitoringFeatureFlag = useSelector(
    getFeatureFlagComplianceMonitoring
  );
  const segmentConstraint = useSelector(getUserRoleAssignmentConstraint);
  const canvasViewFeatureFlag = useSelector(getFeatureFlagSchedule);
  const multipleSubnetFeatureFlag = useSelector(getFeatureFlagMultipleSubnet);

  const history = useHistory();
  const query = useQuery();
  const basePath = location.pathname;

  const pivotClick = (key: string) => {
    history.push(`${basePath}?tab=${key}`);
  };

  const tab = React.useMemo(() => {
    const key = query.get('tab');
    switch (key) {
      case 'ownership':
        return 'ownership';
      case 'schedule':
        return 'schedule';
      case 'compliance':
        return 'compliance';
      case 'externalConnectivity':
        return 'externalConnectivity';
      case 'dns':
        return 'dns';
      case 'jit':
        return 'jit';
      case 'networkConfiguration':
        return 'networkConfiguration';
      case 'tasks':
        return 'tasks';
      case 'firewall':
        return 'firewall';
      case 'telemetry':
        return 'telemetry';
      default:
        return 'general';
    }
  }, [query]);

  const onRenderPivotItem = (
    link: IPivotItemProps,
    defaultRenderer: (link: IPivotItemProps) => JSX.Element
  ) => {
    return (
      <span>
        {(link.itemKey as WorkspacePropertiesTab) ===
          WorkspacePropertiesTab.General &&
          workspaceNameError !== '' &&
          workspaceNameError !== null && (
            <FontIcon className={styles.tabErrorIcon} iconName='Error' />
          )}
        {defaultRenderer(link)}
      </span>
    );
  };

  const externalConnectivityEnabled =
    externalConnectivityFeatureFlag &&
    editableWorkspace.HubNetworkInfo &&
    editableWorkspace.HubNetworkInfo.IsExternalConnectivityEnabled;

  return (
    <>
      <Prompt
        message={(location) => {
          if (!location.pathname.includes(editableWorkspace.ID) && changes) {
            return 'Your changes will not be saved if you leave this page.';
          }
          return true;
        }}
      />
      {saving ? (
        <Spinner
          size={SpinnerSize.large}
          aria-label='workspace saving spinner'
        />
      ) : (
        <Stack
          className={clsx(
            commonStyles.fullHeight,
            commonStyles.flexItem,
            commonStyles.flexGrow,
            commonStyles.overflowYAuto,
            saving && commonStyles.blur,
            commonStyles.minHeight250
          )}
        >
          <Pivot
            selectedKey={tab}
            onLinkClick={(item: PivotItem) => pivotClick(item.props.itemKey)}
            overflowBehavior={'menu'}
            overflowAriaLabel={'more workspace properties'}
            className={commonStyles.flexPivot}
            styles={{
              ...PivotStyles.ItemContainerOverflow,
              ...PivotStyles.TabPadding,
            }}
            linkSize={'large'}
          >
            <PivotItem
              headerText='General'
              itemKey='general'
              alwaysRender={true}
              onRenderItemLink={onRenderPivotItem}
            >
              <PivotItemErrorBoundaryWrapper>
                <GeneralPropertiesPanel />
              </PivotItemErrorBoundaryWrapper>
            </PivotItem>
            <PivotItem
              headerText='Ownership'
              itemKey='ownership'
              alwaysRender={true}
              onRenderItemLink={onRenderPivotItem}
            >
              <OwnersPropertiesPanel />
            </PivotItem>
            {scheduleFeatureFlag && (
              <PivotItem
                headerText='Schedule'
                itemKey='schedule'
                alwaysRender={true}
                onRenderItemLink={onRenderPivotItem}
              >
                <PivotItemErrorBoundaryWrapper>
                  <SchedulePropertiesPanel />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
            {complianceMonitoringFeatureFlag &&
              segmentConstraint.EnablePatchInfoForVM && (
                <PivotItem
                  headerText='Compliance'
                  itemKey='compliance'
                  alwaysRender={true}
                  onRenderItemLink={onRenderPivotItem}
                >
                  <PivotItemErrorBoundaryWrapper>
                    <CompliancePropertiesPanel />
                  </PivotItemErrorBoundaryWrapper>
                </PivotItem>
              )}
            {externalConnectivityEnabled && (
              <PivotItem
                headerText='External Connectivity'
                itemKey='externalConnectivity'
                alwaysRender={true}
                onRenderItemLink={onRenderPivotItem}
              >
                <PivotItemErrorBoundaryWrapper>
                  <ExternalConnectivityPropertiesPanel />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
            {externalConnectivityEnabled && dnsFeatureFlag && (
              <PivotItem
                headerText='DNS'
                itemKey='dns'
                alwaysRender={true}
                onRenderItemLink={onRenderPivotItem}
              >
                <PivotItemErrorBoundaryWrapper>
                  <DnsPropertiesPanel />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
            <PivotItem
              headerText='JIT'
              itemKey='jit'
              alwaysRender={true}
              onRenderItemLink={onRenderPivotItem}
            >
              <PivotItemErrorBoundaryWrapper>
                <JitPropertiesPanel workspaceID={editableWorkspace.ID} />
              </PivotItemErrorBoundaryWrapper>
            </PivotItem>

            {multipleSubnetFeatureFlag && (
              <PivotItem
                headerText='Network Configuration'
                itemKey='networkConfiguration'
                alwaysRender={true}
                onRenderItemLink={onRenderPivotItem}
              >
                <PivotItemErrorBoundaryWrapper>
                  <NetworkConfigurationPanel />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
            {isAdminSelection && (
              <PivotItem
                headerText='Tasks'
                itemKey='tasks'
                alwaysRender={true}
                onRenderItemLink={onRenderPivotItem}
              >
                <PivotItemErrorBoundaryWrapper>
                  <AdminTasksPanel />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
            {isAdminSelection && (
              <PivotItem
                headerText='Firewall'
                itemKey='firewall'
                alwaysRender={true}
                onRenderItemLink={onRenderPivotItem}
              >
                <PivotItemErrorBoundaryWrapper>
                  <AdminFirewallPanel />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
            {isAdminSelection && (
              <PivotItem
                headerText='Telemetry'
                itemKey='telemetry'
                alwaysRender={true}
                onRenderItemLink={onRenderPivotItem}
              >
                <PivotItemErrorBoundaryWrapper>
                  <TelemetryGraphPage />
                </PivotItemErrorBoundaryWrapper>
              </PivotItem>
            )}
          </Pivot>
          <Stack horizontal horizontalAlign='end'>
            <DefaultButton
              className={commonStyles.flexItem}
              text='Cancel'
              allowDisabledFocus
              disabled={!changes && !scheduledWorkspaceJobChanges}
              onClick={() => dispatch(editableWorkspaceResetChanges())}
            />
            <PrimaryButton
              className={commonStyles.flexItem}
              text='Save'
              allowDisabledFocus
              disabled={
                (!changes && !scheduledWorkspaceJobChanges) ||
                !valid ||
                editableWorkspace.State == ResourceState.Deploying
              }
              onClick={() => dispatch(editableWorkspaceSaveChanges())}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
};
