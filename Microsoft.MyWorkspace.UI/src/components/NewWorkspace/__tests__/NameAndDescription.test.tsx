import React from 'react';
import 'src/shared/test/mocks/matchMedia.mock';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// We're using our own custom render function and not RTL's render.
import {
  fetchCatalogMachinesSuccessHandler,
  fetchCatalogTemplatesSuccessHandler,
} from 'src/msw/handlers/catalogHandlers';
import { defaultTestVirtualMachineCustomDto } from 'src/__tests__/data/defaults/defaultTestVirtualMachineCustomDto';
import userEvent from '@testing-library/user-event';
import { setupTestServer } from 'src/__tests__/utils/serverHelpers';
import { initializeTestStore } from 'src/__tests__/utils/reduxStoreHelpers';
import { defaultTestUserWorkspaces } from 'src/__tests__/data/defaults/defaultTestUserWorkspaces';
import { fetchUserWorkspaceSuccessHandler } from 'src/msw/handlers/azureWorkspaceHandlers';
import ErrorAction from 'src/store/actions/errorAction';
import {
  renderCustomWorkspaceComponent,
  renderEditWorkspaceComponent,
  renderTemplateWorkspaceComponent,
  setupNewTestCustomWorkspaceState,
  setupNewTestTemplateWorkspaceState,
} from 'src/__tests__/utils/componentHelpers/newWorkspaceTestHelpers';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';
import { defaultTestWorkspaceTemplateDto } from 'src/__tests__/data/defaults/defaultTestWorkspaceTemplateDto';
import { MachineSelectionWithCount } from 'src/types/Forms/MachineSelectionWithCount.types';
import { fetchAzureWorkspaces } from 'src/store/actions';
import {
  AdministratorNameIsInvalid,
  AdministratorNameRange,
} from 'src/store/validators/ErrorConstants';

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
const step = NewWorkspaceStep.NameAndDescription;
const testTemplate = templateList[1];
const [testMachine1, testMachine2] = customMachineList;
const defaultMachineSelection: MachineSelectionWithCount[] = [
  { machine: testMachine1, count: 2 },
  { machine: testMachine2, count: 1 },
];

test('Only name and description fields are displayed for New Template Workspace', async () => {
  const { store } = renderTemplateWorkspaceComponent(step);
  await setupNewTestTemplateWorkspaceState(testTemplate, store);
  expect(
    screen.getByRole('tab', { name: /4. Name and Description/ })
  ).toHaveAttribute('aria-selected', 'true');
  // Workspace Name field has the template name by default.
  const workspaceNameInput = screen.getByLabelText('Workspace Name');
  expect(workspaceNameInput).toHaveValue('Test Template 2');
  expect(workspaceNameInput).toBeEnabled();

  // Workspace Description field has template description by default.
  const descriptionInput = screen.getByLabelText('Description');
  expect(descriptionInput).toHaveValue('This is a test description 2');
  expect(descriptionInput).toBeEnabled();

  // Administrator Name field is not displayed.
  expect(screen.queryByLabelText('Administrator Name')).not.toBeInTheDocument();
});

test('Administrator Name fields is disabled for Edit Workspace', async () => {
  const testWorkspace = userWorkspaceList[1];
  const store = initializeTestStore();
  await store.dispatch(fetchAzureWorkspaces());
  renderEditWorkspaceComponent(step, testWorkspace.ID, { store });

  // Workspace Name field has the workspace name by default.
  const workspaceNameInput = screen.getByLabelText('Workspace Name');
  expect(workspaceNameInput).toHaveValue('Test Workspace 2');
  expect(workspaceNameInput).toBeEnabled();

  // Workspace Name field has workspace description by default.
  const descriptionInput = screen.getByLabelText('Description');
  expect(descriptionInput).toHaveValue('Test Workspace 2 Description');
  expect(descriptionInput).toBeEnabled();

  // Workspace Name field has administrator name by default, and cannot be changed.
  const adminNameInput = screen.getByLabelText('Administrator Name');
  expect(adminNameInput).toHaveValue('testName2');
  expect(adminNameInput).toBeDisabled();
  expect(adminNameInput).toHaveAccessibleDescription(
    'Because this Workspace has been deployed, changes to the administrator name cannot be made.'
  );
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Name, description and Administrator Name fields are displayed for New Custom Workspace', async () => {
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState(defaultMachineSelection, store);
  expect(
    screen.getByRole('tab', { name: /4. Name and Description/ })
  ).toHaveAttribute('aria-selected', 'true');
  const workspaceNameInput = screen.getByLabelText('Workspace Name');
  expect(workspaceNameInput).toHaveValue('New Workspace');
  expect(workspaceNameInput).toBeEnabled();
  const descriptionInput = screen.getByLabelText('Description');
  expect(descriptionInput).toHaveValue('');
  expect(descriptionInput).toBeEnabled();

  // Administrator name field is empty by default.
  const adminNameInput = screen.getByLabelText('Administrator Name');
  expect(adminNameInput).toHaveValue('');
  expect(adminNameInput).toBeEnabled();

  // Next button is disabled by default.
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
});

test('Name and description fields can be modified.', async () => {
  const user = userEvent.setup();
  const { store } = renderTemplateWorkspaceComponent(step);
  await setupNewTestTemplateWorkspaceState(testTemplate, store);

  // Name field should have the template name by default.
  const workspaceNameInput = screen.getByLabelText('Workspace Name');
  expect(workspaceNameInput).toHaveValue('Test Template 2');
  expect(workspaceNameInput).toBeEnabled();

  // Empty name field should be invalid.
  await user.clear(workspaceNameInput);
  expect(workspaceNameInput).toHaveValue('');
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

  // Typing a valid name should make the button enabled.
  await user.type(workspaceNameInput, 'New Workspace Name');
  expect(workspaceNameInput).toHaveValue('New Workspace Name');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

  // Description field should have the template description by default.
  const descriptionInput = screen.getByLabelText('Description');
  expect(descriptionInput).toHaveValue('This is a test description 2');
  expect(descriptionInput).toBeEnabled();

  // Empty description field should still be valid.
  await user.clear(descriptionInput);
  expect(descriptionInput).toHaveValue('');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

  await user.type(descriptionInput, 'This is a sample description');
  expect(descriptionInput).toHaveValue('This is a sample description');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Administrator Name field can be modified.', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState(defaultMachineSelection, store);
  const adminNameInput = screen.getByLabelText('Administrator Name');
  expect(adminNameInput).toBeEnabled();
  expect(adminNameInput).toHaveValue('');
  await user.clear(adminNameInput);
  await user.type(adminNameInput, 'validName');
  expect(adminNameInput).toHaveValue('validName');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Administrator Name field cannot be empty or invalid.', async () => {
  const user = userEvent.setup();
  const { store } = renderCustomWorkspaceComponent(step);
  await setupNewTestCustomWorkspaceState(defaultMachineSelection, store);
  const adminNameInput = screen.getByLabelText('Administrator Name');
  expect(adminNameInput).toBeEnabled();
  expect(adminNameInput).toHaveValue('');

  // Administrator Name field cannot be 'admin'
  await user.type(adminNameInput, 'admin');
  expect(adminNameInput).toHaveAccessibleDescription(
    new RegExp(`${AdministratorNameIsInvalid('admin')}`)
  );
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

  // Empty Name field should be invalid.
  await user.clear(adminNameInput);
  expect(adminNameInput).toHaveAccessibleDescription(
    new RegExp(AdministratorNameRange)
  );

  // Administrator Name field cannot have invalid character.
  await user.type(adminNameInput, 'invalid Name');
  expect(adminNameInput).toHaveAccessibleDescription(
    new RegExp(
      'Administrator name cannot contain spaces or the following characters:'
    )
  );
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

  // Valid name enabled the next button.
  await user.clear(adminNameInput);
  await user.type(adminNameInput, 'validName');
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});
