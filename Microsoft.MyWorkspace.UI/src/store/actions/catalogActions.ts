import {
  FETCH_CAMPAIGN_DEFINITIONS_BEGIN,
  FETCH_CAMPAIGN_DEFINITIONS_FAILURE,
  FETCH_CAMPAIGN_DEFINITIONS_SUCCESS,
  SET_SELECTED_QUOTA_GEOGRAPHY,
  SET_SELECTED_QUOTA_WORKSPACE_TENANT,
} from './actionTypes/catalogActions';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

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
  SET_USER_AUTHORIZED,
  SET_USER_UNAUTHORIZED,
  FETCH_IS_ADMIN_BEGIN,
  FETCH_IS_ADMIN_FAILURE,
  FETCH_IS_ADMIN_SUCCESS,
  FETCH_CATALOG_REGIONS_BEGIN,
  FETCH_CATALOG_REGIONS_FAILURE,
  FETCH_CATALOG_REGIONS_SUCCESS,
  FETCH_CATALOG_MACHINES_SUCCESS,
  FETCH_CATALOG_MACHINES_BEGIN,
  FETCH_CATALOG_MACHINES_FAILURE,
  SET_JIT_ENABLED,
  SET_JIT_DISABLED,
  FETCH_CATALOG_MACHINE_SKUS_BEGIN,
  FETCH_CATALOG_MACHINE_SKUS_SUCCESS,
  FETCH_CATALOG_MACHINE_SKUS_FAILURE,
  FETCH_CATALOG_API_VERSION_BEGIN,
  FETCH_CATALOG_API_VERSION_SUCCESS,
  FETCH_CATALOG_API_VERSION_FAILURE,
  Action,
  FETCH_CATALOG_AGREEMENTS_BEGIN,
  FETCH_CATALOG_AGREEMENTS_SUCCESS,
  FETCH_CATALOG_AGREEMENTS_FAILURE,
  FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_BEGIN,
  FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_FAILURE,
  FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_SUCCESS,
  SET_SELECTED_QUOTA_SUBSCRIPTION,
  FETCH_CATALOG_GEOGRAPHIES_BEGIN,
  FETCH_CATALOG_GEOGRAPHIES_FAILURE,
  FETCH_CATALOG_GEOGRAPHIES_SUCCESS,
  FETCH_TOURS_BEGIN,
  FETCH_TOURS_SUCCESS,
  FETCH_TOURS_FAILURE,
  FETCH_HYPERLINKS_BEGIN,
  FETCH_HYPERLINKS_SUCCESS,
  FETCH_HYPERLINKS_FAILURE,
  FETCH_CATALOG_FEATURE_BEGIN,
  FETCH_CATALOG_FEATURE_SUCCESS,
  FETCH_CATALOG_FEATURE_FAILURE,
} from './actionTypes';
import { httpAuthService } from '../../applicationInsights/httpAuthService';
import { WorkspaceTemplateDto } from '../../types/Catalog/WorkspaceTemplateDto.types';
import { UserProfileDto } from '../../types/Catalog/UserProfileDto.types';
import { RegionDto } from '../../types/Catalog/RegionDto.types';
import ErrorAction from './errorAction';
import { VirtualMachineCustomDto } from '../../types/Catalog/VirtualMachineCustomDto.types';
import { VirtualMachineSkuDto } from '../../types/Catalog/VirtualMachineSkuDto.types';
import { AgreementDto } from '../../types/Catalog/AgreementDto.types';
import { application } from '../../authentication/msal';
import { AzureSubscriptionQuotaStatusDto } from '../../types/Catalog/AzureSubscriptionQuotaStatus.types';
import { AzureGeographyDto } from '../../types/Catalog/AzureGeographyDto.types';
import { TourDto } from '../../types/Catalog/TourDto.types';
import { HyperlinkDto } from '../../types/Catalog/HyperlinkDto.types';
import { FeatureDto } from '../../types/Catalog/FeatureDto.types';
import { CampaignDefinitionDto } from '../../types/Catalog/CampaignDefinitionDto.types';
import { TemplateRequestStatus } from '../../types/enums/TemplateRequestStatus';

export interface CatalogAction extends Action {
  payload?:
    | WorkspaceTemplateDto[]
    | UserProfileDto
    | AgreementDto[]
    | VirtualMachineCustomDto[]
    | string[]
    | number
    | boolean
    | RegionDto[]
    | AzureGeographyDto[]
    | VirtualMachineSkuDto[]
    | AxiosError
    | string
    | AzureSubscriptionQuotaStatusDto[]
    | TourDto[]
    | HyperlinkDto[]
    | FeatureDto[]
    | CampaignDefinitionDto[];
}

export const fetchCatalogTemplatesBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_TEMPLATES_BEGIN,
});

export const fetchCatalogTemplatesSuccess = (
  payload: WorkspaceTemplateDto[]
): CatalogAction => ({
  type: FETCH_CATALOG_TEMPLATES_SUCCESS,
  payload,
});

export const fetchCatalogTemplatesError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_CATALOG_TEMPLATES_FAILURE,
  payload: error,
});

export const fetchCatalogTemplates = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogTemplatesBegin());
    try {
      const res = await httpAuthService.get('catalog/templates/v2');

      const templates = res.data as WorkspaceTemplateDto[];
      // Log success here
      dispatch(
        fetchCatalogTemplatesSuccess(
          (templates && templates.length ? templates : []).filter(
            (t) => t.Status === TemplateRequestStatus.Published
          )
        )
      );
    } catch (err) {
      dispatch(fetchCatalogTemplatesError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Azure Templates:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchCatalogUserProfileBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_USER_PROFILE_BEGIN,
});

export const fetchCatalogUserProfileSuccess = (
  payload: UserProfileDto
): CatalogAction => ({
  type: FETCH_CATALOG_USER_PROFILE_SUCCESS,
  payload,
});

export const fetchCatalogUserProfileError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_CATALOG_USER_PROFILE_FAILURE,
  payload: error,
});

export const fetchCatalogUserProfile = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogUserProfileBegin());
    try {
      const res = await httpAuthService.get('catalog/userProfile');

      if (!res.data?.Mail) {
        application.logoutRedirect();
      }
      // Log success here
      dispatch(fetchCatalogUserProfileSuccess(res.data as UserProfileDto));
    } catch (err) {
      dispatch(fetchCatalogUserProfileError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve User Profile:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchUserImageBegin = (): CatalogAction => ({
  type: FETCH_USER_IMAGE_BEGIN,
});

export const fetchUserImageSuccess = (payload: string): CatalogAction => ({
  type: FETCH_USER_IMAGE_SUCCESS,
  payload,
});

export const fetchUserImageError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_USER_IMAGE_FAILURE,
  payload: error,
});

export const fetchUserImage = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchUserImageBegin());
    try {
      const res = await httpAuthService.get('users/photo/');

      // convert base64 byte string to Image URL
      const bloblUrl = `data:image/png;base64,${res.data}`;

      dispatch(fetchUserImageSuccess(bloblUrl ? bloblUrl : null));
    } catch (err) {
      if (err.response.status !== 404) {
        dispatch(fetchUserImageError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve User Profile Image:\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const fetchCatalogAgreementsBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_AGREEMENTS_BEGIN,
});

export const fetchCatalogAgreementsSuccess = (
  payload: AgreementDto[]
): CatalogAction => ({
  type: FETCH_CATALOG_AGREEMENTS_SUCCESS,
  payload,
});

export const fetchCatalogAgreementsError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_CATALOG_AGREEMENTS_FAILURE,
  payload: error,
});

export const fetchCatalogAgreements = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogAgreementsBegin());
    try {
      const res = await httpAuthService.get('catalog/agreements');

      // Log success here
      dispatch(fetchCatalogAgreementsSuccess(res.data as AgreementDto[]));
    } catch (err) {
      if (err.response.status !== 401) {
        dispatch(fetchCatalogAgreementsError(err));
        ErrorAction(
          dispatch,
          err,
          `Failed to retrieve Agreements:\n${err.response?.data}`,
          true
        );
      }
    }
  };
};

export const updateUserProfileBegin = (): CatalogAction => ({
  type: UPDATE_CATALOG_USER_PROFILE_BEGIN,
});

export const updateUserProfileSuccess = (): CatalogAction => ({
  type: UPDATE_CATALOG_USER_PROFILE_SUCCESS,
});

export const updateUserProfileError = (
  error: AxiosError | string
): CatalogAction => ({
  type: UPDATE_CATALOG_USER_PROFILE_FAILURE,
  payload: error,
});

export const acceptAgreement = (
  userProfile: UserProfileDto,
  agreementId: string
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateUserProfileBegin());
    try {
      if (!userProfile.AcceptedAgreements.includes(agreementId)) {
        const updatedProfile = {
          ...userProfile,
          AcceptedAgreements: [...userProfile.AcceptedAgreements, agreementId],
        };

        await httpAuthService.put(`catalog/userprofile`, updatedProfile);
      }
      // Log success here
      dispatch(updateUserProfileSuccess());
    } catch (err) {
      dispatch(updateUserProfileError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to update user profile:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const updateSeenFeatures = (
  userProfile: UserProfileDto,
  updatedSeenFeatures: string[]
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateUserProfileBegin());
    try {
      const updatedProfile = {
        ...userProfile,
        SeenFeatures: updatedSeenFeatures,
      };
      await httpAuthService.put(`catalog/userprofile`, updatedProfile);
      // Log success here
      dispatch(updateUserProfileSuccess());
    } catch (err) {
      dispatch(updateUserProfileError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to update user profile:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const updatePreferences = (
  userProfile: UserProfileDto
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateUserProfileBegin());
    try {
      await httpAuthService.put(`catalog/userprofile`, userProfile);
      // Log success here
      dispatch(updateUserProfileSuccess());
    } catch (err) {
      dispatch(updateUserProfileError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to update user profile:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const updateNewUserWalkthroughPreference = (
  userProfile: UserProfileDto,
  updatedPreference: boolean
): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(updateUserProfileBegin());
    try {
      const updatedProfile = {
        ...userProfile,
        DisplayNewUserWalkthrough: updatedPreference,
      };
      await httpAuthService.put(`catalog/userprofile`, updatedProfile);
      // Log success here
      dispatch(updateUserProfileSuccess());
    } catch (err) {
      dispatch(updateUserProfileError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to update user profile:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const setUserUnauthorized = (): CatalogAction => ({
  type: SET_USER_UNAUTHORIZED,
});

export const fetchAzureStatusBegin = (): CatalogAction => ({
  type: FETCH_AZURE_STATUS_BEGIN,
});

export const fetchAzureStatusSuccess = (payload: number): CatalogAction => ({
  type: FETCH_AZURE_STATUS_SUCCESS,
  payload,
});

export const fetchAzureStatusError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_AZURE_STATUS_FAILURE,
  payload: error,
});

export const fetchAzureStatus = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAzureStatusBegin());
    try {
      const res = await httpAuthService.get('catalog/Azure/azureissuecount/');

      dispatch(fetchAzureStatusSuccess(res.data !== undefined ? res.data : 0));
    } catch (err) {
      dispatch(fetchAzureStatusError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve azure status:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const setUserAuthorized = (): CatalogAction => ({
  type: SET_USER_AUTHORIZED,
});

export const fetchIsAdminBegin = (): CatalogAction => ({
  type: FETCH_IS_ADMIN_BEGIN,
});

export const fetchIsAdminSuccess = (isAdmin: boolean): CatalogAction => ({
  type: FETCH_IS_ADMIN_SUCCESS,
  payload: isAdmin,
});

export const fetchIsAdminError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_IS_ADMIN_FAILURE,
  payload: error,
});

export const fetchIsAdmin = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchIsAdminBegin());
    try {
      const res = await httpAuthService.get('catalog/azure/admin');

      // Log success here
      dispatch(fetchIsAdminSuccess(res.data));
    } catch (err) {
      dispatch(fetchIsAdminError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to determine if user is admin:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchCatalogRegionsBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_REGIONS_BEGIN,
});

export const fetchCatalogRegionsSuccess = (
  payload: RegionDto[]
): CatalogAction => ({
  type: FETCH_CATALOG_REGIONS_SUCCESS,
  payload,
});

export const fetchCatalogRegionsError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_CATALOG_REGIONS_FAILURE,
  payload: error,
});

export const fetchCatalogRegions = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogRegionsBegin());
    try {
      const res = await httpAuthService.get('catalog/regions');

      dispatch(
        fetchCatalogRegionsSuccess(res.data !== undefined ? res.data : [])
      );
    } catch (err) {
      dispatch(fetchCatalogRegionsError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve azure regions:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchCatalogGeographiesBegin = createAction<undefined>(
  FETCH_CATALOG_GEOGRAPHIES_BEGIN
);

export const fetchCatalogGeographiesSuccess = createAction<AzureGeographyDto[]>(
  FETCH_CATALOG_GEOGRAPHIES_SUCCESS
);

export const fetchCatalogGeographiesFailure = createAction<AxiosError | string>(
  FETCH_CATALOG_GEOGRAPHIES_FAILURE
);

export const fetchCatalogGeographies = (): ((
  dispatch: Dispatch
) => Promise<void>) => {
  return async (dispatch): Promise<void> => {
    dispatch(fetchCatalogGeographiesBegin());
    try {
      const res = await httpAuthService.get<AzureGeographyDto[]>(
        '/api/geographies/currentUser'
      );
      dispatch(fetchCatalogGeographiesSuccess(res.data));
    } catch (e) {
      dispatch(fetchCatalogGeographiesFailure(e));
      ErrorAction(
        dispatch,
        e,
        `Failed to retrieve geographies :\n${e.response?.data}`,
        true
      );
    }
  };
};

export const fetchCatalogMachinesBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_MACHINES_BEGIN,
});

export const fetchCatalogMachinesSuccess = (
  payload: VirtualMachineCustomDto[]
): CatalogAction => ({
  type: FETCH_CATALOG_MACHINES_SUCCESS,
  payload,
});

export const fetchCatalogMachinesError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_CATALOG_MACHINES_FAILURE,
  payload: error,
});

export const fetchCatalogMachines = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogMachinesBegin());
    try {
      const res = await httpAuthService.get('catalog/machines');
      // Log success here
      dispatch(
        fetchCatalogMachinesSuccess(res.data as VirtualMachineCustomDto[])
      );
    } catch (err) {
      dispatch(fetchCatalogMachinesError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Azure Machines:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchCatalogMachineSkusBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_MACHINE_SKUS_BEGIN,
});

export const fetchCatalogMachineSkusSuccess = (
  payload: VirtualMachineSkuDto[]
): CatalogAction => ({
  type: FETCH_CATALOG_MACHINE_SKUS_SUCCESS,
  payload,
});

export const fetchCatalogMachineSkusError = (
  error: AxiosError
): CatalogAction => ({
  type: FETCH_CATALOG_MACHINE_SKUS_FAILURE,
  payload: error,
});

export const fetchCatalogMachineSkus = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogMachineSkusBegin());
    try {
      const res = await httpAuthService.get('catalog/skus');
      // Log success here
      dispatch(
        fetchCatalogMachineSkusSuccess(res.data as VirtualMachineSkuDto[])
      );
    } catch (err) {
      dispatch(fetchCatalogMachineSkusError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Azure Machine SKUs:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const setJitEnabled = (): CatalogAction => ({
  type: SET_JIT_ENABLED,
});

export const setJitDisabled = (): CatalogAction => ({
  type: SET_JIT_DISABLED,
});

export const fetchCatalogApiVersionBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_API_VERSION_BEGIN,
});

export const fetchCatalogApiVersionSuccess = (
  payload: string
): CatalogAction => ({
  type: FETCH_CATALOG_API_VERSION_SUCCESS,
  payload,
});

export const fetchCatalogApiVersionError = (
  error: AxiosError
): CatalogAction => ({
  type: FETCH_CATALOG_API_VERSION_FAILURE,
  payload: error,
});

export const fetchCatalogApiVersion = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogApiVersionBegin());
    try {
      const res = await httpAuthService.get<string>('general/version/catalog');

      // Log success here
      dispatch(fetchCatalogApiVersionSuccess(res.data ? res.data : ''));
    } catch (err) {
      dispatch(fetchCatalogApiVersionError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Catalog API Version:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchAzureSubscriptionQuotaStatusBegin = (): CatalogAction => ({
  type: FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_BEGIN,
});

export const fetchAzureSubscriptionQuotaStatusSuccess = (
  payload: AzureSubscriptionQuotaStatusDto[]
): CatalogAction => ({
  type: FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_SUCCESS,
  payload,
});

export const fetchAzureSubscriptionQuotaStatusError = (
  error: AxiosError
): CatalogAction => ({
  type: FETCH_AZURE_SUBSCRIPTION_QUOTA_STATUS_FAILURE,
  payload: error,
});

export const fetchAzureSubscriptionQuotaStatus = (): ((
  dispatch: Dispatch
) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchAzureSubscriptionQuotaStatusBegin());
    try {
      const res = await httpAuthService.get(
        'catalog/Azure/azuresubscriptionquotas'
      );
      // Log success here
      dispatch(
        fetchAzureSubscriptionQuotaStatusSuccess(
          res.data as AzureSubscriptionQuotaStatusDto[]
        )
      );
    } catch (err) {
      dispatch(fetchAzureSubscriptionQuotaStatusError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Azure subscriptions quota status:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchCatalogFeaturesBegin = (): CatalogAction => ({
  type: FETCH_CATALOG_FEATURE_BEGIN,
});

export const fetchCatalogFeaturesSuccess = (
  payload: FeatureDto[]
): CatalogAction => ({
  type: FETCH_CATALOG_FEATURE_SUCCESS,
  payload,
});

export const fetchCatalogFeaturesError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_CATALOG_FEATURE_FAILURE,
  payload: error,
});

export const fetchCatalogFeatures = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCatalogFeaturesBegin());
    try {
      const res = await httpAuthService.get<FeatureDto[]>('api/features');
      // Log success here
      dispatch(fetchCatalogFeaturesSuccess(res.data ?? []));
    } catch (err) {
      dispatch(fetchCatalogFeaturesError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Features:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const setSelectedQuotaSubscription = (
  selectedQuotaSubscriptionId: string
): CatalogAction => ({
  type: SET_SELECTED_QUOTA_SUBSCRIPTION,
  payload: selectedQuotaSubscriptionId,
});

export const setSelectedQuotaWorkspaceTenant = (
  selectedQuotaWorkspaceTenant: string
): CatalogAction => ({
  type: SET_SELECTED_QUOTA_WORKSPACE_TENANT,
  payload: selectedQuotaWorkspaceTenant,
});

export const setSelectedQuotaGeography = (
  selectedQuotaGeography: string
): CatalogAction => ({
  type: SET_SELECTED_QUOTA_GEOGRAPHY,
  payload: selectedQuotaGeography,
});

export const fetchToursBegin = (): CatalogAction => ({
  type: FETCH_TOURS_BEGIN,
});

export const fetchToursSuccess = (payload: TourDto[]): CatalogAction => ({
  type: FETCH_TOURS_SUCCESS,
  payload,
});

export const fetchToursError = (error: AxiosError | string): CatalogAction => ({
  type: FETCH_TOURS_FAILURE,
  payload: error,
});

export const fetchTours = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchToursBegin());
    try {
      const res = await httpAuthService.get('catalog/tour');

      dispatch(fetchToursSuccess(res.data !== undefined ? res.data : 0));
    } catch (err) {
      dispatch(fetchToursError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Tours:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchHyperlinksBegin = (): CatalogAction => ({
  type: FETCH_HYPERLINKS_BEGIN,
});

export const fetchHyperlinksSuccess = (
  payload: HyperlinkDto[]
): CatalogAction => ({
  type: FETCH_HYPERLINKS_SUCCESS,
  payload,
});

export const fetchHyperlinksError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_HYPERLINKS_FAILURE,
  payload: error,
});

export const fetchHyperlinks = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchHyperlinksBegin());
    try {
      const res = await httpAuthService.get('catalog/hyperlink');

      dispatch(fetchHyperlinksSuccess(res.data !== undefined ? res.data : 0));
    } catch (err) {
      dispatch(fetchHyperlinksError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Hyperlinks:\n${err.response?.data}`,
        true
      );
    }
  };
};

export const fetchCampaignDefinitionsBegin = (): CatalogAction => ({
  type: FETCH_CAMPAIGN_DEFINITIONS_BEGIN,
});

export const fetchCampaignDefinitionsSuccess = (
  payload: CampaignDefinitionDto[]
): CatalogAction => ({
  type: FETCH_CAMPAIGN_DEFINITIONS_SUCCESS,
  payload,
});

export const fetchCampaignDefinitionsError = (
  error: AxiosError | string
): CatalogAction => ({
  type: FETCH_CAMPAIGN_DEFINITIONS_FAILURE,
  payload: error,
});

export const fetchCampaignDefinitions = (): ((dispatch: Dispatch) => void) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchCampaignDefinitionsBegin());
    try {
      const res = await httpAuthService.get('api/campaignDefinitions');

      dispatch(fetchCampaignDefinitionsSuccess(res.data ?? []));
    } catch (err) {
      dispatch(fetchCampaignDefinitionsError(err));
      ErrorAction(
        dispatch,
        err,
        `Failed to retrieve Campaign Definitions:\n${err.response?.data}`,
        true
      );
    }
  };
};
