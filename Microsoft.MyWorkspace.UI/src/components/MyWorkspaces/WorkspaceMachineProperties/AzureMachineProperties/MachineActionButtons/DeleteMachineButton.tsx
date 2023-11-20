import * as React from 'react';

import { CommandBarButton, TooltipHost, useTheme } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { showUserConfirmationDialog } from '../../../../../store/actions';
import {
  editableWorkspaceRemoveConfiguredMachine,
  editableWorkspaceSaveChanges,
} from '../../../../../store/actions/editableWorkspaceActions';
import { validateDomainControllerRoleHasMembers } from '../../../../../store/validators/workspaceValidators';
import { DomainRoles } from '../../../../../types/AzureWorkspace/enums/DomainRoles';
import { ResourceStateMap } from '../../../../../types/AzureWorkspace/enums/ResourceStateMap';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import {
  CheckSharedOwner,
  IsTransitioning,
} from '../../../../../shared/helpers/WorkspaceHelper';
import { contextMenuStyles, MachineProps } from './MachineActionButtons.utils';
import { getEditableWorkspaceVirtualMachines } from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { useHistory } from 'react-router-dom';
import {
  getAzureWorkspaces,
  getCatalogUserProfile,
} from '../../../../../store/selectors';

export const DeleteMachineButton = (props: MachineProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();
  const editableWorkspaceMachines = useSelector(
    getEditableWorkspaceVirtualMachines
  );
  const user = useSelector(getCatalogUserProfile);
  const history = useHistory();
  const transitioning =
    IsTransitioning(props.machine) || IsTransitioning(props.workspace);
  const workspaces = useSelector(getAzureWorkspaces);

  const disabled = React.useMemo(() => {
    // in non admin view, we want to use the original workspace so a user can't remove themselves
    // as shared owner, and before saving now have perms to perform owner actions
    const ws = workspaces.find((w) => w.ID === props.workspace.ID);
    return (
      transitioning ||
      CheckSharedOwner(user, ws === undefined ? props.workspace : ws)
    );
  }, [workspaces, props.workspace]);

  const callback = async () => {
    const vmIndex = editableWorkspaceMachines.findIndex(
      (vm) => (vm as AzureVirtualMachineDto).ID === props.machine.ID
    );
    await dispatch(editableWorkspaceRemoveConfiguredMachine(vmIndex));
    history.push(`/${props.workspace.ID}`);
    dispatch(editableWorkspaceSaveChanges());
  };

  const deleteMachineAndSave = async () => {
    let message =
      'Deleting this virtual machine is a permanent action. The change may take several minutes.';
    if (
      props.machine.DomainRole === DomainRoles.DomainController &&
      validateDomainControllerRoleHasMembers(
        editableWorkspaceMachines,
        props.machine.DomainID
      )
    ) {
      message +=
        ' This will also result in all current domain members in this domain being switched to Workgroup.';
    }
    dispatch(
      showUserConfirmationDialog('Do you want to proceed?', message, callback)
    );
  };

  const getButton = () => (
    <CommandBarButton
      className={
        props.variant === 'CommandBarButton'
          ? commonStyles.commandBarButton
          : commonStyles.contextMenuButton
      }
      ariaLabel={
        transitioning
          ? `Disabled while ${ResourceStateMap[props.machine.State]}`
          : 'Delete Machine'
      }
      disabled={disabled}
      text='Delete'
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={{
        iconName: 'Delete',
        styles:
          props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
      }}
      onClick={deleteMachineAndSave}
      data-custom-parentid='Delete Machine Button'
    />
  );

  const toolTip = transitioning
    ? `Can not delete machine when ${ResourceStateMap[props.machine.State]}`
    : 'Delete Machine';

  const getComponent = () => {
    if (props.variant === 'CommandBarButton') {
      return <TooltipHost content={toolTip}>{getButton()}</TooltipHost>;
    } else {
      return getButton();
    }
  };

  return getComponent();
};
