import { useTheme } from '@fluentui/react';
import { useMemo } from 'react';
import { getCommonStyles } from 'src/components/GeneralComponents/CommonStyles';

export const useCommonStyles = (): ReturnType<typeof getCommonStyles> => {
  const theme = useTheme();

  return useMemo(() => {
    return getCommonStyles(theme);
  }, [theme]);
};
