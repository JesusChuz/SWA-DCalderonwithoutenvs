import { Blank_Subnet } from '../../../data/Blank_Subnet';
import {
  EDITABLE_WORKSPACE_UPDATE_SUBNETS,
  SHOW_BLOCKED_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import {
  editableWorkspaceAddSubnet,
  editableWorkspaceRemoveSubnet,
  editableWorkspaceUpdateRoutable,
  editableWorkspaceUpdateSubnet,
  editableWorkspaceUpdateSubnetName,
} from '../../../store/actions/editableWorkspaceActions';
import { editableWorkspaceInitialState } from '../../../store/reducers/editableWorkspaceReducer';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { SubnetNameError } from '../../../types/Forms/SubnetNameError.types';
import { TempSubnet } from '../../../types/Forms/TempSubnet.types';
import { getMockStore } from '../../utils/mockStore.util';

const store = getMockStore({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
  },
});

describe('Workspace Subnet Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('editableWorkspaceUpdateSubnetName action creator contains expected type, payload and error', async () => {
    const newName = 'newName';
    const machines: AzureVirtualMachineDto[] = [];
    const error: SubnetNameError[] = [];
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets: [
          {
            ...Blank_Subnet,
            name: newName,
          },
        ],
        network: {
          Name: 'Default Virtual Network',
          Description: '',
          SubnetProperties: {
            newName: {
              IsRoutable: true,
            },
          },
        },
        machines,
      },
      error,
    };
    await editableWorkspaceUpdateSubnetName(0, newName)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceUpdateSubnet action creator contains expected type, payload and error', async () => {
    const updatedSubnet = {
      ...Blank_Subnet,
      subnet: {
        IsRoutable: false,
      },
    };
    const machines: AzureVirtualMachineDto[] = [];
    const error: SubnetNameError[] = [];
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets: [updatedSubnet],
        network: {
          Name: 'Default Virtual Network',
          Description: '',
          SubnetProperties: {
            subnet1: {
              IsRoutable: false,
            },
          },
        },
        machines,
      },
      error,
    };
    await editableWorkspaceUpdateSubnet(0, updatedSubnet)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceAddSubnet action creator contains expected type, payload and error', async () => {
    const error: SubnetNameError[] = [];
    const addedSubnet: TempSubnet = {
      name: 'subnet2',
      subnet: {
        IsRoutable: true,
      },
    };
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets: [Blank_Subnet, addedSubnet],
        network: {
          Name: 'Default Virtual Network',
          Description: '',
          SubnetProperties: {
            subnet1: {
              IsRoutable: true,
            },
            subnet2: {
              IsRoutable: true,
            },
          },
        },
      },
      error,
    };
    await editableWorkspaceAddSubnet()(store.dispatch, store.getState);
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceAddSubnet action creator does not dispatch when checkNetworksQuota validation fails', async () => {
    const store = getMockStore({
      editableWorkspace: {
        ...editableWorkspaceInitialState,
        subnets: [
          Blank_Subnet,
          Blank_Subnet,
          Blank_Subnet,
          Blank_Subnet,
          Blank_Subnet,
          Blank_Subnet,
          Blank_Subnet,
          Blank_Subnet,
        ],
      },
    });
    await editableWorkspaceAddSubnet()(store.dispatch, store.getState);
    expect(store.getActions()[0].type).toEqual(SHOW_BLOCKED_NOTIFICATION);
  });
  test('editableWorkspaceRemoveSubnet action creator contains expected type, payload and error', async () => {
    const store = getMockStore({
      editableWorkspace: {
        ...editableWorkspaceInitialState,
        subnets: [Blank_Subnet, Blank_Subnet],
      },
    });
    const machines: AzureVirtualMachineDto[] = [];
    const error: SubnetNameError[] = [];
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets: [Blank_Subnet],
        network: {
          Name: 'Default Virtual Network',
          Description: '',
          SubnetProperties: {
            subnet1: {
              IsRoutable: true,
            },
          },
        },
        machines,
      },
      error,
    };

    await editableWorkspaceRemoveSubnet(0)(store.dispatch, store.getState);
    expect(store.getActions()).toEqual([expectedAction]);
  });
  test('editableWorkspaceRemoveSubnet action creator does not dispatch when checkNetworksQuota validation fails', async () => {
    const store = getMockStore({
      editableWorkspace: {
        ...editableWorkspaceInitialState,
        subnets: [Blank_Subnet],
      },
    });
    await editableWorkspaceRemoveSubnet(0)(store.dispatch, store.getState);
    expect(store.getActions()[0].type).toEqual(SHOW_BLOCKED_NOTIFICATION);
  });
  test('editableWorkspaceUpdateRoutable action creator contains expected type, payload and error', async () => {
    const error: SubnetNameError[] = [];
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        subnets: [
          {
            ...Blank_Subnet,
            subnet: {
              IsRoutable: false,
            },
          },
        ],
        network: {
          Name: 'Default Virtual Network',
          Description: '',
          SubnetProperties: {
            subnet1: {
              IsRoutable: false,
            },
          },
        },
      },
      error,
    };

    await editableWorkspaceUpdateRoutable(0, false)(
      store.dispatch,
      store.getState
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });
  9;
});
