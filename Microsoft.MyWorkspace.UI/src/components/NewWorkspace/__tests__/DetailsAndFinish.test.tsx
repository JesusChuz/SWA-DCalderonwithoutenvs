import React from 'react';
import 'src/shared/test/mocks/matchMedia.mock';
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
// We're using our own custom render function and not RTL's render.
import {
  fetchCatalogMachinesSuccessHandler,
  fetchCatalogTemplatesSuccessHandler,
} from 'src/msw/handlers/catalogHandlers';
import { defaultTestVirtualMachineCustomDto } from 'src/__tests__/data/defaults/defaultTestVirtualMachineCustomDto';
import { setupTestServer } from 'src/__tests__/utils/serverHelpers';
import { initializeTestStore } from 'src/__tests__/utils/reduxStoreHelpers';
import { defaultTestUserWorkspaces } from 'src/__tests__/data/defaults/defaultTestUserWorkspaces';
import {
  fetchUserWorkspaceSuccessHandler,
  updateUserWorkspaceSuccessHandler,
} from 'src/msw/handlers/azureWorkspaceHandlers';
import { fetchAzureWorkspaces } from 'src/store/actions';
import ErrorAction from 'src/store/actions/errorAction';
import {
  renderTemplateWorkspaceComponent,
  renderEditWorkspaceComponent,
  setupNewTestTemplateWorkspaceState,
} from 'src/__tests__/utils/componentHelpers/newWorkspaceTestHelpers';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';
import { defaultTestWorkspaceTemplateDto } from 'src/__tests__/data/defaults/defaultTestWorkspaceTemplateDto';
import { defaultTestGeographies } from 'src/__tests__/data/defaults/defaultTestGeographies';
import userEvent from '@testing-library/user-event';
import { editableWorkspaceUpdateName } from 'src/store/actions/editableWorkspaceActions';

jest.mock('src/applicationInsights/TelemetryService');
jest.mock('src/authentication/msal');
jest.mock('src/store/actions/errorAction');
(ErrorAction as jest.Mock).mockReturnValue(true);

const customMachineList = defaultTestVirtualMachineCustomDto;
const templateList = defaultTestWorkspaceTemplateDto;
const userWorkspaceList = defaultTestUserWorkspaces;
const geographyList = defaultTestGeographies;
const server = setupTestServer([
  fetchCatalogMachinesSuccessHandler(customMachineList),
  fetchCatalogTemplatesSuccessHandler(templateList),
  fetchUserWorkspaceSuccessHandler(userWorkspaceList),
  updateUserWorkspaceSuccessHandler(),
]);
const step = NewWorkspaceStep.DetailsAndFinish;
const testTemplate = templateList[1];

test('Name and description are displayed for New Workspace', async () => {
  const { store } = renderTemplateWorkspaceComponent(step);
  await setupNewTestTemplateWorkspaceState(testTemplate, store);
  expect(screen.getByText('Please review your workspace')).toBeInTheDocument();
  expect(screen.getByText('Test Template 2')).toBeInTheDocument();
  expect(screen.getByText('This is a test description 2')).toBeInTheDocument();
});

test('Azure Geography can be selected in dropdown for New Workspace', async () => {
  const user = userEvent.setup();
  const { store } = renderTemplateWorkspaceComponent(step);
  await setupNewTestTemplateWorkspaceState(testTemplate, store);

  // Expect all options to be showing on page load.
  const dropdownOptions = screen.getAllByRole('option');
  expect(dropdownOptions).toHaveLength(geographyList.length);
  dropdownOptions.forEach((option, i) => {
    expect(option).toHaveTextContent(geographyList[i].Name);
  });

  // Select any item to remove the dropdown options.
  await user.click(screen.getByText('New Workspace from Template'));
  const geographyDropdown = screen.getByRole('combobox');
  expect(geographyDropdown).toHaveTextContent('Select an option');
  expect(screen.getByRole('button', { name: /Deploy!/ })).toBeDisabled();

  // Select a geography and expect the dropdown to be updated.
  const selectedOption = geographyList[1];
  await user.click(geographyDropdown);
  await user.click(screen.getByRole('option', { name: selectedOption.Name }));
  expect(geographyDropdown).toHaveTextContent(selectedOption.Name);
  expect(screen.getByRole('button', { name: /Deploy!/ })).toBeEnabled();
});

test('Name and description are displayed for Edit Workspace Workspace', async () => {
  const testWorkspace = userWorkspaceList[1];
  const store = initializeTestStore();
  await store.dispatch(fetchAzureWorkspaces());
  renderEditWorkspaceComponent(step, testWorkspace.ID, { store });
  expect(screen.getByText('Please review your workspace')).toBeInTheDocument();
  expect(screen.getByText(testWorkspace.Name)).toBeInTheDocument();
  expect(screen.getByText(testWorkspace.Description)).toBeInTheDocument();

  // Save button is disabled since there are no workspace changes.
  expect(screen.getByRole('button', { name: /Reset Changes/ })).toBeDisabled();
  // Strange behavior here, probably due to allowDisabledFocus
  expect(screen.getByRole('button', { name: /Save/ })).toHaveAttribute(
    'aria-disabled',
    'true'
  );
});

test('Save button is enabled in Edit Workspace if workspace has changes', async () => {
  const testWorkspace = userWorkspaceList[1];
  const initialStore = initializeTestStore();
  await initialStore.dispatch(fetchAzureWorkspaces());
  const { store } = renderEditWorkspaceComponent(step, testWorkspace.ID, {
    store: initialStore,
  });

  // Change workspace name.
  store.dispatch(editableWorkspaceUpdateName('New Workspace Name'));

  // Save button is enabled since there are workspace changes.
  expect(screen.getByRole('button', { name: /Reset Changes/ })).toBeEnabled();
  expect(screen.getByRole('button', { name: /Save/ })).toBeEnabled();

  // This is needed as allowDisabledFocus prevents toBeDisabled from working.
  expect(screen.getByRole('button', { name: /Save/ })).not.toHaveAttribute(
    'aria-disabled',
    'true'
  );
});
