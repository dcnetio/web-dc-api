import {
  isIframeOpen,
  shouldReturnUserInfo,
  walletIframeOpenFlag,
  walletOrigin,
  walletUrl,
  walletWindowName,
} from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";
import type {
  Account,
  AccountInfo,
  EIP712SignReqMessage,
  SendMessage,
  SignReqMessage,
  SignResponseMessage,
} from "../../common/types/types";

const appOrigin = typeof window !== "undefined" ? window.location.origin : ""; //"http://localhost:3002"
const appUrl = typeof window !== "undefined" ? window.location.href : "";

const localStorageKey_dcwallet_opener = "dcwallet_opener";
const walletConnectTimeout = 300000;
// 错误定义
export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}
export const Errors = {};

export class WalletManager {
  private context: DCContext;
  private walletWindow: Window | null = null;
  private iframeId: string = "dcIframeId";
  private walletIframeId: string = "dcWalletIframeId";
  private channelPort2: MessagePort | null = null;
  private iframeLoaded = false;
  private walletIframeLoadPromise: Promise<boolean> | null = null;
  private openConnectPromise: Promise<Account> | null = null;
  private messageListener: ((event: MessageEvent) => void) | null = null;
  constructor(context: DCContext) {
    this.context = context;
  }

  private getWalletPageUrl(): string {
    const pageUrl = new URL(`${walletUrl.replace(/\/$/, "")}/home`);
    pageUrl.searchParams.set("origin", appOrigin);

    const theme =
      typeof globalThis !== "undefined"
        ? (globalThis as { dc_wallet_theme?: unknown }).dc_wallet_theme
        : undefined;
    if (theme === "light" || theme === "dark") {
      pageUrl.searchParams.set("dc_wallet_theme", theme);
    }

    const themeColor = this.context.appInfo.themeColor;
    if (
      typeof themeColor === "string" &&
      /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(themeColor)
    ) {
      pageUrl.searchParams.set("themeColor", themeColor);
    }

    return pageUrl.toString();
  }

  async init(): Promise<boolean> {
    console.log("========init walletManager", appOrigin, walletOrigin);
    // Check if we are in a browser environment with document access
    if (typeof document === "undefined") {
      console.warn(
        "WalletManager: document is undefined, skipping iframe initialization.",
      );
      return true; // or false, depending on if we want to signal failure or just skip
    }

    const that = this;

    if (walletIframeOpenFlag || appOrigin.indexOf(walletOrigin) === -1) {
      return new Promise(async (resolve, reject) => {
        // html添加iframe标签，id是dcWalletIframe
        const startTime = Date.now();
        let iframe = document.getElementById(
          that.iframeId,
        ) as HTMLIFrameElement;
        if (!iframe) {
          console.log("debug================没有iframe");
          iframe = document.createElement("iframe");
          iframe.id = that.iframeId;
        }
        // This hidden iframe only initializes the wallet message channel. It must
        // never be able to trigger a camera or microphone permission prompt.
        iframe.allow = "camera 'none'; microphone 'none'";
        // (iframe as any).credentialless = true; // iframe和父窗口不可传递cookies等凭证，符合安全规则
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        if (typeof window !== "undefined" && !this.messageListener) {
          this.messageListener = (event) => that.listenFromWallet(event);
          window.addEventListener("message", this.messageListener);
        }
        const iframeLoaded = that.iframeLoaded;
        if (!iframeLoaded) {
          iframe.onload = async () => {
            iframe.style.display = "none";
            const bool = await that.initConfig(that);
            if (bool) {
              that.iframeLoaded = true;
            }
            resolve(bool);
          };
          iframe.onerror = () => {
            const error = new WalletError(
              "钱包初始化页面加载失败，请检查网络后重试",
            );
            console.warn(error.message);
            iframe.remove();
            this.reportWalletFailure(error.message);
            resolve(false);
          };
          iframe.src = `${walletUrl}/iframe?parentOrigin=${appOrigin}`;
          document.body.appendChild(iframe);
        } else {
          const bool = await that.initConfig(that);
          if (bool) {
            that.iframeLoaded = true;
          }
          resolve(bool);
        }
      });
    } else {
      return true;
    }
  }
  // iframe加载完成后，发送初始化配置
  async initConfig(that: WalletManager): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const message = {
        type: "init",
        data: {
          appId: this.context.appInfo.appId,
          appName: this.context.appInfo.appName,
          appIcon: this.context.appInfo.appIcon,
          appVersion: this.context.appInfo.appVersion,
          appUrl: appUrl,
          themeColor: this.context.appInfo.themeColor,
        },
      };
      that
        .sendMessageToIframe(message, 1000 * 50)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("initConfig response is null");
            resolve(false);
            return;
          }
          const data = response.data?.data;
          if (data.success === false) {
            console.warn("initConfig error", message);
            resolve(false);
            return;
          }
          resolve(true);
        })
        .catch((error) => {
          console.warn("initConfig error", error);
          resolve(false);
        });
    });
  }

  //等待钱包页面加载完成
  waitForWalletLoaded = async (
    walletWindow: Window | null,
    timeout: number,
  ) => {
    // localStorage中获取是否支持window.opener
    let openerFlag = null;
    if (typeof localStorage !== "undefined") {
      openerFlag = localStorage.getItem(localStorageKey_dcwallet_opener);
    }

    let waitTimeCount = 1;
    if (openerFlag == "true") {
      waitTimeCount = 3;
    }
    // 开启定时器500ms检查一次,第一次等待1.5秒,如果没有加载完成,则发送轮询请求
    return new Promise((resolve) => {
      let messageChannel = new MessageChannel();
      const onMessage = (event: MessageEvent) => {
        const message = event.data;
        if (message.type === "walletLoaded") {
          clearInterval(interval);
          clearTimeout(timeoutHandle);
          messageChannel.port1.close();
          if (typeof window !== "undefined") {
            window.removeEventListener("message", listenForWalletLoaded);
          }
          resolve(true);
        }
      };
      messageChannel.port1.onmessage = onMessage;
      const checkMessage = {
        type: "checkWalletLoaded",
        origin: appOrigin,
      };
      let walletLoadedFlag = false;
      const listenForWalletLoaded = (event: MessageEvent) => {
        //判断消息来源
        if (event.origin !== walletOrigin) {
          return;
        }
        if (event.source != null && event.source != walletWindow) {
          //非当前操作打开的窗口
          return;
        }
        const data = event.data;
        if (!data.type) {
          //非钱包插件
          return;
        }
        console.log("debug================listenForWalletLoaded", new Date());
        if (data.type === "walletLoaded") {
          //钱包加载完成
          walletLoadedFlag = true;
          if (typeof localStorage !== "undefined") {
            localStorage.setItem(localStorageKey_dcwallet_opener, "true");
          }
          clearInterval(interval);
          clearTimeout(timeoutHandle);
          messageChannel.port1.close();
          if (typeof window !== "undefined") {
            window.removeEventListener("message", listenForWalletLoaded);
          }
          resolve(true);
        }
      };

      //添加监听事件
      if (typeof window !== "undefined") {
        window.addEventListener("message", listenForWalletLoaded);
      }
      const interval = setInterval(() => {
        if (walletLoadedFlag) {
          clearInterval(interval);
          messageChannel.port1.close();
        } else {
          if (waitTimeCount > 0) {
            waitTimeCount--;
          } else {
            try {
              walletWindow?.postMessage(checkMessage, walletOrigin, [
                messageChannel.port2,
              ]);
            } catch (e) {
              //不做处理
              // 提示错误
              console.log("错误", e);
              if (messageChannel) {
                messageChannel.port1.close();
              }
              messageChannel = new MessageChannel();
              messageChannel.port1.onmessage = onMessage;
            }
          }
        }
      }, 500);
      //添加超时处理
      const timeoutHandle = setTimeout(() => {
        clearInterval(interval);
        messageChannel.port1.close();
        window.removeEventListener("message", listenForWalletLoaded);
        resolve(false);
      }, timeout);
    });
  };

  // 打开钱包iframe窗口
  async openWalletIframe(pageUrl?: string): Promise<boolean> {
    const walletPageUrl = pageUrl || this.getWalletPageUrl();
    const walletIframe = document.getElementById(
      this.walletIframeId,
    ) as HTMLIFrameElement;
    if (walletIframe) {
      if (walletIframe.src === walletPageUrl) {
        return true;
      }
      if (this.walletIframeLoadPromise) {
        return this.walletIframeLoadPromise;
      }

      this.walletIframeLoadPromise = new Promise((resolve) => {
        let settled = false;
        let loadTimeout: ReturnType<typeof setTimeout> | undefined;
        const settle = (result: boolean) => {
          if (settled) {
            return;
          }
          settled = true;
          if (loadTimeout) {
            clearTimeout(loadTimeout);
          }
          this.walletIframeLoadPromise = null;
          resolve(result);
        };
        walletIframe.onload = () => settle(true);
        walletIframe.onerror = () => {
          this.reportWalletFailure("钱包页面加载失败，请检查网络后重试");
          settle(false);
        };
        loadTimeout = setTimeout(() => {
          if (settled) {
            return;
          }
          this.reportWalletFailure("钱包页面加载超时，请检查网络后重试");
          settle(false);
        }, 15000);
        walletIframe.src = walletPageUrl;
      });
      return this.walletIframeLoadPromise;
    }
    if (this.walletIframeLoadPromise) {
      return this.walletIframeLoadPromise;
    }

    this.walletIframeLoadPromise = new Promise((resolve) => {
      let settled = false;
      let loadTimeout: ReturnType<typeof setTimeout> | undefined;
      const settle = (result: boolean) => {
        if (settled) {
          return;
        }
        settled = true;
        if (loadTimeout) {
          clearTimeout(loadTimeout);
        }
        this.walletIframeLoadPromise = null;
        resolve(result);
      };
      // html添加iframe标签，id是dcWalletIframe
      const iframe = document.createElement("iframe");
      iframe.id = this.walletIframeId;

      iframe.onload = async () => {
        console.log("debug================onload", new Date());
        settle(true);
      };
      iframe.onerror = (error) => {
        console.warn("openWallet error", error);
        iframe.remove();
        this.reportWalletFailure("钱包页面加载失败，请检查网络后重试");
        settle(false);
      };
      loadTimeout = setTimeout(() => {
        if (settled) {
          return;
        }
        iframe.remove();
        this.reportWalletFailure("钱包页面加载超时，请检查网络后重试");
        settle(false);
      }, 15000);
      iframe.src = walletPageUrl;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;publickey-credentials-create; publickey-credentials-get";

      // iframe.sandbox = "allow-scripts allow-forms allow-same-origin";
      // 直接设置 iframe 的样式以覆盖整个页面
      // 最大可能的 z-index
      iframe.style.cssText = `
          z-index: 2147483647;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #fff;
          border: none;
          display: block;

          isolation: isolate;
          transform: translateZ(0);
        `;
      iframe.allowFullscreen = true;
      document.body.appendChild(iframe);
    });
    return this.walletIframeLoadPromise;
  }

  async removeWalletIframe() {
    const walletIframe = document.getElementById(
      this.walletIframeId,
    ) as HTMLIFrameElement;
    if (walletIframe) {
      document.body.removeChild(walletIframe);
    }
  }

  /**
   * 打开钱包页面并延迟发送消息（等待 wallet-web JS 初始化）
   * @returns 是否成功打开钱包页面
   */
  private async openWalletAndSend(msg: any): Promise<boolean> {
    if (isIframeOpen()) {
      const ok = await this.openWalletIframe(this.getWalletPageUrl());
      if (!ok) return false;
    } else {
      this.walletWindow = window.open(
        this.getWalletPageUrl(),
        walletWindowName,
      );
      if (!this.walletWindow) return false;
    }

    // 等待 wallet-web JS 监听器就绪后再发送
    await new Promise<void>((resolve) =>
      setTimeout(resolve, isIframeOpen() ? 300 : 800),
    );

    if (isIframeOpen()) {
      const iframe = document.getElementById(
        this.walletIframeId,
      ) as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage(msg, walletOrigin);
    } else if (this.walletWindow) {
      this.walletWindow.postMessage(msg, walletOrigin);
    }
    return true;
  }

  /**
   * 初始化 iframe 通道并打开钱包页面（connect / signMessage / signEIP712Message 共用）
   * @returns null 表示成功，否则返回错误
   */
  private async openWalletForChannel(): Promise<WalletError | null> {
    try {
      await this.initCommChannel();
    } catch (error) {
      return error instanceof WalletError
        ? error
        : new WalletError(String(error));
    }

    if (isIframeOpen()) {
      const ok = await this.openWalletIframe();
      if (!ok) {
        this.channelPort2 = null;
        return new WalletError("openWalletIframe error");
      }
    } else {
      this.walletWindow = window.open(
        this.getWalletPageUrl(),
        walletWindowName,
      );
      if (!this.walletWindow) {
        this.channelPort2 = null;
        const err = new WalletError("钱包窗口被浏览器拦截，请允许弹窗后重试");
        this.reportWalletFailure(err.message);
        return err;
      }
    }
    return null;
  }

  async openConnect(
    accountInfo: AccountInfo = {} as AccountInfo,
  ): Promise<Account> {
    if (this.openConnectPromise) {
      return this.openConnectPromise;
    }

    const connectPromise = this.openConnectInternal(accountInfo);
    this.openConnectPromise = connectPromise;
    try {
      return await connectPromise;
    } finally {
      if (this.openConnectPromise === connectPromise) {
        this.openConnectPromise = null;
      }
    }
  }

  private async openConnectInternal(
    accountInfo: AccountInfo = {} as AccountInfo,
  ): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      const err = await this.openWalletForChannel();
      if (err) {
        reject(err);
        return;
      }

      const message = {
        type: "connect",
        data: {
          origin: appOrigin,
          accountInfo: accountInfo || {},
          shouldReturnUserInfo: shouldReturnUserInfo || false,
          attach: "",
          themeColor: this.context.appInfo.themeColor,
        },
      };
      this.sendMessageToIframe(message, walletConnectTimeout)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("openConnect response is null");
            reject(new WalletError("openConnect response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false) {
            reject(
              new WalletError(this.getWalletErrorMessage(data, "钱包连接失败")),
            );
            return;
          }
          if (!messageData?.appAccount) {
            console.warn("openConnect error", message);
            this.channelPort2 = null;
            reject(new WalletError("openConnect appAccount is null"));
            return;
          }
          this.channelPort2 = null;
          resolve(messageData);
        })
        .catch((error) => {
          console.warn("openConnect error", error);
          this.channelPort2 = null;
          reject(
            error instanceof WalletError
              ? error
              : new WalletError("openConnect error"),
          );
        });
      //     }
      // });
    });
  }

  // 打开钱包页面进行存储套餐续订
  async openStoragePurchase(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const opened = await this.openWalletAndSend({
        type: "renewStorage",
        origin: appOrigin,
        data: {
          appId: this.context.appInfo.appId,
          appName: this.context.appInfo.appName,
          appIcon: this.context.appInfo.appIcon,
          appVersion: this.context.appInfo.appVersion,
          appUrl: appUrl,
          themeColor: this.context.appInfo.themeColor,
        },
      });
      if (!opened) {
        resolve(false);
        return;
      }

      let settled = false;

      const cleanup = () => {
        settled = true;
        clearTimeout(timeoutId);
        window.removeEventListener("message", handler);
      };

      const handler = (event: MessageEvent) => {
        if (event.origin !== walletOrigin) return;
        const msg = event.data;
        if (msg?.type === "renewStorageResult") {
          cleanup();
          if (isIframeOpen()) {
            this.removeWalletIframe();
          }
          resolve(msg?.data?.success === true);
        }
      };

      const timeoutId = setTimeout(() => {
        if (!settled) {
          cleanup();
          resolve(false);
        }
      }, walletConnectTimeout);

      window.addEventListener("message", handler);
    });
  }

  // 获取用户登录过的
  async getLoginInfo(): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.initCommChannel();
      } catch (error) {
        reject(error);
        return;
      }
      const message = {
        type: "getLoginInfo",
      };
      this.sendMessageToIframe(message, 10000)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("getLoginInfo response is null");
            this.channelPort2 = null;
            reject(new WalletError("getLoginInfo response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData: Account = data.message;
          if (data.success === false) {
            this.channelPort2 = null;
            reject(
              new WalletError(
                this.getWalletErrorMessage(data, "获取钱包登录信息失败"),
              ),
            );
            return;
          }
          if (!messageData) {
            this.channelPort2 = null;
            reject(new WalletError("getLoginInfo messageData is null"));
            return;
          }
          this.channelPort2 = null;
          resolve(messageData);
        })
        .catch((error) => {
          console.warn("getLoginInfo error", error);
          this.channelPort2 = null;
          reject(error);
          return;
        });
    });
  }

  // 退出登录 清除iframe中的私钥和公钥
  exitLogin = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // 私钥是否存在，存在清楚，不存在发送iframe
      if (this.context.privateKey) {
        this.context.privateKey = undefined;
        this.context.publicKey = undefined;
        resolve(true);
        return;
      }
      const message = {
        type: "exit",
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("exitLogin response is null");
            reject(new WalletError("exitLogin response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false) {
            console.warn("exitLogin error", message);
            reject(
              new WalletError(this.getWalletErrorMessage(data, "退出钱包失败")),
            );
            return;
          }
          resolve(messageData);
        })
        .catch((error) => {
          console.warn("exitLogin error", error);
          reject(error);
        });
    });
  };

  /**
   * 用私钥解密数据
   * @param payload 需要解密的数据
   * @returns 解密结果
   */

  decrypt = (payload: Uint8Array): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const message = {
        type: "decrypt",
        data: {
          message: payload,
        },
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("decrypt response is null");
            reject(new WalletError("decrypt response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false) {
            reject(
              new WalletError(this.getWalletErrorMessage(data, "钱包解密失败")),
            );
            return;
          }
          if (!messageData) {
            console.warn("decrypt error", message);
            reject(new WalletError("decrypt messageData is null"));
            return;
          }
          resolve(messageData);
        })
        .catch((error) => {
          console.warn("decrypt error", error);
          reject(error);
        });
    });
  };

  /**
   * 签名方法
   * @param payload 需要签名的数据
   * @returns 签名结果
   */
  sign = (payload: Uint8Array): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      // 每100ms发送一次消息,直到钱包加载完成
      const message = {
        type: "sign",
        data: {
          message: payload,
        },
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("sign response is null");
            reject(new WalletError("sign response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false) {
            reject(
              new WalletError(this.getWalletErrorMessage(data, "钱包签名失败")),
            );
            return;
          }
          if (!messageData) {
            console.warn("sign error", message);
            reject(new WalletError("sign messageData is null"));
            return;
          }
          resolve(messageData);
        })
        .catch((error) => {
          console.warn("sign error", error);
          reject(error);
        });
    });
  };

  // 签名普通消息
  async signMessage(data: SignReqMessage): Promise<SignResponseMessage | null> {
    return new Promise(async (resolve, reject) => {
      if (!this.context) {
        console.log("未连接钱包");
        reject(new WalletError("未连接钱包"));
        return;
      }

      const err = await this.openWalletForChannel();
      if (err) {
        reject(err);
        return;
      }

      const message = {
        type: "signMessage",
        data,
      };
      this.sendMessageToIframe(message, 60000)
        .then((response: MessageEvent | null) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("signMessage response is null");
            this.channelPort2 = null;
            reject(new WalletError("signMessage response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false) {
            this.channelPort2 = null;
            reject(
              new WalletError(this.getWalletErrorMessage(data, "消息签名失败")),
            );
            return;
          }
          if (!messageData) {
            console.warn("signMessage error", message);
            this.channelPort2 = null;
            reject(new WalletError("signMessage messageData is null"));
            return;
          }
          this.channelPort2 = null;
          resolve(messageData);
        })
        .catch((error) => {
          console.warn("signMessage error", error);
          this.channelPort2 = null;
          reject(error);
        });
      //   }
      // });
    });
  }

  // 签名EIP712消息
  async signEIP712Message(
    data: EIP712SignReqMessage,
  ): Promise<SignResponseMessage | null> {
    return new Promise(async (resolve, reject) => {
      if (!this.context) {
        console.log("未连接钱包");
        reject(new WalletError("未连接钱包"));
        return;
      }

      const err = await this.openWalletForChannel();
      if (err) {
        reject(err);
        return;
      }

      const message = {
        type: "signEIP712Message",
        data: data,
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.warn("signEIP712Message response is null");
            this.channelPort2 = null;
            reject(new WalletError("signEIP712Message response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false) {
            this.channelPort2 = null;
            reject(
              new WalletError(
                this.getWalletErrorMessage(data, "EIP-712 签名失败"),
              ),
            );
            return;
          }
          if (!messageData) {
            console.warn("signEIP712Message error", message);
            this.channelPort2 = null;
            reject(new WalletError("signEIP712Message messageData is null"));
            return;
          }
          this.channelPort2 = null;
          resolve(messageData);
        })
        .catch((error) => {
          console.warn("signEIP712Message error", error);
          this.channelPort2 = null;
          reject(error);
        });
      //   }
      // });
    });
  }

  private async listenFromWallet(event: MessageEvent): Promise<void> {
    // if (event.origin !== "todo来源") return; // 可选：对源进行验证
    try {
      const message = event.data;
      if (!message.type) {
        //非钱包插件
        return;
      }
      if (message.type === "walletLoaded") {
        //钱包加载完成
        if (event.origin !== walletOrigin) {
          console.log("来源不匹配", event.origin, walletOrigin);
          return;
        }
        // 钱包打开成功
        if (this.channelPort2) {
          //port2转移给钱包
          const message = {
            type: "channelPort2",
            origin: appOrigin,
          };
          if (this.walletWindow) {
            // 如果钱包已经打开
            try {
              this.walletWindow.postMessage(message, walletOrigin, [
                this.channelPort2,
              ]);
            } catch (error) {
              console.warn("postMessage error", error);
            }
          } else {
            // 如果钱包iframe已经打开
            const iframe = document.getElementById(
              this.walletIframeId,
            ) as HTMLIFrameElement;
            // port1转移给iframe
            if (iframe) {
              try {
                iframe.contentWindow?.postMessage(message, walletOrigin, [
                  this.channelPort2,
                ]);
              } catch (error) {
                console.warn("postMessage error", error);
              }
            }
          }
          this.channelPort2 = null;
        }
      }
    } catch (error) {
      console.warn("message error", error);
    }
  }

  private async initCommChannel(): Promise<void> {
    const iframe = document.getElementById(this.iframeId) as HTMLIFrameElement;
    // port1转移给iframe
    if (iframe) {
      const message = {
        code: "0",
        type: "channelPort1",
      };
      try {
        let count = 0;
        while (!this.iframeLoaded) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          count++;
          if (count > 100) {
            console.warn("iframe加载超时");
            throw new Error("iframe加载超时");
          }
        }

        const messageChannel = new MessageChannel();
        iframe.contentWindow?.postMessage(message, walletOrigin, [
          messageChannel.port1,
        ]);
        this.channelPort2 = messageChannel.port2;
        console.log("initCommChannel success");
      } catch (error) {
        console.warn("initCommChannel error", error);
        this.reportWalletFailure("钱包初始化超时，请检查网络后重试");
        throw error;
      }
    } else {
      const error = new WalletError("钱包初始化失败，请重新打开登录页面");
      console.warn(error.message);
      this.reportWalletFailure(error.message);
      throw error;
    }
  }
  // 利用messageChannel通信
  private async sendMessageToIframe(
    message: SendMessage<any>,
    timeout: number,
    removeFlag: boolean = true,
  ): Promise<MessageEvent | null> {
    const iframe = document.getElementById(this.iframeId) as HTMLIFrameElement;
    // port2转移给iframe
    if (iframe) {
      const messageChannel = new MessageChannel();
      // 等待钱包iframe返回,并关闭channel,超时时间timeout
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          messageChannel.port1.close();
          if (isIframeOpen() && removeFlag) {
            // 微信窗口
            this.removeWalletIframe();
          }
          const error = new WalletError("钱包通信超时，请检查网络后重试");
          this.reportWalletFailure(error.message);
          reject(error);
        }, timeout);
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timer);
          messageChannel.port1.close();
          if (
            event.data &&
            event.data.type !== "initConfigResponse" &&
            isIframeOpen() &&
            removeFlag
          ) {
            this.removeWalletIframe();
          }
          resolve(event);
        };
        try {
          iframe.contentWindow?.postMessage(message, walletOrigin, [
            messageChannel.port2,
          ]);
        } catch (error) {
          console.warn("sendMessageToIframe postMessage error", error);
          clearTimeout(timer);
          messageChannel.port1.close();
          if (isIframeOpen() && removeFlag) {
            // 微信窗口
            this.removeWalletIframe();
          }
          this.reportWalletFailure("钱包通信失败，请检查网络后重试");
          reject(error);
        }
      });
    } else {
      console.log("iframe不存在");
      return null;
    }
  }

  private reportWalletFailure(message: string): void {
    if (typeof window === "undefined" || typeof CustomEvent !== "function") {
      return;
    }
    window.dispatchEvent(
      new CustomEvent("dcwallet:error", { detail: { message } }),
    );
  }

  private getWalletErrorMessage(data: any, fallback: string): string {
    if (typeof data?.message === "string" && data.message) {
      return data.message;
    }
    if (typeof data?.error === "string" && data.error) {
      return data.error;
    }
    return fallback;
  }
}
