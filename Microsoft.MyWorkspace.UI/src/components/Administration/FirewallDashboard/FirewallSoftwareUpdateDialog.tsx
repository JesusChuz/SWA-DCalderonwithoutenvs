import * as React from 'react';
import {
  PrimaryButton,
  useTheme,
  Dialog,
  DialogFooter,
  ContextualMenu,
  DialogType,
  Dropdown,
  IDropdownOption,
  DefaultButton,
  List,
  Text,
  IDialogContentProps,
  Spinner,
  SpinnerSize,
} from '@fluentui/react';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { FirewallHubNetworkInfoDto } from '../../../types/FirewallManager/FirewallHubNetworkInfoDto';
import {
  fetchFirewallSoftwareVersions,
  initiateSoftwareUpdate,
} from '../../../store/actions/adminFirewallActions';
import {
  getSoftwareVersions,
  isFirewallSoftwareVersionsLoading,
  isSoftwareUpdateWorkCreating,
} from '../../../store/selectors';

interface IProps {
  hideDialog: boolean;
  firewalls: FirewallHubNetworkInfoDto[];
  onDismiss: () => void;
}

export const FirewallSoftwareUpdateDialog = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedSoftwareVersion, setSelectedSoftwareVersion] =
    React.useState('None');
  const softwareVersions: string[] = useSelector(getSoftwareVersions);
  const isSoftwareVersionsLoading: boolean = useSelector(
    isFirewallSoftwareVersionsLoading
  );
  const creatingSoftwareUpdateWork: boolean = useSelector(
    isSoftwareUpdateWorkCreating
  );

  const dialogStyles = { main: { maxWidth: 700 } };
  const commonStyles = getCommonStyles(theme);
  const dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    keepInBounds: true,
  };
  const dialogContentProps: IDialogContentProps = {
    type: DialogType.normal,
    title: `Software Update`,
    closeButtonAriaLabel: 'Close',
    subText: `The following firewalls will be updated with the selected software version.`,
  };
  const [isDraggable] = useBoolean(false);
  const labelId: string = useId('dialogLabel');
  const subTextId: string = useId('subTextLabel');
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: dialogStyles,
      dragOptions: isDraggable ? dragOptions : undefined,
    }),
    [isDraggable, labelId, subTextId]
  );

  const softwareVersionOptions = React.useMemo(() => {
    return softwareVersions.map((r) => ({ key: r, text: r }));
  }, [softwareVersions]);

  const renderListItem = (
    item: FirewallHubNetworkInfoDto,
    index: number | undefined
  ): JSX.Element => {
    return (
      <div className={commonStyles.basicListStyle}>
        <Text>{item.FirewallSettings.Name}</Text>
      </div>
    );
  };

  // Lifecycle operations
  const softwareVersionError = React.useMemo(() => {
    if (selectedSoftwareVersion === 'None') {
      return 'Please select a software version.';
    }
    return '';
  }, [selectedSoftwareVersion]);

  // onClick operations
  const submitSoftwareUpdate = async () => {
    const firewallIds: string[] = props.firewalls
      .filter(
        (f) => f.FirewallSettings.SoftwareVersion != selectedSoftwareVersion
      )
      .map((f) => f.FirewallSettings.ID);
    await dispatch(
      initiateSoftwareUpdate(selectedSoftwareVersion, firewallIds)
    );
    setSelectedSoftwareVersion('None');
    props.onDismiss();
  };

  // Lifecycle operations
  React.useEffect(() => {
    dispatch(fetchFirewallSoftwareVersions());
  }, []);

  return (
    <>
      <Dialog
        hidden={props.hideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modalProps}
      >
        <Dropdown
          disabled={isSoftwareVersionsLoading}
          selectedKey={selectedSoftwareVersion}
          label='Software Versions'
          placeholder='None'
          onChange={(
            event: React.FormEvent<HTMLDivElement>,
            item: IDropdownOption
          ) => {
            setSelectedSoftwareVersion(item.text);
          }}
          options={softwareVersionOptions}
          ariaLabel='Select Software Version'
          errorMessage={softwareVersionError}
        />
        <div className={commonStyles.marginTop16}>
          <Text className={commonStyles.errorText}>
            This operation is irreversible. The firewalls below will go offline
            while the software update is applied.
          </Text>
        </div>
        <div
          className={`${commonStyles.minHeight250} ${commonStyles.marginTop16}`}
          style={{ overflow: 'auto' }}
        >
          {creatingSoftwareUpdateWork ? (
            <Spinner
              size={SpinnerSize.large}
              className={commonStyles.loading}
            />
          ) : (
            <List items={props.firewalls} onRenderCell={renderListItem} />
          )}
        </div>
        <DialogFooter>
          <PrimaryButton
            disabled={
              selectedSoftwareVersion === 'None' ||
              isSoftwareVersionsLoading ||
              creatingSoftwareUpdateWork
            }
            onClick={submitSoftwareUpdate}
            text={'Submit'}
          />
          <DefaultButton onClick={props.onDismiss} text={'Cancel'} />
        </DialogFooter>
      </Dialog>
    </>
  );
};
