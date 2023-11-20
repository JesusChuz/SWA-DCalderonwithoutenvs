import { lazy } from 'react';

export const NewWorkspaceLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "newWorkspace"*/ '../components/NewWorkspace/NewWorkspaceWrapper'
    )
);
export const WorkspaceMachinePropertiesLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "workspaceMachineProperties"*/ '../components/MyWorkspaces/WorkspaceMachineProperties/WorkspaceMachineProperties'
    )
);
export const MyWorkspacesLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "myWorkspaces"*/ '../components/MyWorkspaces/AllWorkspacesView/MyWorkspaces'
    )
);

export const WorkspaceSearchLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "workspaceSearch"*/ '../components/Administration/WorkspaceSearch'
    )
);

export const RbacSearchLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "rbacSearch"*/ '../components/Administration/RbacSearch/RbacSearch'
    )
);

export const TenantSegmentLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "tenantSegmentAdmin"*/ '../components/Administration/TenantSegmentAdmin/TenantSegmentAdminView'
    )
);

export const FirewallManagementViewLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "firewallmanagement"*/ '../components/Administration/FirewallDashboard/FirewallManagement'
    )
);

export const FirewallViewLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "firewallmanagement"*/ '../components/Administration/FirewallDashboard/Firewall'
    )
);

export const DashboardLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "dashboard"*/ '../components/Dashboard/Dashboard'
    )
);

export const AuthorTemplateManagementLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "authorTemplateManagement"*/ '../components/TemplateManagement/AuthorTemplateManagement'
    )
);

export const DocumentationLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "documentation"*/ '../components/Documentation/Documentation'
    )
);

export const CanvasLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "canvas"*/ '../components/MyWorkspaces/CanvasView/CanvasView'
    )
);

export const BannersLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "banners"*/ '../components/Administration/UserEngagement/BannerList'
    )
);

export const EditBannerLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "editbanners"*/ '../components/Administration/UserEngagement/Banner'
    )
);

export const AzureQuotaStatusListViewLazy = lazy(
  () =>
    import(
      /* webpackChunkName: "azureQuotaStatusListView"*/ '../components/Administration/AzureQuotaStatus/AzureQuotaStatusListView'
    )
);
