import { HubNetworkDto } from '../../types/FirewallManager/HubNetworkDto';
import { HubNetworkForCreationDto } from '../../types/ResourceCreation/HubNetworkForCreationDto.types';

export const HubNetworkDtoTestData: HubNetworkDto = {
  ID: 'test-id',
  SubscriptionID: 'subscription-id',
  FirewallID: 'firewall-id',
  Name: 'Hub Network',
  IsPublished: true,
  ResourceGroupName: 'resource-group',
  Location: 'westus',
  HubFQDN: '',
  HubHopSubnetCidr: '',
  HubAddressSpace: '',
  HubInternalName: '',
  SpokeAddressSpace: '',
  SpokeNetworkBlockSize: 12,
  HubRDPInternalAddress: '',
  NatPortStart: 1,
  TotalNatPorts: 10,
  JitTag: '',
  IsExternalConnectivityEnabled: true,
  HubExternalNicInternalName: '',
  HubExternalZoneName: '',
  HubInternalZoneName: '',
  HubRdpNicInternalName: '',
  ContentFilter: '',
  TotalSpokeNetworksConsumed: 5,
  MaxSpokeNetworksAllowed: 8,
};

export const HubNetworkForCreationDtoTestData: HubNetworkForCreationDto = {
  SubscriptionID: 'subscription-id',
  FirewallID: 'firewall-id',
  Name: 'Hub Network',
  IsPublished: true,
  ResourceGroupName: 'resource-group',
  Location: 'westus',
  HubFQDN: '',
  HubHopSubnetCidr: '',
  HubAddressSpace: '',
  HubInternalName: '',
  SpokeAddressSpace: '',
  SpokeNetworkBlockSize: 12,
  HubRDPInternalAddress: '',
  NatPortStart: 1,
  TotalNatPorts: 10,
  JitTag: '',
  IsExternalConnectivityEnabled: true,
  HubExternalNicInternalName: '',
  HubExternalZoneName: '',
  HubInternalZoneName: '',
  HubRdpNicInternalName: '',
  ContentFilter: '',
  MaxSpokeNetworksAllowed: 8,
  HubExternalConnectivityStartIP: '',
  HubExternalConnectivityEndIP: '',
};

export const getTestHubNetworkDto = (
  properties: Partial<HubNetworkDto> = {}
): HubNetworkDto => {
  return {
    ...HubNetworkDtoTestData,
    ...properties,
  };
};

export const getTestHubNetworkForCreationDto = (
  properties: Partial<HubNetworkForCreationDto> = {}
): HubNetworkForCreationDto => {
  return {
    ...HubNetworkForCreationDtoTestData,
    ...properties,
  };
};
