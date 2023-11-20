import * as React from 'react';
import {
  DetailsList,
  IColumn,
  Text,
  SelectionMode,
  CheckboxVisibility,
  ISelection,
  IObjectWithKey,
  Selection,
  DetailsRow,
  IDetailsRowProps,
  IDetailsRowStyles,
  IconButton,
  Stack,
  useTheme,
  TooltipHost,
  FontIcon,
  Link,
} from '@fluentui/react';
import { useDispatch } from 'react-redux';
import { setSelectedUserManagementRequests } from '../../../../store/actions';
import { UserManagementRequest } from '../../../../types/AuthService/UserManagement/UserManagementRequest.types';
import { getFormattedDateTime } from '../../../../shared/DateTimeHelpers';
import {
  displayRequestStatus,
  filterValidationsFailuresWithErrorMessage,
  requiresApproval,
  requiresClean,
  workspacesToDeleteCount,
} from '../../../../shared/helpers/UserManagementHelper';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import clsx from 'clsx';
import { OperationType } from '../../../../types/AuthService/UserManagement/OperationType.types';
import { RequestStatus } from '../../../../types/AuthService/UserManagement/RequestStatus.types';

interface IProps {
  userManagementRequests: UserManagementRequest[];
  openDetailsPanel: (requestId: string) => void;
}

export const TenantSegmentAdminUserManagementList = (props: IProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const userManagementRequestSelection = new Selection<UserManagementRequest>({
    getKey: (item) => item.Id,
    onSelectionChanged: () => {
      dispatch(
        setSelectedUserManagementRequests(
          userManagementRequestSelection.getSelection()
        )
      );
    },
  });

  const onRenderRow = (props: IDetailsRowProps) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      customStyles.root = { userSelect: 'auto', cursor: 'auto' };
      customStyles.cell = { alignSelf: 'center' };
      customStyles.checkCell = { alignSelf: 'center' };
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const renderStatusIcon = (requestStatus: RequestStatus): JSX.Element => {
    switch (requestStatus) {
      case RequestStatus.MoveApproved:
      case RequestStatus.MoveApprovedWithClean:
      case RequestStatus.Completed:
        return (
          <FontIcon
            className={clsx(
              commonStyles.font14,
              commonStyles.successText,
              commonStyles.cursorDefault
            )}
            iconName='Completed'
          />
        );
      case RequestStatus.Rejected:
        return (
          <FontIcon
            className={clsx(
              commonStyles.font14,
              commonStyles.errorText,
              commonStyles.cursorDefault
            )}
            iconName='Blocked'
          />
        );
      case RequestStatus.WaitingForAdminConsent:
      case RequestStatus.WaitingForAdminConsentWithClean:
      case RequestStatus.WaitingForOperationChange:
        return (
          <FontIcon
            style={{ fontSize: 15 }}
            className={clsx(
              commonStyles.warningText,
              commonStyles.cursorDefault
            )}
            iconName='Error'
          />
        );
      default:
        return (
          <FontIcon
            style={{ fontSize: 15 }}
            className={clsx(commonStyles.font14, commonStyles.cursorDefault)}
            iconName='Clock'
          />
        );
    }
  };

  const columns: IColumn[] = [
    {
      key: 'Warnings',
      name: 'Warnings',
      minWidth: 35,
      maxWidth: 35,
      isIconOnly: true,
      onRender: (request: UserManagementRequest) => {
        const validationsFailuresWithErrorMessage =
          filterValidationsFailuresWithErrorMessage(
            request?.ValidationFailures
          );
        const workspaceDeletions = workspacesToDeleteCount(
          validationsFailuresWithErrorMessage
        );
        return (
          validationsFailuresWithErrorMessage.length > 0 && (
            <TooltipHost
              content={`${validationsFailuresWithErrorMessage.length} Warning${
                validationsFailuresWithErrorMessage.length === 1 ? '' : 's'
              }`}
            >
              <IconButton
                className={
                  workspaceDeletions >= 1
                    ? commonStyles.errorText
                    : commonStyles.warningText
                }
                ariaLabel='Warning'
                iconProps={{ iconName: 'Warning' }}
                onClick={() => props.openDetailsPanel(request.Id)}
              />
            </TooltipHost>
          )
        );
      },
    },
    {
      key: 'UserEmail',
      name: 'User Email',
      minWidth: 175,
      maxWidth: 250,
      onRender: (request: UserManagementRequest) => {
        return (
          <Text
            style={
              request.UserEmail == null ? { fontStyle: 'italic' } : undefined
            }
            variant='small'
          >{`${request.UserEmail ?? 'Email Not Found'}`}</Text>
        );
      },
    },
    {
      key: 'OperationType',
      name: 'Operation',
      minWidth: 80,
      maxWidth: 80,
      onRender: (request: UserManagementRequest) => {
        return <Text variant='small'>{request.OperationType}</Text>;
      },
    },
    {
      key: 'RequestStatus',
      name: 'Request Status',
      minWidth: 150,
      maxWidth: 175,
      onRender: (request: UserManagementRequest) => {
        const workspacesToDelete = workspacesToDeleteCount(
          request.ValidationFailures
        );
        const requestStatus = displayRequestStatus(request.RequestStatus);
        return (
          <Stack horizontal verticalAlign='center' tokens={{ childrenGap: 8 }}>
            {renderStatusIcon(request.RequestStatus)}
            {requiresApproval(request.RequestStatus) ? (
              <Link onClick={() => props.openDetailsPanel(request.Id)}>
                {requestStatus}
              </Link>
            ) : (
              <Text variant='small'>{requestStatus}</Text>
            )}
            {requiresClean(request.RequestStatus) && workspacesToDelete && (
              <TooltipHost
                styles={{ root: { height: 14 } }}
                content={`Approving this request will delete ${workspacesToDelete} workspace${
                  workspacesToDelete === 1 ? '' : 's'
                }.`}
              >
                <FontIcon
                  className={clsx(
                    workspacesToDelete >= 1
                      ? commonStyles.errorText
                      : commonStyles.warningText,
                    commonStyles.font14,
                    commonStyles.cursorDefault
                  )}
                  iconName='Delete'
                />
              </TooltipHost>
            )}
          </Stack>
        );
      },
    },

    {
      key: 'RequestedBy',
      name: 'Requested By',
      minWidth: 175,
      maxWidth: 250,
      onRender: (request: UserManagementRequest) => {
        return <Text variant='small'>{request.RequestedByUserEmail}</Text>;
      },
    },
    {
      key: 'RequestDate',
      name: 'Request Date',
      minWidth: 150,
      maxWidth: 200,
      onRender: (request: UserManagementRequest) => {
        return (
          <Text variant='small'>
            {getFormattedDateTime(request.RequestedOnDateTime)}
          </Text>
        );
      },
    },
    {
      key: 'NewSegment',
      name: 'New Segment',
      minWidth: 225,
      onRender: (request: UserManagementRequest) => {
        return (
          <Text variant='small'>
            {request.OperationType === OperationType.Remove
              ? ''
              : request.NewAssignedSegmentName}
          </Text>
        );
      },
    },
    {
      key: 'Details',
      name: 'Details',
      minWidth: 35,
      maxWidth: 35,
      isIconOnly: true,
      onRender: (request: UserManagementRequest) => {
        return (
          <IconButton
            iconProps={{ iconName: 'Info' }}
            ariaLabel='Details'
            onClick={() => props.openDetailsPanel(request.Id)}
          />
        );
      },
    },
  ];

  return (
    <DetailsList
      styles={{ root: { overflow: 'unset' } }}
      items={props.userManagementRequests}
      columns={columns}
      selection={userManagementRequestSelection as ISelection<IObjectWithKey>}
      checkboxVisibility={CheckboxVisibility.always}
      getKey={(item: UserManagementRequest) => item.Id}
      setKey='multiple'
      selectionMode={SelectionMode.multiple}
      checkButtonAriaLabel={'checkbox'}
      ariaLabelForSelectAllCheckbox={'select all checkbox'}
      onRenderRow={onRenderRow}
    />
  );
};
