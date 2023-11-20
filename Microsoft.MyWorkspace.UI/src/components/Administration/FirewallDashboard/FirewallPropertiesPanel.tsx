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
  IDropdownStyles,
  IDropdownOption,
  Dropdown,
  useTheme,
} from '@fluentui/react';
import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminConfigProfiles,
  getAdminFirewalls,
  getEditableAdminFirewallHasChanges,
  getEditableAdminFirewallSettings,
} from '../../../store/selectors/adminFirewallSelectors';
import {
  resetSelectedAdminFirewallSettings,
  setSelectedAdminFirewallId,
  updateFirewallSettings,
  updateSelectedAdminFirewallSettings,
} from '../../../store/actions/adminFirewallActions';
import { FirewallSettingsDto } from '../../../types/FirewallManager/FirewallSettingsDto';
import { ConfigProfileDto } from '../../../types/FirewallManager/ConfigProfileDto.types';
import { EMPTY_GUID } from '../../../shared/Constants';
import { SyncStatus } from '../../../types/enums/SyncStatus';
import {
  FirewallStatusDotIcon,
  getFirewallStatusString,
} from './FirewallSettingsStatusIcons';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';

export const FirewallPropertiesPanel = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();
  const [panelOpen, setPanelOpen] = React.useState(false);
  const configProfiles: ConfigProfileDto[] = useSelector(
    getAdminConfigProfiles
  );

  const firewalls: FirewallHubNetworkInfoDto[] = useSelector(getAdminFirewalls);
  const firewallSettings: FirewallSettingsDto = useSelector(
    getEditableAdminFirewallSettings
  );
  const firewallHasChanges: boolean = useSelector(
    getEditableAdminFirewallHasChanges
  );

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };

  const handleClose = async (save: boolean) => {
    dispatch(setSelectedAdminFirewallId(''));

    if (save) {
      dispatch(updateFirewallSettings(firewallSettings));
    }
  };

  const resetChanges = () => {
    dispatch(resetSelectedAdminFirewallSettings());
  };

  const getFirewallInactiveTime = (firewallSettings: FirewallSettingsDto) => {
    if (!firewallSettings.LastRequested) {
      return '0';
    }
    return ((Date.now() - parseInt(firewallSettings.LastRequested)) / 60000)
      .toFixed()
      .toString();
  };

  const isFirewallPending = (firewallSettings: FirewallSettingsDto) => {
    return (
      firewallSettings.SyncStatus == SyncStatus.Creating ||
      firewallSettings.SyncStatus == SyncStatus.CreatePending ||
      firewallSettings.SyncStatus == SyncStatus.Deleting ||
      firewallSettings.SyncStatus == SyncStatus.DeletePending
    );
  };

  const firewallInfo = React.useMemo(
    () =>
      firewalls && firewallSettings
        ? firewalls.find((f) => f.FirewallSettings.ID == firewallSettings.ID)
        : undefined,
    [firewallSettings, firewalls]
  );

  React.useEffect(() => {
    if (firewallSettings) {
      setPanelOpen(true);
    } else {
      setPanelOpen(false);
    }
  }, [firewallSettings]);

  const configProfileOptions = React.useMemo(() => {
    const emptyConfig = { key: EMPTY_GUID, text: 'None' };
    const configOptions = configProfiles.map((cp) => {
      return { key: cp.ID, text: cp.Name };
    });
    configOptions.push(emptyConfig);
    return configOptions;
  }, [configProfiles]);

  return (
    <>
      {firewallInfo && (
        <Panel
          isOpen={panelOpen}
          onDismiss={() => handleClose(false)}
          headerText={'Firewall Properties'}
          closeButtonAriaLabel='Close'
          customWidth={'450px'}
          type={PanelType.custom}
        >
          <Text
            variant='mediumPlus'
            as='h3'
          >{`Spoke usage ${firewallInfo.TotalSpokeNetworkConsumed} / ${firewallInfo.MaxSpokeAllowed}`}</Text>

          <Stack
            horizontal
            verticalAlign='center'
            className={commonStyles.fullHeight}
            tokens={{ childrenGap: 4 }}
          >
            <FirewallStatusDotIcon syncStatus={firewallSettings.SyncStatus} />
            <Text variant='small'>
              {getFirewallStatusString(firewallSettings.SyncStatus)}
            </Text>
          </Stack>

          <Stack
            className={commonStyles.paddingTop12}
            tokens={{ childrenGap: 8 }}
          >
            <TextField
              id='name'
              label='Name'
              ariaLabel='firewall name'
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    Name: event.currentTarget.value,
                  })
                )
              }
              value={firewallSettings.Name}
            />
            <TextField
              id='id'
              label='ID'
              ariaLabel='firewall id'
              disabled
              value={firewallSettings.ID}
            />
            <TextField
              id='subscription id'
              label='Subscription ID'
              ariaLabel='subscription id'
              disabled
              value={firewallSettings.SubscriptionId}
            />
            <TextField
              id='region'
              label='Region'
              ariaLabel='firewall region'
              disabled
              value={firewallSettings.Location}
            />
            <TextField
              id='resourceGroupName'
              label='Resource Group Name'
              ariaLabel='resource group name'
              disabled
              value={firewallSettings.ResourceGroupName}
            />
            <TextField
              id='usernameAppSetting'
              label='Username App Setting'
              ariaLabel='firewall username app setting'
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    UsernameAppSetting: event.currentTarget.value,
                  })
                )
              }
              value={firewallSettings.UsernameAppSetting}
            />
            <TextField
              id='passwordAppSetting'
              label='Password App Setting'
              ariaLabel='firewall password app setting'
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    PasswordAppSetting: event.currentTarget.value,
                  })
                )
              }
              value={firewallSettings.PasswordAppSetting}
            />
            <TextField
              id='addressAppSetting'
              label='Address App Setting'
              ariaLabel='firewall address app setting'
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    AddressAppSetting: event.currentTarget.value,
                  })
                )
              }
              value={firewallSettings.AddressAppSetting}
            />
            <TextField
              id='address'
              label='IP Address'
              ariaLabel='firewall ip address'
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    Address: event.currentTarget.value,
                  })
                )
              }
              value={firewallSettings.Address}
            />
            <TextField
              id='usernameKeyVaultLink'
              label='Username Key Vault Link'
              ariaLabel='firewall username key vault link'
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    UsernameKeyVaultLink: event.currentTarget.value,
                  })
                )
              }
              value={firewallSettings.UsernameKeyVaultLink}
            />
            <TextField
              id='passwordKeyVaultLink'
              label='Password Key Vault Link'
              ariaLabel='firewall password key vault link'
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              onChange={(
                event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    PasswordKeyVaultLink: event.currentTarget.value,
                  })
                )
              }
              value={firewallSettings.PasswordKeyVaultLink}
            />
            <Dropdown
              styles={dropdownStyles}
              placeholder={
                firewallSettings.ConfigID
                  ? configProfiles.find(
                      (c) => c.ID === firewallSettings.ConfigID
                    )?.Name
                  : configProfileOptions.find((c) => c.key === EMPTY_GUID)?.text
              }
              disabled={
                !firewallInfo.FirewallSettings.MaintenanceModeEnabled ||
                isFirewallPending(firewallSettings)
              }
              selectedKey={firewallSettings.ConfigID}
              label='Select Configuration Profile'
              onChange={(
                event: React.FormEvent<HTMLDivElement>,
                item: IDropdownOption
              ) => {
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    ConfigID: item.key.toString(),
                  })
                );
              }}
              options={configProfileOptions}
              ariaLabel='Select Configuration Profile'
            />
            <Toggle
              id='maintenanceMode'
              label='Maintenance Mode'
              onText='On'
              offText='Off'
              ariaLabel='maintenance mode switch'
              disabled={isFirewallPending(firewallSettings)}
              onChange={(
                event: React.MouseEvent<HTMLElement, MouseEvent>,
                checked?: boolean
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    MaintenanceModeEnabled: checked,
                  })
                )
              }
              checked={firewallSettings.MaintenanceModeEnabled}
            />
            <Toggle
              id='enableJit'
              label='Enable JIT'
              onText='On'
              offText='Off'
              ariaLabel='enable jit switch'
              disabled={isFirewallPending(firewallSettings)}
              onChange={(
                event: React.MouseEvent<HTMLElement, MouseEvent>,
                checked?: boolean
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    EnableJit: checked,
                  })
                )
              }
              checked={firewallSettings.EnableJit}
            />
            <Toggle
              id='enablePublicFacingAddresses'
              label='Enable Public Facing Addresses'
              onText='On'
              offText='Off'
              ariaLabel='enable public address switch'
              disabled={isFirewallPending(firewallSettings)}
              onChange={(
                event: React.MouseEvent<HTMLElement, MouseEvent>,
                checked?: boolean
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    EnablePublicFacingAddresses: checked,
                  })
                )
              }
              checked={firewallSettings.EnablePublicFacingAddresses}
            />
            <Toggle
              id='enableNatRules'
              label='Enable NAT Rules'
              onText='On'
              offText='Off'
              ariaLabel='enable nat switch'
              disabled={isFirewallPending(firewallSettings)}
              onChange={(
                event: React.MouseEvent<HTMLElement, MouseEvent>,
                checked?: boolean
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    EnableNatRules: checked,
                  })
                )
              }
              checked={firewallSettings.EnableNatRules}
            />
            <Toggle
              id='enableRestrictedEndpoints'
              label='Enable Restricted Endpoints'
              onText='On'
              offText='Off'
              ariaLabel='enable restricted endpoints'
              disabled={isFirewallPending(firewallSettings)}
              onChange={(
                event: React.MouseEvent<HTMLElement, MouseEvent>,
                checked?: boolean
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    EnableRestrictedEndpoints: checked,
                  })
                )
              }
              checked={firewallSettings.EnableRestrictedEndpoints}
            />
            <Toggle
              id='enableConfigProfiles'
              label='Enable Configuration Profiles'
              onText='On'
              offText='Off'
              ariaLabel='enable configuration profiles switch'
              disabled={isFirewallPending(firewallSettings)}
              onChange={(
                event: React.MouseEvent<HTMLElement, MouseEvent>,
                checked?: boolean
              ) =>
                dispatch(
                  updateSelectedAdminFirewallSettings({
                    ...firewallSettings,
                    EnableConfigProfiles: checked,
                  })
                )
              }
              checked={firewallSettings.EnableConfigProfiles}
            />
            <Stack
              className={commonStyles.paddingTop12}
              horizontal
              tokens={{ childrenGap: 8 }}
            >
              <PrimaryButton
                onClick={() => handleClose(true)}
                text='Save'
                disabled={
                  !firewallHasChanges || isFirewallPending(firewallSettings)
                }
              />
              <DefaultButton onClick={() => resetChanges()} text='Cancel' />
            </Stack>
          </Stack>
        </Panel>
      )}
    </>
  );
};
