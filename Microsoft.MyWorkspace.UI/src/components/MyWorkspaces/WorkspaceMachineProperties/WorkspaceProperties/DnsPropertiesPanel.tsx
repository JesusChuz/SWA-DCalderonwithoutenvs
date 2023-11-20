import * as React from 'react';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  DirectionalHint,
  IContextualMenuItem,
  IContextualMenuProps,
  PrimaryButton,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { EditsDisabled } from '../../../../shared/helpers/WorkspaceHelper';
import { addIcon } from '../../../../shared/Icons';
import { DNSRecordDto } from '../../../../types/AzureWorkspace/DNSRecords/DNSRecordDto.types';
import { defaultStackTokens } from '../../../../shared/StackTokens';
import {
  DNSRecordADto,
  DNSRecordCNAMEDto,
  DNSRecordMXDto,
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
} from '../../../../types/AzureWorkspace/DNSRecords';
import { EMPTY_GUID } from '../../../../shared/Constants';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import { DnsDetailsList } from './DnsComponents/DnsDetailsList';
import { DnsDetailsPanel } from './DnsComponents/DnsDetailsPanel';
import {
  DNSRecordObject,
  DNSRecordType,
  getAllDNSRecords,
} from './DnsPropertiesPanel.utils';
import { useDispatch, useSelector } from 'react-redux';
import { getCatalogUserProfile } from '../../../../store/selectors';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import { editableWorkspaceRemoveDnsRecord } from '../../../../store/actions/editableWorkspaceActions';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { InfoButton } from '../../../GeneralComponents/InfoButton';

const dialogStyles = { main: { maxWidth: 450 } };

const dialogContentProps = {
  type: DialogType.normal,
  title: 'Delete DNS Record',
  closeButtonAriaLabel: 'Close',
  subText: 'Do you want to delete the selected DNS record?',
};

const infoButtonId = 'dnsRecordInfoButton';

export const DnsPropertiesPanel = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getWorkspacePropertiesStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const [open, setOpen] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState<DNSRecordObject>(null);
  const [selectedRecord, setSelectedRecord] =
    React.useState<DNSRecordObject>(null);
  const userProfile = useSelector(getCatalogUserProfile);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleRecordDeletion = () => {
    setDeleteDialogOpen(false);
    dispatch(editableWorkspaceRemoveDnsRecord(deleteRecord));
    setDeleteRecord(null);
  };

  const modalProps = React.useMemo(
    () => ({
      isBlocking: false,
      styles: dialogStyles,
    }),
    []
  );

  const getMenuProps = () => {
    const menuProps: IContextualMenuProps = {
      onDismiss: (ev) => {
        if (ev && (ev as React.KeyboardEvent).shiftKey) {
          ev.preventDefault();
        }
      },
      items: Object.keys(DNSRecordType).map((type) => ({
        key: type,
        text: `${type} Record`,
      })),
      onItemClick: openNewRecordPanel,
      directionalHintFixed: true,
    };
    return menuProps;
  };

  const getNewRecord = (recordType: DNSRecordType): DNSRecordObject => {
    let newRecord: DNSRecordDto = {
      ID: EMPTY_GUID,
      Name: '',
      Description: '',
      TTL: 60,
      Path: '',
    };
    switch (recordType) {
      case DNSRecordType.A:
        newRecord = {
          ...newRecord,
          IPAddress: '',
        } as DNSRecordADto;
        break;
      case DNSRecordType.CNAME:
        newRecord = {
          ...newRecord,
          CanonicalName: '',
        } as DNSRecordCNAMEDto;
        break;
      case DNSRecordType.MX:
        newRecord = {
          ...newRecord,
          Priority: 0,
          Server: '',
        } as DNSRecordMXDto;
        break;
      case DNSRecordType.NS:
        newRecord = {
          ...newRecord,
          NameServer: '',
        } as DNSRecordNSDto;
        break;
      case DNSRecordType.SRV:
        newRecord = {
          ...newRecord,
          Priority: 0,
          Weight: 0,
          Port: 0,
          DomainName: '',
        } as DNSRecordSRVDto;
        break;
      case DNSRecordType.TXT:
        newRecord = {
          ...newRecord,
          TxtValues: [''],
        } as DNSRecordTXTDto;
        break;
    }
    return { dnsRecord: newRecord, recordType, index: -1 };
  };

  const openNewRecordPanel = (
    ev?: React.SyntheticEvent,
    item?: IContextualMenuItem
  ) => {
    const newRecord = getNewRecord(item.key as DNSRecordType);
    setSelectedRecord(newRecord);
    setOpen(true);
  };

  const allDNSRecords: DNSRecordObject[] = React.useMemo(() => {
    const {
      DnsARecords,
      DnsCNAMERecords,
      DnsMXRecords,
      DnsNSRecords,
      DnsSRVRecords,
      DnsTXTRecords,
    } = editableWorkspace.DNSZone;
    return getAllDNSRecords(
      DnsARecords,
      DnsCNAMERecords,
      DnsMXRecords,
      DnsNSRecords,
      DnsSRVRecords,
      DnsTXTRecords
    );
  }, [editableWorkspace.DNSZone]);

  return (
    <Stack className={styles.propertiesContent}>
      {editableWorkspace.PrivateMode ? (
        <Stack
          className={`${commonStyles.errorTextBold} ${commonStyles.marginTop16} ${commonStyles.marginLeft8}`}
        >
          DNS functionality is disabled for this workspace as Private Mode is
          enabled.
        </Stack>
      ) : (
        <>
          <Stack
            horizontal
            className={commonStyles.fullWidth}
            style={{ marginTop: 16 }}
            tokens={defaultStackTokens}
            horizontalAlign='space-between'
            verticalAlign='center'
          >
            <Stack.Item>
              <h3 className={commonStyles.margin0}>DNS Records</h3>
            </Stack.Item>
            <Stack.Item>
              <PrimaryButton
                text='New DNS Record'
                iconProps={addIcon}
                menuProps={getMenuProps()}
                persistMenu={true}
                disabled={EditsDisabled(
                  userProfile,
                  editableWorkspace,
                  originalWorkspace,
                  true
                )}
              />
              <InfoButton
                directionalHint={DirectionalHint.bottomCenter}
                buttonId={infoButtonId}
                calloutTitle={'Types of DNS Records'}
                calloutBody={
                  <>
                    <Text>
                      There are different types to choose from when creating a
                      new DNS record. The record types are as follows:
                    </Text>
                    <ul>
                      <li>A: address record</li>
                      <li>CNAME: canonical name record</li>
                      <li>MX: mail exchange record</li>
                      <li>NS: name server record</li>
                      <li>SRV: service locator record</li>
                      <li>TXT: text record</li>
                    </ul>
                  </>
                }
              />
            </Stack.Item>
          </Stack>
          <DnsDetailsList
            open={open}
            setOpen={setOpen}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
            setDeleteRecord={setDeleteRecord}
            openDialog={() => setDeleteDialogOpen(true)}
            allDNSRecords={allDNSRecords}
          />
          <DnsDetailsPanel
            open={open}
            setOpen={setOpen}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
            allDNSRecords={allDNSRecords}
          />
          <Dialog
            hidden={!deleteDialogOpen}
            onDismiss={() => setDeleteDialogOpen(false)}
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
          >
            <DialogFooter>
              <PrimaryButton
                onClick={() => handleRecordDeletion()}
                text='Delete'
              />
              <DefaultButton
                onClick={() => setDeleteDialogOpen(false)}
                text='Cancel'
              />
            </DialogFooter>
          </Dialog>
        </>
      )}
    </Stack>
  );
};
