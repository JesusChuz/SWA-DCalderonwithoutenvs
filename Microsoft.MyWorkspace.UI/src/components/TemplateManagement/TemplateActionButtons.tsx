import * as React from 'react';
import {
  TooltipHost,
  IconButton,
  IContextualMenuItem,
  Stack,
  CommandBar,
  ICommandBarItemProps,
  ContextualMenuItemType,
} from '@fluentui/react';

import { useDispatch } from 'react-redux';

import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import { TemplateRequestStatus } from 'src/types/enums/TemplateRequestStatus';
import { showUserConfirmationDialog } from 'src/store/actions';
import {
  deleteTemplate,
  updateTemplate,
} from 'src/store/actions/adminTemplateActions';
import { getStaleTemplates } from 'src/store/selectors/adminTemplateSelectors';
import { useIsStaleDocument } from 'src/shared/helpers/StaleDocumentsHelper';
import { ReduxAdminTemplateState } from 'src/store/reducers/adminTemplateReducer';
import { TestTemplateDialog } from './TestTemplateDialog';

export interface ITemplateTooltipActions {
  template: WorkspaceTemplateDto;
  onPropertiesClick: (id: string) => void;
}

export const TemplateTooltipActions = (
  props: ITemplateTooltipActions
): JSX.Element => {
  const dispatch = useDispatch();

  const [testDialogOpen, setTestDialogOpen] = React.useState(false);

  const isStale = useIsStaleDocument<ReduxAdminTemplateState>(
    getStaleTemplates,
    props.template.ID
  );

  const actionButtonItems: IContextualMenuItem[] = React.useMemo(() => {
    const actionItems: IContextualMenuItem[] = [
      {
        key: 'properties',
        text: 'Template Properties',
        role: 'menuitem',
        disabled: isStale,
        iconProps: { iconName: 'Edit' },
        onClick: () => props.onPropertiesClick(props.template.ID),
      },
    ];

    if (props.template.Status !== TemplateRequestStatus.MarkForDeletion) {
      actionItems.unshift(
        {
          key: 'delete',
          text: 'Delete Template',
          role: 'menuitem',
          disabled:
            isStale ||
            props.template.Status === TemplateRequestStatus.Accepted ||
            props.template.Status === TemplateRequestStatus.Processing,
          iconProps: { iconName: 'Delete' },
          onClick: () => {
            dispatch(
              showUserConfirmationDialog(
                'Warning',
                'Are you sure you want to delete this template?',
                () => dispatch(deleteTemplate(props.template.ID))
              )
            );
          },
        },
        {
          key: 'divider',
          itemType: ContextualMenuItemType.Divider,
        }
      );
    }

    if (props.template.Status == TemplateRequestStatus.Published) {
      actionItems.unshift({
        key: 'unpublish',
        text: 'Unpublish Template',
        role: 'menuitem',
        disabled: isStale,
        iconProps: { iconName: 'UnpublishContent' },
        onClick: () => {
          dispatch(
            showUserConfirmationDialog(
              'Warning',
              'Are you sure you want to unpublish this template?',
              () =>
                dispatch(
                  updateTemplate({
                    ...props.template,
                    Status: TemplateRequestStatus.Unpublished,
                  })
                )
            )
          );
        },
      });
    }

    if (
      props.template.Status == TemplateRequestStatus.Draft ||
      props.template.Status == TemplateRequestStatus.Unpublished
    ) {
      const hasSuccessfulDeployment =
        props.template.TotalSuccessfulDeployments > 0;
      actionItems.unshift(
        {
          key: 'publish',
          text: 'Publish Template',
          role: 'menuitem',
          disabled: isStale || !hasSuccessfulDeployment,
          title: hasSuccessfulDeployment
            ? ''
            : 'Must have successful test deployment to publish',
          iconProps: { iconName: 'PublishContent' },
          onClick: () => {
            dispatch(
              showUserConfirmationDialog(
                'Warning',
                'Are you sure you want to publish this template? Once published, the template will be available for deployment for all users in your tenant. You or your segment admin can unpublish the template at any time.',
                () =>
                  dispatch(
                    updateTemplate({
                      ...props.template,
                      Status: TemplateRequestStatus.Published,
                    })
                  )
              )
            );
          },
        },
        {
          key: 'test',
          text: 'Test Template',
          role: 'menuitem',
          disabled: isStale,
          iconProps: { iconName: 'TestBeakerSolid' },
          onClick: () => setTestDialogOpen(true),
        }
      );
    }

    return actionItems;
  }, [isStale, props.template]);

  return (
    <>
      <TooltipHost content='Actions'>
        <IconButton
          id={props.template.ID}
          aria-label={`Template properties for ${props.template.Name}`}
          iconProps={{ iconName: 'More' }}
          onRenderMenuIcon={() => null}
          menuProps={{
            items: actionButtonItems,
          }}
        />
      </TooltipHost>
      <TestTemplateDialog
        template={props.template}
        open={testDialogOpen}
        setOpen={setTestDialogOpen}
      />
    </>
  );
};

export interface ITemplateCommandBarActions {
  template: WorkspaceTemplateDto;
}

export const TemplateCommandBarActions = (
  props: ITemplateCommandBarActions
): JSX.Element => {
  const dispatch = useDispatch();

  const [testDialogOpen, setTestDialogOpen] = React.useState(false);

  const isStale = useIsStaleDocument<ReduxAdminTemplateState>(
    getStaleTemplates,
    props.template.ID
  );

  const commandBarItems: ICommandBarItemProps[] = React.useMemo(() => {
    const items: ICommandBarItemProps[] = [];

    if (props.template.Status !== TemplateRequestStatus.MarkForDeletion) {
      items.push({
        key: 'delete',
        text: 'Delete Template',
        iconProps: { iconName: 'Delete' },
        disabled:
          isStale ||
          props.template.Status === TemplateRequestStatus.Accepted ||
          props.template.Status === TemplateRequestStatus.Processing,
        onClick: () => {
          dispatch(
            showUserConfirmationDialog(
              'Warning',
              'Are you sure you want to delete this template?',
              () => dispatch(deleteTemplate(props.template.ID))
            )
          );
        },
      });
    }

    if (props.template.Status == TemplateRequestStatus.Published) {
      items.unshift({
        key: 'unpublish',
        text: 'Unpublish Template',
        disabled: isStale,
        iconProps: { iconName: 'UnpublishContent' },
        onClick: () => {
          dispatch(
            showUserConfirmationDialog(
              'Warning',
              'Are you sure you want to unpublish this template?',
              () =>
                dispatch(
                  updateTemplate({
                    ...props.template,
                    Status: TemplateRequestStatus.Unpublished,
                  })
                )
            )
          );
        },
      });
    }

    if (
      props.template.Status == TemplateRequestStatus.Draft ||
      props.template.Status == TemplateRequestStatus.Unpublished
    ) {
      const hasSuccessfulDeployment =
        props.template.TotalSuccessfulDeployments > 0;
      items.unshift(
        {
          key: 'publish',
          text: 'Publish Template',
          disabled: isStale || !hasSuccessfulDeployment,
          title: hasSuccessfulDeployment
            ? ''
            : 'Must have successful test deployment to publish',
          iconProps: { iconName: 'PublishContent' },
          onClick: () => {
            dispatch(
              showUserConfirmationDialog(
                'Warning',
                'Are you sure you want to publish this template? Once published, the template will be available for deployment for all users in your tenant. You or your segment admin can unpublish the template at any time.',
                () =>
                  dispatch(
                    updateTemplate({
                      ...props.template,
                      Status: TemplateRequestStatus.Published,
                    })
                  )
              )
            );
          },
        },
        {
          key: 'test',
          text: 'Test Template',
          disabled: isStale,
          iconProps: { iconName: 'TestBeakerSolid' },
          onClick: () => setTestDialogOpen(true),
        }
      );
    }

    return items;
  }, [isStale, props.template]);

  return (
    <Stack horizontal>
      <CommandBar
        styles={{ root: { padding: 0 } }}
        items={commandBarItems}
        ariaLabel='Template Actions'
        primaryGroupAriaLabel='Template Actions'
        farItemsGroupAriaLabel='More Actions'
      />
      <TestTemplateDialog
        template={props.template}
        open={testDialogOpen}
        setOpen={setTestDialogOpen}
      />
    </Stack>
  );
};
