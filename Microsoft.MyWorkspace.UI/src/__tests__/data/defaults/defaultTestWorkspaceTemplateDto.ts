import { getTestVirtualMachineTemplateDto } from 'src/__tests__/data/VirtualMachineTemplateDtoTestData';
import { getTestWorkspaceTemplateDto } from 'src/__tests__/data/WorkspaceTemplateDtoTestData';
import { VirtualNetworkTemplateDto } from 'src/types/Catalog/VirtualNetworkTemplateDto.types';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import { v4 as uuid } from 'uuid';
import { getTestNicTemplateDto } from '../NicTemplateDtoTestData';
import { getTestDataDiskTemplateDto } from '../DataDiskTemplateDto';
import { getTestDomainDto } from '../AzureDomainDtoTestData';
import { DomainRoles } from 'src/types/AzureWorkspace/enums/DomainRoles';

const virtualNetworks: VirtualNetworkTemplateDto[] = [
  {
    Name: 'Test Virtual Network 1',
    Description: 'This is a test virtual network 1',
    SubnetProperties: {
      subnet1: {
        IsRoutable: true,
      },
    },
  },
];

export const defaultTestWorkspaceTemplateDto: WorkspaceTemplateDto[] = [
  getTestWorkspaceTemplateDto({
    Name: 'Test Template 1',
    ID: uuid(),
    CreatedDate: '2023-08-08T18:30:27Z',
    TotalSuccessfulDeployments: 23,
    AuthorEmail: 'test1@microsoft.com',
    Description: 'This is a test description 1',
    VirtualMachines: [
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        MemoryGB: 4,
        ComputerName: 'VM0',
        Name: 'Test Virtual Machine 1',
        AdministratorName: 'testName1',
        Sku: 'Standard_B2s',
        OSDiskSizeInGB: 128,
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
        DomainRole: DomainRoles.DomainController,
        DomainID: '5e5f96e8-c9e7-42a8-aabd-0bf52093d4cd',
        DataDisks: [
          getTestDataDiskTemplateDto({ Name: 'Data Disk 1', SizeGB: 2 }),
          getTestDataDiskTemplateDto({ Name: 'Data Disk 2', SizeGB: 4 }),
          getTestDataDiskTemplateDto({ Name: 'Data Disk 3', SizeGB: 2 }),
        ],
      }),
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        MemoryGB: 8,
        ComputerName: 'VM1',
        Name: 'Test Virtual Machine 2',
        AdministratorName: 'testName1',
        Sku: 'Standard_B2ms',
        OSDiskSizeInGB: 256,
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
        DomainRole: DomainRoles.DomainMember,
        DomainID: '5e5f96e8-c9e7-42a8-aabd-0bf52093d4cd',
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
    Domains: [
      getTestDomainDto({
        ID: '5e5f96e8-c9e7-42a8-aabd-0bf52093d4cd',
        Name: 'Test Domain',
      }),
    ],
  }),
  getTestWorkspaceTemplateDto({
    Name: 'Test Template 2',
    ID: uuid(),
    CreatedDate: '2023-07-07T18:30:27Z',
    TotalSuccessfulDeployments: 12,
    AuthorEmail: 'test2@microsoft.com',
    Description: 'This is a test description 2',
    VirtualMachines: [
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        ComputerName: 'VM2',
        Name: 'Test Virtual Machine 3',
        AdministratorName: 'testName2',
        OSDiskSizeInGB: 128,
        Sku: 'Standard_B4ms',
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
      }),
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        MemoryGB: 8,
        ComputerName: 'VM3',
        Name: 'Test Virtual Machine 4',
        AdministratorName: 'testName2',
        OSDiskSizeInGB: 256,
        Sku: 'Standard_B4ms',
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
  }),
  getTestWorkspaceTemplateDto({
    Name: 'Test Template 3',
    ID: uuid(),
    CreatedDate: '2023-06-02T18:30:27Z',
    TotalSuccessfulDeployments: 5,
    AuthorEmail: 'test3@microsoft.com',
    Description: 'This is a test description 3',
    VirtualMachines: [
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        ComputerName: 'VM4',
        Name: 'Test Virtual Machine 5',
        AdministratorName: 'testName3',
        OSDiskSizeInGB: 128,
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
      }),
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        MemoryGB: 8,
        ComputerName: 'VM5',
        Name: 'Test Virtual Machine 6',
        AdministratorName: 'testName3',
        OSDiskSizeInGB: 256,
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
  }),
  getTestWorkspaceTemplateDto({
    Name: 'Another Template',
    ID: uuid(),
    CreatedDate: '2023-02-06T18:30:27Z',
    TotalSuccessfulDeployments: 0,
    AuthorEmail: 'test4@microsoft.com',
    Description: 'This is a test description 4',
    VirtualMachines: [
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        ComputerName: 'VM6',
        Name: 'Test Virtual Machine 7',
        AdministratorName: 'testName4',
        OSDiskSizeInGB: 128,
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
      }),
      getTestVirtualMachineTemplateDto({
        ImageSourceID: uuid(),
        MemoryGB: 8,
        ComputerName: 'VM7',
        Name: 'Test Virtual Machine 8',
        AdministratorName: 'testName4',
        OSDiskSizeInGB: 256,
        Nics: [
          getTestNicTemplateDto({
            Name: 'nic1',
            VirtualNetworkName: virtualNetworks[0].Name,
            SubnetName: 'subnet1',
          }),
        ],
      }),
    ],
    VirtualNetworks: [...virtualNetworks],
  }),
];
