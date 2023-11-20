import cloneDeep from 'lodash/cloneDeep';
import {
  EDITABLE_WORKSPACE_ADD_MACHINE,
  EDITABLE_WORKSPACE_BUILD_MACHINES,
  EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE,
  EDITABLE_WORKSPACE_REMOVE_MACHINE,
  SHOW_BLOCKED_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import {
  editableWorkspaceAddMachine,
  editableWorkspaceAddMachines,
  editableWorkspaceBuildMachines,
  EditableWorkspaceDomainsPayload,
  EditableWorkspaceMachinesPayload,
  editableWorkspaceRemoveConfiguredMachine,
  editableWorkspaceRemoveMachine,
} from '../../../store/actions/editableWorkspaceActions';
import {
  ReduxCatalogState,
  catalogInitialState,
} from '../../../store/reducers/catalogReducer';
import {
  editableWorkspaceInitialState,
  ReduxEditableWorkspaceState,
} from '../../../store/reducers/editableWorkspaceReducer';
import {
  checkMaxMachinesQuota,
  checkMaxMemoryQuotaWithAddition,
} from '../../../store/validators/quotaValidators';
import {
  setDomainMembersToWorkgroupMembers,
  workspaceValidateMachineAmount,
} from '../../../store/validators/workspaceValidators';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { MachineSelectionWithCount } from '../../../types/Forms/MachineSelectionWithCount.types';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';
import { AzureDomainDtoTestData } from '../../data/AzureDomainDtoTestData';
import { VirtualMachineCustomDtoTestData } from '../../data/VirtualMachineCustomDtoTestData';
import { getTestVirtualMachineSkuDto } from '../../data/VirtualMachineSkuDtoTestData';
import { getMockStore } from '../../utils/mockStore.util';
import { getOriginalMachineList } from '../../utils/helpers.util';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { AzureVirtualMachineForCreationDto } from '../../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';

const virtualMachineUniqueName1 = 'Virtual Machine 1';
const virtualMachineUniqueName2 = 'Virtual Machine 2';
const virtualMachineID1 = '12300000-0000-0000-0000-000000000001';
const virtualMachineID2 = '12300000-0000-0000-0000-000000000002';
const imageSourceID1 = '12300000-0000-0000-0000-000000000005';
const imageSourceID2 = '12300000-0000-0000-0000-000000000006';
const imageSourceID3 = '12300000-0000-0000-0000-000000000007';
const imageSourceID4 = '12300000-0000-0000-0000-000000000008';
const testSkuID1 = '12300000-0000-0000-0000-000000000010';
const testSkuID2 = '12300000-0000-0000-0000-000000000011';
const testSkuName1 = 'Test SKU 1';
const testSkuName2 = 'Test SKU 2';
const domainID1 = '12300000-0000-0000-0000-000000000012';
const domainID2 = '12300000-0000-0000-0000-000000000013';
const testAdministratorName = 'administratorName';
const testAdministratorPassword = 'thisIsATest';
const presentVirtualMachine1 = {
  ...VirtualMachineCustomDtoTestData,
  ID: imageSourceID1,
  ImageSourceID: imageSourceID1,
};
const presentVirtualMachine2 = {
  ...VirtualMachineCustomDtoTestData,
  ID: imageSourceID2,
  ImageSourceID: imageSourceID2,
};
const nonPresentVirtualMachine1 = {
  ...VirtualMachineCustomDtoTestData,
  ID: imageSourceID3,
  ImageSourceID: imageSourceID3,
};
const nonPresentVirtualMachine2 = {
  ...VirtualMachineCustomDtoTestData,
  ID: imageSourceID4,
  ImageSourceID: imageSourceID4,
};

const virtualMachineList: AzureVirtualMachineDto[] = [
  getTestVirtualMachineDto({
    ID: virtualMachineID1,
    Name: virtualMachineUniqueName1,
  }),
  getTestVirtualMachineDto({
    ID: virtualMachineID2,
    Name: virtualMachineUniqueName2,
  }),
];

const getEditableWorkspaceState = (
  machineCount = 1
): {
  editableWorkspace: ReduxEditableWorkspaceState;
} => ({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    editableWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      VirtualMachines: cloneDeep(virtualMachineList),
      Domains: [
        { ...AzureDomainDtoTestData, ID: domainID1 },
        { ...AzureDomainDtoTestData, ID: domainID2 },
      ],
    },
    machines: [
      { machine: presentVirtualMachine1, count: machineCount },
      { machine: presentVirtualMachine2, count: machineCount },
    ],
    administratorName: testAdministratorName,
    administratorPassword: testAdministratorPassword,
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
    ],
  },
});

jest.mock('../../../store/validators/quotaValidators');
jest.mock('../../../store/validators/workspaceValidators');

const store = getMockStore({
  ...getEditableWorkspaceState(),
});

describe('Workspace Machine Configuration Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });

  test.each([
    [2, presentVirtualMachine1, ''],
    [4, presentVirtualMachine1, ''],
    [2, nonPresentVirtualMachine1, ''],
    [4, nonPresentVirtualMachine1, ''],
    [2, presentVirtualMachine1, 'Error'],
    [4, presentVirtualMachine1, 'Error'],
    [2, nonPresentVirtualMachine1, 'Error'],
    [4, nonPresentVirtualMachine1, 'Error'],
  ])(
    'editableWorkspaceAddMachines action creator contains expected type, payload and error (case %#)',
    async (amount, machine, error) => {
      const expectedActionType = EDITABLE_WORKSPACE_ADD_MACHINE;
      (workspaceValidateMachineAmount as jest.Mock).mockReturnValue(error);
      (checkMaxMachinesQuota as jest.Mock).mockReturnValue('');
      (checkMaxMemoryQuotaWithAddition as jest.Mock).mockReturnValue('');
      await editableWorkspaceAddMachines(machine, amount)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.error).toBe(error);
      const payload = action.payload as MachineSelectionWithCount[];
      const newMachineCount = payload.find(
        (m) => m.machine.ImageSourceID === machine.ImageSourceID
      ).count;
      expect(newMachineCount).toBe(amount);
    }
  );

  test('editableWorkspaceAddMachines action creator does not dispatch when checkMaxMachinesQuota validation fails', async () => {
    const amount = 4;
    const machine = presentVirtualMachine1;
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    (workspaceValidateMachineAmount as jest.Mock).mockReturnValue('');
    (checkMaxMachinesQuota as jest.Mock).mockReturnValue('Error');
    (checkMaxMemoryQuotaWithAddition as jest.Mock).mockReturnValue('');
    await editableWorkspaceAddMachines(machine, amount)(
      store.dispatch,
      store.getState
    );
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
  test('editableWorkspaceAddMachines action creator does not dispatch when checkMaxMemoryQuotaWithAddition validation fails', async () => {
    const amount = 4;
    const machine = presentVirtualMachine1;
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    (workspaceValidateMachineAmount as jest.Mock).mockReturnValue('');
    (checkMaxMachinesQuota as jest.Mock).mockReturnValue('');
    (checkMaxMemoryQuotaWithAddition as jest.Mock).mockReturnValue('Error');
    await editableWorkspaceAddMachines(machine, amount)(
      store.dispatch,
      store.getState
    );
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
  test.each([
    [presentVirtualMachine1, ''],
    [nonPresentVirtualMachine1, ''],
    [presentVirtualMachine1, 'Error'],
    [nonPresentVirtualMachine1, 'Error'],
  ])(
    'editableWorkspaceAddMachine action creator contains expected type, payload and error for existing machine (case %#)',
    async (machine, error) => {
      const amount = 1;
      const expectedActionType = EDITABLE_WORKSPACE_ADD_MACHINE;
      const initialMachineCount =
        store
          .getState()
          .editableWorkspace.machines.find(
            (m) => m.machine.ImageSourceID === machine.ImageSourceID
          )?.count ?? 0;
      (workspaceValidateMachineAmount as jest.Mock).mockReturnValue(error);
      (checkMaxMachinesQuota as jest.Mock).mockReturnValue('');
      (checkMaxMemoryQuotaWithAddition as jest.Mock).mockReturnValue('');
      await editableWorkspaceAddMachine(machine)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as MachineSelectionWithCount[];
      const newMachineCount = payload.find(
        (m) => m.machine.ImageSourceID === machine.ImageSourceID
      ).count;
      expect(newMachineCount).toBe(initialMachineCount + amount);
    }
  );
  test('editableWorkspaceAddMachine action creator does not dispatch when checkMaxMachinesQuota validation fails', async () => {
    const machine = presentVirtualMachine1;
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    (workspaceValidateMachineAmount as jest.Mock).mockReturnValue('');
    (checkMaxMachinesQuota as jest.Mock).mockReturnValue('Error');
    (checkMaxMemoryQuotaWithAddition as jest.Mock).mockReturnValue('');
    await editableWorkspaceAddMachine(machine)(store.dispatch, store.getState);
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
  test('editableWorkspaceAddMachine action creator does not dispatch when checkMaxMemoryQuotaWithAddition validation fails', async () => {
    const machine = presentVirtualMachine1;
    const expectedActionType = SHOW_BLOCKED_NOTIFICATION;
    (workspaceValidateMachineAmount as jest.Mock).mockReturnValue('');
    (checkMaxMachinesQuota as jest.Mock).mockReturnValue('');
    (checkMaxMemoryQuotaWithAddition as jest.Mock).mockReturnValue('Error');
    await editableWorkspaceAddMachine(machine)(store.dispatch, store.getState);
    const [action] = store.getActions();
    expect(action.type).toBe(expectedActionType);
  });
  test.each([[nonPresentVirtualMachine1], [nonPresentVirtualMachine2]])(
    'editableWorkspaceRemoveMachine action creator contains expected type, payload and error when machine does not exist (case %#)',
    async (machine) => {
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_MACHINE;
      const initialMachines = store.getState().editableWorkspace.machines;
      await editableWorkspaceRemoveMachine(machine)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.payload).toEqual(initialMachines);
    }
  );
  test.each([
    [presentVirtualMachine1, 2],
    [presentVirtualMachine2, 2],
    [presentVirtualMachine1, 4],
    [presentVirtualMachine2, 4],
  ])(
    'editableWorkspaceRemoveMachine action creator contains expected type, payload and error when machine does exist with initial count greater than 1 (case %#)',
    async (machine, initialCount) => {
      const store = getMockStore({
        ...getEditableWorkspaceState(initialCount),
      });
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_MACHINE;
      await editableWorkspaceRemoveMachine(machine)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as MachineSelectionWithCount[];
      const newMachineCount = payload.find(
        (m) => m.machine.ImageSourceID === machine.ImageSourceID
      ).count;
      expect(newMachineCount).toBe(initialCount - 1);
    }
  );
  test.each([[presentVirtualMachine1], [presentVirtualMachine2]])(
    'editableWorkspaceRemoveMachine action creator contains expected type, payload and error when machine does exist with initial count equal to 1 (case %#)',
    async (machine) => {
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_MACHINE;
      await editableWorkspaceRemoveMachine(machine)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as MachineSelectionWithCount[];
      expect(payload).not.toContainEqual(
        expect.objectContaining({ ImageSourceID: machine.ImageSourceID })
      );
    }
  );
  test.each([[nonPresentVirtualMachine1], [nonPresentVirtualMachine2]])(
    'editableWorkspaceRemoveMachines action creator contains expected type, payload and error when machine does not exist (case %#)',
    async (machine) => {
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_MACHINE;
      const initialMachines = store.getState().editableWorkspace.machines;
      await editableWorkspaceRemoveMachine(machine)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      expect(action.payload).toEqual(initialMachines);
    }
  );
  test.each([[presentVirtualMachine1], [presentVirtualMachine2]])(
    'editableWorkspaceRemoveMachines action creator contains expected type, payload and error when machine does exist (case %#)',
    async (machine) => {
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_MACHINE;
      await editableWorkspaceRemoveMachine(machine)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as MachineSelectionWithCount[];
      expect(payload).not.toContainEqual(
        expect.objectContaining({ ImageSourceID: machine.ImageSourceID })
      );
    }
  );
  test.each([[0], [1]])(
    'editableWorkspaceRemoveConfiguredMachine action creator contains expected type, payload and error (case %#)',
    async (machineIndex) => {
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE;
      const originalMachineList = getOriginalMachineList(store.getState());
      const originalMachine = originalMachineList[machineIndex];
      await editableWorkspaceRemoveConfiguredMachine(machineIndex)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      const modifiedMachineList = payload.machines;
      expect(modifiedMachineList).not.toContainEqual(
        expect.objectContaining({ Name: originalMachine.Name })
      );
    }
  );
  test.each([
    [0, domainID1],
    [1, domainID1],
    [0, domainID2],
    [1, domainID2],
  ])(
    'editableWorkspaceRemoveConfiguredMachine action creator contains expected type, payload and error for domain controller (case %#)',
    async (machineIndex, domainID) => {
      const editableWorkspaceState = getEditableWorkspaceState();
      editableWorkspaceState.editableWorkspace.editableWorkspace.VirtualMachines[
        machineIndex
      ].DomainRole = DomainRoles.DomainController;
      editableWorkspaceState.editableWorkspace.editableWorkspace.VirtualMachines[
        machineIndex
      ].DomainID = domainID;

      const store = getMockStore(editableWorkspaceState);
      const expectedActionType = EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE;
      const originalMachineList = getOriginalMachineList(store.getState());
      const originalMachine = originalMachineList[machineIndex];
      (setDomainMembersToWorkgroupMembers as jest.Mock).mockImplementation(() =>
        jest.fn()
      );
      await editableWorkspaceRemoveConfiguredMachine(machineIndex)(
        store.dispatch,
        store.getState
      );
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      const modifiedMachineList = payload.machines;
      expect(modifiedMachineList).not.toContainEqual(
        expect.objectContaining({ Name: originalMachine.Name })
      );
      expect(payload.domains).not.toContainEqual(
        expect.objectContaining({ ID: domainID })
      );
    }
  );
  test.each([[2], [4], [6]])(
    'editableWorkspaceBuildMachines action creator contains expected type and payload (case %#)',
    async (count) => {
      const expectedActionType = EDITABLE_WORKSPACE_BUILD_MACHINES;
      const store = getMockStore({
        ...getEditableWorkspaceState(count),
        ...getCatalogState(),
      });
      const machines = store.getState().editableWorkspace.machines;
      await editableWorkspaceBuildMachines()(store.dispatch, store.getState);
      const [action] = store.getActions();
      expect(action.type).toBe(expectedActionType);
      const payload = action.payload as AzureVirtualMachineForCreationDto[];
      machines.forEach((m) => {
        const matchingPayload = payload.filter(
          (p) => p.ImageSourceID === m.machine.ImageSourceID
        );
        expect(matchingPayload).toHaveLength(m.count);
        matchingPayload.forEach((payload) => {
          expect(payload).toEqual(
            expect.objectContaining({
              AdministratorName: testAdministratorName,
              AdministratorPassword: testAdministratorPassword,
              ImageSourceID: m.machine.ImageSourceID,
              PatchMode: m.machine.PatchMode,
              OSVersion: m.machine.OSVersion,
            })
          );
        });
      });
    }
  );
});
