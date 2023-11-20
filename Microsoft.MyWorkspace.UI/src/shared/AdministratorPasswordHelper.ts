import {
  AministratorPasswordCannotContainPassword,
  AdministratorPasswordIsNotComplexEnough,
  maxPasswordLength,
  minPasswordLength,
} from '../store/validators/ErrorConstants';

export const isPasswordValidLength = (password: string): boolean => {
  return (
    password.length >= minPasswordLength && password.length <= maxPasswordLength
  );
};

const containsPassword = (password: string): boolean => {
  const lowerCasePassword = password.toLowerCase();
  return lowerCasePassword.match(/p[a\@][s\$][s\$].*w[o0]rd/) !== null;
};

const isPasswordComplexEnough = (password: string): boolean => {
  const containsLowercase = password.match(/[a-z]/) !== null;
  const containsUppercase = password.match(/[A-Z]/) !== null;
  const containsNumber = password.match(/\d/) !== null;
  const containsSymbols = password.match(/[\W\_]/) !== null;
  return [
    containsLowercase,
    containsUppercase,
    containsNumber,
    containsSymbols,
  ].every((b) => b === true);
};

export const checkInvalidAdministratorPassword = (
  administratorPassword: string
): string | null => {
  if (containsPassword(administratorPassword)) {
    return AministratorPasswordCannotContainPassword;
  }
  if (!isPasswordComplexEnough(administratorPassword)) {
    return AdministratorPasswordIsNotComplexEnough;
  }
  return null;
};
