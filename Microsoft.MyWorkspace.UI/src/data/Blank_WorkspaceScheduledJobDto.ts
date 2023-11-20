import { WorkspaceScheduledJobDto } from '../types/Job/WorkspaceScheduledJobDto.types';

export const Blank_WorkspaceScheduledJobDto: WorkspaceScheduledJobDto = {
  WorkspaceID: '',
  ScheduledDays: '',
  AutoStartTimeOfDay: undefined,
  AutoStopTimeOfDay: undefined,
  TimeZone: undefined,
};
