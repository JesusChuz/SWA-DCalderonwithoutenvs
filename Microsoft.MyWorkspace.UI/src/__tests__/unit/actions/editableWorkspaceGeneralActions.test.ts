import {
  AdministratorNameRequired,
  AdministratorPasswordRequired,
  NewWorkspaceNameEmptyError,
  NoError,
  PasswordConfirmMustMatch,
} from '../../../store/validators/ErrorConstants';
import {
  editableWorkspaceAddSharedOwner,
  editableWorkspaceRemoveSharedOwner,
  editableWorkspaceUpdateAdministratorName,
  editableWorkspaceUpdateAdministratorPassword,
  editableWorkspaceUpdateAdministratorPasswordConfirm,
  editableWorkspaceUpdateDeleteLock,
  editableWorkspaceUpdateDescription,
  editableWorkspaceUpdateGeography,
  editableWorkspaceUpdateName,
  editableWorkspaceUpdateWithTemplate,
} from '../../../store/actions/editableWorkspaceActions/editableWorkspaceGeneralActions';
import {
  EDITABLE_WORKSPACE_ADD_SHARED_OWNER,
  EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD,
  EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM,
  EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK,
  EDITABLE_WORKSPACE_UPDATE_DESCRIPTION,
  EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY,
  EDITABLE_WORKSPACE_UPDATE_NAME,
  EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE,
} from '../../../store/actions/actionTypes';
import {
  workspaceValidateAdministratorPassword,
  workspaceValidateConfirmPassword,
  workspaceValidateName,
} from '../../../store/validators/workspaceValidators';
import { AzureVirtualMachineForCreationTestData } from '../../data/AzureVirtualMachineForCreationTestData';
import { EditableWorkspace } from '../../../types/Forms/EditableWorkspace.types';
import { editableWorkspaceInitialState } from '../../../store/reducers/editableWorkspaceReducer';
import { getMockStore } from '../../utils/mockStore.util';
import { WorkspaceTemplateDtoTestData } from '../../data/WorkspaceTemplateDtoTestData';
import { WorkspaceTemplateDto } from '../../../types/Catalog/WorkspaceTemplateDto.types';
import { EditableWorkspaceAction } from '../../../store/actions/editableWorkspaceActions';
import { MachineImageType } from '../../../types/AzureWorkspace/enums/MachineImageType';
import { EMPTY_GUID } from '../../../shared/Constants';
import { workspaceValidateAdministratorName } from '../../../shared/AdministratorNameHelper';

const store = getMockStore({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    editableWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      VirtualMachines: [AzureVirtualMachineForCreationTestData],
    },
  },
});

jest.mock('../../../store/validators/workspaceValidators');
jest.mock('../../../shared/AdministratorNameHelper');

describe('Workspace General Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });

  test.each([
    ['New Workspace', NoError],
    ['', NewWorkspaceNameEmptyError],
  ])(
    'editableWorkspaceUpdateName action creator contains expected type, payload and error',
    (name, error) => {
      const expectedAction = {
        type: EDITABLE_WORKSPACE_UPDATE_NAME,
        payload: name,
        error,
      };
      (workspaceValidateName as jest.Mock).mockImplementation(() => error);
      store.dispatch(editableWorkspaceUpdateName(name));
      expect(store.getActions()).toEqual([expectedAction]);
    }
  );

  test('editableWorkspaceUpdateDescription action creator contains expected type and payload', () => {
    const newWorkspaceDescriptionString = 'New Description';
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_DESCRIPTION,
      payload: newWorkspaceDescriptionString,
    };
    store.dispatch(
      editableWorkspaceUpdateDescription(newWorkspaceDescriptionString)
    );
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceUpdateDeleteLock action creator contains expected type and payload', () => {
    const newDeleteLockValue = true;
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_DELETE_LOCK,
      payload: newDeleteLockValue,
    };
    store.dispatch(editableWorkspaceUpdateDeleteLock(newDeleteLockValue));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test.each([
    ['John Smith', NoError],
    ['', AdministratorNameRequired],
  ])(
    'editableWorkspaceUpdateAdministratorName action creator contains expected type, payload and error',
    async (administratorName, error) => {
      const expectedAction = {
        type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_NAME,
        payload: {
          name: administratorName,
          machines: [
            {
              ...AzureVirtualMachineForCreationTestData,
              AdministratorName: administratorName,
            },
          ],
        },
        error,
      };
      (workspaceValidateAdministratorName as jest.Mock).mockImplementation(
        () => error
      );
      await editableWorkspaceUpdateAdministratorName(administratorName)(
        store.dispatch,
        store.getState
      );
      expect(store.getActions()).toEqual([expectedAction]);
    }
  );

  test.each([
    ['thisIsATest', NoError],
    ['', AdministratorPasswordRequired],
  ])(
    'editableWorkspaceUpdateAdministratorPassword action creator contains expected type, payload and error',
    async (administratorPassword, error) => {
      const expectedAction = {
        type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD,
        payload: administratorPassword,
        error,
      };
      (workspaceValidateAdministratorPassword as jest.Mock).mockImplementation(
        () => error
      );
      await editableWorkspaceUpdateAdministratorPassword(administratorPassword)(
        store.dispatch,
        store.getState
      );
      expect(store.getActions()).toContainEqual(expectedAction);
    }
  );

  test.each([
    ['thisIsATest', NoError],
    ['matchingPassword', PasswordConfirmMustMatch],
  ])(
    'editableWorkspaceUpdateAdministratorPasswordConfirm action creator contains expected type, payload and error',
    async (administratorPassword, error) => {
      const expectedAction = {
        type: EDITABLE_WORKSPACE_UPDATE_ADMINISTRATOR_PASSWORD_CONFIRM,
        payload: administratorPassword,
        error,
      };
      (workspaceValidateConfirmPassword as jest.Mock).mockImplementation(
        () => error
      );
      await editableWorkspaceUpdateAdministratorPasswordConfirm(
        administratorPassword
      )(store.dispatch, store.getState);
      expect(store.getActions()).toEqual([expectedAction]);
    }
  );

  test('editableWorkspaceUpdateWithTemplate action creator contains expected type and payload', async () => {
    const template: WorkspaceTemplateDto = WorkspaceTemplateDtoTestData;
    const expectedType = EDITABLE_WORKSPACE_UPDATE_WITH_TEMPLATE;
    await editableWorkspaceUpdateWithTemplate(template)(
      store.dispatch,
      store.getState
    );
    const [action]: EditableWorkspaceAction[] = store.getActions();
    const payload = action.payload as EditableWorkspace;
    expect(action.type).toEqual(expectedType);
    expect(payload.TemplateID).toEqual(template.ID);
    expect(payload.Name).toEqual(template.Name);
    expect(payload.Description).toEqual(template.Description);
    expect(payload.Domains).toEqual(template.Domains);
    expect(payload.VirtualMachines).toEqual([
      ...template.VirtualMachines.map((vm) =>
        expect.objectContaining({
          ...vm,
          MachineImageType: MachineImageType.SharedImage,
        })
      ),
    ]);
    expect(payload.VirtualNetworks).toEqual(template.VirtualNetworks);
    expect(payload.Location).toBe('');
    expect(payload.SubscriptionID).toBe(EMPTY_GUID);
  });

  test('editableWorkspaceAddSharedOwner action creator contains expected type and payload', () => {
    const alias = 'test alias';
    const id = '12345678-4321-1234-1234-56789012345';
    const expectedAction = {
      type: EDITABLE_WORKSPACE_ADD_SHARED_OWNER,
      payload: {
        alias,
        id,
      },
    };
    store.dispatch(editableWorkspaceAddSharedOwner(alias, id));
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceRemoveSharedOwner action creator contains expected type and payload', async () => {
    const remainingSharedOwnerID = '98745678-7323-1245-5434-56789012321';
    const remainingSharedOwnerEmail = 'testemail@microsoft.com';
    const removedSharedOwnerID = '98741234-7323-1245-5434-56789012321';
    const removedSharedOwnerEmail = 'testemail2@microsoft.com';
    const store = getMockStore({
      editableWorkspace: {
        ...editableWorkspaceInitialState,
        editableWorkspace: {
          ...editableWorkspaceInitialState.editableWorkspace,
          SharedOwnerIDs: [removedSharedOwnerID, remainingSharedOwnerID],
          SharedOwnerEmails: [
            removedSharedOwnerEmail,
            remainingSharedOwnerEmail,
          ],
        },
      },
    });
    const expectedAction = {
      type: EDITABLE_WORKSPACE_REMOVE_SHARED_OWNER,
      payload: {
        ids: [remainingSharedOwnerID],
        emails: [remainingSharedOwnerEmail],
      },
    };
    await editableWorkspaceRemoveSharedOwner(0)(store.dispatch, store.getState);
    expect(store.getActions()).toEqual([expectedAction]);
  });

  test('editableWorkspaceUpdateGeography action creator contains expected type and payload', () => {
    const newGeography = 'North America';
    const expectedAction = {
      type: EDITABLE_WORKSPACE_UPDATE_GEOGRAPHY,
      payload: newGeography,
    };
    store.dispatch(editableWorkspaceUpdateGeography(newGeography));
    expect(store.getActions()).toEqual([expectedAction]);
  });
});
