import { AzureVirtualMachineSnapshotDto } from '../../types/AzureWorkspace/AzureVirtualMachineSnapshotDto.types';
import { AzureVirtualMachineSnapshotForCreationDto } from '../../types/ResourceCreation/AzureVirtualMachineSnapshotForCreationDto';
import { ResourceState } from '../../types/AzureWorkspace/enums/ResourceState';
import { AzureStorageType } from '../../types/AzureWorkspace/enums/AzureStorageType';

export const AzureVirtualMachineSnapshotForCreationTestData: AzureVirtualMachineSnapshotForCreationDto =
  {
    Name: '',
    VirtualMachineID: '',
    Description: '',
  };

export const AzureVirtualMachineSnapshotTestData: AzureVirtualMachineSnapshotDto =
  {
    ID: '',
    Name: '',
    WorkspaceID: '',
    VirtualMachineID: '',
    Description: '',
    Created: '',
    OSDiskSnapshot: {
      ID: '',
      InternalName: '',
      Name: '',
      Description: '',
      DiskID: '',
      WorkspaceID: '',
      SubscriptionID: '',
      Location: '',
      ResourceGroupName: '',
      State: ResourceState.Running,
      DataDisk: {
        ID: '',
        Name: '',
        InternalName: '',
        Description: '',
        Created: '',
        Deployed: '',
        Updated: '',
        State: ResourceState.Running,
        WorkspaceID: '',
        VirtualMachineID: '',
        VirtualMachineName: '',
        SizeGB: 0,
        Lun: 0,
        StorageType: AzureStorageType.StandardHDD,
        SubscriptionID: '',
        ResourceGroupName: '',
        Location: '',
      },
    },
    DiskSnapshots: [],
  };

export const getTestVirtualMachineSnapshotForCreationDto = (
  properties: Partial<AzureVirtualMachineSnapshotForCreationDto> = {}
): AzureVirtualMachineSnapshotForCreationDto => {
  return {
    ...AzureVirtualMachineSnapshotForCreationTestData,
    ...properties,
  };
};

export const getTestVirtualMachineSnapshotDto = (
  properties: Partial<AzureVirtualMachineSnapshotDto> = {}
): AzureVirtualMachineSnapshotDto => {
  return {
    ...AzureVirtualMachineSnapshotTestData,
    ...properties,
  };
};
