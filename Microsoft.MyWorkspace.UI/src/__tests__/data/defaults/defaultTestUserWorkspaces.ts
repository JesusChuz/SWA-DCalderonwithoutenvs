import { getTestWorkspace } from 'src/__tests__/data/AzureWorkspaceTestData';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { v4 as uuid } from 'uuid';
import { defaultTestUserRoleAssignment } from './defaultTestUserRoleAssignment';
import { getTestVirtualMachineDto } from '../AzureVirtualMachineTestData';
import { getTestNicDto } from '../AzureNicDtoTestData';
import { ResourceState } from 'src/types/AzureWorkspace/enums/ResourceState';
import { AzureVirtualNetworkDto } from 'src/types/AzureWorkspace/AzureVirtualNetworkDto.types';
import { getTestVirtualNetworkDto } from '../AzureVirtualNetworkTestData';

const virtualNetworks: AzureVirtualNetworkDto[] = [
  getTestVirtualNetworkDto({
    Name: 'Test Virtual Network 1',
    Description: 'This is a test virtual network 1',
    SubnetProperties: {
      subnet1: {
        IsRoutable: true,
      },
    },
  }),
];

export const defaultTestUserWorkspaces: AzureWorkspaceDto[] = [
  getTestWorkspace({
    ID: uuid(),
    Name: 'Test Workspace 1',
    Description: 'Test Workspace 1 Description',
    Created: '2023-08-07T17:33:55.179349Z',
    Location: 'WestUS',
    OwnerID: defaultTestUserRoleAssignment.UserId,
    State: ResourceState.Off,
    VirtualMachines: [
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test VM 1',
        ComputerName: 'VM1',
        AdministratorName: 'testName1',
        Sku: 'Standard_B2s',
        MemoryGB: 4,
        OSDiskSizeInGB: 256,
        Nics: [getTestNicDto()],
      }),
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test VM 2',
        ComputerName: 'VM2',
        AdministratorName: 'testName1',
        Sku: 'Standard_B2ms',
        MemoryGB: 8,
        OSDiskSizeInGB: 128,
        Nics: [getTestNicDto()],
      }),
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test VM 3',
        ComputerName: 'VM3',
        AdministratorName: 'testName1',
        Sku: 'Standard_B4ms',
        MemoryGB: 16,
        OSDiskSizeInGB: 128,
        Nics: [getTestNicDto()],
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
  }),
  getTestWorkspace({
    ID: uuid(),
    Name: 'Test Workspace 2',
    Description: 'Test Workspace 2 Description',
    Created: '2023-08-06T17:33:55.179349Z',
    Location: 'WestUS2',
    OwnerID: defaultTestUserRoleAssignment.UserId,
    State: ResourceState.Running,
    VirtualMachines: [
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test VM 4',
        ComputerName: 'VM4',
        AdministratorName: 'testName2',
        Sku: 'Standard_B2s',
        MemoryGB: 4,
        OSDiskSizeInGB: 256,
        Nics: [getTestNicDto()],
      }),
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test VM 5',
        ComputerName: 'VM5',
        AdministratorName: 'testName2',
        Sku: 'Standard_B2ms',
        MemoryGB: 8,
        OSDiskSizeInGB: 128,
        Nics: [getTestNicDto()],
      }),
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test VM 6',
        ComputerName: 'VM6',
        AdministratorName: 'testName2',
        Sku: 'Standard_B4ms',
        MemoryGB: 16,
        OSDiskSizeInGB: 128,
        Nics: [getTestNicDto()],
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
  }),
  getTestWorkspace({
    ID: uuid(),
    Name: 'Test Nested Workspace 3',
    Description: 'Test Workspace 3 Description',
    Created: '2023-08-05T17:33:55.179349Z',
    Location: 'WestUS3',
    OwnerID: defaultTestUserRoleAssignment.UserId,
    State: ResourceState.Off,
    VirtualMachines: [
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test Nested VM 1',
        ComputerName: 'VM7',
        IsNested: true,
        AdministratorName: 'testName3',
        Sku: 'Standard_B2s',
        MemoryGB: 4,
        OSDiskSizeInGB: 128,
        Nics: [getTestNicDto()],
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
  }),
  getTestWorkspace({
    ID: uuid(),
    Name: 'Test Nested Workspace 4',
    Description: 'Test Workspace 3 Description',
    Created: '2023-08-05T17:33:55.179349Z',
    Location: 'WestUS3',
    OwnerID: defaultTestUserRoleAssignment.UserId,
    State: ResourceState.Running,
    VirtualMachines: [
      getTestVirtualMachineDto({
        ID: uuid(),
        Name: 'Test Nested VM 1',
        ComputerName: 'VM8',
        IsNested: true,
        AdministratorName: 'testName4',
        Sku: 'Standard_B2s',
        MemoryGB: 4,
        OSDiskSizeInGB: 128,
        Nics: [getTestNicDto()],
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
  }),
];
