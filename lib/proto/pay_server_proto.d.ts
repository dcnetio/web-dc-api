import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace pb. */
export namespace pb {

    /** Represents a PayService */
    class PayService extends $protobuf.rpc.Service {

        /**
         * Constructs a new PayService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new PayService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): PayService;

        /**
         * Calls GetPackages.
         * @param request GetPackagesRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetPackagesResponse
         */
        public getPackages(request: pb.IGetPackagesRequest, callback: pb.PayService.GetPackagesCallback): void;

        /**
         * Calls GetPackages.
         * @param request GetPackagesRequest message or plain object
         * @returns Promise
         */
        public getPackages(request: pb.IGetPackagesRequest): Promise<pb.GetPackagesResponse>;

        /**
         * Calls ApplyBussPackage.
         * @param request ApplyBussPackageRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ApplyBussPackageResponse
         */
        public applyBussPackage(request: pb.IApplyBussPackageRequest, callback: pb.PayService.ApplyBussPackageCallback): void;

        /**
         * Calls ApplyBussPackage.
         * @param request ApplyBussPackageRequest message or plain object
         * @returns Promise
         */
        public applyBussPackage(request: pb.IApplyBussPackageRequest): Promise<pb.ApplyBussPackageResponse>;

        /**
         * Calls GetAllPackagesConfig.
         * @param request GetAllPackagesConfigRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetAllPackagesConfigResponse
         */
        public getAllPackagesConfig(request: pb.IGetAllPackagesConfigRequest, callback: pb.PayService.GetAllPackagesConfigCallback): void;

        /**
         * Calls GetAllPackagesConfig.
         * @param request GetAllPackagesConfigRequest message or plain object
         * @returns Promise
         */
        public getAllPackagesConfig(request: pb.IGetAllPackagesConfigRequest): Promise<pb.GetAllPackagesConfigResponse>;

        /**
         * Calls DeleteBussPackage.
         * @param request PackageInfo message or plain object
         * @param callback Node-style callback called with the error, if any, and ApplyBussPackageResponse
         */
        public deleteBussPackage(request: pb.IPackageInfo, callback: pb.PayService.DeleteBussPackageCallback): void;

        /**
         * Calls DeleteBussPackage.
         * @param request PackageInfo message or plain object
         * @returns Promise
         */
        public deleteBussPackage(request: pb.IPackageInfo): Promise<pb.ApplyBussPackageResponse>;

        /**
         * Calls AuditBussPackage.
         * @param request PackageInfo message or plain object
         * @param callback Node-style callback called with the error, if any, and ApplyBussPackageResponse
         */
        public auditBussPackage(request: pb.IPackageInfo, callback: pb.PayService.AuditBussPackageCallback): void;

        /**
         * Calls AuditBussPackage.
         * @param request PackageInfo message or plain object
         * @returns Promise
         */
        public auditBussPackage(request: pb.IPackageInfo): Promise<pb.ApplyBussPackageResponse>;

        /**
         * Calls CreateOrder.
         * @param request CreateOrderRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and CreateOrderResponse
         */
        public createOrder(request: pb.ICreateOrderRequest, callback: pb.PayService.CreateOrderCallback): void;

        /**
         * Calls CreateOrder.
         * @param request CreateOrderRequest message or plain object
         * @returns Promise
         */
        public createOrder(request: pb.ICreateOrderRequest): Promise<pb.CreateOrderResponse>;

        /**
         * Calls GetNativePrepay.
         * @param request GetNativePrepayRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetNativePrepayResponse
         */
        public getNativePrepay(request: pb.IGetNativePrepayRequest, callback: pb.PayService.GetNativePrepayCallback): void;

        /**
         * Calls GetNativePrepay.
         * @param request GetNativePrepayRequest message or plain object
         * @returns Promise
         */
        public getNativePrepay(request: pb.IGetNativePrepayRequest): Promise<pb.GetNativePrepayResponse>;

        /**
         * Calls GetH5Prepay.
         * @param request GetH5PrepayRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetH5PrepayResponse
         */
        public getH5Prepay(request: pb.IGetH5PrepayRequest, callback: pb.PayService.GetH5PrepayCallback): void;

        /**
         * Calls GetH5Prepay.
         * @param request GetH5PrepayRequest message or plain object
         * @returns Promise
         */
        public getH5Prepay(request: pb.IGetH5PrepayRequest): Promise<pb.GetH5PrepayResponse>;

        /**
         * Calls GetJSAPIPrepay.
         * @param request GetJSAPIPrepayRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetJSAPIPrepayResponse
         */
        public getJSAPIPrepay(request: pb.IGetJSAPIPrepayRequest, callback: pb.PayService.GetJSAPIPrepayCallback): void;

        /**
         * Calls GetJSAPIPrepay.
         * @param request GetJSAPIPrepayRequest message or plain object
         * @returns Promise
         */
        public getJSAPIPrepay(request: pb.IGetJSAPIPrepayRequest): Promise<pb.GetJSAPIPrepayResponse>;

        /**
         * Calls GetStoragePurchaseStatus.
         * @param request GetStoragePurchaseStatusRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetStoragePurchaseStatusResponse
         */
        public getStoragePurchaseStatus(request: pb.IGetStoragePurchaseStatusRequest, callback: pb.PayService.GetStoragePurchaseStatusCallback): void;

        /**
         * Calls GetStoragePurchaseStatus.
         * @param request GetStoragePurchaseStatusRequest message or plain object
         * @returns Promise
         */
        public getStoragePurchaseStatus(request: pb.IGetStoragePurchaseStatusRequest): Promise<pb.GetStoragePurchaseStatusResponse>;

        /**
         * Calls CreateCidInfo.
         * @param request CreateCidInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and CreateCidInfoResponse
         */
        public createCidInfo(request: pb.ICreateCidInfoRequest, callback: pb.PayService.CreateCidInfoCallback): void;

        /**
         * Calls CreateCidInfo.
         * @param request CreateCidInfoRequest message or plain object
         * @returns Promise
         */
        public createCidInfo(request: pb.ICreateCidInfoRequest): Promise<pb.CreateCidInfoResponse>;

        /**
         * Calls GetCidInfo.
         * @param request GetCidInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetCidInfoResponse
         */
        public getCidInfo(request: pb.IGetCidInfoRequest, callback: pb.PayService.GetCidInfoCallback): void;

        /**
         * Calls GetCidInfo.
         * @param request GetCidInfoRequest message or plain object
         * @returns Promise
         */
        public getCidInfo(request: pb.IGetCidInfoRequest): Promise<pb.GetCidInfoResponse>;

        /**
         * Calls GetEarningsSummary.
         * @param request GetEarningsSummaryRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetEarningsSummaryResponse
         */
        public getEarningsSummary(request: pb.IGetEarningsSummaryRequest, callback: pb.PayService.GetEarningsSummaryCallback): void;

        /**
         * Calls GetEarningsSummary.
         * @param request GetEarningsSummaryRequest message or plain object
         * @returns Promise
         */
        public getEarningsSummary(request: pb.IGetEarningsSummaryRequest): Promise<pb.GetEarningsSummaryResponse>;

        /**
         * Calls ListEarnings.
         * @param request ListEarningsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListEarningsResponse
         */
        public listEarnings(request: pb.IListEarningsRequest, callback: pb.PayService.ListEarningsCallback): void;

        /**
         * Calls ListEarnings.
         * @param request ListEarningsRequest message or plain object
         * @returns Promise
         */
        public listEarnings(request: pb.IListEarningsRequest): Promise<pb.ListEarningsResponse>;

        /**
         * Calls GetPayeeInfo.
         * @param request GetPayeeInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetPayeeInfoResponse
         */
        public getPayeeInfo(request: pb.IGetPayeeInfoRequest, callback: pb.PayService.GetPayeeInfoCallback): void;

        /**
         * Calls GetPayeeInfo.
         * @param request GetPayeeInfoRequest message or plain object
         * @returns Promise
         */
        public getPayeeInfo(request: pb.IGetPayeeInfoRequest): Promise<pb.GetPayeeInfoResponse>;

        /**
         * Calls SavePayeeInfo.
         * @param request SavePayeeInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and SavePayeeInfoResponse
         */
        public savePayeeInfo(request: pb.ISavePayeeInfoRequest, callback: pb.PayService.SavePayeeInfoCallback): void;

        /**
         * Calls SavePayeeInfo.
         * @param request SavePayeeInfoRequest message or plain object
         * @returns Promise
         */
        public savePayeeInfo(request: pb.ISavePayeeInfoRequest): Promise<pb.SavePayeeInfoResponse>;

        /**
         * Calls ApplyWithdrawal.
         * @param request ApplyWithdrawalRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ApplyWithdrawalResponse
         */
        public applyWithdrawal(request: pb.IApplyWithdrawalRequest, callback: pb.PayService.ApplyWithdrawalCallback): void;

        /**
         * Calls ApplyWithdrawal.
         * @param request ApplyWithdrawalRequest message or plain object
         * @returns Promise
         */
        public applyWithdrawal(request: pb.IApplyWithdrawalRequest): Promise<pb.ApplyWithdrawalResponse>;

        /**
         * Calls ListWithdrawals.
         * @param request ListWithdrawalsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListWithdrawalsResponse
         */
        public listWithdrawals(request: pb.IListWithdrawalsRequest, callback: pb.PayService.ListWithdrawalsCallback): void;

        /**
         * Calls ListWithdrawals.
         * @param request ListWithdrawalsRequest message or plain object
         * @returns Promise
         */
        public listWithdrawals(request: pb.IListWithdrawalsRequest): Promise<pb.ListWithdrawalsResponse>;

        /**
         * Calls GetPayBillByTradeNo.
         * @param request GetPayBillByTradeNoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetPayBillResponse
         */
        public getPayBillByTradeNo(request: pb.IGetPayBillByTradeNoRequest, callback: pb.PayService.GetPayBillByTradeNoCallback): void;

        /**
         * Calls GetPayBillByTradeNo.
         * @param request GetPayBillByTradeNoRequest message or plain object
         * @returns Promise
         */
        public getPayBillByTradeNo(request: pb.IGetPayBillByTradeNoRequest): Promise<pb.GetPayBillResponse>;

        /**
         * Calls GetPayBillByTransactionId.
         * @param request GetPayBillByTransactionIdRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetPayBillResponse
         */
        public getPayBillByTransactionId(request: pb.IGetPayBillByTransactionIdRequest, callback: pb.PayService.GetPayBillByTransactionIdCallback): void;

        /**
         * Calls GetPayBillByTransactionId.
         * @param request GetPayBillByTransactionIdRequest message or plain object
         * @returns Promise
         */
        public getPayBillByTransactionId(request: pb.IGetPayBillByTransactionIdRequest): Promise<pb.GetPayBillResponse>;

        /**
         * Calls ListPayBillsByOpenid.
         * @param request ListPayBillsByOpenidRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPayBillsResponse
         */
        public listPayBillsByOpenid(request: pb.IListPayBillsByOpenidRequest, callback: pb.PayService.ListPayBillsByOpenidCallback): void;

        /**
         * Calls ListPayBillsByOpenid.
         * @param request ListPayBillsByOpenidRequest message or plain object
         * @returns Promise
         */
        public listPayBillsByOpenid(request: pb.IListPayBillsByOpenidRequest): Promise<pb.ListPayBillsResponse>;

        /**
         * Calls ListPayBills.
         * @param request ListPayBillsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPayBillsResponse
         */
        public listPayBills(request: pb.IListPayBillsRequest, callback: pb.PayService.ListPayBillsCallback): void;

        /**
         * Calls ListPayBills.
         * @param request ListPayBillsRequest message or plain object
         * @returns Promise
         */
        public listPayBills(request: pb.IListPayBillsRequest): Promise<pb.ListPayBillsResponse>;

        /**
         * Calls GetPayOrderByTradeNo.
         * @param request GetPayOrderByTradeNoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and GetPayOrderResponse
         */
        public getPayOrderByTradeNo(request: pb.IGetPayOrderByTradeNoRequest, callback: pb.PayService.GetPayOrderByTradeNoCallback): void;

        /**
         * Calls GetPayOrderByTradeNo.
         * @param request GetPayOrderByTradeNoRequest message or plain object
         * @returns Promise
         */
        public getPayOrderByTradeNo(request: pb.IGetPayOrderByTradeNoRequest): Promise<pb.GetPayOrderResponse>;

        /**
         * Calls GetPayOrdersByAccount.
         * @param request GetPayOrdersByAccountRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPayOrdersResponse
         */
        public getPayOrdersByAccount(request: pb.IGetPayOrdersByAccountRequest, callback: pb.PayService.GetPayOrdersByAccountCallback): void;

        /**
         * Calls GetPayOrdersByAccount.
         * @param request GetPayOrdersByAccountRequest message or plain object
         * @returns Promise
         */
        public getPayOrdersByAccount(request: pb.IGetPayOrdersByAccountRequest): Promise<pb.ListPayOrdersResponse>;

        /**
         * Calls GetPayOrdersByDappid.
         * @param request GetPayOrdersByDappidRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPayOrdersResponse
         */
        public getPayOrdersByDappid(request: pb.IGetPayOrdersByDappidRequest, callback: pb.PayService.GetPayOrdersByDappidCallback): void;

        /**
         * Calls GetPayOrdersByDappid.
         * @param request GetPayOrdersByDappidRequest message or plain object
         * @returns Promise
         */
        public getPayOrdersByDappid(request: pb.IGetPayOrdersByDappidRequest): Promise<pb.ListPayOrdersResponse>;

        /**
         * Calls ListPayOrders.
         * @param request ListPayOrdersRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ListPayOrdersResponse
         */
        public listPayOrders(request: pb.IListPayOrdersRequest, callback: pb.PayService.ListPayOrdersCallback): void;

        /**
         * Calls ListPayOrders.
         * @param request ListPayOrdersRequest message or plain object
         * @returns Promise
         */
        public listPayOrders(request: pb.IListPayOrdersRequest): Promise<pb.ListPayOrdersResponse>;

        /**
         * Calls AdminListWithdrawals.
         * @param request AdminListWithdrawalsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminListWithdrawalsResponse
         */
        public adminListWithdrawals(request: pb.IAdminListWithdrawalsRequest, callback: pb.PayService.AdminListWithdrawalsCallback): void;

        /**
         * Calls AdminListWithdrawals.
         * @param request AdminListWithdrawalsRequest message or plain object
         * @returns Promise
         */
        public adminListWithdrawals(request: pb.IAdminListWithdrawalsRequest): Promise<pb.AdminListWithdrawalsResponse>;

        /**
         * Calls AdminAuditWithdrawal.
         * @param request AdminAuditWithdrawalRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminAuditWithdrawalResponse
         */
        public adminAuditWithdrawal(request: pb.IAdminAuditWithdrawalRequest, callback: pb.PayService.AdminAuditWithdrawalCallback): void;

        /**
         * Calls AdminAuditWithdrawal.
         * @param request AdminAuditWithdrawalRequest message or plain object
         * @returns Promise
         */
        public adminAuditWithdrawal(request: pb.IAdminAuditWithdrawalRequest): Promise<pb.AdminAuditWithdrawalResponse>;

        /**
         * Calls AdminListEarnings.
         * @param request AdminListEarningsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminListEarningsResponse
         */
        public adminListEarnings(request: pb.IAdminListEarningsRequest, callback: pb.PayService.AdminListEarningsCallback): void;

        /**
         * Calls AdminListEarnings.
         * @param request AdminListEarningsRequest message or plain object
         * @returns Promise
         */
        public adminListEarnings(request: pb.IAdminListEarningsRequest): Promise<pb.AdminListEarningsResponse>;

        /**
         * Calls AdminGetStats.
         * @param request AdminGetStatsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminGetStatsResponse
         */
        public adminGetStats(request: pb.IAdminGetStatsRequest, callback: pb.PayService.AdminGetStatsCallback): void;

        /**
         * Calls AdminGetStats.
         * @param request AdminGetStatsRequest message or plain object
         * @returns Promise
         */
        public adminGetStats(request: pb.IAdminGetStatsRequest): Promise<pb.AdminGetStatsResponse>;

        /**
         * Calls AdminListPayeeInfo.
         * @param request AdminListPayeeInfoRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminListPayeeInfoResponse
         */
        public adminListPayeeInfo(request: pb.IAdminListPayeeInfoRequest, callback: pb.PayService.AdminListPayeeInfoCallback): void;

        /**
         * Calls AdminListPayeeInfo.
         * @param request AdminListPayeeInfoRequest message or plain object
         * @returns Promise
         */
        public adminListPayeeInfo(request: pb.IAdminListPayeeInfoRequest): Promise<pb.AdminListPayeeInfoResponse>;

        /**
         * Calls AdminUpsertRecommenderLevel.
         * @param request AdminUpsertRecommenderLevelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminUpsertRecommenderLevelResponse
         */
        public adminUpsertRecommenderLevel(request: pb.IAdminUpsertRecommenderLevelRequest, callback: pb.PayService.AdminUpsertRecommenderLevelCallback): void;

        /**
         * Calls AdminUpsertRecommenderLevel.
         * @param request AdminUpsertRecommenderLevelRequest message or plain object
         * @returns Promise
         */
        public adminUpsertRecommenderLevel(request: pb.IAdminUpsertRecommenderLevelRequest): Promise<pb.AdminUpsertRecommenderLevelResponse>;

        /**
         * Calls AdminGetRecommenderLevel.
         * @param request AdminGetRecommenderLevelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminGetRecommenderLevelResponse
         */
        public adminGetRecommenderLevel(request: pb.IAdminGetRecommenderLevelRequest, callback: pb.PayService.AdminGetRecommenderLevelCallback): void;

        /**
         * Calls AdminGetRecommenderLevel.
         * @param request AdminGetRecommenderLevelRequest message or plain object
         * @returns Promise
         */
        public adminGetRecommenderLevel(request: pb.IAdminGetRecommenderLevelRequest): Promise<pb.AdminGetRecommenderLevelResponse>;

        /**
         * Calls AdminListRecommenderLevels.
         * @param request AdminListRecommenderLevelsRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminListRecommenderLevelsResponse
         */
        public adminListRecommenderLevels(request: pb.IAdminListRecommenderLevelsRequest, callback: pb.PayService.AdminListRecommenderLevelsCallback): void;

        /**
         * Calls AdminListRecommenderLevels.
         * @param request AdminListRecommenderLevelsRequest message or plain object
         * @returns Promise
         */
        public adminListRecommenderLevels(request: pb.IAdminListRecommenderLevelsRequest): Promise<pb.AdminListRecommenderLevelsResponse>;

        /**
         * Calls AdminDeleteRecommenderLevel.
         * @param request AdminDeleteRecommenderLevelRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminDeleteRecommenderLevelResponse
         */
        public adminDeleteRecommenderLevel(request: pb.IAdminDeleteRecommenderLevelRequest, callback: pb.PayService.AdminDeleteRecommenderLevelCallback): void;

        /**
         * Calls AdminDeleteRecommenderLevel.
         * @param request AdminDeleteRecommenderLevelRequest message or plain object
         * @returns Promise
         */
        public adminDeleteRecommenderLevel(request: pb.IAdminDeleteRecommenderLevelRequest): Promise<pb.AdminDeleteRecommenderLevelResponse>;

        /**
         * Calls AdminAuditBussPackage.
         * @param request AdminAuditBussPackageRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ApplyBussPackageResponse
         */
        public adminAuditBussPackage(request: pb.IAdminAuditBussPackageRequest, callback: pb.PayService.AdminAuditBussPackageCallback): void;

        /**
         * Calls AdminAuditBussPackage.
         * @param request AdminAuditBussPackageRequest message or plain object
         * @returns Promise
         */
        public adminAuditBussPackage(request: pb.IAdminAuditBussPackageRequest): Promise<pb.ApplyBussPackageResponse>;

        /**
         * Calls AdminUpdateCidCheckStatus.
         * @param request UpdateCheckStatusRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and UpdateCheckStatusResponse
         */
        public adminUpdateCidCheckStatus(request: pb.IUpdateCheckStatusRequest, callback: pb.PayService.AdminUpdateCidCheckStatusCallback): void;

        /**
         * Calls AdminUpdateCidCheckStatus.
         * @param request UpdateCheckStatusRequest message or plain object
         * @returns Promise
         */
        public adminUpdateCidCheckStatus(request: pb.IUpdateCheckStatusRequest): Promise<pb.UpdateCheckStatusResponse>;

        /**
         * Calls AdminPageQueryCidInfo.
         * @param request PageQueryRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and PageQueryResponse
         */
        public adminPageQueryCidInfo(request: pb.IPageQueryRequest, callback: pb.PayService.AdminPageQueryCidInfoCallback): void;

        /**
         * Calls AdminPageQueryCidInfo.
         * @param request PageQueryRequest message or plain object
         * @returns Promise
         */
        public adminPageQueryCidInfo(request: pb.IPageQueryRequest): Promise<pb.PageQueryResponse>;

        /**
         * Calls AdminLogin.
         * @param request AdminLoginRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminLoginResponse
         */
        public adminLogin(request: pb.IAdminLoginRequest, callback: pb.PayService.AdminLoginCallback): void;

        /**
         * Calls AdminLogin.
         * @param request AdminLoginRequest message or plain object
         * @returns Promise
         */
        public adminLogin(request: pb.IAdminLoginRequest): Promise<pb.AdminLoginResponse>;

        /**
         * Calls AdminChangePassword.
         * @param request AdminChangePasswordRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and AdminChangePasswordResponse
         */
        public adminChangePassword(request: pb.IAdminChangePasswordRequest, callback: pb.PayService.AdminChangePasswordCallback): void;

        /**
         * Calls AdminChangePassword.
         * @param request AdminChangePasswordRequest message or plain object
         * @returns Promise
         */
        public adminChangePassword(request: pb.IAdminChangePasswordRequest): Promise<pb.AdminChangePasswordResponse>;
    }

    namespace PayService {

        /**
         * Callback as used by {@link pb.PayService#getPackages}.
         * @param error Error, if any
         * @param [response] GetPackagesResponse
         */
        type GetPackagesCallback = (error: (Error|null), response?: pb.GetPackagesResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#applyBussPackage}.
         * @param error Error, if any
         * @param [response] ApplyBussPackageResponse
         */
        type ApplyBussPackageCallback = (error: (Error|null), response?: pb.ApplyBussPackageResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getAllPackagesConfig}.
         * @param error Error, if any
         * @param [response] GetAllPackagesConfigResponse
         */
        type GetAllPackagesConfigCallback = (error: (Error|null), response?: pb.GetAllPackagesConfigResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#deleteBussPackage}.
         * @param error Error, if any
         * @param [response] ApplyBussPackageResponse
         */
        type DeleteBussPackageCallback = (error: (Error|null), response?: pb.ApplyBussPackageResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#auditBussPackage}.
         * @param error Error, if any
         * @param [response] ApplyBussPackageResponse
         */
        type AuditBussPackageCallback = (error: (Error|null), response?: pb.ApplyBussPackageResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#createOrder}.
         * @param error Error, if any
         * @param [response] CreateOrderResponse
         */
        type CreateOrderCallback = (error: (Error|null), response?: pb.CreateOrderResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getNativePrepay}.
         * @param error Error, if any
         * @param [response] GetNativePrepayResponse
         */
        type GetNativePrepayCallback = (error: (Error|null), response?: pb.GetNativePrepayResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getH5Prepay}.
         * @param error Error, if any
         * @param [response] GetH5PrepayResponse
         */
        type GetH5PrepayCallback = (error: (Error|null), response?: pb.GetH5PrepayResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getJSAPIPrepay}.
         * @param error Error, if any
         * @param [response] GetJSAPIPrepayResponse
         */
        type GetJSAPIPrepayCallback = (error: (Error|null), response?: pb.GetJSAPIPrepayResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getStoragePurchaseStatus}.
         * @param error Error, if any
         * @param [response] GetStoragePurchaseStatusResponse
         */
        type GetStoragePurchaseStatusCallback = (error: (Error|null), response?: pb.GetStoragePurchaseStatusResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#createCidInfo}.
         * @param error Error, if any
         * @param [response] CreateCidInfoResponse
         */
        type CreateCidInfoCallback = (error: (Error|null), response?: pb.CreateCidInfoResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getCidInfo}.
         * @param error Error, if any
         * @param [response] GetCidInfoResponse
         */
        type GetCidInfoCallback = (error: (Error|null), response?: pb.GetCidInfoResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getEarningsSummary}.
         * @param error Error, if any
         * @param [response] GetEarningsSummaryResponse
         */
        type GetEarningsSummaryCallback = (error: (Error|null), response?: pb.GetEarningsSummaryResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#listEarnings}.
         * @param error Error, if any
         * @param [response] ListEarningsResponse
         */
        type ListEarningsCallback = (error: (Error|null), response?: pb.ListEarningsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getPayeeInfo}.
         * @param error Error, if any
         * @param [response] GetPayeeInfoResponse
         */
        type GetPayeeInfoCallback = (error: (Error|null), response?: pb.GetPayeeInfoResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#savePayeeInfo}.
         * @param error Error, if any
         * @param [response] SavePayeeInfoResponse
         */
        type SavePayeeInfoCallback = (error: (Error|null), response?: pb.SavePayeeInfoResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#applyWithdrawal}.
         * @param error Error, if any
         * @param [response] ApplyWithdrawalResponse
         */
        type ApplyWithdrawalCallback = (error: (Error|null), response?: pb.ApplyWithdrawalResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#listWithdrawals}.
         * @param error Error, if any
         * @param [response] ListWithdrawalsResponse
         */
        type ListWithdrawalsCallback = (error: (Error|null), response?: pb.ListWithdrawalsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getPayBillByTradeNo}.
         * @param error Error, if any
         * @param [response] GetPayBillResponse
         */
        type GetPayBillByTradeNoCallback = (error: (Error|null), response?: pb.GetPayBillResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getPayBillByTransactionId}.
         * @param error Error, if any
         * @param [response] GetPayBillResponse
         */
        type GetPayBillByTransactionIdCallback = (error: (Error|null), response?: pb.GetPayBillResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#listPayBillsByOpenid}.
         * @param error Error, if any
         * @param [response] ListPayBillsResponse
         */
        type ListPayBillsByOpenidCallback = (error: (Error|null), response?: pb.ListPayBillsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#listPayBills}.
         * @param error Error, if any
         * @param [response] ListPayBillsResponse
         */
        type ListPayBillsCallback = (error: (Error|null), response?: pb.ListPayBillsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getPayOrderByTradeNo}.
         * @param error Error, if any
         * @param [response] GetPayOrderResponse
         */
        type GetPayOrderByTradeNoCallback = (error: (Error|null), response?: pb.GetPayOrderResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getPayOrdersByAccount}.
         * @param error Error, if any
         * @param [response] ListPayOrdersResponse
         */
        type GetPayOrdersByAccountCallback = (error: (Error|null), response?: pb.ListPayOrdersResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#getPayOrdersByDappid}.
         * @param error Error, if any
         * @param [response] ListPayOrdersResponse
         */
        type GetPayOrdersByDappidCallback = (error: (Error|null), response?: pb.ListPayOrdersResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#listPayOrders}.
         * @param error Error, if any
         * @param [response] ListPayOrdersResponse
         */
        type ListPayOrdersCallback = (error: (Error|null), response?: pb.ListPayOrdersResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminListWithdrawals}.
         * @param error Error, if any
         * @param [response] AdminListWithdrawalsResponse
         */
        type AdminListWithdrawalsCallback = (error: (Error|null), response?: pb.AdminListWithdrawalsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminAuditWithdrawal}.
         * @param error Error, if any
         * @param [response] AdminAuditWithdrawalResponse
         */
        type AdminAuditWithdrawalCallback = (error: (Error|null), response?: pb.AdminAuditWithdrawalResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminListEarnings}.
         * @param error Error, if any
         * @param [response] AdminListEarningsResponse
         */
        type AdminListEarningsCallback = (error: (Error|null), response?: pb.AdminListEarningsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminGetStats}.
         * @param error Error, if any
         * @param [response] AdminGetStatsResponse
         */
        type AdminGetStatsCallback = (error: (Error|null), response?: pb.AdminGetStatsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminListPayeeInfo}.
         * @param error Error, if any
         * @param [response] AdminListPayeeInfoResponse
         */
        type AdminListPayeeInfoCallback = (error: (Error|null), response?: pb.AdminListPayeeInfoResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminUpsertRecommenderLevel}.
         * @param error Error, if any
         * @param [response] AdminUpsertRecommenderLevelResponse
         */
        type AdminUpsertRecommenderLevelCallback = (error: (Error|null), response?: pb.AdminUpsertRecommenderLevelResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminGetRecommenderLevel}.
         * @param error Error, if any
         * @param [response] AdminGetRecommenderLevelResponse
         */
        type AdminGetRecommenderLevelCallback = (error: (Error|null), response?: pb.AdminGetRecommenderLevelResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminListRecommenderLevels}.
         * @param error Error, if any
         * @param [response] AdminListRecommenderLevelsResponse
         */
        type AdminListRecommenderLevelsCallback = (error: (Error|null), response?: pb.AdminListRecommenderLevelsResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminDeleteRecommenderLevel}.
         * @param error Error, if any
         * @param [response] AdminDeleteRecommenderLevelResponse
         */
        type AdminDeleteRecommenderLevelCallback = (error: (Error|null), response?: pb.AdminDeleteRecommenderLevelResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminAuditBussPackage}.
         * @param error Error, if any
         * @param [response] ApplyBussPackageResponse
         */
        type AdminAuditBussPackageCallback = (error: (Error|null), response?: pb.ApplyBussPackageResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminUpdateCidCheckStatus}.
         * @param error Error, if any
         * @param [response] UpdateCheckStatusResponse
         */
        type AdminUpdateCidCheckStatusCallback = (error: (Error|null), response?: pb.UpdateCheckStatusResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminPageQueryCidInfo}.
         * @param error Error, if any
         * @param [response] PageQueryResponse
         */
        type AdminPageQueryCidInfoCallback = (error: (Error|null), response?: pb.PageQueryResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminLogin}.
         * @param error Error, if any
         * @param [response] AdminLoginResponse
         */
        type AdminLoginCallback = (error: (Error|null), response?: pb.AdminLoginResponse) => void;

        /**
         * Callback as used by {@link pb.PayService#adminChangePassword}.
         * @param error Error, if any
         * @param [response] AdminChangePasswordResponse
         */
        type AdminChangePasswordCallback = (error: (Error|null), response?: pb.AdminChangePasswordResponse) => void;
    }

    /** Properties of a GetPackagesRequest. */
    interface IGetPackagesRequest {

        /** GetPackagesRequest pkgType */
        pkgType?: (number|null);

        /** GetPackagesRequest lang */
        lang?: (string|null);

        /** GetPackagesRequest currency */
        currency?: (string|null);

        /** GetPackagesRequest theme */
        theme?: (string|null);

        /** GetPackagesRequest appid */
        appid?: (string|null);

        /** GetPackagesRequest scene */
        scene?: (string|null);
    }

    /** Represents a GetPackagesRequest. */
    class GetPackagesRequest implements IGetPackagesRequest {

        /**
         * Constructs a new GetPackagesRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPackagesRequest);

        /** GetPackagesRequest pkgType. */
        public pkgType: number;

        /** GetPackagesRequest lang. */
        public lang: string;

        /** GetPackagesRequest currency. */
        public currency: string;

        /** GetPackagesRequest theme. */
        public theme: string;

        /** GetPackagesRequest appid. */
        public appid: string;

        /** GetPackagesRequest scene. */
        public scene: string;

        /**
         * Creates a new GetPackagesRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPackagesRequest instance
         */
        public static create(properties?: pb.IGetPackagesRequest): pb.GetPackagesRequest;

        /**
         * Encodes the specified GetPackagesRequest message. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @param message GetPackagesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPackagesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPackagesRequest message, length delimited. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @param message GetPackagesRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPackagesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPackagesRequest;

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPackagesRequest;

        /**
         * Verifies a GetPackagesRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPackagesRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPackagesRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPackagesRequest;

        /**
         * Creates a plain object from a GetPackagesRequest message. Also converts values to other types if specified.
         * @param message GetPackagesRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPackagesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPackagesRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPackagesRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPackagesResponse. */
    interface IGetPackagesResponse {

        /** GetPackagesResponse code */
        code?: (number|null);

        /** GetPackagesResponse msg */
        msg?: (string|null);

        /** GetPackagesResponse data */
        data?: (pb.IPackageInfo[]|null);
    }

    /** Represents a GetPackagesResponse. */
    class GetPackagesResponse implements IGetPackagesResponse {

        /**
         * Constructs a new GetPackagesResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPackagesResponse);

        /** GetPackagesResponse code. */
        public code: number;

        /** GetPackagesResponse msg. */
        public msg: string;

        /** GetPackagesResponse data. */
        public data: pb.IPackageInfo[];

        /**
         * Creates a new GetPackagesResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPackagesResponse instance
         */
        public static create(properties?: pb.IGetPackagesResponse): pb.GetPackagesResponse;

        /**
         * Encodes the specified GetPackagesResponse message. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @param message GetPackagesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPackagesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPackagesResponse message, length delimited. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @param message GetPackagesResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPackagesResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPackagesResponse;

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPackagesResponse;

        /**
         * Verifies a GetPackagesResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPackagesResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPackagesResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPackagesResponse;

        /**
         * Creates a plain object from a GetPackagesResponse message. Also converts values to other types if specified.
         * @param message GetPackagesResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPackagesResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPackagesResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPackagesResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PackageInfo. */
    interface IPackageInfo {

        /** PackageInfo pkgId */
        pkgId?: (number|null);

        /** PackageInfo pkgType */
        pkgType?: (number|null);

        /** PackageInfo scene */
        scene?: (string|null);

        /** PackageInfo pkgName */
        pkgName?: (string|null);

        /** PackageInfo lang */
        lang?: (string|null);

        /** PackageInfo amount */
        amount?: (number|null);

        /** PackageInfo currency */
        currency?: (string|null);

        /** PackageInfo validDays */
        validDays?: (number|null);

        /** PackageInfo pkgRights */
        pkgRights?: (string|null);

        /** PackageInfo chainPkgId */
        chainPkgId?: (number|null);

        /** PackageInfo spaceSize */
        spaceSize?: (number|null);

        /** PackageInfo createTime */
        createTime?: (string|null);

        /** PackageInfo theme */
        theme?: (string|null);

        /** PackageInfo serviceAppid */
        serviceAppid?: (string|null);

        /** PackageInfo bussdesc */
        bussdesc?: (string|null);

        /** PackageInfo imglist */
        imglist?: (string|null);

        /** PackageInfo checkStatus */
        checkStatus?: (number|null);

        /** PackageInfo checkTime */
        checkTime?: (string|null);

        /** PackageInfo themeAuthor */
        themeAuthor?: (string|null);

        /** PackageInfo themeAppid */
        themeAppid?: (string|null);

        /** PackageInfo checkReason */
        checkReason?: (string|null);

        /** PackageInfo replacesPkgId */
        replacesPkgId?: (number|null);

        /** PackageInfo remark */
        remark?: (string|null);
    }

    /** Represents a PackageInfo. */
    class PackageInfo implements IPackageInfo {

        /**
         * Constructs a new PackageInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IPackageInfo);

        /** PackageInfo pkgId. */
        public pkgId: number;

        /** PackageInfo pkgType. */
        public pkgType: number;

        /** PackageInfo scene. */
        public scene: string;

        /** PackageInfo pkgName. */
        public pkgName: string;

        /** PackageInfo lang. */
        public lang: string;

        /** PackageInfo amount. */
        public amount: number;

        /** PackageInfo currency. */
        public currency: string;

        /** PackageInfo validDays. */
        public validDays: number;

        /** PackageInfo pkgRights. */
        public pkgRights: string;

        /** PackageInfo chainPkgId. */
        public chainPkgId: number;

        /** PackageInfo spaceSize. */
        public spaceSize: number;

        /** PackageInfo createTime. */
        public createTime: string;

        /** PackageInfo theme. */
        public theme: string;

        /** PackageInfo serviceAppid. */
        public serviceAppid: string;

        /** PackageInfo bussdesc. */
        public bussdesc: string;

        /** PackageInfo imglist. */
        public imglist: string;

        /** PackageInfo checkStatus. */
        public checkStatus: number;

        /** PackageInfo checkTime. */
        public checkTime: string;

        /** PackageInfo themeAuthor. */
        public themeAuthor: string;

        /** PackageInfo themeAppid. */
        public themeAppid: string;

        /** PackageInfo checkReason. */
        public checkReason: string;

        /** PackageInfo replacesPkgId. */
        public replacesPkgId: number;

        /** PackageInfo remark. */
        public remark: string;

        /**
         * Creates a new PackageInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PackageInfo instance
         */
        public static create(properties?: pb.IPackageInfo): pb.PackageInfo;

        /**
         * Encodes the specified PackageInfo message. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @param message PackageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IPackageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PackageInfo message, length delimited. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @param message PackageInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IPackageInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PackageInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.PackageInfo;

        /**
         * Decodes a PackageInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.PackageInfo;

        /**
         * Verifies a PackageInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PackageInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PackageInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.PackageInfo;

        /**
         * Creates a plain object from a PackageInfo message. Also converts values to other types if specified.
         * @param message PackageInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.PackageInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PackageInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PackageInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ApplyBussPackageRequest. */
    interface IApplyBussPackageRequest {

        /** ApplyBussPackageRequest pkgType */
        pkgType?: (number|null);

        /** ApplyBussPackageRequest scene */
        scene?: (string|null);

        /** ApplyBussPackageRequest bussdesc */
        bussdesc?: (string|null);

        /** ApplyBussPackageRequest imglist */
        imglist?: (string|null);

        /** ApplyBussPackageRequest pkgName */
        pkgName?: (string|null);

        /** ApplyBussPackageRequest lang */
        lang?: (string|null);

        /** ApplyBussPackageRequest amount */
        amount?: (number|null);

        /** ApplyBussPackageRequest currency */
        currency?: (string|null);

        /** ApplyBussPackageRequest validDays */
        validDays?: (number|null);

        /** ApplyBussPackageRequest pkgRights */
        pkgRights?: (string|null);

        /** ApplyBussPackageRequest theme */
        theme?: (string|null);

        /** ApplyBussPackageRequest themeAuthor */
        themeAuthor?: (string|null);

        /** ApplyBussPackageRequest themeAppid */
        themeAppid?: (string|null);

        /** ApplyBussPackageRequest serviceAppid */
        serviceAppid?: (string|null);

        /** ApplyBussPackageRequest chainPkgId */
        chainPkgId?: (number|null);

        /** ApplyBussPackageRequest spaceSize */
        spaceSize?: (number|null);

        /** ApplyBussPackageRequest replacesPkgId */
        replacesPkgId?: (number|null);

        /** ApplyBussPackageRequest remark */
        remark?: (string|null);
    }

    /** Represents an ApplyBussPackageRequest. */
    class ApplyBussPackageRequest implements IApplyBussPackageRequest {

        /**
         * Constructs a new ApplyBussPackageRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IApplyBussPackageRequest);

        /** ApplyBussPackageRequest pkgType. */
        public pkgType: number;

        /** ApplyBussPackageRequest scene. */
        public scene: string;

        /** ApplyBussPackageRequest bussdesc. */
        public bussdesc: string;

        /** ApplyBussPackageRequest imglist. */
        public imglist: string;

        /** ApplyBussPackageRequest pkgName. */
        public pkgName: string;

        /** ApplyBussPackageRequest lang. */
        public lang: string;

        /** ApplyBussPackageRequest amount. */
        public amount: number;

        /** ApplyBussPackageRequest currency. */
        public currency: string;

        /** ApplyBussPackageRequest validDays. */
        public validDays: number;

        /** ApplyBussPackageRequest pkgRights. */
        public pkgRights: string;

        /** ApplyBussPackageRequest theme. */
        public theme: string;

        /** ApplyBussPackageRequest themeAuthor. */
        public themeAuthor: string;

        /** ApplyBussPackageRequest themeAppid. */
        public themeAppid: string;

        /** ApplyBussPackageRequest serviceAppid. */
        public serviceAppid: string;

        /** ApplyBussPackageRequest chainPkgId. */
        public chainPkgId: number;

        /** ApplyBussPackageRequest spaceSize. */
        public spaceSize: number;

        /** ApplyBussPackageRequest replacesPkgId. */
        public replacesPkgId: number;

        /** ApplyBussPackageRequest remark. */
        public remark: string;

        /**
         * Creates a new ApplyBussPackageRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ApplyBussPackageRequest instance
         */
        public static create(properties?: pb.IApplyBussPackageRequest): pb.ApplyBussPackageRequest;

        /**
         * Encodes the specified ApplyBussPackageRequest message. Does not implicitly {@link pb.ApplyBussPackageRequest.verify|verify} messages.
         * @param message ApplyBussPackageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IApplyBussPackageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ApplyBussPackageRequest message, length delimited. Does not implicitly {@link pb.ApplyBussPackageRequest.verify|verify} messages.
         * @param message ApplyBussPackageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IApplyBussPackageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ApplyBussPackageRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ApplyBussPackageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ApplyBussPackageRequest;

        /**
         * Decodes an ApplyBussPackageRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ApplyBussPackageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ApplyBussPackageRequest;

        /**
         * Verifies an ApplyBussPackageRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ApplyBussPackageRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ApplyBussPackageRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.ApplyBussPackageRequest;

        /**
         * Creates a plain object from an ApplyBussPackageRequest message. Also converts values to other types if specified.
         * @param message ApplyBussPackageRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ApplyBussPackageRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ApplyBussPackageRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ApplyBussPackageRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ApplyBussPackageResponse. */
    interface IApplyBussPackageResponse {

        /** ApplyBussPackageResponse code */
        code?: (number|null);

        /** ApplyBussPackageResponse msg */
        msg?: (string|null);

        /** ApplyBussPackageResponse data */
        data?: (pb.IPackageInfo|null);
    }

    /** Represents an ApplyBussPackageResponse. */
    class ApplyBussPackageResponse implements IApplyBussPackageResponse {

        /**
         * Constructs a new ApplyBussPackageResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IApplyBussPackageResponse);

        /** ApplyBussPackageResponse code. */
        public code: number;

        /** ApplyBussPackageResponse msg. */
        public msg: string;

        /** ApplyBussPackageResponse data. */
        public data?: (pb.IPackageInfo|null);

        /**
         * Creates a new ApplyBussPackageResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ApplyBussPackageResponse instance
         */
        public static create(properties?: pb.IApplyBussPackageResponse): pb.ApplyBussPackageResponse;

        /**
         * Encodes the specified ApplyBussPackageResponse message. Does not implicitly {@link pb.ApplyBussPackageResponse.verify|verify} messages.
         * @param message ApplyBussPackageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IApplyBussPackageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ApplyBussPackageResponse message, length delimited. Does not implicitly {@link pb.ApplyBussPackageResponse.verify|verify} messages.
         * @param message ApplyBussPackageResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IApplyBussPackageResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ApplyBussPackageResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ApplyBussPackageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ApplyBussPackageResponse;

        /**
         * Decodes an ApplyBussPackageResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ApplyBussPackageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ApplyBussPackageResponse;

        /**
         * Verifies an ApplyBussPackageResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ApplyBussPackageResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ApplyBussPackageResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.ApplyBussPackageResponse;

        /**
         * Creates a plain object from an ApplyBussPackageResponse message. Also converts values to other types if specified.
         * @param message ApplyBussPackageResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ApplyBussPackageResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ApplyBussPackageResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ApplyBussPackageResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetAllPackagesConfigRequest. */
    interface IGetAllPackagesConfigRequest {

        /** GetAllPackagesConfigRequest pageNum */
        pageNum?: (number|null);

        /** GetAllPackagesConfigRequest pageSize */
        pageSize?: (number|null);

        /** GetAllPackagesConfigRequest pkgType */
        pkgType?: (number|null);

        /** GetAllPackagesConfigRequest checkStatus */
        checkStatus?: (number|null);

        /** GetAllPackagesConfigRequest appid */
        appid?: (string|null);
    }

    /** Represents a GetAllPackagesConfigRequest. */
    class GetAllPackagesConfigRequest implements IGetAllPackagesConfigRequest {

        /**
         * Constructs a new GetAllPackagesConfigRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetAllPackagesConfigRequest);

        /** GetAllPackagesConfigRequest pageNum. */
        public pageNum: number;

        /** GetAllPackagesConfigRequest pageSize. */
        public pageSize: number;

        /** GetAllPackagesConfigRequest pkgType. */
        public pkgType: number;

        /** GetAllPackagesConfigRequest checkStatus. */
        public checkStatus: number;

        /** GetAllPackagesConfigRequest appid. */
        public appid: string;

        /**
         * Creates a new GetAllPackagesConfigRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetAllPackagesConfigRequest instance
         */
        public static create(properties?: pb.IGetAllPackagesConfigRequest): pb.GetAllPackagesConfigRequest;

        /**
         * Encodes the specified GetAllPackagesConfigRequest message. Does not implicitly {@link pb.GetAllPackagesConfigRequest.verify|verify} messages.
         * @param message GetAllPackagesConfigRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetAllPackagesConfigRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetAllPackagesConfigRequest message, length delimited. Does not implicitly {@link pb.GetAllPackagesConfigRequest.verify|verify} messages.
         * @param message GetAllPackagesConfigRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetAllPackagesConfigRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetAllPackagesConfigRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetAllPackagesConfigRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetAllPackagesConfigRequest;

        /**
         * Decodes a GetAllPackagesConfigRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetAllPackagesConfigRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetAllPackagesConfigRequest;

        /**
         * Verifies a GetAllPackagesConfigRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetAllPackagesConfigRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetAllPackagesConfigRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetAllPackagesConfigRequest;

        /**
         * Creates a plain object from a GetAllPackagesConfigRequest message. Also converts values to other types if specified.
         * @param message GetAllPackagesConfigRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetAllPackagesConfigRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetAllPackagesConfigRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetAllPackagesConfigRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetAllPackagesConfigData. */
    interface IGetAllPackagesConfigData {

        /** GetAllPackagesConfigData list */
        list?: (pb.IPackageInfo[]|null);

        /** GetAllPackagesConfigData total */
        total?: (number|Long|null);

        /** GetAllPackagesConfigData pageNum */
        pageNum?: (number|null);

        /** GetAllPackagesConfigData pageSize */
        pageSize?: (number|null);
    }

    /** Represents a GetAllPackagesConfigData. */
    class GetAllPackagesConfigData implements IGetAllPackagesConfigData {

        /**
         * Constructs a new GetAllPackagesConfigData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetAllPackagesConfigData);

        /** GetAllPackagesConfigData list. */
        public list: pb.IPackageInfo[];

        /** GetAllPackagesConfigData total. */
        public total: (number|Long);

        /** GetAllPackagesConfigData pageNum. */
        public pageNum: number;

        /** GetAllPackagesConfigData pageSize. */
        public pageSize: number;

        /**
         * Creates a new GetAllPackagesConfigData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetAllPackagesConfigData instance
         */
        public static create(properties?: pb.IGetAllPackagesConfigData): pb.GetAllPackagesConfigData;

        /**
         * Encodes the specified GetAllPackagesConfigData message. Does not implicitly {@link pb.GetAllPackagesConfigData.verify|verify} messages.
         * @param message GetAllPackagesConfigData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetAllPackagesConfigData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetAllPackagesConfigData message, length delimited. Does not implicitly {@link pb.GetAllPackagesConfigData.verify|verify} messages.
         * @param message GetAllPackagesConfigData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetAllPackagesConfigData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetAllPackagesConfigData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetAllPackagesConfigData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetAllPackagesConfigData;

        /**
         * Decodes a GetAllPackagesConfigData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetAllPackagesConfigData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetAllPackagesConfigData;

        /**
         * Verifies a GetAllPackagesConfigData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetAllPackagesConfigData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetAllPackagesConfigData
         */
        public static fromObject(object: { [k: string]: any }): pb.GetAllPackagesConfigData;

        /**
         * Creates a plain object from a GetAllPackagesConfigData message. Also converts values to other types if specified.
         * @param message GetAllPackagesConfigData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetAllPackagesConfigData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetAllPackagesConfigData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetAllPackagesConfigData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetAllPackagesConfigResponse. */
    interface IGetAllPackagesConfigResponse {

        /** GetAllPackagesConfigResponse code */
        code?: (number|null);

        /** GetAllPackagesConfigResponse msg */
        msg?: (string|null);

        /** GetAllPackagesConfigResponse data */
        data?: (pb.IGetAllPackagesConfigData|null);
    }

    /** Represents a GetAllPackagesConfigResponse. */
    class GetAllPackagesConfigResponse implements IGetAllPackagesConfigResponse {

        /**
         * Constructs a new GetAllPackagesConfigResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetAllPackagesConfigResponse);

        /** GetAllPackagesConfigResponse code. */
        public code: number;

        /** GetAllPackagesConfigResponse msg. */
        public msg: string;

        /** GetAllPackagesConfigResponse data. */
        public data?: (pb.IGetAllPackagesConfigData|null);

        /**
         * Creates a new GetAllPackagesConfigResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetAllPackagesConfigResponse instance
         */
        public static create(properties?: pb.IGetAllPackagesConfigResponse): pb.GetAllPackagesConfigResponse;

        /**
         * Encodes the specified GetAllPackagesConfigResponse message. Does not implicitly {@link pb.GetAllPackagesConfigResponse.verify|verify} messages.
         * @param message GetAllPackagesConfigResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetAllPackagesConfigResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetAllPackagesConfigResponse message, length delimited. Does not implicitly {@link pb.GetAllPackagesConfigResponse.verify|verify} messages.
         * @param message GetAllPackagesConfigResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetAllPackagesConfigResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetAllPackagesConfigResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetAllPackagesConfigResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetAllPackagesConfigResponse;

        /**
         * Decodes a GetAllPackagesConfigResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetAllPackagesConfigResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetAllPackagesConfigResponse;

        /**
         * Verifies a GetAllPackagesConfigResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetAllPackagesConfigResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetAllPackagesConfigResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetAllPackagesConfigResponse;

        /**
         * Creates a plain object from a GetAllPackagesConfigResponse message. Also converts values to other types if specified.
         * @param message GetAllPackagesConfigResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetAllPackagesConfigResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetAllPackagesConfigResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetAllPackagesConfigResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateOrderRequest. */
    interface ICreateOrderRequest {

        /** CreateOrderRequest account */
        account?: (string|null);

        /** CreateOrderRequest pkgId */
        pkgId?: (number|null);

        /** CreateOrderRequest description */
        description?: (string|null);

        /** CreateOrderRequest amount */
        amount?: (pb.IAmountInfo|null);

        /** CreateOrderRequest timeExpire */
        timeExpire?: (string|null);

        /** CreateOrderRequest dappid */
        dappid?: (string|null);

        /** CreateOrderRequest attach */
        attach?: (string|null);

        /** CreateOrderRequest openid */
        openid?: (string|null);

        /** CreateOrderRequest wechatAuthCode */
        wechatAuthCode?: (string|null);

        /** CreateOrderRequest isRenew */
        isRenew?: (boolean|null);

        /** CreateOrderRequest oldNo */
        oldNo?: (number|null);
    }

    /** Represents a CreateOrderRequest. */
    class CreateOrderRequest implements ICreateOrderRequest {

        /**
         * Constructs a new CreateOrderRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateOrderRequest);

        /** CreateOrderRequest account. */
        public account: string;

        /** CreateOrderRequest pkgId. */
        public pkgId: number;

        /** CreateOrderRequest description. */
        public description: string;

        /** CreateOrderRequest amount. */
        public amount?: (pb.IAmountInfo|null);

        /** CreateOrderRequest timeExpire. */
        public timeExpire: string;

        /** CreateOrderRequest dappid. */
        public dappid: string;

        /** CreateOrderRequest attach. */
        public attach: string;

        /** CreateOrderRequest openid. */
        public openid: string;

        /** CreateOrderRequest wechatAuthCode. */
        public wechatAuthCode: string;

        /** CreateOrderRequest isRenew. */
        public isRenew: boolean;

        /** CreateOrderRequest oldNo. */
        public oldNo: number;

        /**
         * Creates a new CreateOrderRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateOrderRequest instance
         */
        public static create(properties?: pb.ICreateOrderRequest): pb.CreateOrderRequest;

        /**
         * Encodes the specified CreateOrderRequest message. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @param message CreateOrderRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateOrderRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateOrderRequest message, length delimited. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @param message CreateOrderRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateOrderRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateOrderRequest;

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateOrderRequest;

        /**
         * Verifies a CreateOrderRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateOrderRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateOrderRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateOrderRequest;

        /**
         * Creates a plain object from a CreateOrderRequest message. Also converts values to other types if specified.
         * @param message CreateOrderRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateOrderRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateOrderRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CreateOrderRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AmountInfo. */
    interface IAmountInfo {

        /** AmountInfo total */
        total?: (number|null);
    }

    /** Represents an AmountInfo. */
    class AmountInfo implements IAmountInfo {

        /**
         * Constructs a new AmountInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAmountInfo);

        /** AmountInfo total. */
        public total: number;

        /**
         * Creates a new AmountInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AmountInfo instance
         */
        public static create(properties?: pb.IAmountInfo): pb.AmountInfo;

        /**
         * Encodes the specified AmountInfo message. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @param message AmountInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAmountInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AmountInfo message, length delimited. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @param message AmountInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAmountInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AmountInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AmountInfo;

        /**
         * Decodes an AmountInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AmountInfo;

        /**
         * Verifies an AmountInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AmountInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AmountInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.AmountInfo;

        /**
         * Creates a plain object from an AmountInfo message. Also converts values to other types if specified.
         * @param message AmountInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AmountInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AmountInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AmountInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateOrderResponse. */
    interface ICreateOrderResponse {

        /** CreateOrderResponse code */
        code?: (number|null);

        /** CreateOrderResponse msg */
        msg?: (string|null);

        /** CreateOrderResponse data */
        data?: (pb.ICreateOrderData|null);
    }

    /** Represents a CreateOrderResponse. */
    class CreateOrderResponse implements ICreateOrderResponse {

        /**
         * Constructs a new CreateOrderResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateOrderResponse);

        /** CreateOrderResponse code. */
        public code: number;

        /** CreateOrderResponse msg. */
        public msg: string;

        /** CreateOrderResponse data. */
        public data?: (pb.ICreateOrderData|null);

        /**
         * Creates a new CreateOrderResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateOrderResponse instance
         */
        public static create(properties?: pb.ICreateOrderResponse): pb.CreateOrderResponse;

        /**
         * Encodes the specified CreateOrderResponse message. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @param message CreateOrderResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateOrderResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateOrderResponse message, length delimited. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @param message CreateOrderResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateOrderResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateOrderResponse;

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateOrderResponse;

        /**
         * Verifies a CreateOrderResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateOrderResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateOrderResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateOrderResponse;

        /**
         * Creates a plain object from a CreateOrderResponse message. Also converts values to other types if specified.
         * @param message CreateOrderResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateOrderResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateOrderResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CreateOrderResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateOrderData. */
    interface ICreateOrderData {

        /** CreateOrderData outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a CreateOrderData. */
    class CreateOrderData implements ICreateOrderData {

        /**
         * Constructs a new CreateOrderData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateOrderData);

        /** CreateOrderData outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new CreateOrderData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateOrderData instance
         */
        public static create(properties?: pb.ICreateOrderData): pb.CreateOrderData;

        /**
         * Encodes the specified CreateOrderData message. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @param message CreateOrderData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateOrderData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateOrderData message, length delimited. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @param message CreateOrderData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateOrderData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateOrderData;

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateOrderData;

        /**
         * Verifies a CreateOrderData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateOrderData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateOrderData
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateOrderData;

        /**
         * Creates a plain object from a CreateOrderData message. Also converts values to other types if specified.
         * @param message CreateOrderData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateOrderData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateOrderData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CreateOrderData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetNativePrepayRequest. */
    interface IGetNativePrepayRequest {

        /** GetNativePrepayRequest outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a GetNativePrepayRequest. */
    class GetNativePrepayRequest implements IGetNativePrepayRequest {

        /**
         * Constructs a new GetNativePrepayRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetNativePrepayRequest);

        /** GetNativePrepayRequest outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new GetNativePrepayRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetNativePrepayRequest instance
         */
        public static create(properties?: pb.IGetNativePrepayRequest): pb.GetNativePrepayRequest;

        /**
         * Encodes the specified GetNativePrepayRequest message. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @param message GetNativePrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetNativePrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetNativePrepayRequest message, length delimited. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @param message GetNativePrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetNativePrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetNativePrepayRequest;

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetNativePrepayRequest;

        /**
         * Verifies a GetNativePrepayRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetNativePrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetNativePrepayRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetNativePrepayRequest;

        /**
         * Creates a plain object from a GetNativePrepayRequest message. Also converts values to other types if specified.
         * @param message GetNativePrepayRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetNativePrepayRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetNativePrepayRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetNativePrepayRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetNativePrepayResponse. */
    interface IGetNativePrepayResponse {

        /** GetNativePrepayResponse code */
        code?: (number|null);

        /** GetNativePrepayResponse msg */
        msg?: (string|null);

        /** GetNativePrepayResponse data */
        data?: (pb.INativePrepayData|null);
    }

    /** Represents a GetNativePrepayResponse. */
    class GetNativePrepayResponse implements IGetNativePrepayResponse {

        /**
         * Constructs a new GetNativePrepayResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetNativePrepayResponse);

        /** GetNativePrepayResponse code. */
        public code: number;

        /** GetNativePrepayResponse msg. */
        public msg: string;

        /** GetNativePrepayResponse data. */
        public data?: (pb.INativePrepayData|null);

        /**
         * Creates a new GetNativePrepayResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetNativePrepayResponse instance
         */
        public static create(properties?: pb.IGetNativePrepayResponse): pb.GetNativePrepayResponse;

        /**
         * Encodes the specified GetNativePrepayResponse message. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @param message GetNativePrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetNativePrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetNativePrepayResponse message, length delimited. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @param message GetNativePrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetNativePrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetNativePrepayResponse;

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetNativePrepayResponse;

        /**
         * Verifies a GetNativePrepayResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetNativePrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetNativePrepayResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetNativePrepayResponse;

        /**
         * Creates a plain object from a GetNativePrepayResponse message. Also converts values to other types if specified.
         * @param message GetNativePrepayResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetNativePrepayResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetNativePrepayResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetNativePrepayResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a NativePrepayData. */
    interface INativePrepayData {

        /** NativePrepayData codeUrl */
        codeUrl?: (string|null);
    }

    /** Represents a NativePrepayData. */
    class NativePrepayData implements INativePrepayData {

        /**
         * Constructs a new NativePrepayData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.INativePrepayData);

        /** NativePrepayData codeUrl. */
        public codeUrl: string;

        /**
         * Creates a new NativePrepayData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NativePrepayData instance
         */
        public static create(properties?: pb.INativePrepayData): pb.NativePrepayData;

        /**
         * Encodes the specified NativePrepayData message. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @param message NativePrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.INativePrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NativePrepayData message, length delimited. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @param message NativePrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.INativePrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.NativePrepayData;

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.NativePrepayData;

        /**
         * Verifies a NativePrepayData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NativePrepayData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NativePrepayData
         */
        public static fromObject(object: { [k: string]: any }): pb.NativePrepayData;

        /**
         * Creates a plain object from a NativePrepayData message. Also converts values to other types if specified.
         * @param message NativePrepayData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.NativePrepayData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NativePrepayData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for NativePrepayData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetH5PrepayRequest. */
    interface IGetH5PrepayRequest {

        /** GetH5PrepayRequest outTradeNo */
        outTradeNo?: (string|null);

        /** GetH5PrepayRequest redirectUrl */
        redirectUrl?: (string|null);

        /** GetH5PrepayRequest clientIp */
        clientIp?: (string|null);

        /** GetH5PrepayRequest userAgent */
        userAgent?: (string|null);
    }

    /** Represents a GetH5PrepayRequest. */
    class GetH5PrepayRequest implements IGetH5PrepayRequest {

        /**
         * Constructs a new GetH5PrepayRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetH5PrepayRequest);

        /** GetH5PrepayRequest outTradeNo. */
        public outTradeNo: string;

        /** GetH5PrepayRequest redirectUrl. */
        public redirectUrl: string;

        /** GetH5PrepayRequest clientIp. */
        public clientIp: string;

        /** GetH5PrepayRequest userAgent. */
        public userAgent: string;

        /**
         * Creates a new GetH5PrepayRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetH5PrepayRequest instance
         */
        public static create(properties?: pb.IGetH5PrepayRequest): pb.GetH5PrepayRequest;

        /**
         * Encodes the specified GetH5PrepayRequest message. Does not implicitly {@link pb.GetH5PrepayRequest.verify|verify} messages.
         * @param message GetH5PrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetH5PrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetH5PrepayRequest message, length delimited. Does not implicitly {@link pb.GetH5PrepayRequest.verify|verify} messages.
         * @param message GetH5PrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetH5PrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetH5PrepayRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetH5PrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetH5PrepayRequest;

        /**
         * Decodes a GetH5PrepayRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetH5PrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetH5PrepayRequest;

        /**
         * Verifies a GetH5PrepayRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetH5PrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetH5PrepayRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetH5PrepayRequest;

        /**
         * Creates a plain object from a GetH5PrepayRequest message. Also converts values to other types if specified.
         * @param message GetH5PrepayRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetH5PrepayRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetH5PrepayRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetH5PrepayRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetH5PrepayResponse. */
    interface IGetH5PrepayResponse {

        /** GetH5PrepayResponse code */
        code?: (number|null);

        /** GetH5PrepayResponse msg */
        msg?: (string|null);

        /** GetH5PrepayResponse data */
        data?: (pb.IH5PrepayData|null);
    }

    /** Represents a GetH5PrepayResponse. */
    class GetH5PrepayResponse implements IGetH5PrepayResponse {

        /**
         * Constructs a new GetH5PrepayResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetH5PrepayResponse);

        /** GetH5PrepayResponse code. */
        public code: number;

        /** GetH5PrepayResponse msg. */
        public msg: string;

        /** GetH5PrepayResponse data. */
        public data?: (pb.IH5PrepayData|null);

        /**
         * Creates a new GetH5PrepayResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetH5PrepayResponse instance
         */
        public static create(properties?: pb.IGetH5PrepayResponse): pb.GetH5PrepayResponse;

        /**
         * Encodes the specified GetH5PrepayResponse message. Does not implicitly {@link pb.GetH5PrepayResponse.verify|verify} messages.
         * @param message GetH5PrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetH5PrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetH5PrepayResponse message, length delimited. Does not implicitly {@link pb.GetH5PrepayResponse.verify|verify} messages.
         * @param message GetH5PrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetH5PrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetH5PrepayResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetH5PrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetH5PrepayResponse;

        /**
         * Decodes a GetH5PrepayResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetH5PrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetH5PrepayResponse;

        /**
         * Verifies a GetH5PrepayResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetH5PrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetH5PrepayResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetH5PrepayResponse;

        /**
         * Creates a plain object from a GetH5PrepayResponse message. Also converts values to other types if specified.
         * @param message GetH5PrepayResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetH5PrepayResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetH5PrepayResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetH5PrepayResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a H5PrepayData. */
    interface IH5PrepayData {

        /** H5PrepayData h5Url */
        h5Url?: (string|null);
    }

    /** Represents a H5PrepayData. */
    class H5PrepayData implements IH5PrepayData {

        /**
         * Constructs a new H5PrepayData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IH5PrepayData);

        /** H5PrepayData h5Url. */
        public h5Url: string;

        /**
         * Creates a new H5PrepayData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns H5PrepayData instance
         */
        public static create(properties?: pb.IH5PrepayData): pb.H5PrepayData;

        /**
         * Encodes the specified H5PrepayData message. Does not implicitly {@link pb.H5PrepayData.verify|verify} messages.
         * @param message H5PrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IH5PrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified H5PrepayData message, length delimited. Does not implicitly {@link pb.H5PrepayData.verify|verify} messages.
         * @param message H5PrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IH5PrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a H5PrepayData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns H5PrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.H5PrepayData;

        /**
         * Decodes a H5PrepayData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns H5PrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.H5PrepayData;

        /**
         * Verifies a H5PrepayData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a H5PrepayData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns H5PrepayData
         */
        public static fromObject(object: { [k: string]: any }): pb.H5PrepayData;

        /**
         * Creates a plain object from a H5PrepayData message. Also converts values to other types if specified.
         * @param message H5PrepayData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.H5PrepayData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this H5PrepayData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for H5PrepayData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetJSAPIPrepayRequest. */
    interface IGetJSAPIPrepayRequest {

        /** GetJSAPIPrepayRequest outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a GetJSAPIPrepayRequest. */
    class GetJSAPIPrepayRequest implements IGetJSAPIPrepayRequest {

        /**
         * Constructs a new GetJSAPIPrepayRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetJSAPIPrepayRequest);

        /** GetJSAPIPrepayRequest outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new GetJSAPIPrepayRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetJSAPIPrepayRequest instance
         */
        public static create(properties?: pb.IGetJSAPIPrepayRequest): pb.GetJSAPIPrepayRequest;

        /**
         * Encodes the specified GetJSAPIPrepayRequest message. Does not implicitly {@link pb.GetJSAPIPrepayRequest.verify|verify} messages.
         * @param message GetJSAPIPrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetJSAPIPrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetJSAPIPrepayRequest message, length delimited. Does not implicitly {@link pb.GetJSAPIPrepayRequest.verify|verify} messages.
         * @param message GetJSAPIPrepayRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetJSAPIPrepayRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetJSAPIPrepayRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetJSAPIPrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetJSAPIPrepayRequest;

        /**
         * Decodes a GetJSAPIPrepayRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetJSAPIPrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetJSAPIPrepayRequest;

        /**
         * Verifies a GetJSAPIPrepayRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetJSAPIPrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetJSAPIPrepayRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetJSAPIPrepayRequest;

        /**
         * Creates a plain object from a GetJSAPIPrepayRequest message. Also converts values to other types if specified.
         * @param message GetJSAPIPrepayRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetJSAPIPrepayRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetJSAPIPrepayRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetJSAPIPrepayRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetJSAPIPrepayResponse. */
    interface IGetJSAPIPrepayResponse {

        /** GetJSAPIPrepayResponse code */
        code?: (number|null);

        /** GetJSAPIPrepayResponse msg */
        msg?: (string|null);

        /** GetJSAPIPrepayResponse data */
        data?: (pb.IJSAPIPrepayData|null);

        /** GetJSAPIPrepayResponse needWechatAuth */
        needWechatAuth?: (boolean|null);

        /** GetJSAPIPrepayResponse authUrl */
        authUrl?: (string|null);
    }

    /** Represents a GetJSAPIPrepayResponse. */
    class GetJSAPIPrepayResponse implements IGetJSAPIPrepayResponse {

        /**
         * Constructs a new GetJSAPIPrepayResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetJSAPIPrepayResponse);

        /** GetJSAPIPrepayResponse code. */
        public code: number;

        /** GetJSAPIPrepayResponse msg. */
        public msg: string;

        /** GetJSAPIPrepayResponse data. */
        public data?: (pb.IJSAPIPrepayData|null);

        /** GetJSAPIPrepayResponse needWechatAuth. */
        public needWechatAuth: boolean;

        /** GetJSAPIPrepayResponse authUrl. */
        public authUrl: string;

        /**
         * Creates a new GetJSAPIPrepayResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetJSAPIPrepayResponse instance
         */
        public static create(properties?: pb.IGetJSAPIPrepayResponse): pb.GetJSAPIPrepayResponse;

        /**
         * Encodes the specified GetJSAPIPrepayResponse message. Does not implicitly {@link pb.GetJSAPIPrepayResponse.verify|verify} messages.
         * @param message GetJSAPIPrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetJSAPIPrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetJSAPIPrepayResponse message, length delimited. Does not implicitly {@link pb.GetJSAPIPrepayResponse.verify|verify} messages.
         * @param message GetJSAPIPrepayResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetJSAPIPrepayResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetJSAPIPrepayResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetJSAPIPrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetJSAPIPrepayResponse;

        /**
         * Decodes a GetJSAPIPrepayResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetJSAPIPrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetJSAPIPrepayResponse;

        /**
         * Verifies a GetJSAPIPrepayResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetJSAPIPrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetJSAPIPrepayResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetJSAPIPrepayResponse;

        /**
         * Creates a plain object from a GetJSAPIPrepayResponse message. Also converts values to other types if specified.
         * @param message GetJSAPIPrepayResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetJSAPIPrepayResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetJSAPIPrepayResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetJSAPIPrepayResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a JSAPIPrepayData. */
    interface IJSAPIPrepayData {

        /** JSAPIPrepayData prepayId */
        prepayId?: (string|null);

        /** JSAPIPrepayData appId */
        appId?: (string|null);

        /** JSAPIPrepayData timeStamp */
        timeStamp?: (string|null);

        /** JSAPIPrepayData nonceStr */
        nonceStr?: (string|null);

        /** JSAPIPrepayData package */
        "package"?: (string|null);

        /** JSAPIPrepayData signType */
        signType?: (string|null);

        /** JSAPIPrepayData paySign */
        paySign?: (string|null);
    }

    /** Represents a JSAPIPrepayData. */
    class JSAPIPrepayData implements IJSAPIPrepayData {

        /**
         * Constructs a new JSAPIPrepayData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IJSAPIPrepayData);

        /** JSAPIPrepayData prepayId. */
        public prepayId: string;

        /** JSAPIPrepayData appId. */
        public appId: string;

        /** JSAPIPrepayData timeStamp. */
        public timeStamp: string;

        /** JSAPIPrepayData nonceStr. */
        public nonceStr: string;

        /** JSAPIPrepayData package. */
        public package: string;

        /** JSAPIPrepayData signType. */
        public signType: string;

        /** JSAPIPrepayData paySign. */
        public paySign: string;

        /**
         * Creates a new JSAPIPrepayData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns JSAPIPrepayData instance
         */
        public static create(properties?: pb.IJSAPIPrepayData): pb.JSAPIPrepayData;

        /**
         * Encodes the specified JSAPIPrepayData message. Does not implicitly {@link pb.JSAPIPrepayData.verify|verify} messages.
         * @param message JSAPIPrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IJSAPIPrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified JSAPIPrepayData message, length delimited. Does not implicitly {@link pb.JSAPIPrepayData.verify|verify} messages.
         * @param message JSAPIPrepayData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IJSAPIPrepayData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a JSAPIPrepayData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns JSAPIPrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.JSAPIPrepayData;

        /**
         * Decodes a JSAPIPrepayData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns JSAPIPrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.JSAPIPrepayData;

        /**
         * Verifies a JSAPIPrepayData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a JSAPIPrepayData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns JSAPIPrepayData
         */
        public static fromObject(object: { [k: string]: any }): pb.JSAPIPrepayData;

        /**
         * Creates a plain object from a JSAPIPrepayData message. Also converts values to other types if specified.
         * @param message JSAPIPrepayData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.JSAPIPrepayData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this JSAPIPrepayData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for JSAPIPrepayData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetStoragePurchaseStatusRequest. */
    interface IGetStoragePurchaseStatusRequest {

        /** GetStoragePurchaseStatusRequest outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a GetStoragePurchaseStatusRequest. */
    class GetStoragePurchaseStatusRequest implements IGetStoragePurchaseStatusRequest {

        /**
         * Constructs a new GetStoragePurchaseStatusRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetStoragePurchaseStatusRequest);

        /** GetStoragePurchaseStatusRequest outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new GetStoragePurchaseStatusRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetStoragePurchaseStatusRequest instance
         */
        public static create(properties?: pb.IGetStoragePurchaseStatusRequest): pb.GetStoragePurchaseStatusRequest;

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @param message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetStoragePurchaseStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @param message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetStoragePurchaseStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetStoragePurchaseStatusRequest;

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetStoragePurchaseStatusRequest;

        /**
         * Verifies a GetStoragePurchaseStatusRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetStoragePurchaseStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetStoragePurchaseStatusRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetStoragePurchaseStatusRequest;

        /**
         * Creates a plain object from a GetStoragePurchaseStatusRequest message. Also converts values to other types if specified.
         * @param message GetStoragePurchaseStatusRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetStoragePurchaseStatusRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetStoragePurchaseStatusRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetStoragePurchaseStatusRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetStoragePurchaseStatusResponse. */
    interface IGetStoragePurchaseStatusResponse {

        /** GetStoragePurchaseStatusResponse code */
        code?: (number|null);

        /** GetStoragePurchaseStatusResponse msg */
        msg?: (string|null);

        /** GetStoragePurchaseStatusResponse data */
        data?: (pb.IGetStoragePurchaseStatusData|null);
    }

    /** Represents a GetStoragePurchaseStatusResponse. */
    class GetStoragePurchaseStatusResponse implements IGetStoragePurchaseStatusResponse {

        /**
         * Constructs a new GetStoragePurchaseStatusResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetStoragePurchaseStatusResponse);

        /** GetStoragePurchaseStatusResponse code. */
        public code: number;

        /** GetStoragePurchaseStatusResponse msg. */
        public msg: string;

        /** GetStoragePurchaseStatusResponse data. */
        public data?: (pb.IGetStoragePurchaseStatusData|null);

        /**
         * Creates a new GetStoragePurchaseStatusResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetStoragePurchaseStatusResponse instance
         */
        public static create(properties?: pb.IGetStoragePurchaseStatusResponse): pb.GetStoragePurchaseStatusResponse;

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @param message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetStoragePurchaseStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @param message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetStoragePurchaseStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetStoragePurchaseStatusResponse;

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetStoragePurchaseStatusResponse;

        /**
         * Verifies a GetStoragePurchaseStatusResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetStoragePurchaseStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetStoragePurchaseStatusResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetStoragePurchaseStatusResponse;

        /**
         * Creates a plain object from a GetStoragePurchaseStatusResponse message. Also converts values to other types if specified.
         * @param message GetStoragePurchaseStatusResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetStoragePurchaseStatusResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetStoragePurchaseStatusResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetStoragePurchaseStatusResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetStoragePurchaseStatusData. */
    interface IGetStoragePurchaseStatusData {

        /** GetStoragePurchaseStatusData status */
        status?: (number|null);
    }

    /** Represents a GetStoragePurchaseStatusData. */
    class GetStoragePurchaseStatusData implements IGetStoragePurchaseStatusData {

        /**
         * Constructs a new GetStoragePurchaseStatusData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetStoragePurchaseStatusData);

        /** GetStoragePurchaseStatusData status. */
        public status: number;

        /**
         * Creates a new GetStoragePurchaseStatusData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetStoragePurchaseStatusData instance
         */
        public static create(properties?: pb.IGetStoragePurchaseStatusData): pb.GetStoragePurchaseStatusData;

        /**
         * Encodes the specified GetStoragePurchaseStatusData message. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @param message GetStoragePurchaseStatusData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetStoragePurchaseStatusData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetStoragePurchaseStatusData message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @param message GetStoragePurchaseStatusData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetStoragePurchaseStatusData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetStoragePurchaseStatusData;

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetStoragePurchaseStatusData;

        /**
         * Verifies a GetStoragePurchaseStatusData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetStoragePurchaseStatusData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetStoragePurchaseStatusData
         */
        public static fromObject(object: { [k: string]: any }): pb.GetStoragePurchaseStatusData;

        /**
         * Creates a plain object from a GetStoragePurchaseStatusData message. Also converts values to other types if specified.
         * @param message GetStoragePurchaseStatusData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetStoragePurchaseStatusData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetStoragePurchaseStatusData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetStoragePurchaseStatusData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CidInfo. */
    interface ICidInfo {

        /** CidInfo cid */
        cid?: (string|null);

        /** CidInfo account */
        account?: (string|null);

        /** CidInfo dappid */
        dappid?: (string|null);

        /** CidInfo payStatus */
        payStatus?: (number|null);

        /** CidInfo checkStatus */
        checkStatus?: (number|null);

        /** CidInfo checkUserId */
        checkUserId?: (number|null);

        /** CidInfo checkReason */
        checkReason?: (string|null);

        /** CidInfo checkTime */
        checkTime?: (string|null);

        /** CidInfo expiredTime */
        expiredTime?: (string|null);

        /** CidInfo createTime */
        createTime?: (string|null);
    }

    /** Represents a CidInfo. */
    class CidInfo implements ICidInfo {

        /**
         * Constructs a new CidInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICidInfo);

        /** CidInfo cid. */
        public cid: string;

        /** CidInfo account. */
        public account: string;

        /** CidInfo dappid. */
        public dappid: string;

        /** CidInfo payStatus. */
        public payStatus: number;

        /** CidInfo checkStatus. */
        public checkStatus: number;

        /** CidInfo checkUserId. */
        public checkUserId: number;

        /** CidInfo checkReason. */
        public checkReason: string;

        /** CidInfo checkTime. */
        public checkTime: string;

        /** CidInfo expiredTime. */
        public expiredTime: string;

        /** CidInfo createTime. */
        public createTime: string;

        /**
         * Creates a new CidInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CidInfo instance
         */
        public static create(properties?: pb.ICidInfo): pb.CidInfo;

        /**
         * Encodes the specified CidInfo message. Does not implicitly {@link pb.CidInfo.verify|verify} messages.
         * @param message CidInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICidInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CidInfo message, length delimited. Does not implicitly {@link pb.CidInfo.verify|verify} messages.
         * @param message CidInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICidInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CidInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CidInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CidInfo;

        /**
         * Decodes a CidInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CidInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CidInfo;

        /**
         * Verifies a CidInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CidInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CidInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.CidInfo;

        /**
         * Creates a plain object from a CidInfo message. Also converts values to other types if specified.
         * @param message CidInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CidInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CidInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CidInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateCidInfoRequest. */
    interface ICreateCidInfoRequest {

        /** CreateCidInfoRequest cid */
        cid?: (string|null);

        /** CreateCidInfoRequest account */
        account?: (string|null);

        /** CreateCidInfoRequest dappid */
        dappid?: (string|null);
    }

    /** Represents a CreateCidInfoRequest. */
    class CreateCidInfoRequest implements ICreateCidInfoRequest {

        /**
         * Constructs a new CreateCidInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateCidInfoRequest);

        /** CreateCidInfoRequest cid. */
        public cid: string;

        /** CreateCidInfoRequest account. */
        public account: string;

        /** CreateCidInfoRequest dappid. */
        public dappid: string;

        /**
         * Creates a new CreateCidInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateCidInfoRequest instance
         */
        public static create(properties?: pb.ICreateCidInfoRequest): pb.CreateCidInfoRequest;

        /**
         * Encodes the specified CreateCidInfoRequest message. Does not implicitly {@link pb.CreateCidInfoRequest.verify|verify} messages.
         * @param message CreateCidInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateCidInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateCidInfoRequest message, length delimited. Does not implicitly {@link pb.CreateCidInfoRequest.verify|verify} messages.
         * @param message CreateCidInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateCidInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateCidInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateCidInfoRequest;

        /**
         * Decodes a CreateCidInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateCidInfoRequest;

        /**
         * Verifies a CreateCidInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateCidInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateCidInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateCidInfoRequest;

        /**
         * Creates a plain object from a CreateCidInfoRequest message. Also converts values to other types if specified.
         * @param message CreateCidInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateCidInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateCidInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CreateCidInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CreateCidInfoResponse. */
    interface ICreateCidInfoResponse {

        /** CreateCidInfoResponse code */
        code?: (number|null);

        /** CreateCidInfoResponse msg */
        msg?: (string|null);
    }

    /** Represents a CreateCidInfoResponse. */
    class CreateCidInfoResponse implements ICreateCidInfoResponse {

        /**
         * Constructs a new CreateCidInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICreateCidInfoResponse);

        /** CreateCidInfoResponse code. */
        public code: number;

        /** CreateCidInfoResponse msg. */
        public msg: string;

        /**
         * Creates a new CreateCidInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateCidInfoResponse instance
         */
        public static create(properties?: pb.ICreateCidInfoResponse): pb.CreateCidInfoResponse;

        /**
         * Encodes the specified CreateCidInfoResponse message. Does not implicitly {@link pb.CreateCidInfoResponse.verify|verify} messages.
         * @param message CreateCidInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICreateCidInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateCidInfoResponse message, length delimited. Does not implicitly {@link pb.CreateCidInfoResponse.verify|verify} messages.
         * @param message CreateCidInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICreateCidInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateCidInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CreateCidInfoResponse;

        /**
         * Decodes a CreateCidInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CreateCidInfoResponse;

        /**
         * Verifies a CreateCidInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateCidInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateCidInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.CreateCidInfoResponse;

        /**
         * Creates a plain object from a CreateCidInfoResponse message. Also converts values to other types if specified.
         * @param message CreateCidInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CreateCidInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateCidInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CreateCidInfoResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetCidInfoRequest. */
    interface IGetCidInfoRequest {

        /** GetCidInfoRequest cid */
        cid?: (string|null);
    }

    /** Represents a GetCidInfoRequest. */
    class GetCidInfoRequest implements IGetCidInfoRequest {

        /**
         * Constructs a new GetCidInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetCidInfoRequest);

        /** GetCidInfoRequest cid. */
        public cid: string;

        /**
         * Creates a new GetCidInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetCidInfoRequest instance
         */
        public static create(properties?: pb.IGetCidInfoRequest): pb.GetCidInfoRequest;

        /**
         * Encodes the specified GetCidInfoRequest message. Does not implicitly {@link pb.GetCidInfoRequest.verify|verify} messages.
         * @param message GetCidInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetCidInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetCidInfoRequest message, length delimited. Does not implicitly {@link pb.GetCidInfoRequest.verify|verify} messages.
         * @param message GetCidInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetCidInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetCidInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetCidInfoRequest;

        /**
         * Decodes a GetCidInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetCidInfoRequest;

        /**
         * Verifies a GetCidInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetCidInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetCidInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetCidInfoRequest;

        /**
         * Creates a plain object from a GetCidInfoRequest message. Also converts values to other types if specified.
         * @param message GetCidInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetCidInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetCidInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetCidInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetCidInfoResponse. */
    interface IGetCidInfoResponse {

        /** GetCidInfoResponse code */
        code?: (number|null);

        /** GetCidInfoResponse msg */
        msg?: (string|null);

        /** GetCidInfoResponse data */
        data?: (pb.ICidInfo|null);
    }

    /** Represents a GetCidInfoResponse. */
    class GetCidInfoResponse implements IGetCidInfoResponse {

        /**
         * Constructs a new GetCidInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetCidInfoResponse);

        /** GetCidInfoResponse code. */
        public code: number;

        /** GetCidInfoResponse msg. */
        public msg: string;

        /** GetCidInfoResponse data. */
        public data?: (pb.ICidInfo|null);

        /**
         * Creates a new GetCidInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetCidInfoResponse instance
         */
        public static create(properties?: pb.IGetCidInfoResponse): pb.GetCidInfoResponse;

        /**
         * Encodes the specified GetCidInfoResponse message. Does not implicitly {@link pb.GetCidInfoResponse.verify|verify} messages.
         * @param message GetCidInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetCidInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetCidInfoResponse message, length delimited. Does not implicitly {@link pb.GetCidInfoResponse.verify|verify} messages.
         * @param message GetCidInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetCidInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetCidInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetCidInfoResponse;

        /**
         * Decodes a GetCidInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetCidInfoResponse;

        /**
         * Verifies a GetCidInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetCidInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetCidInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetCidInfoResponse;

        /**
         * Creates a plain object from a GetCidInfoResponse message. Also converts values to other types if specified.
         * @param message GetCidInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetCidInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetCidInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetCidInfoResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PageQueryRequest. */
    interface IPageQueryRequest {

        /** PageQueryRequest page */
        page?: (number|null);

        /** PageQueryRequest pageSize */
        pageSize?: (number|null);

        /** PageQueryRequest account */
        account?: (string|null);

        /** PageQueryRequest dappid */
        dappid?: (string|null);

        /** PageQueryRequest payStatus */
        payStatus?: (number|null);

        /** PageQueryRequest checkStatus */
        checkStatus?: (number|null);

        /** PageQueryRequest startTime */
        startTime?: (string|null);

        /** PageQueryRequest endTime */
        endTime?: (string|null);
    }

    /** Represents a PageQueryRequest. */
    class PageQueryRequest implements IPageQueryRequest {

        /**
         * Constructs a new PageQueryRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IPageQueryRequest);

        /** PageQueryRequest page. */
        public page: number;

        /** PageQueryRequest pageSize. */
        public pageSize: number;

        /** PageQueryRequest account. */
        public account: string;

        /** PageQueryRequest dappid. */
        public dappid: string;

        /** PageQueryRequest payStatus. */
        public payStatus: number;

        /** PageQueryRequest checkStatus. */
        public checkStatus: number;

        /** PageQueryRequest startTime. */
        public startTime: string;

        /** PageQueryRequest endTime. */
        public endTime: string;

        /**
         * Creates a new PageQueryRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PageQueryRequest instance
         */
        public static create(properties?: pb.IPageQueryRequest): pb.PageQueryRequest;

        /**
         * Encodes the specified PageQueryRequest message. Does not implicitly {@link pb.PageQueryRequest.verify|verify} messages.
         * @param message PageQueryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IPageQueryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PageQueryRequest message, length delimited. Does not implicitly {@link pb.PageQueryRequest.verify|verify} messages.
         * @param message PageQueryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IPageQueryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PageQueryRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PageQueryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.PageQueryRequest;

        /**
         * Decodes a PageQueryRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PageQueryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.PageQueryRequest;

        /**
         * Verifies a PageQueryRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PageQueryRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PageQueryRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.PageQueryRequest;

        /**
         * Creates a plain object from a PageQueryRequest message. Also converts values to other types if specified.
         * @param message PageQueryRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.PageQueryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PageQueryRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PageQueryRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PageQueryResponse. */
    interface IPageQueryResponse {

        /** PageQueryResponse code */
        code?: (number|null);

        /** PageQueryResponse msg */
        msg?: (string|null);

        /** PageQueryResponse data */
        data?: (pb.ICIDPageResult|null);
    }

    /** Represents a PageQueryResponse. */
    class PageQueryResponse implements IPageQueryResponse {

        /**
         * Constructs a new PageQueryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IPageQueryResponse);

        /** PageQueryResponse code. */
        public code: number;

        /** PageQueryResponse msg. */
        public msg: string;

        /** PageQueryResponse data. */
        public data?: (pb.ICIDPageResult|null);

        /**
         * Creates a new PageQueryResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PageQueryResponse instance
         */
        public static create(properties?: pb.IPageQueryResponse): pb.PageQueryResponse;

        /**
         * Encodes the specified PageQueryResponse message. Does not implicitly {@link pb.PageQueryResponse.verify|verify} messages.
         * @param message PageQueryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IPageQueryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PageQueryResponse message, length delimited. Does not implicitly {@link pb.PageQueryResponse.verify|verify} messages.
         * @param message PageQueryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IPageQueryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PageQueryResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PageQueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.PageQueryResponse;

        /**
         * Decodes a PageQueryResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PageQueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.PageQueryResponse;

        /**
         * Verifies a PageQueryResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PageQueryResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PageQueryResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.PageQueryResponse;

        /**
         * Creates a plain object from a PageQueryResponse message. Also converts values to other types if specified.
         * @param message PageQueryResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.PageQueryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PageQueryResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PageQueryResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a CIDPageResult. */
    interface ICIDPageResult {

        /** CIDPageResult total */
        total?: (number|Long|null);

        /** CIDPageResult list */
        list?: (pb.ICidInfo[]|null);

        /** CIDPageResult page */
        page?: (number|null);

        /** CIDPageResult pageSize */
        pageSize?: (number|null);

        /** CIDPageResult totalPages */
        totalPages?: (number|null);
    }

    /** Represents a CIDPageResult. */
    class CIDPageResult implements ICIDPageResult {

        /**
         * Constructs a new CIDPageResult.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ICIDPageResult);

        /** CIDPageResult total. */
        public total: (number|Long);

        /** CIDPageResult list. */
        public list: pb.ICidInfo[];

        /** CIDPageResult page. */
        public page: number;

        /** CIDPageResult pageSize. */
        public pageSize: number;

        /** CIDPageResult totalPages. */
        public totalPages: number;

        /**
         * Creates a new CIDPageResult instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CIDPageResult instance
         */
        public static create(properties?: pb.ICIDPageResult): pb.CIDPageResult;

        /**
         * Encodes the specified CIDPageResult message. Does not implicitly {@link pb.CIDPageResult.verify|verify} messages.
         * @param message CIDPageResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ICIDPageResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CIDPageResult message, length delimited. Does not implicitly {@link pb.CIDPageResult.verify|verify} messages.
         * @param message CIDPageResult message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ICIDPageResult, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CIDPageResult message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CIDPageResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.CIDPageResult;

        /**
         * Decodes a CIDPageResult message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CIDPageResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.CIDPageResult;

        /**
         * Verifies a CIDPageResult message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CIDPageResult message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CIDPageResult
         */
        public static fromObject(object: { [k: string]: any }): pb.CIDPageResult;

        /**
         * Creates a plain object from a CIDPageResult message. Also converts values to other types if specified.
         * @param message CIDPageResult
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.CIDPageResult, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CIDPageResult to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for CIDPageResult
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateCheckStatusRequest. */
    interface IUpdateCheckStatusRequest {

        /** UpdateCheckStatusRequest cid */
        cid?: (string|null);

        /** UpdateCheckStatusRequest checkStatus */
        checkStatus?: (number|null);

        /** UpdateCheckStatusRequest checkUserId */
        checkUserId?: (number|null);

        /** UpdateCheckStatusRequest checkReason */
        checkReason?: (string|null);
    }

    /** Represents an UpdateCheckStatusRequest. */
    class UpdateCheckStatusRequest implements IUpdateCheckStatusRequest {

        /**
         * Constructs a new UpdateCheckStatusRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IUpdateCheckStatusRequest);

        /** UpdateCheckStatusRequest cid. */
        public cid: string;

        /** UpdateCheckStatusRequest checkStatus. */
        public checkStatus: number;

        /** UpdateCheckStatusRequest checkUserId. */
        public checkUserId: number;

        /** UpdateCheckStatusRequest checkReason. */
        public checkReason: string;

        /**
         * Creates a new UpdateCheckStatusRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateCheckStatusRequest instance
         */
        public static create(properties?: pb.IUpdateCheckStatusRequest): pb.UpdateCheckStatusRequest;

        /**
         * Encodes the specified UpdateCheckStatusRequest message. Does not implicitly {@link pb.UpdateCheckStatusRequest.verify|verify} messages.
         * @param message UpdateCheckStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IUpdateCheckStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateCheckStatusRequest message, length delimited. Does not implicitly {@link pb.UpdateCheckStatusRequest.verify|verify} messages.
         * @param message UpdateCheckStatusRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IUpdateCheckStatusRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateCheckStatusRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateCheckStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.UpdateCheckStatusRequest;

        /**
         * Decodes an UpdateCheckStatusRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateCheckStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.UpdateCheckStatusRequest;

        /**
         * Verifies an UpdateCheckStatusRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateCheckStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateCheckStatusRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.UpdateCheckStatusRequest;

        /**
         * Creates a plain object from an UpdateCheckStatusRequest message. Also converts values to other types if specified.
         * @param message UpdateCheckStatusRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.UpdateCheckStatusRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateCheckStatusRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UpdateCheckStatusRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an UpdateCheckStatusResponse. */
    interface IUpdateCheckStatusResponse {

        /** UpdateCheckStatusResponse code */
        code?: (number|null);

        /** UpdateCheckStatusResponse msg */
        msg?: (string|null);
    }

    /** Represents an UpdateCheckStatusResponse. */
    class UpdateCheckStatusResponse implements IUpdateCheckStatusResponse {

        /**
         * Constructs a new UpdateCheckStatusResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IUpdateCheckStatusResponse);

        /** UpdateCheckStatusResponse code. */
        public code: number;

        /** UpdateCheckStatusResponse msg. */
        public msg: string;

        /**
         * Creates a new UpdateCheckStatusResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateCheckStatusResponse instance
         */
        public static create(properties?: pb.IUpdateCheckStatusResponse): pb.UpdateCheckStatusResponse;

        /**
         * Encodes the specified UpdateCheckStatusResponse message. Does not implicitly {@link pb.UpdateCheckStatusResponse.verify|verify} messages.
         * @param message UpdateCheckStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IUpdateCheckStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateCheckStatusResponse message, length delimited. Does not implicitly {@link pb.UpdateCheckStatusResponse.verify|verify} messages.
         * @param message UpdateCheckStatusResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IUpdateCheckStatusResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateCheckStatusResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateCheckStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.UpdateCheckStatusResponse;

        /**
         * Decodes an UpdateCheckStatusResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateCheckStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.UpdateCheckStatusResponse;

        /**
         * Verifies an UpdateCheckStatusResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateCheckStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateCheckStatusResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.UpdateCheckStatusResponse;

        /**
         * Creates a plain object from an UpdateCheckStatusResponse message. Also converts values to other types if specified.
         * @param message UpdateCheckStatusResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.UpdateCheckStatusResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateCheckStatusResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for UpdateCheckStatusResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteCidInfoRequest. */
    interface IDeleteCidInfoRequest {

        /** DeleteCidInfoRequest cid */
        cid?: (string|null);
    }

    /** Represents a DeleteCidInfoRequest. */
    class DeleteCidInfoRequest implements IDeleteCidInfoRequest {

        /**
         * Constructs a new DeleteCidInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IDeleteCidInfoRequest);

        /** DeleteCidInfoRequest cid. */
        public cid: string;

        /**
         * Creates a new DeleteCidInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteCidInfoRequest instance
         */
        public static create(properties?: pb.IDeleteCidInfoRequest): pb.DeleteCidInfoRequest;

        /**
         * Encodes the specified DeleteCidInfoRequest message. Does not implicitly {@link pb.DeleteCidInfoRequest.verify|verify} messages.
         * @param message DeleteCidInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IDeleteCidInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteCidInfoRequest message, length delimited. Does not implicitly {@link pb.DeleteCidInfoRequest.verify|verify} messages.
         * @param message DeleteCidInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IDeleteCidInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteCidInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.DeleteCidInfoRequest;

        /**
         * Decodes a DeleteCidInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.DeleteCidInfoRequest;

        /**
         * Verifies a DeleteCidInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteCidInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteCidInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.DeleteCidInfoRequest;

        /**
         * Creates a plain object from a DeleteCidInfoRequest message. Also converts values to other types if specified.
         * @param message DeleteCidInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.DeleteCidInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteCidInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeleteCidInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a DeleteCidInfoResponse. */
    interface IDeleteCidInfoResponse {

        /** DeleteCidInfoResponse code */
        code?: (number|null);

        /** DeleteCidInfoResponse msg */
        msg?: (string|null);
    }

    /** Represents a DeleteCidInfoResponse. */
    class DeleteCidInfoResponse implements IDeleteCidInfoResponse {

        /**
         * Constructs a new DeleteCidInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IDeleteCidInfoResponse);

        /** DeleteCidInfoResponse code. */
        public code: number;

        /** DeleteCidInfoResponse msg. */
        public msg: string;

        /**
         * Creates a new DeleteCidInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DeleteCidInfoResponse instance
         */
        public static create(properties?: pb.IDeleteCidInfoResponse): pb.DeleteCidInfoResponse;

        /**
         * Encodes the specified DeleteCidInfoResponse message. Does not implicitly {@link pb.DeleteCidInfoResponse.verify|verify} messages.
         * @param message DeleteCidInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IDeleteCidInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DeleteCidInfoResponse message, length delimited. Does not implicitly {@link pb.DeleteCidInfoResponse.verify|verify} messages.
         * @param message DeleteCidInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IDeleteCidInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DeleteCidInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DeleteCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.DeleteCidInfoResponse;

        /**
         * Decodes a DeleteCidInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DeleteCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.DeleteCidInfoResponse;

        /**
         * Verifies a DeleteCidInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DeleteCidInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DeleteCidInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.DeleteCidInfoResponse;

        /**
         * Creates a plain object from a DeleteCidInfoResponse message. Also converts values to other types if specified.
         * @param message DeleteCidInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.DeleteCidInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DeleteCidInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for DeleteCidInfoResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetEarningsSummaryRequest. */
    interface IGetEarningsSummaryRequest {

        /** GetEarningsSummaryRequest pubkey */
        pubkey?: (string|null);

        /** GetEarningsSummaryRequest serviceAppid */
        serviceAppid?: (string|null);
    }

    /** Represents a GetEarningsSummaryRequest. */
    class GetEarningsSummaryRequest implements IGetEarningsSummaryRequest {

        /**
         * Constructs a new GetEarningsSummaryRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetEarningsSummaryRequest);

        /** GetEarningsSummaryRequest pubkey. */
        public pubkey: string;

        /** GetEarningsSummaryRequest serviceAppid. */
        public serviceAppid: string;

        /**
         * Creates a new GetEarningsSummaryRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetEarningsSummaryRequest instance
         */
        public static create(properties?: pb.IGetEarningsSummaryRequest): pb.GetEarningsSummaryRequest;

        /**
         * Encodes the specified GetEarningsSummaryRequest message. Does not implicitly {@link pb.GetEarningsSummaryRequest.verify|verify} messages.
         * @param message GetEarningsSummaryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetEarningsSummaryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetEarningsSummaryRequest message, length delimited. Does not implicitly {@link pb.GetEarningsSummaryRequest.verify|verify} messages.
         * @param message GetEarningsSummaryRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetEarningsSummaryRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetEarningsSummaryRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetEarningsSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetEarningsSummaryRequest;

        /**
         * Decodes a GetEarningsSummaryRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetEarningsSummaryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetEarningsSummaryRequest;

        /**
         * Verifies a GetEarningsSummaryRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetEarningsSummaryRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetEarningsSummaryRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetEarningsSummaryRequest;

        /**
         * Creates a plain object from a GetEarningsSummaryRequest message. Also converts values to other types if specified.
         * @param message GetEarningsSummaryRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetEarningsSummaryRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetEarningsSummaryRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetEarningsSummaryRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EarningsSummaryData. */
    interface IEarningsSummaryData {

        /** EarningsSummaryData totalAmount */
        totalAmount?: (number|Long|null);

        /** EarningsSummaryData balance */
        balance?: (number|Long|null);

        /** EarningsSummaryData applyingAmount */
        applyingAmount?: (number|Long|null);

        /** EarningsSummaryData availableAmount */
        availableAmount?: (number|Long|null);

        /** EarningsSummaryData withdrawnAmount */
        withdrawnAmount?: (number|Long|null);

        /** EarningsSummaryData lockedAmount */
        lockedAmount?: (number|Long|null);
    }

    /** Represents an EarningsSummaryData. */
    class EarningsSummaryData implements IEarningsSummaryData {

        /**
         * Constructs a new EarningsSummaryData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IEarningsSummaryData);

        /** EarningsSummaryData totalAmount. */
        public totalAmount: (number|Long);

        /** EarningsSummaryData balance. */
        public balance: (number|Long);

        /** EarningsSummaryData applyingAmount. */
        public applyingAmount: (number|Long);

        /** EarningsSummaryData availableAmount. */
        public availableAmount: (number|Long);

        /** EarningsSummaryData withdrawnAmount. */
        public withdrawnAmount: (number|Long);

        /** EarningsSummaryData lockedAmount. */
        public lockedAmount: (number|Long);

        /**
         * Creates a new EarningsSummaryData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EarningsSummaryData instance
         */
        public static create(properties?: pb.IEarningsSummaryData): pb.EarningsSummaryData;

        /**
         * Encodes the specified EarningsSummaryData message. Does not implicitly {@link pb.EarningsSummaryData.verify|verify} messages.
         * @param message EarningsSummaryData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IEarningsSummaryData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EarningsSummaryData message, length delimited. Does not implicitly {@link pb.EarningsSummaryData.verify|verify} messages.
         * @param message EarningsSummaryData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IEarningsSummaryData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EarningsSummaryData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EarningsSummaryData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.EarningsSummaryData;

        /**
         * Decodes an EarningsSummaryData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EarningsSummaryData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.EarningsSummaryData;

        /**
         * Verifies an EarningsSummaryData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EarningsSummaryData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EarningsSummaryData
         */
        public static fromObject(object: { [k: string]: any }): pb.EarningsSummaryData;

        /**
         * Creates a plain object from an EarningsSummaryData message. Also converts values to other types if specified.
         * @param message EarningsSummaryData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.EarningsSummaryData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EarningsSummaryData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EarningsSummaryData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetEarningsSummaryResponse. */
    interface IGetEarningsSummaryResponse {

        /** GetEarningsSummaryResponse code */
        code?: (number|null);

        /** GetEarningsSummaryResponse msg */
        msg?: (string|null);

        /** GetEarningsSummaryResponse data */
        data?: (pb.IEarningsSummaryData|null);
    }

    /** Represents a GetEarningsSummaryResponse. */
    class GetEarningsSummaryResponse implements IGetEarningsSummaryResponse {

        /**
         * Constructs a new GetEarningsSummaryResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetEarningsSummaryResponse);

        /** GetEarningsSummaryResponse code. */
        public code: number;

        /** GetEarningsSummaryResponse msg. */
        public msg: string;

        /** GetEarningsSummaryResponse data. */
        public data?: (pb.IEarningsSummaryData|null);

        /**
         * Creates a new GetEarningsSummaryResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetEarningsSummaryResponse instance
         */
        public static create(properties?: pb.IGetEarningsSummaryResponse): pb.GetEarningsSummaryResponse;

        /**
         * Encodes the specified GetEarningsSummaryResponse message. Does not implicitly {@link pb.GetEarningsSummaryResponse.verify|verify} messages.
         * @param message GetEarningsSummaryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetEarningsSummaryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetEarningsSummaryResponse message, length delimited. Does not implicitly {@link pb.GetEarningsSummaryResponse.verify|verify} messages.
         * @param message GetEarningsSummaryResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetEarningsSummaryResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetEarningsSummaryResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetEarningsSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetEarningsSummaryResponse;

        /**
         * Decodes a GetEarningsSummaryResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetEarningsSummaryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetEarningsSummaryResponse;

        /**
         * Verifies a GetEarningsSummaryResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetEarningsSummaryResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetEarningsSummaryResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetEarningsSummaryResponse;

        /**
         * Creates a plain object from a GetEarningsSummaryResponse message. Also converts values to other types if specified.
         * @param message GetEarningsSummaryResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetEarningsSummaryResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetEarningsSummaryResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetEarningsSummaryResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListEarningsRequest. */
    interface IListEarningsRequest {

        /** ListEarningsRequest pubkey */
        pubkey?: (string|null);

        /** ListEarningsRequest serviceAppid */
        serviceAppid?: (string|null);

        /** ListEarningsRequest pageNum */
        pageNum?: (number|null);

        /** ListEarningsRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents a ListEarningsRequest. */
    class ListEarningsRequest implements IListEarningsRequest {

        /**
         * Constructs a new ListEarningsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListEarningsRequest);

        /** ListEarningsRequest pubkey. */
        public pubkey: string;

        /** ListEarningsRequest serviceAppid. */
        public serviceAppid: string;

        /** ListEarningsRequest pageNum. */
        public pageNum: number;

        /** ListEarningsRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new ListEarningsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListEarningsRequest instance
         */
        public static create(properties?: pb.IListEarningsRequest): pb.ListEarningsRequest;

        /**
         * Encodes the specified ListEarningsRequest message. Does not implicitly {@link pb.ListEarningsRequest.verify|verify} messages.
         * @param message ListEarningsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListEarningsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListEarningsRequest message, length delimited. Does not implicitly {@link pb.ListEarningsRequest.verify|verify} messages.
         * @param message ListEarningsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListEarningsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListEarningsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListEarningsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListEarningsRequest;

        /**
         * Decodes a ListEarningsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListEarningsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListEarningsRequest;

        /**
         * Verifies a ListEarningsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListEarningsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListEarningsRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.ListEarningsRequest;

        /**
         * Creates a plain object from a ListEarningsRequest message. Also converts values to other types if specified.
         * @param message ListEarningsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListEarningsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListEarningsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListEarningsRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an EarningsRecordInfo. */
    interface IEarningsRecordInfo {

        /** EarningsRecordInfo id */
        id?: (number|Long|null);

        /** EarningsRecordInfo outTradeNo */
        outTradeNo?: (string|null);

        /** EarningsRecordInfo pubkey */
        pubkey?: (string|null);

        /** EarningsRecordInfo serviceAppid */
        serviceAppid?: (string|null);

        /** EarningsRecordInfo theme */
        theme?: (string|null);

        /** EarningsRecordInfo pkgId */
        pkgId?: (number|null);

        /** EarningsRecordInfo pkgName */
        pkgName?: (string|null);

        /** EarningsRecordInfo amount */
        amount?: (number|null);

        /** EarningsRecordInfo currency */
        currency?: (string|null);

        /** EarningsRecordInfo validDays */
        validDays?: (number|null);

        /** EarningsRecordInfo paidAt */
        paidAt?: (string|null);

        /** EarningsRecordInfo userAccount */
        userAccount?: (string|null);

        /** EarningsRecordInfo recordType */
        recordType?: (number|null);

        /** EarningsRecordInfo unlockedAmount */
        unlockedAmount?: (number|null);

        /** EarningsRecordInfo createTime */
        createTime?: (string|null);
    }

    /** Represents an EarningsRecordInfo. */
    class EarningsRecordInfo implements IEarningsRecordInfo {

        /**
         * Constructs a new EarningsRecordInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IEarningsRecordInfo);

        /** EarningsRecordInfo id. */
        public id: (number|Long);

        /** EarningsRecordInfo outTradeNo. */
        public outTradeNo: string;

        /** EarningsRecordInfo pubkey. */
        public pubkey: string;

        /** EarningsRecordInfo serviceAppid. */
        public serviceAppid: string;

        /** EarningsRecordInfo theme. */
        public theme: string;

        /** EarningsRecordInfo pkgId. */
        public pkgId: number;

        /** EarningsRecordInfo pkgName. */
        public pkgName: string;

        /** EarningsRecordInfo amount. */
        public amount: number;

        /** EarningsRecordInfo currency. */
        public currency: string;

        /** EarningsRecordInfo validDays. */
        public validDays: number;

        /** EarningsRecordInfo paidAt. */
        public paidAt: string;

        /** EarningsRecordInfo userAccount. */
        public userAccount: string;

        /** EarningsRecordInfo recordType. */
        public recordType: number;

        /** EarningsRecordInfo unlockedAmount. */
        public unlockedAmount: number;

        /** EarningsRecordInfo createTime. */
        public createTime: string;

        /**
         * Creates a new EarningsRecordInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EarningsRecordInfo instance
         */
        public static create(properties?: pb.IEarningsRecordInfo): pb.EarningsRecordInfo;

        /**
         * Encodes the specified EarningsRecordInfo message. Does not implicitly {@link pb.EarningsRecordInfo.verify|verify} messages.
         * @param message EarningsRecordInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IEarningsRecordInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EarningsRecordInfo message, length delimited. Does not implicitly {@link pb.EarningsRecordInfo.verify|verify} messages.
         * @param message EarningsRecordInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IEarningsRecordInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EarningsRecordInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EarningsRecordInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.EarningsRecordInfo;

        /**
         * Decodes an EarningsRecordInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EarningsRecordInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.EarningsRecordInfo;

        /**
         * Verifies an EarningsRecordInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EarningsRecordInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EarningsRecordInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.EarningsRecordInfo;

        /**
         * Creates a plain object from an EarningsRecordInfo message. Also converts values to other types if specified.
         * @param message EarningsRecordInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.EarningsRecordInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EarningsRecordInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for EarningsRecordInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListEarningsResponse. */
    interface IListEarningsResponse {

        /** ListEarningsResponse code */
        code?: (number|null);

        /** ListEarningsResponse msg */
        msg?: (string|null);

        /** ListEarningsResponse total */
        total?: (number|Long|null);

        /** ListEarningsResponse data */
        data?: (pb.IEarningsRecordInfo[]|null);
    }

    /** Represents a ListEarningsResponse. */
    class ListEarningsResponse implements IListEarningsResponse {

        /**
         * Constructs a new ListEarningsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListEarningsResponse);

        /** ListEarningsResponse code. */
        public code: number;

        /** ListEarningsResponse msg. */
        public msg: string;

        /** ListEarningsResponse total. */
        public total: (number|Long);

        /** ListEarningsResponse data. */
        public data: pb.IEarningsRecordInfo[];

        /**
         * Creates a new ListEarningsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListEarningsResponse instance
         */
        public static create(properties?: pb.IListEarningsResponse): pb.ListEarningsResponse;

        /**
         * Encodes the specified ListEarningsResponse message. Does not implicitly {@link pb.ListEarningsResponse.verify|verify} messages.
         * @param message ListEarningsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListEarningsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListEarningsResponse message, length delimited. Does not implicitly {@link pb.ListEarningsResponse.verify|verify} messages.
         * @param message ListEarningsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListEarningsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListEarningsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListEarningsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListEarningsResponse;

        /**
         * Decodes a ListEarningsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListEarningsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListEarningsResponse;

        /**
         * Verifies a ListEarningsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListEarningsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListEarningsResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.ListEarningsResponse;

        /**
         * Creates a plain object from a ListEarningsResponse message. Also converts values to other types if specified.
         * @param message ListEarningsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListEarningsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListEarningsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListEarningsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayeeInfoRequest. */
    interface IGetPayeeInfoRequest {

        /** GetPayeeInfoRequest pubkey */
        pubkey?: (string|null);
    }

    /** Represents a GetPayeeInfoRequest. */
    class GetPayeeInfoRequest implements IGetPayeeInfoRequest {

        /**
         * Constructs a new GetPayeeInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayeeInfoRequest);

        /** GetPayeeInfoRequest pubkey. */
        public pubkey: string;

        /**
         * Creates a new GetPayeeInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayeeInfoRequest instance
         */
        public static create(properties?: pb.IGetPayeeInfoRequest): pb.GetPayeeInfoRequest;

        /**
         * Encodes the specified GetPayeeInfoRequest message. Does not implicitly {@link pb.GetPayeeInfoRequest.verify|verify} messages.
         * @param message GetPayeeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayeeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayeeInfoRequest message, length delimited. Does not implicitly {@link pb.GetPayeeInfoRequest.verify|verify} messages.
         * @param message GetPayeeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayeeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayeeInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayeeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayeeInfoRequest;

        /**
         * Decodes a GetPayeeInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayeeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayeeInfoRequest;

        /**
         * Verifies a GetPayeeInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayeeInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayeeInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayeeInfoRequest;

        /**
         * Creates a plain object from a GetPayeeInfoRequest message. Also converts values to other types if specified.
         * @param message GetPayeeInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayeeInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayeeInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayeeInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PayeeInfoData. */
    interface IPayeeInfoData {

        /** PayeeInfoData id */
        id?: (number|Long|null);

        /** PayeeInfoData pubkey */
        pubkey?: (string|null);

        /** PayeeInfoData payeeType */
        payeeType?: (number|null);

        /** PayeeInfoData realName */
        realName?: (string|null);

        /** PayeeInfoData idCard */
        idCard?: (string|null);

        /** PayeeInfoData bizLicense */
        bizLicense?: (string|null);

        /** PayeeInfoData bankName */
        bankName?: (string|null);

        /** PayeeInfoData bankAccount */
        bankAccount?: (string|null);

        /** PayeeInfoData bankHolder */
        bankHolder?: (string|null);

        /** PayeeInfoData contactPhone */
        contactPhone?: (string|null);

        /** PayeeInfoData contactEmail */
        contactEmail?: (string|null);

        /** PayeeInfoData createTime */
        createTime?: (string|null);

        /** PayeeInfoData updateTime */
        updateTime?: (string|null);
    }

    /** Represents a PayeeInfoData. */
    class PayeeInfoData implements IPayeeInfoData {

        /**
         * Constructs a new PayeeInfoData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IPayeeInfoData);

        /** PayeeInfoData id. */
        public id: (number|Long);

        /** PayeeInfoData pubkey. */
        public pubkey: string;

        /** PayeeInfoData payeeType. */
        public payeeType: number;

        /** PayeeInfoData realName. */
        public realName: string;

        /** PayeeInfoData idCard. */
        public idCard: string;

        /** PayeeInfoData bizLicense. */
        public bizLicense: string;

        /** PayeeInfoData bankName. */
        public bankName: string;

        /** PayeeInfoData bankAccount. */
        public bankAccount: string;

        /** PayeeInfoData bankHolder. */
        public bankHolder: string;

        /** PayeeInfoData contactPhone. */
        public contactPhone: string;

        /** PayeeInfoData contactEmail. */
        public contactEmail: string;

        /** PayeeInfoData createTime. */
        public createTime: string;

        /** PayeeInfoData updateTime. */
        public updateTime: string;

        /**
         * Creates a new PayeeInfoData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PayeeInfoData instance
         */
        public static create(properties?: pb.IPayeeInfoData): pb.PayeeInfoData;

        /**
         * Encodes the specified PayeeInfoData message. Does not implicitly {@link pb.PayeeInfoData.verify|verify} messages.
         * @param message PayeeInfoData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IPayeeInfoData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PayeeInfoData message, length delimited. Does not implicitly {@link pb.PayeeInfoData.verify|verify} messages.
         * @param message PayeeInfoData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IPayeeInfoData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PayeeInfoData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PayeeInfoData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.PayeeInfoData;

        /**
         * Decodes a PayeeInfoData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PayeeInfoData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.PayeeInfoData;

        /**
         * Verifies a PayeeInfoData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PayeeInfoData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PayeeInfoData
         */
        public static fromObject(object: { [k: string]: any }): pb.PayeeInfoData;

        /**
         * Creates a plain object from a PayeeInfoData message. Also converts values to other types if specified.
         * @param message PayeeInfoData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.PayeeInfoData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PayeeInfoData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PayeeInfoData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayeeInfoResponse. */
    interface IGetPayeeInfoResponse {

        /** GetPayeeInfoResponse code */
        code?: (number|null);

        /** GetPayeeInfoResponse msg */
        msg?: (string|null);

        /** GetPayeeInfoResponse data */
        data?: (pb.IPayeeInfoData|null);
    }

    /** Represents a GetPayeeInfoResponse. */
    class GetPayeeInfoResponse implements IGetPayeeInfoResponse {

        /**
         * Constructs a new GetPayeeInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayeeInfoResponse);

        /** GetPayeeInfoResponse code. */
        public code: number;

        /** GetPayeeInfoResponse msg. */
        public msg: string;

        /** GetPayeeInfoResponse data. */
        public data?: (pb.IPayeeInfoData|null);

        /**
         * Creates a new GetPayeeInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayeeInfoResponse instance
         */
        public static create(properties?: pb.IGetPayeeInfoResponse): pb.GetPayeeInfoResponse;

        /**
         * Encodes the specified GetPayeeInfoResponse message. Does not implicitly {@link pb.GetPayeeInfoResponse.verify|verify} messages.
         * @param message GetPayeeInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayeeInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayeeInfoResponse message, length delimited. Does not implicitly {@link pb.GetPayeeInfoResponse.verify|verify} messages.
         * @param message GetPayeeInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayeeInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayeeInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayeeInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayeeInfoResponse;

        /**
         * Decodes a GetPayeeInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayeeInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayeeInfoResponse;

        /**
         * Verifies a GetPayeeInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayeeInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayeeInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayeeInfoResponse;

        /**
         * Creates a plain object from a GetPayeeInfoResponse message. Also converts values to other types if specified.
         * @param message GetPayeeInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayeeInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayeeInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayeeInfoResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SavePayeeInfoRequest. */
    interface ISavePayeeInfoRequest {

        /** SavePayeeInfoRequest pubkey */
        pubkey?: (string|null);

        /** SavePayeeInfoRequest payeeType */
        payeeType?: (number|null);

        /** SavePayeeInfoRequest realName */
        realName?: (string|null);

        /** SavePayeeInfoRequest idCard */
        idCard?: (string|null);

        /** SavePayeeInfoRequest bizLicense */
        bizLicense?: (string|null);

        /** SavePayeeInfoRequest bankName */
        bankName?: (string|null);

        /** SavePayeeInfoRequest bankAccount */
        bankAccount?: (string|null);

        /** SavePayeeInfoRequest bankHolder */
        bankHolder?: (string|null);

        /** SavePayeeInfoRequest contactPhone */
        contactPhone?: (string|null);

        /** SavePayeeInfoRequest contactEmail */
        contactEmail?: (string|null);
    }

    /** Represents a SavePayeeInfoRequest. */
    class SavePayeeInfoRequest implements ISavePayeeInfoRequest {

        /**
         * Constructs a new SavePayeeInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ISavePayeeInfoRequest);

        /** SavePayeeInfoRequest pubkey. */
        public pubkey: string;

        /** SavePayeeInfoRequest payeeType. */
        public payeeType: number;

        /** SavePayeeInfoRequest realName. */
        public realName: string;

        /** SavePayeeInfoRequest idCard. */
        public idCard: string;

        /** SavePayeeInfoRequest bizLicense. */
        public bizLicense: string;

        /** SavePayeeInfoRequest bankName. */
        public bankName: string;

        /** SavePayeeInfoRequest bankAccount. */
        public bankAccount: string;

        /** SavePayeeInfoRequest bankHolder. */
        public bankHolder: string;

        /** SavePayeeInfoRequest contactPhone. */
        public contactPhone: string;

        /** SavePayeeInfoRequest contactEmail. */
        public contactEmail: string;

        /**
         * Creates a new SavePayeeInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SavePayeeInfoRequest instance
         */
        public static create(properties?: pb.ISavePayeeInfoRequest): pb.SavePayeeInfoRequest;

        /**
         * Encodes the specified SavePayeeInfoRequest message. Does not implicitly {@link pb.SavePayeeInfoRequest.verify|verify} messages.
         * @param message SavePayeeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ISavePayeeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SavePayeeInfoRequest message, length delimited. Does not implicitly {@link pb.SavePayeeInfoRequest.verify|verify} messages.
         * @param message SavePayeeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ISavePayeeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SavePayeeInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SavePayeeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.SavePayeeInfoRequest;

        /**
         * Decodes a SavePayeeInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SavePayeeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.SavePayeeInfoRequest;

        /**
         * Verifies a SavePayeeInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SavePayeeInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SavePayeeInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.SavePayeeInfoRequest;

        /**
         * Creates a plain object from a SavePayeeInfoRequest message. Also converts values to other types if specified.
         * @param message SavePayeeInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.SavePayeeInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SavePayeeInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SavePayeeInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SavePayeeInfoResponse. */
    interface ISavePayeeInfoResponse {

        /** SavePayeeInfoResponse code */
        code?: (number|null);

        /** SavePayeeInfoResponse msg */
        msg?: (string|null);

        /** SavePayeeInfoResponse data */
        data?: (pb.IPayeeInfoData|null);
    }

    /** Represents a SavePayeeInfoResponse. */
    class SavePayeeInfoResponse implements ISavePayeeInfoResponse {

        /**
         * Constructs a new SavePayeeInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.ISavePayeeInfoResponse);

        /** SavePayeeInfoResponse code. */
        public code: number;

        /** SavePayeeInfoResponse msg. */
        public msg: string;

        /** SavePayeeInfoResponse data. */
        public data?: (pb.IPayeeInfoData|null);

        /**
         * Creates a new SavePayeeInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SavePayeeInfoResponse instance
         */
        public static create(properties?: pb.ISavePayeeInfoResponse): pb.SavePayeeInfoResponse;

        /**
         * Encodes the specified SavePayeeInfoResponse message. Does not implicitly {@link pb.SavePayeeInfoResponse.verify|verify} messages.
         * @param message SavePayeeInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.ISavePayeeInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SavePayeeInfoResponse message, length delimited. Does not implicitly {@link pb.SavePayeeInfoResponse.verify|verify} messages.
         * @param message SavePayeeInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.ISavePayeeInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SavePayeeInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SavePayeeInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.SavePayeeInfoResponse;

        /**
         * Decodes a SavePayeeInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SavePayeeInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.SavePayeeInfoResponse;

        /**
         * Verifies a SavePayeeInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SavePayeeInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SavePayeeInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.SavePayeeInfoResponse;

        /**
         * Creates a plain object from a SavePayeeInfoResponse message. Also converts values to other types if specified.
         * @param message SavePayeeInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.SavePayeeInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SavePayeeInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SavePayeeInfoResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ApplyWithdrawalRequest. */
    interface IApplyWithdrawalRequest {

        /** ApplyWithdrawalRequest pubkey */
        pubkey?: (string|null);

        /** ApplyWithdrawalRequest amount */
        amount?: (number|null);

        /** ApplyWithdrawalRequest currency */
        currency?: (string|null);
    }

    /** Represents an ApplyWithdrawalRequest. */
    class ApplyWithdrawalRequest implements IApplyWithdrawalRequest {

        /**
         * Constructs a new ApplyWithdrawalRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IApplyWithdrawalRequest);

        /** ApplyWithdrawalRequest pubkey. */
        public pubkey: string;

        /** ApplyWithdrawalRequest amount. */
        public amount: number;

        /** ApplyWithdrawalRequest currency. */
        public currency: string;

        /**
         * Creates a new ApplyWithdrawalRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ApplyWithdrawalRequest instance
         */
        public static create(properties?: pb.IApplyWithdrawalRequest): pb.ApplyWithdrawalRequest;

        /**
         * Encodes the specified ApplyWithdrawalRequest message. Does not implicitly {@link pb.ApplyWithdrawalRequest.verify|verify} messages.
         * @param message ApplyWithdrawalRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IApplyWithdrawalRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ApplyWithdrawalRequest message, length delimited. Does not implicitly {@link pb.ApplyWithdrawalRequest.verify|verify} messages.
         * @param message ApplyWithdrawalRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IApplyWithdrawalRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ApplyWithdrawalRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ApplyWithdrawalRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ApplyWithdrawalRequest;

        /**
         * Decodes an ApplyWithdrawalRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ApplyWithdrawalRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ApplyWithdrawalRequest;

        /**
         * Verifies an ApplyWithdrawalRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ApplyWithdrawalRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ApplyWithdrawalRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.ApplyWithdrawalRequest;

        /**
         * Creates a plain object from an ApplyWithdrawalRequest message. Also converts values to other types if specified.
         * @param message ApplyWithdrawalRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ApplyWithdrawalRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ApplyWithdrawalRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ApplyWithdrawalRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a WithdrawalApplicationInfo. */
    interface IWithdrawalApplicationInfo {

        /** WithdrawalApplicationInfo id */
        id?: (number|Long|null);

        /** WithdrawalApplicationInfo pubkey */
        pubkey?: (string|null);

        /** WithdrawalApplicationInfo amount */
        amount?: (number|null);

        /** WithdrawalApplicationInfo currency */
        currency?: (string|null);

        /** WithdrawalApplicationInfo status */
        status?: (number|null);

        /** WithdrawalApplicationInfo rejectReason */
        rejectReason?: (string|null);

        /** WithdrawalApplicationInfo adminNote */
        adminNote?: (string|null);

        /** WithdrawalApplicationInfo transferNo */
        transferNo?: (string|null);

        /** WithdrawalApplicationInfo reviewedAt */
        reviewedAt?: (string|null);

        /** WithdrawalApplicationInfo paidAt */
        paidAt?: (string|null);

        /** WithdrawalApplicationInfo createTime */
        createTime?: (string|null);
    }

    /** Represents a WithdrawalApplicationInfo. */
    class WithdrawalApplicationInfo implements IWithdrawalApplicationInfo {

        /**
         * Constructs a new WithdrawalApplicationInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IWithdrawalApplicationInfo);

        /** WithdrawalApplicationInfo id. */
        public id: (number|Long);

        /** WithdrawalApplicationInfo pubkey. */
        public pubkey: string;

        /** WithdrawalApplicationInfo amount. */
        public amount: number;

        /** WithdrawalApplicationInfo currency. */
        public currency: string;

        /** WithdrawalApplicationInfo status. */
        public status: number;

        /** WithdrawalApplicationInfo rejectReason. */
        public rejectReason: string;

        /** WithdrawalApplicationInfo adminNote. */
        public adminNote: string;

        /** WithdrawalApplicationInfo transferNo. */
        public transferNo: string;

        /** WithdrawalApplicationInfo reviewedAt. */
        public reviewedAt: string;

        /** WithdrawalApplicationInfo paidAt. */
        public paidAt: string;

        /** WithdrawalApplicationInfo createTime. */
        public createTime: string;

        /**
         * Creates a new WithdrawalApplicationInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WithdrawalApplicationInfo instance
         */
        public static create(properties?: pb.IWithdrawalApplicationInfo): pb.WithdrawalApplicationInfo;

        /**
         * Encodes the specified WithdrawalApplicationInfo message. Does not implicitly {@link pb.WithdrawalApplicationInfo.verify|verify} messages.
         * @param message WithdrawalApplicationInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IWithdrawalApplicationInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WithdrawalApplicationInfo message, length delimited. Does not implicitly {@link pb.WithdrawalApplicationInfo.verify|verify} messages.
         * @param message WithdrawalApplicationInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IWithdrawalApplicationInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WithdrawalApplicationInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WithdrawalApplicationInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.WithdrawalApplicationInfo;

        /**
         * Decodes a WithdrawalApplicationInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WithdrawalApplicationInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.WithdrawalApplicationInfo;

        /**
         * Verifies a WithdrawalApplicationInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WithdrawalApplicationInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WithdrawalApplicationInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.WithdrawalApplicationInfo;

        /**
         * Creates a plain object from a WithdrawalApplicationInfo message. Also converts values to other types if specified.
         * @param message WithdrawalApplicationInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.WithdrawalApplicationInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WithdrawalApplicationInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for WithdrawalApplicationInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ApplyWithdrawalResponse. */
    interface IApplyWithdrawalResponse {

        /** ApplyWithdrawalResponse code */
        code?: (number|null);

        /** ApplyWithdrawalResponse msg */
        msg?: (string|null);

        /** ApplyWithdrawalResponse data */
        data?: (pb.IWithdrawalApplicationInfo|null);

        /** ApplyWithdrawalResponse availableAmount */
        availableAmount?: (number|null);
    }

    /** Represents an ApplyWithdrawalResponse. */
    class ApplyWithdrawalResponse implements IApplyWithdrawalResponse {

        /**
         * Constructs a new ApplyWithdrawalResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IApplyWithdrawalResponse);

        /** ApplyWithdrawalResponse code. */
        public code: number;

        /** ApplyWithdrawalResponse msg. */
        public msg: string;

        /** ApplyWithdrawalResponse data. */
        public data?: (pb.IWithdrawalApplicationInfo|null);

        /** ApplyWithdrawalResponse availableAmount. */
        public availableAmount: number;

        /**
         * Creates a new ApplyWithdrawalResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ApplyWithdrawalResponse instance
         */
        public static create(properties?: pb.IApplyWithdrawalResponse): pb.ApplyWithdrawalResponse;

        /**
         * Encodes the specified ApplyWithdrawalResponse message. Does not implicitly {@link pb.ApplyWithdrawalResponse.verify|verify} messages.
         * @param message ApplyWithdrawalResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IApplyWithdrawalResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ApplyWithdrawalResponse message, length delimited. Does not implicitly {@link pb.ApplyWithdrawalResponse.verify|verify} messages.
         * @param message ApplyWithdrawalResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IApplyWithdrawalResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ApplyWithdrawalResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ApplyWithdrawalResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ApplyWithdrawalResponse;

        /**
         * Decodes an ApplyWithdrawalResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ApplyWithdrawalResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ApplyWithdrawalResponse;

        /**
         * Verifies an ApplyWithdrawalResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ApplyWithdrawalResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ApplyWithdrawalResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.ApplyWithdrawalResponse;

        /**
         * Creates a plain object from an ApplyWithdrawalResponse message. Also converts values to other types if specified.
         * @param message ApplyWithdrawalResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ApplyWithdrawalResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ApplyWithdrawalResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ApplyWithdrawalResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListWithdrawalsRequest. */
    interface IListWithdrawalsRequest {

        /** ListWithdrawalsRequest pubkey */
        pubkey?: (string|null);

        /** ListWithdrawalsRequest pageNum */
        pageNum?: (number|null);

        /** ListWithdrawalsRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents a ListWithdrawalsRequest. */
    class ListWithdrawalsRequest implements IListWithdrawalsRequest {

        /**
         * Constructs a new ListWithdrawalsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListWithdrawalsRequest);

        /** ListWithdrawalsRequest pubkey. */
        public pubkey: string;

        /** ListWithdrawalsRequest pageNum. */
        public pageNum: number;

        /** ListWithdrawalsRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new ListWithdrawalsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListWithdrawalsRequest instance
         */
        public static create(properties?: pb.IListWithdrawalsRequest): pb.ListWithdrawalsRequest;

        /**
         * Encodes the specified ListWithdrawalsRequest message. Does not implicitly {@link pb.ListWithdrawalsRequest.verify|verify} messages.
         * @param message ListWithdrawalsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListWithdrawalsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListWithdrawalsRequest message, length delimited. Does not implicitly {@link pb.ListWithdrawalsRequest.verify|verify} messages.
         * @param message ListWithdrawalsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListWithdrawalsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListWithdrawalsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListWithdrawalsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListWithdrawalsRequest;

        /**
         * Decodes a ListWithdrawalsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListWithdrawalsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListWithdrawalsRequest;

        /**
         * Verifies a ListWithdrawalsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListWithdrawalsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListWithdrawalsRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.ListWithdrawalsRequest;

        /**
         * Creates a plain object from a ListWithdrawalsRequest message. Also converts values to other types if specified.
         * @param message ListWithdrawalsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListWithdrawalsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListWithdrawalsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListWithdrawalsRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListWithdrawalsResponse. */
    interface IListWithdrawalsResponse {

        /** ListWithdrawalsResponse code */
        code?: (number|null);

        /** ListWithdrawalsResponse msg */
        msg?: (string|null);

        /** ListWithdrawalsResponse total */
        total?: (number|Long|null);

        /** ListWithdrawalsResponse data */
        data?: (pb.IWithdrawalApplicationInfo[]|null);
    }

    /** Represents a ListWithdrawalsResponse. */
    class ListWithdrawalsResponse implements IListWithdrawalsResponse {

        /**
         * Constructs a new ListWithdrawalsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListWithdrawalsResponse);

        /** ListWithdrawalsResponse code. */
        public code: number;

        /** ListWithdrawalsResponse msg. */
        public msg: string;

        /** ListWithdrawalsResponse total. */
        public total: (number|Long);

        /** ListWithdrawalsResponse data. */
        public data: pb.IWithdrawalApplicationInfo[];

        /**
         * Creates a new ListWithdrawalsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListWithdrawalsResponse instance
         */
        public static create(properties?: pb.IListWithdrawalsResponse): pb.ListWithdrawalsResponse;

        /**
         * Encodes the specified ListWithdrawalsResponse message. Does not implicitly {@link pb.ListWithdrawalsResponse.verify|verify} messages.
         * @param message ListWithdrawalsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListWithdrawalsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListWithdrawalsResponse message, length delimited. Does not implicitly {@link pb.ListWithdrawalsResponse.verify|verify} messages.
         * @param message ListWithdrawalsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListWithdrawalsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListWithdrawalsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListWithdrawalsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListWithdrawalsResponse;

        /**
         * Decodes a ListWithdrawalsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListWithdrawalsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListWithdrawalsResponse;

        /**
         * Verifies a ListWithdrawalsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListWithdrawalsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListWithdrawalsResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.ListWithdrawalsResponse;

        /**
         * Creates a plain object from a ListWithdrawalsResponse message. Also converts values to other types if specified.
         * @param message ListWithdrawalsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListWithdrawalsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListWithdrawalsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListWithdrawalsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayBillByTradeNoRequest. */
    interface IGetPayBillByTradeNoRequest {

        /** GetPayBillByTradeNoRequest outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a GetPayBillByTradeNoRequest. */
    class GetPayBillByTradeNoRequest implements IGetPayBillByTradeNoRequest {

        /**
         * Constructs a new GetPayBillByTradeNoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayBillByTradeNoRequest);

        /** GetPayBillByTradeNoRequest outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new GetPayBillByTradeNoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayBillByTradeNoRequest instance
         */
        public static create(properties?: pb.IGetPayBillByTradeNoRequest): pb.GetPayBillByTradeNoRequest;

        /**
         * Encodes the specified GetPayBillByTradeNoRequest message. Does not implicitly {@link pb.GetPayBillByTradeNoRequest.verify|verify} messages.
         * @param message GetPayBillByTradeNoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayBillByTradeNoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayBillByTradeNoRequest message, length delimited. Does not implicitly {@link pb.GetPayBillByTradeNoRequest.verify|verify} messages.
         * @param message GetPayBillByTradeNoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayBillByTradeNoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayBillByTradeNoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayBillByTradeNoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayBillByTradeNoRequest;

        /**
         * Decodes a GetPayBillByTradeNoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayBillByTradeNoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayBillByTradeNoRequest;

        /**
         * Verifies a GetPayBillByTradeNoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayBillByTradeNoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayBillByTradeNoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayBillByTradeNoRequest;

        /**
         * Creates a plain object from a GetPayBillByTradeNoRequest message. Also converts values to other types if specified.
         * @param message GetPayBillByTradeNoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayBillByTradeNoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayBillByTradeNoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayBillByTradeNoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayBillByTransactionIdRequest. */
    interface IGetPayBillByTransactionIdRequest {

        /** GetPayBillByTransactionIdRequest transactionId */
        transactionId?: (string|null);
    }

    /** Represents a GetPayBillByTransactionIdRequest. */
    class GetPayBillByTransactionIdRequest implements IGetPayBillByTransactionIdRequest {

        /**
         * Constructs a new GetPayBillByTransactionIdRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayBillByTransactionIdRequest);

        /** GetPayBillByTransactionIdRequest transactionId. */
        public transactionId: string;

        /**
         * Creates a new GetPayBillByTransactionIdRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayBillByTransactionIdRequest instance
         */
        public static create(properties?: pb.IGetPayBillByTransactionIdRequest): pb.GetPayBillByTransactionIdRequest;

        /**
         * Encodes the specified GetPayBillByTransactionIdRequest message. Does not implicitly {@link pb.GetPayBillByTransactionIdRequest.verify|verify} messages.
         * @param message GetPayBillByTransactionIdRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayBillByTransactionIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayBillByTransactionIdRequest message, length delimited. Does not implicitly {@link pb.GetPayBillByTransactionIdRequest.verify|verify} messages.
         * @param message GetPayBillByTransactionIdRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayBillByTransactionIdRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayBillByTransactionIdRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayBillByTransactionIdRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayBillByTransactionIdRequest;

        /**
         * Decodes a GetPayBillByTransactionIdRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayBillByTransactionIdRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayBillByTransactionIdRequest;

        /**
         * Verifies a GetPayBillByTransactionIdRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayBillByTransactionIdRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayBillByTransactionIdRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayBillByTransactionIdRequest;

        /**
         * Creates a plain object from a GetPayBillByTransactionIdRequest message. Also converts values to other types if specified.
         * @param message GetPayBillByTransactionIdRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayBillByTransactionIdRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayBillByTransactionIdRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayBillByTransactionIdRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PayBillInfo. */
    interface IPayBillInfo {

        /** PayBillInfo outTradeNo */
        outTradeNo?: (string|null);

        /** PayBillInfo appid */
        appid?: (string|null);

        /** PayBillInfo mchid */
        mchid?: (string|null);

        /** PayBillInfo transactionId */
        transactionId?: (string|null);

        /** PayBillInfo tradeType */
        tradeType?: (string|null);

        /** PayBillInfo tradeState */
        tradeState?: (string|null);

        /** PayBillInfo successTime */
        successTime?: (string|null);

        /** PayBillInfo openid */
        openid?: (string|null);

        /** PayBillInfo total */
        total?: (number|null);

        /** PayBillInfo payerTotal */
        payerTotal?: (number|null);

        /** PayBillInfo createTime */
        createTime?: (string|null);
    }

    /** Represents a PayBillInfo. */
    class PayBillInfo implements IPayBillInfo {

        /**
         * Constructs a new PayBillInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IPayBillInfo);

        /** PayBillInfo outTradeNo. */
        public outTradeNo: string;

        /** PayBillInfo appid. */
        public appid: string;

        /** PayBillInfo mchid. */
        public mchid: string;

        /** PayBillInfo transactionId. */
        public transactionId: string;

        /** PayBillInfo tradeType. */
        public tradeType: string;

        /** PayBillInfo tradeState. */
        public tradeState: string;

        /** PayBillInfo successTime. */
        public successTime: string;

        /** PayBillInfo openid. */
        public openid: string;

        /** PayBillInfo total. */
        public total: number;

        /** PayBillInfo payerTotal. */
        public payerTotal: number;

        /** PayBillInfo createTime. */
        public createTime: string;

        /**
         * Creates a new PayBillInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PayBillInfo instance
         */
        public static create(properties?: pb.IPayBillInfo): pb.PayBillInfo;

        /**
         * Encodes the specified PayBillInfo message. Does not implicitly {@link pb.PayBillInfo.verify|verify} messages.
         * @param message PayBillInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IPayBillInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PayBillInfo message, length delimited. Does not implicitly {@link pb.PayBillInfo.verify|verify} messages.
         * @param message PayBillInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IPayBillInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PayBillInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PayBillInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.PayBillInfo;

        /**
         * Decodes a PayBillInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PayBillInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.PayBillInfo;

        /**
         * Verifies a PayBillInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PayBillInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PayBillInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.PayBillInfo;

        /**
         * Creates a plain object from a PayBillInfo message. Also converts values to other types if specified.
         * @param message PayBillInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.PayBillInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PayBillInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PayBillInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayBillResponse. */
    interface IGetPayBillResponse {

        /** GetPayBillResponse code */
        code?: (number|null);

        /** GetPayBillResponse msg */
        msg?: (string|null);

        /** GetPayBillResponse data */
        data?: (pb.IPayBillInfo|null);
    }

    /** Represents a GetPayBillResponse. */
    class GetPayBillResponse implements IGetPayBillResponse {

        /**
         * Constructs a new GetPayBillResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayBillResponse);

        /** GetPayBillResponse code. */
        public code: number;

        /** GetPayBillResponse msg. */
        public msg: string;

        /** GetPayBillResponse data. */
        public data?: (pb.IPayBillInfo|null);

        /**
         * Creates a new GetPayBillResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayBillResponse instance
         */
        public static create(properties?: pb.IGetPayBillResponse): pb.GetPayBillResponse;

        /**
         * Encodes the specified GetPayBillResponse message. Does not implicitly {@link pb.GetPayBillResponse.verify|verify} messages.
         * @param message GetPayBillResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayBillResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayBillResponse message, length delimited. Does not implicitly {@link pb.GetPayBillResponse.verify|verify} messages.
         * @param message GetPayBillResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayBillResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayBillResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayBillResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayBillResponse;

        /**
         * Decodes a GetPayBillResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayBillResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayBillResponse;

        /**
         * Verifies a GetPayBillResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayBillResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayBillResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayBillResponse;

        /**
         * Creates a plain object from a GetPayBillResponse message. Also converts values to other types if specified.
         * @param message GetPayBillResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayBillResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayBillResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayBillResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListPayBillsByOpenidRequest. */
    interface IListPayBillsByOpenidRequest {

        /** ListPayBillsByOpenidRequest openid */
        openid?: (string|null);

        /** ListPayBillsByOpenidRequest pageNum */
        pageNum?: (number|null);

        /** ListPayBillsByOpenidRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents a ListPayBillsByOpenidRequest. */
    class ListPayBillsByOpenidRequest implements IListPayBillsByOpenidRequest {

        /**
         * Constructs a new ListPayBillsByOpenidRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListPayBillsByOpenidRequest);

        /** ListPayBillsByOpenidRequest openid. */
        public openid: string;

        /** ListPayBillsByOpenidRequest pageNum. */
        public pageNum: number;

        /** ListPayBillsByOpenidRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new ListPayBillsByOpenidRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPayBillsByOpenidRequest instance
         */
        public static create(properties?: pb.IListPayBillsByOpenidRequest): pb.ListPayBillsByOpenidRequest;

        /**
         * Encodes the specified ListPayBillsByOpenidRequest message. Does not implicitly {@link pb.ListPayBillsByOpenidRequest.verify|verify} messages.
         * @param message ListPayBillsByOpenidRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListPayBillsByOpenidRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPayBillsByOpenidRequest message, length delimited. Does not implicitly {@link pb.ListPayBillsByOpenidRequest.verify|verify} messages.
         * @param message ListPayBillsByOpenidRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListPayBillsByOpenidRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPayBillsByOpenidRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPayBillsByOpenidRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListPayBillsByOpenidRequest;

        /**
         * Decodes a ListPayBillsByOpenidRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPayBillsByOpenidRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListPayBillsByOpenidRequest;

        /**
         * Verifies a ListPayBillsByOpenidRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPayBillsByOpenidRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPayBillsByOpenidRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.ListPayBillsByOpenidRequest;

        /**
         * Creates a plain object from a ListPayBillsByOpenidRequest message. Also converts values to other types if specified.
         * @param message ListPayBillsByOpenidRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListPayBillsByOpenidRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPayBillsByOpenidRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListPayBillsByOpenidRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListPayBillsRequest. */
    interface IListPayBillsRequest {

        /** ListPayBillsRequest appid */
        appid?: (string|null);

        /** ListPayBillsRequest mchid */
        mchid?: (string|null);

        /** ListPayBillsRequest tradeState */
        tradeState?: (string|null);

        /** ListPayBillsRequest pageNum */
        pageNum?: (number|null);

        /** ListPayBillsRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents a ListPayBillsRequest. */
    class ListPayBillsRequest implements IListPayBillsRequest {

        /**
         * Constructs a new ListPayBillsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListPayBillsRequest);

        /** ListPayBillsRequest appid. */
        public appid: string;

        /** ListPayBillsRequest mchid. */
        public mchid: string;

        /** ListPayBillsRequest tradeState. */
        public tradeState: string;

        /** ListPayBillsRequest pageNum. */
        public pageNum: number;

        /** ListPayBillsRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new ListPayBillsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPayBillsRequest instance
         */
        public static create(properties?: pb.IListPayBillsRequest): pb.ListPayBillsRequest;

        /**
         * Encodes the specified ListPayBillsRequest message. Does not implicitly {@link pb.ListPayBillsRequest.verify|verify} messages.
         * @param message ListPayBillsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListPayBillsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPayBillsRequest message, length delimited. Does not implicitly {@link pb.ListPayBillsRequest.verify|verify} messages.
         * @param message ListPayBillsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListPayBillsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPayBillsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPayBillsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListPayBillsRequest;

        /**
         * Decodes a ListPayBillsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPayBillsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListPayBillsRequest;

        /**
         * Verifies a ListPayBillsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPayBillsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPayBillsRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.ListPayBillsRequest;

        /**
         * Creates a plain object from a ListPayBillsRequest message. Also converts values to other types if specified.
         * @param message ListPayBillsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListPayBillsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPayBillsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListPayBillsRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListPayBillsResponse. */
    interface IListPayBillsResponse {

        /** ListPayBillsResponse code */
        code?: (number|null);

        /** ListPayBillsResponse msg */
        msg?: (string|null);

        /** ListPayBillsResponse total */
        total?: (number|Long|null);

        /** ListPayBillsResponse data */
        data?: (pb.IPayBillInfo[]|null);
    }

    /** Represents a ListPayBillsResponse. */
    class ListPayBillsResponse implements IListPayBillsResponse {

        /**
         * Constructs a new ListPayBillsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListPayBillsResponse);

        /** ListPayBillsResponse code. */
        public code: number;

        /** ListPayBillsResponse msg. */
        public msg: string;

        /** ListPayBillsResponse total. */
        public total: (number|Long);

        /** ListPayBillsResponse data. */
        public data: pb.IPayBillInfo[];

        /**
         * Creates a new ListPayBillsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPayBillsResponse instance
         */
        public static create(properties?: pb.IListPayBillsResponse): pb.ListPayBillsResponse;

        /**
         * Encodes the specified ListPayBillsResponse message. Does not implicitly {@link pb.ListPayBillsResponse.verify|verify} messages.
         * @param message ListPayBillsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListPayBillsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPayBillsResponse message, length delimited. Does not implicitly {@link pb.ListPayBillsResponse.verify|verify} messages.
         * @param message ListPayBillsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListPayBillsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPayBillsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPayBillsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListPayBillsResponse;

        /**
         * Decodes a ListPayBillsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPayBillsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListPayBillsResponse;

        /**
         * Verifies a ListPayBillsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPayBillsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPayBillsResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.ListPayBillsResponse;

        /**
         * Creates a plain object from a ListPayBillsResponse message. Also converts values to other types if specified.
         * @param message ListPayBillsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListPayBillsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPayBillsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListPayBillsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayOrderByTradeNoRequest. */
    interface IGetPayOrderByTradeNoRequest {

        /** GetPayOrderByTradeNoRequest outTradeNo */
        outTradeNo?: (string|null);
    }

    /** Represents a GetPayOrderByTradeNoRequest. */
    class GetPayOrderByTradeNoRequest implements IGetPayOrderByTradeNoRequest {

        /**
         * Constructs a new GetPayOrderByTradeNoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayOrderByTradeNoRequest);

        /** GetPayOrderByTradeNoRequest outTradeNo. */
        public outTradeNo: string;

        /**
         * Creates a new GetPayOrderByTradeNoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayOrderByTradeNoRequest instance
         */
        public static create(properties?: pb.IGetPayOrderByTradeNoRequest): pb.GetPayOrderByTradeNoRequest;

        /**
         * Encodes the specified GetPayOrderByTradeNoRequest message. Does not implicitly {@link pb.GetPayOrderByTradeNoRequest.verify|verify} messages.
         * @param message GetPayOrderByTradeNoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayOrderByTradeNoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayOrderByTradeNoRequest message, length delimited. Does not implicitly {@link pb.GetPayOrderByTradeNoRequest.verify|verify} messages.
         * @param message GetPayOrderByTradeNoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayOrderByTradeNoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayOrderByTradeNoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayOrderByTradeNoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayOrderByTradeNoRequest;

        /**
         * Decodes a GetPayOrderByTradeNoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayOrderByTradeNoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayOrderByTradeNoRequest;

        /**
         * Verifies a GetPayOrderByTradeNoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayOrderByTradeNoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayOrderByTradeNoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayOrderByTradeNoRequest;

        /**
         * Creates a plain object from a GetPayOrderByTradeNoRequest message. Also converts values to other types if specified.
         * @param message GetPayOrderByTradeNoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayOrderByTradeNoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayOrderByTradeNoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayOrderByTradeNoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PayOrderInfo. */
    interface IPayOrderInfo {

        /** PayOrderInfo outTradeNo */
        outTradeNo?: (string|null);

        /** PayOrderInfo pkgId */
        pkgId?: (number|null);

        /** PayOrderInfo account */
        account?: (string|null);

        /** PayOrderInfo dappid */
        dappid?: (string|null);

        /** PayOrderInfo mchid */
        mchid?: (string|null);

        /** PayOrderInfo appid */
        appid?: (string|null);

        /** PayOrderInfo total */
        total?: (number|null);

        /** PayOrderInfo payStatus */
        payStatus?: (number|null);

        /** PayOrderInfo recommender */
        recommender?: (string|null);

        /** PayOrderInfo createTime */
        createTime?: (string|null);

        /** PayOrderInfo themeAppid */
        themeAppid?: (string|null);

        /** PayOrderInfo serviceAppid */
        serviceAppid?: (string|null);

        /** PayOrderInfo reqText */
        reqText?: (string|null);
    }

    /** Represents a PayOrderInfo. */
    class PayOrderInfo implements IPayOrderInfo {

        /**
         * Constructs a new PayOrderInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IPayOrderInfo);

        /** PayOrderInfo outTradeNo. */
        public outTradeNo: string;

        /** PayOrderInfo pkgId. */
        public pkgId: number;

        /** PayOrderInfo account. */
        public account: string;

        /** PayOrderInfo dappid. */
        public dappid: string;

        /** PayOrderInfo mchid. */
        public mchid: string;

        /** PayOrderInfo appid. */
        public appid: string;

        /** PayOrderInfo total. */
        public total: number;

        /** PayOrderInfo payStatus. */
        public payStatus: number;

        /** PayOrderInfo recommender. */
        public recommender: string;

        /** PayOrderInfo createTime. */
        public createTime: string;

        /** PayOrderInfo themeAppid. */
        public themeAppid: string;

        /** PayOrderInfo serviceAppid. */
        public serviceAppid: string;

        /** PayOrderInfo reqText. */
        public reqText: string;

        /**
         * Creates a new PayOrderInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PayOrderInfo instance
         */
        public static create(properties?: pb.IPayOrderInfo): pb.PayOrderInfo;

        /**
         * Encodes the specified PayOrderInfo message. Does not implicitly {@link pb.PayOrderInfo.verify|verify} messages.
         * @param message PayOrderInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IPayOrderInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PayOrderInfo message, length delimited. Does not implicitly {@link pb.PayOrderInfo.verify|verify} messages.
         * @param message PayOrderInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IPayOrderInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PayOrderInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PayOrderInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.PayOrderInfo;

        /**
         * Decodes a PayOrderInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PayOrderInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.PayOrderInfo;

        /**
         * Verifies a PayOrderInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PayOrderInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PayOrderInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.PayOrderInfo;

        /**
         * Creates a plain object from a PayOrderInfo message. Also converts values to other types if specified.
         * @param message PayOrderInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.PayOrderInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PayOrderInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PayOrderInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayOrderResponse. */
    interface IGetPayOrderResponse {

        /** GetPayOrderResponse code */
        code?: (number|null);

        /** GetPayOrderResponse msg */
        msg?: (string|null);

        /** GetPayOrderResponse data */
        data?: (pb.IPayOrderInfo|null);
    }

    /** Represents a GetPayOrderResponse. */
    class GetPayOrderResponse implements IGetPayOrderResponse {

        /**
         * Constructs a new GetPayOrderResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayOrderResponse);

        /** GetPayOrderResponse code. */
        public code: number;

        /** GetPayOrderResponse msg. */
        public msg: string;

        /** GetPayOrderResponse data. */
        public data?: (pb.IPayOrderInfo|null);

        /**
         * Creates a new GetPayOrderResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayOrderResponse instance
         */
        public static create(properties?: pb.IGetPayOrderResponse): pb.GetPayOrderResponse;

        /**
         * Encodes the specified GetPayOrderResponse message. Does not implicitly {@link pb.GetPayOrderResponse.verify|verify} messages.
         * @param message GetPayOrderResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayOrderResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayOrderResponse message, length delimited. Does not implicitly {@link pb.GetPayOrderResponse.verify|verify} messages.
         * @param message GetPayOrderResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayOrderResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayOrderResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayOrderResponse;

        /**
         * Decodes a GetPayOrderResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayOrderResponse;

        /**
         * Verifies a GetPayOrderResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayOrderResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayOrderResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayOrderResponse;

        /**
         * Creates a plain object from a GetPayOrderResponse message. Also converts values to other types if specified.
         * @param message GetPayOrderResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayOrderResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayOrderResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayOrderResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayOrdersByAccountRequest. */
    interface IGetPayOrdersByAccountRequest {

        /** GetPayOrdersByAccountRequest account */
        account?: (string|null);

        /** GetPayOrdersByAccountRequest pageNum */
        pageNum?: (number|null);

        /** GetPayOrdersByAccountRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents a GetPayOrdersByAccountRequest. */
    class GetPayOrdersByAccountRequest implements IGetPayOrdersByAccountRequest {

        /**
         * Constructs a new GetPayOrdersByAccountRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayOrdersByAccountRequest);

        /** GetPayOrdersByAccountRequest account. */
        public account: string;

        /** GetPayOrdersByAccountRequest pageNum. */
        public pageNum: number;

        /** GetPayOrdersByAccountRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new GetPayOrdersByAccountRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayOrdersByAccountRequest instance
         */
        public static create(properties?: pb.IGetPayOrdersByAccountRequest): pb.GetPayOrdersByAccountRequest;

        /**
         * Encodes the specified GetPayOrdersByAccountRequest message. Does not implicitly {@link pb.GetPayOrdersByAccountRequest.verify|verify} messages.
         * @param message GetPayOrdersByAccountRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayOrdersByAccountRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayOrdersByAccountRequest message, length delimited. Does not implicitly {@link pb.GetPayOrdersByAccountRequest.verify|verify} messages.
         * @param message GetPayOrdersByAccountRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayOrdersByAccountRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayOrdersByAccountRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayOrdersByAccountRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayOrdersByAccountRequest;

        /**
         * Decodes a GetPayOrdersByAccountRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayOrdersByAccountRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayOrdersByAccountRequest;

        /**
         * Verifies a GetPayOrdersByAccountRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayOrdersByAccountRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayOrdersByAccountRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayOrdersByAccountRequest;

        /**
         * Creates a plain object from a GetPayOrdersByAccountRequest message. Also converts values to other types if specified.
         * @param message GetPayOrdersByAccountRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayOrdersByAccountRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayOrdersByAccountRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayOrdersByAccountRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GetPayOrdersByDappidRequest. */
    interface IGetPayOrdersByDappidRequest {

        /** GetPayOrdersByDappidRequest dappid */
        dappid?: (string|null);

        /** GetPayOrdersByDappidRequest pageNum */
        pageNum?: (number|null);

        /** GetPayOrdersByDappidRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents a GetPayOrdersByDappidRequest. */
    class GetPayOrdersByDappidRequest implements IGetPayOrdersByDappidRequest {

        /**
         * Constructs a new GetPayOrdersByDappidRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IGetPayOrdersByDappidRequest);

        /** GetPayOrdersByDappidRequest dappid. */
        public dappid: string;

        /** GetPayOrdersByDappidRequest pageNum. */
        public pageNum: number;

        /** GetPayOrdersByDappidRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new GetPayOrdersByDappidRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GetPayOrdersByDappidRequest instance
         */
        public static create(properties?: pb.IGetPayOrdersByDappidRequest): pb.GetPayOrdersByDappidRequest;

        /**
         * Encodes the specified GetPayOrdersByDappidRequest message. Does not implicitly {@link pb.GetPayOrdersByDappidRequest.verify|verify} messages.
         * @param message GetPayOrdersByDappidRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IGetPayOrdersByDappidRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GetPayOrdersByDappidRequest message, length delimited. Does not implicitly {@link pb.GetPayOrdersByDappidRequest.verify|verify} messages.
         * @param message GetPayOrdersByDappidRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IGetPayOrdersByDappidRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GetPayOrdersByDappidRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GetPayOrdersByDappidRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.GetPayOrdersByDappidRequest;

        /**
         * Decodes a GetPayOrdersByDappidRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GetPayOrdersByDappidRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.GetPayOrdersByDappidRequest;

        /**
         * Verifies a GetPayOrdersByDappidRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GetPayOrdersByDappidRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GetPayOrdersByDappidRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.GetPayOrdersByDappidRequest;

        /**
         * Creates a plain object from a GetPayOrdersByDappidRequest message. Also converts values to other types if specified.
         * @param message GetPayOrdersByDappidRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.GetPayOrdersByDappidRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GetPayOrdersByDappidRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GetPayOrdersByDappidRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListPayOrdersRequest. */
    interface IListPayOrdersRequest {

        /** ListPayOrdersRequest account */
        account?: (string|null);

        /** ListPayOrdersRequest pageNum */
        pageNum?: (number|null);

        /** ListPayOrdersRequest pageSize */
        pageSize?: (number|null);

        /** ListPayOrdersRequest dappid */
        dappid?: (string|null);

        /** ListPayOrdersRequest payStatus */
        payStatus?: (number|null);
    }

    /** Represents a ListPayOrdersRequest. */
    class ListPayOrdersRequest implements IListPayOrdersRequest {

        /**
         * Constructs a new ListPayOrdersRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListPayOrdersRequest);

        /** ListPayOrdersRequest account. */
        public account: string;

        /** ListPayOrdersRequest pageNum. */
        public pageNum: number;

        /** ListPayOrdersRequest pageSize. */
        public pageSize: number;

        /** ListPayOrdersRequest dappid. */
        public dappid: string;

        /** ListPayOrdersRequest payStatus. */
        public payStatus: number;

        /**
         * Creates a new ListPayOrdersRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPayOrdersRequest instance
         */
        public static create(properties?: pb.IListPayOrdersRequest): pb.ListPayOrdersRequest;

        /**
         * Encodes the specified ListPayOrdersRequest message. Does not implicitly {@link pb.ListPayOrdersRequest.verify|verify} messages.
         * @param message ListPayOrdersRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListPayOrdersRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPayOrdersRequest message, length delimited. Does not implicitly {@link pb.ListPayOrdersRequest.verify|verify} messages.
         * @param message ListPayOrdersRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListPayOrdersRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPayOrdersRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPayOrdersRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListPayOrdersRequest;

        /**
         * Decodes a ListPayOrdersRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPayOrdersRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListPayOrdersRequest;

        /**
         * Verifies a ListPayOrdersRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPayOrdersRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPayOrdersRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.ListPayOrdersRequest;

        /**
         * Creates a plain object from a ListPayOrdersRequest message. Also converts values to other types if specified.
         * @param message ListPayOrdersRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListPayOrdersRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPayOrdersRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListPayOrdersRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ListPayOrdersResponse. */
    interface IListPayOrdersResponse {

        /** ListPayOrdersResponse code */
        code?: (number|null);

        /** ListPayOrdersResponse msg */
        msg?: (string|null);

        /** ListPayOrdersResponse total */
        total?: (number|Long|null);

        /** ListPayOrdersResponse data */
        data?: (pb.IPayOrderInfo[]|null);
    }

    /** Represents a ListPayOrdersResponse. */
    class ListPayOrdersResponse implements IListPayOrdersResponse {

        /**
         * Constructs a new ListPayOrdersResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IListPayOrdersResponse);

        /** ListPayOrdersResponse code. */
        public code: number;

        /** ListPayOrdersResponse msg. */
        public msg: string;

        /** ListPayOrdersResponse total. */
        public total: (number|Long);

        /** ListPayOrdersResponse data. */
        public data: pb.IPayOrderInfo[];

        /**
         * Creates a new ListPayOrdersResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ListPayOrdersResponse instance
         */
        public static create(properties?: pb.IListPayOrdersResponse): pb.ListPayOrdersResponse;

        /**
         * Encodes the specified ListPayOrdersResponse message. Does not implicitly {@link pb.ListPayOrdersResponse.verify|verify} messages.
         * @param message ListPayOrdersResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IListPayOrdersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ListPayOrdersResponse message, length delimited. Does not implicitly {@link pb.ListPayOrdersResponse.verify|verify} messages.
         * @param message ListPayOrdersResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IListPayOrdersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ListPayOrdersResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ListPayOrdersResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.ListPayOrdersResponse;

        /**
         * Decodes a ListPayOrdersResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ListPayOrdersResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.ListPayOrdersResponse;

        /**
         * Verifies a ListPayOrdersResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ListPayOrdersResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ListPayOrdersResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.ListPayOrdersResponse;

        /**
         * Creates a plain object from a ListPayOrdersResponse message. Also converts values to other types if specified.
         * @param message ListPayOrdersResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.ListPayOrdersResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ListPayOrdersResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ListPayOrdersResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListWithdrawalsRequest. */
    interface IAdminListWithdrawalsRequest {

        /** AdminListWithdrawalsRequest pubkey */
        pubkey?: (string|null);

        /** AdminListWithdrawalsRequest status */
        status?: (number|null);

        /** AdminListWithdrawalsRequest pageNum */
        pageNum?: (number|null);

        /** AdminListWithdrawalsRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents an AdminListWithdrawalsRequest. */
    class AdminListWithdrawalsRequest implements IAdminListWithdrawalsRequest {

        /**
         * Constructs a new AdminListWithdrawalsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListWithdrawalsRequest);

        /** AdminListWithdrawalsRequest pubkey. */
        public pubkey: string;

        /** AdminListWithdrawalsRequest status. */
        public status: number;

        /** AdminListWithdrawalsRequest pageNum. */
        public pageNum: number;

        /** AdminListWithdrawalsRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new AdminListWithdrawalsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListWithdrawalsRequest instance
         */
        public static create(properties?: pb.IAdminListWithdrawalsRequest): pb.AdminListWithdrawalsRequest;

        /**
         * Encodes the specified AdminListWithdrawalsRequest message. Does not implicitly {@link pb.AdminListWithdrawalsRequest.verify|verify} messages.
         * @param message AdminListWithdrawalsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListWithdrawalsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListWithdrawalsRequest message, length delimited. Does not implicitly {@link pb.AdminListWithdrawalsRequest.verify|verify} messages.
         * @param message AdminListWithdrawalsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListWithdrawalsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListWithdrawalsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListWithdrawalsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListWithdrawalsRequest;

        /**
         * Decodes an AdminListWithdrawalsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListWithdrawalsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListWithdrawalsRequest;

        /**
         * Verifies an AdminListWithdrawalsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListWithdrawalsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListWithdrawalsRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListWithdrawalsRequest;

        /**
         * Creates a plain object from an AdminListWithdrawalsRequest message. Also converts values to other types if specified.
         * @param message AdminListWithdrawalsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListWithdrawalsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListWithdrawalsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListWithdrawalsRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListWithdrawalsResponse. */
    interface IAdminListWithdrawalsResponse {

        /** AdminListWithdrawalsResponse code */
        code?: (number|null);

        /** AdminListWithdrawalsResponse msg */
        msg?: (string|null);

        /** AdminListWithdrawalsResponse total */
        total?: (number|Long|null);

        /** AdminListWithdrawalsResponse data */
        data?: (pb.IWithdrawalApplicationInfo[]|null);
    }

    /** Represents an AdminListWithdrawalsResponse. */
    class AdminListWithdrawalsResponse implements IAdminListWithdrawalsResponse {

        /**
         * Constructs a new AdminListWithdrawalsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListWithdrawalsResponse);

        /** AdminListWithdrawalsResponse code. */
        public code: number;

        /** AdminListWithdrawalsResponse msg. */
        public msg: string;

        /** AdminListWithdrawalsResponse total. */
        public total: (number|Long);

        /** AdminListWithdrawalsResponse data. */
        public data: pb.IWithdrawalApplicationInfo[];

        /**
         * Creates a new AdminListWithdrawalsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListWithdrawalsResponse instance
         */
        public static create(properties?: pb.IAdminListWithdrawalsResponse): pb.AdminListWithdrawalsResponse;

        /**
         * Encodes the specified AdminListWithdrawalsResponse message. Does not implicitly {@link pb.AdminListWithdrawalsResponse.verify|verify} messages.
         * @param message AdminListWithdrawalsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListWithdrawalsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListWithdrawalsResponse message, length delimited. Does not implicitly {@link pb.AdminListWithdrawalsResponse.verify|verify} messages.
         * @param message AdminListWithdrawalsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListWithdrawalsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListWithdrawalsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListWithdrawalsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListWithdrawalsResponse;

        /**
         * Decodes an AdminListWithdrawalsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListWithdrawalsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListWithdrawalsResponse;

        /**
         * Verifies an AdminListWithdrawalsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListWithdrawalsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListWithdrawalsResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListWithdrawalsResponse;

        /**
         * Creates a plain object from an AdminListWithdrawalsResponse message. Also converts values to other types if specified.
         * @param message AdminListWithdrawalsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListWithdrawalsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListWithdrawalsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListWithdrawalsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminAuditWithdrawalRequest. */
    interface IAdminAuditWithdrawalRequest {

        /** AdminAuditWithdrawalRequest id */
        id?: (number|Long|null);

        /** AdminAuditWithdrawalRequest action */
        action?: (string|null);

        /** AdminAuditWithdrawalRequest rejectReason */
        rejectReason?: (string|null);

        /** AdminAuditWithdrawalRequest adminNote */
        adminNote?: (string|null);

        /** AdminAuditWithdrawalRequest transferNo */
        transferNo?: (string|null);
    }

    /** Represents an AdminAuditWithdrawalRequest. */
    class AdminAuditWithdrawalRequest implements IAdminAuditWithdrawalRequest {

        /**
         * Constructs a new AdminAuditWithdrawalRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminAuditWithdrawalRequest);

        /** AdminAuditWithdrawalRequest id. */
        public id: (number|Long);

        /** AdminAuditWithdrawalRequest action. */
        public action: string;

        /** AdminAuditWithdrawalRequest rejectReason. */
        public rejectReason: string;

        /** AdminAuditWithdrawalRequest adminNote. */
        public adminNote: string;

        /** AdminAuditWithdrawalRequest transferNo. */
        public transferNo: string;

        /**
         * Creates a new AdminAuditWithdrawalRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminAuditWithdrawalRequest instance
         */
        public static create(properties?: pb.IAdminAuditWithdrawalRequest): pb.AdminAuditWithdrawalRequest;

        /**
         * Encodes the specified AdminAuditWithdrawalRequest message. Does not implicitly {@link pb.AdminAuditWithdrawalRequest.verify|verify} messages.
         * @param message AdminAuditWithdrawalRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminAuditWithdrawalRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminAuditWithdrawalRequest message, length delimited. Does not implicitly {@link pb.AdminAuditWithdrawalRequest.verify|verify} messages.
         * @param message AdminAuditWithdrawalRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminAuditWithdrawalRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminAuditWithdrawalRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminAuditWithdrawalRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminAuditWithdrawalRequest;

        /**
         * Decodes an AdminAuditWithdrawalRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminAuditWithdrawalRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminAuditWithdrawalRequest;

        /**
         * Verifies an AdminAuditWithdrawalRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminAuditWithdrawalRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminAuditWithdrawalRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminAuditWithdrawalRequest;

        /**
         * Creates a plain object from an AdminAuditWithdrawalRequest message. Also converts values to other types if specified.
         * @param message AdminAuditWithdrawalRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminAuditWithdrawalRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminAuditWithdrawalRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminAuditWithdrawalRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminAuditWithdrawalResponse. */
    interface IAdminAuditWithdrawalResponse {

        /** AdminAuditWithdrawalResponse code */
        code?: (number|null);

        /** AdminAuditWithdrawalResponse msg */
        msg?: (string|null);
    }

    /** Represents an AdminAuditWithdrawalResponse. */
    class AdminAuditWithdrawalResponse implements IAdminAuditWithdrawalResponse {

        /**
         * Constructs a new AdminAuditWithdrawalResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminAuditWithdrawalResponse);

        /** AdminAuditWithdrawalResponse code. */
        public code: number;

        /** AdminAuditWithdrawalResponse msg. */
        public msg: string;

        /**
         * Creates a new AdminAuditWithdrawalResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminAuditWithdrawalResponse instance
         */
        public static create(properties?: pb.IAdminAuditWithdrawalResponse): pb.AdminAuditWithdrawalResponse;

        /**
         * Encodes the specified AdminAuditWithdrawalResponse message. Does not implicitly {@link pb.AdminAuditWithdrawalResponse.verify|verify} messages.
         * @param message AdminAuditWithdrawalResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminAuditWithdrawalResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminAuditWithdrawalResponse message, length delimited. Does not implicitly {@link pb.AdminAuditWithdrawalResponse.verify|verify} messages.
         * @param message AdminAuditWithdrawalResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminAuditWithdrawalResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminAuditWithdrawalResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminAuditWithdrawalResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminAuditWithdrawalResponse;

        /**
         * Decodes an AdminAuditWithdrawalResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminAuditWithdrawalResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminAuditWithdrawalResponse;

        /**
         * Verifies an AdminAuditWithdrawalResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminAuditWithdrawalResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminAuditWithdrawalResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminAuditWithdrawalResponse;

        /**
         * Creates a plain object from an AdminAuditWithdrawalResponse message. Also converts values to other types if specified.
         * @param message AdminAuditWithdrawalResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminAuditWithdrawalResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminAuditWithdrawalResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminAuditWithdrawalResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListEarningsRequest. */
    interface IAdminListEarningsRequest {

        /** AdminListEarningsRequest pubkey */
        pubkey?: (string|null);

        /** AdminListEarningsRequest serviceAppid */
        serviceAppid?: (string|null);

        /** AdminListEarningsRequest theme */
        theme?: (string|null);

        /** AdminListEarningsRequest recordType */
        recordType?: (number|null);

        /** AdminListEarningsRequest pageNum */
        pageNum?: (number|null);

        /** AdminListEarningsRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents an AdminListEarningsRequest. */
    class AdminListEarningsRequest implements IAdminListEarningsRequest {

        /**
         * Constructs a new AdminListEarningsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListEarningsRequest);

        /** AdminListEarningsRequest pubkey. */
        public pubkey: string;

        /** AdminListEarningsRequest serviceAppid. */
        public serviceAppid: string;

        /** AdminListEarningsRequest theme. */
        public theme: string;

        /** AdminListEarningsRequest recordType. */
        public recordType: number;

        /** AdminListEarningsRequest pageNum. */
        public pageNum: number;

        /** AdminListEarningsRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new AdminListEarningsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListEarningsRequest instance
         */
        public static create(properties?: pb.IAdminListEarningsRequest): pb.AdminListEarningsRequest;

        /**
         * Encodes the specified AdminListEarningsRequest message. Does not implicitly {@link pb.AdminListEarningsRequest.verify|verify} messages.
         * @param message AdminListEarningsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListEarningsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListEarningsRequest message, length delimited. Does not implicitly {@link pb.AdminListEarningsRequest.verify|verify} messages.
         * @param message AdminListEarningsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListEarningsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListEarningsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListEarningsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListEarningsRequest;

        /**
         * Decodes an AdminListEarningsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListEarningsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListEarningsRequest;

        /**
         * Verifies an AdminListEarningsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListEarningsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListEarningsRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListEarningsRequest;

        /**
         * Creates a plain object from an AdminListEarningsRequest message. Also converts values to other types if specified.
         * @param message AdminListEarningsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListEarningsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListEarningsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListEarningsRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListEarningsResponse. */
    interface IAdminListEarningsResponse {

        /** AdminListEarningsResponse code */
        code?: (number|null);

        /** AdminListEarningsResponse msg */
        msg?: (string|null);

        /** AdminListEarningsResponse total */
        total?: (number|Long|null);

        /** AdminListEarningsResponse data */
        data?: (pb.IEarningsRecordInfo[]|null);
    }

    /** Represents an AdminListEarningsResponse. */
    class AdminListEarningsResponse implements IAdminListEarningsResponse {

        /**
         * Constructs a new AdminListEarningsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListEarningsResponse);

        /** AdminListEarningsResponse code. */
        public code: number;

        /** AdminListEarningsResponse msg. */
        public msg: string;

        /** AdminListEarningsResponse total. */
        public total: (number|Long);

        /** AdminListEarningsResponse data. */
        public data: pb.IEarningsRecordInfo[];

        /**
         * Creates a new AdminListEarningsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListEarningsResponse instance
         */
        public static create(properties?: pb.IAdminListEarningsResponse): pb.AdminListEarningsResponse;

        /**
         * Encodes the specified AdminListEarningsResponse message. Does not implicitly {@link pb.AdminListEarningsResponse.verify|verify} messages.
         * @param message AdminListEarningsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListEarningsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListEarningsResponse message, length delimited. Does not implicitly {@link pb.AdminListEarningsResponse.verify|verify} messages.
         * @param message AdminListEarningsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListEarningsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListEarningsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListEarningsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListEarningsResponse;

        /**
         * Decodes an AdminListEarningsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListEarningsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListEarningsResponse;

        /**
         * Verifies an AdminListEarningsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListEarningsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListEarningsResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListEarningsResponse;

        /**
         * Creates a plain object from an AdminListEarningsResponse message. Also converts values to other types if specified.
         * @param message AdminListEarningsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListEarningsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListEarningsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListEarningsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminGetStatsRequest. */
    interface IAdminGetStatsRequest {

        /** AdminGetStatsRequest fromDate */
        fromDate?: (string|null);

        /** AdminGetStatsRequest toDate */
        toDate?: (string|null);
    }

    /** Represents an AdminGetStatsRequest. */
    class AdminGetStatsRequest implements IAdminGetStatsRequest {

        /**
         * Constructs a new AdminGetStatsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminGetStatsRequest);

        /** AdminGetStatsRequest fromDate. */
        public fromDate: string;

        /** AdminGetStatsRequest toDate. */
        public toDate: string;

        /**
         * Creates a new AdminGetStatsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminGetStatsRequest instance
         */
        public static create(properties?: pb.IAdminGetStatsRequest): pb.AdminGetStatsRequest;

        /**
         * Encodes the specified AdminGetStatsRequest message. Does not implicitly {@link pb.AdminGetStatsRequest.verify|verify} messages.
         * @param message AdminGetStatsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminGetStatsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminGetStatsRequest message, length delimited. Does not implicitly {@link pb.AdminGetStatsRequest.verify|verify} messages.
         * @param message AdminGetStatsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminGetStatsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminGetStatsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminGetStatsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminGetStatsRequest;

        /**
         * Decodes an AdminGetStatsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminGetStatsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminGetStatsRequest;

        /**
         * Verifies an AdminGetStatsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminGetStatsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminGetStatsRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminGetStatsRequest;

        /**
         * Creates a plain object from an AdminGetStatsRequest message. Also converts values to other types if specified.
         * @param message AdminGetStatsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminGetStatsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminGetStatsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminGetStatsRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminStatsData. */
    interface IAdminStatsData {

        /** AdminStatsData totalEarnings */
        totalEarnings?: (number|Long|null);

        /** AdminStatsData totalPaidAmount */
        totalPaidAmount?: (number|Long|null);

        /** AdminStatsData pendingAmount */
        pendingAmount?: (number|Long|null);

        /** AdminStatsData totalApplications */
        totalApplications?: (number|null);

        /** AdminStatsData pendingCount */
        pendingCount?: (number|null);

        /** AdminStatsData approvedCount */
        approvedCount?: (number|null);

        /** AdminStatsData paidCount */
        paidCount?: (number|null);

        /** AdminStatsData rejectedCount */
        rejectedCount?: (number|null);

        /** AdminStatsData rangeEarnings */
        rangeEarnings?: (number|Long|null);

        /** AdminStatsData rangeFrom */
        rangeFrom?: (string|null);

        /** AdminStatsData rangeTo */
        rangeTo?: (string|null);
    }

    /** Represents an AdminStatsData. */
    class AdminStatsData implements IAdminStatsData {

        /**
         * Constructs a new AdminStatsData.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminStatsData);

        /** AdminStatsData totalEarnings. */
        public totalEarnings: (number|Long);

        /** AdminStatsData totalPaidAmount. */
        public totalPaidAmount: (number|Long);

        /** AdminStatsData pendingAmount. */
        public pendingAmount: (number|Long);

        /** AdminStatsData totalApplications. */
        public totalApplications: number;

        /** AdminStatsData pendingCount. */
        public pendingCount: number;

        /** AdminStatsData approvedCount. */
        public approvedCount: number;

        /** AdminStatsData paidCount. */
        public paidCount: number;

        /** AdminStatsData rejectedCount. */
        public rejectedCount: number;

        /** AdminStatsData rangeEarnings. */
        public rangeEarnings: (number|Long);

        /** AdminStatsData rangeFrom. */
        public rangeFrom: string;

        /** AdminStatsData rangeTo. */
        public rangeTo: string;

        /**
         * Creates a new AdminStatsData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminStatsData instance
         */
        public static create(properties?: pb.IAdminStatsData): pb.AdminStatsData;

        /**
         * Encodes the specified AdminStatsData message. Does not implicitly {@link pb.AdminStatsData.verify|verify} messages.
         * @param message AdminStatsData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminStatsData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminStatsData message, length delimited. Does not implicitly {@link pb.AdminStatsData.verify|verify} messages.
         * @param message AdminStatsData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminStatsData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminStatsData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminStatsData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminStatsData;

        /**
         * Decodes an AdminStatsData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminStatsData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminStatsData;

        /**
         * Verifies an AdminStatsData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminStatsData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminStatsData
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminStatsData;

        /**
         * Creates a plain object from an AdminStatsData message. Also converts values to other types if specified.
         * @param message AdminStatsData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminStatsData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminStatsData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminStatsData
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminGetStatsResponse. */
    interface IAdminGetStatsResponse {

        /** AdminGetStatsResponse code */
        code?: (number|null);

        /** AdminGetStatsResponse msg */
        msg?: (string|null);

        /** AdminGetStatsResponse data */
        data?: (pb.IAdminStatsData|null);
    }

    /** Represents an AdminGetStatsResponse. */
    class AdminGetStatsResponse implements IAdminGetStatsResponse {

        /**
         * Constructs a new AdminGetStatsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminGetStatsResponse);

        /** AdminGetStatsResponse code. */
        public code: number;

        /** AdminGetStatsResponse msg. */
        public msg: string;

        /** AdminGetStatsResponse data. */
        public data?: (pb.IAdminStatsData|null);

        /**
         * Creates a new AdminGetStatsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminGetStatsResponse instance
         */
        public static create(properties?: pb.IAdminGetStatsResponse): pb.AdminGetStatsResponse;

        /**
         * Encodes the specified AdminGetStatsResponse message. Does not implicitly {@link pb.AdminGetStatsResponse.verify|verify} messages.
         * @param message AdminGetStatsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminGetStatsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminGetStatsResponse message, length delimited. Does not implicitly {@link pb.AdminGetStatsResponse.verify|verify} messages.
         * @param message AdminGetStatsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminGetStatsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminGetStatsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminGetStatsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminGetStatsResponse;

        /**
         * Decodes an AdminGetStatsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminGetStatsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminGetStatsResponse;

        /**
         * Verifies an AdminGetStatsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminGetStatsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminGetStatsResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminGetStatsResponse;

        /**
         * Creates a plain object from an AdminGetStatsResponse message. Also converts values to other types if specified.
         * @param message AdminGetStatsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminGetStatsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminGetStatsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminGetStatsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListPayeeInfoRequest. */
    interface IAdminListPayeeInfoRequest {

        /** AdminListPayeeInfoRequest pageNum */
        pageNum?: (number|null);

        /** AdminListPayeeInfoRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents an AdminListPayeeInfoRequest. */
    class AdminListPayeeInfoRequest implements IAdminListPayeeInfoRequest {

        /**
         * Constructs a new AdminListPayeeInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListPayeeInfoRequest);

        /** AdminListPayeeInfoRequest pageNum. */
        public pageNum: number;

        /** AdminListPayeeInfoRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new AdminListPayeeInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListPayeeInfoRequest instance
         */
        public static create(properties?: pb.IAdminListPayeeInfoRequest): pb.AdminListPayeeInfoRequest;

        /**
         * Encodes the specified AdminListPayeeInfoRequest message. Does not implicitly {@link pb.AdminListPayeeInfoRequest.verify|verify} messages.
         * @param message AdminListPayeeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListPayeeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListPayeeInfoRequest message, length delimited. Does not implicitly {@link pb.AdminListPayeeInfoRequest.verify|verify} messages.
         * @param message AdminListPayeeInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListPayeeInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListPayeeInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListPayeeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListPayeeInfoRequest;

        /**
         * Decodes an AdminListPayeeInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListPayeeInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListPayeeInfoRequest;

        /**
         * Verifies an AdminListPayeeInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListPayeeInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListPayeeInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListPayeeInfoRequest;

        /**
         * Creates a plain object from an AdminListPayeeInfoRequest message. Also converts values to other types if specified.
         * @param message AdminListPayeeInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListPayeeInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListPayeeInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListPayeeInfoRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListPayeeInfoResponse. */
    interface IAdminListPayeeInfoResponse {

        /** AdminListPayeeInfoResponse code */
        code?: (number|null);

        /** AdminListPayeeInfoResponse msg */
        msg?: (string|null);

        /** AdminListPayeeInfoResponse total */
        total?: (number|Long|null);

        /** AdminListPayeeInfoResponse data */
        data?: (pb.IPayeeInfoData[]|null);
    }

    /** Represents an AdminListPayeeInfoResponse. */
    class AdminListPayeeInfoResponse implements IAdminListPayeeInfoResponse {

        /**
         * Constructs a new AdminListPayeeInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListPayeeInfoResponse);

        /** AdminListPayeeInfoResponse code. */
        public code: number;

        /** AdminListPayeeInfoResponse msg. */
        public msg: string;

        /** AdminListPayeeInfoResponse total. */
        public total: (number|Long);

        /** AdminListPayeeInfoResponse data. */
        public data: pb.IPayeeInfoData[];

        /**
         * Creates a new AdminListPayeeInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListPayeeInfoResponse instance
         */
        public static create(properties?: pb.IAdminListPayeeInfoResponse): pb.AdminListPayeeInfoResponse;

        /**
         * Encodes the specified AdminListPayeeInfoResponse message. Does not implicitly {@link pb.AdminListPayeeInfoResponse.verify|verify} messages.
         * @param message AdminListPayeeInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListPayeeInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListPayeeInfoResponse message, length delimited. Does not implicitly {@link pb.AdminListPayeeInfoResponse.verify|verify} messages.
         * @param message AdminListPayeeInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListPayeeInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListPayeeInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListPayeeInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListPayeeInfoResponse;

        /**
         * Decodes an AdminListPayeeInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListPayeeInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListPayeeInfoResponse;

        /**
         * Verifies an AdminListPayeeInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListPayeeInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListPayeeInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListPayeeInfoResponse;

        /**
         * Creates a plain object from an AdminListPayeeInfoResponse message. Also converts values to other types if specified.
         * @param message AdminListPayeeInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListPayeeInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListPayeeInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListPayeeInfoResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RecommenderLevelInfo. */
    interface IRecommenderLevelInfo {

        /** RecommenderLevelInfo id */
        id?: (number|Long|null);

        /** RecommenderLevelInfo recommenderPubkey */
        recommenderPubkey?: (string|null);

        /** RecommenderLevelInfo level */
        level?: (number|null);

        /** RecommenderLevelInfo remark */
        remark?: (string|null);

        /** RecommenderLevelInfo createTime */
        createTime?: (string|null);

        /** RecommenderLevelInfo updateTime */
        updateTime?: (string|null);
    }

    /** Represents a RecommenderLevelInfo. */
    class RecommenderLevelInfo implements IRecommenderLevelInfo {

        /**
         * Constructs a new RecommenderLevelInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IRecommenderLevelInfo);

        /** RecommenderLevelInfo id. */
        public id: (number|Long);

        /** RecommenderLevelInfo recommenderPubkey. */
        public recommenderPubkey: string;

        /** RecommenderLevelInfo level. */
        public level: number;

        /** RecommenderLevelInfo remark. */
        public remark: string;

        /** RecommenderLevelInfo createTime. */
        public createTime: string;

        /** RecommenderLevelInfo updateTime. */
        public updateTime: string;

        /**
         * Creates a new RecommenderLevelInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RecommenderLevelInfo instance
         */
        public static create(properties?: pb.IRecommenderLevelInfo): pb.RecommenderLevelInfo;

        /**
         * Encodes the specified RecommenderLevelInfo message. Does not implicitly {@link pb.RecommenderLevelInfo.verify|verify} messages.
         * @param message RecommenderLevelInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IRecommenderLevelInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RecommenderLevelInfo message, length delimited. Does not implicitly {@link pb.RecommenderLevelInfo.verify|verify} messages.
         * @param message RecommenderLevelInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IRecommenderLevelInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RecommenderLevelInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RecommenderLevelInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.RecommenderLevelInfo;

        /**
         * Decodes a RecommenderLevelInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RecommenderLevelInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.RecommenderLevelInfo;

        /**
         * Verifies a RecommenderLevelInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RecommenderLevelInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RecommenderLevelInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.RecommenderLevelInfo;

        /**
         * Creates a plain object from a RecommenderLevelInfo message. Also converts values to other types if specified.
         * @param message RecommenderLevelInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.RecommenderLevelInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RecommenderLevelInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RecommenderLevelInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminUpsertRecommenderLevelRequest. */
    interface IAdminUpsertRecommenderLevelRequest {

        /** AdminUpsertRecommenderLevelRequest recommenderPubkey */
        recommenderPubkey?: (string|null);

        /** AdminUpsertRecommenderLevelRequest level */
        level?: (number|null);

        /** AdminUpsertRecommenderLevelRequest remark */
        remark?: (string|null);
    }

    /** Represents an AdminUpsertRecommenderLevelRequest. */
    class AdminUpsertRecommenderLevelRequest implements IAdminUpsertRecommenderLevelRequest {

        /**
         * Constructs a new AdminUpsertRecommenderLevelRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminUpsertRecommenderLevelRequest);

        /** AdminUpsertRecommenderLevelRequest recommenderPubkey. */
        public recommenderPubkey: string;

        /** AdminUpsertRecommenderLevelRequest level. */
        public level: number;

        /** AdminUpsertRecommenderLevelRequest remark. */
        public remark: string;

        /**
         * Creates a new AdminUpsertRecommenderLevelRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminUpsertRecommenderLevelRequest instance
         */
        public static create(properties?: pb.IAdminUpsertRecommenderLevelRequest): pb.AdminUpsertRecommenderLevelRequest;

        /**
         * Encodes the specified AdminUpsertRecommenderLevelRequest message. Does not implicitly {@link pb.AdminUpsertRecommenderLevelRequest.verify|verify} messages.
         * @param message AdminUpsertRecommenderLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminUpsertRecommenderLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminUpsertRecommenderLevelRequest message, length delimited. Does not implicitly {@link pb.AdminUpsertRecommenderLevelRequest.verify|verify} messages.
         * @param message AdminUpsertRecommenderLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminUpsertRecommenderLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminUpsertRecommenderLevelRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminUpsertRecommenderLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminUpsertRecommenderLevelRequest;

        /**
         * Decodes an AdminUpsertRecommenderLevelRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminUpsertRecommenderLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminUpsertRecommenderLevelRequest;

        /**
         * Verifies an AdminUpsertRecommenderLevelRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminUpsertRecommenderLevelRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminUpsertRecommenderLevelRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminUpsertRecommenderLevelRequest;

        /**
         * Creates a plain object from an AdminUpsertRecommenderLevelRequest message. Also converts values to other types if specified.
         * @param message AdminUpsertRecommenderLevelRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminUpsertRecommenderLevelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminUpsertRecommenderLevelRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminUpsertRecommenderLevelRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminUpsertRecommenderLevelResponse. */
    interface IAdminUpsertRecommenderLevelResponse {

        /** AdminUpsertRecommenderLevelResponse code */
        code?: (number|null);

        /** AdminUpsertRecommenderLevelResponse msg */
        msg?: (string|null);
    }

    /** Represents an AdminUpsertRecommenderLevelResponse. */
    class AdminUpsertRecommenderLevelResponse implements IAdminUpsertRecommenderLevelResponse {

        /**
         * Constructs a new AdminUpsertRecommenderLevelResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminUpsertRecommenderLevelResponse);

        /** AdminUpsertRecommenderLevelResponse code. */
        public code: number;

        /** AdminUpsertRecommenderLevelResponse msg. */
        public msg: string;

        /**
         * Creates a new AdminUpsertRecommenderLevelResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminUpsertRecommenderLevelResponse instance
         */
        public static create(properties?: pb.IAdminUpsertRecommenderLevelResponse): pb.AdminUpsertRecommenderLevelResponse;

        /**
         * Encodes the specified AdminUpsertRecommenderLevelResponse message. Does not implicitly {@link pb.AdminUpsertRecommenderLevelResponse.verify|verify} messages.
         * @param message AdminUpsertRecommenderLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminUpsertRecommenderLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminUpsertRecommenderLevelResponse message, length delimited. Does not implicitly {@link pb.AdminUpsertRecommenderLevelResponse.verify|verify} messages.
         * @param message AdminUpsertRecommenderLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminUpsertRecommenderLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminUpsertRecommenderLevelResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminUpsertRecommenderLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminUpsertRecommenderLevelResponse;

        /**
         * Decodes an AdminUpsertRecommenderLevelResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminUpsertRecommenderLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminUpsertRecommenderLevelResponse;

        /**
         * Verifies an AdminUpsertRecommenderLevelResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminUpsertRecommenderLevelResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminUpsertRecommenderLevelResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminUpsertRecommenderLevelResponse;

        /**
         * Creates a plain object from an AdminUpsertRecommenderLevelResponse message. Also converts values to other types if specified.
         * @param message AdminUpsertRecommenderLevelResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminUpsertRecommenderLevelResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminUpsertRecommenderLevelResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminUpsertRecommenderLevelResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminGetRecommenderLevelRequest. */
    interface IAdminGetRecommenderLevelRequest {

        /** AdminGetRecommenderLevelRequest recommenderPubkey */
        recommenderPubkey?: (string|null);
    }

    /** Represents an AdminGetRecommenderLevelRequest. */
    class AdminGetRecommenderLevelRequest implements IAdminGetRecommenderLevelRequest {

        /**
         * Constructs a new AdminGetRecommenderLevelRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminGetRecommenderLevelRequest);

        /** AdminGetRecommenderLevelRequest recommenderPubkey. */
        public recommenderPubkey: string;

        /**
         * Creates a new AdminGetRecommenderLevelRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminGetRecommenderLevelRequest instance
         */
        public static create(properties?: pb.IAdminGetRecommenderLevelRequest): pb.AdminGetRecommenderLevelRequest;

        /**
         * Encodes the specified AdminGetRecommenderLevelRequest message. Does not implicitly {@link pb.AdminGetRecommenderLevelRequest.verify|verify} messages.
         * @param message AdminGetRecommenderLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminGetRecommenderLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminGetRecommenderLevelRequest message, length delimited. Does not implicitly {@link pb.AdminGetRecommenderLevelRequest.verify|verify} messages.
         * @param message AdminGetRecommenderLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminGetRecommenderLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminGetRecommenderLevelRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminGetRecommenderLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminGetRecommenderLevelRequest;

        /**
         * Decodes an AdminGetRecommenderLevelRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminGetRecommenderLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminGetRecommenderLevelRequest;

        /**
         * Verifies an AdminGetRecommenderLevelRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminGetRecommenderLevelRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminGetRecommenderLevelRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminGetRecommenderLevelRequest;

        /**
         * Creates a plain object from an AdminGetRecommenderLevelRequest message. Also converts values to other types if specified.
         * @param message AdminGetRecommenderLevelRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminGetRecommenderLevelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminGetRecommenderLevelRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminGetRecommenderLevelRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminGetRecommenderLevelResponse. */
    interface IAdminGetRecommenderLevelResponse {

        /** AdminGetRecommenderLevelResponse code */
        code?: (number|null);

        /** AdminGetRecommenderLevelResponse msg */
        msg?: (string|null);

        /** AdminGetRecommenderLevelResponse data */
        data?: (pb.IRecommenderLevelInfo|null);
    }

    /** Represents an AdminGetRecommenderLevelResponse. */
    class AdminGetRecommenderLevelResponse implements IAdminGetRecommenderLevelResponse {

        /**
         * Constructs a new AdminGetRecommenderLevelResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminGetRecommenderLevelResponse);

        /** AdminGetRecommenderLevelResponse code. */
        public code: number;

        /** AdminGetRecommenderLevelResponse msg. */
        public msg: string;

        /** AdminGetRecommenderLevelResponse data. */
        public data?: (pb.IRecommenderLevelInfo|null);

        /**
         * Creates a new AdminGetRecommenderLevelResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminGetRecommenderLevelResponse instance
         */
        public static create(properties?: pb.IAdminGetRecommenderLevelResponse): pb.AdminGetRecommenderLevelResponse;

        /**
         * Encodes the specified AdminGetRecommenderLevelResponse message. Does not implicitly {@link pb.AdminGetRecommenderLevelResponse.verify|verify} messages.
         * @param message AdminGetRecommenderLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminGetRecommenderLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminGetRecommenderLevelResponse message, length delimited. Does not implicitly {@link pb.AdminGetRecommenderLevelResponse.verify|verify} messages.
         * @param message AdminGetRecommenderLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminGetRecommenderLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminGetRecommenderLevelResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminGetRecommenderLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminGetRecommenderLevelResponse;

        /**
         * Decodes an AdminGetRecommenderLevelResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminGetRecommenderLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminGetRecommenderLevelResponse;

        /**
         * Verifies an AdminGetRecommenderLevelResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminGetRecommenderLevelResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminGetRecommenderLevelResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminGetRecommenderLevelResponse;

        /**
         * Creates a plain object from an AdminGetRecommenderLevelResponse message. Also converts values to other types if specified.
         * @param message AdminGetRecommenderLevelResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminGetRecommenderLevelResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminGetRecommenderLevelResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminGetRecommenderLevelResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListRecommenderLevelsRequest. */
    interface IAdminListRecommenderLevelsRequest {

        /** AdminListRecommenderLevelsRequest pageNum */
        pageNum?: (number|null);

        /** AdminListRecommenderLevelsRequest pageSize */
        pageSize?: (number|null);
    }

    /** Represents an AdminListRecommenderLevelsRequest. */
    class AdminListRecommenderLevelsRequest implements IAdminListRecommenderLevelsRequest {

        /**
         * Constructs a new AdminListRecommenderLevelsRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListRecommenderLevelsRequest);

        /** AdminListRecommenderLevelsRequest pageNum. */
        public pageNum: number;

        /** AdminListRecommenderLevelsRequest pageSize. */
        public pageSize: number;

        /**
         * Creates a new AdminListRecommenderLevelsRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListRecommenderLevelsRequest instance
         */
        public static create(properties?: pb.IAdminListRecommenderLevelsRequest): pb.AdminListRecommenderLevelsRequest;

        /**
         * Encodes the specified AdminListRecommenderLevelsRequest message. Does not implicitly {@link pb.AdminListRecommenderLevelsRequest.verify|verify} messages.
         * @param message AdminListRecommenderLevelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListRecommenderLevelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListRecommenderLevelsRequest message, length delimited. Does not implicitly {@link pb.AdminListRecommenderLevelsRequest.verify|verify} messages.
         * @param message AdminListRecommenderLevelsRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListRecommenderLevelsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListRecommenderLevelsRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListRecommenderLevelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListRecommenderLevelsRequest;

        /**
         * Decodes an AdminListRecommenderLevelsRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListRecommenderLevelsRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListRecommenderLevelsRequest;

        /**
         * Verifies an AdminListRecommenderLevelsRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListRecommenderLevelsRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListRecommenderLevelsRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListRecommenderLevelsRequest;

        /**
         * Creates a plain object from an AdminListRecommenderLevelsRequest message. Also converts values to other types if specified.
         * @param message AdminListRecommenderLevelsRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListRecommenderLevelsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListRecommenderLevelsRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListRecommenderLevelsRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminListRecommenderLevelsResponse. */
    interface IAdminListRecommenderLevelsResponse {

        /** AdminListRecommenderLevelsResponse code */
        code?: (number|null);

        /** AdminListRecommenderLevelsResponse msg */
        msg?: (string|null);

        /** AdminListRecommenderLevelsResponse total */
        total?: (number|Long|null);

        /** AdminListRecommenderLevelsResponse data */
        data?: (pb.IRecommenderLevelInfo[]|null);
    }

    /** Represents an AdminListRecommenderLevelsResponse. */
    class AdminListRecommenderLevelsResponse implements IAdminListRecommenderLevelsResponse {

        /**
         * Constructs a new AdminListRecommenderLevelsResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminListRecommenderLevelsResponse);

        /** AdminListRecommenderLevelsResponse code. */
        public code: number;

        /** AdminListRecommenderLevelsResponse msg. */
        public msg: string;

        /** AdminListRecommenderLevelsResponse total. */
        public total: (number|Long);

        /** AdminListRecommenderLevelsResponse data. */
        public data: pb.IRecommenderLevelInfo[];

        /**
         * Creates a new AdminListRecommenderLevelsResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminListRecommenderLevelsResponse instance
         */
        public static create(properties?: pb.IAdminListRecommenderLevelsResponse): pb.AdminListRecommenderLevelsResponse;

        /**
         * Encodes the specified AdminListRecommenderLevelsResponse message. Does not implicitly {@link pb.AdminListRecommenderLevelsResponse.verify|verify} messages.
         * @param message AdminListRecommenderLevelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminListRecommenderLevelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminListRecommenderLevelsResponse message, length delimited. Does not implicitly {@link pb.AdminListRecommenderLevelsResponse.verify|verify} messages.
         * @param message AdminListRecommenderLevelsResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminListRecommenderLevelsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminListRecommenderLevelsResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminListRecommenderLevelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminListRecommenderLevelsResponse;

        /**
         * Decodes an AdminListRecommenderLevelsResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminListRecommenderLevelsResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminListRecommenderLevelsResponse;

        /**
         * Verifies an AdminListRecommenderLevelsResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminListRecommenderLevelsResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminListRecommenderLevelsResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminListRecommenderLevelsResponse;

        /**
         * Creates a plain object from an AdminListRecommenderLevelsResponse message. Also converts values to other types if specified.
         * @param message AdminListRecommenderLevelsResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminListRecommenderLevelsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminListRecommenderLevelsResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminListRecommenderLevelsResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminDeleteRecommenderLevelRequest. */
    interface IAdminDeleteRecommenderLevelRequest {

        /** AdminDeleteRecommenderLevelRequest recommenderPubkey */
        recommenderPubkey?: (string|null);
    }

    /** Represents an AdminDeleteRecommenderLevelRequest. */
    class AdminDeleteRecommenderLevelRequest implements IAdminDeleteRecommenderLevelRequest {

        /**
         * Constructs a new AdminDeleteRecommenderLevelRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminDeleteRecommenderLevelRequest);

        /** AdminDeleteRecommenderLevelRequest recommenderPubkey. */
        public recommenderPubkey: string;

        /**
         * Creates a new AdminDeleteRecommenderLevelRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminDeleteRecommenderLevelRequest instance
         */
        public static create(properties?: pb.IAdminDeleteRecommenderLevelRequest): pb.AdminDeleteRecommenderLevelRequest;

        /**
         * Encodes the specified AdminDeleteRecommenderLevelRequest message. Does not implicitly {@link pb.AdminDeleteRecommenderLevelRequest.verify|verify} messages.
         * @param message AdminDeleteRecommenderLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminDeleteRecommenderLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminDeleteRecommenderLevelRequest message, length delimited. Does not implicitly {@link pb.AdminDeleteRecommenderLevelRequest.verify|verify} messages.
         * @param message AdminDeleteRecommenderLevelRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminDeleteRecommenderLevelRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminDeleteRecommenderLevelRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminDeleteRecommenderLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminDeleteRecommenderLevelRequest;

        /**
         * Decodes an AdminDeleteRecommenderLevelRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminDeleteRecommenderLevelRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminDeleteRecommenderLevelRequest;

        /**
         * Verifies an AdminDeleteRecommenderLevelRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminDeleteRecommenderLevelRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminDeleteRecommenderLevelRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminDeleteRecommenderLevelRequest;

        /**
         * Creates a plain object from an AdminDeleteRecommenderLevelRequest message. Also converts values to other types if specified.
         * @param message AdminDeleteRecommenderLevelRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminDeleteRecommenderLevelRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminDeleteRecommenderLevelRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminDeleteRecommenderLevelRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminDeleteRecommenderLevelResponse. */
    interface IAdminDeleteRecommenderLevelResponse {

        /** AdminDeleteRecommenderLevelResponse code */
        code?: (number|null);

        /** AdminDeleteRecommenderLevelResponse msg */
        msg?: (string|null);
    }

    /** Represents an AdminDeleteRecommenderLevelResponse. */
    class AdminDeleteRecommenderLevelResponse implements IAdminDeleteRecommenderLevelResponse {

        /**
         * Constructs a new AdminDeleteRecommenderLevelResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminDeleteRecommenderLevelResponse);

        /** AdminDeleteRecommenderLevelResponse code. */
        public code: number;

        /** AdminDeleteRecommenderLevelResponse msg. */
        public msg: string;

        /**
         * Creates a new AdminDeleteRecommenderLevelResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminDeleteRecommenderLevelResponse instance
         */
        public static create(properties?: pb.IAdminDeleteRecommenderLevelResponse): pb.AdminDeleteRecommenderLevelResponse;

        /**
         * Encodes the specified AdminDeleteRecommenderLevelResponse message. Does not implicitly {@link pb.AdminDeleteRecommenderLevelResponse.verify|verify} messages.
         * @param message AdminDeleteRecommenderLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminDeleteRecommenderLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminDeleteRecommenderLevelResponse message, length delimited. Does not implicitly {@link pb.AdminDeleteRecommenderLevelResponse.verify|verify} messages.
         * @param message AdminDeleteRecommenderLevelResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminDeleteRecommenderLevelResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminDeleteRecommenderLevelResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminDeleteRecommenderLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminDeleteRecommenderLevelResponse;

        /**
         * Decodes an AdminDeleteRecommenderLevelResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminDeleteRecommenderLevelResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminDeleteRecommenderLevelResponse;

        /**
         * Verifies an AdminDeleteRecommenderLevelResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminDeleteRecommenderLevelResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminDeleteRecommenderLevelResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminDeleteRecommenderLevelResponse;

        /**
         * Creates a plain object from an AdminDeleteRecommenderLevelResponse message. Also converts values to other types if specified.
         * @param message AdminDeleteRecommenderLevelResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminDeleteRecommenderLevelResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminDeleteRecommenderLevelResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminDeleteRecommenderLevelResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminAuditBussPackageRequest. */
    interface IAdminAuditBussPackageRequest {

        /** AdminAuditBussPackageRequest pkgId */
        pkgId?: (number|null);

        /** AdminAuditBussPackageRequest checkStatus */
        checkStatus?: (number|null);

        /** AdminAuditBussPackageRequest checkReason */
        checkReason?: (string|null);
    }

    /** Represents an AdminAuditBussPackageRequest. */
    class AdminAuditBussPackageRequest implements IAdminAuditBussPackageRequest {

        /**
         * Constructs a new AdminAuditBussPackageRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminAuditBussPackageRequest);

        /** AdminAuditBussPackageRequest pkgId. */
        public pkgId: number;

        /** AdminAuditBussPackageRequest checkStatus. */
        public checkStatus: number;

        /** AdminAuditBussPackageRequest checkReason. */
        public checkReason: string;

        /**
         * Creates a new AdminAuditBussPackageRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminAuditBussPackageRequest instance
         */
        public static create(properties?: pb.IAdminAuditBussPackageRequest): pb.AdminAuditBussPackageRequest;

        /**
         * Encodes the specified AdminAuditBussPackageRequest message. Does not implicitly {@link pb.AdminAuditBussPackageRequest.verify|verify} messages.
         * @param message AdminAuditBussPackageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminAuditBussPackageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminAuditBussPackageRequest message, length delimited. Does not implicitly {@link pb.AdminAuditBussPackageRequest.verify|verify} messages.
         * @param message AdminAuditBussPackageRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminAuditBussPackageRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminAuditBussPackageRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminAuditBussPackageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminAuditBussPackageRequest;

        /**
         * Decodes an AdminAuditBussPackageRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminAuditBussPackageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminAuditBussPackageRequest;

        /**
         * Verifies an AdminAuditBussPackageRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminAuditBussPackageRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminAuditBussPackageRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminAuditBussPackageRequest;

        /**
         * Creates a plain object from an AdminAuditBussPackageRequest message. Also converts values to other types if specified.
         * @param message AdminAuditBussPackageRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminAuditBussPackageRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminAuditBussPackageRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminAuditBussPackageRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminLoginRequest. */
    interface IAdminLoginRequest {

        /** AdminLoginRequest account */
        account?: (string|null);

        /** AdminLoginRequest password */
        password?: (string|null);
    }

    /** Represents an AdminLoginRequest. */
    class AdminLoginRequest implements IAdminLoginRequest {

        /**
         * Constructs a new AdminLoginRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminLoginRequest);

        /** AdminLoginRequest account. */
        public account: string;

        /** AdminLoginRequest password. */
        public password: string;

        /**
         * Creates a new AdminLoginRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminLoginRequest instance
         */
        public static create(properties?: pb.IAdminLoginRequest): pb.AdminLoginRequest;

        /**
         * Encodes the specified AdminLoginRequest message. Does not implicitly {@link pb.AdminLoginRequest.verify|verify} messages.
         * @param message AdminLoginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminLoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminLoginRequest message, length delimited. Does not implicitly {@link pb.AdminLoginRequest.verify|verify} messages.
         * @param message AdminLoginRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminLoginRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminLoginRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminLoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminLoginRequest;

        /**
         * Decodes an AdminLoginRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminLoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminLoginRequest;

        /**
         * Verifies an AdminLoginRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminLoginRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminLoginRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminLoginRequest;

        /**
         * Creates a plain object from an AdminLoginRequest message. Also converts values to other types if specified.
         * @param message AdminLoginRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminLoginRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminLoginRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminLoginRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminLoginUserInfo. */
    interface IAdminLoginUserInfo {

        /** AdminLoginUserInfo userId */
        userId?: (number|Long|null);

        /** AdminLoginUserInfo account */
        account?: (string|null);

        /** AdminLoginUserInfo userName */
        userName?: (string|null);
    }

    /** Represents an AdminLoginUserInfo. */
    class AdminLoginUserInfo implements IAdminLoginUserInfo {

        /**
         * Constructs a new AdminLoginUserInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminLoginUserInfo);

        /** AdminLoginUserInfo userId. */
        public userId: (number|Long);

        /** AdminLoginUserInfo account. */
        public account: string;

        /** AdminLoginUserInfo userName. */
        public userName: string;

        /**
         * Creates a new AdminLoginUserInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminLoginUserInfo instance
         */
        public static create(properties?: pb.IAdminLoginUserInfo): pb.AdminLoginUserInfo;

        /**
         * Encodes the specified AdminLoginUserInfo message. Does not implicitly {@link pb.AdminLoginUserInfo.verify|verify} messages.
         * @param message AdminLoginUserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminLoginUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminLoginUserInfo message, length delimited. Does not implicitly {@link pb.AdminLoginUserInfo.verify|verify} messages.
         * @param message AdminLoginUserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminLoginUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminLoginUserInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminLoginUserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminLoginUserInfo;

        /**
         * Decodes an AdminLoginUserInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminLoginUserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminLoginUserInfo;

        /**
         * Verifies an AdminLoginUserInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminLoginUserInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminLoginUserInfo
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminLoginUserInfo;

        /**
         * Creates a plain object from an AdminLoginUserInfo message. Also converts values to other types if specified.
         * @param message AdminLoginUserInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminLoginUserInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminLoginUserInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminLoginUserInfo
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminLoginResponse. */
    interface IAdminLoginResponse {

        /** AdminLoginResponse code */
        code?: (number|null);

        /** AdminLoginResponse msg */
        msg?: (string|null);

        /** AdminLoginResponse token */
        token?: (string|null);

        /** AdminLoginResponse user */
        user?: (pb.IAdminLoginUserInfo|null);
    }

    /** Represents an AdminLoginResponse. */
    class AdminLoginResponse implements IAdminLoginResponse {

        /**
         * Constructs a new AdminLoginResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminLoginResponse);

        /** AdminLoginResponse code. */
        public code: number;

        /** AdminLoginResponse msg. */
        public msg: string;

        /** AdminLoginResponse token. */
        public token: string;

        /** AdminLoginResponse user. */
        public user?: (pb.IAdminLoginUserInfo|null);

        /**
         * Creates a new AdminLoginResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminLoginResponse instance
         */
        public static create(properties?: pb.IAdminLoginResponse): pb.AdminLoginResponse;

        /**
         * Encodes the specified AdminLoginResponse message. Does not implicitly {@link pb.AdminLoginResponse.verify|verify} messages.
         * @param message AdminLoginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminLoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminLoginResponse message, length delimited. Does not implicitly {@link pb.AdminLoginResponse.verify|verify} messages.
         * @param message AdminLoginResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminLoginResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminLoginResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminLoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminLoginResponse;

        /**
         * Decodes an AdminLoginResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminLoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminLoginResponse;

        /**
         * Verifies an AdminLoginResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminLoginResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminLoginResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminLoginResponse;

        /**
         * Creates a plain object from an AdminLoginResponse message. Also converts values to other types if specified.
         * @param message AdminLoginResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminLoginResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminLoginResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminLoginResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminChangePasswordRequest. */
    interface IAdminChangePasswordRequest {

        /** AdminChangePasswordRequest oldPassword */
        oldPassword?: (string|null);

        /** AdminChangePasswordRequest newPassword */
        newPassword?: (string|null);
    }

    /** Represents an AdminChangePasswordRequest. */
    class AdminChangePasswordRequest implements IAdminChangePasswordRequest {

        /**
         * Constructs a new AdminChangePasswordRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminChangePasswordRequest);

        /** AdminChangePasswordRequest oldPassword. */
        public oldPassword: string;

        /** AdminChangePasswordRequest newPassword. */
        public newPassword: string;

        /**
         * Creates a new AdminChangePasswordRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminChangePasswordRequest instance
         */
        public static create(properties?: pb.IAdminChangePasswordRequest): pb.AdminChangePasswordRequest;

        /**
         * Encodes the specified AdminChangePasswordRequest message. Does not implicitly {@link pb.AdminChangePasswordRequest.verify|verify} messages.
         * @param message AdminChangePasswordRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminChangePasswordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminChangePasswordRequest message, length delimited. Does not implicitly {@link pb.AdminChangePasswordRequest.verify|verify} messages.
         * @param message AdminChangePasswordRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminChangePasswordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminChangePasswordRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminChangePasswordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminChangePasswordRequest;

        /**
         * Decodes an AdminChangePasswordRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminChangePasswordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminChangePasswordRequest;

        /**
         * Verifies an AdminChangePasswordRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminChangePasswordRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminChangePasswordRequest
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminChangePasswordRequest;

        /**
         * Creates a plain object from an AdminChangePasswordRequest message. Also converts values to other types if specified.
         * @param message AdminChangePasswordRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminChangePasswordRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminChangePasswordRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminChangePasswordRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AdminChangePasswordResponse. */
    interface IAdminChangePasswordResponse {

        /** AdminChangePasswordResponse code */
        code?: (number|null);

        /** AdminChangePasswordResponse msg */
        msg?: (string|null);
    }

    /** Represents an AdminChangePasswordResponse. */
    class AdminChangePasswordResponse implements IAdminChangePasswordResponse {

        /**
         * Constructs a new AdminChangePasswordResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: pb.IAdminChangePasswordResponse);

        /** AdminChangePasswordResponse code. */
        public code: number;

        /** AdminChangePasswordResponse msg. */
        public msg: string;

        /**
         * Creates a new AdminChangePasswordResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AdminChangePasswordResponse instance
         */
        public static create(properties?: pb.IAdminChangePasswordResponse): pb.AdminChangePasswordResponse;

        /**
         * Encodes the specified AdminChangePasswordResponse message. Does not implicitly {@link pb.AdminChangePasswordResponse.verify|verify} messages.
         * @param message AdminChangePasswordResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: pb.IAdminChangePasswordResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AdminChangePasswordResponse message, length delimited. Does not implicitly {@link pb.AdminChangePasswordResponse.verify|verify} messages.
         * @param message AdminChangePasswordResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: pb.IAdminChangePasswordResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AdminChangePasswordResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AdminChangePasswordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): pb.AdminChangePasswordResponse;

        /**
         * Decodes an AdminChangePasswordResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AdminChangePasswordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): pb.AdminChangePasswordResponse;

        /**
         * Verifies an AdminChangePasswordResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AdminChangePasswordResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AdminChangePasswordResponse
         */
        public static fromObject(object: { [k: string]: any }): pb.AdminChangePasswordResponse;

        /**
         * Creates a plain object from an AdminChangePasswordResponse message. Also converts values to other types if specified.
         * @param message AdminChangePasswordResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: pb.AdminChangePasswordResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AdminChangePasswordResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AdminChangePasswordResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
