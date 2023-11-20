import { Dispatch } from '@reduxjs/toolkit';
import { IFullOptions, json2csvAsync } from 'json-2-csv';
import { showErrorNotification } from '../../store/actions';

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

interface BrowserRegex {
  chrome: RegExp;
  safari: RegExp;
  firefox: RegExp;
  ie: RegExp;
}

const initiateDownload = (
  filename: string,
  content: string | number | boolean
): void => {
  const a = document.createElement('a');
  const contentType = 'data:application/octet-stream,';
  const uriContent = contentType + encodeURIComponent(content);
  a.setAttribute('href', uriContent);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadModernRDP = (fileURL: string): void => {
  const fileName = 'modernRDP.exe';
  const a = document.createElement('a');
  a.setAttribute('href', fileURL);
  a.setAttribute('download', fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const downloadFile = (filename: string, data: string) => {
  const userAgent: string = window.navigator.userAgent;
  const browsers: BrowserRegex = {
    chrome: /chrome/i,
    safari: /safari/i,
    firefox: /firefox/i,
    ie: /Trident/i,
  };

  let userBrowser = 'unknown';

  for (const key in browsers) {
    if (Object.prototype.hasOwnProperty.call(browsers, key)) {
      if (browsers[key as keyof BrowserRegex].test(userAgent)) {
        userBrowser = key;
        break;
      }
    }
  }

  if (userAgent.indexOf('Edge') > -1) userBrowser = 'Edge';

  if (userBrowser !== 'ie' && userBrowser !== 'Edge') {
    window.setTimeout(() => {
      initiateDownload(filename, data);
    });
  } else {
    const blob = new Blob([decodeURIComponent(encodeURI(data))], {
      type: 'text/csv;charset=utf-8;',
    });

    navigator.msSaveBlob(blob, filename);
  }
};

export async function downloadJsonAsCSV<T extends object>(
  dispatch: Dispatch,
  json: T[],
  fileName: string,
  keys: (keyof T)[] = null,
  options: Partial<IFullOptions> = {}
) {
  try {
    const csv = await json2csvAsync(json, {
      emptyFieldValue: '',
      keys: keys as string[],
      ...options,
    });
    downloadCSV(csv, fileName);
  } catch (err) {
    dispatch(showErrorNotification('Exporting to CSV failed.'));
  }
}

const downloadCSV = (content: string, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  const blob = new Blob([content], { type: 'data/csv' });
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
