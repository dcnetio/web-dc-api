

import { APPInfo } from 'lib/common/types/types';

// 定义一个变量，用于存储BroadcastChannel对象

// Dapp信息
//let walletLoadedFlag = false; //钱包已加载标志
let appId = '';
let appName = '';
let appIcon = '';
let appVersion = '';
let version = ''; // 钱包版本


// 初始化DAPP
const initDAPP = function(info: APPInfo):boolean {
    if (info.appId == '' ) {
        console.error('appId is null');
        return false;
    }
    if (info.appName == '' ) {
        console.error('appName is null');
        return false;
    }
    appId = info.appId;
    appName = info.appName;
    appIcon = info.appIcon;
    appVersion = info.appVersion;
    version = info.walletVersion || '';
    return true;
}








export type SignReqMessage = {
    version: string,
    type: string,
    origin: string,
    data: {
        appId: string,
        appName: string,
        appIcon?: string,
        appUrl: string,
        appVersion: string,
        account: string,
        messageType?: string,
        message: string,
    }
}




export default {
    initDAPP,
}