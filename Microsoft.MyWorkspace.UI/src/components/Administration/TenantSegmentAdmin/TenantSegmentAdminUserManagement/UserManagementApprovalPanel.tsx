import {
  DefaultButton,
  FontIcon,
  IconButton,
  Label,
  List,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { getSelectedUserManagementRequests } from '../../../../store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { clsx } from 'clsx';
import { UserManagementRequest } from '../../../../types/AuthService/UserManagement/UserManagementRequest.types';
import {
  showUserConfirmationDialog,
  updateUserManagementRequests,
} from '../../../../store/actions';
import {
  filterValidationsFailuresWithErrorMessage,
  requiresClean,
  workspacesToDeleteCount,
} from '../../../../shared/helpers/UserManagementHelper';
interface IProps {
  closePanel: () => void;
  approval: boolean;
  isOpen: boolean;
  openDetailsPanel: (requestId: string) => void;
}

export const UserManagementApprovalPanel = (props: IProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const selectedUserManagementRequests = useSelector(
    getSelectedUserManagementRequests
  );

  const onRenderFooterContent = () => (
    <Stack>
      <Stack horizontal>
        <PrimaryButton
          className={commonStyles.flexItem}
          style={{ alignSelf: 'flex-end' }}
          text={props.approval ? 'Approve' : 'Reject'}
          allowDisabledFocus
          onClick={() => {
            const requestsRequiringClean =
              selectedUserManagementRequests.filter((r) =>
                requiresClean(r.RequestStatus)
              );
            if (props.approval && requestsRequiringClean.length > 0) {
              dispatch(
                showUserConfirmationDialog(
                  'Warning',
                  `${requestsRequiringClean.length} selected request${
                    requestsRequiringClean.length === 1 ? '' : 's'
                  } will result in workspace deletion. Would you like to proceed?`,
                  () => {
                    dispatch(
                      updateUserManagementRequests(
                        props.approval,
                        selectedUserManagementRequests
                      )
                    );
                    props.closePanel();
                  }
                )
              );
            } else {
              dispatch(
                updateUserManagementRequests(
                  props.approval,
                  selectedUserManagementRequests
                )
              );
              props.closePanel();
            }
          }}
        />
        <DefaultButton
          className={commonStyles.flexItem}
          text='Cancel'
          allowDisabledFocus
          onClick={props.closePanel}
        />
      </Stack>
    </Stack>
  );

  return (
    <Panel
      isOpen={props.isOpen}
      onDismiss={props.closePanel}
      headerText={`${
        props.approval ? 'Approve' : 'Reject'
      } User Management Request${
        selectedUserManagementRequests?.length === 1 ? '' : 's'
      }`}
      type={PanelType.medium}
      isFooterAtBottom={true}
      onRenderFooterContent={onRenderFooterContent}
      closeButtonAriaLabel='close'
    >
      <Stack style={{ marginTop: 8 }}>
        <Label>{`Selected Users Request${
          selectedUserManagementRequests?.length === 1 ? '' : 's'
        }`}</Label>
        <List
          items={selectedUserManagementRequests}
          onRenderCell={(userRequest: UserManagementRequest) => {
            const validationsFailuresWithErrorMessage =
              filterValidationsFailuresWithErrorMessage(
                userRequest?.ValidationFailures
              );
            const workspacesToDelete = workspacesToDeleteCount(
              userRequest.ValidationFailures
            );
            return (
              <Stack
                className={commonStyles.basicListStyle}
                horizontal
                horizontalAlign='space-between'
              >
                <div
                  className={clsx(
                    userRequest.UserEmail == null && commonStyles.italicFont
                  )}
                >
                  {userRequest.UserEmail ?? userRequest.UserObjectId}
                </div>
                <Stack.Item>
                  {props.approval &&
                    requiresClean(userRequest.RequestStatus) && (
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
                            commonStyles.font16,
                            commonStyles.cursorDefault
                          )}
                          iconName='Delete'
                        />
                      </TooltipHost>
                    )}
                  {validationsFailuresWithErrorMessage.length &&
                    validationsFailuresWithErrorMessage.length > 0 &&
                    props.approval && (
                      <TooltipHost
                        content={`${
                          validationsFailuresWithErrorMessage.length
                        } Warning${
                          validationsFailuresWithErrorMessage.length === 1
                            ? ''
                            : 's'
                        }`}
                      >
                        <IconButton
                          className={
                            workspacesToDelete >= 1
                              ? commonStyles.errorText
                              : commonStyles.warningText
                          }
                          iconProps={{ iconName: 'Warning' }}
                          onClick={() => {
                            props.openDetailsPanel(userRequest.Id);
                            props.closePanel();
                          }}
                        />
                      </TooltipHost>
                    )}
                </Stack.Item>
              </Stack>
            );
          }}
        />
      </Stack>
    </Panel>
  );
};
