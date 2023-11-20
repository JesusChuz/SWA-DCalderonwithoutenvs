import { TooltipHost, ImageIcon } from '@fluentui/react';
import * as React from 'react';
import { useCommonStyles } from 'src/hooks/useCommonStyles';
import { OSVersion } from 'src/types/enums/OSVersion';
import { Themes } from 'src/types/enums/Themes';
import { getThemeDarkOrLight } from './ThemeWrapper';
import windowsLogo from '../../assets/windows-logo.svg';
import linuxLogo from '../../assets/linux-logo.svg';
import { useMediaQuery } from 'src/hooks/useMediaQuery';
import { usePreferences } from 'src/hooks/usePreferences';

interface IProps {
  osVersion: OSVersion;
  height?: number;
  width?: number;
}

export const OSIcon = (props: IProps): JSX.Element => {
  const commonStyles = useCommonStyles();
  const preferences = usePreferences();
  const systemThemeDark = useMediaQuery('(prefers-color-scheme: dark)');
  const osName = props.osVersion === OSVersion.Windows ? 'Windows' : 'Linux';
  const osImage =
    props.osVersion === OSVersion.Windows ? windowsLogo : linuxLogo;
  return (
    <div className={commonStyles.osIcon}>
      <TooltipHost content={osName}>
        <ImageIcon
          aria-label={`${osName} Logo`}
          imageProps={{
            src: osImage,
            alt: osName,
            height: props.height ?? 16,
            width: props.width ?? 16,
            shouldFadeIn: false,
          }}
          className={commonStyles.displayBlock}
          style={{
            filter: `invert(${
              getThemeDarkOrLight(preferences?.Theme, systemThemeDark) ===
              Themes.Dark
                ? 1
                : 0
            }`,
          }}
        />
      </TooltipHost>
    </div>
  );
};
