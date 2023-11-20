import { ChunkDto } from './ChunkDto.types';

export interface HubNetworkDto {
  ID: string;
  Name: string;
  IsPublished: boolean;
  SubscriptionID: string;
  ResourceGroupName: string;
  Location: string;
  HubFQDN: string;
  HubHopSubnetCidr: string;
  HubAddressSpace: string;
  HubInternalName: string;
  ChunkMap: ChunkDto[];
}
