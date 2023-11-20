import { AzureVirtualMachineForCreationTestData } from '../../data/AzureVirtualMachineForCreationTestData';
import {
  CannotDecreaseDiskSize,
  CannotDecreaseOSDiskSize,
  NameMustNotBeBlank,
} from '../../../store/validators/ErrorConstants';
import {
  workspaceValidateDataDisks,
  workspaceValidateDataDisksStorageSize,
  workspaceValidateOSDisksStorageSize,
} from '../../../store/validators/workspaceValidators';
import { AzureStorageType } from '../../../types/AzureWorkspace/enums/AzureStorageType';
import { AzureDataDiskForCreationDto } from '../../../types/ResourceCreation/AzureDataDiskForCreationDto.types';

describe('Workspace Virtual Machine Name Validator Tests', () => {
  test('Data disk machine specialized empty name returns error', () => {
    const vms = [
      {
        ...AzureVirtualMachineForCreationTestData,
        DataDisks: [
          {
            Name: '',
            Description: '',
            SizeGB: 4,
            Lun: 1,
            StorageType: AzureStorageType.PremiumSSD,
          },
        ],
      },
    ];

    const errors = workspaceValidateDataDisks(vms);
    expect(errors[0].message).toBe(NameMustNotBeBlank);
  });

  test('Data disk reducing size returns error', () => {
    const disk: AzureDataDiskForCreationDto = {
      Name: '',
      Description: '',
      SizeGB: 32,
      Lun: 1,
      StorageType: AzureStorageType.PremiumSSD,
    };

    const error = workspaceValidateDataDisksStorageSize(disk, 16);
    expect(error).toBe(CannotDecreaseDiskSize);
  });

  test('OS disk reducing size returns error', () => {
    const error = workspaceValidateOSDisksStorageSize(
      AzureVirtualMachineForCreationTestData,
      16
    );
    expect(error).toBe(CannotDecreaseOSDiskSize);
  });
});
