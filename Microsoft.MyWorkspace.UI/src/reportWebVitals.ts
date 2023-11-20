import { onLCP, onFID, onCLS, onINP, onFCP, onTTFB, Metric } from 'web-vitals';
import { telemetryContext } from './applicationInsights/TelemetryService';
import { isLocalhost } from './serviceWorkerRegistration';

const callback = (metric: Metric) => {
  if (!isLocalhost) {
    telemetryContext.logMetric(
      {
        name: metric.name,
        average: metric.value,
      },
      { metric }
    );
  }
};

const reportWebVitals = () => {
  onCLS(callback);
  onFID(callback);
  onLCP(callback);
  onINP(callback);
  onFCP(callback);
  onTTFB(callback);
};

export default reportWebVitals;
