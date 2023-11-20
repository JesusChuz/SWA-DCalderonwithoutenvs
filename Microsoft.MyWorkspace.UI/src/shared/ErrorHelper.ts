// if error is string, show user; else, grab error messages
export const getErrorMessage = (err: any): string => {
  if (typeof err === 'string') {
    return err;
  } else if (typeof err.response === 'string') {
    return err.response;
  } else if (err.response === undefined || err.response['data'] === undefined) {
    return 'Error message cannot be retrieved.';
  } else if (typeof err.response.data === 'string') {
    return err.response.data;
  }

  let result = '';
  if (err.response.data['title'] !== undefined) {
    result += `${err.response.data['title']} - `;
  }

  if (
    err.response.data['errors'] != undefined &&
    typeof err.response.data['errors'] === 'object'
  ) {
    for (const [key, value] of Object.entries(err.response.data['errors'])) {
      if (key !== '') {
        result += `${key} : ${value}\n`;
      } else {
        result += `${value}\n`;
      }
    }
  }

  return result;
};
