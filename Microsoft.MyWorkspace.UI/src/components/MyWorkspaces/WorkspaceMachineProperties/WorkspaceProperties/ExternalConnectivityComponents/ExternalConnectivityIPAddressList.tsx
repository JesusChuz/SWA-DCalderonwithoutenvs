import * as React from 'react';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { addIcon, deleteIcon } from '../../../../../shared/Icons';
import {
  Stack,
  PrimaryButton,
  List,
  TooltipHost,
  IconButton,
  Text,
  useTheme,
  DefaultButton,
  DialogFooter,
  CommandButton,
  Panel,
  PanelType,
} from '@fluentui/react';
import { AzurePublicAddressDto } from '../../../../../types/AzureWorkspace/AzurePublicAddressDto.types';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';
import {
  EditsDisabled,
  IsTransitioning,
} from '../../../../../shared/helpers/WorkspaceHelper';
import {
  getResourceStateText,
  ResourceStateDotIcon,
} from '../../../WorkspaceStatusIcons';
import {
  getCatalogUserProfile,
  getPublicAddressesLoadingID,
  getUserRoleAssignment,
  getUserRoleAssignmentConstraint,
} from '../../../../../store/selectors';
import { UserRoleAssignmentDto } from '../../../../../types/AuthService/UserRoleAssignmentDto.types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEditableWorkspace,
  getEditableWorkspaceExternalConnectivityChanges,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceAddNewPublicAddress,
  editableWorkspaceRemoveAllNewPublicAddresses,
  editableWorkspaceRemoveNewPublicAddress,
} from '../../../../../store/actions/editableWorkspaceActions';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { InfoButton } from '../../../../GeneralComponents/InfoButton';
import { PUBLIC_IP_ADDRESSES_INFO_TEXT } from '../../../../../shared/Constants';
import {
  savePublicAddressChanges,
  showUserConfirmationDialog,
} from 'src/store/actions';

export const ExternalConnectivityIPAddressList = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [addIPPanelOpen, setAddIPPanelOpen] = React.useState(false);
  const userProfile = useSelector(getCatalogUserProfile);
  const userConstraint = useSelector(getUserRoleAssignmentConstraint);
  const addressesLoadingId = useSelector(getPublicAddressesLoadingID);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const userRoleAssignment: UserRoleAssignmentDto = useSelector(
    getUserRoleAssignment
  );
  const externalConnectivityChanges = useSelector(
    getEditableWorkspaceExternalConnectivityChanges
  );

  const getPublicAddressText = (
    publicAddress: AzurePublicAddressDto
  ): string => {
    switch (publicAddress.State) {
      case ResourceState.Running:
      case ResourceState.PartiallyRunning:
        return publicAddress.PublicIPAddress;
      case ResourceState.NotDeployed:
      case ResourceState.Deploying:
        return 'Deploying IP Address';
      case ResourceState.Failed:
        return 'Failed IP Address';
      default:
        return 'Invalid IP Address';
    }
  };

  const filteredExistingIPAddresses = React.useMemo(() => {
    return editableWorkspace.PublicAddresses.filter(
      (address) => address.State !== ResourceState.Deleting
    );
  }, [
    editableWorkspace.PublicAddresses,
    editableWorkspace,
    editableWorkspace.VirtualMachines,
  ]);

  const newPublicAddresses: string[] = React.useMemo(() => {
    const ipStringArray: string[] = [];
    for (
      let i = 0;
      i < externalConnectivityChanges.NewPublicAddressCount;
      i++
    ) {
      ipStringArray.push(`New IP Address ${i + 1}`);
    }
    return ipStringArray;
  }, [externalConnectivityChanges.NewPublicAddressCount]);

  const combinedIPAddressCount: number =
    filteredExistingIPAddresses.length +
    externalConnectivityChanges.NewPublicAddressCount;

  const allCurrentWorkspaceNats = React.useMemo(() => {
    return editableWorkspace.VirtualMachines.flatMap((m) => m.NatRules);
  }, [editableWorkspace]);

  const allCurrentNats = React.useMemo(() => {
    return [...editableWorkspace.VirtualMachines].flatMap((m) => m.NatRules);
  }, [editableWorkspace, editableWorkspace.VirtualMachines]);

  const getDeleteTooltipMessage = (
    publicAddress: AzurePublicAddressDto,
    isAddressUsedInNatRule: boolean
  ) => {
    if (isAddressUsedInNatRule) {
      return 'Public IP address cannot be deleted while it is being used by a NAT rule.';
    }
    if (IsTransitioning(publicAddress)) {
      return 'Public IP address cannot be deleted while it is transitioning.';
    }
    if (publicAddress.State === ResourceState.Failed) {
      return 'A Public IP address that failed to create cannot be deleted. Please contact MyWorkspace support.';
    }
    return 'Delete';
  };

  const cancelAddIPs = () => {
    dispatch(editableWorkspaceRemoveAllNewPublicAddresses());
    setAddIPPanelOpen((v) => false);
  };

  const submitIPChanges = async (
    deletedPublicAddresses: AzurePublicAddressDto[]
  ) => {
    if (
      externalConnectivityChanges.NewPublicAddressCount > 0 ||
      deletedPublicAddresses.length > 0
    ) {
      await dispatch(
        savePublicAddressChanges(
          editableWorkspace,
          deletedPublicAddresses,
          externalConnectivityChanges.NewPublicAddressCount
        )
      );
    }
    setAddIPPanelOpen((v) => false);
  };

  const onRenderExistingAddressCell = (
    publicAddress: AzurePublicAddressDto
  ): JSX.Element => {
    const resourceState = publicAddress.State;
    const isAddressUsedInNatRule =
      allCurrentWorkspaceNats.some(
        (nat) => publicAddress.PrivateIPAddress === nat.ExternalAddress
      ) ||
      allCurrentNats.some(
        (nat) => publicAddress.PrivateIPAddress === nat.ExternalAddress
      );
    const deleteDisabled =
      Boolean(addressesLoadingId) ||
      publicAddress.State === ResourceState.NotDeployed ||
      IsTransitioning(publicAddress) ||
      isAddressUsedInNatRule ||
      EditsDisabled(userProfile, editableWorkspace, originalWorkspace, true) ||
      publicAddress.State === ResourceState.Failed;
    return (
      <div data-is-focusable>
        <Stack
          horizontal
          className={`${commonStyles.fullWidth} ${commonStyles.verticalAlign}`}
          tokens={{ childrenGap: 8 }}
        >
          <Stack.Item>
            <TooltipHost content={getResourceStateText(resourceState)}>
              <ResourceStateDotIcon resourceState={resourceState} />
            </TooltipHost>
          </Stack.Item>
          <Stack.Item>
            <Text>{getPublicAddressText(publicAddress)}</Text>
          </Stack.Item>
          <Stack.Item style={{ marginLeft: 'auto' }}>
            <TooltipHost
              content={getDeleteTooltipMessage(
                publicAddress,
                isAddressUsedInNatRule
              )}
            >
              <IconButton
                iconProps={deleteIcon}
                title={`Delete ${publicAddress.PublicIPAddress}`}
                ariaLabel={`delete ${publicAddress.PublicIPAddress}`}
                onClick={() => {
                  dispatch(
                    showUserConfirmationDialog(
                      'Confirm Delete',
                      `Are you sure you want to delete IP address "${publicAddress.PublicIPAddress}"? This action cannot be undone and you will need to create a new IP address if you need another one.`,
                      () => {
                        submitIPChanges([publicAddress]);
                      }
                    )
                  );
                }}
                disabled={deleteDisabled}
              />
            </TooltipHost>
          </Stack.Item>
        </Stack>
      </div>
    );
  };

  const onRenderNewAddressCell = (
    newPublicAddressName: string
  ): JSX.Element => {
    return (
      <div data-is-focusable>
        <Stack
          horizontal
          className={`${commonStyles.fullWidth} ${commonStyles.verticalAlign}`}
        >
          <Stack.Item grow={1}>{newPublicAddressName}</Stack.Item>
          <Stack.Item>
            <TooltipHost content='Delete'>
              <IconButton
                iconProps={deleteIcon}
                title={`Delete ${newPublicAddressName}`}
                ariaLabel={`delete ${newPublicAddressName}`}
                onClick={() =>
                  dispatch(editableWorkspaceRemoveNewPublicAddress())
                }
                disabled={EditsDisabled(
                  userProfile,
                  editableWorkspace,
                  originalWorkspace,
                  true
                )}
              />
            </TooltipHost>
          </Stack.Item>
        </Stack>
      </div>
    );
  };

  const getNewAddressTooltipMessage = () => {
    return combinedIPAddressCount >= userConstraint.MaxPublicIPAddressesAllowed
      ? `A maximum of ${
          userConstraint.MaxPublicIPAddressesAllowed
        } public address${
          userConstraint.MaxPublicIPAddressesAllowed !== 1 ? 'es' : ''
        } can be created.`
      : '';
  };

  const onRenderFooter = () => {
    return (
      <DialogFooter>
        <DefaultButton
          onClick={cancelAddIPs}
          text='Cancel'
          disabled={Boolean(addressesLoadingId)}
        />
        <PrimaryButton
          disabled={
            Boolean(addressesLoadingId) ||
            externalConnectivityChanges.NewPublicAddressCount == 0 ||
            EditsDisabled(
              userProfile,
              editableWorkspace,
              originalWorkspace,
              true
            )
          }
          onClick={() => submitIPChanges([])}
          text='Create'
        />
      </DialogFooter>
    );
  };

  return (
    <>
      <Stack
        horizontal
        className={commonStyles.fullWidth}
        tokens={defaultStackTokens}
        horizontalAlign='space-between'
        verticalAlign='center'
      >
        <Stack.Item>
          <h3 className={commonStyles.margin0}>
            Public IP Addresses
            <InfoButton
              buttonId={'infoButton-ipAddresses'}
              calloutTitle={'Public IP Addresses'}
              calloutBody={PUBLIC_IP_ADDRESSES_INFO_TEXT}
            />
          </h3>
        </Stack.Item>
        <Stack.Item>
          <TooltipHost content={getNewAddressTooltipMessage()}>
            <PrimaryButton
              text='New Address'
              iconProps={addIcon}
              onClick={() => {
                setAddIPPanelOpen((v) => true);
              }}
              disabled={
                filteredExistingIPAddresses.length >=
                  userRoleAssignment?.UserRoleAssignments.find(
                    (role) => role.Constraint
                  ).Constraint.MaxPublicIPAddressesAllowed ||
                EditsDisabled(
                  userProfile,
                  editableWorkspace,
                  originalWorkspace,
                  true
                )
              }
            />
          </TooltipHost>
        </Stack.Item>
      </Stack>
      <Stack
        horizontal
        className={`${commonStyles.fullWidth} ${commonStyles.columnContainer}`}
        tokens={defaultStackTokens}
      >
        {filteredExistingIPAddresses.length > 0 && (
          <List
            items={filteredExistingIPAddresses}
            onRenderCell={onRenderExistingAddressCell}
          />
        )}
        {filteredExistingIPAddresses.length === 0 && (
          <Text>No IP Addresses</Text>
        )}
      </Stack>
      <Panel
        isOpen={addIPPanelOpen}
        onDismiss={() => setAddIPPanelOpen((v) => false)}
        headerText='Add Public IP Addresses'
        type={PanelType.smallFixedFar}
        onRenderFooterContent={onRenderFooter}
        closeButtonAriaLabel='Close Panel'
        isFooterAtBottom={true}
      >
        <Stack>
          <Stack.Item>
            <Text>
              Add new IP addresses below. After the IP address is created,
              please give it a few minutes to reach a running state to add NAT
              rules.
            </Text>
          </Stack.Item>
        </Stack>
        <Stack
          horizontal
          className={commonStyles.fullWidth}
          tokens={defaultStackTokens}
          horizontalAlign='space-between'
          verticalAlign='center'
          reversed
        >
          <Stack.Item>
            <TooltipHost content={getNewAddressTooltipMessage()}>
              <CommandButton
                text='New Address'
                iconProps={addIcon}
                onClick={() => dispatch(editableWorkspaceAddNewPublicAddress())}
                disabled={
                  combinedIPAddressCount >=
                    userRoleAssignment?.UserRoleAssignments.find(
                      (role) => role.Constraint
                    ).Constraint.MaxPublicIPAddressesAllowed ||
                  EditsDisabled(
                    userProfile,
                    editableWorkspace,
                    originalWorkspace,
                    true
                  )
                }
              />
            </TooltipHost>
          </Stack.Item>
        </Stack>
        <Stack
          horizontal
          className={`${commonStyles.fullWidth} ${commonStyles.columnContainer}`}
          tokens={defaultStackTokens}
        >
          {externalConnectivityChanges.NewPublicAddressCount > 0 && (
            <List
              style={{ marginLeft: 0 }}
              items={newPublicAddresses}
              onRenderCell={onRenderNewAddressCell}
            />
          )}
          {externalConnectivityChanges.NewPublicAddressCount === 0 && (
            <Text>No IP Addresses</Text>
          )}
        </Stack>
      </Panel>
    </>
  );
};
