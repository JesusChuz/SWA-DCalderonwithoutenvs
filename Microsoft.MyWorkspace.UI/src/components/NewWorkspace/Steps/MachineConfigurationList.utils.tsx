import { AzureVirtualMachineForCreationDto } from '../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { VirtualMachineSkuDto } from '../../../types/Catalog/VirtualMachineSkuDto.types';
import {
  checkMachineSkuQuotas,
  checkMaxMemoryQuotaWithAddition,
} from '../../../store/validators/quotaValidators';
import { SegmentConstraintDto } from '../../../types/AuthService/SegmentConstraintDto.types';
import { MachinesUnion } from '../../../types/AzureWorkspace/MachinesUnion.types';
import { IDropdownOption, memoizeFunction, Theme } from '@fluentui/react';

const doesMemoryOptionExceedQuota = (
  memoryOption: number,
  sku: VirtualMachineSkuDto,
  machines: MachinesUnion[],
  machine: AzureVirtualMachineForCreationDto,
  userRoleAssignmentConstraint: SegmentConstraintDto
): boolean => {
  const maxMemoryAllowed = machine.IsNested
    ? userRoleAssignmentConstraint.MaxMachineMemoryAllowedNested
    : userRoleAssignmentConstraint.MaxMachineMemoryAllowedCustom;
  const individualMachineMemoryExceeded = memoryOption > maxMemoryAllowed;
  return (
    individualMachineMemoryExceeded ||
    !!checkMaxMemoryQuotaWithAddition(
      machines,
      memoryOption - machine.MemoryGB,
      userRoleAssignmentConstraint
    ) ||
    !!checkMachineSkuQuotas(machine, sku)
  );
};

export const checkMaxOSDiskSizeAllowed = (
  machines: MachinesUnion[],
  machineIndex: number,
  constraint: SegmentConstraintDto
): string => {
  const currentMachineOsDisk: number = machines[machineIndex].OSDiskSizeInGB;
  if (currentMachineOsDisk > constraint.MaxOSDiskSizeAllowed) {
    return `Machines cannot contain more than ${constraint.MaxOSDiskSizeAllowed} GB of memory`;
  }
  return '';
};

export const selectMemoryOptions = (
  machine: AzureVirtualMachineForCreationDto,
  machines: MachinesUnion[],
  machineSkus: VirtualMachineSkuDto[],
  userRoleAssignmentConstraint: SegmentConstraintDto,
  isNestedVirtualizationEnabled: boolean
): IDropdownOption[] => {
  const memorySet: Set<{ sku: VirtualMachineSkuDto; memory: number }> = new Set(
    machineSkus.map((sku) => ({ sku, memory: sku.Memory / 1024 }))
  );
  return Array.from(memorySet)
    .sort((a, b) => a.memory - b.memory)
    .filter(
      (skuMemoryPair) =>
        skuMemoryPair.sku.CanSupportVirtualization ===
        isNestedVirtualizationEnabled
    )
    .map((skuMemoryPair) => {
      return {
        id: `Azure Memory Dropdown - ${machine.ComputerName} - ${skuMemoryPair.memory} GB`,
        key: skuMemoryPair.memory,
        text: `${skuMemoryPair.memory} GB`,
        disabled:
          doesMemoryOptionExceedQuota(
            skuMemoryPair.memory,
            skuMemoryPair.sku,
            machines,
            machine,
            userRoleAssignmentConstraint
          ) && skuMemoryPair.memory > machine.MemoryGB,
      };
    });
};

export const selectOSDiskOptions = (
  machine: AzureVirtualMachineForCreationDto,
  userRoleAssignmentConstraint: SegmentConstraintDto
): IDropdownOption[] => {
  userRoleAssignmentConstraint.MaxOSDiskSizeAllowed;
  const range: Array<number> = [128, 256, 512, 1024];
  return Array.from(range).map((oSDiskGB) => {
    return {
      id: `Azure OS Disk Dropdown - ${machine.ComputerName} - ${oSDiskGB} GB`,
      key: oSDiskGB,
      text: `${oSDiskGB} GB`,
      disabled: oSDiskGB > userRoleAssignmentConstraint.MaxOSDiskSizeAllowed,
    };
  });
};
export const errorDropdownStyle = {
  title: {
    color: 'red',
  },
  dropdown: {
    selectors: {
      '&:hover .ms-Dropdown-title': {
        color: 'red',
      },
      '&:focus .ms-Dropdown-title': {
        color: 'red',
      },
      '&:active .ms-Dropdown-title': {
        color: 'red',
      },
    },
  },
};

export const getErrorDropdownStyle = memoizeFunction((theme: Theme) => {
  return {
    title: {
      color: theme.semanticColors.errorText,
    },
    dropdown: {
      selectors: {
        '&:hover .ms-Dropdown-title': {
          color: theme.semanticColors.errorText,
        },
        '&:focus .ms-Dropdown-title': {
          color: theme.semanticColors.errorText,
        },
        '&:active .ms-Dropdown-title': {
          color: theme.semanticColors.errorText,
        },
      },
    },
  };
});
