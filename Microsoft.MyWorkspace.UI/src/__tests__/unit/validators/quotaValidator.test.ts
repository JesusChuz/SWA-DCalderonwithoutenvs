import {
  checkAllMachineMaxMemoryQuotas,
  checkAllMachineMaxStorageQuotas,
  checkAllMachineSkuQuotas,
  checkMachineSkuQuotas,
  checkMaxDataDisksAreAtQuota,
  checkMaxMachinesQuota,
  checkMaxMachinesStorageQuota,
  checkMaxMemoryQuota,
  checkMaxMemoryQuotaWithAddition,
  checkNetworksAreAtMaxQuota,
  checkNetworksAreAtMinQuota,
  checkNetworksQuota,
} from '../../../store/validators/quotaValidators';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';
import { getTestVirtualMachineSkuDto } from '../../data/VirtualMachineSkuDtoTestData';
import { getTestDataDiskDto } from '../../data/AzureDataDiskDtoTestData';
import { getTestNicDto } from '../../data/AzureNicDtoTestData';
import { getTestSegmentConstraintDto } from '../../data/SegmentConstraintDtoTestData';
import { MachineSelectionWithCount } from '../../../types/Forms/MachineSelectionWithCount.types';
import { getTestVirtualMachineCustomDto } from '../../data/VirtualMachineCustomDtoTestData';

describe('Quota Validator Tests', () => {
  test('checkMaxMachinesQuota returns error when virtual machines lists exceed quota', () => {
    const virtualMachineList = [
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto(),
    ];
    const newMachines: MachineSelectionWithCount[] = [
      { count: 2, machine: getTestVirtualMachineCustomDto() },
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachinesPerWorkspaceAllowedCustom: 5,
    });
    const error = checkMaxMachinesQuota(
      virtualMachineList,
      constraint,
      newMachines
    );
    expect(error).toBeTruthy();
  });
  test('checkMaxMachinesQuota returns no error when virtual machines lists are within quota', () => {
    const virtualMachineList = [
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto(),
    ];
    const newMachines: MachineSelectionWithCount[] = [
      { count: 1, machine: getTestVirtualMachineCustomDto() },
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachinesPerWorkspaceAllowedCustom: 5,
    });
    const error = checkMaxMachinesQuota(
      virtualMachineList,
      constraint,
      newMachines
    );
    expect(error).toBeFalsy();
  });

  test('checkNetworksQuota returns error when given an empty list of networks.', () => {
    const networksList: string[] = [];
    const error = checkNetworksQuota(networksList);
    expect(error).toBeTruthy();
  });

  test('checkNetworksQuota returns error when given a list of networks that exceeds the quota.', () => {
    const networksList = [
      'network-1',
      'network-2',
      'network-3',
      'network-4',
      'network-5',
      'network-6',
      'network-7',
      'network-8',
      'network-9',
    ];
    const error = checkNetworksQuota(networksList);
    expect(error).toBeTruthy();
  });
  test('checkNetworksQuota returns no error when given a list of networks than is within the quota.', () => {
    const networksList = ['network-1', 'network-2', 'network-3'];
    const error = checkNetworksQuota(networksList);
    expect(error).toBeFalsy();
  });
  test('checkNetworksAreAtMaxQuota returns error when given a list of networks exceeds the quota.', () => {
    const networksList = [
      'network-1',
      'network-2',
      'network-3',
      'network-4',
      'network-5',
      'network-6',
      'network-7',
      'network-8',
    ];
    const error = checkNetworksAreAtMaxQuota(networksList);
    expect(error).toBeTruthy();
  });
  test('checkNetworksAreAtMaxQuota returns no error when given a list of networks that is within the quota.', () => {
    const networksList = ['network-1', 'network-2', 'network-3'];
    const error = checkNetworksAreAtMaxQuota(networksList);
    expect(error).toBeFalsy();
  });
  test('checkNetworksAreAtMinQuota returns error when given a list of networks exceeds the quota.', () => {
    const networksList: string[] = ['network-1'];
    const error = checkNetworksAreAtMinQuota(networksList);
    expect(error).toBeTruthy();
  });
  test('checkNetworksAreAtMinQuota returns no error when given a list of networks that is within the quota.', () => {
    const networksList = ['network-1', 'network-2', 'network-3'];
    const error = checkNetworksAreAtMinQuota(networksList);
    expect(error).toBeFalsy();
  });
  test('checkAllMachineSkuQuotas returns error when machine has more data disks than the sku allows', () => {
    const sku = [
      getTestVirtualMachineSkuDto({
        MaxDataDisks: 1,
        MaxNics: 2,
        Memory: 4 * 1024,
      }),
      getTestVirtualMachineSkuDto({
        MaxDataDisks: 3,
        MaxNics: 2,
        Memory: 8 * 1024,
      }),
    ];
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 4,
        DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
        Nics: [getTestNicDto(), getTestNicDto()],
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
        DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
        Nics: [getTestNicDto(), getTestNicDto()],
      }),
    ];
    const error = checkAllMachineSkuQuotas(machines, sku);
    expect(error).toBeTruthy();
  });
  test('checkMachineSkuQuotas returns error when machine has more data disks than the sku allows', () => {
    const sku = getTestVirtualMachineSkuDto({ MaxDataDisks: 1 });
    const machine = getTestVirtualMachineDto({
      DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
    });
    const error = checkMachineSkuQuotas(machine, sku);
    expect(error).toBeTruthy();
  });
  test('checkAllMachineSkuQuotas returns error when machine has more NICs than the sku allows', () => {
    const sku = [
      getTestVirtualMachineSkuDto({
        MaxDataDisks: 3,
        MaxNics: 1,
        Memory: 4 * 1024,
      }),
      getTestVirtualMachineSkuDto({
        MaxDataDisks: 3,
        MaxNics: 2,
        Memory: 8 * 1024,
      }),
    ];
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 4,
        DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
        Nics: [getTestNicDto(), getTestNicDto()],
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
        DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
        Nics: [getTestNicDto(), getTestNicDto()],
      }),
    ];
    const error = checkAllMachineSkuQuotas(machines, sku);
    expect(error).toBeTruthy();
  });
  test('checkMachineSkuQuotas returns error when machine has more NICs than the sku allows', () => {
    const sku = getTestVirtualMachineSkuDto({ MaxDataDisks: 2, MaxNics: 1 });
    const machine = getTestVirtualMachineDto({
      DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
      Nics: [getTestNicDto(), getTestNicDto()],
    });
    const error = checkMachineSkuQuotas(machine, sku);
    expect(error).toBeTruthy();
  });
  test('checkAllMachineSkuQuotas returns no error when machine has data disk and NIC counts within the SKU limits', () => {
    const sku = [
      getTestVirtualMachineSkuDto({
        MaxDataDisks: 3,
        MaxNics: 2,
        Memory: 4 * 1024,
      }),
      getTestVirtualMachineSkuDto({
        MaxDataDisks: 3,
        MaxNics: 2,
        Memory: 8 * 1024,
      }),
    ];
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 4,
        DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
        Nics: [getTestNicDto(), getTestNicDto()],
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
        DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
        Nics: [getTestNicDto(), getTestNicDto()],
      }),
    ];
    const error = checkAllMachineSkuQuotas(machines, sku);
    expect(error).toBeFalsy();
  });
  test('checkMachineSkuQuotas returns no error when machine has is data disk and NIC counts within the SKU limits', () => {
    const sku = getTestVirtualMachineSkuDto({ MaxDataDisks: 3, MaxNics: 2 });
    const machine = getTestVirtualMachineDto({
      DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
      Nics: [getTestNicDto(), getTestNicDto()],
    });
    const error = checkMachineSkuQuotas(machine, sku);
    expect(error).toBeFalsy();
  });
  test('checkMaxDataDisksAreAtQuota returns error when machine has more data disks than the SKU allows', () => {
    const constraint = getTestSegmentConstraintDto({ MaxDataDisksPerVM: 3 });
    const sku = getTestVirtualMachineSkuDto({ MaxDataDisks: 2 });
    const machine = getTestVirtualMachineDto({
      DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
    });
    const error = checkMaxDataDisksAreAtQuota(machine, constraint, sku);
    expect(error).toBeTruthy();
  });
  test('checkMaxDataDisksAreAtQuota returns error when machine has more data disks than the constraint allows', () => {
    const constraint = getTestSegmentConstraintDto({ MaxDataDisksPerVM: 2 });
    const sku = getTestVirtualMachineSkuDto({ MaxDataDisks: 3 });
    const machine = getTestVirtualMachineDto({
      DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
    });
    const error = checkMaxDataDisksAreAtQuota(machine, constraint, sku);
    expect(error).toBeTruthy();
  });
  test('checkMaxDataDisksAreAtQuota returns error when machine data disks does not meet quotas', () => {
    const constraint = getTestSegmentConstraintDto({ MaxDataDisksPerVM: 3 });
    const sku = getTestVirtualMachineSkuDto({ MaxDataDisks: 4 });
    const machine = getTestVirtualMachineDto({
      DataDisks: [getTestDataDiskDto(), getTestDataDiskDto()],
    });
    const error = checkMaxDataDisksAreAtQuota(machine, constraint, sku);
    expect(error).toBeFalsy();
  });

  test('checkAllMachineMaxStorageQuotas returns no error when machine storage do not exceed constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 4 })],
      }),
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 16 })],
      }),
      getTestVirtualMachineDto(),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineStorageAllowedCustom: 16,
      MaxCumulativeStorageAllowedCustom: 60,
    });
    const error = checkAllMachineMaxStorageQuotas(machines, constraint);
    expect(error).toBeFalsy();
  });
  test('checkAllMachineMaxStorageQuotas returns error when machine storage exceeds constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 4 })],
      }),
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 24 })],
      }),
      getTestVirtualMachineDto(),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineStorageAllowedCustom: 16,
      MaxCumulativeStorageAllowedCustom: 60,
    });
    const error = checkAllMachineMaxStorageQuotas(machines, constraint);
    expect(error).toBeTruthy();
  });
  test('checkMaxMachinesStorageQuota returns error when machine storage exceeds constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 24 })],
      }),
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 4 })],
      }),
      getTestVirtualMachineDto(),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineStorageAllowedCustom: 20,
      MaxCumulativeStorageAllowedCustom: 60,
    });
    const error = checkMaxMachinesStorageQuota(machines, 0, constraint);
    expect(error).toBeTruthy();
  });
  test('checkMaxMachinesStorageQuota returns error when all disk storage exceeds constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 16 })],
      }),
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 16 })],
      }),
      getTestVirtualMachineDto({
        DataDisks: [
          getTestDataDiskDto({ SizeGB: 16 }),
          getTestDataDiskDto({ SizeGB: 16 }),
        ],
      }),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineStorageAllowedCustom: 35,
      MaxCumulativeStorageAllowedCustom: 60,
    });
    const error = checkMaxMachinesStorageQuota(machines, 0, constraint);
    expect(error).toBeTruthy();
  });
  test('checkMaxMachinesStorageQuota returns no error when all storage is within constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 16 })],
      }),
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto({
        DataDisks: [getTestDataDiskDto({ SizeGB: 16 })],
      }),
      getTestVirtualMachineDto({
        DataDisks: [
          getTestDataDiskDto({ SizeGB: 16 }),
          getTestDataDiskDto({ SizeGB: 8 }),
        ],
      }),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineStorageAllowedCustom: 20,
      MaxCumulativeStorageAllowedCustom: 60,
    });
    const error = checkMaxMachinesStorageQuota(machines, 0, constraint);
    expect(error).toBeFalsy();
  });
  test('checkAllMaxMemoryQuotas returns error when machine memory exceeds constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 24,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 4,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 4,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 4,
      }),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineMemoryAllowedCustom: 20,
      MaxCumulativeMemoryAllowedCustom: 60,
    });
    const error = checkMaxMemoryQuota(machines, 0, constraint);
    expect(error).toBeTruthy();
  });
  test('checkAllMaxMemoryQuotas returns no error when machine memory does not exceed constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 4,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 4,
      }),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineMemoryAllowedCustom: 20,
      MaxCumulativeMemoryAllowedCustom: 128,
    });
    const error = checkAllMachineMaxMemoryQuotas(machines, constraint);
    expect(error).toBeFalsy();
  });
  test('checkMaxMemoryQuota returns error when machine memory exceeds constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 4,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 24,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 4,
      }),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineMemoryAllowedCustom: 20,
      MaxCumulativeMemoryAllowedCustom: 128,
    });
    const error = checkAllMachineMaxMemoryQuotas(machines, constraint);
    expect(error).toBeTruthy();
  });
  test('checkMaxMemoryQuota returns error when all machine memory exceeds constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineMemoryAllowedCustom: 35,
      MaxCumulativeMemoryAllowedCustom: 60,
    });
    const error = checkMaxMemoryQuota(machines, 0, constraint);
    expect(error).toBeTruthy();
  });
  test('checkMaxMemoryQuota returns no error when all memory is within constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
    ];
    const constraint = getTestSegmentConstraintDto({
      MaxMachineMemoryAllowedCustom: 20,
      MaxCumulativeMemoryAllowedCustom: 60,
    });
    const error = checkMaxMemoryQuota(machines, 0, constraint);
    expect(error).toBeFalsy();
  });
  test('checkMaxMemoryQuotaWithAddition returns error when sum of memory + additional memory exceeds constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
    ];
    const additionalMemory = 8;
    const constraint = getTestSegmentConstraintDto({
      MaxCumulativeMemoryAllowedCustom: 60,
    });
    const error = checkMaxMemoryQuotaWithAddition(
      machines,
      additionalMemory,
      constraint
    );
    expect(error).toBeTruthy();
  });
  test('checkMaxMemoryQuotaWithAddition returns no error when sum of memory + additional memory is within constraint.', () => {
    const machines = [
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 8,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
      getTestVirtualMachineDto({
        MemoryGB: 16,
      }),
    ];
    const additionalMemory = 4;
    const constraint = getTestSegmentConstraintDto({
      MaxCumulativeMemoryAllowedCustom: 60,
    });
    const error = checkMaxMemoryQuotaWithAddition(
      machines,
      additionalMemory,
      constraint
    );
    expect(error).toBeFalsy();
  });
});
