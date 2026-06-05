import { pb } from "../proto/pay_server_proto";

/**
 * 支付套餐信息（面向前端消费的统一结构）。
 * 用于套餐列表展示、下单前校验、套餐配置管理等场景。
 */
export interface IRenewPackageInfo {
  /**
   * 套餐唯一ID（后端主键或业务唯一标识）。
   */
  packageId: string;
  /**
   * 套餐编码（对外稳定标识，常用于下单与查询）。
   */
  packageCode: string;
  /**
   * 套餐类型。
   * 典型取值见 PaymentPackageTypeValue。
   */
  pkgType?: number;
  /**
   * 套餐展示名称。
   */
  displayName: string;
  /**
   * 套餐有效期（天）。
   */
  durationDays?: number;
  /**
   * 套餐价格（分）。
   */
  amountCents?: number;
  /**
   * 货币代码，例如 CNY、USD。
   */
  currency?: string;
  /**
   * 服务应用 AppID（用于多应用场景隔离套餐）。
   */
  serviceAppid?: string;
  /**
   * 业务场景标识，如 AI_MODEL_CALL、APP_PUBLISH。
   */
  scene?: string;
  /**
   * AI 应用 AppID（AI 套餐相关）。
   */
  aiAppid?: string;
  /**
   * AI 作者标识（AI 套餐相关）。
   */
  aiAuthor?: string;
  /**
   * AI 主题标识（AI 套餐相关）。
   */
  aiTheme?: string;
  /**
   * AI 模型名称（AI 套餐相关）。
   */
  aiModel?: string;
  /**
   * 套餐权益配置。
   * 可能是对象（结构化权益）或字符串（后端透传配置）。
   */
  pkgRights?: Record<string, any> | string;
  /**
   * 管理端业务描述。
   */
  bussdesc?: string;
  /**
   * 管理端图片列表（通常为 URL 拼接字符串）。
   */
  imglist?: string;
  /**
   * 审核状态。
   * 0=未审核/待审核，1=待审核，2=审核通过，3=审核被拒（以服务端最终定义为准）。
   */
  checkStatus?: number;
  /**
   * 审核备注/驳回原因。
   */
  checkReason?: string;
  /**
   * 被替换的旧套餐ID（修改套餐时使用）。
   */
  replacesPkgId?: number;
  /**
   * 审核时间（服务端返回的时间字符串）。
   */
  checkTime?: string;
  /**
   * 创建时间（服务端返回的时间字符串）。
   */
  createTime?: string;
  /**
   * 链上套餐ID（链路追踪或链上关联字段）。
   */
  chainPkgId?: number;
  /**
   * 扩展空间大小（通常单位为 GB，具体以业务约定为准）。
   */
  spaceSize?: number;
  /**
   * 备注信息
   */
  remark?: string;
}

/**
 * 套餐类型常量定义。
 */
export enum PaymentPackageTypeValue {
  /**
   * 模型调用会员套餐。
   */
  SERVICECALL_MEMBER = 1,
  /**
   * 应用发布套餐。
   */
  APP_PUBLISH = 2,
  /**
   * 存储扩容套餐。
   */
  STORAGE_PURCHASE = 3,
  /**
   * 平台 SVIP 套餐。
   */
  PLATFORM_SVIP = 4,
}

/**
 * 套餐类型联合类型。
 * 约束调用方只能使用定义内的合法套餐类型值。
 */
export type PaymentPackageType =
  | PaymentPackageTypeValue.SERVICECALL_MEMBER
  | PaymentPackageTypeValue.APP_PUBLISH
  | PaymentPackageTypeValue.STORAGE_PURCHASE
  | PaymentPackageTypeValue.PLATFORM_SVIP;

/**
 * 应用开发者提交套餐申请/修改时的请求体。
 */
export interface IPackageApplyRequest {
  /**
   * 套餐类型。
   */
  pkgType: number;
  /**
   * 业务场景标识。
   */
  scene?: string;
  /**
   * 套餐业务描述。
   */
  bussdesc?: string;
  /**
   * 套餐展示图列表。
   */
  imglist?: string;
  /**
   * 套餐名称。
   */
  pkgName: string;
  /**
   * 语言标识，如 zh、en。
   */
  lang?: string;
  /**
   * 金额（分）。
   */
  amount: number;
  /**
   * 货币代码，默认 CNY。
   */
  currency?: string;
  /**
   * 有效期（天）。
   */
  validDays?: number;
  /**
   * 权益配置，支持对象或字符串。
   */
  pkgRights?: Record<string, any> | string;
  /**
   * 主题标识（按业务场景可选）。
   */
  theme?: string;
  /**
   * 主题作者标识（按业务场景可选）。
   */
  themeAuthor?: string;
  /**
   * 主题 AppID（按业务场景可选）。
   */
  themeAppid?: string;
  /**
   * 服务 AppID（按业务场景可选）。
   */
  serviceAppid?: string;
  /**
   * 被替换的旧套餐ID（修改套餐时使用）。
   */
  replacesPkgId?: number;
  /**
   * 链上套餐ID（链路追踪或链上关联字段）。
   */
  chainPkgId?: number;
  /**
   * 扩展空间大小（通常用于存储类套餐）。
   */
  spaceSize?: number;
  /**
   * 备注信息
   */
  remark?: string;
}

/**
 * 套餐配置查询过滤条件。
 */
export interface IPackageConfigFilter {
  /**
   * 页码（从 1 开始）。
   */
  pageNum?: number;
  /**
   * 每页数量。
   */
  pageSize?: number;
  /**
   * 套餐类型，-1 表示所有类型。
   */
  pkgType?: number;
  /**
   * 审核状态，0 表示所有，1 待审核，2 审核通过，3 审核被拒。
   */
  checkStatus?: number;
  /**
   * 仅按 AppID 过滤。
   */
  appid?: string;
}

/**
 * 套餐配置列表查询结果。
 */
export interface IPackageConfigListResult {
  /**
   * 当前页数据。
   */
  list: IRenewPackageInfo[];
  /**
   * 总记录数。
   */
  total: number;
}

/**
 * 支付网关场景标识。
 * 由业务方定义具体字符串值。
 */
export type PaymentGatewayScene = string;

/**
 * 待支付网关订单的本地暂存信息。
 * 常用于跳转支付页前后恢复支付上下文。
 */
export interface IPendingGatewayPayment {
  /**
   * 支付场景标识。
   */
  scene: PaymentGatewayScene;
  /**
   * 商户订单号（可能在创建前为空）。
   */
  outTradeNo?: string;
  /**
   * 套餐编码。
   */
  packageCode: string;
  /**
   * 套餐ID。
   */
  packageId?: string;
  /**
   * 套餐名称。
   */
  packageName: string;
  /**
   * 订单金额（分）。
   */
  amountCents: number;
  /**
   * 套餐时长（天）。
   */
  durationDays?: number;
  /**
   * 业务透传字段。
   */
  payload?: Record<string, any>;
  /**
   * 创建时间戳（毫秒）。
   */
  createdAt: number;
}

/**
 * 支付订单记录。
 * 来自支付系统查询结果，用于订单列表和状态展示。
 */
export interface IPaymentOrderRecord {
  /**
   * 商户订单号。
   */
  outTradeNo: string;
  /**
   * 用户账号标识。
   */
  account: string;
  /**
   * 应用ID。
   */
  dappid: string;
  /**
   * 套餐ID。
   */
  packageId: string;
  /**
   * 套餐名称。
   */
  packageName: string;
  /**
   * 套餐编码。
   */
  packageCode: string;
  /**
   * 订单金额（分）。
   */
  amountCents: number;
  /**
   * 支付状态码。
   */
  payStatus: number;
  /**
   * 支付状态文本。
   */
  payStatusText: string;
  /**
   * 交易状态码。
   */
  tradeState: string;
  /**
   * 交易状态文本。
   */
  tradeStateText: string;
  /**
   * 交易类型，如 JSAPI、NATIVE。
   */
  tradeType: string;
  /**
   * 第三方支付平台交易号。
   */
  transactionId: string;
  /**
   * 支付成功时间。
   */
  successTime: string;
  /**
   * 订单创建时间。
   */
  createdAt: string;
  /**
   * 支付场景，无法识别时为 UNKNOWN。
   */
  scene: PaymentGatewayScene | "UNKNOWN";
}

/**
 * 支付模块对外操作接口。
 */
export interface IPayOperations {
  /**
   * 配置服务端地址信息
   * @param options 支付网关及支付能力相关地址配置
   */
  config(options: {
    /**
     * 支付 Peer 服务地址。
     */
    payPeerUrl?: string;
    /**
     * 托管支付页地址（Hosted Checkout）。
     */
    hostedPayBaseUrl?: string;
    /**
     * 支付 API 基础地址。
     */
    payApiBaseUrl?: string;
  }): void;

  /**
   * 查询支付订单列表。
   * @param options 查询条件
   * @returns 订单记录数组
   */
  listPaymentOrders(options: {
    /**
     * 账号标识（必填）。
     */
    account: string;
    /**
     * 应用ID（可选）。
     */
    dappid?: string;
    /**
     * 页码。
     */
    pageNum?: number;
    /**
     * 每页大小。
     */
    pageSize?: number;
    /**
     * 是否跳过账单补偿检查。
     */
    skipBillCheck?: boolean;
  }): Promise<IPaymentOrderRecord[]>;

  /**
   * 创建支付订单。
   * @param options 下单参数
   * @returns 商户订单号 outTradeNo
   */
  createPayOrder(options: {
    /**
     * 账号标识。
     */
    account: string;
    /**
     * 套餐ID。
     */
    packageId: string;
    /**
     * 套餐名称。
     */
    packageName: string;
    /**
     * 金额（分）。
     */
    amountCents: number;
    /**
     * 支付透传参数。
     */
    attach: string;
    /**
     * 应用ID（可选）。
     */
    dappid?: string;
    /**
     * 是否续费订单。
     */
    isRenew?: boolean;
    /**
     * 续费时指定的原订单 NO（仅续费时有效）。
     */
    oldNo?: number;
  }): Promise<string>;

  /**
   * 获取 NATIVE 支付二维码链接。
   * @param outTradeNo 商户订单号
   * @returns 支付链接（通常可用于生成二维码）
   */
  getNativePrepayCodeUrl(outTradeNo: string): Promise<string>;

  /**
   * 查询订单支付结果。
   * @param outTradeNo 商户订单号
   * @returns 是否支付成功
   */
  queryPaymentResult(outTradeNo: string): Promise<boolean>;

  /**
   * 拉取续费/购买套餐列表。
   * @param pkgType 套餐类型
   * @param serviceAppid 服务应用 AppID（可选）
   * @param scene 业务场景（可选）
   */
  listRenewPackages(
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string,
  ): Promise<IRenewPackageInfo[]>;

  /**
   * 按编码获取指定套餐信息。
   * @param packageCode 套餐编码
   * @param pkgType 套餐类型
   * @param serviceAppid 服务应用 AppID（可选）
   * @param scene 业务场景（可选）
   */
  getPackageInfo(
    packageCode: string,
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string,
  ): Promise<IRenewPackageInfo>;

  /**
   * 获取指定套餐续费时长（天）。
   * @param packageCode 套餐编码
   * @param targetType 套餐类型
   * @param serviceAppid 服务应用 AppID（可选）
   * @param scene 业务场景（可选）
   */
  getRenewalDays(
    packageCode: string,
    targetType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string,
  ): Promise<number>;

  /**
   * 应用开发者：申请创建/修改支付套餐（提交审核）
   * @param request 套餐申请内容
   */
  applyBusinessPackage(request: IPackageApplyRequest): Promise<boolean>;

  /**
   * 应用开发者：查询自己应用下的所有套餐配置列表（含审核状态）
   * @param filter 查询过滤条件
   */
  getAllPackagesConfig(
    filter: IPackageConfigFilter,
  ): Promise<IPackageConfigListResult>;

  /**
   * 应用开发者：删除自己应用下的支付套餐配置
   * @param packageId 套餐ID
   */
  deleteBusinessPackage(packageId: string): Promise<boolean>;

  /**
   * 将当前页面标记为支付回跳页。
   * @param scene 支付场景
   * @returns 标记后的 URL
   */
  markCurrentUrlAsPayReturn(scene?: PaymentGatewayScene): string;

  /**
   * 判断当前 URL 是否为支付回跳页。
   * @param scene 支付场景
   */
  isPayReturnUrl(scene?: PaymentGatewayScene): boolean;

  /**
   * 清理 URL 中支付回跳相关参数。
   */
  clearPayReturnUrlParams(): void;

  /**
   * 构建托管收银台 URL。
   * @param options 收银台参数
   * @returns 可直接跳转的支付 URL
   */
  buildHostedCheckoutUrl(options: {
    /**
     * 账号标识。
     */
    account: string;
    /**
     * 套餐编码。
     */
    packageCode: string;
    /**
     * 套餐名称。
     */
    packageName: string;
    /**
     * 金额（分）。
     */
    amountCents: number;
    /**
     * 支付完成后回跳地址。
     */
    returnUrl: string;
    /**
     * 透传字段。
     */
    attach?: string;
    /**
     * 商户订单号（不传则由服务端生成）。
     */
    outTradeNo?: string;
    /**
     * 收银台展示标题。
     */
    title?: string;
  }): string;

  /**
   * 暂存待支付信息。
   */
  markPendingGatewayPayment(info: IPendingGatewayPayment): void;

  /**
   * 获取暂存的待支付信息。
   */
  getPendingGatewayPayment(): IPendingGatewayPayment | null;

  /**
   * 清除暂存的待支付信息。
   */
  clearPendingGatewayPayment(): void;
}
