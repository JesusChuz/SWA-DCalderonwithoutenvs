import * as React from 'react';
import {
  Stack,
  Text,
  SearchBox,
  Spinner,
  SpinnerSize,
  useTheme,
} from '@fluentui/react';

import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { RbacSearchListView } from './RbacSearchListView';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminUserRoleAssignment,
  getAdminUserRoleAssignmentLoading,
} from '../../../store/selectors';
import {
  clearAdminUserRoleSearch,
  fetchAdminUserRoleAssignment,
} from '../../../store/actions';
import { NoUsersFound } from './NoUsersFound';

export const RbacSearch = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const RbacSearchResults = useSelector(getAdminUserRoleAssignment);
  const isSearchLoading = useSelector(getAdminUserRoleAssignmentLoading);

  const performSearch = (newValue: string) => {
    clearSearchResults();
    if (!newValue) {
      return;
    }
    dispatch(fetchAdminUserRoleAssignment(newValue));
  };

  React.useEffect(() => {
    clearSearchResults();
  }, []);

  const clearSearchResults = () => {
    dispatch(clearAdminUserRoleSearch());
  };

  const displayRbacResults = (): JSX.Element => {
    if (isSearchLoading) {
      return (
        <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
      );
    } else if (RbacSearchResults === null) {
      return <React.Fragment />;
    } else if (RbacSearchResults.UserRoleAssignments.length === 0) {
      return <NoUsersFound />;
    }
    return <RbacSearchListView />;
  };

  return (
    <div>
      <Stack className={commonStyles.container}>
        <Text as='h1' variant='xxLarge'>
          Role-based access control (RBAC) search
        </Text>
        <Stack>
          <SearchBox
            placeholder='Search for a user by object ID.'
            onSearch={performSearch}
            onClear={clearSearchResults}
          />
        </Stack>
        <Stack className={commonStyles.paddingTop12}>
          {displayRbacResults()}
        </Stack>
      </Stack>
    </div>
  );
};

export { RbacSearch as default };
