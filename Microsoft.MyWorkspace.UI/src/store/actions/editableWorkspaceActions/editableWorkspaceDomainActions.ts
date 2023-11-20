import cloneDeep from 'lodash/cloneDeep';
import { EditableWorkspaceDispatch } from './index';
import { showBlockedNotification, showErrorNotification } from '..';
import { AzureDomainDto } from '../../../types/AzureWorkspace/AzureDomainDto.types';
import { DomainRoles } from '../../../types/AzureWorkspace/enums/DomainRoles';
import { UserProfileDto } from '../../../types/Catalog/UserProfileDto.types';
import { MyWorkspacesStore } from '../../reducers/rootReducer';
import {
  validateDomainMember,
  validateDomainController,
  workspaceValidateDomainNames,
  getFirstValidDomain,
  validateDomainSubnets,
  setDomainMembersToWorkgroupMembers,
} from '../../validators/workspaceValidators';
import { EDITABLE_WORKSPACE_UPDATE_DOMAIN } from '../actionTypes';

export const createTempDomainID = () => {
  const dateString = Date.now().toString();
  return `00000000-0000-0000-000${dateString.charAt(0)}-${dateString.substring(
    1
  )}`;
};

export const getNewDefaultDomainName = (
  userProfile: UserProfileDto,
  domains: AzureDomainDto[]
) => {
  const [alias] = userProfile.Mail.split('@');
  let suffix = 1;
  let domainName = `${alias}${suffix}.lab`;
  while (domains.find((d) => d.Name === domainName)) {
    suffix++;
    domainName = `${alias}${suffix}.lab`;
  }
  return domainName;
};

export const editableWorkspaceUpdateDomainRole = (
  index: number,
  domainRole: DomainRoles,
  userProfile: UserProfileDto
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace, catalog } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    let domains = cloneDeep(editableWorkspace.editableWorkspace.Domains);
    const machine = machines[index];
    const wasDomainController =
      machine.DomainRole === DomainRoles.DomainController;

    if (wasDomainController) {
      domains = domains.filter((d) => d.ID !== machine.DomainID);
      setDomainMembersToWorkgroupMembers(machine, machines);
    }
    machine.DomainRole = domainRole;

    if (domainRole === DomainRoles.WorkgroupMember) {
      machine.DomainID = null;
    } else if (domainRole === DomainRoles.DomainMember) {
      const domainMemberError = validateDomainMember(domains);
      const domain = getFirstValidDomain(machine, domains, machines);
      if (domainMemberError || !domain) {
        dispatch(
          showBlockedNotification(
            domainMemberError ||
              "No domains exist that match this machine's subnets."
          )
        );
        return;
      }
      machine.DomainID = domain.ID;
    } else if (domainRole == DomainRoles.DomainController) {
      const domainControllerError = validateDomainController(
        machine,
        catalog.catalogMachines
      );
      if (domainControllerError) {
        dispatch(showBlockedNotification(domainControllerError));
        return;
      }
      const tempDomainID = createTempDomainID();
      domains.push({
        ID: tempDomainID,
        Name: getNewDefaultDomainName(userProfile, domains),
        Description: '',
      });
      machine.DomainID = tempDomainID;
    }
    const domainNameErrors = workspaceValidateDomainNames(domains);
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_DOMAIN,
      payload: {
        machines,
        domains,
      },
      error: domainNameErrors,
    });
  };
};

export const editableWorkspaceUpdateDomainName = (
  index: number,
  domainName: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const domains = cloneDeep(editableWorkspace.editableWorkspace.Domains);
    const machine = machines[index];
    const domain = domains.find((d) => d.ID === machine.DomainID);
    if (!domain) {
      dispatch(showErrorNotification('Domain does not exist.'));
      return;
    }
    domain.Name = domainName;
    const domainNameErrors = workspaceValidateDomainNames(domains);
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_DOMAIN,
      payload: {
        machines,
        domains,
      },
      error: domainNameErrors,
    });
  };
};

export const editableWorkspaceUpdateDomainMemberDomain = (
  index: number,
  newDomainID: string
): ((
  dispatch: EditableWorkspaceDispatch,
  getState: () => MyWorkspacesStore
) => Promise<void>) => {
  return async (dispatch, getState): Promise<void> => {
    const { editableWorkspace } = getState();
    const machines = cloneDeep(
      editableWorkspace.editableWorkspace.VirtualMachines
    );
    const domains = cloneDeep(editableWorkspace.editableWorkspace.Domains);
    const machine = machines[index];
    const domain = domains.find((d) => d.ID === newDomainID);
    if (!domain) {
      dispatch(showErrorNotification('Domain does not exist.'));
      return;
    }
    machine.DomainID = newDomainID;
    const domainSubnetError = validateDomainSubnets(
      domain,
      machines,
      machine.DomainRole
    );
    if (domainSubnetError) {
      dispatch(showBlockedNotification(domainSubnetError));
      return;
    }
    dispatch({
      type: EDITABLE_WORKSPACE_UPDATE_DOMAIN,
      payload: {
        machines,
        domains,
      },
    });
  };
};
