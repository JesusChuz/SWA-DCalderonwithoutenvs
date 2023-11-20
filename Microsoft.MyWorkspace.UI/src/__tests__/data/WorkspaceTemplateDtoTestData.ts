import { TemplateRequestStatus } from '../../types/enums/TemplateRequestStatus';
import { WorkspaceTemplateDto } from '../../types/Catalog/WorkspaceTemplateDto.types';
import { AzureDomainDtoTestData } from '../../__tests__/data/AzureDomainDtoTestData';
import { VirtualMachineTemplateDtoTestData } from './VirtualMachineTemplateDtoTestData';
import { VirtualNetworkTemplateDtoTestData } from './VirtualNetworkTemplateDtoTestData';

export const WorkspaceTemplateDtoTestData: WorkspaceTemplateDto = {
  ID: 'testTemplate1ID',
  Name: 'Template 1',
  Description: 'This is a test description for Template 1.',
  Domains: [AzureDomainDtoTestData],
  SpecialInstructions: '',
  SourceWorkspaceId: '',
  OriginalSegmentId: '',
  AuthorUserId: '',
  AuthorEmail: '',
  CreatedDate: '',
  LastModifiedDate: '',
  // This will be removed in the future. Remaining for backward compatibility
  IsPublished: true,
  Status: TemplateRequestStatus.Published,
  Failures: [],
  VirtualMachines: [VirtualMachineTemplateDtoTestData],
  VirtualNetworks: [VirtualNetworkTemplateDtoTestData],
  AllowedSegmentIds: [],
  WorkspaceTenantId: '',
  TotalFailedDeployments: 0,
  TotalSuccessfulDeployments: 0,
};

export const getTestWorkspaceTemplateDto = (
  properties: Partial<WorkspaceTemplateDto> = {}
): WorkspaceTemplateDto => {
  return {
    ...WorkspaceTemplateDtoTestData,
    ...properties,
  };
};
