import * as React from 'react';
import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  IconButton,
  Panel,
  PanelType,
  PrimaryButton,
  SelectionMode,
  Stack,
  Text,
  TextField,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import {
  patchSegmentRestrictedDnsAddresses,
  showUserConfirmationDialog,
  updateDirtyRestrictedEndpoints,
  updateRestrictedEndpointsForConstraint,
} from '../../../store/actions';
import {
  getSelectedAdminSegmentConstraint,
  getUserRoleAssignmentConstraint,
  getSegmentRestrictedDomainsValid,
  getSegmentRestrictedDomainsErrors,
  getDirtyRestrictedEndpoints,
  getSegmentUpdatePercentage,
} from '../../../store/selectors';
import { InfoButton } from '../../GeneralComponents/InfoButton';
import { deleteIcon } from '../../../shared/Icons';
import { RestrictedDomainsUpdatingMessage } from './RestrictedDomainsUpdatingMessage';

interface IProps {
  openRestrictedDomainsPanel: boolean;
  dismissPanel: () => void;
  segmentId: string;
  segmentName: string;
  editable: boolean;
}

export const RestrictedDomainsPanel = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const valid = useSelector(getSegmentRestrictedDomainsValid);
  const errors = useSelector(getSegmentRestrictedDomainsErrors);
  const selectedAdminConstraint = useSelector(
    getSelectedAdminSegmentConstraint
  );
  const userRoleAssignmentConstraint = useSelector(
    getUserRoleAssignmentConstraint
  );
  const dirtyRestrictedEndpoints = useSelector(getDirtyRestrictedEndpoints);
  const segmentUpdatePercentage = useSelector(getSegmentUpdatePercentage);

  const isUpdating = React.useMemo(() => {
    return (
      segmentUpdatePercentage.get(props.segmentId) !== 100 &&
      segmentUpdatePercentage.get(props.segmentId) !== -1
    );
  }, [segmentUpdatePercentage, props.segmentId]);

  const dirty = React.useMemo(() => {
    return !isEqual(
      dirtyRestrictedEndpoints,
      props.editable
        ? selectedAdminConstraint.RestrictedDnsEndpoints
        : userRoleAssignmentConstraint.RestrictedDnsEndpoints
    );
  }, [
    props.editable,
    dirtyRestrictedEndpoints,
    userRoleAssignmentConstraint,
    selectedAdminConstraint,
  ]);

  const initialize = () => {
    const initialConstraints = props.editable
      ? selectedAdminConstraint.RestrictedDnsEndpoints
      : userRoleAssignmentConstraint.RestrictedDnsEndpoints;
    if (initialConstraints) {
      dispatch(updateDirtyRestrictedEndpoints(initialConstraints));
    }
  };

  const addDomain = () => {
    dispatch(
      updateDirtyRestrictedEndpoints([
        ...(dirtyRestrictedEndpoints ? dirtyRestrictedEndpoints : []),
        ' ',
      ])
    );
  };

  const removeDomain = (index: number) => {
    dispatch(
      updateDirtyRestrictedEndpoints(
        dirtyRestrictedEndpoints.filter((v, i) => i !== index)
      )
    );
  };

  const patchRestrictedDomains = async (
    domains: string[],
    segmentId: string
  ) => {
    const trimmedDomains = domains.map((element) => {
      return element.trim();
    });
    dispatch(updateRestrictedEndpointsForConstraint(dirtyRestrictedEndpoints));
    dispatch(patchSegmentRestrictedDnsAddresses(segmentId, trimmedDomains));
    props.dismissPanel();
  };

  const closePanel = () => {
    props.dismissPanel();
  };

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: (
        <Stack horizontal verticalAlign='center'>
          {' '}
          Domain Names
          <InfoButton
            buttonId={'infoButton-domain-names'}
            calloutTitle={'Domain Formatting Help'}
            calloutBody={
              <>
                <Text block>
                  {
                    '1. Do not prefix the domain name with the protocol, http:// or https://.'
                  }
                </Text>
                <Text block>
                  {
                    '2. You can use an asterisk (*) to indicate a wildcard value.'
                  }
                </Text>
                <Text block>
                  {
                    '3. You can use a caret (^) to indicate an exact match value.'
                  }
                </Text>
              </>
            }
          />
        </Stack>
      ) as any,
      ariaLabel: 'Domain Names',
      minWidth: 100,
      maxWidth: 500,
      onRender: (item: string, index: number) => {
        return (
          <>
            {props.editable ? (
              <TextField
                type='text'
                placeholder={`Domain`}
                value={item}
                onChange={(
                  event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
                ) => {
                  //DetailsList will not render item if data source is empty string
                  //Workaround is to add a leading space and trim on submit
                  if (event.currentTarget.value === '') {
                    event.currentTarget.value = ' ';
                  }
                  dispatch(
                    updateDirtyRestrictedEndpoints([
                      ...dirtyRestrictedEndpoints.slice(0, index),
                      event.currentTarget.value,
                      ...dirtyRestrictedEndpoints.slice(index + 1),
                    ])
                  );
                }}
                errorMessage={errors[index]}
                maxLength={255}
                autoComplete='off'
                disabled={!props.editable || isUpdating}
              />
            ) : (
              <Stack.Item>{item}</Stack.Item>
            )}
          </>
        );
      },
    },
    {
      key: 'column2',
      name: '',
      ariaLabel: '',
      minWidth: 50,
      maxWidth: 50,
      onRender: (item: string, index: number) => {
        return (
          <IconButton
            iconProps={deleteIcon}
            title='Delete'
            ariaLabel='Delete'
            disabled={isUpdating}
            onClick={() => {
              removeDomain(index);
            }}
          />
        );
      },
    },
  ];

  const onRenderFooterContent = () => (
    <Stack>
      {props.editable ? (
        <Stack horizontal>
          <PrimaryButton
            className={commonStyles.flexItem}
            style={{ alignSelf: 'flex-end' }}
            text='Submit'
            allowDisabledFocus
            disabled={!valid || !dirty}
            onClick={() => {
              dispatch(
                showUserConfirmationDialog(
                  'Warning',
                  'Are you sure you want to submit this update to Private Mode Only Domains? While this operation is syncing restrictions across all workspaces, further edits will be unavailable.',
                  () =>
                    patchRestrictedDomains(
                      dirtyRestrictedEndpoints,
                      props.segmentId
                    )
                )
              );
            }}
          />
          <DefaultButton
            className={commonStyles.flexItem}
            text='Cancel'
            allowDisabledFocus
            onClick={() => {
              closePanel();
            }}
          />
        </Stack>
      ) : (
        <></>
      )}
    </Stack>
  );

  React.useEffect(() => {
    initialize();
  }, [selectedAdminConstraint, userRoleAssignmentConstraint]);

  return (
    <Panel
      isOpen={props.openRestrictedDomainsPanel}
      onDismiss={props.dismissPanel}
      isLightDismiss={true}
      headerText={'Private Mode Only Domains'}
      type={PanelType.medium}
      isFooterAtBottom={true}
      onRenderFooterContent={onRenderFooterContent}
      closeButtonAriaLabel='Close'
    >
      {
        <Stack>
          <Stack
            horizontal
            verticalAlign='end'
            horizontalAlign='space-between'
            style={{ marginBottom: 8 }}
          >
            <Stack.Item>
              <p>{props.segmentName}</p>
            </Stack.Item>
            {props.editable ? (
              <Stack.Item>
                <PrimaryButton
                  className={commonStyles.flexItem}
                  disabled={isUpdating}
                  style={{ alignSelf: 'flex-end' }}
                  text='Add Domain'
                  onClick={() => {
                    addDomain();
                  }}
                ></PrimaryButton>
              </Stack.Item>
            ) : (
              <></>
            )}
          </Stack>
          <RestrictedDomainsUpdatingMessage segmentId={props.segmentId} />
          {dirtyRestrictedEndpoints && dirtyRestrictedEndpoints.length > 0 && (
            <Stack data-is-scrollable='true'>
              <DetailsList
                items={dirtyRestrictedEndpoints}
                columns={props.editable ? columns : columns.slice(0, 1)}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                styles={{
                  root: {
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: 'calc(100vh - 210px)',
                  },
                }}
              />
            </Stack>
          )}
        </Stack>
      }
    </Panel>
  );
};
