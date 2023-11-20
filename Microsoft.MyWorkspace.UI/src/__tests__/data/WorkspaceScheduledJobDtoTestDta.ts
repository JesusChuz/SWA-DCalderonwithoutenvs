import { WorkspaceScheduledJobDto } from '../../types/Job/WorkspaceScheduledJobDto.types';
import { Blank_WorkspaceScheduledJobDto } from '../../data/Blank_WorkspaceScheduledJobDto';

export const WorkspaceScheduledJobDtoTestData: WorkspaceScheduledJobDto = {
  ...Blank_WorkspaceScheduledJobDto,
};

export const getTestWorkspaceScheduledJobDto = (
  properties: Partial<WorkspaceScheduledJobDto> = {}
): WorkspaceScheduledJobDto => {
  return {
    ...WorkspaceScheduledJobDtoTestData,
    ...properties,
  };
};
