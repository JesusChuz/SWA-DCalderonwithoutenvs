import * as React from 'react';
import {
  CommandBarButton,
  DetailsList,
  Dropdown,
  IColumn,
  IDropdownOption,
  Label,
  PrimaryButton,
  SelectionMode,
  Stack,
  TextField,
  Checkbox,
  TooltipHost,
  Text,
  IconButton,
  Announced,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { WorkspaceEditType } from '../../../../../types/enums/WorkspaceEditType';
import {
  getEditableWorkspace,
  getEditableWorkspaceEditType,
  getEditableWorkspaceOriginalWorkspace,
  getEditableWorkspaceVirtualNetwork,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { AzureNicForCreationDto } from '../../../../../types/ResourceCreation/AzureNicForCreationDto.types';
import { MachinesUnion } from '../../../../../types/AzureWorkspace/MachinesUnion.types';
import { AzureNicDto } from '../../../../../types/AzureWorkspace/AzureNicDto.types';
import { styles } from './AzureMachinePropertyTab.styles';
import { AzureVirtualMachineDto } from '../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import {
  editableWorkspaceAddNic,
  editableWorkspaceChangeNicSubnet,
  editableWorkspaceChangePrimaryNic,
  editableWorkspaceRemoveNic,
} from '../../../../../store/actions/editableWorkspaceActions';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import {
  getCatalogMachineSkus,
  getCatalogUserProfile,
  getFeatureFlagMultipleNic,
  getFeatureFlagMultipleSubnet,
  getFeatureFlagMultipleSubnetPostDeployment,
  getFeatureFlagNicReset,
} from '../../../../../store/selectors';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { DomainRoles } from '../../../../../types/AzureWorkspace/enums/DomainRoles';
import { AzureVirtualNetworkDto } from '../../../../../types/AzureWorkspace/AzureVirtualNetworkDto.types';
import {
  resetNic,
  showUserConfirmationDialog,
} from '../../../../../store/actions';
import { ResetIcon } from '@fluentui/react-icons-mdl2';

interface NicMachinePair {
  machine: MachinesUnion;
  nic: AzureNicForCreationDto | AzureNicDto;
}

interface IProps {
  machineIndex: number;
}

export const AzureMachineNetworking = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const userProfile = useSelector(getCatalogUserProfile);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const originalWorkspace = useSelector(getEditableWorkspaceOriginalWorkspace);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const editableWorkspaceNetwork = useSelector(
    getEditableWorkspaceVirtualNetwork
  ) as AzureVirtualNetworkDto;
  const skuList = useSelector(getCatalogMachineSkus);
  const multipleNicFeatureFlag = useSelector(getFeatureFlagMultipleNic);
  const multipleSubnetFeatureFlag = useSelector(getFeatureFlagMultipleSubnet);
  const nicResetFeatureFlag = useSelector(getFeatureFlagNicReset);
  const postDeploymentMultiSubnetFeatureFlag = useSelector(
    getFeatureFlagMultipleSubnetPostDeployment
  );

  const isEditWorkspace = workspaceEditType === WorkspaceEditType.EditWorkspace;

  const isEditEnabled = isEditWorkspace
    ? !EditsDisabled(
        userProfile,
        editableWorkspace as AzureWorkspaceDto,
        originalWorkspace as AzureWorkspaceDto
      )
    : false;

  const machines = React.useMemo(() => {
    return editableWorkspace.VirtualMachines;
  }, [editableWorkspace.VirtualMachines, workspaceEditType]);

  const virtualNetworkOptions: IDropdownOption[] = React.useMemo(() => {
    if (
      multipleSubnetFeatureFlag &&
      editableWorkspaceNetwork?.SubnetProperties
    ) {
      return Object.keys(editableWorkspaceNetwork.SubnetProperties).map(
        (subnet) => {
          return {
            key: subnet,
            text: subnet,
          };
        }
      );
    } else {
      return [
        {
          key: editableWorkspaceNetwork.Name,
          text: editableWorkspaceNetwork.Name,
        },
      ];
    }
  }, [editableWorkspaceNetwork]);

  const nicList = React.useMemo(() => {
    const nicVnetPairList: NicMachinePair[] = [];
    machines.forEach((m: AzureVirtualMachineDto) => {
      m.Nics.map((n) => {
        nicVnetPairList.push({ machine: m, nic: n });
      });
    });
    return nicVnetPairList;
  }, [machines]);

  const nics = React.useMemo(
    () => machines[props.machineIndex].Nics,
    [machines, props.machineIndex]
  );

  const sku = React.useMemo(
    () => skuList.find((s) => s.Name === machines[props.machineIndex].Sku),
    [machines, props.machineIndex, skuList]
  );

  const columns = React.useMemo(() => {
    const columns: IColumn[] = [
      {
        key: 'Name',
        name: 'Name',
        minWidth: 50,
        maxWidth: 200,
        onRender: (nic: AzureNicForCreationDto) => {
          return (
            <Stack verticalAlign='center' className={commonStyles.fullHeight}>
              <Text>{nic.Name}</Text>
            </Stack>
          );
        },
      },
      {
        key: 'VirtualNetwork',
        name: 'Virtual Network',
        minWidth: 150,
        maxWidth: 225,
        onRender: (nic: AzureNicForCreationDto, i) => {
          if (isEditWorkspace && (nic as AzureNicDto).ID?.length > 0) {
            return (
              <TextField
                className={commonStyles.width90}
                ariaLabel={'virtual network'}
                readOnly
                value={
                  multipleSubnetFeatureFlag
                    ? nic.SubnetName
                    : nic.VirtualNetworkName
                }
              />
            );
          } else {
            return (
              <Dropdown
                id={`nic-${i}-network-select`}
                selectedKey={
                  multipleSubnetFeatureFlag
                    ? nic.SubnetName
                    : nic.VirtualNetworkName
                }
                ariaLabel={'virtual network selection'}
                options={virtualNetworkOptions}
                className={commonStyles.width90}
                disabled={
                  isEditWorkspace
                    ? !isEditEnabled || !postDeploymentMultiSubnetFeatureFlag
                    : !multipleSubnetFeatureFlag
                }
                onChange={(event, option) => {
                  dispatch(
                    editableWorkspaceChangeNicSubnet(
                      props.machineIndex,
                      nic.Name,
                      option.text
                    )
                  );
                }}
              />
            );
          }
        },
      },
    ];
    if (isEditWorkspace) {
      columns.splice(1, 0, {
        key: 'PrivateIPAddress',
        name: 'Private IP Address',
        minWidth: 200,
        onRender: (nic: AzureNicDto) => {
          return (
            <TextField
              className={commonStyles.width90}
              ariaLabel='private IP address'
              readOnly
              value={
                nic.PrivateIPAddress
                  ? nic.PrivateIPAddress
                  : 'Not assigned yet.'
              }
            />
          );
        },
      });
    }
    if (multipleNicFeatureFlag) {
      columns.splice(0, 0, {
        key: 'PrimaryNic',
        name: 'Primary',
        minWidth: 70,
        maxWidth: 70,
        onRender: (nic: AzureNicDto) => {
          return (
            <Stack className={commonStyles.fullHeight} verticalAlign='center'>
              <Checkbox
                disabled={isEditWorkspace ? true : !multipleSubnetFeatureFlag}
                ariaLabel='primary nic checkbox'
                checked={
                  nic.Name === machines[props.machineIndex].PrimaryNicName
                }
                onChange={() => {
                  dispatch(
                    editableWorkspaceChangePrimaryNic(
                      props.machineIndex,
                      nic.Name
                    )
                  );
                }}
              />
            </Stack>
          );
        },
      });
      if (nicResetFeatureFlag && isEditWorkspace) {
        columns.push({
          key: 'reset',
          name: '',
          minWidth: 25,
          maxWidth: 50,
          isResizable: true,
          isPadded: false,
          onRender: (nic: AzureNicDto) => {
            return (
              <TooltipHost content='Reset NIC Configuration'>
                <IconButton
                  disabled={
                    !isEditEnabled ||
                    !postDeploymentMultiSubnetFeatureFlag ||
                    nic.ID === undefined
                  }
                  ariaLabel='reset nic'
                  style={{ height: '100%', float: 'right' }}
                  className={commonStyles.transparentBackground}
                  onClick={() =>
                    dispatch(
                      showUserConfirmationDialog(
                        'Warning',
                        `This action cannot be undone. The NIC will be reset to its default state.`,
                        () =>
                          dispatch(
                            resetNic(
                              nic.WorkspaceID,
                              nic.VirtualMachineID,
                              nic.ID
                            )
                          )
                      )
                    )
                  }
                >
                  <ResetIcon />
                </IconButton>
              </TooltipHost>
            );
          },
        });
      }
      columns.push({
        key: 'delete',
        name: '',
        minWidth: 25,
        maxWidth: 50,
        isResizable: true,
        isPadded: false,
        onRender: (nic: AzureNicDto, nicIndex: number) => {
          return (
            <TooltipHost content='Delete NIC'>
              <CommandBarButton
                disabled={
                  nic.Name === machines[props.machineIndex].PrimaryNicName ||
                  nics.length <= 1 ||
                  (isEditWorkspace
                    ? !isEditEnabled || !postDeploymentMultiSubnetFeatureFlag
                    : !multipleSubnetFeatureFlag)
                }
                ariaLabel='delete nic'
                iconProps={{
                  iconName: 'Delete',
                }}
                style={{ height: '100%', float: 'right' }}
                className={commonStyles.transparentBackground}
                onClick={() =>
                  dispatch(
                    editableWorkspaceRemoveNic(props.machineIndex, nicIndex)
                  )
                }
              />
            </TooltipHost>
          );
        },
      });
    }

    return columns;
  }, [
    workspaceEditType,
    props.machineIndex,
    nics,
    editableWorkspaceNetwork,
    machines[props.machineIndex],
  ]);

  const addNicButtonDisabled =
    nics.length >= sku.MaxNics ||
    (isEditWorkspace
      ? !isEditEnabled || !postDeploymentMultiSubnetFeatureFlag
      : !multipleSubnetFeatureFlag) ||
    machines[props.machineIndex].DomainRole === DomainRoles.DomainController;

  return (
    <Stack className={styles.propertiesContent}>
      <Stack
        className={`${commonStyles.fullWidth}`}
        style={{ paddingLeft: '20px', paddingTop: '10px' }}
      >
        <Stack className={`${commonStyles.fullWidth}`}>
          <Stack
            horizontal
            horizontalAlign='space-between'
            verticalAlign='center'
          >
            <h3>NICs</h3>
            {multipleNicFeatureFlag && (
              <TooltipHost
                content={
                  nics.length >= sku.MaxNics
                    ? `The current SKU allows for a maximum of ${sku.MaxNics} NICs`
                    : machines[props.machineIndex].DomainRole ===
                      DomainRoles.DomainController
                    ? 'Domain controllers cannot have more than 1 NIC'
                    : ''
                }
                id={'azure-machine-nic-tooltip'}
              >
                <PrimaryButton
                  disabled={addNicButtonDisabled}
                  ariaLabel={'Add NIC'}
                  role='button'
                  allowDisabledFocus={true}
                  iconProps={{ iconName: 'Add' }}
                  text={'Add NIC'}
                  onClick={() => {
                    dispatch(editableWorkspaceAddNic(props.machineIndex));
                  }}
                  aria-describedby={'azure-machine-nic-tooltip'}
                />
                <Announced
                  message={
                    addNicButtonDisabled ? 'Add NIC button unavailable' : ''
                  }
                />
              </TooltipHost>
            )}
          </Stack>

          <DetailsList
            className={commonStyles.marginBottom8}
            items={machines[props.machineIndex].Nics}
            columns={columns}
            selectionMode={SelectionMode.none}
          />
        </Stack>
        {!multipleSubnetFeatureFlag && (
          <Stack className={`${commonStyles.fullWidth}`}>
            <Label style={{ paddingTop: 24 }}>Network Summary</Label>
            <Stack key={editableWorkspaceNetwork.Name}>
              <Stack
                horizontal
                className={`${commonStyles.fullWidth}`}
                style={{ marginLeft: '10px', marginRight: '10px' }}
              >
                <Label>{editableWorkspaceNetwork}</Label>
              </Stack>
              {nicList
                .filter(
                  (pair) =>
                    pair.nic.VirtualNetworkName ===
                    editableWorkspaceNetwork.Name
                )
                .map(({ machine, nic }: NicMachinePair) => (
                  <Stack
                    horizontal
                    className={`${commonStyles.fullWidth}`}
                    style={{ marginLeft: '20px' }}
                    key={`${machine.ComputerName} - ${nic.Name}`}
                  >
                    <Label>{`${machine.ComputerName} - ${nic.Name}`}</Label>
                  </Stack>
                ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
