import {
  DuplicateNamesNotAllowed,
  NetworkNameMaxLengthError,
  NetworkNameMinLengthError,
  NetworkNameMustEndWithWordCharacter,
  NetworkNameMustOnlyContain,
  NetworkNameMustStartWithWordCharacter,
  NetworkNameRequired,
} from '../../../store/validators/ErrorConstants';
import { workspaceValidateSubnetNames } from '../../../store/validators/workspaceValidators';

describe('Workspace Network Validator Tests', () => {
  test('Workspace empty subnet name returns error', () => {
    const names = ['subnet1', ''];
    const errors = workspaceValidateSubnetNames(names);
    expect(errors[0].message).toBe(NetworkNameRequired);
    expect(errors[0].index).toBe(1);
  });

  test('Workspace short subnet name returns error', () => {
    const names = ['subnet1', 's'];
    const errors = workspaceValidateSubnetNames(names);
    expect(errors[0].message).toBe(NetworkNameMinLengthError);
    expect(errors[0].index).toBe(1);
  });

  test('Workspace long subnet name returns error', () => {
    const names = [
      'subnet1subnet1subnet1subnet1subnet1subnet1subnet1subnet1subnet1subnet1subnet1subnet1',
      'subnet1',
    ];
    const errors = workspaceValidateSubnetNames(names);
    expect(errors[0].message).toBe(NetworkNameMaxLengthError);
    expect(errors[0].index).toBe(0);
  });

  test('Workspace duplicate subnet names returns error', () => {
    const names = ['subnet1', 'subnet1'];
    const errors = workspaceValidateSubnetNames(names);
    expect(errors[0].message).toBe(DuplicateNamesNotAllowed);
    expect(errors[0].index).toBe(1);
  });

  test('Workspace subnet name starting in non word character returns error', () => {
    const names = ['!subnet1', 'subnet1'];
    const errors = workspaceValidateSubnetNames(names);
    expect(errors[0].message).toBe(NetworkNameMustStartWithWordCharacter);
    expect(errors[0].index).toBe(0);
  });

  test('Workspace subnet name ending in non word character returns error', () => {
    const names = ['subnet1', 'subnet1!'];
    const errors = workspaceValidateSubnetNames(names);
    expect(errors[0].message).toBe(NetworkNameMustEndWithWordCharacter);
    expect(errors[0].index).toBe(1);
  });

  test('Workspace subnet name containing invalid character returns error', () => {
    const names = ['subn!et1', 'subnet1'];
    const errors = workspaceValidateSubnetNames(names);
    expect(errors[0].message).toBe(NetworkNameMustOnlyContain);
    expect(errors[0].index).toBe(0);
  });
});
