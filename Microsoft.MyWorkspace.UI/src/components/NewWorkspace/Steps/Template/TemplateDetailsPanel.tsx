import {
  Link,
  Panel,
  PanelType,
  Stack,
  useTheme,
  Pivot,
  PivotItem,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';
import * as React from 'react';
import { WorkspaceTemplateDto } from '../../../../types/Catalog/WorkspaceTemplateDto.types';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import clsx from 'clsx';
import { getFormattedDateTime } from 'src/shared/DateTimeHelpers';
import { FormattedHTMLString } from 'src/components/GeneralComponents/FormattedHTMLString';
import { TemplateMachinesList } from 'src/components/TemplateManagement/TemplateMachinesList';
import {
  PivotStyles,
  getCommonStyles,
} from 'src/components/GeneralComponents/CommonStyles';
import { getNewAzureWorkspaceStyles } from '../../NewWorkspace.styles';
import { getTemplateQuotaErrorMessage } from 'src/store/validators/quotaValidators';
import { VirtualMachineSkuDto } from 'src/types/Catalog/VirtualMachineSkuDto.types';
import { getCatalogMachineSkus } from 'src/store/selectors/catalogSelectors';
import {
  getFeatureFlagTemplateDeploymentCounts,
  getUserRoleAssignmentConstraint,
} from 'src/store/selectors';
import { useSelector } from 'react-redux';
import { TemplateIPMessageBar } from './TemplateIPMessageBar';
import { HandleLinks } from 'src/components/GeneralComponents/HandleLinks';

interface IProps {
  openTemplateDetailsPanel: boolean;
  dismissPanel: () => void;
  template: WorkspaceTemplateDto;
}

export const TemplateDetailsPanel = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const styles = getNewAzureWorkspaceStyles(theme);
  const commonStyles = getCommonStyles(theme);
  const isScreenMobileOrTabletSized = useMediaQuery('(max-width: 1200px)');
  const skus: VirtualMachineSkuDto[] = useSelector(getCatalogMachineSkus);
  const userRoleAssignmentConstraint = useSelector(
    getUserRoleAssignmentConstraint
  );
  const quotaError = getTemplateQuotaErrorMessage(
    props.template.VirtualMachines,
    skus,
    userRoleAssignmentConstraint
  );
  const featureFlagTemplateDeploymentCounts = useSelector(
    getFeatureFlagTemplateDeploymentCounts
  );

  return (
    <Panel
      isLightDismiss
      isOpen={props.openTemplateDetailsPanel}
      type={
        isScreenMobileOrTabletSized ? PanelType.smallFluid : PanelType.large
      }
      onDismiss={() => props.dismissPanel()}
      closeButtonAriaLabel='close panel'
      title='Template Details Panel'
      headerText='Template Details'
      headerClassName={styles.pivotTabs}
    >
      <Pivot
        className={styles.pivotTabs}
        aria-label='Template Details Pivot'
        styles={{
          ...PivotStyles.ItemContainerOverflow,
          ...PivotStyles.TabPadding,
        }}
      >
        <PivotItem headerText='General' itemKey='generalDetails'>
          <Stack
            className={clsx(commonStyles.fullWidth, commonStyles.fullHeight)}
          >
            <Stack
              className={commonStyles.fullWidth}
              style={{ marginBottom: '29px' }}
            >
              {quotaError && (
                <Stack>
                  <Stack.Item style={{ marginTop: '16px' }}>
                    <MessageBar
                      messageBarType={MessageBarType.blocked}
                      isMultiline={true}
                    >
                      You cannot deploy this template because workspace
                      specifications exceed the following quota constraints:
                      <ul>
                        <li>{quotaError}</li>
                      </ul>
                      You can request an increase in your quota by contacting
                      your segment lead.
                    </MessageBar>
                  </Stack.Item>
                </Stack>
              )}
              <TemplateIPMessageBar />
              <Stack horizontal className={commonStyles.fullWidth}>
                <h4 className={commonStyles.marginBottom4}>Name</h4>
              </Stack>
              <Stack
                horizontal
                className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
              >
                {props.template.Name}
              </Stack>
              {props.template.AuthorEmail && (
                <>
                  <Stack horizontal className={commonStyles.fullWidth}>
                    <h4 className={commonStyles.marginBottom4}>Author</h4>
                  </Stack>
                  <Stack
                    horizontal
                    className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
                  >
                    <Link href={`mailto:${props.template.AuthorEmail}`}>
                      {props.template.AuthorEmail}
                    </Link>
                  </Stack>
                </>
              )}
              {props.template.CreatedDate && (
                <>
                  <Stack horizontal className={commonStyles.fullWidth}>
                    <h4 className={commonStyles.marginBottom4}>Created</h4>
                  </Stack>
                  <Stack
                    horizontal
                    className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
                  >
                    {getFormattedDateTime(props.template.CreatedDate)}
                  </Stack>
                </>
              )}
              {featureFlagTemplateDeploymentCounts &&
                props.template.TotalSuccessfulDeployments && (
                  <>
                    <Stack horizontal className={commonStyles.fullWidth}>
                      <h4 className={commonStyles.marginBottom4}>
                        Total Deployments
                      </h4>
                    </Stack>
                    <Stack
                      horizontal
                      className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
                    >
                      {props.template.TotalSuccessfulDeployments}
                    </Stack>
                  </>
                )}
              {props.template.Description && (
                <>
                  <Stack
                    horizontal
                    className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
                  >
                    <h4 className={commonStyles.marginBottom4}>Description</h4>
                  </Stack>
                  <Stack
                    horizontal
                    className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
                  >
                    <HandleLinks
                      textToParse={props.template.Description}
                    ></HandleLinks>
                  </Stack>
                </>
              )}
              {props.template.SpecialInstructions && (
                <>
                  <Stack
                    horizontal
                    className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
                  >
                    <h4 className={commonStyles.marginBottom4}>
                      Post-Deployment Instructions
                    </h4>
                  </Stack>
                  <Stack
                    horizontal
                    className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
                  >
                    <FormattedHTMLString
                      text={props.template.SpecialInstructions}
                    />
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
        </PivotItem>
        <PivotItem headerText='Machines' itemKey='machineDetails'>
          <Stack
            className={clsx(commonStyles.fullWidth, commonStyles.fullHeight)}
          >
            <Stack
              className={commonStyles.fullWidth}
              style={{ marginBottom: '29px' }}
            >
              <Stack style={{ marginTop: '20px' }}>
                <TemplateMachinesList template={props.template} readonly />
              </Stack>
            </Stack>
          </Stack>
        </PivotItem>
      </Pivot>
    </Panel>
  );
};
