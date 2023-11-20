import {
  CommandBar,
  Link,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import {
  getSelectedAdminSegment,
  getSelectedUserManagementRequests,
  getUpdateUserManagementRequestPending,
  getUserManagementRequests,
  getUserManagementRequestsContinuationToken,
  getUserManagementRequestsLoading,
} from '../../../../store/selectors';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { TenantSegmentAdminUserManagementList } from './TenantSegmentAdminUserManagementList';
import { UserManagementDetailsPanel } from './UserManagementDetailsPanel';
import { UserManagementApprovalPanel } from './UserManagementApprovalPanel';
import { requiresApproval } from '../../../../shared/helpers/UserManagementHelper';
import { appendUserManagementRequests } from '../../../../store/actions';

export const TenantSegmentAdminUserManagement = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const userManagementRequests = useSelector(getUserManagementRequests);
  const userManagementRequestsLoading = useSelector(
    getUserManagementRequestsLoading
  );
  const selectedSegment = useSelector(getSelectedAdminSegment);
  const userManagementRequestsContinuationToken = useSelector(
    getUserManagementRequestsContinuationToken
  );
  const selectedUserRequests = useSelector(getSelectedUserManagementRequests);
  const updateUserManagementRequestPending = useSelector(
    getUpdateUserManagementRequestPending
  );
  const [
    detailPanelUserManagementRequestId,
    setDetailPanelUserManagementRequestId,
  ] = React.useState<string>(null);
  const [approvalPanelState, setApprovalPanelState] = React.useState<{
    isOpen: boolean;
    approval: boolean;
  }>({
    isOpen: false,
    approval: false,
  });

  const buttonsDisabled =
    updateUserManagementRequestPending ||
    selectedUserRequests.length === 0 ||
    selectedUserRequests.some((r) => !requiresApproval(r.RequestStatus));

  return (
    <Stack className={`${commonStyles.fullHeight}`} tokens={{ childrenGap: 8 }}>
      <div className={commonStyles.marginTop16}>
        <CommandBar
          styles={{ root: { padding: 0 } }}
          items={[
            {
              key: 'Approve',
              text: 'Approve Selected',
              iconProps: { iconName: 'CheckMark' },
              disabled: buttonsDisabled,
              onClick: () =>
                setApprovalPanelState({ isOpen: true, approval: true }),
            },
            {
              key: 'Reject',
              text: 'Reject Selected',
              iconProps: { iconName: 'Blocked' },
              disabled: buttonsDisabled,
              onClick: () =>
                setApprovalPanelState({ isOpen: true, approval: false }),
            },
          ]}
        />
      </div>

      {userManagementRequestsLoading && userManagementRequests.length === 0 ? (
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
              <TenantSegmentAdminUserManagementList
                userManagementRequests={userManagementRequests}
                openDetailsPanel={(requestId: string) => {
                  setDetailPanelUserManagementRequestId(requestId);
                }}
              />
            </Stack>
          </Stack>
          <Stack style={{ marginBottom: 8 }} tokens={{ childrenGap: 8 }}>
            <Stack horizontalAlign='center'>
              <Text>{`${userManagementRequests.length} Request${
                userManagementRequests.length === 1 ? '' : 's'
              } Displayed`}</Text>
            </Stack>
            <Stack
              horizontal
              horizontalAlign='center'
              tokens={{ childrenGap: 4 }}
              className={
                !userManagementRequestsContinuationToken
                  ? commonStyles.visibilityHidden
                  : undefined
              }
            >
              <Link
                onClick={() => {
                  dispatch(
                    appendUserManagementRequests(
                      selectedSegment.ID,
                      userManagementRequestsContinuationToken
                    )
                  );
                }}
                disabled={userManagementRequestsLoading}
              >
                Load More
              </Link>
              {userManagementRequestsLoading && (
                <Spinner size={SpinnerSize.xSmall}></Spinner>
              )}
            </Stack>
          </Stack>
        </>
      )}
      <UserManagementDetailsPanel
        userManagementRequestId={detailPanelUserManagementRequestId}
        closePanel={() => setDetailPanelUserManagementRequestId(null)}
      />
      <UserManagementApprovalPanel
        isOpen={approvalPanelState.isOpen}
        approval={approvalPanelState.approval}
        closePanel={() =>
          setApprovalPanelState({ isOpen: false, approval: false })
        }
        openDetailsPanel={(requestId: string) => {
          setDetailPanelUserManagementRequestId(requestId);
        }}
      />
    </Stack>
  );
};
