import cloneDeep from 'lodash/cloneDeep';
import { AzureDomainDto } from '../../types/AzureWorkspace/AzureDomainDto.types';

export const AzureDomainDtoTestData: AzureDomainDto = {
  ID: 'domainTestId',
  Name: 'Test Domain',
  Description: 'Test Domain',
};

export const getTestDomainDto = (
  properties: Partial<AzureDomainDto> = {}
): AzureDomainDto => {
  return cloneDeep({
    ...AzureDomainDtoTestData,
    ...properties,
  });
};
