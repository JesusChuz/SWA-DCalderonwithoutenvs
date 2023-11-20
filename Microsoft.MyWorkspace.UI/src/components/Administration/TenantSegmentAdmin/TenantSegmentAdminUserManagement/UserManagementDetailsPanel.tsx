import {
  DefaultButton,
  FontIcon,
  Label,
  List,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { getUserManagementRequests } from '../../../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  showUserConfirmationDialog,
  updateUserManagementRequests,
} from '../../../../store/actions';
import {
  displayRequestStatus,
  filterValidationsFailuresWithErrorMessage,
  requiresApproval,
  requiresClean,
  sortValidationFailures,
  workspacesToDeleteCount,
} from '../../../../shared/helpers/UserManagementHelper';
import { getFormattedDateTime } from '../../../../shared/DateTimeHelpers';
import clsx from 'clsx';
import { ResourceType } from '../../../../types/AuthService/UserManagement/ResourceType.types';
import { ValidationFailure } from '../../../../types/AuthService/UserManagement/ValidationFailure.types';
import { UserManagementRequest } from 'src/types/AuthService/UserManagement/UserManagementRequest.types';

interface IProps {
  closePanel: () => void;
  userManagementRequestId: string;
}

export const UserManagementDetailsPanel = (props: IProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const userManagementRequests = useSelector(getUserManagementRequests);
  const currentUserManagementRequest = React.useMemo(() => {
    if (!props.userManagementRequestId) {
      return null;
    }
    return userManagementRequests.find(
      (request) => request.Id === props.userManagementRequestId
    );
  }, [userManagementRequests, props.userManagementRequestId]);

  const workspacesToDelete = workspacesToDeleteCount(
    currentUserManagementRequest?.ValidationFailures
  );

  const onRenderFooterContent = () => (
    <Stack>
      <Stack horizontal>
        {requiresApproval(currentUserManagementRequest?.RequestStatus) && (
          <>
            <PrimaryButton
              className={commonStyles.flexItem}
              style={{ alignSelf: 'flex-end' }}
              text='Approve'
              allowDisabledFocus
              onClick={() => {
                const requestRequiringClean = requiresClean(
                  currentUserManagementRequest.RequestStatus
                );
                if (requestRequiringClean) {
                  dispatch(
                    showUserConfirmationDialog(
                      'Warning',
                      `Approving this request will delete ${workspacesToDelete} workspace${
                        workspacesToDelete === 1 ? '' : 's'
                      }. Would you like to proceed?`,
                      () => {
                        dispatch(
                          updateUserManagementRequests(true, [
                            currentUserManagementRequest,
                          ])
                        );
                        props.closePanel();
                      }
                    )
                  );
                } else {
                  dispatch(
                    updateUserManagementRequests(true, [
                      currentUserManagementRequest,
                    ])
                  );
                  props.closePanel();
                }
              }}
            />
            <PrimaryButton
              className={commonStyles.flexItem}
              style={{ alignSelf: 'flex-end' }}
              text='Reject'
              allowDisabledFocus
              onClick={() => {
                dispatch(
                  updateUserManagementRequests(false, [
                    currentUserManagementRequest,
                  ])
                );
                props.closePanel();
              }}
            />
          </>
        )}

        <DefaultButton
          className={commonStyles.flexItem}
          text='Close'
          allowDisabledFocus
          onClick={props.closePanel}
        />
      </Stack>
    </Stack>
  );

  const getValidationErrorTitle = (
    validationFailure: ValidationFailure
  ): string => {
    const resourceType = validationFailure.ResourceType;
    switch (resourceType) {
      case ResourceType.User:
        return 'User Warning';
      case ResourceType.Segment:
        return 'Segment Warning';
      case ResourceType.WorkspaceToDelete:
        return `${validationFailure.ResourceName} will be deleted`;
      case ResourceType.WorkspaceToWarn:
        return 'Workspace Warning';
    }
  };

  const displayRequestRoles = (request: UserManagementRequest): string => {
    if (request.TenantSegmentAdminRole && request.TenantSegmentContributorRole)
      return 'Tenant Segment Admin, Tenant Segment Contributor';
    else if (request.TenantSegmentAdminRole) return 'Tenant Segment Admin';
    else return 'Tenant Segment Contributor';
  };

  return (
    <Panel
      isOpen={!!currentUserManagementRequest}
      onDismiss={props.closePanel}
      headerText='User Management Request Details'
      type={PanelType.medium}
      isFooterAtBottom={true}
      onRenderFooterContent={onRenderFooterContent}
      closeButtonAriaLabel='close'
    >
      {currentUserManagementRequest && (
        <Stack style={{ marginTop: 8 }} tokens={{ childrenGap: 8 }}>
          <Stack.Item>
            <Label>User Email</Label>
            <Text>{currentUserManagementRequest.UserEmail}</Text>
          </Stack.Item>
          <Stack.Item>
            <Label>Operation Type</Label>
            <Text>{currentUserManagementRequest.OperationType}</Text>
          </Stack.Item>
          <Stack.Item>
            <Label>Request Role(s)</Label>
            <Text>{displayRequestRoles(currentUserManagementRequest)}</Text>
          </Stack.Item>
          <Stack.Item>
            <Label>Request Status</Label>
            <Text>
              {displayRequestStatus(currentUserManagementRequest.RequestStatus)}
            </Text>
          </Stack.Item>
          <Stack.Item>
            <Label>Request Date</Label>
            <Text>
              {getFormattedDateTime(
                currentUserManagementRequest.RequestedOnDateTime
              )}
            </Text>
          </Stack.Item>

          <Stack.Item>
            <Label>Last Updated</Label>
            <Text>
              {getFormattedDateTime(
                currentUserManagementRequest.LastUpdatedDateTime
              )}
            </Text>
          </Stack.Item>
          {currentUserManagementRequest?.MovingFromSegmentName && (
            <Stack.Item>
              <Label>Moving From Segment</Label>
              <Text>{currentUserManagementRequest?.MovingFromSegmentName}</Text>
            </Stack.Item>
          )}
          {currentUserManagementRequest?.NewAssignedSegmentName && (
            <Stack.Item>
              <Label>Moving To Segment</Label>
              <Text>
                {currentUserManagementRequest?.NewAssignedSegmentName}
              </Text>
            </Stack.Item>
          )}
          <TextField
            disabled
            multiline
            label='Justification'
            placeholder='No Justification Provided'
            className={`${commonStyles.textFieldSpacing} ${commonStyles.width67}`}
            value={currentUserManagementRequest.Justification}
          />
          {filterValidationsFailuresWithErrorMessage(
            currentUserManagementRequest?.ValidationFailures
          ).length > 0 && (
            <Stack.Item>
              <Label>Warnings</Label>
              <List
                items={sortValidationFailures(
                  filterValidationsFailuresWithErrorMessage(
                    currentUserManagementRequest.ValidationFailures
                  )
                )}
                onRenderCell={(failure) => {
                  const isDeletion =
                    failure.ResourceType === ResourceType.WorkspaceToDelete;
                  return (
                    <Stack
                      horizontal
                      verticalAlign='start'
                      tokens={{ childrenGap: 8 }}
                      className={clsx(commonStyles.basicListStyle)}
                    >
                      <FontIcon
                        className={
                          isDeletion
                            ? commonStyles.errorText
                            : commonStyles.warningText
                        }
                        iconName={isDeletion ? 'Delete' : 'Warning'}
                      />
                      <Stack>
                        <Text
                          className={
                            isDeletion
                              ? commonStyles.errorTextBold
                              : commonStyles.warningTextBold
                          }
                        >
                          {getValidationErrorTitle(failure)}
                        </Text>
                        <Text
                          className={clsx(
                            isDeletion
                              ? commonStyles.errorText
                              : commonStyles.warningText,
                            commonStyles.whiteSpacePreLine
                          )}
                          style={{ lineHeight: '24px', marginBottom: '8px' }}
                        >
                          {`${failure.ErrorMessage}`}
                        </Text>
                      </Stack>
                    </Stack>
                  );
                }}
              />
            </Stack.Item>
          )}
        </Stack>
      )}
    </Panel>
  );
};
