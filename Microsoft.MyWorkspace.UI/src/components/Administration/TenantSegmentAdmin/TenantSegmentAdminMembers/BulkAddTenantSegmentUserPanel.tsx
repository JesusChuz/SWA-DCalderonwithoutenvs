import {
  Checkbox,
  DefaultButton,
  Dropdown,
  FontIcon,
  IDropdownOption,
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
import { useDispatch, useSelector } from 'react-redux';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  fetchSegmentMembers,
  moveTenantSegmentMember,
  setTenantSegmentAdminSegment,
  showUserConfirmationDialog,
} from '../../../../store/actions';
import { SegmentDefinitionDto } from '../../../../types/AuthService/SegmentDefinitionDto.types';
import clsx from 'clsx';
import { UserManagementRequests } from '../../../../types/AuthService/UserManagement/UserManagementRequests.types';
import { OperationType } from '../../../../types/AuthService/UserManagement/OperationType.types';
import { useHistory } from 'react-router';
import { isEmail } from 'src/shared/Regex';
import { getTenantSegmentAdminSegments } from 'src/store/selectors';
import store from 'src/store/store';
import { InfoButton } from 'src/components/GeneralComponents/InfoButton';

interface IProps {
  openTenantUserPanel: boolean;
  dismissPanel: () => void;
  currentSegment: SegmentDefinitionDto;
}

export const BulkAddTenantSegmentUserPanel = (props: IProps): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [areEmailsValid, setAreEmailsValid] = React.useState(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [tenantSegmentAdminRole, setTenantSegmentAdminRole] =
    React.useState<boolean>(false);
  const [tenantSegmentContributorRole, setTenantSegmentContributorRole] =
    React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [emailStringValue, setEmailStringValue] = React.useState<string>('');
  const [justification, setJustification] = React.useState('');
  const [selectedSegment, setSelectedSegment] = React.useState(
    props.currentSegment
  );
  const adminSegments = useSelector(getTenantSegmentAdminSegments);
  const dispatch = useDispatch();

  const segmentDropdownOptions: IDropdownOption[] = React.useMemo(
    () =>
      adminSegments.map((a) => ({
        key: a.ID,
        text: a.Name,
      })),
    [adminSegments]
  );

  React.useEffect(() => {
    if (props.openTenantUserPanel) {
      setSelectedSegment(props.currentSegment);
    }
  }, [props.openTenantUserPanel, props.currentSegment]);

  const emails = React.useMemo(() => {
    const splitValues = emailStringValue
      .split(/[\n\,\; ]/)
      .filter((str) => str !== '')
      .map((val) => val.trim());
    return Array.from(new Set(splitValues));
  }, [emailStringValue]);

  React.useEffect(() => {
    if (!emails || emails.length === 0) {
      setErrorMessage('');
      setAreEmailsValid(false);
      return;
    }
    if (emails.length > 500) {
      setErrorMessage(
        `${emails.length} emails were entered. The maximum email length is 500.`
      );
      setAreEmailsValid(false);
      return;
    }
    const nonEmailStrings = emails.filter((e) => !isEmail.test(e));
    if (nonEmailStrings.length > 0) {
      setErrorMessage(
        `The following email${
          nonEmailStrings.length === 1 ? '' : 's'
        } are not valid: ${nonEmailStrings.join(', ')}`
      );
      setAreEmailsValid(false);
      return;
    }
    setErrorMessage('');
    setAreEmailsValid(true);
  }, [emails]);

  const addSegmentMember = async (segment: SegmentDefinitionDto) => {
    setSubmitting(true);
    const userManagementRequests: UserManagementRequests = {
      Requests: emails.map((e) => ({
        NewAssignedSegmentId: segment.ID,
        NewAssignedSegmentName: segment.Name,
        UserEmail: e,
        Justification: justification,
        OperationType: OperationType.Add,
        TenantSegmentAdminRole: tenantSegmentAdminRole,
        TenantSegmentContributorRole: tenantSegmentContributorRole,
      })),
    };
    await moveTenantSegmentMember(
      userManagementRequests,
      OperationType.Add
    )(dispatch).then(() => {
      if (segment !== props.currentSegment) {
        dispatch(setTenantSegmentAdminSegment(segment));
      }
      history.push('/admin/TenantSegment?tab=userManagement');
    });

    setEmailStringValue('');
    setAreEmailsValid(false);
    setErrorMessage('');
    fetchSegmentMembers(segment)(dispatch, store.getState);
    setSubmitting(false);
    props.dismissPanel();
  };

  const cancel = () => {
    setEmailStringValue('');
    setAreEmailsValid(false);
    setErrorMessage('');
    props.dismissPanel();
  };

  const onRenderFooterContent = () => (
    <Stack>
      <Stack horizontal>
        <PrimaryButton
          className={commonStyles.flexItem}
          style={{ alignSelf: 'flex-end' }}
          text={'Add'}
          allowDisabledFocus
          disabled={!areEmailsValid || submitting || !selectedSegment}
          onClick={() => {
            const userConfirmationBody: React.ReactChild = (
              <Stack tokens={{ childrenGap: 16 }}>
                <Text>
                  Please confirm the accuracy of the emails provided to ensure
                  your request is processed correctly.
                </Text>
              </Stack>
            );
            dispatch(
              showUserConfirmationDialog(
                'Confirm Request',
                userConfirmationBody,
                () => addSegmentMember(selectedSegment)
              )
            );
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

  return (
    <Panel
      isOpen={props.openTenantUserPanel}
      onDismiss={cancel}
      headerText={'Add Users to Segment'}
      type={PanelType.medium}
      isFooterAtBottom={true}
      onRenderFooterContent={onRenderFooterContent}
      closeButtonAriaLabel='close'
      styles={{
        footer: { backgroundColor: theme.semanticColors.bodyBackground },
      }}
    >
      <Stack style={{ marginTop: 8, maxWidth: 500 }}>
        <Dropdown
          label='Segment'
          placeholder='Select a Segment'
          selectedKey={selectedSegment.ID}
          options={segmentDropdownOptions}
          onChange={(event, item) => {
            setSelectedSegment(
              adminSegments.find((seg) => seg.ID === item.key.toString()) ??
                null
            );
          }}
          style={{ marginBottom: 8 }}
        />
        <Label>Role</Label>
        <Stack style={{ margin: 8, maxWidth: 500 }}>
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
                    to MyWorkspace. When assigned this role the user has access
                    to the MyWorkspace portal, can perform custom and template
                    deployments and is restricted to actions allowed by the
                    segment quota configuration.
                  </Text>
                  <Text>
                    If a user is already assigned this role in another segment,
                    the old assignment will be dropped and replaced with the
                    assignment for the new segment.
                  </Text>
                </>
              }
            />
          </Stack>
          <Stack horizontal horizontalAlign='start'>
            <Checkbox
              className={`${commonStyles.marginBottom4}`}
              checked={tenantSegmentAdminRole}
              label='Segment Admin'
              onChange={(e, c) => setTenantSegmentAdminRole(c)}
            />
            <InfoButton
              buttonId='infoButton-segment-admin-role'
              calloutTitle={'Segment Admin'}
              calloutBody={
                <>
                  <Text>
                    When a user is assigned the Segment Admin role they gain the
                    ability to add and remove users, add and remove other
                    Segment Admins, update quota values, delete workspaces and
                    view cost history for that segment.
                  </Text>
                  <Text>
                    Users should only be assigned this role if they are
                    responsible for managing Azure consumption for the segment.
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
            className={`${commonStyles.textFieldSpacing} ${commonStyles.fullWidth}`}
            onChange={(event, newValue) => setJustification(newValue)}
            autoComplete='off'
            resizable={false}
          />
        </Stack>
        <Stack horizontal verticalAlign='start'>
          <TextField
            styles={{
              fieldGroup: { minHeight: 500 },
            }}
            multiline
            placeholder={
              'Provide email addresses separated by either a comma, semicolon, space or new line.'
            }
            value={emailStringValue}
            label='Add Users By Email Address'
            className={clsx(
              commonStyles.textFieldSpacing,
              commonStyles.fullWidth,
              commonStyles.fullHeight
            )}
            errorMessage={errorMessage}
            description={
              errorMessage || !emails || emails.length === 0
                ? ''
                : `${emails.length} Email${
                    emails.length === 1 ? '' : 's'
                  } Entered`
            }
            spellCheck={false}
            onChange={(event, newValue) => setEmailStringValue(newValue)}
            autoComplete='off'
          />
        </Stack>
      </Stack>
    </Panel>
  );
};
