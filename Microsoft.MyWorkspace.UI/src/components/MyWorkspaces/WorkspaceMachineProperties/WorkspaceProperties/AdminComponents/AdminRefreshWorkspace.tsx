import * as React from 'react';
import { IconButton, Spinner, TooltipHost, useTheme } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchAdminAzureWorkspace,
  fetchAdminWorkspaceScheduleJob,
  fetchJitAddressesForAdminWorkspace,
} from '../../../../../store/actions';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { getEditableWorkspace } from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getAdminWorkspaceIsLoading } from '../../../../../store/selectors';

export const AdminRefreshWorkspace = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const workspace: AzureWorkspaceDto = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const isRefreshing: boolean = useSelector(getAdminWorkspaceIsLoading);

  const refreshWorkspace = async () => {
    dispatch(fetchJitAddressesForAdminWorkspace(workspace.ID));
    await fetchAdminAzureWorkspace(workspace.ID)(dispatch);
    dispatch(fetchAdminWorkspaceScheduleJob(workspace.ID));
  };

  return (
    <>
      {isRefreshing ? (
        <Spinner className={commonStyles.paddingTop8} />
      ) : (
        <TooltipHost content={'Refresh Workspace'}>
          <IconButton
            className={commonStyles.fullHeight}
            ariaLabel='refresh workspace'
            iconProps={{ iconName: 'Refresh' }}
            onClick={() => {
              refreshWorkspace();
            }}
          />
        </TooltipHost>
      )}
    </>
  );
};
