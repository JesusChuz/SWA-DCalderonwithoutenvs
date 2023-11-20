import React, { useMemo, useEffect } from 'react';
import { AzureNicDto } from 'src/types/AzureWorkspace/AzureNicDto.types';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { AzureNicForCreationDto } from 'src/types/ResourceCreation/AzureNicForCreationDto.types';
import { AzureWorkspaceForCreationDto } from 'src/types/ResourceCreation/AzureWorkspaceForCreationDto.types';
import { CanvasContainer } from './CanvasContainer';
import { ConnectionSVG } from './ConnectionSVG';
import {
  DATA_NETWORK_VIEW_VIEWBOX,
  getConnectionId,
  getVMId,
  getVNId,
  initialConfigurationNetworkView,
  removeOnHoverHighlightNetwork,
  setOnHoverHighlightNetwork,
  VMHeight,
  VMWidth,
  VNHeight,
  VNWidth,
} from './SVG.utils';
import { SVGConnection } from './SVGConnection';
import { SVGInteractiveElement } from './SVGInteractiveElement';
import { VirtualMachineSVG } from './VirtualMachineSVG';
import { VirtualNetworkSVG } from './VirtualNetworkSVG';

const canvasId = 'canvasContainerNetworkTopology';
const SubnetColors = [
  'DodgerBlue',
  'ForestGreen',
  'Indigo',
  'Red',
  '#eaa300',
  'brown',
  'darkseagreen',
  'tan',
];

interface NICWithVMInfo {
  nic: AzureNicDto | AzureNicForCreationDto;
  vmName: string;
  connectionNumber: number;
}

interface NetworkViewProps {
  workspace: AzureWorkspaceDto | AzureWorkspaceForCreationDto;
}

export const NetworkView = (props: NetworkViewProps) => {
  const NICs = useMemo<NICWithVMInfo[]>(() => {
    const newNICs: NICWithVMInfo[] = [];
    const m = props.workspace.VirtualMachines;
    for (let i = 0; i < m.length; i++) {
      for (let v = 0; v < m[i].Nics.length; v++) {
        newNICs.push({
          nic: m[i].Nics[v],
          vmName: m[i].ComputerName,
          connectionNumber: v,
        });
      }
    }
    return newNICs;
  }, [props.workspace?.VirtualMachines]);

  useEffect(() => {
    const machines: SVGInteractiveElement[] = [];
    const networks: SVGInteractiveElement[] = [];
    const connections: SVGConnection[] = [];

    for (let i = 0; i < NICs.length; i++) {
      let subnetIndex = Object.keys(
        props.workspace.VirtualNetworks.length > 0
          ? props.workspace.VirtualNetworks[0].SubnetProperties
          : []
      ).indexOf(NICs[i].nic.SubnetName);
      subnetIndex = subnetIndex === -1 ? 0 : subnetIndex;
      connections.push(
        new SVGConnection(
          getConnectionId(
            getVMId(NICs[i].vmName),
            getVNId(NICs[i].nic.SubnetName),
            NICs[i].connectionNumber
          ),
          canvasId,
          getVMId(NICs[i].vmName),
          getVNId(NICs[i].nic.SubnetName),
          SubnetColors[subnetIndex],
          NICs[i].connectionNumber
        )
      );
    }

    for (let i = 0; i < props.workspace.VirtualMachines.length; i++) {
      machines.push(
        new SVGInteractiveElement(
          getVMId(props.workspace.VirtualMachines[i].ComputerName),
          canvasId,
          VMWidth,
          VMHeight
        )
      );
    }

    for (const subnet of Object.keys(
      props.workspace.VirtualNetworks[0].SubnetProperties
    )) {
      networks.push(
        new SVGInteractiveElement(getVNId(subnet), canvasId, VNWidth, VNHeight)
      );
    }

    initialConfigurationNetworkView(
      props.workspace.VirtualMachines,
      Object.keys(props.workspace.VirtualNetworks[0].SubnetProperties).map(
        (v) => v
      ),
      canvasId
    );

    setOnHoverHighlightNetwork(
      props.workspace.VirtualMachines,
      Object.keys(props.workspace.VirtualNetworks[0].SubnetProperties).map(
        (v) => v
      )
    );

    return () => {
      removeOnHoverHighlightNetwork(
        Object.keys(props.workspace.VirtualNetworks[0].SubnetProperties).map(
          (v) => v
        )
      );
      for (let m = 0; m < machines.length; m++) {
        machines[m].removeListeners();
      }
      for (let n = 0; n < networks.length; n++) {
        networks[n].removeListeners();
      }
      for (let c = 0; c < connections.length; c++) {
        connections[c].removeListeners();
      }
    };
  }, [props.workspace?.VirtualMachines]);

  return (
    <CanvasContainer
      id={canvasId}
      viewBoxOverrideTag={DATA_NETWORK_VIEW_VIEWBOX}
      allowZoom
      allowPan
    >
      {NICs.map((n, i) => {
        return (
          <ConnectionSVG
            key={`connection-key-${i}`}
            id={getConnectionId(
              getVMId(n.vmName),
              getVNId(n.nic.SubnetName),
              n.connectionNumber
            )}
          />
        );
      })}
      {props.workspace.VirtualMachines.map((vm, i) => {
        return (
          <VirtualMachineSVG
            key={`vm-key-${i}`}
            id={getVMId(vm.ComputerName)}
            vm={vm}
          />
        );
      })}
      {Object.keys(props.workspace.VirtualNetworks[0].SubnetProperties).map(
        (subnet, i) => {
          let connections = 0;
          for (let m = 0; m < props.workspace.VirtualMachines.length; m++) {
            for (
              let n = 0;
              n < props.workspace.VirtualMachines[m].Nics.length;
              n++
            ) {
              connections +=
                props.workspace.VirtualMachines[m].Nics[n].SubnetName === subnet
                  ? 1
                  : 0;
            }
          }
          return (
            <VirtualNetworkSVG
              key={`vn-key-${i}`}
              id={getVNId(subnet)}
              index={i}
              canvasId={canvasId}
              color={SubnetColors[i]}
              subnet={subnet}
              numberVMs={props.workspace.VirtualMachines.length}
              numberConnections={connections}
            />
          );
        }
      )}
    </CanvasContainer>
  );
};
