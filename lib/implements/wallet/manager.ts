import { walletOrigin, walletUrl, walletWindowName } from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
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
const timeout = 30000;
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
  constructor(context: DCContext) {
    this.context = context;
  }

  async init(): Promise<boolean> {
    console.log("========init walletManager", appOrigin, walletOrigin);
    const walletIframeOpenFlag =
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).walletIframeOpenFlag !== "undefined"
        ? (globalThis as any).walletIframeOpenFlag
        : true; // 是否需要打开/iframe，默认打开;
    if (!walletIframeOpenFlag) {
      return true;
    }
    const walletOpenFlag =
      typeof globalThis !== "undefined" &&
      typeof (globalThis as any).walletOpenType !== "undefined"
        ? true
        : false; // 用于判断是否是直接打开;
    if (walletOpenFlag || appOrigin.indexOf(walletOrigin) === -1) {
      return new Promise(async (resolve, reject) => {
        // html添加iframe标签，id是dcWalletIframe
        const startTime = Date.now();
        console.log("debug================获取iframe", startTime);
        let iframe = document.getElementById(
          this.iframeId
        ) as HTMLIFrameElement;
        if (!iframe) {
          console.log("debug================没有iframe");
          iframe = document.createElement("iframe");
          iframe.id = this.iframeId;
        }
        (iframe as any).credentialless = true; // iframe和父窗口不可传递cookies等凭证，符合安全规则
        iframe.style.width = "1px";
        iframe.style.height = "1px";

        // 监听钱包iframe发来的消息
        window.addEventListener("message", (event) => {
          this.listenFromWallet(event);
        });
        const iframeLoaded = globalThis && (globalThis as any).iframeLoaded;
        if (!iframeLoaded) {
          iframe.onload = async () => {
            iframe.style.display = "none";
            console.log(
              "debug================init walletManager",
              Date.now() - startTime
            );
            const bool = await this.initConfig(this);
            console.log(
              "debug================init walletManager iframejs bool111",
              bool,
              Date.now() - startTime
            );
            if (bool) {
              this.iframeLoaded = true;
            }
            resolve(bool);
          };
          iframe.src = `${walletUrl}/iframe?parentOrigin=${appOrigin}`;
          document.body.appendChild(iframe);
        } else {
          const bool = await this.initConfig(this);
          console.log(
            "debug================init walletManager iframejs bool222",
            bool,
            Date.now() - startTime
          );
          if (bool) {
            this.iframeLoaded = true;
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
        },
      };
      that
        .sendMessageToIframe(message, 1000 * 50)
        .then((response) => {
          console.log("initConfig response", response);
          if (!response || !response.data || !response.data.data) {
            console.error("initConfig response is null");
            resolve(false);
            return;
          }
          const data = response.data?.data;
          if (data.success === false) {
            console.error("initConfig error", message);
            resolve(false);
            return;
          }
          resolve(true);
        })
        .catch((error) => {
          console.error("initConfig error", error);
          resolve(false);
        });
    });
  }

  //等待钱包页面加载完成
  waitForWalletLoaded = async (
    walletWindow: Window | null,
    timeout: number
  ) => {
    // localStorage中获取是否支持window.opener
    const openerFlag = localStorage.getItem(localStorageKey_dcwallet_opener);
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
          window.removeEventListener("message", listenForWalletLoaded);
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
          localStorage.setItem(localStorageKey_dcwallet_opener, "true");
          clearInterval(interval);
          clearTimeout(timeoutHandle);
          messageChannel.port1.close();
          window.removeEventListener("message", listenForWalletLoaded);
          resolve(true);
        }
      };

      //添加监听事件
      window.addEventListener("message", listenForWalletLoaded);
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

  // 判断是否iframe打开钱包
  private isIframeOpen = (): boolean => {
    const walletOpenType =
      typeof globalThis !== "undefined"
        ? (globalThis as any).walletOpenType
        : ""; // 用于判断是否是直接打开;
    if (walletOpenType == "iframe") {
      return true;
    }
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("micromessenger") !== -1;
    // todo 临时测试
    // return true
  };

  // 打开钱包iframe窗口
  async openWalletIframe(): Promise<boolean> {
    console.log("debug================openWalletIframe", new Date());
    return new Promise((resolve, reject) => {
      console.log("debug================获取钱包iframe", new Date());
      const walletIframe = document.getElementById(
        this.walletIframeId
      ) as HTMLIFrameElement;
      if (walletIframe) {
        resolve(true);
        return;
      }
      // html添加iframe标签，id是dcWalletIframe
      const iframe = document.createElement("iframe");
      iframe.id = this.walletIframeId;
      iframe.src = `${walletUrl}?origin=${appOrigin}`;
      (iframe as any).credentialless = true; // iframe和父窗口不可传递cookies等凭证，符合安全规则
      iframe.onload = async () => {
        console.log("debug================onload", new Date());
      };
      iframe.onerror = (error) => {
        console.error("openWallet error", error);
        resolve(false);
      };
      iframe.setAttribute(
        "sandbox",
        "allow-scripts allow-forms allow-same-origin"
      );
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

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
      resolve(true);
    });
  }

  async removeWalletIframe() {
    const walletIframe = document.getElementById(
      this.walletIframeId
    ) as HTMLIFrameElement;
    if (walletIframe) {
      document.body.removeChild(walletIframe);
    }
  }

  async openConnect(
    accountInfo: AccountInfo = {} as AccountInfo
  ): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.initCommChannel();
      } catch (error) {
        reject(error);
      }
      if (this.isIframeOpen()) {
        // 微信窗口
        const bool = await this.openWalletIframe();
        if (!bool) {
          console.error("openWalletIframe error");
          reject(new WalletError("openWalletIframe error"));
          return;
        }
      } else {
        // 普通窗口
        const urlWithOrigin = walletUrl + "?origin=" + appOrigin;
        this.walletWindow = window.open(urlWithOrigin, walletWindowName);
      }
      console.log("debug================initCommChannel", new Date());
      const shouldReturnUserInfo =
        typeof globalThis !== "undefined" &&
        typeof (globalThis as any).shouldReturnUserInfo !== "undefined"
          ? true
          : false; // 用于判断需要返回用户信息;
      // this.waitForWalletLoaded(this.walletWindow, timeout).then((flag) => {
      //   if (flag) {
      const message = {
        type: "connect",
        data: {
          origin: appOrigin,
          accountInfo: accountInfo || {},
          shouldReturnUserInfo: shouldReturnUserInfo || false,
          attach: "", // 附加参数，以后可以用来传递一些参数
        },
      };
      console.log("debug================sendMessageToIframe", new Date());
      this.sendMessageToIframe(message, 600000)
        .then((response) => {
          console.log("debug================response", new Date());
          console.log("openConnect response", response);
          if (!response || !response.data || !response.data.data) {
            console.error("openConnect response is null");
            reject(new WalletError("openConnect response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false || !messageData.appAccount) {
            console.error("openConnect error", message);
            reject(new WalletError("openConnect appAccount is null"));
            return;
          }
          console.log("openConnect success", messageData);
          resolve(messageData);
        })
        .catch((error) => {
          console.error("openConnect error", error);
          reject(new WalletError("openConnect error"));
        });
      //     }
      // });
    });
  }

  // 退出登录 清除iframe中的私钥和公钥
  exitLogin = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // 每100ms发送一次消息,直到钱包加载完成
      const message = {
        type: "exit",
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          if (!response || !response.data || !response.data.data) {
            console.error("exitLogin response is null");
            reject(new WalletError("exitLogin response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false) {
            console.error("exitLogin error", message);
            reject(new WalletError("exitLogin messageData is null"));
            return;
          }
          resolve(messageData);
        })
        .catch((error) => {
          console.error("exitLogin error", error);
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
          console.log("decrypt response", response);
          if (!response || !response.data || !response.data.data) {
            console.error("decrypt response is null");
            reject(new WalletError("decrypt response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false || !messageData) {
            console.error("decrypt error", message);
            reject(new WalletError("decrypt messageData is null"));
            return;
          }
          console.log("decrypt success", messageData);
          resolve(messageData);
        })
        .catch((error) => {
          console.error("decrypt error", error);
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
            console.error("sign response is null");
            reject(new WalletError("sign response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false || !messageData) {
            console.error("sign error", message);
            reject(new WalletError("sign messageData is null"));
            return;
          }
          resolve(messageData);
        })
        .catch((error) => {
          console.error("sign error", error);
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
      try {
        await this.initCommChannel();
      } catch (error) {
        reject(error);
      }
      if (this.isIframeOpen()) {
        // 微信窗口
        const bool = await this.openWalletIframe();
        if (!bool) {
          console.error("openWalletIframe error");
          reject(new WalletError("openWalletIframe error"));
          return;
        }
      } else {
        // 普通窗口
        const urlWithOrigin = walletUrl + "?origin=" + appOrigin;
        this.walletWindow = window.open(urlWithOrigin, walletWindowName);
      }
      this.initCommChannel();
      // this.waitForWalletLoaded(this.walletWindow, timeout).then((flag) => {
      //   if (flag) {
      // 每100ms发送一次消息,直到钱包加载完成
      const message = {
        type: "signMessage",
        data,
      };
      this.sendMessageToIframe(message, 60000)
        .then((response: MessageEvent | null) => {
          console.log("signMessage response", response);
          if (!response || !response.data || !response.data.data) {
            console.error("signMessage response is null");
            reject(new WalletError("signMessage response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false || !messageData) {
            console.error("signMessage error", message);
            reject(new WalletError("signMessage messageData is null"));
            return;
          }
          console.log("signMessage success", messageData);
          resolve(messageData);
        })
        .catch((error) => {
          console.error("signMessage error", error);
          reject(error);
        });
      //   }
      // });
    });
  }

  // 签名EIP712消息
  async signEIP712Message(
    data: EIP712SignReqMessage
  ): Promise<SignResponseMessage | null> {
    return new Promise(async (resolve, reject) => {
      if (!this.context) {
        console.log("未连接钱包");
        reject(new WalletError("未连接钱包"));
        return;
      }
      try {
        await this.initCommChannel();
      } catch (error) {
        reject(error);
      }
      if (this.isIframeOpen()) {
        // 微信窗口
        const bool = await this.openWalletIframe();
        if (!bool) {
          console.error("openWalletIframe error");
          reject(new WalletError("openWalletIframe error"));
          return;
        }
      } else {
        // 普通窗口
        const urlWithOrigin = walletUrl + "?origin=" + appOrigin;
        this.walletWindow = window.open(urlWithOrigin, walletWindowName);
      }
      this.initCommChannel();
      // this.waitForWalletLoaded(this.walletWindow, timeout).then((flag) => {
      //   if (flag) {
      // port1 转移给iframe
      const message = {
        type: "signEIP712Message",
        data: data,
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          console.log("signEIP712Message response", response);
          if (!response || !response.data || !response.data.data) {
            console.error("signEIP712Message response is null");
            reject(new WalletError("signEIP712Message response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if (data.success === false || !messageData) {
            console.error("signEIP712Message error", message);
            reject(new WalletError("signEIP712Message messageData is null"));
            return;
          }
          console.log("messageData success", messageData);
          resolve(messageData);
        })
        .catch((error) => {
          console.error("signEIP712Message error", error);
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
        console.log("debug================walletLoaded", new Date());
        console.log("walletLoaded", message);
        console.log("event.origin", event.origin);
        console.log("walletOrigin", walletOrigin);
        //钱包加载完成
        if (event.origin !== walletOrigin) {
          console.log("来源不匹配", event.origin, walletOrigin);
          return;
        }
        // 钱包打开成功
        console.log("钱包打开成功", message.data);
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
              console.error("postMessage error", error);
            }
          } else {
            // 如果钱包iframe已经打开
            const iframe = document.getElementById(
              this.walletIframeId
            ) as HTMLIFrameElement;
            // port1转移给iframe
            if (iframe) {
              try {
                iframe.contentWindow?.postMessage(message, walletOrigin, [
                  this.channelPort2,
                ]);
              } catch (error) {
                console.error("postMessage error", error);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("message error", error);
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
            console.error("iframe加载超时");
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
        console.error("initCommChannel error", error);
        throw error;
      }
    } else {
      console.log("iframe不存在");
    }
  }
  // 利用messageChannel通信
  private async sendMessageToIframe(
    message: SendMessage<any>,
    timeout: number
  ): Promise<MessageEvent | null> {
    const iframe = document.getElementById(this.iframeId) as HTMLIFrameElement;
    // port2转移给iframe
    if (iframe) {
      const messageChannel = new MessageChannel();
      // 等待钱包iframe返回,并关闭channel,超时时间timeout
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (this.isIframeOpen()) {
            // 微信窗口
            this.removeWalletIframe();
          }
          reject("timeout");
        }, timeout);
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timer);
          messageChannel.port1.close();
          if (event.data && event.data.type !== "initConfigResponse") {
            if (this.isIframeOpen()) {
              // 微信窗口
              this.removeWalletIframe();
            }
          }
          resolve(event);
        };
        try {
          iframe.contentWindow?.postMessage(message, walletOrigin, [
            messageChannel.port2,
          ]);
        } catch (error) {
          console.error("sendMessageToIframe postMessage error", error);
          clearTimeout(timer);
          messageChannel.port1.close();
          if (this.isIframeOpen()) {
            // 微信窗口
            this.removeWalletIframe();
          }
          reject(error);
        }
      });
    } else {
      console.log("iframe不存在");
      return null;
    }
  }
}
