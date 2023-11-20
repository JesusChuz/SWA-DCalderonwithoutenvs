import cloneDeep from 'lodash/cloneDeep';
import {
  EDITABLE_WORKSPACE_ADD_DATA_DISK,
  EDITABLE_WORKSPACE_REMOVE_DATA_DISK,
  EDITABLE_WORKSPACE_UPDATE_DATA_DISK,
  SHOW_BLOCKED_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import {
  editableWorkspaceAddDataDisk,
  EditableWorkspaceMachinesPayload,
  editableWorkspaceRemoveDataDisk,
  editableWorkspaceUpdateDataDisk,
} from '../../../store/actions/editableWorkspaceActions';
import {
  editableWorkspaceInitialState,
  ReduxEditableWorkspaceState,
} from '../../../store/reducers/editableWorkspaceReducer';
import { checkMaxMachinesStorageQuota } from '../../../store/validators/quotaValidators';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { getTestDataDiskDto } from '../../data/AzureDataDiskDtoTestData';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';
import { getMockStore } from '../../utils/mockStore.util';
import { getOriginalMachineList } from '../../utils/helpers.util';
import { AzureStorageType } from '../../../types/AzureWorkspace/enums/AzureStorageType';
import { DataDiskError } from '../../../types/Forms/DataDiskError.types';
import {
  workspaceValidateDataDisks,
  workspaceValidateDataDisksStorageSize,
} from '../../../store/validators/workspaceValidators';

const virtualMachineID1 = '12300000-0000-0000-0000-000000000001';
const virtualMachineID2 = '12300000-0000-0000-0000-000000000002';
const dataDiskID1 = '12300000-0000-0000-0000-000000000010';
const dataDiskID2 = '12300000-0000-0000-0000-000000000011';
const dataDiskID3 = '12300000-0000-0000-0000-000000000012';
const dataDiskID4 = '12300000-0000-0000-0000-000000000013';

const virtualMachineList: AzureVirtualMachineDto[] = [
  getTestVirtualMachineDto({
    ID: virtualMachineID1,
    DataDisks: [
      getTestDataDiskDto({ ID: dataDiskID1, Lun: 1 }),
      getTestDataDiskDto({ ID: dataDiskID2, Lun: 2 }),
    ],
  }),
  getTestVirtualMachineDto({
    ID: virtualMachineID2,
    DataDisks: [
      getTestDataDiskDto({ ID: dataDiskID3, Lun: 1 }),
      getTestDataDiskDto({ ID: dataDiskID4, Lun: 2 }),
    ],
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

jest.mock('../../../store/validators/quotaValidators');
jest.mock('../../../store/validators/workspaceValidators');

const store = getMockStore(getEditableWorkspaceState());

describe('Workspace Data Disk Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test.each([[0], [1]])(
    'editableWorkspaceAddDataDisk action creator contains expected type and payload (case %#)',
    async (machineIndex) => {
      const expectedActionType = EDITABLE_WORKSPACE_ADD_DATA_DISK;
      const storeState = store.getState();
      const originalMachineList = getOriginalMachineList(storeState);
      (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('');
      await editableWorkspaceAddDataDisk(machineIndex)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      const modifiedMachinePayload = payload.machines;
      expect(modifiedMachinePayload[machineIndex].DataDisks).toHaveLength(
        originalMachineList[machineIndex].DataDisks.length + 1
      );
      expect(
        modifiedMachinePayload[machineIndex].DataDisks[
          modifiedMachinePayload[machineIndex].DataDisks.length - 1
        ]
      ).toEqual(
        expect.objectContaining({
          Name: 'Disk Name',
          SizeGB: 1,
          Lun: 3,
          StorageType: AzureStorageType.StandardSSD,
        })
      );
    }
  );
  test('editableWorkspaceAddDataDisk action creator does not dispatch when checkMaxMachinesStorageQuota validation fails', async () => {
    const expectedAction = { type: SHOW_BLOCKED_NOTIFICATION };
    (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('Error');
    await editableWorkspaceAddDataDisk(0)(store.dispatch, store.getState);
    expect(store.getActions()).toEqual([
      expect.objectContaining(expectedAction),
    ]);
  });
  test.each([
    [0, 1],
    [1, 2],
    [0, 1],
    [1, 2],
  ])(
    'editableWorkspaceRemoveDataDisk action creator contains expected type and payload (case %#)',
    async (machineIndex, lunId) => {
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_DATA_DISK;
      const storeState = store.getState();
      const originalMachineList = getOriginalMachineList(storeState);
      await editableWorkspaceRemoveDataDisk(machineIndex, lunId)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      const modifiedMachinePayload = payload.machines;
      expect(modifiedMachinePayload[machineIndex].DataDisks).toHaveLength(
        originalMachineList[machineIndex].DataDisks.length - 1
      );
      expect(modifiedMachinePayload[machineIndex].DataDisks).not.toContainEqual(
        expect.objectContaining({
          Lun: lunId,
        })
      );
    }
  );
  test.each([
    [0, 'Disk Name 1', ''],
    [1, 'Disk Name 1', ''],
    [0, '', 'Name Error'],
    [1, '', 'Name Error'],
  ])(
    'editableWorkspaceUpdateDataDisk action creator contains expected type and payload on name change (case %#)',
    async (diskIndex, diskName, errorMessage) => {
      const expectedActionType = EDITABLE_WORKSPACE_UPDATE_DATA_DISK;
      const machineIndex = 0;
      const expectedErrorMessage: DataDiskError[] = errorMessage
        ? [{ message: errorMessage } as DataDiskError]
        : [];
      (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('');
      (workspaceValidateDataDisks as jest.Mock).mockReturnValue(
        expectedErrorMessage
      );
      await editableWorkspaceUpdateDataDisk(
        machineIndex,
        diskIndex,
        'Name',
        diskName
      )(store.dispatch, store.getState);
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.error).toBe(expectedErrorMessage);
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      const modifiedMachinePayload = payload.machines;
      expect(
        modifiedMachinePayload[machineIndex].DataDisks[diskIndex].Name
      ).toBe(diskName);
    }
  );
  test.each([
    [0, 'Disk Description 1', ''],
    [1, 'Disk Description 1', ''],
    [0, '', 'Description Error'],
    [1, '', 'Description Error'],
  ])(
    'editableWorkspaceUpdateDataDisk action creator contains expected type and payload on description change (case %#)',
    async (diskIndex, diskDescription, errorMessage) => {
      const expectedActionType = EDITABLE_WORKSPACE_UPDATE_DATA_DISK;
      const machineIndex = 0;
      const expectedErrorMessage: DataDiskError[] = errorMessage
        ? [{ message: errorMessage } as DataDiskError]
        : [];
      (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('');
      (workspaceValidateDataDisks as jest.Mock).mockReturnValue(
        expectedErrorMessage
      );
      await editableWorkspaceUpdateDataDisk(
        machineIndex,
        diskIndex,
        'Description',
        diskDescription
      )(store.dispatch, store.getState);
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.error).toBe(expectedErrorMessage);
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      const modifiedMachinePayload = payload.machines;
      expect(
        modifiedMachinePayload[machineIndex].DataDisks[diskIndex].Description
      ).toBe(diskDescription);
    }
  );
  test.each([
    [0, AzureStorageType.PremiumSSD],
    [1, AzureStorageType.PremiumSSD],
    [0, AzureStorageType.StandardSSD],
    [1, AzureStorageType.StandardSSD],
    [0, AzureStorageType.StandardHDD],
    [1, AzureStorageType.StandardHDD],
  ])(
    'editableWorkspaceUpdateDataDisk action creator contains expected type and payload on storage type change (case %#)',
    async (diskIndex, accountStorageType) => {
      const expectedActionType = EDITABLE_WORKSPACE_UPDATE_DATA_DISK;
      const machineIndex = 0;
      const expectedErrorMessage: DataDiskError[] = [];
      (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('');
      (workspaceValidateDataDisks as jest.Mock).mockReturnValue(
        expectedErrorMessage
      );
      await editableWorkspaceUpdateDataDisk(
        machineIndex,
        diskIndex,
        'StorageType',
        accountStorageType
      )(store.dispatch, store.getState);
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.error).toBe(expectedErrorMessage);
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      const modifiedMachinePayload = payload.machines;
      expect(
        modifiedMachinePayload[machineIndex].DataDisks[diskIndex].StorageType
      ).toBe(accountStorageType);
    }
  );
  test.each([
    [0, 4],
    [1, 4],
    [0, 8],
    [1, 8],
    [0, 8],
    [1, 8],
  ])(
    'editableWorkspaceUpdateDataDisk action creator contains expected type and payload on size change (case %#)',
    async (diskIndex, size) => {
      const expectedActionType = EDITABLE_WORKSPACE_UPDATE_DATA_DISK;
      const machineIndex = 0;
      const expectedErrorMessage: DataDiskError[] = [];
      (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('');
      (workspaceValidateDataDisks as jest.Mock).mockReturnValue(
        expectedErrorMessage
      );
      (workspaceValidateDataDisksStorageSize as jest.Mock).mockReturnValue('');
      await editableWorkspaceUpdateDataDisk(
        machineIndex,
        diskIndex,
        'SizeGB',
        size
      )(store.dispatch, store.getState);
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.error).toBe(expectedErrorMessage);
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      const modifiedMachinePayload = payload.machines;
      expect(
        modifiedMachinePayload[machineIndex].DataDisks[diskIndex].SizeGB
      ).toBe(size);
    }
  );
  test('editableWorkspaceUpdateDataDisk action creator does not dispatch when checkMaxMachinesStorageQuota validation fails on size change', async () => {
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    const machineIndex = 0;
    const diskIndex = 0;
    const expectedErrorMessage: DataDiskError[] = [];
    (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('Error');
    (workspaceValidateDataDisks as jest.Mock).mockReturnValue(
      expectedErrorMessage
    );
    await editableWorkspaceUpdateDataDisk(
      machineIndex,
      diskIndex,
      'Name',
      'Test Name'
    )(store.dispatch, store.getState);
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
  test('editableWorkspaceUpdateDataDisk action creator does not dispatch when workspaceValidateDataDisksStorageSize validation fails on size change', async () => {
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    const machineIndex = 0;
    const diskIndex = 0;
    const expectedErrorMessage: DataDiskError[] = [];
    (checkMaxMachinesStorageQuota as jest.Mock).mockReturnValue('');
    (workspaceValidateDataDisks as jest.Mock).mockReturnValue(
      expectedErrorMessage
    );
    (workspaceValidateDataDisksStorageSize as jest.Mock).mockReturnValue(
      'Error'
    );
    await editableWorkspaceUpdateDataDisk(
      machineIndex,
      diskIndex,
      'SizeGB',
      4
    )(store.dispatch, store.getState);
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
});
