import { AzureVirtualMachineDto } from './AzureVirtualMachineDto.types';
import { AzureVirtualMachineForCreationDto } from '../ResourceCreation/AzureVirtualMachineForCreationDto.types';

export type MachinesUnion =
  | AzureVirtualMachineForCreationDto
  | AzureVirtualMachineDto;
