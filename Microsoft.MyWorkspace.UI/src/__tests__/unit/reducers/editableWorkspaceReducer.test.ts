import { Blank_AzureWorkspaceDto } from '../../../data/Blank_AzureWorkspaceDto';
import { Blank_EditableWorkspace } from '../../../data/Blank_EditableWorkspace';
import { Blank_ExternalConnectivityChanges } from '../../../data/Blank_ExternalConnectivityChanges';
import { Blank_WorkspaceErrors } from '../../../data/Blank_WorkspaceErrors';
import {
  ActionType,
  CREATE_SNAPSHOT_BEGIN,
  CREATE_SNAPSHOT_FAILURE,
  CREATE_SNAPSHOT_SUCCESS,
  DELETE_SNAPSHOT_BEGIN,
  DELETE_SNAPSHOT_FAILURE,
  DELETE_SNAPSHOT_SUCCESS,
  EDITABLE_WORKSPACE_ADD_DATA_DISK,
  EDITABLE_WORKSPACE_ADD_MACHINE,
  EDITABLE_WORKSPACE_ADD_NAT_RULE,
  EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS,
  EDITABLE_WORKSPACE_ADD_NIC,
  EDITABLE_WORKSPACE_ADD_SHARED_OWNER,
  EDITABLE_WORKSPACE_BUILD_MACHINES,
  EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
  EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC,
  EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE,
  EDITABLE_WORKSPACE_REMOVE_DATA_DISK,
  EDITABLE_WORKSPACE_REMOVE_MACHINE,
  EDITABLE_WORKSPACE_REMOVE_NAT_RULE,
  EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS,
  EDITABLE_WORKSPACE_REMOVE_NIC,
  EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER,
  EDITABLE_WORKSPACE_RESET_CHANGES,
  EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION,
  EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION,
  EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES,
  EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES,
  EDITABLE_WORKSPACE_SAVE_FAILURE,
  EDITABLE_WORKSPACE_SAVE_SUCCESS,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW,
  EDITABLE_WORKSPACE_SET_SAVING,
  EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM,
  EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT,
  EDITABLE_WORKSPACE_UPDATE_DATA_DISK,
  EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK,
  EDITABLE_WORKSPACE_UPDATE_DESCRIPTION,
  EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
  EDITABLE_WORKSPACE_UPDATE_DOMAIN,
  EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY,
  EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB,
  EDITABLE_WORKSPACE_UPDATE_MACHINE_OSDISK_GB,
  EDITABLE_WORKSPACE_UPDATE_NAME,
  EDITABLE_WORKSPACE_UPDATE_SUBNETS,
  EDITABLE_WORKSPACE_UPDATE_VM_NAME,
  EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE,
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE,
  EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
  RESTORE_SNAPSHOT_BEGIN,
  RESTORE_SNAPSHOT_FAILURE,
  RESTORE_SNAPSHOT_SUCCESS,
} from '../../../store/actions/actionTypes';
import {
  EditableWorkspaceAction,
  EditableWorkspaceDomainsPayload,
  EditableWorkspaceMachinesPayload,
} from '../../../store/actions/editableWorkspaceActions';
import editableWorkspaceReducer, {
  editableWorkspaceInitialState,
  ReduxEditableWorkspaceState,
} from '../../../store/reducers/editableWorkspaceReducer';
import { DataDiskErrorTypes } from '../../../types/enums/DataDiskErrorTypes';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { DataDiskError } from '../../../types/Forms/DataDiskError.types';
import { DomainError } from '../../../types/Forms/DomainError.types';
import { MachineSelectionWithCount } from '../../../types/Forms/MachineSelectionWithCount.types';
import { VMNameError } from '../../../types/Forms/VMNameError.types';
import { AzureDNSZoneDtoTestData } from '../../data/AzureDNSZoneDtoTestData';
import { getTestDomainDto } from '../../data/AzureDomainDtoTestData';
import { getTestVirtualNetworkDto } from '../../data/AzureVirtualNetworkTestData';
import { getTestWorkspaceScheduledJobDto } from '../../data/WorkspaceScheduledJobDtoTestDta';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';
import { VirtualMachineCustomDtoTestData } from '../../data/VirtualMachineCustomDtoTestData';
import { Subnet } from '../../../types/AzureWorkspace/Subnet.types';
import { editableWorkspaceSubnetsToTempSubnets } from '../../../shared/TypeConversions';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { SubnetNameError } from '../../../types/Forms/SubnetNameError.types';
import { Blank_AzureWorkspaceForCreationDto } from '../../../data/Blank_AzureWorkspaceForCreationDto';
import { AzureWorkspaceForCreationDto } from '../../../types/ResourceCreation/AzureWorkspaceForCreationDto.types';
import { Blank_WorkspaceScheduledJobError } from '../../../data/Blank_WorkspaceScheduledJobError';
import { MachineImageType } from '../../../types/AzureWorkspace/enums/MachineImageType';
import {
  getTestVirtualMachineSnapshotDto,
  getTestVirtualMachineSnapshotForCreationDto,
} from '../../data/AzureVirtualMachineSnapshotTestData';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';

const initialState = editableWorkspaceInitialState;

describe('Editable Workspace Reducer Tests', () => {
  test('Action with EDITABLE_WORKSPACE_ADD_MACHINE type returns correct state', () => {
    const testError = 'Error';
    const machines: MachineSelectionWithCount[] = [
      { count: 2, machine: { ...VirtualMachineCustomDtoTestData } },
    ];
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_ADD_MACHINE,
      payload: machines,
      error: testError,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.machines).toEqual(machines);
    expect(newState.errors.machineAmount).toBe(testError);
  });
  test('Action with EDITABLE_WORKSPACE_BUILD_MACHINES type returns correct state', () => {
    const startState = {
      ...initialState,
      editableWorkspace: {
        ...initialState.editableWorkspace,
        machines: [
          { count: 2, machine: { ...VirtualMachineCustomDtoTestData } },
        ],
      },
    };
    const payload = [
      getTestVirtualMachineDto({
        MachineImageType: MachineImageType.Marketplace,
      }),
      getTestVirtualMachineDto({
        MachineImageType: MachineImageType.Marketplace,
      }),
    ];
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_BUILD_MACHINES,
      payload,
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.machines).toEqual([]);
    expect(newState.editableWorkspace.VirtualMachines).toEqual(payload);
  });
  test('Action with EDITABLE_WORKSPACE_REMOVE_MACHINE type returns correct state', () => {
    const machines: MachineSelectionWithCount[] = [
      { count: 2, machine: { ...VirtualMachineCustomDtoTestData } },
    ];
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_REMOVE_MACHINE,
      payload: machines,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.machines).toEqual(machines);
  });
  test('Action with EDITABLE_WORKSPACE_RESET_CHANGES type returns correct state', () => {
    const subnets: Record<string, Subnet> = {
      testSubnet: {
        IsRoutable: false,
      },
      testSubnet2: {
        AddressSpace: '1.1.1.1/24',
        IsRoutable: true,
      },
    };
    const virtualNetworks = [
      getTestVirtualNetworkDto({ SubnetProperties: subnets }),
    ];
    const startState = {
      ...initialState,
      editableWorkspace: {
        ...initialState.editableWorkspace,
        Name: 'New Name',
        Description: 'New Description',
        OwnerID: 'New ID',
        SharedOwnerID: ['New ID'],
        VirtualMachines: [getTestVirtualMachineDto({})],
        Location: 'New Location',
        VirtualNetworks: virtualNetworks,
      },
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_RESET_CHANGES,
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.editableWorkspace).toEqual(startState.originalWorkspace);
    expect(newState.subnets).toEqual(
      editableWorkspaceSubnetsToTempSubnets(
        startState.originalWorkspace as AzureWorkspaceDto
      )
    );
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME type returns correct state', () => {
    const testName = 'Test Name';
    const testError = 'This is an error!';
    const testVirtualMachines = [
      getTestVirtualMachineDto(),
      getTestVirtualMachineDto(),
    ];
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME,
      payload: {
        name: testName,
        machines: testVirtualMachines,
      },
      error: testError,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.administratorName).toBe(testName);
    expect(newState.editableWorkspace.VirtualMachines).toEqual(
      testVirtualMachines
    );
  });

  test('Action with EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD type returns correct state', () => {
    const testValue = 'This is a test';
    const testError = 'This is an error!';
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD,
      payload: testValue,
      error: testError,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.administratorPassword).toBe(testValue);
    expect(newState.errors.administratorPassword).toBe(testError);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM type returns correct state', () => {
    const testValue = 'This is a test';
    const testError = 'This is an error!';
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM,
      payload: testValue,
      error: testError,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.administratorPasswordConfirm).toBe(testValue);
    expect(newState.errors.administratorPasswordConfirm).toBe(testError);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_DATA_DISK type returns correct state', () => {
    const dataDiskError: DataDiskError[] = [
      {
        machineIndex: 0,
        diskIndex: 0,
        type: DataDiskErrorTypes.nameError,
        message: 'This is a message',
      },
    ];
    const action: EditableWorkspaceAction = {
      ...getEditableWorkspaceMachinesPayloadAction(
        EDITABLE_WORKSPACE_UPDATE_DATA_DISK
      ),
      error: dataDiskError,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.VirtualMachines).toEqual(
      (action.payload as EditableWorkspaceMachinesPayload).machines
    );
    expect(newState.errors.dataDisks).toEqual(dataDiskError);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE type returns correct state', () => {
    const payload = WorkspaceEditType.EditWorkspace;
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_EDIT_TYPE,
      payload,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.workspaceEditType).toBe(payload);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_DESCRIPTION type returns correct state', () => {
    const testDescription = 'This is a description';
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_DESCRIPTION,
      payload: testDescription,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.Description).toBe(testDescription);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY type returns correct state', () => {
    const testGeography = 'North America';
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY,
      payload: testGeography,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.Geography).toBe(testGeography);
  });
  test.each([
    EDITABLE_WORKSPACE_UPDATE_MACHINE_MEMORY_GB,
    EDITABLE_WORKSPACE_UPDATE_MACHINE_OSDISK_GB,
    EDITABLE_WORKSPACE_ADD_DATA_DISK,
    EDITABLE_WORKSPACE_REMOVE_DATA_DISK,
    EDITABLE_WORKSPACE_ADD_NIC,
    EDITABLE_WORKSPACE_REMOVE_NIC,
    EDITABLE_WORKSPACE_CHANGE_PRIMARY_NIC,
    EDITABLE_WORKSPACE_CHANGE_NIC_SUBNET,
    EDITABLE_WORKSPACE_ADD_NAT_RULE,
    EDITABLE_WORKSPACE_REMOVE_NAT_RULE,
  ])('Action with %s type returns correct state', (type: ActionType) => {
    const action: EditableWorkspaceAction =
      getEditableWorkspaceMachinesPayloadAction(type);
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.VirtualMachines).toEqual(
      (action.payload as EditableWorkspaceMachinesPayload).machines
    );
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_NAME type returns correct state', () => {
    const testName = 'This is a name';
    const testError = 'Error';
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_NAME,
      payload: testName,
      error: testError,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.Name).toBe(testName);
    expect(newState.errors.workspaceName).toBe(testError);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_VM_NAME type returns correct state', () => {
    const testError: VMNameError = {
      machineIndex: 0,
      message: 'This is an error!',
    };
    const action: EditableWorkspaceAction = {
      ...getEditableWorkspaceMachinesPayloadAction(
        EDITABLE_WORKSPACE_UPDATE_VM_NAME
      ),
      error: [testError],
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.VirtualMachines).toEqual(
      (action.payload as EditableWorkspaceMachinesPayload).machines
    );
    expect(newState.errors.vmNames).toEqual([testError]);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE type returns correct state', () => {
    const payload: AzureWorkspaceForCreationDto = {
      ...Blank_AzureWorkspaceForCreationDto,
      Name: 'test-name',
      VirtualMachines: [getTestVirtualMachineDto({})],
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE,
      payload,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace).toEqual({
      ...payload,
      SecurityLock: false,
      SharedWithSegment: false,
    });
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_SUBNETS type returns correct state', () => {
    const errors: SubnetNameError[] = [{ index: 0, message: 'This is a test' }];
    const subnets: Record<string, Subnet> = {
      testSubnet: {
        IsRoutable: false,
      },
      testSubnet2: {
        AddressSpace: '1.1.1.1/24',
        IsRoutable: true,
      },
    };
    const virtualNetworks = [
      getTestVirtualNetworkDto({ SubnetProperties: subnets }),
    ];
    const editableWorkspace: AzureWorkspaceDto = {
      ...(initialState.editableWorkspace as AzureWorkspaceDto),
      VirtualNetworks: virtualNetworks,
    };
    const tempSubnets =
      editableWorkspaceSubnetsToTempSubnets(editableWorkspace);
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_SUBNETS,
      payload: {
        network: getTestVirtualNetworkDto({ SubnetProperties: subnets }),
        subnets: tempSubnets,
      },
      error: errors,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.subnets).toEqual(tempSubnets);
    expect(newState.editableWorkspace.VirtualNetworks).toEqual(virtualNetworks);
    expect(newState.errors.subnetNames).toEqual(errors);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK type returns correct state', () => {
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK,
      payload: true,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.SecurityLock).toBe(true);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_DNS_ZONE type returns correct state', () => {
    const dnsZone = {
      ...AzureDNSZoneDtoTestData,
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
      payload: dnsZone,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.DNSZone).toBe(dnsZone);
  });
  test('Action with EDITABLE_WORKSPACE_ADD_SHARED_OWNER type returns correct state', () => {
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      editableWorkspace: {
        ...initialState.editableWorkspace,
        SharedOwnerEmails: [],
      },
    };
    const testAlias = 'test alias';
    const testOwnerID = 'test owner id';
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_ADD_SHARED_OWNER,
      payload: {
        alias: testAlias,
        id: testOwnerID,
      },
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.editableWorkspace.SharedOwnerEmails).toEqual([testAlias]);
    expect(newState.editableWorkspace.SharedOwnerIDs).toEqual([testOwnerID]);
  });
  test('Action with EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER type returns correct state', () => {
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      editableWorkspace: {
        ...initialState.editableWorkspace,
        SharedOwnerEmails: [],
      },
    };
    const testAlias = ['test alias'];
    const testOwnerID = ['test owner id'];
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER,
      payload: {
        emails: testAlias,
        ids: testOwnerID,
      },
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.editableWorkspace.SharedOwnerEmails).toEqual(testAlias);
    expect(newState.editableWorkspace.SharedOwnerIDs).toEqual(testOwnerID);
  });
  test('Action with EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS type returns correct state', () => {
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_ADD_NEW_IP_ADDRESS,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.externalConnectivityChanges.NewPublicAddressCount).toBe(
      initialState.externalConnectivityChanges.NewPublicAddressCount + 1
    );
  });
  test.each([3, 0])(
    'Action with EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS type returns correct state',
    (newPublicAddressCount) => {
      const startState: ReduxEditableWorkspaceState = {
        ...initialState,
        externalConnectivityChanges: {
          ...initialState.externalConnectivityChanges,
          NewPublicAddressCount: newPublicAddressCount,
        },
      };
      const action: EditableWorkspaceAction = {
        type: EDITABLE_WORKSPACE_REMOVE_NEW_IP_ADDRESS,
      };
      const newState = editableWorkspaceReducer(startState, action);
      expect(newState.externalConnectivityChanges.NewPublicAddressCount).toBe(
        Math.max(
          startState.externalConnectivityChanges.NewPublicAddressCount - 1,
          0
        )
      );
    }
  );
  test('Action with EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW type returns correct state', () => {
    const payload = WorkspaceEditType.NewTemplateWorkspace;
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_NEW,
      payload,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.workspaceEditType).toBe(payload);
  });
  test('Action with EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT type returns correct state', () => {
    const payload = { ...Blank_AzureWorkspaceDto, Name: 'Test Name' };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_SET_CURRENT_WORKSPACE_EDIT,
      payload,
      isAdminSelection: false,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.workspaceEditType).toBe(WorkspaceEditType.EditWorkspace);
    expect(newState.editableWorkspace).toEqual(payload);
    expect(newState.originalWorkspace).toEqual(payload);
    expect(newState.isAdminSelection).toEqual(false);
  });
  test('Action with EDITABLE_WORKSPACE_SET_SAVING type returns correct state', () => {
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_SET_SAVING,
      payload: true,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.saving).toBe(true);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_DOMAIN type returns correct state', () => {
    const payload: EditableWorkspaceMachinesPayload &
      EditableWorkspaceDomainsPayload = {
      ...(getEditableWorkspaceMachinesPayloadAction(
        EDITABLE_WORKSPACE_UPDATE_DOMAIN
      ).payload as EditableWorkspaceMachinesPayload),
      domains: [getTestDomainDto({})],
    };
    const domainErrors: DomainError[] = [
      {
        domainID: 'test',
        message: 'this is a test',
      },
    ];
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_DOMAIN,
      payload,
      error: domainErrors,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.VirtualMachines).toEqual(
      payload.machines
    );
    expect(newState.editableWorkspace.Domains).toEqual(payload.domains);
    expect(newState.errors.domains).toBe(domainErrors);
  });
  test('Action with EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES type returns correct state', () => {
    const payload = { ...Blank_EditableWorkspace, Name: 'Test' };
    const error = { ...Blank_WorkspaceErrors, workspaceName: 'Test Error' };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_RESET_WORKSPACE_CHANGES,
      payload,
      error,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace).toEqual(payload);
    expect(newState.errors).toEqual(error);
  });
  test('Action with EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES type returns correct state', () => {
    const subnets: Record<string, Subnet> = {
      testSubnet: {
        IsRoutable: false,
      },
      testSubnet2: {
        AddressSpace: '1.1.1.1/24',
        IsRoutable: true,
      },
    };
    const originalWorkspace: AzureWorkspaceDto = {
      ...(initialState.originalWorkspace as AzureWorkspaceDto),
      VirtualNetworks: [
        getTestVirtualNetworkDto({ SubnetProperties: subnets }),
      ],
    };
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      originalWorkspace,
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_RESET_SUBNET_CHANGES,
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.subnets).toEqual(
      editableWorkspaceSubnetsToTempSubnets(originalWorkspace)
    );
  });
  test('Action with EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE type returns correct state', () => {
    const payload: EditableWorkspaceMachinesPayload &
      EditableWorkspaceDomainsPayload = {
      ...(getEditableWorkspaceMachinesPayloadAction(
        EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE
      ).payload as EditableWorkspaceMachinesPayload),
      domains: [getTestDomainDto({})],
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_REMOVE_CONFIGURED_MACHINE,
      payload,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace.VirtualMachines).toEqual(
      payload.machines
    );
    expect(newState.editableWorkspace.Domains).toEqual(payload.domains);
  });
  test('Action with EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION type returns correct state', () => {
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      machines: [{ count: 2, machine: { ...VirtualMachineCustomDtoTestData } }],
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_RESET_MACHINE_SELECTION,
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.machines).toEqual([]);
  });
  test('Action with EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION type returns correct state', () => {
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      editableWorkspace: {
        ...initialState.editableWorkspace,
        VirtualMachines: [
          getTestVirtualMachineDto({ ID: 'test-id-1' }),
          getTestVirtualMachineDto({ ID: 'test-id-2' }),
          getTestVirtualMachineDto({ ID: 'test-id-3' }),
        ],
        Domains: [getTestDomainDto()],
      },
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_RESET_CONFIGURED_MACHINE_SELECTION,
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.editableWorkspace.VirtualMachines).toEqual([]);
    expect(newState.editableWorkspace.Domains).toEqual([]);
  });
  test('Action with EDITABLE_WORKSPACE_SAVE_FAILURE type returns correct state', () => {
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      lastSaveSuccess: true,
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_SAVE_FAILURE,
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.lastSaveSuccess).toBe(false);
  });
  test('Action with EDITABLE_WORKSPACE_SAVE_SUCCESS type returns correct state', () => {
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      editableWorkspace: {
        ...initialState.editableWorkspace,
        VirtualMachines: [getTestVirtualMachineDto({})],
      },
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_SAVE_SUCCESS,
    };
    const newState = editableWorkspaceReducer(startState, action);
    expect(newState.lastSaveSuccess).toBe(true);
    expect(newState.originalWorkspace).toEqual(newState.editableWorkspace);
    expect(newState.externalConnectivityChanges).toEqual(
      Blank_ExternalConnectivityChanges
    );
    expect(newState.errors).toEqual(Blank_WorkspaceErrors);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT type returns correct state', () => {
    const newEditedWorkspace = {
      ...initialState.editableWorkspace,
      VirtualMachines: [getTestVirtualMachineDto({})],
      Name: 'Test Name 1',
    };
    const newOriginalWorkspace = {
      ...initialState.originalWorkspace,
      VirtualMachines: [getTestVirtualMachineDto({})],
      Name: 'Test Name 2',
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_CURRENT_WORKSPACE_EDIT,
      payload: {
        editedWorkspace: newEditedWorkspace,
        originalWorkspace: newOriginalWorkspace,
      },
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editableWorkspace).toEqual(newEditedWorkspace);
    expect(newState.originalWorkspace).toEqual(newOriginalWorkspace);
  });
  test('Action with EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB type returns correct state', () => {
    const payload = getTestWorkspaceScheduledJobDto({
      TimeZone: 'workspace-scheduled-job-timezone',
      ScheduledDays: 'Monday',
      AutoStartTimeOfDay: '00:00',
      AutoStopTimeOfDay: '12:30',
    });
    const error = {
      ...Blank_WorkspaceScheduledJobError,
      timeZoneError: 'This is an error',
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_SET_WORKSPACE_SCHEDULED_JOB,
      payload,
      error,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editedWorkspaceScheduledJob).toEqual(payload);
    expect(newState.originalWorkspaceScheduledJob).toEqual(payload);
    expect(newState.errors.workspaceScheduledJob).toEqual(error);
  });
  test('Action with EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB type returns correct state', () => {
    const payload = getTestWorkspaceScheduledJobDto({
      TimeZone: 'workspace-scheduled-job-timezone',
      ScheduledDays: 'Monday',
      AutoStartTimeOfDay: '00:00',
      AutoStopTimeOfDay: '12:30',
    });
    const error = {
      ...Blank_WorkspaceScheduledJobError,
      timeError: 'This is an error',
    };
    const action: EditableWorkspaceAction = {
      type: EDITABLE_WORKSPACE_UPDATE_WORKSPACE_SCHEDULED_JOB,
      payload,
      error,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState.editedWorkspaceScheduledJob).toEqual(payload);
    expect(newState.originalWorkspaceScheduledJob).toEqual(
      initialState.originalWorkspaceScheduledJob
    );
    expect(newState.errors.workspaceScheduledJob).toEqual(error);
  });
  test.each([
    CREATE_SNAPSHOT_BEGIN,
    RESTORE_SNAPSHOT_BEGIN,
    DELETE_SNAPSHOT_BEGIN,
  ])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (actionType) => {
      const testVirtualMachineID = 'test-virtual-machine-id-1';
      const snapshot = getTestVirtualMachineSnapshotForCreationDto({
        VirtualMachineID: testVirtualMachineID,
      });
      const action: EditableWorkspaceAction = {
        type: actionType as ActionType,
        payload: snapshot,
      };
      const newState = editableWorkspaceReducer(initialState, action);
      expect(newState.snapshotVirtualMachineSavingID).toBe(
        testVirtualMachineID
      );
    }
  );
  test.each([
    CREATE_SNAPSHOT_FAILURE,
    RESTORE_SNAPSHOT_SUCCESS,
    RESTORE_SNAPSHOT_FAILURE,
    DELETE_SNAPSHOT_FAILURE,
  ])(
    // eslint-disable-next-line jest/no-identical-title
    'Action with %s type returns correct state',
    (actionType) => {
      const testVirtualMachineID = 'test-virtual-machine-id-1';
      const action: EditableWorkspaceAction = {
        type: actionType as ActionType,
      };
      const startState = {
        ...initialState,
        snapshotVirtualMachineSavingID: testVirtualMachineID,
      };
      const newState = editableWorkspaceReducer(startState, action);
      expect(newState.snapshotVirtualMachineSavingID).toBe('');
    }
  );
  test('Action with CREATE_SNAPSHOT_SUCCESS type returns correct state', () => {
    const testVirtualMachineID = 'test-virtual-machine-id-1';
    const testSnapshotID1 = 'test-snapshot-id-1';
    const testSnapshotID2 = 'test-snapshot-id-2';
    const testSnapshotID3 = 'test-snapshot-id-3';
    const snapshotToCreate = getTestVirtualMachineSnapshotDto({
      VirtualMachineID: testVirtualMachineID,
      ID: testSnapshotID3,
    });
    const virtualMachineList = [
      getTestVirtualMachineDto({
        ID: testVirtualMachineID,
        Snapshots: [
          getTestVirtualMachineSnapshotDto({
            ID: testSnapshotID1,
            VirtualMachineID: testVirtualMachineID,
          }),
          getTestVirtualMachineSnapshotDto({
            ID: testSnapshotID2,
            VirtualMachineID: testVirtualMachineID,
          }),
        ],
      }),
    ];
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      originalWorkspace: {
        ...initialState.originalWorkspace,
        VirtualMachines: virtualMachineList,
      },
      editableWorkspace: {
        ...initialState.editableWorkspace,
        VirtualMachines: virtualMachineList,
      },
      snapshotVirtualMachineSavingID: testVirtualMachineID,
    };
    const action: EditableWorkspaceAction = {
      type: CREATE_SNAPSHOT_SUCCESS,
      payload: snapshotToCreate,
    };
    const newState = editableWorkspaceReducer(startState, action);
    const editableWorkspaceSnapshots = (
      newState.editableWorkspace.VirtualMachines as AzureVirtualMachineDto[]
    ).find((vm) => vm.ID === testVirtualMachineID).Snapshots;
    const originalWorkspaceSnapshots = (
      newState.originalWorkspace.VirtualMachines as AzureVirtualMachineDto[]
    ).find((vm) => vm.ID === testVirtualMachineID).Snapshots;
    expect(newState.snapshotVirtualMachineSavingID).toBe('');
    expect(editableWorkspaceSnapshots).toContainEqual(snapshotToCreate);
    expect(originalWorkspaceSnapshots).toContainEqual(snapshotToCreate);
  });
  test('Action with DELETE_SNAPSHOT_SUCCESS type returns correct state', () => {
    const testVirtualMachineID = 'test-virtual-machine-id-1';
    const testSnapshotID1 = 'test-snapshot-id-1';
    const testSnapshotID2 = 'test-snapshot-id-2';
    const testSnapshotID3 = 'test-snapshot-id-3';
    const snapshotToDelete = getTestVirtualMachineSnapshotDto({
      VirtualMachineID: testVirtualMachineID,
      ID: testSnapshotID2,
    });
    const virtualMachineList = [
      getTestVirtualMachineDto({
        ID: testVirtualMachineID,
        Snapshots: [
          getTestVirtualMachineSnapshotDto({
            ID: testSnapshotID1,
            VirtualMachineID: testVirtualMachineID,
          }),
          snapshotToDelete,
          getTestVirtualMachineSnapshotDto({
            ID: testSnapshotID3,
            VirtualMachineID: testVirtualMachineID,
          }),
        ],
      }),
    ];
    const startState: ReduxEditableWorkspaceState = {
      ...initialState,
      originalWorkspace: {
        ...initialState.originalWorkspace,
        VirtualMachines: virtualMachineList,
      },
      editableWorkspace: {
        ...initialState.editableWorkspace,
        VirtualMachines: virtualMachineList,
      },
      snapshotVirtualMachineSavingID: testVirtualMachineID,
    };
    const action: EditableWorkspaceAction = {
      type: DELETE_SNAPSHOT_SUCCESS,
      payload: snapshotToDelete,
    };
    const newState = editableWorkspaceReducer(startState, action);
    const editableWorkspaceSnapshots = (
      newState.editableWorkspace.VirtualMachines as AzureVirtualMachineDto[]
    ).find((vm) => vm.ID === testVirtualMachineID).Snapshots;
    const originalWorkspaceSnapshots = (
      newState.originalWorkspace.VirtualMachines as AzureVirtualMachineDto[]
    ).find((vm) => vm.ID === testVirtualMachineID).Snapshots;
    expect(newState.snapshotVirtualMachineSavingID).toBe('');
    expect(editableWorkspaceSnapshots).not.toContainEqual(
      expect.objectContaining({ ID: snapshotToDelete.ID })
    );
    expect(originalWorkspaceSnapshots).not.toContainEqual(
      expect.objectContaining({ ID: snapshotToDelete.ID })
    );
  });
  test('Default case returns initial state', () => {
    const action: EditableWorkspaceAction = {
      type: null,
    };
    const newState = editableWorkspaceReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
const getEditableWorkspaceMachinesPayloadAction = (
  type: ActionType
): EditableWorkspaceAction => {
  const id1 = Math.floor(Math.random() * 100).toString();
  const id2 = Math.floor(Math.random() * 100 + 101).toString();
  const name1 = `vmName-${id1}`;
  const name2 = `vmName-${id2}`;
  return {
    type,
    payload: {
      machines: [
        getTestVirtualMachineDto({ ID: id1, Name: name1 }),
        getTestVirtualMachineDto({ ID: id2, Name: name2 }),
      ],
    },
  };
};
