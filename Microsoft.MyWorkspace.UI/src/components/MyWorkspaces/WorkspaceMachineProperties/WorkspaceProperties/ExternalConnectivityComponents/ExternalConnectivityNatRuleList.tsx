import * as React from 'react';
import {
  Stack,
  PrimaryButton,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  CommandButton,
  IContextualMenuItem,
  IContextualMenuProps,
  TooltipHost,
  Link,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import { addIcon, deleteIcon, moreIcon } from '../../../../../shared/Icons';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { NatRuleDto } from '../../../../../types/AzureWorkspace/NatRuleDto.types';
import { AzureNicDto } from '../../../../../types/AzureWorkspace/AzureNicDto.types';
import { NetworkProtocols } from '../../../../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';
import { getCatalogUserProfile } from '../../../../../store/selectors';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import { editableWorkspaceRemoveNatRule } from '../../../../../store/actions/editableWorkspaceActions';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  getNatRuleExternalPortString,
  getNatRuleInternalPortString,
} from './ExternalConnectivityNatRulePanel.utils';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { InfoButton } from '../../../../GeneralComponents/InfoButton';
import { PORT_MAPPINGS_INFO_TEXT } from '../../../../../shared/Constants';

interface IProps {
  isJitActive: boolean;
  openPanel: () => void;
}

interface MachineNatRuleObject {
  natRule: NatRuleDto;
  machine: AzureVirtualMachineDto;
  nic: AzureNicDto;
}

export const ExternalConnectivityNatRuleList = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dispatch = useDispatch();
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const userProfile = useSelector(getCatalogUserProfile);
  const [showAllNatEntries, setShowAllNatEntries] = React.useState(false);
  const columns: IColumn[] = [
    {
      key: 'machine',
      name: 'Machine',
      fieldName: 'MachineID',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'nic',
      name: 'Target NIC',
      fieldName: 'NicID',
      minWidth: 100,
      maxWidth: 125,
      isResizable: true,
    },
    {
      key: 'ExternalAddress',
      name: 'External Address',
      minWidth: 125,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'ExternalPort',
      name: 'External Port(s)/Protocol',
      minWidth: 125,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'InternalPort',
      name: 'Internal Port(s)',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 75,
      maxWidth: 75,
      isResizable: false,
    },
  ];

  const actionColumn = ({ machine, natRule }: MachineNatRuleObject) => {
    const rowMenuProps: IContextualMenuProps = {
      items: [{ key: 'delete', text: 'Delete', iconProps: deleteIcon }],
      onItemClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>,
        op?: IContextualMenuItem
      ) => {
        switch (op.key) {
          case 'delete':
            dispatch(editableWorkspaceRemoveNatRule(machine, natRule));
            return;
        }
      },
    };
    return (
      <TooltipHost
        content={
          props.isJitActive
            ? 'A NAT Entry cannot be modified with JIT is active'
            : ''
        }
      >
        <CommandButton
          iconProps={moreIcon}
          text=''
          style={{ height: 18 }}
          onRenderMenuIcon={() => null}
          menuProps={rowMenuProps}
          disabled={
            props.isJitActive ||
            EditsDisabled(
              userProfile,
              editableWorkspace,
              originalWorkspace,
              false,
              true
            )
          }
        />
      </TooltipHost>
    );
  };

  const _renderItemColumn = (
    { machine, nic, natRule }: MachineNatRuleObject,
    index: number,
    column: IColumn
  ) => {
    const fieldContent = natRule[column.key as keyof NatRuleDto];
    switch (column.key) {
      case 'machine':
        return machine.ComputerName;
      case 'nic':
        return nic.Name;
      case 'ExternalPort':
        if (natRule.Protocol === NetworkProtocols.Unknown) {
          return 'Unknown';
        }
        return `${
          natRule.Protocol === NetworkProtocols.TCP ? 'TCP' : 'UDP'
        } ${getNatRuleExternalPortString(natRule)}`;
      case 'InternalPort':
        return getNatRuleInternalPortString(natRule);
      case 'ExternalAddress':
        const address = editableWorkspace.PublicAddresses.find(
          (pa) => pa.PrivateIPAddress === natRule.ExternalAddress
        );
        return address ? `${address.PublicIPAddress}` : '';
      case 'actions':
        return actionColumn({ machine, nic, natRule });
      default:
        return <Text>{fieldContent}</Text>;
    }
  };

  const machineNatRuleList: MachineNatRuleObject[] = React.useMemo(() => {
    const machines: AzureVirtualMachineDto[] = [
      ...editableWorkspace.VirtualMachines,
    ];
    const natRules = machines.flatMap((m) => m.NatRules);
    return natRules.map((natRule) => {
      const machine = machines.find((m) => m.ID === natRule.VirtualMachineID);
      const nic = machine.Nics.find(
        (n) => n.PrivateIPAddress === natRule.InternalAddress
      );
      return { machine, nic, natRule };
    });
  }, [editableWorkspace.VirtualMachines]);

  const anyRunningPublicAddresses = React.useMemo(() => {
    return editableWorkspace.PublicAddresses.some(
      (pa) =>
        pa.State === ResourceState.Running ||
        pa.State === ResourceState.PartiallyRunning
    );
  }, [editableWorkspace.PublicAddresses]);

  const getNewPortTooltipText = () => {
    if (!anyRunningPublicAddresses) {
      return 'NAT Entries require at least one running public address to be created.';
    }
    if (props.isJitActive) {
      return 'NAT Entries cannot be created while JIT is active.';
    }
    return '';
  };

  return (
    <div>
      <Stack
        horizontal
        className={commonStyles.fullWidth}
        tokens={{ ...defaultStackTokens }}
        horizontalAlign='space-between'
        verticalAlign='center'
      >
        <Stack.Item>
          <h3 className={commonStyles.margin0}>
            Inbound Ports (NAT Entries)
            <InfoButton
              buttonId={'infoButton-portMappings'}
              calloutTitle={'Port Mappings'}
              calloutBody={PORT_MAPPINGS_INFO_TEXT}
            />
          </h3>
        </Stack.Item>
        <Stack.Item>
          <TooltipHost content={getNewPortTooltipText()}>
            <PrimaryButton
              text='New Inbound Port'
              iconProps={addIcon}
              onClick={() => props.openPanel()}
              disabled={
                !anyRunningPublicAddresses ||
                props.isJitActive ||
                EditsDisabled(
                  userProfile,
                  editableWorkspace,
                  originalWorkspace,
                  false,
                  true
                )
              }
            />
          </TooltipHost>
        </Stack.Item>
      </Stack>
      <Stack
        horizontal
        className={`${commonStyles.fullWidth} ${commonStyles.columnContainer}`}
        tokens={defaultStackTokens}
      >
        <>
          {machineNatRuleList.length > 0 ? (
            <>
              <DetailsList
                items={
                  showAllNatEntries
                    ? machineNatRuleList
                    : machineNatRuleList.slice(0, 3)
                }
                columns={columns}
                setKey='set'
                selectionMode={SelectionMode.none}
                layoutMode={DetailsListLayoutMode.justified}
                onRenderItemColumn={_renderItemColumn}
                selectionPreservedOnEmptyClick={true}
                ariaLabelForSelectionColumn='Toggle selection'
                ariaLabelForSelectAllCheckbox='Toggle selection for all items'
                checkButtonAriaLabel='Row checkbox'
              />
              {machineNatRuleList.length > 3 && (
                <Link
                  onClick={() => setShowAllNatEntries(!showAllNatEntries)}
                  disabled={machineNatRuleList.length === 0}
                >
                  {showAllNatEntries ? 'Collapse' : 'View All'}{' '}
                  {machineNatRuleList.length} Inbound Ports
                </Link>
              )}
            </>
          ) : (
            <Text>No NAT Entries</Text>
          )}
        </>
      </Stack>
    </div>
  );
};
