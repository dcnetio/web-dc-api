import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IRTMAuthInfo, IRTMOperations } from '../interfaces/rtm-interface';
import { AliyunRTMOperations } from '../implements/rtm/aliyun-rtm';

export class RTMModule implements DCModule, IRTMOperations {
  public readonly moduleName = CoreModuleName.RTM;
  private readonly rtmOps: AliyunRTMOperations;

  constructor() {
    this.rtmOps = new AliyunRTMOperations();
  }

  public get name(): string {
    return this.moduleName;
  }

  public async initialize(context: DCContext): Promise<boolean> {
    return true;
  }

  public async shutdown(): Promise<void> {
    await this.logout();
  }

  public async login(authInfo: IRTMAuthInfo): Promise<void> {
    return this.rtmOps.login(authInfo);
  }

  public async logout(): Promise<void> {
    return this.rtmOps.logout();
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck: boolean = false): Promise<void> {
    return this.rtmOps.sendMessageToPeer(userId, message, requireAck);
  }

  public async subscribeChannel(channelId: string): Promise<void> {
    return this.rtmOps.subscribeChannel(channelId);
  }

  public async unsubscribeChannel(channelId: string): Promise<void> {
    return this.rtmOps.unsubscribeChannel(channelId);
  }

  public async sendMessageToChannel(channelId: string, message: string): Promise<void> {
    return this.rtmOps.sendMessageToChannel(channelId, message);
  }

  public async queryPeerOnlineStatus(userId: string): Promise<boolean> {
    return this.rtmOps.queryPeerOnlineStatus(userId);
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    return this.rtmOps.on(event, callback);
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    return this.rtmOps.off(event, callback);
  }
}
