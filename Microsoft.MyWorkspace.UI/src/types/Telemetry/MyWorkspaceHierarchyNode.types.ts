import { HierarchyPointNode } from 'd3';

export interface MyWorkspaceHierarchyNode<Datum>
  extends HierarchyPointNode<Datum> {
  x0: number;
  y0: number;
  _children?: this[] | undefined;
}
