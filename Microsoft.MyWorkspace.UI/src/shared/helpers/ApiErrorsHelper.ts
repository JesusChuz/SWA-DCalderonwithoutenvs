/*
 * Use this method when the error response is formatted like:
 *
 * {
 *  errors: {
 *      someKey: ["array", "of", "errors"]
 *  }
 * }
 *
 */
export const apiErrorToString = (errors: Record<string, string[]>) => {
  let errorString = '';
  for (const [key, value] of Object.entries(errors)) {
    for (let i = 0; i < value.length; i++) {
      errorString += value[i];
      if (i < value.length - 1) {
        errorString += '\n';
      }
    }
  }
  return errorString;
};
