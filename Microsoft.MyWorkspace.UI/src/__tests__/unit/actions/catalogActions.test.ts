import { httpAuthService } from '../../../applicationInsights/httpAuthService';
import {
  acceptAgreement,
  fetchAzureStatus,
  fetchCatalogAgreements,
  fetchCatalogApiVersion,
  fetchCatalogMachines,
  fetchCatalogMachineSkus,
  fetchCatalogRegions,
  fetchCatalogTemplates,
  fetchCatalogUserProfile,
  fetchIsAdmin,
  fetchUserImage,
  setJitDisabled,
  setJitEnabled,
} from '../../../store/actions';
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
  UPDATE_CATALOG_USER_PROFILE_BEGIN,
  UPDATE_CATALOG_USER_PROFILE_FAILURE,
  UPDATE_CATALOG_USER_PROFILE_SUCCESS,
} from '../../../store/actions/actionTypes';
import ErrorAction from '../../../store/actions/errorAction';
import { AgreementDto } from '../../../types/Catalog/AgreementDto.types';
import { RegionDto } from '../../../types/Catalog/RegionDto.types';
import { UserProfileDto } from '../../../types/Catalog/UserProfileDto.types';
import { VirtualMachineCustomDto } from '../../../types/Catalog/VirtualMachineCustomDto.types';
import { VirtualMachineSkuDto } from '../../../types/Catalog/VirtualMachineSkuDto.types';
import { WorkspaceTemplateDto } from '../../../types/Catalog/WorkspaceTemplateDto.types';
import { Themes } from '../../../types/enums/Themes';
import { getTestVirtualMachineCustomDto } from '../../data/VirtualMachineCustomDtoTestData';
import { getTestVirtualMachineSkuDto } from '../../data/VirtualMachineSkuDtoTestData';
import { getTestWorkspaceTemplateDto } from '../../data/WorkspaceTemplateDtoTestData';
import { getMockStore } from '../../utils/mockStore.util';

jest.mock('../../../applicationInsights/TelemetryService.tsx');
jest.mock('src/applicationInsights/httpAuthService.ts');
jest.mock('../../../store/actions/errorAction');
(ErrorAction as jest.Mock).mockImplementation(() => null);
const failure = { response: { status: 400 } };

const store = getMockStore();

describe('Catalog Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('fetchCatalogTemplates action creator dispatches expected actions on success', async () => {
    const mockData: { data: WorkspaceTemplateDto[] } = {
      data: [
        getTestWorkspaceTemplateDto({ ID: 'test-workspace-template-id-1' }),
      ],
    };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CATALOG_TEMPLATES_BEGIN },
      {
        type: FETCH_CATALOG_TEMPLATES_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchCatalogTemplates()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogTemplates action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CATALOG_TEMPLATES_BEGIN },
      {
        type: FETCH_CATALOG_TEMPLATES_FAILURE,
        payload: failure,
      },
    ];
    await fetchCatalogTemplates()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogUserProfile action creator dispatches expected actions on success', async () => {
    const mockData: { data: UserProfileDto } = {
      data: {
        ID: 'testid',
        AcceptedAgreements: [],
        GivenName: 'jimbo',
        Surname: 'testSurname',
        Mail: 'jimbo@test.com',
        RuntimeExtensionHoursRemaining: 4,
        QuotaWeek: 5,
        SeenFeatures: [],
        DisplayNewUserWalkthrough: false,
        Preferences: {
          Theme: Themes.Dark,
          DashboardCards: [],
        },
      },
    };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CATALOG_USER_PROFILE_BEGIN },
      {
        type: FETCH_CATALOG_USER_PROFILE_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchCatalogUserProfile()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogUserProfile action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CATALOG_USER_PROFILE_BEGIN },
      {
        type: FETCH_CATALOG_USER_PROFILE_FAILURE,
        payload: failure,
      },
    ];
    await fetchCatalogUserProfile()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchUserImage action creator dispatches expected actions on success', async () => {
    const mockData = { data: 'thisisaprofilepicture' };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_USER_IMAGE_BEGIN },
      {
        type: FETCH_USER_IMAGE_SUCCESS,
        payload: `data:image/png;base64,${mockData.data}`,
      },
    ];
    await fetchUserImage()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchUserImage action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_USER_IMAGE_BEGIN },
      {
        type: FETCH_USER_IMAGE_FAILURE,
        payload: failure,
      },
    ];
    await fetchUserImage()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogAgreements action creator dispatches expected actions on start success', async () => {
    const mockData: { data: AgreementDto[] } = { data: [] };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CATALOG_AGREEMENTS_BEGIN },
      {
        type: FETCH_CATALOG_AGREEMENTS_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchCatalogAgreements()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogAgreements action creator dispatches expected actions on start failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CATALOG_AGREEMENTS_BEGIN },
      {
        type: FETCH_CATALOG_AGREEMENTS_FAILURE,
        payload: failure,
      },
    ];
    await fetchCatalogAgreements()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('acceptAgreement action creator dispatches expected actions on success', async () => {
    (httpAuthService.put as jest.Mock).mockResolvedValue(true);
    const expectedActions = [
      { type: UPDATE_CATALOG_USER_PROFILE_BEGIN },
      {
        type: UPDATE_CATALOG_USER_PROFILE_SUCCESS,
      },
    ];
    await acceptAgreement(
      { AcceptedAgreements: [] } as UserProfileDto,
      'testID'
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('acceptAgreement action creator dispatches expected actions on failure', async () => {
    (httpAuthService.put as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: UPDATE_CATALOG_USER_PROFILE_BEGIN },
      {
        type: UPDATE_CATALOG_USER_PROFILE_FAILURE,
        payload: failure,
      },
    ];
    await acceptAgreement(
      { AcceptedAgreements: [] } as UserProfileDto,
      'testID'
    )(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAzureStatus action creator dispatches expected actions on success', async () => {
    const mockData = { data: '1.0.0' };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_AZURE_STATUS_BEGIN },
      {
        type: FETCH_AZURE_STATUS_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchAzureStatus()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchAzureStatus action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_AZURE_STATUS_BEGIN },
      {
        type: FETCH_AZURE_STATUS_FAILURE,
        payload: failure,
      },
    ];
    await fetchAzureStatus()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchIsAdmin action creator dispatches expected actions on success', async () => {
    const mockData = { data: true };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_IS_ADMIN_BEGIN },
      {
        type: FETCH_IS_ADMIN_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchIsAdmin()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchIsAdmin action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_IS_ADMIN_BEGIN },
      {
        type: FETCH_IS_ADMIN_FAILURE,
        payload: failure,
      },
    ];
    await fetchIsAdmin()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogRegions action creator dispatches expected actions on success', async () => {
    const mockData: { data: RegionDto[] } = { data: [] };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CATALOG_REGIONS_BEGIN },
      {
        type: FETCH_CATALOG_REGIONS_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchCatalogRegions()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogRegions action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CATALOG_REGIONS_BEGIN },
      {
        type: FETCH_CATALOG_REGIONS_FAILURE,
        payload: failure,
      },
    ];
    await fetchCatalogRegions()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogMachines action creator dispatches expected actions on success', async () => {
    const mockData: { data: VirtualMachineCustomDto[] } = {
      data: [
        getTestVirtualMachineCustomDto({
          ID: 'test-virtual-machine-custom-id-1',
        }),
      ],
    };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CATALOG_MACHINES_BEGIN },
      {
        type: FETCH_CATALOG_MACHINES_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchCatalogMachines()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogMachines action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CATALOG_MACHINES_BEGIN },
      {
        type: FETCH_CATALOG_MACHINES_FAILURE,
        payload: failure,
      },
    ];
    await fetchCatalogMachines()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogMachineSkus action creator dispatches expected actions on success', async () => {
    const mockData: { data: VirtualMachineSkuDto[] } = {
      data: [
        getTestVirtualMachineSkuDto({ ID: 'test-virtual-machine-sku-id-1' }),
      ],
    };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CATALOG_MACHINE_SKUS_BEGIN },
      {
        type: FETCH_CATALOG_MACHINE_SKUS_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchCatalogMachineSkus()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogMachineSkus action creator dispatches expected actions on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CATALOG_MACHINE_SKUS_BEGIN },
      {
        type: FETCH_CATALOG_MACHINE_SKUS_FAILURE,
        payload: failure,
      },
    ];
    await fetchCatalogMachineSkus()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('setJitEnabled action contains expected type', () => {
    const expectedActions = [{ type: SET_JIT_ENABLED }];
    store.dispatch(setJitEnabled());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('setJitDisabled action contains expected type', () => {
    const expectedActions = [{ type: SET_JIT_DISABLED }];
    store.dispatch(setJitDisabled());
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogApiVersion action contains expected type and payload on success', async () => {
    const mockData = { data: '1.0.0' };
    (httpAuthService.get as jest.Mock).mockResolvedValue(mockData);
    const expectedActions = [
      { type: FETCH_CATALOG_API_VERSION_BEGIN },
      {
        type: FETCH_CATALOG_API_VERSION_SUCCESS,
        payload: mockData.data,
      },
    ];
    await fetchCatalogApiVersion()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
  test('fetchCatalogApiVersion action contains expected type and payload on failure', async () => {
    (httpAuthService.get as jest.Mock).mockRejectedValue(failure);
    const expectedActions = [
      { type: FETCH_CATALOG_API_VERSION_BEGIN },
      {
        type: FETCH_CATALOG_API_VERSION_FAILURE,
        payload: failure,
      },
    ];
    await fetchCatalogApiVersion()(store.dispatch);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
