import {
  MAX_DNS_TXT_VALUES_LENGTH,
  CanonicalNameTooLong,
  InvalidCanonicalName,
  RequiredText,
} from '../../../../store/validators/ErrorConstants';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
  DNSRecordMXDto,
  DNSRecordCNAMEDto,
  DNSRecordADto,
} from '../../../../types/AzureWorkspace/DNSRecords';
import { DNSRecordDto } from '../../../../types/AzureWorkspace/DNSRecords/DNSRecordDto.types';
import { DnsTxtValueError } from '../../../../types/Forms/DnsTxtValueError.types';

const MAX_TTL = 35791394;
const MAX_DNS_WEIGHT = 65535;
const MAX_DNS_PORT = 65535;
const MAX_DNS_PRIORITY = 65535;
const MAX_DNS_TXT_TOTAL_LENGTH = 1024;
const MAX_DNS_TXT_VALUE_COUNT = 20;
const MAX_DNS_HOST_COUNT = 255;

const DNS_REGEX = new RegExp(
  '^$|^(?:[A-Za-z0-9\\-_]{1,63})(?:\\.[A-Za-z0-9\\-_]{1,63})*\\.?$'
);

const DNS_SERVER_REGEX = new RegExp(
  '^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-).)+[A-Za-z]{2,6}$'
);

export enum DNSRecordType {
  A = 'A',
  CNAME = 'CNAME',
  MX = 'MX',
  NS = 'NS',
  SRV = 'SRV',
  TXT = 'TXT',
}

export type DNSRecordObject = {
  dnsRecord: DNSRecordDto;
  recordType: DNSRecordType;
  index: number;
};

export type DNSRecordValues = {
  dnsARecords: DNSRecordADto[];
  dnsCNAMERecords: DNSRecordCNAMEDto[];
  dnsMXRecords: DNSRecordMXDto[];
  dnsNSRecords: DNSRecordNSDto[];
  dnsSRVRecords: DNSRecordSRVDto[];
  dnsTXTRecords: DNSRecordTXTDto[];
};

export const getDnsNameError = (
  { dnsRecord, recordType, index }: DNSRecordObject,
  allDNSRecords: DNSRecordObject[],
  restrictedDnsPrefixes: string[]
): string => {
  const name = dnsRecord.Name;
  if (name.length === 0) {
    return 'Required.';
  }
  if (name.endsWith('.')) {
    return `DNS Record Name cannot end with a period.`;
  }
  if (restrictedDnsPrefixes.some((prefix) => name.startsWith(prefix))) {
    return 'DNS record name uses a reserved prefix.';
  }
  if (
    allDNSRecords
      .filter((r) => r.recordType === recordType)
      .filter(
        (r, i) =>
          r.dnsRecord.Name.toLowerCase() === dnsRecord.Name.toLowerCase() &&
          i !== index
      ).length >= 1
  ) {
    return 'Already In Use';
  }

  if (!DNS_REGEX.test(name)) return 'Invalid DNS Record Name.';
  return '';
};

export const getDnsTTLError = (record: DNSRecordDto): string => {
  const ttl = record.TTL;
  if (isNaN(ttl)) {
    return 'TTL must be a number.';
  }
  return record.TTL <= 0 || record.TTL > MAX_TTL
    ? `TTL must be between 1 and ${MAX_TTL}.`
    : '';
};

export const getDnsNameServerError = (record: DNSRecordNSDto): string => {
  return record.NameServer.length > 0 ? '' : RequiredText;
};

export const getDnsSRVDomainNameError = (record: DNSRecordSRVDto): string => {
  return record.DomainName.length > 0 ? '' : RequiredText;
};

export const getDnsSRVWeightError = (record: DNSRecordSRVDto): string => {
  const weight = record.Weight;
  if (isNaN(weight)) {
    return 'Weight must be a number.';
  }
  return weight < 0 || weight > MAX_DNS_WEIGHT
    ? `Weight must be between 0 and ${MAX_DNS_WEIGHT}.`
    : '';
};

export const getDnsSRVPortError = (record: DNSRecordSRVDto): string => {
  const port = record.Port;
  if (isNaN(port)) {
    return 'Port must be a number.';
  }
  return port < 0 || port > MAX_DNS_PORT
    ? `Port must be between 0 and ${MAX_DNS_PORT}.`
    : '';
};

export const getDnsTXTValueErrors = (
  record: DNSRecordTXTDto
): DnsTxtValueError[] => {
  const errors = [];
  const values = new Set();
  let txtCount = 0;
  for (let i = 0; i < record.TxtValues.length; i++) {
    txtCount += record.TxtValues[i].length;
    if (record.TxtValues[i].trim().length === 0) {
      errors.push({
        error: 'Required. Must not be whitespace.',
        index: i,
      });
    } else if (txtCount > MAX_DNS_TXT_VALUES_LENGTH) {
      errors.push({
        error: `TXT values cannot exceed ${MAX_DNS_TXT_VALUES_LENGTH} characters.`,
        index: i,
      });
    } else if (values.has(record.TxtValues[i])) {
      errors.push({
        error: 'Duplicate.',
        index: i,
      });
    } else {
      values.add(record.TxtValues[i]);
    }
  }
  return errors;
};

export const getDnsTXTValueTotalLengthError = (
  record: DNSRecordTXTDto
): string => {
  return record.TxtValues.reduce(
    (previous, current) => previous + current.length,
    0
  ) > MAX_DNS_TXT_TOTAL_LENGTH
    ? `Total length of all values cannot exceed ${MAX_DNS_TXT_TOTAL_LENGTH} characters.`
    : '';
};

export const getDnsTXTValueTotalCountError = (
  record: DNSRecordTXTDto
): string =>
  record.TxtValues.length > MAX_DNS_TXT_VALUE_COUNT
    ? `Record cannot contain more than ${MAX_DNS_TXT_VALUE_COUNT} values.`
    : '';

export const getDnsMXServerError = (record: DNSRecordMXDto): string => {
  if (record.Server.length === 0) return RequiredText;

  if (record.Server.length > MAX_DNS_HOST_COUNT)
    return `Server name cannot contain more than ${MAX_DNS_HOST_COUNT} characters.`;

  if (record.Server.endsWith('.') || record.Server.endsWith(' '))
    return `MX Record Server cannot end with a period or space.`;

  if (!DNS_SERVER_REGEX.test(record.Server))
    return 'Invalid MX Record Server Name.';
  return '';
};

export const getDnsPriorityError = (
  record: DNSRecordMXDto | DNSRecordSRVDto
): string => {
  const priority = record.Priority;
  if (isNaN(priority)) {
    return 'Priority must be a number.';
  }
  return priority < 0 || priority > MAX_DNS_PRIORITY
    ? `Priority must be between 0 and ${MAX_DNS_PRIORITY}.`
    : '';
};

export const getDnsCNAMEError = (
  record: DNSRecordCNAMEDto,
  dnsZoneName: string
): string => {
  if (record.CanonicalName.length == 0) return RequiredText;

  if (!DNS_REGEX.test(record.CanonicalName)) return InvalidCanonicalName;

  let maxLength = 253 - dnsZoneName.length;
  if (record.CanonicalName.endsWith('.')) maxLength++;

  if (record.CanonicalName.length > maxLength) return CanonicalNameTooLong;

  return '';
};

export const getDnsARecordError = (record: DNSRecordADto): string => {
  return record.IPAddress.length > 0 ? '' : RequiredText;
};

export const getAllDNSRecords = (
  dnsARecords: DNSRecordADto[],
  dnsCNAMERecords: DNSRecordCNAMEDto[],
  dnsMXRecords: DNSRecordMXDto[],
  dnsNSRecords: DNSRecordNSDto[],
  dnsSRVRecords: DNSRecordSRVDto[],
  dnsTXTRecords: DNSRecordTXTDto[]
): DNSRecordObject[] => {
  return [
    ...dnsARecords.map((dnsRecord, index) => {
      return { dnsRecord, recordType: DNSRecordType.A, index };
    }),
    ...dnsCNAMERecords.map((dnsRecord, index) => {
      return { dnsRecord, recordType: DNSRecordType.CNAME, index };
    }),
    ...dnsMXRecords.map((dnsRecord, index) => {
      return { dnsRecord, recordType: DNSRecordType.MX, index };
    }),
    ...dnsNSRecords.map((dnsRecord, index) => {
      return { dnsRecord, recordType: DNSRecordType.NS, index };
    }),
    ...dnsSRVRecords.map((dnsRecord, index) => {
      return { dnsRecord, recordType: DNSRecordType.SRV, index };
    }),
    ...dnsTXTRecords.map((dnsRecord, index) => {
      return { dnsRecord, recordType: DNSRecordType.TXT, index };
    }),
  ];
};

export const dnsRecordHasErrors = (
  { dnsRecord, recordType, index }: DNSRecordObject,
  allDNSRecords: DNSRecordObject[],
  dnsZoneName: string,
  restrictedDnsPrefixes: string[]
): boolean => {
  let errors = [
    getDnsTTLError(dnsRecord),
    getDnsNameError(
      { dnsRecord, recordType, index },
      allDNSRecords,
      restrictedDnsPrefixes
    ),
  ];
  switch (recordType) {
    case DNSRecordType.A:
      errors = [...errors, getDnsARecordError(dnsRecord as DNSRecordADto)];
      break;
    case DNSRecordType.CNAME:
      errors = [
        ...errors,
        getDnsCNAMEError(dnsRecord as DNSRecordCNAMEDto, dnsZoneName),
      ];
      break;
    case DNSRecordType.MX:
      errors = [
        ...errors,
        getDnsPriorityError(dnsRecord as DNSRecordMXDto),
        getDnsMXServerError(dnsRecord as DNSRecordMXDto),
      ];
      break;
    case DNSRecordType.NS:
      errors = [...errors, getDnsNameServerError(dnsRecord as DNSRecordNSDto)];
      break;
    case DNSRecordType.SRV:
      errors = [
        ...errors,
        getDnsSRVDomainNameError(dnsRecord as DNSRecordSRVDto),
        getDnsSRVPortError(dnsRecord as DNSRecordSRVDto),
        getDnsPriorityError(dnsRecord as DNSRecordSRVDto),
        getDnsSRVWeightError(dnsRecord as DNSRecordSRVDto),
      ];
      break;
    case DNSRecordType.TXT:
      errors = [
        ...errors,
        ...getDnsTXTValueErrors(dnsRecord as DNSRecordTXTDto).map(
          (val) => val.error
        ),
        getDnsTXTValueTotalLengthError(dnsRecord as DNSRecordTXTDto),
        getDnsTXTValueTotalCountError(dnsRecord as DNSRecordTXTDto),
      ];
      break;
  }

  return errors.some((err) => err);
};

export function addOrUpdateDNSRecord<Type extends DNSRecordDto>(
  records: Type[],
  record: Type,
  index: number
): Type[] {
  if (index === -1) {
    records.push(record);
  } else {
    records[index] = record;
  }
  return records;
}

export function removeDNSRecord<Type extends DNSRecordDto>(
  records: Type[],
  index: number
): Type[] {
  records.splice(index, 1);
  return records;
}

export const getInitialDNSValues = (
  workspace: AzureWorkspaceDto
): DNSRecordValues => {
  const dnsZone = workspace.DNSZone;
  return {
    dnsARecords: dnsZone ? dnsZone.DnsARecords : [],
    dnsCNAMERecords: dnsZone ? dnsZone.DnsCNAMERecords : [],
    dnsMXRecords: dnsZone ? dnsZone.DnsMXRecords : [],
    dnsNSRecords: dnsZone ? dnsZone.DnsNSRecords : [],
    dnsSRVRecords: dnsZone ? dnsZone.DnsSRVRecords : [],
    dnsTXTRecords: dnsZone ? dnsZone.DnsTXTRecords : [],
  };
};

export const txtValueLimitMet = (txtValues: string[]): boolean => {
  return txtValues.length >= MAX_DNS_TXT_VALUE_COUNT;
};
