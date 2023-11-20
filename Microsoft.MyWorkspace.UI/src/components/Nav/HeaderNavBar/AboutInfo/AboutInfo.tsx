import * as React from 'react';
import { Link, Stack, Text, useTheme } from '@fluentui/react';
import { useSelector } from 'react-redux';
import preval from 'preval.macro';

import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { UserProfileDto } from '../../../../types/Catalog/UserProfileDto.types';
import {
  getFirewallApiVersion,
  getProvisioningApiVersion,
  getCatalogApiVersion,
  getCatalogUserProfile,
  getFrontendAPIVersion,
} from '../../../../store/selectors/index';
import { CopyDisplayField } from '../../../GeneralComponents/CopyDisplayField';

export const AboutInfo = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const user: UserProfileDto = useSelector(getCatalogUserProfile);
  const link =
    user.Mail.indexOf('@microsoft.com') === -1
      ? 'https://privacy.microsoft.com/en-us/privacystatement'
      : 'https://privacy.microsoft.com/en-US/data-privacy-notice';

  const catalogVersion = useSelector(getCatalogApiVersion);
  const provisioningVersion = useSelector(getProvisioningApiVersion);
  const firewallVersion = useSelector(getFirewallApiVersion);
  const frontendVersion = useSelector(getFrontendAPIVersion);

  return (
    <>
      <Stack className={commonStyles.paddingTop12}>
        <Text>
          <b>Warning:</b> This computer program is protected by copyright law
          and international treaties. Unauthorized reproduction or distribution
          of this program, or any portion of it, may result in severe civil and
          criminal penalties, and will be prosecuted to the maximum extent
          possible under the law.
        </Text>
        <Text className={commonStyles.paddingTop8}>
          &#169; Microsoft Corporation. All rights reserved.
        </Text>
        <Link target='_blank' className={commonStyles.paddingTop8} href={link}>
          Microsoft Privacy Statement
        </Link>
      </Stack>
      <Stack className={commonStyles.paddingTop12}>
        <CopyDisplayField label='Catalog API Version' value={catalogVersion} />
        <CopyDisplayField
          label='Provisioning API Version'
          value={provisioningVersion}
        />
        <CopyDisplayField
          label='Firewall API Version'
          value={firewallVersion}
        />
        <CopyDisplayField
          label='FrontEnd API Version'
          value={frontendVersion}
        />
        <CopyDisplayField
          label='React App Build Date'
          value={preval`module.exports = new Date().toLocaleString('us-PT');`}
        />
      </Stack>
    </>
  );
};

export { AboutInfo as default };
