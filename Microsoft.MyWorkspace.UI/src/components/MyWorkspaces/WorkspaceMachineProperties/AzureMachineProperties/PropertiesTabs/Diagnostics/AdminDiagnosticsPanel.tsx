import * as React from 'react';
import {
  ITheme,
  useTheme,
  List,
  Text,
  DefaultButton,
  Panel,
  PanelType,
  Stack,
} from '@fluentui/react';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { DiagnosticDto } from '../../../../../../types/AzureWorkspace/AdminDiagnostics/DiagnosticDto.types';
import { getEditableWorkspace } from '../../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentDiagnostic,
  runSelectedAdminDiagnostic,
} from '../../../../../../store/actions';
import { getDiagnosticStyles } from './AdminDiagnostics.styles';

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  adminDiagnostics: DiagnosticDto[];
  machineId: string;
}

// side panel to view list of new diagnostics to run
export const AdminDiagnosticsPanel = (props: IProps): JSX.Element => {
  const theme: ITheme = useTheme();
  const styles = getDiagnosticStyles(theme);

  const dispatch = useDispatch();
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;

  const runDiagnostic = async (diagnosticId: string) => {
    dispatch(
      runSelectedAdminDiagnostic(
        diagnosticId,
        editableWorkspace.ID,
        props.machineId
      )
    );
    props.setOpen(false);
    dispatch(fetchCurrentDiagnostic(props.machineId));
  };

  const onRenderCell = (item: DiagnosticDto): JSX.Element => {
    return (
      <div className={styles.itemCell} data-is-focusable={true}>
        <Stack className={styles.itemContent} verticalAlign='center' horizontal>
          <div className={styles.itemName}>{item.Name} </div>
          <DefaultButton
            text='Run Diagnostic'
            onClick={() => runDiagnostic(item.Id)}
          />
        </Stack>
      </div>
    );
  };

  return (
    <div>
      <Panel
        isOpen={props.open}
        onDismiss={() => {
          props.setOpen(false);
        }}
        closeButtonAriaLabel='Close'
        customWidth={'500px'}
        type={PanelType.custom}
        isLightDismiss
      >
        <Text variant='xLarge'>Available Diagnostics</Text>
        <FocusZone direction={FocusZoneDirection.vertical}>
          <div className={styles.container} data-is-scrollable>
            <List items={props.adminDiagnostics} onRenderCell={onRenderCell} />
          </div>
        </FocusZone>
      </Panel>
    </div>
  );
};
