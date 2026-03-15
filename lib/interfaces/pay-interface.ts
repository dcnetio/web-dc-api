import { pb } from "../proto/pay_server_proto";

export interface IRenewPackageInfo {
  packageId: string;
  packageCode: string;
  pkgType?: number;
  displayName: string;
  durationDays?: number;
  amountCents?: number;
  currency?: string;
  serviceAppid?: string;
  scene?: string;
  aiAppid?: string;
  aiAuthor?: string;
  aiTheme?: string;
  aiModel?: string;
  // 管理端扩展字段
  bussdesc?: string;
  imglist?: string;
  checkStatus?: number; // 0=未审核/待审核 1=待审核 2=审核通过 3=审核被拒 (依后端定义而定)
  checkTime?: string;
  createTime?: string;
  chainPkgId?: number;
  spaceSize?: number;
}

export type PaymentPackageType = 1 | 2 | 3 | 4;

export interface IPackageApplyRequest {
  pkgType: number;
  scene?: string;
  bussdesc?: string;
  imglist?: string;
  pkgName: string;
  lang?: string;
  amount: number;       // 分
  currency?: string;    // 默认 CNY
  validDays?: number;
  pkgRights?: Record<string, any> | string;
  theme?: string;
  themeAuthor?: string;
  themeAppid?: string;
  serviceAppid?: string;
  chainPkgId?: number;
  spaceSize?: number;
}

export interface IPackageConfigFilter {
  pageNum?: number;
  pageSize?: number;
  pkgType?: number;      // -1 表示所有
  checkStatus?: number;  // 0表示所有，1待审核，2审核通过，3审核被拒
  appid?: string;        // 仅根据AppID过滤
}

export interface IPackageConfigListResult {
  list: IRenewPackageInfo[];
  total: number;
}

export type PaymentGatewayScene = string;

export interface IPendingGatewayPayment {
  scene: PaymentGatewayScene;
  outTradeNo?: string;
  packageCode: string;
  packageId?: string;
  packageName: string;
  amountCents: number;
  durationDays?: number;
  payload?: Record<string, any>;
  createdAt: number;
}

export interface IPaymentOrderRecord {
  outTradeNo: string;
  account: string;
  dappid: string;
  packageId: string;
  packageName: string;
  packageCode: string;
  amountCents: number;
  payStatus: number;
  payStatusText: string;
  tradeState: string;
  tradeStateText: string;
  tradeType: string;
  transactionId: string;
  successTime: string;
  createdAt: string;
  scene: PaymentGatewayScene | "UNKNOWN";
}

export interface IPayOperations {
  /**
   * 配置服务端地址信息
   */
  config(options: {
    payPeerUrl?: string;
    hostedPayBaseUrl?: string;
    payApiBaseUrl?: string;
  }): void;

  listPaymentOrders(options: {
    account: string;
    dappid?: string;
    pageNum?: number;
    pageSize?: number;
    skipBillCheck?: boolean;
  }): Promise<IPaymentOrderRecord[]>;

  createPayOrder(options: {
    account: string;
    packageId: string;
    packageName: string;
    amountCents: number;
    attach: string;
    dappid?: string;
  }): Promise<string>;

  getNativePrepayCodeUrl(outTradeNo: string): Promise<string>;

  queryPaymentResult(outTradeNo: string): Promise<boolean>;

  listRenewPackages(
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string
  ): Promise<IRenewPackageInfo[]>;

  getPackageInfo(
    packageCode: string,
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string
  ): Promise<IRenewPackageInfo>;

  /**
   * 应用开发者：申请创建/修改支付套餐（提交审核）
   */
  applyBusinessPackage(request: IPackageApplyRequest): Promise<boolean>;

  /**
   * 应用开发者：查询自己应用下的所有套餐配置列表（含审核状态）
   */
  getAllPackagesConfig(filter: IPackageConfigFilter): Promise<IPackageConfigListResult>;

  markCurrentUrlAsPayReturn(scene?: PaymentGatewayScene): string;

  isPayReturnUrl(scene?: PaymentGatewayScene): boolean;

  clearPayReturnUrlParams(): void;

  buildHostedCheckoutUrl(options: {
    account: string;
    packageCode: string;
    packageName: string;
    amountCents: number;
    returnUrl: string;
    attach?: string;
    outTradeNo?: string;
    title?: string;
  }): string;

  markPendingGatewayPayment(info: IPendingGatewayPayment): void;

  getPendingGatewayPayment(): IPendingGatewayPayment | null;

  clearPendingGatewayPayment(): void;
}
