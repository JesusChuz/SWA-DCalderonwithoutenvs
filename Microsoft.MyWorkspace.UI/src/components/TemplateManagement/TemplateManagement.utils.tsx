import * as React from 'react';
import { FontIcon, useTheme } from '@fluentui/react';
import { clsx } from 'clsx';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { DomainRoles } from 'src/types/AzureWorkspace/enums/DomainRoles';
import { DataDiskTemplateDto } from 'src/types/Catalog/DataDiskTemplateDto.types';
import { NicTemplateDto } from 'src/types/Catalog/NicTemplateDto.types';
import { VirtualMachineTemplateDto } from 'src/types/Catalog/VirtualMachineTemplateDto.types';
import { OSVersion } from 'src/types/enums/OSVersion';
import { TemplateRequestStatus } from 'src/types/enums/TemplateRequestStatus';
import { getIconStyles } from '../MyWorkspaces/WorkspaceMachineProperties/WorkspaceProperties/AdminComponents/AdminTasksPanel.utils';
import { AzureVirtualNetworkDto } from 'src/types/AzureWorkspace/AzureVirtualNetworkDto.types';
import cloneDeep from 'lodash/cloneDeep';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';

export const convertAzureWorkspaceDtoToCreateWorkspaceTemplateDto = (
  workspace: AzureWorkspaceDto
) => {
  return {
    Name: `${workspace.Name} - Template`,
    Description: '',
    SpecialInstructions: '',
    SourceWorkspaceId: workspace.ID,
    VirtualMachines: workspace.VirtualMachines.map((m) => {
      return {
        Name: m.Name,
        Description: m.Description,
        ImageSourceID: m.ImageSourceID,
        PatchMode: m.PatchMode,
        OSVersion: m.OSVersion,
        AdministratorName: m.AdministratorName,
        ComputerName: m.ComputerName,
        DomainRole: m.DomainRole,
        DomainID: m.DomainID,
        MemoryGB: m.MemoryGB,
        PrimaryNicName: m.PrimaryNicName,
        Sku: m.Sku,
        StorageAccountType: m.StorageAccountType,
        Nics: m.Nics as NicTemplateDto[],
        OSDiskSizeInGB: m.OSDiskSizeInGB,
        DataDisks: m.DataDisks.map((d) => {
          return {
            Name: d.Name,
            Description: d.Description,
            SizeGB: d.SizeGB,
            Lun: d.Lun,
            StorageType: d.StorageType,
            FromImage: true,
          } as DataDiskTemplateDto;
        }),
        IsNested: m.IsNested,
      } as VirtualMachineTemplateDto;
    }),
    VirtualNetworks: removeAddressSpacesFromSubnets(workspace.VirtualNetworks),
    Domains: workspace.Domains,
  };
};

const removeAddressSpacesFromSubnets = (networks: AzureVirtualNetworkDto[]) => {
  const newNetworks = cloneDeep(networks);
  for (let i = 0; i < newNetworks.length; i++) {
    for (const key in newNetworks[i].SubnetProperties) {
      if (newNetworks[i].SubnetProperties[key].AddressSpace) {
        delete newNetworks[i].SubnetProperties[key].AddressSpace;
      }
    }
  }

  return newNetworks;
};

export const getDomainMemberError = (
  machine: VirtualMachineTemplateDto,
  machines: VirtualMachineTemplateDto[]
) => {
  if (machine.OSVersion !== OSVersion.Windows) {
    return 'Machine must be running Windows to be a Domain Member.';
  }
  if (!machines.some((m) => m.DomainRole === DomainRoles.DomainController)) {
    return 'There must be a Domain Controller in the workspace to have a Domain Member.';
  }
  return '';
};

interface ITemplateStatusDotIcon {
  status: TemplateRequestStatus;
}

export const TemplateStatusDotIcon = (
  props: ITemplateStatusDotIcon
): JSX.Element => {
  const theme = useTheme();
  const styles = getIconStyles(theme);

  switch (props.status) {
    case TemplateRequestStatus.Unknown:
    case TemplateRequestStatus.Unpublished:
      return (
        <FontIcon
          className={clsx(styles.greyIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case TemplateRequestStatus.Processing:
      return (
        <FontIcon
          className={clsx(styles.orangeIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case TemplateRequestStatus.MarkForDeletion:
    case TemplateRequestStatus.Failed:
      return (
        <FontIcon
          className={clsx(styles.redIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case TemplateRequestStatus.Published:
    case TemplateRequestStatus.Accepted:
      return (
        <FontIcon
          className={clsx(styles.greenIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    case TemplateRequestStatus.Draft:
      return (
        <FontIcon
          className={clsx(styles.blueIcon, styles.dotIcon)}
          iconName='CircleFill'
        />
      );
    default:
      return <></>;
  }
};

export const showTemplateFailures = (template: WorkspaceTemplateDto) => {
  return (
    template.Status === TemplateRequestStatus.Failed &&
    template.Failures &&
    template.Failures.length > 0
  );
};
