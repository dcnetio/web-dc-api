import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IRTCOperations, IRTCAuthInfo, IRTCMember, IRTCStreamConfig } from '../interfaces/rtc-interface';
import { AliyunRTCOperations } from '../implements/rtc/aliyun-rtc';

export class RTCModule implements DCModule, IRTCOperations {
  public readonly moduleName = CoreModuleName.RTC;
  private readonly rtcOps: AliyunRTCOperations;

  constructor() {
    this.rtcOps = new AliyunRTCOperations();
  }

  public get name(): string {
    return this.moduleName;
  }

  public async initialize(context: DCContext): Promise<boolean> {
    return true;
  }
  
  public async shutdown(): Promise<void> {
    this.destroy();
  }

  public async init(authInfo: IRTCAuthInfo): Promise<void> {
    return this.rtcOps.init(authInfo);
  }

  public async joinChannel(): Promise<void> {
    return this.rtcOps.joinChannel();
  }

  public async leaveChannel(): Promise<void> {
    return this.rtcOps.leaveChannel();
  }

  public destroy(): void {
    return this.rtcOps.destroy();
  }

  public async muteLocalCamera(mute: boolean): Promise<void> {
    return this.rtcOps.muteLocalCamera(mute);
  }

  public async muteLocalMic(mute: boolean): Promise<void> {
    return this.rtcOps.muteLocalMic(mute);
  }

  public async setDisplayRemoteVideo(userId: string, element: HTMLElement | null, streamType: number = 1): Promise<void> {
    return this.rtcOps.setDisplayRemoteVideo(userId, element, streamType);
  }

  public async setDisplayLocalVideo(element: HTMLElement | null): Promise<void> {
    return this.rtcOps.setDisplayLocalVideo(element);
  }

  public async sendMessageToPeer(userId: string, message: string, requireAck?: boolean): Promise<void> {
    return this.rtcOps.sendMessageToPeer(userId, message, requireAck);
  }

  public async sendMessageToChannel(message: string): Promise<void> {
    return this.rtcOps.sendMessageToChannel(message);
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    return this.rtcOps.on(event, callback);
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    return this.rtcOps.off(event, callback);
  }
}
