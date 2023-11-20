import { AzureWorkspaceDto } from '../types/AzureWorkspace/AzureWorkspaceDto.types';

export const copyToClipboard = (str: string): void => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();

  try {
    document.execCommand('copy');
  } catch (ex) {
    console.log(ex); // Need to update logging
  }

  document.body.removeChild(el);
};

// TODO: needs to be updated to new logic
export const getAutoShutdownInMins = (
  azureWorkspace: AzureWorkspaceDto
): number => {
  return new Date(azureWorkspace.Created).getMilliseconds();
};

export const getAutoShutdownText = (
  azureWorkspace: AzureWorkspaceDto
): string => {
  const shutdownMins = getAutoShutdownInMins(azureWorkspace);
  return (
    `Auto shutdown in ${shutdownMins}` + (shutdownMins > 1 ? ' mins' : ' min')
  );
};
