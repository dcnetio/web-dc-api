/**
 * 拦截阿里云 SDK（RTC/RTM/Whiteboard）向 *.aliyuncs.com 发送的日志上报请求。
 * 同时 patch fetch 和 XMLHttpRequest，确保无论 SDK 使用哪种方式上报都能被静默丢弃。
 *
 * 使用全局标志 `_dc_aliyun_log_blocked` 保证只 patch 一次，
 * 在任意阿里云模块 init() 开头调用即可。
 */
export function blockAliyunLogRequests(): void {
  if (typeof window === 'undefined') return;
  if ((window as any)._dc_aliyun_log_blocked) return;
  (window as any)._dc_aliyun_log_blocked = true;

  const isAliyunLogUrl = (url: string) =>
    /\.log\.aliyuncs\.com(?:\/|$)/.test(url);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const url =
      typeof args[0] === 'string'
        ? args[0]
        : (args[0] as any)?.url ?? '';
    if (url && isAliyunLogUrl(url)) {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return originalFetch.apply(window, args as any);
  };

  // ── XMLHttpRequest ────────────────────────────────────────────────────────
  const OriginalXHR = window.XMLHttpRequest;

  class PatchedXHR extends OriginalXHR {
    private _xhrBlocked = false;

    open(method: string, url: string, ...rest: any[]): void {
      if (url && isAliyunLogUrl(url)) {
        this._xhrBlocked = true;
        return;
      }
      if (rest.length === 0) {
        super.open(method, url);
        return;
      }
      if (rest.length === 1) {
        super.open(method, url, rest[0] as boolean);
        return;
      }
      if (rest.length === 2) {
        super.open(method, url, rest[0] as boolean, rest[1] as string);
        return;
      }
      super.open(
        method,
        url,
        rest[0] as boolean,
        rest[1] as string,
        rest[2] as string,
      );
    }

    send(...args: any[]): void {
      if (this._xhrBlocked) {
        // 异步模拟成功响应，防止 SDK 陷入超时/重试循环
        setTimeout(() => {
          this.dispatchEvent(new ProgressEvent('readystatechange'));
          this.dispatchEvent(new ProgressEvent('load'));
          this.dispatchEvent(new ProgressEvent('loadend'));
          if (typeof (this as any).onreadystatechange === 'function') {
            (this as any).onreadystatechange();
          }
          if (typeof (this as any).onload === 'function') {
            (this as any).onload(new ProgressEvent('load'));
          }
        }, 0);
        return;
      }
      return super.send(...(args as [Document | XMLHttpRequestBodyInit | null | undefined]));
    }
  }

  (window as any).XMLHttpRequest = PatchedXHR;

  // ── navigator.sendBeacon ────────────────────────────────────────────────────
  // 阿里云 SLS WebTracking 常用 sendBeacon 上报，绕过 fetch/XHR，需单独拦截。
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const originalSendBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url: string | URL, data?: BodyInit | null): boolean {
      const u = typeof url === 'string' ? url : url?.toString() ?? '';
      if (u && isAliyunLogUrl(u)) {
        // 谎报成功，避免 SDK 重试
        return true;
      }
      return originalSendBeacon(url as any, data as any);
    };
  }

  // ── Image 像素打点 ───────────────────────────────────────────────────────────
  // 部分 WebTracking 通过 new Image().src = url 以 GET 方式上报，
  // 这类请求失败会在控制台刷 net::ERR_CONNECTION_CLOSED。拦截 src 赋值即可。
  try {
    const imgSrcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    if (imgSrcDesc && imgSrcDesc.set) {
      const originalSrcSetter = imgSrcDesc.set;
      Object.defineProperty(HTMLImageElement.prototype, 'src', {
        configurable: true,
        enumerable: imgSrcDesc.enumerable,
        get: imgSrcDesc.get,
        set(value: string) {
          if (typeof value === 'string' && isAliyunLogUrl(value)) {
            // 静默丢弃打点请求
            return;
          }
          originalSrcSetter.call(this, value);
        },
      });
    }
  } catch {
    /* 环境不支持时安全跳过 */
  }
}
