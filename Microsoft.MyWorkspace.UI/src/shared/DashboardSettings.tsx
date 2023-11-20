import { useEffect, useState } from 'react';

type ViewType = 'list' | 'card';
export type DashboardSettingsValue =
  | { [key: string]: boolean }
  | ViewType
  | string[]
  | number;
export interface DashboardSettings {
  listViewColumns: { [key: string]: boolean };
  cardViewColumns: { [key: string]: boolean };
  view: ViewType;
  viewedMessages: string[];
  workspaceRefreshInterval: number;
}

export const workspaceRefreshIntervals = [
  { text: 'off', key: 0 },
  { text: '15 seconds', key: 15000 },
  { text: '30 seconds (default)', key: 30000 },
  { text: '1 minute', key: 60000 },
  { text: '2 minutes', key: 120000 },
];

export const workspaceViews = [
  { text: 'Card', value: 'card' },
  { text: 'List', value: 'list' },
];

export const cardViewColumns = [
  { label: 'Description', val: 'Description' },
  { label: 'Owner', val: 'Owner' },
  { label: 'Shared Owners', val: 'SharedOwners' },
  { label: 'Workspace ID', val: 'ID' },
  { label: 'Machines', val: 'Machines' },
];

// Status and Name should never be switched to false
const defaultDashboardSettings: DashboardSettings = {
  listViewColumns: {
    description: false,
    geography: true,
    region: false,
    OwnerEmail: true,
    workspaceID: false,
    sharedOwners: false,
    Created: true,
    machines: true,
  },
  cardViewColumns: {
    'Workspace ID': false,
    'Shared Owners': false,
    Description: false,
    Owner: false,
  },
  view: 'list',
  viewedMessages: [],
  workspaceRefreshInterval: 30000,
};

const updateSettings = () => {
  let stored: string = window.localStorage.getItem('workspaceSettings') ?? '';
  if (!stored) {
    stored = JSON.stringify(defaultDashboardSettings);
    window.localStorage.setItem('workspaceSettings', stored);
  } else {
    const s = JSON.parse(stored);
    for (const key in defaultDashboardSettings) {
      if (!s[key] && s[key] !== 0) {
        s[key] = defaultDashboardSettings[key as keyof DashboardSettings];
      }
    }
    // temp fix so error doesn't occur if a user hasn't cleared cache
    if (s.listViewColumns['farm']) {
      s.listViewColumns['farmOrRegion'] = s.listViewColumns['farm'];
      delete s.listViewColumns['farm'];
    }
    stored = JSON.stringify(s);
  }
  return stored;
};

export default function useDashboardSettings(): DashboardSettings {
  function getSettings() {
    return JSON.parse(updateSettings());
  }

  const [settings, setSettings] = useState(getSettings);

  useEffect(() => {
    function handleUpdate() {
      setSettings(getSettings());
    }

    window.addEventListener('workspaceSettings', handleUpdate);
    return () => window.removeEventListener('workspaceSettings', handleUpdate);
  }, []);

  return settings;
}

export const setDashboardSettings = (
  key: keyof DashboardSettings,
  value: DashboardSettingsValue
): void => {
  const stored = JSON.parse(
    window.localStorage.getItem('workspaceSettings') ?? ''
  );
  stored[key] = value;
  window.localStorage.setItem('workspaceSettings', JSON.stringify(stored));
  window.dispatchEvent(new Event('workspaceSettings'));
};
