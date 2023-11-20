import {
  IContextualMenuProps,
  CommandBarButton,
  TooltipHost,
  useTheme,
  IContextualMenuItem,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  extendAzureWorkspaceRuntime,
  showDefaultNotification,
  showSuccessNotification,
} from '../../../../../store/actions';
import {
  getCatalogUserProfile,
  getExtendWorkspaceRuntimeRequestPending,
  getAzureWorkspacesLoadingStatus,
} from '../../../../../store/selectors';
import { ResourceStateMap } from '../../../../../types/AzureWorkspace/enums/ResourceStateMap';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { IsOn } from '../../../../../shared/helpers/WorkspaceHelper';
import { contextMenuStyles } from '../../AzureMachineProperties/MachineActionButtons/MachineActionButtons.utils';
import { WorkspaceActionButtonProps } from './WorkspaceActionButtons';

export const ExtendWorkspaceRuntimeButton = (
  props: WorkspaceActionButtonProps
): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const disabled = props.disabled;
  const userProfile = useSelector(getCatalogUserProfile);
  const extendWorkspaceRuntimeRequestPending = useSelector(
    getExtendWorkspaceRuntimeRequestPending
  );
  const azureWorkspaceLoading = useSelector(getAzureWorkspacesLoadingStatus);
  const maxHoursInContextMenu = 8;
  const menuProps: IContextualMenuProps = {
    onItemClick: (ev, item) => {
      changeWorkspaceRuntime(item);
    },
    items: Array(
      Math.min(
        userProfile.RuntimeExtensionHoursRemaining,
        maxHoursInContextMenu
      )
    )
      .fill(0)
      .map((_, i) => ({
        key: `${i + 1}`,
        text: `${i + 1} hour${i + 1 === 1 ? '' : 's'}`,
      })),
  };

  const changeWorkspaceRuntime = async (item: IContextualMenuItem) => {
    const result: boolean = await extendAzureWorkspaceRuntime(
      props.workspace,
      parseInt(item.key)
    )(dispatch);

    if (result) {
      dispatch(
        showSuccessNotification(
          'Workspace runtime has been successfully extended.'
        )
      );

      if (props.refreshWorkspaceFunction) {
        props.refreshWorkspaceFunction();
      }
    }
  };

  const extensionRequested = React.useMemo(() => {
    if (extendWorkspaceRuntimeRequestPending) {
      dispatch(
        showDefaultNotification('Workspace extension request is processing.')
      );
    }
  }, [extendWorkspaceRuntimeRequestPending]);

  const getButton = () => (
    <CommandBarButton
      className={
        props.variant === 'CommandBarButton'
          ? commonStyles.commandBarButton
          : commonStyles.contextMenuButton
      }
      ariaLabel={
        !IsOn(props.workspace)
          ? `disabled while ${ResourceStateMap[props.workspace.State]}`
          : 'extend workspace runtime'
      }
      disabled={disabled}
      menuProps={menuProps}
      text={
        extendWorkspaceRuntimeRequestPending || azureWorkspaceLoading
          ? 'Processing Request'
          : 'Extend Runtime'
      }
      role={props.variant === 'ContextualMenuButton' ? 'menuitem' : 'button'}
      iconProps={{
        iconName: 'Clock',
        styles:
          props.variant === 'ContextualMenuButton' ? contextMenuStyles : null,
      }}
      data-custom-parentid='Extend Workspace Button'
    />
  );

  const getTooltip = () => {
    if (!IsOn(props.workspace)) {
      return 'Can not extend workspace runtime when workspace is not running';
    }
    if (extendWorkspaceRuntimeRequestPending || azureWorkspaceLoading) {
      return 'A WorkspaceRuntime Extension Request is pending';
    }
    if (userProfile.RuntimeExtensionHoursRemaining === 0) {
      return 'Workspace runtime can not be extended any further this week';
    }
    return '';
  };

  const getComponent = () => {
    if (props.variant === 'CommandBarButton') {
      return <TooltipHost content={getTooltip()}>{getButton()}</TooltipHost>;
    } else {
      return getButton();
    }
  };

  return getComponent();
};
