import {
  DefaultButton,
  Text,
  IIconProps,
  TooltipHost,
  useTheme,
} from '@fluentui/react';
import * as React from 'react';
import { JitAddressDto } from '../../../types/FirewallManager/JitAddressDto';
import { getCommonStyles } from '../../GeneralComponents/CommonStyles';
import {
  getJitRemainingTime,
  isAddressMismatch,
  isJitAddressExpired,
  JIT_ADDRESS_MESSAGES,
} from './JitRDP.utils';
import { getAllWorkspacesStyles } from '../AllWorkspacesView/AllWorkspacesView.styles';
import { RemainingTime } from '../../../types/RemainingTime.types';

interface IProps {
  jitAddress: JitAddressDto;
  currentAddress: string;
  isDisabled: boolean;
  openJit: () => void;
}

export const ActiveJitRDPAccessButton = (props: IProps): JSX.Element => {
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getAllWorkspacesStyles(theme);
  const updateIntervalInSeconds = 10;
  const [iconProps, setIconProps] = React.useState<IIconProps>(null);
  const [timeRemaining, setTimeRemaining] = React.useState<RemainingTime>({
    longFormattedString: 'Active',
    shortFormattedString: 'Active',
    isExpired: false,
  });
  const [isExpired, setIsExpired] = React.useState(false);

  const updateTimeRemaining = () => {
    const time = getJitRemainingTime(props.jitAddress);
    setTimeRemaining(time);
    setIsExpired(isJitAddressExpired(props.jitAddress));
  };

  const getActiveJitAddressButtonTooltipMessage = () => {
    if (isAddressMismatch(props.jitAddress, props.currentAddress)) {
      return JIT_ADDRESS_MESSAGES.addressMismatchMessage;
    }

    if (isExpired) {
      return JIT_ADDRESS_MESSAGES.expiredAddressMessage;
    }

    return JIT_ADDRESS_MESSAGES.activeAddressMessage;
  };

  React.useEffect(() => {
    const interval = setInterval(
      updateTimeRemaining,
      updateIntervalInSeconds * 1000
    );
    updateTimeRemaining();
    return () => clearInterval(interval);
  }, [props.jitAddress]);

  React.useEffect(() => {
    setIconProps(getIconProps());
  }, [props.jitAddress, props.currentAddress]);

  const getIconProps = (): IIconProps => {
    const isMismatch = isAddressMismatch(
      props.jitAddress,
      props.currentAddress
    );
    if (isExpired && !isMismatch)
      return { iconName: 'Warning', className: styles.warningIcon };
    if (isMismatch) return { iconName: 'Error', className: styles.errorIcon };
    return { iconName: 'CheckMark', className: styles.successIcon };
  };

  return (
    <TooltipHost content={getActiveJitAddressButtonTooltipMessage()}>
      <DefaultButton
        iconProps={iconProps}
        id={`${props.jitAddress.WorkspaceID}-JIT-BUTTON`}
        styles={{ root: { width: '132px' } }}
        onClick={props.openJit}
        disabled={props.isDisabled}
        ariaLabel='JIT button'
      >
        <Text variant='small' className={commonStyles.boldText}>
          {timeRemaining.longFormattedString}
        </Text>
      </DefaultButton>
    </TooltipHost>
  );
};
