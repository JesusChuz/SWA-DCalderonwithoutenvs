import * as React from 'react';
import {
  SelectionMode,
  DetailsList,
  Panel,
  Label,
  Pivot,
  PivotItem,
  List,
  PanelType,
} from '@fluentui/react';
import { RoleAssignmentDto } from '../../../types/AuthService/RoleAssignmentDto.types';

interface IProps {
  selectedRoleAssignment: RoleAssignmentDto;
  setSelectedRoleAssignment: (
    selectedRoleAssignment: RoleAssignmentDto
  ) => void;
}

export const RbacSearchPanel = (props: IProps): JSX.Element => {
  const hasActions = props.selectedRoleAssignment?.Actions?.length !== 0;
  const hasScopes = props.selectedRoleAssignment?.Scopes?.length !== 0;
  return (
    <Panel
      headerText={props.selectedRoleAssignment?.RoleName}
      isOpen={props.selectedRoleAssignment !== null}
      onDismiss={() => {
        props.setSelectedRoleAssignment(null);
      }}
      closeButtonAriaLabel='Close'
      isLightDismiss={true}
      type={PanelType.medium}
    >
      <Pivot aria-label='Pivots for User Actions, Scopes, and Segment Constraints'>
        <PivotItem headerText='Actions'>
          <>
            {hasActions ? (
              <>
                <Label>
                  {`This role has ${props.selectedRoleAssignment?.Actions?.length} following permittable actions:`}
                </Label>
                <List
                  items={props.selectedRoleAssignment?.Actions}
                  onRenderCell={(item) => {
                    return <div>{item}</div>;
                  }}
                />
              </>
            ) : (
              <Label>
                {'This role does not contain any permittable actions.'}
              </Label>
            )}
          </>
        </PivotItem>
        <PivotItem headerText='Subscription IDs'>
          <>
            {hasScopes ? (
              <>
                <Label>
                  {`This role has ${props.selectedRoleAssignment?.Scopes?.length} following pertaining Subscription IDs:`}
                </Label>
                <List
                  items={props.selectedRoleAssignment?.Scopes}
                  onRenderCell={(item) => {
                    return <div>{item}</div>;
                  }}
                />
              </>
            ) : (
              <Label>
                {'This role does not contain any pertaining subscriptions.'}
              </Label>
            )}
          </>
        </PivotItem>
        <PivotItem headerText='Segment Constraints'>
          <DetailsList
            items={Object.entries(
              props.selectedRoleAssignment?.Constraint ?? {}
            )}
            selectionMode={SelectionMode.none}
            isHeaderVisible={false}
          />
        </PivotItem>
      </Pivot>
    </Panel>
  );
};
