import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getCatalogUserProfile,
  getJitAddresses,
  getJitAddressesForAdminWorkspace,
  getJitAddressesForAdminWorkspaceLoading,
} from '../../../store/selectors';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { getJitStatusText } from './JitRDP.utils';
import { fetchJitAddressesForAdminWorkspace } from '../../../store/actions';
import { getFormattedDateTime } from '../../../shared/DateTimeHelpers';

interface IProps {
  workspaceID: string;
}

export const AdminJitRDPList = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const userProfile = useSelector(getCatalogUserProfile);
  const jitAddresses: JitAddressDto[] = useSelector(getJitAddresses);
  const adminJitAddresses: JitAddressDto[] = useSelector(
    getJitAddressesForAdminWorkspace
  );
  const adminJitAddressesLoading: boolean = useSelector(
    getJitAddressesForAdminWorkspaceLoading
  );

  const columns: IColumn[] = [
    {
      key: 'user',
      name: 'User ID',
      fieldName: 'UserID',
      minWidth: 100,
      maxWidth: 250,
      isResizable: true,
    },
    {
      key: 'address',
      name: 'Address',
      fieldName: 'Address',
      minWidth: 75,
      maxWidth: 125,
      isResizable: true,
    },
    {
      key: 'status',
      name: 'Status',
      fieldName: 'Status',
      minWidth: 75,
      maxWidth: 125,
      isResizable: true,
      onRender: (jit: JitAddressDto) => (
        <Stack>
          <Text variant='small'>{getJitStatusText(jit)}</Text>
        </Stack>
      ),
    },
    {
      key: 'created',
      name: 'Created',
      fieldName: 'Created',
      minWidth: 125,
      maxWidth: 200,
      isResizable: true,
      onRender: (jit: JitAddressDto) => (
        <Stack>
          <Text variant='small'>{getFormattedDateTime(jit.Created)}</Text>
        </Stack>
      ),
    },
    {
      key: 'expiration',
      name: 'Expiration',
      fieldName: 'Expiration',
      minWidth: 125,
      maxWidth: 200,
      isResizable: true,
      onRender: (jit: JitAddressDto) => (
        <Stack>
          <Text variant='small'>{getFormattedDateTime(jit.Expiration)}</Text>
        </Stack>
      ),
    },
  ];

  React.useEffect(() => {
    if (props.workspaceID) {
      dispatch(fetchJitAddressesForAdminWorkspace(props.workspaceID));
    }
  }, [props.workspaceID]);

  React.useEffect(() => {
    if (
      jitAddresses.some(
        (jit) =>
          jit.UserID === userProfile.ID && jit.WorkspaceID === props.workspaceID
      ) ||
      adminJitAddresses.some(
        (jit) =>
          jit.UserID === userProfile.ID && jit.WorkspaceID == props.workspaceID
      )
    ) {
      dispatch(fetchJitAddressesForAdminWorkspace(props.workspaceID));
    }
  }, [jitAddresses]);

  return (
    <>
      {adminJitAddressesLoading ? (
        <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
      ) : (
        <Stack>
          <Stack.Item>
            <Text as='h3' variant='xLarge' className={commonStyles.margin0}>
              Workspace JIT Activations
            </Text>
          </Stack.Item>
          {adminJitAddresses && adminJitAddresses.length > 0 ? (
            <DetailsList
              items={adminJitAddresses}
              columns={columns}
              setKey='set'
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
              selectionPreservedOnEmptyClick={true}
            />
          ) : (
            <Text variant='medium' className={commonStyles.paddingTop12}>
              No JIT Activations
            </Text>
          )}
        </Stack>
      )}
    </>
  );
};
