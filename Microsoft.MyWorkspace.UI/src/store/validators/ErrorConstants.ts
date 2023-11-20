import {
  maxAdministratorNameLengthLinux,
  maxAdministratorNameLengthWindows,
  minAdministratorNameLength,
} from '../../shared/AdministratorNameHelper';

export const minPasswordLength = 12;
export const maxPasswordLength = 123;

export const MAX_DNS_TXT_VALUE_COUNT = 20;
export const MAX_DNS_TXT_VALUES_LENGTH = 1024;
export const InvalidCanonicalName = 'Invalid canonical name.';
export const CanonicalNameTooLong = 'Canonical name too long.';
export const DnsTXTRecordMaxValueCountError = `Record cannot contain more than ${MAX_DNS_TXT_VALUE_COUNT} values.`;

export const NoError = '';

export const NewWorkspaceNameEmptyError = 'Workspace name is required';

export const RequiredText = 'Required';

export const CannotContainValue = (val: string): string =>
  `Cannot contain: "${val}"`;
export const CannotUseReservedWord = (val?: string): string =>
  `Cannot use reserved word${val ? `: "${val}"` : ''}`;

export const CannotEndWithHiphen = 'Cannot end with: "-"';
export const CannotStartWithNumber = 'Cannot start with a number';
export const DuplicateText = 'Duplicate';
export const DuplicateNamesNotAllowed = 'Duplicate names not allowed.';
const forbiddenAdminNameCharacters = '\\ / " [ ] : | < > + = ; , ? * @ .';
export const AdministratorNameIllegalCharacters = `Administrator name cannot contain spaces or the following characters: ${forbiddenAdminNameCharacters}`;
export const AdministratorNameRequired = 'Administrator name is required.';
export const AdministratorNameNoReservedWords =
  'Administrator name cannot contain reserved words.';
export const AdministratorNameRange = `Administrator name must be between ${minAdministratorNameLength} and ${maxAdministratorNameLengthWindows} characters.`;
export const AdministratorNameMaxLengthErrorWindows = `Administrator name must not be more than ${maxAdministratorNameLengthWindows} characters.`;
export const AdministratorNameMaxLengthErrorLinux = `Administrator name must not be more than ${maxAdministratorNameLengthLinux} characters.`;
export const AdministratorNameIsInvalid = (invalidName: string): string =>
  `Administrator name is not valid: "${invalidName}".`;
export const NetworkNameRequired = 'Network name is required.';
export const NetworkNameMinLengthError =
  'Network name must be at least 2 characters.';
export const NetworkNameMaxLengthError =
  'Network name must not exceed 80 characters.';
export const NetworkNameMustStartWithWordCharacter =
  'Network name must start with a word character.';
export const NetworkNameMustEndWithWordCharacter =
  'Network name must end with a word character.';
export const NetworkNameMustOnlyContain =
  'Network name must only contain word characters, "-", or ".".';
export const AdministratorPasswordRequired = 'Password is required.';
export const AdministratorPasswordMinLength = `Password must be at least ${minPasswordLength} characters.`;
export const AministratorPasswordCannotContainPassword =
  "Password cannot contain any variations of the phrase 'password'";
export const AdministratorPasswordIsNotComplexEnough = `Password must contain each of the following: lowercase letters (a-z), uppercase letters (A-Z), numbers (0-9) and symbols.`;
export const PasswordConfirmMustMatch = 'Passwords must match.';
export const NameMustNotBeBlank = 'Name must not be blank';
export const CannotDecreaseDiskSize =
  'Cannot decrease the size of an existing data disk';
export const CannotDecreaseOSDiskSize =
  'Cannot decrease the size of an existing OS disk';
export const MachineCountCannotBeZero =
  'The number of machines cannot be zero.';
export const MachineCannotBeDomainController =
  'The current machine does not support domain controller configuration. Please choose a different machine.';
export const DomainControllersCannotHaveMoreThan1Nic =
  'Domain controllers cannot have more than 1 NIC';
export const DomainMemberNeedsDomainController =
  'A domain member cannot be created without a domain controller in this workspace.';
export const DomainDoesNotExist = 'Domain does not exist.';
export const SubnetDoesNotMatchController = (
  domainControllerSubnetName: string
): string =>
  `The selected subnet does not match the domain's subnet: (${domainControllerSubnetName}).`;
export const DomainMemberNotOnSubnet = `At least one of this domain's members are not on the selected subnet.`;
export const DomainNameRequired = 'Domain name is required.';
export const DuplicateDomainNames = 'Duplicate domain names are not allowed.';
export const DomainNameMinLength = 'Domain name must be at least 1 characters.';
export const DomainNamePrefixMaxLength =
  'Domain name prefix must not exceed 15 characters.';
export const DomainNameIncorrectlyFormatted =
  'This domain name is incorrectly formatted.';
export const DomainNameInvalid = 'Invalid domain name.';
export const InvalidWorkspaceScheduledJobTimeZone =
  'A valid time zone must be selected.';
export const WorkspaceScheduledJobDaysMustBeSelected =
  'At least one day must be selected.';
export const WorkspaceScheduledJobTimesCannotBeTheSame =
  'The scheduled start and stop times cannot be the same.';
export const WorkspaceScheduledJobDaysMustHaveEitherStartOrStopTime =
  'Either a start or stop time must be selected.';
export const MachineMustBeRunning =
  'Machines, including the Domain Controller, must be running to edit the domain.';
export const EditsAreDisabled =
  'Edits are disabled for workspaces that are deploying or have failed to deploy.';
export const MachineMustBeWindows =
  'Domain edits are only available on Windows machines.';
export const MachineMustBeWorkgroupMember =
  'Machine must be Workgroup Member to edit domain.';
export const FirewallPortRangeError =
  'Ports must be a comma separated list of numbers or ranges. Ex: 443, 500-520';
export const FirewallTagsError =
  'Tags must be a comma separated list of numbers, letters, hiphens, or spaces.';

export const FirewallDeploymentSubscriptionIdError =
  'Please provide a valid ID.';

export const FirewallDeploymentAzureRegionEmptyError =
  'Select a region to deploy.';

export const FirewallDeploymentFirewallTenantError =
  'Select a firewall tenant.';
