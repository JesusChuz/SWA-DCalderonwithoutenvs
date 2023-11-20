import { useEffect, useState } from 'react';

const retrieveItem = <T,>(key: string, serverValue: T, defaultValue: T) => {
  let stored: string = window.localStorage.getItem(key) ?? '';
  if (stored === 'undefined' || stored === 'null') {
    stored = null;
  }
  if (!stored && serverValue !== undefined && serverValue !== null) {
    stored = JSON.stringify(serverValue);
    window.localStorage.setItem(key, stored);
  } else if (!stored && defaultValue) {
    stored = JSON.stringify(defaultValue);
    window.localStorage.setItem(key, stored);
  } else if (!stored) {
    stored = JSON.stringify({});
  }
  return stored;
};

export const setItem = <T,>(key: string, value: T): void => {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(key));
};

// This hook will only overwrite the initialValue if it was originally set to null
// When using this hook, if you are binding the initialValue to redux data, make sure
// the redux data is initialized to null, so when the api fills in the actual value
// this will be updated.
export const useLocalStorage = <T,>(
  key: string,
  defaultValue: T,
  serverValue: T,
  callback: (newValue: T) => void = undefined
): T => {
  const getItem = () => {
    return JSON.parse(retrieveItem<T>(key, serverValue, defaultValue)) as T;
  };

  const [localStorageItem, setLocalStorageItem] = useState(getItem);
  const [initialItem, setInitialItem] = useState(serverValue);

  useEffect(() => {
    const handleUpdate = () => {
      const newValue = getItem();
      setLocalStorageItem(() => newValue);
      callback !== undefined && callback(newValue);
    };

    window.addEventListener(key, handleUpdate);

    if (initialItem !== serverValue && initialItem === null) {
      setInitialItem(serverValue);
      setItem(key, serverValue);
    }
    return () => window.removeEventListener(key, handleUpdate);
  }, [key, serverValue, callback]);

  return localStorageItem;
};
