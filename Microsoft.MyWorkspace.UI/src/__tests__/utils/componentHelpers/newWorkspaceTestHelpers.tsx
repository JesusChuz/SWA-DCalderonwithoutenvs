import React from 'react';
import { PreloadedState } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { renderWithProviders } from 'src/__tests__/utils/testRenderer';
import { RootState } from 'src/store/reducers/rootReducer';
import { WorkspaceEditType } from 'src/types/enums/WorkspaceEditType';
import NewAzureWorkspace from '../../../components/NewWorkspace/NewWorkspace';
import { Route } from 'react-router';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import {
  editableWorkspaceAddMachines,
  editableWorkspaceBuildMachines,
  editableWorkspaceUpdateWithTemplate,
} from 'src/store/actions/editableWorkspaceActions';
import { MachineSelectionWithCount } from 'src/types/Forms/MachineSelectionWithCount.types';

export const renderCustomWorkspaceComponent = (
  step: NewWorkspaceStep,
  config?: {
    preloadedState?: PreloadedState<RootState>;
    store?: ToolkitStore<RootState>;
    route?: string;
  }
) => {
  const stepsDirty = initializeStepsDirty(step);
  return renderWithProviders(
    <NewAzureWorkspace
      workspaceEditType={WorkspaceEditType.NewCustomWorkspace}
      step={step}
      setStep={jest.fn()}
      initialStepsDirty={stepsDirty}
    />,
    {
      route: config?.route ?? '/NewAzureWorkspace/Custom',
      preloadedState: config?.preloadedState,
      store: config?.store,
    }
  );
};

export const renderTemplateWorkspaceComponent = (
  step: NewWorkspaceStep,
  config?: {
    preloadedState?: PreloadedState<RootState>;
    store?: ToolkitStore<RootState>;
    route?: string;
  }
) => {
  const stepsDirty = initializeStepsDirty(step);
  return renderWithProviders(
    <NewAzureWorkspace
      workspaceEditType={WorkspaceEditType.NewTemplateWorkspace}
      step={step}
      setStep={jest.fn()}
      initialStepsDirty={stepsDirty}
    />,
    {
      route: config?.route ?? '/NewAzureWorkspace/Template',
      preloadedState: config?.preloadedState,
      store: config?.store,
    }
  );
};

export const renderEditWorkspaceComponent = (
  step: NewWorkspaceStep,
  workspaceID: string,
  config?: {
    preloadedState?: PreloadedState<RootState>;
    store?: ToolkitStore<RootState>;
    route?: string;
  }
) => {
  const stepsDirty = initializeStepsDirty(step);
  return renderWithProviders(
    <Route exact path='/:id/edit'>
      <NewAzureWorkspace
        workspaceEditType={WorkspaceEditType.EditWorkspace}
        step={step}
        setStep={jest.fn()}
        initialStepsDirty={stepsDirty}
      />
    </Route>,
    {
      route: config?.route ?? `/${workspaceID}/edit`,
      preloadedState: config?.preloadedState,
      store: config?.store,
    }
  );
};

const initializeStepsDirty = (step: NewWorkspaceStep) => {
  const stepsDirty = new Set<NewWorkspaceStep>();
  for (let i = 0; i < step; i++) {
    stepsDirty.add(i);
  }
  return stepsDirty;
};

export const setupNewTestTemplateWorkspaceState = async (
  testTemplate: WorkspaceTemplateDto,
  store: ToolkitStore<RootState>
) => {
  await editableWorkspaceUpdateWithTemplate(testTemplate)(
    store.dispatch,
    store.getState
  );
};

export const setupNewTestCustomWorkspaceState = async (
  testMachines: MachineSelectionWithCount[],
  store: ToolkitStore<RootState>
) => {
  for (const testMachine of testMachines) {
    await editableWorkspaceAddMachines(testMachine.machine, testMachine.count)(
      store.dispatch,
      store.getState
    );
  }
  await editableWorkspaceBuildMachines()(store.dispatch, store.getState);
};
