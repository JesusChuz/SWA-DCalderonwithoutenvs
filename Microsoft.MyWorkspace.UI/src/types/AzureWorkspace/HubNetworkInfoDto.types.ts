export interface HubNetworkInfoDto {
  ID: string;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
  HubFQDN: string;
  HubInternalName: string;
  HubHopSubnetCidr: string;
  HubAddressSpace: string;
  StartIPCidr: string;
  IsExternalConnectivityEnabled: boolean;
  HubExternalNicInternalName: string;
  Ports: number[];
}
