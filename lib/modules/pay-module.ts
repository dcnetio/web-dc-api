import { pb } from "../proto/pay_server_proto";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { multiaddr } from "@multiformats/multiaddr";
import { DCContext } from "../../lib/interfaces/DCContext";
import { DCModule, CoreModuleName } from "../common/module-system";
import { createLogger } from "../util/logger";
import {
  IPayOperations,
  IRenewPackageInfo,
  PaymentPackageType,
  PaymentGatewayScene,
  IPendingGatewayPayment,
  IPaymentOrderRecord,
  IPackageApplyRequest,
  IPackageConfigFilter,
  IPackageConfigListResult,
} from "../interfaces/pay-interface";

const logger = createLogger("PayModule");
const dc_pay_protocol = "/dc/pay/1.0.0";

export class PayModule implements DCModule, IPayOperations {
  readonly moduleName = CoreModuleName.PAY;
  private initialized: boolean = false;
  private dcContext!: DCContext;

  private payPeerUrl: string = "";
  private hostedPayBaseUrl: string = "";
  private payApiBaseUrl: string = "";

  private readonly pendingPaymentKey = "dcapi_pending_gateway_payment";
  private readonly returnFlagKey = "pay_return";
  private readonly returnSceneKey = "pay_scene";

  async initialize(context: DCContext): Promise<boolean> {
    this.dcContext = context;
    this.initialized = true;
    return true;
  }

  async shutdown(): Promise<void> {
    this.initialized = false;
  }

  config(options: {
    payPeerUrl?: string;
    hostedPayBaseUrl?: string;
    payApiBaseUrl?: string;
  }): void {
    if (options.payPeerUrl) this.payPeerUrl = options.payPeerUrl;
    if (options.hostedPayBaseUrl) this.hostedPayBaseUrl = options.hostedPayBaseUrl;
    if (options.payApiBaseUrl) this.payApiBaseUrl = options.payApiBaseUrl;
  }

  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("支付模块未初始化");
    }
  }

  private getPayApiBaseUrl(): string {
    if (this.payApiBaseUrl) {
      return this.payApiBaseUrl.replace(/\/+$/, "");
    }
    try {
      const hosted = new URL(this.hostedPayBaseUrl || "https://bnpay.baybird.cn/pay");
      return `${hosted.origin}/api/v1/wxpayments`;
    } catch {
      return "/api/v1/wxpayments";
    }
  }

  private async requestPayApi(path: string): Promise<any> {
    const targetUrl = `${this.getPayApiBaseUrl()}${path.startsWith("/") ? "" : "/"}${path}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "omit",
    });

    const text = await response.text();
    let payload: any = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(payload?.msg || payload?.error || `支付网关请求失败(${response.status})`);
    }

    return payload;
  }

  private buildOrderExpireTime(minutes = 10): string {
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    const pad = (value: number) => String(value).padStart(2, "0");
    const year = expiresAt.getFullYear();
    const month = pad(expiresAt.getMonth() + 1);
    const day = pad(expiresAt.getDate());
    const hour = pad(expiresAt.getHours());
    const minute = pad(expiresAt.getMinutes());
    const second = pad(expiresAt.getSeconds());
    const offsetMinutes = -expiresAt.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const absOffset = Math.abs(offsetMinutes);
    const offsetHour = pad(Math.floor(absOffset / 60));
    const offsetMinute = pad(absOffset % 60);
    return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${offsetHour}:${offsetMinute}`;
  }

  private parseSceneFromAttach(attach: string): PaymentGatewayScene | "UNKNOWN" {
    const normalized = String(attach || "").trim();
    if (normalized) {
      const parts = normalized.split(":");
      if (parts.length >= 2) {
        return parts[0];
      }
    }
    return "UNKNOWN";
  }

  private mapPayStatusText(payStatus: number): string {
    if (payStatus === 2) return "已支付";
    if (payStatus === 1) return "待支付";
    return "未知";
  }

  private mapTradeStateText(tradeState: string, payStatus: number): string {
    const state = String(tradeState || "").toUpperCase();
    const labelMap: Record<string, string> = {
      SUCCESS: "支付成功",
      REFUND: "已退款",
      NOTPAY: "未支付",
      CLOSED: "已关闭",
      REVOKED: "已撤销",
      USERPAYING: "支付中",
      PAYERROR: "支付失败",
    };
    if (state && labelMap[state]) {
      return labelMap[state];
    }
    return payStatus === 2 ? "支付成功" : this.mapPayStatusText(payStatus);
  }

  async listPaymentOrders(options: {
    account: string;
    dappid?: string;
    pageNum?: number;
    pageSize?: number;
    skipBillCheck?: boolean;
  }): Promise<IPaymentOrderRecord[]> {
    this.assertInitialized();
    const account = String(options.account || "").trim();
    if (!account) {
      return [];
    }
    const dappid = String(options.dappid || this.dcContext.appInfo.appId || "dianping").trim();
    const pageNum = Math.max(1, Number(options.pageNum || 1));
    const pageSize = Math.max(1, Math.min(100, Number(options.pageSize || 20)));

    const params = new URLSearchParams();
    params.set("account", account);
    params.set("dappid", dappid);
    params.set("page_num", String(pageNum));
    params.set("page_size", String(pageSize));

    const orderPayload = await this.requestPayApi(`/order/list?${params.toString()}`);
    if (Number(orderPayload?.code || 0) !== 0) {
      throw new Error(orderPayload?.msg || "订单列表查询失败");
    }

    const orderList = Array.isArray(orderPayload?.data?.list) ? orderPayload.data.list : [];
    
    let billMap = new Map<string, any>();
    if (!options.skipBillCheck) {
      const billList = await Promise.all(
        orderList.map(async (order: any) => {
          const outTradeNo = String(order?.out_trade_no || "").trim();
          if (!outTradeNo) {
            return null;
          }
          try {
            const billPayload = await this.requestPayApi(`/pbill/getbytradeno?out_trade_no=${encodeURIComponent(outTradeNo)}`);
            if (Number(billPayload?.code || 0) !== 0) {
              return null;
            }
            return billPayload?.data || null;
          } catch {
            return null;
          }
        })
      );
      billList.forEach((bill: any) => {
        const outTradeNo = String(bill?.out_trade_no || "").trim();
        if (outTradeNo) {
          billMap.set(outTradeNo, bill);
        }
      });
    }

    const normalizedRecords: Array<IPaymentOrderRecord | null> = orderList
      .map((order: any) => {
        const outTradeNo = String(order?.out_trade_no || "").trim();
        if (!outTradeNo) return null;

        const reqTextRaw = String(order?.req_text || "").trim();
        let reqText: any = {};
        if (reqTextRaw) {
          try {
            reqText = JSON.parse(reqTextRaw);
          } catch {
            reqText = {};
          }
        }

        const bill = billMap.get(outTradeNo) || {};
        const payStatus = Number(order?.pay_status || 0);
        const tradeState = String(bill?.trade_state || "").trim().toUpperCase();
        const attach = String(reqText?.attach || "").trim();

        return {
          outTradeNo,
          account: String(order?.account || ""),
          dappid: String(order?.dappid || ""),
          packageId: String(order?.pkg_id || ""),
          packageName: String(reqText?.description || `套餐#${String(order?.pkg_id || "-")}`),
          packageCode: attach.split(":")[1] ? String(attach.split(":")[1]).trim() : String(order?.pkg_id || ""),
          amountCents: Number(order?.total || 0),
          payStatus,
          payStatusText: this.mapPayStatusText(payStatus),
          tradeState,
          tradeStateText: this.mapTradeStateText(tradeState, payStatus),
          tradeType: String(bill?.trade_type || "").trim().toUpperCase(),
          transactionId: String(bill?.transaction_id || "").trim(),
          successTime: String(bill?.success_time || "").trim(),
          createdAt: String(order?.create_time || "").trim(),
          scene: this.parseSceneFromAttach(attach),
        } as IPaymentOrderRecord;
      });

    return normalizedRecords.filter((item): item is IPaymentOrderRecord => item !== null);
  }

  private async getPayGrpcClient(): Promise<Libp2pGrpcClient> {
    this.assertInitialized();
    if (!this.payPeerUrl) {
      throw new Error("缺少支付网关 payPeerUrl 配置");
    }
    const libp2pNode = (this.dcContext.dcNodeClient as any)?.libp2p;
    if (!libp2pNode) {
      throw new Error("DC libp2p 节点不可用，无法访问支付网关");
    }

    const peerAddr = multiaddr(this.payPeerUrl);
    await libp2pNode.dial(peerAddr, { signal: AbortSignal.timeout(5000) });

    return new Libp2pGrpcClient(
      libp2pNode,
      peerAddr,
      "",
      dc_pay_protocol
    );
  }

  private async getPackagesFromPayPeer(pkgType: number, appid?: string, scene?: string): Promise<pb.PackageInfo[]> {
    const grpcClient = await this.getPayGrpcClient();
    const normalizedScene = String(scene || "").trim();

    const requestObj: any = {
      pkgType,
      lang: "zh",
      currency: "CNY",
      appid: appid || "",
    };
    if (normalizedScene) {
      requestObj.scene = normalizedScene;
    }

    const request = pb.GetPackagesRequest.create(requestObj);
    const requestBytes = pb.GetPackagesRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall("/pb.PayService/GetPackages", requestBytes, 30000);
    const response = pb.GetPackagesResponse.decode(responseBytes);
    const list = (response.data as pb.PackageInfo[]) || [];
    if (normalizedScene) {
      return list.filter((p: any) => p.scene === normalizedScene);
    }
    return list;
  }

  async createPayOrder(options: {
    account: string;
    packageId: string;
    packageName: string;
    amountCents: number;
    attach: string;
    dappid?: string;
  }): Promise<string> {
    const pkgId = Number(options.packageId || 0);
    if (!Number.isFinite(pkgId) || pkgId <= 0) {
      throw new Error("支付套餐ID无效，无法创建订单");
    }

    const grpcClient = await this.getPayGrpcClient();
    const request = pb.CreateOrderRequest.create({
      account: String(options.account || ""),
      pkgId,
      description: String(options.packageName || "商品支付"),
      amount: pb.AmountInfo.create({
        total: Number(options.amountCents || 0),
      }),
      timeExpire: this.buildOrderExpireTime(10),
      dappid: options.dappid || this.dcContext.appInfo.appId || "dianping",
      attach: String(options.attach || ""),
    });
    const requestBytes = pb.CreateOrderRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall("/pb.PayService/CreateOrder", requestBytes, 30000);
    const response = pb.CreateOrderResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "创建支付订单失败");
    }

    const outTradeNo = String(response?.data?.outTradeNo || "").trim();
    if (!outTradeNo) {
      throw new Error("创建支付订单失败：未返回订单号");
    }
    return outTradeNo;
  }

  async getNativePrepayCodeUrl(outTradeNo: string): Promise<string> {
    if (!outTradeNo) {
      throw new Error("缺少订单号，无法获取二维码");
    }
    const grpcClient = await this.getPayGrpcClient();
    const request = pb.GetNativePrepayRequest.create({ outTradeNo });
    const requestBytes = pb.GetNativePrepayRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall("/pb.PayService/GetNativePrepay", requestBytes, 30000);
    const response = pb.GetNativePrepayResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "获取扫码支付二维码失败");
    }
    const codeUrl = String(response?.data?.codeUrl || "").trim();
    if (!codeUrl) {
      throw new Error("支付网关未返回二维码链接");
    }
    return codeUrl;
  }

  async queryPaymentResult(outTradeNo: string): Promise<boolean> {
    if (!outTradeNo) {
      return false;
    }
    const grpcClient = await this.getPayGrpcClient();
    const request = pb.GetStoragePurchaseStatusRequest.create({ outTradeNo });
    const requestBytes = pb.GetStoragePurchaseStatusRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall("/pb.PayService/GetStoragePurchaseStatus", requestBytes, 30000);
    const response = pb.GetStoragePurchaseStatusResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "支付结果查询失败");
    }
    return Number(response?.data?.status || 0) === 2;
  }

  private normalizePackages(list: pb.PackageInfo[]): IRenewPackageInfo[] {
    const parseRights = (raw: string): Record<string, any> => {
      if (!raw) return {};
      try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    };

    return list
      .map((item) => {
        const packageId = String(item.pkgId || "");
        const packageCode = String(item.pkgId || "");
        const rights = parseRights(String((item as any).pkgRights || ""));
        const aiAppid = String(
          rights.appid || rights.ai_appid || item.serviceAppid || ""
        ).trim();
        const aiAuthor = String(
          rights.author || rights.theme_author || rights.ai_author || ""
        ).trim();
        const aiTheme = String(
          rights.theme || rights.ai_theme || item.theme || ""
        ).trim();
        const aiModel = String(
          rights.model || rights.ai_model || rights.model_name || ""
        ).trim();

        return {
          packageId,
          packageCode,
          pkgType: Number(item.pkgType || 0) || undefined,
          displayName: String(item.pkgName || packageCode || packageId || ""),
          durationDays: Number(item.validDays || 0) || undefined,
          amountCents: Number(item.amount || 0) || undefined,
          currency: String(item.currency || "CNY"),
          serviceAppid: String(item.serviceAppid || ""),
          scene: String(item.scene || ""),
          aiAppid: aiAppid || undefined,
          aiAuthor: aiAuthor || undefined,
          aiTheme: aiTheme || undefined,
          aiModel: aiModel || undefined,
          bussdesc: String(item.bussdesc || ""),
          imglist: String(item.imglist || ""),
          checkStatus: Number(item.checkStatus || 0),
          checkTime: String(item.checkTime || ""),
          createTime: String(item.createTime || ""),
          chainPkgId: Number(item.chainPkgId || 0),
          spaceSize: Number(item.spaceSize || 0),
        };
      })
      .filter((item: IRenewPackageInfo) => !!item.packageId);
  }

  async listRenewPackages(
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string
  ): Promise<IRenewPackageInfo[]> {
    const list = await this.getPackagesFromPayPeer(pkgType, serviceAppid, scene);
    let normalized = this.normalizePackages(list);
    
    if (serviceAppid) {
      normalized = normalized.filter((item: IRenewPackageInfo) => {
        const fromPackage = String(item.serviceAppid || "").trim();
        return !fromPackage || fromPackage === serviceAppid;
      });
    }
    return normalized;
  }

  async getPackageInfo(
    packageCode: string,
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string
  ): Promise<IRenewPackageInfo> {
    if (!packageCode) {
      throw new Error("缺少支付套餐信息，请重试");
    }
    const packages = await this.listRenewPackages(pkgType, serviceAppid, scene);
    const target = packages.find((p) => p.packageCode === String(packageCode));
    if (!target) {
      throw new Error(`未找到指定的支付套餐(${packageCode})或已下架`);
    }
    return target;
  }

  async applyBusinessPackage(request: IPackageApplyRequest): Promise<boolean> {
    const grpcClient = await this.getPayGrpcClient();
    
    let pkgRightsStr = "";
    if (request.pkgRights) {
      pkgRightsStr = typeof request.pkgRights === "string" 
        ? request.pkgRights 
        : JSON.stringify(request.pkgRights);
    }

    const pbReq = pb.ApplyBussPackageRequest.create({
      pkgType: request.pkgType,
      scene: String(request.scene || ""),
      bussdesc: String(request.bussdesc || ""),
      imglist: String(request.imglist || ""),
      pkgName: String(request.pkgName || ""),
      lang: String(request.lang || "zh"),
      amount: Number(request.amount || 0),
      currency: String(request.currency || "CNY"),
      validDays: Number(request.validDays || 0),
      pkgRights: pkgRightsStr,
      theme: String(request.theme || ""),
      themeAuthor: String(request.themeAuthor || ""),
      themeAppid: String(request.themeAppid || ""),
      serviceAppid: String(request.serviceAppid || this.dcContext.appInfo.appId || ""),
      chainPkgId: Number(request.chainPkgId || 0),
      spaceSize: Number(request.spaceSize || 0),
    });

    const requestBytes = pb.ApplyBussPackageRequest.encode(pbReq).finish();
    const responseBytes = await grpcClient.unaryCall("/pb.PayService/ApplyBussPackage", requestBytes, 30000);
    const response = pb.ApplyBussPackageResponse.decode(responseBytes);
    
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "申请业务套餐配置失败");
    }
    return true;
  }

  async getAllPackagesConfig(filter: IPackageConfigFilter): Promise<IPackageConfigListResult> {
    const grpcClient = await this.getPayGrpcClient();
    const pbReq = pb.GetAllPackagesConfigRequest.create({
      pageNum: filter.pageNum || 1,
      pageSize: filter.pageSize || 20,
      pkgType: filter.pkgType !== undefined ? filter.pkgType : -1,
      checkStatus: filter.checkStatus || 0,
      appid: String(filter.appid || this.dcContext.appInfo.appId || ""),
    });

    const requestBytes = pb.GetAllPackagesConfigRequest.encode(pbReq).finish();
    const responseBytes = await grpcClient.unaryCall("/pb.PayService/GetAllPackagesConfig", requestBytes, 30000);
    const response = pb.GetAllPackagesConfigResponse.decode(responseBytes);
    
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "获取套餐配置列表失败");
    }

    const rawList = (response.data?.list as pb.PackageInfo[]) || [];
    const total = Number(response.data?.total || 0);

    return {
      list: this.normalizePackages(rawList),
      total,
    };
  }

  markCurrentUrlAsPayReturn(scene?: PaymentGatewayScene): string {
    const url = new URL(globalThis.window.location.href);
    url.searchParams.set(this.returnFlagKey, "1");
    if (scene) {
      url.searchParams.set(this.returnSceneKey, scene);
    }
    url.searchParams.set("t", String(Date.now()));
    return url.toString();
  }

  isPayReturnUrl(scene?: PaymentGatewayScene): boolean {
    try {
      const url = new URL(globalThis.window.location.href);
      const isReturn = url.searchParams.get(this.returnFlagKey) === "1";
      if (!isReturn) return false;
      if (scene) {
        return url.searchParams.get(this.returnSceneKey) === scene;
      }
      return true;
    } catch {
      return false;
    }
  }

  clearPayReturnUrlParams(): void {
    try {
      const url = new URL(globalThis.window.location.href);
      let changed = false;
      [this.returnFlagKey, this.returnSceneKey].forEach((key) => {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          changed = true;
        }
      });
      if (changed) {
        globalThis.window.history.replaceState({}, "", url.toString());
      }
    } catch {
      // ignore
    }
  }

  buildHostedCheckoutUrl(options: {
    account: string;
    packageCode: string;
    packageName: string;
    amountCents: number;
    returnUrl: string;
    attach?: string;
    outTradeNo?: string;
    title?: string;
  }): string {
    if (!this.hostedPayBaseUrl) {
      throw new Error("缺少 hostedPayBaseUrl 配置");
    }
    const target = new URL(this.hostedPayBaseUrl.replace(/\/+$/, "") + "/#/pay");
    target.searchParams.set("account", String(options.account || ""));
    target.searchParams.set("pkgId", String(options.packageCode || ""));
    target.searchParams.set("amountCents", String(options.amountCents || 0));
    target.searchParams.set("returnUrl", encodeURIComponent(options.returnUrl || ""));
    target.searchParams.set("title", encodeURIComponent(options.title || options.packageName));
    if (options.attach) {
      target.searchParams.set("attach", String(options.attach));
    }
    if (options.outTradeNo) {
      target.searchParams.set("outTradeNo", String(options.outTradeNo));
    }
    return target.toString();
  }

  markPendingGatewayPayment(info: IPendingGatewayPayment): void {
    try {
      localStorage.setItem(this.pendingPaymentKey, JSON.stringify(info));
    } catch (e) {
      logger.warn("保存支付状态失败", e);
    }
  }

  getPendingGatewayPayment(): IPendingGatewayPayment | null {
    try {
      const value = localStorage.getItem(this.pendingPaymentKey);
      if (!value) return null;
      const parsed = JSON.parse(value);
      if (!parsed || !parsed.scene || !parsed.createdAt) {
        return null;
      }
      return parsed as IPendingGatewayPayment;
    } catch {
      return null;
    }
  }

  clearPendingGatewayPayment(): void {
    try {
      localStorage.removeItem(this.pendingPaymentKey);
    } catch {
      // ignore
    }
  }
}
