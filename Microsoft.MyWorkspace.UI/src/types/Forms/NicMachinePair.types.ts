import { AzureNicDto } from '../AzureWorkspace/AzureNicDto.types';
import { MachinesUnion } from '../AzureWorkspace/MachinesUnion.types';
import { AzureNicForCreationDto } from '../ResourceCreation/AzureNicForCreationDto.types';

export interface NicMachinePair {
  machine: MachinesUnion;
  nic: AzureNicForCreationDto | AzureNicDto;
}
