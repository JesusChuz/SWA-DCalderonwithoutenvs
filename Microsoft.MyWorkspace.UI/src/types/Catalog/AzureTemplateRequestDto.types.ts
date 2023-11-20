import { ResourceState } from '../AzureWorkspace/enums/ResourceState';

export interface AzureTemplateRequestDto {
  Guid: string;
  WorkspaceID: string;
  OwnerID: string;
  OwnerEmail: string;
  Name: string;
  Description: string;
  Created: string;
  State: ResourceState;
  StartDate: string;
  EndDate: string;
}
