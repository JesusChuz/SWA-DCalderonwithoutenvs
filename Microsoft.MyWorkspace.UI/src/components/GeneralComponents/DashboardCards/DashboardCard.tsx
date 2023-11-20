import * as React from 'react';
import {
  IContextualMenuItem,
  DefaultButton,
  Icon,
  useTheme,
  Stack,
  IconButton,
} from '@fluentui/react';
import {
  Card,
  CardStandardHeader,
  ICardProps,
  ICardStyles,
  ICardStandardHeaderStyles,
} from '@coherence-design-system/controls/lib/Card';
import { styles } from './DashboardCard.styles';
import clsx from 'clsx';
import { useCommonStyles } from 'src/hooks/useCommonStyles';

type DashboardCardSizes = 'sm' | 'med' | 'lg';

interface IButtonProps {
  title: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  footerContainerStyles?: React.CSSProperties;
}

interface IDashboardCardPropsBasics {
  title: string;
  cardProps?: ICardProps;
  children?: React.ReactNode;
  menuItems?: IContextualMenuItem[];
  buttonProps?: IButtonProps;
  styles?: React.CSSProperties;
  subTitle?: string | React.ReactNode;
  collapsible?: boolean;
  collapsedByDefault?: boolean;
}

interface IDashboardCardPropsWithSize extends IDashboardCardPropsBasics {
  size: DashboardCardSizes;
  className?: string;
}

interface IDashboardCardPropsWithClass extends IDashboardCardPropsBasics {
  size?: DashboardCardSizes;
  className: string;
}

export type DashboardCardProps =
  | IDashboardCardPropsWithSize
  | IDashboardCardPropsWithClass;

export const DashboardCard = (props: DashboardCardProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = useCommonStyles();
  const [collapsed, setCollapsed] = React.useState(
    (Boolean(props.collapsible) && Boolean(props.collapsedByDefault)) || false
  );

  const cardStyle: ICardStyles = {
    root: {
      backgroundColor: theme.semanticColors.bodyBackground,
    },
    header: {},
    footer: {
      height: 'auto',
    },
    layout: {},
    rightGutterStyle: {},
  };

  const headerStyles: ICardStandardHeaderStyles = {
    root: {
      backgroundColor: 'transparent',
    },
    cardTitle: {},
    cardSubTitle: {},
    cardItemCounter: {},
    cardContextButton: {},
    cardContextContainer: {},
    menuIcon: {},
    subComponentStyles: {
      title: {},
      itemCounter: {},
      subTitle: {},
      contextMenu: {},
    },
  };

  const onHeaderClick = () => {
    if (props.collapsible) {
      setCollapsed(!collapsed);
    }
  };

  const getHeader = (
    title: string,
    menuItems: IContextualMenuItem[] = null,
    subTitle: string | React.ReactNode = null
  ) => (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex
    <div tabIndex={0}>
      <CardStandardHeader
        cardTitle={title}
        contextProps={{
          menuItems: menuItems,
          ariaLabel: 'Context Menu',
        }}
        subTitle={
          props.collapsible ? (
            <>
              {subTitle}
              <IconButton
                iconProps={{ iconName: 'ChevronDown' }}
                title={collapsed ? 'expand card' : 'collapse card'}
                className={clsx(
                  commonStyles.cursorPointer,
                  collapsed && styles.rotate
                )}
                onClick={onHeaderClick}
              />
            </>
          ) : (
            subTitle
          )
        }
        styles={headerStyles}
      />
    </div>
  );

  const getFooter = (
    title: string,
    onClick: (event: React.MouseEvent<HTMLElement>) => void
  ): JSX.Element => (
    <div
      style={{
        ...(props.buttonProps.footerContainerStyles ?? {}),
        margin: '10px',
        marginBottom: '30px',
      }}
    >
      <DefaultButton text={title} onClick={onClick} />
    </div>
  );

  return (
    <div
      className={clsx(
        props.size === 'sm' && styles.smCard,
        props.size === 'med' && styles.medCard,
        props.size === 'lg' && styles.lgCard,
        props.collapsible && collapsed && styles.collapsed,
        props.className
      )}
      style={props.styles}
    >
      <Card
        styles={cardStyle}
        header={getHeader(props.title, props.menuItems, props.subTitle)}
        footer={
          props.buttonProps
            ? getFooter(props.buttonProps.title, props.buttonProps.onClick)
            : null
        }
        {...props.cardProps}
      >
        {(!props.collapsible || !collapsed) && props.children}
      </Card>
    </div>
  );
};
