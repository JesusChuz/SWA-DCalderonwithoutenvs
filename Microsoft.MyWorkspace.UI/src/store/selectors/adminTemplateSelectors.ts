import { createSelector } from 'reselect';
import { ReduxAdminTemplateState } from '../reducers/adminTemplateReducer';
import { MyWorkspacesStore } from '../reducers/rootReducer';

const adminTemplateState = (
  state: MyWorkspacesStore
): ReduxAdminTemplateState => state.adminTemplate;

export const getAdminTemplates = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templates;
  }
);

export const getAdminTemplatesLoading = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templatesLoading;
  }
);

export const getTemplatesSaving = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return (
      templateState.createTemplateLoading || templateState.updateTemplateLoading
    );
  }
);

export const getTemplateDeleting = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.deleteTemplateLoading;
  }
);

export const getTemplateRequests = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templateRequests;
  }
);

export const getTemplateRequestsContinuationToken = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templateRequestsContinuation;
  }
);

export const getTemplateRequestsNextLink = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templateRequestsNextLink;
  }
);

export const getTemplateRequestsLoading = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templateRequestsLoading;
  }
);

export const getTemplateRequestsRefreshing = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templateRequestsRefreshing;
  }
);

export const getStaleTemplates = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.staleTemplates;
  }
);

export const getTemplateFilterProperties = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.filters;
  }
);

export const getTemplateSortProperty = createSelector(
  adminTemplateState,
  (templateState: ReduxAdminTemplateState) => {
    return templateState.templateRequestsSortProperty;
  }
);
