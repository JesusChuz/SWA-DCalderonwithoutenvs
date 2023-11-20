import { VirtualMachineSkuDto } from '../../types/Catalog/VirtualMachineSkuDto.types';

export const VirtualMachineSkuDtoTestData: VirtualMachineSkuDto = {
  ID: '',
  CanSupportDomainController: true,
  CanSupportVirtualization: false,
  Name: '',
  NumberOfCores: 1,
  Memory: 4,
  MaxDataDisks: 2,
  MaxNics: 2,
  Published: true,
  Production: true,
};

export const getTestVirtualMachineSkuDto = (
  properties: Partial<VirtualMachineSkuDto> = {}
): VirtualMachineSkuDto => {
  return {
    ...VirtualMachineSkuDtoTestData,
    ...properties,
  };
};
