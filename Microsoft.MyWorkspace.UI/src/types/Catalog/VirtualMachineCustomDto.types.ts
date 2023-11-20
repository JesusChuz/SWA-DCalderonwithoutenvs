import { PatchMode } from '../enums/PatchMode';
import { VirtualMachineBaseDto } from './VirtualMachineBaseDto.types';

export interface VirtualMachineCustomDto extends VirtualMachineBaseDto {
  ID: string;
  PatchMode: PatchMode;
  CanSupportDomainController: boolean;
  CanSupportVirtualization: boolean;
}
