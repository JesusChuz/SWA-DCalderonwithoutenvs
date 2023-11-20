import { AzureStorageAccountType } from '../../types/AzureWorkspace/enums/AzureStorageAccountType';
import { DomainRoles } from '../../types/AzureWorkspace/enums/DomainRoles';
import { OSVersion } from '../../types/enums/OSVersion';
import { PatchMode } from '../../types/enums/PatchMode';
import { AzureVirtualMachineDto } from '../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { MachineImageType } from '../../types/AzureWorkspace/enums/MachineImageType';

export const AzureVirtualMachineTestData: AzureVirtualMachineDto = {
  ID: '',
  Name: '',
  InternalName: '',
  State: ResourceState.Running,
  WorkspaceID: '',
  PrimaryNicID: '',
  RDPAddress: '',
  RDPPort: 0,
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
  SubscriptionID: '',
  ResourceGroupName: '',
  Location: '',
  NatRules: [],
  MachineImageType: MachineImageType.Marketplace,
  Snapshots: [],
  IsNested: false,
};

export const getTestVirtualMachineDto = (
  properties: Partial<AzureVirtualMachineDto> = {}
): AzureVirtualMachineDto => {
  return {
    ...AzureVirtualMachineTestData,
    ...properties,
  };
};
