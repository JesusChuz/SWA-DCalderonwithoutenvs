import * as React from 'react';
import {
  DefaultButton,
  Dropdown,
  IDropdownOption,
  Stack,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminDiagnosticCatalog } from '../../../../../../store/selectors/adminDiagnosticSelectors';
import { DiagnosticDto } from '../../../../../../types/AzureWorkspace/AdminDiagnostics/DiagnosticDto.types';
import { AdminDiagnosticsList } from './AdminDiagnosticsList';
import { AdminDiagnosticsPanel } from './AdminDiagnosticsPanel';
import { AzureVirtualMachineDto } from '../../../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { InfoButton } from 'src/components/GeneralComponents/InfoButton';

/* Diagnostics Class Hierarchy:
Catalog
Categories
ProblemGroups
Problems
Diagnostics
*/

interface IProps {
  machine: AzureVirtualMachineDto;
}

export const AdminDiagnosticsPage = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const diagnosticCatalog = useSelector(getAdminDiagnosticCatalog);
  const [categoryId, setCategoryId] = React.useState(null);
  const [problemGroupId, setProblemGroupId] = React.useState(null);
  const [problemId, setProblemId] = React.useState(null);
  const [openDiagnosticPanel, setOpenDiagnosticPanel] = React.useState(false);

  const categoryDropdownOptions: IDropdownOption[] = React.useMemo(
    () =>
      diagnosticCatalog.Categories.map((category) => ({
        key: category.Id,
        text: category.Name,
      })),
    [diagnosticCatalog]
  );

  const problemGroupDropdownOptions: IDropdownOption[] = React.useMemo(
    () =>
      diagnosticCatalog.Categories.find(
        (category) => category.Id === categoryId
      )?.ProblemGroups.map((problemGroup) => ({
        key: problemGroup.Id,
        text: problemGroup.Name,
      })),
    [categoryId]
  );

  const problemDropdownOptions: IDropdownOption[] = React.useMemo(
    () =>
      diagnosticCatalog.Categories.find(
        (category) => category.Id === categoryId
      )
        ?.ProblemGroups.find(
          (problemGroup) => problemGroup.Id === problemGroupId
        )
        ?.Problems.map((problem) => ({
          key: problem.Id,
          text: problem.Name,
        })),
    [categoryId, problemGroupId]
  );

  const diagnosticList: DiagnosticDto[] = React.useMemo(
    () =>
      diagnosticCatalog.Categories.find(
        (category) => category.Id === categoryId
      )
        ?.ProblemGroups.find(
          (problemGroup) => problemGroup.Id === problemGroupId
        )
        ?.Problems.find((problem) => problem.Id === problemId)?.Diagnostics,
    [categoryId, problemGroupId, problemId]
  );

  return (
    <>
      <Stack tokens={{ childrenGap: 4, padding: 10 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <Dropdown
            label='Problem Category'
            placeholder='Please select a category for your issue.'
            styles={{ dropdown: { width: 330 } }}
            options={categoryDropdownOptions}
            multiSelect={false}
            ariaLabel='Dropdown to select problem category'
            onChange={(
              event: React.SyntheticEvent<HTMLElement>,
              option?: IDropdownOption
            ) => setCategoryId(option.key)}
            onRenderLabel={(props, defaultRenderer) => (
              <Stack horizontal verticalAlign='center'>
                {defaultRenderer(props)}
                <InfoButton
                  buttonId={'infoButton-diagnostics-problem-category'}
                  calloutTitle={'Category'}
                  calloutBody={
                    'Determines what process or aspect of the service is affected (e.g. "Connectivity", "Storage")'
                  }
                />
              </Stack>
            )}
          />
          <Dropdown
            label='Problem Group'
            placeholder='Please select a group under the category.'
            styles={{ dropdown: { width: 330 } }}
            options={categoryId ? problemGroupDropdownOptions : []}
            multiSelect={false}
            ariaLabel='Dropdown to select problem group'
            onChange={(
              event: React.SyntheticEvent<HTMLElement>,
              option?: IDropdownOption
            ) => setProblemGroupId(option.key)}
            disabled={!categoryId}
            onRenderLabel={(props, defaultRenderer) => (
              <Stack horizontal verticalAlign='center'>
                {defaultRenderer(props)}
                <InfoButton
                  buttonId={'infoButton-diagnostics-problem-group'}
                  calloutTitle={'Problem Group'}
                  calloutBody={
                    'Specifies the scope of the issue and affected resource type (e.g. "VM connectivity" vs "External connectivity")'
                  }
                />
              </Stack>
            )}
          />
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 20 }} verticalAlign='end'>
          <Dropdown
            label='Problem'
            placeholder='Please select a problem that identifies the issue.'
            styles={{ dropdown: { width: 450 } }}
            options={problemGroupId ? problemDropdownOptions : []}
            multiSelect={false}
            ariaLabel='Dropdown to select problem option'
            onChange={(
              event: React.SyntheticEvent<HTMLElement>,
              option?: IDropdownOption
            ) => setProblemId(option.key)}
            disabled={!problemGroupId}
            onRenderLabel={(props, defaultRenderer) => (
              <Stack horizontal verticalAlign='center'>
                {defaultRenderer(props)}
                <InfoButton
                  buttonId={'infoButton-diagnostics-problem'}
                  calloutTitle={'Problem'}
                  calloutBody={
                    'Specifies the problem with the affected functionality (e.g. "Can\'t RDP to VM", "VM External port not working")'
                  }
                />
              </Stack>
            )}
          />
          <DefaultButton
            text='View Available Diagnostics'
            disabled={!(categoryId && problemGroupId && problemId)}
            onClick={() => setOpenDiagnosticPanel(true)}
            style={{ minWidth: '150px' }}
          />
        </Stack>
        <AdminDiagnosticsPanel
          adminDiagnostics={diagnosticList}
          open={openDiagnosticPanel}
          setOpen={setOpenDiagnosticPanel}
          machineId={props.machine.ID}
        />
      </Stack>
      <Stack tokens={{ childrenGap: 20 }}>
        {props.machine.ID !== null && (
          <AdminDiagnosticsList machineId={props.machine.ID} />
        )}
      </Stack>
    </>
  );
};
