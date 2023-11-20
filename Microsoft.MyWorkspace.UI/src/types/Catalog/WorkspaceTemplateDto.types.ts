import { AzureDomainDto } from '../AzureWorkspace/AzureDomainDto.types';
import { TemplateRequestStatus } from '../enums/TemplateRequestStatus';
import { TemplateFailure } from './TemplateFailure.types';
import { VirtualMachineTemplateDto } from './VirtualMachineTemplateDto.types';
import { VirtualNetworkTemplateDto } from './VirtualNetworkTemplateDto.types';

export interface WorkspaceTemplateDto {
  ID: string;
  Name: string;
  Description: string;
  SpecialInstructions: string;
  SourceWorkspaceId: string;
  OriginalSegmentId: string;
  AuthorUserId: string;
  AuthorEmail: string;
  CreatedDate: string;
  LastModifiedDate: string;
  // This will be removed in the future. Remaining for backward compatibility
  IsPublished: boolean;
  Status: TemplateRequestStatus;
  Failures: TemplateFailure[];
  VirtualMachines: VirtualMachineTemplateDto[];
  VirtualNetworks: VirtualNetworkTemplateDto[];
  Domains: AzureDomainDto[];
  AllowedSegmentIds: string[];
  WorkspaceTenantId: string;
  TotalSuccessfulDeployments: number;
  TotalFailedDeployments: number;
}
