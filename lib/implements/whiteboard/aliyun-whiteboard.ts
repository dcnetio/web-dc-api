import { IWhiteboardOperations } from '../../interfaces/whiteboard-interface';
import { createLogger } from '../../util/logger';

const logger = createLogger("AliyunWhiteboard");

export class AliyunWhiteboardOperations implements IWhiteboardOperations {
  private whiteboardManager: any = null;
  private authInfo: any = null;

  constructor() {
    this.whiteboardManager = null;
  }

  private _getManager(): any {
    if (this.whiteboardManager) return this.whiteboardManager;
    
    let Manager = null;
    if (typeof window !== 'undefined') {
      try {
        const DingRTC = require('dingrtc');
        Manager = DingRTC.WhiteboardManager;
      } catch (e) {
        Manager = (window as any).WhiteboardManager || (window as any).DingRTC?.WhiteboardManager;
      }
    }
    
    if (!Manager) {
       // Mock for SSR or Fallback
       logger.warn('WhiteboardManager is not found in the current environment.');
       return null;
    }
    
    this.whiteboardManager = Manager;
    return this.whiteboardManager;
  }

  public async init(authInfo: any): Promise<void> {
    this.authInfo = authInfo;
    const manager = this._getManager();
    if (!manager) {
      throw new Error("DingRTC WhiteboardManager is missing from window or dingrtc package. Please verify installation.");
    }
    // Typically Whiteboard initialization requires joining a session or setting auth info
  }

  public async joinChannel(joinInfo: any): Promise<void> {
    const manager = this._getManager();
    if (!manager) throw new Error("WhiteboardManager disabled");
    if (typeof manager.join === 'function') {
      await manager.join(joinInfo);
    }
  }

  public leaveChannel(): void {
    const manager = this._getManager();
    if (manager && typeof manager.leave === 'function') {
      manager.leave();
    }
  }

  public clear(): void {
    const manager = this._getManager();
    if (manager && typeof manager.clear === 'function') {
      manager.clear();
    }
  }

  public getWhiteboard(whiteboardId: string): any {
    const manager = this._getManager();
    if (manager && typeof manager.getWhiteboard === 'function') {
      return manager.getWhiteboard(whiteboardId);
    }
    return null;
  }

  public getAnnotation(annotationId: string, sourceType: 'video' | 'share' | 'external'): any {
    const manager = this._getManager();
    if (manager && typeof manager.getAnnotation === 'function') {
      return manager.getAnnotation(annotationId, sourceType);
    }
    return null;
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    const manager = this._getManager();
    if (manager && typeof manager.on === 'function') {
      manager.on(event, callback);
    }
  }

  public once(event: string, callback: (...args: any[]) => void): void {
    const manager = this._getManager();
    if (manager && typeof manager.once === 'function') {
      manager.once(event, callback);
    }
  }

  public off(event: string, callback: (...args: any[]) => void): void {
    const manager = this._getManager();
    if (manager && typeof manager.off === 'function') {
      manager.off(event, callback);
    }
  }

  public removeAllListeners(event?: string): void {
    const manager = this._getManager();
    if (manager && typeof manager.removeAllListeners === 'function') {
      manager.removeAllListeners(event);
    }
  }
}