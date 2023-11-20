import {
  CommandButton,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IContextualMenuItem,
  IContextualMenuProps,
  SelectionMode,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { editIcon, deleteIcon, moreIcon } from '../../../../../shared/Icons';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import {
  getAzureDNSZoneName,
  getCatalogUserProfile,
} from '../../../../../store/selectors';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import { DNSRecordObject } from '../DnsPropertiesPanel.utils';

interface IProps {
  allDNSRecords: DNSRecordObject[];
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRecord: DNSRecordObject;
  setSelectedRecord: (record: DNSRecordObject) => void;
  setDeleteRecord: (record: DNSRecordObject) => void;
  openDialog: () => void;
}

export const DnsDetailsList = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const originalWorkspace = useSelector(getEditableWorkspaceOriginalWorkspace);
  const dnsZoneName = useSelector(getAzureDNSZoneName);
  const userProfile = useSelector(getCatalogUserProfile);
  const columns: IColumn[] = [
    {
      key: 'name',
      name: 'Name',
      fieldName: 'Name',
      minWidth: 200,
      maxWidth: 325,
      isResizable: true,
    },
    {
      key: 'type',
      name: 'Type',
      fieldName: 'TypeName',
      minWidth: 125,
      maxWidth: 200,
      isResizable: true,
    },

    {
      key: 'ttl',
      name: 'TTL (minutes)',
      fieldName: 'TTL',
      minWidth: 125,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: 'actions',
      name: 'Actions',
      isIconOnly: true,
      minWidth: 40,
    },
  ];

  const handleClickOpenConfirmation = (dnsRecordObject: DNSRecordObject) => {
    props.openDialog();
    props.setDeleteRecord(dnsRecordObject);
  };

  const _renderItemColumn = (
    { dnsRecord, recordType, index }: DNSRecordObject,
    _index: number,
    column: IColumn
  ) => {
    switch (column.key) {
      case 'type':
        return `${recordType}`;
      case 'name':
        return `${dnsRecord.Name}`;
      case 'ttl':
        return dnsRecord.TTL;
      case 'actions':
        const rowMenuProps: IContextualMenuProps = {
          items: [
            { key: 'edit', text: 'Edit', iconProps: editIcon },
            { key: 'delete', text: 'Delete', iconProps: deleteIcon },
          ],
          onItemClick: (
            ev?:
              | React.MouseEvent<HTMLElement, MouseEvent>
              | React.KeyboardEvent<HTMLElement>,
            item?: IContextualMenuItem
          ) => {
            switch (item.key) {
              case 'edit':
                props.setSelectedRecord({ dnsRecord, recordType, index });
                props.setOpen(true);
                return;
              case 'delete':
                handleClickOpenConfirmation({ dnsRecord, recordType, index });
                return;
            }
          },
        };
        return (
          <CommandButton
            iconProps={moreIcon}
            text=''
            onRenderMenuIcon={() => null}
            ariaLabel='more options'
            disabled={EditsDisabled(
              userProfile,
              editableWorkspace as AzureWorkspaceDto,
              originalWorkspace as AzureWorkspaceDto,
              true
            )}
            menuProps={rowMenuProps}
          />
        );
    }
  };

  return (
    <Stack className={commonStyles.fullWidth} tokens={defaultStackTokens}>
      {props.allDNSRecords && props.allDNSRecords.length > 0 ? (
        <>
          {dnsZoneName && <Text>Domain Name: {dnsZoneName}</Text>}
          <DetailsList
            items={props.allDNSRecords}
            columns={columns}
            setKey='set'
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.justified}
            onRenderItemColumn={_renderItemColumn}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn='Toggle selection'
            ariaLabelForSelectAllCheckbox='Toggle selection for all items'
            checkButtonAriaLabel='Row checkbox'
          />
        </>
      ) : (
        <p style={{ margin: 0 }}>No Records</p>
      )}
    </Stack>
  );
};
