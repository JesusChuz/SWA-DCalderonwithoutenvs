import * as React from 'react';
import {
  TooltipHost,
  IconButton,
  IButtonProps,
  IContextualMenuItem,
} from '@fluentui/react';

import { useDispatch, useSelector } from 'react-redux';

import { DeleteWorkspaces } from './DeleteWorkspaces';
import { useHistory } from 'react-router';

import { fetchAzureWorkspaces } from '../../../../../store/actions/azureWorkspaceActions';

import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';

import { StartWorkspaceButton } from './StartWorkspaceButton';
import { StopWorkspaceButton } from './StopWorkspaceButton';
import {
  getFeatureFlagAuthorTemplateCreation,
  getUserRoleAssignmentConstraint,
} from '../../../../../store/selectors';
import {
  IsFailed,
  IsTransitioningState,
} from '../../../../../shared/helpers/WorkspaceHelper';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';

export interface WorkspaceActionButtonProps {
  workspace: AzureWorkspaceDto;
  disabled?: boolean;
  actionFunction?: () => void;
  refreshWorkspaceFunction?: () => void;
  onDismiss?: () => void;
  endPoint?: string;
  variant: 'CommandBarButton' | 'ContextualMenuButton' | 'PrimaryButton';
}

interface IActionMenuProps extends IButtonProps {
  workspace: AzureWorkspaceDto;
  horizontal?: boolean;
}

export const WorkspaceActionsButton = (
  props: IActionMenuProps
): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const segmentConstraint = useSelector(getUserRoleAssignmentConstraint);
  const { workspace, horizontal } = { ...props };
  const featureFlagAuthorTemplateCreation = useSelector(
    getFeatureFlagAuthorTemplateCreation
  );

  const refreshWorkspaces = () => {
    dispatch(fetchAzureWorkspaces());
  };

  const getButton = () => {
    const items: IContextualMenuItem[] = [
      {
        key: workspace.ID + ' properties',
        text: 'Properties',
        role: 'menuitem',
        iconProps: { iconName: 'Edit' },
        onClick: () => history.push(workspace.ID),
      },
      {
        key: workspace.ID + ' start',
        onRender: (i, dismissMenu) => (
          <StartWorkspaceButton
            workspace={workspace}
            refreshWorkspaceFunction={refreshWorkspaces}
            variant='ContextualMenuButton'
            onDismiss={dismissMenu}
          />
        ),
      },
      {
        key: workspace.ID + ' stop',
        onRender: (i, dismissMenu) => (
          <StopWorkspaceButton
            workspace={workspace}
            refreshWorkspaceFunction={refreshWorkspaces}
            variant='ContextualMenuButton'
            onDismiss={dismissMenu}
          />
        ),
      },
      {
        key: workspace.ID + ' delete',
        onRender: (i, dismissMenu) => (
          <DeleteWorkspaces
            isSingleWorkspace={true}
            workspaces={[workspace]}
            variant='ContextualMenuButton'
            onDismiss={dismissMenu}
          />
        ),
      },
    ];
    if (
      featureFlagAuthorTemplateCreation &&
      segmentConstraint?.AllowTemplateCreation &&
      !IsTransitioningState(workspace.State) &&
      !IsFailed(workspace)
    ) {
      items.push({
        key: workspace.ID + ' template',
        text: 'Create Template',
        role: 'menuitem',
        iconProps: { iconName: 'WebTemplate' },
        onClick: () =>
          history.push(`/authorTemplateManagement?workspaceId=${workspace.ID}`),
      });
    }
    return (
      <IconButton
        id={workspace.ID}
        aria-label={`workspace properties for ${workspace.Name}`}
        className={props.className}
        iconProps={{ iconName: horizontal ? 'More' : 'MoreVertical' }}
        onRenderMenuIcon={() => null}
        menuProps={{
          items: items,
        }}
      />
    );
  };

  const toolTip = 'Actions';

  return <TooltipHost content={toolTip}>{getButton()}</TooltipHost>;
};
