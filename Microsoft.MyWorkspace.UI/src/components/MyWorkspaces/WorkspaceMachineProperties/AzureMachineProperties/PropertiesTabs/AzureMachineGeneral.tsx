import * as React from 'react';
import {
  Dropdown,
  IDropdownOption,
  Stack,
  TextField,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getCatalogMachineSkus,
  getCatalogUserProfile,
} from '../../../../../store/selectors/catalogSelectors';
import { WorkspaceEditType } from '../../../../../types/enums/WorkspaceEditType';
import {
  getEditableWorkspace,
  getEditableWorkspaceEditType,
  getEditableWorkspaceIsNestedVirtualizationEnabled,
  getEditableWorkspaceOriginalWorkspace,
  getEditableWorkspaceVMNameErrors,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceUpdateMemoryGB,
  editableWorkspaceUpdateVMName,
} from '../../../../../store/actions/editableWorkspaceActions';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import { styles } from './AzureMachinePropertyTab.styles';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getUserRoleAssignmentConstraint } from '../../../../../store/selectors';
import {
  getErrorDropdownStyle,
  selectMemoryOptions,
} from '../../../../NewWorkspace/Steps/MachineConfigurationList.utils';
import { checkMaxMemoryQuota } from '../../../../../store/validators/quotaValidators';
import { AzureVirtualMachineDto } from 'src/types/AzureWorkspace/AzureVirtualMachineDto.types';

interface IProps {
  machineIndex: number;
}

export const AzureMachineGeneral = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const errorDropdownStyle = getErrorDropdownStyle(theme);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const originalWorkspace = useSelector(getEditableWorkspaceOriginalWorkspace);
  const allVmNameErrors = useSelector(getEditableWorkspaceVMNameErrors);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const machineSkus = useSelector(getCatalogMachineSkus);
  const userProfile = useSelector(getCatalogUserProfile);
  const userRoleAssignmentConstraint = useSelector(
    getUserRoleAssignmentConstraint
  );
  const isNestedVirtualizationEnabled = useSelector(
    getEditableWorkspaceIsNestedVirtualizationEnabled
  );
  const machines = React.useMemo(() => {
    return editableWorkspace.VirtualMachines;
  }, [editableWorkspace.VirtualMachines, workspaceEditType]);

  const memoryError = checkMaxMemoryQuota(
    machines,
    props.machineIndex,
    userRoleAssignmentConstraint
  );

  const vmNameErrors = React.useMemo(() => {
    return allVmNameErrors.filter(
      (vmName) => vmName.machineIndex === props.machineIndex
    );
  }, [allVmNameErrors, props.machineIndex]);

  return (
    <Stack className={styles.propertiesContent}>
      <Stack
        horizontal
        tokens={{
          childrenGap: 10,
          padding: 10,
        }}
      >
        <TextField
          label='Machine Name'
          maxLength={15}
          value={machines[props.machineIndex].ComputerName}
          placeholder={'Machine Name'}
          disabled={
            EditsDisabled(
              userProfile,
              editableWorkspace as AzureWorkspaceDto,
              originalWorkspace as AzureWorkspaceDto
            ) ||
            (workspaceEditType === WorkspaceEditType.EditWorkspace &&
              !!(machines[props.machineIndex] as AzureVirtualMachineDto)?.ID)
          }
          onChange={(e, v) =>
            dispatch(editableWorkspaceUpdateVMName(props.machineIndex, v))
          }
          required
          errorMessage={
            vmNameErrors.length === 0 ? '' : vmNameErrors[0].message
          }
        />
        <TooltipHost content={memoryError || ''}>
          <Dropdown
            id={`Machine-Memory-${props.machineIndex}`}
            label='Memory (GB)'
            selectedKey={machines[props.machineIndex].MemoryGB}
            options={selectMemoryOptions(
              machines[props.machineIndex],
              machines,
              machineSkus,
              userRoleAssignmentConstraint,
              isNestedVirtualizationEnabled
            )}
            style={{ maxWidth: '75px' }}
            styles={memoryError ? errorDropdownStyle : undefined}
            disabled={
              workspaceEditType === WorkspaceEditType.EditWorkspace
                ? EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto
                  )
                : false
            }
            onChange={(
              event: React.FormEvent<HTMLDivElement>,
              option?: IDropdownOption
            ) =>
              dispatch(
                editableWorkspaceUpdateMemoryGB(
                  props.machineIndex,
                  option.key as number
                )
              )
            }
          />
        </TooltipHost>
      </Stack>
    </Stack>
  );
};
