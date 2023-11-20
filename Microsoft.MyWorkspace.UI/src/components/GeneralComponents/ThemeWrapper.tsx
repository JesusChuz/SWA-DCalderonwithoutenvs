import * as React from 'react';
import { Theme, ThemeProvider } from '@fluentui/react';
import { Themes } from '../../types/enums/Themes';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePreferences } from 'src/hooks/usePreferences';
import {
  CoherenceV9LightTheme,
  CoherenceV9DarkTheme,
} from '@coherence-design-system/styles';

export const getThemeDarkOrLight = (
  t: Themes,
  systemThemeDark: boolean
): Themes => {
  let th = Themes.Light;
  switch (t) {
    case Themes.Dark:
      th = Themes.Dark;
      break;
    case Themes.Light:
      th = Themes.Light;
      break;
    case Themes.SystemDefault:
      th = systemThemeDark ? Themes.Dark : Themes.Light;
      break;
  }
  return th;
};

interface IProps {
  children?: React.ReactNode;
}

export const ThemeWrapper = (props: IProps) => {
  const systemThemeDark = useMediaQuery('(prefers-color-scheme: dark)');
  const preferences = usePreferences();

  const theme: Theme = React.useMemo(() => {
    const t: Themes = getThemeDarkOrLight(preferences?.Theme, systemThemeDark);
    return t === Themes.Dark ? CoherenceV9DarkTheme : CoherenceV9LightTheme;
  }, [preferences, systemThemeDark]);

  const severeWarningBackground: string = React.useMemo(() => {
    const t: Themes = getThemeDarkOrLight(preferences?.Theme, systemThemeDark);
    return t === Themes.Dark
      ? '#501802'
      : theme.semanticColors.severeWarningBackground;
  }, [preferences, systemThemeDark]);

  return (
    <ThemeProvider applyTo='body' theme={theme}>
      <style>
        {`h3 { color: ${theme.semanticColors.bodyText};}
          h4 { color: ${theme.semanticColors.bodyText};}
          p { color: ${theme.semanticColors.bodyText};}
          .ms-Stack { color: ${theme.semanticColors.bodyText};}
          text { fill: ${theme.semanticColors.bodyText}; color: ${theme.semanticColors.bodyText};}
          .ms-MessageBar--severeWarning { background: ${severeWarningBackground}; }`}
      </style>
      {props.children}
    </ThemeProvider>
  );
};
