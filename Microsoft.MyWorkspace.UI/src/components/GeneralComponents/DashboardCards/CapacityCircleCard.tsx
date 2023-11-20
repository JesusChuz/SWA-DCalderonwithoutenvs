import * as React from 'react';
import { Text, useTheme } from '@fluentui/react';
import { computeStyles } from './CapacityCircleCard.styles';
import { DashboardCard, DashboardCardProps } from './DashboardCard';

interface IProps {
  usedItems: number;
  totalItems: number;
  dashboardCardProps: DashboardCardProps;
}

const dimensions = {
  radius: 70,
  x: 80,
  y: 80,
};

const circumference = 2 * Math.PI * dimensions.radius;

export const CapacityCircleCard = (props: IProps): JSX.Element => {
  const [percentage, setPercentage] = React.useState(0);

  const styles = React.useMemo(() => {
    const hue = ((1 - 0.01 * percentage) * 120).toString(10);
    const color = ['hsl(', hue, ',100%,50%)'].join('');
    return computeStyles(percentage, dimensions.radius, color);
  }, [percentage]);

  React.useEffect(() => {
    if (props.usedItems && props.totalItems) {
      setPercentage(Math.trunc((props.usedItems / props.totalItems) * 100));
    }
  }, [props.totalItems, props.usedItems]);

  return (
    <DashboardCard {...props.dashboardCardProps}>
      <div className={styles.circleContainer}>
        <div>
          <svg>
            <circle
              cx={`${dimensions.x}`}
              cy={`${dimensions.y}`}
              r={`${dimensions.radius}`}
            />
            <circle
              style={
                percentage === 0
                  ? {
                      strokeDashoffset: circumference,
                      strokeDasharray: circumference,
                    }
                  : {}
              }
              cx={`${dimensions.x}`}
              cy={`${dimensions.y}`}
              r={`${dimensions.radius}`}
            />
          </svg>
          <Text>{percentage}%</Text>
        </div>
      </div>
    </DashboardCard>
  );
};
