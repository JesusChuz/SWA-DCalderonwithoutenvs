import { createSelector } from 'reselect';
import { ReduxConfigState } from '../reducers/configReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';

const configState = (state: MyWorkspacesStore): ReduxConfigState =>
  state.config;

export const getDebugMode = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.config.DebugMode;
    }
    return true;
  }
);

export const getChatbotURLp1 = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.config.ChatbotURLp1;
    }
    return '';
  }
);

export const getChatbotURLp2 = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.config.ChatbotURLp2;
    }
    return '';
  }
);

export const getOcvEnvironment = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.config.OCVEnv;
    }
    return 0;
  }
);

export const getOCVAppId = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.config.OCVAppId;
    }
    return 0;
  }
);

export const getAppInsightsKey = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.config.AppInsightsKey;
    }
    return '';
  }
);

export const getConfigLoadedFirstTime = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.isConfigLoadedFirstTime;
    }
    return false;
  }
);

export const getFeatureFlagAzureCustom = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.CustomDeploymentFeature
);

export const getFeatureFlagNoWorkspacesTourABTestEnabled = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.NoWorkspaceTourABTestEnabled
);

export const getFeatureFlagNoWorkspacesExperience = createSelector(
  configState,
  (config: ReduxConfigState) =>
    config.featureFlags.NoWorkspacesTourExperienceAorB
);

export const getFeatureFlagTour = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.Tour
);

export const getFeatureFlagExternalConnectivity = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ExternalConnectivityFeature
);

export const getFeatureFlagAdmin = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.AdminFeatureFlag
);

export const getFeatureFlagExternalConnectivityDNS = createSelector(
  configState,
  (config: ReduxConfigState) =>
    config.featureFlags.ExternalConnectivityDNSFeature
);

export const getFeatureFlagMultipleSubnet = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.MultipleSubnetFeature
);

export const getFeatureFlagNicReset = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ResetNicFeature
);

export const getFeatureFlagMultipleNic = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.MultipleNicFeature
);

export const getFeatureFlagMultipleDomainControllers = createSelector(
  configState,
  (config: ReduxConfigState) =>
    config.featureFlags.MultipleDomainControllerFeature
);

export const getFeatureFlagMultipleSubnetPostDeployment = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.MultipleSubnetFeature
);

export const getFeatureFlagPostDeploymentMachineChanges = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.PostDeploymentMachineChanges
);

export const getFeatureFlagExtendWorkspaceRuntime = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ExtendWorkspaceRuntime
);

export const getFeatureFlagSchedule = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ScheduleFlagFlag
);

export const getFeatureFlagComplianceMonitoring = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.EnableComplianceInfoFetch
);

export const getFeatureFlagCanvasView = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.CanvasView
);

export const getFeatureFlagPasswordRotation = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.PasswordRotationFeatureFlag
);

export const getFeatureFlagSnapshot = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.SnapshotFeature
);

export const getFeatureFlagTemplateQuotaAdjustment = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.TemplateAdjustmentsForQuotas
);

export const getFeatureFlagNestedVirtualization = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.NestedVirtualization
);

export const getFeatureFlagAutoDeleteNonExistentUsers = createSelector(
  configState,
  (config: ReduxConfigState) =>
    config.featureFlags.EnableAutoDeleteNonExistentUsers
);

export const getFeatureFlagModernRDP = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.EnableModernRDP
);

export const getFeatureFlagTenantSegmentAdminPortal = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.TenantSegmentAdminPortal
);

export const getAzureDNSZoneName = createSelector(
  configState,
  (config: ReduxConfigState) => config.azureDNSZoneName
);

export const getRestrictedDnsPrefixes = createSelector(
  configState,
  (config: ReduxConfigState) => config.restrictedDnsPrefixes
);

export const getModernRdpDownloadLink = createSelector(
  configState,
  (config: ReduxConfigState) => config.modernRdpDownloadLink
);

export const getRdpJitMaxHours = createSelector(
  configState,
  (config: ReduxConfigState) => config.rdpJitMaxHours
);

export const getFeatureFlagLinuxRdp = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.EnableLinuxRDP
);

export const getFeatureFlagPrivateMode = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.PrivateMode
);

export const getFeatureFlagDashboard = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.DashboardFeature
);

export const getUserMessage = createSelector(
  configState,
  (config: ReduxConfigState) => {
    if (config.config) {
      return config.config.Message;
    }
    return null;
  }
);

export const getFeatureFlagBulkDeleteWorkspaceInsights = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.BulkDeleteWorkspaceInsights
);

export const getFeatureFlagEndpointAccessManagement = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.EndpointAccessManagement
);

export const getFeatureFlagFeatureAnnouncement = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.NewFeatureAnnouncement
);

export const getFeatureFlagStaleWorkspaceDeletion = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.EnableStaleWorkspaceDeletion
);

export const getFeatureFlagNewUserWalkthrough = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.NewUserWalkthrough
);

export const getFeatureUserPreferences = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.UserPreferences
);

export const getFeatureFlagCsvDownloadButton = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.CsvDownloadButton
);

export const getFrontendAPIVersion = createSelector(
  configState,
  (config: ReduxConfigState) => config.frontendAPIVersion
);

export const getFrontendAPIVersionLoaded = createSelector(
  configState,
  (config: ReduxConfigState) => config.frontendAPIVersionLoaded
);

export const getStaleWorkspaceDeletionWarningThreshold = createSelector(
  configState,
  (config: ReduxConfigState) => config.staleWorkspaceDeletionWarningThreshold
);

export const getStaleWorkspaceDeletionBannerThreshold = createSelector(
  configState,
  (config: ReduxConfigState) => config.staleWorkspaceDeletionBannerThreshold
);

export const getFeatureFlagFirewallDeployments = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.FirewallDeployments
);

export const getFeatureFlagShareWithSegment = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ShareWithSegment
);

export const getFeatureFlagOcvFloodgate = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.OcvFloodgate
);

export const getFeatureFlagsLoaded = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlagsLoaded
);

export const getFeatureFlagRemoveTenantSegmentUser = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.RemoveTenantSegmentUser
);

export const getFeatureFlagMoveTenantSegmentUser = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.MoveTenantSegmentUser
);

export const getFeatureFlagFirewallSoftwareUpdates = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.FirewallSoftwareUpdates
);

export const getFeatureFlagUserManagementBulkOperations = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.UserManagementBulkOperations
);

export const getFeatureFlagAdminTemplateCreation = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.AdminTemplateCreation
);

export const getFeatureFlagAuthorTemplateCreation = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.AuthorTemplateCreation
);

export const getFeatureFlagTenantSegmentAdminQuotas = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.TenantSegmentAdminQuotas
);

export const getSegmentConstraintMaxValues = createSelector(
  configState,
  (config: ReduxConfigState) => config.segmentConstraintMaxValues
);

export const getFeatureFlagCostAnalysisView = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.CostAnalysisView
);

export const getFeatureFlagUserWorkspaceCostView = createSelector(
  configState,
  (config: ReduxConfigState) =>
    config.featureFlags.UserWorkspaceCostAnalysisView
);

export const getFeatureFlagDiagnostics = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.Diagnostics
);

export const getFeatureFlagOData = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ODataEndpoints
);

export const getFeatureFlagErrorBoundary = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ErrorBoundary
);

export const getFeatureFlagShowUserManagementCounts = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.ShowUserManagementCounts
);

export const getFeatureFlagDisableScheduledStart = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.DisableScheduledStart
);

export const getFeatureFlagDashboardDnD = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.DashboardDnD
);

export const getFeatureFlagTemplateDeploymentCounts = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.TemplateDeploymentCounts
);

export const getFeatureFlagEnableTransferOwnership = createSelector(
  configState,
  (config: ReduxConfigState) => config.featureFlags.EnableTransferOwnership
);
