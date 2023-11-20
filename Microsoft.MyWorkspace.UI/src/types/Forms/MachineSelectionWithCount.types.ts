import { VirtualMachineCustomDto } from '../Catalog/VirtualMachineCustomDto.types';

export interface MachineSelectionWithCount {
  machine: VirtualMachineCustomDto;
  count: number;
}
