import {
  AzureVirtualMachineForCreationTestData,
  getTestVirtualMachineForCreationDto,
} from '../../data/AzureVirtualMachineForCreationTestData';
import { VirtualMachineCustomDtoTestData } from '../../data/VirtualMachineCustomDtoTestData';
import {
  DomainControllersCannotHaveMoreThan1Nic,
  DomainDoesNotExist,
  DomainMemberNeedsDomainController,
  DomainMemberNotOnSubnet,
  DomainNameIncorrectlyFormatted,
  DomainNamePrefixMaxLength,
  DomainNameRequired,
  DuplicateDomainNames,
  MachineCannotBeDomainController,
  SubnetDoesNotMatchController,
} from '../../../store/validators/ErrorConstants';
import {
  setDomainMembersToWorkgroupMembers,
  validateDomainController,
  validateDomainMember,
  validateDomainSubnets,
  workspaceValidateDomainNames,
} from '../../../store/validators/workspaceValidators';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { getTestDomainDto } from '../../data/AzureDomainDtoTestData';

describe('Workspace Virtual Machine Domain Validator Tests', () => {
  test("Catalog Machine doesn't support domain controller returns error", () => {
    const vm = {
      ...AzureVirtualMachineForCreationTestData,
      ImageSourceID: '123',
    };
    const catalogMachine = {
      ...VirtualMachineCustomDtoTestData,
      ImageSourceID: '123',
      CanSupportDomainController: false,
    };
    const error = validateDomainController(vm, [catalogMachine]);
    expect(error).toBe(MachineCannotBeDomainController);
  });

  test('Domain controller with more than one nic returns error', () => {
    const vm = {
      ...AzureVirtualMachineForCreationTestData,
      ImageSourceID: '123',
      Nics: [
        {
          Name: 'nic1',
          Description: '',
          VirtualNetworkName: 'networkName',
          SubnetName: 'subnet1',
        },
        {
          Name: 'nic2',
          Description: '',
          VirtualNetworkName: 'networkName',
          SubnetName: 'subnet1',
        },
      ],
    };
    const catalogMachine = {
      ...VirtualMachineCustomDtoTestData,
      ImageSourceID: '123',
      CanSupportDomainController: true,
    };
    const error = validateDomainController(vm, [catalogMachine]);
    expect(error).toBe(DomainControllersCannotHaveMoreThan1Nic);
  });

  test('Domain controller with more than one nic returns no error', () => {
    const vm = {
      ...AzureVirtualMachineForCreationTestData,
      ImageSourceID: '123',
      Nics: [
        {
          Name: 'nic1',
          Description: '',
          VirtualNetworkName: 'networkName',
          SubnetName: 'subnet1',
        },
      ],
    };
    const catalogMachine = {
      ...VirtualMachineCustomDtoTestData,
      ImageSourceID: '123',
      CanSupportDomainController: true,
    };
    const error = validateDomainController(vm, [catalogMachine]);
    expect(error).toBeFalsy();
  });

  test('Domain member added without domain controller returns no error', () => {
    const error = validateDomainMember([getTestDomainDto()]);
    expect(error).toBeFalsy();
  });

  test('Domain member added without domain controller returns error', () => {
    const error = validateDomainMember([]);
    expect(error).toBe(DomainMemberNeedsDomainController);
  });

  test('No domain controller returns error', () => {
    const error = validateDomainSubnets(
      {
        ID: '123',
        Name: 'domainName',
        Description: '',
      },
      [AzureVirtualMachineForCreationTestData],
      DomainRoles.WorkgroupMember
    );
    expect(error).toBe(DomainDoesNotExist);
  });

  test('No mismatched domain members returns no error', () => {
    const error = validateDomainSubnets(
      {
        ID: '123',
        Name: 'domainName',
        Description: '',
      },
      [
        {
          ...AzureVirtualMachineForCreationTestData,
          DomainID: '123',
          DomainRole: DomainRoles.DomainController,
          Nics: [
            {
              Name: 'nic1',
              Description: '',
              VirtualNetworkName: 'networkName',
              SubnetName: 'subnet1',
            },
          ],
        },
      ],
      DomainRoles.WorkgroupMember
    );
    expect(error).toBe('');
  });

  test('Mismatched domain members returns error', () => {
    const error = validateDomainSubnets(
      {
        ID: '123',
        Name: 'domainName',
        Description: '',
      },
      [
        {
          ...AzureVirtualMachineForCreationTestData,
          DomainID: '123',
          DomainRole: DomainRoles.DomainController,
          Nics: [
            {
              Name: 'nic1',
              Description: '',
              VirtualNetworkName: 'networkName',
              SubnetName: 'subnet1',
            },
          ],
        },
        {
          ...AzureVirtualMachineForCreationTestData,
          DomainID: '123',
          DomainRole: DomainRoles.DomainMember,
          Nics: [
            {
              Name: 'nic1',
              Description: '',
              VirtualNetworkName: 'networkName',
              SubnetName: 'subnet2',
            },
          ],
        },
      ],
      DomainRoles.WorkgroupMember
    );
    expect(error).toBe(SubnetDoesNotMatchController('subnet1'));
  });

  test('Mismatched domain members with workgroup member returns error', () => {
    const error = validateDomainSubnets(
      {
        ID: '123',
        Name: 'domainName',
        Description: '',
      },
      [
        {
          ...AzureVirtualMachineForCreationTestData,
          DomainID: '123',
          DomainRole: DomainRoles.DomainController,
          Nics: [
            {
              Name: 'nic1',
              Description: '',
              VirtualNetworkName: 'networkName',
              SubnetName: 'subnet1',
            },
          ],
        },
        {
          ...AzureVirtualMachineForCreationTestData,
          DomainID: '123',
          DomainRole: DomainRoles.DomainMember,
          Nics: [
            {
              Name: 'nic1',
              Description: '',
              VirtualNetworkName: 'networkName',
              SubnetName: 'subnet2',
            },
          ],
        },
      ],
      DomainRoles.WorkgroupMember
    );
    expect(error).toBe(SubnetDoesNotMatchController('subnet1'));
  });

  test('Mismatched domain members with domain controller returns error', () => {
    const error = validateDomainSubnets(
      {
        ID: '123',
        Name: 'domainName',
        Description: '',
      },
      [
        {
          ...AzureVirtualMachineForCreationTestData,
          DomainID: '123',
          DomainRole: DomainRoles.DomainController,
          Nics: [
            {
              Name: 'nic1',
              Description: '',
              VirtualNetworkName: 'networkName',
              SubnetName: 'subnet1',
            },
          ],
        },
        {
          ...AzureVirtualMachineForCreationTestData,
          DomainID: '123',
          DomainRole: DomainRoles.DomainMember,
          Nics: [
            {
              Name: 'nic1',
              Description: '',
              VirtualNetworkName: 'networkName',
              SubnetName: 'subnet2',
            },
          ],
        },
      ],
      DomainRoles.DomainController
    );
    expect(error).toBe(DomainMemberNotOnSubnet);
  });

  test('Empty domain name returns error', () => {
    const errors = workspaceValidateDomainNames([
      {
        ID: '123',
        Name: '',
        Description: 'description',
      },
    ]);
    expect(errors[0].message).toBe(DomainNameRequired);
  });

  test('Duplicate domain names returns error', () => {
    const errors = workspaceValidateDomainNames([
      {
        ID: '123',
        Name: 'name1',
        Description: 'description',
      },
      {
        ID: '1234',
        Name: 'name1',
        Description: 'description',
      },
    ]);
    expect(errors[0].message).toBe(DuplicateDomainNames);
  });

  test('Long domain name returns error', () => {
    const errors = workspaceValidateDomainNames([
      {
        ID: '123',
        Name: 'thisnameisgoingtobetoolong.lab',
        Description: 'description',
      },
    ]);
    expect(errors[0].message).toBe(DomainNamePrefixMaxLength);
  });

  test('Invalid domain name returns error', () => {
    const errors = workspaceValidateDomainNames([
      {
        ID: '123',
        Name: 'thisdomain.',
        Description: 'description',
      },
    ]);
    expect(errors[0].message).toBe(DomainNameIncorrectlyFormatted);
  });

  test('setDomainMembersToWorkgroupMembers converts all domain member with a matching domain ID.', () => {
    const domainID = 'domain-id-1';
    const domainController = getTestVirtualMachineForCreationDto({
      DomainID: domainID,
      DomainRole: DomainRoles.DomainController,
    });
    const machines = [
      getTestVirtualMachineForCreationDto({
        DomainID: domainID,
        DomainRole: DomainRoles.DomainMember,
      }),
      getTestVirtualMachineForCreationDto({
        DomainRole: DomainRoles.WorkgroupMember,
      }),
      getTestVirtualMachineForCreationDto({
        DomainID: domainID,
        DomainRole: DomainRoles.DomainController,
      }),
      getTestVirtualMachineForCreationDto({
        DomainID: domainID,
        DomainRole: DomainRoles.DomainMember,
      }),
      getTestVirtualMachineForCreationDto({
        DomainID: domainID,
        DomainRole: DomainRoles.DomainMember,
      }),
      getTestVirtualMachineForCreationDto({
        DomainRole: DomainRoles.WorkgroupMember,
      }),
      getTestVirtualMachineForCreationDto({
        DomainID: domainID,
        DomainRole: DomainRoles.DomainController,
      }),
      getTestVirtualMachineForCreationDto({
        DomainID: domainID,
        DomainRole: DomainRoles.DomainMember,
      }),
    ];
    setDomainMembersToWorkgroupMembers(domainController, machines);
    expect(machines).not.toContainEqual(
      expect.objectContaining({
        DomainID: domainID,
        DomainRole: DomainRoles.DomainMember,
      })
    );
  });
});
