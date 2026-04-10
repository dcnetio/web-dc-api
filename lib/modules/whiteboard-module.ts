import { DCModule, CoreModuleName } from '../common/module-system';
import { DCContext } from '../interfaces/DCContext';
import { IWhiteboardOperations } from '../interfaces/whiteboard-interface';
import { AliyunWhiteboardOperations } from '../implements/whiteboard/aliyun-whiteboard';

export class WhiteboardModule implements DCModule, IWhiteboardOperations {
  public readonly moduleName = CoreModuleName.WHITEBOARD;
  private readonly whiteboardOps: AliyunWhiteboardOperations;
  private context?: DCContext;

  constructor() {
    this.whiteboardOps = new AliyunWhiteboardOperations();
  }

  public get name(): string {
    return this.moduleName;
  }

  public async initialize(context: DCContext): Promise<boolean> {
    this.context = context;
    return true;
  }
  
  public async shutdown(): Promise<void> {
    this.whiteboardOps.clear();
  }

  public async init(authInfo: any): Promise<void> {
    return this.whiteboardOps.init(authInfo);
  }

  public async joinChannel(joinInfo: any): Promise<void> {
    return this.whiteboardOps.joinChannel(joinInfo);
  }

  public leaveChannel(): void {
    return this.whiteboardOps.leaveChannel();
  }

  public clear(): void {
    return this.whiteboardOps.clear();
  }

  public getWhiteboard(whiteboardId: string): any {
    return this.whiteboardOps.getWhiteboard(whiteboardId);
  }

  public getAnnotation(annotationId: string, sourceType: 'video' | 'share' | 'external'): any {
    return this.whiteboardOps.getAnnotation(annotationId, sourceType);
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    this.whiteboardOps.on(event, callback);
  }

  public once(event: string, callback: (...args: any[]) => void): void {
    this.whiteboardOps.once(event, callback);
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    this.whiteboardOps.off(event, callback);
  }

  public removeAllListeners(event?: string): void {
    this.whiteboardOps.removeAllListeners(event);
  }
}