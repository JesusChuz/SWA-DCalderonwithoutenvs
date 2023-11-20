import { SyncStatus } from '../../types/enums/SyncStatus';
import { FirewallSettingsDto } from '../../types/FirewallManager/FirewallSettingsDto';

export const FirewallSettingsDtoTestData: FirewallSettingsDto = {
  ID: 'test-id',
  SubscriptionId: 'ee39fa13-4019-4743-b99c-fa20990ac028',
  ResourceGroupName: 'rg-name',
  Name: 'Firewall Setting',
  UsernameAppSetting: 'username-app-setting',
  PasswordAppSetting: 'password-app-setting',
  AddressAppSetting: 'address-app-setting',
  Location: 'westus',
  OutboundBeforeRuleName: 'outbound-rule',
  JitTagPrefix: 'test-prefix',
  IsRequested: true,
  MaintenanceModeEnabled: true,
  OutboundTcpServiceName: '',
  OutboundUdpServiceName: '',
  ConfigID: '',
  ConfigStatus: SyncStatus.Inactive,
  EnableJit: false,
  EnablePublicFacingAddresses: false,
  EnableNatRules: false,
  EnableRestrictedEndpoints: false,
  EnableConfigProfiles: false,
  SyncStatus: SyncStatus.Active,
  Created: new Date().toString(),
  Address: '192.168.1.1',
  PasswordKeyVaultLink: '',
  UsernameKeyVaultLink: '',
  SoftwareVersion: '',
};

export const getTestFirewallSettingsDto = (
  properties: Partial<FirewallSettingsDto> = {}
): FirewallSettingsDto => {
  return {
    ...FirewallSettingsDtoTestData,
    ...properties,
  };
};
