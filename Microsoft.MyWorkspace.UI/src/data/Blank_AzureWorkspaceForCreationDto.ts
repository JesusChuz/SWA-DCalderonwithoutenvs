import { AzureWorkspaceForCreationDto } from '../types/ResourceCreation/AzureWorkspaceForCreationDto.types';

export const Blank_AzureWorkspaceForCreationDto: AzureWorkspaceForCreationDto =
  {
    Name: 'New Azure Workspace',
    Description: '',
    OwnerID: '00000000-0000-0000-0000-000000000000',
    SharedOwnerIDs: [],
    VirtualMachines: [],
    VirtualNetworks: [
      {
        Name: 'Default Virtual Network',
        Description: '',
        SubnetProperties: {
          subnet1: {
            IsRoutable: true,
          },
        },
      },
    ],
    Location: '',
    SubscriptionID: '00000000-0000-0000-0000-000000000000',
    Domains: [],
    Geography: '',
  };
