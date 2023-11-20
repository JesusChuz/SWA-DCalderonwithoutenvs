import { EMPTY_GUID } from '../../../../../shared/Constants';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { NetworkProtocols } from '../../../../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { NatRuleDto } from '../../../../../types/AzureWorkspace/NatRuleDto.types';

export interface PortRange {
  start: number;
  end?: number;
}

export const maxPortNumber = 65535;

export const minPortNumber = 1;

export const linuxMachineAccessPort = 22;

export const windowsMachineAccessPort = 3389;

export const validTCPExternalPorts: PortRange[] = [
  { start: 25 },
  { start: 80 },
  { start: 110 },
  { start: 143 },
  { start: 443 },
  { start: 444 },
  { start: 587 },
  { start: 993 },
  { start: 3342 },
  { start: 3478 },
  { start: 5060 },
  { start: 5061 },
  { start: 5269 },
  { start: 5723 },
  { start: 49443 },
];

export const validUDPExternalPorts: PortRange[] = [
  { start: 500 },
  { start: 1701 },
  { start: 3478 },
  { start: 4500 },
  { start: 5060, end: 5090 },
  { start: 5061 },
  { start: 6000, end: maxPortNumber },
];

export const getPortCount = (portRange: PortRange): number => {
  return portRange.end ? portRange.end - portRange.start + 1 : 1;
};

export const getPortRangeString = (range: PortRange): string => {
  return range.end ? `${range.start}-${range.end}` : range.start.toString();
};

const getNatRulePortString = (portStart: number, portCount: number): string => {
  if (!portStart) {
    return undefined;
  }
  if (portCount <= 1) {
    return portStart.toString();
  }
  const portEnd = portStart + portCount - 1;
  return `${portStart}-${portEnd}`;
};

export const getNatRuleExternalPortString = (natRule: NatRuleDto): string => {
  return getNatRulePortString(natRule.ExternalPort, natRule.PortCount);
};

export const getNatRuleInternalPortString = (natRule: NatRuleDto): string => {
  return getNatRulePortString(natRule.InternalPort, natRule.PortCount);
};

export const getDefaultNatRule = (
  editableWorkspace: AzureWorkspaceDto
): NatRuleDto => ({
  ID: EMPTY_GUID,
  Name: '',
  Description: '',
  InternalPort: undefined,
  ExternalPort: undefined,
  InternalAddress: undefined,
  ExternalAddress: undefined,
  PortCount: 1,
  Protocol: NetworkProtocols.Unknown,
  WorkspaceID: editableWorkspace.ID,
  VirtualMachineID: undefined,
});

export const getExternalPortError = (
  newNat: NatRuleDto,
  allNats: NatRuleDto[]
): string => {
  const externalPort = newNat.ExternalPort;
  const protocol = newNat.Protocol;
  if (!newNat.ExternalPort) {
    return 'Required.';
  }
  if (protocol === NetworkProtocols.Unknown) {
    return 'Select Valid Protocol.';
  }
  if (
    allNats.some(
      (nat) =>
        nat.ExternalPort === externalPort &&
        newNat.ExternalAddress === nat.ExternalAddress &&
        newNat.Protocol === nat.Protocol &&
        (!newNat.PortCount ||
          newNat.PortCount <= 1 ||
          newNat.PortCount === nat.PortCount)
    )
  ) {
    return `A NAT Rule currently exists with external port${
      newNat.PortCount > 1 ? 's' : ''
    }: ${getNatRuleExternalPortString(newNat)}`;
  }
  if (protocol === NetworkProtocols.TCP) {
    return validTCPExternalPorts.some((range) => {
      return getPortRangeString(range) === getNatRuleExternalPortString(newNat);
    })
      ? ''
      : `Select TCP port`;
  } else {
    return validUDPExternalPorts.some((range) => {
      return getPortRangeString(range) === getNatRuleExternalPortString(newNat);
    })
      ? ''
      : `Select UDP port`;
  }
};

export const getInternalPortError = (
  newNat: NatRuleDto,
  allNats: NatRuleDto[]
): string => {
  const internalPort = newNat.InternalPort;
  if (!newNat.InternalPort) {
    return 'Required.';
  }

  if (
    newNat.InternalPort == linuxMachineAccessPort ||
    newNat.InternalPort == windowsMachineAccessPort
  ) {
    return 'Invalid port use. Port number is used for virtual machine access only.';
  }
  if (
    newNat.InternalPort < minPortNumber ||
    newNat.InternalPort > maxPortNumber
  ) {
    return 'Invalid port. Port number must between 1 and 65535.';
  }

  if (
    allNats.some(
      (nat) =>
        nat.InternalPort === internalPort &&
        newNat.ExternalAddress === nat.ExternalAddress &&
        newNat.Protocol === nat.Protocol
    )
  ) {
    return `A NAT Rule currently exists with internal port${
      newNat.PortCount > 1 ? 's' : ''
    }: ${getNatRuleInternalPortString(newNat)}`;
  }
  return '';
};
