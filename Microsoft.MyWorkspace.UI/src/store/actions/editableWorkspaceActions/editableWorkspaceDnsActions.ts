import cloneDeep from 'lodash/cloneDeep';
import { setPoliteScreenReaderAnnouncement, WorkspaceAction } from '..';
import {
  addOrUpdateDNSRecord,
  DNSRecordObject,
  DNSRecordType,
  removeDNSRecord,
} from '../../../components/MyWorkspaces/WorkspaceMachineProperties/WorkspaceProperties/DnsPropertiesPanel.utils';
import { AzureDNSZoneDto } from '../../../types/AzureWorkspace/AzureDNSZoneDto.types';
import {
  DNSRecordADto,
  DNSRecordCNAMEDto,
  DNSRecordMXDto,
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
} from '../../../types/AzureWorkspace/DNSRecords';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import {
  EDITABLE_WORKSPACE_SAVE_DNS_ZONE,
  EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
} from '../actionTypes';
import { EditableWorkspaceDispatch } from './index';

export const editableWorkspaceAddOrUpdateDnsRecord = (
  { dnsRecord, recordType, index }: DNSRecordObject,
  creatingRecord: boolean
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const dnsZone = cloneDeep(editableWorkspace.editableWorkspace.DNSZone);
    switch (recordType) {
      case DNSRecordType.A: {
        dnsZone.DnsARecords = addOrUpdateDNSRecord<DNSRecordADto>(
          [...dnsZone.DnsARecords],
          dnsRecord as DNSRecordADto,
          index
        );
        break;
      }
      case DNSRecordType.CNAME: {
        dnsZone.DnsCNAMERecords = addOrUpdateDNSRecord<DNSRecordCNAMEDto>(
          [...dnsZone.DnsCNAMERecords],
          dnsRecord as DNSRecordCNAMEDto,
          index
        );
        break;
      }
      case DNSRecordType.MX: {
        dnsZone.DnsMXRecords = addOrUpdateDNSRecord<DNSRecordMXDto>(
          [...dnsZone.DnsMXRecords],
          dnsRecord as DNSRecordMXDto,
          index
        );
        break;
      }
      case DNSRecordType.NS: {
        dnsZone.DnsNSRecords = addOrUpdateDNSRecord<DNSRecordNSDto>(
          [...dnsZone.DnsNSRecords],
          dnsRecord as DNSRecordNSDto,
          index
        );
        break;
      }
      case DNSRecordType.SRV: {
        dnsZone.DnsSRVRecords = addOrUpdateDNSRecord<DNSRecordSRVDto>(
          [...dnsZone.DnsSRVRecords],
          dnsRecord as DNSRecordSRVDto,
          index
        );
        break;
      }
      case DNSRecordType.TXT: {
        dnsZone.DnsTXTRecords = addOrUpdateDNSRecord<DNSRecordTXTDto>(
          [...dnsZone.DnsTXTRecords],
          dnsRecord as DNSRecordTXTDto,
          index
        );
        break;
      }
    }
    dispatch(
      setPoliteScreenReaderAnnouncement(
        `DNS ${DNSRecordType[recordType]} record ${
          creatingRecord ? 'added' : 'updated'
        }.`
      )
    );
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
      payload: dnsZone,
    });
  };
};

export const editableWorkspaceRemoveDnsRecord = (
  deleteRecord: DNSRecordObject
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const dnsZone = cloneDeep(editableWorkspace.editableWorkspace.DNSZone);
    const { recordType, index } = deleteRecord;
    if (deleteRecord && deleteRecord.index !== -1) {
      switch (recordType) {
        case DNSRecordType.A: {
          dnsZone.DnsARecords = removeDNSRecord(
            [...dnsZone.DnsARecords],
            index
          );
          break;
        }
        case DNSRecordType.CNAME: {
          dnsZone.DnsCNAMERecords = removeDNSRecord(
            [...dnsZone.DnsCNAMERecords],
            index
          );
          break;
        }
        case DNSRecordType.MX: {
          dnsZone.DnsMXRecords = removeDNSRecord(
            [...dnsZone.DnsMXRecords],
            index
          );
          break;
        }
        case DNSRecordType.NS: {
          dnsZone.DnsNSRecords = removeDNSRecord(
            [...dnsZone.DnsNSRecords],
            index
          );
          break;
        }
        case DNSRecordType.SRV: {
          dnsZone.DnsSRVRecords = removeDNSRecord(
            [...dnsZone.DnsSRVRecords],
            index
          );
          break;
        }
        case DNSRecordType.TXT: {
          dnsZone.DnsTXTRecords = removeDNSRecord(
            [...dnsZone.DnsTXTRecords],
            index
          );
          break;
        }
      }
    }
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_DNS_ZONE,
      payload: dnsZone,
    });
  };
};

export const saveDNSZone = (zone: AzureDNSZoneDto): WorkspaceAction => ({
  type: EDITABLE_WORKSPACE_SAVE_DNS_ZONE,
  payload: zone,
});
