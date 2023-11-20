import { HubNetworkInfoDto } from '../types/AzureWorkspace/HubNetworkInfoDto.types';

export const Blank_HubNetworkInfoDto: HubNetworkInfoDto = {
  ID: '',
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  HubFQDN: '',
  HubInternalName: '',
  HubHopSubnetCidr: '',
  HubAddressSpace: '',
  StartIPCidr: '',
  IsExternalConnectivityEnabled: false,
  HubExternalNicInternalName: '',
  Ports: [],
};
