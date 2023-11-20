import { SyncStatus } from '../enums/SyncStatus';

export interface FirewallSettingsDto {
  ID: string;
  SubscriptionId: string;
  ResourceGroupName: string;
  Name: string;
  Created?: string;
  SyncStatus?: SyncStatus;
  UsernameAppSetting: string;
  PasswordAppSetting: string;
  AddressAppSetting: string;
  Location: string;
  OutboundBeforeRuleName: string;
  OutboundTcpServiceName: string;
  OutboundUdpServiceName: string;
  JitTagPrefix: string;
  IsRequested: boolean;
  MaintenanceModeEnabled: boolean;
  LastRequested?: string;
  ConfigID?: string;
  ConfigStatus: SyncStatus;
  EnableJit: boolean;
  EnablePublicFacingAddresses: boolean;
  EnableNatRules: boolean;
  EnableRestrictedEndpoints: boolean;
  EnableConfigProfiles: boolean;
  Address: string;
  PasswordKeyVaultLink: string;
  UsernameKeyVaultLink: string;
  SoftwareVersion: string;
}
