import { AzureWorkspaceDto } from '../types/AzureWorkspace/AzureWorkspaceDto.types';
import { TempSubnet } from '../types/Forms/TempSubnet.types';
import { SubnetForCreationDto } from '../types/ResourceCreation/SubnetForCreationDto.types';

export const workspaceTempSubnetsToSubnetProperties = (
  subnets: TempSubnet[]
): Record<string, SubnetForCreationDto> => {
  const subnetProperties: Record<string, SubnetForCreationDto> = {};
  for (let i = 0; i < subnets.length; i++) {
    subnetProperties[subnets[i].name] = subnets[i].subnet;
  }
  return subnetProperties;
};

export const editableWorkspaceSubnetsToTempSubnets = (
  workspace: AzureWorkspaceDto
): TempSubnet[] => {
  const subnets: TempSubnet[] = [];
  if (
    !workspace.VirtualNetworks[0] ||
    !workspace.VirtualNetworks[0].SubnetProperties
  ) {
    return [];
  }
  for (const [name, properties] of Object.entries(
    workspace.VirtualNetworks[0].SubnetProperties
  )) {
    subnets.push({
      name,
      subnet: properties,
    });
  }
  return subnets;
};
