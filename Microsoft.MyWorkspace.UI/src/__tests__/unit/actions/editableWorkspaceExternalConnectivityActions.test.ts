import {
  EDITABLE_WORKSPACE_ADD_NAT_RULE,
  EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS,
  EDITABLE_WORKSPACE_REMOVE_NAT_RULE,
  EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS,
} from '../../../store/actions/actionTypes';
import { AzureVirtualMachineTestData } from '../../data/AzureVirtualMachineTestData';
import { editableWorkspaceInitialState } from '../../../store/reducers/editableWorkspaceReducer';
import { getMockStore } from '../../utils/mockStore.util';
import {
  EditableWorkspaceAction,
  editableWorkspaceAddNatRule,
  editableWorkspaceAddNewPublicAddress,
  EditableWorkspaceMachinesPayload,
  editableWorkspaceRemoveNatRule,
  editableWorkspaceRemoveNewPublicAddress,
} from '../../../store/actions/editableWorkspaceActions';
import { NatRuleDtoTestData } from '../../data/NatRuleDtoTestData';
import { NatRuleDto } from '../../../types/AzureWorkspace/NatRuleDto.types';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { NetworkProtocols } from '../../../types/AzureWorkspace/enums/NetworkProtocols.types';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';

const nonExistentVirtualMachineID = '12300000-0000-0000-0000-000000000000';
const virtualMachineID = '12300000-0000-0000-0000-000000000001';
const workspaceID = '12300000-0000-0000-0000-000000000003';
const includedNatRule1ID = '12300000-0000-0000-0000-000000000004';

const virtualMachineList: AzureVirtualMachineDto[] = [
  {
    ...AzureVirtualMachineTestData,
    ID: virtualMachineID,
    NatRules: [
      {
        ...NatRuleDtoTestData,
        ID: includedNatRule1ID,
        VirtualMachineID: virtualMachineID,
        WorkspaceID: workspaceID,
      },
    ],
  },
];

const store = getMockStore({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    editableWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      VirtualMachines: virtualMachineList,
      ID: workspaceID,
    } as AzureWorkspaceDto,
  },
});

describe('Workspace External Connectivity Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });

  test('editableWorkspaceAddNewPublicAddress action contains expected type', () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS,
    };
    store.dispatch(editableWorkspaceAddNewPublicAddress());
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceRemoveNewPublicAddress action contains expected type', () => {
    const expectedAction = {
      type: EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS,
    };
    store.dispatch(editableWorkspaceRemoveNewPublicAddress());
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceAddNatRule action with non-existent virtual machine ID contains expected type and payload', async () => {
    const natRule: NatRuleDto = {
      ...NatRuleDtoTestData,
      VirtualMachineID: nonExistentVirtualMachineID,
    };
    const expectedAction = {
      type: EDITABLE_WORKSPACE_ADD_NAT_RULE,
      payload: {
        machines: virtualMachineList,
      },
    };
    await editableWorkspaceAddNatRule(natRule)(store.dispatch, store.getState);
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceAddNatRule action with existing virtual machine ID contains expected type and payload', async () => {
    const natRule: NatRuleDto = {
      ...NatRuleDtoTestData,
      ID: 'NatRuleVMTestID',
      VirtualMachineID: virtualMachineID,
      WorkspaceID: workspaceID,
    };
    const natRuleName = `${
      natRule.Protocol === NetworkProtocols.TCP ? 'TCP' : 'UDP'
    }-${natRule.ExternalPort}-${natRule.InternalAddress}`;
    const natRules = virtualMachineList.find(
      (vm) => vm.ID === virtualMachineID
    ).NatRules;
    await editableWorkspaceAddNatRule(natRule)(store.dispatch, store.getState);
    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action.type).toBe(EDITABLE_WORKSPACE_ADD_NAT_RULE);
    const payload = action.payload as EditableWorkspaceMachinesPayload;
    const modifiedVirtualMachine = (
      payload.machines as AzureVirtualMachineDto[]
    ).find((vm) => vm.ID === virtualMachineID);
    expect(modifiedVirtualMachine.NatRules).toEqual([
      ...natRules,
      {
        ...natRule,
        Name: natRuleName,
      },
    ]);
    expect(modifiedVirtualMachine.NatRules).toHaveLength(natRules.length + 1);
  });

  test('editableWorkspaceRemoveNatRule action with non-existent virtual machine ID contains expected type and payload', async () => {
    const nonExistentVirtualMachine = {
      ...AzureVirtualMachineTestData,
      ID: nonExistentVirtualMachineID,
    };
    const natRule: NatRuleDto = {
      ...NatRuleDtoTestData,
      VirtualMachineID: nonExistentVirtualMachineID,
    };
    const expectedAction = {
      type: EDITABLE_WORKSPACE_REMOVE_NAT_RULE,
      payload: {
        machines: virtualMachineList,
      },
    };
    await editableWorkspaceRemoveNatRule(nonExistentVirtualMachine, natRule)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceRemoveNatRule action with existing virtual machine ID contains expected type and payload', async () => {
    const virtualMachine = virtualMachineList.find(
      (vm) => vm.ID === virtualMachineID
    );
    const natRules = virtualMachine.NatRules;
    const natRuleToDelete = natRules[0];
    await editableWorkspaceRemoveNatRule(virtualMachine, natRuleToDelete)(
      store.dispatch,
      store.getState
    );
    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action.type).toBe(EDITABLE_WORKSPACE_REMOVE_NAT_RULE);
    const payload = action.payload as EditableWorkspaceMachinesPayload;
    const modifiedVirtualMachine = (
      payload.machines as AzureVirtualMachineDto[]
    ).find((vm) => vm.ID === virtualMachineID);
    expect(modifiedVirtualMachine.NatRules).toEqual(
      natRules.filter((nat) => nat.ID !== natRuleToDelete.ID)
    );
    expect(modifiedVirtualMachine.NatRules).toHaveLength(natRules.length - 1);
  });
});
