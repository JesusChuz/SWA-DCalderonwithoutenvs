import {
  EDITABLE_WORKSPACE_ADD_NIC,
  EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
  EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC,
  EDITABLE_WORKSPACE_REMOVE_NIC,
  SHOW_BLOCKED_NOTIFICATION,
  SHOW_ERROR_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import {
  EditableWorkspaceAction,
  editableWorkspaceAddNic,
  editableWorkspaceChangeNicSubnet,
  editableWorkspaceChangePrimaryNic,
  EditableWorkspaceMachinesPayload,
  editableWorkspaceRemoveNic,
} from '../../../store/actions/editableWorkspaceActions';
import {
  editableWorkspaceInitialState,
  ReduxEditableWorkspaceState,
} from '../../../store/reducers/editableWorkspaceReducer';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';
import { getTestNicDto } from '../../data/AzureNicDtoTestData';
import { getMockStore } from '../../utils/mockStore.util';
import { checkNicNatRuleAssociation } from '../../../store/validators/nicNatRuleValidators';
import { validateDomainSubnets } from '../../../store/validators/workspaceValidators';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import cloneDeep from 'lodash/cloneDeep';

const virtualMachineID1 = '12300000-0000-0000-0000-000000000001';
const virtualMachineID2 = '12300000-0000-0000-0000-000000000002';
const nicID1 = '12300000-0000-0000-0000-000000000006';
const nicID2 = '12300000-0000-0000-0000-000000000007';
const nicID3 = '12300000-0000-0000-0000-000000000008';
const nicID4 = '12300000-0000-0000-0000-000000000009';

const virtualMachineList: AzureVirtualMachineDto[] = [
  getTestVirtualMachineDto({
    ID: virtualMachineID1,
    Nics: [
      getTestNicDto({
        ID: nicID1,
        Name: 'NIC 1',
      }),
      getTestNicDto({
        ID: nicID2,
        Name: 'NIC 2',
      }),
    ],
  }),
  getTestVirtualMachineDto({
    ID: virtualMachineID2,
    Nics: [
      getTestNicDto({
        ID: nicID3,
        Name: 'NIC 3',
      }),
      getTestNicDto({
        ID: nicID4,
        Name: 'NIC 4',
      }),
    ],
  }),
];

const getEditableWorkspaceState = (
  domainRole: DomainRoles = DomainRoles.WorkgroupMember,
  singleNicVMs = false
): {
  editableWorkspace: ReduxEditableWorkspaceState;
} => ({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    editableWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      VirtualMachines: cloneDeep(
        virtualMachineList.map((vm) => ({
          ...vm,
          DomainRole: domainRole,
          Nics: singleNicVMs ? [vm.Nics[0]] : vm.Nics,
        }))
      ),
    },
    workspaceEditType: WorkspaceEditType.EditWorkspace,
  },
});

const store = getMockStore(getEditableWorkspaceState());

jest.mock('../../../store/validators/nicNatRuleValidators');
jest.mock('../../../store/validators/workspaceValidators');

describe('Workspace NIC Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test.each([[0], [1]])(
    'editableWorkspaceAddNic action creator contains expected type and payload (case %#)',
    async (machineIndex) => {
      const expectedType = EDITABLE_WORKSPACE_ADD_NIC;
      await editableWorkspaceAddNic(machineIndex)(
        store.dispatch,
        store.getState
      );
      const [action]: EditableWorkspaceAction[] = store.getActions();
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      expect(action.type).toEqual(expectedType);
      expect(payload.machines).toHaveLength(virtualMachineList.length);
      expect(payload.machines[machineIndex].Nics).toHaveLength(
        virtualMachineList[machineIndex].Nics.length + 1
      );
      expect(payload.machines[machineIndex].Nics.slice(0, -1)).toEqual(
        virtualMachineList[machineIndex].Nics
      );
      const [newNic] = payload.machines[machineIndex].Nics.slice(-1);
      expect(newNic).toMatchObject({
        Name: `NIC ${payload.machines[machineIndex].Nics.length}`,
      });
    }
  );
  test.each([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ])(
    'editableWorkspaceRemoveNic action creator contains expected type and payload (case %#)',
    async (machineIndex, nicIndex) => {
      const expectedType = EDITABLE_WORKSPACE_REMOVE_NIC;
      (checkNicNatRuleAssociation as jest.Mock).mockImplementation(() => null);
      (validateDomainSubnets as jest.Mock).mockImplementation(() => '');
      await editableWorkspaceRemoveNic(machineIndex, nicIndex)(
        store.dispatch,
        store.getState
      );
      const [action]: EditableWorkspaceAction[] = store.getActions();
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      expect(action.type).toEqual(expectedType);
      expect(payload.machines).toHaveLength(virtualMachineList.length);
      expect(payload.machines[machineIndex].Nics).toHaveLength(
        virtualMachineList[machineIndex].Nics.length - 1
      );
      const removedNic = virtualMachineList[machineIndex].Nics[nicIndex];
      expect(payload.machines[machineIndex].Nics).not.toContainEqual(
        removedNic
      );
    }
  );
  test('editableWorkspaceRemoveNic action creator does not dispatch when only one NIC exists in the VM.', async () => {
    const store = getMockStore(
      getEditableWorkspaceState(DomainRoles.WorkgroupMember, true)
    );
    await editableWorkspaceRemoveNic(0, 0)(store.dispatch, store.getState);
    expect(store.getActions()).not.toContainEqual({
      type: EDITABLE_WORKSPACE_REMOVE_NIC,
    });
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: SHOW_BLOCKED_NOTIFICATION,
      })
    );
  });
  test('editableWorkspaceRemoveNic action creator does not dispatch when checkNicNatRuleAssociation validation fails.', async () => {
    const error = 'Error Message 1';
    (checkNicNatRuleAssociation as jest.Mock).mockImplementation(() => error);
    (validateDomainSubnets as jest.Mock).mockImplementation(() => '');
    await editableWorkspaceRemoveNic(0, 0)(store.dispatch, store.getState);
    expect(store.getActions()).not.toContainEqual({
      type: EDITABLE_WORKSPACE_REMOVE_NIC,
    });
    expect(store.getActions()).toContainEqual({
      type: SHOW_BLOCKED_NOTIFICATION,
      message: error,
    });
  });
  test('editableWorkspaceRemoveNic action creator does not dispatch when validateDomainSubnets validation fails.', async () => {
    const store = getMockStore(
      getEditableWorkspaceState(DomainRoles.DomainController)
    );
    const error = 'Error Message 2';
    (checkNicNatRuleAssociation as jest.Mock).mockImplementation(() => null);
    (validateDomainSubnets as jest.Mock).mockImplementation(() => error);
    await editableWorkspaceRemoveNic(0, 0)(store.dispatch, store.getState);
    expect(store.getActions()).not.toContainEqual(
      expect.objectContaining({
        type: EDITABLE_WORKSPACE_REMOVE_NIC,
      })
    );
    expect(store.getActions()).toContainEqual({
      type: SHOW_BLOCKED_NOTIFICATION,
      message: error,
    });
  });
  test.each([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ])(
    'editableWorkspaceChangePrimaryNic action creator contains expected type and payload (case %#)',
    async (machineIndex, nicIndex) => {
      const expectedType = EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC;
      const nicName = virtualMachineList[machineIndex].Nics[nicIndex].Name;
      await editableWorkspaceChangePrimaryNic(machineIndex, nicName)(
        store.dispatch,
        store.getState
      );
      const [action]: EditableWorkspaceAction[] = store.getActions();
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      expect(action.type).toEqual(expectedType);
      expect(payload.machines).toHaveLength(virtualMachineList.length);
      expect(payload.machines[machineIndex].PrimaryNicName).toBe(nicName);
    }
  );
  test.each([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ])(
    'editableWorkspaceChangeNicSubnet action creator contains expected type and payload (case %#)',
    async (machineIndex, nicIndex) => {
      const expectedType = EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET;
      const nicName = virtualMachineList[machineIndex].Nics[nicIndex].Name;
      const subnetName = `NewSubnetName-${machineIndex}-${nicIndex}`;
      await editableWorkspaceChangeNicSubnet(
        machineIndex,
        nicName,
        subnetName
      )(store.dispatch, store.getState);
      const [action]: EditableWorkspaceAction[] = store.getActions();
      const payload = action.payload as EditableWorkspaceMachinesPayload;
      expect(action.type).toEqual(expectedType);
      expect(payload.machines).toHaveLength(virtualMachineList.length);
      expect(payload.machines[machineIndex].Nics[nicIndex].SubnetName).toBe(
        subnetName
      );
    }
  );
  test('editableWorkspaceChangeNicSubnet action creator does not dispatch when invalid NIC name is provided.', async () => {
    const invalidNicName = 'InvalidName';
    const subnetName = 'NewSubnetName';
    await editableWorkspaceChangeNicSubnet(
      0,
      invalidNicName,
      subnetName
    )(store.dispatch, store.getState);
    expect(store.getActions()).not.toContainEqual(
      expect.objectContaining({
        type: EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
      })
    );
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: SHOW_ERROR_NOTIFICATION,
      })
    );
  });
  test('editableWorkspaceChangeNicSubnet action creator does not dispatch when validateDomainSubnets validation fails.', async () => {
    const message = 'Domain Subnet Error';
    const machineIndex = 0;
    const nicIndex = 0;
    const nicName = virtualMachineList[machineIndex].Nics[nicIndex].Name;
    const store = getMockStore(
      getEditableWorkspaceState(DomainRoles.DomainController)
    );
    (validateDomainSubnets as jest.Mock).mockImplementation(() => message);
    await editableWorkspaceChangeNicSubnet(
      machineIndex,
      nicName,
      'TestSubnetName'
    )(store.dispatch, store.getState);
    expect(store.getActions()).not.toContainEqual(
      expect.objectContaining({
        type: EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
      })
    );
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: SHOW_BLOCKED_NOTIFICATION,
        message,
      })
    );
  });
});
