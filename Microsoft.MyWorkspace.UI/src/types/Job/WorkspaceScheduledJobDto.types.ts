export interface WorkspaceScheduledJobDto {
  AutoStartTimeOfDay: string;
  AutoStopTimeOfDay: string;
  TimeZone: string;
  NextAutoStopTime?: string;
  ScheduledDays: string;
  WorkspaceID: string;
}
