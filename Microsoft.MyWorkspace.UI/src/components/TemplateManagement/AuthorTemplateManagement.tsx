import * as React from 'react';
import {
  Text,
  Stack,
  PrimaryButton,
  IContextualMenuItem,
  useTheme,
  TooltipHost,
} from '@fluentui/react';
import { useSelector } from 'react-redux';
import {
  getAzureWorkspaces,
  getUserRoleAssignmentSegmentId,
} from 'src/store/selectors';
import { TemplateList } from './TemplateList';
import { TemplateCreationPanel } from './TemplateCreationPanel';
import { addIcon } from 'src/shared/Icons';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { getCommonStyles } from '../GeneralComponents/CommonStyles';
import {
  IsTransitioningState,
  IsFailed,
} from '../../shared/helpers/WorkspaceHelper';
import { useHistory } from 'react-router';
import { useQuery } from 'src/shared/useQuery';

export const AuthorTemplateManagement = () => {
  const history = useHistory();
  const query = useQuery();
  const workspaceId = React.useMemo(() => {
    return query.get('workspaceId');
  }, [query]);
  const segmentId = useSelector(getUserRoleAssignmentSegmentId);
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const workspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = React.useState(null);

  const menuItems: IContextualMenuItem[] = React.useMemo(() => {
    return workspaces
      .filter((w) => !IsTransitioningState(w.State) && !IsFailed(w))
      .map((workspace) => {
        return {
          key: workspace.Name,
          text: workspace.Name,
          onClick: () => {
            history.push(
              `/authorTemplateManagement?workspaceId=${workspace.ID}`
            );
          },
        };
      });
  }, [workspaces]);

  React.useEffect(() => {
    if (workspaces && workspaces.length > 0 && workspaceId !== null) {
      const workspace = workspaces.find((w) => w.ID === workspaceId);
      if (workspace) {
        setCurrentWorkspace(workspace);
      }
    }
  }, [workspaceId, workspaces]);

  return (
    <Stack
      className={`${commonStyles.margin20} ${commonStyles.container} ${commonStyles.fullHeight}`}
    >
      <Stack className={`${commonStyles.fullHeight} ${commonStyles.flexGrow} `}>
        <Text as='h1' variant='xxLarge'>
          Author Template Management
        </Text>
        <TemplateCreationPanel
          isCreationPanelOpen={
            workspaceId !== null && currentWorkspace !== null
          }
          closePanel={() => {
            setCurrentWorkspace(null);
            history.push('/authorTemplateManagement');
          }}
          workspace={currentWorkspace}
        />
        <TemplateList
          segmentId={segmentId}
          commandBarItems={
            <TooltipHost
              content={
                menuItems.length === 0
                  ? 'No eligible workspaces.'
                  : 'Create a template from a workspace.'
              }
            >
              <PrimaryButton
                text='New Template from Workspace'
                iconProps={addIcon}
                disabled={menuItems.length === 0}
                menuProps={{
                  shouldFocusOnMount: true,
                  shouldFocusOnContainer: true,
                  items: menuItems,
                }}
              />
            </TooltipHost>
          }
        />
      </Stack>
    </Stack>
  );
};

export default AuthorTemplateManagement;
