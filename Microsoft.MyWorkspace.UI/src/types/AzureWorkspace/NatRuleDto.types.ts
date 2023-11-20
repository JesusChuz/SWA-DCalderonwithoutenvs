import { NetworkProtocols } from './enums/NetworkProtocols.types';

export interface NatRuleDto {
  ID: string;
  Name: string;
  Description: string;
  WorkspaceID: string;
  VirtualMachineID: string;
  InternalPort: number;
  ExternalPort: number;
  PortCount: number;
  InternalAddress: string;
  ExternalAddress: string;
  Protocol: NetworkProtocols;
}
