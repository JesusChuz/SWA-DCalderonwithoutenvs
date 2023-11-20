import { ConfigMessage } from './ConfigMessage.types';

export interface Config {
  ChatbotURLp1: string;
  ChatbotURLp2: string;
  OCVEnv: number;
  OCVAppId: number;
  AppInsightsKey: string;
  DebugMode: boolean;
  Message: ConfigMessage;
}
