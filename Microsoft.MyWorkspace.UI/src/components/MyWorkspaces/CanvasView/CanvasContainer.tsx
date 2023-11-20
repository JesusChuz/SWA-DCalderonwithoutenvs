import React from 'react';
import {
  initializeZoom,
  initializePan,
  initializeSVGForZoom,
  removeZoom,
  removePan,
} from './SVG.utils';

interface ICanvasContainerProps {
  id: string;
  allowZoom: boolean;
  allowPan: boolean;
  viewBoxOverrideTag: string;
  children: React.ReactNode;
}

export const CanvasContainer = (props: ICanvasContainerProps) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    props.allowZoom && initializeZoom(svgRef.current, props.id);
    props.allowPan && initializePan(svgRef.current, props.id);
    const containerResizeObserver = new ResizeObserver(() => {
      const container = document.getElementById(props.id);
      if (container) {
        initializeSVGForZoom(
          props.id,
          {
            x: 0,
            y: 0,
            width: container.clientWidth,
            height: container.clientHeight,
          },
          props.viewBoxOverrideTag
        );
      }
    });
    containerResizeObserver.observe(document.getElementById(props.id));
    return () => {
      props.allowZoom && removeZoom(svgRef.current, props.id);
      props.allowPan && removePan(svgRef.current, props.id);
      containerResizeObserver.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{
        border: '1px solid',
        borderRadius: '25px',
        margin: 'auto',
        marginTop: '15px',
        marginBottom: '10px',
      }}
      id={props.id}
      width={'90%'}
      height={'50vh'}
    >
      {props.children}
    </svg>
  );
};
