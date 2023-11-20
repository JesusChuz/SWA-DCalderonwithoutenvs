import { mergeStyleSets } from '@fluentui/react';

export const computeStyles = (
  percentage: number,
  radius: number,
  color: string
) =>
  mergeStyleSets({
    circleContainer: {
      selectors: {
        circle: {
          strokeWidth: '20px',
          fill: 'none',
        },
        div: {
          position: 'relative',
        },
        span: {
          position: 'absolute',
          left: '50%',
          top: '45%',
          transform: 'translate(-45%,-50%)',
          fontSize: '30px',
        },
        'circle:nth-child(1)': { stroke: 'lightgray' },
        'circle:nth-child(2)': {
          stroke: `${color}`,
          position: 'relative',
          zIndex: 1,
          strokeDasharray: `calc(${2 * Math.PI * radius})`,
          strokeDashoffset: `calc(${2 * Math.PI * radius} - (${
            2 * Math.PI * radius
          } * ${percentage}) / 100)`,
          transition: 'all 1s ease-in-out',
        },
        svg: {
          width: '160px',
          height: '160px',
          transform: 'rotate(-90deg)',
          overflow: 'initial',
        },
      },
      fontSize: '36px',
      color: '#fff',
      textAlign: 'center',
    },
  });
