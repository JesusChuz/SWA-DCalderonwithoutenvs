import * as React from 'react';
import {
  Stack,
  Panel,
  PanelType,
  Dropdown,
  IDropdownOption,
  TextField,
  DefaultButton,
  PrimaryButton,
  useTheme,
} from '@fluentui/react';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { NatRuleDto } from '../../../../../types/AzureWorkspace/NatRuleDto.types';
import { NetworkProtocols } from '../../../../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';
import { useDispatch, useSelector } from 'react-redux';
import { editableWorkspaceAddNatRule } from '../../../../../store/actions/editableWorkspaceActions';
import { getEditableWorkspace } from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  PortRange,
  getDefaultNatRule,
  validTCPExternalPorts,
  validUDPExternalPorts,
  getExternalPortError,
  getNatRuleExternalPortString,
  getPortCount,
  getPortRangeString,
  getNatRuleInternalPortString,
  getInternalPortError,
  minPortNumber,
  maxPortNumber,
} from './ExternalConnectivityNatRulePanel.utils';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';

interface IProps {
  open: boolean;
  closePanel: () => void;
}

export const ExternalConnectivityNatRulePanel = (
  props: IProps
): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const [newNat, setNewNat] = React.useState<NatRuleDto>(() => ({
    ...getDefaultNatRule(editableWorkspace),
  }));

  const allMachines: AzureVirtualMachineDto[] = React.useMemo(() => {
    return [...editableWorkspace.VirtualMachines];
  }, [editableWorkspace.VirtualMachines]);

  const allNats: NatRuleDto[] = React.useMemo(() => {
    return allMachines.flatMap((m) => m.NatRules);
  }, [allMachines]);

  const resetPanel = () => {
    setNewNat({ ...getDefaultNatRule(editableWorkspace) });
  };

  const machineError = React.useMemo(() => {
    return newNat.VirtualMachineID ? '' : 'Required';
  }, [newNat.VirtualMachineID]);

  const nicError = React.useMemo(() => {
    return newNat.InternalAddress ? '' : 'Required';
  }, [newNat.InternalAddress]);

  const externalAddressError = React.useMemo(() => {
    return newNat.ExternalAddress && newNat.ExternalAddress !== ''
      ? ''
      : 'Required';
  }, [newNat.ExternalAddress]);

  const protocolError = React.useMemo(() => {
    return newNat.Protocol !== NetworkProtocols.Unknown ? '' : 'Required';
  }, [newNat.Protocol]);

  const externalPortError = React.useMemo(() => {
    return getExternalPortError(newNat, allNats);
  }, [newNat.ExternalPort, newNat.Protocol, newNat.ExternalAddress, allNats]);

  const internalPortError = React.useMemo(() => {
    return getInternalPortError(newNat, allNats);
  }, [newNat.InternalPort, newNat.ExternalAddress, allNats]);

  const anyErrors = () => {
    return [
      machineError,
      nicError,
      externalAddressError,
      protocolError,
      externalPortError,
      internalPortError,
    ].some((error) => error !== '');
  };

  const setVirtualMachine = (
    event: React.FormEvent<HTMLDivElement>,
    option: IDropdownOption
  ) => {
    const machine = allMachines.find((m) => m.ID === option.key.toString());
    setNewNat({
      ...newNat,
      VirtualMachineID: machine?.ID,
    });
  };

  const setNic = (
    event: React.FormEvent<HTMLDivElement>,
    option: IDropdownOption
  ) => {
    const nic = machine.Nics.find(
      (n) => n.PrivateIPAddress === option.key.toString()
    );
    setNewNat({
      ...newNat,
      InternalAddress: nic?.PrivateIPAddress,
    });
  };

  const setExternalAddress = (
    event: React.FormEvent<HTMLDivElement>,
    option: IDropdownOption
  ) => {
    setNewNat({
      ...newNat,
      ExternalAddress: option.key.toString(),
    });
  };

  const setExternalPort = (
    event: React.FormEvent<HTMLDivElement>,
    option: IDropdownOption
  ) => {
    const portCount = getPortCount(option.data as PortRange);
    setNewNat({
      ...newNat,
      ExternalPort: option.data.start,
      InternalPort: option.data.start,
      PortCount: portCount,
    });
  };

  const setInternalPort = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string
  ) => {
    setNewNat({
      ...newNat,
      InternalPort: Math.abs(Number.parseInt(value)),
    });
  };

  const machine = React.useMemo(() => {
    return newNat.VirtualMachineID === undefined
      ? undefined
      : (allMachines.find(
          (m) => m.ID === newNat.VirtualMachineID
        ) as AzureVirtualMachineDto);
  }, [newNat.VirtualMachineID]);

  const nicOptions: IDropdownOption[] = React.useMemo(() => {
    if (machine === undefined) {
      return [];
    }
    return machine.Nics.map((n) => {
      return {
        key: n.PrivateIPAddress,
        text: `${n.Name}`,
      };
    });
  }, [machine]);

  const portOptions: IDropdownOption[] = React.useMemo(() => {
    if (newNat.Protocol === NetworkProtocols.Unknown) {
      return [];
    }
    const portRangeList =
      newNat.Protocol === NetworkProtocols.TCP
        ? validTCPExternalPorts
        : validUDPExternalPorts;
    return portRangeList.map((range) => {
      return {
        key: getPortRangeString(range),
        text: getPortRangeString(range),
        data: range,
      };
    });
  }, [newNat.Protocol]);

  const addNatRule = () => {
    dispatch(editableWorkspaceAddNatRule(newNat));
    resetPanel();
    props.closePanel();
  };

  const onRenderFooterContent = () => {
    return (
      <div>
        <PrimaryButton disabled={anyErrors()} onClick={addNatRule}>
          Save
        </PrimaryButton>
        <DefaultButton
          className={commonStyles.marginLeft8}
          onClick={() => {
            resetPanel();
            props.closePanel();
          }}
        >
          Cancel
        </DefaultButton>
      </div>
    );
  };

  React.useEffect(() => {
    if (allMachines?.length && !newNat.VirtualMachineID) {
      setNewNat({ ...newNat, VirtualMachineID: allMachines[0].ID });
    }
  }, [allMachines, props.open]);

  React.useEffect(() => {
    if (machine && !machine.Nics.some((n) => n.ID === newNat.InternalAddress)) {
      const firstNic = machine.Nics ? machine.Nics[0] : undefined;
      setNewNat({ ...newNat, InternalAddress: firstNic?.PrivateIPAddress });
    }
  }, [machine]);

  return (
    <Panel
      headerText='Add NAT Entry'
      isOpen={props.open}
      onDismiss={() => {
        resetPanel();
        props.closePanel();
      }}
      onRenderFooterContent={onRenderFooterContent}
      closeButtonAriaLabel='Close'
      customWidth={'450px'}
      type={PanelType.custom}
    >
      <Stack
        horizontal
        className={`${commonStyles.fullWidth} ${commonStyles.padding0} ${commonStyles.textFieldSpacing}`}
        tokens={defaultStackTokens}
        verticalAlign='start'
      >
        <Stack.Item className={commonStyles.width67}>
          <Dropdown
            label='Choose Machine'
            errorMessage={machineError}
            selectedKey={newNat.VirtualMachineID}
            onChange={setVirtualMachine}
            placeholder='Select a machine'
            options={allMachines.map((m) => {
              return {
                key: m.ID,
                text: `${m.ComputerName}`,
              };
            })}
          />
        </Stack.Item>
        <Stack.Item className={commonStyles.width33}>
          <Dropdown
            label='Choose NIC'
            errorMessage={nicError}
            selectedKey={newNat.InternalAddress}
            onChange={setNic}
            placeholder='Select a NIC'
            options={nicOptions}
          />
        </Stack.Item>
      </Stack>
      <Dropdown
        label='External Address'
        className={commonStyles.textFieldSpacing}
        errorMessage={externalAddressError}
        selectedKey={newNat.ExternalAddress}
        onChange={setExternalAddress}
        placeholder='Select an option'
        options={editableWorkspace.PublicAddresses.filter(
          (a) => a.State === ResourceState.Running
        ).map((pa) => {
          return {
            key: pa.PrivateIPAddress,
            text: pa.PublicIPAddress,
          };
        })}
      />
      <Stack
        horizontal
        className={`${commonStyles.fullWidth} ${commonStyles.padding0} ${commonStyles.textFieldSpacing}`}
        tokens={defaultStackTokens}
        verticalAlign='start'
      >
        <Stack.Item className={commonStyles.width33}>
          <Dropdown
            label='Protocol'
            errorMessage={protocolError}
            selectedKey={newNat.Protocol}
            onChange={(event, option: IDropdownOption) => {
              setNewNat({
                ...newNat,
                Protocol: option.key as number,
              });
            }}
            placeholder='Select Protocol'
            options={[
              { key: 1, text: 'TCP' },
              { key: 2, text: 'UDP' },
            ]}
          />
        </Stack.Item>
        <Stack.Item className={commonStyles.width67}>
          <Dropdown
            label='External Port'
            errorMessage={externalPortError}
            selectedKey={getNatRuleExternalPortString(newNat)}
            onChange={setExternalPort}
            placeholder='Select Port'
            options={portOptions}
          />
        </Stack.Item>
      </Stack>
      {newNat.PortCount > 1 ? (
        <TextField
          disabled
          label='Internal Port'
          className={commonStyles.textFieldSpacing}
          errorMessage={internalPortError}
          value={getNatRuleExternalPortString(newNat)}
        />
      ) : (
        <TextField
          disabled={newNat.ExternalPort == undefined}
          label='Internal Port'
          className={commonStyles.textFieldSpacing}
          errorMessage={internalPortError}
          type={'number'}
          min={minPortNumber}
          max={maxPortNumber}
          value={getNatRuleInternalPortString(newNat)}
          onChange={setInternalPort}
        />
      )}
    </Panel>
  );
};
