import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pivot, PivotItem, IPivotItemProps, useTheme } from '@fluentui/react';
import { getNewAzureWorkspaceStyles } from './NewWorkspace.styles';
import { NameAndDescription } from './Steps/NameAndDescription';
import { DetailsAndFinish } from './Steps/DetailsAndFinish';
import { fetchCatalogMachines } from '../../store/actions/catalogActions';
import { ChooseMachines } from './Steps/Custom/ChooseMachines';
import { NetworkConfigurationList } from './Steps/NetworkConfigurationList';
import { NewWorkspaceStep } from '../../types/enums/DeploymentStep';
import { MachineConfigurationList } from './Steps/MachineConfigurationList';
import { editableWorkspaceSetCurrentWorkspaceNew } from '../../store/actions/editableWorkspaceActions';
import {
  getCatalogMachinesLoadedFirstTime,
  getFeatureFlagMultipleSubnet,
  getIsAtMaxWorkspaceQuota,
} from '../../store/selectors';
import { WorkspaceEditType } from '../../types/enums/WorkspaceEditType';
import { PivotStyles } from '../GeneralComponents/CommonStyles';
import { WorkspaceQuotaExceeded } from '../Pages/WorkspaceQuotaExceeded';
import { getEditableWorkspaceEditType } from '../../store/selectors/editableWorkspaceSelectors';

interface IProps {
  step: NewWorkspaceStep;
  pivotClick: (s: NewWorkspaceStep) => void;
  renderState: (
    link: IPivotItemProps,
    defaultRenderer: (link: IPivotItemProps) => JSX.Element,
    tab: NewWorkspaceStep
  ) => JSX.Element;
}

export const NewCustomWorkspace = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getNewAzureWorkspaceStyles(theme);
  const multiSubnetFeature = useSelector(getFeatureFlagMultipleSubnet);
  const maxWorkspacesExceeded = useSelector(getIsAtMaxWorkspaceQuota);
  const workspaceEditType = useSelector(getEditableWorkspaceEditType);
  const machinesLoadedFirstTime = useSelector(
    getCatalogMachinesLoadedFirstTime
  );

  React.useEffect(() => {
    dispatch(
      editableWorkspaceSetCurrentWorkspaceNew(
        WorkspaceEditType.NewCustomWorkspace
      )
    );
  }, []);

  React.useEffect(() => {
    if (!machinesLoadedFirstTime) {
      dispatch(fetchCatalogMachines());
    }
  }, [machinesLoadedFirstTime]);

  return (
    <>
      {/* Display the Workspace Quota exceeded page if necessary */}
      {maxWorkspacesExceeded &&
      workspaceEditType !== WorkspaceEditType.EditWorkspace ? (
        <WorkspaceQuotaExceeded />
      ) : (
        <Pivot
          className={styles.pivotTabs}
          aria-label='New Custom Workspace Steps'
          selectedKey={props.step.toString()}
          styles={{
            ...PivotStyles.ItemContainerOverflow,
            ...PivotStyles.TabPadding,
          }}
          onLinkClick={(item?: PivotItem) =>
            props.pivotClick(Number(item.props.itemKey))
          }
          overflowBehavior={'menu'}
          overflowAriaLabel={'More Steps'}
        >
          <PivotItem
            headerText='1. Select Machines'
            onRenderItemLink={(link, defaultRenderer) =>
              props.renderState(link, defaultRenderer, NewWorkspaceStep.Choose)
            }
            itemKey={NewWorkspaceStep.Choose.toString()}
          >
            <ChooseMachines />
          </PivotItem>
          {multiSubnetFeature && (
            <PivotItem
              headerText='2. Configure Networks'
              onRenderItemLink={(link, defaultRenderer) =>
                props.renderState(
                  link,
                  defaultRenderer,
                  NewWorkspaceStep.ConfigureNetworks
                )
              }
              itemKey={NewWorkspaceStep.ConfigureNetworks.toString()}
            >
              <NetworkConfigurationList />
            </PivotItem>
          )}
          <PivotItem
            headerText={`${
              multiSubnetFeature ? '3. ' : '2. '
            }Configure Machines`}
            onRenderItemLink={(link, defaultRenderer) =>
              props.renderState(
                link,
                defaultRenderer,
                NewWorkspaceStep.ConfigureMachines
              )
            }
            itemKey={NewWorkspaceStep.ConfigureMachines.toString()}
          >
            <MachineConfigurationList />
          </PivotItem>
          <PivotItem
            headerText={`${
              multiSubnetFeature ? '4. ' : '3. '
            }Name and Description`}
            onRenderItemLink={(link, defaultRenderer) =>
              props.renderState(
                link,
                defaultRenderer,
                NewWorkspaceStep.NameAndDescription
              )
            }
            itemKey={NewWorkspaceStep.NameAndDescription.toString()}
          >
            <NameAndDescription />
          </PivotItem>
          <PivotItem
            headerText={`${
              multiSubnetFeature ? '5. ' : '4. '
            }Review and Finish`}
            onRenderItemLink={(link, defaultRenderer) =>
              props.renderState(
                link,
                defaultRenderer,
                NewWorkspaceStep.DetailsAndFinish
              )
            }
            itemKey={NewWorkspaceStep.DetailsAndFinish.toString()}
          >
            <DetailsAndFinish />
          </PivotItem>
        </Pivot>
      )}
    </>
  );
};
