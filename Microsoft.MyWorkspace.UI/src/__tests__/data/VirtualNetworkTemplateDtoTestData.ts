import { VirtualNetworkTemplateDto } from '../../types/Catalog/VirtualNetworkTemplateDto.types';

export const VirtualNetworkTemplateDtoTestData: VirtualNetworkTemplateDto = {
  Name: 'test template virtual network',
  Description: 'test template virtual network',
  SubnetProperties: {},
};

export const getTestVirtualNetworkTemplateDto = (
  properties: Partial<VirtualNetworkTemplateDto> = {}
): VirtualNetworkTemplateDto => {
  return {
    ...VirtualNetworkTemplateDtoTestData,
    ...properties,
  };
};
