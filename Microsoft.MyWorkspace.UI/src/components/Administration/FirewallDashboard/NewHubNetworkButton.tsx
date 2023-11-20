import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Panel,
  PanelType,
  TextField,
  CommandBarButton,
  Toggle,
  IContextualMenuProps,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminFirewalls,
  getNewAdminHubNetwork,
  getNewAdminHubNetworkHasChanges,
} from '../../../store/selectors/adminFirewallSelectors';
import {
  createFirewallHubNetwork,
  setNewAdminFirewallHub,
  updateNewAdminFirewallHub,
} from '../../../store/actions/adminFirewallActions';
import { HubNetworkForCreationDto } from '../../../types/ResourceCreation/HubNetworkForCreationDto.types';
import { FirewallSettingsDto } from '../../../types/FirewallManager/FirewallSettingsDto';
import { initialHubNetwork } from '../../../store/reducers/adminFirewallReducer';
import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';

interface IProps {
  firewall?: FirewallSettingsDto;
}

export const NewHubNetworkButton = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const hub: HubNetworkForCreationDto = useSelector(getNewAdminHubNetwork);
  const hubHasChanges: boolean = useSelector(getNewAdminHubNetworkHasChanges);
  const firewalls: FirewallHubNetworkInfoDto[] = useSelector(getAdminFirewalls);
  const [firewallOptions, setFirewallOptions] =
    React.useState<IContextualMenuProps>(null);
  const [firewall, setFirewall] = React.useState(props.firewall);

  const handleClose = async (save: boolean) => {
    setPanelOpen(false);
    if (save) {
      dispatch(createFirewallHubNetwork(hub));
    }
  };

  const resetChanges = () => {
    dispatch(
      setNewAdminFirewallHub({
        ...initialHubNetwork,
        FirewallID: firewall?.ID,
        Location: firewall?.Location,
      })
    );
  };

  React.useEffect(() => {
    if (firewall && panelOpen) {
      resetChanges();
    }
  }, [firewall, panelOpen]);

  React.useEffect(() => {
    if (!props.firewall) {
      setFirewallOptions({
        items: firewalls.map((f) => {
          return {
            key: f.FirewallSettings.ID,
            text: `${f.FirewallSettings.Name} - ${f.FirewallSettings.ID}`,
            onClick: (e, item) => {
              setFirewall(
                firewalls.find((f) => f.FirewallSettings.ID === item.key)
                  ?.FirewallSettings
              );
              setPanelOpen(true);
            },
          };
        }),
      });
    }
  }, [props.firewall]);

  return (
    <>
      {props.firewall ? (
        <CommandBarButton
          className={commonStyles.fullHeight}
          iconProps={{ iconName: 'Add' }}
          text='New Hub Network'
          onClick={() => setPanelOpen(true)}
        />
      ) : (
        <CommandBarButton
          className={commonStyles.fullHeight}
          iconProps={{ iconName: 'Add' }}
          text='New Hub Network'
          menuProps={firewallOptions}
        />
      )}

      <Panel
        isOpen={panelOpen}
        onDismiss={() => handleClose(false)}
        headerText={`New Hub Network`}
        closeButtonAriaLabel='Close'
        customWidth={'450px'}
        type={PanelType.custom}
      >
        <Stack
          className={commonStyles.paddingTop12}
          tokens={{ childrenGap: 8 }}
        >
          <TextField
            id='name'
            label='Name'
            ariaLabel='hub name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  Name: event.currentTarget.value,
                })
              )
            }
            value={hub.Name}
          />
          <TextField
            id='firewallId'
            label='Firewall ID'
            ariaLabel='firewall id'
            disabled
            value={hub.FirewallID}
          />
          <TextField
            id='subscriptionId'
            label='Subscription ID'
            ariaLabel='subscription id'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  SubscriptionID: event.currentTarget.value,
                })
              )
            }
            value={hub.SubscriptionID}
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
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  ResourceGroupName: event.currentTarget.value,
                })
              )
            }
            value={hub.ResourceGroupName}
          />
          <TextField
            id='fqdn'
            label='FQDN'
            ariaLabel='hub fully qualified domain name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubFQDN: event.currentTarget.value,
                })
              )
            }
            value={hub.HubFQDN}
          />
          <TextField
            id='internalName'
            label='Internal Name'
            ariaLabel='hub internal name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubInternalName: event.currentTarget.value,
                })
              )
            }
            value={hub.HubInternalName}
          />
          <TextField
            id='hopSubnet'
            label='Hop Subnet'
            ariaLabel='hub hop subnet'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubHopSubnetCidr: event.currentTarget.value,
                })
              )
            }
            value={hub.HubHopSubnetCidr}
          />
          <TextField
            id='addressSpace'
            label='Address Space'
            ariaLabel='hub address space'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubAddressSpace: event.currentTarget.value,
                })
              )
            }
            value={hub.HubAddressSpace}
          />
          <TextField
            id='spokeAddressSpace'
            label='Spoke Address Space'
            ariaLabel='spoke address space'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  SpokeAddressSpace: event.currentTarget.value,
                })
              )
            }
            value={hub.SpokeAddressSpace}
          />
          <TextField
            id='spokeBlockSize'
            label='Spoke Block Size'
            ariaLabel='spoke block size'
            inputMode={'numeric'}
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  SpokeNetworkBlockSize:
                    event.currentTarget.value !== ''
                      ? parseInt(event.currentTarget.value)
                      : 0,
                })
              )
            }
            value={hub.SpokeNetworkBlockSize.toString()}
          />
          <TextField
            id='rdpInternalAddress'
            label='RDP Internal Address'
            ariaLabel='hub rdp internal address'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubRDPInternalAddress: event.currentTarget.value,
                })
              )
            }
            value={hub.HubRDPInternalAddress}
          />
          <TextField
            id='natPortStart'
            label='NAT Port Start'
            ariaLabel='hub nat port start'
            inputMode='numeric'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  NatPortStart:
                    event.currentTarget.value !== ''
                      ? parseInt(event.currentTarget.value)
                      : 0,
                })
              )
            }
            value={hub.NatPortStart.toString()}
          />
          <TextField
            id='totalNatPorts'
            label='Total Nat Ports'
            ariaLabel='hub total nat ports'
            inputMode='numeric'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  TotalNatPorts:
                    event.currentTarget.value !== ''
                      ? parseInt(event.currentTarget.value)
                      : 0,
                })
              )
            }
            value={hub.TotalNatPorts.toString()}
          />
          <TextField
            id='jitPrefix'
            label='JIT Tag Prefix'
            ariaLabel='jit tag prefix'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  JitTag: event.currentTarget.value,
                })
              )
            }
            value={hub.JitTag}
          />
          <TextField
            id='hubExternalNicInternalName'
            label='Hub External Nic Internal Name'
            ariaLabel='Hub external nic internal name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubExternalNicInternalName: event.currentTarget.value,
                })
              )
            }
            value={hub.HubExternalNicInternalName}
          />
          <TextField
            id='hubExternalZoneName'
            label='Hub External Zone Name'
            ariaLabel='hub external zone name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubExternalZoneName: event.currentTarget.value,
                })
              )
            }
            value={hub.HubExternalZoneName}
          />
          <TextField
            id='hubInternalZoneName'
            label='Hub Internal Zone Name'
            ariaLabel='hub internal zone name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubInternalZoneName: event.currentTarget.value,
                })
              )
            }
            value={hub.HubInternalZoneName}
          />
          <TextField
            id='hubRdpNicInternalName'
            label='Hub RDP Nic Internal Name'
            ariaLabel='hub rdp nic internal name'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubRdpNicInternalName: event.currentTarget.value,
                })
              )
            }
            value={hub.HubRdpNicInternalName}
          />
          <TextField
            id='contentFilter'
            label='Content Filter'
            ariaLabel='hub content filter'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  ContentFilter:
                    event.currentTarget.value.length > 0
                      ? event.currentTarget.value
                      : null,
                })
              )
            }
            value={hub.ContentFilter ?? ''}
          />
          <TextField
            id='hubExternalConnectivityStartIP'
            label='Hub External Connectivity Start IP'
            ariaLabel='hub external connectivity start address'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubExternalConnectivityStartIP: event.currentTarget.value,
                })
              )
            }
            value={hub.HubExternalConnectivityStartIP}
          />
          <TextField
            id='hubExternalConnectivityEndIP'
            label='Hub External Connectivity End IP'
            ariaLabel='hub external connectivity end address'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  HubExternalConnectivityEndIP: event.currentTarget.value,
                })
              )
            }
            value={hub.HubExternalConnectivityEndIP}
          />
          <TextField
            id='maxSpokeNetworksAllowed'
            label='Max Spoke Networks Allowed'
            ariaLabel='max spoke networks allowed'
            inputMode='numeric'
            onChange={(
              event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  MaxSpokeNetworksAllowed:
                    event.currentTarget.value !== ''
                      ? parseInt(event.currentTarget.value)
                      : 0,
                })
              )
            }
            value={hub.MaxSpokeNetworksAllowed.toString()}
          />
          <Toggle
            id='isExternalConnectivityEnabled'
            label='Enable External Connectivity'
            onText='True'
            offText='False'
            ariaLabel='external connectivity toggle'
            onChange={(
              event: React.MouseEvent<HTMLElement, MouseEvent>,
              checked?: boolean
            ) =>
              dispatch(
                updateNewAdminFirewallHub({
                  ...hub,
                  IsExternalConnectivityEnabled: checked,
                })
              )
            }
            checked={hub.IsExternalConnectivityEnabled}
          />

          <Stack
            className={commonStyles.paddingTop12}
            horizontal
            tokens={{ childrenGap: 8 }}
          >
            <PrimaryButton
              onClick={() => handleClose(true)}
              text='Save'
              disabled={!hubHasChanges}
            />
            <DefaultButton
              onClick={() => resetChanges()}
              text='Cancel'
              disabled={!hubHasChanges}
            />
          </Stack>
        </Stack>
      </Panel>
    </>
  );
};
