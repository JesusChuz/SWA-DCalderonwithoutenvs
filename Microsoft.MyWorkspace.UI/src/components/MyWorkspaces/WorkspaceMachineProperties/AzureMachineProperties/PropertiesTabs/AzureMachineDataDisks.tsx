import * as React from 'react';
import {
  Announced,
  CommandBarButton,
  DetailsList,
  DetailsListLayoutMode,
  Dropdown,
  IColumn,
  IDropdownOption,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  SelectionMode,
  SpinButton,
  Stack,
  Text,
  TextField,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import { AzureDataDiskDto } from '../../../../../types/AzureWorkspace/AzureDataDiskDto.types';
import { WorkspaceEditType } from '../../../../../types/enums/WorkspaceEditType';
import {
  getEditableWorkspace,
  getEditableWorkspaceDataDiskErrors,
  getEditableWorkspaceEditType,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { DataDiskErrorTypes } from '../../../../../types/enums/DataDiskErrorTypes';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { AzureStorageType } from '../../../../../types/AzureWorkspace/enums/AzureStorageType';
import { AzureDataDiskForCreationDto } from '../../../../../types/ResourceCreation/AzureDataDiskForCreationDto.types';
import {
  MAX_DISK_SIZE_GB,
  MIN_DISK_SIZE_GB,
} from '../../../../../shared/Constants';
import {
  getCatalogMachineSkus,
  getCatalogUserProfile,
  getUserRoleAssignmentConstraint,
} from '../../../../../store/selectors';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import { styles } from './AzureMachinePropertyTab.styles';
import {
  checkMaxDataDisksAreAtQuota,
  checkMaxOSDiskSizeAllowed,
} from '../../../../../store/validators/quotaValidators';
import { Default_AzureOSDiskDto } from '../../../../../data/Default_AzureOSDiskDto';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  editableWorkspaceAddDataDisk,
  editableWorkspaceRemoveDataDisk,
  editableWorkspaceUpdateDataDisk,
  editableWorkspaceUpdateOSDisk,
} from '../../../../../store/actions/editableWorkspaceActions';
import {
  selectOSDiskOptions,
  errorDropdownStyle,
} from '../../../../NewWorkspace/Steps/MachineConfigurationList.utils';
import { InfoButton } from '../../../../GeneralComponents/InfoButton';
import { OSVersion } from '../../../../../types/enums/OSVersion';
import { AzureVirtualMachineDto } from 'src/types/AzureWorkspace/AzureVirtualMachineDto.types';
import { ResourceState } from 'src/types/AzureWorkspace/enums/ResourceState';

interface IProps {
  machineIndex: number;
}

export const AzureMachineDataDisks = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const dataDiskErrors = useSelector(getEditableWorkspaceDataDiskErrors);
  const userProfile = useSelector(getCatalogUserProfile);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const originalWorkspace = useSelector(getEditableWorkspaceOriginalWorkspace);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const constraint = useSelector(getUserRoleAssignmentConstraint);
  const skus = useSelector(getCatalogMachineSkus);
  const defaultOSDisk = { ...Default_AzureOSDiskDto };
  const infoButtonId = 'osDiskInfoButton';

  const machines = React.useMemo(() => {
    return editableWorkspace.VirtualMachines;
  }, [editableWorkspace.VirtualMachines, workspaceEditType]);

  const storageTypeOptions: IDropdownOption[] = Object.entries(AzureStorageType)
    .slice(Object.values(AzureStorageType).length / 2)
    .map((v) => {
      return { key: v[1], text: v[0] };
    });

  const getNumericPart = (value: string): number | undefined => {
    const valueRegex = /^(\d+(\.\d+)?).*/;
    if (valueRegex.test(value)) {
      const numericValue = Number(value.replace(valueRegex, '$1'));
      return isNaN(numericValue) ? undefined : numericValue;
    }
    return undefined;
  };

  const dataDiskColumns: IColumn[] = [
    {
      key: 'column1',
      name: 'Disk Name',
      ariaLabel: 'Disk Name',
      fieldName: 'Name',
      minWidth: 100,
      maxWidth: 250,
      onRender: (
        disk: AzureDataDiskForCreationDto | AzureDataDiskDto,
        index: number
      ) => {
        const error = dataDiskErrors.find(
          (error) =>
            error.machineIndex === props.machineIndex &&
            error.diskIndex === index &&
            error.type === DataDiskErrorTypes.nameError
        );
        const errorMessage = error === undefined ? '' : error.message;
        return (
          <TextField
            ariaLabel='Disk name'
            required
            maxLength={50}
            className={commonStyles.width80}
            onChange={(
              event: React.SyntheticEvent<HTMLElement>,
              newValue?: string
            ) =>
              dispatch(
                editableWorkspaceUpdateDataDisk(
                  props.machineIndex,
                  index,
                  'Name',
                  newValue
                )
              )
            }
            value={disk.Name}
            disabled={
              workspaceEditType === WorkspaceEditType.EditWorkspace
                ? EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto
                  )
                : false
            }
            errorMessage={errorMessage}
          />
        );
      },
    },
    {
      key: 'column2',
      name: 'Size (GB)',
      fieldName: 'SizeGB',
      ariaLabel: 'Disk Size in gigabytes',
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (
        disk: AzureDataDiskForCreationDto | AzureDataDiskDto,
        index: number
      ) => {
        return (
          <SpinButton
            disabled={
              workspaceEditType === WorkspaceEditType.EditWorkspace
                ? EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto
                  )
                : false
            }
            inputProps={{
              'aria-label': 'Disk Size in gigabytes',
            }}
            value={`${disk.SizeGB} GB`}
            min={1}
            max={32767}
            step={1}
            className={commonStyles.width33}
            onIncrement={(value: string): string | void => {
              const numericValue = getNumericPart(value);
              if (numericValue !== undefined) {
                const val = Math.min(numericValue + 1, MAX_DISK_SIZE_GB);
                dispatch(
                  editableWorkspaceUpdateDataDisk(
                    props.machineIndex,
                    index,
                    'SizeGB',
                    val
                  )
                );
                return `${val} GB`;
              }
            }}
            onDecrement={(value: string): string | void => {
              const numericValue = getNumericPart(value);
              if (numericValue !== undefined) {
                const val = Math.max(numericValue - 1, MIN_DISK_SIZE_GB);
                dispatch(
                  editableWorkspaceUpdateDataDisk(
                    props.machineIndex,
                    index,
                    'SizeGB',
                    val
                  )
                );
                return `${val} GB`;
              }
            }}
            onValidate={(value: string): string | void => {
              let numericValue = getNumericPart(value);
              if (numericValue !== undefined) {
                numericValue = Math.min(numericValue, MAX_DISK_SIZE_GB);
                numericValue = Math.max(numericValue, MIN_DISK_SIZE_GB);
                dispatch(
                  editableWorkspaceUpdateDataDisk(
                    props.machineIndex,
                    index,
                    'SizeGB',
                    numericValue
                  )
                );
                return `${numericValue} GB`;
              }
            }}
            incrementButtonAriaLabel='Increase value by 1'
            decrementButtonAriaLabel='Decrease value by 1'
          />
        );
      },
    },
    {
      key: 'column3',
      name: 'Description',
      fieldName: 'Description',
      minWidth: 80,
      maxWidth: 250,
      isResizable: true,
      isPadded: true,
      onRender: (
        disk: AzureDataDiskForCreationDto | AzureDataDiskDto,
        index: number
      ) => {
        return (
          <TextField
            ariaLabel='Disk Description'
            disabled={
              workspaceEditType === WorkspaceEditType.EditWorkspace
                ? EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto
                  )
                : false
            }
            maxLength={100}
            resizable={false}
            className={commonStyles.fullWidth}
            onChange={(
              event: React.SyntheticEvent<HTMLElement>,
              newValue?: string
            ) =>
              dispatch(
                editableWorkspaceUpdateDataDisk(
                  props.machineIndex,
                  index,
                  'Description',
                  newValue
                )
              )
            }
            value={disk.Description}
          />
        );
      },
    },
    {
      key: 'column4',
      name: 'Storage Type',
      fieldName: 'StorageType',
      minWidth: 125,
      maxWidth: 150,
      isResizable: true,
      isPadded: true,
      onRender: (
        disk: AzureDataDiskForCreationDto | AzureDataDiskDto,
        index: number
      ) => {
        return (
          <Dropdown
            disabled={
              workspaceEditType === WorkspaceEditType.EditWorkspace
                ? EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto
                  )
                : false
            }
            ariaLabel={'Storage Type'}
            selectedKey={
              storageTypeOptions.find(
                (v) => (v.key as AzureStorageType) === disk.StorageType
              ).key
            }
            options={storageTypeOptions}
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              option?: IDropdownOption
            ) =>
              dispatch(
                editableWorkspaceUpdateDataDisk(
                  props.machineIndex,
                  index,
                  'StorageType',
                  option.key as AzureStorageType
                )
              )
            }
          />
        );
      },
    },
    {
      key: 'column5',
      name: '',
      minWidth: 25,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: (disk: AzureDataDiskForCreationDto | AzureDataDiskDto) => {
        return (
          <CommandBarButton
            disabled={
              workspaceEditType === WorkspaceEditType.EditWorkspace
                ? EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto
                  )
                : false
            }
            ariaLabel='delete data disk'
            iconProps={{
              iconName: 'Delete',
            }}
            className={commonStyles.transparentBackground}
            style={{ height: '100%', float: 'right' }}
            onClick={() =>
              dispatch(
                editableWorkspaceRemoveDataDisk(props.machineIndex, disk.Lun)
              )
            }
          />
        );
      },
    },
  ];

  const dataDisksAtQuotaMessage = checkMaxDataDisksAreAtQuota(
    machines[props.machineIndex],
    constraint,
    skus.find((sku) => sku.Name === machines[props.machineIndex].Sku)
  );

  const osDiskMemoryMessage = `Note: The OS Disk has ${defaultOSDisk.SizeGB} GB of storage`;

  const addDataDiskButtonDisabled =
    (workspaceEditType === WorkspaceEditType.EditWorkspace
      ? EditsDisabled(
          userProfile,
          editableWorkspace as AzureWorkspaceDto,
          originalWorkspace as AzureWorkspaceDto
        )
      : false) || !!dataDisksAtQuotaMessage;

  const osDiskError = checkMaxOSDiskSizeAllowed(
    machines,
    props.machineIndex,
    constraint
  );

  const osDiskSizeInGB =
    machines[props.machineIndex].OSDiskSizeInGB === undefined
      ? defaultOSDisk.SizeGB
      : machines[props.machineIndex].OSDiskSizeInGB;

  const createdVM = machines[props.machineIndex] as AzureVirtualMachineDto;
  const isVmRunning = createdVM.State === ResourceState.Running;
  const renderMessageBar = () => {
    return isVmRunning ? (
      <MessageBar messageBarType={MessageBarType.info}>
        {'OS Disk Size cannot be updated while VM is running'}
      </MessageBar>
    ) : (
      <></>
    );
  };

  return (
    <Stack className={styles.propertiesContent} style={{ paddingTop: '10px' }}>
      {props.machineIndex !== -1 && (
        <>
          {renderMessageBar()}
          <h3>
            {'OS Disk'}
            <InfoButton
              buttonId={infoButtonId}
              calloutTitle={'Expand the disk volume in the OS'}
              calloutBody={
                <>
                  <Text>
                    Changing OS size is currently available for Windows machines
                    only. Follow the steps below to expand the disk volume and
                    take advantage of the new disk size.
                  </Text>
                  <Text>
                    <ul>
                      <li>RDP to the VM.</li>
                      <li>
                        Open PowerShell as Administrator and run the following
                        script:
                      </li>
                      <ul>
                        <code>
                          $driveLetter = &quot;[Drive Letter]&quot; $size =
                          (Get-PartitionSupportedSize -DriveLetter $driveLetter)
                          Resize-Partition ` -DriveLetter $driveLetter ` -Size
                          $size.SizeMax
                        </code>
                      </ul>
                    </ul>
                  </Text>
                  <Text>
                    <a
                      href='https://learn.microsoft.com/en-us/azure/virtual-machines/windows/tutorial-manage-data-disk#expand-the-disk-volume-in-the-os'
                      target='_blank'
                      rel='noreferrer'
                    >
                      More info.
                    </a>
                  </Text>
                </>
              }
            />
          </h3>
          <Stack>
            {machines[props.machineIndex].OSVersion !== OSVersion.Windows ? (
              <Text>{`Size (GB): ${osDiskSizeInGB}`}</Text>
            ) : (
              <Stack.Item className={commonStyles.width25}>
                <TooltipHost content={osDiskError || ''}>
                  <Dropdown
                    id={`machine-${props.machineIndex}-osdisk`}
                    selectedKey={osDiskSizeInGB}
                    options={selectOSDiskOptions(
                      machines[props.machineIndex],
                      constraint
                    )}
                    disabled={
                      workspaceEditType === WorkspaceEditType.EditWorkspace
                        ? isVmRunning ||
                          EditsDisabled(
                            userProfile,
                            editableWorkspace as AzureWorkspaceDto,
                            originalWorkspace as AzureWorkspaceDto
                          )
                        : false
                    }
                    ariaLabel='Machine OS Disk in Gigabytes'
                    styles={osDiskError ? errorDropdownStyle : undefined}
                    data-custom-id='Machine OS Disk Dropdown'
                    onChange={(
                      event: React.FormEvent<HTMLDivElement>,
                      option?: IDropdownOption
                    ) =>
                      dispatch(
                        editableWorkspaceUpdateOSDisk(
                          props.machineIndex,
                          option.key as number
                        )
                      )
                    }
                  />
                </TooltipHost>
              </Stack.Item>
            )}
            <Text>
              {`Storage Type: ${
                storageTypeOptions.find(
                  (v) =>
                    (v.key as AzureStorageType) === defaultOSDisk.StorageType
                ).text
              }
            `}
            </Text>
          </Stack>

          <Stack style={{ paddingTop: '10px' }}>
            <Stack
              horizontal
              horizontalAlign='space-between'
              verticalAlign='center'
            >
              <h3>{'Data Disks'}</h3>
              <div>
                <TooltipHost
                  content={
                    dataDisksAtQuotaMessage ||
                    (workspaceEditType !== WorkspaceEditType.EditWorkspace
                      ? osDiskMemoryMessage
                      : '')
                  }
                  id={'azure-machine-data-disk-tooltip'}
                >
                  <PrimaryButton
                    iconProps={{ iconName: 'Add' }}
                    text='Add Data Disk'
                    onClick={() => {
                      dispatch(
                        editableWorkspaceAddDataDisk(props.machineIndex)
                      );
                    }}
                    role='button'
                    ariaLabel={'Add Data Disk'}
                    allowDisabledFocus={true}
                    disabled={addDataDiskButtonDisabled}
                    aria-describedby={'azure-machine-data-disk-tooltip'}
                  />
                  <Announced
                    message={
                      addDataDiskButtonDisabled
                        ? 'Add Data Disk button unavailable'
                        : ''
                    }
                  />
                </TooltipHost>
              </div>
            </Stack>
            {machines[props.machineIndex].DataDisks.length === 0 ? (
              <Text style={{ marginTop: '20px' }} nowrap block>
                {'No Data Disks'}
              </Text>
            ) : (
              <DetailsList
                columns={dataDiskColumns}
                items={machines[props.machineIndex].DataDisks}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
};
