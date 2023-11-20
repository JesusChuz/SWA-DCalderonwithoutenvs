import {
  DefaultButton,
  FontIcon,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TextField,
  useTheme,
  Text,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFeatureFlagMoveTenantSegmentUser,
  getFeatureFlagTenantSegmentAdminPortal,
} from '../../../../store/selectors';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { getUserRoleAssignmentById } from '../../../MyWorkspaces/workspaceService';
import {
  addTenantSegmentMember,
  fetchSegmentMembers,
  moveTenantSegmentMember,
} from '../../../../store/actions';
import { SegmentDefinitionDto } from '../../../../types/AuthService/SegmentDefinitionDto.types';
import clsx from 'clsx';
import { ValidatedAliasTextField } from '../../../GeneralComponents/ValidatedAliasTextField';
import { UserManagementRequests } from '../../../../types/AuthService/UserManagement/UserManagementRequests.types';
import { OperationType } from '../../../../types/AuthService/UserManagement/OperationType.types';
import store from '../../../../store/store';
import { useHistory } from 'react-router';

interface IProps {
  openTenantUserPanel: boolean;
  dismissPanel: () => void;
  segment: SegmentDefinitionDto;
  operationType: Exclude<OperationType, OperationType.Remove>;
}

export const AddMoveTenantSegmentUserPanel = (props: IProps): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [isSegmentUserValid, setIsSegmentUserValid] = React.useState(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [userId, setUserId] = React.useState<string>('');
  const [justification, setJustification] = React.useState('');

  const EditsDisabled = false;
  const dispatch = useDispatch();
  const tenantSegmentAdminPortalFeatureFlag = useSelector(
    getFeatureFlagTenantSegmentAdminPortal
  );
  const moveFeatureFlag = useSelector(getFeatureFlagMoveTenantSegmentUser);

  const moveSegmentMember = async (
    userEmail: string,
    segment: SegmentDefinitionDto
  ) => {
    setSubmitting(true);
    const userManagementRequests: UserManagementRequests = {
      Requests: [
        {
          NewAssignedSegmentId: segment.ID,
          NewAssignedSegmentName: segment.Name,
          UserEmail: userEmail,
          Justification: justification,
          OperationType: props.operationType,
          TenantSegmentAdminRole: false,
          TenantSegmentContributorRole: true,
        },
      ],
    };
    if (moveFeatureFlag) {
      await moveTenantSegmentMember(
        userManagementRequests,
        props.operationType
      )(dispatch).then(() => {
        history.push('/admin/TenantSegment?tab=userManagement');
      });
    } else {
      await addTenantSegmentMember(
        userId,
        segment,
        'TenantSegmentContributor'
      )(dispatch);
    }

    setValue('');
    setIsSegmentUserValid(false);
    setErrorMessage('');
    fetchSegmentMembers(segment)(dispatch, store.getState);
    setSubmitting(false);
    props.dismissPanel();
  };

  const cancel = () => {
    setValue('');
    setIsSegmentUserValid(false);
    setErrorMessage('');
    props.dismissPanel();
  };

  const onRenderFooterContent = () => (
    <Stack>
      {props.operationType === OperationType.Move && (
        <Stack
          horizontal
          verticalAlign='start'
          tokens={{ childrenGap: 4, padding: '8px 0' }}
        >
          <FontIcon
            style={{ marginTop: 2 }}
            className={commonStyles.errorText}
            iconName='Warning'
          />
          <Text className={commonStyles.errorTextBold}>
            This action sends a request to move the user to this segment. The
            request will be validated and a decision will be made to either
            approve or reject this request.
          </Text>
        </Stack>
      )}
      <Stack horizontal>
        <PrimaryButton
          className={commonStyles.flexItem}
          style={{ alignSelf: 'flex-end' }}
          text={props.operationType === OperationType.Move ? 'Move' : 'Add'}
          allowDisabledFocus
          disabled={!isSegmentUserValid || !userId || submitting}
          onClick={() => {
            moveSegmentMember(value, props.segment);
          }}
        />
        <DefaultButton
          className={commonStyles.flexItem}
          text='Cancel'
          allowDisabledFocus
          onClick={() => {
            cancel();
          }}
        />
      </Stack>
    </Stack>
  );

  const processValidatedAlias = async (isValid: boolean, userId?: string) => {
    if (!isValid || !userId) {
      setErrorMessage('User not found.');
      setIsSegmentUserValid(false);
    } else {
      setErrorMessage('');
      setUserId(userId);
      const result = await getUserRoleAssignmentById(dispatch, userId);
      if (!result || result.UserRoleAssignments.length === 0) {
        setIsSegmentUserValid(true);
      } else if (
        result.UserRoleAssignments.some(
          (roleAssignment) =>
            roleAssignment.SegmentDefinitionId === props.segment.ID &&
            roleAssignment.RoleName === 'TenantSegmentContributor'
        )
      ) {
        setErrorMessage('The current user is already in this segment.');
        setIsSegmentUserValid(false);
      } else {
        setIsSegmentUserValid(moveFeatureFlag);
        if (!moveFeatureFlag) {
          setErrorMessage(`The current user is already in a segment`);
        }
      }
    }
  };

  return (
    <Panel
      isOpen={props.openTenantUserPanel}
      onDismiss={props.dismissPanel}
      headerText={`${
        props.operationType === OperationType.Move ? 'Move' : 'Add'
      } User`}
      type={PanelType.medium}
      isFooterAtBottom={true}
      onRenderFooterContent={onRenderFooterContent}
      closeButtonAriaLabel='close'
    >
      <Stack style={{ marginTop: 8 }}>
        <ValidatedAliasTextField
          type='email'
          disabled={!tenantSegmentAdminPortalFeatureFlag || EditsDisabled}
          placeholder={`Email Address`}
          containerClassName={clsx(
            commonStyles.textFieldSpacing,
            commonStyles.fullWidth
          )}
          className={commonStyles.width67}
          label='User Email Address'
          onChange={(event, newValue) => {
            setIsSegmentUserValid(false);
            setErrorMessage('');
            setValue(newValue);
            setUserId('');
          }}
          value={value}
          validationStateCallback={processValidatedAlias}
          valid={isSegmentUserValid && !!value}
          errorMessage={errorMessage}
          autoComplete='off'
          required
        />

        {props.operationType === OperationType.Add && (
          <>
            <Label>Role</Label>
            <p>Tenant Segment Contributor</p>
          </>
        )}

        {isSegmentUserValid && userId && (
          <>
            <Label>New Segment</Label>
            <p>{props.segment.Name}</p>
            {moveFeatureFlag && (
              <Stack
                horizontal
                verticalAlign='start'
                style={{ marginBottom: 8 }}
              >
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
            )}
          </>
        )}
      </Stack>
    </Panel>
  );
};
