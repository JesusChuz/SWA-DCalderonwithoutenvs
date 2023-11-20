import * as React from 'react';
import {
  CoherenceNav,
  INavLink,
} from '@coherence-design-system/controls/lib/nav';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  getFeatureFlagAdmin,
  getFeatureFlagAzureCustom,
  getFeatureFlagTenantSegmentAdminPortal,
  getFeatureFlagDashboard,
  getFeatureFlagAuthorTemplateCreation,
} from '../../../store/selectors/configSelectors';
import {
  getIsAdmin,
  getIsTenantSegmentAdmin,
  getTotalPendingUserManagementRequestCount,
  getUserRoleAssignmentConstraint,
} from '../../../store/selectors';
import { Stack } from '@fluentui/react';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import clsx from 'clsx';
import { CounterBadge } from 'src/components/GeneralComponents/CounterBadge';
import { useCounterBadgeStyles } from 'src/components/GeneralComponents/CounterBadge.styles';

interface IProps extends RouteComponentProps {
  onNavCollapsed: (isCollapsed: boolean) => void;
  isCollapsed: boolean;
}

const SideNav = (props: IProps): JSX.Element => {
  const counterBadgeStyles = useCounterBadgeStyles();
  const commonStyles = useCommonStyles();
  const [navLinks, setNavLinks] = React.useState([]);
  const featureFlagAzureCustom = useSelector(getFeatureFlagAzureCustom);
  const featureFlagAdmin = useSelector(getFeatureFlagAdmin);
  const featureFlagTenantSegmentAdmin = useSelector(
    getFeatureFlagTenantSegmentAdminPortal
  );
  const featureFlagAuthorTemplateCreation = useSelector(
    getFeatureFlagAuthorTemplateCreation
  );
  const totalPendingUserManagementRequests = useSelector(
    getTotalPendingUserManagementRequestCount
  );
  const segmentConstraint = useSelector(getUserRoleAssignmentConstraint);
  const isTenantSegmentAdmin = useSelector(getIsTenantSegmentAdmin);
  const isAdmin = useSelector(getIsAdmin);
  const featureFlagDashboard = useSelector(getFeatureFlagDashboard);
  const adminLinks: INavLink = {
    name: 'Administration',
    key: 'Admin',
    icon: 'Shield',
    ariaLabel: 'Administration',
    links: [
      {
        name: 'Workspace Search',
        key: 'adminWorkspaceSearch',
        onClick: () => {
          props.history.push('/admin/WorkspaceSearch');
        },
        isSelected: props.location.pathname === '/admin/WorkspaceSearch',
        ['data-custom-id']: 'Admin Workspace Search',
        ['data-custom-bhvr']: 'NAVIGATION',
        ['data-custom-parentid']: 'Side Nav Button - Workspace Search',
      },
      {
        name: 'RBAC Search',
        key: 'adminRbacSearch',
        onClick: () => {
          props.history.push('/admin/RbacSearch');
        },
        isSelected: props.location.pathname === '/admin/RbacSearch',
        ['data-custom-id']: 'RBAC Search',
        ['data-custom-bhvr']: 'NAVIGATION',
        ['data-custom-parentid']: 'Side Nav Button - RBAC Search',
      },
      {
        name: 'Azure Subscriptions Quotas',
        key: 'azureSubscriptionQuotas',
        onClick: () => {
          props.history.push('/admin/AzureQuotaStatus');
        },
        isSelected: props.location.pathname === '/admin/AzureQuotaStatus',
        ['data-custom-id']: 'Azure Subscriptions Quotas',
        ['data-custom-bhvr']: 'NAVIGATION',
        ['data-custom-parentid']:
          'Side Nav Button - Azure Subscriptions Quotas',
      },
      {
        name: 'Firewall Management',
        key: 'firewallmanagement',
        onClick: () => {
          props.history.push('/admin/FirewallManagement');
        },
        isSelected: props.location.pathname === '/admin/FirewallManagement',
        ['data-custom-id']: 'Firewall Management',
        ['data-custom-bhvr']: 'NAVIGATION',
        ['data-custom-parentid']: 'Side Nav Button - Firewall Management',
      },
      {
        name: 'Banners',
        key: 'banners',
        onClick: () => {
          props.history.push('/admin/Banners');
        },
        isSelected: props.location.pathname.includes('/admin/Banners'),
        ['data-custom-id']: 'Banners',
        ['data-custom-bhvr']: 'NAVIGATION',
        ['data-custom-parentid']: 'Side Nav Button - Banners',
      },
    ],
  };

  const tenantSegmentAdminLink: INavLink = {
    name: 'Tenant Segment Admin',
    key: 'tenantSegmentAdmin',
    ariaLabel: `Tenant Segment Admin${
      totalPendingUserManagementRequests === 0
        ? ''
        : ` (${totalPendingUserManagementRequests} pending user management request${
            totalPendingUserManagementRequests === 1 ? '' : 's'
          })`
    }`,
    icon: 'Group',
    onClick: () => {
      props.history.push('/admin/TenantSegment');
    },
    isSelected: props.location.pathname === '/admin/TenantSegment',
    onRenderNavContent: (props, defaultRender) => {
      return (
        <Stack horizontal className={clsx(commonStyles.fullWidth)}>
          {defaultRender(props)}
          <CounterBadge
            className={clsx(
              counterBadgeStyles.sideNavCounterBadgeStyle,
              totalPendingUserManagementRequests > 99 &&
                counterBadgeStyles.sideNavCounterBadgeStyleWide
            )}
            count={totalPendingUserManagementRequests ?? 0}
          />
        </Stack>
      );
    },
    ['data-custom-id']: 'Tenant Segment Admin',
    ['data-custom-bhvr']: 'NAVIGATION',
    ['data-custom-parentid']: 'Side Nav Button - Tenant Segment Admin',
  };

  const authorTemplateManagementLink: INavLink = {
    name: 'Template Management',
    key: 'TemplateManagement',
    ariaLabel: 'Template Management',
    icon: 'ProductCatalog',
    onClick: () => props.history.push('/authorTemplateManagement'),
    isSelected: props.location.pathname === '/authorTemplateManagement',
    ['data-custom-id']: 'Author Template Management',
    ['data-custom-bhvr']: 'NAVIGATION',
    ['data-custom-parentid']: 'Side Nav Button - Author Template Management',
  };

  React.useEffect(() => {
    const newLinks: INavLink[] = featureFlagDashboard
      ? [
          {
            name: 'Home',
            key: 'MyWorkspaces',
            ariaLabel: 'Home',
            icon: 'Home',
            target: '_blank',
            onClick: () => {
              props.history.push('/');
            },
            isSelected: props.location.pathname === '/',
            ['data-custom-id']: 'Home',
            ['data-custom-bhvr']: 'NAVIGATION',
            ['data-custom-parentid']: 'Side Nav Button - Home',
          },
          {
            name: 'Dashboard',
            key: 'Dashboard',
            ariaLabel: 'Dashboard',
            icon: 'ViewDashboard',
            onClick: () => props.history.push('/dashboard'),
            isSelected: props.location.pathname === '/dashboard',
            ['data-custom-id']: 'Dashboard',
            ['data-custom-bhvr']: 'NAVIGATION',
            ['data-custom-parentid']: 'Side Nav Button - Dashboard',
          },
        ]
      : [
          {
            name: 'Home',
            key: 'MyWorkspaces',
            ariaLabel: 'Home',
            icon: 'PC1',
            target: '_blank',
            onClick: () => {
              props.history.push('/');
            },
            isSelected: props.location.pathname === '/',
            ['data-custom-id']: 'Home',
            ['data-custom-bhvr']: 'NAVIGATION',
            ['data-custom-parentid']: 'Side Nav Button - My Workspaces',
          },
        ];
    newLinks.push({
      name: 'New Workspace',
      key: 'NewWorkspace',
      icon: 'CircleAddition',
      ariaLabel: 'New Workspace',
      links: [],
    });

    if (featureFlagAzureCustom) {
      newLinks
        .find((link) => link.key === 'NewWorkspace')
        .links.push({
          name: 'Custom Workspace',
          key: 'customAzureWorkspace',
          onClick: () => {
            props.history.push('/NewWorkspace/Custom');
          },
          isSelected: props.location.pathname === '/NewWorkspace/Custom',
          ['data-custom-id']: 'Custom Workspace',
          ['data-custom-bhvr']: 'NAVIGATION',
          ['data-custom-parentid']: 'Side Nav Button - New Custom Workspace',
        });
    }

    newLinks
      .find((link) => link.key === 'NewWorkspace')
      .links.push({
        name: 'Template Workspace',
        key: 'templateTemplateWorkspace',
        onClick: () => {
          props.history.push('/NewWorkspace/Template');
        },
        isSelected: props.location.pathname === '/NewWorkspace/Template',
        ['data-custom-id']: 'Template Workspace',
        ['data-custom-bhvr']: 'NAVIGATION',
        ['data-custom-parentid']: 'Side Nav Button - New Template Workspace',
      });

    if (featureFlagAdmin && isAdmin) {
      newLinks.push(adminLinks);
    }
    if (featureFlagTenantSegmentAdmin && isTenantSegmentAdmin) {
      newLinks.push(tenantSegmentAdminLink);
    }
    if (
      featureFlagAuthorTemplateCreation &&
      segmentConstraint?.AllowTemplateCreation
    ) {
      newLinks.push(authorTemplateManagementLink);
    }
    newLinks.push({
      name: 'Documentation',
      key: 'Documentation',
      ariaLabel: 'Documentation',
      icon: 'Script',
      onClick: () => props.history.push('/documentation'),
      isSelected: props.location.pathname === '/documentation',
      ['data-custom-id']: 'Documentation',
      ['data-custom-bhvr']: 'NAVIGATION',
      ['data-custom-parentid']: 'Side Nav Button - Documentation',
    });
    setNavLinks(newLinks);
  }, [
    props.location,
    featureFlagAdmin,
    isAdmin,
    isTenantSegmentAdmin,
    featureFlagAzureCustom,
    segmentConstraint?.AllowTemplateCreation,
    totalPendingUserManagementRequests,
  ]);

  return (
    <CoherenceNav
      appName='My Workspace'
      styles={{ navGroup: { marginRight: 14 } }}
      groups={[
        {
          key: 'Left Nav Menu',
          links: navLinks,
        },
      ]}
      isNavCollapsed={props.isCollapsed}
      onNavCollapsed={props.onNavCollapsed}
    />
  );
};

export default withRouter(SideNav);
