import { OSVersion } from '../enums/OSVersion';
import { PatchMode } from '../enums/PatchMode';

export interface VirtualMachineBaseDto {
  Name: string;
  Description: string;
  ImageSourceID: string;
  PatchMode: PatchMode;
  OSVersion: OSVersion;
  IsNested: boolean;
}
