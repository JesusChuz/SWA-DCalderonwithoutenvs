import React from 'react';
import 'src/shared/test/mocks/matchMedia.mock';
import '@testing-library/jest-dom';
import { defaultTestUserWorkspaces } from 'src/__tests__/data/defaults/defaultTestUserWorkspaces';
import { defaultTestVirtualMachineCustomDto } from 'src/__tests__/data/defaults/defaultTestVirtualMachineCustomDto';
import { defaultTestWorkspaceTemplateDto } from 'src/__tests__/data/defaults/defaultTestWorkspaceTemplateDto';
import { setupTestServer } from 'src/__tests__/utils/serverHelpers';
import { fetchUserWorkspaceSuccessHandler } from 'src/msw/handlers/azureWorkspaceHandlers';
import {
  fetchCatalogMachinesSuccessHandler,
  fetchCatalogTemplatesSuccessHandler,
} from 'src/msw/handlers/catalogHandlers';
import ErrorAction from 'src/store/actions/errorAction';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';
import { MachineSelectionWithCount } from 'src/types/Forms/MachineSelectionWithCount.types';
import {
  renderCustomWorkspaceComponent,
  renderEditWorkspaceComponent,
  renderTemplateWorkspaceComponent,
  setupNewTestCustomWorkspaceState,
  setupNewTestTemplateWorkspaceState,
} from 'src/__tests__/utils/componentHelpers/newWorkspaceTestHelpers';
import userEvent from '@testing-library/user-event';
import { getAllTableRows } from 'src/__tests__/utils/tableHelpers';
import { within, screen, waitFor } from '@testing-library/react';
import {
  initializeTestState,
  initializeTestStore,
} from 'src/__tests__/utils/reduxStoreHelpers';
import {
  CannotUseReservedWord,
  DuplicateNamesNotAllowed,
  RequiredText,
} from 'src/store/validators/ErrorConstants';
import { fetchAzureWorkspaces } from 'src/store/actions';

jest.mock('src/applicationInsights/TelemetryService');
jest.mock('src/authentication/msal');
jest.mock('src/store/actions/errorAction');
(ErrorAction as jest.Mock).mockReturnValue(true);

const customMachineList = defaultTestVirtualMachineCustomDto;
const templateList = defaultTestWorkspaceTemplateDto;
const userWorkspaceList = defaultTestUserWorkspaces;
setupTestServer([
  fetchCatalogMachinesSuccessHandler(customMachineList),
  fetchCatalogTemplatesSuccessHandler(templateList),
  fetchUserWorkspaceSuccessHandler(userWorkspaceList),
]);
const step = NewWorkspaceStep.ConfigureMachines;
const testTemplate = templateList[0];
const [testMachine1, testMachine2] = customMachineList;
const defaultMachineSelection: MachineSelectionWithCount[] = [
  { machine: testMachine1, count: 2 },
  { machine: testMachine2, count: 1 },
];

test('Only machine memory and OS disk size can be edited for a Template Workspace', async () => {
  const user = userEvent.setup();
  const { store } = renderTemplateWorkspaceComponent(step);
  await setupNewTestTemplateWorkspaceState(testTemplate, store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(2);
  const [testVM1, testVM2] = testTemplate.VirtualMachines;
  const [testVM1Row, testVM2Row] = bodyRows;
  // Displays Computer Name under Machine Name header
  const machineNameInput = within(testVM1Row).getByRole('textbox', {
    name: 'Machine Name',
  });
  expect(machineNameInput).toBeDisabled();
  expect(machineNameInput).toHaveValue(testVM1.ComputerName);

  // Displays VM Name under Operating System header
  expect(testVM1Row).toHaveTextContent(testVM1.Name);

  // Displays NIC count under NICs header
  expect(testVM1Row).toHaveTextContent('1');
  // Displays data disk count under Data Disks header
  expect(testVM1Row).toHaveTextContent('3');
  // Displays domain role under Domain Role header
  expect(testVM1Row).toHaveTextContent('Domain Controller for Test Domain');

  // Display Memory in GB under Memory header
  const memoryDropdown = within(testVM1Row).getByRole('combobox', {
    name: 'Machine Memory in Gigabytes',
  });
  await waitFor(() => expect(memoryDropdown).toHaveTextContent('4 GB'));
  expect(memoryDropdown).toBeEnabled();

  // Memory in GB can be modified
  await user.click(memoryDropdown);
  await user.click(screen.getByRole('option', { name: '8 GB' }));
  await waitFor(() => {
    expect(memoryDropdown).toHaveTextContent('8 GB');
  });

  // Display OS Disk size in GB under OS Disk header
  const osDiskDropdown = within(testVM1Row).getByRole('combobox', {
    name: 'Machine OS Disk in Gigabytes',
  });
  expect(osDiskDropdown).toBeEnabled();
  await waitFor(() => {
    expect(osDiskDropdown).toHaveTextContent('128 GB');
  });

  // OS Disk size can be modified
  await user.click(osDiskDropdown);
  await user.click(screen.getByRole('option', { name: '256 GB' }));
  expect(osDiskDropdown).toHaveTextContent('256 GB');

  // Edit button is disabled
  expect(
    within(testVM1Row).getByRole('button', { name: 'Edit' })
  ).toBeDisabled();

  // Displays VM Name 2 under Operating System header
  expect(testVM2Row).toHaveTextContent(testVM2.Name);
  // Displays data disk count of 0 for VM with no disks under Data Disks header
  expect(testVM2Row).toHaveTextContent('0');
  // Displays domain role for Domain Member
  expect(testVM2Row).toHaveTextContent('Domain Member of Test Domain');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Template that is above memory quota can be reduced.', async () => {
  const initialState = initializeTestState();
  initialState.authService.constraint.MaxMachineMemoryAllowedCustom = 4;
  const initialStore = initializeTestStore(initialState);
  const user = userEvent.setup();
  const { store } = renderTemplateWorkspaceComponent(step, {
    store: initialStore,
  });
  await setupNewTestTemplateWorkspaceState(testTemplate, store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(2);
  const testRow = bodyRows[1];

  // Expect Next button to be disabled.
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  // Displays Computer Name under Machine Name header

  // Display Memory in GB under Memory header
  const memoryDropdown = within(testRow).getByRole('combobox', {
    name: 'Machine Memory in Gigabytes',
  });
  expect(memoryDropdown).toBeEnabled();
  await waitFor(() => {
    expect(memoryDropdown).toHaveTextContent('8 GB');
  });

  // Memory in GB can be modified
  await user.click(memoryDropdown);
  await user.click(screen.getByRole('option', { name: '4 GB' }));
  expect(memoryDropdown).toHaveTextContent('4 GB');

  // Expect Next button to be enabled.
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Machine Configuration can be edited for a Custom Workspace', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(3);
  const [testVM1Row] = bodyRows;
  // Displays Computer Name under Machine Name header
  const machineNameInput = within(testVM1Row).getByRole('textbox', {
    name: 'Machine Name',
  });
  expect(machineNameInput).toBeEnabled();
  expect(machineNameInput).toHaveValue('VM0');

  // Machine name can be modified
  await user.clear(machineNameInput);
  await user.type(machineNameInput, 'TestVM0');
  expect(machineNameInput).toHaveValue('TestVM0');

  // Displays VM Name under Operating System header
  expect(testVM1Row).toHaveTextContent(testMachine1.Name);

  // Display Memory in GB under Memory header
  const memoryDropdown = within(testVM1Row).getByRole('combobox', {
    name: 'Machine Memory in Gigabytes',
  });
  expect(memoryDropdown).toHaveTextContent('4 GB');
  expect(memoryDropdown).toBeEnabled();

  // Memory in GB can be modified
  await user.click(memoryDropdown);
  await user.click(screen.getByRole('option', { name: '8 GB' }));
  expect(memoryDropdown).toBeEnabled();
  await waitFor(() => expect(memoryDropdown).toHaveTextContent('8 GB'));

  // Display OS Disk size in GB under OS Disk header
  const osDiskDropdown = within(testVM1Row).getByRole('combobox', {
    name: 'Machine OS Disk in Gigabytes',
  });
  expect(osDiskDropdown).toBeEnabled();
  await waitFor(() => {
    expect(osDiskDropdown).toHaveTextContent('128 GB');
  });

  // OS Disk size can be modified
  await user.click(osDiskDropdown);
  await user.click(screen.getByRole('option', { name: '256 GB' }));
  expect(osDiskDropdown).toHaveTextContent('256 GB');

  // Workgroup member domain role is being displayed
  expect(testVM1Row).toHaveTextContent('Workgroup Member');

  // Edit button is enabled
  expect(
    within(testVM1Row).getByRole('button', { name: 'Edit' })
  ).toBeEnabled();

  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Workspaces cannot have empty, duplicate or invalid machine names', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  const [testVM1Row] = bodyRows;
  // Displays Computer Name under Machine Name header
  const machineNameInput = within(testVM1Row).getByRole('textbox', {
    name: 'Machine Name',
  });
  expect(machineNameInput).toBeEnabled();
  expect(machineNameInput).toHaveValue('VM0');

  // Empty machine name is not allowed
  await user.clear(machineNameInput);
  expect(machineNameInput).toHaveAccessibleDescription(RequiredText);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

  // Duplicate machine name is not allowed
  await user.type(machineNameInput, 'VM1');
  expect(machineNameInput).toHaveAccessibleDescription(
    DuplicateNamesNotAllowed
  );
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

  // Invalid machine name is not allowed
  await user.clear(machineNameInput);
  await user.type(machineNameInput, 'PROXY');
  expect(machineNameInput).toHaveAccessibleDescription(CannotUseReservedWord());
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

  // Valid machine name is allowed
  await user.clear(machineNameInput);
  await user.type(machineNameInput, 'validName');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Workspace memory option cannot be accepted that exceeds quota', async () => {
  const user = userEvent.setup();
  const initialState = initializeTestState();
  initialState.authService.constraint.MaxCumulativeMemoryAllowedCustom = 12;
  const initialStore = initializeTestStore(initialState);
  const { store } = renderCustomWorkspaceComponent(step, {
    store: initialStore,
  });
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  const [testRow1] = bodyRows;
  // Display Memory in GB under Memory header
  const memoryDropdown = within(testRow1).getByRole('combobox', {
    name: 'Machine Memory in Gigabytes',
  });
  expect(memoryDropdown).toBeEnabled();
  await waitFor(() => {
    expect(memoryDropdown).toHaveTextContent('4 GB');
  });

  // Memory in GB cannot be increased past the quota
  await user.click(memoryDropdown);
  expect(screen.getByRole('option', { name: '8 GB' })).toBeDisabled();
  expect(screen.getByRole('option', { name: '16 GB' })).toBeDisabled();
});

test('Post deployment VMs cannot change machine name or decrease OS Disk size', async () => {
  const user = userEvent.setup();
  const testWorkspace = userWorkspaceList[1];
  const initialStore = initializeTestStore();
  await initialStore.dispatch(fetchAzureWorkspaces());
  const { store } = renderEditWorkspaceComponent(step, testWorkspace.ID, {
    store: initialStore,
  });
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  await waitFor(() => {
    expect(bodyRows).toHaveLength(6);
  });
  const testNewVM = testMachine1;
  const testNewVMRow = bodyRows.find((r) =>
    r.textContent.includes(testMachine1.Name)
  );
  const testDeployedVM = testWorkspace.VirtualMachines[0];
  const testDeployedVMRow = bodyRows.find((r) =>
    r.textContent.includes(testDeployedVM.Name)
  );

  // Expect computer name to be disabled for existing VMs
  const machineNameInput2 = within(testDeployedVMRow).getByRole('textbox', {
    name: 'Machine Name',
  });
  expect(machineNameInput2).toBeDisabled();
  expect(machineNameInput2).toHaveValue(testDeployedVM.ComputerName);
  expect(testDeployedVMRow).toHaveTextContent(testDeployedVM.Name);

  // Display OS Disk size in GB under OS Disk header
  const deployedOsDiskDropdown = within(testDeployedVMRow).getByRole(
    'combobox',
    {
      name: 'Machine OS Disk in Gigabytes',
    }
  );
  expect(deployedOsDiskDropdown).toBeEnabled();
  await waitFor(() => {
    expect(deployedOsDiskDropdown).toHaveTextContent('256 GB');
  });

  // OS Disk size cannot be decreased
  await user.click(deployedOsDiskDropdown);
  await user.click(screen.getByRole('option', { name: '128 GB' }));
  expect(deployedOsDiskDropdown).toHaveTextContent('256 GB');

  // OS Disk size can be increased
  await user.click(deployedOsDiskDropdown);
  await user.click(screen.getByRole('option', { name: '512 GB' }));
  expect(deployedOsDiskDropdown).toHaveTextContent('512 GB');

  // OS Disk size can be decreased to previous value
  await user.click(deployedOsDiskDropdown);
  await user.click(screen.getByRole('option', { name: '256 GB' }));
  expect(deployedOsDiskDropdown).toHaveTextContent('256 GB');

  // Expect computer name and edit button to be enabled for new VMs
  const machineNameInput1 = within(testNewVMRow).getByRole('textbox', {
    name: 'Machine Name',
  });
  expect(machineNameInput1).toBeEnabled();
  await user.clear(machineNameInput1);
  await user.type(machineNameInput1, 'TestVM0');
  expect(machineNameInput1).toHaveValue('TestVM0');
  expect(testNewVMRow).toHaveTextContent(testNewVM.Name);
  // Display OS Disk size in GB under OS Disk header
  const newOsDiskDropdown = within(testNewVMRow).getByRole('combobox', {
    name: 'Machine OS Disk in Gigabytes',
  });
  expect(newOsDiskDropdown).toBeEnabled();
  await waitFor(() => {
    expect(newOsDiskDropdown).toHaveTextContent('128 GB');
  });

  // OS Disk size can be increased
  await user.click(newOsDiskDropdown);
  await user.click(screen.getByRole('option', { name: '512 GB' }));
  expect(newOsDiskDropdown).toHaveTextContent('512 GB');

  // OS Disk size can be decreased
  await user.click(newOsDiskDropdown);
  await user.click(screen.getByRole('option', { name: '256 GB' }));
  expect(newOsDiskDropdown).toHaveTextContent('256 GB');

  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

// Specific components in the machine configuration panel should be tested.
test('Machine Configuration Panel opens and closes on Cancel', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(3);
  const [testVM1Row] = bodyRows;
  // Get machine name input value
  const machineNameInput = within(testVM1Row).getByRole('textbox', {
    name: 'Machine Name',
  });
  expect(machineNameInput).toHaveValue('VM0');
  // Open Machine Configuration Panel
  const editButton = within(testVM1Row).getByRole('button', { name: 'Edit' });
  expect(editButton).toBeEnabled();
  await user.click(editButton);
  const machineConfigurationPanel = await screen.findByTitle(
    'Machine Configuration Panel'
  );
  expect(machineConfigurationPanel).toBeInTheDocument();
  const cancelButton = within(machineConfigurationPanel).getByRole('button', {
    name: 'Cancel',
  });
  const saveButton = within(machineConfigurationPanel).getByRole('button', {
    name: 'Save',
  });
  expect(cancelButton).toBeEnabled();
  // This is needed as allowDisabledFocus prevents toBeDisabled from working.
  expect(saveButton).toHaveAttribute('aria-disabled', 'true');
  const panelInput = screen.getByRole('textbox', { name: 'Machine Name' });
  await user.clear(panelInput);
  await user.type(panelInput, 'newVMName');
  expect(panelInput).toHaveValue('newVMName');
  await user.click(cancelButton);
  // Click OK on the dialog that pops up.
  await user.click(await screen.findByRole('button', { name: 'OK' }));
  expect(machineNameInput).toHaveValue('VM0');
});

// Specific components in the machine configuration panel should be tested.
test('Machine Configuration Panel opens and updates on Save', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(3);
  const [testVM1Row] = bodyRows;
  // Get machine name input value
  const machineNameInput = within(testVM1Row).getByRole('textbox', {
    name: 'Machine Name',
  });
  expect(machineNameInput).toHaveValue('VM0');
  // Open Machine Configuration Panel
  const editButton = within(testVM1Row).getByRole('button', { name: 'Edit' });
  expect(editButton).toBeEnabled();
  await user.click(editButton);
  const machineConfigurationPanel = await screen.findByTitle(
    'Machine Configuration Panel'
  );
  expect(machineConfigurationPanel).toBeInTheDocument();
  const cancelButton = within(machineConfigurationPanel).getByRole('button', {
    name: 'Cancel',
  });
  const saveButton = within(machineConfigurationPanel).getByRole('button', {
    name: 'Save',
  });
  expect(cancelButton).toBeEnabled();
  // This is needed as allowDisabledFocus prevents toBeDisabled from working.
  expect(saveButton).toHaveAttribute('aria-disabled', 'true');
  const panelInput = screen.getByRole('textbox', { name: 'Machine Name' });
  await user.clear(panelInput);
  await user.type(panelInput, 'newVMName');
  expect(panelInput).toHaveValue('newVMName');
  await user.click(saveButton);
  expect(machineNameInput).toHaveValue('newVMName');
});
