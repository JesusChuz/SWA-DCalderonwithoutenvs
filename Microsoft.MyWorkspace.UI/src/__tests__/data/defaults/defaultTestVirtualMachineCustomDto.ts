import { getTestVirtualMachineCustomDto } from 'src/__tests__/data/VirtualMachineCustomDtoTestData';
import { VirtualMachineCustomDto } from 'src/types/Catalog/VirtualMachineCustomDto.types';
import { OSVersion } from 'src/types/enums/OSVersion';
import { v4 as uuid } from 'uuid';

export const defaultTestVirtualMachineCustomDto: VirtualMachineCustomDto[] = [
  getTestVirtualMachineCustomDto({
    Name: 'Custom Machine 1',
    OSVersion: OSVersion.Windows,
    ID: uuid(),
    ImageSourceID: `test/image/source/id/${uuid()}`,
    CanSupportVirtualization: true,
  }),
  getTestVirtualMachineCustomDto({
    Name: 'Custom Machine 2',
    OSVersion: OSVersion.Linux,
    ID: uuid(),
    ImageSourceID: `test/image/source/id/${uuid()}`,
    CanSupportVirtualization: false,
  }),
  getTestVirtualMachineCustomDto({
    Name: 'Test Machine',
    OSVersion: OSVersion.Windows,
    ID: uuid(),
    ImageSourceID: `test/image/source/id/${uuid()}`,
    CanSupportVirtualization: false,
  }),
  getTestVirtualMachineCustomDto({
    Name: 'Custom Machine 3',
    OSVersion: OSVersion.Linux,
    ID: uuid(),
    ImageSourceID: `test/image/source/id/${uuid()}`,
    CanSupportVirtualization: true,
  }),
];
