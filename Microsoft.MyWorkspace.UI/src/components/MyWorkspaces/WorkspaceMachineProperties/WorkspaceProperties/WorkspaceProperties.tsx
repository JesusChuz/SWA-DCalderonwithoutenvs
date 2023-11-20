import * as React from 'react';
import {
  Separator,
  Text,
  Stack,
  TooltipHost,
  Icon,
  useTheme,
} from '@fluentui/react';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import { useSelector } from 'react-redux';

import { WorkspacePropertiesTabs } from './WorkspacePropertiesTabs';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { StartWorkspaceButton } from './WorkspaceActionButtons/StartWorkspaceButton';
import { StopWorkspaceButton } from './WorkspaceActionButtons/StopWorkspaceButton';
import { EditWorkspaceButton } from './WorkspaceActionButtons/EditWorkspaceButton';
import { ExtendWorkspaceRuntimeButton } from './WorkspaceActionButtons/ExtendWorkspaceRuntimeButton';
import { DeleteWorkspaces } from './WorkspaceActionButtons/DeleteWorkspaces';
import { AdminWorkspaceJsonPanel } from '../WorkspaceProperties/AdminComponents/AdminWorkspaceJsonPanel';
import { AdminRefreshWorkspace } from '../WorkspaceProperties/AdminComponents/AdminRefreshWorkspace';
import { ResourceStateStatusIcon } from '../../WorkspaceStatusIcons';
import { formatDateString } from '../../../../shared/DateTimeHelpers';
import {
  getCatalogUserProfile,
  getExtendWorkspaceRuntimeRefreshPending,
  getExtendWorkspaceRuntimeRequestPending,
  getFeatureFlagExtendWorkspaceRuntime,
  getFeatureFlagPostDeploymentMachineChanges,
  getFeatureFlagPrivateMode,
  getFeatureFlagStaleWorkspaceDeletion,
  getPrivateModePending,
  getPrivateModeRefreshPending,
  getStaleWorkspaceDeletionWarningThreshold,
  getUserRoleAssignmentConstraint,
} from '../../../../store/selectors';
import {
  getEditableWorkspace,
  getEditableWorkspaceIsNestedVirtualizationEnabled,
  getEditableWorkspaceOriginalWorkspace,
  getEditWorkspaceIsAdminSelection,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  EditsDisabled,
  IsOn,
  ShouldDisplayStaleWorkspaceWarning,
} from '../../../../shared/helpers/WorkspaceHelper';
import { WorkspaceShutdownTimeRemaining } from '../../../GeneralComponents/TimeRemaining/WorkspaceShutdownTimeRemaining';
import { InfoButton } from '../../../GeneralComponents/InfoButton';
import { PrivateWorkspaceButton } from './WorkspaceActionButtons/PrivateWorkspaceButton';
import { StaleWorkspaceDeletionTimeRemaining } from '../../../GeneralComponents/TimeRemaining/StaleWorkspaceDeletionTimeRemaining';

export const WorkspaceProperties = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getWorkspacePropertiesStyles(theme);
  const staleWorkspaceDeletionWarningThreshold = useSelector(
    getStaleWorkspaceDeletionWarningThreshold
  );
  const infoButtonId = 'infoButton-nested-virtualization';
  const userProfile = useSelector(getCatalogUserProfile);
  const postDeploymentMachineChangesEnabled = useSelector(
    getFeatureFlagPostDeploymentMachineChanges
  );
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const isAdminSelection = useSelector(getEditWorkspaceIsAdminSelection);
  const isNestedVirtualizationEnabled = useSelector(
    getEditableWorkspaceIsNestedVirtualizationEnabled
  );
  const extendWorkspaceRuntimeRequestPending = useSelector(
    getExtendWorkspaceRuntimeRequestPending
  );
  const extendWorkspaceRuntimeEnabled = useSelector(
    getFeatureFlagExtendWorkspaceRuntime
  );
  const extendRuntimeRefreshPending = useSelector(
    getExtendWorkspaceRuntimeRefreshPending
  );
  const privateModePending = useSelector(getPrivateModePending);
  const privateModeEnabled = useSelector(getFeatureFlagPrivateMode);
  const privateModeRefreshPending = useSelector(getPrivateModeRefreshPending);
  const constraint = useSelector(getUserRoleAssignmentConstraint);
  const featureFlagStaleWorkspaceDeletion = useSelector(
    getFeatureFlagStaleWorkspaceDeletion
  );

  const shouldStaleWorkspaceDeletionWarningDisplay =
    featureFlagStaleWorkspaceDeletion &&
    ShouldDisplayStaleWorkspaceWarning(
      editableWorkspace,
      constraint,
      staleWorkspaceDeletionWarningThreshold
    );

  return (
    <Stack className={styles.root} data-testid='workspaceProperties'>
      <Stack
        horizontal
        verticalAlign='start'
        data-testid='workspacePropertiesHeader'
      >
        <ResourceStateStatusIcon resourceState={editableWorkspace.State} />
        <Stack
          className={commonStyles.fullWidth}
          style={{ overflowX: 'hidden' }}
        >
          <Stack tokens={{ childrenGap: 4 }} horizontal verticalAlign='center'>
            <TooltipHost content={editableWorkspace.Name}>
              <Text
                className={commonStyles.workspaceMachineTitle}
                variant='xxLarge'
                nowrap
                block
              >
                {editableWorkspace.Name}
              </Text>
            </TooltipHost>
            {editableWorkspace.PrivateMode && (
              <TooltipHost content={'Private Mode Enabled'}>
                <Icon
                  iconName='LockSolid'
                  aria-label='Private Mode Enabled'
                  className={`${commonStyles.displayBlock} ${commonStyles.font18} ${commonStyles.cursorDefault}`}
                />
              </TooltipHost>
            )}
            <Text
              className={commonStyles.workspaceMachineTitle}
              variant='xxLarge'
              nowrap
              block
            >
              {' '}
              — Workspace Properties
            </Text>
          </Stack>
          <Stack
            horizontal
            verticalAlign='center'
            horizontalAlign='space-between'
            tokens={{ childrenGap: 12 }}
          >
            <TooltipHost content='Creation Date'>
              <Text variant='large' nowrap block>
                {editableWorkspace.Created
                  ? formatDateString(editableWorkspace.Created)
                  : ''}
              </Text>
            </TooltipHost>
            {shouldStaleWorkspaceDeletionWarningDisplay && (
              <StaleWorkspaceDeletionTimeRemaining
                workspace={editableWorkspace}
                suffix='until deletion'
                variant='large'
              />
            )}
            {extendWorkspaceRuntimeEnabled &&
              IsOn(editableWorkspace) &&
              editableWorkspace.EndRunTime && (
                <WorkspaceShutdownTimeRemaining
                  workspace={editableWorkspace}
                  suffix='until shutdown'
                  variant='large'
                />
              )}
          </Stack>
          <Stack horizontal horizontalAlign='space-between'>
            <TooltipHost content='Region'>
              <Text variant='large' nowrap block>
                {editableWorkspace.Location}
              </Text>
            </TooltipHost>
            {isNestedVirtualizationEnabled && (
              <Stack horizontal verticalAlign='center'>
                <TooltipHost content='Nested VMs Enabled'>
                  <Text variant='large' nowrap block>
                    {'Nested Virtualization Enabled'}
                  </Text>
                </TooltipHost>
                <InfoButton
                  buttonId={infoButtonId}
                  calloutTitle={'Nested Virtualization'}
                  calloutBody={
                    <>
                      <Text>
                        This workspace contains one or more machines that
                        support nested virtualization.
                      </Text>
                      <Text>
                        Nested virtualization is a feature that allows a user to
                        run virtual machines instances within a virtual machine.
                      </Text>
                    </>
                  }
                />
              </Stack>
            )}
          </Stack>
          <Stack
            horizontal
            className={styles.actionsRow}
            horizontalAlign='space-between'
          >
            <div>
              <StartWorkspaceButton
                variant='CommandBarButton'
                workspace={editableWorkspace}
              />
              <StopWorkspaceButton
                variant='CommandBarButton'
                workspace={editableWorkspace}
              />
              {postDeploymentMachineChangesEnabled &&
                !isNestedVirtualizationEnabled && (
                  <EditWorkspaceButton
                    disabled={EditsDisabled(
                      userProfile,
                      editableWorkspace,
                      originalWorkspace,
                      false,
                      isAdminSelection
                    )}
                    variant='CommandBarButton'
                    workspace={editableWorkspace}
                  />
                )}
              <DeleteWorkspaces
                isSingleWorkspace={true}
                workspaces={[editableWorkspace]}
                variant='CommandBarButton'
              />
              {privateModeEnabled && (
                <PrivateWorkspaceButton
                  disabled={
                    EditsDisabled(
                      userProfile,
                      editableWorkspace,
                      originalWorkspace
                    ) ||
                    privateModePending ||
                    privateModeRefreshPending ||
                    editableWorkspace.PrivateMode
                  }
                  variant='CommandBarButton'
                  workspace={editableWorkspace}
                />
              )}
              {extendWorkspaceRuntimeEnabled && (
                <ExtendWorkspaceRuntimeButton
                  disabled={
                    EditsDisabled(
                      userProfile,
                      editableWorkspace,
                      originalWorkspace
                    ) ||
                    !IsOn(editableWorkspace) ||
                    extendWorkspaceRuntimeRequestPending ||
                    extendRuntimeRefreshPending ||
                    userProfile.RuntimeExtensionHoursRemaining === 0 ||
                    constraint.DisableAutoShutDown
                  }
                  variant='CommandBarButton'
                  workspace={editableWorkspace}
                />
              )}
              {isAdminSelection && <AdminWorkspaceJsonPanel />}
            </div>
            {isAdminSelection && <AdminRefreshWorkspace />}
          </Stack>
        </Stack>
      </Stack>
      <Separator />
      <WorkspacePropertiesTabs />
    </Stack>
  );
};
