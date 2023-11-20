import { FirewallHubNetworkInfoDto } from '../../types/FirewallManager/FirewallHubNetworkInfoDto';
import { FirewallSettingsDtoTestData } from './FirewallSettingsDtoTestData';

export const FirewallHubNetworkInfoDtoTestData: FirewallHubNetworkInfoDto = {
  FirewallSettings: FirewallSettingsDtoTestData,
  TotalAssociatedHubNetworks: 0,
  TotalSpokeNetworkConsumed: 0,
  MaxSpokeAllowed: 0,
  AssociatedHubNetworks: [],
};

export const getTestFirewallHubNetworkInfoDto = (
  properties: Partial<FirewallHubNetworkInfoDto> = {}
): FirewallHubNetworkInfoDto => {
  return {
    ...FirewallHubNetworkInfoDtoTestData,
    ...properties,
  };
};
