
import { walletOrigin, walletUrl, walletWindowName } from "../../common/define";
import { DCContext } from "../../../lib/interfaces/DCContext";
import { Ed25519PubKey } from "lib/common/dc-key/ed25519";


const appOrigin = typeof window !== "undefined" ? window.location.origin : "";//"http://localhost:3002"
const appUrl = typeof window !== "undefined" ? window.location.href :  "";

let defaultPublicKey: Ed25519PubKey | null = null;

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
  private iframeId: string  = 'dcWalletIframe';
  private channelPort2: MessagePort | null = null;
  constructor(context: DCContext) {
    this.context = context;
  }

  async init():  Promise<Ed25519PubKey | null> {
    if(appOrigin.indexOf(walletOrigin) === -1) {
      return new Promise((resolve, reject) => {
        // html添加iframe标签，id是dcWalletIframe
        const iframe = document.createElement("iframe");
        iframe.id = this.iframeId;
        iframe.src = `${walletUrl}/iframe?parentOrigin=${appOrigin}`;
        iframe.onload = async () => {
          const publicKey = await this.initConfig(this);
          resolve(publicKey);
        };
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        window.addEventListener("message", (event) => {
          this.listenFromWallet(event);
        });
      });
    }else {
      return null;
    }
  }
  // iframe加载完成后，发送初始化配置
  async initConfig  (that: WalletManager): Promise<Ed25519PubKey | null> {
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
            resolve(null);
            return;
          }
          defaultPublicKey = response.data.data.publicKey;
          resolve(defaultPublicKey);
        })
        .catch((error) => {
          console.error("initConfig error", error);
          resolve(null);
        });
    });
  };



  async openConnect() {
    return new Promise((resolve, reject) => {
      const urlWithOrigin = walletUrl + "?origin=" + appOrigin;
      this.walletWindow = window.open(urlWithOrigin, walletWindowName);
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
          if (response) {
            const data = response.data.data;
            console.log("openConnect success", data);
            // 公钥
            if(!data.account) {
              console.error("openConnect response is null");
              reject(new WalletError("openConnect response is null"));
            }
            resolve(data);
          } else {
            console.error("openConnect response is null");
            reject(new WalletError("openConnect response is null"));
          }
        })
        .catch((error) => {
          console.error("openConnect error", error);
          reject(new WalletError("openConnect error"));
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
            console.error("initConfig response is null");
            reject(new WalletError("initConfig response is null"));
            return;
          }
          const data = response.data.data;
          console.log("decrypt success", data);
          if(!data.success) {
            console.error("decrypt not success");
            reject(new WalletError("decrypt not success"));
          }
          if(!data.message) {
            console.error("decrypt response is null");
            reject(new WalletError("decrypt response is null"));
          }
          resolve(data.message);
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
          console.log("sign response", response);
          if(!response || !response.data || !response.data.data) {
            console.error("initConfig response is null");
            reject(new WalletError("initConfig response is null"));
            return;
          }
          const data = response.data.data;
          console.log("sign success", data);
          if(!data.success) {
            console.error("sign not success");
            reject(new WalletError("sign not success"));
          }
          if(!data.message) {
            console.error("sign response is null");
            reject(new WalletError("sign response is null"));
          }
          resolve(data.message);
        })
        .catch((error) => {
          console.error("sign error", error);
          reject(error);
        });
    });
  };


  // 签名普通消息
  async signMessage (data:object) {
    // if (!accountInfo.account) {
    //   console.log("未连接钱包");
    //   return;
    // }
    const urlWithOrigin = walletUrl + "?origin=" + appOrigin;
    this.initCommChannel();
    this.walletWindow = window.open(urlWithOrigin, walletWindowName);
    // 每100ms发送一次消息,直到钱包加载完成
    const message = {
      type: "signMessage",
      data,
    };
    this.sendMessageToIframe(message, 60000)
      .then((response) => {
        console.log("signMessage response", response);
      })
      .catch((error) => {
        console.error("signMessage error", error);
      });
  };


  // 签名EIP712消息
  async signEIP712Message  (data: object) {
    if (!this.context) {
      console.log("未连接钱包");
      return;
    }
    const publicKey = this.context.getPublicKey();
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
      })
      .catch((error) => {
        console.error("signEIP712Message error", error);
      });
  };

  private async listenFromWallet(event: MessageEvent) {
    console.log('=========listenFromWallet', event.data)
    // if (event.origin !== "todo来源") return; // 可选：对源进行验证
    try {
      const data = event.data;
      if (!data.type) {
        //非钱包插件
        return;
      }
      if (data.type === "walletLoaded") {
        console.log('walletLoaded', data)
        console.log('event.origin', event.origin)
        console.log('walletOrigin', walletOrigin)
        //钱包加载完成
        if (event.origin !== walletOrigin) {
          console.log("来源不匹配", event.origin, walletOrigin);
          return;
        }
        // 钱包打开成功
        console.log("钱包打开成功", data.data);
        if (this.channelPort2) {
          //port2转移给钱包
          const message = {
            type: "channelPort2",
            origin: appOrigin,
          };
          if (this.walletWindow) {
            try {
              this.walletWindow.postMessage(message, walletOrigin, [this.channelPort2]);
            } catch (error) {
              console.error("postMessage error", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("message error", error);
    }
  }

  private async initCommChannel() {
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
    message: object,
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
