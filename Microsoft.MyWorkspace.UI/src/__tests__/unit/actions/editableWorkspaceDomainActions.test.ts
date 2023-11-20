import {
  editableWorkspaceInitialState,
  ReduxEditableWorkspaceState,
} from '../../../store/reducers/editableWorkspaceReducer';
import { AzureVirtualMachineDto } from '../../../types/AzureWorkspace/AzureVirtualMachineDto.types';
import { getTestVirtualMachineDto } from '../../data/AzureVirtualMachineTestData';
import cloneDeep from 'lodash/cloneDeep';
import { getMockStore } from '../../utils/mockStore.util';
import { AzureDomainDtoTestData } from '../../data/AzureDomainDtoTestData';
import {
  EditableWorkspaceAction,
  EditableWorkspaceDomainsPayload,
  EditableWorkspaceMachinesPayload,
  editableWorkspaceUpdateDomainMemberDomain,
  editableWorkspaceUpdateDomainName,
  editableWorkspaceUpdateDomainRole,
} from '../../../store/actions/editableWorkspaceActions';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { UserProfileDto } from '../../../types/Catalog/UserProfileDto.types';
import {
  getFirstValidDomain,
  validateDomainController,
  validateDomainMember,
  validateDomainSubnets,
  workspaceValidateDomainNames,
} from '../../../store/validators/workspaceValidators';
import {
  EDITABLE_WORKSPACE_UPDATE_DOMAIN,
  SHOW_BLOCKED_NOTIFICATION,
  SHOW_ERROR_NOTIFICATION,
} from '../../../store/actions/actionTypes';
import { DomainError } from '../../../types/Forms/DomainError.types';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { getEditableWorkspace } from '../../utils/helpers.util';
import { Themes } from '../../../types/enums/Themes';

const virtualMachineID1 = '12300000-0000-0000-0000-000000000001';
const virtualMachineID2 = '12300000-0000-0000-0000-000000000002';
const domainID = '12300000-0000-0000-0000-000000000014';
const domainID2 = '12300000-0000-0000-0000-000000000015';
const nonExistentDomainID = '12300000-0000-0000-0000-000000000016';
const userProfileID = '12300000-0000-0000-0000-000000000017';

const generalUserProfile: UserProfileDto = {
  ID: userProfileID,
  AcceptedAgreements: [],
  GivenName: 'John',
  Surname: 'Doe',
  Mail: 'test@outlook.com',
  RuntimeExtensionHoursRemaining: 0,
  QuotaWeek: 0,
  SeenFeatures: [],
  DisplayNewUserWalkthrough: false,
  Preferences: {
    Theme: Themes.Dark,
    DashboardCards: [],
  },
};

const virtualMachineList: AzureVirtualMachineDto[] = [
  getTestVirtualMachineDto({
    ID: virtualMachineID1,
  }),
  getTestVirtualMachineDto({
    ID: virtualMachineID2,
  }),
];

const getEditableWorkspaceState = (): {
  editableWorkspace: ReduxEditableWorkspaceState;
} => ({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    editableWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      VirtualMachines: cloneDeep(virtualMachineList),
      Domains: [
        { ...AzureDomainDtoTestData, ID: domainID },
        { ...AzureDomainDtoTestData, ID: domainID2 },
      ],
    },
  },
});

const setMachineDomainAndRole = (
  newEditableWorkspace: EditableWorkspace,
  machineIndex: number,
  domainRole: DomainRoles,
  domainID: string
) => {
  newEditableWorkspace.VirtualMachines[machineIndex].DomainRole = domainRole;
  newEditableWorkspace.VirtualMachines[machineIndex].DomainID = domainID;
};

jest.mock('../../../store/validators/quotaValidators');
jest.mock('../../../store/validators/workspaceValidators');

const store = getMockStore(getEditableWorkspaceState());

describe('Workspace Domain Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test.each([
    [0, ''],
    [1, ''],
    [0, 'Test Domain Name Error'],
    [1, 'Test Domain Name Error'],
  ])(
    'editableWorkspaceUpdateDomainRole action creator contains expected type, payload and error from Workgroup Member to Domain Member (case %#)',
    async (machineIndex, domainNameError) => {
      const expectedType = EDITABLE_WORKSPACE_UPDATE_DOMAIN;
      const editableWorkspace = getEditableWorkspace(store.getState());
      const expectedMachines = [...editableWorkspace.VirtualMachines];
      const expectedDomains = [...editableWorkspace.Domains];

      expectedMachines.splice(machineIndex, 1, {
        ...expectedMachines[machineIndex],
        DomainRole: DomainRoles.DomainMember,
        DomainID: expectedDomains[0].ID,
      });

      const expectedPayload = {
        machines: expectedMachines,
        domains: expectedDomains,
      };
      (validateDomainMember as jest.Mock).mockImplementation(() => null);
      (workspaceValidateDomainNames as jest.Mock).mockImplementation(
        () => domainNameError
      );
      (getFirstValidDomain as jest.Mock).mockImplementation(
        () => expectedDomains[0]
      );

      await editableWorkspaceUpdateDomainRole(
        machineIndex,
        DomainRoles.DomainMember,
        generalUserProfile
      )(store.dispatch, store.getState);

      const [action]: EditableWorkspaceAction[] = store.getActions();
      expect(action).toEqual({
        type: expectedType,
        payload: expectedPayload,
        error: domainNameError,
      });
    }
  );
  test.each([
    [0, ''],
    [1, ''],
    [0, 'Test Domain Name Error'],
    [1, 'Test Domain Name Error'],
  ])(
    'editableWorkspaceUpdateDomainRole action creator contains expected type, payload and error from Workgroup Member to Domain Controller (case %#)',
    async (machineIndex, domainNameError) => {
      const expectedType = EDITABLE_WORKSPACE_UPDATE_DOMAIN;
      const editableWorkspace = getEditableWorkspace(store.getState());
      const previousDomain = [...editableWorkspace.Domains];

      (validateDomainController as jest.Mock).mockImplementation(() => null);
      (workspaceValidateDomainNames as jest.Mock).mockImplementation(() => [
        domainNameError,
      ]);

      await editableWorkspaceUpdateDomainRole(
        machineIndex,
        DomainRoles.DomainController,
        generalUserProfile
      )(store.dispatch, store.getState);

      const [action]: EditableWorkspaceAction[] = store.getActions();
      expect(action.type).toBe(expectedType);
      const error = action.error as DomainError[];
      expect(error).toEqual([domainNameError]);
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      expect(payload.domains).toHaveLength(previousDomain.length + 1);
      const newDomainID = payload.domains[payload.domains.length - 1].ID;
      const updatedMachine = payload.machines[machineIndex];
      expect(updatedMachine.DomainID).toBe(newDomainID);
    }
  );
  test.each([
    [0, ''],
    [1, ''],
    [0, 'Test Domain Name Error'],
    [1, 'Test Domain Name Error'],
  ])(
    'editableWorkspaceUpdateDomainRole action creator contains expected type, payload and error from Domain Member to Workgroup Member (case %#)',
    async (machineIndex, domainNameError) => {
      const expectedType = EDITABLE_WORKSPACE_UPDATE_DOMAIN;
      const editableWorkspaceState = cloneDeep(getEditableWorkspaceState());
      const newEditableWorkspace =
        editableWorkspaceState.editableWorkspace.editableWorkspace;
      const updateDomainID = newEditableWorkspace.Domains[0].ID;
      setMachineDomainAndRole(
        newEditableWorkspace,
        machineIndex,
        DomainRoles.DomainMember,
        updateDomainID
      );
      const store = getMockStore(editableWorkspaceState);

      (workspaceValidateDomainNames as jest.Mock).mockImplementation(() => [
        domainNameError,
      ]);

      await editableWorkspaceUpdateDomainRole(
        machineIndex,
        DomainRoles.WorkgroupMember,
        generalUserProfile
      )(store.dispatch, store.getState);

      const [action]: EditableWorkspaceAction[] = store.getActions();
      expect(action.type).toBe(expectedType);
      const error = action.error as DomainError[];
      expect(error).toEqual([domainNameError]);
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      const updatedMachine = payload.machines[machineIndex];
      expect(updatedMachine.DomainID).toBe(null);
    }
  );
  test.each([
    [0, ''],
    [1, ''],
    [0, 'Test Domain Name Error'],
    [1, 'Test Domain Name Error'],
  ])(
    'editableWorkspaceUpdateDomainRole action creator contains expected type, payload and error from Domain Controller to Workgroup Member (case %#)',
    async (machineIndex, domainNameError) => {
      const expectedType = EDITABLE_WORKSPACE_UPDATE_DOMAIN;
      const editableWorkspaceState = cloneDeep(getEditableWorkspaceState());
      const newEditableWorkspace =
        editableWorkspaceState.editableWorkspace.editableWorkspace;
      const updateDomainID = newEditableWorkspace.Domains[0].ID;
      setMachineDomainAndRole(
        newEditableWorkspace,
        machineIndex,
        DomainRoles.DomainController,
        updateDomainID
      );

      const store = getMockStore(editableWorkspaceState);

      (workspaceValidateDomainNames as jest.Mock).mockImplementation(() => [
        domainNameError,
      ]);

      await editableWorkspaceUpdateDomainRole(
        machineIndex,
        DomainRoles.WorkgroupMember,
        generalUserProfile
      )(store.dispatch, store.getState);

      const [action]: EditableWorkspaceAction[] = store.getActions();
      expect(action.type).toBe(expectedType);
      const error = action.error as DomainError[];
      expect(error).toEqual([domainNameError]);
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      const updatedMachine = payload.machines[machineIndex];
      expect(updatedMachine.DomainID).toBe(null);
      expect(payload.domains).not.toContainEqual(
        expect.objectContaining({
          ID: updateDomainID,
        })
      );
    }
  );
  test('editableWorkspaceUpdateDomainRole action creator does not dispatch when validateDomainMember validation fails from Workgroup Member to Domain Member', async () => {
    const expectedType = SHOW_BLOCKED_NOTIFICATION;
    (validateDomainMember as jest.Mock).mockImplementation(() => 'Error');

    await editableWorkspaceUpdateDomainRole(
      0,
      DomainRoles.DomainMember,
      generalUserProfile
    )(store.dispatch, store.getState);

    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action).toEqual(
      expect.objectContaining({
        type: expectedType,
      })
    );
  });
  test('editableWorkspaceUpdateDomainRole action creator does not dispatch when getFirstValidDomain returns no valid domain from Workgroup Member to Domain Member', async () => {
    const expectedType = SHOW_BLOCKED_NOTIFICATION;
    (validateDomainMember as jest.Mock).mockImplementation(() => '');
    (getFirstValidDomain as jest.Mock).mockImplementation(() => null);

    await editableWorkspaceUpdateDomainRole(
      0,
      DomainRoles.DomainMember,
      generalUserProfile
    )(store.dispatch, store.getState);

    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action).toEqual(
      expect.objectContaining({
        type: expectedType,
      })
    );
  });
  test('editableWorkspaceUpdateDomainRole action creator does not dispatch when validateDomainController validation fails from Workgroup Member to Domain Controller', async () => {
    const expectedType = SHOW_BLOCKED_NOTIFICATION;
    (validateDomainController as jest.Mock).mockImplementation(() => 'Error');

    await editableWorkspaceUpdateDomainRole(
      0,
      DomainRoles.DomainController,
      generalUserProfile
    )(store.dispatch, store.getState);

    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action).toEqual(
      expect.objectContaining({
        type: expectedType,
      })
    );
  });
  test.each([
    [0, ''],
    [1, ''],
    [0, 'Test Domain Name Error'],
    [1, 'Test Domain Name Error'],
  ])(
    'editableWorkspaceUpdateDomainName action creator contains expected type, payload and error (case %#)',
    async (domainIndex, domainNameError) => {
      const machineIndex = 0;
      const newDomainName = 'Test Domain Name';
      const expectedType = EDITABLE_WORKSPACE_UPDATE_DOMAIN;
      const editableWorkspaceState = cloneDeep(getEditableWorkspaceState());
      const newEditableWorkspace =
        editableWorkspaceState.editableWorkspace.editableWorkspace;
      const updateDomainID = newEditableWorkspace.Domains[domainIndex].ID;
      setMachineDomainAndRole(
        newEditableWorkspace,
        machineIndex,
        DomainRoles.DomainController,
        updateDomainID
      );

      const store = getMockStore(editableWorkspaceState);

      (workspaceValidateDomainNames as jest.Mock).mockImplementation(() => [
        domainNameError,
      ]);

      await editableWorkspaceUpdateDomainName(machineIndex, newDomainName)(
        store.dispatch,
        store.getState
      );

      const [action]: EditableWorkspaceAction[] = store.getActions();
      expect(action.type).toBe(expectedType);
      const error = action.error as DomainError[];
      expect(error).toEqual([domainNameError]);
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      expect(payload.domains.find((d) => d.ID === updateDomainID)).toEqual(
        expect.objectContaining({
          Name: newDomainName,
        })
      );
    }
  );
  test('editableWorkspaceUpdateDomainName action creator does not dispatch when domain does not exist', async () => {
    const expectedType = SHOW_ERROR_NOTIFICATION;
    const machineIndex = 0;
    const newDomainName = 'Test Domain Name';
    const editableWorkspaceState = cloneDeep(getEditableWorkspaceState());
    const newEditableWorkspace =
      editableWorkspaceState.editableWorkspace.editableWorkspace;
    setMachineDomainAndRole(
      newEditableWorkspace,
      machineIndex,
      DomainRoles.DomainController,
      nonExistentDomainID
    );

    const store = getMockStore(editableWorkspaceState);

    await editableWorkspaceUpdateDomainName(machineIndex, newDomainName)(
      store.dispatch,
      store.getState
    );

    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action).toEqual(
      expect.objectContaining({
        type: expectedType,
      })
    );
  });
  test.each([[0], [1]])(
    'editableWorkspaceUpdateDomainMemberDomain action creator contains expected type and payload (case %#)',
    async (domainIndex) => {
      const machineIndex = 0;
      const expectedType = EDITABLE_WORKSPACE_UPDATE_DOMAIN;
      const editableWorkspaceState = cloneDeep(getEditableWorkspaceState());
      const newEditableWorkspace =
        editableWorkspaceState.editableWorkspace.editableWorkspace;
      const newDomainID = newEditableWorkspace.Domains[domainIndex].ID;
      const initialDomainID = newEditableWorkspace.Domains.find(
        (d) => d.ID !== newDomainID
      ).ID;
      setMachineDomainAndRole(
        newEditableWorkspace,
        machineIndex,
        DomainRoles.DomainMember,
        initialDomainID
      );

      const store = getMockStore(editableWorkspaceState);

      (validateDomainSubnets as jest.Mock).mockImplementation(() => '');

      await editableWorkspaceUpdateDomainMemberDomain(
        machineIndex,
        newDomainID
      )(store.dispatch, store.getState);

      const [action]: EditableWorkspaceAction[] = store.getActions();
      expect(action.type).toBe(expectedType);
      const payload = action.payload as EditableWorkspaceMachinesPayload &
        EditableWorkspaceDomainsPayload;
      const updatedMachine = payload.machines[machineIndex];
      expect(updatedMachine.DomainID).toBe(newDomainID);
    }
  );
  test('editableWorkspaceUpdateDomainMemberDomain action creator does not dispatch when domain does not exist', async () => {
    const machineIndex = 0;
    const domainIndex = 0;
    const expectedType = SHOW_ERROR_NOTIFICATION;
    const editableWorkspaceState = cloneDeep(getEditableWorkspaceState());
    const newEditableWorkspace =
      editableWorkspaceState.editableWorkspace.editableWorkspace;
    const initialDomainID = newEditableWorkspace.Domains[domainIndex].ID;
    setMachineDomainAndRole(
      newEditableWorkspace,
      machineIndex,
      DomainRoles.DomainMember,
      initialDomainID
    );

    const store = getMockStore(editableWorkspaceState);

    await editableWorkspaceUpdateDomainMemberDomain(
      machineIndex,
      nonExistentDomainID
    )(store.dispatch, store.getState);

    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action.type).toBe(expectedType);
  });
  test('editableWorkspaceUpdateDomainMemberDomain action creator does not dispatch when validateDomainSubnets validation fails', async () => {
    const machineIndex = 0;
    const domainIndex = 0;
    const expectedType = SHOW_BLOCKED_NOTIFICATION;
    const editableWorkspaceState = cloneDeep(getEditableWorkspaceState());
    const newEditableWorkspace =
      editableWorkspaceState.editableWorkspace.editableWorkspace;
    const newDomainID = newEditableWorkspace.Domains[domainIndex].ID;
    const initialDomainID = newEditableWorkspace.Domains.find(
      (d) => d.ID !== newDomainID
    ).ID;
    setMachineDomainAndRole(
      newEditableWorkspace,
      machineIndex,
      DomainRoles.DomainMember,
      initialDomainID
    );

    const store = getMockStore(editableWorkspaceState);

    (validateDomainSubnets as jest.Mock).mockImplementation(() => 'Error');

    await editableWorkspaceUpdateDomainMemberDomain(machineIndex, newDomainID)(
      store.dispatch,
      store.getState
    );

    const [action]: EditableWorkspaceAction[] = store.getActions();
    expect(action.type).toBe(expectedType);
  });
});
