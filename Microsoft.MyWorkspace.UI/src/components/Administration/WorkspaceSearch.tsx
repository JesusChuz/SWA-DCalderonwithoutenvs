import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Stack,
  Text,
  SearchBox,
  Spinner,
  SpinnerSize,
  useTheme,
} from '@fluentui/react';

import { getCommonStyles } from '../GeneralComponents/CommonStyles';
import {
  getAzureWorkspaceSearchLoading,
  getAzureWorkspaceSearchResults,
} from '../../store/selectors/azureWorkspaceSelectors';
import {
  clearAzureWorkspaceSearch,
  searchAzureWorkspace,
} from '../../store/actions/azureWorkspaceActions';
import { NoWorkspacesFound } from './NoWorkspacesFound';
import { WorkspacesSearchListView } from './WorkspacesSearchListView';

export const WorkspaceSearch = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const workspaceSearchResults = useSelector(getAzureWorkspaceSearchResults);
  const isSearchLoading = useSelector(getAzureWorkspaceSearchLoading);

  const performSearch = (newValue: string) => {
    clearSearchResults();
    if (!newValue) {
      return;
    }
    dispatch(searchAzureWorkspace(newValue));
  };

  const clearSearchResults = () => {
    dispatch(clearAzureWorkspaceSearch());
  };

  const displayWorkspaceResults = (): JSX.Element => {
    if (isSearchLoading) {
      return (
        <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
      );
    } else if (workspaceSearchResults === null) {
      return <React.Fragment />;
    } else if (workspaceSearchResults.length === 0) {
      return <NoWorkspacesFound />;
    }
    return <WorkspacesSearchListView />;
  };

  return (
    <div>
      <Stack className={commonStyles.container}>
        <Text as='h1' variant='xxLarge'>
          Workspace Search
        </Text>
        <Stack>
          <SearchBox
            placeholder='Search for a workspace by owner ID, workspace ID, workspace name, virtual machine ID, or virtual machine name.'
            onSearch={performSearch}
            onClear={clearSearchResults}
          />
        </Stack>
        <Stack className={commonStyles.paddingTop12}>
          {displayWorkspaceResults()}
        </Stack>
      </Stack>
    </div>
  );
};

export { WorkspaceSearch as default };
