import * as React from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import {
  DefaultButton,
  DialogFooter,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from '@fluentui/react';
import isEqual from 'lodash/isEqual';
import { TemplateCommandBarActions } from './TemplateActionButtons';
import { WorkspaceTemplateDto } from 'src/types/Catalog/WorkspaceTemplateDto.types';
import { TemplateStatusDotIcon } from './TemplateManagement.utils';
import { TemplateMachinesList } from './TemplateMachinesList';
import { useDispatch, useSelector } from 'react-redux';
import { updateTemplate } from 'src/store/actions/adminTemplateActions';
import { useIsStaleDocument } from 'src/shared/helpers/StaleDocumentsHelper';
import { ReduxAdminTemplateState } from 'src/store/reducers/adminTemplateReducer';
import { getStaleTemplates } from 'src/store/selectors/adminTemplateSelectors';
import { convertTemplateStatusToReadable } from 'src/shared/helpers/StatusHelper';
import { TemplateFailuresList } from './TemplateFailuresList';
import { getFeatureFlagTemplateDeploymentCounts } from 'src/store/selectors';

interface IProps {
  isActionsPanelOpen: boolean;
  setIsActionsPanelOpen: (isOpen: boolean) => void;
  template: WorkspaceTemplateDto;
}

export const TemplateActionsPanel = (props: IProps) => {
  const dispatch = useDispatch();
  const [editedTemplate, setEditedTemplate] =
    React.useState<WorkspaceTemplateDto>();
  const isStale = useIsStaleDocument<ReduxAdminTemplateState>(
    getStaleTemplates,
    props.template?.ID
  );

  const closePanel = (ev?: React.SyntheticEvent<HTMLElement, Event>) => {
    if (ev.nativeEvent) {
      props.setIsActionsPanelOpen(false);
    }
  };

  const featureFlagTemplateDeploymentCounts = useSelector(
    getFeatureFlagTemplateDeploymentCounts
  );

  const saveDisabled = React.useMemo(() => {
    return (
      isEqual(props.template, editedTemplate) ||
      !Boolean(editedTemplate?.Name) ||
      isStale
    );
  }, [editedTemplate]);

  const onRenderFooter = () => {
    return (
      <DialogFooter>
        <DefaultButton
          onClick={() => props.setIsActionsPanelOpen(false)}
          text='Cancel'
        />
        <PrimaryButton
          onClick={() => {
            dispatch(updateTemplate(editedTemplate));
            props.setIsActionsPanelOpen(false);
          }}
          disabled={saveDisabled}
          text='Save'
        />
      </DialogFooter>
    );
  };

  React.useEffect(() => {
    if (props.template) {
      setEditedTemplate(props.template);
    }
  }, [props.template]);

  return (
    <Panel
      isOpen={props.isActionsPanelOpen}
      onDismiss={closePanel}
      closeButtonAriaLabel='Close'
      headerText={` ${editedTemplate?.Name} - Template Properties`}
      type={PanelType.medium}
      onRenderFooterContent={onRenderFooter}
      isFooterAtBottom={true}
    >
      {editedTemplate && (
        <>
          <Stack
            verticalAlign='center'
            tokens={{ childrenGap: 4, padding: 10 }}
          >
            <Stack
              horizontal
              verticalAlign='center'
              tokens={{ childrenGap: 4 }}
            >
              <Text>Status: </Text>
              <TemplateStatusDotIcon status={editedTemplate.Status} />
              <Text>
                {convertTemplateStatusToReadable(editedTemplate.Status)}
              </Text>
            </Stack>
            {featureFlagTemplateDeploymentCounts && (
              <Text>
                Total Successful Deployments:{' '}
                {editedTemplate.TotalSuccessfulDeployments}
              </Text>
            )}
            {featureFlagTemplateDeploymentCounts && (
              <Text>
                Total Failed Deployments:{' '}
                {editedTemplate.TotalFailedDeployments}
              </Text>
            )}
          </Stack>
          <Stack horizontal>
            <TemplateCommandBarActions template={props.template} />
          </Stack>
          <TemplateFailuresList
            template={editedTemplate}
            containerStyles={{ paddingTop: 15, paddingBottom: 15 }}
          />
          <TextField
            label='Name'
            disabled={isStale}
            value={editedTemplate.Name}
            placeholder={'Template Name'}
            onChange={(e, v) =>
              setEditedTemplate((t) => {
                return { ...t, Name: v };
              })
            }
            required
            errorMessage={!editedTemplate.Name ? 'Name is required.' : ''}
          />
          <TextField
            label='Author Email'
            readOnly
            placeholder={editedTemplate.AuthorEmail}
          />
          <TextField
            label='Description'
            disabled={isStale}
            value={editedTemplate.Description}
            placeholder={'Template Description'}
            onChange={(e, v) =>
              setEditedTemplate((t) => {
                return { ...t, Description: v };
              })
            }
            multiline={true}
          />
          <TextField
            label='Post-Deployment Instructions'
            disabled={isStale}
            placeholder={'Post-Deployment Instructions'}
            value={editedTemplate.SpecialInstructions}
            onChange={(e, v) =>
              setEditedTemplate((t) => {
                return { ...t, SpecialInstructions: v };
              })
            }
            multiline={true}
          />
          <Stack style={{ marginTop: '20px' }}>
            <TemplateMachinesList template={props.template} readonly />
          </Stack>
        </>
      )}
    </Panel>
  );
};
