import React, { useState } from 'react';
import { NewWorkspaceStep } from 'src/types/enums/DeploymentStep';
import { WorkspaceEditType } from 'src/types/enums/WorkspaceEditType';
import NewWorkspace from './NewWorkspace';

interface IProps {
  workspaceEditType: WorkspaceEditType;
}

export const NewWorkspaceWrapper = (props: IProps) => {
  const [step, setStep] = useState<NewWorkspaceStep>(NewWorkspaceStep.Choose);
  const [stepsDirty] = useState<Set<NewWorkspaceStep>>(new Set());
  return (
    <NewWorkspace
      workspaceEditType={props.workspaceEditType}
      step={step}
      setStep={setStep}
      initialStepsDirty={stepsDirty}
    />
  );
};

export { NewWorkspaceWrapper as default };
