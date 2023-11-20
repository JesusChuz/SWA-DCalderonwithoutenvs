import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { clearStoredPath, getStoredPath } from '../../shared/StoredRoute';

export const AuthenticatedRedirect = (): JSX.Element => {
  const location = getStoredPath();

  React.useEffect(() => {
    return () => clearStoredPath();
  }, []);

  return (
    <Redirect
      to={location === null || location === '/authenticated' ? '/' : location}
    />
  );
};
