const SessionStorageKey = 'local-url';

export const storeCurrentPath = (): Promise<void> => {
  return Promise.resolve(
    window.sessionStorage.setItem(
      SessionStorageKey,
      `${window.location.pathname}${window.location.search}`
    )
  );
};

export const getStoredPath = (): string => {
  return window.sessionStorage.getItem(SessionStorageKey);
};

export const clearStoredPath = (): void => {
  window.sessionStorage.removeItem(SessionStorageKey);
};
