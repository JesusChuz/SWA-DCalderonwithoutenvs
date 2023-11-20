import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Default_UserPreferencesDto } from 'src/data/Default_UserPreferencesDto';
import { PreferencesLocalStorageKey } from 'src/shared/Constants';
import { useLocalStorage } from 'src/shared/LocalStorageHelper';
import { updatePreferences } from 'src/store/actions';
import { getCatalogUserProfile } from 'src/store/selectors';
import { UserPreferencesDto } from 'src/types/Catalog/UserPreferencesDto.types';

export const usePreferences = (
  callback: (newValue: UserPreferencesDto) => void = undefined
) => {
  const userProfile = useSelector(getCatalogUserProfile);
  const preferences = useLocalStorage<UserPreferencesDto>(
    PreferencesLocalStorageKey,
    Default_UserPreferencesDto,
    userProfile.Preferences,
    callback
  );

  return preferences;
};
