import {
  EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
  SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
} from '../../../store/actions/actionTypes';
import {
  editableWorkspaceAddOrUpdateDnsRecord,
  editableWorkspaceRemoveDnsRecord,
} from '../../../store/actions/editableWorkspaceActions';
import { getMockStore } from '../../utils/mockStore.util';
import {
  AzureDNSZoneDtoTestData,
  getTestDNSZoneDto,
} from '../../data/AzureDNSZoneDtoTestData';
import { DNSRecordCombinedDtoTestData } from '../../data/DNSRecordCombinedDtoTestData';
import {
  addOrUpdateDNSRecord,
  DNSRecordObject,
  DNSRecordType,
  removeDNSRecord,
} from '../../../components/MyWorkspaces/WorkspaceMachineProperties/WorkspaceProperties/DnsPropertiesPanel.utils';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { editableWorkspaceInitialState } from '../../../store/reducers/editableWorkspaceReducer';
import {
  DNSRecordADto,
  DNSRecordCNAMEDto,
  DNSRecordMXDto,
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
} from '../../../types/AzureWorkspace/DNSRecords';
import { AzureDNSZoneDto } from '../../../types/AzureWorkspace/AzureDNSZoneDto.types';

const store = getMockStore({
  editableWorkspace: {
    ...editableWorkspaceInitialState,
    editableWorkspace: {
      ...editableWorkspaceInitialState.editableWorkspace,
      DNSZone: AzureDNSZoneDtoTestData,
    } as AzureWorkspaceDto,
  },
});

const addDnsRecord = async (
  recordType: DNSRecordType,
  targetPayload: AzureDNSZoneDto,
  index: number
) => {
  const expectedAction = {
    type: EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
    payload: targetPayload,
  };
  const DNSRecord = {
    dnsRecord: DNSRecordCombinedDtoTestData,
    recordType: recordType,
    index: index,
  } as DNSRecordObject;

  await editableWorkspaceAddOrUpdateDnsRecord(DNSRecord, true)(
    store.dispatch,
    store.getState
  );

  return [
    {
      type: SET_POLITE_SCREEN_READER_ANNOUNCEMENT,
      payload: `DNS ${DNSRecordType[recordType]} record added.`,
    },
    expectedAction,
  ];
};

const removeDnsRecord = async (
  recordType: DNSRecordType,
  targetPayload: AzureDNSZoneDto
) => {
  const expectedAction = {
    type: EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
    payload: targetPayload,
  };
  const DNSRecord = {
    dnsRecord: DNSRecordCombinedDtoTestData,
    recordType: recordType,
    index: 0,
  } as DNSRecordObject;

  await editableWorkspaceRemoveDnsRecord(DNSRecord)(
    store.dispatch,
    store.getState
  );

  return [expectedAction];
};

const removeNonExistantRecord = async (
  recordType: DNSRecordType,
  targetPayload: AzureDNSZoneDto
) => {
  const expectedAction = {
    type: EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
    payload: targetPayload,
  };
  const DNSRecord = {
    dnsRecord: {},
    recordType: recordType,
    index: 10,
  } as DNSRecordObject;

  await editableWorkspaceRemoveDnsRecord(DNSRecord)(
    store.dispatch,
    store.getState
  );

  return [expectedAction];
};

describe('Workspace DNS Action Tests', () => {
  beforeEach(() => {
    // Runs before each test in the suite
    store.clearActions();
  });
  test('addDnsRecord action contains expected type and payload when adding a new DNS A Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsARecords = addOrUpdateDNSRecord<DNSRecordADto>(
      [...targetPayload.DnsARecords],
      DNSRecordCombinedDtoTestData as DNSRecordADto,
      -1
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.A, targetPayload, -1)
    );
  });

  test('addDnsRecord action contains expected type and payload when adding a new DNS CNAME Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsCNAMERecords = addOrUpdateDNSRecord<DNSRecordCNAMEDto>(
      [...targetPayload.DnsCNAMERecords],
      DNSRecordCombinedDtoTestData as DNSRecordCNAMEDto,
      -1
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.CNAME, targetPayload, -1)
    );
  });
  test('addDnsRecord action contains expected type and payload when adding a new DNS MX Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsMXRecords = addOrUpdateDNSRecord<DNSRecordMXDto>(
      [...targetPayload.DnsMXRecords],
      DNSRecordCombinedDtoTestData as DNSRecordMXDto,
      -1
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.MX, targetPayload, -1)
    );
  });
  test('addDnsRecord action contains expected type and payload when adding a new DNS NS Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsNSRecords = addOrUpdateDNSRecord<DNSRecordNSDto>(
      [...targetPayload.DnsNSRecords],
      DNSRecordCombinedDtoTestData as DNSRecordNSDto,
      -1
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.NS, targetPayload, -1)
    );
  });
  test('addDnsRecord action contains expected type and payload when adding a new DNS SRV Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsSRVRecords = addOrUpdateDNSRecord<DNSRecordSRVDto>(
      [...targetPayload.DnsSRVRecords],
      DNSRecordCombinedDtoTestData as DNSRecordSRVDto,
      -1
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.SRV, targetPayload, -1)
    );
  });
  test('addDnsRecord action contains expected type and payload when adding a new DNS TXT Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsTXTRecords = addOrUpdateDNSRecord<DNSRecordTXTDto>(
      [...targetPayload.DnsTXTRecords],
      DNSRecordCombinedDtoTestData as DNSRecordTXTDto,
      -1
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.TXT, targetPayload, -1)
    );
  });

  test('addDnsRecord action contains expected type and payload when updating an existing DNS A Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsARecords = addOrUpdateDNSRecord<DNSRecordADto>(
      [...targetPayload.DnsARecords],
      DNSRecordCombinedDtoTestData as DNSRecordADto,
      0
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.A, targetPayload, 0)
    );
  });

  test('addDnsRecord action contains expected type and payload when updating an existing DNS CNAME Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsCNAMERecords = addOrUpdateDNSRecord<DNSRecordCNAMEDto>(
      [...targetPayload.DnsCNAMERecords],
      DNSRecordCombinedDtoTestData as DNSRecordCNAMEDto,
      0
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.CNAME, targetPayload, 0)
    );
  });
  test('addDnsRecord action contains expected type and payload when updating an existing DNS MX Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsMXRecords = addOrUpdateDNSRecord<DNSRecordMXDto>(
      [...targetPayload.DnsMXRecords],
      DNSRecordCombinedDtoTestData as DNSRecordMXDto,
      0
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.MX, targetPayload, 0)
    );
  });
  test('addDnsRecord action contains expected type and payload when updating an existing DNS NS Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsNSRecords = addOrUpdateDNSRecord<DNSRecordNSDto>(
      [...targetPayload.DnsNSRecords],
      DNSRecordCombinedDtoTestData as DNSRecordNSDto,
      0
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.NS, targetPayload, 0)
    );
  });
  test('addDnsRecord action contains expected type and payload when updating an existing DNS SRV Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsSRVRecords = addOrUpdateDNSRecord<DNSRecordSRVDto>(
      [...targetPayload.DnsSRVRecords],
      DNSRecordCombinedDtoTestData as DNSRecordSRVDto,
      0
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.SRV, targetPayload, 0)
    );
  });
  test('addDnsRecord action contains expected type and payload when updating an existing DNS TXT Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsTXTRecords = addOrUpdateDNSRecord<DNSRecordTXTDto>(
      [...targetPayload.DnsTXTRecords],
      DNSRecordCombinedDtoTestData as DNSRecordTXTDto,
      0
    );
    expect(store.getActions()).toEqual(
      await addDnsRecord(DNSRecordType.TXT, targetPayload, 0)
    );
  });

  test('deleteDnsRecord action contains expected type and payload when deleting an existing DNS A Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsARecords = removeDNSRecord<DNSRecordADto>(
      [...targetPayload.DnsARecords],
      0
    );
    expect(store.getActions()).toEqual(
      await removeDnsRecord(DNSRecordType.A, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an existing DNS CNAME Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsCNAMERecords = removeDNSRecord<DNSRecordCNAMEDto>(
      [...targetPayload.DnsCNAMERecords],
      0
    );
    expect(store.getActions()).toEqual(
      await removeDnsRecord(DNSRecordType.CNAME, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an existing DNS MX Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsMXRecords = removeDNSRecord<DNSRecordMXDto>(
      [...targetPayload.DnsMXRecords],
      0
    );
    expect(store.getActions()).toEqual(
      await removeDnsRecord(DNSRecordType.MX, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an existing DNS NS Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsNSRecords = removeDNSRecord<DNSRecordNSDto>(
      [...targetPayload.DnsNSRecords],
      0
    );
    expect(store.getActions()).toEqual(
      await removeDnsRecord(DNSRecordType.NS, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an existing DNS SRV Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsSRVRecords = removeDNSRecord<DNSRecordSRVDto>(
      [...targetPayload.DnsSRVRecords],
      0
    );
    expect(store.getActions()).toEqual(
      await removeDnsRecord(DNSRecordType.SRV, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an existing DNS TXT Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    targetPayload.DnsTXTRecords = removeDNSRecord<DNSRecordTXTDto>(
      [...targetPayload.DnsTXTRecords],
      0
    );
    expect(store.getActions()).toEqual(
      await removeDnsRecord(DNSRecordType.TXT, targetPayload)
    );
  });

  test('deleteDnsRecord action contains expected type and payload when deleting an non-existing DNS A Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    expect(store.getActions()).toEqual(
      await removeNonExistantRecord(DNSRecordType.A, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an non-existing DNS CNAME Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    expect(store.getActions()).toEqual(
      await removeNonExistantRecord(DNSRecordType.CNAME, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an non-existing DNS MX Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    expect(store.getActions()).toEqual(
      await removeNonExistantRecord(DNSRecordType.MX, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an non-existing DNS NS Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    expect(store.getActions()).toEqual(
      await removeNonExistantRecord(DNSRecordType.NS, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an non-existing DNS SRV Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    expect(store.getActions()).toEqual(
      await removeNonExistantRecord(DNSRecordType.SRV, targetPayload)
    );
  });
  test('deleteDnsRecord action contains expected type and payload when deleting an non-existing DNS TXT Record', async () => {
    const targetPayload = getTestDNSZoneDto();
    expect(store.getActions()).toEqual(
      await removeNonExistantRecord(DNSRecordType.TXT, targetPayload)
    );
  });
});
