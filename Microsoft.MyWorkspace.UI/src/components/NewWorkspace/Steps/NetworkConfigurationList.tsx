import * as React from 'react';
import {
  Stack,
  DetailsListLayoutMode,
  DetailsList,
  IColumn,
  SelectionMode,
  TooltipHost,
  TextField,
  CommandBarButton,
  Checkbox,
  DefaultButton,
  Text,
  useTheme,
} from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import {
  editableWorkspaceUpdateSubnetName,
  editableWorkspaceUpdateRoutable,
  editableWorkspaceRemoveSubnet,
  editableWorkspaceAddSubnet,
} from '../../../store/actions/editableWorkspaceActions';
import {
  getEditableWorkspaceSubnets,
  getEditableWorkspaceSubnetNameErrors,
  getEditableWorkspace,
  getEditableWorkspaceEditType,
} from '../../../store/selectors/editableWorkspaceSelectors';
import {
  checkNetworksAreAtMaxQuota,
  checkNetworksAreAtMinQuota,
} from '../../../store/validators/quotaValidators';
import { AzureWorkspaceDto } from '../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { WorkspaceEditType } from '../../../types/enums/WorkspaceEditType';
import { TempSubnet } from '../../../types/Forms/TempSubnet.types';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import { getNewAzureWorkspaceStyles } from '../NewWorkspace.styles';
import { useId } from '@fluentui/react-hooks';

export const NetworkConfigurationList = (): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getNewAzureWorkspaceStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const subnets = useSelector(getEditableWorkspaceSubnets);
  const subnetErrors = useSelector(getEditableWorkspaceSubnetNameErrors);
  const editableWorkspace = useSelector(getEditableWorkspace);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const networkListId = useId('network-list-id');

  const containsPrimaryNic = (subnetName: string): boolean => {
    return (
      (editableWorkspace as AzureWorkspaceDto).VirtualMachines.findIndex(
        (m) => {
          const n = m.Nics.find((n) => n.Name === m.PrimaryNicName);
          return n.SubnetName === subnetName;
        }
      ) !== -1
    );
  };

  const networksAtMaxQuota = checkNetworksAreAtMaxQuota(
    subnets.map((v) => v.name)
  );
  const networksAtMinQuota = checkNetworksAreAtMinQuota(
    subnets.map((v) => v.name)
  );
  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Network Name',
      ariaLabel: 'Network Name',
      minWidth: 200,
      maxWidth: 400,
      onRender: (item: TempSubnet, index: number) => {
        const subnetNameError = subnetErrors.find((err) => err.index === index);
        return (
          <>
            {/* Render text box if custom, text field if template */}
            {workspaceEditType !== WorkspaceEditType.NewTemplateWorkspace && (
              <TextField
                ariaLabel={'Network name'}
                value={item.name}
                onChange={(event, newValue) => {
                  dispatch(editableWorkspaceUpdateSubnetName(index, newValue));
                }}
                errorMessage={subnetNameError ? subnetNameError.message : ''}
                maxLength={80}
                required
              />
            )}
            {workspaceEditType === WorkspaceEditType.NewTemplateWorkspace && (
              <TooltipHost content={item.name}>
                <Text
                  className={clsx(
                    styles.listPadding,
                    commonStyles.textOverflowEllipsis,
                    commonStyles.overflowXHidden
                  )}
                >
                  {item.name}
                </Text>
              </TooltipHost>
            )}
          </>
        );
      },
    },
    {
      key: 'column2',
      name: 'Routable',
      ariaLabel: 'Routable',
      minWidth: 80,
      maxWidth: 150,
      onRender: (item: TempSubnet, index: number) => {
        return (
          <>
            {workspaceEditType !== WorkspaceEditType.NewTemplateWorkspace && (
              <Checkbox
                id={`routable-check-${index}`}
                className={commonStyles.marginTop6px}
                ariaLabel={'Routable'}
                checked={item.subnet.IsRoutable}
                onChange={() =>
                  dispatch(
                    editableWorkspaceUpdateRoutable(
                      index,
                      !item.subnet.IsRoutable
                    )
                  )
                }
              />
            )}
            {workspaceEditType === WorkspaceEditType.NewTemplateWorkspace && (
              <TooltipHost content={'Cannot edit Networks in Template VMs.'}>
                <Checkbox
                  disabled={true}
                  className={commonStyles.marginTop6px}
                  ariaLabel={'Routable'}
                  checked={item.subnet.IsRoutable}
                  onChange={() =>
                    dispatch(
                      editableWorkspaceUpdateRoutable(
                        index,
                        !item.subnet.IsRoutable
                      )
                    )
                  }
                />
              </TooltipHost>
            )}
          </>
        );
      },
    },
    {
      key: 'column3',
      name: '',
      minWidth: 25,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: (item: TempSubnet, index: number) => {
        return (
          <>
            {workspaceEditType !== WorkspaceEditType.NewTemplateWorkspace && (
              <CommandBarButton
                disabled={
                  networksAtMinQuota.length > 0 || containsPrimaryNic(item.name)
                }
                ariaLabel='delete network'
                iconProps={{
                  iconName: 'Delete',
                }}
                className={commonStyles.transparentBackground}
                style={{ height: '100%', float: 'right' }}
                onClick={() => dispatch(editableWorkspaceRemoveSubnet(index))}
              />
            )}
            {workspaceEditType === WorkspaceEditType.NewTemplateWorkspace && (
              <TooltipHost
                content={'Cannot delete Networks from Template VMs.'}
              >
                <CommandBarButton
                  disabled={true}
                  ariaLabel='delete network'
                  iconProps={{
                    iconName: 'Delete',
                  }}
                  className={commonStyles.transparentBackground}
                  style={{ height: '100%', float: 'right' }}
                  onClick={() => dispatch(editableWorkspaceRemoveSubnet(index))}
                />
              </TooltipHost>
            )}
          </>
        );
      },
    },
  ];

  React.useEffect(() => {
    const list = document.getElementsByClassName(networkListId)[0];
    const firstColumnHeader: HTMLElement = list?.querySelector(
      'div[role="columnheader"]'
    );
    firstColumnHeader?.focus();
  }, []);

  return (
    <>
      {workspaceEditType !== WorkspaceEditType.NewTemplateWorkspace && (
        <div
          data-custom-parent-group='group1'
          data-custom-parentid={`${workspaceEditType} Workspace - Network Configuration`}
        >
          <Stack
            style={{ maxWidth: 1200, paddingTop: '10px' }}
            horizontal
            horizontalAlign='space-between'
            verticalAlign='center'
          >
            <Stack.Item>
              <div>
                <TooltipHost content={networksAtMaxQuota}>
                  {
                    <DefaultButton
                      iconProps={{ iconName: 'Add' }}
                      text='Add Network'
                      onClick={() => dispatch(editableWorkspaceAddSubnet())}
                      disabled={networksAtMaxQuota.length > 0}
                    />
                  }
                </TooltipHost>
              </div>
            </Stack.Item>
          </Stack>
          <Stack style={{ maxWidth: 1200 }}>
            <DetailsList
              className={networkListId}
              items={subnets}
              columns={columns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </div>
      )}
      {workspaceEditType === WorkspaceEditType.NewTemplateWorkspace && (
        <div
          data-custom-parent-group='group1'
          data-custom-parentid={`${workspaceEditType} Workspace - Network Configuration`}
        >
          <Stack
            style={{ maxWidth: 1200, paddingTop: '10px' }}
            horizontal
            horizontalAlign='space-between'
            verticalAlign='center'
          ></Stack>
          <Stack style={{ maxWidth: 1200 }}>
            <DetailsList
              className={networkListId}
              items={subnets}
              columns={columns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
            />
          </Stack>
        </div>
      )}
    </>
  );
};
