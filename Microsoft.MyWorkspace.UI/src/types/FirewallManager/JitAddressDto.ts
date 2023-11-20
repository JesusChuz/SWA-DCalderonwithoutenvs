import { SyncStatus } from '../enums/SyncStatus';

export interface JitAddressDto {
  ID: string;
  RegionID: string;
  WorkspaceID: string;
  UserID: string;
  Address: string;
  Location: string;
  Hours: number;
  Created: string;
  Expiration?: string;
  Status: SyncStatus;
}
