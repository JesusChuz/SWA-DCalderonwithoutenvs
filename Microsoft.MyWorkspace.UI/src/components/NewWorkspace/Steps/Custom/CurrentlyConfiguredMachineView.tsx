import * as React from 'react';

import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  Stack,
  TooltipHost,
  IconButton,
  IIconProps,
  Text,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AzureVirtualMachineDto } from '../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { AzureVirtualMachineForCreationDto } from '../../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import { editableWorkspaceRemoveConfiguredMachine } from '../../../../store/actions/editableWorkspaceActions';
import { DomainRoles } from '../../../../types/AzureWorkspace/enums/DomainRoles';
import {
  getEditableWorkspace,
  getEditableWorkspaceEditType,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import { validateDomainControllerRoleHasMembers } from '../../../../store/validators/workspaceValidators';
import { showUserConfirmationDialog } from '../../../../store/actions';

interface IProps {
  virtualMachine: AzureVirtualMachineDto | AzureVirtualMachineForCreationDto;
  index: number;
}

export function CurrentlyConfiguredMachineView(props: IProps): JSX.Element {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const RemoveIcon: IIconProps = { iconName: 'Delete' };
  const editableWorkspace = useSelector(getEditableWorkspace);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const machines = React.useMemo(() => {
    return editableWorkspace.VirtualMachines;
  }, [editableWorkspace.VirtualMachines, workspaceEditType]);

  return (
    <Stack>
      <Stack
        horizontal
        verticalAlign='center'
        horizontalAlign='space-between'
        className={`${commonStyles.fullWidth}`}
        data-testid={`currently-configured-machine-${props.virtualMachine.ComputerName}`}
      >
        <Stack>
          <Text>{`${props.virtualMachine.ComputerName} - ${props.virtualMachine.Name}`}</Text>
        </Stack>

        <Stack>
          <TooltipHost content='Remove'>
            <IconButton
              iconProps={RemoveIcon}
              title='Remove'
              ariaLabel='Remove'
              onClick={() => {
                const callback = () => {
                  dispatch(
                    editableWorkspaceRemoveConfiguredMachine(props.index)
                  );
                };
                if (
                  props.virtualMachine.DomainRole ===
                    DomainRoles.DomainController &&
                  validateDomainControllerRoleHasMembers(
                    machines,
                    props.virtualMachine.DomainID
                  )
                ) {
                  dispatch(
                    showUserConfirmationDialog(
                      'Do you want to proceed?',
                      'This will result in all current domain members in this domain being switched to Workgroup.',
                      callback
                    )
                  );
                  return;
                }
                callback();
              }}
            />
          </TooltipHost>
        </Stack>
      </Stack>
    </Stack>
  );
}
