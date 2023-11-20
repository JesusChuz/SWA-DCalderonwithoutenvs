export const loadOCVScript = () => {
  const fjs = document.getElementsByTagName('script')[0];
  if (document.getElementById('officebrowserfeedback-jssdk')) {
    return;
  }
  const js: HTMLScriptElement = document.createElement(
    'script'
  ) as HTMLScriptElement;
  js.id = 'officebrowserfeedback-jssdk';
  js.async = true;
  js.src =
    'officebrowserfeedback/scripts/officebrowserfeedback_floodgate.min.js';
  fjs.parentNode?.insertBefore(js, fjs);
};

export const logFloodgateActivity = (activityName: string, increment = 1) => {
  window?.OfficeBrowserFeedback?.floodgate
    ?.getEngine()
    ?.getActivityListener()
    ?.logActivity(activityName, increment);
};

export const logFloodgateActivityStartTime = (
  activityName: string,
  startTime?: Date
) => {
  window?.OfficeBrowserFeedback?.floodgate
    ?.getEngine()
    ?.getActivityListener()
    ?.logActivityStartTime(activityName, startTime);
};

export const logFloodgateActivityStopTime = (
  activityName: string,
  stopTime?: Date
) => {
  window?.OfficeBrowserFeedback?.floodgate
    ?.getEngine()
    ?.getActivityListener()
    ?.logActivityStopTime(activityName, stopTime);
};
