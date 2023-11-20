import { Stack, DetailsList, Text, IColumn } from '@fluentui/react';
import * as React from 'react';
import { SetStateAction } from 'react';
import { CreateWorkspaceTemplateDto } from 'src/types/Catalog/CreateWorkspaceTemplateDto.types';
import { VirtualMachineTemplateDto } from 'src/types/Catalog/VirtualMachineTemplateDto.types';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';

interface ITemplateMachinesList {
  template: CreateWorkspaceTemplateDto | WorkspaceTemplateDto;
  setTemplate?: React.Dispatch<SetStateAction<CreateWorkspaceTemplateDto>>;
  onChangeErrors?: (hasErrors: boolean) => void;
  readonly?: boolean;
}

export const TemplateMachinesList = (props: ITemplateMachinesList) => {
  const columns: IColumn[] = [
    {
      key: 'machine',
      name: 'Machine Name',
      minWidth: 150,
      maxWidth: 250,
      onRender: (machine: VirtualMachineTemplateDto) => {
        return <Text variant='small'>{machine.ComputerName}</Text>;
      },
    },
    {
      key: 'os',
      name: 'Operating System',
      minWidth: 150,
      maxWidth: 250,
      onRender: (machine: VirtualMachineTemplateDto) => {
        return <Text variant='small'>{machine.Name}</Text>;
      },
    },
    {
      key: 'memory',
      name: 'Memory',
      minWidth: 150,
      maxWidth: 250,
      onRender: (machine: VirtualMachineTemplateDto) => {
        return <Text variant='small'>{machine.MemoryGB + ' GB'}</Text>;
      },
    },
    {
      key: 'osDisk',
      name: 'OS Disk',
      minWidth: 150,
      maxWidth: 250,
      onRender: (machine: VirtualMachineTemplateDto) => {
        return <Text variant='small'>{machine.OSDiskSizeInGB + ' GB'}</Text>;
      },
    },
    {
      key: 'dataDisks',
      name: 'Data Disks',
      minWidth: 150,
      maxWidth: 250,
      onRender: (machine: VirtualMachineTemplateDto) => {
        return <Text variant='small'>{machine.DataDisks.length}</Text>;
      },
    },
    {
      key: 'largestDisk',
      name: 'Largest Data Disk',
      minWidth: 150,
      maxWidth: 250,
      onRender: (machine: VirtualMachineTemplateDto) => {
        return (
          <Text variant='small'>
            {machine.DataDisks && machine.DataDisks.length > 0
              ? machine.DataDisks.reduce((prev, current) =>
                  prev.SizeGB > current.SizeGB ? prev : current
                ).SizeGB + ' GB'
              : '-'}
          </Text>
        );
      },
    },
  ];

  return (
    <Stack data-testid='template-machines-list'>
      <h4>Machines</h4>
      <DetailsList
        items={props.template.VirtualMachines}
        columns={columns}
        checkboxVisibility={2}
      />
    </Stack>
  );
};
