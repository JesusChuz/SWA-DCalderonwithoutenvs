import {
  CommandBarButton,
  DetailsList,
  IColumn,
  PrimaryButton,
  SelectionMode,
  Stack,
  Text,
  TextField,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  editableWorkspaceRemoveSubnet,
  editableWorkspaceAddSubnet,
} from '../../../../store/actions/editableWorkspaceActions';
import {
  getCatalogUserProfile,
  getFeatureFlagMultipleSubnetPostDeployment,
} from '../../../../store/selectors';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
  getEditableWorkspaceSubnets,
} from '../../../../store/selectors/editableWorkspaceSelectors';
import {
  checkNetworksAreAtMaxQuota,
  checkNetworksAreAtMinQuota,
} from '../../../../store/validators/quotaValidators';
import { NicMachinePair } from '../../../../types/Forms/NicMachinePair.types';
import { AzureWorkspaceDto } from '../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { TempSubnet } from '../../../../types/Forms/TempSubnet.types';
import { getCommonStyles } from '../../../GeneralComponents/CommonStyles';
import { EditsDisabled } from '../../../../shared/helpers/WorkspaceHelper';
import { SubnetPropertiesPanel } from './NetworkConfigurationComponents/SubnetPropertiesPanel';
import { getWorkspacePropertiesStyles } from './WorkspaceProperties.styles';
import { AzureVirtualMachineDto } from '../../../../types/AzureWorkspace/AzureVirtualMachineDto.types';

export const NetworkConfigurationPanel = (): JSX.Element => {
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
  const userProfile = useSelector(getCatalogUserProfile);
  const subnets = useSelector(getEditableWorkspaceSubnets);
  const postDeploymentMultiSubnetFeatureFlag = useSelector(
    getFeatureFlagMultipleSubnetPostDeployment
  );

  const [openSubnetIndex, setOpenSubnetIndex] = React.useState(-1);

  const networksAtMaxQuota = checkNetworksAreAtMaxQuota(
    subnets.map((v) => v.name)
  );

  const networksAtMinQuota = checkNetworksAreAtMinQuota(
    subnets.map((v) => v.name)
  );

  const nicMachineList = React.useMemo(() => {
    const nicMachineList: NicMachinePair[] = [];
    editableWorkspace.VirtualMachines.forEach((m: AzureVirtualMachineDto) => {
      m.Nics.map((n) => {
        nicMachineList.push({ machine: m, nic: n });
      });
    });
    return nicMachineList;
  }, [editableWorkspace.VirtualMachines]);

  const containsPrimaryNic = (subnetName: string): boolean => {
    return (
      nicMachineList.findIndex(
        (pair) =>
          pair.nic.SubnetName === subnetName &&
          pair.machine.PrimaryNicName === pair.nic.Name
      ) !== -1
    );
  };

  const columns: IColumn[] = [
    {
      key: 'virtualMachine',
      name: 'Virtual Machine',
      ariaLabel: 'Virtual Machine',
      minWidth: 150,
      maxWidth: 250,
      onRender: (item: NicMachinePair) => {
        return <Text>{item.machine.ComputerName}</Text>;
      },
    },
    {
      key: 'nic',
      name: 'NIC',
      ariaLabel: 'NIC',
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: NicMachinePair) => {
        return <Text>{item.nic.Name}</Text>;
      },
    },
  ];

  const renderSubnetTitleRow = (subnet: TempSubnet, subnetIndex: number) => {
    const subnetName = subnet.name;
    return (
      <Stack
        horizontal
        horizontalAlign={'space-between'}
        verticalAlign={'center'}
        className={styles.paddingTop20}
      >
        <Stack.Item>
          <Text style={{ fontWeight: 'bold' }}>{subnetName}</Text>
        </Stack.Item>
        <Stack.Item>
          {postDeploymentMultiSubnetFeatureFlag && (
            <CommandBarButton
              disabled={
                containsPrimaryNic(subnetName) ||
                networksAtMinQuota.length > 0 ||
                !postDeploymentMultiSubnetFeatureFlag ||
                EditsDisabled(userProfile, editableWorkspace, originalWorkspace)
              }
              ariaLabel='delete network'
              iconProps={{
                iconName: 'Delete',
              }}
              style={{ height: '32px', float: 'right' }}
              onClick={() =>
                dispatch(editableWorkspaceRemoveSubnet(subnetIndex))
              }
            />
          )}

          <CommandBarButton
            ariaLabel='edit network'
            iconProps={{
              iconName: 'Edit',
            }}
            style={{ height: '32px', float: 'right' }}
            onClick={() => setOpenSubnetIndex(subnetIndex)}
          />
        </Stack.Item>
      </Stack>
    );
  };

  const renderMachineNicList = (subnet: TempSubnet) => {
    const filteredNicMachineList = nicMachineList.filter(
      (pair) => pair.nic.SubnetName === subnet.name
    );
    return filteredNicMachineList.length > 0 ? (
      <DetailsList
        styles={{
          focusZone: {
            styles: { paddingTop: 0 },
          },
        }}
        compact
        items={filteredNicMachineList}
        columns={columns}
        selectionMode={SelectionMode.none}
      />
    ) : (
      <Text
        className={`${styles.paddingTop20} ${commonStyles.italicFont} ${commonStyles.paddingLeft8}`}
      >{`No Machines in ${subnet.name}`}</Text>
    );
  };

  const renderAddressSpace = (subnet: TempSubnet) => {
    let usableAddressSpaceMessage = '';
    let reservedAddressSpaceMessage = '';
    if (subnet && subnet.subnet && subnet.subnet.AddressSpace) {
      const addressSpacePrefix = subnet.subnet.AddressSpace.substring(
        0,
        subnet.subnet.AddressSpace.lastIndexOf('.')
      );
      usableAddressSpaceMessage = `Usable IPs: ${addressSpacePrefix}.4-${addressSpacePrefix}.31`;
      reservedAddressSpaceMessage = `Reserved by Azure: ${addressSpacePrefix}.0-${addressSpacePrefix}.3, ${addressSpacePrefix}.32`;
    }
    return subnet.subnet.AddressSpace ? (
      <Stack horizontal horizontalAlign='start' verticalAlign='end'>
        <TextField
          className={`${commonStyles.marginRight8} ${commonStyles.width33}`}
          value={subnet.subnet.AddressSpace}
          label={'Address Space'}
          readOnly
          disabled={
            !postDeploymentMultiSubnetFeatureFlag ||
            EditsDisabled(userProfile, editableWorkspace, originalWorkspace)
          }
        />
        <Stack>
          <Text>{usableAddressSpaceMessage}</Text>
          <Text>{reservedAddressSpaceMessage}</Text>
        </Stack>
      </Stack>
    ) : (
      <></>
    );
  };

  return (
    <Stack
      className={`${styles.propertiesContent} ${commonStyles.overflowYAuto}`}
    >
      <Stack
        style={{ maxWidth: 1200, paddingTop: '10px' }}
        horizontal
        horizontalAlign='space-between'
        verticalAlign='center'
      >
        <Stack.Item>
          <Stack horizontal verticalAlign='center'>
            <h3 className={commonStyles.margin0}>Networks</h3>
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <div>
            <TooltipHost content={networksAtMaxQuota}>
              {postDeploymentMultiSubnetFeatureFlag && (
                <PrimaryButton
                  iconProps={{ iconName: 'Add' }}
                  text='Add Network'
                  onClick={() => dispatch(editableWorkspaceAddSubnet())}
                  disabled={
                    networksAtMaxQuota.length > 0 ||
                    EditsDisabled(
                      userProfile,
                      editableWorkspace,
                      originalWorkspace
                    )
                  }
                />
              )}
            </TooltipHost>
          </div>
        </Stack.Item>
      </Stack>
      <Stack style={{ maxWidth: 1200, width: '100%' }}>
        {subnets.map((subnet, index) => (
          <div key={subnet.name}>
            {renderSubnetTitleRow(subnet, index)}
            {renderAddressSpace(subnet)}
            {renderMachineNicList(subnet)}
          </div>
        ))}
      </Stack>
      <SubnetPropertiesPanel
        openSubnetIndex={openSubnetIndex}
        dismissPanel={() => setOpenSubnetIndex(-1)}
      />
    </Stack>
  );
};
