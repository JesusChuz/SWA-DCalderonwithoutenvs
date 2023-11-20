import React from 'react';
import 'src/shared/test/mocks/matchMedia.mock';
import { screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  fetchCatalogTemplatesErrorHandler,
  fetchCatalogTemplatesSuccessHandler,
} from 'src/msw/handlers/catalogHandlers';
import { defaultTestWorkspaceTemplateDto } from 'src/__tests__/data/defaults/defaultTestWorkspaceTemplateDto';
import userEvent from '@testing-library/user-event';
import { fetchUserWorkspaceSuccessHandler } from 'src/msw/handlers/azureWorkspaceHandlers';
import { defaultTestUserWorkspaces } from 'src/__tests__/data/defaults/defaultTestUserWorkspaces';
import { fetchAzureWorkspaces } from 'src/store/actions';
import ErrorAction from 'src/store/actions/errorAction';
import { renderTemplateWorkspaceComponent } from 'src/__tests__/utils/componentHelpers/newWorkspaceTestHelpers';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';
import {
  initializeTestState,
  initializeTestStore,
} from 'src/__tests__/utils/reduxStoreHelpers';
import { setupTestServer } from 'src/__tests__/utils/serverHelpers';
import {
  getAllTableGridCells,
  getAllTableRows,
} from 'src/__tests__/utils/tableHelpers';

jest.mock('src/applicationInsights/TelemetryService');
jest.mock('src/authentication/msal');
jest.mock('src/store/actions/errorAction');
(ErrorAction as jest.Mock).mockReturnValue(true);

const templateList = defaultTestWorkspaceTemplateDto;
const server = setupTestServer([
  fetchCatalogTemplatesSuccessHandler(templateList),
  fetchUserWorkspaceSuccessHandler(defaultTestUserWorkspaces),
]);
const step = NewWorkspaceStep.Choose;

test('Next button should be enabled when template is selected', async () => {
  const user = userEvent.setup();
  renderTemplateWorkspaceComponent(step);

  // Next button should be disabled when no template is selected.
  expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();

  // Next button should be enabled when a template is selected.
  await user.click(await screen.findByText('Test Template 3'));
  expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
});

test('Templates can be filtered by name', async () => {
  const user = userEvent.setup();
  renderTemplateWorkspaceComponent(step);

  // All templates should be displayed on the screen.
  const templateNames = templateList.map((m) => m.Name);
  for (const name of templateNames) {
    await screen.findByText(name);
  }

  // Filtering should remove templates that do not match the filter value.
  const filterInput = screen.getByPlaceholderText('Filter By Name');
  const firstFilterValue = 'Test Template';
  await user.type(filterInput, 'Test Template');
  expect(screen.queryByText('Test Machine')).not.toBeInTheDocument();
  expect(
    screen.queryAllByText(firstFilterValue, { exact: false })
  ).toHaveLength(3);

  // Filtering should remove templates that do not match the filter value.
  const secondFilterValue = 'Another';
  await user.clear(filterInput);
  await user.type(filterInput, secondFilterValue);
  expect(
    screen.queryByText('Test Template', { exact: false })
  ).not.toBeInTheDocument();
  screen.getByText(secondFilterValue, { exact: false });

  // Filtering should remove all templates if none not match the filter value.
  const thirdFilterValue = 'abcd';
  await user.clear(filterInput);
  await user.type(filterInput, thirdFilterValue);
  for (const name of templateNames) {
    expect(screen.queryByText(name)).not.toBeInTheDocument();
  }
});

test('Selected template details view should display template information', async () => {
  const user = userEvent.setup();
  renderTemplateWorkspaceComponent(step);
  expect(screen.getByText('No Template Selected')).toBeInTheDocument();

  // Template details view should display template information.
  const testTemplate = templateList[1];
  const templateName = await screen.findByText(testTemplate.Name);
  await user.click(templateName);
  await user.click(screen.getByRole('button', { name: 'View Details' }));
  const detailsPanel = await screen.findByTitle('Template Details Panel');
  within(detailsPanel).getByText('Template Details');
  expect(
    within(detailsPanel).getByRole('tab', { name: 'General' })
  ).toHaveAttribute('aria-selected', 'true');
  expect(within(detailsPanel).getByText(testTemplate.Name)).toBeInTheDocument();
  expect(
    within(detailsPanel).getByText(testTemplate.AuthorEmail)
  ).toBeInTheDocument();
  expect(
    within(detailsPanel).getByText(testTemplate.TotalSuccessfulDeployments)
  ).toBeInTheDocument();
  expect(
    within(detailsPanel).getByText(testTemplate.Description)
  ).toBeInTheDocument();
  await user.click(screen.getByTitle('close panel'));
});

test('Template details panel should display template information in general tab', async () => {
  const user = userEvent.setup();
  renderTemplateWorkspaceComponent(step);
  expect(screen.getByText('No Template Selected')).toBeInTheDocument();
  const testTemplate = templateList[1];
  const templateName = await screen.findByText(testTemplate.Name);
  await user.click(templateName);
  await user.click(screen.getByRole('button', { name: 'View Details' }));
  const detailsPanel = await screen.findByTitle('Template Details Panel');
  await within(detailsPanel).findByText('Template Details');
  expect(
    await within(detailsPanel).findByRole('tab', { name: 'General' })
  ).toHaveAttribute('aria-selected', 'true');
  expect(within(detailsPanel).getByText(testTemplate.Name)).toBeInTheDocument();
  expect(
    within(detailsPanel).getByText(testTemplate.AuthorEmail)
  ).toBeInTheDocument();
  expect(
    within(detailsPanel).getByText(testTemplate.TotalSuccessfulDeployments)
  ).toBeInTheDocument();
  expect(
    within(detailsPanel).getByText(testTemplate.Description)
  ).toBeInTheDocument();
  await user.click(screen.getByTitle('close panel'));
});

test('Template details panel should display template machines list in machine tab', async () => {
  const user = userEvent.setup();
  renderTemplateWorkspaceComponent(step);
  expect(screen.getByText('No Template Selected')).toBeInTheDocument();
  const template = templateList[1];
  const templateName = await screen.findByText(template.Name);
  await user.click(templateName);
  await user.click(screen.getByRole('button', { name: 'View Details' }));
  const detailsPanel = await screen.findByTitle('Template Details Panel');
  await within(detailsPanel).findByText('Template Details');
  const machineTab = await within(detailsPanel).findByRole('tab', {
    name: 'Machines',
  });
  await user.click(machineTab);
  expect(machineTab).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByTestId('template-machines-list')).toBeInTheDocument();
  getAllTableRows(detailsPanel);
  const [, ...bodyRows] = getAllTableRows(detailsPanel);
  const testVM = template.VirtualMachines[1];
  const [
    computerNameCell,
    nameCell,
    memoryCell,
    osDiskCell,
    dataDiskCell,
    maxDataDiskCell,
  ] = getAllTableGridCells(bodyRows[1]);
  expect(computerNameCell).toHaveTextContent(testVM.ComputerName);
  expect(nameCell).toHaveTextContent(testVM.Name);
  expect(memoryCell).toHaveTextContent('8 GB');
  expect(osDiskCell).toHaveTextContent('256 GB');
  expect(dataDiskCell).toHaveTextContent('0');
  expect(maxDataDiskCell).toHaveTextContent('-');
  await user.click(screen.getByTitle('close panel'));
});

test('Messages display for templates that exceed quotas', async () => {
  const user = userEvent.setup();
  const defaultStoreState = initializeTestState();
  defaultStoreState.authService.constraint.MaxCumulativeStorageAllowedCustom = 7;
  const store = initializeTestStore(defaultStoreState);
  await store.dispatch(fetchAzureWorkspaces());
  renderTemplateWorkspaceComponent(step, { store });
  const testTemplateRow = await screen.findByRole('row', {
    name: /Test Template 1/,
  });
  await user.click(testTemplateRow);
  expect(
    within(testTemplateRow).getByText(
      /This template cannot be deployed as it exceeds quota constraints./
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Details' }));
  await screen.findByText(
    'This template cannot be used as it exceeds the cumulative machine storage quota.'
  );
});

test('Message displays when template fetch API call fails', async () => {
  server.use(fetchCatalogTemplatesErrorHandler());
  renderTemplateWorkspaceComponent(step);
  expect(await screen.findByText('No Templates Found')).toBeInTheDocument();
});

test('Message displays when workspaces count quota is exceeded.', async () => {
  const defaultStoreState = initializeTestState();
  defaultStoreState.authService.constraint.MaxAzureWorkspacesAllowed = 4;
  const store = initializeTestStore(defaultStoreState);
  await store.dispatch(fetchAzureWorkspaces());
  renderTemplateWorkspaceComponent(step, { store });
  expect(screen.getByText('Workspace Quota Exceeded')).toBeInTheDocument();
});
