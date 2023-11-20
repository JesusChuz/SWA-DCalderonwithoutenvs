import React, { useMemo } from 'react';
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
  DomainViewDomainMemberX,
  DomainViewDomainMemberMarginLeft,
  initialConfigurationDomainView,
  DomainViewWorkgroupMemberBoxWidth,
} from './SVG.utils';
import { ceil, max } from 'lodash';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { AzureWorkspaceForCreationDto } from 'src/types/ResourceCreation/AzureWorkspaceForCreationDto.types';
import { DomainRoles } from 'src/types/AzureWorkspace/enums/DomainRoles';

interface DCDrawingValues {
  dcYPosition: number;
  dmBoxHeight: number;
  dc: AzureVirtualMachineDto | AzureVirtualMachineForCreationDto;
}

interface IDomainViewDomainGroups {
  workspace: AzureWorkspaceDto | AzureWorkspaceForCreationDto;
  domainGroupSectionPosition: number;
  canvasId: string;
}

export const DomainViewDomainGroups = (props: IDomainViewDomainGroups) => {
  const theme = useTheme();
  const styles = getCanvasStyles(theme);

  const domainControllers = useMemo(() => {
    return props.workspace.VirtualMachines.filter((vm, i) => {
      return vm.DomainRole == DomainRoles.DomainController;
    });
  }, [props.workspace.VirtualMachines]);

  const domainMembers = useMemo(() => {
    return props.workspace.VirtualMachines.filter((vm, i) => {
      return vm.DomainRole == DomainRoles.DomainMember;
    });
  }, [props.workspace.VirtualMachines]);

  const drawingValues = useMemo(() => {
    return domainControllers.map((dc, i) => {
      const subArray = domainControllers.slice(0, i);

      const connectedMembers = domainMembers.filter(
        (dm) => dm.DomainID == dc.DomainID
      );
      const numberDMRows = max([ceil(connectedMembers.length / 4), 1]);
      const dmBoxHeight =
        numberDMRows * VMHeight + VMPadding * (numberDMRows + 1);
      // Create running tally of Domain Member Box Heights for calculating
      // new position
      const dcYPosition = subArray.reduce((accumulator, currentDC) => {
        const connectedMembers = domainMembers.filter(
          (dm) => dm.DomainID == currentDC.DomainID
        );
        const numberDMRows = max([ceil(connectedMembers.length / 4), 1]);
        const dmBoxHeight =
          numberDMRows * VMHeight + VMPadding * (numberDMRows + 1);
        return accumulator + dmBoxHeight + VMPadding;
      }, props.domainGroupSectionPosition);
      return {
        dcYPosition,
        dmBoxHeight,
        dc,
      } as DCDrawingValues;
    });
  }, [domainControllers]);

  React.useEffect(() => {
    const TwoTimesVMPadding = 2 * VMPadding;
    const maxX = DomainViewWorkgroupMemberBoxWidth + TwoTimesVMPadding;
    const maxY =
      (drawingValues.length > 0
        ? drawingValues[drawingValues.length - 1].dcYPosition +
          drawingValues[drawingValues.length - 1].dmBoxHeight
        : props.domainGroupSectionPosition) + TwoTimesVMPadding;
    initialConfigurationDomainView(props.canvasId, maxX, maxY);
  }, [
    drawingValues,
    DomainViewWorkgroupMemberBoxWidth,
    props.domainGroupSectionPosition,
  ]);

  return (
    <>
      {domainControllers.length > 0 && (
        <>
          <text
            className={styles.domainSection}
            x={VMPadding}
            y={props.domainGroupSectionPosition}
          >
            Domain Controllers
          </text>
          <text
            className={styles.domainSection}
            x={DomainViewDomainMemberX + VMPadding}
            y={props.domainGroupSectionPosition}
          >
            Domain Members
          </text>
          {/* Map each Domain Controller to the list of Domain Members connected to it */}
          {drawingValues.map((values, i) => {
            const connectedMembers = domainMembers.filter(
              (dm) => dm.DomainID == values.dc.DomainID
            );
            return (
              <g key={getVMId(values.dc.ComputerName)}>
                <svg
                  style={{
                    overflow: 'visible',
                  }}
                  x={VMPadding}
                  y={values.dcYPosition}
                >
                  <g>
                    <rect
                      width={'390px'}
                      height={values.dmBoxHeight}
                      rx={'25px'}
                      stroke={'black'}
                      fill={theme.name == 'light' ? '#B4CCE8' : '#436da1'}
                      y={25}
                    ></rect>
                    <VirtualMachineSVG
                      x={DomainViewVMMarginLeft}
                      y={
                        Math.floor(i / DomainViewNumberVMsPerRow) *
                          (VMHeight + VMPadding) +
                        DomainViewVMMarginTop
                      }
                      vm={values.dc}
                      id={getVMId(values.dc.ComputerName)}
                    />
                  </g>
                </svg>
                <svg
                  style={{
                    overflow: 'visible',
                  }}
                  x={VMPadding}
                  y={values.dcYPosition}
                >
                  <g>
                    <rect
                      width={1385 + VMPadding}
                      height={values.dmBoxHeight}
                      rx={'25px'}
                      stroke={'black'}
                      fill={theme.name == 'light' ? '#FFFFFF' : '#454545'}
                      x={390}
                      y={25}
                    ></rect>
                    {/* Map each Domain Member connected to this Domain Controller to
              an SVG that represents that VM */}
                    {connectedMembers.length < 1 && (
                      <text
                        className={styles.noDomainMembers}
                        x={DomainViewDomainMemberX}
                        y={100}
                      >
                        This Domain Controller currently has no attached Domain
                        Members
                      </text>
                    )}
                    {connectedMembers.map((vm, j) => {
                      return (
                        <VirtualMachineSVG
                          key={`vm-key-${j}`}
                          x={
                            ((j % 4) + 1) * (VMWidth + VMPadding) +
                            DomainViewDomainMemberMarginLeft
                          }
                          y={
                            Math.floor(j / 4) * (VMHeight + VMPadding) +
                            DomainViewVMMarginTop
                          }
                          vm={vm}
                          id={getVMId(vm.ComputerName)}
                        />
                      );
                    })}
                  </g>
                </svg>
              </g>
            );
          })}
        </>
      )}
      {domainControllers.length === 0 && (
        <text
          className={styles.domainSection}
          x={VMPadding}
          y={props.domainGroupSectionPosition}
        >
          No Domain Controllers
        </text>
      )}
    </>
  );
};
