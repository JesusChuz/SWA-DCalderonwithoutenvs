import * as React from 'react';
import { useTheme } from '@fluentui/react';
import { getCanvasStyles } from './CanvasView.styles';

interface VirtualNetworkSVGProps {
  id: string;
  index: number;
  canvasId: string;
  color: string;
  subnet: string;
  numberVMs: number;
  numberConnections: number;
}

export const VirtualNetworkSVG = (props: VirtualNetworkSVGProps) => {
  const theme = useTheme();
  const styles = getCanvasStyles(theme);

  const a11yMessage = React.useMemo(() => {
    return `Network ${props.subnet} with ${props.numberConnections} connection${
      props.numberConnections !== 1 ? 's' : ''
    }`;
  }, [props.numberConnections, props.subnet]);

  return (
    <svg
      tabIndex={0}
      aria-label={a11yMessage}
      x={0}
      y={0}
      id={props.id}
      width='216'
      height='61'
      viewBox='0 0 216 61'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g filter='url(#filter0_d_4296_149833)'>
        <rect
          x='3'
          y='2.95129'
          width='166'
          height='33.2'
          rx='12'
          fill={theme.semanticColors.bodyStandoutBackground}
        />
        <rect
          x='2.75'
          y='2.70129'
          width='166.5'
          height='33.7'
          rx='12.25'
          stroke='black'
          strokeWidth='0.5'
        />
      </g>
      <path
        d='M28.3422 18.3897C29.2855 18.3897 30.0501 17.6167 30.0501 16.6633C30.0501 15.7098 29.2855 14.9369 28.3422 14.9369C27.3989 14.9369 26.6343 15.7098 26.6343 16.6633C26.6343 17.6167 27.3989 18.3897 28.3422 18.3897Z'
        fill='url(#paint0_linear_4296_149833)'
      />
      <path
        d='M22.8952 18.4042C23.8384 18.4042 24.6031 17.6313 24.6031 16.6778C24.6031 15.7243 23.8384 14.9514 22.8952 14.9514C21.9519 14.9514 21.1873 15.7243 21.1873 16.6778C21.1873 17.6313 21.9519 18.4042 22.8952 18.4042Z'
        fill='url(#paint1_linear_4296_149833)'
      />
      <path
        d='M17.4472 18.4042C18.3904 18.4042 19.1551 17.6313 19.1551 16.6778C19.1551 15.7243 18.3904 14.9514 17.4472 14.9514C16.5039 14.9514 15.7393 15.7243 15.7393 16.6778C15.7393 17.6313 16.5039 18.4042 17.4472 18.4042Z'
        fill='url(#paint2_linear_4296_149833)'
      />
      <path
        d='M18.6869 23.5802L17.7096 24.5708C17.6269 24.6546 17.5146 24.7018 17.3975 24.702C17.2803 24.7022 17.1679 24.6553 17.0849 24.5717L9.84958 17.2785C9.68368 17.1113 9.5903 16.8843 9.58997 16.6474C9.58964 16.4106 9.6824 16.1833 9.84784 16.0156L10.8251 15.025L18.686 22.9488C18.769 23.0324 18.8157 23.1459 18.8158 23.2643C18.816 23.3827 18.7696 23.4963 18.6869 23.5802V23.5802Z'
        fill='#50E6FF'
      />
      <path
        d='M17.5615 8.80245L18.5416 9.79029C18.6245 9.8739 18.6712 9.9874 18.6714 10.1058C18.6715 10.2242 18.6251 10.3379 18.5424 10.4217L10.8178 18.2517L9.8378 17.2638C9.6719 17.0966 9.57851 16.8696 9.57819 16.6328C9.57786 16.3959 9.67062 16.1687 9.83606 16.001L16.9369 8.80333C17.0196 8.71948 17.1319 8.67229 17.249 8.67212C17.3662 8.67195 17.4786 8.71884 17.5615 8.80245V8.80245Z'
        fill='#1490DF'
      />
      <path
        d='M34.8455 15.0118L35.8227 16.0024C35.9882 16.1701 36.0809 16.3974 36.0806 16.6342C36.0803 16.8711 35.9869 17.098 35.821 17.2653L28.5856 24.5585C28.5027 24.6421 28.3903 24.689 28.2731 24.6888C28.156 24.6886 28.0437 24.6414 27.961 24.5576L26.9837 23.567C26.901 23.4831 26.8546 23.3695 26.8548 23.2511C26.8549 23.1327 26.9016 23.0192 26.9846 22.9356L34.8455 15.0118V15.0118Z'
        fill='#50E6FF'
      />
      <path
        d='M35.8194 17.2547L34.8394 18.2425L27.1147 10.4126C27.032 10.3287 26.9856 10.2151 26.9858 10.0967C26.986 9.97827 27.0327 9.86477 27.1156 9.78115L28.106 8.78281C28.189 8.69919 28.3014 8.65231 28.4186 8.65248C28.5357 8.65264 28.648 8.69984 28.7307 8.78369L35.8315 15.9813C35.997 16.149 36.0897 16.3763 36.0894 16.6131C36.0891 16.85 35.9957 17.077 35.8298 17.2442L35.8194 17.2547Z'
        fill='#1490DF'
      />
      <mask id='path-10-inside-1_4296_149833' fill='white'>
        <path d='M3 28.0757H169V28.0757C169 33.0313 164.983 37.0487 160.027 37.0487H11.973C7.01734 37.0487 3 33.0313 3 28.0757V28.0757Z' />
      </mask>
      <path
        d='M3 28.0757H169V28.0757C169 33.0313 164.983 37.0487 160.027 37.0487H11.973C7.01734 37.0487 3 33.0313 3 28.0757V28.0757Z'
        fill={props.color}
      />
      <path
        d='M3 28.0757H169H3ZM169.5 28.0757C169.5 33.3075 165.259 37.5487 160.027 37.5487H11.973C6.74119 37.5487 2.5 33.3075 2.5 28.0757H3.5C3.5 32.7552 7.29348 36.5487 11.973 36.5487H160.027C164.707 36.5487 168.5 32.7552 168.5 28.0757H169.5ZM11.973 37.5487C6.74119 37.5487 2.5 33.3075 2.5 28.0757H3.5C3.5 32.7552 7.29348 36.5487 11.973 36.5487V37.5487ZM169.5 28.0757C169.5 33.3075 165.259 37.5487 160.027 37.5487V36.5487C164.707 36.5487 168.5 32.7552 168.5 28.0757H169.5Z'
        fill='black'
        mask='url(#path-10-inside-1_4296_149833)'
      />
      <defs>
        <filter
          id='filter0_d_4296_149833'
          x='0.126047'
          y='0.0773405'
          width='176.496'
          height='43.6958'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feMorphology
            radius='1.18698'
            operator='dilate'
            in='SourceAlpha'
            result='effect1_dropShadow_4296_149833'
          />
          <feOffset dx='2.37395' dy='2.37395' />
          <feGaussianBlur stdDeviation='1.78047' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_4296_149833'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_4296_149833'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_4296_149833'
          x1='27.1378'
          y1='15.4521'
          x2='29.5817'
          y2='17.8632'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#86D633' />
          <stop offset='1' stopColor='#5E9624' />
        </linearGradient>
        <linearGradient
          id='paint1_linear_4296_149833'
          x1='18.6843'
          y1='16.0676'
          x2='21.1102'
          y2='18.4823'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#86D633' />
          <stop offset='1' stopColor='#5E9624' />
        </linearGradient>
        <linearGradient
          id='paint2_linear_4296_149833'
          x1='13.2363'
          y1='16.0676'
          x2='15.6622'
          y2='18.4823'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#86D633' />
          <stop offset='1' stopColor='#5E9624' />
        </linearGradient>
      </defs>
      <text x='50' y='22' className={styles.vnetName}>
        {props.subnet}
      </text>
    </svg>
  );
};
