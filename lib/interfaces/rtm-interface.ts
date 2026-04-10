export interface IRTMStandardMessage {
  appId: string;
  rtcAppId?: string;
  sourceUserId: string;
  messageType: 'P2P' | 'BROADCAST' | 'RTC_INVITE';
  content: string;
  timestamp: number;
  isEncrypted: boolean;
  isInvite?: boolean;
  signature?: string;
}

export interface IRTMAuthInfo {
  token?: string;
  appId: string;
  rtcAppId?: string;
  userId: string;
  userName?: string;
  sessionId?: string;
  themeAuthor: string;
  configTheme: string;
  serviceName: string;
}

export interface IRTMMetadata {
  [key: string]: string;
}

export interface IRTMOperations {
  login(authInfo: IRTMAuthInfo): Promise<void>;
  logout(): Promise<void>;
  sendMessageToPeer(userId: string, message: string, requireAck?: boolean, sendOffline?: boolean): Promise<'success' | 'offline' | 'failed'>;
  queryPeerOnlineStatus(userId: string): Promise<boolean>;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback: (...args: any[]) => void): void;
}
