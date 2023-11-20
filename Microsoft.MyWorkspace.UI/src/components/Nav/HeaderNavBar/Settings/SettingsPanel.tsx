import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionButton, Dropdown, IIconProps, Separator } from '@fluentui/react';

import { setOpenedPanel, updatePreferences } from '../../../../store/actions';
import {
  getCatalogUserProfile,
  getFeatureUserPreferences,
} from '../../../../store/selectors';
import { setItem } from '../../../../shared/LocalStorageHelper';
import { PreferencesLocalStorageKey } from '../../../../shared/Constants';
import { Themes } from '../../../../types/enums/Themes';
import { usePreferences } from 'src/hooks/usePreferences';

const InfoIcon: IIconProps = { iconName: 'Info' };

const themeOptions = [
  { key: Themes.Light, text: 'Light' },
  { key: Themes.Dark, text: 'Dark' },
  { key: Themes.SystemDefault, text: 'System Default' },
];

export const SettingsPanel = () => {
  const dispatch = useDispatch();
  const showPreferences = useSelector(getFeatureUserPreferences);
  const userProfile = useSelector(getCatalogUserProfile);
  const preferences = usePreferences((newPreferences) =>
    dispatch(updatePreferences({ ...userProfile, Preferences: newPreferences }))
  );

  return (
    <div>
      {showPreferences && (
        <>
          <Dropdown
            label='Theme'
            selectedKey={preferences?.Theme}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(v, o) =>
              setItem(PreferencesLocalStorageKey, {
                ...preferences,
                Theme: o.key,
              })
            }
            placeholder='Select an option'
            options={themeOptions}
          />
          <Separator>Information</Separator>
        </>
      )}
      <ActionButton
        iconProps={InfoIcon}
        onClick={() => dispatch(setOpenedPanel('quotas'))}
      >
        View My Quotas
      </ActionButton>
      <ActionButton
        iconProps={InfoIcon}
        onClick={() => dispatch(setOpenedPanel('about'))}
      >
        View Product Information
      </ActionButton>
    </div>
  );
};
