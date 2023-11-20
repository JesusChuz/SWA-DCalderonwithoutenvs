import { NetworkProtocols } from './enums/NetworkProtocols.types';
import { SyncStatus } from '../enums/SyncStatus';

export interface NatRuleJitEntryDto {
  ID: string;
  Created: string;
  FirewallID: string;
  WorkspaceID: string;
  UserID: string;
  InternalPort: number;
  ExternalPort: number;
  InternalAddress: string;
  ExternalAddress: string;
  Location: string;
  Protocol: NetworkProtocols;
  Expiration?: string;
  Status: SyncStatus;
}
