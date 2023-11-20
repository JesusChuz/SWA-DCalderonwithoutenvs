import { VirtualMachineTemplateDto } from 'src/types/Catalog/VirtualMachineTemplateDto.types';
import { OSVersion } from '../../types/enums/OSVersion';
import { Blank_WorkspaceScheduledJobError } from '../../data/Blank_WorkspaceScheduledJobError';
import {
  checkInvalidAdministratorName,
  maxAdministratorNameLengthLinux,
  maxAdministratorNameLengthWindows,
} from '../../shared/AdministratorNameHelper';
import { checkInvalidAdministratorPassword } from '../../shared/AdministratorPasswordHelper';
import { AzureDomainDto } from '../../types/AzureWorkspace/AzureDomainDto.types';
import { DataDiskUnion } from '../../types/AzureWorkspace/DataDiskUnion.types';
import { DomainRoles } from '../../types/AzureWorkspace/enums/DomainRoles';
import { MachinesUnion } from '../../types/AzureWorkspace/MachinesUnion.types';
import { VirtualMachineCustomDto } from '../../types/Catalog/VirtualMachineCustomDto.types';
import { DataDiskErrorTypes } from '../../types/enums/DataDiskErrorTypes';
import { DataDiskError } from '../../types/Forms/DataDiskError.types';
import { DomainError } from '../../types/Forms/DomainError.types';
import { SubnetNameError } from '../../types/Forms/SubnetNameError.types';
import { VMNameError } from '../../types/Forms/VMNameError.types';
import { WorkspaceScheduledJobError } from '../../types/Forms/WorkspaceScheduledJobError.types';
import { WorkspaceScheduledJobDto } from '../../types/Job/WorkspaceScheduledJobDto.types';
import { AzureVirtualMachineForCreationDto } from '../../types/ResourceCreation/AzureVirtualMachineForCreationDto.types';
import {
  AdministratorNameRequired,
  AdministratorPasswordMinLength,
  AdministratorPasswordRequired,
  CannotContainValue,
  CannotDecreaseDiskSize,
  CannotEndWithHiphen,
  CannotStartWithNumber,
  DomainControllersCannotHaveMoreThan1Nic,
  DomainDoesNotExist,
  DomainMemberNeedsDomainController,
  DomainMemberNotOnSubnet,
  DomainNameIncorrectlyFormatted,
  DomainNamePrefixMaxLength,
  DomainNameMinLength,
  DomainNameRequired,
  DuplicateDomainNames,
  DuplicateNamesNotAllowed,
  MachineCannotBeDomainController,
  MachineCountCannotBeZero,
  NameMustNotBeBlank,
  NetworkNameMaxLengthError,
  NetworkNameMinLengthError,
  NetworkNameMustEndWithWordCharacter,
  NetworkNameMustOnlyContain,
  NetworkNameMustStartWithWordCharacter,
  NetworkNameRequired,
  NewWorkspaceNameEmptyError,
  PasswordConfirmMustMatch,
  RequiredText,
  SubnetDoesNotMatchController,
  minPasswordLength,
  InvalidWorkspaceScheduledJobTimeZone,
  WorkspaceScheduledJobDaysMustBeSelected,
  WorkspaceScheduledJobTimesCannotBeTheSame,
  WorkspaceScheduledJobDaysMustHaveEitherStartOrStopTime,
  CannotDecreaseOSDiskSize,
  AdministratorNameMaxLengthErrorWindows,
  AdministratorNameMaxLengthErrorLinux,
  CannotUseReservedWord,
} from './ErrorConstants';
import { AzureVirtualMachineDto } from 'src/types/AzureWorkspace/AzureVirtualMachineDto.types';
import { MachineImageType } from 'src/types/AzureWorkspace/enums/MachineImageType';

export const reservedWords = [
  'anonymous',
  'authenticated user',
  'batch',
  'builtin',
  'creator group',
  'creator group server',
  'creator owner',
  'creator owner server',
  'dialup',
  'digest auth',
  'domain',
  'enterprise',
  'interactive',
  'internet',
  'local',
  'local system',
  'network',
  'network service',
  'nt authority',
  'nt domain',
  'ntlm auth',
  'null',
  'proxy',
  'remote interactive',
  'restricted',
  'schannel auth',
  'self',
  'server',
  'service',
  'system',
  'terminal server',
  'this organization',
  'users',
  'world',
];

export const workspaceValidateName = (name: string): string => {
  return name === '' ? NewWorkspaceNameEmptyError : '';
};

const workspaceValidateVMName = (
  machine: MachinesUnion,
  machineIndex: number,
  machines: MachinesUnion[]
): VMNameError => {
  let message = '';
  if (machine.ComputerName.length === 0) {
    message = RequiredText;
  }
  const match = machine.ComputerName.match(
    /[\~\!\@\#\$\%\^\&\*\(\)\+\_\[\]\{\}\\\|\;\:\.\'\"\,\<\>\/\?\s\=￥€£₩₹]/
  );
  const reservedWordMatch = reservedWords.find(
    (word) => machine.ComputerName.toLowerCase() === word
  );
  if (match) {
    message = CannotContainValue(match[0] === ' ' ? 'space' : match.toString());
  } else if (
    reservedWordMatch &&
    !(machine as AzureVirtualMachineDto).ID &&
    (machine as AzureVirtualMachineDto)?.MachineImageType !==
      MachineImageType.SharedImage
  ) {
    message = CannotUseReservedWord();
  } else if (machine.ComputerName.endsWith('-')) {
    message = CannotEndWithHiphen;
  } else if (machine.ComputerName.match(/^\d/)) {
    message = CannotStartWithNumber;
  } else if (
    machines.some(
      (m, i) => i !== machineIndex && m.ComputerName === machine.ComputerName
    )
  ) {
    message = DuplicateNamesNotAllowed;
  }
  if (message) {
    return {
      message,
      machineIndex,
    };
  }
  return null;
};

export const workspaceValidateVMNames = (
  machines: MachinesUnion[]
): VMNameError[] => {
  const vmNameErrors: VMNameError[] = [];

  machines.forEach((vm, index) => {
    const vmNameError = workspaceValidateVMName(vm, index, machines);
    if (vmNameError) {
      vmNameErrors.push(vmNameError);
    }
  });
  return vmNameErrors;
};

export const workspaceValidateAdministratorNameLength = (
  os: OSVersion,
  value: string
): string => {
  if (value.length === 0) {
    return AdministratorNameRequired;
  }
  if (
    os === OSVersion.Windows &&
    value.length > maxAdministratorNameLengthWindows
  ) {
    return AdministratorNameMaxLengthErrorWindows;
  }
  if (
    os === OSVersion.Windows &&
    value.length > maxAdministratorNameLengthLinux
  ) {
    return AdministratorNameMaxLengthErrorLinux;
  }
};

export const workspaceValidateAdministratorNameIsNotDisallowed = (
  value: string
): string => {
  const invalidAdministratorNameMessage = checkInvalidAdministratorName(value);
  return invalidAdministratorNameMessage ? invalidAdministratorNameMessage : '';
};

export const workspaceValidateSubnetNames = (
  names: string[]
): SubnetNameError[] => {
  const subnetNameErrors: SubnetNameError[] = [];

  const nameMap: Record<string, boolean> = {};
  for (let i = 0; i < names.length; i++) {
    if (names[i].length === 0) {
      subnetNameErrors.push({
        index: i,
        message: NetworkNameRequired,
      });
    } else if (names[i].length < 2) {
      subnetNameErrors.push({
        index: i,
        message: NetworkNameMinLengthError,
      });
    } else if (names[i].length > 80) {
      subnetNameErrors.push({
        index: i,
        message: NetworkNameMaxLengthError,
      });
    } else if (nameMap[names[i]]) {
      subnetNameErrors.push({
        index: i,
        message: DuplicateNamesNotAllowed,
      });
    } else if (!/^\w([\w.\-]*)\w$/i.test(names[i])) {
      if (!/^\w/i.test(names[i])) {
        subnetNameErrors.push({
          index: i,
          message: NetworkNameMustStartWithWordCharacter,
        });
      } else if (!/\w$/i.test(names[i])) {
        subnetNameErrors.push({
          index: i,
          message: NetworkNameMustEndWithWordCharacter,
        });
      } else {
        subnetNameErrors.push({
          index: i,
          message: NetworkNameMustOnlyContain,
        });
      }
    }
    nameMap[names[i]] = true;
  }

  return subnetNameErrors;
};

export const workspaceValidateAdministratorPassword = (
  value: string
): string => {
  if (value.length === 0) {
    return AdministratorPasswordRequired;
  }
  if (value.length < minPasswordLength) {
    return AdministratorPasswordMinLength;
  }
  const invalidAdministratorPasswordMessage =
    checkInvalidAdministratorPassword(value);
  return invalidAdministratorPasswordMessage
    ? invalidAdministratorPasswordMessage
    : '';
};

export const workspaceValidateConfirmPassword = (
  password: string,
  newPassword: string
): string => {
  return password !== newPassword ? PasswordConfirmMustMatch : '';
};

const workspaceValidateDataDisksHelper = (machines: MachinesUnion[]) => {
  const errors = [];
  for (let machineIndex = 0; machineIndex < machines.length; machineIndex++) {
    for (
      let diskIndex = 0;
      diskIndex < machines[machineIndex].DataDisks.length;
      diskIndex++
    ) {
      if (
        machines[machineIndex].DataDisks[diskIndex].Name === '' ||
        machines[machineIndex].DataDisks[diskIndex].Name === null
      ) {
        errors.push({
          machineIndex,
          diskIndex,
          type: DataDiskErrorTypes.nameError,
          message: NameMustNotBeBlank,
        });
      }
    }
  }
  return errors;
};

export const workspaceValidateDataDisks = (
  machines: MachinesUnion[]
): DataDiskError[] => {
  return [...workspaceValidateDataDisksHelper(machines)];
};

export const workspaceValidateDataDisksStorageSize = (
  dataDisk: DataDiskUnion,
  newSize: number
): string => {
  return dataDisk.SizeGB > newSize ? CannotDecreaseDiskSize : '';
};

export const workspaceValidateOSDisksStorageSize = (
  machines: MachinesUnion,
  newSize: number
): string => {
  return machines.OSDiskSizeInGB > newSize ? CannotDecreaseOSDiskSize : '';
};

export const workspaceValidateMachineAmount = (amount: number): string => {
  return amount === 0 ? MachineCountCannotBeZero : '';
};

export const validateDomainController = (
  machine: AzureVirtualMachineForCreationDto | VirtualMachineTemplateDto,
  catalogMachines: VirtualMachineCustomDto[]
): string => {
  const catalogMachine = catalogMachines.find(
    (m) => m.ImageSourceID === machine.ImageSourceID
  );
  if (!catalogMachine || !catalogMachine.CanSupportDomainController) {
    return MachineCannotBeDomainController;
  }
  if (machine.Nics.length !== 1) {
    return DomainControllersCannotHaveMoreThan1Nic;
  }
  return '';
};

export const validateDomainMember = (domains: AzureDomainDto[]): string => {
  if (!domains || domains.length === 0) {
    return DomainMemberNeedsDomainController;
  }
  return '';
};

export const getFirstValidDomain = (
  machine: AzureVirtualMachineForCreationDto,
  domains: AzureDomainDto[],
  machines: AzureVirtualMachineForCreationDto[]
): AzureDomainDto => {
  const machineSubnetNames = machine.Nics.map((nic) => nic.SubnetName);
  const validDomainControllers = machines.filter(
    (m) =>
      m.DomainRole === DomainRoles.DomainController &&
      m.Nics &&
      machineSubnetNames.includes(m.Nics[0].SubnetName)
  );
  return (
    domains.find((d) =>
      validDomainControllers.find((dc) => dc.DomainID === d.ID)
    ) || null
  );
};

export const validateDomainSubnets = (
  domain: AzureDomainDto,
  machines: AzureVirtualMachineForCreationDto[],
  domainRole: DomainRoles
): string => {
  const domainController = machines.find(
    (m) =>
      m.DomainRole === DomainRoles.DomainController && m.DomainID === domain.ID
  );
  if (!domainController || !domainController.Nics) {
    return DomainDoesNotExist;
  }
  const domainControllerSubnetName = domainController.Nics[0].SubnetName;

  const domainMembers = machines.filter(
    (m) => m.DomainRole === DomainRoles.DomainMember && m.DomainID === domain.ID
  );

  const memberSubnetsMatchController = domainMembers.every((d) =>
    d.Nics.some((nic) => nic.SubnetName === domainControllerSubnetName)
  );

  if (!memberSubnetsMatchController) {
    return domainRole === DomainRoles.DomainController
      ? DomainMemberNotOnSubnet
      : SubnetDoesNotMatchController(domainControllerSubnetName);
  }
  return '';
};

export const validateDomainControllerRoleHasMembers = (
  machines: AzureVirtualMachineForCreationDto[],
  domainID: string
): boolean => {
  return machines.some((m) => {
    return (
      m.DomainID === domainID && m.DomainRole !== DomainRoles.DomainController
    );
  });
};

export const workspaceValidateDomainNames = (
  domains: AzureDomainDto[]
): DomainError[] => {
  const domainErrors: DomainError[] = [];

  const regex = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
  const domainNameCounts: Record<string, number> = {};
  domains.forEach((domain) => {
    const name = domain.Name;
    if (!domainNameCounts[name]) {
      domainNameCounts[name] = 1;
    } else {
      domainNameCounts[name]++;
    }
  });
  domains.forEach((domain) => {
    const reservedWordMatch = reservedWords.find(
      (word) => domain.Name.toLowerCase() === word
    );
    if (!domain.Name) {
      domainErrors.push({
        domainID: domain.ID,
        message: DomainNameRequired,
      });
    } else if (domainNameCounts[domain.Name] > 1) {
      domainErrors.push({
        domainID: domain.ID,
        message: DuplicateDomainNames,
      });
    } else if (domain.Name?.length < 1) {
      domainErrors.push({
        domainID: domain.ID,
        message: DomainNameMinLength,
      });
    } else if (domain.Name?.lastIndexOf('.') > 15) {
      domainErrors.push({
        domainID: domain.ID,
        message: DomainNamePrefixMaxLength,
      });
    } else if (reservedWordMatch) {
      domainErrors.push({
        domainID: domain.ID,
        message: CannotUseReservedWord(reservedWordMatch),
      });
    } else {
      const matchesRegex = domain.Name.match(regex);
      if (!matchesRegex) {
        domainErrors.push({
          domainID: domain.ID,
          message: DomainNameIncorrectlyFormatted,
        });
      }
    }
  });
  return domainErrors;
};

export const setDomainMembersToWorkgroupMembers = (
  domainController: AzureVirtualMachineForCreationDto,
  machines: AzureVirtualMachineForCreationDto[]
): void => {
  machines.forEach((m: AzureVirtualMachineForCreationDto) => {
    if (
      m.DomainRole !== DomainRoles.DomainController &&
      m.DomainID === domainController.DomainID
    ) {
      m.DomainRole = DomainRoles.WorkgroupMember;
      m.DomainID = null;
    }
  });
};

export const workspaceValidateWorkspaceScheduledJob = (
  workspaceScheduledJob: WorkspaceScheduledJobDto,
  originalWorkspaceScheduledJob: WorkspaceScheduledJobDto
): WorkspaceScheduledJobError => {
  const workspaceScheduledJobError: WorkspaceScheduledJobError = {
    ...Blank_WorkspaceScheduledJobError,
  };
  if (workspaceScheduledJob === null) {
    return workspaceScheduledJobError;
  }
  if (!workspaceScheduledJob.TimeZone) {
    workspaceScheduledJobError.timeZoneError =
      InvalidWorkspaceScheduledJobTimeZone;
  }
  if (
    workspaceScheduledJob.ScheduledDays === 'None' &&
    (workspaceScheduledJob.AutoStartTimeOfDay ||
      workspaceScheduledJob.AutoStopTimeOfDay)
  ) {
    workspaceScheduledJobError.daysOfWeekError =
      WorkspaceScheduledJobDaysMustBeSelected;
  }
  if (
    (!originalWorkspaceScheduledJob ||
      (!originalWorkspaceScheduledJob.AutoStartTimeOfDay &&
        !originalWorkspaceScheduledJob.AutoStopTimeOfDay)) &&
    !workspaceScheduledJob.AutoStartTimeOfDay &&
    !workspaceScheduledJob.AutoStopTimeOfDay
  ) {
    workspaceScheduledJobError.timeError =
      WorkspaceScheduledJobDaysMustHaveEitherStartOrStopTime;
  }
  if (
    workspaceScheduledJob.AutoStartTimeOfDay &&
    workspaceScheduledJob.AutoStopTimeOfDay &&
    workspaceScheduledJob.AutoStartTimeOfDay ===
      workspaceScheduledJob.AutoStopTimeOfDay
  ) {
    workspaceScheduledJobError.timeError =
      WorkspaceScheduledJobTimesCannotBeTheSame;
  }
  return workspaceScheduledJobError;
};
