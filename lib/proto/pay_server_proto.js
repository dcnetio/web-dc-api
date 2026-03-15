/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const pb = $root.pb = (() => {

    /**
     * Namespace pb.
     * @exports pb
     * @namespace
     */
    const pb = {};

    pb.PayService = (function() {

        /**
         * Constructs a new PayService service.
         * @memberof pb
         * @classdesc Represents a PayService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function PayService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (PayService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = PayService;

        /**
         * Creates new PayService service using the specified rpc implementation.
         * @function create
         * @memberof pb.PayService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {PayService} RPC service. Useful where requests and/or responses are streamed.
         */
        PayService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link pb.PayService#getPackages}.
         * @memberof pb.PayService
         * @typedef GetPackagesCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetPackagesResponse} [response] GetPackagesResponse
         */

        /**
         * Calls GetPackages.
         * @function getPackages
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetPackagesRequest} request GetPackagesRequest message or plain object
         * @param {pb.PayService.GetPackagesCallback} callback Node-style callback called with the error, if any, and GetPackagesResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getPackages = function getPackages(request, callback) {
            return this.rpcCall(getPackages, $root.pb.GetPackagesRequest, $root.pb.GetPackagesResponse, request, callback);
        }, "name", { value: "GetPackages" });

        /**
         * Calls GetPackages.
         * @function getPackages
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetPackagesRequest} request GetPackagesRequest message or plain object
         * @returns {Promise<pb.GetPackagesResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#applyBussPackage}.
         * @memberof pb.PayService
         * @typedef ApplyBussPackageCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.ApplyBussPackageResponse} [response] ApplyBussPackageResponse
         */

        /**
         * Calls ApplyBussPackage.
         * @function applyBussPackage
         * @memberof pb.PayService
         * @instance
         * @param {pb.IApplyBussPackageRequest} request ApplyBussPackageRequest message or plain object
         * @param {pb.PayService.ApplyBussPackageCallback} callback Node-style callback called with the error, if any, and ApplyBussPackageResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.applyBussPackage = function applyBussPackage(request, callback) {
            return this.rpcCall(applyBussPackage, $root.pb.ApplyBussPackageRequest, $root.pb.ApplyBussPackageResponse, request, callback);
        }, "name", { value: "ApplyBussPackage" });

        /**
         * Calls ApplyBussPackage.
         * @function applyBussPackage
         * @memberof pb.PayService
         * @instance
         * @param {pb.IApplyBussPackageRequest} request ApplyBussPackageRequest message or plain object
         * @returns {Promise<pb.ApplyBussPackageResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getAllPackagesConfig}.
         * @memberof pb.PayService
         * @typedef GetAllPackagesConfigCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetAllPackagesConfigResponse} [response] GetAllPackagesConfigResponse
         */

        /**
         * Calls GetAllPackagesConfig.
         * @function getAllPackagesConfig
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetAllPackagesConfigRequest} request GetAllPackagesConfigRequest message or plain object
         * @param {pb.PayService.GetAllPackagesConfigCallback} callback Node-style callback called with the error, if any, and GetAllPackagesConfigResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getAllPackagesConfig = function getAllPackagesConfig(request, callback) {
            return this.rpcCall(getAllPackagesConfig, $root.pb.GetAllPackagesConfigRequest, $root.pb.GetAllPackagesConfigResponse, request, callback);
        }, "name", { value: "GetAllPackagesConfig" });

        /**
         * Calls GetAllPackagesConfig.
         * @function getAllPackagesConfig
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetAllPackagesConfigRequest} request GetAllPackagesConfigRequest message or plain object
         * @returns {Promise<pb.GetAllPackagesConfigResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#createOrder}.
         * @memberof pb.PayService
         * @typedef CreateOrderCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.CreateOrderResponse} [response] CreateOrderResponse
         */

        /**
         * Calls CreateOrder.
         * @function createOrder
         * @memberof pb.PayService
         * @instance
         * @param {pb.ICreateOrderRequest} request CreateOrderRequest message or plain object
         * @param {pb.PayService.CreateOrderCallback} callback Node-style callback called with the error, if any, and CreateOrderResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.createOrder = function createOrder(request, callback) {
            return this.rpcCall(createOrder, $root.pb.CreateOrderRequest, $root.pb.CreateOrderResponse, request, callback);
        }, "name", { value: "CreateOrder" });

        /**
         * Calls CreateOrder.
         * @function createOrder
         * @memberof pb.PayService
         * @instance
         * @param {pb.ICreateOrderRequest} request CreateOrderRequest message or plain object
         * @returns {Promise<pb.CreateOrderResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getNativePrepay}.
         * @memberof pb.PayService
         * @typedef GetNativePrepayCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetNativePrepayResponse} [response] GetNativePrepayResponse
         */

        /**
         * Calls GetNativePrepay.
         * @function getNativePrepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetNativePrepayRequest} request GetNativePrepayRequest message or plain object
         * @param {pb.PayService.GetNativePrepayCallback} callback Node-style callback called with the error, if any, and GetNativePrepayResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getNativePrepay = function getNativePrepay(request, callback) {
            return this.rpcCall(getNativePrepay, $root.pb.GetNativePrepayRequest, $root.pb.GetNativePrepayResponse, request, callback);
        }, "name", { value: "GetNativePrepay" });

        /**
         * Calls GetNativePrepay.
         * @function getNativePrepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetNativePrepayRequest} request GetNativePrepayRequest message or plain object
         * @returns {Promise<pb.GetNativePrepayResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getH5Prepay}.
         * @memberof pb.PayService
         * @typedef GetH5PrepayCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetH5PrepayResponse} [response] GetH5PrepayResponse
         */

        /**
         * Calls GetH5Prepay.
         * @function getH5Prepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetH5PrepayRequest} request GetH5PrepayRequest message or plain object
         * @param {pb.PayService.GetH5PrepayCallback} callback Node-style callback called with the error, if any, and GetH5PrepayResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getH5Prepay = function getH5Prepay(request, callback) {
            return this.rpcCall(getH5Prepay, $root.pb.GetH5PrepayRequest, $root.pb.GetH5PrepayResponse, request, callback);
        }, "name", { value: "GetH5Prepay" });

        /**
         * Calls GetH5Prepay.
         * @function getH5Prepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetH5PrepayRequest} request GetH5PrepayRequest message or plain object
         * @returns {Promise<pb.GetH5PrepayResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getJSAPIPrepay}.
         * @memberof pb.PayService
         * @typedef GetJSAPIPrepayCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetJSAPIPrepayResponse} [response] GetJSAPIPrepayResponse
         */

        /**
         * Calls GetJSAPIPrepay.
         * @function getJSAPIPrepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetJSAPIPrepayRequest} request GetJSAPIPrepayRequest message or plain object
         * @param {pb.PayService.GetJSAPIPrepayCallback} callback Node-style callback called with the error, if any, and GetJSAPIPrepayResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getJSAPIPrepay = function getJSAPIPrepay(request, callback) {
            return this.rpcCall(getJSAPIPrepay, $root.pb.GetJSAPIPrepayRequest, $root.pb.GetJSAPIPrepayResponse, request, callback);
        }, "name", { value: "GetJSAPIPrepay" });

        /**
         * Calls GetJSAPIPrepay.
         * @function getJSAPIPrepay
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetJSAPIPrepayRequest} request GetJSAPIPrepayRequest message or plain object
         * @returns {Promise<pb.GetJSAPIPrepayResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getStoragePurchaseStatus}.
         * @memberof pb.PayService
         * @typedef GetStoragePurchaseStatusCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetStoragePurchaseStatusResponse} [response] GetStoragePurchaseStatusResponse
         */

        /**
         * Calls GetStoragePurchaseStatus.
         * @function getStoragePurchaseStatus
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetStoragePurchaseStatusRequest} request GetStoragePurchaseStatusRequest message or plain object
         * @param {pb.PayService.GetStoragePurchaseStatusCallback} callback Node-style callback called with the error, if any, and GetStoragePurchaseStatusResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getStoragePurchaseStatus = function getStoragePurchaseStatus(request, callback) {
            return this.rpcCall(getStoragePurchaseStatus, $root.pb.GetStoragePurchaseStatusRequest, $root.pb.GetStoragePurchaseStatusResponse, request, callback);
        }, "name", { value: "GetStoragePurchaseStatus" });

        /**
         * Calls GetStoragePurchaseStatus.
         * @function getStoragePurchaseStatus
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetStoragePurchaseStatusRequest} request GetStoragePurchaseStatusRequest message or plain object
         * @returns {Promise<pb.GetStoragePurchaseStatusResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#createCidInfo}.
         * @memberof pb.PayService
         * @typedef CreateCidInfoCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.CreateCidInfoResponse} [response] CreateCidInfoResponse
         */

        /**
         * Calls CreateCidInfo.
         * @function createCidInfo
         * @memberof pb.PayService
         * @instance
         * @param {pb.ICreateCidInfoRequest} request CreateCidInfoRequest message or plain object
         * @param {pb.PayService.CreateCidInfoCallback} callback Node-style callback called with the error, if any, and CreateCidInfoResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.createCidInfo = function createCidInfo(request, callback) {
            return this.rpcCall(createCidInfo, $root.pb.CreateCidInfoRequest, $root.pb.CreateCidInfoResponse, request, callback);
        }, "name", { value: "CreateCidInfo" });

        /**
         * Calls CreateCidInfo.
         * @function createCidInfo
         * @memberof pb.PayService
         * @instance
         * @param {pb.ICreateCidInfoRequest} request CreateCidInfoRequest message or plain object
         * @returns {Promise<pb.CreateCidInfoResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link pb.PayService#getCidInfo}.
         * @memberof pb.PayService
         * @typedef GetCidInfoCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb.GetCidInfoResponse} [response] GetCidInfoResponse
         */

        /**
         * Calls GetCidInfo.
         * @function getCidInfo
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetCidInfoRequest} request GetCidInfoRequest message or plain object
         * @param {pb.PayService.GetCidInfoCallback} callback Node-style callback called with the error, if any, and GetCidInfoResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(PayService.prototype.getCidInfo = function getCidInfo(request, callback) {
            return this.rpcCall(getCidInfo, $root.pb.GetCidInfoRequest, $root.pb.GetCidInfoResponse, request, callback);
        }, "name", { value: "GetCidInfo" });

        /**
         * Calls GetCidInfo.
         * @function getCidInfo
         * @memberof pb.PayService
         * @instance
         * @param {pb.IGetCidInfoRequest} request GetCidInfoRequest message or plain object
         * @returns {Promise<pb.GetCidInfoResponse>} Promise
         * @variation 2
         */

        return PayService;
    })();

    pb.GetPackagesRequest = (function() {

        /**
         * Properties of a GetPackagesRequest.
         * @memberof pb
         * @interface IGetPackagesRequest
         * @property {number|null} [pkgType] GetPackagesRequest pkgType
         * @property {string|null} [lang] GetPackagesRequest lang
         * @property {string|null} [currency] GetPackagesRequest currency
         * @property {string|null} [theme] GetPackagesRequest theme
         * @property {string|null} [appid] GetPackagesRequest appid
         * @property {string|null} [scene] GetPackagesRequest scene
         */

        /**
         * Constructs a new GetPackagesRequest.
         * @memberof pb
         * @classdesc Represents a GetPackagesRequest.
         * @implements IGetPackagesRequest
         * @constructor
         * @param {pb.IGetPackagesRequest=} [properties] Properties to set
         */
        function GetPackagesRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetPackagesRequest pkgType.
         * @member {number} pkgType
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.pkgType = 0;

        /**
         * GetPackagesRequest lang.
         * @member {string} lang
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.lang = "";

        /**
         * GetPackagesRequest currency.
         * @member {string} currency
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.currency = "";

        /**
         * GetPackagesRequest theme.
         * @member {string} theme
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.theme = "";

        /**
         * GetPackagesRequest appid.
         * @member {string} appid
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.appid = "";

        /**
         * GetPackagesRequest scene.
         * @member {string} scene
         * @memberof pb.GetPackagesRequest
         * @instance
         */
        GetPackagesRequest.prototype.scene = "";

        /**
         * Creates a new GetPackagesRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.IGetPackagesRequest=} [properties] Properties to set
         * @returns {pb.GetPackagesRequest} GetPackagesRequest instance
         */
        GetPackagesRequest.create = function create(properties) {
            return new GetPackagesRequest(properties);
        };

        /**
         * Encodes the specified GetPackagesRequest message. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.IGetPackagesRequest} message GetPackagesRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pkgType != null && Object.hasOwnProperty.call(message, "pkgType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pkgType);
            if (message.lang != null && Object.hasOwnProperty.call(message, "lang"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.lang);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.currency);
            if (message.theme != null && Object.hasOwnProperty.call(message, "theme"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.theme);
            if (message.appid != null && Object.hasOwnProperty.call(message, "appid"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.appid);
            if (message.scene != null && Object.hasOwnProperty.call(message, "scene"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.scene);
            return writer;
        };

        /**
         * Encodes the specified GetPackagesRequest message, length delimited. Does not implicitly {@link pb.GetPackagesRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.IGetPackagesRequest} message GetPackagesRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetPackagesRequest} GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetPackagesRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.pkgType = reader.int32();
                        break;
                    }
                case 2: {
                        message.lang = reader.string();
                        break;
                    }
                case 3: {
                        message.currency = reader.string();
                        break;
                    }
                case 4: {
                        message.theme = reader.string();
                        break;
                    }
                case 5: {
                        message.appid = reader.string();
                        break;
                    }
                case 6: {
                        message.scene = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetPackagesRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetPackagesRequest} GetPackagesRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetPackagesRequest message.
         * @function verify
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetPackagesRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                if (!$util.isInteger(message.pkgType))
                    return "pkgType: integer expected";
            if (message.lang != null && message.hasOwnProperty("lang"))
                if (!$util.isString(message.lang))
                    return "lang: string expected";
            if (message.currency != null && message.hasOwnProperty("currency"))
                if (!$util.isString(message.currency))
                    return "currency: string expected";
            if (message.theme != null && message.hasOwnProperty("theme"))
                if (!$util.isString(message.theme))
                    return "theme: string expected";
            if (message.appid != null && message.hasOwnProperty("appid"))
                if (!$util.isString(message.appid))
                    return "appid: string expected";
            if (message.scene != null && message.hasOwnProperty("scene"))
                if (!$util.isString(message.scene))
                    return "scene: string expected";
            return null;
        };

        /**
         * Creates a GetPackagesRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetPackagesRequest} GetPackagesRequest
         */
        GetPackagesRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetPackagesRequest)
                return object;
            let message = new $root.pb.GetPackagesRequest();
            if (object.pkgType != null)
                message.pkgType = object.pkgType | 0;
            if (object.lang != null)
                message.lang = String(object.lang);
            if (object.currency != null)
                message.currency = String(object.currency);
            if (object.theme != null)
                message.theme = String(object.theme);
            if (object.appid != null)
                message.appid = String(object.appid);
            if (object.scene != null)
                message.scene = String(object.scene);
            return message;
        };

        /**
         * Creates a plain object from a GetPackagesRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {pb.GetPackagesRequest} message GetPackagesRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetPackagesRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pkgType = 0;
                object.lang = "";
                object.currency = "";
                object.theme = "";
                object.appid = "";
                object.scene = "";
            }
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                object.pkgType = message.pkgType;
            if (message.lang != null && message.hasOwnProperty("lang"))
                object.lang = message.lang;
            if (message.currency != null && message.hasOwnProperty("currency"))
                object.currency = message.currency;
            if (message.theme != null && message.hasOwnProperty("theme"))
                object.theme = message.theme;
            if (message.appid != null && message.hasOwnProperty("appid"))
                object.appid = message.appid;
            if (message.scene != null && message.hasOwnProperty("scene"))
                object.scene = message.scene;
            return object;
        };

        /**
         * Converts this GetPackagesRequest to JSON.
         * @function toJSON
         * @memberof pb.GetPackagesRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetPackagesRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetPackagesRequest
         * @function getTypeUrl
         * @memberof pb.GetPackagesRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetPackagesRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetPackagesRequest";
        };

        return GetPackagesRequest;
    })();

    pb.GetPackagesResponse = (function() {

        /**
         * Properties of a GetPackagesResponse.
         * @memberof pb
         * @interface IGetPackagesResponse
         * @property {number|null} [code] GetPackagesResponse code
         * @property {string|null} [msg] GetPackagesResponse msg
         * @property {Array.<pb.IPackageInfo>|null} [data] GetPackagesResponse data
         */

        /**
         * Constructs a new GetPackagesResponse.
         * @memberof pb
         * @classdesc Represents a GetPackagesResponse.
         * @implements IGetPackagesResponse
         * @constructor
         * @param {pb.IGetPackagesResponse=} [properties] Properties to set
         */
        function GetPackagesResponse(properties) {
            this.data = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetPackagesResponse code.
         * @member {number} code
         * @memberof pb.GetPackagesResponse
         * @instance
         */
        GetPackagesResponse.prototype.code = 0;

        /**
         * GetPackagesResponse msg.
         * @member {string} msg
         * @memberof pb.GetPackagesResponse
         * @instance
         */
        GetPackagesResponse.prototype.msg = "";

        /**
         * GetPackagesResponse data.
         * @member {Array.<pb.IPackageInfo>} data
         * @memberof pb.GetPackagesResponse
         * @instance
         */
        GetPackagesResponse.prototype.data = $util.emptyArray;

        /**
         * Creates a new GetPackagesResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.IGetPackagesResponse=} [properties] Properties to set
         * @returns {pb.GetPackagesResponse} GetPackagesResponse instance
         */
        GetPackagesResponse.create = function create(properties) {
            return new GetPackagesResponse(properties);
        };

        /**
         * Encodes the specified GetPackagesResponse message. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.IGetPackagesResponse} message GetPackagesResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && message.data.length)
                for (let i = 0; i < message.data.length; ++i)
                    $root.pb.PackageInfo.encode(message.data[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetPackagesResponse message, length delimited. Does not implicitly {@link pb.GetPackagesResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.IGetPackagesResponse} message GetPackagesResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetPackagesResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetPackagesResponse} GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetPackagesResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.data && message.data.length))
                            message.data = [];
                        message.data.push($root.pb.PackageInfo.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetPackagesResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetPackagesResponse} GetPackagesResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetPackagesResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetPackagesResponse message.
         * @function verify
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetPackagesResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (let i = 0; i < message.data.length; ++i) {
                    let error = $root.pb.PackageInfo.verify(message.data[i]);
                    if (error)
                        return "data." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GetPackagesResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetPackagesResponse} GetPackagesResponse
         */
        GetPackagesResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetPackagesResponse)
                return object;
            let message = new $root.pb.GetPackagesResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".pb.GetPackagesResponse.data: array expected");
                message.data = [];
                for (let i = 0; i < object.data.length; ++i) {
                    if (typeof object.data[i] !== "object")
                        throw TypeError(".pb.GetPackagesResponse.data: object expected");
                    message.data[i] = $root.pb.PackageInfo.fromObject(object.data[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GetPackagesResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {pb.GetPackagesResponse} message GetPackagesResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetPackagesResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data && message.data.length) {
                object.data = [];
                for (let j = 0; j < message.data.length; ++j)
                    object.data[j] = $root.pb.PackageInfo.toObject(message.data[j], options);
            }
            return object;
        };

        /**
         * Converts this GetPackagesResponse to JSON.
         * @function toJSON
         * @memberof pb.GetPackagesResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetPackagesResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetPackagesResponse
         * @function getTypeUrl
         * @memberof pb.GetPackagesResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetPackagesResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetPackagesResponse";
        };

        return GetPackagesResponse;
    })();

    pb.PackageInfo = (function() {

        /**
         * Properties of a PackageInfo.
         * @memberof pb
         * @interface IPackageInfo
         * @property {number|null} [pkgId] PackageInfo pkgId
         * @property {number|null} [pkgType] PackageInfo pkgType
         * @property {string|null} [scene] PackageInfo scene
         * @property {string|null} [pkgName] PackageInfo pkgName
         * @property {string|null} [lang] PackageInfo lang
         * @property {number|null} [amount] PackageInfo amount
         * @property {string|null} [currency] PackageInfo currency
         * @property {number|null} [validDays] PackageInfo validDays
         * @property {string|null} [pkgRights] PackageInfo pkgRights
         * @property {number|null} [chainPkgId] PackageInfo chainPkgId
         * @property {number|null} [spaceSize] PackageInfo spaceSize
         * @property {string|null} [createTime] PackageInfo createTime
         * @property {string|null} [theme] PackageInfo theme
         * @property {string|null} [serviceAppid] PackageInfo serviceAppid
         * @property {string|null} [bussdesc] PackageInfo bussdesc
         * @property {string|null} [imglist] PackageInfo imglist
         * @property {number|null} [checkStatus] PackageInfo checkStatus
         * @property {string|null} [checkTime] PackageInfo checkTime
         * @property {string|null} [themeAuthor] PackageInfo themeAuthor
         * @property {string|null} [themeAppid] PackageInfo themeAppid
         * @property {string|null} [checkReason] PackageInfo checkReason
         */

        /**
         * Constructs a new PackageInfo.
         * @memberof pb
         * @classdesc Represents a PackageInfo.
         * @implements IPackageInfo
         * @constructor
         * @param {pb.IPackageInfo=} [properties] Properties to set
         */
        function PackageInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PackageInfo pkgId.
         * @member {number} pkgId
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.pkgId = 0;

        /**
         * PackageInfo pkgType.
         * @member {number} pkgType
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.pkgType = 0;

        /**
         * PackageInfo scene.
         * @member {string} scene
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.scene = "";

        /**
         * PackageInfo pkgName.
         * @member {string} pkgName
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.pkgName = "";

        /**
         * PackageInfo lang.
         * @member {string} lang
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.lang = "";

        /**
         * PackageInfo amount.
         * @member {number} amount
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.amount = 0;

        /**
         * PackageInfo currency.
         * @member {string} currency
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.currency = "";

        /**
         * PackageInfo validDays.
         * @member {number} validDays
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.validDays = 0;

        /**
         * PackageInfo pkgRights.
         * @member {string} pkgRights
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.pkgRights = "";

        /**
         * PackageInfo chainPkgId.
         * @member {number} chainPkgId
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.chainPkgId = 0;

        /**
         * PackageInfo spaceSize.
         * @member {number} spaceSize
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.spaceSize = 0;

        /**
         * PackageInfo createTime.
         * @member {string} createTime
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.createTime = "";

        /**
         * PackageInfo theme.
         * @member {string} theme
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.theme = "";

        /**
         * PackageInfo serviceAppid.
         * @member {string} serviceAppid
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.serviceAppid = "";

        /**
         * PackageInfo bussdesc.
         * @member {string} bussdesc
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.bussdesc = "";

        /**
         * PackageInfo imglist.
         * @member {string} imglist
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.imglist = "";

        /**
         * PackageInfo checkStatus.
         * @member {number} checkStatus
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.checkStatus = 0;

        /**
         * PackageInfo checkTime.
         * @member {string} checkTime
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.checkTime = "";

        /**
         * PackageInfo themeAuthor.
         * @member {string} themeAuthor
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.themeAuthor = "";

        /**
         * PackageInfo themeAppid.
         * @member {string} themeAppid
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.themeAppid = "";

        /**
         * PackageInfo checkReason.
         * @member {string} checkReason
         * @memberof pb.PackageInfo
         * @instance
         */
        PackageInfo.prototype.checkReason = "";

        /**
         * Creates a new PackageInfo instance using the specified properties.
         * @function create
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.IPackageInfo=} [properties] Properties to set
         * @returns {pb.PackageInfo} PackageInfo instance
         */
        PackageInfo.create = function create(properties) {
            return new PackageInfo(properties);
        };

        /**
         * Encodes the specified PackageInfo message. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @function encode
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.IPackageInfo} message PackageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PackageInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pkgId != null && Object.hasOwnProperty.call(message, "pkgId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pkgId);
            if (message.pkgType != null && Object.hasOwnProperty.call(message, "pkgType"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pkgType);
            if (message.pkgName != null && Object.hasOwnProperty.call(message, "pkgName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.pkgName);
            if (message.lang != null && Object.hasOwnProperty.call(message, "lang"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.lang);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.amount);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.currency);
            if (message.validDays != null && Object.hasOwnProperty.call(message, "validDays"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.validDays);
            if (message.pkgRights != null && Object.hasOwnProperty.call(message, "pkgRights"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.pkgRights);
            if (message.chainPkgId != null && Object.hasOwnProperty.call(message, "chainPkgId"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.chainPkgId);
            if (message.spaceSize != null && Object.hasOwnProperty.call(message, "spaceSize"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.spaceSize);
            if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.createTime);
            if (message.theme != null && Object.hasOwnProperty.call(message, "theme"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.theme);
            if (message.serviceAppid != null && Object.hasOwnProperty.call(message, "serviceAppid"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.serviceAppid);
            if (message.scene != null && Object.hasOwnProperty.call(message, "scene"))
                writer.uint32(/* id 14, wireType 2 =*/114).string(message.scene);
            if (message.bussdesc != null && Object.hasOwnProperty.call(message, "bussdesc"))
                writer.uint32(/* id 15, wireType 2 =*/122).string(message.bussdesc);
            if (message.imglist != null && Object.hasOwnProperty.call(message, "imglist"))
                writer.uint32(/* id 16, wireType 2 =*/130).string(message.imglist);
            if (message.checkStatus != null && Object.hasOwnProperty.call(message, "checkStatus"))
                writer.uint32(/* id 17, wireType 0 =*/136).int32(message.checkStatus);
            if (message.checkTime != null && Object.hasOwnProperty.call(message, "checkTime"))
                writer.uint32(/* id 18, wireType 2 =*/146).string(message.checkTime);
            if (message.themeAuthor != null && Object.hasOwnProperty.call(message, "themeAuthor"))
                writer.uint32(/* id 19, wireType 2 =*/154).string(message.themeAuthor);
            if (message.themeAppid != null && Object.hasOwnProperty.call(message, "themeAppid"))
                writer.uint32(/* id 20, wireType 2 =*/162).string(message.themeAppid);
            if (message.checkReason != null && Object.hasOwnProperty.call(message, "checkReason"))
                writer.uint32(/* id 21, wireType 2 =*/170).string(message.checkReason);
            return writer;
        };

        /**
         * Encodes the specified PackageInfo message, length delimited. Does not implicitly {@link pb.PackageInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.IPackageInfo} message PackageInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PackageInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PackageInfo message from the specified reader or buffer.
         * @function decode
         * @memberof pb.PackageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.PackageInfo} PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PackageInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.PackageInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.pkgId = reader.int32();
                        break;
                    }
                case 2: {
                        message.pkgType = reader.int32();
                        break;
                    }
                case 14: {
                        message.scene = reader.string();
                        break;
                    }
                case 3: {
                        message.pkgName = reader.string();
                        break;
                    }
                case 4: {
                        message.lang = reader.string();
                        break;
                    }
                case 5: {
                        message.amount = reader.int32();
                        break;
                    }
                case 6: {
                        message.currency = reader.string();
                        break;
                    }
                case 7: {
                        message.validDays = reader.int32();
                        break;
                    }
                case 8: {
                        message.pkgRights = reader.string();
                        break;
                    }
                case 9: {
                        message.chainPkgId = reader.int32();
                        break;
                    }
                case 10: {
                        message.spaceSize = reader.int32();
                        break;
                    }
                case 11: {
                        message.createTime = reader.string();
                        break;
                    }
                case 12: {
                        message.theme = reader.string();
                        break;
                    }
                case 13: {
                        message.serviceAppid = reader.string();
                        break;
                    }
                case 15: {
                        message.bussdesc = reader.string();
                        break;
                    }
                case 16: {
                        message.imglist = reader.string();
                        break;
                    }
                case 17: {
                        message.checkStatus = reader.int32();
                        break;
                    }
                case 18: {
                        message.checkTime = reader.string();
                        break;
                    }
                case 19: {
                        message.themeAuthor = reader.string();
                        break;
                    }
                case 20: {
                        message.themeAppid = reader.string();
                        break;
                    }
                case 21: {
                        message.checkReason = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PackageInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.PackageInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.PackageInfo} PackageInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PackageInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PackageInfo message.
         * @function verify
         * @memberof pb.PackageInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PackageInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                if (!$util.isInteger(message.pkgId))
                    return "pkgId: integer expected";
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                if (!$util.isInteger(message.pkgType))
                    return "pkgType: integer expected";
            if (message.scene != null && message.hasOwnProperty("scene"))
                if (!$util.isString(message.scene))
                    return "scene: string expected";
            if (message.pkgName != null && message.hasOwnProperty("pkgName"))
                if (!$util.isString(message.pkgName))
                    return "pkgName: string expected";
            if (message.lang != null && message.hasOwnProperty("lang"))
                if (!$util.isString(message.lang))
                    return "lang: string expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount))
                    return "amount: integer expected";
            if (message.currency != null && message.hasOwnProperty("currency"))
                if (!$util.isString(message.currency))
                    return "currency: string expected";
            if (message.validDays != null && message.hasOwnProperty("validDays"))
                if (!$util.isInteger(message.validDays))
                    return "validDays: integer expected";
            if (message.pkgRights != null && message.hasOwnProperty("pkgRights"))
                if (!$util.isString(message.pkgRights))
                    return "pkgRights: string expected";
            if (message.chainPkgId != null && message.hasOwnProperty("chainPkgId"))
                if (!$util.isInteger(message.chainPkgId))
                    return "chainPkgId: integer expected";
            if (message.spaceSize != null && message.hasOwnProperty("spaceSize"))
                if (!$util.isInteger(message.spaceSize))
                    return "spaceSize: integer expected";
            if (message.createTime != null && message.hasOwnProperty("createTime"))
                if (!$util.isString(message.createTime))
                    return "createTime: string expected";
            if (message.theme != null && message.hasOwnProperty("theme"))
                if (!$util.isString(message.theme))
                    return "theme: string expected";
            if (message.serviceAppid != null && message.hasOwnProperty("serviceAppid"))
                if (!$util.isString(message.serviceAppid))
                    return "serviceAppid: string expected";
            if (message.bussdesc != null && message.hasOwnProperty("bussdesc"))
                if (!$util.isString(message.bussdesc))
                    return "bussdesc: string expected";
            if (message.imglist != null && message.hasOwnProperty("imglist"))
                if (!$util.isString(message.imglist))
                    return "imglist: string expected";
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                if (!$util.isInteger(message.checkStatus))
                    return "checkStatus: integer expected";
            if (message.checkTime != null && message.hasOwnProperty("checkTime"))
                if (!$util.isString(message.checkTime))
                    return "checkTime: string expected";
            if (message.themeAuthor != null && message.hasOwnProperty("themeAuthor"))
                if (!$util.isString(message.themeAuthor))
                    return "themeAuthor: string expected";
            if (message.themeAppid != null && message.hasOwnProperty("themeAppid"))
                if (!$util.isString(message.themeAppid))
                    return "themeAppid: string expected";
            if (message.checkReason != null && message.hasOwnProperty("checkReason"))
                if (!$util.isString(message.checkReason))
                    return "checkReason: string expected";
            return null;
        };

        /**
         * Creates a PackageInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.PackageInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.PackageInfo} PackageInfo
         */
        PackageInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.PackageInfo)
                return object;
            let message = new $root.pb.PackageInfo();
            if (object.pkgId != null)
                message.pkgId = object.pkgId | 0;
            if (object.pkgType != null)
                message.pkgType = object.pkgType | 0;
            if (object.scene != null)
                message.scene = String(object.scene);
            if (object.pkgName != null)
                message.pkgName = String(object.pkgName);
            if (object.lang != null)
                message.lang = String(object.lang);
            if (object.amount != null)
                message.amount = object.amount | 0;
            if (object.currency != null)
                message.currency = String(object.currency);
            if (object.validDays != null)
                message.validDays = object.validDays | 0;
            if (object.pkgRights != null)
                message.pkgRights = String(object.pkgRights);
            if (object.chainPkgId != null)
                message.chainPkgId = object.chainPkgId | 0;
            if (object.spaceSize != null)
                message.spaceSize = object.spaceSize | 0;
            if (object.createTime != null)
                message.createTime = String(object.createTime);
            if (object.theme != null)
                message.theme = String(object.theme);
            if (object.serviceAppid != null)
                message.serviceAppid = String(object.serviceAppid);
            if (object.bussdesc != null)
                message.bussdesc = String(object.bussdesc);
            if (object.imglist != null)
                message.imglist = String(object.imglist);
            if (object.checkStatus != null)
                message.checkStatus = object.checkStatus | 0;
            if (object.checkTime != null)
                message.checkTime = String(object.checkTime);
            if (object.themeAuthor != null)
                message.themeAuthor = String(object.themeAuthor);
            if (object.themeAppid != null)
                message.themeAppid = String(object.themeAppid);
            if (object.checkReason != null)
                message.checkReason = String(object.checkReason);
            return message;
        };

        /**
         * Creates a plain object from a PackageInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.PackageInfo
         * @static
         * @param {pb.PackageInfo} message PackageInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PackageInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pkgId = 0;
                object.pkgType = 0;
                object.pkgName = "";
                object.lang = "";
                object.amount = 0;
                object.currency = "";
                object.validDays = 0;
                object.pkgRights = "";
                object.chainPkgId = 0;
                object.spaceSize = 0;
                object.createTime = "";
                object.theme = "";
                object.serviceAppid = "";
                object.scene = "";
                object.bussdesc = "";
                object.imglist = "";
                object.checkStatus = 0;
                object.checkTime = "";
                object.themeAuthor = "";
                object.themeAppid = "";
                object.checkReason = "";
            }
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                object.pkgId = message.pkgId;
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                object.pkgType = message.pkgType;
            if (message.pkgName != null && message.hasOwnProperty("pkgName"))
                object.pkgName = message.pkgName;
            if (message.lang != null && message.hasOwnProperty("lang"))
                object.lang = message.lang;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = message.amount;
            if (message.currency != null && message.hasOwnProperty("currency"))
                object.currency = message.currency;
            if (message.validDays != null && message.hasOwnProperty("validDays"))
                object.validDays = message.validDays;
            if (message.pkgRights != null && message.hasOwnProperty("pkgRights"))
                object.pkgRights = message.pkgRights;
            if (message.chainPkgId != null && message.hasOwnProperty("chainPkgId"))
                object.chainPkgId = message.chainPkgId;
            if (message.spaceSize != null && message.hasOwnProperty("spaceSize"))
                object.spaceSize = message.spaceSize;
            if (message.createTime != null && message.hasOwnProperty("createTime"))
                object.createTime = message.createTime;
            if (message.theme != null && message.hasOwnProperty("theme"))
                object.theme = message.theme;
            if (message.serviceAppid != null && message.hasOwnProperty("serviceAppid"))
                object.serviceAppid = message.serviceAppid;
            if (message.scene != null && message.hasOwnProperty("scene"))
                object.scene = message.scene;
            if (message.bussdesc != null && message.hasOwnProperty("bussdesc"))
                object.bussdesc = message.bussdesc;
            if (message.imglist != null && message.hasOwnProperty("imglist"))
                object.imglist = message.imglist;
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                object.checkStatus = message.checkStatus;
            if (message.checkTime != null && message.hasOwnProperty("checkTime"))
                object.checkTime = message.checkTime;
            if (message.themeAuthor != null && message.hasOwnProperty("themeAuthor"))
                object.themeAuthor = message.themeAuthor;
            if (message.themeAppid != null && message.hasOwnProperty("themeAppid"))
                object.themeAppid = message.themeAppid;
            if (message.checkReason != null && message.hasOwnProperty("checkReason"))
                object.checkReason = message.checkReason;
            return object;
        };

        /**
         * Converts this PackageInfo to JSON.
         * @function toJSON
         * @memberof pb.PackageInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PackageInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PackageInfo
         * @function getTypeUrl
         * @memberof pb.PackageInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PackageInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.PackageInfo";
        };

        return PackageInfo;
    })();

    pb.ApplyBussPackageRequest = (function() {

        /**
         * Properties of an ApplyBussPackageRequest.
         * @memberof pb
         * @interface IApplyBussPackageRequest
         * @property {number|null} [pkgType] ApplyBussPackageRequest pkgType
         * @property {string|null} [scene] ApplyBussPackageRequest scene
         * @property {string|null} [bussdesc] ApplyBussPackageRequest bussdesc
         * @property {string|null} [imglist] ApplyBussPackageRequest imglist
         * @property {string|null} [pkgName] ApplyBussPackageRequest pkgName
         * @property {string|null} [lang] ApplyBussPackageRequest lang
         * @property {number|null} [amount] ApplyBussPackageRequest amount
         * @property {string|null} [currency] ApplyBussPackageRequest currency
         * @property {number|null} [validDays] ApplyBussPackageRequest validDays
         * @property {string|null} [pkgRights] ApplyBussPackageRequest pkgRights
         * @property {string|null} [theme] ApplyBussPackageRequest theme
         * @property {string|null} [themeAuthor] ApplyBussPackageRequest themeAuthor
         * @property {string|null} [themeAppid] ApplyBussPackageRequest themeAppid
         * @property {string|null} [serviceAppid] ApplyBussPackageRequest serviceAppid
         * @property {number|null} [chainPkgId] ApplyBussPackageRequest chainPkgId
         * @property {number|null} [spaceSize] ApplyBussPackageRequest spaceSize
         */

        /**
         * Constructs a new ApplyBussPackageRequest.
         * @memberof pb
         * @classdesc Represents an ApplyBussPackageRequest.
         * @implements IApplyBussPackageRequest
         * @constructor
         * @param {pb.IApplyBussPackageRequest=} [properties] Properties to set
         */
        function ApplyBussPackageRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ApplyBussPackageRequest pkgType.
         * @member {number} pkgType
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.pkgType = 0;

        /**
         * ApplyBussPackageRequest scene.
         * @member {string} scene
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.scene = "";

        /**
         * ApplyBussPackageRequest bussdesc.
         * @member {string} bussdesc
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.bussdesc = "";

        /**
         * ApplyBussPackageRequest imglist.
         * @member {string} imglist
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.imglist = "";

        /**
         * ApplyBussPackageRequest pkgName.
         * @member {string} pkgName
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.pkgName = "";

        /**
         * ApplyBussPackageRequest lang.
         * @member {string} lang
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.lang = "";

        /**
         * ApplyBussPackageRequest amount.
         * @member {number} amount
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.amount = 0;

        /**
         * ApplyBussPackageRequest currency.
         * @member {string} currency
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.currency = "";

        /**
         * ApplyBussPackageRequest validDays.
         * @member {number} validDays
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.validDays = 0;

        /**
         * ApplyBussPackageRequest pkgRights.
         * @member {string} pkgRights
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.pkgRights = "";

        /**
         * ApplyBussPackageRequest theme.
         * @member {string} theme
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.theme = "";

        /**
         * ApplyBussPackageRequest themeAuthor.
         * @member {string} themeAuthor
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.themeAuthor = "";

        /**
         * ApplyBussPackageRequest themeAppid.
         * @member {string} themeAppid
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.themeAppid = "";

        /**
         * ApplyBussPackageRequest serviceAppid.
         * @member {string} serviceAppid
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.serviceAppid = "";

        /**
         * ApplyBussPackageRequest chainPkgId.
         * @member {number} chainPkgId
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.chainPkgId = 0;

        /**
         * ApplyBussPackageRequest spaceSize.
         * @member {number} spaceSize
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         */
        ApplyBussPackageRequest.prototype.spaceSize = 0;

        /**
         * Creates a new ApplyBussPackageRequest instance using the specified properties.
         * @function create
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {pb.IApplyBussPackageRequest=} [properties] Properties to set
         * @returns {pb.ApplyBussPackageRequest} ApplyBussPackageRequest instance
         */
        ApplyBussPackageRequest.create = function create(properties) {
            return new ApplyBussPackageRequest(properties);
        };

        /**
         * Encodes the specified ApplyBussPackageRequest message. Does not implicitly {@link pb.ApplyBussPackageRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {pb.IApplyBussPackageRequest} message ApplyBussPackageRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApplyBussPackageRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pkgType != null && Object.hasOwnProperty.call(message, "pkgType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pkgType);
            if (message.scene != null && Object.hasOwnProperty.call(message, "scene"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.scene);
            if (message.bussdesc != null && Object.hasOwnProperty.call(message, "bussdesc"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.bussdesc);
            if (message.imglist != null && Object.hasOwnProperty.call(message, "imglist"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.imglist);
            if (message.pkgName != null && Object.hasOwnProperty.call(message, "pkgName"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.pkgName);
            if (message.lang != null && Object.hasOwnProperty.call(message, "lang"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.lang);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.amount);
            if (message.currency != null && Object.hasOwnProperty.call(message, "currency"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.currency);
            if (message.validDays != null && Object.hasOwnProperty.call(message, "validDays"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.validDays);
            if (message.pkgRights != null && Object.hasOwnProperty.call(message, "pkgRights"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.pkgRights);
            if (message.theme != null && Object.hasOwnProperty.call(message, "theme"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.theme);
            if (message.themeAuthor != null && Object.hasOwnProperty.call(message, "themeAuthor"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.themeAuthor);
            if (message.themeAppid != null && Object.hasOwnProperty.call(message, "themeAppid"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.themeAppid);
            if (message.serviceAppid != null && Object.hasOwnProperty.call(message, "serviceAppid"))
                writer.uint32(/* id 14, wireType 2 =*/114).string(message.serviceAppid);
            if (message.chainPkgId != null && Object.hasOwnProperty.call(message, "chainPkgId"))
                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.chainPkgId);
            if (message.spaceSize != null && Object.hasOwnProperty.call(message, "spaceSize"))
                writer.uint32(/* id 16, wireType 0 =*/128).int32(message.spaceSize);
            return writer;
        };

        /**
         * Encodes the specified ApplyBussPackageRequest message, length delimited. Does not implicitly {@link pb.ApplyBussPackageRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {pb.IApplyBussPackageRequest} message ApplyBussPackageRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApplyBussPackageRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ApplyBussPackageRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.ApplyBussPackageRequest} ApplyBussPackageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApplyBussPackageRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.ApplyBussPackageRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.pkgType = reader.int32();
                        break;
                    }
                case 2: {
                        message.scene = reader.string();
                        break;
                    }
                case 3: {
                        message.bussdesc = reader.string();
                        break;
                    }
                case 4: {
                        message.imglist = reader.string();
                        break;
                    }
                case 5: {
                        message.pkgName = reader.string();
                        break;
                    }
                case 6: {
                        message.lang = reader.string();
                        break;
                    }
                case 7: {
                        message.amount = reader.int32();
                        break;
                    }
                case 8: {
                        message.currency = reader.string();
                        break;
                    }
                case 9: {
                        message.validDays = reader.int32();
                        break;
                    }
                case 10: {
                        message.pkgRights = reader.string();
                        break;
                    }
                case 11: {
                        message.theme = reader.string();
                        break;
                    }
                case 12: {
                        message.themeAuthor = reader.string();
                        break;
                    }
                case 13: {
                        message.themeAppid = reader.string();
                        break;
                    }
                case 14: {
                        message.serviceAppid = reader.string();
                        break;
                    }
                case 15: {
                        message.chainPkgId = reader.int32();
                        break;
                    }
                case 16: {
                        message.spaceSize = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ApplyBussPackageRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.ApplyBussPackageRequest} ApplyBussPackageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApplyBussPackageRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ApplyBussPackageRequest message.
         * @function verify
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ApplyBussPackageRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                if (!$util.isInteger(message.pkgType))
                    return "pkgType: integer expected";
            if (message.scene != null && message.hasOwnProperty("scene"))
                if (!$util.isString(message.scene))
                    return "scene: string expected";
            if (message.bussdesc != null && message.hasOwnProperty("bussdesc"))
                if (!$util.isString(message.bussdesc))
                    return "bussdesc: string expected";
            if (message.imglist != null && message.hasOwnProperty("imglist"))
                if (!$util.isString(message.imglist))
                    return "imglist: string expected";
            if (message.pkgName != null && message.hasOwnProperty("pkgName"))
                if (!$util.isString(message.pkgName))
                    return "pkgName: string expected";
            if (message.lang != null && message.hasOwnProperty("lang"))
                if (!$util.isString(message.lang))
                    return "lang: string expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount))
                    return "amount: integer expected";
            if (message.currency != null && message.hasOwnProperty("currency"))
                if (!$util.isString(message.currency))
                    return "currency: string expected";
            if (message.validDays != null && message.hasOwnProperty("validDays"))
                if (!$util.isInteger(message.validDays))
                    return "validDays: integer expected";
            if (message.pkgRights != null && message.hasOwnProperty("pkgRights"))
                if (!$util.isString(message.pkgRights))
                    return "pkgRights: string expected";
            if (message.theme != null && message.hasOwnProperty("theme"))
                if (!$util.isString(message.theme))
                    return "theme: string expected";
            if (message.themeAuthor != null && message.hasOwnProperty("themeAuthor"))
                if (!$util.isString(message.themeAuthor))
                    return "themeAuthor: string expected";
            if (message.themeAppid != null && message.hasOwnProperty("themeAppid"))
                if (!$util.isString(message.themeAppid))
                    return "themeAppid: string expected";
            if (message.serviceAppid != null && message.hasOwnProperty("serviceAppid"))
                if (!$util.isString(message.serviceAppid))
                    return "serviceAppid: string expected";
            if (message.chainPkgId != null && message.hasOwnProperty("chainPkgId"))
                if (!$util.isInteger(message.chainPkgId))
                    return "chainPkgId: integer expected";
            if (message.spaceSize != null && message.hasOwnProperty("spaceSize"))
                if (!$util.isInteger(message.spaceSize))
                    return "spaceSize: integer expected";
            return null;
        };

        /**
         * Creates an ApplyBussPackageRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.ApplyBussPackageRequest} ApplyBussPackageRequest
         */
        ApplyBussPackageRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.ApplyBussPackageRequest)
                return object;
            let message = new $root.pb.ApplyBussPackageRequest();
            if (object.pkgType != null)
                message.pkgType = object.pkgType | 0;
            if (object.scene != null)
                message.scene = String(object.scene);
            if (object.bussdesc != null)
                message.bussdesc = String(object.bussdesc);
            if (object.imglist != null)
                message.imglist = String(object.imglist);
            if (object.pkgName != null)
                message.pkgName = String(object.pkgName);
            if (object.lang != null)
                message.lang = String(object.lang);
            if (object.amount != null)
                message.amount = object.amount | 0;
            if (object.currency != null)
                message.currency = String(object.currency);
            if (object.validDays != null)
                message.validDays = object.validDays | 0;
            if (object.pkgRights != null)
                message.pkgRights = String(object.pkgRights);
            if (object.theme != null)
                message.theme = String(object.theme);
            if (object.themeAuthor != null)
                message.themeAuthor = String(object.themeAuthor);
            if (object.themeAppid != null)
                message.themeAppid = String(object.themeAppid);
            if (object.serviceAppid != null)
                message.serviceAppid = String(object.serviceAppid);
            if (object.chainPkgId != null)
                message.chainPkgId = object.chainPkgId | 0;
            if (object.spaceSize != null)
                message.spaceSize = object.spaceSize | 0;
            return message;
        };

        /**
         * Creates a plain object from an ApplyBussPackageRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {pb.ApplyBussPackageRequest} message ApplyBussPackageRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ApplyBussPackageRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pkgType = 0;
                object.scene = "";
                object.bussdesc = "";
                object.imglist = "";
                object.pkgName = "";
                object.lang = "";
                object.amount = 0;
                object.currency = "";
                object.validDays = 0;
                object.pkgRights = "";
                object.theme = "";
                object.themeAuthor = "";
                object.themeAppid = "";
                object.serviceAppid = "";
                object.chainPkgId = 0;
                object.spaceSize = 0;
            }
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                object.pkgType = message.pkgType;
            if (message.scene != null && message.hasOwnProperty("scene"))
                object.scene = message.scene;
            if (message.bussdesc != null && message.hasOwnProperty("bussdesc"))
                object.bussdesc = message.bussdesc;
            if (message.imglist != null && message.hasOwnProperty("imglist"))
                object.imglist = message.imglist;
            if (message.pkgName != null && message.hasOwnProperty("pkgName"))
                object.pkgName = message.pkgName;
            if (message.lang != null && message.hasOwnProperty("lang"))
                object.lang = message.lang;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = message.amount;
            if (message.currency != null && message.hasOwnProperty("currency"))
                object.currency = message.currency;
            if (message.validDays != null && message.hasOwnProperty("validDays"))
                object.validDays = message.validDays;
            if (message.pkgRights != null && message.hasOwnProperty("pkgRights"))
                object.pkgRights = message.pkgRights;
            if (message.theme != null && message.hasOwnProperty("theme"))
                object.theme = message.theme;
            if (message.themeAuthor != null && message.hasOwnProperty("themeAuthor"))
                object.themeAuthor = message.themeAuthor;
            if (message.themeAppid != null && message.hasOwnProperty("themeAppid"))
                object.themeAppid = message.themeAppid;
            if (message.serviceAppid != null && message.hasOwnProperty("serviceAppid"))
                object.serviceAppid = message.serviceAppid;
            if (message.chainPkgId != null && message.hasOwnProperty("chainPkgId"))
                object.chainPkgId = message.chainPkgId;
            if (message.spaceSize != null && message.hasOwnProperty("spaceSize"))
                object.spaceSize = message.spaceSize;
            return object;
        };

        /**
         * Converts this ApplyBussPackageRequest to JSON.
         * @function toJSON
         * @memberof pb.ApplyBussPackageRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ApplyBussPackageRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ApplyBussPackageRequest
         * @function getTypeUrl
         * @memberof pb.ApplyBussPackageRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ApplyBussPackageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.ApplyBussPackageRequest";
        };

        return ApplyBussPackageRequest;
    })();

    pb.ApplyBussPackageResponse = (function() {

        /**
         * Properties of an ApplyBussPackageResponse.
         * @memberof pb
         * @interface IApplyBussPackageResponse
         * @property {number|null} [code] ApplyBussPackageResponse code
         * @property {string|null} [msg] ApplyBussPackageResponse msg
         * @property {pb.IPackageInfo|null} [data] ApplyBussPackageResponse data
         */

        /**
         * Constructs a new ApplyBussPackageResponse.
         * @memberof pb
         * @classdesc Represents an ApplyBussPackageResponse.
         * @implements IApplyBussPackageResponse
         * @constructor
         * @param {pb.IApplyBussPackageResponse=} [properties] Properties to set
         */
        function ApplyBussPackageResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ApplyBussPackageResponse code.
         * @member {number} code
         * @memberof pb.ApplyBussPackageResponse
         * @instance
         */
        ApplyBussPackageResponse.prototype.code = 0;

        /**
         * ApplyBussPackageResponse msg.
         * @member {string} msg
         * @memberof pb.ApplyBussPackageResponse
         * @instance
         */
        ApplyBussPackageResponse.prototype.msg = "";

        /**
         * ApplyBussPackageResponse data.
         * @member {pb.IPackageInfo|null|undefined} data
         * @memberof pb.ApplyBussPackageResponse
         * @instance
         */
        ApplyBussPackageResponse.prototype.data = null;

        /**
         * Creates a new ApplyBussPackageResponse instance using the specified properties.
         * @function create
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {pb.IApplyBussPackageResponse=} [properties] Properties to set
         * @returns {pb.ApplyBussPackageResponse} ApplyBussPackageResponse instance
         */
        ApplyBussPackageResponse.create = function create(properties) {
            return new ApplyBussPackageResponse(properties);
        };

        /**
         * Encodes the specified ApplyBussPackageResponse message. Does not implicitly {@link pb.ApplyBussPackageResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {pb.IApplyBussPackageResponse} message ApplyBussPackageResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApplyBussPackageResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.PackageInfo.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ApplyBussPackageResponse message, length delimited. Does not implicitly {@link pb.ApplyBussPackageResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {pb.IApplyBussPackageResponse} message ApplyBussPackageResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ApplyBussPackageResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ApplyBussPackageResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.ApplyBussPackageResponse} ApplyBussPackageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApplyBussPackageResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.ApplyBussPackageResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.PackageInfo.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ApplyBussPackageResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.ApplyBussPackageResponse} ApplyBussPackageResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ApplyBussPackageResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ApplyBussPackageResponse message.
         * @function verify
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ApplyBussPackageResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.PackageInfo.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates an ApplyBussPackageResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.ApplyBussPackageResponse} ApplyBussPackageResponse
         */
        ApplyBussPackageResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.ApplyBussPackageResponse)
                return object;
            let message = new $root.pb.ApplyBussPackageResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.ApplyBussPackageResponse.data: object expected");
                message.data = $root.pb.PackageInfo.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from an ApplyBussPackageResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {pb.ApplyBussPackageResponse} message ApplyBussPackageResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ApplyBussPackageResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.PackageInfo.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this ApplyBussPackageResponse to JSON.
         * @function toJSON
         * @memberof pb.ApplyBussPackageResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ApplyBussPackageResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ApplyBussPackageResponse
         * @function getTypeUrl
         * @memberof pb.ApplyBussPackageResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ApplyBussPackageResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.ApplyBussPackageResponse";
        };

        return ApplyBussPackageResponse;
    })();

    pb.GetAllPackagesConfigRequest = (function() {

        /**
         * Properties of a GetAllPackagesConfigRequest.
         * @memberof pb
         * @interface IGetAllPackagesConfigRequest
         * @property {number|null} [pageNum] GetAllPackagesConfigRequest pageNum
         * @property {number|null} [pageSize] GetAllPackagesConfigRequest pageSize
         * @property {number|null} [pkgType] GetAllPackagesConfigRequest pkgType
         * @property {number|null} [checkStatus] GetAllPackagesConfigRequest checkStatus
         * @property {string|null} [appid] GetAllPackagesConfigRequest appid
         */

        /**
         * Constructs a new GetAllPackagesConfigRequest.
         * @memberof pb
         * @classdesc Represents a GetAllPackagesConfigRequest.
         * @implements IGetAllPackagesConfigRequest
         * @constructor
         * @param {pb.IGetAllPackagesConfigRequest=} [properties] Properties to set
         */
        function GetAllPackagesConfigRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetAllPackagesConfigRequest pageNum.
         * @member {number} pageNum
         * @memberof pb.GetAllPackagesConfigRequest
         * @instance
         */
        GetAllPackagesConfigRequest.prototype.pageNum = 0;

        /**
         * GetAllPackagesConfigRequest pageSize.
         * @member {number} pageSize
         * @memberof pb.GetAllPackagesConfigRequest
         * @instance
         */
        GetAllPackagesConfigRequest.prototype.pageSize = 0;

        /**
         * GetAllPackagesConfigRequest pkgType.
         * @member {number} pkgType
         * @memberof pb.GetAllPackagesConfigRequest
         * @instance
         */
        GetAllPackagesConfigRequest.prototype.pkgType = 0;

        /**
         * GetAllPackagesConfigRequest checkStatus.
         * @member {number} checkStatus
         * @memberof pb.GetAllPackagesConfigRequest
         * @instance
         */
        GetAllPackagesConfigRequest.prototype.checkStatus = 0;

        /**
         * GetAllPackagesConfigRequest appid.
         * @member {string} appid
         * @memberof pb.GetAllPackagesConfigRequest
         * @instance
         */
        GetAllPackagesConfigRequest.prototype.appid = "";

        /**
         * Creates a new GetAllPackagesConfigRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {pb.IGetAllPackagesConfigRequest=} [properties] Properties to set
         * @returns {pb.GetAllPackagesConfigRequest} GetAllPackagesConfigRequest instance
         */
        GetAllPackagesConfigRequest.create = function create(properties) {
            return new GetAllPackagesConfigRequest(properties);
        };

        /**
         * Encodes the specified GetAllPackagesConfigRequest message. Does not implicitly {@link pb.GetAllPackagesConfigRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {pb.IGetAllPackagesConfigRequest} message GetAllPackagesConfigRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllPackagesConfigRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pageNum != null && Object.hasOwnProperty.call(message, "pageNum"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pageNum);
            if (message.pageSize != null && Object.hasOwnProperty.call(message, "pageSize"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pageSize);
            if (message.pkgType != null && Object.hasOwnProperty.call(message, "pkgType"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.pkgType);
            if (message.checkStatus != null && Object.hasOwnProperty.call(message, "checkStatus"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.checkStatus);
            if (message.appid != null && Object.hasOwnProperty.call(message, "appid"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.appid);
            return writer;
        };

        /**
         * Encodes the specified GetAllPackagesConfigRequest message, length delimited. Does not implicitly {@link pb.GetAllPackagesConfigRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {pb.IGetAllPackagesConfigRequest} message GetAllPackagesConfigRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllPackagesConfigRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetAllPackagesConfigRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetAllPackagesConfigRequest} GetAllPackagesConfigRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllPackagesConfigRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetAllPackagesConfigRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.pageNum = reader.int32();
                        break;
                    }
                case 2: {
                        message.pageSize = reader.int32();
                        break;
                    }
                case 3: {
                        message.pkgType = reader.int32();
                        break;
                    }
                case 4: {
                        message.checkStatus = reader.int32();
                        break;
                    }
                case 5: {
                        message.appid = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetAllPackagesConfigRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetAllPackagesConfigRequest} GetAllPackagesConfigRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllPackagesConfigRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetAllPackagesConfigRequest message.
         * @function verify
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetAllPackagesConfigRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pageNum != null && message.hasOwnProperty("pageNum"))
                if (!$util.isInteger(message.pageNum))
                    return "pageNum: integer expected";
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                if (!$util.isInteger(message.pageSize))
                    return "pageSize: integer expected";
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                if (!$util.isInteger(message.pkgType))
                    return "pkgType: integer expected";
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                if (!$util.isInteger(message.checkStatus))
                    return "checkStatus: integer expected";
            if (message.appid != null && message.hasOwnProperty("appid"))
                if (!$util.isString(message.appid))
                    return "appid: string expected";
            return null;
        };

        /**
         * Creates a GetAllPackagesConfigRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetAllPackagesConfigRequest} GetAllPackagesConfigRequest
         */
        GetAllPackagesConfigRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetAllPackagesConfigRequest)
                return object;
            let message = new $root.pb.GetAllPackagesConfigRequest();
            if (object.pageNum != null)
                message.pageNum = object.pageNum | 0;
            if (object.pageSize != null)
                message.pageSize = object.pageSize | 0;
            if (object.pkgType != null)
                message.pkgType = object.pkgType | 0;
            if (object.checkStatus != null)
                message.checkStatus = object.checkStatus | 0;
            if (object.appid != null)
                message.appid = String(object.appid);
            return message;
        };

        /**
         * Creates a plain object from a GetAllPackagesConfigRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {pb.GetAllPackagesConfigRequest} message GetAllPackagesConfigRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetAllPackagesConfigRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pageNum = 0;
                object.pageSize = 0;
                object.pkgType = 0;
                object.checkStatus = 0;
                object.appid = "";
            }
            if (message.pageNum != null && message.hasOwnProperty("pageNum"))
                object.pageNum = message.pageNum;
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                object.pageSize = message.pageSize;
            if (message.pkgType != null && message.hasOwnProperty("pkgType"))
                object.pkgType = message.pkgType;
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                object.checkStatus = message.checkStatus;
            if (message.appid != null && message.hasOwnProperty("appid"))
                object.appid = message.appid;
            return object;
        };

        /**
         * Converts this GetAllPackagesConfigRequest to JSON.
         * @function toJSON
         * @memberof pb.GetAllPackagesConfigRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetAllPackagesConfigRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetAllPackagesConfigRequest
         * @function getTypeUrl
         * @memberof pb.GetAllPackagesConfigRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetAllPackagesConfigRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetAllPackagesConfigRequest";
        };

        return GetAllPackagesConfigRequest;
    })();

    pb.GetAllPackagesConfigData = (function() {

        /**
         * Properties of a GetAllPackagesConfigData.
         * @memberof pb
         * @interface IGetAllPackagesConfigData
         * @property {Array.<pb.IPackageInfo>|null} [list] GetAllPackagesConfigData list
         * @property {number|Long|null} [total] GetAllPackagesConfigData total
         * @property {number|null} [pageNum] GetAllPackagesConfigData pageNum
         * @property {number|null} [pageSize] GetAllPackagesConfigData pageSize
         */

        /**
         * Constructs a new GetAllPackagesConfigData.
         * @memberof pb
         * @classdesc Represents a GetAllPackagesConfigData.
         * @implements IGetAllPackagesConfigData
         * @constructor
         * @param {pb.IGetAllPackagesConfigData=} [properties] Properties to set
         */
        function GetAllPackagesConfigData(properties) {
            this.list = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetAllPackagesConfigData list.
         * @member {Array.<pb.IPackageInfo>} list
         * @memberof pb.GetAllPackagesConfigData
         * @instance
         */
        GetAllPackagesConfigData.prototype.list = $util.emptyArray;

        /**
         * GetAllPackagesConfigData total.
         * @member {number|Long} total
         * @memberof pb.GetAllPackagesConfigData
         * @instance
         */
        GetAllPackagesConfigData.prototype.total = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * GetAllPackagesConfigData pageNum.
         * @member {number} pageNum
         * @memberof pb.GetAllPackagesConfigData
         * @instance
         */
        GetAllPackagesConfigData.prototype.pageNum = 0;

        /**
         * GetAllPackagesConfigData pageSize.
         * @member {number} pageSize
         * @memberof pb.GetAllPackagesConfigData
         * @instance
         */
        GetAllPackagesConfigData.prototype.pageSize = 0;

        /**
         * Creates a new GetAllPackagesConfigData instance using the specified properties.
         * @function create
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {pb.IGetAllPackagesConfigData=} [properties] Properties to set
         * @returns {pb.GetAllPackagesConfigData} GetAllPackagesConfigData instance
         */
        GetAllPackagesConfigData.create = function create(properties) {
            return new GetAllPackagesConfigData(properties);
        };

        /**
         * Encodes the specified GetAllPackagesConfigData message. Does not implicitly {@link pb.GetAllPackagesConfigData.verify|verify} messages.
         * @function encode
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {pb.IGetAllPackagesConfigData} message GetAllPackagesConfigData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllPackagesConfigData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.list.length)
                for (let i = 0; i < message.list.length; ++i)
                    $root.pb.PackageInfo.encode(message.list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.total);
            if (message.pageNum != null && Object.hasOwnProperty.call(message, "pageNum"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.pageNum);
            if (message.pageSize != null && Object.hasOwnProperty.call(message, "pageSize"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.pageSize);
            return writer;
        };

        /**
         * Encodes the specified GetAllPackagesConfigData message, length delimited. Does not implicitly {@link pb.GetAllPackagesConfigData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {pb.IGetAllPackagesConfigData} message GetAllPackagesConfigData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllPackagesConfigData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetAllPackagesConfigData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetAllPackagesConfigData} GetAllPackagesConfigData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllPackagesConfigData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetAllPackagesConfigData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.list && message.list.length))
                            message.list = [];
                        message.list.push($root.pb.PackageInfo.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        message.total = reader.int64();
                        break;
                    }
                case 3: {
                        message.pageNum = reader.int32();
                        break;
                    }
                case 4: {
                        message.pageSize = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetAllPackagesConfigData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetAllPackagesConfigData} GetAllPackagesConfigData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllPackagesConfigData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetAllPackagesConfigData message.
         * @function verify
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetAllPackagesConfigData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.list != null && message.hasOwnProperty("list")) {
                if (!Array.isArray(message.list))
                    return "list: array expected";
                for (let i = 0; i < message.list.length; ++i) {
                    let error = $root.pb.PackageInfo.verify(message.list[i]);
                    if (error)
                        return "list." + error;
                }
            }
            if (message.total != null && message.hasOwnProperty("total"))
                if (!$util.isInteger(message.total) && !(message.total && $util.isInteger(message.total.low) && $util.isInteger(message.total.high)))
                    return "total: integer|Long expected";
            if (message.pageNum != null && message.hasOwnProperty("pageNum"))
                if (!$util.isInteger(message.pageNum))
                    return "pageNum: integer expected";
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                if (!$util.isInteger(message.pageSize))
                    return "pageSize: integer expected";
            return null;
        };

        /**
         * Creates a GetAllPackagesConfigData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetAllPackagesConfigData} GetAllPackagesConfigData
         */
        GetAllPackagesConfigData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetAllPackagesConfigData)
                return object;
            let message = new $root.pb.GetAllPackagesConfigData();
            if (object.list) {
                if (!Array.isArray(object.list))
                    throw TypeError(".pb.GetAllPackagesConfigData.list: array expected");
                message.list = [];
                for (let i = 0; i < object.list.length; ++i) {
                    if (typeof object.list[i] !== "object")
                        throw TypeError(".pb.GetAllPackagesConfigData.list: object expected");
                    message.list[i] = $root.pb.PackageInfo.fromObject(object.list[i]);
                }
            }
            if (object.total != null)
                if ($util.Long)
                    (message.total = $util.Long.fromValue(object.total)).unsigned = false;
                else if (typeof object.total === "string")
                    message.total = parseInt(object.total, 10);
                else if (typeof object.total === "number")
                    message.total = object.total;
                else if (typeof object.total === "object")
                    message.total = new $util.LongBits(object.total.low >>> 0, object.total.high >>> 0).toNumber();
            if (object.pageNum != null)
                message.pageNum = object.pageNum | 0;
            if (object.pageSize != null)
                message.pageSize = object.pageSize | 0;
            return message;
        };

        /**
         * Creates a plain object from a GetAllPackagesConfigData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {pb.GetAllPackagesConfigData} message GetAllPackagesConfigData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetAllPackagesConfigData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.list = [];
            if (options.defaults) {
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.total = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.total = options.longs === String ? "0" : 0;
                object.pageNum = 0;
                object.pageSize = 0;
            }
            if (message.list && message.list.length) {
                object.list = [];
                for (let j = 0; j < message.list.length; ++j)
                    object.list[j] = $root.pb.PackageInfo.toObject(message.list[j], options);
            }
            if (message.total != null && message.hasOwnProperty("total"))
                if (typeof message.total === "number")
                    object.total = options.longs === String ? String(message.total) : message.total;
                else
                    object.total = options.longs === String ? $util.Long.prototype.toString.call(message.total) : options.longs === Number ? new $util.LongBits(message.total.low >>> 0, message.total.high >>> 0).toNumber() : message.total;
            if (message.pageNum != null && message.hasOwnProperty("pageNum"))
                object.pageNum = message.pageNum;
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                object.pageSize = message.pageSize;
            return object;
        };

        /**
         * Converts this GetAllPackagesConfigData to JSON.
         * @function toJSON
         * @memberof pb.GetAllPackagesConfigData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetAllPackagesConfigData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetAllPackagesConfigData
         * @function getTypeUrl
         * @memberof pb.GetAllPackagesConfigData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetAllPackagesConfigData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetAllPackagesConfigData";
        };

        return GetAllPackagesConfigData;
    })();

    pb.GetAllPackagesConfigResponse = (function() {

        /**
         * Properties of a GetAllPackagesConfigResponse.
         * @memberof pb
         * @interface IGetAllPackagesConfigResponse
         * @property {number|null} [code] GetAllPackagesConfigResponse code
         * @property {string|null} [msg] GetAllPackagesConfigResponse msg
         * @property {pb.IGetAllPackagesConfigData|null} [data] GetAllPackagesConfigResponse data
         */

        /**
         * Constructs a new GetAllPackagesConfigResponse.
         * @memberof pb
         * @classdesc Represents a GetAllPackagesConfigResponse.
         * @implements IGetAllPackagesConfigResponse
         * @constructor
         * @param {pb.IGetAllPackagesConfigResponse=} [properties] Properties to set
         */
        function GetAllPackagesConfigResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetAllPackagesConfigResponse code.
         * @member {number} code
         * @memberof pb.GetAllPackagesConfigResponse
         * @instance
         */
        GetAllPackagesConfigResponse.prototype.code = 0;

        /**
         * GetAllPackagesConfigResponse msg.
         * @member {string} msg
         * @memberof pb.GetAllPackagesConfigResponse
         * @instance
         */
        GetAllPackagesConfigResponse.prototype.msg = "";

        /**
         * GetAllPackagesConfigResponse data.
         * @member {pb.IGetAllPackagesConfigData|null|undefined} data
         * @memberof pb.GetAllPackagesConfigResponse
         * @instance
         */
        GetAllPackagesConfigResponse.prototype.data = null;

        /**
         * Creates a new GetAllPackagesConfigResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {pb.IGetAllPackagesConfigResponse=} [properties] Properties to set
         * @returns {pb.GetAllPackagesConfigResponse} GetAllPackagesConfigResponse instance
         */
        GetAllPackagesConfigResponse.create = function create(properties) {
            return new GetAllPackagesConfigResponse(properties);
        };

        /**
         * Encodes the specified GetAllPackagesConfigResponse message. Does not implicitly {@link pb.GetAllPackagesConfigResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {pb.IGetAllPackagesConfigResponse} message GetAllPackagesConfigResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllPackagesConfigResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.GetAllPackagesConfigData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetAllPackagesConfigResponse message, length delimited. Does not implicitly {@link pb.GetAllPackagesConfigResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {pb.IGetAllPackagesConfigResponse} message GetAllPackagesConfigResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetAllPackagesConfigResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetAllPackagesConfigResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetAllPackagesConfigResponse} GetAllPackagesConfigResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllPackagesConfigResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetAllPackagesConfigResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.GetAllPackagesConfigData.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetAllPackagesConfigResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetAllPackagesConfigResponse} GetAllPackagesConfigResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetAllPackagesConfigResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetAllPackagesConfigResponse message.
         * @function verify
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetAllPackagesConfigResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.GetAllPackagesConfigData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a GetAllPackagesConfigResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetAllPackagesConfigResponse} GetAllPackagesConfigResponse
         */
        GetAllPackagesConfigResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetAllPackagesConfigResponse)
                return object;
            let message = new $root.pb.GetAllPackagesConfigResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetAllPackagesConfigResponse.data: object expected");
                message.data = $root.pb.GetAllPackagesConfigData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetAllPackagesConfigResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {pb.GetAllPackagesConfigResponse} message GetAllPackagesConfigResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetAllPackagesConfigResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.GetAllPackagesConfigData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this GetAllPackagesConfigResponse to JSON.
         * @function toJSON
         * @memberof pb.GetAllPackagesConfigResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetAllPackagesConfigResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetAllPackagesConfigResponse
         * @function getTypeUrl
         * @memberof pb.GetAllPackagesConfigResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetAllPackagesConfigResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetAllPackagesConfigResponse";
        };

        return GetAllPackagesConfigResponse;
    })();

    pb.CreateOrderRequest = (function() {

        /**
         * Properties of a CreateOrderRequest.
         * @memberof pb
         * @interface ICreateOrderRequest
         * @property {string|null} [account] CreateOrderRequest account
         * @property {number|null} [pkgId] CreateOrderRequest pkgId
         * @property {string|null} [description] CreateOrderRequest description
         * @property {pb.IAmountInfo|null} [amount] CreateOrderRequest amount
         * @property {string|null} [timeExpire] CreateOrderRequest timeExpire
         * @property {string|null} [dappid] CreateOrderRequest dappid
         * @property {string|null} [attach] CreateOrderRequest attach
         * @property {string|null} [openid] CreateOrderRequest openid
         * @property {string|null} [wechatAuthCode] CreateOrderRequest wechatAuthCode
         */

        /**
         * Constructs a new CreateOrderRequest.
         * @memberof pb
         * @classdesc Represents a CreateOrderRequest.
         * @implements ICreateOrderRequest
         * @constructor
         * @param {pb.ICreateOrderRequest=} [properties] Properties to set
         */
        function CreateOrderRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateOrderRequest account.
         * @member {string} account
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.account = "";

        /**
         * CreateOrderRequest pkgId.
         * @member {number} pkgId
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.pkgId = 0;

        /**
         * CreateOrderRequest description.
         * @member {string} description
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.description = "";

        /**
         * CreateOrderRequest amount.
         * @member {pb.IAmountInfo|null|undefined} amount
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.amount = null;

        /**
         * CreateOrderRequest timeExpire.
         * @member {string} timeExpire
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.timeExpire = "";

        /**
         * CreateOrderRequest dappid.
         * @member {string} dappid
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.dappid = "";

        /**
         * CreateOrderRequest attach.
         * @member {string} attach
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.attach = "";

        /**
         * CreateOrderRequest openid.
         * @member {string} openid
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.openid = "";

        /**
         * CreateOrderRequest wechatAuthCode.
         * @member {string} wechatAuthCode
         * @memberof pb.CreateOrderRequest
         * @instance
         */
        CreateOrderRequest.prototype.wechatAuthCode = "";

        /**
         * Creates a new CreateOrderRequest instance using the specified properties.
         * @function create
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.ICreateOrderRequest=} [properties] Properties to set
         * @returns {pb.CreateOrderRequest} CreateOrderRequest instance
         */
        CreateOrderRequest.create = function create(properties) {
            return new CreateOrderRequest(properties);
        };

        /**
         * Encodes the specified CreateOrderRequest message. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.ICreateOrderRequest} message CreateOrderRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.account);
            if (message.pkgId != null && Object.hasOwnProperty.call(message, "pkgId"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pkgId);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.description);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                $root.pb.AmountInfo.encode(message.amount, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.timeExpire != null && Object.hasOwnProperty.call(message, "timeExpire"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.timeExpire);
            if (message.dappid != null && Object.hasOwnProperty.call(message, "dappid"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.dappid);
            if (message.attach != null && Object.hasOwnProperty.call(message, "attach"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.attach);
            if (message.openid != null && Object.hasOwnProperty.call(message, "openid"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.openid);
            if (message.wechatAuthCode != null && Object.hasOwnProperty.call(message, "wechatAuthCode"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.wechatAuthCode);
            return writer;
        };

        /**
         * Encodes the specified CreateOrderRequest message, length delimited. Does not implicitly {@link pb.CreateOrderRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.ICreateOrderRequest} message CreateOrderRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateOrderRequest} CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateOrderRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.account = reader.string();
                        break;
                    }
                case 2: {
                        message.pkgId = reader.int32();
                        break;
                    }
                case 3: {
                        message.description = reader.string();
                        break;
                    }
                case 4: {
                        message.amount = $root.pb.AmountInfo.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.timeExpire = reader.string();
                        break;
                    }
                case 6: {
                        message.dappid = reader.string();
                        break;
                    }
                case 7: {
                        message.attach = reader.string();
                        break;
                    }
                case 8: {
                        message.openid = reader.string();
                        break;
                    }
                case 9: {
                        message.wechatAuthCode = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateOrderRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateOrderRequest} CreateOrderRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateOrderRequest message.
         * @function verify
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateOrderRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.account != null && message.hasOwnProperty("account"))
                if (!$util.isString(message.account))
                    return "account: string expected";
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                if (!$util.isInteger(message.pkgId))
                    return "pkgId: integer expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.amount != null && message.hasOwnProperty("amount")) {
                let error = $root.pb.AmountInfo.verify(message.amount);
                if (error)
                    return "amount." + error;
            }
            if (message.timeExpire != null && message.hasOwnProperty("timeExpire"))
                if (!$util.isString(message.timeExpire))
                    return "timeExpire: string expected";
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                if (!$util.isString(message.dappid))
                    return "dappid: string expected";
            if (message.attach != null && message.hasOwnProperty("attach"))
                if (!$util.isString(message.attach))
                    return "attach: string expected";
            if (message.openid != null && message.hasOwnProperty("openid"))
                if (!$util.isString(message.openid))
                    return "openid: string expected";
            if (message.wechatAuthCode != null && message.hasOwnProperty("wechatAuthCode"))
                if (!$util.isString(message.wechatAuthCode))
                    return "wechatAuthCode: string expected";
            return null;
        };

        /**
         * Creates a CreateOrderRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateOrderRequest} CreateOrderRequest
         */
        CreateOrderRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateOrderRequest)
                return object;
            let message = new $root.pb.CreateOrderRequest();
            if (object.account != null)
                message.account = String(object.account);
            if (object.pkgId != null)
                message.pkgId = object.pkgId | 0;
            if (object.description != null)
                message.description = String(object.description);
            if (object.amount != null) {
                if (typeof object.amount !== "object")
                    throw TypeError(".pb.CreateOrderRequest.amount: object expected");
                message.amount = $root.pb.AmountInfo.fromObject(object.amount);
            }
            if (object.timeExpire != null)
                message.timeExpire = String(object.timeExpire);
            if (object.dappid != null)
                message.dappid = String(object.dappid);
            if (object.attach != null)
                message.attach = String(object.attach);
            if (object.openid != null)
                message.openid = String(object.openid);
            if (object.wechatAuthCode != null)
                message.wechatAuthCode = String(object.wechatAuthCode);
            return message;
        };

        /**
         * Creates a plain object from a CreateOrderRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {pb.CreateOrderRequest} message CreateOrderRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateOrderRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.account = "";
                object.pkgId = 0;
                object.description = "";
                object.amount = null;
                object.timeExpire = "";
                object.dappid = "";
                object.attach = "";
                object.openid = "";
                object.wechatAuthCode = "";
            }
            if (message.account != null && message.hasOwnProperty("account"))
                object.account = message.account;
            if (message.pkgId != null && message.hasOwnProperty("pkgId"))
                object.pkgId = message.pkgId;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.amount != null && message.hasOwnProperty("amount"))
                object.amount = $root.pb.AmountInfo.toObject(message.amount, options);
            if (message.timeExpire != null && message.hasOwnProperty("timeExpire"))
                object.timeExpire = message.timeExpire;
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                object.dappid = message.dappid;
            if (message.attach != null && message.hasOwnProperty("attach"))
                object.attach = message.attach;
            if (message.openid != null && message.hasOwnProperty("openid"))
                object.openid = message.openid;
            if (message.wechatAuthCode != null && message.hasOwnProperty("wechatAuthCode"))
                object.wechatAuthCode = message.wechatAuthCode;
            return object;
        };

        /**
         * Converts this CreateOrderRequest to JSON.
         * @function toJSON
         * @memberof pb.CreateOrderRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateOrderRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateOrderRequest
         * @function getTypeUrl
         * @memberof pb.CreateOrderRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateOrderRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.CreateOrderRequest";
        };

        return CreateOrderRequest;
    })();

    pb.AmountInfo = (function() {

        /**
         * Properties of an AmountInfo.
         * @memberof pb
         * @interface IAmountInfo
         * @property {number|null} [total] AmountInfo total
         */

        /**
         * Constructs a new AmountInfo.
         * @memberof pb
         * @classdesc Represents an AmountInfo.
         * @implements IAmountInfo
         * @constructor
         * @param {pb.IAmountInfo=} [properties] Properties to set
         */
        function AmountInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AmountInfo total.
         * @member {number} total
         * @memberof pb.AmountInfo
         * @instance
         */
        AmountInfo.prototype.total = 0;

        /**
         * Creates a new AmountInfo instance using the specified properties.
         * @function create
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.IAmountInfo=} [properties] Properties to set
         * @returns {pb.AmountInfo} AmountInfo instance
         */
        AmountInfo.create = function create(properties) {
            return new AmountInfo(properties);
        };

        /**
         * Encodes the specified AmountInfo message. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @function encode
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.IAmountInfo} message AmountInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AmountInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.total);
            return writer;
        };

        /**
         * Encodes the specified AmountInfo message, length delimited. Does not implicitly {@link pb.AmountInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.IAmountInfo} message AmountInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AmountInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AmountInfo message from the specified reader or buffer.
         * @function decode
         * @memberof pb.AmountInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.AmountInfo} AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AmountInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.AmountInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.total = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AmountInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.AmountInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.AmountInfo} AmountInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AmountInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AmountInfo message.
         * @function verify
         * @memberof pb.AmountInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AmountInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.total != null && message.hasOwnProperty("total"))
                if (!$util.isInteger(message.total))
                    return "total: integer expected";
            return null;
        };

        /**
         * Creates an AmountInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.AmountInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.AmountInfo} AmountInfo
         */
        AmountInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.AmountInfo)
                return object;
            let message = new $root.pb.AmountInfo();
            if (object.total != null)
                message.total = object.total | 0;
            return message;
        };

        /**
         * Creates a plain object from an AmountInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.AmountInfo
         * @static
         * @param {pb.AmountInfo} message AmountInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AmountInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.total = 0;
            if (message.total != null && message.hasOwnProperty("total"))
                object.total = message.total;
            return object;
        };

        /**
         * Converts this AmountInfo to JSON.
         * @function toJSON
         * @memberof pb.AmountInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AmountInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AmountInfo
         * @function getTypeUrl
         * @memberof pb.AmountInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AmountInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.AmountInfo";
        };

        return AmountInfo;
    })();

    pb.CreateOrderResponse = (function() {

        /**
         * Properties of a CreateOrderResponse.
         * @memberof pb
         * @interface ICreateOrderResponse
         * @property {number|null} [code] CreateOrderResponse code
         * @property {string|null} [msg] CreateOrderResponse msg
         * @property {pb.ICreateOrderData|null} [data] CreateOrderResponse data
         */

        /**
         * Constructs a new CreateOrderResponse.
         * @memberof pb
         * @classdesc Represents a CreateOrderResponse.
         * @implements ICreateOrderResponse
         * @constructor
         * @param {pb.ICreateOrderResponse=} [properties] Properties to set
         */
        function CreateOrderResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateOrderResponse code.
         * @member {number} code
         * @memberof pb.CreateOrderResponse
         * @instance
         */
        CreateOrderResponse.prototype.code = 0;

        /**
         * CreateOrderResponse msg.
         * @member {string} msg
         * @memberof pb.CreateOrderResponse
         * @instance
         */
        CreateOrderResponse.prototype.msg = "";

        /**
         * CreateOrderResponse data.
         * @member {pb.ICreateOrderData|null|undefined} data
         * @memberof pb.CreateOrderResponse
         * @instance
         */
        CreateOrderResponse.prototype.data = null;

        /**
         * Creates a new CreateOrderResponse instance using the specified properties.
         * @function create
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.ICreateOrderResponse=} [properties] Properties to set
         * @returns {pb.CreateOrderResponse} CreateOrderResponse instance
         */
        CreateOrderResponse.create = function create(properties) {
            return new CreateOrderResponse(properties);
        };

        /**
         * Encodes the specified CreateOrderResponse message. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.ICreateOrderResponse} message CreateOrderResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.CreateOrderData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CreateOrderResponse message, length delimited. Does not implicitly {@link pb.CreateOrderResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.ICreateOrderResponse} message CreateOrderResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateOrderResponse} CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateOrderResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.CreateOrderData.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateOrderResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateOrderResponse} CreateOrderResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateOrderResponse message.
         * @function verify
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateOrderResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.CreateOrderData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a CreateOrderResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateOrderResponse} CreateOrderResponse
         */
        CreateOrderResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateOrderResponse)
                return object;
            let message = new $root.pb.CreateOrderResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.CreateOrderResponse.data: object expected");
                message.data = $root.pb.CreateOrderData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a CreateOrderResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {pb.CreateOrderResponse} message CreateOrderResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateOrderResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.CreateOrderData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this CreateOrderResponse to JSON.
         * @function toJSON
         * @memberof pb.CreateOrderResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateOrderResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateOrderResponse
         * @function getTypeUrl
         * @memberof pb.CreateOrderResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateOrderResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.CreateOrderResponse";
        };

        return CreateOrderResponse;
    })();

    pb.CreateOrderData = (function() {

        /**
         * Properties of a CreateOrderData.
         * @memberof pb
         * @interface ICreateOrderData
         * @property {string|null} [outTradeNo] CreateOrderData outTradeNo
         */

        /**
         * Constructs a new CreateOrderData.
         * @memberof pb
         * @classdesc Represents a CreateOrderData.
         * @implements ICreateOrderData
         * @constructor
         * @param {pb.ICreateOrderData=} [properties] Properties to set
         */
        function CreateOrderData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateOrderData outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.CreateOrderData
         * @instance
         */
        CreateOrderData.prototype.outTradeNo = "";

        /**
         * Creates a new CreateOrderData instance using the specified properties.
         * @function create
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.ICreateOrderData=} [properties] Properties to set
         * @returns {pb.CreateOrderData} CreateOrderData instance
         */
        CreateOrderData.create = function create(properties) {
            return new CreateOrderData(properties);
        };

        /**
         * Encodes the specified CreateOrderData message. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.ICreateOrderData} message CreateOrderData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            return writer;
        };

        /**
         * Encodes the specified CreateOrderData message, length delimited. Does not implicitly {@link pb.CreateOrderData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.ICreateOrderData} message CreateOrderData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateOrderData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateOrderData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateOrderData} CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateOrderData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.outTradeNo = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateOrderData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateOrderData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateOrderData} CreateOrderData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateOrderData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateOrderData message.
         * @function verify
         * @memberof pb.CreateOrderData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateOrderData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            return null;
        };

        /**
         * Creates a CreateOrderData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateOrderData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateOrderData} CreateOrderData
         */
        CreateOrderData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateOrderData)
                return object;
            let message = new $root.pb.CreateOrderData();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            return message;
        };

        /**
         * Creates a plain object from a CreateOrderData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateOrderData
         * @static
         * @param {pb.CreateOrderData} message CreateOrderData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateOrderData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.outTradeNo = "";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            return object;
        };

        /**
         * Converts this CreateOrderData to JSON.
         * @function toJSON
         * @memberof pb.CreateOrderData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateOrderData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateOrderData
         * @function getTypeUrl
         * @memberof pb.CreateOrderData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateOrderData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.CreateOrderData";
        };

        return CreateOrderData;
    })();

    pb.GetNativePrepayRequest = (function() {

        /**
         * Properties of a GetNativePrepayRequest.
         * @memberof pb
         * @interface IGetNativePrepayRequest
         * @property {string|null} [outTradeNo] GetNativePrepayRequest outTradeNo
         */

        /**
         * Constructs a new GetNativePrepayRequest.
         * @memberof pb
         * @classdesc Represents a GetNativePrepayRequest.
         * @implements IGetNativePrepayRequest
         * @constructor
         * @param {pb.IGetNativePrepayRequest=} [properties] Properties to set
         */
        function GetNativePrepayRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetNativePrepayRequest outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.GetNativePrepayRequest
         * @instance
         */
        GetNativePrepayRequest.prototype.outTradeNo = "";

        /**
         * Creates a new GetNativePrepayRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.IGetNativePrepayRequest=} [properties] Properties to set
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest instance
         */
        GetNativePrepayRequest.create = function create(properties) {
            return new GetNativePrepayRequest(properties);
        };

        /**
         * Encodes the specified GetNativePrepayRequest message. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.IGetNativePrepayRequest} message GetNativePrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            return writer;
        };

        /**
         * Encodes the specified GetNativePrepayRequest message, length delimited. Does not implicitly {@link pb.GetNativePrepayRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.IGetNativePrepayRequest} message GetNativePrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetNativePrepayRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.outTradeNo = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetNativePrepayRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetNativePrepayRequest message.
         * @function verify
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetNativePrepayRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            return null;
        };

        /**
         * Creates a GetNativePrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetNativePrepayRequest} GetNativePrepayRequest
         */
        GetNativePrepayRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetNativePrepayRequest)
                return object;
            let message = new $root.pb.GetNativePrepayRequest();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            return message;
        };

        /**
         * Creates a plain object from a GetNativePrepayRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {pb.GetNativePrepayRequest} message GetNativePrepayRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetNativePrepayRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.outTradeNo = "";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            return object;
        };

        /**
         * Converts this GetNativePrepayRequest to JSON.
         * @function toJSON
         * @memberof pb.GetNativePrepayRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetNativePrepayRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetNativePrepayRequest
         * @function getTypeUrl
         * @memberof pb.GetNativePrepayRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetNativePrepayRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetNativePrepayRequest";
        };

        return GetNativePrepayRequest;
    })();

    pb.GetNativePrepayResponse = (function() {

        /**
         * Properties of a GetNativePrepayResponse.
         * @memberof pb
         * @interface IGetNativePrepayResponse
         * @property {number|null} [code] GetNativePrepayResponse code
         * @property {string|null} [msg] GetNativePrepayResponse msg
         * @property {pb.INativePrepayData|null} [data] GetNativePrepayResponse data
         */

        /**
         * Constructs a new GetNativePrepayResponse.
         * @memberof pb
         * @classdesc Represents a GetNativePrepayResponse.
         * @implements IGetNativePrepayResponse
         * @constructor
         * @param {pb.IGetNativePrepayResponse=} [properties] Properties to set
         */
        function GetNativePrepayResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetNativePrepayResponse code.
         * @member {number} code
         * @memberof pb.GetNativePrepayResponse
         * @instance
         */
        GetNativePrepayResponse.prototype.code = 0;

        /**
         * GetNativePrepayResponse msg.
         * @member {string} msg
         * @memberof pb.GetNativePrepayResponse
         * @instance
         */
        GetNativePrepayResponse.prototype.msg = "";

        /**
         * GetNativePrepayResponse data.
         * @member {pb.INativePrepayData|null|undefined} data
         * @memberof pb.GetNativePrepayResponse
         * @instance
         */
        GetNativePrepayResponse.prototype.data = null;

        /**
         * Creates a new GetNativePrepayResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.IGetNativePrepayResponse=} [properties] Properties to set
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse instance
         */
        GetNativePrepayResponse.create = function create(properties) {
            return new GetNativePrepayResponse(properties);
        };

        /**
         * Encodes the specified GetNativePrepayResponse message. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.IGetNativePrepayResponse} message GetNativePrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.NativePrepayData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetNativePrepayResponse message, length delimited. Does not implicitly {@link pb.GetNativePrepayResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.IGetNativePrepayResponse} message GetNativePrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetNativePrepayResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetNativePrepayResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.NativePrepayData.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetNativePrepayResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetNativePrepayResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetNativePrepayResponse message.
         * @function verify
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetNativePrepayResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.NativePrepayData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a GetNativePrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetNativePrepayResponse} GetNativePrepayResponse
         */
        GetNativePrepayResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetNativePrepayResponse)
                return object;
            let message = new $root.pb.GetNativePrepayResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetNativePrepayResponse.data: object expected");
                message.data = $root.pb.NativePrepayData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetNativePrepayResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {pb.GetNativePrepayResponse} message GetNativePrepayResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetNativePrepayResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.NativePrepayData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this GetNativePrepayResponse to JSON.
         * @function toJSON
         * @memberof pb.GetNativePrepayResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetNativePrepayResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetNativePrepayResponse
         * @function getTypeUrl
         * @memberof pb.GetNativePrepayResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetNativePrepayResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetNativePrepayResponse";
        };

        return GetNativePrepayResponse;
    })();

    pb.NativePrepayData = (function() {

        /**
         * Properties of a NativePrepayData.
         * @memberof pb
         * @interface INativePrepayData
         * @property {string|null} [codeUrl] NativePrepayData codeUrl
         */

        /**
         * Constructs a new NativePrepayData.
         * @memberof pb
         * @classdesc Represents a NativePrepayData.
         * @implements INativePrepayData
         * @constructor
         * @param {pb.INativePrepayData=} [properties] Properties to set
         */
        function NativePrepayData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NativePrepayData codeUrl.
         * @member {string} codeUrl
         * @memberof pb.NativePrepayData
         * @instance
         */
        NativePrepayData.prototype.codeUrl = "";

        /**
         * Creates a new NativePrepayData instance using the specified properties.
         * @function create
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.INativePrepayData=} [properties] Properties to set
         * @returns {pb.NativePrepayData} NativePrepayData instance
         */
        NativePrepayData.create = function create(properties) {
            return new NativePrepayData(properties);
        };

        /**
         * Encodes the specified NativePrepayData message. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @function encode
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.INativePrepayData} message NativePrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NativePrepayData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.codeUrl != null && Object.hasOwnProperty.call(message, "codeUrl"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.codeUrl);
            return writer;
        };

        /**
         * Encodes the specified NativePrepayData message, length delimited. Does not implicitly {@link pb.NativePrepayData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.INativePrepayData} message NativePrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NativePrepayData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.NativePrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.NativePrepayData} NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NativePrepayData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.NativePrepayData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.codeUrl = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NativePrepayData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.NativePrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.NativePrepayData} NativePrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NativePrepayData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NativePrepayData message.
         * @function verify
         * @memberof pb.NativePrepayData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NativePrepayData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.codeUrl != null && message.hasOwnProperty("codeUrl"))
                if (!$util.isString(message.codeUrl))
                    return "codeUrl: string expected";
            return null;
        };

        /**
         * Creates a NativePrepayData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.NativePrepayData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.NativePrepayData} NativePrepayData
         */
        NativePrepayData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.NativePrepayData)
                return object;
            let message = new $root.pb.NativePrepayData();
            if (object.codeUrl != null)
                message.codeUrl = String(object.codeUrl);
            return message;
        };

        /**
         * Creates a plain object from a NativePrepayData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.NativePrepayData
         * @static
         * @param {pb.NativePrepayData} message NativePrepayData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NativePrepayData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.codeUrl = "";
            if (message.codeUrl != null && message.hasOwnProperty("codeUrl"))
                object.codeUrl = message.codeUrl;
            return object;
        };

        /**
         * Converts this NativePrepayData to JSON.
         * @function toJSON
         * @memberof pb.NativePrepayData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NativePrepayData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for NativePrepayData
         * @function getTypeUrl
         * @memberof pb.NativePrepayData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        NativePrepayData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.NativePrepayData";
        };

        return NativePrepayData;
    })();

    pb.GetH5PrepayRequest = (function() {

        /**
         * Properties of a GetH5PrepayRequest.
         * @memberof pb
         * @interface IGetH5PrepayRequest
         * @property {string|null} [outTradeNo] GetH5PrepayRequest outTradeNo
         * @property {string|null} [redirectUrl] GetH5PrepayRequest redirectUrl
         * @property {string|null} [clientIp] GetH5PrepayRequest clientIp
         * @property {string|null} [userAgent] GetH5PrepayRequest userAgent
         */

        /**
         * Constructs a new GetH5PrepayRequest.
         * @memberof pb
         * @classdesc Represents a GetH5PrepayRequest.
         * @implements IGetH5PrepayRequest
         * @constructor
         * @param {pb.IGetH5PrepayRequest=} [properties] Properties to set
         */
        function GetH5PrepayRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetH5PrepayRequest outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.GetH5PrepayRequest
         * @instance
         */
        GetH5PrepayRequest.prototype.outTradeNo = "";

        /**
         * GetH5PrepayRequest redirectUrl.
         * @member {string} redirectUrl
         * @memberof pb.GetH5PrepayRequest
         * @instance
         */
        GetH5PrepayRequest.prototype.redirectUrl = "";

        /**
         * GetH5PrepayRequest clientIp.
         * @member {string} clientIp
         * @memberof pb.GetH5PrepayRequest
         * @instance
         */
        GetH5PrepayRequest.prototype.clientIp = "";

        /**
         * GetH5PrepayRequest userAgent.
         * @member {string} userAgent
         * @memberof pb.GetH5PrepayRequest
         * @instance
         */
        GetH5PrepayRequest.prototype.userAgent = "";

        /**
         * Creates a new GetH5PrepayRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {pb.IGetH5PrepayRequest=} [properties] Properties to set
         * @returns {pb.GetH5PrepayRequest} GetH5PrepayRequest instance
         */
        GetH5PrepayRequest.create = function create(properties) {
            return new GetH5PrepayRequest(properties);
        };

        /**
         * Encodes the specified GetH5PrepayRequest message. Does not implicitly {@link pb.GetH5PrepayRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {pb.IGetH5PrepayRequest} message GetH5PrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetH5PrepayRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            if (message.redirectUrl != null && Object.hasOwnProperty.call(message, "redirectUrl"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.redirectUrl);
            if (message.clientIp != null && Object.hasOwnProperty.call(message, "clientIp"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.clientIp);
            if (message.userAgent != null && Object.hasOwnProperty.call(message, "userAgent"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.userAgent);
            return writer;
        };

        /**
         * Encodes the specified GetH5PrepayRequest message, length delimited. Does not implicitly {@link pb.GetH5PrepayRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {pb.IGetH5PrepayRequest} message GetH5PrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetH5PrepayRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetH5PrepayRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetH5PrepayRequest} GetH5PrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetH5PrepayRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetH5PrepayRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.outTradeNo = reader.string();
                        break;
                    }
                case 2: {
                        message.redirectUrl = reader.string();
                        break;
                    }
                case 3: {
                        message.clientIp = reader.string();
                        break;
                    }
                case 4: {
                        message.userAgent = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetH5PrepayRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetH5PrepayRequest} GetH5PrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetH5PrepayRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetH5PrepayRequest message.
         * @function verify
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetH5PrepayRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            if (message.redirectUrl != null && message.hasOwnProperty("redirectUrl"))
                if (!$util.isString(message.redirectUrl))
                    return "redirectUrl: string expected";
            if (message.clientIp != null && message.hasOwnProperty("clientIp"))
                if (!$util.isString(message.clientIp))
                    return "clientIp: string expected";
            if (message.userAgent != null && message.hasOwnProperty("userAgent"))
                if (!$util.isString(message.userAgent))
                    return "userAgent: string expected";
            return null;
        };

        /**
         * Creates a GetH5PrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetH5PrepayRequest} GetH5PrepayRequest
         */
        GetH5PrepayRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetH5PrepayRequest)
                return object;
            let message = new $root.pb.GetH5PrepayRequest();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            if (object.redirectUrl != null)
                message.redirectUrl = String(object.redirectUrl);
            if (object.clientIp != null)
                message.clientIp = String(object.clientIp);
            if (object.userAgent != null)
                message.userAgent = String(object.userAgent);
            return message;
        };

        /**
         * Creates a plain object from a GetH5PrepayRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {pb.GetH5PrepayRequest} message GetH5PrepayRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetH5PrepayRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.outTradeNo = "";
                object.redirectUrl = "";
                object.clientIp = "";
                object.userAgent = "";
            }
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            if (message.redirectUrl != null && message.hasOwnProperty("redirectUrl"))
                object.redirectUrl = message.redirectUrl;
            if (message.clientIp != null && message.hasOwnProperty("clientIp"))
                object.clientIp = message.clientIp;
            if (message.userAgent != null && message.hasOwnProperty("userAgent"))
                object.userAgent = message.userAgent;
            return object;
        };

        /**
         * Converts this GetH5PrepayRequest to JSON.
         * @function toJSON
         * @memberof pb.GetH5PrepayRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetH5PrepayRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetH5PrepayRequest
         * @function getTypeUrl
         * @memberof pb.GetH5PrepayRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetH5PrepayRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetH5PrepayRequest";
        };

        return GetH5PrepayRequest;
    })();

    pb.GetH5PrepayResponse = (function() {

        /**
         * Properties of a GetH5PrepayResponse.
         * @memberof pb
         * @interface IGetH5PrepayResponse
         * @property {number|null} [code] GetH5PrepayResponse code
         * @property {string|null} [msg] GetH5PrepayResponse msg
         * @property {pb.IH5PrepayData|null} [data] GetH5PrepayResponse data
         */

        /**
         * Constructs a new GetH5PrepayResponse.
         * @memberof pb
         * @classdesc Represents a GetH5PrepayResponse.
         * @implements IGetH5PrepayResponse
         * @constructor
         * @param {pb.IGetH5PrepayResponse=} [properties] Properties to set
         */
        function GetH5PrepayResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetH5PrepayResponse code.
         * @member {number} code
         * @memberof pb.GetH5PrepayResponse
         * @instance
         */
        GetH5PrepayResponse.prototype.code = 0;

        /**
         * GetH5PrepayResponse msg.
         * @member {string} msg
         * @memberof pb.GetH5PrepayResponse
         * @instance
         */
        GetH5PrepayResponse.prototype.msg = "";

        /**
         * GetH5PrepayResponse data.
         * @member {pb.IH5PrepayData|null|undefined} data
         * @memberof pb.GetH5PrepayResponse
         * @instance
         */
        GetH5PrepayResponse.prototype.data = null;

        /**
         * Creates a new GetH5PrepayResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {pb.IGetH5PrepayResponse=} [properties] Properties to set
         * @returns {pb.GetH5PrepayResponse} GetH5PrepayResponse instance
         */
        GetH5PrepayResponse.create = function create(properties) {
            return new GetH5PrepayResponse(properties);
        };

        /**
         * Encodes the specified GetH5PrepayResponse message. Does not implicitly {@link pb.GetH5PrepayResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {pb.IGetH5PrepayResponse} message GetH5PrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetH5PrepayResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.H5PrepayData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetH5PrepayResponse message, length delimited. Does not implicitly {@link pb.GetH5PrepayResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {pb.IGetH5PrepayResponse} message GetH5PrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetH5PrepayResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetH5PrepayResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetH5PrepayResponse} GetH5PrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetH5PrepayResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetH5PrepayResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.H5PrepayData.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetH5PrepayResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetH5PrepayResponse} GetH5PrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetH5PrepayResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetH5PrepayResponse message.
         * @function verify
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetH5PrepayResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.H5PrepayData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a GetH5PrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetH5PrepayResponse} GetH5PrepayResponse
         */
        GetH5PrepayResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetH5PrepayResponse)
                return object;
            let message = new $root.pb.GetH5PrepayResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetH5PrepayResponse.data: object expected");
                message.data = $root.pb.H5PrepayData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetH5PrepayResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {pb.GetH5PrepayResponse} message GetH5PrepayResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetH5PrepayResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.H5PrepayData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this GetH5PrepayResponse to JSON.
         * @function toJSON
         * @memberof pb.GetH5PrepayResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetH5PrepayResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetH5PrepayResponse
         * @function getTypeUrl
         * @memberof pb.GetH5PrepayResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetH5PrepayResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetH5PrepayResponse";
        };

        return GetH5PrepayResponse;
    })();

    pb.H5PrepayData = (function() {

        /**
         * Properties of a H5PrepayData.
         * @memberof pb
         * @interface IH5PrepayData
         * @property {string|null} [h5Url] H5PrepayData h5Url
         */

        /**
         * Constructs a new H5PrepayData.
         * @memberof pb
         * @classdesc Represents a H5PrepayData.
         * @implements IH5PrepayData
         * @constructor
         * @param {pb.IH5PrepayData=} [properties] Properties to set
         */
        function H5PrepayData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * H5PrepayData h5Url.
         * @member {string} h5Url
         * @memberof pb.H5PrepayData
         * @instance
         */
        H5PrepayData.prototype.h5Url = "";

        /**
         * Creates a new H5PrepayData instance using the specified properties.
         * @function create
         * @memberof pb.H5PrepayData
         * @static
         * @param {pb.IH5PrepayData=} [properties] Properties to set
         * @returns {pb.H5PrepayData} H5PrepayData instance
         */
        H5PrepayData.create = function create(properties) {
            return new H5PrepayData(properties);
        };

        /**
         * Encodes the specified H5PrepayData message. Does not implicitly {@link pb.H5PrepayData.verify|verify} messages.
         * @function encode
         * @memberof pb.H5PrepayData
         * @static
         * @param {pb.IH5PrepayData} message H5PrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        H5PrepayData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.h5Url != null && Object.hasOwnProperty.call(message, "h5Url"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.h5Url);
            return writer;
        };

        /**
         * Encodes the specified H5PrepayData message, length delimited. Does not implicitly {@link pb.H5PrepayData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.H5PrepayData
         * @static
         * @param {pb.IH5PrepayData} message H5PrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        H5PrepayData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a H5PrepayData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.H5PrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.H5PrepayData} H5PrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        H5PrepayData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.H5PrepayData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.h5Url = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a H5PrepayData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.H5PrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.H5PrepayData} H5PrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        H5PrepayData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a H5PrepayData message.
         * @function verify
         * @memberof pb.H5PrepayData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        H5PrepayData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.h5Url != null && message.hasOwnProperty("h5Url"))
                if (!$util.isString(message.h5Url))
                    return "h5Url: string expected";
            return null;
        };

        /**
         * Creates a H5PrepayData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.H5PrepayData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.H5PrepayData} H5PrepayData
         */
        H5PrepayData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.H5PrepayData)
                return object;
            let message = new $root.pb.H5PrepayData();
            if (object.h5Url != null)
                message.h5Url = String(object.h5Url);
            return message;
        };

        /**
         * Creates a plain object from a H5PrepayData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.H5PrepayData
         * @static
         * @param {pb.H5PrepayData} message H5PrepayData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        H5PrepayData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.h5Url = "";
            if (message.h5Url != null && message.hasOwnProperty("h5Url"))
                object.h5Url = message.h5Url;
            return object;
        };

        /**
         * Converts this H5PrepayData to JSON.
         * @function toJSON
         * @memberof pb.H5PrepayData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        H5PrepayData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for H5PrepayData
         * @function getTypeUrl
         * @memberof pb.H5PrepayData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        H5PrepayData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.H5PrepayData";
        };

        return H5PrepayData;
    })();

    pb.GetJSAPIPrepayRequest = (function() {

        /**
         * Properties of a GetJSAPIPrepayRequest.
         * @memberof pb
         * @interface IGetJSAPIPrepayRequest
         * @property {string|null} [outTradeNo] GetJSAPIPrepayRequest outTradeNo
         */

        /**
         * Constructs a new GetJSAPIPrepayRequest.
         * @memberof pb
         * @classdesc Represents a GetJSAPIPrepayRequest.
         * @implements IGetJSAPIPrepayRequest
         * @constructor
         * @param {pb.IGetJSAPIPrepayRequest=} [properties] Properties to set
         */
        function GetJSAPIPrepayRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetJSAPIPrepayRequest outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.GetJSAPIPrepayRequest
         * @instance
         */
        GetJSAPIPrepayRequest.prototype.outTradeNo = "";

        /**
         * Creates a new GetJSAPIPrepayRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {pb.IGetJSAPIPrepayRequest=} [properties] Properties to set
         * @returns {pb.GetJSAPIPrepayRequest} GetJSAPIPrepayRequest instance
         */
        GetJSAPIPrepayRequest.create = function create(properties) {
            return new GetJSAPIPrepayRequest(properties);
        };

        /**
         * Encodes the specified GetJSAPIPrepayRequest message. Does not implicitly {@link pb.GetJSAPIPrepayRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {pb.IGetJSAPIPrepayRequest} message GetJSAPIPrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetJSAPIPrepayRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            return writer;
        };

        /**
         * Encodes the specified GetJSAPIPrepayRequest message, length delimited. Does not implicitly {@link pb.GetJSAPIPrepayRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {pb.IGetJSAPIPrepayRequest} message GetJSAPIPrepayRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetJSAPIPrepayRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetJSAPIPrepayRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetJSAPIPrepayRequest} GetJSAPIPrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetJSAPIPrepayRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetJSAPIPrepayRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.outTradeNo = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetJSAPIPrepayRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetJSAPIPrepayRequest} GetJSAPIPrepayRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetJSAPIPrepayRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetJSAPIPrepayRequest message.
         * @function verify
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetJSAPIPrepayRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            return null;
        };

        /**
         * Creates a GetJSAPIPrepayRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetJSAPIPrepayRequest} GetJSAPIPrepayRequest
         */
        GetJSAPIPrepayRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetJSAPIPrepayRequest)
                return object;
            let message = new $root.pb.GetJSAPIPrepayRequest();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            return message;
        };

        /**
         * Creates a plain object from a GetJSAPIPrepayRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {pb.GetJSAPIPrepayRequest} message GetJSAPIPrepayRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetJSAPIPrepayRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.outTradeNo = "";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            return object;
        };

        /**
         * Converts this GetJSAPIPrepayRequest to JSON.
         * @function toJSON
         * @memberof pb.GetJSAPIPrepayRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetJSAPIPrepayRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetJSAPIPrepayRequest
         * @function getTypeUrl
         * @memberof pb.GetJSAPIPrepayRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetJSAPIPrepayRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetJSAPIPrepayRequest";
        };

        return GetJSAPIPrepayRequest;
    })();

    pb.GetJSAPIPrepayResponse = (function() {

        /**
         * Properties of a GetJSAPIPrepayResponse.
         * @memberof pb
         * @interface IGetJSAPIPrepayResponse
         * @property {number|null} [code] GetJSAPIPrepayResponse code
         * @property {string|null} [msg] GetJSAPIPrepayResponse msg
         * @property {pb.IJSAPIPrepayData|null} [data] GetJSAPIPrepayResponse data
         * @property {boolean|null} [needWechatAuth] GetJSAPIPrepayResponse needWechatAuth
         * @property {string|null} [authUrl] GetJSAPIPrepayResponse authUrl
         */

        /**
         * Constructs a new GetJSAPIPrepayResponse.
         * @memberof pb
         * @classdesc Represents a GetJSAPIPrepayResponse.
         * @implements IGetJSAPIPrepayResponse
         * @constructor
         * @param {pb.IGetJSAPIPrepayResponse=} [properties] Properties to set
         */
        function GetJSAPIPrepayResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetJSAPIPrepayResponse code.
         * @member {number} code
         * @memberof pb.GetJSAPIPrepayResponse
         * @instance
         */
        GetJSAPIPrepayResponse.prototype.code = 0;

        /**
         * GetJSAPIPrepayResponse msg.
         * @member {string} msg
         * @memberof pb.GetJSAPIPrepayResponse
         * @instance
         */
        GetJSAPIPrepayResponse.prototype.msg = "";

        /**
         * GetJSAPIPrepayResponse data.
         * @member {pb.IJSAPIPrepayData|null|undefined} data
         * @memberof pb.GetJSAPIPrepayResponse
         * @instance
         */
        GetJSAPIPrepayResponse.prototype.data = null;

        /**
         * GetJSAPIPrepayResponse needWechatAuth.
         * @member {boolean} needWechatAuth
         * @memberof pb.GetJSAPIPrepayResponse
         * @instance
         */
        GetJSAPIPrepayResponse.prototype.needWechatAuth = false;

        /**
         * GetJSAPIPrepayResponse authUrl.
         * @member {string} authUrl
         * @memberof pb.GetJSAPIPrepayResponse
         * @instance
         */
        GetJSAPIPrepayResponse.prototype.authUrl = "";

        /**
         * Creates a new GetJSAPIPrepayResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {pb.IGetJSAPIPrepayResponse=} [properties] Properties to set
         * @returns {pb.GetJSAPIPrepayResponse} GetJSAPIPrepayResponse instance
         */
        GetJSAPIPrepayResponse.create = function create(properties) {
            return new GetJSAPIPrepayResponse(properties);
        };

        /**
         * Encodes the specified GetJSAPIPrepayResponse message. Does not implicitly {@link pb.GetJSAPIPrepayResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {pb.IGetJSAPIPrepayResponse} message GetJSAPIPrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetJSAPIPrepayResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.JSAPIPrepayData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.needWechatAuth != null && Object.hasOwnProperty.call(message, "needWechatAuth"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.needWechatAuth);
            if (message.authUrl != null && Object.hasOwnProperty.call(message, "authUrl"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.authUrl);
            return writer;
        };

        /**
         * Encodes the specified GetJSAPIPrepayResponse message, length delimited. Does not implicitly {@link pb.GetJSAPIPrepayResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {pb.IGetJSAPIPrepayResponse} message GetJSAPIPrepayResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetJSAPIPrepayResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetJSAPIPrepayResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetJSAPIPrepayResponse} GetJSAPIPrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetJSAPIPrepayResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetJSAPIPrepayResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.JSAPIPrepayData.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.needWechatAuth = reader.bool();
                        break;
                    }
                case 5: {
                        message.authUrl = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetJSAPIPrepayResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetJSAPIPrepayResponse} GetJSAPIPrepayResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetJSAPIPrepayResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetJSAPIPrepayResponse message.
         * @function verify
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetJSAPIPrepayResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.JSAPIPrepayData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            if (message.needWechatAuth != null && message.hasOwnProperty("needWechatAuth"))
                if (typeof message.needWechatAuth !== "boolean")
                    return "needWechatAuth: boolean expected";
            if (message.authUrl != null && message.hasOwnProperty("authUrl"))
                if (!$util.isString(message.authUrl))
                    return "authUrl: string expected";
            return null;
        };

        /**
         * Creates a GetJSAPIPrepayResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetJSAPIPrepayResponse} GetJSAPIPrepayResponse
         */
        GetJSAPIPrepayResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetJSAPIPrepayResponse)
                return object;
            let message = new $root.pb.GetJSAPIPrepayResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetJSAPIPrepayResponse.data: object expected");
                message.data = $root.pb.JSAPIPrepayData.fromObject(object.data);
            }
            if (object.needWechatAuth != null)
                message.needWechatAuth = Boolean(object.needWechatAuth);
            if (object.authUrl != null)
                message.authUrl = String(object.authUrl);
            return message;
        };

        /**
         * Creates a plain object from a GetJSAPIPrepayResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {pb.GetJSAPIPrepayResponse} message GetJSAPIPrepayResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetJSAPIPrepayResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
                object.needWechatAuth = false;
                object.authUrl = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.JSAPIPrepayData.toObject(message.data, options);
            if (message.needWechatAuth != null && message.hasOwnProperty("needWechatAuth"))
                object.needWechatAuth = message.needWechatAuth;
            if (message.authUrl != null && message.hasOwnProperty("authUrl"))
                object.authUrl = message.authUrl;
            return object;
        };

        /**
         * Converts this GetJSAPIPrepayResponse to JSON.
         * @function toJSON
         * @memberof pb.GetJSAPIPrepayResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetJSAPIPrepayResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetJSAPIPrepayResponse
         * @function getTypeUrl
         * @memberof pb.GetJSAPIPrepayResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetJSAPIPrepayResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetJSAPIPrepayResponse";
        };

        return GetJSAPIPrepayResponse;
    })();

    pb.JSAPIPrepayData = (function() {

        /**
         * Properties of a JSAPIPrepayData.
         * @memberof pb
         * @interface IJSAPIPrepayData
         * @property {string|null} [prepayId] JSAPIPrepayData prepayId
         * @property {string|null} [appId] JSAPIPrepayData appId
         * @property {string|null} [timeStamp] JSAPIPrepayData timeStamp
         * @property {string|null} [nonceStr] JSAPIPrepayData nonceStr
         * @property {string|null} ["package"] JSAPIPrepayData package
         * @property {string|null} [signType] JSAPIPrepayData signType
         * @property {string|null} [paySign] JSAPIPrepayData paySign
         */

        /**
         * Constructs a new JSAPIPrepayData.
         * @memberof pb
         * @classdesc Represents a JSAPIPrepayData.
         * @implements IJSAPIPrepayData
         * @constructor
         * @param {pb.IJSAPIPrepayData=} [properties] Properties to set
         */
        function JSAPIPrepayData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * JSAPIPrepayData prepayId.
         * @member {string} prepayId
         * @memberof pb.JSAPIPrepayData
         * @instance
         */
        JSAPIPrepayData.prototype.prepayId = "";

        /**
         * JSAPIPrepayData appId.
         * @member {string} appId
         * @memberof pb.JSAPIPrepayData
         * @instance
         */
        JSAPIPrepayData.prototype.appId = "";

        /**
         * JSAPIPrepayData timeStamp.
         * @member {string} timeStamp
         * @memberof pb.JSAPIPrepayData
         * @instance
         */
        JSAPIPrepayData.prototype.timeStamp = "";

        /**
         * JSAPIPrepayData nonceStr.
         * @member {string} nonceStr
         * @memberof pb.JSAPIPrepayData
         * @instance
         */
        JSAPIPrepayData.prototype.nonceStr = "";

        /**
         * JSAPIPrepayData package.
         * @member {string} package
         * @memberof pb.JSAPIPrepayData
         * @instance
         */
        JSAPIPrepayData.prototype["package"] = "";

        /**
         * JSAPIPrepayData signType.
         * @member {string} signType
         * @memberof pb.JSAPIPrepayData
         * @instance
         */
        JSAPIPrepayData.prototype.signType = "";

        /**
         * JSAPIPrepayData paySign.
         * @member {string} paySign
         * @memberof pb.JSAPIPrepayData
         * @instance
         */
        JSAPIPrepayData.prototype.paySign = "";

        /**
         * Creates a new JSAPIPrepayData instance using the specified properties.
         * @function create
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {pb.IJSAPIPrepayData=} [properties] Properties to set
         * @returns {pb.JSAPIPrepayData} JSAPIPrepayData instance
         */
        JSAPIPrepayData.create = function create(properties) {
            return new JSAPIPrepayData(properties);
        };

        /**
         * Encodes the specified JSAPIPrepayData message. Does not implicitly {@link pb.JSAPIPrepayData.verify|verify} messages.
         * @function encode
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {pb.IJSAPIPrepayData} message JSAPIPrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JSAPIPrepayData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.prepayId != null && Object.hasOwnProperty.call(message, "prepayId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.prepayId);
            if (message.appId != null && Object.hasOwnProperty.call(message, "appId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.appId);
            if (message.timeStamp != null && Object.hasOwnProperty.call(message, "timeStamp"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.timeStamp);
            if (message.nonceStr != null && Object.hasOwnProperty.call(message, "nonceStr"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.nonceStr);
            if (message["package"] != null && Object.hasOwnProperty.call(message, "package"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message["package"]);
            if (message.signType != null && Object.hasOwnProperty.call(message, "signType"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.signType);
            if (message.paySign != null && Object.hasOwnProperty.call(message, "paySign"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.paySign);
            return writer;
        };

        /**
         * Encodes the specified JSAPIPrepayData message, length delimited. Does not implicitly {@link pb.JSAPIPrepayData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {pb.IJSAPIPrepayData} message JSAPIPrepayData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        JSAPIPrepayData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a JSAPIPrepayData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.JSAPIPrepayData} JSAPIPrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JSAPIPrepayData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.JSAPIPrepayData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.prepayId = reader.string();
                        break;
                    }
                case 2: {
                        message.appId = reader.string();
                        break;
                    }
                case 3: {
                        message.timeStamp = reader.string();
                        break;
                    }
                case 4: {
                        message.nonceStr = reader.string();
                        break;
                    }
                case 5: {
                        message["package"] = reader.string();
                        break;
                    }
                case 6: {
                        message.signType = reader.string();
                        break;
                    }
                case 7: {
                        message.paySign = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a JSAPIPrepayData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.JSAPIPrepayData} JSAPIPrepayData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        JSAPIPrepayData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a JSAPIPrepayData message.
         * @function verify
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        JSAPIPrepayData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.prepayId != null && message.hasOwnProperty("prepayId"))
                if (!$util.isString(message.prepayId))
                    return "prepayId: string expected";
            if (message.appId != null && message.hasOwnProperty("appId"))
                if (!$util.isString(message.appId))
                    return "appId: string expected";
            if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
                if (!$util.isString(message.timeStamp))
                    return "timeStamp: string expected";
            if (message.nonceStr != null && message.hasOwnProperty("nonceStr"))
                if (!$util.isString(message.nonceStr))
                    return "nonceStr: string expected";
            if (message["package"] != null && message.hasOwnProperty("package"))
                if (!$util.isString(message["package"]))
                    return "package: string expected";
            if (message.signType != null && message.hasOwnProperty("signType"))
                if (!$util.isString(message.signType))
                    return "signType: string expected";
            if (message.paySign != null && message.hasOwnProperty("paySign"))
                if (!$util.isString(message.paySign))
                    return "paySign: string expected";
            return null;
        };

        /**
         * Creates a JSAPIPrepayData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.JSAPIPrepayData} JSAPIPrepayData
         */
        JSAPIPrepayData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.JSAPIPrepayData)
                return object;
            let message = new $root.pb.JSAPIPrepayData();
            if (object.prepayId != null)
                message.prepayId = String(object.prepayId);
            if (object.appId != null)
                message.appId = String(object.appId);
            if (object.timeStamp != null)
                message.timeStamp = String(object.timeStamp);
            if (object.nonceStr != null)
                message.nonceStr = String(object.nonceStr);
            if (object["package"] != null)
                message["package"] = String(object["package"]);
            if (object.signType != null)
                message.signType = String(object.signType);
            if (object.paySign != null)
                message.paySign = String(object.paySign);
            return message;
        };

        /**
         * Creates a plain object from a JSAPIPrepayData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {pb.JSAPIPrepayData} message JSAPIPrepayData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        JSAPIPrepayData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.prepayId = "";
                object.appId = "";
                object.timeStamp = "";
                object.nonceStr = "";
                object["package"] = "";
                object.signType = "";
                object.paySign = "";
            }
            if (message.prepayId != null && message.hasOwnProperty("prepayId"))
                object.prepayId = message.prepayId;
            if (message.appId != null && message.hasOwnProperty("appId"))
                object.appId = message.appId;
            if (message.timeStamp != null && message.hasOwnProperty("timeStamp"))
                object.timeStamp = message.timeStamp;
            if (message.nonceStr != null && message.hasOwnProperty("nonceStr"))
                object.nonceStr = message.nonceStr;
            if (message["package"] != null && message.hasOwnProperty("package"))
                object["package"] = message["package"];
            if (message.signType != null && message.hasOwnProperty("signType"))
                object.signType = message.signType;
            if (message.paySign != null && message.hasOwnProperty("paySign"))
                object.paySign = message.paySign;
            return object;
        };

        /**
         * Converts this JSAPIPrepayData to JSON.
         * @function toJSON
         * @memberof pb.JSAPIPrepayData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        JSAPIPrepayData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for JSAPIPrepayData
         * @function getTypeUrl
         * @memberof pb.JSAPIPrepayData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        JSAPIPrepayData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.JSAPIPrepayData";
        };

        return JSAPIPrepayData;
    })();

    pb.GetStoragePurchaseStatusRequest = (function() {

        /**
         * Properties of a GetStoragePurchaseStatusRequest.
         * @memberof pb
         * @interface IGetStoragePurchaseStatusRequest
         * @property {string|null} [outTradeNo] GetStoragePurchaseStatusRequest outTradeNo
         */

        /**
         * Constructs a new GetStoragePurchaseStatusRequest.
         * @memberof pb
         * @classdesc Represents a GetStoragePurchaseStatusRequest.
         * @implements IGetStoragePurchaseStatusRequest
         * @constructor
         * @param {pb.IGetStoragePurchaseStatusRequest=} [properties] Properties to set
         */
        function GetStoragePurchaseStatusRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetStoragePurchaseStatusRequest outTradeNo.
         * @member {string} outTradeNo
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @instance
         */
        GetStoragePurchaseStatusRequest.prototype.outTradeNo = "";

        /**
         * Creates a new GetStoragePurchaseStatusRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.IGetStoragePurchaseStatusRequest=} [properties] Properties to set
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest instance
         */
        GetStoragePurchaseStatusRequest.create = function create(properties) {
            return new GetStoragePurchaseStatusRequest(properties);
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.IGetStoragePurchaseStatusRequest} message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outTradeNo != null && Object.hasOwnProperty.call(message, "outTradeNo"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.outTradeNo);
            return writer;
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusRequest message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.IGetStoragePurchaseStatusRequest} message GetStoragePurchaseStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetStoragePurchaseStatusRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.outTradeNo = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetStoragePurchaseStatusRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetStoragePurchaseStatusRequest message.
         * @function verify
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetStoragePurchaseStatusRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                if (!$util.isString(message.outTradeNo))
                    return "outTradeNo: string expected";
            return null;
        };

        /**
         * Creates a GetStoragePurchaseStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetStoragePurchaseStatusRequest} GetStoragePurchaseStatusRequest
         */
        GetStoragePurchaseStatusRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetStoragePurchaseStatusRequest)
                return object;
            let message = new $root.pb.GetStoragePurchaseStatusRequest();
            if (object.outTradeNo != null)
                message.outTradeNo = String(object.outTradeNo);
            return message;
        };

        /**
         * Creates a plain object from a GetStoragePurchaseStatusRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {pb.GetStoragePurchaseStatusRequest} message GetStoragePurchaseStatusRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetStoragePurchaseStatusRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.outTradeNo = "";
            if (message.outTradeNo != null && message.hasOwnProperty("outTradeNo"))
                object.outTradeNo = message.outTradeNo;
            return object;
        };

        /**
         * Converts this GetStoragePurchaseStatusRequest to JSON.
         * @function toJSON
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetStoragePurchaseStatusRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetStoragePurchaseStatusRequest
         * @function getTypeUrl
         * @memberof pb.GetStoragePurchaseStatusRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetStoragePurchaseStatusRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetStoragePurchaseStatusRequest";
        };

        return GetStoragePurchaseStatusRequest;
    })();

    pb.GetStoragePurchaseStatusResponse = (function() {

        /**
         * Properties of a GetStoragePurchaseStatusResponse.
         * @memberof pb
         * @interface IGetStoragePurchaseStatusResponse
         * @property {number|null} [code] GetStoragePurchaseStatusResponse code
         * @property {string|null} [msg] GetStoragePurchaseStatusResponse msg
         * @property {pb.IGetStoragePurchaseStatusData|null} [data] GetStoragePurchaseStatusResponse data
         */

        /**
         * Constructs a new GetStoragePurchaseStatusResponse.
         * @memberof pb
         * @classdesc Represents a GetStoragePurchaseStatusResponse.
         * @implements IGetStoragePurchaseStatusResponse
         * @constructor
         * @param {pb.IGetStoragePurchaseStatusResponse=} [properties] Properties to set
         */
        function GetStoragePurchaseStatusResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetStoragePurchaseStatusResponse code.
         * @member {number} code
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         */
        GetStoragePurchaseStatusResponse.prototype.code = 0;

        /**
         * GetStoragePurchaseStatusResponse msg.
         * @member {string} msg
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         */
        GetStoragePurchaseStatusResponse.prototype.msg = "";

        /**
         * GetStoragePurchaseStatusResponse data.
         * @member {pb.IGetStoragePurchaseStatusData|null|undefined} data
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         */
        GetStoragePurchaseStatusResponse.prototype.data = null;

        /**
         * Creates a new GetStoragePurchaseStatusResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.IGetStoragePurchaseStatusResponse=} [properties] Properties to set
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse instance
         */
        GetStoragePurchaseStatusResponse.create = function create(properties) {
            return new GetStoragePurchaseStatusResponse(properties);
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.IGetStoragePurchaseStatusResponse} message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.GetStoragePurchaseStatusData.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusResponse message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.IGetStoragePurchaseStatusResponse} message GetStoragePurchaseStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetStoragePurchaseStatusResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.GetStoragePurchaseStatusData.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetStoragePurchaseStatusResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetStoragePurchaseStatusResponse message.
         * @function verify
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetStoragePurchaseStatusResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.GetStoragePurchaseStatusData.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a GetStoragePurchaseStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetStoragePurchaseStatusResponse} GetStoragePurchaseStatusResponse
         */
        GetStoragePurchaseStatusResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetStoragePurchaseStatusResponse)
                return object;
            let message = new $root.pb.GetStoragePurchaseStatusResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetStoragePurchaseStatusResponse.data: object expected");
                message.data = $root.pb.GetStoragePurchaseStatusData.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetStoragePurchaseStatusResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {pb.GetStoragePurchaseStatusResponse} message GetStoragePurchaseStatusResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetStoragePurchaseStatusResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.GetStoragePurchaseStatusData.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this GetStoragePurchaseStatusResponse to JSON.
         * @function toJSON
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetStoragePurchaseStatusResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetStoragePurchaseStatusResponse
         * @function getTypeUrl
         * @memberof pb.GetStoragePurchaseStatusResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetStoragePurchaseStatusResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetStoragePurchaseStatusResponse";
        };

        return GetStoragePurchaseStatusResponse;
    })();

    pb.GetStoragePurchaseStatusData = (function() {

        /**
         * Properties of a GetStoragePurchaseStatusData.
         * @memberof pb
         * @interface IGetStoragePurchaseStatusData
         * @property {number|null} [status] GetStoragePurchaseStatusData status
         */

        /**
         * Constructs a new GetStoragePurchaseStatusData.
         * @memberof pb
         * @classdesc Represents a GetStoragePurchaseStatusData.
         * @implements IGetStoragePurchaseStatusData
         * @constructor
         * @param {pb.IGetStoragePurchaseStatusData=} [properties] Properties to set
         */
        function GetStoragePurchaseStatusData(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetStoragePurchaseStatusData status.
         * @member {number} status
         * @memberof pb.GetStoragePurchaseStatusData
         * @instance
         */
        GetStoragePurchaseStatusData.prototype.status = 0;

        /**
         * Creates a new GetStoragePurchaseStatusData instance using the specified properties.
         * @function create
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.IGetStoragePurchaseStatusData=} [properties] Properties to set
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData instance
         */
        GetStoragePurchaseStatusData.create = function create(properties) {
            return new GetStoragePurchaseStatusData(properties);
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusData message. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @function encode
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.IGetStoragePurchaseStatusData} message GetStoragePurchaseStatusData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusData.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.status);
            return writer;
        };

        /**
         * Encodes the specified GetStoragePurchaseStatusData message, length delimited. Does not implicitly {@link pb.GetStoragePurchaseStatusData.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.IGetStoragePurchaseStatusData} message GetStoragePurchaseStatusData message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetStoragePurchaseStatusData.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusData.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetStoragePurchaseStatusData();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.status = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetStoragePurchaseStatusData message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetStoragePurchaseStatusData.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetStoragePurchaseStatusData message.
         * @function verify
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetStoragePurchaseStatusData.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            return null;
        };

        /**
         * Creates a GetStoragePurchaseStatusData message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetStoragePurchaseStatusData} GetStoragePurchaseStatusData
         */
        GetStoragePurchaseStatusData.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetStoragePurchaseStatusData)
                return object;
            let message = new $root.pb.GetStoragePurchaseStatusData();
            if (object.status != null)
                message.status = object.status | 0;
            return message;
        };

        /**
         * Creates a plain object from a GetStoragePurchaseStatusData message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {pb.GetStoragePurchaseStatusData} message GetStoragePurchaseStatusData
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetStoragePurchaseStatusData.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.status = 0;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            return object;
        };

        /**
         * Converts this GetStoragePurchaseStatusData to JSON.
         * @function toJSON
         * @memberof pb.GetStoragePurchaseStatusData
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetStoragePurchaseStatusData.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetStoragePurchaseStatusData
         * @function getTypeUrl
         * @memberof pb.GetStoragePurchaseStatusData
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetStoragePurchaseStatusData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetStoragePurchaseStatusData";
        };

        return GetStoragePurchaseStatusData;
    })();

    pb.CidInfo = (function() {

        /**
         * Properties of a CidInfo.
         * @memberof pb
         * @interface ICidInfo
         * @property {string|null} [cid] CidInfo cid
         * @property {string|null} [account] CidInfo account
         * @property {string|null} [dappid] CidInfo dappid
         * @property {number|null} [payStatus] CidInfo payStatus
         * @property {number|null} [checkStatus] CidInfo checkStatus
         * @property {number|null} [checkUserId] CidInfo checkUserId
         * @property {string|null} [checkReason] CidInfo checkReason
         * @property {string|null} [checkTime] CidInfo checkTime
         * @property {string|null} [expiredTime] CidInfo expiredTime
         * @property {string|null} [createTime] CidInfo createTime
         */

        /**
         * Constructs a new CidInfo.
         * @memberof pb
         * @classdesc Represents a CidInfo.
         * @implements ICidInfo
         * @constructor
         * @param {pb.ICidInfo=} [properties] Properties to set
         */
        function CidInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CidInfo cid.
         * @member {string} cid
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.cid = "";

        /**
         * CidInfo account.
         * @member {string} account
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.account = "";

        /**
         * CidInfo dappid.
         * @member {string} dappid
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.dappid = "";

        /**
         * CidInfo payStatus.
         * @member {number} payStatus
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.payStatus = 0;

        /**
         * CidInfo checkStatus.
         * @member {number} checkStatus
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.checkStatus = 0;

        /**
         * CidInfo checkUserId.
         * @member {number} checkUserId
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.checkUserId = 0;

        /**
         * CidInfo checkReason.
         * @member {string} checkReason
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.checkReason = "";

        /**
         * CidInfo checkTime.
         * @member {string} checkTime
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.checkTime = "";

        /**
         * CidInfo expiredTime.
         * @member {string} expiredTime
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.expiredTime = "";

        /**
         * CidInfo createTime.
         * @member {string} createTime
         * @memberof pb.CidInfo
         * @instance
         */
        CidInfo.prototype.createTime = "";

        /**
         * Creates a new CidInfo instance using the specified properties.
         * @function create
         * @memberof pb.CidInfo
         * @static
         * @param {pb.ICidInfo=} [properties] Properties to set
         * @returns {pb.CidInfo} CidInfo instance
         */
        CidInfo.create = function create(properties) {
            return new CidInfo(properties);
        };

        /**
         * Encodes the specified CidInfo message. Does not implicitly {@link pb.CidInfo.verify|verify} messages.
         * @function encode
         * @memberof pb.CidInfo
         * @static
         * @param {pb.ICidInfo} message CidInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CidInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
            if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.account);
            if (message.dappid != null && Object.hasOwnProperty.call(message, "dappid"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.dappid);
            if (message.payStatus != null && Object.hasOwnProperty.call(message, "payStatus"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.payStatus);
            if (message.checkStatus != null && Object.hasOwnProperty.call(message, "checkStatus"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.checkStatus);
            if (message.checkUserId != null && Object.hasOwnProperty.call(message, "checkUserId"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.checkUserId);
            if (message.checkReason != null && Object.hasOwnProperty.call(message, "checkReason"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.checkReason);
            if (message.checkTime != null && Object.hasOwnProperty.call(message, "checkTime"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.checkTime);
            if (message.expiredTime != null && Object.hasOwnProperty.call(message, "expiredTime"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.expiredTime);
            if (message.createTime != null && Object.hasOwnProperty.call(message, "createTime"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.createTime);
            return writer;
        };

        /**
         * Encodes the specified CidInfo message, length delimited. Does not implicitly {@link pb.CidInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CidInfo
         * @static
         * @param {pb.ICidInfo} message CidInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CidInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CidInfo message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CidInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CidInfo} CidInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CidInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CidInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cid = reader.string();
                        break;
                    }
                case 2: {
                        message.account = reader.string();
                        break;
                    }
                case 3: {
                        message.dappid = reader.string();
                        break;
                    }
                case 4: {
                        message.payStatus = reader.int32();
                        break;
                    }
                case 5: {
                        message.checkStatus = reader.int32();
                        break;
                    }
                case 6: {
                        message.checkUserId = reader.int32();
                        break;
                    }
                case 7: {
                        message.checkReason = reader.string();
                        break;
                    }
                case 8: {
                        message.checkTime = reader.string();
                        break;
                    }
                case 9: {
                        message.expiredTime = reader.string();
                        break;
                    }
                case 10: {
                        message.createTime = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CidInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CidInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CidInfo} CidInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CidInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CidInfo message.
         * @function verify
         * @memberof pb.CidInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CidInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cid != null && message.hasOwnProperty("cid"))
                if (!$util.isString(message.cid))
                    return "cid: string expected";
            if (message.account != null && message.hasOwnProperty("account"))
                if (!$util.isString(message.account))
                    return "account: string expected";
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                if (!$util.isString(message.dappid))
                    return "dappid: string expected";
            if (message.payStatus != null && message.hasOwnProperty("payStatus"))
                if (!$util.isInteger(message.payStatus))
                    return "payStatus: integer expected";
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                if (!$util.isInteger(message.checkStatus))
                    return "checkStatus: integer expected";
            if (message.checkUserId != null && message.hasOwnProperty("checkUserId"))
                if (!$util.isInteger(message.checkUserId))
                    return "checkUserId: integer expected";
            if (message.checkReason != null && message.hasOwnProperty("checkReason"))
                if (!$util.isString(message.checkReason))
                    return "checkReason: string expected";
            if (message.checkTime != null && message.hasOwnProperty("checkTime"))
                if (!$util.isString(message.checkTime))
                    return "checkTime: string expected";
            if (message.expiredTime != null && message.hasOwnProperty("expiredTime"))
                if (!$util.isString(message.expiredTime))
                    return "expiredTime: string expected";
            if (message.createTime != null && message.hasOwnProperty("createTime"))
                if (!$util.isString(message.createTime))
                    return "createTime: string expected";
            return null;
        };

        /**
         * Creates a CidInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CidInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CidInfo} CidInfo
         */
        CidInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CidInfo)
                return object;
            let message = new $root.pb.CidInfo();
            if (object.cid != null)
                message.cid = String(object.cid);
            if (object.account != null)
                message.account = String(object.account);
            if (object.dappid != null)
                message.dappid = String(object.dappid);
            if (object.payStatus != null)
                message.payStatus = object.payStatus | 0;
            if (object.checkStatus != null)
                message.checkStatus = object.checkStatus | 0;
            if (object.checkUserId != null)
                message.checkUserId = object.checkUserId | 0;
            if (object.checkReason != null)
                message.checkReason = String(object.checkReason);
            if (object.checkTime != null)
                message.checkTime = String(object.checkTime);
            if (object.expiredTime != null)
                message.expiredTime = String(object.expiredTime);
            if (object.createTime != null)
                message.createTime = String(object.createTime);
            return message;
        };

        /**
         * Creates a plain object from a CidInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CidInfo
         * @static
         * @param {pb.CidInfo} message CidInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CidInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.cid = "";
                object.account = "";
                object.dappid = "";
                object.payStatus = 0;
                object.checkStatus = 0;
                object.checkUserId = 0;
                object.checkReason = "";
                object.checkTime = "";
                object.expiredTime = "";
                object.createTime = "";
            }
            if (message.cid != null && message.hasOwnProperty("cid"))
                object.cid = message.cid;
            if (message.account != null && message.hasOwnProperty("account"))
                object.account = message.account;
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                object.dappid = message.dappid;
            if (message.payStatus != null && message.hasOwnProperty("payStatus"))
                object.payStatus = message.payStatus;
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                object.checkStatus = message.checkStatus;
            if (message.checkUserId != null && message.hasOwnProperty("checkUserId"))
                object.checkUserId = message.checkUserId;
            if (message.checkReason != null && message.hasOwnProperty("checkReason"))
                object.checkReason = message.checkReason;
            if (message.checkTime != null && message.hasOwnProperty("checkTime"))
                object.checkTime = message.checkTime;
            if (message.expiredTime != null && message.hasOwnProperty("expiredTime"))
                object.expiredTime = message.expiredTime;
            if (message.createTime != null && message.hasOwnProperty("createTime"))
                object.createTime = message.createTime;
            return object;
        };

        /**
         * Converts this CidInfo to JSON.
         * @function toJSON
         * @memberof pb.CidInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CidInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CidInfo
         * @function getTypeUrl
         * @memberof pb.CidInfo
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CidInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.CidInfo";
        };

        return CidInfo;
    })();

    pb.CreateCidInfoRequest = (function() {

        /**
         * Properties of a CreateCidInfoRequest.
         * @memberof pb
         * @interface ICreateCidInfoRequest
         * @property {string|null} [cid] CreateCidInfoRequest cid
         * @property {string|null} [account] CreateCidInfoRequest account
         * @property {string|null} [dappid] CreateCidInfoRequest dappid
         */

        /**
         * Constructs a new CreateCidInfoRequest.
         * @memberof pb
         * @classdesc Represents a CreateCidInfoRequest.
         * @implements ICreateCidInfoRequest
         * @constructor
         * @param {pb.ICreateCidInfoRequest=} [properties] Properties to set
         */
        function CreateCidInfoRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateCidInfoRequest cid.
         * @member {string} cid
         * @memberof pb.CreateCidInfoRequest
         * @instance
         */
        CreateCidInfoRequest.prototype.cid = "";

        /**
         * CreateCidInfoRequest account.
         * @member {string} account
         * @memberof pb.CreateCidInfoRequest
         * @instance
         */
        CreateCidInfoRequest.prototype.account = "";

        /**
         * CreateCidInfoRequest dappid.
         * @member {string} dappid
         * @memberof pb.CreateCidInfoRequest
         * @instance
         */
        CreateCidInfoRequest.prototype.dappid = "";

        /**
         * Creates a new CreateCidInfoRequest instance using the specified properties.
         * @function create
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {pb.ICreateCidInfoRequest=} [properties] Properties to set
         * @returns {pb.CreateCidInfoRequest} CreateCidInfoRequest instance
         */
        CreateCidInfoRequest.create = function create(properties) {
            return new CreateCidInfoRequest(properties);
        };

        /**
         * Encodes the specified CreateCidInfoRequest message. Does not implicitly {@link pb.CreateCidInfoRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {pb.ICreateCidInfoRequest} message CreateCidInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCidInfoRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
            if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.account);
            if (message.dappid != null && Object.hasOwnProperty.call(message, "dappid"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.dappid);
            return writer;
        };

        /**
         * Encodes the specified CreateCidInfoRequest message, length delimited. Does not implicitly {@link pb.CreateCidInfoRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {pb.ICreateCidInfoRequest} message CreateCidInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCidInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateCidInfoRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateCidInfoRequest} CreateCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCidInfoRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateCidInfoRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cid = reader.string();
                        break;
                    }
                case 2: {
                        message.account = reader.string();
                        break;
                    }
                case 3: {
                        message.dappid = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateCidInfoRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateCidInfoRequest} CreateCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCidInfoRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateCidInfoRequest message.
         * @function verify
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateCidInfoRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cid != null && message.hasOwnProperty("cid"))
                if (!$util.isString(message.cid))
                    return "cid: string expected";
            if (message.account != null && message.hasOwnProperty("account"))
                if (!$util.isString(message.account))
                    return "account: string expected";
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                if (!$util.isString(message.dappid))
                    return "dappid: string expected";
            return null;
        };

        /**
         * Creates a CreateCidInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateCidInfoRequest} CreateCidInfoRequest
         */
        CreateCidInfoRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateCidInfoRequest)
                return object;
            let message = new $root.pb.CreateCidInfoRequest();
            if (object.cid != null)
                message.cid = String(object.cid);
            if (object.account != null)
                message.account = String(object.account);
            if (object.dappid != null)
                message.dappid = String(object.dappid);
            return message;
        };

        /**
         * Creates a plain object from a CreateCidInfoRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {pb.CreateCidInfoRequest} message CreateCidInfoRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateCidInfoRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.cid = "";
                object.account = "";
                object.dappid = "";
            }
            if (message.cid != null && message.hasOwnProperty("cid"))
                object.cid = message.cid;
            if (message.account != null && message.hasOwnProperty("account"))
                object.account = message.account;
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                object.dappid = message.dappid;
            return object;
        };

        /**
         * Converts this CreateCidInfoRequest to JSON.
         * @function toJSON
         * @memberof pb.CreateCidInfoRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateCidInfoRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateCidInfoRequest
         * @function getTypeUrl
         * @memberof pb.CreateCidInfoRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateCidInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.CreateCidInfoRequest";
        };

        return CreateCidInfoRequest;
    })();

    pb.CreateCidInfoResponse = (function() {

        /**
         * Properties of a CreateCidInfoResponse.
         * @memberof pb
         * @interface ICreateCidInfoResponse
         * @property {number|null} [code] CreateCidInfoResponse code
         * @property {string|null} [msg] CreateCidInfoResponse msg
         */

        /**
         * Constructs a new CreateCidInfoResponse.
         * @memberof pb
         * @classdesc Represents a CreateCidInfoResponse.
         * @implements ICreateCidInfoResponse
         * @constructor
         * @param {pb.ICreateCidInfoResponse=} [properties] Properties to set
         */
        function CreateCidInfoResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateCidInfoResponse code.
         * @member {number} code
         * @memberof pb.CreateCidInfoResponse
         * @instance
         */
        CreateCidInfoResponse.prototype.code = 0;

        /**
         * CreateCidInfoResponse msg.
         * @member {string} msg
         * @memberof pb.CreateCidInfoResponse
         * @instance
         */
        CreateCidInfoResponse.prototype.msg = "";

        /**
         * Creates a new CreateCidInfoResponse instance using the specified properties.
         * @function create
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {pb.ICreateCidInfoResponse=} [properties] Properties to set
         * @returns {pb.CreateCidInfoResponse} CreateCidInfoResponse instance
         */
        CreateCidInfoResponse.create = function create(properties) {
            return new CreateCidInfoResponse(properties);
        };

        /**
         * Encodes the specified CreateCidInfoResponse message. Does not implicitly {@link pb.CreateCidInfoResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {pb.ICreateCidInfoResponse} message CreateCidInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCidInfoResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified CreateCidInfoResponse message, length delimited. Does not implicitly {@link pb.CreateCidInfoResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {pb.ICreateCidInfoResponse} message CreateCidInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCidInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateCidInfoResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CreateCidInfoResponse} CreateCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCidInfoResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CreateCidInfoResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateCidInfoResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CreateCidInfoResponse} CreateCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCidInfoResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateCidInfoResponse message.
         * @function verify
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateCidInfoResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates a CreateCidInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CreateCidInfoResponse} CreateCidInfoResponse
         */
        CreateCidInfoResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CreateCidInfoResponse)
                return object;
            let message = new $root.pb.CreateCidInfoResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from a CreateCidInfoResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {pb.CreateCidInfoResponse} message CreateCidInfoResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateCidInfoResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this CreateCidInfoResponse to JSON.
         * @function toJSON
         * @memberof pb.CreateCidInfoResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateCidInfoResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateCidInfoResponse
         * @function getTypeUrl
         * @memberof pb.CreateCidInfoResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateCidInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.CreateCidInfoResponse";
        };

        return CreateCidInfoResponse;
    })();

    pb.GetCidInfoRequest = (function() {

        /**
         * Properties of a GetCidInfoRequest.
         * @memberof pb
         * @interface IGetCidInfoRequest
         * @property {string|null} [cid] GetCidInfoRequest cid
         */

        /**
         * Constructs a new GetCidInfoRequest.
         * @memberof pb
         * @classdesc Represents a GetCidInfoRequest.
         * @implements IGetCidInfoRequest
         * @constructor
         * @param {pb.IGetCidInfoRequest=} [properties] Properties to set
         */
        function GetCidInfoRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetCidInfoRequest cid.
         * @member {string} cid
         * @memberof pb.GetCidInfoRequest
         * @instance
         */
        GetCidInfoRequest.prototype.cid = "";

        /**
         * Creates a new GetCidInfoRequest instance using the specified properties.
         * @function create
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {pb.IGetCidInfoRequest=} [properties] Properties to set
         * @returns {pb.GetCidInfoRequest} GetCidInfoRequest instance
         */
        GetCidInfoRequest.create = function create(properties) {
            return new GetCidInfoRequest(properties);
        };

        /**
         * Encodes the specified GetCidInfoRequest message. Does not implicitly {@link pb.GetCidInfoRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {pb.IGetCidInfoRequest} message GetCidInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCidInfoRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
            return writer;
        };

        /**
         * Encodes the specified GetCidInfoRequest message, length delimited. Does not implicitly {@link pb.GetCidInfoRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {pb.IGetCidInfoRequest} message GetCidInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCidInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetCidInfoRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetCidInfoRequest} GetCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCidInfoRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetCidInfoRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cid = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetCidInfoRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetCidInfoRequest} GetCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCidInfoRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetCidInfoRequest message.
         * @function verify
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetCidInfoRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cid != null && message.hasOwnProperty("cid"))
                if (!$util.isString(message.cid))
                    return "cid: string expected";
            return null;
        };

        /**
         * Creates a GetCidInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetCidInfoRequest} GetCidInfoRequest
         */
        GetCidInfoRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetCidInfoRequest)
                return object;
            let message = new $root.pb.GetCidInfoRequest();
            if (object.cid != null)
                message.cid = String(object.cid);
            return message;
        };

        /**
         * Creates a plain object from a GetCidInfoRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {pb.GetCidInfoRequest} message GetCidInfoRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetCidInfoRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.cid = "";
            if (message.cid != null && message.hasOwnProperty("cid"))
                object.cid = message.cid;
            return object;
        };

        /**
         * Converts this GetCidInfoRequest to JSON.
         * @function toJSON
         * @memberof pb.GetCidInfoRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetCidInfoRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetCidInfoRequest
         * @function getTypeUrl
         * @memberof pb.GetCidInfoRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetCidInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetCidInfoRequest";
        };

        return GetCidInfoRequest;
    })();

    pb.GetCidInfoResponse = (function() {

        /**
         * Properties of a GetCidInfoResponse.
         * @memberof pb
         * @interface IGetCidInfoResponse
         * @property {number|null} [code] GetCidInfoResponse code
         * @property {string|null} [msg] GetCidInfoResponse msg
         * @property {pb.ICidInfo|null} [data] GetCidInfoResponse data
         */

        /**
         * Constructs a new GetCidInfoResponse.
         * @memberof pb
         * @classdesc Represents a GetCidInfoResponse.
         * @implements IGetCidInfoResponse
         * @constructor
         * @param {pb.IGetCidInfoResponse=} [properties] Properties to set
         */
        function GetCidInfoResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GetCidInfoResponse code.
         * @member {number} code
         * @memberof pb.GetCidInfoResponse
         * @instance
         */
        GetCidInfoResponse.prototype.code = 0;

        /**
         * GetCidInfoResponse msg.
         * @member {string} msg
         * @memberof pb.GetCidInfoResponse
         * @instance
         */
        GetCidInfoResponse.prototype.msg = "";

        /**
         * GetCidInfoResponse data.
         * @member {pb.ICidInfo|null|undefined} data
         * @memberof pb.GetCidInfoResponse
         * @instance
         */
        GetCidInfoResponse.prototype.data = null;

        /**
         * Creates a new GetCidInfoResponse instance using the specified properties.
         * @function create
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {pb.IGetCidInfoResponse=} [properties] Properties to set
         * @returns {pb.GetCidInfoResponse} GetCidInfoResponse instance
         */
        GetCidInfoResponse.create = function create(properties) {
            return new GetCidInfoResponse(properties);
        };

        /**
         * Encodes the specified GetCidInfoResponse message. Does not implicitly {@link pb.GetCidInfoResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {pb.IGetCidInfoResponse} message GetCidInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCidInfoResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.CidInfo.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GetCidInfoResponse message, length delimited. Does not implicitly {@link pb.GetCidInfoResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {pb.IGetCidInfoResponse} message GetCidInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GetCidInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GetCidInfoResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.GetCidInfoResponse} GetCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCidInfoResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.GetCidInfoResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.CidInfo.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GetCidInfoResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.GetCidInfoResponse} GetCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GetCidInfoResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GetCidInfoResponse message.
         * @function verify
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GetCidInfoResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.CidInfo.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a GetCidInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.GetCidInfoResponse} GetCidInfoResponse
         */
        GetCidInfoResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.GetCidInfoResponse)
                return object;
            let message = new $root.pb.GetCidInfoResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.GetCidInfoResponse.data: object expected");
                message.data = $root.pb.CidInfo.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a GetCidInfoResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {pb.GetCidInfoResponse} message GetCidInfoResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GetCidInfoResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.CidInfo.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this GetCidInfoResponse to JSON.
         * @function toJSON
         * @memberof pb.GetCidInfoResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GetCidInfoResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GetCidInfoResponse
         * @function getTypeUrl
         * @memberof pb.GetCidInfoResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GetCidInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.GetCidInfoResponse";
        };

        return GetCidInfoResponse;
    })();

    pb.PageQueryRequest = (function() {

        /**
         * Properties of a PageQueryRequest.
         * @memberof pb
         * @interface IPageQueryRequest
         * @property {number|null} [page] PageQueryRequest page
         * @property {number|null} [pageSize] PageQueryRequest pageSize
         * @property {string|null} [account] PageQueryRequest account
         * @property {string|null} [dappid] PageQueryRequest dappid
         * @property {number|null} [payStatus] PageQueryRequest payStatus
         * @property {number|null} [checkStatus] PageQueryRequest checkStatus
         * @property {string|null} [startTime] PageQueryRequest startTime
         * @property {string|null} [endTime] PageQueryRequest endTime
         */

        /**
         * Constructs a new PageQueryRequest.
         * @memberof pb
         * @classdesc Represents a PageQueryRequest.
         * @implements IPageQueryRequest
         * @constructor
         * @param {pb.IPageQueryRequest=} [properties] Properties to set
         */
        function PageQueryRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PageQueryRequest page.
         * @member {number} page
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.page = 0;

        /**
         * PageQueryRequest pageSize.
         * @member {number} pageSize
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.pageSize = 0;

        /**
         * PageQueryRequest account.
         * @member {string} account
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.account = "";

        /**
         * PageQueryRequest dappid.
         * @member {string} dappid
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.dappid = "";

        /**
         * PageQueryRequest payStatus.
         * @member {number} payStatus
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.payStatus = 0;

        /**
         * PageQueryRequest checkStatus.
         * @member {number} checkStatus
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.checkStatus = 0;

        /**
         * PageQueryRequest startTime.
         * @member {string} startTime
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.startTime = "";

        /**
         * PageQueryRequest endTime.
         * @member {string} endTime
         * @memberof pb.PageQueryRequest
         * @instance
         */
        PageQueryRequest.prototype.endTime = "";

        /**
         * Creates a new PageQueryRequest instance using the specified properties.
         * @function create
         * @memberof pb.PageQueryRequest
         * @static
         * @param {pb.IPageQueryRequest=} [properties] Properties to set
         * @returns {pb.PageQueryRequest} PageQueryRequest instance
         */
        PageQueryRequest.create = function create(properties) {
            return new PageQueryRequest(properties);
        };

        /**
         * Encodes the specified PageQueryRequest message. Does not implicitly {@link pb.PageQueryRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.PageQueryRequest
         * @static
         * @param {pb.IPageQueryRequest} message PageQueryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PageQueryRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.page != null && Object.hasOwnProperty.call(message, "page"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.page);
            if (message.pageSize != null && Object.hasOwnProperty.call(message, "pageSize"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pageSize);
            if (message.account != null && Object.hasOwnProperty.call(message, "account"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.account);
            if (message.dappid != null && Object.hasOwnProperty.call(message, "dappid"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.dappid);
            if (message.payStatus != null && Object.hasOwnProperty.call(message, "payStatus"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.payStatus);
            if (message.checkStatus != null && Object.hasOwnProperty.call(message, "checkStatus"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.checkStatus);
            if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.startTime);
            if (message.endTime != null && Object.hasOwnProperty.call(message, "endTime"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.endTime);
            return writer;
        };

        /**
         * Encodes the specified PageQueryRequest message, length delimited. Does not implicitly {@link pb.PageQueryRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.PageQueryRequest
         * @static
         * @param {pb.IPageQueryRequest} message PageQueryRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PageQueryRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PageQueryRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.PageQueryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.PageQueryRequest} PageQueryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PageQueryRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.PageQueryRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.page = reader.int32();
                        break;
                    }
                case 2: {
                        message.pageSize = reader.int32();
                        break;
                    }
                case 3: {
                        message.account = reader.string();
                        break;
                    }
                case 4: {
                        message.dappid = reader.string();
                        break;
                    }
                case 5: {
                        message.payStatus = reader.int32();
                        break;
                    }
                case 6: {
                        message.checkStatus = reader.int32();
                        break;
                    }
                case 7: {
                        message.startTime = reader.string();
                        break;
                    }
                case 8: {
                        message.endTime = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PageQueryRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.PageQueryRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.PageQueryRequest} PageQueryRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PageQueryRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PageQueryRequest message.
         * @function verify
         * @memberof pb.PageQueryRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PageQueryRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.page != null && message.hasOwnProperty("page"))
                if (!$util.isInteger(message.page))
                    return "page: integer expected";
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                if (!$util.isInteger(message.pageSize))
                    return "pageSize: integer expected";
            if (message.account != null && message.hasOwnProperty("account"))
                if (!$util.isString(message.account))
                    return "account: string expected";
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                if (!$util.isString(message.dappid))
                    return "dappid: string expected";
            if (message.payStatus != null && message.hasOwnProperty("payStatus"))
                if (!$util.isInteger(message.payStatus))
                    return "payStatus: integer expected";
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                if (!$util.isInteger(message.checkStatus))
                    return "checkStatus: integer expected";
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isString(message.startTime))
                    return "startTime: string expected";
            if (message.endTime != null && message.hasOwnProperty("endTime"))
                if (!$util.isString(message.endTime))
                    return "endTime: string expected";
            return null;
        };

        /**
         * Creates a PageQueryRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.PageQueryRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.PageQueryRequest} PageQueryRequest
         */
        PageQueryRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.PageQueryRequest)
                return object;
            let message = new $root.pb.PageQueryRequest();
            if (object.page != null)
                message.page = object.page | 0;
            if (object.pageSize != null)
                message.pageSize = object.pageSize | 0;
            if (object.account != null)
                message.account = String(object.account);
            if (object.dappid != null)
                message.dappid = String(object.dappid);
            if (object.payStatus != null)
                message.payStatus = object.payStatus | 0;
            if (object.checkStatus != null)
                message.checkStatus = object.checkStatus | 0;
            if (object.startTime != null)
                message.startTime = String(object.startTime);
            if (object.endTime != null)
                message.endTime = String(object.endTime);
            return message;
        };

        /**
         * Creates a plain object from a PageQueryRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.PageQueryRequest
         * @static
         * @param {pb.PageQueryRequest} message PageQueryRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PageQueryRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.page = 0;
                object.pageSize = 0;
                object.account = "";
                object.dappid = "";
                object.payStatus = 0;
                object.checkStatus = 0;
                object.startTime = "";
                object.endTime = "";
            }
            if (message.page != null && message.hasOwnProperty("page"))
                object.page = message.page;
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                object.pageSize = message.pageSize;
            if (message.account != null && message.hasOwnProperty("account"))
                object.account = message.account;
            if (message.dappid != null && message.hasOwnProperty("dappid"))
                object.dappid = message.dappid;
            if (message.payStatus != null && message.hasOwnProperty("payStatus"))
                object.payStatus = message.payStatus;
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                object.checkStatus = message.checkStatus;
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                object.startTime = message.startTime;
            if (message.endTime != null && message.hasOwnProperty("endTime"))
                object.endTime = message.endTime;
            return object;
        };

        /**
         * Converts this PageQueryRequest to JSON.
         * @function toJSON
         * @memberof pb.PageQueryRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PageQueryRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PageQueryRequest
         * @function getTypeUrl
         * @memberof pb.PageQueryRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PageQueryRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.PageQueryRequest";
        };

        return PageQueryRequest;
    })();

    pb.PageQueryResponse = (function() {

        /**
         * Properties of a PageQueryResponse.
         * @memberof pb
         * @interface IPageQueryResponse
         * @property {number|null} [code] PageQueryResponse code
         * @property {string|null} [msg] PageQueryResponse msg
         * @property {pb.ICIDPageResult|null} [data] PageQueryResponse data
         */

        /**
         * Constructs a new PageQueryResponse.
         * @memberof pb
         * @classdesc Represents a PageQueryResponse.
         * @implements IPageQueryResponse
         * @constructor
         * @param {pb.IPageQueryResponse=} [properties] Properties to set
         */
        function PageQueryResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PageQueryResponse code.
         * @member {number} code
         * @memberof pb.PageQueryResponse
         * @instance
         */
        PageQueryResponse.prototype.code = 0;

        /**
         * PageQueryResponse msg.
         * @member {string} msg
         * @memberof pb.PageQueryResponse
         * @instance
         */
        PageQueryResponse.prototype.msg = "";

        /**
         * PageQueryResponse data.
         * @member {pb.ICIDPageResult|null|undefined} data
         * @memberof pb.PageQueryResponse
         * @instance
         */
        PageQueryResponse.prototype.data = null;

        /**
         * Creates a new PageQueryResponse instance using the specified properties.
         * @function create
         * @memberof pb.PageQueryResponse
         * @static
         * @param {pb.IPageQueryResponse=} [properties] Properties to set
         * @returns {pb.PageQueryResponse} PageQueryResponse instance
         */
        PageQueryResponse.create = function create(properties) {
            return new PageQueryResponse(properties);
        };

        /**
         * Encodes the specified PageQueryResponse message. Does not implicitly {@link pb.PageQueryResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.PageQueryResponse
         * @static
         * @param {pb.IPageQueryResponse} message PageQueryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PageQueryResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                $root.pb.CIDPageResult.encode(message.data, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PageQueryResponse message, length delimited. Does not implicitly {@link pb.PageQueryResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.PageQueryResponse
         * @static
         * @param {pb.IPageQueryResponse} message PageQueryResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PageQueryResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PageQueryResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.PageQueryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.PageQueryResponse} PageQueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PageQueryResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.PageQueryResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                case 3: {
                        message.data = $root.pb.CIDPageResult.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PageQueryResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.PageQueryResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.PageQueryResponse} PageQueryResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PageQueryResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PageQueryResponse message.
         * @function verify
         * @memberof pb.PageQueryResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PageQueryResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                let error = $root.pb.CIDPageResult.verify(message.data);
                if (error)
                    return "data." + error;
            }
            return null;
        };

        /**
         * Creates a PageQueryResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.PageQueryResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.PageQueryResponse} PageQueryResponse
         */
        PageQueryResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.PageQueryResponse)
                return object;
            let message = new $root.pb.PageQueryResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            if (object.data != null) {
                if (typeof object.data !== "object")
                    throw TypeError(".pb.PageQueryResponse.data: object expected");
                message.data = $root.pb.CIDPageResult.fromObject(object.data);
            }
            return message;
        };

        /**
         * Creates a plain object from a PageQueryResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.PageQueryResponse
         * @static
         * @param {pb.PageQueryResponse} message PageQueryResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PageQueryResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
                object.data = null;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = $root.pb.CIDPageResult.toObject(message.data, options);
            return object;
        };

        /**
         * Converts this PageQueryResponse to JSON.
         * @function toJSON
         * @memberof pb.PageQueryResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PageQueryResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PageQueryResponse
         * @function getTypeUrl
         * @memberof pb.PageQueryResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PageQueryResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.PageQueryResponse";
        };

        return PageQueryResponse;
    })();

    pb.CIDPageResult = (function() {

        /**
         * Properties of a CIDPageResult.
         * @memberof pb
         * @interface ICIDPageResult
         * @property {number|Long|null} [total] CIDPageResult total
         * @property {Array.<pb.ICidInfo>|null} [list] CIDPageResult list
         * @property {number|null} [page] CIDPageResult page
         * @property {number|null} [pageSize] CIDPageResult pageSize
         * @property {number|null} [totalPages] CIDPageResult totalPages
         */

        /**
         * Constructs a new CIDPageResult.
         * @memberof pb
         * @classdesc Represents a CIDPageResult.
         * @implements ICIDPageResult
         * @constructor
         * @param {pb.ICIDPageResult=} [properties] Properties to set
         */
        function CIDPageResult(properties) {
            this.list = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CIDPageResult total.
         * @member {number|Long} total
         * @memberof pb.CIDPageResult
         * @instance
         */
        CIDPageResult.prototype.total = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CIDPageResult list.
         * @member {Array.<pb.ICidInfo>} list
         * @memberof pb.CIDPageResult
         * @instance
         */
        CIDPageResult.prototype.list = $util.emptyArray;

        /**
         * CIDPageResult page.
         * @member {number} page
         * @memberof pb.CIDPageResult
         * @instance
         */
        CIDPageResult.prototype.page = 0;

        /**
         * CIDPageResult pageSize.
         * @member {number} pageSize
         * @memberof pb.CIDPageResult
         * @instance
         */
        CIDPageResult.prototype.pageSize = 0;

        /**
         * CIDPageResult totalPages.
         * @member {number} totalPages
         * @memberof pb.CIDPageResult
         * @instance
         */
        CIDPageResult.prototype.totalPages = 0;

        /**
         * Creates a new CIDPageResult instance using the specified properties.
         * @function create
         * @memberof pb.CIDPageResult
         * @static
         * @param {pb.ICIDPageResult=} [properties] Properties to set
         * @returns {pb.CIDPageResult} CIDPageResult instance
         */
        CIDPageResult.create = function create(properties) {
            return new CIDPageResult(properties);
        };

        /**
         * Encodes the specified CIDPageResult message. Does not implicitly {@link pb.CIDPageResult.verify|verify} messages.
         * @function encode
         * @memberof pb.CIDPageResult
         * @static
         * @param {pb.ICIDPageResult} message CIDPageResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CIDPageResult.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.total != null && Object.hasOwnProperty.call(message, "total"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.total);
            if (message.list != null && message.list.length)
                for (let i = 0; i < message.list.length; ++i)
                    $root.pb.CidInfo.encode(message.list[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.page != null && Object.hasOwnProperty.call(message, "page"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.page);
            if (message.pageSize != null && Object.hasOwnProperty.call(message, "pageSize"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.pageSize);
            if (message.totalPages != null && Object.hasOwnProperty.call(message, "totalPages"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.totalPages);
            return writer;
        };

        /**
         * Encodes the specified CIDPageResult message, length delimited. Does not implicitly {@link pb.CIDPageResult.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.CIDPageResult
         * @static
         * @param {pb.ICIDPageResult} message CIDPageResult message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CIDPageResult.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CIDPageResult message from the specified reader or buffer.
         * @function decode
         * @memberof pb.CIDPageResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.CIDPageResult} CIDPageResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CIDPageResult.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.CIDPageResult();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.total = reader.int64();
                        break;
                    }
                case 2: {
                        if (!(message.list && message.list.length))
                            message.list = [];
                        message.list.push($root.pb.CidInfo.decode(reader, reader.uint32()));
                        break;
                    }
                case 3: {
                        message.page = reader.int32();
                        break;
                    }
                case 4: {
                        message.pageSize = reader.int32();
                        break;
                    }
                case 5: {
                        message.totalPages = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CIDPageResult message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.CIDPageResult
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.CIDPageResult} CIDPageResult
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CIDPageResult.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CIDPageResult message.
         * @function verify
         * @memberof pb.CIDPageResult
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CIDPageResult.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.total != null && message.hasOwnProperty("total"))
                if (!$util.isInteger(message.total) && !(message.total && $util.isInteger(message.total.low) && $util.isInteger(message.total.high)))
                    return "total: integer|Long expected";
            if (message.list != null && message.hasOwnProperty("list")) {
                if (!Array.isArray(message.list))
                    return "list: array expected";
                for (let i = 0; i < message.list.length; ++i) {
                    let error = $root.pb.CidInfo.verify(message.list[i]);
                    if (error)
                        return "list." + error;
                }
            }
            if (message.page != null && message.hasOwnProperty("page"))
                if (!$util.isInteger(message.page))
                    return "page: integer expected";
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                if (!$util.isInteger(message.pageSize))
                    return "pageSize: integer expected";
            if (message.totalPages != null && message.hasOwnProperty("totalPages"))
                if (!$util.isInteger(message.totalPages))
                    return "totalPages: integer expected";
            return null;
        };

        /**
         * Creates a CIDPageResult message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.CIDPageResult
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.CIDPageResult} CIDPageResult
         */
        CIDPageResult.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.CIDPageResult)
                return object;
            let message = new $root.pb.CIDPageResult();
            if (object.total != null)
                if ($util.Long)
                    (message.total = $util.Long.fromValue(object.total)).unsigned = false;
                else if (typeof object.total === "string")
                    message.total = parseInt(object.total, 10);
                else if (typeof object.total === "number")
                    message.total = object.total;
                else if (typeof object.total === "object")
                    message.total = new $util.LongBits(object.total.low >>> 0, object.total.high >>> 0).toNumber();
            if (object.list) {
                if (!Array.isArray(object.list))
                    throw TypeError(".pb.CIDPageResult.list: array expected");
                message.list = [];
                for (let i = 0; i < object.list.length; ++i) {
                    if (typeof object.list[i] !== "object")
                        throw TypeError(".pb.CIDPageResult.list: object expected");
                    message.list[i] = $root.pb.CidInfo.fromObject(object.list[i]);
                }
            }
            if (object.page != null)
                message.page = object.page | 0;
            if (object.pageSize != null)
                message.pageSize = object.pageSize | 0;
            if (object.totalPages != null)
                message.totalPages = object.totalPages | 0;
            return message;
        };

        /**
         * Creates a plain object from a CIDPageResult message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.CIDPageResult
         * @static
         * @param {pb.CIDPageResult} message CIDPageResult
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CIDPageResult.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.list = [];
            if (options.defaults) {
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.total = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.total = options.longs === String ? "0" : 0;
                object.page = 0;
                object.pageSize = 0;
                object.totalPages = 0;
            }
            if (message.total != null && message.hasOwnProperty("total"))
                if (typeof message.total === "number")
                    object.total = options.longs === String ? String(message.total) : message.total;
                else
                    object.total = options.longs === String ? $util.Long.prototype.toString.call(message.total) : options.longs === Number ? new $util.LongBits(message.total.low >>> 0, message.total.high >>> 0).toNumber() : message.total;
            if (message.list && message.list.length) {
                object.list = [];
                for (let j = 0; j < message.list.length; ++j)
                    object.list[j] = $root.pb.CidInfo.toObject(message.list[j], options);
            }
            if (message.page != null && message.hasOwnProperty("page"))
                object.page = message.page;
            if (message.pageSize != null && message.hasOwnProperty("pageSize"))
                object.pageSize = message.pageSize;
            if (message.totalPages != null && message.hasOwnProperty("totalPages"))
                object.totalPages = message.totalPages;
            return object;
        };

        /**
         * Converts this CIDPageResult to JSON.
         * @function toJSON
         * @memberof pb.CIDPageResult
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CIDPageResult.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CIDPageResult
         * @function getTypeUrl
         * @memberof pb.CIDPageResult
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CIDPageResult.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.CIDPageResult";
        };

        return CIDPageResult;
    })();

    pb.UpdateCheckStatusRequest = (function() {

        /**
         * Properties of an UpdateCheckStatusRequest.
         * @memberof pb
         * @interface IUpdateCheckStatusRequest
         * @property {string|null} [cid] UpdateCheckStatusRequest cid
         * @property {number|null} [checkStatus] UpdateCheckStatusRequest checkStatus
         * @property {number|null} [checkUserId] UpdateCheckStatusRequest checkUserId
         * @property {string|null} [checkReason] UpdateCheckStatusRequest checkReason
         */

        /**
         * Constructs a new UpdateCheckStatusRequest.
         * @memberof pb
         * @classdesc Represents an UpdateCheckStatusRequest.
         * @implements IUpdateCheckStatusRequest
         * @constructor
         * @param {pb.IUpdateCheckStatusRequest=} [properties] Properties to set
         */
        function UpdateCheckStatusRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateCheckStatusRequest cid.
         * @member {string} cid
         * @memberof pb.UpdateCheckStatusRequest
         * @instance
         */
        UpdateCheckStatusRequest.prototype.cid = "";

        /**
         * UpdateCheckStatusRequest checkStatus.
         * @member {number} checkStatus
         * @memberof pb.UpdateCheckStatusRequest
         * @instance
         */
        UpdateCheckStatusRequest.prototype.checkStatus = 0;

        /**
         * UpdateCheckStatusRequest checkUserId.
         * @member {number} checkUserId
         * @memberof pb.UpdateCheckStatusRequest
         * @instance
         */
        UpdateCheckStatusRequest.prototype.checkUserId = 0;

        /**
         * UpdateCheckStatusRequest checkReason.
         * @member {string} checkReason
         * @memberof pb.UpdateCheckStatusRequest
         * @instance
         */
        UpdateCheckStatusRequest.prototype.checkReason = "";

        /**
         * Creates a new UpdateCheckStatusRequest instance using the specified properties.
         * @function create
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {pb.IUpdateCheckStatusRequest=} [properties] Properties to set
         * @returns {pb.UpdateCheckStatusRequest} UpdateCheckStatusRequest instance
         */
        UpdateCheckStatusRequest.create = function create(properties) {
            return new UpdateCheckStatusRequest(properties);
        };

        /**
         * Encodes the specified UpdateCheckStatusRequest message. Does not implicitly {@link pb.UpdateCheckStatusRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {pb.IUpdateCheckStatusRequest} message UpdateCheckStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCheckStatusRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
            if (message.checkStatus != null && Object.hasOwnProperty.call(message, "checkStatus"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.checkStatus);
            if (message.checkUserId != null && Object.hasOwnProperty.call(message, "checkUserId"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.checkUserId);
            if (message.checkReason != null && Object.hasOwnProperty.call(message, "checkReason"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.checkReason);
            return writer;
        };

        /**
         * Encodes the specified UpdateCheckStatusRequest message, length delimited. Does not implicitly {@link pb.UpdateCheckStatusRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {pb.IUpdateCheckStatusRequest} message UpdateCheckStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCheckStatusRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateCheckStatusRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.UpdateCheckStatusRequest} UpdateCheckStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCheckStatusRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.UpdateCheckStatusRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cid = reader.string();
                        break;
                    }
                case 2: {
                        message.checkStatus = reader.int32();
                        break;
                    }
                case 3: {
                        message.checkUserId = reader.int32();
                        break;
                    }
                case 4: {
                        message.checkReason = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UpdateCheckStatusRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.UpdateCheckStatusRequest} UpdateCheckStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCheckStatusRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateCheckStatusRequest message.
         * @function verify
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateCheckStatusRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cid != null && message.hasOwnProperty("cid"))
                if (!$util.isString(message.cid))
                    return "cid: string expected";
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                if (!$util.isInteger(message.checkStatus))
                    return "checkStatus: integer expected";
            if (message.checkUserId != null && message.hasOwnProperty("checkUserId"))
                if (!$util.isInteger(message.checkUserId))
                    return "checkUserId: integer expected";
            if (message.checkReason != null && message.hasOwnProperty("checkReason"))
                if (!$util.isString(message.checkReason))
                    return "checkReason: string expected";
            return null;
        };

        /**
         * Creates an UpdateCheckStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.UpdateCheckStatusRequest} UpdateCheckStatusRequest
         */
        UpdateCheckStatusRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.UpdateCheckStatusRequest)
                return object;
            let message = new $root.pb.UpdateCheckStatusRequest();
            if (object.cid != null)
                message.cid = String(object.cid);
            if (object.checkStatus != null)
                message.checkStatus = object.checkStatus | 0;
            if (object.checkUserId != null)
                message.checkUserId = object.checkUserId | 0;
            if (object.checkReason != null)
                message.checkReason = String(object.checkReason);
            return message;
        };

        /**
         * Creates a plain object from an UpdateCheckStatusRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {pb.UpdateCheckStatusRequest} message UpdateCheckStatusRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateCheckStatusRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.cid = "";
                object.checkStatus = 0;
                object.checkUserId = 0;
                object.checkReason = "";
            }
            if (message.cid != null && message.hasOwnProperty("cid"))
                object.cid = message.cid;
            if (message.checkStatus != null && message.hasOwnProperty("checkStatus"))
                object.checkStatus = message.checkStatus;
            if (message.checkUserId != null && message.hasOwnProperty("checkUserId"))
                object.checkUserId = message.checkUserId;
            if (message.checkReason != null && message.hasOwnProperty("checkReason"))
                object.checkReason = message.checkReason;
            return object;
        };

        /**
         * Converts this UpdateCheckStatusRequest to JSON.
         * @function toJSON
         * @memberof pb.UpdateCheckStatusRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateCheckStatusRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UpdateCheckStatusRequest
         * @function getTypeUrl
         * @memberof pb.UpdateCheckStatusRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UpdateCheckStatusRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.UpdateCheckStatusRequest";
        };

        return UpdateCheckStatusRequest;
    })();

    pb.UpdateCheckStatusResponse = (function() {

        /**
         * Properties of an UpdateCheckStatusResponse.
         * @memberof pb
         * @interface IUpdateCheckStatusResponse
         * @property {number|null} [code] UpdateCheckStatusResponse code
         * @property {string|null} [msg] UpdateCheckStatusResponse msg
         */

        /**
         * Constructs a new UpdateCheckStatusResponse.
         * @memberof pb
         * @classdesc Represents an UpdateCheckStatusResponse.
         * @implements IUpdateCheckStatusResponse
         * @constructor
         * @param {pb.IUpdateCheckStatusResponse=} [properties] Properties to set
         */
        function UpdateCheckStatusResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UpdateCheckStatusResponse code.
         * @member {number} code
         * @memberof pb.UpdateCheckStatusResponse
         * @instance
         */
        UpdateCheckStatusResponse.prototype.code = 0;

        /**
         * UpdateCheckStatusResponse msg.
         * @member {string} msg
         * @memberof pb.UpdateCheckStatusResponse
         * @instance
         */
        UpdateCheckStatusResponse.prototype.msg = "";

        /**
         * Creates a new UpdateCheckStatusResponse instance using the specified properties.
         * @function create
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {pb.IUpdateCheckStatusResponse=} [properties] Properties to set
         * @returns {pb.UpdateCheckStatusResponse} UpdateCheckStatusResponse instance
         */
        UpdateCheckStatusResponse.create = function create(properties) {
            return new UpdateCheckStatusResponse(properties);
        };

        /**
         * Encodes the specified UpdateCheckStatusResponse message. Does not implicitly {@link pb.UpdateCheckStatusResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {pb.IUpdateCheckStatusResponse} message UpdateCheckStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCheckStatusResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified UpdateCheckStatusResponse message, length delimited. Does not implicitly {@link pb.UpdateCheckStatusResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {pb.IUpdateCheckStatusResponse} message UpdateCheckStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UpdateCheckStatusResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an UpdateCheckStatusResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.UpdateCheckStatusResponse} UpdateCheckStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCheckStatusResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.UpdateCheckStatusResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an UpdateCheckStatusResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.UpdateCheckStatusResponse} UpdateCheckStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UpdateCheckStatusResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an UpdateCheckStatusResponse message.
         * @function verify
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UpdateCheckStatusResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates an UpdateCheckStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.UpdateCheckStatusResponse} UpdateCheckStatusResponse
         */
        UpdateCheckStatusResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.UpdateCheckStatusResponse)
                return object;
            let message = new $root.pb.UpdateCheckStatusResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from an UpdateCheckStatusResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {pb.UpdateCheckStatusResponse} message UpdateCheckStatusResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UpdateCheckStatusResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this UpdateCheckStatusResponse to JSON.
         * @function toJSON
         * @memberof pb.UpdateCheckStatusResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UpdateCheckStatusResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UpdateCheckStatusResponse
         * @function getTypeUrl
         * @memberof pb.UpdateCheckStatusResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UpdateCheckStatusResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.UpdateCheckStatusResponse";
        };

        return UpdateCheckStatusResponse;
    })();

    pb.DeleteCidInfoRequest = (function() {

        /**
         * Properties of a DeleteCidInfoRequest.
         * @memberof pb
         * @interface IDeleteCidInfoRequest
         * @property {string|null} [cid] DeleteCidInfoRequest cid
         */

        /**
         * Constructs a new DeleteCidInfoRequest.
         * @memberof pb
         * @classdesc Represents a DeleteCidInfoRequest.
         * @implements IDeleteCidInfoRequest
         * @constructor
         * @param {pb.IDeleteCidInfoRequest=} [properties] Properties to set
         */
        function DeleteCidInfoRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeleteCidInfoRequest cid.
         * @member {string} cid
         * @memberof pb.DeleteCidInfoRequest
         * @instance
         */
        DeleteCidInfoRequest.prototype.cid = "";

        /**
         * Creates a new DeleteCidInfoRequest instance using the specified properties.
         * @function create
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {pb.IDeleteCidInfoRequest=} [properties] Properties to set
         * @returns {pb.DeleteCidInfoRequest} DeleteCidInfoRequest instance
         */
        DeleteCidInfoRequest.create = function create(properties) {
            return new DeleteCidInfoRequest(properties);
        };

        /**
         * Encodes the specified DeleteCidInfoRequest message. Does not implicitly {@link pb.DeleteCidInfoRequest.verify|verify} messages.
         * @function encode
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {pb.IDeleteCidInfoRequest} message DeleteCidInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCidInfoRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cid);
            return writer;
        };

        /**
         * Encodes the specified DeleteCidInfoRequest message, length delimited. Does not implicitly {@link pb.DeleteCidInfoRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {pb.IDeleteCidInfoRequest} message DeleteCidInfoRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCidInfoRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeleteCidInfoRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.DeleteCidInfoRequest} DeleteCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCidInfoRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.DeleteCidInfoRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.cid = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeleteCidInfoRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.DeleteCidInfoRequest} DeleteCidInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCidInfoRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeleteCidInfoRequest message.
         * @function verify
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeleteCidInfoRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cid != null && message.hasOwnProperty("cid"))
                if (!$util.isString(message.cid))
                    return "cid: string expected";
            return null;
        };

        /**
         * Creates a DeleteCidInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.DeleteCidInfoRequest} DeleteCidInfoRequest
         */
        DeleteCidInfoRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.DeleteCidInfoRequest)
                return object;
            let message = new $root.pb.DeleteCidInfoRequest();
            if (object.cid != null)
                message.cid = String(object.cid);
            return message;
        };

        /**
         * Creates a plain object from a DeleteCidInfoRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {pb.DeleteCidInfoRequest} message DeleteCidInfoRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeleteCidInfoRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.cid = "";
            if (message.cid != null && message.hasOwnProperty("cid"))
                object.cid = message.cid;
            return object;
        };

        /**
         * Converts this DeleteCidInfoRequest to JSON.
         * @function toJSON
         * @memberof pb.DeleteCidInfoRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeleteCidInfoRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DeleteCidInfoRequest
         * @function getTypeUrl
         * @memberof pb.DeleteCidInfoRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeleteCidInfoRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.DeleteCidInfoRequest";
        };

        return DeleteCidInfoRequest;
    })();

    pb.DeleteCidInfoResponse = (function() {

        /**
         * Properties of a DeleteCidInfoResponse.
         * @memberof pb
         * @interface IDeleteCidInfoResponse
         * @property {number|null} [code] DeleteCidInfoResponse code
         * @property {string|null} [msg] DeleteCidInfoResponse msg
         */

        /**
         * Constructs a new DeleteCidInfoResponse.
         * @memberof pb
         * @classdesc Represents a DeleteCidInfoResponse.
         * @implements IDeleteCidInfoResponse
         * @constructor
         * @param {pb.IDeleteCidInfoResponse=} [properties] Properties to set
         */
        function DeleteCidInfoResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeleteCidInfoResponse code.
         * @member {number} code
         * @memberof pb.DeleteCidInfoResponse
         * @instance
         */
        DeleteCidInfoResponse.prototype.code = 0;

        /**
         * DeleteCidInfoResponse msg.
         * @member {string} msg
         * @memberof pb.DeleteCidInfoResponse
         * @instance
         */
        DeleteCidInfoResponse.prototype.msg = "";

        /**
         * Creates a new DeleteCidInfoResponse instance using the specified properties.
         * @function create
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {pb.IDeleteCidInfoResponse=} [properties] Properties to set
         * @returns {pb.DeleteCidInfoResponse} DeleteCidInfoResponse instance
         */
        DeleteCidInfoResponse.create = function create(properties) {
            return new DeleteCidInfoResponse(properties);
        };

        /**
         * Encodes the specified DeleteCidInfoResponse message. Does not implicitly {@link pb.DeleteCidInfoResponse.verify|verify} messages.
         * @function encode
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {pb.IDeleteCidInfoResponse} message DeleteCidInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCidInfoResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.msg != null && Object.hasOwnProperty.call(message, "msg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.msg);
            return writer;
        };

        /**
         * Encodes the specified DeleteCidInfoResponse message, length delimited. Does not implicitly {@link pb.DeleteCidInfoResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {pb.IDeleteCidInfoResponse} message DeleteCidInfoResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeleteCidInfoResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeleteCidInfoResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb.DeleteCidInfoResponse} DeleteCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCidInfoResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb.DeleteCidInfoResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.msg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeleteCidInfoResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb.DeleteCidInfoResponse} DeleteCidInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeleteCidInfoResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeleteCidInfoResponse message.
         * @function verify
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeleteCidInfoResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.msg != null && message.hasOwnProperty("msg"))
                if (!$util.isString(message.msg))
                    return "msg: string expected";
            return null;
        };

        /**
         * Creates a DeleteCidInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb.DeleteCidInfoResponse} DeleteCidInfoResponse
         */
        DeleteCidInfoResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb.DeleteCidInfoResponse)
                return object;
            let message = new $root.pb.DeleteCidInfoResponse();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.msg != null)
                message.msg = String(object.msg);
            return message;
        };

        /**
         * Creates a plain object from a DeleteCidInfoResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {pb.DeleteCidInfoResponse} message DeleteCidInfoResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeleteCidInfoResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.msg = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.msg != null && message.hasOwnProperty("msg"))
                object.msg = message.msg;
            return object;
        };

        /**
         * Converts this DeleteCidInfoResponse to JSON.
         * @function toJSON
         * @memberof pb.DeleteCidInfoResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeleteCidInfoResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DeleteCidInfoResponse
         * @function getTypeUrl
         * @memberof pb.DeleteCidInfoResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeleteCidInfoResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb.DeleteCidInfoResponse";
        };

        return DeleteCidInfoResponse;
    })();

    return pb;
})();

export { $root as default };
