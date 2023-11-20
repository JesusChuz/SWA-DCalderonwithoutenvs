import { OSVersion } from '../types/enums/OSVersion';
import {
  AdministratorNameIllegalCharacters,
  AdministratorNameIsInvalid,
  AdministratorNameRange,
} from '../store/validators/ErrorConstants';
import { reservedWords } from 'src/store/validators/workspaceValidators';

// Validation checks taken from here: https://learn.microsoft.com/en-us/rest/api/compute/virtual-machines/create-or-update?tabs=HTTP#osprofile

export const minAdministratorNameLength = 1;
export const maxAdministratorNameLengthWindows = 20;
export const maxAdministratorNameLengthLinux = 64;

const illegalCharactersRegex = /[\\/\"\[\]\:\|\<\>\+\=\;\,\?\*\@\./\s/]/;

export const invalidNames = [
  'administrator',
  'admin',
  'user',
  'user1',
  'test',
  'user2',
  'test1',
  'user3',
  'admin1',
  '1',
  '123',
  'a',
  'actuser',
  'adm',
  'admin2',
  'aspnet',
  'backup',
  'console',
  'david',
  'guest',
  'john',
  'owner',
  'root',
  'server',
  'sql',
  'support',
  'support_388945a0',
  'sys',
  'test2',
  'test3',
  'user4',
  'user5',
];

export const isAdministratorNameValidLength = (
  os: OSVersion,
  name: string
): boolean => {
  return (
    name.length >= minAdministratorNameLength &&
    ((os === OSVersion.Linux &&
      name.length <= maxAdministratorNameLengthLinux) ||
      (os === OSVersion.Windows &&
        name.length <= maxAdministratorNameLengthWindows))
  );
};

export const checkInvalidAdministratorName = (
  administratorName: string
): string | null => {
  const name = administratorName.toLowerCase();
  const invalidName = invalidNames
    .concat(reservedWords)
    .find((n) => name === n);
  if (invalidName) {
    return AdministratorNameIsInvalid(invalidName);
  }
  return null;
};

export const checkIllegalCharactersAdministratorName = (
  administratorName: string
) => {
  const name = administratorName.toLowerCase();
  if (name.match(illegalCharactersRegex)) {
    return AdministratorNameIllegalCharacters;
  }
  return null;
};

export const workspaceValidateAdministratorName = (
  administratorName: string
) => {
  const illegalCharacters =
    checkIllegalCharactersAdministratorName(administratorName);
  const invalidName = checkInvalidAdministratorName(administratorName);
  if (!isAdministratorNameValidLength(OSVersion.Windows, administratorName)) {
    return AdministratorNameRange;
  } else if (illegalCharacters) {
    return illegalCharacters;
  } else if (invalidName) {
    return invalidName;
  } else {
    return '';
  }
};
