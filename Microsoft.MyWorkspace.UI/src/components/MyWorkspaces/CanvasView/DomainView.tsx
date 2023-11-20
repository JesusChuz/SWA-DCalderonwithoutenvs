import React, { useMemo } from 'react';
import { ceil } from 'lodash';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { DomainRoles } from 'src/types/AzureWorkspace/enums/DomainRoles';
import { AzureWorkspaceForCreationDto } from 'src/types/ResourceCreation/AzureWorkspaceForCreationDto.types';
import { CanvasContainer } from './CanvasContainer';
import { VMPadding, VMHeight, DATA_DOMAIN_VIEW_VIEWBOX } from './SVG.utils';
import { DomainViewWorkgroupMembers } from './DomainViewWorkgroupMembers';
import { DomainViewDomainGroups } from './DomainViewDomainGroups';

const canvasId = 'canvasContainerDomainOverview';

interface DomainViewProps {
  workspace: AzureWorkspaceDto | AzureWorkspaceForCreationDto;
}

export const DomainView = (props: DomainViewProps) => {
  const workgroupMembers = useMemo(() => {
    return props.workspace.VirtualMachines.filter((vm, i) => {
      return vm.DomainRole == DomainRoles.WorkgroupMember;
    });
  }, [props.workspace.VirtualMachines]);

  const numberWorkgroupRows = useMemo(() => {
    return ceil(workgroupMembers.length / 5);
  }, [workgroupMembers]);

  const workgroupSectionHeight = useMemo(() => {
    return (
      numberWorkgroupRows * VMHeight + VMPadding * (numberWorkgroupRows + 1)
    );
  }, [numberWorkgroupRows]);

  const domainGroupSectionPosition = useMemo(() => {
    return workgroupSectionHeight + 150;
  }, [numberWorkgroupRows]);

  return (
    <CanvasContainer
      id={canvasId}
      viewBoxOverrideTag={DATA_DOMAIN_VIEW_VIEWBOX}
      allowPan
      allowZoom
    >
      <DomainViewWorkgroupMembers
        height={workgroupSectionHeight}
        workgroupMembers={workgroupMembers}
      />
      <DomainViewDomainGroups
        workspace={props.workspace}
        domainGroupSectionPosition={domainGroupSectionPosition}
        canvasId={canvasId}
      />
    </CanvasContainer>
  );
};
