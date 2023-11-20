import {
  Configuration,
  InteractionRequiredAuthError,
  PublicClientApplication,
} from '@azure/msal-browser';

const configuration: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: `${window.location.origin}/authenticated`,
    navigateToLoginRequestUrl: false,
  },
};

export const application = new PublicClientApplication(configuration);

export const acquireAccessToken = async (): Promise<string> => {
  const accounts = application.getAllAccounts();

  if (accounts.length === 0) {
    throw new Error('user not logged in.');
  }

  const request = {
    scopes: [`api://${process.env.REACT_APP_CLIENT_ID}/user_impersonation`],
    account: accounts[0],
  };

  let authResult;

  try {
    authResult = await application.acquireTokenSilent(request);
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      application.acquireTokenRedirect(request);
    }
  }

  return authResult.accessToken;
};
