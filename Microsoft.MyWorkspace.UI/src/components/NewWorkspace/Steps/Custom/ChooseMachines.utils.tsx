import { VirtualMachineCustomDto } from '../../../../types/Catalog/VirtualMachineCustomDto.types';

export const filterList = (
  machines: VirtualMachineCustomDto[],
  filterValue: string
): VirtualMachineCustomDto[] => {
  const filtered = [];
  for (const m of machines) {
    if (
      filterValue === '' ||
      m.Name.toLowerCase()
        .replace(/ /g, '')
        .includes(filterValue.replace(/ /g, ''))
    ) {
      filtered.push(m);
    }
  }
  return filtered;
};
