import { VirtualMachineCustomDto } from '../../types/Catalog/VirtualMachineCustomDto.types';
import { OSVersion } from '../../types/enums/OSVersion';
import { PatchMode } from '../../types/enums/PatchMode';

export const VirtualMachineCustomDtoTestData: VirtualMachineCustomDto = {
  ID: '',
  PatchMode: PatchMode.Default,
  CanSupportDomainController: true,
  Name: '',
  Description: '',
  ImageSourceID: '',
  OSVersion: OSVersion.Windows,
  CanSupportVirtualization: true,
  IsNested: false,
};

export const getTestVirtualMachineCustomDto = (
  properties: Partial<VirtualMachineCustomDto> = {}
): VirtualMachineCustomDto => {
  return {
    ...VirtualMachineCustomDtoTestData,
    ...properties,
  };
};
