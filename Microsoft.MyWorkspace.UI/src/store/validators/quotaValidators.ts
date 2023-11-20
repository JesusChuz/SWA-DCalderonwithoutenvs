import { SegmentConstraintDto } from '../../types/AuthService/SegmentConstraintDto.types';
import { MachineSelectionWithCount } from '../../types/Forms/MachineSelectionWithCount.types';
import { MachinesUnion } from '../../types/AzureWorkspace/MachinesUnion.types';
import { DataDiskUnion } from '../../types/AzureWorkspace/DataDiskUnion.types';
import { VirtualMachineSkuDto } from '../../types/Catalog/VirtualMachineSkuDto.types';
import { AzureVirtualMachineForCreationDto } from '../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { AzureVirtualMachineDto } from '../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { FindVirtualMachineSku } from '../../shared/helpers/WorkspaceHelper';
import { VirtualMachineTemplateDto } from '../../types/Catalog/VirtualMachineTemplateDto.types';

export const checkMaxMachinesQuota = (
  virtualMachines: (
    | AzureVirtualMachineForCreationDto
    | AzureVirtualMachineDto
    | VirtualMachineTemplateDto
  )[],
  constraint: SegmentConstraintDto,
  newMachines: MachineSelectionWithCount[] = [],
  isNestedVirtualizationEnabled = false
): string => {
  const totalMachines =
    newMachines.reduce((previous, current) => current.count + previous, 0) +
    virtualMachines.length;
  if (totalMachines > constraint.MaxMachinesPerWorkspaceAllowedCustom) {
    return `Workspaces cannot contain more than ${
      constraint.MaxMachinesPerWorkspaceAllowedCustom
    } virtual machine${
      constraint.MaxMachinesPerWorkspaceAllowedCustom !== 1 ? 's' : ''
    }.`;
  }
  if (
    isNestedVirtualizationEnabled &&
    totalMachines > constraint.MaxHypervHostMachinesAllowedPerWorkspace
  ) {
    return `Nested workspaces cannot contain more than ${
      constraint.MaxHypervHostMachinesAllowedPerWorkspace
    } virtual machine${
      constraint.MaxHypervHostMachinesAllowedPerWorkspace !== 1 ? 's' : ''
    }.`;
  }
  return '';
};

export const checkNetworksQuota = (networks: string[]): string => {
  if (networks.length < 1) {
    return 'Workspaces require at least one virtual network.';
  }
  return networks.length > 8
    ? `Workspaces cannot contain more than 8 virtual networks.`
    : '';
};

export const checkNetworksAreAtMaxQuota = (networks: string[]): string => {
  return networks.length === 8
    ? `Workspaces currently cannot contain more than 8 virtual networks.`
    : '';
};

export const checkNetworksAreAtMinQuota = (networks: string[]): string => {
  return networks.length === 1
    ? `Workspaces currently cannot contain less than 1 virtual networks.`
    : '';
};
export const checkMachineSkuDataDiskQuotas = (
  machine: MachinesUnion | VirtualMachineTemplateDto,
  sku: VirtualMachineSkuDto
): string => {
  if (sku?.MaxDataDisks && machine.DataDisks.length > sku.MaxDataDisks)
    return `Selected machine SKU cannot contain more than ${sku?.MaxDataDisks} data disks`;

  return '';
};

export const checkMachineSkuNicQuotas = (
  machine: MachinesUnion | VirtualMachineTemplateDto,
  sku: VirtualMachineSkuDto
): string => {
  if (sku?.MaxNics && machine.Nics.length > sku.MaxNics)
    return `Selected machine SKU cannot contain more than ${sku?.MaxNics} NICs`;

  return '';
};

export const checkMachineSkuQuotas = (
  machine: MachinesUnion | VirtualMachineTemplateDto,
  sku: VirtualMachineSkuDto
): string => {
  return (
    checkMachineSkuDataDiskQuotas(machine, sku) ||
    checkMachineSkuNicQuotas(machine, sku)
  );
};
export const checkAllMachineSkuQuotas = (
  machines: (MachinesUnion | VirtualMachineTemplateDto)[],
  skus: VirtualMachineSkuDto[]
): string => {
  const machineSkuErrors = machines.map((vm) => {
    const sku = FindVirtualMachineSku(skus, vm);
    return checkMachineSkuQuotas(vm, sku);
  });
  return machineSkuErrors.find((err) => err !== '') || '';
};

export const checkAllMachineMaxStorageQuotas = (
  machines: (MachinesUnion | VirtualMachineTemplateDto)[],
  constraint: SegmentConstraintDto
): string => {
  const machineStorageErrors = machines.map((vm, i, vms) =>
    checkMachineMaxStorageQuota(vms, i, constraint)
  );
  return machineStorageErrors.find((err) => err !== '') || '';
};

export const checkMachineMaxStorageQuota = (
  machines: (MachinesUnion | VirtualMachineTemplateDto)[],
  machineIndex: number,
  constraint: SegmentConstraintDto
): string => {
  const isNested = (machines[machineIndex] as MachinesUnion).IsNested ?? false;
  const currentMachineStorage: number = (
    machines[machineIndex].DataDisks as DataDiskUnion[]
  ).reduce((p, c) => c.SizeGB + p, 0);
  const maxStorage = isNested
    ? constraint.MaxMachineStorageAllowedNested
    : constraint.MaxMachineStorageAllowedCustom;
  if (currentMachineStorage > maxStorage) {
    return `${
      isNested ? 'Nested workspace' : 'Workspace'
    } machines cannot contain more than ${maxStorage} GB of storage`;
  }
  return '';
};
export const checkCumulativeMaxStorageQuota = (
  machines: (MachinesUnion | VirtualMachineTemplateDto)[],
  constraint: SegmentConstraintDto
): string => {
  const allDisksStorage: number = [...machines]
    .reduce((p, c) => [...p, ...c.DataDisks], [])
    .reduce((p, c) => c.SizeGB + p, 0);
  if (allDisksStorage > constraint.MaxCumulativeStorageAllowedCustom) {
    return `Workspace cannot contain more than ${constraint.MaxCumulativeStorageAllowedCustom} GB of storage`;
  }
  return '';
};

export const checkMaxMachinesStorageQuota = (
  machines: MachinesUnion[],
  machineIndex: number,
  constraint: SegmentConstraintDto
): string => {
  const machineMaxStorageQuota = checkMachineMaxStorageQuota(
    machines,
    machineIndex,
    constraint
  );
  if (!machineMaxStorageQuota) {
    return checkCumulativeMaxStorageQuota(machines, constraint);
  }
  return machineMaxStorageQuota;
};

export const checkAllMachineMaxMemoryQuotas = (
  machines: MachinesUnion[],
  constraint: SegmentConstraintDto
): string => {
  const machineMemoryErrors = machines.map((vm, i, vms) =>
    checkMachineMaxMemoryQuota(vms, i, constraint)
  );
  return machineMemoryErrors.find((err) => err !== '') || '';
};

export const checkMachineMaxMemoryQuota = (
  machines: MachinesUnion[],
  machineIndex: number,
  constraint: SegmentConstraintDto
): string => {
  const isNested = (machines[machineIndex] as MachinesUnion).IsNested ?? false;
  const currentMachineMemory: number = machines[machineIndex].MemoryGB;
  const maxMemory = isNested
    ? constraint.MaxMachineMemoryAllowedNested
    : constraint.MaxMachineMemoryAllowedCustom;
  if (currentMachineMemory > maxMemory) {
    return `${
      isNested ? 'Nested workspace' : 'Workspace'
    } machines cannot contain more than ${maxMemory} GB of memory`;
  }
  return '';
};

export const checkCumulativeMaxMemoryQuota = (
  machines: MachinesUnion[],
  constraint: SegmentConstraintDto
): string => {
  const allMachinesMemory: number = [...machines].reduce(
    (p, c) => c.MemoryGB + p,
    0
  );
  if (allMachinesMemory > constraint.MaxCumulativeMemoryAllowedCustom) {
    return `Workspace cannot contain more than ${constraint.MaxCumulativeMemoryAllowedCustom} GB of memory`;
  }
  return '';
};

export const checkMaxMemoryQuota = (
  machines: MachinesUnion[],
  machineIndex: number,
  constraint: SegmentConstraintDto
): string => {
  const machineMaxStorageQuota = checkMachineMaxMemoryQuota(
    machines,
    machineIndex,
    constraint
  );
  if (!machineMaxStorageQuota) {
    return checkCumulativeMaxMemoryQuota(machines, constraint);
  }
  return machineMaxStorageQuota;
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

export const checkMaxMemoryQuotaWithAddition = (
  machines: MachinesUnion[],
  additionalMemory: number,
  constraint: SegmentConstraintDto
): string => {
  const allMachinesMemory: number =
    [...machines].reduce((p, c) => c.MemoryGB + p, 0) + additionalMemory;
  if (allMachinesMemory > constraint.MaxCumulativeMemoryAllowedCustom) {
    return `Workspace cannot contain more than ${constraint.MaxCumulativeMemoryAllowedCustom} GB of memory`;
  }
  return '';
};

export const checkMaxDataDisksAreAtQuota = (
  machine: MachinesUnion,
  constraint: SegmentConstraintDto,
  sku: VirtualMachineSkuDto
): string => {
  if (machine.DataDisks.length >= sku?.MaxDataDisks) {
    return `Selected machine SKU cannot contain more than ${sku?.MaxDataDisks} data disks`;
  }

  if (machine.DataDisks.length >= constraint.MaxDataDisksPerVM) {
    return `Virtual Machines cannot contain more than ${constraint.MaxDataDisksPerVM} data disks`;
  }
  return '';
};

export const checkTemplateMaxNestedMachinesQuota = (
  virtualMachines: (
    | AzureVirtualMachineForCreationDto
    | AzureVirtualMachineDto
    | VirtualMachineTemplateDto
  )[],
  constraint: SegmentConstraintDto
): string => {
  const totalNestedMachines = virtualMachines.filter(
    (vm) => vm.IsNested
  ).length;
  if (
    totalNestedMachines > constraint.MaxHypervHostMachinesAllowedPerWorkspace
  ) {
    return `Workspaces cannot contain more than ${
      constraint.MaxHypervHostMachinesAllowedPerWorkspace
    } nested virtual machine${
      constraint.MaxHypervHostMachinesAllowedPerWorkspace !== 1 ? 's' : ''
    }.`;
  }
  return '';
};

export const getTemplateQuotaErrorMessage = (
  virtualMachines: VirtualMachineTemplateDto[],
  skus: VirtualMachineSkuDto[],
  userRoleAssignmentConstraint: SegmentConstraintDto
): string => {
  const machineCountError = checkMaxMachinesQuota(
    virtualMachines,
    userRoleAssignmentConstraint
  );
  const nestedMachineCountError = checkTemplateMaxNestedMachinesQuota(
    virtualMachines,
    userRoleAssignmentConstraint
  );
  const skuQuotaError = checkAllMachineSkuQuotas(virtualMachines, skus);
  const machineMachineStorageQuotaError = checkAllMachineMaxStorageQuotas(
    virtualMachines,
    userRoleAssignmentConstraint
  );
  const cumulativeMachineStorageQuotaError = checkCumulativeMaxStorageQuota(
    virtualMachines,
    userRoleAssignmentConstraint
  );
  let quotaError = '';
  if (machineCountError) {
    quotaError =
      'This template cannot be used as it exceeds the machine count quota.';
  } else if (nestedMachineCountError) {
    quotaError =
      'This template cannot be used as it exceeds the nested machine count quota.';
  } else if (skuQuotaError) {
    quotaError =
      'This template cannot be used as it exceeds one of the SKU quotas.';
  } else if (machineMachineStorageQuotaError) {
    quotaError =
      'This template cannot be used as it exceeds the machine storage quota.';
  } else if (cumulativeMachineStorageQuotaError) {
    quotaError =
      'This template cannot be used as it exceeds the cumulative machine storage quota.';
  }
  return quotaError;
};
