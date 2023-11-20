import { AzureVirtualMachineForCreationTestData } from '../../data/AzureVirtualMachineForCreationTestData';
import {
  CannotContainValue,
  CannotEndWithHiphen,
  CannotStartWithNumber,
  RequiredText,
} from '../../../store/validators/ErrorConstants';
import { workspaceValidateVMNames } from '../../../store/validators/workspaceValidators';

describe('Workspace Virtual Machine Name Validator Tests', () => {
  test('Workspace virtual machine empty name returns error', () => {
    const vms = [{ ...AzureVirtualMachineForCreationTestData }];
    const errors = workspaceValidateVMNames(vms);
    expect(errors[0].message).toBe(RequiredText);
    expect(errors[0].machineIndex).toBe(0);
  });

  test('Workspace virtual machine non-empty name does not return error', () => {
    const vms = [
      {
        ...AzureVirtualMachineForCreationTestData,
        ComputerName: 'notempty',
      },
    ];

    const errors = workspaceValidateVMNames(vms);
    expect(errors).toHaveLength(0);
  });

  test('Workspace virtual machine generalized non-empty name does not return error', () => {
    const vms = [
      {
        ...AzureVirtualMachineForCreationTestData,
        ComputerName: 'notempty',
      },
    ];
    const errors = workspaceValidateVMNames(vms);
    expect(errors).toHaveLength(0);
  });

  test('Workspace virtual machine name with space returns error', () => {
    const vms = [
      {
        ...AzureVirtualMachineForCreationTestData,
        ComputerName: 'not empty',
      },
    ];
    const errors = workspaceValidateVMNames(vms);
    expect(errors[0].message).toBe(CannotContainValue('space'));
    expect(errors[0].machineIndex).toBe(0);
  });

  test('Workspace virtual machine name ending in hiphen returns error', () => {
    const vms = [
      {
        ...AzureVirtualMachineForCreationTestData,
        ComputerName: 'notempty-',
      },
    ];
    const errors = workspaceValidateVMNames(vms);
    expect(errors[0].message).toBe(CannotEndWithHiphen);
    expect(errors[0].machineIndex).toBe(0);
  });

  test('Workspace virtual machine name starting with number returns error', () => {
    const vms = [
      {
        ...AzureVirtualMachineForCreationTestData,
        ComputerName: '1notempty',
      },
    ];
    const errors = workspaceValidateVMNames(vms);
    expect(errors[0].message).toBe(CannotStartWithNumber);
    expect(errors[0].machineIndex).toBe(0);
  });
});
