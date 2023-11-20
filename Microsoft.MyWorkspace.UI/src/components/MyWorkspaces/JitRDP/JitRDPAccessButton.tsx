import {
  DefaultButton,
  IContextualMenuItem,
  IContextualMenuProps,
  Spinner,
  Stack,
  Text,
  SpinnerSize,
  CommandButton,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EMPTY_GUID } from '../../../shared/Constants';
import { addJitAddress } from '../../../store/actions';
import {
  getJitAddresses,
  getRdpJitMaxHours,
  getJitWorkspaceRequested,
  getUserIP,
} from '../../../store/selectors';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { SyncStatus } from '../../../types/enums/SyncStatus';
import { CreateJitAddressPartialDto } from '../../../types/FirewallManager/CreateJitAddressDto';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { getAllWorkspacesStyles } from '../AllWorkspacesView/AllWorkspacesView.styles';
import {
  getJitDropdownHours,
  getJitStatusText,
  isWorkspaceJitValid,
} from './JitRDP.utils';
import { ActiveJitRDPAccessButton } from './ActiveJitRDPAccessButton';

interface IProps {
  workspace: AzureWorkspaceDto;
  openJit: (workspaceID: string) => void;
  disabled: boolean;
}

export const JitRDPAccessButton = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getAllWorkspacesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const rdpJitMaxHours = useSelector(getRdpJitMaxHours);
  const jitAddresses: JitAddressDto[] = useSelector(getJitAddresses);
  const currentAddress: string = useSelector(getUserIP);
  const jitWorkspaceRequested = useSelector(getJitWorkspaceRequested);

  const jitAddress = React.useMemo(() => {
    if (!props.workspace) {
      return null;
    }

    return (
      jitAddresses.find((a) => a.WorkspaceID === props.workspace.ID) || null
    );
  }, [props.workspace, jitAddresses]);

  const getNewJitAddressCommandButton = (
    workspace: AzureWorkspaceDto,
    primaryButtonDisabled: boolean
  ) => {
    const disabled = props.disabled || !!jitWorkspaceRequested;

    const menuProps: IContextualMenuProps = {
      items: getJitDropdownHours(rdpJitMaxHours, disabled),
      ariaLabel: 'JIT hour selection contextual menu',
      onItemClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>,
        item?: IContextualMenuItem
      ) => {
        const jitAddress: CreateJitAddressPartialDto = {
          RegionID: EMPTY_GUID, // Necessary for now, as API requires a value for region ID. Will remove later.
          WorkspaceID: workspace.ID,
          Location: 'EMPTY', // Necessary for now, as API requires a value for location. Will remove later.
          Hours: Number(item.key),
        };
        dispatch(addJitAddress(jitAddress));
      },
    };

    return (
      <CommandButton
        ariaLabel='Activate'
        splitButtonAriaLabel='JIT options'
        iconProps={{ iconName: 'Error', className: styles.errorIcon }}
        id={`${workspace.ID}-JIT-BUTTON`}
        styles={{ root: { width: '100px' } }}
        menuProps={menuProps}
        disabled={primaryButtonDisabled || !rdpJitMaxHours}
        data-custom-parentid='JIT Activation Button'
      >
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Activate</Text>
      </CommandButton>
    );
  };

  const getJitAddressComponent = (jitAddress: JitAddressDto) => {
    const isDisabled =
      props.disabled ||
      !isWorkspaceJitValid(props.workspace) ||
      jitWorkspaceRequested === props.workspace.ID;
    if (!jitAddress) {
      return getNewJitAddressCommandButton(props.workspace, isDisabled);
    }
    switch (jitAddress.Status) {
      case SyncStatus.Active: {
        return (
          <ActiveJitRDPAccessButton
            jitAddress={jitAddress}
            currentAddress={currentAddress}
            isDisabled={isDisabled}
            openJit={() => props.openJit(props.workspace.ID)}
          />
        );
      }

      case SyncStatus.Failed:
        return (
          <DefaultButton
            id={`${jitAddress.WorkspaceID}-JIT-BUTTON`}
            iconProps={{ iconName: 'Error', className: styles.errorIcon }}
            onClick={() => props.openJit(jitAddress.WorkspaceID)}
            styles={{ root: { width: '132px' } }}
            disabled={isDisabled}
            ariaLabel='JIT activation button'
          >
            <Text variant='small' className={commonStyles.boldText}>
              {getJitStatusText(jitAddress)}
            </Text>
          </DefaultButton>
        );
      default: {
        return (
          <DefaultButton
            id={`${jitAddress.WorkspaceID}-JIT-BUTTON`}
            onClick={() => props.openJit(jitAddress.WorkspaceID)}
            styles={{ root: { width: '132px' } }}
            disabled={isDisabled}
            ariaLabel='JIT activation button'
          >
            <Spinner style={{ padding: '0 4px' }} size={SpinnerSize.small} />
            <Text variant='small' className={commonStyles.boldText}>
              {getJitStatusText(jitAddress)}
            </Text>
          </DefaultButton>
        );
      }
    }
  };

  return (
    <Stack horizontal verticalAlign={'start'}>
      {getJitAddressComponent(jitAddress)}
    </Stack>
  );
};
