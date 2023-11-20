import { ResourceState } from './enums/ResourceState';
import { AzureNsgProtocols } from './enums/AzureNsgProtocols';
import { PortRange } from './PortRange.types';

export interface AzureNsgRuleDto {
  Name: string;
  Description: string;
  Priority: number;
  Protocol: AzureNsgProtocols;
  AllowTraffic: boolean;
  FromAddressRanges: string[];
  FromPortRanges: PortRange[];
  ToAddressRanges: string[];
  ToPortRanges: PortRange[];
  ID: string;
  InternalName: string;
  Created?: string;
  Deployed?: string;
  Updated?: string;
  State: ResourceState;
  WorkspaceID: string;
}
