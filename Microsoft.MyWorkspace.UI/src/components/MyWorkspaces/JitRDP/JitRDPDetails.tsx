import * as React from 'react';
import {
  Stack,
  Separator,
  CommandButton,
  IContextualMenuProps,
  IContextualMenuItem,
  PrimaryButton,
  Text,
  useTheme,
} from '@fluentui/react';
import { useSelector, useDispatch } from 'react-redux';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import {
  getJitAddresses,
  getJitWorkspaceRequested,
  getUserIP,
} from '../../../store/selectors/firewallSelectors';

import { getJitRDPStyles } from './JitRDP.styles';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { SyncStatus } from '../../../types/enums/SyncStatus';
import {
  removeJitAddress,
  addJitAddress,
} from '../../../store/actions/firewallActions';
import { CreateJitAddressPartialDto } from '../../../types/FirewallManager/CreateJitAddressDto';
import {
  getJitDropdownHours,
  getJitStatusText,
  isAddressMismatch,
  JIT_ADDRESS_MESSAGES,
} from './JitRDP.utils';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { EMPTY_GUID } from '../../../shared/Constants';
import {
  getAzureWorkspaces,
  getRdpJitMaxHours,
  getSelectedAdminWorkspaces,
} from '../../../store/selectors';
import { getEditWorkspaceIsAdminSelection } from '../../../store/selectors/editableWorkspaceSelectors';
import { getFormattedDateTime } from '../../../shared/DateTimeHelpers';
import { InfoButton } from 'src/components/GeneralComponents/InfoButton';

interface IProps {
  workspaceID: string;
}

export const JitRDPDetails = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getJitRDPStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const [ipAddressMismatch, setIpAddressMismatch] = React.useState(false);
  const rdpJitMaxHours = useSelector(getRdpJitMaxHours);
  const jitAddresses: JitAddressDto[] = useSelector(getJitAddresses);
  const currentAddress: string = useSelector(getUserIP);
  const jitWorkspaceRequested: string = useSelector(getJitWorkspaceRequested);
  const userWorkspaces: AzureWorkspaceDto[] = useSelector(getAzureWorkspaces);
  const adminWorkspaces: AzureWorkspaceDto[] = useSelector(
    getSelectedAdminWorkspaces
  );
  const [allWorkspaces, setAllWorkspaces] = React.useState([]);
  const isAdminSelection: boolean = useSelector(
    getEditWorkspaceIsAdminSelection
  );

  const workspace = React.useMemo(() => {
    if (!props.workspaceID) {
      return null;
    }
    return allWorkspaces.find((ws) => ws.ID === props.workspaceID) || null;
  }, [allWorkspaces, props.workspaceID]);

  React.useEffect(() => {
    if (isAdminSelection) {
      setAllWorkspaces(adminWorkspaces);
    } else {
      setAllWorkspaces(userWorkspaces);
    }
  }, [userWorkspaces, adminWorkspaces, isAdminSelection]);

  const getExistingJitAddressComponent = (address: JitAddressDto) => {
    return (
      <div key={address.ID} className={styles.jitComponent}>
        <Stack className={commonStyles.width75}>
          <Stack
            className={`${commonStyles.fullWidth} ${styles.paddingBottom8}`}
          >
            <Text>{`Workspace: ${workspace.Name}`}</Text>
          </Stack>
          <Stack
            className={`${commonStyles.fullWidth} ${styles.paddingBottom8}`}
          >
            <Text>
              Address or location: <b>{address.Address}</b>
            </Text>
          </Stack>
          <Stack
            className={`${commonStyles.fullWidth} ${styles.paddingBottom8}`}
          >
            <Text>Status: {getJitStatusText(address, true)}</Text>
          </Stack>
          <Stack className={commonStyles.fullWidth}>
            <Text>
              Expires: <b>{getFormattedDateTime(address.Expiration)}</b>
            </Text>
          </Stack>
        </Stack>
        <Stack
          className={`${commonStyles.width25}`}
          verticalAlign='end'
          horizontalAlign='end'
        >
          <PrimaryButton
            data-custom-parentid='JIT Deactivation Button'
            disabled={
              !!jitWorkspaceRequested || address.Status != SyncStatus.Active
            }
            style={{ width: 100 }}
            text='Deactivate'
            onClick={() =>
              dispatch(removeJitAddress(address.ID, address.WorkspaceID))
            }
          />
        </Stack>
      </div>
    );
  };

  const getNewJitAddressComponent = (workspace: AzureWorkspaceDto) => {
    if (!workspace) {
      return <div>No Workspace Selected</div>;
    }
    const disabled = !!jitWorkspaceRequested;
    const menuProps: IContextualMenuProps = {
      items: getJitDropdownHours(rdpJitMaxHours, disabled),
      onItemClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>,
        item?: IContextualMenuItem
      ) => {
        const jitAddress: CreateJitAddressPartialDto = {
          RegionID: EMPTY_GUID,
          WorkspaceID: workspace.ID,
          Location: 'temp',
          Hours: Number(item.key),
        };
        dispatch(addJitAddress(jitAddress));
      },
    };

    return (
      <Stack
        horizontal
        key={`${workspace.ID}-NewJITAddress`}
        className={`${styles.jitComponent} ${styles.jitHighlight}`}
      >
        <Stack horizontal className={commonStyles.width75}>
          <Stack
            className={`${commonStyles.fullWidth} ${commonStyles.marginAuto}`}
          >
            <Text>{workspace.Name}</Text>
          </Stack>
        </Stack>
        <Stack
          horizontal
          className={`${commonStyles.width25} ${commonStyles.flexRow}`}
          horizontalAlign='end'
        >
          <CommandButton
            data-custom-parentid='JIT Activation Button'
            id={`${workspace.ID}-JIT-BUTTON-PANEL`}
            text='Activate'
            menuProps={menuProps}
            disabled={!!jitWorkspaceRequested || !rdpJitMaxHours}
            ariaLabel='JIT button'
          />
        </Stack>
      </Stack>
    );
  };

  const jitAddress: JitAddressDto = React.useMemo(() => {
    if (!workspace) {
      return null;
    }
    const addr: JitAddressDto =
      jitAddresses.find((a) => a.WorkspaceID === workspace.ID) || null;
    setIpAddressMismatch(isAddressMismatch(addr, currentAddress));
    return addr;
  }, [workspace, jitAddresses]);

  return (
    <Stack>
      <Stack
        className={styles.jitPanelIPAddress}
        horizontal
        verticalAlign='center'
      >
        <Text>
          Current address or location: <b>{currentAddress}</b>
        </Text>
        <InfoButton
          className={commonStyles.severeWarningColor}
          buttonId='JITAccess'
          calloutTitle={'Just In Time (JIT)'}
          calloutBody={
            <>
              <Text>{JIT_ADDRESS_MESSAGES.corpNetAndAvdAccessible}</Text>
            </>
          }
        />
      </Stack>
      <Stack className={styles.jitPanelIPAddress}>
        {ipAddressMismatch && (
          <Text className={commonStyles.errorTextBold}>
            {JIT_ADDRESS_MESSAGES.addressMismatchMessage}
          </Text>
        )}
        <Separator />
      </Stack>
      {workspace && (
        <>
          {!jitAddress
            ? getNewJitAddressComponent(workspace)
            : getExistingJitAddressComponent(jitAddress)}
        </>
      )}
    </Stack>
  );
};
