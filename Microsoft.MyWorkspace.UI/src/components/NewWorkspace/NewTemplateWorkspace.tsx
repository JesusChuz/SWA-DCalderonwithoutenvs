import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pivot, PivotItem, IPivotItemProps, useTheme } from '@fluentui/react';
import { getNewAzureWorkspaceStyles } from './NewWorkspace.styles';
import { NameAndDescription } from './Steps/NameAndDescription';
import { DetailsAndFinish } from './Steps/DetailsAndFinish';
import { ChooseTemplate } from './Steps/Template/ChooseTemplate';
import { fetchCatalogTemplates } from '../../store/actions/catalogActions';
import { NewWorkspaceStep } from '../../types/enums/DeploymentStep';
import { editableWorkspaceSetCurrentWorkspaceNew } from '../../store/actions/editableWorkspaceActions';
import { WorkspaceEditType } from '../../types/enums/WorkspaceEditType';
import { MachineConfigurationList } from './Steps/MachineConfigurationList';
import { NetworkConfigurationList } from './Steps/NetworkConfigurationList';
import {
  getCatalogTemplatesLoadedFirstTime,
  getFeatureFlagTemplateQuotaAdjustment,
  getIsAtMaxWorkspaceQuota,
} from '../../store/selectors';
import { PivotStyles } from '../GeneralComponents/CommonStyles';
import { WorkspaceQuotaExceeded } from '../Pages/WorkspaceQuotaExceeded';

interface IProps {
  step: NewWorkspaceStep;
  pivotClick: (s: NewWorkspaceStep) => void;
  renderState: (
    link: IPivotItemProps,
    defaultRenderer: (link: IPivotItemProps) => JSX.Element,
    tab: NewWorkspaceStep
  ) => JSX.Element;
}

export const NewTemplateWorkspace = (props: IProps): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = getNewAzureWorkspaceStyles(theme);
  const templateQuotaAdjustmentEnabled = useSelector(
    getFeatureFlagTemplateQuotaAdjustment
  );
  const maxWorkspacesExceeded = useSelector(getIsAtMaxWorkspaceQuota);
  const templatesLoadedFirstTime = useSelector(
    getCatalogTemplatesLoadedFirstTime
  );

  React.useEffect(() => {
    dispatch(
      editableWorkspaceSetCurrentWorkspaceNew(
        WorkspaceEditType.NewTemplateWorkspace
      )
    );
  }, []);

  React.useEffect(() => {
    if (!templatesLoadedFirstTime) {
      dispatch(fetchCatalogTemplates());
    }
  }, [templatesLoadedFirstTime]);

  return (
    <>
      {/* Display the Workspace Quota exceeded page if necessary */}
      {maxWorkspacesExceeded ? (
        <WorkspaceQuotaExceeded />
      ) : (
        <Pivot
          className={styles.pivotTabs}
          aria-label='New Template Workspace Steps'
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
            headerText='1. Select Template'
            onRenderItemLink={(link, defaultRenderer) =>
              props.renderState(link, defaultRenderer, NewWorkspaceStep.Choose)
            }
            itemKey={NewWorkspaceStep.Choose.toString()}
          >
            <ChooseTemplate />
          </PivotItem>
          <PivotItem
            headerText='2. Network Overview'
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
          {templateQuotaAdjustmentEnabled && (
            <PivotItem
              headerText={'3. Configure Machines'}
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
          )}
          <PivotItem
            headerText={`${
              templateQuotaAdjustmentEnabled ? 4 : 3
            }. Name and Description`}
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
              templateQuotaAdjustmentEnabled ? 5 : 4
            }. Review and Finish`}
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
