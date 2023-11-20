import { CatalogAction } from '../../../store/actions';
import {
  FETCH_AZURE_STATUS_BEGIN,
  FETCH_AZURE_STATUS_FAILURE,
  FETCH_AZURE_STATUS_SUCCESS,
  FETCH_CATALOG_AGREEMENTS_BEGIN,
  FETCH_CATALOG_AGREEMENTS_FAILURE,
  FETCH_CATALOG_AGREEMENTS_SUCCESS,
  FETCH_CATALOG_API_VERSION_BEGIN,
  FETCH_CATALOG_API_VERSION_FAILURE,
  FETCH_CATALOG_API_VERSION_SUCCESS,
  FETCH_CATALOG_MACHINES_BEGIN,
  FETCH_CATALOG_MACHINES_FAILURE,
  FETCH_CATALOG_MACHINES_SUCCESS,
  FETCH_CATALOG_MACHINE_SKUS_BEGIN,
  FETCH_CATALOG_MACHINE_SKUS_FAILURE,
  FETCH_CATALOG_MACHINE_SKUS_SUCCESS,
  FETCH_CATALOG_REGIONS_BEGIN,
  FETCH_CATALOG_REGIONS_FAILURE,
  FETCH_CATALOG_REGIONS_SUCCESS,
  FETCH_CATALOG_TEMPLATES_BEGIN,
  FETCH_CATALOG_TEMPLATES_FAILURE,
  FETCH_CATALOG_TEMPLATES_SUCCESS,
  FETCH_CATALOG_USER_PROFILE_BEGIN,
  FETCH_CATALOG_USER_PROFILE_FAILURE,
  FETCH_CATALOG_USER_PROFILE_SUCCESS,
  FETCH_IS_ADMIN_BEGIN,
  FETCH_IS_ADMIN_FAILURE,
  FETCH_IS_ADMIN_SUCCESS,
  FETCH_USER_IMAGE_BEGIN,
  FETCH_USER_IMAGE_FAILURE,
  FETCH_USER_IMAGE_SUCCESS,
  SET_JIT_DISABLED,
  SET_JIT_ENABLED,
  SET_USER_AUTHORIZED,
  SET_USER_UNAUTHORIZED,
  UPDATE_CATALOG_USER_PROFILE_BEGIN,
  UPDATE_CATALOG_USER_PROFILE_FAILURE,
  UPDATE_CATALOG_USER_PROFILE_SUCCESS,
} from '../../../store/actions/actionTypes';

import catalogReducer, {
  catalogInitialState,
} from '../../../store/reducers/catalogReducer';
import { AgreementDto } from '../../../types/Catalog/AgreementDto.types';
import { RegionDto } from '../../../types/Catalog/RegionDto.types';
import { UserProfileDto } from '../../../types/Catalog/UserProfileDto.types';
import { AuthorizationState } from '../../../types/enums/AuthorizationState';
import { Themes } from '../../../types/enums/Themes';
import { AxiosErrorTestData } from '../../data/AxiosErrorTestData';
import { getTestVirtualMachineCustomDto } from '../../data/VirtualMachineCustomDtoTestData';
import { getTestVirtualMachineSkuDto } from '../../data/VirtualMachineSkuDtoTestData';
import { getTestVirtualMachineTemplateDto } from '../../data/VirtualMachineTemplateDtoTestData';
import { getTestWorkspaceTemplateDto } from '../../data/WorkspaceTemplateDtoTestData';

const initialState = catalogInitialState;

const axiosError = { ...AxiosErrorTestData };

describe('Catalog Reducer Tests', () => {
  test('Action with FETCH_AZURE_STATUS_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_AZURE_STATUS_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isAzureStatusLoading).toBe(true);
    expect(newState.isAzureStatusError).toBeNull();
  });
  test('Action with FETCH_AZURE_STATUS_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_AZURE_STATUS_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isAzureStatusLoading).toBe(false);
    expect(newState.isAzureStatusError).toEqual(axiosError);
  });
  test('Action with FETCH_AZURE_STATUS_SUCCESS type returns correct state', () => {
    const payload = 7;
    const action: CatalogAction = {
      type: FETCH_AZURE_STATUS_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isAzureStatusLoading).toBe(false);
    expect(newState.azureIssueCount).toBe(payload);
  });
  test('Action with FETCH_CATALOG_TEMPLATES_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_TEMPLATES_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogTemplatesLoading).toBe(true);
    expect(newState.isCatalogTemplatesError).toBeNull();
  });
  test('Action with FETCH_CATALOG_TEMPLATES_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_TEMPLATES_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogTemplatesLoading).toBe(false);
    expect(newState.isCatalogTemplatesError).toEqual(axiosError);
  });
  test('Action with FETCH_CATALOG_TEMPLATES_SUCCESS type returns correct state', () => {
    const payload = [
      getTestWorkspaceTemplateDto({
        ID: 'workspace-template-1',
        VirtualMachines: [
          getTestVirtualMachineTemplateDto({ Name: 'template-name-1' }),
        ],
      }),
      getTestWorkspaceTemplateDto({
        ID: 'workspace-template-2',
        VirtualMachines: [
          getTestVirtualMachineTemplateDto({ Name: 'template-name-2' }),
        ],
      }),
    ];
    const action: CatalogAction = {
      type: FETCH_CATALOG_TEMPLATES_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.catalogTemplates).toEqual(payload);
    expect(newState.isCatalogTemplatesLoading).toBe(false);
    expect(newState.isCatalogTemplatesError).toBeNull();
  });
  test('Action with FETCH_USER_IMAGE_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_USER_IMAGE_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogUserImageLoading).toBe(true);
    expect(newState.catalogUserImage).toBeNull();
    expect(newState.isCatalogUserImageError).toBeNull();
  });
  test('Action with FETCH_USER_IMAGE_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_USER_IMAGE_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogUserImageLoading).toBe(false);
    expect(newState.isCatalogUserImageError).toEqual(axiosError);
  });
  test('Action with FETCH_USER_IMAGE_SUCCESS type returns correct state', () => {
    const payload = 'image-string';
    const action: CatalogAction = {
      type: FETCH_USER_IMAGE_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.catalogUserImage).toEqual(payload);
    expect(newState.isCatalogUserImageLoading).toBe(false);
  });
  test('Action with FETCH_CATALOG_USER_PROFILE_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_USER_PROFILE_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogUserProfileLoading).toBe(true);
    expect(newState.userProfileLoaded).toBe(false);
    expect(newState.isCatalogUserProfileError).toBeNull();
  });
  test('Action with FETCH_CATALOG_USER_PROFILE_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_USER_PROFILE_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isUpdatingUserProfileLoading).toBe(false);
    expect(newState.isCatalogUserProfileError).toEqual(axiosError);
  });
  test('Action with FETCH_CATALOG_USER_PROFILE_SUCCESS type returns correct state', () => {
    const payload: UserProfileDto = {
      ID: 'user-id',
      AcceptedAgreements: [],
      GivenName: 'test-given-name',
      Surname: 'test-surname',
      Mail: 'test@bing.com',
      RuntimeExtensionHoursRemaining: 0,
      QuotaWeek: 1,
      SeenFeatures: [],
      DisplayNewUserWalkthrough: false,
      Preferences: {
        Theme: Themes.Dark,
        DashboardCards: [],
      },
    };
    const action: CatalogAction = {
      type: FETCH_CATALOG_USER_PROFILE_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.catalogUserProfile).toEqual(payload);
    expect(newState.isCatalogUserProfileLoading).toBe(false);
    expect(newState.isCatalogUserProfileError).toBeNull();
    expect(newState.userProfileLoaded).toBe(true);
  });
  test('Action with UPDATE_CATALOG_USER_PROFILE_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: UPDATE_CATALOG_USER_PROFILE_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isUpdatingUserProfileLoading).toBe(true);
    expect(newState.userProfileLoaded).toBe(false);
    expect(newState.isCatalogUserProfileError).toBeNull();
  });
  test('Action with UPDATE_CATALOG_USER_PROFILE_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: UPDATE_CATALOG_USER_PROFILE_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isUpdatingUserProfileLoading).toBe(false);
    expect(newState.isCatalogUserProfileError).toEqual(axiosError);
  });
  test('Action with UPDATE_CATALOG_USER_PROFILE_SUCCESS type returns correct state', () => {
    const action: CatalogAction = {
      type: UPDATE_CATALOG_USER_PROFILE_SUCCESS,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isUpdatingUserProfileLoading).toBe(false);
    expect(newState.isCatalogUserProfileError).toBeNull();
  });
  test('Action with FETCH_CATALOG_AGREEMENTS_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_AGREEMENTS_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogAgreementsLoading).toBe(true);
    expect(newState.agreementsLoaded).toBe(false);
    expect(newState.isCatalogAgreementsError).toBeNull();
  });
  test('Action with FETCH_CATALOG_AGREEMENTS_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_AGREEMENTS_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogAgreementsLoading).toBe(false);
    expect(newState.agreementsLoaded).toBe(false);
    expect(newState.isCatalogAgreementsError).toEqual(axiosError);
    expect(newState.authorization).toBe(AuthorizationState.unAuthorized);
  });
  test('Action with FETCH_CATALOG_AGREEMENTS_SUCCESS type returns correct state', () => {
    const payload: AgreementDto[] = [
      {
        ID: 'agreement-id-1',
        UpdatedOn: 'updated-on-date-1',
        Retired: false,
        AgreementText: 'agreement-text-1',
        ChangedBy: 'changed-by-1',
      },
    ];
    const action: CatalogAction = {
      type: FETCH_CATALOG_AGREEMENTS_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogAgreementsLoading).toBe(false);
    expect(newState.isCatalogAgreementsError).toBeNull();
    expect(newState.agreements).toEqual(payload);
    expect(newState.agreementsLoaded).toBe(true);
  });
  test('Action with SET_USER_AUTHORIZED type returns correct state', () => {
    const action: CatalogAction = {
      type: SET_USER_AUTHORIZED,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.authorization).toBe(AuthorizationState.authorized);
  });
  test('Action with SET_USER_UNAUTHORIZED type returns correct state', () => {
    const action: CatalogAction = {
      type: SET_USER_UNAUTHORIZED,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.authorization).toBe(AuthorizationState.unAuthorized);
  });
  test('Action with FETCH_IS_ADMIN_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_IS_ADMIN_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isAdmin).toBe(false);
    expect(newState.isAdminError).toBeNull();
  });
  test('Action with FETCH_IS_ADMIN_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_IS_ADMIN_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isAdmin).toBe(false);
    expect(newState.isAdminError).toEqual(axiosError);
  });
  test('Action with FETCH_IS_ADMIN_SUCCESS type returns correct state', () => {
    const payload = true;
    const action: CatalogAction = {
      type: FETCH_IS_ADMIN_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isAdmin).toBe(payload);
    expect(newState.isAdminError).toBeNull();
  });
  test('Action with FETCH_CATALOG_REGIONS_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_REGIONS_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.regionsLoading).toBe(true);
    expect(newState.regionsError).toBeNull();
  });
  test('Action with FETCH_CATALOG_REGIONS_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_REGIONS_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.regions).toEqual([]);
    expect(newState.regionsLoading).toBe(false);
    expect(newState.regionsError).toEqual(axiosError);
  });
  test('Action with FETCH_CATALOG_REGIONS_SUCCESS type returns correct state', () => {
    const payload: RegionDto[] = [
      {
        ID: 'region-id-1',
        Name: 'region-name-1',
        IsPublished: true,
        JitEnabled: true,
        SubscriptionID: 'region-subscription-id-1',
        Location: 'region-location-1',
        NumberOfAvailableSKUs: 1,
        NumberOfTotalSKUs: 20,
        FirewallID: 'region-firewall-id-1',
      },
    ];
    const action: CatalogAction = {
      type: FETCH_CATALOG_REGIONS_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.regions).toEqual(payload);
    expect(newState.regionsLoading).toBe(false);
    expect(newState.regionsError).toBeNull();
  });
  test('Action with FETCH_CATALOG_MACHINES_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_MACHINES_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogMachinesLoading).toBe(true);
    expect(newState.isCatalogMachinesError).toBeNull();
  });
  test('Action with FETCH_CATALOG_MACHINES_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_MACHINES_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogMachinesLoading).toBe(false);
    expect(newState.isCatalogMachinesError).toEqual(axiosError);
  });
  test('Action with FETCH_CATALOG_MACHINES_SUCCESS type returns correct state', () => {
    const payload = [
      getTestVirtualMachineCustomDto({ ID: 'sku-id-1' }),
      getTestVirtualMachineCustomDto({ ID: 'sku-id-2' }),
    ];
    const action: CatalogAction = {
      type: FETCH_CATALOG_MACHINES_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.catalogMachines).toEqual(payload);
    expect(newState.isCatalogMachinesLoading).toBe(false);
    expect(newState.isCatalogMachinesError).toBeNull();
  });
  test('Action with SET_JIT_ENABLED type returns correct state', () => {
    const action: CatalogAction = {
      type: SET_JIT_ENABLED,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.jitEnabled).toBe(true);
  });
  test('Action with SET_JIT_DISABLED type returns correct state', () => {
    const action: CatalogAction = {
      type: SET_JIT_DISABLED,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.jitEnabled).toBe(false);
  });
  test('Action with FETCH_CATALOG_MACHINE_SKUS_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_MACHINE_SKUS_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogMachineSkusLoading).toBe(true);
    expect(newState.isCatalogMachineSkusError).toBeNull();
  });
  test('Action with FETCH_CATALOG_MACHINE_SKUS_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_MACHINE_SKUS_FAILURE,
      payload: axiosError,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.isCatalogMachineSkusLoading).toBe(false);
    expect(newState.isCatalogMachineSkusError).toEqual(axiosError);
  });
  test('Action with FETCH_CATALOG_MACHINE_SKUS_SUCCESS type returns correct state', () => {
    const payload = [
      getTestVirtualMachineSkuDto({ ID: 'sku-id-1' }),
      getTestVirtualMachineSkuDto({ ID: 'sku-id-2' }),
    ];
    const action: CatalogAction = {
      type: FETCH_CATALOG_MACHINE_SKUS_SUCCESS,
      payload,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.catalogMachineSkus).toEqual(payload);
    expect(newState.isCatalogMachineSkusLoading).toBe(false);
    expect(newState.isCatalogMachineSkusError).toBeNull();
  });
  test('Action with FETCH_CATALOG_API_VERSION_BEGIN type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_API_VERSION_BEGIN,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.apiVersion).toBe('Loading...');
  });
  test('Action with FETCH_CATALOG_API_VERSION_FAILURE type returns correct state', () => {
    const action: CatalogAction = {
      type: FETCH_CATALOG_API_VERSION_FAILURE,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.apiVersion).toBe('unavailable');
  });
  test('Action with FETCH_CATALOG_API_VERSION_SUCCESS type returns correct state', () => {
    const apiVersion = '1.1';
    const action: CatalogAction = {
      type: FETCH_CATALOG_API_VERSION_SUCCESS,
      payload: apiVersion,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState.apiVersion).toBe(apiVersion);
  });
  test('Default case returns initial state', () => {
    const action: CatalogAction = {
      type: null,
    };
    const newState = catalogReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
