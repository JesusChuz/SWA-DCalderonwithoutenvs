import {
  DefaultButton,
  FontIcon,
  Label,
  List,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TextField,
  useTheme,
  Text,
  Checkbox,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedUsers } from '../../../../store/selectors';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { SegmentDefinitionDto } from '../../../../types/AuthService/SegmentDefinitionDto.types';
import { clsx } from 'clsx';
import {
  deleteUsers,
  showUserConfirmationDialog,
} from '../../../../store/actions';
import { DeleteUserRequests } from '../../../../types/AuthService/UserManagement/DeleteUserRequests.types';
import { useHistory } from 'react-router';
import { InfoButton } from 'src/components/GeneralComponents/InfoButton';

interface IProps {
  openTenantUserPanel: boolean;
  dismissPanel: () => void;
  segment: SegmentDefinitionDto;
}

export const RemoveTenantSegmentUserPanel = (props: IProps): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const selectedUsers = useSelector(getSelectedUsers);
  const dispatch = useDispatch();
  const [justification, setJustification] = React.useState('');
  const [tenantSegmentAdminRole, setTenantSegmentAdminRole] =
    React.useState<boolean>(false);
  const [tenantSegmentContributorRole, setTenantSegmentContributorRole] =
    React.useState<boolean>(false);

  const cancelRemoveSegmentMember = () => {
    props.dismissPanel();
  };

  const onRenderFooterContent = () => (
    <Stack>
      {tenantSegmentContributorRole ? (
        <Stack
          horizontal
          verticalAlign='center'
          tokens={{ childrenGap: 4, padding: '8px 0' }}
        >
          <FontIcon className={commonStyles.errorText} iconName='Warning' />
          <Text className={commonStyles.errorTextBold}>
            {`This action will result in the deletion of any workspaces
            created by the selected user${
              selectedUsers.length === 1 ? '' : 's'
            }.`}
          </Text>
        </Stack>
      ) : (
        <Stack />
      )}
      <Stack horizontal>
        <PrimaryButton
          className={commonStyles.flexItem}
          style={{ alignSelf: 'flex-end' }}
          text='Remove'
          allowDisabledFocus
          disabled={!tenantSegmentAdminRole && !tenantSegmentContributorRole}
          onClick={() => {
            const message = tenantSegmentContributorRole
              ? `This action will result in the deletion of any workspaces created by the ${
                  selectedUsers.length
                } selected user${selectedUsers.length === 1 ? '' : 's'}.`
              : `This action will result in the deletion of Segment Admin roles for the ${
                  selectedUsers.length
                } selected user${selectedUsers.length === 1 ? '' : 's'}.`;
            dispatch(
              showUserConfirmationDialog('Warning', message, () => {
                const deleteUserRequests: DeleteUserRequests = {
                  DeleteRequests: selectedUsers.map((user) => {
                    const assignment = user.LightRoleAssignments.find(
                      (a) => a.SegmentDefinitionId === props.segment.ID
                    );
                    const segmentId = assignment?.SegmentDefinitionId;
                    return {
                      Justification: justification,
                      UserEmail: user.Email,
                      UserObjectId: user.UserId,
                      NewAssignedSegmentId: segmentId,
                      TenantSegmentAdminRole: tenantSegmentAdminRole,
                      TenantSegmentContributorRole:
                        tenantSegmentContributorRole,
                    };
                  }),
                };
                deleteUsers(deleteUserRequests)(dispatch).then(() =>
                  history.push('/admin/TenantSegment?tab=userManagement')
                );
              })
            );
          }}
        />
        <DefaultButton
          className={commonStyles.flexItem}
          text='Cancel'
          allowDisabledFocus
          onClick={() => {
            cancelRemoveSegmentMember();
          }}
        />
      </Stack>
    </Stack>
  );

  return (
    <Panel
      isOpen={props.openTenantUserPanel}
      onDismiss={props.dismissPanel}
      headerText={'Remove User'}
      type={PanelType.medium}
      isFooterAtBottom={true}
      onRenderFooterContent={onRenderFooterContent}
      closeButtonAriaLabel='close'
    >
      <Stack style={{ marginTop: 8 }}>
        <Label>Segment</Label>
        <p>{props.segment.Name}</p>

        <Label style={{ marginTop: 8 }}>Role</Label>
        <Stack verticalAlign='start' style={{ marginBottom: 8 }}>
          <Stack horizontal horizontalAlign='start'>
            <Checkbox
              className={`${commonStyles.marginBottom4}`}
              checked={tenantSegmentContributorRole}
              label='Segment Contributor'
              onChange={(e, c) => setTenantSegmentContributorRole(c)}
            />
            <InfoButton
              buttonId='infoButton-segment-contributor-role'
              calloutTitle={'Segment Contributor'}
              calloutBody={
                <>
                  <Text>
                    The Segment Contributor role is the lowest level of access
                    to MyWorkspace. If this role is removed the user will no
                    longer have access to the MyWorkspace portal and any
                    workspaces deployed by that user will be deleted.
                  </Text>
                  <Text>
                    If the Segment Contributor role is selected for removal but
                    the user does not have Segment Contributor role assigned for
                    the current segment then no action will be taken.
                  </Text>
                </>
              }
            />
          </Stack>
          <Stack horizontal horizontalAlign='start'>
            <Checkbox
              className={`${commonStyles.marginBottom4}`}
              disabled={tenantSegmentContributorRole}
              checked={tenantSegmentContributorRole || tenantSegmentAdminRole}
              label='Segment Admin'
              onChange={(e, c) => setTenantSegmentAdminRole(c)}
            />
            <InfoButton
              buttonId='infoButton-segment-admin-role'
              calloutTitle={'Segment Admin'}
              calloutBody={
                <>
                  <Text>
                    When the Segment Admin role is removed the user loses the
                    ability to add and remove users, add and remove other
                    Segment Admins, update quota values, delete workspaces and
                    view cost history for that segment.
                  </Text>
                  <Text>
                    Removal of the Segment Admin role will NOT result in
                    workspace deletion unless Segment Contributor is also
                    removed.
                  </Text>
                </>
              }
            />
          </Stack>
        </Stack>
        <Stack horizontal verticalAlign='start' style={{ marginBottom: 8 }}>
          <TextField
            multiline
            placeholder={'Provide Business Justification'}
            value={justification}
            label='Justification'
            className={`${commonStyles.textFieldSpacing} ${commonStyles.width67}`}
            onChange={(event, newValue) => setJustification(newValue)}
            autoComplete='off'
          />
        </Stack>

        <Label>{`Selected Users (${selectedUsers.length})`}</Label>
        <List
          items={selectedUsers}
          onRenderCell={(user) => (
            <div
              className={clsx(
                commonStyles.basicListStyle,
                user.Email == null && commonStyles.italicFont
              )}
            >
              {user.Email ?? 'User Email Not Found'}
            </div>
          )}
        />
      </Stack>
    </Panel>
  );
};
