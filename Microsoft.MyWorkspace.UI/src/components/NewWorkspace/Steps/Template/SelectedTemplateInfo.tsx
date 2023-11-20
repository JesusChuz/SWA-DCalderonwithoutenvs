import * as React from 'react';
import { Stack, useTheme, Link, DefaultButton, Label } from '@fluentui/react';
import { getCommonStyles } from 'src/components/GeneralComponents/CommonStyles';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import clsx from 'clsx';
import { FormattedHTMLString } from 'src/components/GeneralComponents/FormattedHTMLString';
import { getFormattedDateTime } from 'src/shared/DateTimeHelpers';
import { HandleLinks } from 'src/components/GeneralComponents/HandleLinks';
import { useSelector } from 'react-redux';
import { getFeatureFlagTemplateDeploymentCounts } from 'src/store/selectors';

interface IProps {
  template: WorkspaceTemplateDto;
  openedTemplateDetailsPanel: boolean;
  dismissPanel: () => void;
  openPanel: () => void;
}

export const SelectedTemplateInfo = (props: IProps) => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const featureFlagTemplateDeploymentCounts = useSelector(
    getFeatureFlagTemplateDeploymentCounts
  );

  return props.template ? (
    <Stack
      data-testid='selected-template-info'
      className={clsx(commonStyles.fullWidth, commonStyles.fullHeight)}
    >
      <Stack
        className={commonStyles.fullWidth}
        style={{ marginBottom: '29px' }}
      >
        <Stack
          horizontal
          horizontalAlign='space-between'
          verticalAlign='center'
          className={commonStyles.fullWidth}
        >
          <h3>Selected Template</h3>
          <DefaultButton
            iconProps={{ iconName: 'Info' }}
            onClick={() => props.openPanel()}
          >
            View Details
          </DefaultButton>
        </Stack>
        <Stack horizontal className={commonStyles.fullWidth}>
          <Label
            htmlFor='template-details-name'
            className={commonStyles.marginBottom4}
          >
            Name
          </Label>
        </Stack>
        <Stack
          horizontal
          className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
          id='template-details-name'
        >
          {props.template.Name}
        </Stack>
        {props.template.AuthorEmail && (
          <>
            <Stack horizontal className={commonStyles.fullWidth}>
              <Label
                htmlFor='template-details-author'
                className={commonStyles.marginBottom4}
              >
                Author
              </Label>
            </Stack>
            <Stack
              horizontal
              className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
            >
              <Link
                id='template-details-author'
                href={`mailto:${props.template.AuthorEmail}`}
              >
                {props.template.AuthorEmail}
              </Link>
            </Stack>
          </>
        )}
        {props.template.CreatedDate && (
          <>
            <Stack horizontal className={commonStyles.fullWidth}>
              <Label
                htmlFor='template-details-created'
                className={commonStyles.marginBottom4}
              >
                Created
              </Label>
            </Stack>
            <Stack
              horizontal
              className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
              id='template-details-created'
            >
              {getFormattedDateTime(props.template.CreatedDate)}
            </Stack>
          </>
        )}
        {featureFlagTemplateDeploymentCounts &&
          props.template.TotalSuccessfulDeployments && (
            <>
              <Stack horizontal className={commonStyles.fullWidth}>
                <Label
                  htmlFor='template-details-total-deployments'
                  className={commonStyles.marginBottom4}
                >
                  Total Deployments
                </Label>
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
              <Label
                htmlFor='template-details-description'
                className={commonStyles.marginBottom4}
              >
                Description
              </Label>
            </Stack>
            <Stack
              horizontal
              className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
              id='template-details-description'
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
              <Label
                htmlFor='template-details-post-deployment'
                className={commonStyles.marginBottom4}
              >
                Post-Deployment Instructions
              </Label>
            </Stack>
            <Stack
              horizontal
              className={`${commonStyles.fullWidth} ${commonStyles.leftAlignText}`}
              id='template-details-post-deployment'
            >
              <FormattedHTMLString text={props.template.SpecialInstructions} />
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  ) : (
    <></>
  );
};
