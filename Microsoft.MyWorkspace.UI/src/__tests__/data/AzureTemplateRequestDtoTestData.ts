import { AzureTemplateRequestDto } from '../../types/Catalog/AzureTemplateRequestDto.types';
import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';

export const AzureTemplateRequestDtoTestData: AzureTemplateRequestDto = {
  Guid: '',
  Name: '',
  Description: '',
  OwnerID: '',
  OwnerEmail: '',
  Created: '',
  State: ResourceState.Running,
  WorkspaceID: '',
  StartDate: '',
  EndDate: '',
};

export const getTestTemplateRequestDto = (
  properties: Partial<AzureTemplateRequestDto> = {}
): AzureTemplateRequestDto => {
  return {
    ...AzureTemplateRequestDtoTestData,
    ...properties,
  };
};
