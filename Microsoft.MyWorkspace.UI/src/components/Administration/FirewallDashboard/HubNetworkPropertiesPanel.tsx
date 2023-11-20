import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Panel,
  PanelType,
  TextField,
  Text,
  Toggle,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { HubNetworkDto } from '../../../types/FirewallManager/HubNetworkDto';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEditableAdminFirewallHub,
  getEditableAdminFirewallHubHasChanges,
} from '../../../store/selectors/adminFirewallSelectors';
import {
  setSelectedAdminFirewallHubId,
  updateFirewallHubNetwork,
  updateSelectedAdminFirewallHub,
} from '../../../store/actions/adminFirewallActions';

export const HubNetworkPropertiesPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [panelOpen, setPanelOpen] = React.useState(true);

  const handleClose = async (save: boolean) => {
    dispatch(setSelectedAdminFirewallHubId('', ''));

    if (save) {
      dispatch(updateFirewallHubNetwork(hub));
    }
  };

  const hub: HubNetworkDto = useSelector(getEditableAdminFirewallHub);
  const hubHasChanges = useSelector(getEditableAdminFirewallHubHasChanges);

  React.useEffect(() => {
    if (hub) {
      setPanelOpen(true);
    } else {
      setPanelOpen(false);
    }
  }, [hub]);

  return (
    <>
      {hub && (
        <Panel
          isOpen={panelOpen}
          onDismiss={() => handleClose(false)}
          headerText={`${hub.Name} Properties`}
          closeButtonAriaLabel='Close'
          customWidth={'450px'}
          type={PanelType.custom}
        >
          <Text
            variant='mediumPlus'
            as='h3'
          >{`${hub.TotalSpokeNetworksConsumed} / ${hub.MaxSpokeNetworksAllowed} Spokes Used`}</Text>
          <Stack
            className={commonStyles.paddingTop12}
            tokens={{ childrenGap: 8 }}
          >
            <TextField
              id='name'
              label='Name'
              ariaLabel='hub name'
              disabled
              value={hub.Name}
            />
            <TextField
              id='id'
              label='ID'
              ariaLabel='hub id'
              disabled
              value={hub.ID}
            />
            <TextField
              id='region'
              label='Region'
              ariaLabel='hub region'
              disabled
              value={hub.Location}
            />
            <TextField
              id='resourceGroupName'
              label='Resource Group Name'
              ariaLabel='hub azure resource group name'
              disabled
              value={hub.ResourceGroupName}
            />
            <TextField
              id='fqdn'
              label='FQDN'
              ariaLabel='hub fully qualified domain name'
              disabled
              value={hub.HubFQDN}
            />
            <TextField
              id='hopSubnet'
              label='Hop Subnet'
              ariaLabel='hub hop subnet'
              disabled
              value={hub.HubHopSubnetCidr}
            />
            <TextField
              id='addressSpace'
              label='Address Space'
              ariaLabel='hub address space'
              disabled
              value={hub.HubAddressSpace}
            />
            <TextField
              id='spokeAddressSpace'
              label='Spoke Address Space'
              ariaLabel='spoke address space'
              disabled
              value={hub.SpokeAddressSpace}
            />
            <TextField
              id='spokeBlockSize'
              label='Spoke Block Size'
              ariaLabel='spoke block size'
              disabled
              value={hub.SpokeNetworkBlockSize.toString()}
            />
            <TextField
              id='rdpInternalAddress'
              label='RDP Internal Address'
              ariaLabel='hub rdp internal address'
              disabled
              value={hub.HubRDPInternalAddress}
            />
            <TextField
              id='natPortStart'
              label='NAT Port Start'
              ariaLabel='hub nat port start'
              disabled
              value={hub.NatPortStart.toString()}
            />
            <TextField
              id='totalNatPorts'
              label='Total Nat Ports'
              ariaLabel='hub total nat ports'
              disabled
              value={hub.TotalNatPorts.toString()}
            />
            <TextField
              id='jitPrefix'
              label='JIT Tag Prefix'
              ariaLabel='jit tag prefix'
              disabled
              value={hub.JitTag}
            />
            <TextField
              id='contentFilter'
              label='Content Filter'
              ariaLabel='hub content filter'
              disabled={false}
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallHub({
                    ...hub,
                    ContentFilter: event.currentTarget.value,
                  })
                )
              }
              value={hub.ContentFilter}
            />
            <Toggle
              id='published'
              label='Published'
              onText='True'
              offText='False'
              ariaLabel='hub publish toggle'
              onChange={(
                event: React.MouseEvent<HTMLElement, MouseEvent>,
                checked?: boolean
              ) =>
                dispatch(
                  updateSelectedAdminFirewallHub({
                    ...hub,
                    IsPublished: checked,
                  })
                )
              }
              checked={hub.IsPublished}
            />
            <Stack
              className={commonStyles.paddingTop12}
              horizontal
              tokens={{ childrenGap: 8 }}
            >
              <PrimaryButton
                onClick={() => handleClose(true)}
                disabled={!hubHasChanges}
                text='Save'
              />
              <DefaultButton
                onClick={() => handleClose(false)}
                disabled={!hubHasChanges}
                text='Cancel'
              />
            </Stack>
          </Stack>
        </Panel>
      )}
    </>
  );
};
