import * as React from 'react';

import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import {
  Stack,
  Label,
  TextField,
  TooltipHost,
  IconButton,
  IIconProps,
  ITextFieldStyles,
  useTheme,
} from '@fluentui/react';
import { VirtualMachineCustomDto } from '../../../../types/Catalog/VirtualMachineCustomDto.types';
import { useDispatch, useSelector } from 'react-redux';
import { getEditableWorkspaceErrors } from '../../../../store/selectors/editableWorkspaceSelectors';
import {
  editableWorkspaceAddMachine,
  editableWorkspaceAddMachines,
  editableWorkspaceRemoveMachine,
  editableWorkspaceRemoveMachines,
} from '../../../../store/actions/editableWorkspaceActions';

interface IProps {
  virtualMachine: VirtualMachineCustomDto;
  count: number;
}

export function SelectedMachineView(props: IProps): JSX.Element {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const narrowTextFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: 50 },
  };
  const addIcon: IIconProps = { iconName: 'AddTo' };
  const subtractIcon: IIconProps = { iconName: 'Blocked2' };
  const RemoveIcon: IIconProps = { iconName: 'Delete' };
  const errors = useSelector(getEditableWorkspaceErrors);

  return (
    <div data-testid={props.virtualMachine.Name}>
      <Label htmlFor={`amount-${props.virtualMachine.ImageSourceID}`}>
        {props.virtualMachine.Name}
      </Label>
      <Stack horizontal className={`${commonStyles.fullWidth}`}>
        <Label style={{ marginLeft: '10px', marginRight: '10px' }}>Qty</Label>
        <TooltipHost content='Amount'>
          <TextField
            id={`amount-${props.virtualMachine.ImageSourceID}`}
            data-testid={`amount-${props.virtualMachine.Name}`}
            value={props.count.toString()}
            onChange={(event, newValue) =>
              dispatch(
                editableWorkspaceAddMachines(
                  props.virtualMachine,
                  parseInt(newValue.trim() == '' ? '0' : newValue)
                )
              )
            }
            errorMessage={errors.machineAmount}
            styles={narrowTextFieldStyles}
          />
        </TooltipHost>
        <TooltipHost content='Add'>
          <IconButton
            id={`${props.virtualMachine.Name}-add`}
            iconProps={addIcon}
            title='Add'
            ariaLabel='Add'
            onClick={() =>
              dispatch(editableWorkspaceAddMachine(props.virtualMachine))
            }
          />
        </TooltipHost>
        <TooltipHost content='Subtract'>
          <IconButton
            iconProps={subtractIcon}
            title='Subtract'
            ariaLabel='Subtract'
            onClick={() =>
              dispatch(editableWorkspaceRemoveMachine(props.virtualMachine))
            }
          />
        </TooltipHost>
        <TooltipHost content='Remove'>
          <IconButton
            iconProps={RemoveIcon}
            title='Remove'
            ariaLabel='Remove'
            onClick={() =>
              dispatch(editableWorkspaceRemoveMachines(props.virtualMachine))
            }
          />
        </TooltipHost>
      </Stack>
      <hr />
    </div>
  );
}
