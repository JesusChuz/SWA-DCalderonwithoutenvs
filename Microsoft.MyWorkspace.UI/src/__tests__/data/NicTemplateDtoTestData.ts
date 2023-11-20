import { NicTemplateDto } from 'src/types/Catalog/NicTemplateDto.types';

export const NicTemplateDtoTestData: NicTemplateDto = {
  Name: '',
  Description: '',
  VirtualNetworkName: '',
  SubnetName: '',
};

export const getTestNicTemplateDto = (
  properties: Partial<NicTemplateDto> = {}
): NicTemplateDto => {
  return {
    ...NicTemplateDtoTestData,
    ...properties,
  };
};
