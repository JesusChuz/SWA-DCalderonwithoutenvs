import * as React from 'react';
import { useTheme } from '@fluentui/react';
import { AzureVirtualMachineDto } from 'src/types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureVirtualMachineForCreationDto } from 'src/types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { getCanvasStyles } from './CanvasView.styles';
import { OSVersion } from 'src/types/enums/OSVersion';
import { useSelector } from 'react-redux';
import { getCatalogMachines } from 'src/store/selectors';
import { VMHeight, VMWidth } from './SVG.utils';
import { LinuxIcon } from './SVGComponents/LinuxIcon';
import { ServerIcon } from './SVGComponents/ServerIcon';
import { WindowsIcon } from './SVGComponents/WindowsIcon';
import { useState } from 'react';

interface VirtualMachineSVGProps {
  id: string;
  vm: AzureVirtualMachineDto | AzureVirtualMachineForCreationDto;
  x?: number;
  y?: number;
}

export const VirtualMachineSVG = (props: VirtualMachineSVGProps) => {
  const catalogMachines = useSelector(getCatalogMachines);
  const theme = useTheme();
  const styles = getCanvasStyles(theme);
  const [hover, setHover] = useState(false);
  const shortOsName =
    props.vm.Name.length > 24
      ? props.vm.Name.substring(0, 24) + '...'
      : props.vm.Name;
  const shortVmName =
    props.vm.ComputerName.length > 10
      ? props.vm.ComputerName.substring(0, 10) + '...'
      : props.vm.ComputerName;

  const VMIcon = React.useMemo(() => {
    const catalogMachine = catalogMachines.find(
      (m) => m.ImageSourceID === props.vm.ImageSourceID
    );
    const isServerVM =
      catalogMachine && catalogMachine.CanSupportDomainController;

    if (props.vm.OSVersion == OSVersion.Windows) {
      return isServerVM ? <ServerIcon /> : <WindowsIcon />;
    } else {
      return <LinuxIcon />;
    }
  }, [catalogMachines, props.vm]);

  const a11yMessage = React.useMemo(() => {
    let message = `${props.vm.Name}`;
    const nicMap = new Map<string, number>();

    for (let i = 0; i < props.vm.Nics.length; i++) {
      const subnetName = props.vm.Nics[i].SubnetName;
      nicMap.set(
        props.vm.Nics[i].SubnetName,
        nicMap.has(subnetName) ? nicMap.get(subnetName) + 1 : 1
      );
    }

    let index = 1;
    for (const key of Array.from(nicMap.keys())) {
      message += `${index === 1 ? 'with' : ' '} ${nicMap.get(
        key
      )} NICs connected to network ${key}${index === nicMap.size ? '.' : ','}`;
      index += 1;
    }

    return message;
  }, [props.vm]);

  return (
    <svg
      aria-label={a11yMessage}
      tabIndex={0}
      x={props.x ? props.x : 0}
      y={props.y ? props.y : 0}
      id={props.id}
      width={VMWidth}
      height={VMHeight}
      viewBox={`0 0 ${VMWidth} ${VMHeight}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        overflow: 'visible',
      }}
    >
      <rect
        x='0.5'
        y='0.5'
        width={VMWidth - 1}
        height={VMHeight - 1}
        rx='20'
        stroke='black'
        strokeWidth='01'
        fill={theme.semanticColors.bodyStandoutBackground}
      />
      {VMIcon}
      <text x={75} y={35} className={styles.osName}>
        {hover ? props.vm.Name : shortOsName}
      </text>
      <text x={75} y={70} className={styles.vmName}>
        {hover ? props.vm.ComputerName : shortVmName}
      </text>
    </svg>
  );
};
