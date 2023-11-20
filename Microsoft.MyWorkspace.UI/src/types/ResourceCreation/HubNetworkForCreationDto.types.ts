export interface HubNetworkForCreationDto {
  SubscriptionID: string;
  FirewallID: string;
  Name: string;
  IsPublished: boolean;
  ResourceGroupName: string;
  Location: string;
  HubFQDN: string;
  HubHopSubnetCidr: string;
  HubAddressSpace: string;
  HubInternalName: string;
  SpokeAddressSpace: string;
  SpokeNetworkBlockSize: number;
  HubRDPInternalAddress: string;
  NatPortStart: number;
  TotalNatPorts: number;
  JitTag: string;
  IsExternalConnectivityEnabled: boolean;
  HubExternalNicInternalName: string;
  HubExternalZoneName: string;
  HubInternalZoneName: string;
  HubRdpNicInternalName: string;
  ContentFilter: string;
  MaxSpokeNetworksAllowed: number;
  HubExternalConnectivityStartIP: string;
  HubExternalConnectivityEndIP: string;
}
