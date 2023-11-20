import { Spinner, SpinnerSize, useTheme } from '@fluentui/react';
import * as React from 'react';
import { getCommonStyles } from './CommonStyles';

export const LazyLoadingSpinner = (): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [displaySpinner, setDisplaySpinner] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDisplaySpinner(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return displaySpinner ? (
    <Spinner size={SpinnerSize.large} className={commonStyles.loading} />
  ) : (
    <></>
  );
};
