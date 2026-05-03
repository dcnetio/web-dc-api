import { IRtcWhiteboard, IWhiteboardOperations, IWhiteboardAuthInfo, IWhiteboardJoinInfo } from '../../interfaces/whiteboard-interface';
import { createLogger } from '../../util/logger';
import { blockAliyunLogRequests } from '../util/aliyun-log-block';

const logger = createLogger("AliyunWhiteboard");

export class AliyunWhiteboardOperations implements IWhiteboardOperations {
  private whiteboardManager: any = null;
  private authInfo: IWhiteboardAuthInfo | null = null;

  constructor() {
    this.whiteboardManager = null;
  }

  private async _getManager(): Promise<any> {
    if (this.whiteboardManager) return this.whiteboardManager;
    
    let Manager = null;
    if (typeof window !== 'undefined') {
      try {
        const DingRTC = await import('@dingrtc/whiteboard');
        Manager = (DingRTC as any).WhiteboardManager || (DingRTC as any).default?.WhiteboardManager || (DingRTC as any).default || DingRTC;
      } catch (e) {
        try {
            const DingRTC = require('dingrtc');
            Manager = DingRTC.WhiteboardManager;
        } catch (err) {
            Manager = (window as any).WhiteboardManager || (window as any).DingRTC?.WhiteboardManager;
        }
      }
    }
    
    if (!Manager) {
       // Mock for SSR or Fallback
       logger.warn('WhiteboardManager is not found in the current environment.');
       return null;
    }
    
    // 如果 Manager 是类，需要 new 出来
    if (typeof Manager === 'function' && Manager.prototype && Manager.prototype.join) {
        this.whiteboardManager = new Manager();
    } else {
        this.whiteboardManager = Manager;
    }
    
    return this.whiteboardManager;
  }

  public async init(authInfo: IWhiteboardAuthInfo): Promise<void> {
    this.authInfo = authInfo;
    blockAliyunLogRequests();
    const manager = await this._getManager();
    if (!manager) {
      throw new Error("DingRTC WhiteboardManager is missing from window or @dingrtc/whiteboard package. Please verify installation.");
    }
    // Typically Whiteboard initialization requires joining a session or setting auth info
  }

  public async joinChannel(joinInfo: IWhiteboardJoinInfo): Promise<void> {
    const manager = await this._getManager();
    if (!manager) throw new Error("WhiteboardManager disabled");
    if (typeof manager.join === 'function') {
      await manager.join(joinInfo);
    }
  }

  public async joinRoom(roomIdOrJoinInfo: string | IWhiteboardJoinInfo): Promise<void> {
    const manager = await this._getManager();
    if (!manager) throw new Error("WhiteboardManager disabled");
    
    // 若仅传入了 roomId(string)，为了兼容组装成 joinInfo 对象
    const joinInfo = typeof roomIdOrJoinInfo === 'string' ? { roomId: roomIdOrJoinInfo } : roomIdOrJoinInfo;
    
    if (typeof manager.join === 'function') {
      await manager.join(joinInfo);
    }
  }

  public async leaveChannel(): Promise<void> {
    const manager = await this._getManager();
    if (manager && typeof manager.leave === 'function') {
      manager.leave();
    }
  }

  public async clear(): Promise<void> {
    const manager = await this._getManager();
    if (manager && typeof manager.clear === 'function') {
      manager.clear();
    }
  }

  public async getWhiteboard(whiteboardId: string): Promise<IRtcWhiteboard> {
    const manager = await this._getManager();
    if (manager && typeof manager.getWhiteboard === 'function') {
      return manager.getWhiteboard(whiteboardId) as IRtcWhiteboard;
    }
    return null as unknown as IRtcWhiteboard;
  }

  public async getAnnotation(annotationId: string, sourceType: 'video' | 'share' | 'external'): Promise<any> {
    const manager = await this._getManager();
    if (manager && typeof manager.getAnnotation === 'function') {
      return manager.getAnnotation(annotationId, sourceType);
    }
    return null;
  }

  public async on(event: string, callback: (...args: any[]) => void): Promise<void> {
    const manager = await this._getManager();
    if (manager && typeof manager.on === 'function') {
      manager.on(event, callback);
    }
  }

  public async once(event: string, callback: (...args: any[]) => void): Promise<void> {
    const manager = await this._getManager();
    if (manager && typeof manager.once === 'function') {
      manager.once(event, callback);
    }
  }

  public async off(event: string, callback: (...args: any[]) => void): Promise<void> {
    const manager = await this._getManager();
    if (manager && typeof manager.off === 'function') {
      manager.off(event, callback);
    }
  }

  public async removeAllListeners(event?: string): Promise<void> {
    const manager = await this._getManager();
    if (manager && typeof manager.removeAllListeners === 'function') {
      manager.removeAllListeners(event);
    }
  }
}