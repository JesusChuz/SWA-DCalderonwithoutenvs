import cloneDeep from 'lodash/cloneDeep';
import { Blank_AzureWorkspaceDto } from '../../../data/Blank_AzureWorkspaceDto';
import { Blank_WorkspaceErrors } from '../../../data/Blank_WorkspaceErrors';
import {
  EDITABLE_WORKSPACE_RESET_CHANGES,
  EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION,
  EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION,
  EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES,
  EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW,
  EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE,
  SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
} from '../../../store/actions/actionTypes';
import {
  editableWorkspaceResetChanges,
  editableWorkspaceResetConfiguredMachineSelection,
  editableWorkspaceResetMachineSelection,
  editableWorkspaceResetSubnetChanges,
  editableWorkspaceResetWorkspaceChanges,
  editableWorkspaceSetCurrentWorkspaceEdit,
  editableWorkspaceSetCurrentWorkspaceNew,
  editableWorkspaceUpdateCurrentWorkspace,
  editableWorkspaceUpdateWorkspaceEditType,
} from '../../../store/actions/editableWorkspaceActions';
import { editableWorkspaceInitialState } from '../../../store/reducers/editableWorkspaceReducer';
import { ResourceState } from '../../../types/AzureWorkspace/enums/ResourceState';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { getMockStore } from '../../utils/mockStore.util';

const store = getMockStore();

describe('Workspace Form Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });

  test('editableWorkspaceUpdateWorkspaceEditType action creator contains expected type and payload', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE,
      payload: WorkspaceEditType.EditWorkspace,
    };
    await editableWorkspaceUpdateWorkspaceEditType(
      WorkspaceEditType.EditWorkspace
    )(store.dispatch, store.getState);
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceSetCurrentWorkspaceEdit action creator contains expected type and payload', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
      payload: Blank_AzureWorkspaceDto,
    };
    store.dispatch(
      editableWorkspaceSetCurrentWorkspaceEdit(Blank_AzureWorkspaceDto)
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceSetCurrentWorkspaceNew action creator contains expected type and payload', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW,
      payload: WorkspaceEditType.NewCustomWorkspace,
    };
    store.dispatch(
      editableWorkspaceSetCurrentWorkspaceNew(
        WorkspaceEditType.NewCustomWorkspace
      )
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceUpdateCurrentWorkspace action creator contains expected type and payload when not transitioning or deploying', async () => {
    const originalWorkspace = cloneDeep(Blank_AzureWorkspaceDto);
    originalWorkspace.ID = 'testid';
    const editedWorkspace = cloneDeep(originalWorkspace);
    editedWorkspace.State = ResourceState.Running;
    const store = getMockStore({
      editableWorkspace: {
        ...editableWorkspaceInitialState,
        editableWorkspace: originalWorkspace,
        originalWorkspace: originalWorkspace,
      },
    });

    const expectedActions = [
      {
        type: SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
        payload: 'Workspace, , state updated to Running.',
      },
      {
        type: EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT,
        payload: {
          originalWorkspace: editedWorkspace,
          editedWorkspace,
        },
      },
    ];

    editableWorkspaceUpdateCurrentWorkspace([editedWorkspace])(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('editableWorkspaceUpdateCurrentWorkspace action creator contains expected type and payload when transitioning', async () => {
    const originalWorkspace = cloneDeep(Blank_AzureWorkspaceDto);
    originalWorkspace.ID = 'testid';
    originalWorkspace.State = ResourceState.Transitioning;
    const editedWorkspace = cloneDeep(originalWorkspace);
    editedWorkspace.State = ResourceState.Running;
    const store = getMockStore({
      editableWorkspace: {
        ...editableWorkspaceInitialState,
        editableWorkspace: originalWorkspace,
        originalWorkspace: originalWorkspace,
      },
    });
    const expectedAction = {
      type: EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
      payload: editedWorkspace,
      isAdminSelection: false,
    };

    editableWorkspaceUpdateCurrentWorkspace([editedWorkspace])(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceResetChanges action creator contains expected type', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_RESET_CHANGES,
    };

    store.dispatch(editableWorkspaceResetChanges());
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceResetMachineSelection action creator contains expected type', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION,
    };

    store.dispatch(editableWorkspaceResetMachineSelection());
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceResetConfiguredMachineSelection action creator contains expected type', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION,
    };

    store.dispatch(editableWorkspaceResetConfiguredMachineSelection());
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceResetWorkspaceChanges action creator contains expected type, payload and errors', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES,
      payload: Blank_AzureWorkspaceDto,
      error: Blank_WorkspaceErrors,
    };

    store.dispatch(
      editableWorkspaceResetWorkspaceChanges(
        Blank_AzureWorkspaceDto as EditableWorkspace,
        Blank_WorkspaceErrors
      )
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceResetSubnetChanges action creator contains expected type', async () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES,
    };

    store.dispatch(editableWorkspaceResetSubnetChanges());
    expect(store.getActions()).toEqual([expectedAction]);
  });
});
