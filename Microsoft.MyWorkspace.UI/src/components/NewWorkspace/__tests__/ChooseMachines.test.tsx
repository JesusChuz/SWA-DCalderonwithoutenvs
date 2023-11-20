import React from 'react';
import 'src/shared/test/mocks/matchMedia.mock';
import { screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
// We're using our own custom render function and not RTL's render.
import {
  fetchCatalogMachinesErrorHandler,
  fetchCatalogMachinesSuccessHandler,
} from 'src/msw/handlers/catalogHandlers';
import { defaultTestVirtualMachineCustomDto } from 'src/__tests__/data/defaults/defaultTestVirtualMachineCustomDto';
import userEvent from '@testing-library/user-event';
import { OSVersion } from 'src/types/enums/OSVersion';
import { setupTestServer } from 'src/__tests__/utils/serverHelpers';
import {
  initializeTestState,
  initializeTestStore,
} from 'src/__tests__/utils/reduxStoreHelpers';
import { defaultTestUserWorkspaces } from 'src/__tests__/data/defaults/defaultTestUserWorkspaces';
import { fetchUserWorkspaceSuccessHandler } from 'src/msw/handlers/azureWorkspaceHandlers';
import { fetchAzureWorkspaces } from 'src/store/actions';
import ErrorAction from 'src/store/actions/errorAction';
import {
  renderCustomWorkspaceComponent,
  renderEditWorkspaceComponent,
} from 'src/__tests__/utils/componentHelpers/newWorkspaceTestHelpers';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';

jest.mock('src/applicationInsights/TelemetryService');
jest.mock('src/authentication/msal');
jest.mock('src/store/actions/errorAction');
(ErrorAction as jest.Mock).mockReturnValue(true);

const customMachineList = defaultTestVirtualMachineCustomDto;
const userWorkspaceList = defaultTestUserWorkspaces;
const server = setupTestServer([
  fetchCatalogMachinesSuccessHandler(customMachineList),
  fetchUserWorkspaceSuccessHandler(userWorkspaceList),
]);
const step = NewWorkspaceStep.Choose;

test('Next button should be enabled when machine is selected', async () => {
  const user = userEvent.setup();
  renderCustomWorkspaceComponent(step);
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  const machineButton = await screen.findByText('Test Machine');
  await user.click(machineButton);
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Amount of machines should be updated upon selection', async () => {
  const user = userEvent.setup();
  renderCustomWorkspaceComponent(step);
  const testMachineButton = await screen.findByText('Test Machine');
  expect(screen.queryByLabelText('Test Machine')).not.toBeInTheDocument();
  await user.click(testMachineButton);
  expect(await screen.findByLabelText('Test Machine')).toHaveValue('1');
  await user.click(testMachineButton);
  expect(screen.getByLabelText('Test Machine')).toHaveValue('2');
  const customMachine2Button = await screen.findByText('Custom Machine 2');
  expect(screen.queryByLabelText('Custom Machine 2')).not.toBeInTheDocument();
  await user.click(customMachine2Button);
  expect(await screen.findByLabelText('Custom Machine 2')).toHaveValue('1');
  await user.click(customMachine2Button);
  expect(screen.getByLabelText('Custom Machine 2')).toHaveValue('2');
  await user.click(customMachine2Button);
  expect(screen.getByLabelText('Custom Machine 2')).toHaveValue('3');
});

test('Amount of machines can be updated with buttons in Selected Machines cards', async () => {
  const user = userEvent.setup();
  renderCustomWorkspaceComponent(step);
  const testMachineButton = await screen.findByText('Test Machine');
  const testMachineId = 'amount-Test Machine';
  expect(screen.queryByTestId(testMachineId)).not.toBeInTheDocument();
  await user.click(testMachineButton);
  const testMachineInput = await screen.findByTestId(testMachineId);
  expect(testMachineInput).toHaveValue('1');
  await user.click(screen.getByTitle('Add'));
  expect(testMachineInput).toHaveValue('2');
  await user.click(screen.getByTitle('Add'));
  expect(testMachineInput).toHaveValue('3');
  await user.clear(testMachineInput);
  await user.type(testMachineInput, '5');
  expect(testMachineInput).toHaveValue('5');
  await user.click(screen.getByTitle('Subtract'));
  expect(testMachineInput).toHaveValue('4');
  await user.click(screen.getByTitle('Subtract'));
  expect(testMachineInput).toHaveValue('3');
  await user.click(screen.getByTitle('Remove'));
  expect(screen.queryByTestId(testMachineId)).not.toBeInTheDocument();
});

test('Amount of machines cannot be added above quotas', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  const maxMachineConstraint =
    store.getState().authService.constraint
      .MaxMachinesPerWorkspaceAllowedCustom;
  const testMachineButton = await screen.findByText('Test Machine');
  expect(screen.queryByLabelText('Test Machine')).not.toBeInTheDocument();
  const testMachineId = 'amount-Test Machine';
  expect(screen.queryByTestId(testMachineId)).not.toBeInTheDocument();
  await user.click(testMachineButton);
  const testMachineInput = await screen.findByTestId(testMachineId);
  expect(testMachineInput).toHaveValue('1');
  await user.clear(testMachineInput);
  await user.type(testMachineInput, maxMachineConstraint.toString());
  expect(testMachineInput).toHaveValue(maxMachineConstraint.toString());
  await user.click(screen.getByTitle('Add'));
  expect(testMachineInput).toHaveValue(maxMachineConstraint.toString());
  await user.type(testMachineInput, '0');
  expect(testMachineInput).toHaveValue(maxMachineConstraint.toString());
});

test('Machines can be filtered by name', async () => {
  const user = userEvent.setup();
  renderCustomWorkspaceComponent(step);
  const machineNames = customMachineList.map((m) => m.Name);
  for (const name of machineNames) {
    await screen.findByText(name);
  }
  const filterInput = screen.getByPlaceholderText('Filter By Name');
  const firstFilterValue = 'Custom Machine';
  await user.type(filterInput, firstFilterValue);
  expect(screen.queryByText('Test Machine')).not.toBeInTheDocument();
  expect(screen.getAllByText(firstFilterValue, { exact: false })).toHaveLength(
    3
  );
  const secondFilterValue = 'Test';
  await user.clear(filterInput);
  await user.type(filterInput, secondFilterValue);
  expect(
    screen.queryByText('Custom Machine', { exact: false })
  ).not.toBeInTheDocument();
  screen.getByText(secondFilterValue, { exact: false });
  const thirdFilterValue = 'abcd';
  await user.clear(filterInput);
  await user.type(filterInput, thirdFilterValue);
  screen.getByText('No Machines Found');
  for (const name of machineNames) {
    expect(screen.queryByText(name)).not.toBeInTheDocument();
  }
});

test('Enabling nested virtualization filters the machine list.', async () => {
  const user = userEvent.setup();
  renderCustomWorkspaceComponent(step);
  const nestedVirtualizationCheckbox = await screen.findByLabelText(
    'Nested Virtualization'
  );
  expect(nestedVirtualizationCheckbox).not.toBeChecked();
  await user.click(nestedVirtualizationCheckbox);
  expect(nestedVirtualizationCheckbox).toBeChecked();
  const validVMs = customMachineList.filter(
    (m) => m.CanSupportVirtualization && m.OSVersion != OSVersion.Linux
  );
  const invalidVMs = customMachineList.filter(
    (m) => !(m.CanSupportVirtualization && m.OSVersion != OSVersion.Linux)
  );
  for (const vm of validVMs) {
    screen.getByText(vm.Name);
  }
  for (const vm of invalidVMs) {
    expect(screen.queryByText(vm.Name)).not.toBeInTheDocument();
  }
});

test('Machines can be sorted by name.', async () => {
  const user = userEvent.setup();
  const machineNames = customMachineList.map((m) => m.Name);
  renderCustomWorkspaceComponent(step);
  const sortedMachines = await screen.findAllByTestId(/^machine-select-button/);
  const sortedMachineNames = [...machineNames].sort((a, b) =>
    a.localeCompare(b)
  );
  sortedMachines.forEach((machine, i) => {
    expect(machine).toHaveTextContent(new RegExp(`${sortedMachineNames[i]}$`));
  });
  await user.click(screen.getByText('Machine Name'));
  const reverseSortedMachines = screen.getAllByTestId(/^machine-select-button/);
  const reverseSortedMachineNames = [...machineNames].sort((a, b) =>
    b.localeCompare(a)
  );
  reverseSortedMachines.forEach((machine, i) => {
    expect(machine).toHaveTextContent(
      new RegExp(`${reverseSortedMachineNames[i]}$`)
    );
  });
});

test('"No Machines Found" message displays when machine fetch API call fails', async () => {
  server.use(fetchCatalogMachinesErrorHandler());
  renderCustomWorkspaceComponent(step);
  expect(await screen.findByText('No Machines Found')).toBeInTheDocument();
});

test('"Disabled feature" message displays when custom feature flag is disabled', async () => {
  const defaultStoreState = initializeTestState();
  defaultStoreState.config.featureFlags.CustomDeploymentFeature = false;
  renderCustomWorkspaceComponent(step, { preloadedState: defaultStoreState });
  expect(
    await screen.findByText('This feature is currently disabled.')
  ).toBeInTheDocument();
});

test('Message displays when workspaces count quota is exceeded.', async () => {
  const defaultStoreState = initializeTestState();
  defaultStoreState.authService.constraint.MaxAzureWorkspacesAllowed = 4;
  const store = initializeTestStore(defaultStoreState);
  await store.dispatch(fetchAzureWorkspaces());
  renderCustomWorkspaceComponent(step, { store });
  expect(screen.getByText('Workspace Quota Exceeded')).toBeInTheDocument();
});

// Nested workspace quota message is not implemented yet.
test.todo('Message displays when nested workspace count is exceeded.');

test('Machines for existing workspace are displayed in Edit Workspace view', async () => {
  const user = userEvent.setup();
  const store = initializeTestStore();
  await store.dispatch(fetchAzureWorkspaces());
  const testWorkspace = userWorkspaceList[1];
  renderEditWorkspaceComponent(step, testWorkspace.ID, { store });
  testWorkspace.VirtualMachines.forEach((machine) => {
    screen.getByText(`${machine.ComputerName} - ${machine.Name}`);
  });
  const testVM = testWorkspace.VirtualMachines[1];
  const configuredMachineComponent = screen.getByTestId(
    `currently-configured-machine-${testVM.ComputerName}`
  );
  await user.click(within(configuredMachineComponent).getByTitle('Remove'));
  expect(
    screen.queryByText(`${testVM.ComputerName} - ${testVM.Name}`)
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Reset Changes' }));
  expect(
    screen.getByText(`${testVM.ComputerName} - ${testVM.Name}`)
  ).toBeInTheDocument();
});
