import * as React from 'react';
import {
  Stack,
  IDropdownOption,
  Dropdown,
  Label,
  IconButton,
  DetailsListLayoutMode,
  DetailsList,
  IColumn,
  SelectionMode,
  TooltipHost,
  Icon,
  TextField,
  Text,
  IDetailsListProps,
  IDetailsRowStyles,
  DetailsRow,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCatalogMachineSkus,
  getFeatureFlagMultipleDomainControllers,
  getFeatureFlagTemplateQuotaAdjustment,
  getUserRoleAssignmentConstraint,
} from '../../../store/selectors';
import {
  getEditableWorkspaceDataDiskErrors,
  getEditableWorkspaceDomainErrors,
  getEditableWorkspaceDomains,
  getEditableWorkspaceEditType,
  getEditableWorkspaceIsNestedVirtualizationEnabled,
  getEditableWorkspaceVirtualMachines,
  getEditableWorkspaceVMNameErrors,
} from '../../../store/selectors/editableWorkspaceSelectors';
import { MachineConfigurationPanel } from './Custom/MachineConfigurationPanel';
import { getNewAzureWorkspaceStyles } from '../NewWorkspace.styles';
import {
  editableWorkspaceUpdateMemoryGB,
  editableWorkspaceUpdateOSDisk,
  editableWorkspaceUpdateVMName,
} from '../../../store/actions/editableWorkspaceActions';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { dismissNotifications } from '../../../store/actions';
import { AzureVirtualMachineForCreationDto } from '../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { MachineImageType } from '../../../types/AzureWorkspace/enums/MachineImageType';
import {
  checkMaxOSDiskSizeAllowed,
  checkMachineSkuDataDiskQuotas,
  checkMachineSkuNicQuotas,
  checkMaxMachinesStorageQuota,
  checkMaxMemoryQuota,
} from '../../../store/validators/quotaValidators';
import { Default_AzureOSDiskDto } from '../../../data/Default_AzureOSDiskDto';
import {
  FindVirtualMachineDomain,
  FindVirtualMachineSku,
} from '../../../shared/helpers/WorkspaceHelper';
import {
  getErrorDropdownStyle,
  selectMemoryOptions,
  selectOSDiskOptions,
} from './MachineConfigurationList.utils';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import clsx from 'clsx';
import { OSVersion } from '../../../types/enums/OSVersion';
import { useId } from '@fluentui/react-hooks';

export const MachineConfigurationList = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getNewAzureWorkspaceStyles(theme);
  const errorDropdownStyle = getErrorDropdownStyle(theme);
  const commonStyles = getCommonStyles(theme);
  const machineListId = useId('machine-list-id');
  const machineSkus = useSelector(getCatalogMachineSkus);
  const machines: AzureVirtualMachineForCreationDto[] = useSelector(
    getEditableWorkspaceVirtualMachines
  );
  const vmNameErrors = useSelector(getEditableWorkspaceVMNameErrors);
  const dataDiskErrors = useSelector(getEditableWorkspaceDataDiskErrors);
  const defaultOSDisk = { ...Default_AzureOSDiskDto };
  const domains = useSelector(getEditableWorkspaceDomains);
  const domainErrors = useSelector(getEditableWorkspaceDomainErrors);
  const domainControllerFeatureFlag = useSelector(
    getFeatureFlagMultipleDomainControllers
  );
  const templateQuotaAdjustmentEnabled = useSelector(
    getFeatureFlagTemplateQuotaAdjustment
  );
  const userRoleAssignmentConstraint = useSelector(
    getUserRoleAssignmentConstraint
  );
  const isNestedVirtualizationEnabled = useSelector(
    getEditableWorkspaceIsNestedVirtualizationEnabled
  );
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const [editMachineIndex, setEditMachineIndex] = React.useState(-1);

  const disabledColor = '#F2F2F2';

  const onRenderRow: IDetailsListProps['onRenderRow'] = (props) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      if (
        (props.item as AzureVirtualMachineDto).MachineImageType ===
          MachineImageType.SharedImage &&
        !templateQuotaAdjustmentEnabled
      ) {
        // Every other row renders with a different background color
        customStyles.root = { backgroundColor: disabledColor };
      }

      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  const columns: IColumn[] = React.useMemo(() => {
    const columns: IColumn[] = [
      {
        key: 'machineName',
        name: 'Machine Name',
        ariaLabel: 'Machine Name',
        fieldName: 'ComputerName',
        minWidth: 125,
        maxWidth: 150,
        onRender: (item: AzureVirtualMachineForCreationDto, index: number) => {
          const vmNameError = vmNameErrors.find(
            (err) => err.machineIndex === index
          );
          const isTemplate =
            item.MachineImageType === MachineImageType.SharedImage;
          return (
            <TooltipHost
              content={
                isTemplate
                  ? 'Template VMs cannot have their names changed.'
                  : ''
              }
            >
              <TextField
                disabled={
                  item.MachineImageType === MachineImageType.SharedImage ||
                  (item as AzureVirtualMachineDto).ID?.length > 0
                }
                ariaLabel='Machine Name'
                value={item.ComputerName}
                onChange={(event, newValue) => {
                  dispatch(editableWorkspaceUpdateVMName(index, newValue));
                }}
                errorMessage={vmNameError ? vmNameError.message : ''}
                maxLength={15}
                required
              />
            </TooltipHost>
          );
        },
      },
      {
        key: 'operatingSystem',
        name: 'Operating System',
        minWidth: 150,
        maxWidth: 250,
        isRowHeader: true,
        isResizable: true,
        isPadded: true,
        onRender: (item: AzureVirtualMachineForCreationDto) => {
          return (
            <TooltipHost content={item.Name}>
              <Text
                className={clsx(
                  styles.listPadding,
                  commonStyles.textOverflowEllipsis,
                  commonStyles.overflowXHidden
                )}
              >
                {item.Name}
              </Text>
            </TooltipHost>
          );
        },
      },
      {
        key: 'memory',
        name: 'Memory',
        minWidth: 75,
        maxWidth: 100,
        isResizable: true,
        onRender: (item: AzureVirtualMachineForCreationDto, index: number) => {
          const memoryError = checkMaxMemoryQuota(
            machines,
            index,
            userRoleAssignmentConstraint
          );
          return (
            <TooltipHost content={memoryError || ''}>
              <Dropdown
                id={`machine-${index}-memory`}
                selectedKey={item.MemoryGB}
                options={selectMemoryOptions(
                  item,
                  machines,
                  machineSkus,
                  userRoleAssignmentConstraint,
                  isNestedVirtualizationEnabled
                )}
                ariaLabel='Machine Memory in Gigabytes'
                styles={memoryError ? errorDropdownStyle : undefined}
                data-custom-id='Azure Memory Dropdown'
                onChange={(
                  event: React.FormEvent<HTMLDivElement>,
                  option?: IDropdownOption
                ) =>
                  dispatch(
                    editableWorkspaceUpdateMemoryGB(index, option.key as number)
                  )
                }
              />
            </TooltipHost>
          );
        },
        isPadded: true,
      },
      {
        key: 'nics',
        name: 'NICs',
        minWidth: 25,
        maxWidth: 50,
        onRender: (item: AzureVirtualMachineForCreationDto) => {
          const sku = FindVirtualMachineSku(machineSkus, item);
          const nicQuotaExceeded = checkMachineSkuNicQuotas(item, sku);
          return (
            <TooltipHost content={nicQuotaExceeded || ''}>
              <Label
                style={
                  nicQuotaExceeded
                    ? { color: theme.semanticColors.errorText }
                    : null
                }
              >
                {item.Nics.length}
              </Label>
            </TooltipHost>
          );
        },
        onRenderHeader: (columnProps, defaultRenderer) => {
          return (
            <TooltipHost content={'Network Interfaces'}>
              {defaultRenderer(columnProps)}
            </TooltipHost>
          );
        },
        isPadded: true,
      },
      {
        key: 'osDisks',
        name: 'OS Disk',
        minWidth: 100,
        maxWidth: 160,
        onRender: (item: AzureVirtualMachineForCreationDto, index: number) => {
          const osDiskError = checkMaxOSDiskSizeAllowed(
            machines,
            index,
            userRoleAssignmentConstraint
          );
          const osDiskSizeInGB =
            item.OSDiskSizeInGB === undefined
              ? defaultOSDisk.SizeGB
              : item.OSDiskSizeInGB;

          return (
            <Stack>
              {item.OSVersion !== OSVersion.Windows ? (
                <Text>{`${osDiskSizeInGB} GB`}</Text>
              ) : (
                <TooltipHost content={osDiskError || ''}>
                  <Dropdown
                    id={`machine-${index}-osdisk`}
                    selectedKey={osDiskSizeInGB}
                    options={selectOSDiskOptions(
                      item,
                      userRoleAssignmentConstraint
                    )}
                    ariaLabel='Machine OS Disk in Gigabytes'
                    styles={osDiskError ? errorDropdownStyle : undefined}
                    data-custom-id='Machine OS Disk Dropdown'
                    onChange={(
                      event: React.FormEvent<HTMLDivElement>,
                      option?: IDropdownOption
                    ) =>
                      dispatch(
                        editableWorkspaceUpdateOSDisk(
                          index,
                          option.key as number
                        )
                      )
                    }
                  />
                </TooltipHost>
              )}
            </Stack>
          );
        },
        isPadded: true,
      },
      {
        key: 'dataDisks',
        name: 'Data Disks',
        minWidth: 50,
        maxWidth: 50,
        onRender: (item: AzureVirtualMachineForCreationDto, index: number) => {
          const sku = FindVirtualMachineSku(machineSkus, item);
          const dataDiskQuotaExceeded = checkMachineSkuDataDiskQuotas(
            item,
            sku
          );
          const storageQuotaExceeded = checkMaxMachinesStorageQuota(
            machines,
            index,
            userRoleAssignmentConstraint
          );
          return (
            <TooltipHost
              content={dataDiskQuotaExceeded || storageQuotaExceeded || ''}
            >
              <Label
                style={
                  dataDiskQuotaExceeded || storageQuotaExceeded
                    ? { color: theme.semanticColors.errorText }
                    : null
                }
              >
                {item.DataDisks.length}
              </Label>
            </TooltipHost>
          );
        },
        isPadded: true,
      },
      {
        key: 'edit',
        name: 'Edit',
        minWidth: 35,
        maxWidth: 35,
        isIconOnly: true,
        onRender: (item: AzureVirtualMachineForCreationDto, index: number) => {
          const dataDiskError = dataDiskErrors.find(
            (error) => error.machineIndex === index
          );
          const domainError = domainErrors.find(
            (error) =>
              error.domainID === item.DomainID &&
              item.DomainRole === DomainRoles.DomainController
          );
          return (
            <Stack horizontal horizontalAlign={'end'} verticalAlign={'center'}>
              {(dataDiskError || domainError) && (
                <TooltipHost
                  content='Machine Configuration Errors'
                  id={`${item.ComputerName}-${index}`}
                >
                  <Icon iconName='Error' className={styles.tabError} />
                </TooltipHost>
              )}
              <TooltipHost
                content={
                  item.MachineImageType === MachineImageType.SharedImage
                    ? 'Cannot Edit Template Machines'
                    : 'Edit Machine'
                }
                id={item.ComputerName}
              >
                <IconButton
                  id={`edit-machine-${index}`}
                  iconProps={{ iconName: 'Edit' }}
                  title='Edit'
                  ariaLabel='Edit'
                  disabled={
                    item.MachineImageType === MachineImageType.SharedImage
                  }
                  onClick={() => setEditMachineIndex(index)}
                />
              </TooltipHost>
            </Stack>
          );
        },
      },
    ];
    if (domainControllerFeatureFlag) {
      columns.splice(-1, 0, {
        key: 'domainRole',
        name: 'Domain Role',
        minWidth: 225,
        maxWidth: 250,
        isResizable: true,
        onRender: (item: AzureVirtualMachineForCreationDto) => {
          const domain = FindVirtualMachineDomain(domains, item);
          if (item.DomainRole === DomainRoles.DomainController) {
            return (
              <Text className={styles.listPadding}>{`Domain Controller${
                domain === null ? '' : ` for ${domain.Name}`
              }`}</Text>
            );
          }
          if (item.DomainRole === DomainRoles.DomainMember) {
            return (
              <Text className={styles.listPadding}>{`Domain Member${
                domain === null ? '' : ` of ${domain.Name}`
              }`}</Text>
            );
          }
          if (item.DomainRole === DomainRoles.WorkgroupMember) {
            return (
              <Text className={styles.listPadding}>{'Workgroup Member'}</Text>
            );
          }
          return <div></div>;
        },
        isPadded: true,
      });
    }
    return columns;
  }, [
    machines,
    isNestedVirtualizationEnabled,
    selectMemoryOptions,
    machineSkus,
    userRoleAssignmentConstraint,
    domainControllerFeatureFlag,
    domains,
    dataDiskErrors,
    domainErrors,
    vmNameErrors,
  ]);

  React.useEffect(() => {
    const list = document.getElementsByClassName(machineListId)[0];
    const firstColumnHeader: HTMLElement = list?.querySelector(
      'div[role="columnheader"]'
    );
    firstColumnHeader?.focus();
  }, []);

  return (
    <Stack
      style={{ maxWidth: 1200 }}
      data-custom-parent-group='group1'
      data-custom-parentid={`${workspaceEditType} Workspace - Machine Configuration`}
    >
      <DetailsList
        className={machineListId}
        items={machines}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
        onRenderRow={onRenderRow}
      />
      <MachineConfigurationPanel
        machineIndex={editMachineIndex}
        onDismiss={() => {
          setEditMachineIndex(-1);
          dispatch(dismissNotifications());
        }}
      />
    </Stack>
  );
};
