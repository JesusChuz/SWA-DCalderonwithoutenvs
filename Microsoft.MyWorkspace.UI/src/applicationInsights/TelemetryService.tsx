import axios from 'axios';
import {
  IMetricTelemetry,
  ITraceTelemetry,
} from '@microsoft/applicationinsights-web';
import { Config } from '../types/Config/Config.types';

export class TelemetryService {
  currentTime: Date | undefined;
  appInsights: any;

  constructor() {
    const appInsightsPromise = import('@microsoft/applicationinsights-web');
    const clickAnalyticsPromise = import(
      '@microsoft/applicationinsights-clickanalytics-js'
    );
    axios
      .get<Config>('api/config', { baseURL: process.env.REACT_APP_API_URL })
      .then(async (res) => {
        const { ApplicationInsights } = await appInsightsPromise;
        const { ClickAnalyticsPlugin } = await clickAnalyticsPromise;
        const clickPluginInstance = new ClickAnalyticsPlugin();
        // Click Analytics configuration
        const clickPluginConfig = {
          autoCapture: true,
          dataTags: {
            customDataPrefix: 'data-custom-',
            useDefaultContentNameOrId: true,
            parentDataTag: 'parent-group',
          },
        };
        this.appInsights = new ApplicationInsights({
          config: {
            instrumentationKey: res.data.AppInsightsKey,
            extensions: [clickPluginInstance],
            extensionConfig: {
              [clickPluginInstance.identifier]: clickPluginConfig,
            },
          },
        });
        this.appInsights.loadAppInsights();
        this.appInsights.trackPageView();
      });
    this.currentTime = new Date();
  }

  public logPageView(
    name?: string,
    uri?: string,
    properties?: { [name: string]: string },
    measurements?: { [name: string]: number },
    duration?: number
  ) {
    if (!this.appInsights) return;
    this.appInsights.trackPageView({
      name,
      uri,
      properties: {
        duration,
        ...(this.appendCustomProperties(properties) as {
          [name: string]: string;
        }),
      },
      measurements,
    });
  }

  public logEvent(
    name: string,
    properties?: { [name: string]: string },
    measurements?: { [name: string]: number }
  ) {
    if (!this.appInsights) return;
    const propData = this.appendCustomProperties(properties);
    this.appInsights.trackEvent(
      { name },
      { ...(propData as { [name: string]: string }), measurements }
    );
  }

  public logException(exception: Error) {
    if (!this.appInsights) return;
    this.appInsights.trackException({ exception });
  }

  public logMetric(
    metric: IMetricTelemetry,
    customProperties?: { [name: string]: unknown }
  ) {
    if (!this.appInsights) return;
    this.appInsights.trackMetric(metric, {
      ...(customProperties as { [name: string]: string }),
    });
  }

  public logTrace(
    trace: ITraceTelemetry,
    customProperties?: { [name: string]: unknown }
  ) {
    if (!this.appInsights) return;
    this.appInsights.trackTrace(
      trace,
      customProperties as { [name: string]: string }
    );
  }

  public appendCustomProperties(properties?: { [name: string]: unknown }): {
    [name: string]: unknown;
  } {
    this.currentTime = new Date();
    properties = properties || {};
    return properties;
  }

  public setAuthenticatedUserContext(userId: string, teamId: string) {
    this.appInsights.setAuthenticatedUserContext(userId, teamId, true);
  }
}

const telemetryContext = new TelemetryService();

export { telemetryContext };
