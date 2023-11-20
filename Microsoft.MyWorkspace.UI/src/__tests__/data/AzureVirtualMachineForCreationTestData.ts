import { AzureStorageAccountType } from '../../types/AzureWorkspace/enums/AzureStorageAccountType';
import { DomainRoles } from '../../types/AzureWorkspace/enums/DomainRoles';
import { MachineImageType } from '../../types/AzureWorkspace/enums/MachineImageType';
import { OSVersion } from '../../types/enums/OSVersion';
import { PatchMode } from '../../types/enums/PatchMode';
import { AzureVirtualMachineForCreationDto } from '../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';

export const AzureVirtualMachineForCreationTestData: AzureVirtualMachineForCreationDto =
  {
    Name: '',
    Description: '',
    AdministratorName: '',
    AdministratorPassword: '',
    ComputerName: '',
    DomainRole: DomainRoles.WorkgroupMember,
    DomainID: '',
    MemoryGB: 4,
    ImageSourceID: '',
    PrimaryNicName: '',
    Sku: '',
    StorageAccountType: AzureStorageAccountType.Standard_LRS,
    Nics: [],
    OSDiskSizeInGB: 128,
    DataDisks: [],
    PatchMode: PatchMode.Default,
    OSVersion: OSVersion.Windows,
    MachineImageType: MachineImageType.Marketplace,
    IsNested: false,
  };

export const getTestVirtualMachineForCreationDto = (
  properties: Partial<AzureVirtualMachineForCreationDto> = {}
): AzureVirtualMachineForCreationDto => {
  return {
    ...AzureVirtualMachineForCreationTestData,
    ...properties,
  };
};
