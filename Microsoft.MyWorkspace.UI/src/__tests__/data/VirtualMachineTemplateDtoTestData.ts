import { AzureStorageAccountType } from '../../types/AzureWorkspace/enums/AzureStorageAccountType';
import { DomainRoles } from '../../types/AzureWorkspace/enums/DomainRoles';
import { VirtualMachineTemplateDto } from '../../types/Catalog/VirtualMachineTemplateDto.types';
import { OSVersion } from '../../types/enums/OSVersion';
import { PatchMode } from '../../types/enums/PatchMode';

export const VirtualMachineTemplateDtoTestData: VirtualMachineTemplateDto = {
  Name: 'Test Virtual Machine Template',
  Description: 'Test Virtual Machine Template',
  OSVersion: OSVersion.Windows,
  ImageSourceID: 'testImageSourceId',
  AdministratorName: 'Test Admin Name',
  AdministratorPassword: 'Test Admin Password',
  ComputerName: 'Test Computer Name',
  DomainRole: DomainRoles.DomainController,
  DomainID: 'domainTestId',
  MemoryGB: 4,
  PrimaryNicName: 'test nic name',
  Sku: 'Standard_B2ms',
  StorageAccountType: AzureStorageAccountType.StandardSSD_LRS,
  Nics: [],
  OSDiskSizeInGB: 128,
  DataDisks: [],
  PatchMode: PatchMode.Default,
  IsNested: false,
};

export const getTestVirtualMachineTemplateDto = (
  properties: Partial<VirtualMachineTemplateDto> = {}
): VirtualMachineTemplateDto => {
  return {
    ...VirtualMachineTemplateDtoTestData,
    ...properties,
  };
};
