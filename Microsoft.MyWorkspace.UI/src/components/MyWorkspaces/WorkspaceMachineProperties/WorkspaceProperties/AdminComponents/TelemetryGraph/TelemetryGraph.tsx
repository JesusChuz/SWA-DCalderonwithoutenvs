/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

import { TelemetryGraphNodeDto } from '../../../../../../types/Telemetry/TelemetryGraphNodeDto.types';
import { MyWorkspaceHierarchyNode } from '../../../../../../types/Telemetry/MyWorkspaceHierarchyNode.types';
import {
  getLinkClass,
  getNodeClass,
  getNodeDescription,
  getNodeImage,
} from './TreeConstants';
import { getTelemetryGraphStyles } from './TelemetryGraph.styles';
import { getCommonStyles } from '../../../../../GeneralComponents/CommonStyles';
import {
  DefaultButton,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import { AxiosError } from 'axios';

const duration = 750;
const initialViewBox = {
  x: 0,
  y: 0,
  height: 1000,
  width: 1000,
};
let i = 0;

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SVGDimmensions {
  width: number;
  height: number;
  margin: Margin;
}

interface IProps {
  data: TelemetryGraphNodeDto;
  error: AxiosError;
  dimensions: SVGDimmensions;
  clickHandler: (node: TelemetryGraphNodeDto) => void;
  fetchDataHandler: () => void;
  isLoading: boolean;
}

export const TelemetryGraph = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const telemetryGraphStyles = getTelemetryGraphStyles(theme);
  const [root, setRoot] =
    useState<MyWorkspaceHierarchyNode<TelemetryGraphNodeDto>>(null);
  const [viewbox, setViewBox] = useState(initialViewBox);
  const [mouseDown, setMouseDown] = useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const svgRef = React.useRef(null);
  const { width, height, margin } = props.dimensions;

  const diagonal = d3
    .linkHorizontal()
    .x((d: any) => d.y)
    .y((d: any) => d.x);

  // Expand the node and all it's children
  const expand = (d: MyWorkspaceHierarchyNode<TelemetryGraphNodeDto>) => {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(expand);
      d._children = null;
    }
  };

  // Collapse the node and all it's children
  const collapse = (d: MyWorkspaceHierarchyNode<TelemetryGraphNodeDto>) => {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  };

  // Toggle children on click.
  const click = (d: any) => {
    const node = d?.target
      ?.__data__ as MyWorkspaceHierarchyNode<TelemetryGraphNodeDto>;
    if (!node) {
      return;
    }
    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null;
    }
    update(node);
  };

  function update(source: MyWorkspaceHierarchyNode<TelemetryGraphNodeDto>) {
    // Assigns the x and y position for the nodes
    const treeData = d3.tree<TelemetryGraphNodeDto>().size([height, width])(
      root
    ) as MyWorkspaceHierarchyNode<TelemetryGraphNodeDto>;

    // Compute the new tree layout.
    const nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach((d) => {
      d.y = d.depth == 0 ? 100 : d.depth * 180;
    });

    // ****************** Nodes section ***************************
    const svgEl = d3.select(svgRef.current);

    // Update the nodes...
    const node = svgEl.selectAll('g.node').data(nodes, function (d: any) {
      return d.id || (d.id = ++i);
    });

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', () => {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      });

    // Add Circle for the nodes
    nodeEnter
      .append('circle')
      .attr('r', 10)
      .attr('class', (d) => {
        return d._children
          ? getNodeClass(d.data, true)
          : getNodeClass(d.data, false);
      })
      .on('click', click);

    nodeEnter
      .append('image')
      .attr('xlink:href', (d) => {
        const image = getNodeImage(d.data);
        return image?.name;
      })
      .attr('x', () => {
        return 4;
      })
      .attr('y', () => {
        return 8;
      })
      .attr('width', (d) => {
        const image = getNodeImage(d.data);
        return image?.size;
      })
      .attr('height', (d) => {
        const image = getNodeImage(d.data);
        return image?.size;
      })
      .attr('alt', 'Node image')
      .attr('aria-hidden', 'true');

    nodeEnter
      .append('text')
      .attr('x', (d) => {
        return d.children || d._children ? -20 : 20;
      })
      .attr('dy', '.35em')
      .attr('class', () => {
        return 'nodeText';
      })
      .attr('text-anchor', (d) => {
        return d.children || d._children ? 'end' : 'start';
      })
      .text((d) => {
        return getNodeDescription(d.data);
      })
      .on('click', (e: any) => props.clickHandler(e.target.__data__.data))
      .style('fill-opacity', 1);

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node as any);

    // Transition to the proper position for the node
    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', function (d: any) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    // Remove any exiting nodes
    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr('transform', function (d: any) {
        return 'translate(' + (source as any).y + ',' + (source as any).x + ')';
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 0);

    // On exit reduce the opacity of text labels
    nodeExit.select('text').style('fill-opacity', 0);

    // ****************** links section ***************************

    // Update the links...
    const link = svgEl
      .selectAll('path.link,path.link-failed')
      .data(links, function (d: any) {
        return d.id;
      });

    // Enter any new links at the parent's previous position.
    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', (d) => getLinkClass(d.data))
      .attr('d', function (d: any) {
        const o = { x: (source as any).x0, y: (source as any).y0 };
        const diag = diagonal({ source: o, target: o } as any);
        return diag;
      });

    // UPDATE
    const linkUpdate = linkEnter.merge(link as any);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', function (d: any) {
        const diag = diagonal({
          source: { x: d.x, y: d.y },
          target: { x: d.parent.x, y: d.parent.y },
        } as any);
        return diag;
      });

    // Remove any exiting links
    link
      .exit()
      .transition()
      .duration(duration)
      .attr('d', function (d: any) {
        const o = { x: (source as any).x, y: (source as any).y };
        const diag = diagonal({ source: o, target: o } as any);
        return diag;
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d: any) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  React.useEffect(() => {
    if (root) {
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll('*').remove(); // Clear svg content before adding new elements
      svgEl
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      update(root);
    }
  }, [root]);

  // Redraw chart if data changes
  useEffect(() => {
    if (props.data) {
      // Assigns parent, children, height, depth
      const r = d3.hierarchy(
        props.data,
        (d: TelemetryGraphNodeDto) => d.Children
      ) as MyWorkspaceHierarchyNode<TelemetryGraphNodeDto>;
      r.x0 = height / 2;
      r.y0 = 0;

      // Collapse after the second level
      r.children.forEach(collapse);
      setRoot(r);
    }
  }, [props.data]);

  const scroll: React.WheelEventHandler<SVGSVGElement> = (event) => {
    if (event.deltaY < 0) {
      setViewBox({
        x: viewbox.x,
        y: viewbox.y,
        width: viewbox.width / 1.05,
        height: viewbox.height / 1.05,
      });
    } else {
      setViewBox({
        x: viewbox.x,
        y: viewbox.y,
        width: viewbox.width * 1.05,
        height: viewbox.height * 1.05,
      });
    }
  };

  const pan: React.MouseEventHandler<SVGSVGElement> = (event) => {
    if (mouseDown) {
      event.preventDefault();
      event.stopPropagation();
      setViewBox({
        x: viewbox.x - event.movementX,
        y: viewbox.y - event.movementY,
        width: viewbox.width,
        height: viewbox.height,
      });
    }
  };

  return (
    <div
      className={`${
        fullscreen ? telemetryGraphStyles.fullscreen : commonStyles.fullHeight
      }`}
    >
      <Stack horizontal tokens={{ childrenGap: 15 }} style={{ margin: '10px' }}>
        <PrimaryButton
          style={{ width: '150px' }}
          onClick={props.fetchDataHandler}
          disabled={props.isLoading}
        >
          Generate Graph
        </PrimaryButton>
        <DefaultButton
          style={{ width: '150px' }}
          onClick={() => {
            setViewBox(initialViewBox);
            setFullscreen(!fullscreen);
          }}
        >
          Full Screen
        </DefaultButton>
        <DefaultButton
          style={{ width: '150px' }}
          onClick={() => {
            collapse(root);
            update(root);
          }}
        >
          Collapse All
        </DefaultButton>
        <DefaultButton
          style={{ width: '150px' }}
          onClick={() => {
            collapse(root);
            expand(root);
            update(root);
          }}
        >
          Expand All
        </DefaultButton>
        <DefaultButton
          style={{ width: '150px' }}
          onClick={() => {
            setViewBox(initialViewBox);
          }}
        >
          Recenter
        </DefaultButton>
      </Stack>
      <Stack>
        {props.error && (
          <>
            <Text>There was an error fetching the telemetry graph.</Text>
            {JSON.stringify(props.error.toJSON())}
          </>
        )}
        {!props.isLoading ? (
          <svg
            viewBox={`${viewbox.x} ${viewbox.y} ${viewbox.width} ${viewbox.height}`}
            ref={svgRef}
            width={'100%'}
            height={fullscreen ? '95vh' : '65vh'}
            onWheel={scroll}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
            onMouseMove={pan}
          />
        ) : (
          <Spinner size={SpinnerSize.large} />
        )}
      </Stack>
    </div>
  );
};
