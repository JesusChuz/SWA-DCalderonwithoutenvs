import { TemplateRequestStatus } from 'src/types/enums/TemplateRequestStatus';

export const convertTemplateStatusToReadable = (
  status: TemplateRequestStatus
) => {
  switch (status) {
    case TemplateRequestStatus.MarkForDeletion:
      return 'Marked For Deletion';
    default:
      return status;
  }
};
