import { workspaceValidateAdministratorName } from '../../../shared/AdministratorNameHelper';
import {
  AdministratorNameIllegalCharacters,
  AdministratorNameIsInvalid,
  AdministratorNameRange,
  AdministratorPasswordIsNotComplexEnough,
  AdministratorPasswordMinLength,
  AdministratorPasswordRequired,
  MachineCountCannotBeZero,
  NewWorkspaceNameEmptyError,
  PasswordConfirmMustMatch,
} from '../../../store/validators/ErrorConstants';
import {
  workspaceValidateAdministratorPassword,
  workspaceValidateConfirmPassword,
  workspaceValidateMachineAmount,
  workspaceValidateName,
} from '../../../store/validators/workspaceValidators';

describe('Workspace General Validator Tests', () => {
  test('Empty workspace name returns error', () => {
    const name = '';
    expect(workspaceValidateName(name)).toBe(NewWorkspaceNameEmptyError);
  });

  test('Non-empty workspace name does not return error', () => {
    const name = 'test';
    expect(workspaceValidateName(name)).toBe('');
  });

  test('Empty workspace administrator name returns error', () => {
    const name = '';
    const error = workspaceValidateAdministratorName(name);
    expect(error).toBe(AdministratorNameRange);
  });

  test('Workspace administrator name too long returns error', () => {
    const name = 'onetwothreeFourFiveSixSeven';
    const error = workspaceValidateAdministratorName(name);
    expect(error).toBe(AdministratorNameRange);
  });

  test('Workspace administrator name containing illegal character returns error', () => {
    const name = 'onetwo?';
    const error = workspaceValidateAdministratorName(name);
    expect(error).toBe(AdministratorNameIllegalCharacters);
  });

  test('Workspace administrator name containing reserved word returns error', () => {
    const name1 = 'admin';
    const error1 = workspaceValidateAdministratorName(name1);
    const name2 = 'support';
    const error2 = workspaceValidateAdministratorName(name2);
    expect(error1).toBe(AdministratorNameIsInvalid(name1));
    expect(error2).toBe(AdministratorNameIsInvalid(name2));
  });

  test('Workspace administrator name being invalid name returns error', () => {
    const name = 'owner';
    const error = workspaceValidateAdministratorName(name);
    expect(error).toBe(AdministratorNameIsInvalid(name));
  });

  test('Workspace empty administrator password returns error', () => {
    const name = '';
    const error = workspaceValidateAdministratorPassword(name);
    expect(error).toBe(AdministratorPasswordRequired);
  });

  test('Workspace short administrator password returns error', () => {
    const name = 'short';
    const error = workspaceValidateAdministratorPassword(name);
    expect(error).toBe(AdministratorPasswordMinLength);
  });

  test('Workspace administrator password contains not complex returns error', () => {
    let name = 'thisisasupersecretbutnotcomplexpass';
    let error = workspaceValidateAdministratorPassword(name);
    expect(error).toBe(AdministratorPasswordIsNotComplexEnough);
    name = 'ThisIsaSuperSecretButNotComplexPass';
    error = workspaceValidateAdministratorPassword(name);
    expect(error).toBe(AdministratorPasswordIsNotComplexEnough);
    name = 'ThisIsaSuperSecretButNotComplexPass1996';
    error = workspaceValidateAdministratorPassword(name);
    expect(error).toBe(AdministratorPasswordIsNotComplexEnough);
    name = 'ThisIsaSuperSecretAndComplexPass1996!';
    error = workspaceValidateAdministratorPassword(name);
    expect(error).toBe('');
  });

  test('Workspace confirm administrator password not equal returns error', () => {
    const p1 = 'thisIsAString!';
    const p2 = 'thisIsAString2!';
    const error = workspaceValidateConfirmPassword(p1, p2);
    expect(error).toBe(PasswordConfirmMustMatch);
  });

  test("Workspace 0 vm's returns error", () => {
    const error = workspaceValidateMachineAmount(0);
    expect(error).toBe(MachineCountCannotBeZero);
  });
});
