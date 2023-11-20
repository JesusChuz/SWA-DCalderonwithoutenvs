import { DataDiskErrorTypes } from '../enums/DataDiskErrorTypes';

export interface DataDiskError {
  machineIndex: number;
  diskIndex: number;
  type: DataDiskErrorTypes;
  message: string;
}
