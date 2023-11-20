import { EditableWorkspace } from '../types/Forms/EditableWorkspace.types';

export const Blank_EditableWorkspace: EditableWorkspace = {
  Name: 'New Workspace',
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
  SecurityLock: false,
  Domains: [],
  Geography: '',
  SharedWithSegment: false,
};
