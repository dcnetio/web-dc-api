
import { walletOrigin, walletUrl, walletWindowName } from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { Ed25519PubKey } from "../../common/dc-key/ed25519";
import type { Account, EIP712SignReqMessage, SendMessage, SignReqMessage, SignResponseMessage } from "../../common/types/types";


const appOrigin = typeof window !== "undefined" ? window.location.origin : "";//"http://localhost:3002"
const appUrl = typeof window !== "undefined" ? window.location.href :  "";


// 错误定义
export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}
export const Errors = {
};

export class WalletManager {
  private context: DCContext;
  private walletWindow: Window | null = null;
  private iframeId: string  = 'dcIframeId';
  private walletIframeId: string = 'dcWalletIframeId';
  private channelPort2: MessagePort | null = null;
  constructor(context: DCContext) {
    this.context = context;
  }

  async init():  Promise<boolean> {
    console.log("========init walletManager", appOrigin, walletOrigin);
    if(appOrigin.indexOf(walletOrigin) === -1) {
      return new Promise((resolve, reject) => {
        // html添加iframe标签，id是dcWalletIframe
        const iframe = document.createElement("iframe");
        iframe.id = this.iframeId;
        iframe.src = `${walletUrl}/iframe?parentOrigin=${appOrigin}`;
        iframe.onload = async () => {
          const bool = await this.initConfig(this);
          resolve(bool);
        };
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        window.addEventListener("message", (event) => {
          this.listenFromWallet(event);
        });
      });
    }else {
      return true;
    }
  }
  // iframe加载完成后，发送初始化配置
  async initConfig  (that: WalletManager): Promise<boolean> {
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
      that.sendMessageToIframe(message, 5000 * 10)
        .then((response) => {
          console.log("initConfig response", response);
          if(!response || !response.data || !response.data.data) {
            console.error("initConfig response is null");
            resolve(false);
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if(data.success === false || !messageData.publicKey) {
            console.error("initConfig error", message);
            resolve(false);
            return;
          }
          this.context.publicKey = new Ed25519PubKey(messageData.publicKey);
          resolve(true);
        })
        .catch((error) => {
          console.error("initConfig error", error);
          resolve(false);
        });
    });
  };

  // 判断是否是微信窗口
  private isWechatWindow = (): boolean => {
    // const ua = navigator.userAgent.toLowerCase();
    // return ua.indexOf("micromessenger") !== -1;
    // todo 临时测试
    return true
  };

  // 打开钱包iframe窗口
  async openWalletIframe(): Promise<boolean> {
    return new Promise((resolve, reject) => { 
      const walletIframe = document.getElementById(this.walletIframeId) as HTMLIFrameElement;
      if(walletIframe) {
          resolve(true);
          return;
      }
      // html添加iframe标签，id是dcWalletIframe
      const iframe = document.createElement("iframe");
      iframe.id = this.walletIframeId;
      iframe.src = `${walletUrl}?parentOrigin=${appOrigin}`;
      iframe.onload = async () => {
        resolve(true);
      };
      iframe.onerror = (error) => {
        console.error("openWallet error", error);
        resolve(false);
      };
      document.body.appendChild(iframe);
    });
  }


  async openConnect(): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      if (this.isWechatWindow()) {
        // 微信窗口
        const bool = await this.openWalletIframe();
        if(!bool) {
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
      const message = {
        type: "connect",
        data: {
          origin: appOrigin,
        },
      };
      this.sendMessageToIframe(message, 600000)
        .then((response) => {
          console.log("openConnect response", response);
          if(!response || !response.data || !response.data.data) {
            console.error("openConnect response is null");
            reject(new WalletError("openConnect response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if(data.success === false || !messageData.appAccount) {
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
    });
  }

  // 退出登录 清除iframe中的私钥和公钥
  exitLogin = (): Promise<boolean>  => {
    return new Promise((resolve, reject) => {
      // 每100ms发送一次消息,直到钱包加载完成
      const message = {
        type: "exit",
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          if(!response || !response.data || !response.data.data) {
            console.error("exitLogin response is null");
            reject(new WalletError("exitLogin response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if(data.success === false) {
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
          if(!response || !response.data || !response.data.data) {
            console.error("decrypt response is null");
            reject(new WalletError("decrypt response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if(data.success === false || !messageData) {
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
  sign = (payload: Uint8Array): Promise<Uint8Array>  => {
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
          if(!response || !response.data || !response.data.data) {
            console.error("sign response is null");
            reject(new WalletError("sign response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if(data.success === false || !messageData) {
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
  async signMessage (data: SignReqMessage): Promise<SignResponseMessage | null> {
    return new Promise((resolve, reject) => {
      if (!this.context) {
        console.log("未连接钱包");
        reject(new WalletError("未连接钱包"));
        return;
      }
      const urlWithOrigin = walletUrl + "?origin=" + appOrigin;
      this.initCommChannel();
      this.walletWindow = window.open(urlWithOrigin, walletWindowName);
      // 每100ms发送一次消息,直到钱包加载完成
      const message = {
        type: "signMessage",
        data,
      };
      this.sendMessageToIframe(message, 60000)
        .then((response: MessageEvent | null) => {
          console.log("signMessage response", response);
          if(!response || !response.data || !response.data.data) {
            console.error("signMessage response is null");
            reject(new WalletError("signMessage response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if(data.success === false || !messageData) {
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
    })
  };


  // 签名EIP712消息
  async signEIP712Message (data: EIP712SignReqMessage): Promise<SignResponseMessage | null> {
    return new Promise((resolve, reject) => {
      if (!this.context) {
        console.log("未连接钱包");
        reject(new WalletError("未连接钱包"));
        return;
      }
      const urlWithOrigin = walletUrl + "?origin=" + appOrigin;
      this.initCommChannel();
      this.walletWindow = window.open(urlWithOrigin, walletWindowName);
      // port1 转移给iframe
      const message = {
        type: "signEIP712Message",
        data: data
      };
      this.sendMessageToIframe(message, 60000)
        .then((response) => {
          console.log("signEIP712Message response", response);
          if(!response || !response.data || !response.data.data) {
            console.error("signEIP712Message response is null");
            reject(new WalletError("signEIP712Message response is null"));
            return;
          }
          const data = response.data?.data;
          const messageData = data.message;
          if(data.success === false || !messageData) {
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
    })
  };

  private async listenFromWallet(event: MessageEvent): Promise<void> {
    // if (event.origin !== "todo来源") return; // 可选：对源进行验证
    try {
      const message = event.data;
      if (!message.type) {
        //非钱包插件
        return;
      }
      if (message.type === "walletLoaded") {
        console.log('walletLoaded', message)
        console.log('event.origin', event.origin)
        console.log('walletOrigin', walletOrigin)
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
          if (this.walletWindow) { // 如果钱包已经打开
            try {
              this.walletWindow.postMessage(message, walletOrigin, [this.channelPort2]);
            } catch (error) {
              console.error("postMessage error", error);
            }
          }else { // 如果钱包iframe已经打开
            const iframe = document.getElementById(this.walletIframeId) as HTMLIFrameElement;
            // port1转移给iframe
            if (iframe) {
              try {
                iframe.contentWindow?.postMessage(message, walletOrigin, [this.channelPort2]);
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
        const messageChannel = new MessageChannel();
        iframe.contentWindow?.postMessage(message, walletOrigin, [
          messageChannel.port1,
        ]);
        this.channelPort2 = messageChannel.port2;
        console.log("initCommChannel success");
      } catch (error) {
        console.error("initCommChannel error", error);
      }
    } else {
      console.error("iframe不存在");
    }
  }
  // 利用messageChannel通信
  private async sendMessageToIframe  (
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
          reject("timeout");
        }, timeout);
        messageChannel.port1.onmessage = (event) => {
          clearTimeout(timer);
          messageChannel.port1.close();
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
          reject(error);
        }
      });
    } else {
      console.error("iframe不存在");
      return null;
    }
  };

}
