import * as React from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import {
  getCampaignDefinitions,
  getCampaignDefinitionsLoadedFirstTime,
  getCatalogUserProfile,
  getUserProfileLoaded,
} from '../../../../store/selectors';
import {
  getFeatureFlagOcvFloodgate,
  getFrontendAPIVersion,
  getFrontendAPIVersionLoaded,
  getOCVAppId,
  getOcvEnvironment,
} from '../../../../store/selectors/configSelectors';
import { Themes } from '../../../../types/enums/Themes';
import {
  AppResumeActivity,
  AppUsageTimeActivity,
} from './CampaignDefinitionActivities';
import { DataField } from '@microsoft/oteljs';
import { UserProfileDto } from 'src/types/Catalog/UserProfileDto.types';
import { IMsalContext, useIsAuthenticated, useMsal } from '@azure/msal-react';
import {
  logFloodgateActivityStartTime,
  logFloodgateActivity,
  logFloodgateActivityStopTime,
} from './OCVHelpers';
import {
  CoherenceV9LightTheme,
  CoherenceV9DarkTheme,
} from '@coherence-design-system/styles';

declare global {
  interface Window {
    OfficeBrowserFeedback: unknown;
  }
}

export const OCVFeedback = (): JSX.Element => {
  const lightModeStylesUrl =
    'officebrowserfeedback/styles/officebrowserfeedback.min.css';
  const darkModeStylesUrl =
    'officebrowserfeedback/styles/officebrowserfeedback_dark.min.css';
  const env = useSelector(getOcvEnvironment);
  const systemThemeDark = useMediaQuery('(prefers-color-scheme: dark)');
  const appId = useSelector(getOCVAppId);
  const featureFlagOcvFloodgate = useSelector(getFeatureFlagOcvFloodgate);
  const campaignDefinitions = useSelector(getCampaignDefinitions);
  const campaignDefinitionsLoadedFirstTime = useSelector(
    getCampaignDefinitionsLoadedFirstTime
  );
  const userProfile = useSelector(getCatalogUserProfile);
  const userProfileLoaded = useSelector(getUserProfileLoaded);
  const frontendAPIVersion = useSelector(getFrontendAPIVersion);
  const frontendAPIVersionLoaded = useSelector(getFrontendAPIVersionLoaded);
  const [ocvLoaded, setOcvLoaded] = React.useState(false);
  const msal = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const initializeFloodgate = async () => {
    await window.OfficeBrowserFeedback.floodgate.initialize?.().then(
      () => {
        window.OfficeBrowserFeedback.floodgate
          .start?.()
          .then(() => {
            logFloodgateActivityStartTime(AppUsageTimeActivity);
            logFloodgateActivity(AppResumeActivity);
          })
          .catch((err: any) => {
            console.log('floodgate start failed with error: ' + err);
          });
        window.addEventListener('blur', () => {
          logFloodgateActivityStopTime(AppUsageTimeActivity);
          window.OfficeBrowserFeedback.floodgate.stop();
        });
        window.addEventListener('focus', () => {
          window.OfficeBrowserFeedback.floodgate
            .start()
            .then(() => logFloodgateActivityStartTime(AppUsageTimeActivity));
        });
        window.addEventListener('unload', () => {
          logFloodgateActivityStopTime(AppUsageTimeActivity);
          window.OfficeBrowserFeedback.floodgate.stop();
        });
      },
      (err: any) => {
        console.log('floodgate initialization failed with error: ' + err);
      }
    );
  };

  const initializeTelemetry = async (
    msalContext: IMsalContext,
    frontendAPIVersion: string
  ) => {
    const oteljsPromise = import('@microsoft/oteljs');
    const otel1dsPromise = import('@microsoft/oteljs-1ds');
    const OTel = await oteljsPromise;
    const [account] = msalContext.accounts;
    const persistentDataFields: DataField[] = [
      ...OTel.User.getFields({
        // Required if applicable
        primaryIdentityHash: account.localAccountId,
        primaryIdentitySpace: 'UserObjectId',
        tenantId: account.tenantId,
        isAnonymous: false,
      }),
      ...OTel.App.getFields({
        name: 'MyWorkspace',
        platform: 'Web',
        version: frontendAPIVersion,
      }),
      ...OTel.Session.getFields({
        id: (account.idTokenClaims as { uti: string }).uti,
      }),
    ];

    const { OneDSSink, OneDSEndpoint } = await otel1dsPromise;
    return new OneDSSink(persistentDataFields, {
      endpointUrl: OneDSEndpoint.EUDB,
    });
  };

  const getSystemTheming = (
    userProfile: UserProfileDto,
    systemThemeDark: boolean
  ): { stylesUrl: string; primaryColour: string; secondaryColour: string } => {
    let theme = userProfile?.Preferences?.Theme;
    if (theme === Themes.SystemDefault) {
      theme = systemThemeDark ? Themes.Dark : Themes.Light;
    }
    const selectedTheme =
      theme === Themes.Light ? CoherenceV9LightTheme : CoherenceV9DarkTheme;
    return {
      stylesUrl:
        theme === Themes.Light ? lightModeStylesUrl : darkModeStylesUrl,
      primaryColour: selectedTheme.palette.themePrimary,
      secondaryColour: selectedTheme.palette.themeDarkAlt,
    };
  };

  React.useEffect(() => {
    if (
      env !== null &&
      userProfileLoaded &&
      appId !== 0 &&
      isAuthenticated &&
      frontendAPIVersionLoaded &&
      msal?.accounts.length > 0
    ) {
      const telemetrySinkPromise = initializeTelemetry(
        msal,
        frontendAPIVersion
      );

      telemetrySinkPromise.then(async (telemetrySink) => {
        const { primaryColour, secondaryColour, stylesUrl } = getSystemTheming(
          userProfile,
          systemThemeDark
        );
        window.OfficeBrowserFeedback.initOptions = {
          appId,
          stylesUrl,
          intlUrl: 'officebrowserfeedback/OCVOverwrite/',
          intlFilename: 'officebrowserfeedbackstringsOW.js',
          environment: env, // 0 - Prod, 1 - Int
          primaryColour,
          secondaryColour,
          userEmail: userProfile.Mail,
          telemetrySink,
          onError: (err: string) => {
            console.log('Feedback SDK encountered error: ' + err);
          },
          customResourcesSetExternally: 0,
        };
        setOcvLoaded(true);
      });
    }
  }, [
    env,
    userProfileLoaded,
    frontendAPIVersionLoaded,
    systemThemeDark,
    appId,
    msal,
    isAuthenticated,
  ]);

  React.useEffect(() => {
    if (
      env !== null &&
      featureFlagOcvFloodgate &&
      campaignDefinitionsLoadedFirstTime &&
      ocvLoaded
    ) {
      window.OfficeBrowserFeedback.floodgate =
        window.OfficeBrowserFeedback.floodgate || {};
      window.OfficeBrowserFeedback.floodgate.initOptions = {
        autoDismiss: 5,
        campaignDefinitions: campaignDefinitions,
      };
      initializeFloodgate();
    }
  }, [
    env,
    featureFlagOcvFloodgate,
    campaignDefinitions,
    campaignDefinitionsLoadedFirstTime,
    ocvLoaded,
  ]);

  return <div></div>;
};
