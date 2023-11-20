import { createSelector } from 'reselect';

import { ReduxCatalogState } from '../reducers/catalogReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';

const catalogState = (state: MyWorkspacesStore): ReduxCatalogState =>
  state.catalog;

export const getAzureIssueCount = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.azureIssueCount
);

export const getCatalogTemplates = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    if (catalog) {
      return catalog.catalogTemplates;
    }
    return [];
  }
);

export const getCatalogTemplatesLoadingStatus = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isCatalogTemplatesLoading
);

export const getCatalogTemplatesLoadedFirstTime = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.catalogTemplatesLoadedFirstTime
);

export const getCatalogMachines = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    if (catalog) {
      return catalog.catalogMachines;
    }
    return [];
  }
);

export const getCatalogMachinesLoadingStatus = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isCatalogMachinesLoading
);

export const getCatalogMachinesLoadedFirstTime = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.catalogMachinesLoadedFirstTime
);

export const getCatalogMachineSkus = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    if (catalog) {
      return catalog.catalogMachineSkus;
    }
    return [];
  }
);

export const getCatalogMachineSkusLoading = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isCatalogMachineSkusLoading
);

export const getCatalogUserProfile = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    if (catalog) {
      return catalog.catalogUserProfile;
    }
    return null;
  }
);

export const getCatalogUserProfileError = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isCatalogUserProfileError
);

export const getCatalogUserProfileLoadingStatus = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isCatalogUserProfileLoading
);

export const getCatalogUserProfileAgreements = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.catalogUserProfile.AcceptedAgreements
);

export const getUserAuthorization = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.authorization
);

export const getCatalogAgreements = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.agreements
);

export const getCatalogUserImage = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.catalogUserImage
);

export const getCatalogUserImageLoadingStatus = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isCatalogUserImageLoading
);

export const getIsAdmin = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isAdmin
);

export const getUserProfileUpdateError = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isUpdatingUserProfileError
);

export const getUserProfileUpdateLoading = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.isUpdatingUserProfileLoading
);

export const getAgreementsLoaded = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.agreementsLoaded
);

export const getUserProfileLoaded = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.userProfileLoaded
);

export const getRegions = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.regions
);

export const getGeographies = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.geographies
);

export const getJitEnabled = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.jitEnabled
);

export const getCatalogApiVersion = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.apiVersion
);

export const getFeatures = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.features
);

export const getIfNewFeaturesExist = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.features.length !== 0
);

export const getAzureSubscriptionQuotaStatus = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    if (catalog) {
      return catalog.azureSubscriptionQuotaStatusCollection;
    }
    return [];
  }
);

export const getAzureSubscriptionQuotaStatusLoadingStatus = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) =>
    catalog.isAzureSubscriptionQuotaStatusCollectionLoading
);

export const getSelectedSubscription = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    return catalog.selectedQuotaSubscriptionId;
  }
);

export const getSelectedWorkspaceTenant = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    return catalog.selectedQuotaWorkspaceTenant;
  }
);

export const getSelectedGeography = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => {
    return catalog.selectedQuotaGeography;
  }
);

export const getTours = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.tours
);

export const getHyperlinks = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.hyperlinks
);

export const getCampaignDefinitions = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.campaignDefinitions
);

export const getCampaignDefinitionsLoadedFirstTime = createSelector(
  catalogState,
  (catalog: ReduxCatalogState) => catalog.campaignDefinitionsLoadedFirstTime
);
