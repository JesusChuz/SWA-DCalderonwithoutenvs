import userEvent from '@testing-library/user-event';
import 'src/shared/test/mocks/matchMedia.mock';
import '@testing-library/jest-dom';
import { defaultTestUserWorkspaces } from 'src/__tests__/data/defaults/defaultTestUserWorkspaces';
import { defaultTestVirtualMachineCustomDto } from 'src/__tests__/data/defaults/defaultTestVirtualMachineCustomDto';
import { defaultTestWorkspaceTemplateDto } from 'src/__tests__/data/defaults/defaultTestWorkspaceTemplateDto';
import {
  renderCustomWorkspaceComponent,
  renderTemplateWorkspaceComponent,
  setupNewTestCustomWorkspaceState,
  setupNewTestTemplateWorkspaceState,
} from 'src/__tests__/utils/componentHelpers/newWorkspaceTestHelpers';
import { setupTestServer } from 'src/__tests__/utils/serverHelpers';
import { fetchUserWorkspaceSuccessHandler } from 'src/msw/handlers/azureWorkspaceHandlers';
import {
  fetchCatalogMachinesSuccessHandler,
  fetchCatalogTemplatesSuccessHandler,
} from 'src/msw/handlers/catalogHandlers';
import ErrorAction from 'src/store/actions/errorAction';
import { screen, within } from '@testing-library/react';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';
import {
  NetworkNameMinLengthError,
  NetworkNameMustEndWithWordCharacter,
  NetworkNameMustOnlyContain,
  NetworkNameMustStartWithWordCharacter,
  NetworkNameRequired,
} from 'src/store/validators/ErrorConstants';
import { MachineSelectionWithCount } from 'src/types/Forms/MachineSelectionWithCount.types';
import { getAllTableRows } from 'src/__tests__/utils/tableHelpers';

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
const step = NewWorkspaceStep.ConfigureNetworks;
const testTemplate = templateList[1];
const [testMachine1, testMachine2] = customMachineList;
const defaultMachineSelection: MachineSelectionWithCount[] = [
  { machine: testMachine1, count: 2 },
  { machine: testMachine2, count: 1 },
];

test('Subnets cannot be configured for a template workspace.', async () => {
  const { store } = renderTemplateWorkspaceComponent(step);
  await setupNewTestTemplateWorkspaceState({ ...testTemplate }, store);

  // Network tab should be selected.
  expect(
    await screen.findByRole('tab', { name: /2. Network Overview/ })
  ).toHaveAttribute('aria-selected', 'true');

  // Add Network button should not be displayed.
  expect(
    screen.queryByRole('button', { name: 'Add Network' })
  ).not.toBeInTheDocument();

  // All items in the table should be disabled.
  const [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows[0]).toHaveTextContent(/subnet1/);
  const subnetRoutableCheckbox = within(bodyRows[0]).getByRole('checkbox');
  const subnetDeleteButton = within(bodyRows[0]).getByRole('button', {
    name: 'delete network',
  });
  expect(subnetRoutableCheckbox).toBeChecked();
  expect(subnetRoutableCheckbox).toBeDisabled();
  expect(subnetDeleteButton).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Subnets can be configured for a custom workspace.', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);

  // Network tab should be selected.
  expect(
    screen.getByRole('tab', { name: /2. Configure Networks/ })
  ).toHaveAttribute('aria-selected', 'true');
  const [, ...bodyRows] = getAllTableRows(document.body);
  const subnetNameInput = within(bodyRows[0]).getByDisplayValue('subnet1');
  expect(subnetNameInput).toBeEnabled();
  const subnetRoutableCheckbox = within(bodyRows[0]).getByRole('checkbox');
  const subnetDeleteButton = within(bodyRows[0]).getByRole('button', {
    name: 'delete network',
  });
  expect(subnetDeleteButton).toBeDisabled();

  // Confirm subnet name can be changed.
  await user.clear(subnetNameInput);
  await user.type(subnetNameInput, 'newSubnetName');
  expect(subnetNameInput).toHaveValue('newSubnetName');

  // Confirm subnet checkbox can be toggled.
  expect(subnetRoutableCheckbox).toBeChecked();
  expect(subnetRoutableCheckbox).toBeEnabled();
  await user.click(subnetRoutableCheckbox);
  expect(subnetRoutableCheckbox).not.toBeChecked();
  await user.click(subnetRoutableCheckbox);
  expect(subnetRoutableCheckbox).toBeChecked();

  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Subnets can be added and removed for a custom workspace.', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  let [, ...bodyRows] = getAllTableRows(document.body);
  within(bodyRows[0]).getByDisplayValue('subnet1');
  // eslint-disable-next-line jest-dom/prefer-in-document
  expect(bodyRows).toHaveLength(1);

  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

  // Add two subnets
  const addNetworkButton = screen.getByRole('button', { name: 'Add Network' });
  await user.click(addNetworkButton);
  await user.click(addNetworkButton);
  [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(3);
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

  // Remove one subnet
  const testRow = bodyRows[1];
  expect(within(testRow).getByDisplayValue('subnet2')).toBeInTheDocument();
  const subnetDeleteButton = within(testRow).getByRole('button', {
    name: 'delete network',
  });
  expect(subnetDeleteButton).toBeEnabled();
  await user.click(subnetDeleteButton);
  [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(2);
  expect(screen.queryByDisplayValue('subnet2')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('No more than 8 subnets can be added for a custom workspace', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  let [, ...bodyRows] = getAllTableRows(document.body);
  // eslint-disable-next-line jest-dom/prefer-in-document
  expect(bodyRows).toHaveLength(1);

  // After adding 8 subnets, the Add Network button should be disabled.
  const addNetworkButton = screen.getByRole('button', { name: 'Add Network' });
  for (let i = 0; i < 8; i++) {
    await user.click(addNetworkButton);
  }
  expect(addNetworkButton).toBeDisabled();
  [, ...bodyRows] = getAllTableRows(document.body);
  expect(bodyRows).toHaveLength(8);
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test("Subnets can't have empty or invalid names.", async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const addNetworkButton = screen.getByRole('button', { name: 'Add Network' });
  await user.click(addNetworkButton);
  await user.click(addNetworkButton);
  const subnet2Input = screen.getByDisplayValue('subnet2');
  await user.clear(subnet2Input);
  expect(subnet2Input).toHaveAccessibleDescription(NetworkNameRequired);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  await user.clear(subnet2Input);
  await user.type(subnet2Input, 'a');
  expect(subnet2Input).toHaveAccessibleDescription(NetworkNameMinLengthError);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  await user.clear(subnet2Input);
  await user.type(subnet2Input, 'invalidN@me');
  expect(subnet2Input).toHaveAccessibleDescription(NetworkNameMustOnlyContain);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  await user.clear(subnet2Input);
  await user.type(subnet2Input, 'invalidName-');
  expect(subnet2Input).toHaveAccessibleDescription(
    NetworkNameMustEndWithWordCharacter
  );
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  await user.clear(subnet2Input);
  await user.type(subnet2Input, '-invalidName');
  expect(subnet2Input).toHaveAccessibleDescription(
    NetworkNameMustStartWithWordCharacter
  );
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  await user.clear(subnet2Input);
  await user.type(
    subnet2Input,
    'extraLongNameThatIsNotValidForASubnetNameExtraLongNameThatIsNotValidForASubnetName'
  );
  expect(
    screen.getByDisplayValue(
      'extraLongNameThatIsNotValidForASubnetNameExtraLongNameThatIsNotValidForASubnetNa'
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  await user.clear(subnet2Input);
  await user.type(subnet2Input, 'valid_Name');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test("Subnets can't have duplicate names.", async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState([...defaultMachineSelection], store);
  const addNetworkButton = screen.getByRole('button', { name: 'Add Network' });
  await user.click(addNetworkButton);
  await user.click(addNetworkButton);
  const subnet2Input = screen.getByDisplayValue('subnet2');
  const subnet3Input = screen.getByDisplayValue('subnet3');
  expect(subnet3Input).toBeInTheDocument();
  await user.clear(subnet2Input);
  await user.type(subnet2Input, 'subnet3');
  expect(
    await screen.findByText('Duplicate names not allowed.')
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
});
