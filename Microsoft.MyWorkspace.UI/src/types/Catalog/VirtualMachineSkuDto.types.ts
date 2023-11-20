export interface VirtualMachineSkuDto {
  ID: string;
  Name: string;
  NumberOfCores: number;
  Memory: number;
  MaxDataDisks: number;
  MaxNics: number;
  Published: boolean;
  Production: boolean;
  CanSupportDomainController: boolean;
  CanSupportVirtualization: boolean;
}
