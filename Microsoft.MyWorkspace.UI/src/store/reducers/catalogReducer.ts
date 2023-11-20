import {
  FETCH_CAMPAIGN_DEFINITIONS_BEGIN,
  FETCH_CAMPAIGN_DEFINITIONS_FAILURE,
  FETCH_CAMPAIGN_DEFINITIONS_SUCCESS,
  SET_SELECTED_QUOTA_GEOGRAPHY,
} from './../actions/actionTypes/catalogActions';
import { AzureSubscriptionQuotaStatusDto } from './../../types/Catalog/AzureSubscriptionQuotaStatus.types';
import {
  FETCH_AZURE_STATUS_BEGIN,
  FETCH_AZURE_STATUS_FAILURE,
  FETCH_AZURE_STATUS_SUCCESS,
  FETCH_CATALOG_TEMPLATES_BEGIN,
  FETCH_CATALOG_TEMPLATES_FAILURE,
  FETCH_CATALOG_TEMPLATES_SUCCESS,
  FETCH_USER_IMAGE_BEGIN,
  FETCH_USER_IMAGE_FAILURE,
  FETCH_USER_IMAGE_SUCCESS,
  FETCH_CATALOG_USER_PROFILE_BEGIN,
  FETCH_CATALOG_USER_PROFILE_FAILURE,
  FETCH_CATALOG_USER_PROFILE_SUCCESS,
  UPDATE_CATALOG_USER_PROFILE_BEGIN,
  UPDATE_CATALOG_USER_PROFILE_FAILURE,
  UPDATE_CATALOG_USER_PROFILE_SUCCESS,
  FETCH_CATALOG_AGREEMENTS_BEGIN,
  FETCH_CATALOG_AGREEMENTS_FAILURE,
  FETCH_CATALOG_AGREEMENTS_SUCCESS,
  SET_USER_AUTHORIZED,
  SET_USER_UNAUTHORIZED,
  FETCH_IS_ADMIN_BEGIN,
  FETCH_IS_ADMIN_FAILURE,
  FETCH_IS_ADMIN_SUCCESS,
  FETCH_CATALOG_REGIONS_BEGIN,
  FETCH_CATALOG_REGIONS_FAILURE,
  FETCH_CATALOG_REGIONS_SUCCESS,
  FETCH_CATALOG_MACHINES_BEGIN,
  FETCH_CATALOG_MACHINES_FAILURE,
  FETCH_CATALOG_MACHINES_SUCCESS,
  SET_JIT_ENABLED,
  SET_JIT_DISABLED,
  FETCH_CATALOG_MACHINE_SKUS_BEGIN,
  FETCH_CATALOG_MACHINE_SKUS_FAILURE,
  FETCH_CATALOG_MACHINE_SKUS_SUCCESS,
  FETCH_CATALOG_API_VERSION_BEGIN,
  FETCH_CATALOG_API_VERSION_FAILURE,
  FETCH_CATALOG_API_VERSION_SUCCESS,
  FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_BEGIN,
  FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_FAILURE,
  FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_SUCCESS,
  SET_SELECTED_QUOTA_SUBSCRIPTION,
  FETCH_CATALOG_GEOGRAPHIES_FAILURE,
  FETCH_CATALOG_GEOGRAPHIES_SUCCESS,
  FETCH_CATALOG_GEOGRAPHIES_BEGIN,
  SET_SELECTED_QUOTA_WORKSPACE_TENANT,
  FETCH_TOURS_BEGIN,
  FETCH_TOURS_SUCCESS,
  FETCH_TOURS_FAILURE,
  FETCH_HYPERLINKS_BEGIN,
  FETCH_HYPERLINKS_SUCCESS,
  FETCH_HYPERLINKS_FAILURE,
  FETCH_CATALOG_FEATURE_BEGIN,
  FETCH_CATALOG_FEATURE_SUCCESS,
  FETCH_CATALOG_FEATURE_FAILURE,
} from '../actions/actionTypes';
import { WorkspaceTemplateDto } from '../../types/Catalog/WorkspaceTemplateDto.types';
import { AxiosError } from 'axios';
import { UserProfileDto } from '../../types/Catalog/UserProfileDto.types';
import { AgreementDto } from '../../types/Catalog/AgreementDto.types';
import { AuthorizationState } from '../../types/enums/AuthorizationState';
import { RegionDto } from '../../types/Catalog/RegionDto.types';
import { VirtualMachineCustomDto } from '../../types/Catalog/VirtualMachineCustomDto.types';
import { VirtualMachineSkuDto } from '../../types/Catalog/VirtualMachineSkuDto.types';
import { CatalogAction } from '../actions';
import { AzureGeographyDto } from '../../types/Catalog/AzureGeographyDto.types';
import { TourDto } from '../../types/Catalog/TourDto.types';
import { HyperlinkDto } from '../../types/Catalog/HyperlinkDto.types';
import { FeatureDto } from '../../types/Catalog/FeatureDto.types';
import { CampaignDefinitionDto } from '../../types/Catalog/CampaignDefinitionDto.types';

export interface ReduxCatalogState {
  catalogTemplates: WorkspaceTemplateDto[];
  catalogMachines: VirtualMachineCustomDto[];
  catalogMachineSkus: VirtualMachineSkuDto[];
  catalogUserProfile: UserProfileDto;
  userProfileLoaded: boolean;
  catalogUserImage?: string;
  agreements: AgreementDto[];
  agreementsLoaded: boolean;
  isCatalogTemplatesLoading: boolean;
  catalogTemplatesLoadedFirstTime: boolean;
  isCatalogMachinesLoading: boolean;
  catalogMachinesLoadedFirstTime: boolean;
  isCatalogAgreementsLoading: boolean;
  isCatalogMachineSkusLoading: boolean;
  isCatalogTemplatesError: AxiosError;
  isCatalogMachinesError: AxiosError;
  isCatalogMachineSkusError: AxiosError;
  isCatalogUserProfileLoading: boolean;
  isCatalogUserProfileError: AxiosError;
  isCatalogUserImageLoading: boolean;
  isCatalogUserImageError: AxiosError;
  azureIssueCount: number;
  isAzureStatusLoading: boolean;
  isAzureStatusError: AxiosError;
  isCatalogAgreementsError: AxiosError;
  isUpdatingUserProfileError: AxiosError;
  isUpdatingUserProfileLoading: boolean;
  authorization: AuthorizationState;
  isAdmin: boolean;
  isAdminError: AxiosError;
  regions: RegionDto[];
  regionsLoading: boolean;
  regionsError: AxiosError;
  geographies: AzureGeographyDto[];
  geographiesLoading: boolean;
  geographiesError: AxiosError;
  jitEnabled: boolean;
  apiVersion: string;
  apiVersionError: AxiosError;
  azureSubscriptionQuotaStatusCollection: AzureSubscriptionQuotaStatusDto[];
  isAzureSubscriptionQuotaStatusCollectionLoading: boolean;
  isAzureSubscriptionQuotaStatusCollectionError: AxiosError;
  selectedQuotaSubscriptionId: string;
  selectedQuotaWorkspaceTenant: string;
  selectedQuotaGeography: string;
  tours: TourDto[];
  hyperlinks: HyperlinkDto[];
  features: FeatureDto[];
  featureLoading: boolean;
  featureError: AxiosError;
  campaignDefinitions: CampaignDefinitionDto[];
  campaignDefinitionsLoading: boolean;
  campaignDefinitionsLoadedFirstTime: boolean;
  campaignDefinitionsError: AxiosError;
}

export const catalogInitialState: ReduxCatalogState = {
  catalogTemplates: [],
  catalogMachines: [],
  catalogUserProfile: {
    ID: '',
    AcceptedAgreements: [],
    GivenName: '',
    Surname: '',
    Mail: '',
    RuntimeExtensionHoursRemaining: 0,
    QuotaWeek: 0,
    SeenFeatures: [],
    DisplayNewUserWalkthrough: true,
    Preferences: null,
  },
  userProfileLoaded: false,
  catalogMachineSkus: [],
  catalogUserImage: null,
  azureIssueCount: 0,
  agreements: [],
  agreementsLoaded: false,
  isCatalogTemplatesLoading: false,
  catalogTemplatesLoadedFirstTime: false,
  isCatalogMachinesLoading: false,
  isCatalogAgreementsLoading: false,
  isCatalogTemplatesError: null,
  catalogMachinesLoadedFirstTime: false,
  isCatalogMachinesError: null,
  isCatalogMachineSkusLoading: false,
  isCatalogMachineSkusError: null,
  isCatalogUserProfileLoading: false,
  isCatalogUserProfileError: null,
  isCatalogAgreementsError: null,
  isUpdatingUserProfileError: null,
  isUpdatingUserProfileLoading: false,
  isCatalogUserImageLoading: false,
  isCatalogUserImageError: null,
  isAzureStatusLoading: false,
  isAzureStatusError: null,
  authorization: AuthorizationState.notLoaded,
  isAdmin: false,
  isAdminError: null,
  regions: [],
  regionsLoading: false,
  regionsError: null,
  geographies: [],
  geographiesLoading: false,
  geographiesError: null,
  jitEnabled: true,
  apiVersion: 'unavailable',
  apiVersionError: null,
  azureSubscriptionQuotaStatusCollection: [],
  isAzureSubscriptionQuotaStatusCollectionLoading: false,
  isAzureSubscriptionQuotaStatusCollectionError: null,
  selectedQuotaSubscriptionId: null,
  selectedQuotaWorkspaceTenant: null,
  selectedQuotaGeography: null,
  tours: [],
  hyperlinks: [],
  features: [],
  featureLoading: false,
  featureError: null,
  campaignDefinitions: [],
  campaignDefinitionsLoading: false,
  campaignDefinitionsLoadedFirstTime: false,
  campaignDefinitionsError: null,
};

export default function catalogReducer(
  state: ReduxCatalogState = catalogInitialState,
  action: CatalogAction
): ReduxCatalogState {
  switch (action.type) {
    case FETCH_CATALOG_TEMPLATES_BEGIN:
      return {
        ...state,
        isCatalogTemplatesLoading: true,
        isCatalogTemplatesError: null,
      };
    case FETCH_CATALOG_TEMPLATES_FAILURE:
      return {
        ...state,
        isCatalogTemplatesLoading: false,
        isCatalogTemplatesError: action.payload as AxiosError,
      };
    case FETCH_CATALOG_TEMPLATES_SUCCESS:
      return {
        ...state,
        catalogTemplates: action.payload as WorkspaceTemplateDto[],
        isCatalogTemplatesLoading: false,
        isCatalogTemplatesError: null,
        catalogTemplatesLoadedFirstTime: true,
      };
    case FETCH_CATALOG_MACHINES_BEGIN:
      return {
        ...state,
        isCatalogMachinesLoading: true,
        isCatalogMachinesError: null,
      };
    case FETCH_CATALOG_MACHINES_FAILURE:
      return {
        ...state,
        isCatalogMachinesLoading: false,
        isCatalogMachinesError: action.payload as AxiosError,
      };
    case FETCH_CATALOG_MACHINES_SUCCESS:
      return {
        ...state,
        catalogMachines: action.payload as VirtualMachineCustomDto[],
        isCatalogMachinesLoading: false,
        isCatalogMachinesError: null,
        catalogMachinesLoadedFirstTime: true,
      };
    case FETCH_CATALOG_MACHINE_SKUS_BEGIN:
      return {
        ...state,
        isCatalogMachineSkusLoading: true,
        isCatalogMachineSkusError: null,
      };
    case FETCH_CATALOG_MACHINE_SKUS_FAILURE:
      return {
        ...state,
        isCatalogMachineSkusLoading: false,
        isCatalogMachineSkusError: action.payload as AxiosError,
      };
    case FETCH_CATALOG_MACHINE_SKUS_SUCCESS:
      return {
        ...state,
        catalogMachineSkus: action.payload as VirtualMachineSkuDto[],
        isCatalogMachineSkusLoading: false,
        isCatalogMachineSkusError: null,
      };
    case FETCH_CATALOG_USER_PROFILE_BEGIN:
      return {
        ...state,
        isCatalogUserProfileLoading: true,
        isCatalogUserProfileError: null,
        userProfileLoaded: false,
      };
    case FETCH_CATALOG_USER_PROFILE_FAILURE:
      return {
        ...state,
        isCatalogUserProfileLoading: false,
        userProfileLoaded: false,
        isCatalogUserProfileError: action.payload as AxiosError,
      };
    case FETCH_CATALOG_USER_PROFILE_SUCCESS:
      return {
        ...state,
        catalogUserProfile: action.payload as UserProfileDto,
        isCatalogUserProfileLoading: false,
        isCatalogUserProfileError: null,
        userProfileLoaded: true,
      };
    case FETCH_CATALOG_AGREEMENTS_BEGIN:
      return {
        ...state,
        isCatalogAgreementsLoading: true,
        isCatalogAgreementsError: null,
        agreementsLoaded: false,
      };
    case FETCH_CATALOG_AGREEMENTS_FAILURE:
      return {
        ...state,
        isCatalogAgreementsLoading: false,
        agreementsLoaded: false,
        isCatalogAgreementsError: action.payload as AxiosError,
        authorization: AuthorizationState.unAuthorized,
      };
    case FETCH_CATALOG_AGREEMENTS_SUCCESS:
      return {
        ...state,
        isCatalogAgreementsLoading: false,
        isCatalogAgreementsError: null,
        agreements: action.payload as AgreementDto[],
        agreementsLoaded: true,
      };
    case UPDATE_CATALOG_USER_PROFILE_BEGIN:
      return {
        ...state,
        isUpdatingUserProfileLoading: true,
        userProfileLoaded: false,
        isCatalogUserProfileError: null,
      };
    case UPDATE_CATALOG_USER_PROFILE_FAILURE:
      return {
        ...state,
        isUpdatingUserProfileLoading: false,
        isCatalogUserProfileError: action.payload as AxiosError,
      };
    case UPDATE_CATALOG_USER_PROFILE_SUCCESS:
      return {
        ...state,
        isUpdatingUserProfileLoading: false,
        isCatalogUserProfileError: null,
      };
    case FETCH_USER_IMAGE_BEGIN:
      return {
        ...state,
        catalogUserImage: null,
        isCatalogUserImageLoading: true,
        isCatalogUserImageError: null,
      };
    case FETCH_USER_IMAGE_FAILURE:
      return {
        ...state,
        isCatalogUserImageLoading: false,
        isCatalogUserImageError: action.payload as AxiosError,
      };
    case FETCH_USER_IMAGE_SUCCESS:
      return {
        ...state,
        catalogUserImage: action.payload as string,
        isCatalogUserImageLoading: false,
      };
    case SET_USER_UNAUTHORIZED:
      return {
        ...state,
        authorization: AuthorizationState.unAuthorized,
      };
    case SET_USER_AUTHORIZED:
      return {
        ...state,
        authorization: AuthorizationState.authorized,
      };
    case FETCH_AZURE_STATUS_BEGIN:
      return {
        ...state,
        isAzureStatusLoading: true,
        isAzureStatusError: null,
      };
    case FETCH_AZURE_STATUS_SUCCESS:
      return {
        ...state,
        azureIssueCount: action.payload as number,
        isAzureStatusLoading: false,
      };
    case FETCH_AZURE_STATUS_FAILURE:
      return {
        ...state,
        isAzureStatusLoading: false,
        isAzureStatusError: action.payload as AxiosError,
      };
    case FETCH_IS_ADMIN_BEGIN:
      return {
        ...state,
        isAdmin: false,
        isAdminError: null,
      };
    case FETCH_IS_ADMIN_SUCCESS:
      return {
        ...state,
        isAdmin: action.payload as boolean,
        isAdminError: null,
      };
    case FETCH_IS_ADMIN_FAILURE:
      return {
        ...state,
        isAdmin: false,
        isAdminError: action.payload as AxiosError,
      };
    case FETCH_CATALOG_REGIONS_BEGIN:
      return {
        ...state,
        regionsLoading: true,
        regionsError: null,
      };
    case FETCH_CATALOG_REGIONS_SUCCESS:
      return {
        ...state,
        regions: action.payload as RegionDto[],
        regionsLoading: false,
        regionsError: null,
      };
    case FETCH_CATALOG_REGIONS_FAILURE:
      return {
        ...state,
        regions: [],
        regionsLoading: false,
        regionsError: action.payload as AxiosError,
      };
    case FETCH_CATALOG_GEOGRAPHIES_BEGIN:
      return {
        ...state,
        geographiesLoading: true,
        geographiesError: null,
      };
    case FETCH_CATALOG_GEOGRAPHIES_SUCCESS:
      return {
        ...state,
        geographies: action.payload as AzureGeographyDto[],
        geographiesLoading: false,
        geographiesError: null,
      };
    case FETCH_CATALOG_GEOGRAPHIES_FAILURE:
      return {
        ...state,
        geographies: [],
        geographiesLoading: false,
        geographiesError: action.payload as AxiosError,
      };
    case SET_JIT_ENABLED:
      return {
        ...state,
        jitEnabled: true,
      };
    case SET_JIT_DISABLED:
      return {
        ...state,
        jitEnabled: false,
      };
    case FETCH_CATALOG_API_VERSION_BEGIN:
      return {
        ...state,
        apiVersion: 'Loading...',
      };
    case FETCH_CATALOG_API_VERSION_FAILURE:
      return {
        ...state,
        apiVersion: 'unavailable',
      };
    case FETCH_CATALOG_API_VERSION_SUCCESS:
      return {
        ...state,
        apiVersion: action.payload as string,
      };
    case FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_BEGIN:
      return {
        ...state,
        isAzureSubscriptionQuotaStatusCollectionLoading: true,
        isAzureSubscriptionQuotaStatusCollectionError: null,
      };
    case FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_FAILURE:
      return {
        ...state,
        isAzureSubscriptionQuotaStatusCollectionLoading: false,
        isAzureSubscriptionQuotaStatusCollectionError:
          action.payload as AxiosError,
      };
    case FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_SUCCESS:
      return {
        ...state,
        azureSubscriptionQuotaStatusCollection:
          action.payload as AzureSubscriptionQuotaStatusDto[],
        isAzureSubscriptionQuotaStatusCollectionLoading: false,
        isAzureSubscriptionQuotaStatusCollectionError: null,
      };
    case FETCH_CATALOG_FEATURE_BEGIN:
      return {
        ...state,
        featureLoading: true,
        featureError: null,
      };
    case FETCH_CATALOG_FEATURE_FAILURE:
      return {
        ...state,
        featureLoading: false,
        featureError: action.payload as AxiosError,
      };
    case FETCH_CATALOG_FEATURE_SUCCESS:
      return {
        ...state,
        featureLoading: false,
        features: action.payload as FeatureDto[],
      };
    case SET_SELECTED_QUOTA_SUBSCRIPTION:
      return {
        ...state,
        selectedQuotaSubscriptionId: action.payload as string,
      };
    case SET_SELECTED_QUOTA_WORKSPACE_TENANT:
      return {
        ...state,
        selectedQuotaWorkspaceTenant: action.payload as string,
      };
    case SET_SELECTED_QUOTA_GEOGRAPHY:
      return {
        ...state,
        selectedQuotaGeography: action.payload as string,
      };
    case FETCH_TOURS_BEGIN:
      return {
        ...state,
      };
    case FETCH_TOURS_SUCCESS:
      return {
        ...state,
        tours: action.payload as TourDto[],
      };
    case FETCH_TOURS_FAILURE:
      return {
        ...state,
      };
    case FETCH_HYPERLINKS_BEGIN:
      return {
        ...state,
      };
    case FETCH_HYPERLINKS_SUCCESS:
      return {
        ...state,
        hyperlinks: action.payload as HyperlinkDto[],
      };
    case FETCH_HYPERLINKS_FAILURE:
      return {
        ...state,
      };
    case FETCH_CAMPAIGN_DEFINITIONS_BEGIN:
      return {
        ...state,
        campaignDefinitionsLoading: true,
      };
    case FETCH_CAMPAIGN_DEFINITIONS_SUCCESS:
      return {
        ...state,
        campaignDefinitions: action.payload as CampaignDefinitionDto[],
        campaignDefinitionsLoadedFirstTime: true,
        campaignDefinitionsLoading: false,
      };
    case FETCH_CAMPAIGN_DEFINITIONS_FAILURE:
      return {
        ...state,
        campaignDefinitionsLoadedFirstTime: true,
        campaignDefinitionsLoading: false,
        campaignDefinitionsError: action.payload as AxiosError,
      };
    default:
      return state;
  }
}
