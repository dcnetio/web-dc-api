/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const net = $root.net = (() => {

    /**
     * Namespace net.
     * @exports net
     * @namespace
     */
    const net = {};

    net.pb = (function() {

        /**
         * Namespace pb.
         * @memberof net
         * @namespace
         */
        const pb = {};

        pb.AddrBookRecord = (function() {

            /**
             * Properties of an AddrBookRecord.
             * @memberof net.pb
             * @interface IAddrBookRecord
             * @property {Uint8Array|null} [threadID] AddrBookRecord threadID
             * @property {Uint8Array|null} [peerID] AddrBookRecord peerID
             * @property {Array.<net.pb.AddrBookRecord.IAddrEntry>|null} [addrs] AddrBookRecord addrs
             */

            /**
             * Constructs a new AddrBookRecord.
             * @memberof net.pb
             * @classdesc Represents an AddrBookRecord.
             * @implements IAddrBookRecord
             * @constructor
             * @param {net.pb.IAddrBookRecord=} [properties] Properties to set
             */
            function AddrBookRecord(properties) {
                this.addrs = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AddrBookRecord threadID.
             * @member {Uint8Array} threadID
             * @memberof net.pb.AddrBookRecord
             * @instance
             */
            AddrBookRecord.prototype.threadID = $util.newBuffer([]);

            /**
             * AddrBookRecord peerID.
             * @member {Uint8Array} peerID
             * @memberof net.pb.AddrBookRecord
             * @instance
             */
            AddrBookRecord.prototype.peerID = $util.newBuffer([]);

            /**
             * AddrBookRecord addrs.
             * @member {Array.<net.pb.AddrBookRecord.IAddrEntry>} addrs
             * @memberof net.pb.AddrBookRecord
             * @instance
             */
            AddrBookRecord.prototype.addrs = $util.emptyArray;

            /**
             * Creates a new AddrBookRecord instance using the specified properties.
             * @function create
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {net.pb.IAddrBookRecord=} [properties] Properties to set
             * @returns {net.pb.AddrBookRecord} AddrBookRecord instance
             */
            AddrBookRecord.create = function create(properties) {
                return new AddrBookRecord(properties);
            };

            /**
             * Encodes the specified AddrBookRecord message. Does not implicitly {@link net.pb.AddrBookRecord.verify|verify} messages.
             * @function encode
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {net.pb.IAddrBookRecord} message AddrBookRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddrBookRecord.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.threadID != null && Object.hasOwnProperty.call(message, "threadID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.threadID);
                if (message.peerID != null && Object.hasOwnProperty.call(message, "peerID"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.peerID);
                if (message.addrs != null && message.addrs.length)
                    for (let i = 0; i < message.addrs.length; ++i)
                        $root.net.pb.AddrBookRecord.AddrEntry.encode(message.addrs[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified AddrBookRecord message, length delimited. Does not implicitly {@link net.pb.AddrBookRecord.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {net.pb.IAddrBookRecord} message AddrBookRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AddrBookRecord.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AddrBookRecord message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.AddrBookRecord} AddrBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddrBookRecord.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.AddrBookRecord();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.threadID = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.peerID = reader.bytes();
                            break;
                        }
                    case 3: {
                            if (!(message.addrs && message.addrs.length))
                                message.addrs = [];
                            message.addrs.push($root.net.pb.AddrBookRecord.AddrEntry.decode(reader, reader.uint32()));
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
             * Decodes an AddrBookRecord message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.AddrBookRecord} AddrBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AddrBookRecord.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AddrBookRecord message.
             * @function verify
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AddrBookRecord.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.threadID != null && message.hasOwnProperty("threadID"))
                    if (!(message.threadID && typeof message.threadID.length === "number" || $util.isString(message.threadID)))
                        return "threadID: buffer expected";
                if (message.peerID != null && message.hasOwnProperty("peerID"))
                    if (!(message.peerID && typeof message.peerID.length === "number" || $util.isString(message.peerID)))
                        return "peerID: buffer expected";
                if (message.addrs != null && message.hasOwnProperty("addrs")) {
                    if (!Array.isArray(message.addrs))
                        return "addrs: array expected";
                    for (let i = 0; i < message.addrs.length; ++i) {
                        let error = $root.net.pb.AddrBookRecord.AddrEntry.verify(message.addrs[i]);
                        if (error)
                            return "addrs." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an AddrBookRecord message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.AddrBookRecord} AddrBookRecord
             */
            AddrBookRecord.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.AddrBookRecord)
                    return object;
                let message = new $root.net.pb.AddrBookRecord();
                if (object.threadID != null)
                    if (typeof object.threadID === "string")
                        $util.base64.decode(object.threadID, message.threadID = $util.newBuffer($util.base64.length(object.threadID)), 0);
                    else if (object.threadID.length >= 0)
                        message.threadID = object.threadID;
                if (object.peerID != null)
                    if (typeof object.peerID === "string")
                        $util.base64.decode(object.peerID, message.peerID = $util.newBuffer($util.base64.length(object.peerID)), 0);
                    else if (object.peerID.length >= 0)
                        message.peerID = object.peerID;
                if (object.addrs) {
                    if (!Array.isArray(object.addrs))
                        throw TypeError(".net.pb.AddrBookRecord.addrs: array expected");
                    message.addrs = [];
                    for (let i = 0; i < object.addrs.length; ++i) {
                        if (typeof object.addrs[i] !== "object")
                            throw TypeError(".net.pb.AddrBookRecord.addrs: object expected");
                        message.addrs[i] = $root.net.pb.AddrBookRecord.AddrEntry.fromObject(object.addrs[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an AddrBookRecord message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {net.pb.AddrBookRecord} message AddrBookRecord
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AddrBookRecord.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.addrs = [];
                if (options.defaults) {
                    if (options.bytes === String)
                        object.threadID = "";
                    else {
                        object.threadID = [];
                        if (options.bytes !== Array)
                            object.threadID = $util.newBuffer(object.threadID);
                    }
                    if (options.bytes === String)
                        object.peerID = "";
                    else {
                        object.peerID = [];
                        if (options.bytes !== Array)
                            object.peerID = $util.newBuffer(object.peerID);
                    }
                }
                if (message.threadID != null && message.hasOwnProperty("threadID"))
                    object.threadID = options.bytes === String ? $util.base64.encode(message.threadID, 0, message.threadID.length) : options.bytes === Array ? Array.prototype.slice.call(message.threadID) : message.threadID;
                if (message.peerID != null && message.hasOwnProperty("peerID"))
                    object.peerID = options.bytes === String ? $util.base64.encode(message.peerID, 0, message.peerID.length) : options.bytes === Array ? Array.prototype.slice.call(message.peerID) : message.peerID;
                if (message.addrs && message.addrs.length) {
                    object.addrs = [];
                    for (let j = 0; j < message.addrs.length; ++j)
                        object.addrs[j] = $root.net.pb.AddrBookRecord.AddrEntry.toObject(message.addrs[j], options);
                }
                return object;
            };

            /**
             * Converts this AddrBookRecord to JSON.
             * @function toJSON
             * @memberof net.pb.AddrBookRecord
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AddrBookRecord.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for AddrBookRecord
             * @function getTypeUrl
             * @memberof net.pb.AddrBookRecord
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            AddrBookRecord.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.AddrBookRecord";
            };

            AddrBookRecord.AddrEntry = (function() {

                /**
                 * Properties of an AddrEntry.
                 * @memberof net.pb.AddrBookRecord
                 * @interface IAddrEntry
                 * @property {Uint8Array|null} [addr] AddrEntry addr
                 * @property {number|Long|null} [expiry] AddrEntry expiry
                 * @property {number|Long|null} [ttl] AddrEntry ttl
                 */

                /**
                 * Constructs a new AddrEntry.
                 * @memberof net.pb.AddrBookRecord
                 * @classdesc Represents an AddrEntry.
                 * @implements IAddrEntry
                 * @constructor
                 * @param {net.pb.AddrBookRecord.IAddrEntry=} [properties] Properties to set
                 */
                function AddrEntry(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * AddrEntry addr.
                 * @member {Uint8Array} addr
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @instance
                 */
                AddrEntry.prototype.addr = $util.newBuffer([]);

                /**
                 * AddrEntry expiry.
                 * @member {number|Long} expiry
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @instance
                 */
                AddrEntry.prototype.expiry = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * AddrEntry ttl.
                 * @member {number|Long} ttl
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @instance
                 */
                AddrEntry.prototype.ttl = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * Creates a new AddrEntry instance using the specified properties.
                 * @function create
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {net.pb.AddrBookRecord.IAddrEntry=} [properties] Properties to set
                 * @returns {net.pb.AddrBookRecord.AddrEntry} AddrEntry instance
                 */
                AddrEntry.create = function create(properties) {
                    return new AddrEntry(properties);
                };

                /**
                 * Encodes the specified AddrEntry message. Does not implicitly {@link net.pb.AddrBookRecord.AddrEntry.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {net.pb.AddrBookRecord.IAddrEntry} message AddrEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AddrEntry.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.addr != null && Object.hasOwnProperty.call(message, "addr"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.addr);
                    if (message.expiry != null && Object.hasOwnProperty.call(message, "expiry"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int64(message.expiry);
                    if (message.ttl != null && Object.hasOwnProperty.call(message, "ttl"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int64(message.ttl);
                    return writer;
                };

                /**
                 * Encodes the specified AddrEntry message, length delimited. Does not implicitly {@link net.pb.AddrBookRecord.AddrEntry.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {net.pb.AddrBookRecord.IAddrEntry} message AddrEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                AddrEntry.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an AddrEntry message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.AddrBookRecord.AddrEntry} AddrEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AddrEntry.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.AddrBookRecord.AddrEntry();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.addr = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.expiry = reader.int64();
                                break;
                            }
                        case 3: {
                                message.ttl = reader.int64();
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
                 * Decodes an AddrEntry message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.AddrBookRecord.AddrEntry} AddrEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                AddrEntry.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an AddrEntry message.
                 * @function verify
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                AddrEntry.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.addr != null && message.hasOwnProperty("addr"))
                        if (!(message.addr && typeof message.addr.length === "number" || $util.isString(message.addr)))
                            return "addr: buffer expected";
                    if (message.expiry != null && message.hasOwnProperty("expiry"))
                        if (!$util.isInteger(message.expiry) && !(message.expiry && $util.isInteger(message.expiry.low) && $util.isInteger(message.expiry.high)))
                            return "expiry: integer|Long expected";
                    if (message.ttl != null && message.hasOwnProperty("ttl"))
                        if (!$util.isInteger(message.ttl) && !(message.ttl && $util.isInteger(message.ttl.low) && $util.isInteger(message.ttl.high)))
                            return "ttl: integer|Long expected";
                    return null;
                };

                /**
                 * Creates an AddrEntry message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.AddrBookRecord.AddrEntry} AddrEntry
                 */
                AddrEntry.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.AddrBookRecord.AddrEntry)
                        return object;
                    let message = new $root.net.pb.AddrBookRecord.AddrEntry();
                    if (object.addr != null)
                        if (typeof object.addr === "string")
                            $util.base64.decode(object.addr, message.addr = $util.newBuffer($util.base64.length(object.addr)), 0);
                        else if (object.addr.length >= 0)
                            message.addr = object.addr;
                    if (object.expiry != null)
                        if ($util.Long)
                            (message.expiry = $util.Long.fromValue(object.expiry)).unsigned = false;
                        else if (typeof object.expiry === "string")
                            message.expiry = parseInt(object.expiry, 10);
                        else if (typeof object.expiry === "number")
                            message.expiry = object.expiry;
                        else if (typeof object.expiry === "object")
                            message.expiry = new $util.LongBits(object.expiry.low >>> 0, object.expiry.high >>> 0).toNumber();
                    if (object.ttl != null)
                        if ($util.Long)
                            (message.ttl = $util.Long.fromValue(object.ttl)).unsigned = false;
                        else if (typeof object.ttl === "string")
                            message.ttl = parseInt(object.ttl, 10);
                        else if (typeof object.ttl === "number")
                            message.ttl = object.ttl;
                        else if (typeof object.ttl === "object")
                            message.ttl = new $util.LongBits(object.ttl.low >>> 0, object.ttl.high >>> 0).toNumber();
                    return message;
                };

                /**
                 * Creates a plain object from an AddrEntry message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {net.pb.AddrBookRecord.AddrEntry} message AddrEntry
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                AddrEntry.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.addr = "";
                        else {
                            object.addr = [];
                            if (options.bytes !== Array)
                                object.addr = $util.newBuffer(object.addr);
                        }
                        if ($util.Long) {
                            let long = new $util.Long(0, 0, false);
                            object.expiry = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.expiry = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            let long = new $util.Long(0, 0, false);
                            object.ttl = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.ttl = options.longs === String ? "0" : 0;
                    }
                    if (message.addr != null && message.hasOwnProperty("addr"))
                        object.addr = options.bytes === String ? $util.base64.encode(message.addr, 0, message.addr.length) : options.bytes === Array ? Array.prototype.slice.call(message.addr) : message.addr;
                    if (message.expiry != null && message.hasOwnProperty("expiry"))
                        if (typeof message.expiry === "number")
                            object.expiry = options.longs === String ? String(message.expiry) : message.expiry;
                        else
                            object.expiry = options.longs === String ? $util.Long.prototype.toString.call(message.expiry) : options.longs === Number ? new $util.LongBits(message.expiry.low >>> 0, message.expiry.high >>> 0).toNumber() : message.expiry;
                    if (message.ttl != null && message.hasOwnProperty("ttl"))
                        if (typeof message.ttl === "number")
                            object.ttl = options.longs === String ? String(message.ttl) : message.ttl;
                        else
                            object.ttl = options.longs === String ? $util.Long.prototype.toString.call(message.ttl) : options.longs === Number ? new $util.LongBits(message.ttl.low >>> 0, message.ttl.high >>> 0).toNumber() : message.ttl;
                    return object;
                };

                /**
                 * Converts this AddrEntry to JSON.
                 * @function toJSON
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                AddrEntry.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for AddrEntry
                 * @function getTypeUrl
                 * @memberof net.pb.AddrBookRecord.AddrEntry
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                AddrEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.AddrBookRecord.AddrEntry";
                };

                return AddrEntry;
            })();

            return AddrBookRecord;
        })();

        pb.HeadBookRecord = (function() {

            /**
             * Properties of a HeadBookRecord.
             * @memberof net.pb
             * @interface IHeadBookRecord
             * @property {Array.<net.pb.HeadBookRecord.IHeadEntry>|null} [heads] HeadBookRecord heads
             */

            /**
             * Constructs a new HeadBookRecord.
             * @memberof net.pb
             * @classdesc Represents a HeadBookRecord.
             * @implements IHeadBookRecord
             * @constructor
             * @param {net.pb.IHeadBookRecord=} [properties] Properties to set
             */
            function HeadBookRecord(properties) {
                this.heads = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * HeadBookRecord heads.
             * @member {Array.<net.pb.HeadBookRecord.IHeadEntry>} heads
             * @memberof net.pb.HeadBookRecord
             * @instance
             */
            HeadBookRecord.prototype.heads = $util.emptyArray;

            /**
             * Creates a new HeadBookRecord instance using the specified properties.
             * @function create
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {net.pb.IHeadBookRecord=} [properties] Properties to set
             * @returns {net.pb.HeadBookRecord} HeadBookRecord instance
             */
            HeadBookRecord.create = function create(properties) {
                return new HeadBookRecord(properties);
            };

            /**
             * Encodes the specified HeadBookRecord message. Does not implicitly {@link net.pb.HeadBookRecord.verify|verify} messages.
             * @function encode
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {net.pb.IHeadBookRecord} message HeadBookRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HeadBookRecord.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.heads != null && message.heads.length)
                    for (let i = 0; i < message.heads.length; ++i)
                        $root.net.pb.HeadBookRecord.HeadEntry.encode(message.heads[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified HeadBookRecord message, length delimited. Does not implicitly {@link net.pb.HeadBookRecord.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {net.pb.IHeadBookRecord} message HeadBookRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HeadBookRecord.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a HeadBookRecord message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.HeadBookRecord} HeadBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HeadBookRecord.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.HeadBookRecord();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.heads && message.heads.length))
                                message.heads = [];
                            message.heads.push($root.net.pb.HeadBookRecord.HeadEntry.decode(reader, reader.uint32()));
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
             * Decodes a HeadBookRecord message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.HeadBookRecord} HeadBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HeadBookRecord.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a HeadBookRecord message.
             * @function verify
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HeadBookRecord.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.heads != null && message.hasOwnProperty("heads")) {
                    if (!Array.isArray(message.heads))
                        return "heads: array expected";
                    for (let i = 0; i < message.heads.length; ++i) {
                        let error = $root.net.pb.HeadBookRecord.HeadEntry.verify(message.heads[i]);
                        if (error)
                            return "heads." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a HeadBookRecord message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.HeadBookRecord} HeadBookRecord
             */
            HeadBookRecord.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.HeadBookRecord)
                    return object;
                let message = new $root.net.pb.HeadBookRecord();
                if (object.heads) {
                    if (!Array.isArray(object.heads))
                        throw TypeError(".net.pb.HeadBookRecord.heads: array expected");
                    message.heads = [];
                    for (let i = 0; i < object.heads.length; ++i) {
                        if (typeof object.heads[i] !== "object")
                            throw TypeError(".net.pb.HeadBookRecord.heads: object expected");
                        message.heads[i] = $root.net.pb.HeadBookRecord.HeadEntry.fromObject(object.heads[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a HeadBookRecord message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {net.pb.HeadBookRecord} message HeadBookRecord
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HeadBookRecord.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.heads = [];
                if (message.heads && message.heads.length) {
                    object.heads = [];
                    for (let j = 0; j < message.heads.length; ++j)
                        object.heads[j] = $root.net.pb.HeadBookRecord.HeadEntry.toObject(message.heads[j], options);
                }
                return object;
            };

            /**
             * Converts this HeadBookRecord to JSON.
             * @function toJSON
             * @memberof net.pb.HeadBookRecord
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HeadBookRecord.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for HeadBookRecord
             * @function getTypeUrl
             * @memberof net.pb.HeadBookRecord
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            HeadBookRecord.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.HeadBookRecord";
            };

            HeadBookRecord.HeadEntry = (function() {

                /**
                 * Properties of a HeadEntry.
                 * @memberof net.pb.HeadBookRecord
                 * @interface IHeadEntry
                 * @property {Uint8Array|null} [cid] HeadEntry cid
                 * @property {number|Long|null} [counter] HeadEntry counter
                 */

                /**
                 * Constructs a new HeadEntry.
                 * @memberof net.pb.HeadBookRecord
                 * @classdesc Represents a HeadEntry.
                 * @implements IHeadEntry
                 * @constructor
                 * @param {net.pb.HeadBookRecord.IHeadEntry=} [properties] Properties to set
                 */
                function HeadEntry(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * HeadEntry cid.
                 * @member {Uint8Array} cid
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @instance
                 */
                HeadEntry.prototype.cid = $util.newBuffer([]);

                /**
                 * HeadEntry counter.
                 * @member {number|Long} counter
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @instance
                 */
                HeadEntry.prototype.counter = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                /**
                 * Creates a new HeadEntry instance using the specified properties.
                 * @function create
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {net.pb.HeadBookRecord.IHeadEntry=} [properties] Properties to set
                 * @returns {net.pb.HeadBookRecord.HeadEntry} HeadEntry instance
                 */
                HeadEntry.create = function create(properties) {
                    return new HeadEntry(properties);
                };

                /**
                 * Encodes the specified HeadEntry message. Does not implicitly {@link net.pb.HeadBookRecord.HeadEntry.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {net.pb.HeadBookRecord.IHeadEntry} message HeadEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeadEntry.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.cid);
                    if (message.counter != null && Object.hasOwnProperty.call(message, "counter"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int64(message.counter);
                    return writer;
                };

                /**
                 * Encodes the specified HeadEntry message, length delimited. Does not implicitly {@link net.pb.HeadBookRecord.HeadEntry.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {net.pb.HeadBookRecord.IHeadEntry} message HeadEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HeadEntry.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a HeadEntry message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.HeadBookRecord.HeadEntry} HeadEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeadEntry.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.HeadBookRecord.HeadEntry();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.cid = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.counter = reader.int64();
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
                 * Decodes a HeadEntry message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.HeadBookRecord.HeadEntry} HeadEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HeadEntry.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a HeadEntry message.
                 * @function verify
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                HeadEntry.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.cid != null && message.hasOwnProperty("cid"))
                        if (!(message.cid && typeof message.cid.length === "number" || $util.isString(message.cid)))
                            return "cid: buffer expected";
                    if (message.counter != null && message.hasOwnProperty("counter"))
                        if (!$util.isInteger(message.counter) && !(message.counter && $util.isInteger(message.counter.low) && $util.isInteger(message.counter.high)))
                            return "counter: integer|Long expected";
                    return null;
                };

                /**
                 * Creates a HeadEntry message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.HeadBookRecord.HeadEntry} HeadEntry
                 */
                HeadEntry.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.HeadBookRecord.HeadEntry)
                        return object;
                    let message = new $root.net.pb.HeadBookRecord.HeadEntry();
                    if (object.cid != null)
                        if (typeof object.cid === "string")
                            $util.base64.decode(object.cid, message.cid = $util.newBuffer($util.base64.length(object.cid)), 0);
                        else if (object.cid.length >= 0)
                            message.cid = object.cid;
                    if (object.counter != null)
                        if ($util.Long)
                            (message.counter = $util.Long.fromValue(object.counter)).unsigned = false;
                        else if (typeof object.counter === "string")
                            message.counter = parseInt(object.counter, 10);
                        else if (typeof object.counter === "number")
                            message.counter = object.counter;
                        else if (typeof object.counter === "object")
                            message.counter = new $util.LongBits(object.counter.low >>> 0, object.counter.high >>> 0).toNumber();
                    return message;
                };

                /**
                 * Creates a plain object from a HeadEntry message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {net.pb.HeadBookRecord.HeadEntry} message HeadEntry
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HeadEntry.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.cid = "";
                        else {
                            object.cid = [];
                            if (options.bytes !== Array)
                                object.cid = $util.newBuffer(object.cid);
                        }
                        if ($util.Long) {
                            let long = new $util.Long(0, 0, false);
                            object.counter = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.counter = options.longs === String ? "0" : 0;
                    }
                    if (message.cid != null && message.hasOwnProperty("cid"))
                        object.cid = options.bytes === String ? $util.base64.encode(message.cid, 0, message.cid.length) : options.bytes === Array ? Array.prototype.slice.call(message.cid) : message.cid;
                    if (message.counter != null && message.hasOwnProperty("counter"))
                        if (typeof message.counter === "number")
                            object.counter = options.longs === String ? String(message.counter) : message.counter;
                        else
                            object.counter = options.longs === String ? $util.Long.prototype.toString.call(message.counter) : options.longs === Number ? new $util.LongBits(message.counter.low >>> 0, message.counter.high >>> 0).toNumber() : message.counter;
                    return object;
                };

                /**
                 * Converts this HeadEntry to JSON.
                 * @function toJSON
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                HeadEntry.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for HeadEntry
                 * @function getTypeUrl
                 * @memberof net.pb.HeadBookRecord.HeadEntry
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                HeadEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.HeadBookRecord.HeadEntry";
                };

                return HeadEntry;
            })();

            return HeadBookRecord;
        })();

        return pb;
    })();

    return net;
})();

export { $root as default };
