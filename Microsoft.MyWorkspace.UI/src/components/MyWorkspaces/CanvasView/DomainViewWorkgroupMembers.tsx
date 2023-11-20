import React from 'react';
import { VirtualMachineSVG } from './VirtualMachineSVG';
import { useTheme } from '@fluentui/react';
import { getCanvasStyles } from './CanvasView.styles';
import { AzureVirtualMachineDto } from 'src/types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureVirtualMachineForCreationDto } from 'src/types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import {
  VMWidth,
  VMPadding,
  VMHeight,
  getVMId,
  DomainViewNumberVMsPerRow,
  DomainViewVMMarginLeft,
  DomainViewVMMarginTop,
  DomainViewWorkgroupMemberBoxWidth,
} from './SVG.utils';

interface IDomainViewWorkgroupMembers {
  height: number;
  workgroupMembers:
    | AzureVirtualMachineForCreationDto[]
    | AzureVirtualMachineDto[];
}

export const DomainViewWorkgroupMembers = (
  props: IDomainViewWorkgroupMembers
) => {
  const theme = useTheme();
  const styles = getCanvasStyles(theme);

  return (
    <svg
      style={{
        overflow: 'visible',
      }}
      x={VMPadding}
      y={2 * VMPadding}
    >
      <text className={styles.domainSection}> Workgroup Members</text>
      <rect
        width={DomainViewWorkgroupMemberBoxWidth}
        height={props.height}
        rx={'25px'}
        y={25}
        stroke={'black'}
        fill={theme.name == 'light' ? '#D8D8D8' : '#454545'}
      ></rect>
      {props.workgroupMembers.map((vm, i) => {
        return (
          <VirtualMachineSVG
            key={`vm-key-${i}`}
            x={
              (i % DomainViewNumberVMsPerRow) * (VMWidth + VMPadding) +
              DomainViewVMMarginLeft
            }
            y={
              Math.floor(i / DomainViewNumberVMsPerRow) *
                (VMHeight + VMPadding) +
              DomainViewVMMarginTop
            }
            vm={vm}
            id={getVMId(vm.ComputerName)}
          />
        );
      })}
    </svg>
  );
};
