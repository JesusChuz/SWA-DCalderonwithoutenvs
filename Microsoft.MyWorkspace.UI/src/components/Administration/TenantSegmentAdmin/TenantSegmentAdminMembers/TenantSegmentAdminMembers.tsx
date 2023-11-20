import {
  Stack,
  Text,
  Spinner,
  SpinnerSize,
  SearchBox,
  Link,
  CommandBar,
  ICommandBarItemProps,
  useTheme,
  ActionButton,
  TagItem,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDeleteUsersLoading,
  getFeatureFlagCsvDownloadButton,
  getFeatureFlagMoveTenantSegmentUser,
  getFeatureFlagRemoveTenantSegmentUser,
  getFeatureFlagUserManagementBulkOperations,
  getSegmentMemberEmailSearchQuery,
  getSegmentMemberUserExistsFilter,
  getSegmentMembers,
  getSegmentMembersContinuationToken,
  getSegmentMembersLoading,
  getSelectedAdminSegment,
  getSelectedUsers,
} from '../../../../store/selectors';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { TenantSegmentAdminMembersList } from './TenantSegmentAdminMembersList';
import {
  appendSegmentMembers,
  fetchSegmentMembers,
  setSelectedUsers,
  setTenantSegmentMemberEmailSearchQuery,
  setTenantSegmentMemberUserExistsFilter,
} from '../../../../store/actions';
import * as React from 'react';
import { getAdminViewStyles } from '../../AdministrationViews.styles';
import { downloadJsonAsCSV } from '../../../../shared/utilities/DownloadUtil';
import dayjs from 'dayjs';
import { LightUserRoleAssignmentDto } from '../../../../types/AuthService/LightUserRoleAssignmentDto.types';
import { RemoveTenantSegmentUserPanel } from './RemoveTenantSegmentUserPanel';
import { AddMoveTenantSegmentUserPanel } from './AddMoveTenantSegmentUserPanel';
import { OperationType } from '../../../../types/AuthService/UserManagement/OperationType.types';
import { BulkAddTenantSegmentUserPanel } from './BulkAddTenantSegmentUserPanel';
import store from 'src/store/store';

export const TenantSegmentAdminMembers = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAdminViewStyles(theme);
  const segmentMembers = useSelector(getSegmentMembers);
  const segmentMembersLoading = useSelector(getSegmentMembersLoading);
  const selectedSegment = useSelector(getSelectedAdminSegment);
  const segmentMembersContinuationToken = useSelector(
    getSegmentMembersContinuationToken
  );
  const emailSearchQuery = useSelector(getSegmentMemberEmailSearchQuery);
  const selectedUsers = useSelector(getSelectedUsers);
  const downloadCsvButtonEnabled = useSelector(getFeatureFlagCsvDownloadButton);
  const removeUserFeatureFlag = useSelector(
    getFeatureFlagRemoveTenantSegmentUser
  );
  const moveUserFeatureFlag = useSelector(getFeatureFlagMoveTenantSegmentUser);
  const userManagementBulkOperationsFeatureFlag = useSelector(
    getFeatureFlagUserManagementBulkOperations
  );
  const deleteLoading = useSelector(getDeleteUsersLoading);
  const [searchValue, setSearchValue] = React.useState(emailSearchQuery ?? '');
  const userExistsFilter = useSelector(getSegmentMemberUserExistsFilter);
  const [openedTenantUserPanel, setOpenedTenantUserPanel] = React.useState<
    'none' | 'add' | 'remove' | 'move'
  >('none');

  const exportAndDownloadCsv = (members: LightUserRoleAssignmentDto[]) => {
    const convertedJson = members.map((mem) => ({
      'User ID': mem.UserId,
      Email: mem.Email,
      'User Role(s)': mem.LightRoleAssignments.filter(
        (u) => u.SegmentDefinitionId == selectedSegment.ID
      )
        .map((ra) => ra.RoleDisplayName)
        .join(', '),
      'User Exists': mem.UserExists ? 'Yes' : 'No',
    }));
    downloadJsonAsCSV(
      dispatch,
      convertedJson,
      `${selectedSegment.Name}-SegmentMembers-${dayjs().format('YYMMDD')}.csv`,
      ['User ID', 'Email', 'User Role(s)', 'User Exists']
    );
  };

  const downloadAllMembers = async (): Promise<
    LightUserRoleAssignmentDto[]
  > => {
    const pageSize = 1000;
    let continuationToken = segmentMembersContinuationToken;
    const members: LightUserRoleAssignmentDto[] = [...segmentMembers];
    if (!continuationToken) {
      return members;
    }
    while (continuationToken) {
      const data = await appendSegmentMembers(
        selectedSegment,
        continuationToken,
        emailSearchQuery,
        pageSize
      )(dispatch, store.getState);
      continuationToken = data.ContinuationToken;
      members.push(...data.ResultSet);
    }
    return members;
  };

  const commandBarItems: ICommandBarItemProps[] = React.useMemo(() => {
    const items: ICommandBarItemProps[] = [
      {
        key: 'Add',
        text: `Add${userManagementBulkOperationsFeatureFlag ? ' Users' : ''}`,
        iconProps: { iconName: 'Add' },
        onClick: () => setOpenedTenantUserPanel('add'),
        ['data-custom-parentid']: 'Tenant Segment Admin Members - Add Panel',
      },
    ];
    if (moveUserFeatureFlag && !userManagementBulkOperationsFeatureFlag) {
      items.push({
        key: 'Move',
        text: 'Move',
        iconProps: { iconName: 'Switch' },
        onClick: () => setOpenedTenantUserPanel('move'),
        ['data-custom-parentid']: 'Tenant Segment Admin Members - Move Panel',
      });
    }
    if (removeUserFeatureFlag) {
      items.push({
        key: 'Delete',
        text: 'Delete Selected',
        iconProps: { iconName: 'Delete' },
        onClick: () => setOpenedTenantUserPanel('remove'),
        disabled: selectedUsers.length === 0 || deleteLoading,
        ['data-custom-parentid']: 'Tenant Segment Admin Members - Delete Panel',
      });
    }
    if (downloadCsvButtonEnabled) {
      items.push({
        key: 'Export',
        text: 'Export to CSV',
        iconProps: { iconName: 'Download' },
        disabled: !segmentMembers || segmentMembersLoading || !selectedSegment,
        subMenuProps: {
          items: [
            {
              key: 'exportDisplayedMembers',
              text: 'Export Displayed Members',
              onClick: () => exportAndDownloadCsv(segmentMembers),
            },
            {
              key: 'exportAllMembers',
              text: 'Export All Members',
              onClick: () =>
                downloadAllMembers().then((res) => exportAndDownloadCsv(res)),
            },
          ],
        },
        ['data-custom-parentid']:
          'Tenant Segment Admin Members - Export to CSV',
      });
    }
    items.push({
      key: 'Refresh',
      text: 'Refresh',
      iconProps: { iconName: 'Refresh' },
      ariaLabel: 'Refresh',
      onClick: () => {
        dispatch(fetchSegmentMembers(selectedSegment, emailSearchQuery));
        dispatch(setSelectedUsers([]));
      },
      ['data-custom-parentid']: 'Tenant Segment Admin Members - Refresh Button',
    });
    return items;
  }, [
    segmentMembers,
    segmentMembersLoading,
    selectedSegment,
    downloadCsvButtonEnabled,
    moveUserFeatureFlag,
    removeUserFeatureFlag,
    selectedUsers,
    deleteLoading,
    userManagementBulkOperationsFeatureFlag,
  ]);

  const dismissPanel = () => setOpenedTenantUserPanel('none');

  return (
    <Stack
      className={`${commonStyles.fullHeight} ${styles.maxTenantSegmentAdminTabWidth}`}
      tokens={{ childrenGap: 8 }}
    >
      <div className={commonStyles.marginTop16}>
        <CommandBar
          styles={{ root: { padding: 0 } }}
          items={commandBarItems}
          farItems={[
            {
              key: 'Filters',
              onRender: () => {
                if (userExistsFilter !== null) {
                  return (
                    <Stack verticalAlign='center' horizontal>
                      <Text>Filtered by: </Text>
                      <TagItem
                        item={
                          userExistsFilter
                            ? { name: 'User Exists', key: 'userExists' }
                            : {
                                name: 'User Does Not Exist',
                                key: 'userDoesNotExist',
                              }
                        }
                        index={0}
                        onRemoveItem={() =>
                          dispatch(setTenantSegmentMemberUserExistsFilter(null))
                        }
                      >
                        {userExistsFilter
                          ? 'User Exists'
                          : 'User Does Not Exist'}
                      </TagItem>
                    </Stack>
                  );
                } else {
                  return <></>;
                }
              },
            },
            {
              key: 'Filter',
              onRender: () => {
                return (
                  <Stack verticalAlign='center' horizontal>
                    <ActionButton
                      title='Add Filters'
                      iconProps={{ iconName: 'Filter' }}
                      aria-label='Add Filters'
                      menuIconProps={{
                        style: {
                          display: 'none',
                        },
                      }}
                      menuProps={{
                        shouldFocusOnMount: true,
                        items: [
                          {
                            key: 'userExists',
                            text: 'User Exists',
                            onClick: () => {
                              dispatch(
                                setTenantSegmentMemberUserExistsFilter(
                                  userExistsFilter === true ? null : true
                                )
                              );
                            },
                            canCheck: true,
                            isChecked: userExistsFilter,
                          },
                          {
                            key: 'userDoesNotExist',
                            text: 'User Does Not Exist',
                            onClick: () => {
                              dispatch(
                                setTenantSegmentMemberUserExistsFilter(
                                  userExistsFilter === false ? null : false
                                )
                              );
                            },
                            canCheck: true,
                            isChecked: userExistsFilter === false,
                          },
                        ],
                      }}
                    />
                  </Stack>
                );
              },
            },
            {
              key: 'Search',
              onRender: () => (
                <SearchBox
                  styles={{
                    root: { flexGrow: 1, alignSelf: 'center', width: 270 },
                  }}
                  value={searchValue}
                  name='tenantSegmentMemberEmailSearch'
                  onSearch={(newValue) =>
                    dispatch(setTenantSegmentMemberEmailSearchQuery(newValue))
                  }
                  onClear={() => {
                    dispatch(setTenantSegmentMemberEmailSearchQuery(null));
                    setSearchValue('');
                  }}
                  onChange={(event, newValue) => setSearchValue(newValue)}
                  placeholder='Search By Email'
                  autoComplete='off'
                />
              ),
            },
          ]}
        />
      </div>
      {segmentMembersLoading && segmentMembers.length === 0 ? (
        <Stack
          horizontal
          horizontalAlign='center'
          style={{ marginTop: 32, marginBottom: 32 }}
        >
          <Spinner size={SpinnerSize.large} />
        </Stack>
      ) : (
        <>
          <Stack
            horizontal
            className={`${commonStyles.overflowYAuto} ${commonStyles.flexGrow}`}
          >
            <Stack className={commonStyles.fullWidth}>
              <TenantSegmentAdminMembersList segmentMembers={segmentMembers} />
            </Stack>
          </Stack>
          <Stack style={{ marginBottom: 8 }} tokens={{ childrenGap: 8 }}>
            <Stack horizontalAlign='center'>
              <Text>{`${segmentMembers.length} Segment Member${
                segmentMembers.length === 1 ? '' : 's'
              } Displayed`}</Text>
            </Stack>
            <Stack
              horizontal
              horizontalAlign='center'
              tokens={{ childrenGap: 4 }}
              className={
                !segmentMembersContinuationToken
                  ? commonStyles.visibilityHidden
                  : undefined
              }
            >
              <Link
                onClick={() => {
                  dispatch(
                    appendSegmentMembers(
                      selectedSegment,
                      segmentMembersContinuationToken,
                      emailSearchQuery
                    )
                  );
                }}
                disabled={segmentMembersLoading}
              >
                Load More
              </Link>
              {segmentMembersLoading && (
                <Spinner size={SpinnerSize.xSmall}></Spinner>
              )}
            </Stack>
          </Stack>
        </>
      )}
      {userManagementBulkOperationsFeatureFlag ? (
        <BulkAddTenantSegmentUserPanel
          openTenantUserPanel={openedTenantUserPanel === 'add'}
          dismissPanel={dismissPanel}
          currentSegment={selectedSegment}
        />
      ) : (
        <AddMoveTenantSegmentUserPanel
          openTenantUserPanel={openedTenantUserPanel === 'add'}
          dismissPanel={dismissPanel}
          segment={selectedSegment}
          operationType={OperationType.Add}
        />
      )}
      <AddMoveTenantSegmentUserPanel
        openTenantUserPanel={openedTenantUserPanel === 'move'}
        dismissPanel={dismissPanel}
        segment={selectedSegment}
        operationType={OperationType.Move}
      />
      <RemoveTenantSegmentUserPanel
        openTenantUserPanel={openedTenantUserPanel === 'remove'}
        dismissPanel={dismissPanel}
        segment={selectedSegment}
      />
    </Stack>
  );
};
