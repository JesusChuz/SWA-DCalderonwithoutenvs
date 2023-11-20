import cloneDeep from 'lodash/cloneDeep';
import {
  CREATE_SNAPSHOT_BEGIN,
  CREATE_SNAPSHOT_FAILURE,
  CREATE_SNAPSHOT_SUCCESS,
  DELETE_SNAPSHOT_BEGIN,
  DELETE_SNAPSHOT_FAILURE,
  DELETE_SNAPSHOT_SUCCESS,
  EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB,
  EDITABLE_WORKSPACE_UPDATE_VM_NAME,
  RESTORE_SNAPSHOT_BEGIN,
  RESTORE_SNAPSHOT_FAILURE,
  RESTORE_SNAPSHOT_SUCCESS,
  SHOW_BLOCKED_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import {
  createSnapshot,
  deleteSnapshot,
  EditableWorkspaceMachinesPayload,
  editableWorkspaceUpdateMemoryGB,
  editableWorkspaceUpdateVMName,
  restoreSnapshot,
} from '../../../store/actions/editableWorkspaceActions';
import {
  catalogInitialState,
  ReduxCatalogState,
} from '../../../store/reducers/catalogReducer';
import {
  editableWorkspaceInitialState,
  ReduxEditableWorkspaceState,
} from '../../../store/reducers/editableWorkspaceReducer';
import {
  checkMachineSkuQuotas,
  checkMaxMemoryQuota,
} from '../../../store/validators/quotaValidators';
import { workspaceValidateVMNames } from '../../../store/validators/workspaceValidators';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';
import { getTestVirtualMachineSkuDto } from '../../data/VirtualMachineSkuDtoTestData';
import {
  getTestVirtualMachineSnapshotDto,
  getTestVirtualMachineSnapshotForCreationDto,
} from '../../data/AzureVirtualMachineSnapshotTestData';
import { getMockStore } from '../../utils/mockStore.util';
import { httpAuthService } from '../../../applicationInsights/httpAuthService';

jest.mock('../../../store/actions/errorAction');
jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');
const failure = {
  response: {
    status: 400,
  },
};

const virtualMachineID1 = '12300000-0000-0000-0000-000000000001';
const virtualMachineID2 = '12300000-0000-0000-0000-000000000002';
const testSkuID1 = '12300000-0000-0000-0000-000000000010';
const testSkuID2 = '12300000-0000-0000-0000-000000000011';
const testSkuID3 = '12300000-0000-0000-0000-000000000012';
const testSkuName1 = 'Test SKU 1';
const testSkuName2 = 'Test SKU 2';
const testSkuName3 = 'Test SKU 3';

const virtualMachineList: AzureVirtualMachineDto[] = [
  getTestVirtualMachineDto({
    ID: virtualMachineID1,
    MemoryGB: 8,
  }),
  getTestVirtualMachineDto({
    ID: virtualMachineID2,
    MemoryGB: 8,
  }),
];

const getEditableWorkspaceState = (): {
  editableWorkspace: ReduxEditableWorkspaceState;
} => ({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    originalWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      VirtualMachines: cloneDeep(virtualMachineList),
    },
    editableWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      VirtualMachines: cloneDeep(virtualMachineList),
    },
  },
});

const getCatalogState = (): {
  catalog: ReduxCatalogState;
} => ({
  catalog: {
    ...catalogInitialState,
    catalogMachineSkus: [
      getTestVirtualMachineSkuDto({
        ID: testSkuID1,
        Name: testSkuName1,
        Memory: 4 * 1024,
      }),
      getTestVirtualMachineSkuDto({
        ID: testSkuID2,
        Name: testSkuName2,
        Memory: 8 * 1024,
      }),
      getTestVirtualMachineSkuDto({
        ID: testSkuID3,
        Name: testSkuName3,
        Memory: 16 * 1024,
      }),
    ],
  },
});

jest.mock('../../../store/validators/quotaValidators');
jest.mock('../../../store/validators/workspaceValidators');

const store = getMockStore({
  ...getEditableWorkspaceState(),
  ...getCatalogState(),
});

describe('Workspace Virtual Machine Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test.each([
    [0, 4],
    [1, 4],
    [0, 8],
    [1, 8],
  ])(
    'editableWorkspaceUpdateMemoryGB action creator contains expected type and payload (case %#)',
    async (machineIndex, memory) => {
      const expectedActionType = EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB;
      (checkMachineSkuQuotas as jest.Mock).mockReturnValue('');
      (checkMaxMemoryQuota as jest.Mock).mockReturnValue('');
      await editableWorkspaceUpdateMemoryGB(machineIndex, memory)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const machine = action.payload.machines[machineIndex];
      expect(machine.MemoryGB).toBe(memory);
      const matchingSku = store
        .getState()
        .catalog.catalogMachineSkus.find((sku) => sku.Memory === memory * 1024);
      expect(machine.Sku).toBe(matchingSku.Name);
    }
  );
  test('editableWorkspaceUpdateMemoryGB action creator does not dispatch when checkMachineSkuQuotas validation fails', async () => {
    const machineIndex = 0;
    const memory = 4;
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    (checkMachineSkuQuotas as jest.Mock).mockReturnValue('Error');
    (checkMaxMemoryQuota as jest.Mock).mockReturnValue('');
    await editableWorkspaceUpdateMemoryGB(machineIndex, memory)(
      store.dispatch,
      store.getState
    );
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
  test('editableWorkspaceUpdateMemoryGB action creator does not dispatch when checkMaxMemoryQuota validation fails', async () => {
    const machineIndex = 0;
    const memory = 16;
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    (checkMachineSkuQuotas as jest.Mock).mockReturnValue('');
    (checkMaxMemoryQuota as jest.Mock).mockReturnValue('Error');
    await editableWorkspaceUpdateMemoryGB(machineIndex, memory)(
      store.dispatch,
      store.getState
    );
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
  test.each([
    [0, 'Test VM Name', ''],
    [1, 'Test VM Name', ''],
    [0, '', 'Error'],
    [1, '', 'Error'],
  ])(
    'editableWorkspaceUpdateVMName action creator contains expected type, payload and error for virtual machine (case %#)',
    async (machineIndex, name, error) => {
      const expectedActionType = EDITABLE_WORKSPACE_UPDATE_VM_NAME;
      const expectedError = error ? [{ message: error }] : [];
      (workspaceValidateVMNames as jest.Mock).mockReturnValue(expectedError);
      await editableWorkspaceUpdateVMName(machineIndex, name)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.error).toEqual(expectedError);
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      const modifiedMachinePayload = payload.machines;
      expect(modifiedMachinePayload[machineIndex].ComputerName).toBe(name);
    }
  );

  test('createSnapshot action creator dispatches expected actions on success', async () => {
    const testName = 'snapshot-test-name';
    const virtualMachineTestID = 'vm-test-id';
    const snapshot = getTestVirtualMachineSnapshotForCreationDto({
      VirtualMachineID: virtualMachineTestID,
      Name: testName,
    });
    const expectedActions = [
      { type: CREATE_SNAPSHOT_BEGIN, payload: snapshot },
      { type: CREATE_SNAPSHOT_SUCCESS, payload: snapshot },
    ];
    (httpAuthService.post as jest.Mock).mockResolvedValue({ data: snapshot });
    await createSnapshot(snapshot)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('createSnapshot action creator dispatches expected actions on failure', async () => {
    const testName = 'snapshot-test-name';
    const virtualMachineTestID = 'vm-test-id';
    const snapshot = getTestVirtualMachineSnapshotForCreationDto({
      VirtualMachineID: virtualMachineTestID,
      Name: testName,
    });
    const expectedActions = [
      { type: CREATE_SNAPSHOT_BEGIN, payload: snapshot },
      { type: CREATE_SNAPSHOT_FAILURE, payload: failure },
    ];
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    await createSnapshot(snapshot)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('restoreSnapshot action creator dispatches expected actions on success', async () => {
    const testID = 'snapshot-test-id';
    const virtualMachineTestID = 'vm-test-id';
    const snapshot = getTestVirtualMachineSnapshotDto({
      ID: testID,
      VirtualMachineID: virtualMachineTestID,
    });
    (httpAuthService.post as jest.Mock).mockResolvedValue(null);
    const expectedActions = [
      { type: RESTORE_SNAPSHOT_BEGIN, payload: snapshot },
      { type: RESTORE_SNAPSHOT_SUCCESS },
    ];
    await restoreSnapshot(snapshot)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('restoreSnapshot action creator dispatches expected actions on failure', async () => {
    const testID = 'snapshot-test-id';
    const virtualMachineTestID = 'vm-test-id';
    const snapshot = getTestVirtualMachineSnapshotDto({
      ID: testID,
      VirtualMachineID: virtualMachineTestID,
    });
    (httpAuthService.post as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: RESTORE_SNAPSHOT_BEGIN, payload: snapshot },
      { type: RESTORE_SNAPSHOT_FAILURE, payload: failure },
    ];
    await restoreSnapshot(snapshot)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('deleteSnapshot action creator dispatches expected actions on success', async () => {
    const testID = 'snapshot-test-id';
    const virtualMachineTestID = 'vm-test-id';
    const snapshot = getTestVirtualMachineSnapshotDto({
      ID: testID,
      VirtualMachineID: virtualMachineTestID,
    });
    (httpAuthService.delete as jest.Mock).mockResolvedValue(null);
    const expectedActions = [
      { type: DELETE_SNAPSHOT_BEGIN, payload: snapshot },
      { type: DELETE_SNAPSHOT_SUCCESS, payload: snapshot },
    ];
    await deleteSnapshot(snapshot)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('deleteSnapshot action creator dispatches expected actions on failure', async () => {
    const testID = 'snapshot-test-id';
    const virtualMachineTestID = 'vm-test-id';
    const snapshot = getTestVirtualMachineSnapshotDto({
      ID: testID,
      VirtualMachineID: virtualMachineTestID,
    });
    (httpAuthService.delete as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: DELETE_SNAPSHOT_BEGIN, payload: snapshot },
      { type: DELETE_SNAPSHOT_FAILURE, payload: failure },
    ];
    await deleteSnapshot(snapshot)(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
