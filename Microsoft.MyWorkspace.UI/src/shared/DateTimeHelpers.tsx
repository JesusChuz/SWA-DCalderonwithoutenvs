import { RemainingTime } from '../types/RemainingTime.types';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
export interface TimeSpan {
  hour: number; // 1 - 12 (str: 00 - 23)
  minute: number; // 0 or 30 (str: 00 or 30)
  amPm: 'AM' | 'PM';
}

const expiredRemainingTime: RemainingTime = {
  longFormattedString: 'Expired',
  shortFormattedString: 'Expired',
  isExpired: true,
};

export const convertStringToTimeSpan = (timeSpan: string): TimeSpan => {
  if (!timeSpan) {
    return null;
  }
  const [hours, minutes] = timeSpan.split(':');
  let hourValue = parseInt(hours);
  const minuteValue = parseInt(minutes);
  let amPmValue: 'AM' | 'PM' = 'AM';
  if (hourValue > 12) {
    amPmValue = 'PM';
    hourValue -= 12;
  } else if (hourValue === 0) {
    // edge case (00:00 = 12 AM)
    hourValue = 12;
  } else if (hourValue === 12) {
    // edge case (12:00 = 12 PM)
    amPmValue = 'PM';
  }
  const result: TimeSpan = {
    hour: hourValue,
    minute: minuteValue,
    amPm: amPmValue,
  };
  return result;
};

export const convertTimeToString = ({
  hour,
  minute,
  amPm,
}: TimeSpan): string => {
  let hourString = hour.toString();
  if (amPm === 'AM' && hour === 12) {
    // edge case (12 AM = 00:00)
    hourString = '00';
  } else if (amPm === 'AM' && hour < 10) {
    hourString = `0${hourString}`;
  } else if (amPm === 'PM' && hour !== 12) {
    const hourValue = hour + 12;
    hourString = hourValue.toString();
  }
  const minuteString = minute === 0 ? '00' : minute.toString();
  return `${hourString}:${minuteString}:00`;
};

export const formatDateString = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getFormattedDateTime = (dateString: string): string => {
  return `${formatDateString(dateString)} 
    ${new Date(dateString).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
};

export const isRemainingTimeExpired = (
  expirationTime: Date,
  now: Date = new Date()
): boolean => {
  return now > new Date(expirationTime);
};

export const getFormattedHoursAndMinutesRemaining = (
  expirationTime: string,
  now: Date = new Date()
): RemainingTime => {
  dayjs.extend(duration);
  const expirationDaysJs = dayjs(expirationTime);
  const nowDaysJs = dayjs(now);
  if (expirationDaysJs.isBefore(nowDaysJs)) {
    return { ...expiredRemainingTime };
  }
  const difference = dayjs.duration(expirationDaysJs.diff(nowDaysJs));
  const hoursRemaining = Math.floor(difference.asHours());
  const minutesRemaining = difference.minutes();
  let longDateString = '';
  let shortDateString = '';
  if (hoursRemaining >= 1) {
    const longHourSuffix = ` hour${hoursRemaining > 1 ? 's' : ''}  `;
    const shortHourSuffix = 'h ';
    longDateString += `${hoursRemaining}${longHourSuffix}`;
    shortDateString += `${hoursRemaining}${shortHourSuffix}`;
  }
  if (minutesRemaining !== 0) {
    const longMinuteSuffix = ` minute${minutesRemaining > 1 ? 's' : ''}`;
    const shortMinuteSuffix = 'm ';
    longDateString += `${minutesRemaining}${longMinuteSuffix}`;
    shortDateString += `${minutesRemaining}${shortMinuteSuffix}`;
  }
  return {
    longFormattedString: longDateString,
    shortFormattedString: shortDateString,
    hours: hoursRemaining,
    minutes: minutesRemaining,
    isExpired: false,
  };
};

export const getFormattedDaysRemaining = (
  expirationTime: string,
  now: Date = new Date()
): RemainingTime => {
  dayjs.extend(duration);
  const expirationDaysJs = dayjs(expirationTime);
  const nowDaysJs = dayjs(now);
  if (expirationDaysJs.isBefore(nowDaysJs)) {
    return { ...expiredRemainingTime };
  }
  const difference = dayjs.duration(expirationDaysJs.diff(nowDaysJs));

  const daysRemaining = Math.round(difference.asDays());
  const hoursRemaining = daysRemaining
    ? difference.hours()
    : Math.round(difference.asHours());
  let longDateString = '';
  let shortDateString = '';
  if (daysRemaining >= 1) {
    const longDaysSuffix = ` Day${daysRemaining > 1 ? 's' : ''}`;
    const shortDaysSuffix = ` day${daysRemaining > 1 ? 's' : ''}`;
    longDateString += `${daysRemaining}${longDaysSuffix}`;
    shortDateString += `${daysRemaining}${shortDaysSuffix}`;
  } else {
    const longHourSuffix = ` Hour${hoursRemaining > 1 ? 's' : ''}`;
    const shortHourSuffix = ` hour${hoursRemaining > 1 ? 's' : ''}`;
    longDateString += `${hoursRemaining}${longHourSuffix}`;
    shortDateString += `${hoursRemaining}${shortHourSuffix}`;
  }
  return {
    longFormattedString: longDateString,
    shortFormattedString: shortDateString,
    days: daysRemaining,
    hours: hoursRemaining,
    isExpired: false,
  };
};

export const getDateRoundedUpToNearestHour = (timeRemaining: string): Date => {
  const date = new Date(timeRemaining);
  const p = 60 * 60 * 1000; // milliseconds in an hour
  return new Date(Math.round(date.getTime() / p) * p);
};

export const getDateRoundedUpToNextHour = (timeRemaining: string): Date => {
  const date = new Date(timeRemaining);
  const p = 60 * 60 * 1000; // milliseconds in an hour
  return new Date(Math.ceil(date.getTime() / p) * p);
};

export const getDateRoundedUpToNextEvenHour = (timeRemaining: string): Date => {
  const date = new Date(timeRemaining);
  const p = 60 * 60 * 1000; // milliseconds in an hour
  const hourRounded = new Date(Math.ceil(date.getTime() / p) * p);
  hourRounded.setHours(
    hourRounded.getHours() % 2 === 0
      ? hourRounded.getHours()
      : hourRounded.getHours() + 1
  );
  return hourRounded;
};
