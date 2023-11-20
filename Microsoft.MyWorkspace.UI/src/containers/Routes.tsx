import * as React from 'react';
import { Route, Switch } from 'react-router';
import { AuthenticatedRedirect } from 'src/components/GeneralComponents/AuthenticatedRedirect';
import { AccessDenied } from 'src/components/Pages/AccessDenied';
import { NotFound } from 'src/components/Pages/NotFound';
import { WorkspaceEditType } from 'src/types/enums/WorkspaceEditType';
import {
  DashboardLazy,
  AuthorTemplateManagementLazy,
  DocumentationLazy,
  NewWorkspaceLazy,
  WorkspaceSearchLazy,
  BannersLazy,
  EditBannerLazy,
  RbacSearchLazy,
  AzureQuotaStatusListViewLazy,
  FirewallManagementViewLazy,
  FirewallViewLazy,
  TenantSegmentLazy,
  WorkspaceMachinePropertiesLazy,
  MyWorkspacesLazy,
} from './LazyComponents';
import { useSelector } from 'react-redux';
import {
  getFeatureFlagAdmin,
  getFeatureFlagTenantSegmentAdminPortal,
  getIsAdmin,
  getIsTenantSegmentAdmin,
  getFeatureFlagPostDeploymentMachineChanges,
  getFeatureFlagDashboard,
  getUserRoleAssignmentConstraint,
} from 'src/store/selectors';
import { RouteErrorBoundaryWrapper } from 'src/components/GeneralComponents/ErrorBoundary/RouteErrorBoundaryWrapper';

export const Routes = () => {
  const featureFlagAdmin = useSelector(getFeatureFlagAdmin);
  const featureFlagTenantSegmentAdmin = useSelector(
    getFeatureFlagTenantSegmentAdminPortal
  );
  const isAdmin = useSelector(getIsAdmin);
  const isTenantSegmentAdmin = useSelector(getIsTenantSegmentAdmin);
  const postDeploymentMachineChangesEnabled = useSelector(
    getFeatureFlagPostDeploymentMachineChanges
  );
  const featureFlagDashboard = useSelector(getFeatureFlagDashboard);
  const constraint = useSelector(getUserRoleAssignmentConstraint);
  return (
    <Switch>
      {featureFlagDashboard && (
        <Route
          exact
          path='/dashboard'
          render={() => (
            <RouteErrorBoundaryWrapper>
              <DashboardLazy />
            </RouteErrorBoundaryWrapper>
          )}
        />
      )}
      <Route
        exact
        path='/authorTemplateManagement'
        render={() =>
          constraint?.AllowTemplateCreation ? (
            <RouteErrorBoundaryWrapper>
              <AuthorTemplateManagementLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/documentation'
        render={() => (
          <RouteErrorBoundaryWrapper>
            <DocumentationLazy />
          </RouteErrorBoundaryWrapper>
        )}
      />

      <Route
        exact
        path='/NewWorkspace/Template'
        render={() => (
          <RouteErrorBoundaryWrapper>
            <NewWorkspaceLazy
              workspaceEditType={WorkspaceEditType.NewTemplateWorkspace}
            />
          </RouteErrorBoundaryWrapper>
        )}
      />
      <Route
        exact
        path='/NewWorkspace/Custom'
        render={() => (
          <RouteErrorBoundaryWrapper>
            <NewWorkspaceLazy
              workspaceEditType={WorkspaceEditType.NewCustomWorkspace}
            />
          </RouteErrorBoundaryWrapper>
        )}
      />
      <Route
        exact
        path='/admin/WorkspaceSearch'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <WorkspaceSearchLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/Banners'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <BannersLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/Banners/:id'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <EditBannerLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/RbacSearch'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <RbacSearchLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/AzureQuotaStatus'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <AzureQuotaStatusListViewLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/FirewallManagement'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <FirewallManagementViewLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/FirewallManagement/:id'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <FirewallViewLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/TenantSegment'
        render={() =>
          featureFlagTenantSegmentAdmin && isTenantSegmentAdmin ? (
            <RouteErrorBoundaryWrapper>
              <TenantSegmentLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/:id'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <WorkspaceMachinePropertiesLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />
      <Route
        exact
        path='/admin/:id/:machineID'
        render={() =>
          featureFlagAdmin && isAdmin ? (
            <RouteErrorBoundaryWrapper>
              <WorkspaceMachinePropertiesLazy />
            </RouteErrorBoundaryWrapper>
          ) : (
            <RouteErrorBoundaryWrapper>
              <AccessDenied />
            </RouteErrorBoundaryWrapper>
          )
        }
      />

      {postDeploymentMachineChangesEnabled && (
        <Route
          exact
          path='/:id/edit'
          render={() => (
            <RouteErrorBoundaryWrapper>
              <NewWorkspaceLazy
                workspaceEditType={WorkspaceEditType.EditWorkspace}
              />
            </RouteErrorBoundaryWrapper>
          )}
        />
      )}
      <Route
        exact
        path='/:id/:machineID'
        render={() => (
          <RouteErrorBoundaryWrapper>
            <WorkspaceMachinePropertiesLazy />
          </RouteErrorBoundaryWrapper>
        )}
      />
      <Route
        exact
        path='/authenticated'
        render={() => <AuthenticatedRedirect />}
      />
      <Route
        exact
        path='/:id'
        render={() => (
          <RouteErrorBoundaryWrapper>
            <WorkspaceMachinePropertiesLazy />
          </RouteErrorBoundaryWrapper>
        )}
      />
      <Route
        exact
        path='/'
        render={() => (
          <RouteErrorBoundaryWrapper>
            <MyWorkspacesLazy />
          </RouteErrorBoundaryWrapper>
        )}
      />
      <Route path='*' component={NotFound} />
    </Switch>
  );
};
