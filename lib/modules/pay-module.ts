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
  IPaymentLedgerWriterConfig,
  IPackageApplyRequest,
  IPackageConfigFilter,
  IPackageConfigListResult,
  IRecommenderAppManager,
  IRecommenderAppManagerInput,
  IRecommenderAppPolicy,
  IRecommenderAppPolicyAccess,
  IRecommenderAppPolicyInput,
  IRecommenderLevelDefinition,
} from "../interfaces/pay-interface";
import { payProtocol } from "@/common/define";

const logger = createLogger("PayModule");
const packageMutationTokenPrefix = "pkgsig.";

// 订单查询签名 op 名称，必须与网关 services/wxsvr/payments/order_query_auth.go 保持一致。
const ORDER_QUERY_OP_BY_ACCOUNT = "list_orders_by_account";
const ORDER_QUERY_OP_BY_DAPPID = "list_orders_by_dappid";

export class PayModule implements DCModule, IPayOperations {
  readonly moduleName = CoreModuleName.PAY;
  private initialized: boolean = false;
  private dcContext!: DCContext;

  private payPeerUrl: string = "";
  private hostedPayBaseUrl: string = "";

  private readonly pendingPaymentKey = "dcapi_pending_gateway_payment";
  private readonly returnFlagKey = "pay_return";
  private readonly returnSceneKey = "pay_scene";
  private readonly returnOrderKey = "pay_out_trade_no";
  private readonly returnOriginOrderKey = "pay_origin_out_trade_no";
  private readonly recommenderStorageKey = "dcapi_payment_recommender";
  private activeRecommenders = new Map<string, string>();

  private getCurrentAccount(): string {
    return String(
      this.dcContext?.accountInfo?.nftAccount ||
        this.dcContext?.publicKey?.string?.() ||
        this.dcContext?.getPublicKey?.()?.string?.() ||
        "",
    ).trim();
  }

  private getCurrentPubkey(): string {
    return String(
      this.dcContext?.publicKey?.string?.() ||
        this.dcContext?.getPublicKey?.()?.string?.() ||
        "",
    ).trim();
  }

  private resolveRecommender(explicit?: string, serviceAppid?: string): string {
    let recommender = String(explicit || "").trim();
    if (typeof window !== "undefined") {
      try {
        const scope = String(
          serviceAppid || this.dcContext?.appInfo?.appId || "",
        ).trim();
        const scopes = scope ? [scope] : [];
        const storageKeys = scopes.map(
          (scope) => `${this.recommenderStorageKey}:${scope}`,
        );
        const params = new URLSearchParams(window.location.search || "");
        const fromUrl = String(
          params.get("ref") ||
            params.get("recommender") ||
            params.get("referrer") ||
            "",
        ).trim();
        if (!recommender && fromUrl) {
          recommender = fromUrl;
        }
        if (fromUrl && fromUrl.length <= 256) {
          storageKeys.forEach((key) => window.localStorage.setItem(key, fromUrl));
        }
        if (!recommender) {
          for (const scope of scopes) {
            recommender = String(this.activeRecommenders.get(scope) || "").trim();
            if (recommender) break;
          }
        }
        if (!recommender) {
          for (const key of storageKeys) {
            recommender = String(window.localStorage.getItem(key) || "").trim();
            if (recommender) break;
          }
        }
      } catch {
        // Browsers may disable storage; the explicit or URL value still works.
      }
    }
    if (!recommender || recommender.length > 256) {
      return "";
    }
    if (recommender === this.getCurrentAccount()) {
      return "";
    }
    const activeScope = String(
      serviceAppid || this.dcContext?.appInfo?.appId || "",
    ).trim();
    const activeScopes = activeScope ? [activeScope] : [];
    activeScopes.forEach((scope) => this.activeRecommenders.set(scope, recommender));
    return recommender;
  }

  private getPackageMutationSignerPubkey(): string {
    const signer = String(
      this.dcContext?.publicKey?.string?.() ||
        this.dcContext?.getPublicKey?.()?.string?.() ||
        "",
    ).trim();
    if (!signer) {
      throw new Error("当前账号公钥不可用，无法生成套餐变更签名");
    }
    return signer;
  }

  private encodeBase64Url(input: Uint8Array | string): string {
    const bytes =
      typeof input === "string" ? new TextEncoder().encode(input) : input;
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = globalThis.btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  private writeStringField(buffer: number[], value: string): void {
    const bytes = new TextEncoder().encode(String(value || "").trim());
    const length = bytes.length >>> 0;
    buffer.push(
      length & 0xff,
      (length >>> 8) & 0xff,
      (length >>> 16) & 0xff,
      (length >>> 24) & 0xff,
    );
    buffer.push(...bytes);
  }

  private writeInt32Field(buffer: number[], value: number): void {
    const intVal = Number(value || 0) | 0;
    buffer.push(
      intVal & 0xff,
      (intVal >>> 8) & 0xff,
      (intVal >>> 16) & 0xff,
      (intVal >>> 24) & 0xff,
    );
  }

  private writeBoolField(buffer: number[], value: boolean): void {
    buffer.push(value ? 1 : 0);
  }

  private writeInt64Field(buffer: number[], value: number): void {
    const safeValue = Math.trunc(Number(value || 0));
    const low = safeValue >>> 0;
    const high = Math.floor(safeValue / 0x100000000) | 0;
    buffer.push(
      low & 0xff,
      (low >>> 8) & 0xff,
      (low >>> 16) & 0xff,
      (low >>> 24) & 0xff,
    );
    buffer.push(
      high & 0xff,
      (high >>> 8) & 0xff,
      (high >>> 16) & 0xff,
      (high >>> 24) & 0xff,
    );
  }

  private writeFloat64Field(buffer: number[], value: number): void {
    const bytes = new Uint8Array(8);
    new DataView(bytes.buffer).setFloat64(0, Number(value || 0), true);
    buffer.push(...bytes);
  }

  private buildRecommenderAppPolicyAccessPayload(
    serviceAppid: string,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "get_recommender_app_policy_access");
    this.writeStringField(buffer, serviceAppid);
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildRecommenderAppPolicyUpsertPayload(
    input: IRecommenderAppPolicyInput,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "upsert_recommender_app_policy");
    this.writeStringField(buffer, input.serviceAppid);
    this.writeStringField(buffer, input.recommenderPubkey || "");
    this.writeInt32Field(buffer, Number(input.recommenderLevel || 0));
    this.writeBoolField(buffer, input.hasFirstPayRatio);
    this.writeFloat64Field(buffer, Number(input.firstPayRatio || 0));
    this.writeBoolField(buffer, input.hasSubsequentPayRatio);
    this.writeFloat64Field(buffer, Number(input.subsequentPayRatio || 0));
    this.writeStringField(buffer, input.remark || "");
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildRecommenderAppPolicyListPayload(
    serviceAppid: string,
    recommenderPubkey: string,
    recommenderLevel: number,
    pageNum: number,
    pageSize: number,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "list_recommender_app_policies");
    this.writeStringField(buffer, serviceAppid);
    this.writeStringField(buffer, recommenderPubkey);
    this.writeInt32Field(buffer, recommenderLevel);
    this.writeInt32Field(buffer, pageNum);
    this.writeInt32Field(buffer, pageSize);
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildRecommenderAppPolicyDeletePayload(
    serviceAppid: string,
    recommenderPubkey: string,
    recommenderLevel: number,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "delete_recommender_app_policy");
    this.writeStringField(buffer, serviceAppid);
    this.writeStringField(buffer, recommenderPubkey);
    this.writeInt32Field(buffer, recommenderLevel);
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildRecommenderLevelDefinitionListPayload(
    serviceAppid: string,
    pageNum: number,
    pageSize: number,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "list_recommender_level_definitions");
    this.writeStringField(buffer, serviceAppid);
    this.writeInt32Field(buffer, pageNum);
    this.writeInt32Field(buffer, pageSize);
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildRecommenderAppManagerUpsertPayload(
    input: IRecommenderAppManagerInput,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "upsert_recommender_app_manager");
    this.writeStringField(buffer, input.serviceAppid);
    this.writeStringField(buffer, input.managerPubkey);
    this.writeStringField(buffer, input.remark || "");
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildRecommenderAppManagerListPayload(
    serviceAppid: string,
    managerPubkey: string,
    pageNum: number,
    pageSize: number,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "list_recommender_app_managers");
    this.writeStringField(buffer, serviceAppid);
    this.writeStringField(buffer, managerPubkey);
    this.writeInt32Field(buffer, pageNum);
    this.writeInt32Field(buffer, pageSize);
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildRecommenderAppManagerDeletePayload(
    serviceAppid: string,
    managerPubkey: string,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "delete_recommender_app_manager");
    this.writeStringField(buffer, serviceAppid);
    this.writeStringField(buffer, managerPubkey);
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildApplyPackageSignPayload(
    request: IPackageApplyRequest,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "apply_buss_package");
    this.writeInt32Field(buffer, Number(request.pkgType || 0));
    this.writeStringField(buffer, String(request.scene || ""));
    this.writeStringField(buffer, String(request.bussdesc || ""));
    this.writeStringField(buffer, String(request.imglist || ""));
    this.writeStringField(buffer, String(request.pkgName || ""));
    this.writeStringField(buffer, String(request.lang || "zh"));
    this.writeInt32Field(buffer, Number(request.amount || 0));
    this.writeStringField(buffer, String(request.currency || "CNY"));
    this.writeInt32Field(buffer, Number(request.validDays || 0));
    const pkgRightsStr = request.pkgRights
      ? typeof request.pkgRights === "string"
        ? request.pkgRights
        : JSON.stringify(request.pkgRights)
      : "";
    this.writeStringField(buffer, pkgRightsStr);
    this.writeStringField(buffer, String(request.theme || ""));
    this.writeStringField(buffer, String(request.themeAuthor || ""));
    this.writeStringField(buffer, String(request.themeAppid || ""));
    this.writeStringField(
      buffer,
      String(request.serviceAppid || this.dcContext.appInfo.appId || ""),
    );
    // Current dcapi protobuf schema does not expose replacesPkgId; keep it as 0 to match server-side decoded request.
    this.writeInt32Field(buffer, Number(request.replacesPkgId || 0));
    this.writeInt32Field(buffer, Number(request.chainPkgId || 0));
    this.writeInt32Field(buffer, Number(request.spaceSize || 0));
    this.writeStringField(buffer, String(request.remark || ""));
    const recommenderLevel = Math.max(
      0,
      Math.trunc(Number(request.requireRecommenderLevel || 0)),
    );
    const referralPackage =
      request.requireRecommender === true || recommenderLevel > 0;
    if (request.firstPayOnly === true || referralPackage) {
      this.writeBoolField(
        buffer,
        request.firstPayOnly === true || referralPackage,
      );
      this.writeBoolField(buffer, referralPackage);
      this.writeInt32Field(buffer, recommenderLevel);
    }
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  private buildDeletePackageSignPayload(
    pkgId: number,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, "delete_buss_package");
    this.writeInt32Field(buffer, pkgId);
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  /**
   * 构造订单查询签名载荷，与网关 BuildOrderQueryPayload 保持一致。
   * 签名内容: op_name | account | dappid | timestamp（分页参数不参与签名）
   */
  private buildOrderQuerySignPayload(
    op: string,
    account: string,
    dappid: string,
    timestampSec: number,
  ): Uint8Array {
    const buffer: number[] = [];
    this.writeStringField(buffer, op);
    this.writeStringField(buffer, String(account || ""));
    this.writeStringField(buffer, String(dappid || ""));
    this.writeInt64Field(buffer, timestampSec);
    return new Uint8Array(buffer);
  }

  /**
   * 生成订单查询的 Authorization 头。订单由支付网关写入，用户无写权限，
   * 此签名仅用于证明"读"的身份：查自己的订单，或作为应用 owner 查本应用订单。
   */
  private async buildOrderQueryAuthToken(
    op: string,
    account: string,
    dappid: string,
  ): Promise<string> {
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildOrderQuerySignPayload(
      op,
      account,
      dappid,
      timestampSec,
    );
    return this.buildPackageMutationAuthToken(payload, timestampSec);
  }

  private async buildPackageMutationAuthToken(
    payload: Uint8Array,
    timestampSec: number,
  ): Promise<string> {
    const signerPubkey = this.getPackageMutationSignerPubkey();
    const signature = await this.dcContext.sign(payload);
    const tokenBody = {
      ver: 1,
      signer_pubkey: signerPubkey,
      timestamp: timestampSec,
      signature: this.encodeBase64Url(signature),
    };
    const encodedPayload = this.encodeBase64Url(JSON.stringify(tokenBody));
    return `${packageMutationTokenPrefix}${encodedPayload}`;
  }

  async initialize(context: DCContext): Promise<boolean> {
    this.dcContext = context;
    this.initialized = true;
    return true;
  }

  async shutdown(): Promise<void> {
    this.initialized = false;
  }

  /**
   * 配置支付相关服务地址。
   * @param options 支付网关及支付能力相关地址配置
   */
  config(options: {
    payPeerUrl?: string;
    hostedPayBaseUrl?: string;
    /** 兼容保留：订单查询已迁移到 gRPC，该地址不再使用。 */
    payApiBaseUrl?: string;
  }): void {
    if (options.payPeerUrl) this.payPeerUrl = options.payPeerUrl;
    if (options.hostedPayBaseUrl)
      this.hostedPayBaseUrl = options.hostedPayBaseUrl;
  }

  private assertInitialized(): void {
    if (!this.initialized) {
      throw new Error("支付模块未初始化");
    }
  }

  // 订单查询已全部迁移到支付网关的 libp2p gRPC 通道（getPayGrpcClient），
  // 不再有 HTTP fetch 调用；hostedPayBaseUrl 仍用于 hosted 支付跳转。

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

  private parseSceneFromAttach(
    attach: string,
  ): PaymentGatewayScene | "UNKNOWN" {
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
    if (payStatus === 3) return "已放弃";
    if (payStatus === 4) return "支付失败";
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

  /**
   * 查询支付订单列表。
   * @param options 查询条件
   * @returns 订单记录数组
   */
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
    const dappid = String(
      options.dappid || this.dcContext.appInfo.appId || "dianping",
    ).trim();
    const pageNum = Math.max(1, Number(options.pageNum || 1));
    const pageSize = Math.max(1, Math.min(100, Number(options.pageSize || 20)));

    // 订单查询走支付网关的 libp2p gRPC 通道，不再依赖 HTTP（浏览器直连时
    // 网关的 CORS 白名单覆盖不到任意前端源）。鉴权与 HTTP /order/list 同口径：
    // account 维度签名，可带应用过滤条件。
    const authToken = await this.buildOrderQueryAuthToken(
      ORDER_QUERY_OP_BY_ACCOUNT,
      account,
      dappid,
    );
    const grpcClient = await this.getPayGrpcClient(authToken);
    const pbReq = pb.GetPayOrdersByAccountRequest.create({
      account,
      dappid,
      pageNum,
      pageSize,
    });
    const requestBytes = pb.GetPayOrdersByAccountRequest.encode(pbReq).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetPayOrdersByAccount",
      requestBytes,
      30000,
    );
    const listResp = pb.ListPayOrdersResponse.decode(responseBytes);
    if (Number(listResp?.code || 0) !== 0) {
      throw new Error(listResp?.msg || "订单列表查询失败");
    }

    const orderList = Array.isArray(listResp?.data) ? listResp.data : [];

    const billMap = new Map<string, any>();
    if (!options.skipBillCheck && orderList.length > 0) {
      // 账单只跟账户绑定、不跟应用绑定，按 account+dappid="" 单独签名；
      // 网关按订单归属账户校验，凭订单号枚举他人账单会被拒绝。
      const billToken = await this.buildOrderQueryAuthToken(
        ORDER_QUERY_OP_BY_ACCOUNT,
        account,
        "",
      );
      const billClient = await this.getPayGrpcClient(billToken);
      const billList = await Promise.all(
        orderList.map(async (order: any) => {
          const outTradeNo = String(
            this.pickRecordField(order, "outTradeNo", "out_trade_no") || "",
          ).trim();
          if (!outTradeNo) {
            return null;
          }
          try {
            const billReq = pb.GetPayBillByTradeNoRequest.create({
              outTradeNo,
            });
            const billBytes = pb.GetPayBillByTradeNoRequest.encode(
              billReq,
            ).finish();
            const billRespBytes = await billClient.unaryCall(
              "/pb.PayService/GetPayBillByTradeNo",
              billBytes,
              30000,
            );
            const billResp = pb.GetPayBillResponse.decode(billRespBytes);
            if (Number(billResp?.code || 0) !== 0) {
              return null;
            }
            return billResp?.data || null;
          } catch {
            return null;
          }
        }),
      );
      billList.forEach((bill: any) => {
        const outTradeNo = String(
          this.pickRecordField(bill, "outTradeNo", "out_trade_no") || "",
        ).trim();
        if (outTradeNo) {
          billMap.set(outTradeNo, bill);
        }
      });
    }

    return this.normalizeOrderRecords(orderList, billMap);
  }

  /**
   * 兼容读取网关字段：gRPC 通道返回 camelCase（PayOrderInfo/PayBillInfo），
   * 历史 HTTP 通道返回 snake_case，两条路径共用同一份归一化。
   */
  private pickRecordField(
    row: any,
    camelKey: string,
    snakeKey: string,
  ): string {
    if (!row) return "";
    const value = row[camelKey] ?? row[snakeKey];
    return value === undefined || value === null ? "" : String(value);
  }

  /** 将网关返回的原始订单行归一化为 IPaymentOrderRecord。 */
  private normalizeOrderRecords(
    orderList: any[],
    billMap: Map<string, any>,
  ): IPaymentOrderRecord[] {
    const normalizedRecords: Array<IPaymentOrderRecord | null> = orderList.map(
      (order: any) => {
        const outTradeNo = String(
          this.pickRecordField(order, "outTradeNo", "out_trade_no") || "",
        ).trim();
        if (!outTradeNo) return null;

        const reqTextRaw = String(
          this.pickRecordField(order, "reqText", "req_text") || "",
        ).trim();
        let reqText: any = {};
        if (reqTextRaw) {
          try {
            reqText = JSON.parse(reqTextRaw);
          } catch {
            reqText = {};
          }
        }

        const bill = billMap.get(outTradeNo) || {};
        const payStatus = Number(
          this.pickRecordField(order, "payStatus", "pay_status") || 0,
        );
        const tradeState = String(
          this.pickRecordField(bill, "tradeState", "trade_state") || "",
        )
          .trim()
          .toUpperCase();
        const attach = String(reqText?.attach || "").trim();
        const pkgId = this.pickRecordField(order, "pkgId", "pkg_id");

        return {
          outTradeNo,
          account: String(
            this.pickRecordField(order, "account", "account") || "",
          ),
          dappid: String(
            this.pickRecordField(order, "dappid", "dappid") || "",
          ),
          packageId: pkgId,
          packageName: String(
            reqText?.description || `套餐#${pkgId || "-"}`,
          ),
          packageCode: attach.split(":")[1]
            ? String(attach.split(":")[1]).trim()
            : pkgId,
          amountCents: Number(
            this.pickRecordField(order, "total", "total") || 0,
          ),
          priceKey: String(reqText?.price_key || "").trim() || undefined,
          payStatus,
          payStatusText: this.mapPayStatusText(payStatus),
          tradeState,
          tradeStateText: this.mapTradeStateText(tradeState, payStatus),
          tradeType: String(
            this.pickRecordField(bill, "tradeType", "trade_type") || "",
          )
            .trim()
            .toUpperCase(),
          transactionId: String(
            this.pickRecordField(bill, "transactionId", "transaction_id") || "",
          ).trim(),
          successTime: String(
            this.pickRecordField(bill, "successTime", "success_time") || "",
          ).trim(),
          createdAt: String(
            this.pickRecordField(order, "createTime", "create_time") || "",
          ).trim(),
          scene: this.parseSceneFromAttach(attach),
        } as IPaymentOrderRecord;
      },
    );

    return normalizedRecords.filter(
      (item): item is IPaymentOrderRecord => item !== null,
    );
  }

  /**
   * 应用维度订单查询条件（商品管理 / 统计分析用），映射为 gRPC 的
   * PayOrderDappidFilter。与网关过滤口径、账本索引维度对齐：
   * 店铺(dappid) / 商品(price_key、pkg_id) / 状态(pay_status) / 时间(毫秒时间戳，左闭右开)。
   * 时间为毫秒单位，与账本索引里的 created_at 口径一致。
   */
  private buildDappidOrderFilter(options: {
    dappid?: string;
    priceKey?: string;
    pkgId?: number;
    payStatus?: number;
    startTime?: number;
    endTime?: number;
  }): pb.IPayOrderDappidFilter | null {
    const dappid = String(
      options.dappid || this.dcContext.appInfo.appId || "",
    ).trim();
    if (!dappid) {
      return null;
    }
    const filter: pb.IPayOrderDappidFilter = {};
    const priceKey = String(options.priceKey || "").trim();
    if (priceKey) {
      filter.priceKey = priceKey;
    }
    const pkgId = Number(options.pkgId || 0);
    if (Number.isInteger(pkgId) && pkgId > 0) {
      filter.pkgId = pkgId;
    }
    const payStatus = Number(options.payStatus || 0);
    if (Number.isInteger(payStatus) && payStatus >= 1) {
      filter.payStatus = payStatus;
    }
    const startTime = Math.trunc(Number(options.startTime || 0));
    if (Number.isFinite(startTime) && startTime > 0) {
      filter.startTime = startTime;
    }
    const endTime = Math.trunc(Number(options.endTime || 0));
    if (Number.isFinite(endTime) && endTime > 0) {
      filter.endTime = endTime;
    }
    return filter;
  }

  /**
   * 按应用维度查询订单（商品管理 / 统计分析用）。
   * 返回该应用下所有买家的订单，因此网关要求调用者是应用 owner
   * 或配置在 OrderStatsAdminPubkeys 中的统计管理员。
   * 订单由支付网关写入，此接口只读，不存在用户篡改订单的路径。
   */
  async listOrdersByDappid(options: {
    dappid?: string;
    pageNum?: number;
    pageSize?: number;
    priceKey?: string;
    pkgId?: number;
    payStatus?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<IPaymentOrderRecord[]> {
    const result = await this.fetchOrdersByDappid(options);
    return result ? result.list : [];
  }

  /**
   * 按应用维度分页查询订单，返回总数供分页 UI 使用。
   * 过滤条件与 listOrdersByDappid 一致。
   */
  async listOrdersByDappidPage(options: {
    dappid?: string;
    pageNum?: number;
    pageSize?: number;
    priceKey?: string;
    pkgId?: number;
    payStatus?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<{
    list: IPaymentOrderRecord[];
    total: number;
    pageNum: number;
    pageSize: number;
  }> {
    return (
      (await this.fetchOrdersByDappid(options)) || {
        list: [],
        total: 0,
        pageNum: Math.max(1, Number(options.pageNum || 1)),
        pageSize: Math.max(1, Math.min(100, Number(options.pageSize || 20))),
      }
    );
  }

  private async fetchOrdersByDappid(options: {
    dappid?: string;
    pageNum?: number;
    pageSize?: number;
    priceKey?: string;
    pkgId?: number;
    payStatus?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<{
    list: IPaymentOrderRecord[];
    total: number;
    pageNum: number;
    pageSize: number;
  } | null> {
    this.assertInitialized();
    const pageNum = Math.max(1, Number(options.pageNum || 1));
    const pageSize = Math.max(1, Math.min(100, Number(options.pageSize || 20)));
    const filter = this.buildDappidOrderFilter(options);
    if (!filter) {
      return null;
    }
    const dappid = String(
      options.dappid || this.dcContext.appInfo.appId || "",
    ).trim();
    const authToken = await this.buildOrderQueryAuthToken(
      ORDER_QUERY_OP_BY_DAPPID,
      "",
      dappid,
    );
    const grpcClient = await this.getPayGrpcClient(authToken);
    const pbReq = pb.GetPayOrdersByDappidRequest.create({
      dappid,
      pageNum,
      pageSize,
      filter,
    });
    const requestBytes = pb.GetPayOrdersByDappidRequest.encode(pbReq).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetPayOrdersByDappid",
      requestBytes,
      30000,
    );
    const resp = pb.ListPayOrdersResponse.decode(responseBytes);
    if (Number(resp?.code || 0) !== 0) {
      throw new Error(resp?.msg || "应用订单查询失败");
    }

    const orderList = Array.isArray(resp?.data) ? resp.data : [];
    return {
      list: this.normalizeOrderRecords(orderList, new Map()),
      total: Number(resp?.total || 0),
      pageNum,
      pageSize,
    };
  }

  /**
   * 按应用维度统计订单（笔数/已支付笔数/已支付金额）。
   * 与列表同过滤条件同口径，金额只统计已支付订单。
   * 鉴权与订单列表一致：必须是应用 owner 或配置的统计管理员。
   */
  async statsOrdersByDappid(options: {
    dappid?: string;
    priceKey?: string;
    pkgId?: number;
    payStatus?: number;
    startTime?: number;
    endTime?: number;
  }): Promise<{
    totalOrders: number;
    paidOrders: number;
    paidAmount: number;
  }> {
    this.assertInitialized();
    const filter = this.buildDappidOrderFilter(options);
    if (!filter) {
      return { totalOrders: 0, paidOrders: 0, paidAmount: 0 };
    }
    const dappid = String(
      options.dappid || this.dcContext.appInfo.appId || "",
    ).trim();

    const authToken = await this.buildOrderQueryAuthToken(
      ORDER_QUERY_OP_BY_DAPPID,
      "",
      dappid,
    );
    const grpcClient = await this.getPayGrpcClient(authToken);
    const pbReq = pb.GetPayOrderStatsByDappidRequest.create({
      dappid,
      filter,
    });
    const requestBytes = pb.GetPayOrderStatsByDappidRequest.encode(
      pbReq,
    ).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetPayOrderStatsByDappid",
      requestBytes,
      30000,
    );
    const statsResp = pb.GetPayOrderStatsByDappidResponse.decode(responseBytes);
    if (Number(statsResp?.code || 0) !== 0) {
      throw new Error(statsResp?.msg || "应用订单统计失败");
    }
    const data = statsResp?.data || {};
    return {
      totalOrders: Number(data.totalOrders || 0),
      paidOrders: Number(data.paidOrders || 0),
      paidAmount: Number(data.paidAmount || 0),
    };
  }

  private async getPayGrpcClient(
    authToken?: string,
  ): Promise<Libp2pGrpcClient> {
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
      authToken || "",
      payProtocol,
    );
  }

  /**
   * 获取支付网关订单账本写入者配置。
   * 该发现流程只使用 libp2p gRPC，不依赖浏览器 HTTP/CORS。
   */
  async getPaymentLedgerWriter(): Promise<IPaymentLedgerWriterConfig> {
    const grpcClient = await this.getPayGrpcClient();
    const request = pb.GetPaymentLedgerWriterRequest.create({});
    const requestBytes = pb.GetPaymentLedgerWriterRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetPaymentLedgerWriter",
      requestBytes,
      15000,
    );
    const response = pb.GetPaymentLedgerWriterResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "获取支付订单账本写入者配置失败");
    }

    const theme = String(response?.theme || "").trim();
    const writerPubkey = String(response?.writerPubkey || "").trim();
    if (!theme || !writerPubkey) {
      throw new Error("支付网关返回的订单账本写入者配置不完整");
    }

    return {
      theme,
      writerPubkey,
    };
  }

  private async getPackagesFromPayPeer(
    pkgType: number,
    appid?: string,
    scene?: string,
    recommender?: string,
    promotionCatalog: boolean = false,
  ): Promise<pb.PackageInfo[]> {
    const grpcClient = await this.getPayGrpcClient();
    const normalizedScene = String(scene || "").trim();

    const hostname =
      typeof window !== "undefined" ? String(window.location.hostname || "") : "";
    const isGlobalDomain = hostname.endsWith("nowcode.ai");
    const requestObj: any = {
      pkgType,
      lang: isGlobalDomain ? "en" : "zh",
      currency: isGlobalDomain ? "USD" : "CNY",
      appid: appid || "",
      account: promotionCatalog ? "" : this.getCurrentAccount(),
      recommender: promotionCatalog
        ? String(recommender || this.getCurrentPubkey()).trim()
        : this.resolveRecommender(recommender, appid),
      promotionCatalog,
    };
    if (normalizedScene) {
      requestObj.scene = normalizedScene;
    }

    const request = pb.GetPackagesRequest.create(requestObj);
    const requestBytes = pb.GetPackagesRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetPackages",
      requestBytes,
      30000,
    );
    const response = pb.GetPackagesResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "套餐列表查询失败");
    }
    const list = (response.data as pb.PackageInfo[]) || [];
    if (normalizedScene) {
      return list.filter((p: any) => p.scene === normalizedScene);
    }
    return list;
  }

  /**
   * 创建支付订单。
   * @param options 下单参数
   * @returns 商户订单号 outTradeNo
   */
  async createPayOrder(options: {
    account: string;
    packageId: string;
    packageName: string;
    amountCents: number;
    attach: string;
    dappid?: string;
    isRenew?: boolean;
    oldNo?: number;
    priceKey?: string;
    recommender?: string;
  }): Promise<string> {
    const pkgId = Number(options.packageId || 0);
    if (!Number.isFinite(pkgId) || pkgId <= 0) {
      throw new Error("支付套餐ID无效，无法创建订单");
    }

    const grpcClient = await this.getPayGrpcClient();
    const account = String(options.account || this.getCurrentAccount()).trim();
    if (!account) {
      throw new Error("当前付款账号不可用，请先登录");
    }
    const request = pb.CreateOrderRequest.create({
      account,
      pkgId,
      description: String(options.packageName || "商品支付"),
      amount: pb.AmountInfo.create({
        total: Number(options.amountCents || 0),
      }),
      timeExpire: this.buildOrderExpireTime(10),
      dappid: options.dappid || this.dcContext.appInfo.appId || "dianping",
      attach: String(options.attach || ""),
      isRenew: options.isRenew === true,
      oldNo: Number(options.oldNo || 0),
      priceKey: String(options.priceKey || ""),
      recommender: this.resolveRecommender(
        options.recommender,
        options.dappid || this.dcContext.appInfo.appId,
      ),
    });
    const requestBytes = pb.CreateOrderRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/CreateOrder",
      requestBytes,
      30000,
    );
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

  /**
   * 获取 NATIVE 支付二维码链接。
   * @param outTradeNo 商户订单号
   * @returns 支付链接（通常可用于生成二维码）
   */
  async getNativePrepayCodeUrl(outTradeNo: string): Promise<string> {
    if (!outTradeNo) {
      throw new Error("缺少订单号，无法获取二维码");
    }
    const grpcClient = await this.getPayGrpcClient();
    const request = pb.GetNativePrepayRequest.create({ outTradeNo });
    const requestBytes = pb.GetNativePrepayRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetNativePrepay",
      requestBytes,
      30000,
    );
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

  /**
   * 查询订单支付结果。
   * @param outTradeNo 商户订单号
   * @returns 是否支付成功
   */
  async queryPaymentResult(outTradeNo: string): Promise<boolean> {
    if (!outTradeNo) {
      return false;
    }
    const grpcClient = await this.getPayGrpcClient();
    const request = pb.GetStoragePurchaseStatusRequest.create({ outTradeNo });
    const requestBytes =
      pb.GetStoragePurchaseStatusRequest.encode(request).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetStoragePurchaseStatus",
      requestBytes,
      30000,
    );
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
        const requireRecommenderLevel = Math.max(
          0,
          Math.trunc(Number((item as any).requireRecommenderLevel || 0)),
        );
        const requireRecommender =
          Boolean((item as any).requireRecommender) ||
          requireRecommenderLevel > 0;
        const rights = parseRights(String((item as any).pkgRights || ""));
        const aiAppid = String(
          rights.appid || rights.ai_appid || item.serviceAppid || "",
        ).trim();
        const aiAuthor = String(
          rights.author || rights.theme_author || rights.ai_author || "",
        ).trim();
        const aiTheme = String(
          rights.theme || rights.ai_theme || item.theme || "",
        ).trim();
        const aiModel = String(
          rights.model || rights.ai_model || rights.model_name || "",
        ).trim();

        return {
          packageId,
          replacesPkgId: item.replacesPkgId || undefined,
          packageCode,
          pkgType: Number(item.pkgType || 0) || undefined,
          displayName: String(item.pkgName || packageCode || packageId || ""),
          durationDays: Number(item.validDays || 0) || undefined,
          amountCents: Number(item.amount || 0) || undefined,
          currency: String(item.currency || "CNY"),
          serviceAppid: String(item.serviceAppid || ""),
          scene: String(item.scene || ""),
          theme: String(item.theme || ""),
          themeAuthor: String(item.themeAuthor || ""),
          themeAppid: String(item.themeAppid || ""),
          aiAppid: aiAppid || undefined,
          aiAuthor: aiAuthor || undefined,
          aiTheme: aiTheme || undefined,
          aiModel: aiModel || undefined,
          pkgRights: Object.keys(rights).length > 0 ? rights : undefined,
          bussdesc: String(item.bussdesc || ""),
          imglist: String(item.imglist || ""),
          checkStatus: Number(item.checkStatus || 0),
          checkReason: String((item as any).checkReason || ""),
          checkTime: String(item.checkTime || ""),
          createTime: String(item.createTime || ""),
          chainPkgId: Number(item.chainPkgId) || undefined,
          spaceSize: Number(item.spaceSize) || undefined,
          remark:
            typeof (item as any).remark !== "undefined"
              ? String((item as any).remark)
              : undefined,
          firstPayOnly:
            Boolean((item as any).firstPayOnly) || requireRecommender,
          requireRecommender,
          requireRecommenderLevel: requireRecommenderLevel || undefined,
        };
      })
      .filter((item: IRenewPackageInfo) => !!item.packageId);
  }

  /**
   * 拉取续费/购买套餐列表。
   * @param pkgType 套餐类型
   * @param serviceAppid 服务应用 AppID（可选）
   * @param scene 业务场景（可选）
   */
  async listRenewPackages(
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string,
    recommender?: string,
  ): Promise<IRenewPackageInfo[]> {
    const list = await this.getPackagesFromPayPeer(
      pkgType,
      serviceAppid,
      scene,
      recommender,
    );
    let normalized = this.normalizePackages(list);

    if (serviceAppid) {
      normalized = normalized.filter((item: IRenewPackageInfo) => {
        const fromPackage = String(item.serviceAppid || "").trim();
        return !fromPackage || fromPackage === serviceAppid;
      });
    }
    return normalized.filter(
      (item: IRenewPackageInfo) => Number(item.pkgType || 0) === Number(pkgType),
    );
  }

  /**
   * 查询当前推荐人可推广的套餐。推广目录不把推荐人当作买家，
   * 因此不会触发自荐或首次付款历史过滤。
   */
  async listPromotablePackages(
    pkgType: PaymentPackageType | 0,
    serviceAppid: string,
    scene?: string,
    recommender?: string,
  ): Promise<IRenewPackageInfo[]> {
    const normalizedAppid = String(serviceAppid || "").trim();
    if (!normalizedAppid) {
      throw new Error("查询可推广套餐必须提供 serviceAppid");
    }
    const normalizedRecommender = String(
      recommender || this.getCurrentPubkey(),
    ).trim();
    if (!normalizedRecommender) {
      throw new Error("当前推荐人公钥不可用");
    }
    const list = await this.getPackagesFromPayPeer(
      pkgType,
      normalizedAppid,
      scene,
      normalizedRecommender,
      true,
    );
    return this.normalizePackages(list).filter((item: IRenewPackageInfo) => {
      const fromPackage = String(item.serviceAppid || "").trim();
      return (
        (!fromPackage || fromPackage === normalizedAppid) &&
        (Number(pkgType) === 0 ||
          Number(item.pkgType || 0) === Number(pkgType))
      );
    });
  }

  /**
   * 获取指定套餐续费时长（天）。
   * @param packageCode 套餐编码
   * @param targetType 套餐类型
   * @param serviceAppid 服务应用 AppID（可选）
   * @param scene 业务场景（可选）
   */
  async getRenewalDays(
    packageCode: string,
    targetType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string,
  ): Promise<number> {
    const list = await this.listRenewPackages(targetType, serviceAppid, scene);
    const target = list.find((item) => item.packageCode === packageCode);
    const days = Number(target?.durationDays || 0);
    if (!Number.isFinite(days) || days <= 0) {
      throw new Error("套餐有效期无效，请联系管理员配置");
    }
    return days;
  }

  /**
   * 按编码获取指定套餐信息。
   * @param packageCode 套餐编码
   * @param pkgType 套餐类型
   * @param serviceAppid 服务应用 AppID（可选）
   * @param scene 业务场景（可选）
   */
  async getPackageInfo(
    packageCode: string,
    pkgType: PaymentPackageType,
    serviceAppid?: string,
    scene?: string,
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

  /**
   * 应用开发者：申请创建/修改支付套餐（提交审核）。
   * @param request 套餐申请内容
   */
  async applyBusinessPackage(request: IPackageApplyRequest): Promise<boolean> {
    const recommenderLevel = Math.max(
      0,
      Math.trunc(Number(request.requireRecommenderLevel || 0)),
    );
    const referralPackage =
      request.requireRecommender === true || recommenderLevel > 0;
    const normalizedRequest = {
      ...request,
      firstPayOnly: request.firstPayOnly === true || referralPackage,
      requireRecommender: referralPackage,
      requireRecommenderLevel: recommenderLevel,
    };
    const timestampSec = Math.floor(Date.now() / 1000);
    const signPayload = this.buildApplyPackageSignPayload(
      normalizedRequest,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(
      signPayload,
      timestampSec,
    );
    const grpcClient = await this.getPayGrpcClient(authToken);

    let pkgRightsStr = "";
    if (request.pkgRights) {
      pkgRightsStr =
        typeof request.pkgRights === "string"
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
      serviceAppid: String(
        request.serviceAppid || this.dcContext.appInfo.appId || "",
      ),
      replacesPkgId: Number(request.replacesPkgId || 0),
      chainPkgId: Number(request.chainPkgId || 0),
      spaceSize: Number(request.spaceSize || 0),
      remark: String(request.remark || ""),
      firstPayOnly: normalizedRequest.firstPayOnly,
      requireRecommender: normalizedRequest.requireRecommender,
      requireRecommenderLevel: normalizedRequest.requireRecommenderLevel,
    });

    const requestBytes = pb.ApplyBussPackageRequest.encode(pbReq).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/ApplyBussPackage",
      requestBytes,
      30000,
    );
    const response = pb.ApplyBussPackageResponse.decode(responseBytes);

    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "申请业务套餐配置失败");
    }
    return true;
  }

  /**
   * 应用开发者：查询自己应用下的所有套餐配置列表（含审核状态）。
   * @param filter 查询过滤条件
   */
  async getAllPackagesConfig(
    filter: IPackageConfigFilter,
  ): Promise<IPackageConfigListResult> {
    const grpcClient = await this.getPayGrpcClient();
    const pbReq = pb.GetAllPackagesConfigRequest.create({
      pageNum: filter.pageNum || 1,
      pageSize: filter.pageSize || 20,
      pkgType: filter.pkgType !== undefined ? filter.pkgType : -1,
      checkStatus: filter.checkStatus || 0,
      appid: String(filter.appid || this.dcContext.appInfo.appId || ""),
    });

    const requestBytes = pb.GetAllPackagesConfigRequest.encode(pbReq).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetAllPackagesConfig",
      requestBytes,
      30000,
    );
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

  /**
   * 应用开发者：删除自己应用下的支付套餐配置。
   * @param packageId 套餐ID
   */
  async deleteBusinessPackage(packageId: string): Promise<boolean> {
    this.assertInitialized();
    const normalizedId = String(packageId || "").trim();
    if (!normalizedId) {
      throw new Error("缺少套餐ID，无法删除");
    }

    const pkgId = Number(normalizedId);
    if (!Number.isFinite(pkgId) || pkgId <= 0) {
      throw new Error("套餐ID格式无效，无法删除");
    }

    const timestampSec = Math.floor(Date.now() / 1000);
    const signPayload = this.buildDeletePackageSignPayload(pkgId, timestampSec);
    const authToken = await this.buildPackageMutationAuthToken(
      signPayload,
      timestampSec,
    );
    const grpcClient = await this.getPayGrpcClient(authToken);

    const pbReq = pb.PackageInfo.create({
      pkgId,
    });
    const requestBytes = pb.PackageInfo.encode(pbReq).finish();
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/DeleteBussPackage",
      requestBytes,
      30000,
    );
    const response = pb.ApplyBussPackageResponse.decode(responseBytes);

    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "删除套餐失败");
    }
    return true;
  }

  async getRecommenderAppPolicyAccess(
    serviceAppid: string,
  ): Promise<IRecommenderAppPolicyAccess> {
    const normalizedAppid = String(serviceAppid || "").trim();
    if (!normalizedAppid) {
      throw new Error("缺少应用 AppID，无法查询推广配置权限");
    }
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderAppPolicyAccessPayload(
      normalizedAppid,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(
      payload,
      timestampSec,
    );
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.GetRecommenderAppPolicyAccessRequest.create({
      serviceAppid: normalizedAppid,
    });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/GetRecommenderAppPolicyAccess",
      pb.GetRecommenderAppPolicyAccessRequest.encode(request).finish(),
      30000,
    );
    const response = pb.GetRecommenderAppPolicyAccessResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "查询推广配置权限失败");
    }
    return {
      role: String(response.role || ""),
      canManagePolicy: Boolean(response.canManagePolicy),
      canManageManagers: Boolean(response.canManageManagers),
      ownerPubkey: String(response.ownerPubkey || ""),
      signerPubkey: String(response.signerPubkey || ""),
    };
  }

  async listRecommenderAppPolicies(options: {
    serviceAppid: string;
    recommenderPubkey?: string;
    recommenderLevel?: number;
    pageNum?: number;
    pageSize?: number;
  }): Promise<{ list: IRecommenderAppPolicy[]; total: number }> {
    const serviceAppid = String(options?.serviceAppid || "").trim();
    if (!serviceAppid) {
      throw new Error("缺少应用 AppID，无法查询推广比例");
    }
    const recommenderPubkey = String(options?.recommenderPubkey || "").trim();
    const recommenderLevel = recommenderPubkey
      ? 0
      : Math.max(0, Math.trunc(Number(options?.recommenderLevel || 0)));
    const pageNum = Math.max(1, Math.trunc(Number(options?.pageNum || 1)));
    const pageSize = Math.max(
      1,
      Math.min(100, Math.trunc(Number(options?.pageSize || 20))),
    );
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderAppPolicyListPayload(
      serviceAppid,
      recommenderPubkey,
      recommenderLevel,
      pageNum,
      pageSize,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(payload, timestampSec);
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.ListRecommenderAppPoliciesRequest.create({
      serviceAppid,
      recommenderPubkey,
      recommenderLevel,
      pageNum,
      pageSize,
    });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/ListRecommenderAppPolicies",
      pb.ListRecommenderAppPoliciesRequest.encode(request).finish(),
      30000,
    );
    const response = pb.ListRecommenderAppPoliciesResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "查询推广比例失败");
    }
    const list = Array.from(response.data || []).map((item) => ({
      id: Number(item.id || 0),
      serviceAppid: String(item.serviceAppid || ""),
      recommenderPubkey: String(item.recommenderPubkey || ""),
      recommenderLevel: Number(item.recommenderLevel || 0),
      hasFirstPayRatio: Boolean(item.hasFirstPayRatio),
      firstPayRatio: Number(item.firstPayRatio || 0),
      hasSubsequentPayRatio: Boolean(item.hasSubsequentPayRatio),
      subsequentPayRatio: Number(item.subsequentPayRatio || 0),
      remark: String(item.remark || ""),
      createTime: String(item.createTime || ""),
      updateTime: String(item.updateTime || ""),
    }));
    return { list, total: Number(response.total || 0) };
  }

  async upsertRecommenderAppPolicy(
    input: IRecommenderAppPolicyInput,
  ): Promise<boolean> {
    const normalized: IRecommenderAppPolicyInput = {
      serviceAppid: String(input?.serviceAppid || "").trim(),
      recommenderPubkey: String(input?.recommenderPubkey || "").trim(),
      recommenderLevel: Math.max(0, Math.trunc(Number(input?.recommenderLevel || 0))),
      hasFirstPayRatio: input?.hasFirstPayRatio === true,
      firstPayRatio: Number(input?.firstPayRatio || 0),
      hasSubsequentPayRatio: input?.hasSubsequentPayRatio === true,
      subsequentPayRatio: Number(input?.subsequentPayRatio || 0),
      remark: String(input?.remark || "").trim(),
    };
    if (!normalized.serviceAppid) {
      throw new Error("缺少应用 AppID，无法保存推广比例");
    }
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderAppPolicyUpsertPayload(
      normalized,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(payload, timestampSec);
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.UpsertRecommenderAppPolicyRequest.create({
      serviceAppid: normalized.serviceAppid,
      recommenderPubkey: normalized.recommenderPubkey,
      recommenderLevel: normalized.recommenderLevel,
      hasFirstPayRatio: normalized.hasFirstPayRatio,
      firstPayRatio: normalized.firstPayRatio,
      hasSubsequentPayRatio: normalized.hasSubsequentPayRatio,
      subsequentPayRatio: normalized.subsequentPayRatio,
      remark: normalized.remark,
    });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/UpsertRecommenderAppPolicy",
      pb.UpsertRecommenderAppPolicyRequest.encode(request).finish(),
      30000,
    );
    const response = pb.RecommenderAppPolicyMutationResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "保存推广比例失败");
    }
    return true;
  }

  async listRecommenderLevelDefinitions(options: {
    serviceAppid: string;
    pageNum?: number;
    pageSize?: number;
  }): Promise<{ list: IRecommenderLevelDefinition[]; total: number }> {
    const serviceAppid = String(options?.serviceAppid || "").trim();
    if (!serviceAppid) {
      throw new Error("缺少应用 AppID，无法查询推荐等级目录");
    }
    const pageNum = Math.max(1, Math.trunc(Number(options?.pageNum || 1)));
    const pageSize = Math.max(1, Math.min(100, Math.trunc(Number(options?.pageSize || 100))));
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderLevelDefinitionListPayload(serviceAppid, pageNum, pageSize, timestampSec);
    const authToken = await this.buildPackageMutationAuthToken(payload, timestampSec);
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.ListRecommenderLevelDefinitionsRequest.create({ serviceAppid, pageNum, pageSize });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/ListRecommenderLevelDefinitions",
      pb.ListRecommenderLevelDefinitionsRequest.encode(request).finish(),
      30000,
    );
    const response = pb.ListRecommenderLevelDefinitionsResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "查询推荐等级目录失败");
    }
    const list = Array.from(response.data || []).map((item) => ({
      id: Number(item.id || 0),
      level: Number(item.level || 0),
      name: String(item.name || ""),
      description: String(item.description || ""),
      remark: String(item.remark || ""),
      createTime: String(item.createTime || ""),
      updateTime: String(item.updateTime || ""),
    }));
    return { list, total: Number(response.total || 0) };
  }

  async deleteRecommenderAppPolicy(
    serviceAppid: string,
    recommenderPubkey = "",
    recommenderLevel = 0,
  ): Promise<boolean> {
    const normalizedAppid = String(serviceAppid || "").trim();
    const normalizedPubkey = String(recommenderPubkey || "").trim();
    const normalizedLevel = normalizedPubkey
      ? 0
      : Math.max(0, Math.trunc(Number(recommenderLevel || 0)));
    if (!normalizedAppid) {
      throw new Error("缺少应用 AppID，无法删除推广比例");
    }
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderAppPolicyDeletePayload(
      normalizedAppid,
      normalizedPubkey,
      normalizedLevel,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(payload, timestampSec);
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.DeleteRecommenderAppPolicyRequest.create({
      serviceAppid: normalizedAppid,
      recommenderPubkey: normalizedPubkey,
      recommenderLevel: normalizedLevel,
    });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/DeleteRecommenderAppPolicy",
      pb.DeleteRecommenderAppPolicyRequest.encode(request).finish(),
      30000,
    );
    const response = pb.RecommenderAppPolicyMutationResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "删除推广比例失败");
    }
    return true;
  }

  async listRecommenderAppManagers(options: {
    serviceAppid: string;
    managerPubkey?: string;
    pageNum?: number;
    pageSize?: number;
  }): Promise<{ list: IRecommenderAppManager[]; total: number }> {
    const serviceAppid = String(options?.serviceAppid || "").trim();
    const managerPubkey = String(options?.managerPubkey || "").trim();
    const pageNum = Math.max(1, Math.trunc(Number(options?.pageNum || 1)));
    const pageSize = Math.max(
      1,
      Math.min(100, Math.trunc(Number(options?.pageSize || 20))),
    );
    if (!serviceAppid) {
      throw new Error("缺少应用 AppID，无法查询授权用户");
    }
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderAppManagerListPayload(
      serviceAppid,
      managerPubkey,
      pageNum,
      pageSize,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(payload, timestampSec);
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.ListRecommenderAppManagersRequest.create({
      serviceAppid,
      managerPubkey,
      pageNum,
      pageSize,
    });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/ListRecommenderAppManagers",
      pb.ListRecommenderAppManagersRequest.encode(request).finish(),
      30000,
    );
    const response = pb.ListRecommenderAppManagersResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "查询推广配置授权用户失败");
    }
    const list = Array.from(response.data || []).map((item) => ({
      id: Number(item.id || 0),
      serviceAppid: String(item.serviceAppid || ""),
      managerPubkey: String(item.managerPubkey || ""),
      grantedBy: String(item.grantedBy || ""),
      grantedByType: String(item.grantedByType || ""),
      remark: String(item.remark || ""),
      createTime: String(item.createTime || ""),
      updateTime: String(item.updateTime || ""),
    }));
    return { list, total: Number(response.total || 0) };
  }

  async upsertRecommenderAppManager(
    input: IRecommenderAppManagerInput,
  ): Promise<boolean> {
    const normalized: IRecommenderAppManagerInput = {
      serviceAppid: String(input?.serviceAppid || "").trim(),
      managerPubkey: String(input?.managerPubkey || "").trim(),
      remark: String(input?.remark || "").trim(),
    };
    if (!normalized.serviceAppid || !normalized.managerPubkey) {
      throw new Error("应用 AppID 和授权用户 Pubkey 不能为空");
    }
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderAppManagerUpsertPayload(
      normalized,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(payload, timestampSec);
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.UpsertRecommenderAppManagerRequest.create({
      serviceAppid: normalized.serviceAppid,
      managerPubkey: normalized.managerPubkey,
      remark: normalized.remark,
    });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/UpsertRecommenderAppManager",
      pb.UpsertRecommenderAppManagerRequest.encode(request).finish(),
      30000,
    );
    const response = pb.RecommenderAppManagerMutationResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "授权推广配置管理员失败");
    }
    return true;
  }

  async deleteRecommenderAppManager(
    serviceAppid: string,
    managerPubkey: string,
  ): Promise<boolean> {
    const normalizedAppid = String(serviceAppid || "").trim();
    const normalizedPubkey = String(managerPubkey || "").trim();
    if (!normalizedAppid || !normalizedPubkey) {
      throw new Error("应用 AppID 和授权用户 Pubkey 不能为空");
    }
    const timestampSec = Math.floor(Date.now() / 1000);
    const payload = this.buildRecommenderAppManagerDeletePayload(
      normalizedAppid,
      normalizedPubkey,
      timestampSec,
    );
    const authToken = await this.buildPackageMutationAuthToken(payload, timestampSec);
    const grpcClient = await this.getPayGrpcClient(authToken);
    const request = pb.DeleteRecommenderAppManagerRequest.create({
      serviceAppid: normalizedAppid,
      managerPubkey: normalizedPubkey,
    });
    const responseBytes = await grpcClient.unaryCall(
      "/pb.PayService/DeleteRecommenderAppManager",
      pb.DeleteRecommenderAppManagerRequest.encode(request).finish(),
      30000,
    );
    const response = pb.RecommenderAppManagerMutationResponse.decode(responseBytes);
    if (Number(response?.code || 0) !== 0) {
      throw new Error(response?.msg || "取消推广配置管理员授权失败");
    }
    return true;
  }

  /**
   * 将当前页面标记为支付回跳页。
   * @param scene 支付场景
   * @returns 标记后的 URL
   */
  markCurrentUrlAsPayReturn(scene?: PaymentGatewayScene): string {
    const url = new URL(globalThis.window.location.href);
    url.searchParams.delete(this.returnOrderKey);
    url.searchParams.delete(this.returnOriginOrderKey);
    url.searchParams.set(this.returnFlagKey, "1");
    if (scene) {
      url.searchParams.set(this.returnSceneKey, scene);
    }
    url.searchParams.set("t", String(Date.now()));
    return url.toString();
  }

  /**
   * 判断当前 URL 是否为支付回跳页。
   * @param scene 支付场景
   */
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

  /**
   * 清理 URL 中支付回跳相关参数。
   */
  clearPayReturnUrlParams(): void {
    try {
      const url = new URL(globalThis.window.location.href);
      let changed = false;
      [
        this.returnFlagKey,
        this.returnSceneKey,
        this.returnOrderKey,
        this.returnOriginOrderKey,
      ].forEach((key) => {
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

  /**
   * 构建托管收银台 URL。
   * @param options 收银台参数
   * @returns 可直接跳转的支付 URL
   */
  buildHostedCheckoutUrl(options: {
    account: string;
    packageCode: string;
    packageName: string;
    amountCents: number;
    returnUrl: string;
    attach?: string;
    outTradeNo?: string;
    priceKey?: string;
    title?: string;
  }): string {
    if (!this.hostedPayBaseUrl) {
      throw new Error("缺少 hostedPayBaseUrl 配置");
    }
    let target: URL;
    try {
      target = new URL(this.hostedPayBaseUrl.replace(/\/+$/, ""));
    } catch {
      throw new Error(`hostedPayBaseUrl 格式无效：${this.hostedPayBaseUrl}`);
    }
    target.searchParams.set("account", String(options.account || ""));
    target.searchParams.set("pkg_id", String(options.packageCode || ""));
    target.searchParams.set("amount", String(options.amountCents || 0));
    target.searchParams.set("return_url", options.returnUrl || "");
    target.searchParams.set("title", options.title || options.packageName);
    target.searchParams.set(
      "description",
      options.packageName || options.title || "-",
    );
    if (options.attach) {
      target.searchParams.set("attach", String(options.attach));
    }
    if (options.outTradeNo) {
      target.searchParams.set("out_trade_no", String(options.outTradeNo));
    }
    if (options.priceKey) {
      target.searchParams.set("price_key", String(options.priceKey));
    }
    return target.toString();
  }

  /**
   * 暂存待支付信息。
   */
  markPendingGatewayPayment(info: IPendingGatewayPayment): void {
    try {
      localStorage.setItem(this.pendingPaymentKey, JSON.stringify(info));
    } catch (e) {
      logger.warn("保存支付状态失败", e);
    }
  }

  /**
   * 获取暂存的待支付信息。
   */
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

  /**
   * 清除暂存的待支付信息。
   */
  clearPendingGatewayPayment(): void {
    try {
      localStorage.removeItem(this.pendingPaymentKey);
    } catch {
      // ignore
    }
  }
}
