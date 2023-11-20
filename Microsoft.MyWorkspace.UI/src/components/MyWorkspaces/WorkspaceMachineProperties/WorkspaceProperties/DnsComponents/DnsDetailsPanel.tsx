import {
  DefaultButton,
  DirectionalHint,
  Dropdown,
  IconButton,
  IDropdownOption,
  Label,
  List,
  MessageBar,
  MessageBarType,
  Panel,
  PanelType,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  TextField,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import axios, { CancelTokenSource } from 'axios';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIcon, deleteIcon } from '../../../../../shared/Icons';
import { defaultStackTokens } from '../../../../../shared/StackTokens';
import { editableWorkspaceAddOrUpdateDnsRecord } from '../../../../../store/actions/editableWorkspaceActions';
import {
  getAzureDNSZoneName,
  getCatalogUserProfile,
  getRestrictedDnsPrefixes,
} from '../../../../../store/selectors';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { DnsTXTRecordMaxValueCountError } from '../../../../../store/validators/ErrorConstants';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import {
  DNSRecordADto,
  DNSRecordCNAMEDto,
  DNSRecordMXDto,
  DNSRecordNSDto,
  DNSRecordSRVDto,
  DNSRecordTXTDto,
} from '../../../../../types/AzureWorkspace/DNSRecords';
import { DNSRecordDto } from '../../../../../types/AzureWorkspace/DNSRecords/DNSRecordDto.types';
import { ResourceState } from '../../../../../types/AzureWorkspace/enums/ResourceState';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';
import { checkDNSNameExists } from '../../../workspaceService';
import {
  DNSRecordType,
  DNSRecordObject,
  getDnsCNAMEError,
  getDnsSRVDomainNameError,
  getDnsNameError,
  getDnsNameServerError,
  getDnsPriorityError,
  getDnsMXServerError,
  getDnsSRVPortError,
  getDnsSRVWeightError,
  getDnsTTLError,
  getDnsARecordError,
  dnsRecordHasErrors,
  txtValueLimitMet,
  getDnsTXTValueErrors,
  getDnsTXTValueTotalLengthError,
} from '../DnsPropertiesPanel.utils';

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRecord: DNSRecordObject;
  setSelectedRecord: (dns: DNSRecordObject) => void;
  allDNSRecords: DNSRecordObject[];
}

export const DnsDetailsPanel = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const [timeoutInstance, setTimeoutInstance] = React.useState(undefined);
  const [cancellationToken, setCancellationToken] =
    React.useState<CancelTokenSource>(null);
  const [dnsNameValid, setDnsNameValid] = React.useState(false);
  const [nameValidationError, setNameValidationError] = React.useState('');
  const [dnsNameValidationLoading, setDnsNameValidationLoading] =
    React.useState(false);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const originalWorkspace = useSelector(getEditableWorkspaceOriginalWorkspace);
  const dnsZoneName = useSelector(getAzureDNSZoneName);
  const userProfile = useSelector(getCatalogUserProfile);
  const restrictedDnsPrefixes = useSelector(getRestrictedDnsPrefixes);

  const saveDisabled = () => {
    return (
      EditsDisabled(
        userProfile,
        editableWorkspace as AzureWorkspaceDto,
        originalWorkspace as AzureWorkspaceDto,
        true
      ) ||
      !dnsNameValid ||
      (props.selectedRecord !== null
        ? dnsRecordHasErrors(
            props.selectedRecord,
            props.allDNSRecords,
            dnsZoneName,
            restrictedDnsPrefixes
          )
        : true)
    );
  };
  const onRenderFooterContent = () => {
    const creatingRecord = props.selectedRecord
      ? props.selectedRecord.index === -1
      : true;
    return (
      <div>
        <PrimaryButton
          disabled={saveDisabled()}
          onClick={() => {
            props.setOpen(false);
            dispatch(
              editableWorkspaceAddOrUpdateDnsRecord(
                props.selectedRecord,
                creatingRecord
              )
            );
            props.setSelectedRecord(null);
          }}
        >
          {creatingRecord ? 'Add' : 'Edit'}
        </PrimaryButton>
        <DefaultButton
          className={commonStyles.marginLeft8}
          onClick={() => props.setOpen(false)}
        >
          Cancel
        </DefaultButton>
      </div>
    );
  };

  const onRenderTxtRecordCell = (
    item: {
      value: string;
    },
    index: number
  ) => {
    const record = props.selectedRecord.dnsRecord as DNSRecordTXTDto;
    const valueErrors = getDnsTXTValueErrors(record);
    return (
      <Stack
        className={commonStyles.fullWidth}
        key={`txtrecord-${index}`}
        style={{ margin: '8px 0' }}
        horizontalAlign='center'
        horizontal
      >
        <Stack.Item grow={1}>
          <TextField
            placeholder={'Enter a value'}
            onChange={(event, newValue) => {
              const txtValues = [...record.TxtValues];
              txtValues[index] = newValue;
              props.setSelectedRecord({
                ...props.selectedRecord,
                dnsRecord: {
                  ...record,
                  TxtValues: txtValues,
                } as DNSRecordTXTDto,
              });
            }}
            disabled={EditsDisabled(
              userProfile,
              editableWorkspace as AzureWorkspaceDto,
              originalWorkspace as AzureWorkspaceDto,
              true
            )}
            errorMessage={valueErrors.find((e) => e.index === index)?.error}
            value={item.value}
          />
        </Stack.Item>
        <Stack.Item grow={0} shrink={0}>
          <TooltipHost
            content={
              record.TxtValues.length === 1
                ? 'Record must contain at least one value.'
                : ''
            }
          >
            <IconButton
              disabled={record.TxtValues.length === 1}
              ariaLabel='delete'
              onClick={() => {
                const txtValues = [...record.TxtValues];
                txtValues.splice(index, 1);
                props.setSelectedRecord({
                  ...props.selectedRecord,
                  dnsRecord: {
                    ...record,
                    TxtValues: txtValues,
                  } as DNSRecordTXTDto,
                });
              }}
              iconProps={deleteIcon}
            />
          </TooltipHost>
        </Stack.Item>
      </Stack>
    );
  };

  const parseFormValueToInt = (newValue: string, oldValue: number): number => {
    if (newValue === '') {
      return undefined;
    }
    const parsedInt = parseInt(newValue);
    if (isNaN(parsedInt)) {
      return oldValue;
    }
    return Math.abs(parsedInt);
  };

  const getRecordFields = (currentRecord: DNSRecordObject) => {
    const { dnsRecord, recordType } = currentRecord;
    switch (recordType) {
      case DNSRecordType.A: {
        const record = dnsRecord as DNSRecordADto;
        const options: IDropdownOption[] =
          editableWorkspace.PublicAddresses.filter(
            (val) => val.State === ResourceState.Running
          ).map((v) => {
            return { key: v.PublicIPAddress, text: v.PublicIPAddress };
          });

        return (
          <>
            <Stack
              horizontal
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
            >
              <Stack.Item grow>
                <Dropdown
                  label='Address'
                  selectedKey={record.IPAddress}
                  onChange={(event, option: IDropdownOption) =>
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        IPAddress: option.text.toString(),
                      } as DNSRecordADto,
                    })
                  }
                  placeholder='Select an option'
                  options={options}
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  errorMessage={
                    options.length === 0
                      ? 'No Public IPs available. Public IPs can be created in the External Connectivity Panel.'
                      : getDnsARecordError(record)
                  }
                />
              </Stack.Item>
            </Stack>
          </>
        );
      }

      case DNSRecordType.CNAME: {
        const record = dnsRecord as DNSRecordCNAMEDto;
        return (
          <>
            <Stack
              horizontal
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
            >
              <Stack.Item grow>
                <TextField
                  label='Canonical Name'
                  value={record.CanonicalName}
                  onChange={(event, newValue) =>
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        CanonicalName: newValue,
                      } as DNSRecordCNAMEDto,
                    })
                  }
                  errorMessage={getDnsCNAMEError(record, dnsZoneName)}
                />
              </Stack.Item>
            </Stack>
          </>
        );
      }

      case DNSRecordType.MX: {
        const record = dnsRecord as DNSRecordMXDto;
        return (
          <>
            <Stack
              horizontal
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
            >
              <Stack.Item grow>
                <TextField
                  label='Server'
                  value={record.Server}
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  onChange={(event, newValue) =>
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        Server: newValue,
                      } as DNSRecordMXDto,
                    })
                  }
                  errorMessage={getDnsMXServerError(record)}
                />
              </Stack.Item>
            </Stack>
            <Stack
              horizontal
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
            >
              <Stack.Item grow>
                <TextField
                  label='Priority'
                  value={
                    record.Priority !== undefined ? `${record.Priority}` : ''
                  }
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  onChange={(ev, newValue) =>
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        Priority: parseFormValueToInt(
                          newValue,
                          record.Priority
                        ),
                      } as DNSRecordMXDto,
                    })
                  }
                  errorMessage={getDnsPriorityError(record)}
                />
              </Stack.Item>
            </Stack>
          </>
        );
      }

      case DNSRecordType.NS: {
        const record = dnsRecord as DNSRecordNSDto;
        return (
          <>
            <Stack
              horizontal
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
            >
              <Stack.Item grow>
                <TextField
                  label='Name Server'
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  value={record.NameServer}
                  onChange={(event, newValue) =>
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        NameServer: newValue,
                      } as DNSRecordNSDto,
                    })
                  }
                  errorMessage={getDnsNameServerError(record)}
                />
              </Stack.Item>
            </Stack>
          </>
        );
      }

      case DNSRecordType.SRV: {
        const record = dnsRecord as DNSRecordSRVDto;
        return (
          <>
            <Stack
              horizontal
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
            >
              <Stack.Item grow>
                <TextField
                  label='Domain Name'
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  value={record.DomainName}
                  onChange={(event, newValue) =>
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        DomainName: newValue,
                      } as DNSRecordSRVDto,
                    })
                  }
                  errorMessage={getDnsSRVDomainNameError(record)}
                />
              </Stack.Item>
            </Stack>
            <Stack
              horizontal
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
            >
              <Stack.Item grow>
                <TextField
                  label='Weight'
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  value={record.Weight !== undefined ? `${record.Weight}` : ''}
                  onChange={(ev, newValue) =>
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        Weight: parseFormValueToInt(newValue, record.Weight),
                      } as DNSRecordSRVDto,
                    })
                  }
                  errorMessage={getDnsSRVWeightError(record)}
                />
              </Stack.Item>
              <Stack.Item grow>
                <TextField
                  label='Priority'
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  value={
                    record.Priority !== undefined ? `${record.Priority}` : ''
                  }
                  onChange={(ev, newValue) => {
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...record,
                        Priority: parseFormValueToInt(
                          newValue,
                          record.Priority
                        ),
                      } as DNSRecordSRVDto,
                    });
                  }}
                  errorMessage={getDnsPriorityError(record)}
                />
              </Stack.Item>
              <Stack.Item grow>
                <TextField
                  label='Port'
                  disabled={EditsDisabled(
                    userProfile,
                    editableWorkspace as AzureWorkspaceDto,
                    originalWorkspace as AzureWorkspaceDto,
                    true
                  )}
                  value={record.Port !== undefined ? `${record.Port}` : ''}
                  onChange={(ev, newValue) => {
                    props.setSelectedRecord({
                      ...currentRecord,
                      dnsRecord: {
                        ...dnsRecord,
                        Port: parseFormValueToInt(newValue, record.Port),
                      } as DNSRecordSRVDto,
                    });
                  }}
                  errorMessage={getDnsSRVPortError(record)}
                />
              </Stack.Item>
            </Stack>
          </>
        );
      }

      case DNSRecordType.TXT: {
        const record = dnsRecord as DNSRecordTXTDto;
        const maxCharacterLimit = getDnsTXTValueTotalLengthError(record);
        return (
          <>
            <Stack
              className={commonStyles.fullWidth}
              tokens={defaultStackTokens}
              horizontalAlign='space-between'
            >
              <Stack.Item grow>
                <Stack horizontal horizontalAlign='space-between'>
                  <Label>Descriptive Text</Label>
                  <TooltipHost
                    content={
                      txtValueLimitMet(record.TxtValues)
                        ? DnsTXTRecordMaxValueCountError
                        : ''
                    }
                  >
                    <DefaultButton
                      iconProps={addIcon}
                      disabled={
                        EditsDisabled(
                          userProfile,
                          editableWorkspace as AzureWorkspaceDto,
                          originalWorkspace as AzureWorkspaceDto,
                          true
                        ) || txtValueLimitMet(record.TxtValues)
                      }
                      onClick={() => {
                        const txtValues = record.TxtValues ?? [];
                        props.setSelectedRecord({
                          ...currentRecord,
                          dnsRecord: {
                            ...record,
                            TxtValues: [...txtValues, ''],
                          } as DNSRecordTXTDto,
                        });
                      }}
                    >
                      Add Record
                    </DefaultButton>
                  </TooltipHost>
                </Stack>
                <Stack className={commonStyles.marginTop6px}>
                  {maxCharacterLimit && (
                    <MessageBar
                      messageBarType={MessageBarType.error}
                      isMultiline={false}
                      dismissButtonAriaLabel='Close'
                    >
                      {maxCharacterLimit}
                    </MessageBar>
                  )}
                </Stack>
                <List
                  items={record.TxtValues.map((v) => {
                    return { value: v };
                  })}
                  onRenderCell={onRenderTxtRecordCell}
                />
              </Stack.Item>
            </Stack>
          </>
        );
      }
    }
  };

  const validateName = async (name: string, type: DNSRecordType) => {
    setDnsNameValidationLoading(true);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    setCancellationToken(source);
    const alreadyExists: boolean = await checkDNSNameExists(
      dispatch,
      name,
      type,
      source
    );
    setCancellationToken(null);
    setDnsNameValidationLoading(false);
    if (alreadyExists) {
      setDnsNameValid(false);
      setNameValidationError(
        'DNS record name is invalid, or already taken. Please try a new one.'
      );
    } else {
      setDnsNameValid(true);
      setNameValidationError('');
    }
  };

  const onNameChange = (
    name: string,
    currentRecord: DNSRecordObject,
    dnsRecord: DNSRecordDto
  ) => {
    setDnsNameValid(false);
    setDnsNameValidationLoading(false);
    setNameValidationError('');
    props.setSelectedRecord({
      ...currentRecord,
      dnsRecord: {
        ...dnsRecord,
        Name: name,
      },
    });

    if (cancellationToken) {
      cancellationToken.cancel('Operation canceled due to new input');
    }

    if (timeoutInstance) {
      clearTimeout(timeoutInstance);
    }

    if (name.length === 0) {
      return;
    }

    setTimeoutInstance(
      setTimeout(() => {
        validateName(name, currentRecord.recordType);
      }, 1000)
    );
  };

  const renderDNSPanel = (currentRecord: DNSRecordObject) => {
    const { dnsRecord } = currentRecord;
    return (
      <>
        <Stack
          horizontal
          className={commonStyles.fullWidth}
          tokens={defaultStackTokens}
        >
          <Stack.Item grow>
            <TextField
              label='Name'
              disabled={EditsDisabled(
                userProfile,
                editableWorkspace as AzureWorkspaceDto,
                originalWorkspace as AzureWorkspaceDto,
                true
              )}
              value={dnsRecord.Name}
              errorMessage={
                getDnsNameError(
                  currentRecord,
                  props.allDNSRecords,
                  restrictedDnsPrefixes
                ) || nameValidationError
              }
              suffix={`.${dnsZoneName}`}
              styles={{
                description: { float: 'right', fontSize: 11, paddingTop: 5 },
              }}
              onChange={(ev, newValue) =>
                onNameChange(
                  newValue.toLowerCase().trim(),
                  currentRecord,
                  dnsRecord
                )
              }
            />
          </Stack.Item>
          <Stack verticalAlign='end'>
            {dnsNameValidationLoading && <Spinner size={SpinnerSize.medium} />}
          </Stack>
        </Stack>
        <Stack
          horizontal
          className={commonStyles.halfWidth}
          tokens={defaultStackTokens}
        >
          <Stack.Item grow>
            <TooltipHost
              directionalHint={DirectionalHint.topLeftEdge}
              content='Time To Live'
            >
              <TextField
                label='TTL'
                disabled={EditsDisabled(
                  userProfile,
                  editableWorkspace as AzureWorkspaceDto,
                  originalWorkspace as AzureWorkspaceDto,
                  true
                )}
                value={dnsRecord.TTL !== undefined ? `${dnsRecord.TTL}` : ''}
                errorMessage={getDnsTTLError(dnsRecord)}
                suffix='Minutes'
                onChange={(ev, newValue) => {
                  props.setSelectedRecord({
                    ...currentRecord,
                    dnsRecord: {
                      ...dnsRecord,
                      TTL: parseFormValueToInt(newValue, dnsRecord.TTL),
                    },
                  });
                }}
              />
            </TooltipHost>
          </Stack.Item>
        </Stack>
        {getRecordFields(currentRecord)}
      </>
    );
  };

  return (
    <Panel
      headerText={
        props.selectedRecord && props.selectedRecord.index !== -1
          ? `Edit DNS ${props.selectedRecord.recordType} Record`
          : `Create DNS ${
              props.selectedRecord ? props.selectedRecord.recordType : ''
            }
           Record`
      }
      isOpen={props.open}
      onRenderFooterContent={onRenderFooterContent}
      onDismiss={() => {
        props.setOpen(false);
      }}
      styles={{ scrollableContent: { flexGrow: 1 } }}
      closeButtonAriaLabel='Close'
      customWidth={'550px'}
      type={PanelType.custom}
    >
      {props.selectedRecord && renderDNSPanel(props.selectedRecord)}
    </Panel>
  );
};
