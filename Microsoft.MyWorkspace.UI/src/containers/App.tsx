import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  initializeIcons,
  Spinner,
  SpinnerSize,
  useTheme,
} from '@fluentui/react';

import { HeaderNavBar } from '../components/Nav/HeaderNavBar/HeaderNavBar';
import { getCommonStyles } from '../components/GeneralComponents/CommonStyles';
import {
  fetchAzureWorkspaces,
  fetchProvisioningApiVersion,
} from '../store/actions/azureWorkspaceActions';
import {
  showUserConfirmationDialog,
  fetchUserNotifications,
  showSevereWarningNotification,
} from '../store/actions/notificationActions';
import { telemetryContext } from '../applicationInsights/TelemetryService';
import SideNav from '../components/Nav/SideNav/SideNav';
import {
  fetchUserImage,
  fetchCatalogUserProfile,
  setUserUnauthorized,
  fetchAzureStatus,
  acceptAgreement,
  fetchCatalogAgreements,
  setUserAuthorized,
  fetchIsAdmin,
  fetchCatalogRegions,
  fetchCatalogApiVersion,
  fetchCatalogMachineSkus,
  fetchCatalogGeographies,
  fetchTours,
  fetchCatalogFeatures,
  fetchCampaignDefinitions,
  fetchHyperlinks,
} from '../store/actions/catalogActions';
import {
  fetchAppConfigValues,
  fetchConfig,
  fetchFeatureFlags,
  fetchFrontendApiVersion,
} from '../store/actions/configActions';
import { UserConfirmationDialog } from '../components/GeneralComponents/UserConfirmationDialog';
import { UserProfileDto } from '../types/Catalog/UserProfileDto.types';
import {
  getCatalogUserProfile,
  getCatalogAgreements,
  getCatalogUserProfileAgreements,
  getCatalogUserProfileError,
  getUserAuthorization,
  getUserProfileUpdateError,
  getJitEnabled,
  getAgreementsLoaded,
  getUserProfileLoaded,
  getIsAdmin,
} from '../store/selectors/catalogSelectors';
import { UserAgreementDialog } from '../components/GeneralComponents/UserAgreementDialog';
import { AuthorizationState } from '../types/enums/AuthorizationState';
import { AgreementDto } from '../types/Catalog/AgreementDto.types';
import {
  getFeatureFlagExternalConnectivity,
  getFeatureFlagTenantSegmentAdminPortal,
  getFeatureFlagFeatureAnnouncement,
  getStaleWorkspaceDeletionBannerThreshold,
  getFeatureFlagStaleWorkspaceDeletion,
  getFeatureFlagShowUserManagementCounts,
} from '../store/selectors/configSelectors';
import {
  fetchExternalConnectivityJitEntries,
  fetchFirewallApiVersion,
  fetchJitAddresses,
} from '../store/actions/firewallActions';
import {
  fetchAdminDiagnosticCatalog,
  fetchAdminSegments,
  fetchBanners,
  fetchSegmentUpdatePercentage,
  fetchTotalPendingUserManagementRequestCount,
  fetchUserRoleAssignment,
  fetchUserWorkspaceInsights,
  fetchWorkspaceScheduleJobs,
} from '../store/actions';
import {
  getAzureWorkspaces,
  getAzureWorkspacesLoadedFirstTime,
  getIsTenantSegmentAdmin,
  getUserRoleAssignment,
  getUserRoleAssignmentConstraint,
} from '../store/selectors';
import {
  fetchAdminConfigProfiles,
  fetchAdminFirewalls,
} from '../store/actions/adminFirewallActions';
import { registerCustomIcons } from './IconsLoader';
import { signalRConnection } from '../services/signalRService';
import { ScreenReaderAnnouncement } from '../components/GeneralComponents/ScreenReaderAnnouncement';

import { ShouldDisplayStaleWorkspaceWarning } from '../shared/helpers/WorkspaceHelper';
import { displayToast, ToastWrapper } from '../shared/ToastWrapper';
import { Unauthorized } from '../components/Pages/Unauthorized';
import { MyWorkspaceErrorBoundary } from 'src/components/GeneralComponents/ErrorBoundary/MyWorkspaceErrorBoundary';
import { MainContainer } from './MainContainer';
import { useAppDispatch } from 'src/store/store';

export const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const userAgreements: string[] = useSelector(getCatalogUserProfileAgreements);
  const agreements: AgreementDto[] = useSelector(getCatalogAgreements);
  const agreementsLoaded = useSelector(getAgreementsLoaded);
  const userProfileLoaded = useSelector(getUserProfileLoaded);
  const allWorkspaces = useSelector(getAzureWorkspaces);
  const workspacesLoadedFirstTime = useSelector(
    getAzureWorkspacesLoadedFirstTime
  );
  const [agreementsToAccept, setAgreementsToAccept] = React.useState([]);
  const [hasDeclined, setHasDeclined] = React.useState(false);

  const authorization = useSelector(getUserAuthorization);
  const [navCollapsed, setNavCollapsed] = React.useState(false);
  const user: UserProfileDto = useSelector(getCatalogUserProfile);
  const userError = useSelector(getCatalogUserProfileError);
  const userUpdateError = useSelector(getUserProfileUpdateError);
  const jitEnabled = useSelector(getJitEnabled);
  const featureFlagTenantSegmentAdmin = useSelector(
    getFeatureFlagTenantSegmentAdminPortal
  );
  const isAdmin = useSelector(getIsAdmin);
  const featureFlagExternalConnectivity = useSelector(
    getFeatureFlagExternalConnectivity
  );
  const featureFlagFeatureAnnouncement = useSelector(
    getFeatureFlagFeatureAnnouncement
  );
  const featureFlagStaleWorkspaceDeletion = useSelector(
    getFeatureFlagStaleWorkspaceDeletion
  );
  const featureFlagShowUserManagementCounts = useSelector(
    getFeatureFlagShowUserManagementCounts
  );
  const userProfile = useSelector(getUserRoleAssignment);
  const staleWorkspaceDeletionBannerThreshold = useSelector(
    getStaleWorkspaceDeletionBannerThreshold
  );
  const constraint = useSelector(getUserRoleAssignmentConstraint);
  const isTenantSegmentAdmin = useSelector(getIsTenantSegmentAdmin);

  useEffect(() => {
    initializeIcons(undefined, { disableWarnings: true });
    registerCustomIcons();
  }, []);

  useEffect(() => {
    signalRConnection.on('onResourceUpdate', async () => {
      await fetchAzureWorkspaces()(dispatch);
      dispatch(fetchWorkspaceScheduleJobs());
    });
    signalRConnection.on('onUserProfileUpdate', () => {
      dispatch(fetchCatalogUserProfile());
    });
    signalRConnection.on('onSegmentFirewallUpdate', (segmentId: string) => {
      dispatch(fetchSegmentUpdatePercentage(segmentId));
      dispatch(fetchUserRoleAssignment());
      dispatch(fetchAdminSegments());
    });
    return () => {
      signalRConnection?.off('onSegmentFirewallUpdate');
      signalRConnection?.off('onUserProfileUpdate');
      signalRConnection?.off('onResourceUpdate');
    };
  }, []);

  useEffect(() => {
    if (workspacesLoadedFirstTime) {
      dispatch(fetchWorkspaceScheduleJobs());
      signalRConnection.on('onWorkspaceScheduledJobUpdate', () => {
        dispatch(fetchWorkspaceScheduleJobs());
      });
    }
  }, [workspacesLoadedFirstTime]);

  const handleNavCollapsed = (isCollapsed: boolean) => {
    setNavCollapsed(isCollapsed);
  };

  const loadAdminData = () => {
    dispatch(fetchAdminFirewalls());
    dispatch(fetchAdminConfigProfiles());
    dispatch(fetchAdminDiagnosticCatalog());
  };

  const loadAppData = () => {
    dispatch(fetchAzureWorkspaces());
    dispatch(fetchCatalogRegions());
    dispatch(fetchCatalogGeographies());
    dispatch(fetchFirewallApiVersion());
    dispatch(fetchFrontendApiVersion());
    dispatch(fetchCatalogApiVersion());
    dispatch(fetchProvisioningApiVersion());
    dispatch(fetchCatalogMachineSkus());
    dispatch(fetchTours());
    dispatch(fetchHyperlinks());
    dispatch(fetchCampaignDefinitions());
  };

  const loadInitialData = () => {
    dispatch(fetchBanners());
    dispatch(fetchConfig());
    dispatch(fetchUserRoleAssignment());
    dispatch(fetchIsAdmin());
    dispatch(fetchFeatureFlags());
    dispatch(fetchAppConfigValues());
    dispatch(fetchCatalogUserProfile());
    dispatch(fetchUserImage());
    dispatch(fetchAzureStatus());
    dispatch(fetchCatalogAgreements());
  };

  useEffect(() => {
    if (featureFlagTenantSegmentAdmin) {
      dispatch(fetchAdminSegments());
    }
  }, [featureFlagTenantSegmentAdmin]);

  useEffect(() => {
    if (isTenantSegmentAdmin && featureFlagShowUserManagementCounts) {
      dispatch(fetchTotalPendingUserManagementRequestCount());
    }
  }, [isTenantSegmentAdmin, featureFlagShowUserManagementCounts]);

  useEffect(() => {
    if (featureFlagFeatureAnnouncement) {
      dispatch(fetchCatalogFeatures());
    }
  }, [featureFlagFeatureAnnouncement]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (agreementsLoaded && userProfileLoaded && agreements && userAgreements) {
      setAgreementsToAccept(
        agreements.filter(
          (val) => !val.Retired && userAgreements.indexOf(val.ID) === -1
        )
      );
    }
  }, [agreements, userAgreements]);

  useEffect(() => {
    if (
      agreementsToAccept.length === 0 &&
      user &&
      user.ID !== '' &&
      authorization !== AuthorizationState.authorized
    ) {
      dispatch(setUserAuthorized());
      loadAppData();
    }
  }, [agreementsToAccept, user, authorization]);

  useEffect(() => {
    if (userProfile) {
      const definedSegmentIds = userProfile.UserRoleAssignments.filter(
        (roleAssignments) => roleAssignments.SegmentDefinitionId
      ).map((roleAssignments) => roleAssignments.SegmentDefinitionId);

      dispatch(
        fetchUserWorkspaceInsights(definedSegmentIds, userProfile.UserId)
      );
      const contributorSegmentId = userProfile.UserRoleAssignments.find(
        (roleAssignment) =>
          roleAssignment.RoleName === 'TenantSegmentContributor'
      )?.SegmentDefinitionId;
      telemetryContext.setAuthenticatedUserContext(
        userProfile.UserId,
        contributorSegmentId
      );
    }
  }, [userProfile]);

  const showApp = () =>
    authorization === AuthorizationState.authorized &&
    user &&
    user.ID !== '' &&
    agreementsToAccept.length === 0;

  const showSpinner = () =>
    authorization === AuthorizationState.notLoaded ||
    ((!user || user.ID === '') &&
      authorization === AuthorizationState.authorized &&
      agreementsToAccept.length === 0 &&
      userError === null);

  const showAgreements = () =>
    agreementsToAccept.length > 0 && !hasDeclined && !userUpdateError;

  const showUnauthorized = () =>
    user &&
    (authorization === AuthorizationState.unAuthorized || userUpdateError);

  useEffect(() => {
    dispatch(fetchUserNotifications());
    signalRConnection.on('onNotificationUpdate', (msg) => {
      // Show toast notification
      displayToast(msg);
      // Get all notifications from the backend
      dispatch(fetchUserNotifications());
    });
  }, []);

  useEffect(() => {
    if (jitEnabled) {
      dispatch(fetchJitAddresses());
      signalRConnection.on('onJitUpdate', () => {
        dispatch(fetchJitAddresses());
      });
    }
  }, [jitEnabled]);

  useEffect(() => {
    if (featureFlagExternalConnectivity) {
      dispatch(fetchExternalConnectivityJitEntries());
    }
  }, [featureFlagExternalConnectivity, user]);

  useEffect(() => {
    if (
      workspacesLoadedFirstTime &&
      staleWorkspaceDeletionBannerThreshold &&
      constraint.EnableAutoStaleWorkspaceDeletion &&
      constraint.StaleWorkspaceDeletionDays &&
      featureFlagStaleWorkspaceDeletion
    ) {
      const staleWorkspaces = allWorkspaces.filter((ws) =>
        ShouldDisplayStaleWorkspaceWarning(
          ws,
          constraint,
          staleWorkspaceDeletionBannerThreshold
        )
      );
      if (staleWorkspaces.length > 0) {
        dispatch(
          showSevereWarningNotification(
            `${staleWorkspaces.length} workspace${
              staleWorkspaces.length > 1 ? 's' : ''
            } will be marked for deletion soon. To prevent deletion, JIT must be activated.`
          )
        );
      }
    }
  }, [
    workspacesLoadedFirstTime,
    staleWorkspaceDeletionBannerThreshold,
    constraint,
    featureFlagStaleWorkspaceDeletion,
  ]);

  return (
    <div
      className={
        theme.name === 'light' ? 'light-scrollbars' : 'dark-scrollbars'
      }
    >
      <Router
        getUserConfirmation={(message, callback) => {
          dispatch(
            showUserConfirmationDialog(
              'Unsaved Changes',
              message,
              () => callback(true),
              () => callback(false)
            )
          );
        }}
      >
        <MyWorkspaceErrorBoundary
          size='large'
          className={commonStyles.fullscreenHeight}
        >
          <HeaderNavBar
            history={undefined}
            location={undefined}
            match={undefined}
          />
          {showAgreements() && (
            <UserAgreementDialog
              agreement={agreements.find(
                (val) => val.ID === agreementsToAccept[0].ID
              )}
              acceptAction={() =>
                dispatch(acceptAgreement(user, agreementsToAccept[0].ID))
              }
              declineAction={() => {
                dispatch(setUserUnauthorized());
                setHasDeclined(true);
              }}
            />
          )}
          {showApp() && (
            <>
              <SideNav
                onNavCollapsed={handleNavCollapsed}
                isCollapsed={navCollapsed}
              />
              <MainContainer navCollapsed={navCollapsed} />
            </>
          )}
          <ToastWrapper />
          {showUnauthorized() && <Unauthorized />}
          {showSpinner() && (
            <Spinner
              size={SpinnerSize.large}
              className={commonStyles.loading}
            />
          )}
          <UserConfirmationDialog />
          <ScreenReaderAnnouncement />
        </MyWorkspaceErrorBoundary>
      </Router>
    </div>
  );
};
