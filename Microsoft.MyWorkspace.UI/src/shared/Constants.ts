export const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
export const MAX_DISK_SIZE_GB = 32767;
export const MIN_DISK_SIZE_GB = 1;
export const MAX_OS_DISK_SIZE_GB_LIMIT = 1024;
export const TENANT_SEGMENT_CONTRIBUTOR_ROLE_NAME = 'TenantSegmentContributor';
export const PUBLIC_IP_ADDRESSES_INFO_TEXT =
  'Public facing addresses of the workspace. When configured, all external connectivity traffic uses these addresses.';
export const PRIVATE_MODE_ONLY_DOMAINS_INFO_TEXT =
  'The domains your segment administrator has set up to block traffic. This only applies to workspaces which are not in Private Mode. This helps protect assets from being exposed to the public internet.';
export const PORT_MAPPINGS_INFO_TEXT =
  'Mappings to expose internal ports in the workspace. These mappings define how NAT (Network Address Translation) is applied to external connectivity traffic.';
export const PreferencesLocalStorageKey = 'UserPreferences';
export const bannerMessageClassName = 'messageBarBanner';
export const URL_REGEX =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
export const EMAIL_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
