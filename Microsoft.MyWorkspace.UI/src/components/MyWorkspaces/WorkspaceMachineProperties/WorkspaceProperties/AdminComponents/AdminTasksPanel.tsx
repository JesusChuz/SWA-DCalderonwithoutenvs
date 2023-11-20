import {
  ColumnActionsMode,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IconButton,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getWorkspacePropertiesStyles } from '../WorkspaceProperties.styles';
import {
  getSelectedAdminWorkspaceTasks,
  getSelectedAdminWorkspaceTasksLoading,
} from '../../../../../store/selectors';
import { fetchAdminWorkspaceTasks } from '../../../../../store/actions';
import { getEditableWorkspace } from '../../../../../store/selectors/editableWorkspaceSelectors';
import {
  getTaskOperationText,
  getTaskResourceCreationDate,
  TaskStatusDotIcon,
  getTaskStatusText,
} from './AdminTasksPanel.utils';
import { AdminTaskJsonPanel } from './AdminTaskJsonPanel';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import clsx from 'clsx';
import { adminRetryTask } from '../../../../../store/actions/azureWorkspaceActions';

export const AdminTasksPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const tasks = useSelector(getSelectedAdminWorkspaceTasks);
  const tasksLoading = useSelector(getSelectedAdminWorkspaceTasksLoading);

  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;

  React.useEffect(() => {
    if (editableWorkspace && !tasksLoading) {
      dispatch(fetchAdminWorkspaceTasks(editableWorkspace.ID));
    }
  }, [editableWorkspace]);

  const columns: IColumn[] = [
    {
      key: 'type',
      name: 'Type',
      fieldName: 'Type',
      minWidth: 100,
      maxWidth: 220,
      isResizable: true,
    },
    {
      key: 'operation',
      name: 'Operation',
      minWidth: 100,
      maxWidth: 100,
      isResizable: true,
      onRender: (taskObject) => (
        <Stack>
          <Text variant='small'>
            {getTaskOperationText(taskObject.Resource?.Operation)}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'id',
      name: 'ID',
      fieldName: 'id',
      minWidth: 100,
      maxWidth: 250,
      isResizable: true,
    },
    {
      key: 'status',
      name: 'Status',
      minWidth: 120,
      maxWidth: 120,
      isResizable: true,
      onRender: (taskObject) => (
        <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 4 }}>
          <TaskStatusDotIcon taskStatus={taskObject.Resource?.Status} />
          <Text variant='small'>
            {getTaskStatusText(taskObject.Resource?.Status)}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'created',
      name: 'Created',
      minWidth: 120,
      maxWidth: 120,
      isResizable: true,
      onRender: (taskObject) => (
        <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 4 }}>
          <Text variant='small'>
            {getTaskResourceCreationDate(taskObject.Resource)}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'json',
      isIconOnly: true,
      name: '',
      ariaLabel: 'json view',
      minWidth: 40,
      columnActionsMode: ColumnActionsMode.disabled,
      isResizable: true,
      onRender: (taskObject) => (
        <Stack horizontalAlign='end'>
          <AdminTaskJsonPanel taskResourceJson={taskObject.Resource} />
        </Stack>
      ),
    },
    {
      key: 'retry',
      isIconOnly: true,
      name: '',
      ariaLabel: 'retry task',
      minWidth: 40,
      columnActionsMode: ColumnActionsMode.disabled,
      isResizable: true,
      onRender: (taskObject) => (
        <Stack horizontalAlign='end'>
          <TooltipHost content={'Retry Task'}>
            <IconButton
              ariaLabel='retry task button'
              iconProps={{ iconName: 'RemoveOccurrence' }}
              onClick={() =>
                dispatch(adminRetryTask(taskObject.id, taskObject.Type))
              }
            />
          </TooltipHost>
        </Stack>
      ),
    },
  ];

  return (
    <Stack className={styles.propertiesContent}>
      {tasksLoading ? (
        <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
      ) : (
        <Stack
          className={clsx(
            commonStyles.paddingTop12,
            commonStyles.autoOverflow90
          )}
        >
          <Stack.Item>
            <Text as='h3' variant='xLarge' className={commonStyles.margin0}>
              Workspace Tasks
            </Text>
          </Stack.Item>
          {tasks && tasks.length > 0 && (
            <DetailsList
              items={tasks}
              columns={columns}
              setKey='tasks'
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
              selectionPreservedOnEmptyClick={true}
              onShouldVirtualize={() => false}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};
