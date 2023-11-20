import {
  Checkbox,
  DefaultButton,
  Label,
  Panel,
  PanelType,
  PrimaryButton,
  Stack,
  TextField,
  useTheme,
} from '@fluentui/react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editableWorkspaceUpdateSubnet } from '../../../../../store/actions/editableWorkspaceActions';
import {
  getCatalogUserProfile,
  getFeatureFlagMultipleSubnetPostDeployment,
} from '../../../../../store/selectors';
import {
  getEditableWorkspace,
  getEditableWorkspaceOriginalWorkspace,
  getEditableWorkspaceSubnets,
} from '../../../../../store/selectors/editableWorkspaceSelectors';
import { workspaceValidateSubnetNames } from '../../../../../store/validators/workspaceValidators';
import { AzureWorkspaceDto } from '../../../../../types/AzureWorkspace/AzureWorkspaceDto.types';
import { TempSubnet } from '../../../../../types/Forms/TempSubnet.types';
import { getCommonStyles } from '../../../../GeneralComponents/CommonStyles';
import { EditsDisabled } from '../../../../../shared/helpers/WorkspaceHelper';

interface IProps {
  openSubnetIndex: number;
  dismissPanel: () => void;
}

export const SubnetPropertiesPanel = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const subnets = useSelector(getEditableWorkspaceSubnets);
  const postDeploymentMultiSubnetFeatureFlag = useSelector(
    getFeatureFlagMultipleSubnetPostDeployment
  );
  const editableWorkspace = useSelector(
    getEditableWorkspace
  ) as AzureWorkspaceDto;
  const originalWorkspace = useSelector(
    getEditableWorkspaceOriginalWorkspace
  ) as AzureWorkspaceDto;
  const userProfile = useSelector(getCatalogUserProfile);
  const [subnet, setSubnet] = React.useState<TempSubnet>(null);
  const originalSubnet = React.useMemo(() => {
    return props.openSubnetIndex >= 0 ? subnets[props.openSubnetIndex] : null;
  }, [subnets, props.openSubnetIndex]);

  React.useEffect(() => {
    setSubnet(
      props.openSubnetIndex >= 0
        ? cloneDeep(subnets[props.openSubnetIndex])
        : null
    );
  }, [props.openSubnetIndex, subnets]);

  const changes = React.useMemo(() => {
    return !isEqual(originalSubnet, subnet);
  }, [originalSubnet, subnet]);

  const subnetError = React.useMemo(() => {
    if (props.openSubnetIndex === -1 || !subnet) {
      return null;
    }
    const subnetErrors = workspaceValidateSubnetNames(
      subnets.map((s, index) => {
        return index === props.openSubnetIndex ? subnet.name : s.name;
      })
    );
    return subnetErrors.length > 0 ? subnetErrors[0] : null;
  }, [subnets, subnet, props.openSubnetIndex]);

  const onRenderFooterContent = React.useCallback(
    () => (
      <Stack>
        {!postDeploymentMultiSubnetFeatureFlag && (
          <p className={commonStyles.errorTextBold}>
            Post deployment subnet editing is currently disabled
          </p>
        )}
        <Stack horizontal>
          <DefaultButton
            className={commonStyles.flexItem}
            style={{ alignSelf: 'flex-end' }}
            text='Cancel'
            allowDisabledFocus
            disabled={!postDeploymentMultiSubnetFeatureFlag || !changes}
            onClick={() => {
              props.dismissPanel();
            }}
          />
          <PrimaryButton
            className={commonStyles.flexItem}
            text='Save'
            allowDisabledFocus
            disabled={
              !postDeploymentMultiSubnetFeatureFlag || !changes || !!subnetError
            }
            onClick={() => {
              dispatch(
                editableWorkspaceUpdateSubnet(props.openSubnetIndex, subnet)
              );
              props.dismissPanel();
            }}
          />
        </Stack>
      </Stack>
    ),
    [changes, subnet, subnetError, postDeploymentMultiSubnetFeatureFlag]
  );

  return (
    <Panel
      isOpen={props.openSubnetIndex !== -1}
      onDismiss={props.dismissPanel}
      headerText={'Edit Network'}
      type={PanelType.medium}
      isFooterAtBottom={true}
      closeButtonAriaLabel='close panel'
      onRenderFooterContent={onRenderFooterContent}
    >
      {subnet && (
        <Stack>
          <TextField
            value={subnet.name}
            className={`${commonStyles.textFieldSpacing} ${commonStyles.halfWidth}`}
            label={'Name'}
            onChange={(event, newValue) =>
              setSubnet({
                ...subnet,
                name: newValue,
              })
            }
            errorMessage={subnetError ? subnetError.message : ''}
            disabled={
              !postDeploymentMultiSubnetFeatureFlag ||
              EditsDisabled(userProfile, editableWorkspace, originalWorkspace)
            }
          />
          <Label id='subnet-routable-label'>Routable</Label>
          <Checkbox
            checked={subnet.subnet.IsRoutable}
            className={commonStyles.textFieldSpacing}
            ariaLabelledBy='subnet-routable-label'
            onChange={(event, newValue) =>
              setSubnet({
                ...subnet,
                subnet: { ...subnet.subnet, IsRoutable: newValue },
              })
            }
            disabled={
              !postDeploymentMultiSubnetFeatureFlag ||
              EditsDisabled(userProfile, editableWorkspace, originalWorkspace)
            }
          />
        </Stack>
      )}
    </Panel>
  );
};
