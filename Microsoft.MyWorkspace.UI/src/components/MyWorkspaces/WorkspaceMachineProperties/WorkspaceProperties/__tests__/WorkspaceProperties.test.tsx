import React from 'react';
import 'src/shared/test/mocks/matchMedia.mock';
import { screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
// We're using our own custom render function and not RTL's render.
import { renderWithProviders } from 'src/__tests__/utils/testRenderer';
import userEvent from '@testing-library/user-event';
import { WorkspaceMachineProperties } from '../../WorkspaceMachineProperties';
import { fetchUserWorkspaceSuccessHandler } from 'src/msw/handlers/azureWorkspaceHandlers';
import { v4 as uuid } from 'uuid';
import { defaultTestUserWorkspaces } from 'src/__tests__/data/defaults/defaultTestUserWorkspaces';
import { fetchAzureWorkspaces } from 'src/store/actions';
import { Route } from 'react-router';
import { ResourceState } from 'src/types/AzureWorkspace/enums/ResourceState';
import { setupTestServer } from 'src/__tests__/utils/serverHelpers';
import { initializeTestStore } from 'src/__tests__/utils/reduxStoreHelpers';

jest.mock('src/applicationInsights/TelemetryService');
jest.mock('src/authentication/msal');

const workspaceList = defaultTestUserWorkspaces;
const server = setupTestServer([
  fetchUserWorkspaceSuccessHandler(workspaceList),
]);

test.skip('Error displays when workspace is not found.', async () => {
  const user = userEvent.setup();
  const store = initializeTestStore();
  await store.dispatch(fetchAzureWorkspaces());
  renderWithProviders(
    <Route exact path='/:id'>
      <WorkspaceMachineProperties />
    </Route>,
    {
      route: `/${uuid()}`,
      store,
    }
  );
  expect(await screen.findByText('Workspace not found.')).toBeInTheDocument();
});
test.skip('Workspace metadata is displayed in Workspace Properties header.', async () => {
  const store = initializeTestStore();
  await store.dispatch(fetchAzureWorkspaces());
  const testWorkspace = workspaceList[1];
  renderWithProviders(
    <Route exact path='/:id'>
      <WorkspaceMachineProperties />
    </Route>,
    {
      route: `/${testWorkspace.ID}`,
      store,
    }
  );
  const headerElement = screen.getByTestId('workspacePropertiesHeader');
  expect(
    within(headerElement).getByText((content, element) => {
      return (
        element.className.startsWith('workspaceMachineTitle') &&
        content === testWorkspace.Name
      );
    })
  ).toBeInTheDocument();
  screen.getByText('Aug 6, 2023');
  screen.getByText(testWorkspace.Location);
  within(headerElement).getByText('Stopped');
});
test.todo(
  'Nested workspace metadata is displayed in Workspace Properties header.'
);
test.todo(
  'Deletion indicator displays Deletion Pending when at JIT activation quota.'
);
test.todo(
  'Deletion indicator displays time to deletion when it is before JIT activation quota.'
);
test.skip('Shutdown indicator displays Expired when workspace is at end run time.', async () => {
  const newWorkspaceList = [...workspaceList];
  newWorkspaceList[1] = {
    ...newWorkspaceList[1],
    EndRunTime: new Date().toISOString(),
    State: ResourceState.Running,
  };
  server.use(fetchUserWorkspaceSuccessHandler(newWorkspaceList));
  const store = initializeTestStore();
  await store.dispatch(fetchAzureWorkspaces());
  const testWorkspace = workspaceList[1];
  renderWithProviders(
    <Route exact path='/:id'>
      <WorkspaceMachineProperties />
    </Route>,
    {
      route: `/${testWorkspace.ID}`,
      store,
    }
  );
  expect(screen.getByText('Expired')).toBeInTheDocument();
});
test.todo(
  'Shutdown indicator displays time to shutdown when workspace is not at end run time.'
);
test.todo(
  'Workspace with Off Status displays appropriate buttons in Command Bar.'
);
test.todo(
  'Workspace with Running Status displays appropriate buttons in Command Bar.'
);
test.todo(
  'Workspace with Transitioning Status displays appropriate buttons in Command Bar.'
);
test.todo(
  'Workspace with Failed Status displays appropriate buttons in Command Bar.'
);
test.todo('Delete button is disabled when Delete Lock is enabled.');
test.todo('Shared owner does not have permission to ...');
