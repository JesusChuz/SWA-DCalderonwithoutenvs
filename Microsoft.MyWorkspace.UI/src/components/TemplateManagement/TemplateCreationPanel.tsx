import * as React from 'react';
import {
  Panel,
  PanelType,
  DefaultButton,
  DialogFooter,
  PrimaryButton,
  Stack,
  TextField,
} from '@fluentui/react';
import { AzureWorkspaceDto } from 'src/types/AzureWorkspace/AzureWorkspaceDto.types';
import { useDispatch } from 'react-redux';
import { CreateWorkspaceTemplateDto } from 'src/types/Catalog/CreateWorkspaceTemplateDto.types';
import { DomainRoles } from 'src/types/AzureWorkspace/enums/DomainRoles';
import { convertAzureWorkspaceDtoToCreateWorkspaceTemplateDto } from './TemplateManagement.utils';
import { createTemplate } from 'src/store/actions/adminTemplateActions';
import { TemplateMachinesList } from './TemplateMachinesList';
import { showUserConfirmationDialog } from 'src/store/actions';
import { TemplateIPMessageBar } from '../NewWorkspace/Steps/Template/TemplateIPMessageBar';

interface IProps {
  isCreationPanelOpen: boolean;
  closePanel: () => void;
  workspace: AzureWorkspaceDto;
}

export const TemplateCreationPanel = (props: IProps) => {
  const dispatch = useDispatch();

  const [template, setTemplate] = React.useState<CreateWorkspaceTemplateDto>();

  const [machinesListErrors, setMachinesListErrors] =
    React.useState<boolean>(false);

  const closePanel = (ev?: React.SyntheticEvent<HTMLElement, Event>) => {
    if (ev.nativeEvent) {
      props.closePanel();
    }
  };

  const confirmCreateTemplate = () => {
    dispatch(createTemplate(template));
    props.closePanel();
  };

  const createDisabled = React.useMemo(() => {
    return (
      machinesListErrors ||
      template?.Name.length === 0 ||
      template?.VirtualMachines.some(
        (m) => m.DomainRole === DomainRoles.DomainMember && !m.DomainID
      )
    );
  }, [machinesListErrors, template]);

  const handleCreateTemplate = async () => {
    const message =
      'Template creation may take several hours. During this time, the source workspace will be locked and VMs will be inaccessible. Proceed with Template Creation?';
    dispatch(
      showUserConfirmationDialog(
        'Do you want to proceed?',
        message,
        confirmCreateTemplate
      )
    );
  };

  React.useEffect(() => {
    if (props.workspace) {
      setTemplate(
        convertAzureWorkspaceDtoToCreateWorkspaceTemplateDto(props.workspace)
      );
    }
  }, [props.workspace]);

  const onRenderFooterContent = () => {
    return (
      <DialogFooter>
        <DefaultButton onClick={() => props.closePanel()} text='Cancel' />
        <PrimaryButton
          onClick={() => handleCreateTemplate()}
          disabled={createDisabled}
          text='Create Template'
        />
      </DialogFooter>
    );
  };
  return (
    <Panel
      isOpen={props.isCreationPanelOpen}
      onDismiss={closePanel}
      closeButtonAriaLabel='Close'
      headerText={`Create a Template - ${props.workspace?.Name}`}
      type={PanelType.medium}
      isFooterAtBottom={true}
      onRenderFooterContent={onRenderFooterContent}
    >
      {template && (
        <>
          <Stack>
            <p>
              Create a template from this workspace in order to rapidly deploy
              workspaces like this.
            </p>
            <TemplateIPMessageBar />
            <TextField
              label='Template Name'
              placeholder={'Enter a name.'}
              value={template.Name}
              onChange={(event, value) =>
                setTemplate((t) => {
                  return { ...t, Name: value };
                })
              }
              required
            />
            <TextField
              label='Template Description'
              multiline={true}
              value={template.Description}
              onChange={(event, value) =>
                setTemplate((t) => {
                  return { ...t, Description: value };
                })
              }
              placeholder={'Enter a description.'}
            />
            <TextField
              label='Post-Deployment Instructions'
              multiline={true}
              value={template.SpecialInstructions}
              onChange={(event, value) =>
                setTemplate((t) => {
                  return { ...t, SpecialInstructions: value };
                })
              }
              placeholder={'Enter post-deployment instructions.'}
            />
          </Stack>

          <Stack style={{ marginTop: '20px' }}>
            <TemplateMachinesList
              template={template}
              setTemplate={setTemplate}
              onChangeErrors={(hasErrors: boolean) =>
                setMachinesListErrors(() => hasErrors)
              }
            />
          </Stack>
        </>
      )}
    </Panel>
  );
};
