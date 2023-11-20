import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react';
import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const BreadCrumbs = (): JSX.Element => {
  const history = useHistory();
  const location = useLocation();

  const onClick = (ev: React.MouseEvent<HTMLElement>, item: IBreadcrumbItem) =>
    history.push(item.key);

  const links: IBreadcrumbItem[] = useMemo(() => {
    const items: IBreadcrumbItem[] = [
      { text: 'Home', key: '/', onClick: onClick },
    ];

    const path = location.pathname.substring(1, location.pathname.length);
    if (path === 'NewWorkspace/Template')
      items.push({
        text: 'Template Workspace',
        key: location.pathname,
        onClick: onClick,
      });
    else if (path === 'templaterequests')
      items.push({
        text: 'My Template Requests',
        key: location.pathname,
        onClick: onClick,
      });
    else if (path === 'NewWorkspace/Custom')
      items.push({
        text: 'Custom Workspace',
        key: location.pathname,
        onClick: onClick,
      });
    else if (path === 'admin/WorkspaceSearch')
      items.push({
        text: 'Admin Workspace Search',
        key: location.pathname,
        onClick: onClick,
      });
    else if (path.startsWith('admin/Banners')) {
      const paths = path.split('/');
      items.push({
        text: 'Banners',
        key: '/admin/Banners',
        onClick: onClick,
      });
      if (paths.length > 2) {
        items.push({
          text: paths[2] === 'New' ? 'New' : 'Edit',
          key: location.pathname,
          onClick: onClick,
        });
      }
    } else if (path === 'admin/RbacSearch')
      items.push({
        text: 'Admin RBAC Search',
        key: location.pathname,
        onClick: onClick,
      });
    else if (path === 'admin/AzureQuotaStatus')
      items.push({
        text: 'Azure Subscriptions Quotas',
        key: location.pathname,
        onClick: onClick,
      });
    else if (path === 'admin/TenantSegment')
      items.push({
        text: 'Tenant Segment Admin Dashboard',
        key: location.pathname,
        onClick: onClick,
      });
    else if (path.startsWith('admin/FirewallManagement')) {
      items.push({
        text: 'Firewall Management',
        key: '/admin/FirewallManagement/',
        onClick: onClick,
      });
    } else if (path.includes('admin')) {
      const paths = path.split('/');
      items.push({
        text: 'Admin Workspace Properties',
        key: `/admin/${paths[1]}`,
        onClick: onClick,
      });
      if (paths.length > 2)
        items.push({
          text: 'Admin Machine Properties',
          key: location.pathname,
          onClick: onClick,
        });
    } else if (path.includes('edit')) {
      const paths = path.split('/');
      items.push({ text: paths[0], key: location.pathname, onClick: onClick });
    } else if (path === 'dashboard') {
      items.push({
        text: 'Dashboard',
        key: location.pathname,
        onClick: onClick,
      });
    } else if (path === 'authorTemplateManagement') {
      items.push({
        text: 'Author Template Management',
        key: location.pathname,
        onClick: onClick,
      });
    } else if (path === 'documentation') {
      items.push({
        text: 'Documentation',
        key: location.pathname,
        onClick: onClick,
      });
    } else if (path !== '') {
      const paths = path.split('/');
      items.push({
        text: 'Workspace Properties',
        key: `/${paths[0]}`,
        onClick: onClick,
      });
      if (paths.length > 1)
        items.push({
          text: 'Machine Properties',
          key: location.pathname,
          onClick: onClick,
        });
    }

    return items;
  }, [location]);

  return (
    <Breadcrumb
      style={{ position: 'absolute', marginLeft: '20px' }}
      items={links}
      maxDisplayedItems={3}
      ariaLabel='Breadcrumbs with links'
      overflowAriaLabel='More links'
      focusZoneProps={{ handleTabKey: 1 }}
    />
  );
};
