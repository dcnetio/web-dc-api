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

        pb.Log = (function() {

            /**
             * Properties of a Log.
             * @memberof net.pb
             * @interface ILog
             * @property {Uint8Array|null} [ID] Log ID
             * @property {Uint8Array|null} [pubKey] Log pubKey
             * @property {Array.<Uint8Array>|null} [addrs] Log addrs
             * @property {Uint8Array|null} [head] Log head
             * @property {number|Long|null} [counter] Log counter
             */

            /**
             * Constructs a new Log.
             * @memberof net.pb
             * @classdesc Represents a Log.
             * @implements ILog
             * @constructor
             * @param {net.pb.ILog=} [properties] Properties to set
             */
            function Log(properties) {
                this.addrs = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Log ID.
             * @member {Uint8Array} ID
             * @memberof net.pb.Log
             * @instance
             */
            Log.prototype.ID = $util.newBuffer([]);

            /**
             * Log pubKey.
             * @member {Uint8Array} pubKey
             * @memberof net.pb.Log
             * @instance
             */
            Log.prototype.pubKey = $util.newBuffer([]);

            /**
             * Log addrs.
             * @member {Array.<Uint8Array>} addrs
             * @memberof net.pb.Log
             * @instance
             */
            Log.prototype.addrs = $util.emptyArray;

            /**
             * Log head.
             * @member {Uint8Array} head
             * @memberof net.pb.Log
             * @instance
             */
            Log.prototype.head = $util.newBuffer([]);

            /**
             * Log counter.
             * @member {number|Long} counter
             * @memberof net.pb.Log
             * @instance
             */
            Log.prototype.counter = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new Log instance using the specified properties.
             * @function create
             * @memberof net.pb.Log
             * @static
             * @param {net.pb.ILog=} [properties] Properties to set
             * @returns {net.pb.Log} Log instance
             */
            Log.create = function create(properties) {
                return new Log(properties);
            };

            /**
             * Encodes the specified Log message. Does not implicitly {@link net.pb.Log.verify|verify} messages.
             * @function encode
             * @memberof net.pb.Log
             * @static
             * @param {net.pb.ILog} message Log message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Log.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.ID != null && Object.hasOwnProperty.call(message, "ID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ID);
                if (message.pubKey != null && Object.hasOwnProperty.call(message, "pubKey"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.pubKey);
                if (message.addrs != null && message.addrs.length)
                    for (let i = 0; i < message.addrs.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.addrs[i]);
                if (message.head != null && Object.hasOwnProperty.call(message, "head"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.head);
                if (message.counter != null && Object.hasOwnProperty.call(message, "counter"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int64(message.counter);
                return writer;
            };

            /**
             * Encodes the specified Log message, length delimited. Does not implicitly {@link net.pb.Log.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.Log
             * @static
             * @param {net.pb.ILog} message Log message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Log.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Log message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.Log
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.Log} Log
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Log.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.Log();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.ID = reader.bytes();
                            break;
                        }
                    case 2: {
                            message.pubKey = reader.bytes();
                            break;
                        }
                    case 3: {
                            if (!(message.addrs && message.addrs.length))
                                message.addrs = [];
                            message.addrs.push(reader.bytes());
                            break;
                        }
                    case 4: {
                            message.head = reader.bytes();
                            break;
                        }
                    case 5: {
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
             * Decodes a Log message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.Log
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.Log} Log
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Log.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Log message.
             * @function verify
             * @memberof net.pb.Log
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Log.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.ID != null && message.hasOwnProperty("ID"))
                    if (!(message.ID && typeof message.ID.length === "number" || $util.isString(message.ID)))
                        return "ID: buffer expected";
                if (message.pubKey != null && message.hasOwnProperty("pubKey"))
                    if (!(message.pubKey && typeof message.pubKey.length === "number" || $util.isString(message.pubKey)))
                        return "pubKey: buffer expected";
                if (message.addrs != null && message.hasOwnProperty("addrs")) {
                    if (!Array.isArray(message.addrs))
                        return "addrs: array expected";
                    for (let i = 0; i < message.addrs.length; ++i)
                        if (!(message.addrs[i] && typeof message.addrs[i].length === "number" || $util.isString(message.addrs[i])))
                            return "addrs: buffer[] expected";
                }
                if (message.head != null && message.hasOwnProperty("head"))
                    if (!(message.head && typeof message.head.length === "number" || $util.isString(message.head)))
                        return "head: buffer expected";
                if (message.counter != null && message.hasOwnProperty("counter"))
                    if (!$util.isInteger(message.counter) && !(message.counter && $util.isInteger(message.counter.low) && $util.isInteger(message.counter.high)))
                        return "counter: integer|Long expected";
                return null;
            };

            /**
             * Creates a Log message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.Log
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.Log} Log
             */
            Log.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.Log)
                    return object;
                let message = new $root.net.pb.Log();
                if (object.ID != null)
                    if (typeof object.ID === "string")
                        $util.base64.decode(object.ID, message.ID = $util.newBuffer($util.base64.length(object.ID)), 0);
                    else if (object.ID.length >= 0)
                        message.ID = object.ID;
                if (object.pubKey != null)
                    if (typeof object.pubKey === "string")
                        $util.base64.decode(object.pubKey, message.pubKey = $util.newBuffer($util.base64.length(object.pubKey)), 0);
                    else if (object.pubKey.length >= 0)
                        message.pubKey = object.pubKey;
                if (object.addrs) {
                    if (!Array.isArray(object.addrs))
                        throw TypeError(".net.pb.Log.addrs: array expected");
                    message.addrs = [];
                    for (let i = 0; i < object.addrs.length; ++i)
                        if (typeof object.addrs[i] === "string")
                            $util.base64.decode(object.addrs[i], message.addrs[i] = $util.newBuffer($util.base64.length(object.addrs[i])), 0);
                        else if (object.addrs[i].length >= 0)
                            message.addrs[i] = object.addrs[i];
                }
                if (object.head != null)
                    if (typeof object.head === "string")
                        $util.base64.decode(object.head, message.head = $util.newBuffer($util.base64.length(object.head)), 0);
                    else if (object.head.length >= 0)
                        message.head = object.head;
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
             * Creates a plain object from a Log message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.Log
             * @static
             * @param {net.pb.Log} message Log
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Log.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.addrs = [];
                if (options.defaults) {
                    if (options.bytes === String)
                        object.ID = "";
                    else {
                        object.ID = [];
                        if (options.bytes !== Array)
                            object.ID = $util.newBuffer(object.ID);
                    }
                    if (options.bytes === String)
                        object.pubKey = "";
                    else {
                        object.pubKey = [];
                        if (options.bytes !== Array)
                            object.pubKey = $util.newBuffer(object.pubKey);
                    }
                    if (options.bytes === String)
                        object.head = "";
                    else {
                        object.head = [];
                        if (options.bytes !== Array)
                            object.head = $util.newBuffer(object.head);
                    }
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.counter = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.counter = options.longs === String ? "0" : 0;
                }
                if (message.ID != null && message.hasOwnProperty("ID"))
                    object.ID = options.bytes === String ? $util.base64.encode(message.ID, 0, message.ID.length) : options.bytes === Array ? Array.prototype.slice.call(message.ID) : message.ID;
                if (message.pubKey != null && message.hasOwnProperty("pubKey"))
                    object.pubKey = options.bytes === String ? $util.base64.encode(message.pubKey, 0, message.pubKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.pubKey) : message.pubKey;
                if (message.addrs && message.addrs.length) {
                    object.addrs = [];
                    for (let j = 0; j < message.addrs.length; ++j)
                        object.addrs[j] = options.bytes === String ? $util.base64.encode(message.addrs[j], 0, message.addrs[j].length) : options.bytes === Array ? Array.prototype.slice.call(message.addrs[j]) : message.addrs[j];
                }
                if (message.head != null && message.hasOwnProperty("head"))
                    object.head = options.bytes === String ? $util.base64.encode(message.head, 0, message.head.length) : options.bytes === Array ? Array.prototype.slice.call(message.head) : message.head;
                if (message.counter != null && message.hasOwnProperty("counter"))
                    if (typeof message.counter === "number")
                        object.counter = options.longs === String ? String(message.counter) : message.counter;
                    else
                        object.counter = options.longs === String ? $util.Long.prototype.toString.call(message.counter) : options.longs === Number ? new $util.LongBits(message.counter.low >>> 0, message.counter.high >>> 0).toNumber() : message.counter;
                return object;
            };

            /**
             * Converts this Log to JSON.
             * @function toJSON
             * @memberof net.pb.Log
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Log.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Log
             * @function getTypeUrl
             * @memberof net.pb.Log
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Log.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.Log";
            };

            Log.Record = (function() {

                /**
                 * Properties of a Record.
                 * @memberof net.pb.Log
                 * @interface IRecord
                 * @property {Uint8Array|null} [recordNode] Record recordNode
                 * @property {Uint8Array|null} [eventNode] Record eventNode
                 * @property {Uint8Array|null} [headerNode] Record headerNode
                 * @property {Uint8Array|null} [bodyNode] Record bodyNode
                 */

                /**
                 * Constructs a new Record.
                 * @memberof net.pb.Log
                 * @classdesc Represents a Record.
                 * @implements IRecord
                 * @constructor
                 * @param {net.pb.Log.IRecord=} [properties] Properties to set
                 */
                function Record(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Record recordNode.
                 * @member {Uint8Array} recordNode
                 * @memberof net.pb.Log.Record
                 * @instance
                 */
                Record.prototype.recordNode = $util.newBuffer([]);

                /**
                 * Record eventNode.
                 * @member {Uint8Array} eventNode
                 * @memberof net.pb.Log.Record
                 * @instance
                 */
                Record.prototype.eventNode = $util.newBuffer([]);

                /**
                 * Record headerNode.
                 * @member {Uint8Array} headerNode
                 * @memberof net.pb.Log.Record
                 * @instance
                 */
                Record.prototype.headerNode = $util.newBuffer([]);

                /**
                 * Record bodyNode.
                 * @member {Uint8Array} bodyNode
                 * @memberof net.pb.Log.Record
                 * @instance
                 */
                Record.prototype.bodyNode = $util.newBuffer([]);

                /**
                 * Creates a new Record instance using the specified properties.
                 * @function create
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {net.pb.Log.IRecord=} [properties] Properties to set
                 * @returns {net.pb.Log.Record} Record instance
                 */
                Record.create = function create(properties) {
                    return new Record(properties);
                };

                /**
                 * Encodes the specified Record message. Does not implicitly {@link net.pb.Log.Record.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {net.pb.Log.IRecord} message Record message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Record.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.recordNode != null && Object.hasOwnProperty.call(message, "recordNode"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.recordNode);
                    if (message.eventNode != null && Object.hasOwnProperty.call(message, "eventNode"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.eventNode);
                    if (message.headerNode != null && Object.hasOwnProperty.call(message, "headerNode"))
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.headerNode);
                    if (message.bodyNode != null && Object.hasOwnProperty.call(message, "bodyNode"))
                        writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.bodyNode);
                    return writer;
                };

                /**
                 * Encodes the specified Record message, length delimited. Does not implicitly {@link net.pb.Log.Record.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {net.pb.Log.IRecord} message Record message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Record.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Record message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.Log.Record} Record
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Record.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.Log.Record();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.recordNode = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.eventNode = reader.bytes();
                                break;
                            }
                        case 3: {
                                message.headerNode = reader.bytes();
                                break;
                            }
                        case 4: {
                                message.bodyNode = reader.bytes();
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
                 * Decodes a Record message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.Log.Record} Record
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Record.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Record message.
                 * @function verify
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Record.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.recordNode != null && message.hasOwnProperty("recordNode"))
                        if (!(message.recordNode && typeof message.recordNode.length === "number" || $util.isString(message.recordNode)))
                            return "recordNode: buffer expected";
                    if (message.eventNode != null && message.hasOwnProperty("eventNode"))
                        if (!(message.eventNode && typeof message.eventNode.length === "number" || $util.isString(message.eventNode)))
                            return "eventNode: buffer expected";
                    if (message.headerNode != null && message.hasOwnProperty("headerNode"))
                        if (!(message.headerNode && typeof message.headerNode.length === "number" || $util.isString(message.headerNode)))
                            return "headerNode: buffer expected";
                    if (message.bodyNode != null && message.hasOwnProperty("bodyNode"))
                        if (!(message.bodyNode && typeof message.bodyNode.length === "number" || $util.isString(message.bodyNode)))
                            return "bodyNode: buffer expected";
                    return null;
                };

                /**
                 * Creates a Record message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.Log.Record} Record
                 */
                Record.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.Log.Record)
                        return object;
                    let message = new $root.net.pb.Log.Record();
                    if (object.recordNode != null)
                        if (typeof object.recordNode === "string")
                            $util.base64.decode(object.recordNode, message.recordNode = $util.newBuffer($util.base64.length(object.recordNode)), 0);
                        else if (object.recordNode.length >= 0)
                            message.recordNode = object.recordNode;
                    if (object.eventNode != null)
                        if (typeof object.eventNode === "string")
                            $util.base64.decode(object.eventNode, message.eventNode = $util.newBuffer($util.base64.length(object.eventNode)), 0);
                        else if (object.eventNode.length >= 0)
                            message.eventNode = object.eventNode;
                    if (object.headerNode != null)
                        if (typeof object.headerNode === "string")
                            $util.base64.decode(object.headerNode, message.headerNode = $util.newBuffer($util.base64.length(object.headerNode)), 0);
                        else if (object.headerNode.length >= 0)
                            message.headerNode = object.headerNode;
                    if (object.bodyNode != null)
                        if (typeof object.bodyNode === "string")
                            $util.base64.decode(object.bodyNode, message.bodyNode = $util.newBuffer($util.base64.length(object.bodyNode)), 0);
                        else if (object.bodyNode.length >= 0)
                            message.bodyNode = object.bodyNode;
                    return message;
                };

                /**
                 * Creates a plain object from a Record message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {net.pb.Log.Record} message Record
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Record.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.recordNode = "";
                        else {
                            object.recordNode = [];
                            if (options.bytes !== Array)
                                object.recordNode = $util.newBuffer(object.recordNode);
                        }
                        if (options.bytes === String)
                            object.eventNode = "";
                        else {
                            object.eventNode = [];
                            if (options.bytes !== Array)
                                object.eventNode = $util.newBuffer(object.eventNode);
                        }
                        if (options.bytes === String)
                            object.headerNode = "";
                        else {
                            object.headerNode = [];
                            if (options.bytes !== Array)
                                object.headerNode = $util.newBuffer(object.headerNode);
                        }
                        if (options.bytes === String)
                            object.bodyNode = "";
                        else {
                            object.bodyNode = [];
                            if (options.bytes !== Array)
                                object.bodyNode = $util.newBuffer(object.bodyNode);
                        }
                    }
                    if (message.recordNode != null && message.hasOwnProperty("recordNode"))
                        object.recordNode = options.bytes === String ? $util.base64.encode(message.recordNode, 0, message.recordNode.length) : options.bytes === Array ? Array.prototype.slice.call(message.recordNode) : message.recordNode;
                    if (message.eventNode != null && message.hasOwnProperty("eventNode"))
                        object.eventNode = options.bytes === String ? $util.base64.encode(message.eventNode, 0, message.eventNode.length) : options.bytes === Array ? Array.prototype.slice.call(message.eventNode) : message.eventNode;
                    if (message.headerNode != null && message.hasOwnProperty("headerNode"))
                        object.headerNode = options.bytes === String ? $util.base64.encode(message.headerNode, 0, message.headerNode.length) : options.bytes === Array ? Array.prototype.slice.call(message.headerNode) : message.headerNode;
                    if (message.bodyNode != null && message.hasOwnProperty("bodyNode"))
                        object.bodyNode = options.bytes === String ? $util.base64.encode(message.bodyNode, 0, message.bodyNode.length) : options.bytes === Array ? Array.prototype.slice.call(message.bodyNode) : message.bodyNode;
                    return object;
                };

                /**
                 * Converts this Record to JSON.
                 * @function toJSON
                 * @memberof net.pb.Log.Record
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Record.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Record
                 * @function getTypeUrl
                 * @memberof net.pb.Log.Record
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Record.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.Log.Record";
                };

                return Record;
            })();

            return Log;
        })();

        pb.GetLogsRequest = (function() {

            /**
             * Properties of a GetLogsRequest.
             * @memberof net.pb
             * @interface IGetLogsRequest
             * @property {net.pb.GetLogsRequest.IBody|null} [body] GetLogsRequest body
             */

            /**
             * Constructs a new GetLogsRequest.
             * @memberof net.pb
             * @classdesc Represents a GetLogsRequest.
             * @implements IGetLogsRequest
             * @constructor
             * @param {net.pb.IGetLogsRequest=} [properties] Properties to set
             */
            function GetLogsRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetLogsRequest body.
             * @member {net.pb.GetLogsRequest.IBody|null|undefined} body
             * @memberof net.pb.GetLogsRequest
             * @instance
             */
            GetLogsRequest.prototype.body = null;

            /**
             * Creates a new GetLogsRequest instance using the specified properties.
             * @function create
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {net.pb.IGetLogsRequest=} [properties] Properties to set
             * @returns {net.pb.GetLogsRequest} GetLogsRequest instance
             */
            GetLogsRequest.create = function create(properties) {
                return new GetLogsRequest(properties);
            };

            /**
             * Encodes the specified GetLogsRequest message. Does not implicitly {@link net.pb.GetLogsRequest.verify|verify} messages.
             * @function encode
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {net.pb.IGetLogsRequest} message GetLogsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogsRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                    $root.net.pb.GetLogsRequest.Body.encode(message.body, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetLogsRequest message, length delimited. Does not implicitly {@link net.pb.GetLogsRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {net.pb.IGetLogsRequest} message GetLogsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogsRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetLogsRequest message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.GetLogsRequest} GetLogsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogsRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetLogsRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.body = $root.net.pb.GetLogsRequest.Body.decode(reader, reader.uint32());
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
             * Decodes a GetLogsRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.GetLogsRequest} GetLogsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogsRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetLogsRequest message.
             * @function verify
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetLogsRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.body != null && message.hasOwnProperty("body")) {
                    let error = $root.net.pb.GetLogsRequest.Body.verify(message.body);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates a GetLogsRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.GetLogsRequest} GetLogsRequest
             */
            GetLogsRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.GetLogsRequest)
                    return object;
                let message = new $root.net.pb.GetLogsRequest();
                if (object.body != null) {
                    if (typeof object.body !== "object")
                        throw TypeError(".net.pb.GetLogsRequest.body: object expected");
                    message.body = $root.net.pb.GetLogsRequest.Body.fromObject(object.body);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetLogsRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {net.pb.GetLogsRequest} message GetLogsRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLogsRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.body = null;
                if (message.body != null && message.hasOwnProperty("body"))
                    object.body = $root.net.pb.GetLogsRequest.Body.toObject(message.body, options);
                return object;
            };

            /**
             * Converts this GetLogsRequest to JSON.
             * @function toJSON
             * @memberof net.pb.GetLogsRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetLogsRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetLogsRequest
             * @function getTypeUrl
             * @memberof net.pb.GetLogsRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetLogsRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.GetLogsRequest";
            };

            GetLogsRequest.Body = (function() {

                /**
                 * Properties of a Body.
                 * @memberof net.pb.GetLogsRequest
                 * @interface IBody
                 * @property {Uint8Array|null} [threadID] Body threadID
                 * @property {Uint8Array|null} [serviceKey] Body serviceKey
                 */

                /**
                 * Constructs a new Body.
                 * @memberof net.pb.GetLogsRequest
                 * @classdesc Represents a Body.
                 * @implements IBody
                 * @constructor
                 * @param {net.pb.GetLogsRequest.IBody=} [properties] Properties to set
                 */
                function Body(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Body threadID.
                 * @member {Uint8Array} threadID
                 * @memberof net.pb.GetLogsRequest.Body
                 * @instance
                 */
                Body.prototype.threadID = $util.newBuffer([]);

                /**
                 * Body serviceKey.
                 * @member {Uint8Array} serviceKey
                 * @memberof net.pb.GetLogsRequest.Body
                 * @instance
                 */
                Body.prototype.serviceKey = $util.newBuffer([]);

                /**
                 * Creates a new Body instance using the specified properties.
                 * @function create
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {net.pb.GetLogsRequest.IBody=} [properties] Properties to set
                 * @returns {net.pb.GetLogsRequest.Body} Body instance
                 */
                Body.create = function create(properties) {
                    return new Body(properties);
                };

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.GetLogsRequest.Body.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {net.pb.GetLogsRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.threadID != null && Object.hasOwnProperty.call(message, "threadID"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.threadID);
                    if (message.serviceKey != null && Object.hasOwnProperty.call(message, "serviceKey"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.serviceKey);
                    return writer;
                };

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.GetLogsRequest.Body.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {net.pb.GetLogsRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.GetLogsRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetLogsRequest.Body();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.threadID = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.serviceKey = reader.bytes();
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
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.GetLogsRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Body message.
                 * @function verify
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Body.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        if (!(message.threadID && typeof message.threadID.length === "number" || $util.isString(message.threadID)))
                            return "threadID: buffer expected";
                    if (message.serviceKey != null && message.hasOwnProperty("serviceKey"))
                        if (!(message.serviceKey && typeof message.serviceKey.length === "number" || $util.isString(message.serviceKey)))
                            return "serviceKey: buffer expected";
                    return null;
                };

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.GetLogsRequest.Body} Body
                 */
                Body.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.GetLogsRequest.Body)
                        return object;
                    let message = new $root.net.pb.GetLogsRequest.Body();
                    if (object.threadID != null)
                        if (typeof object.threadID === "string")
                            $util.base64.decode(object.threadID, message.threadID = $util.newBuffer($util.base64.length(object.threadID)), 0);
                        else if (object.threadID.length >= 0)
                            message.threadID = object.threadID;
                    if (object.serviceKey != null)
                        if (typeof object.serviceKey === "string")
                            $util.base64.decode(object.serviceKey, message.serviceKey = $util.newBuffer($util.base64.length(object.serviceKey)), 0);
                        else if (object.serviceKey.length >= 0)
                            message.serviceKey = object.serviceKey;
                    return message;
                };

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {net.pb.GetLogsRequest.Body} message Body
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Body.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.threadID = "";
                        else {
                            object.threadID = [];
                            if (options.bytes !== Array)
                                object.threadID = $util.newBuffer(object.threadID);
                        }
                        if (options.bytes === String)
                            object.serviceKey = "";
                        else {
                            object.serviceKey = [];
                            if (options.bytes !== Array)
                                object.serviceKey = $util.newBuffer(object.serviceKey);
                        }
                    }
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        object.threadID = options.bytes === String ? $util.base64.encode(message.threadID, 0, message.threadID.length) : options.bytes === Array ? Array.prototype.slice.call(message.threadID) : message.threadID;
                    if (message.serviceKey != null && message.hasOwnProperty("serviceKey"))
                        object.serviceKey = options.bytes === String ? $util.base64.encode(message.serviceKey, 0, message.serviceKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.serviceKey) : message.serviceKey;
                    return object;
                };

                /**
                 * Converts this Body to JSON.
                 * @function toJSON
                 * @memberof net.pb.GetLogsRequest.Body
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Body.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Body
                 * @function getTypeUrl
                 * @memberof net.pb.GetLogsRequest.Body
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Body.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.GetLogsRequest.Body";
                };

                return Body;
            })();

            return GetLogsRequest;
        })();

        pb.GetLogsReply = (function() {

            /**
             * Properties of a GetLogsReply.
             * @memberof net.pb
             * @interface IGetLogsReply
             * @property {Array.<net.pb.ILog>|null} [logs] GetLogsReply logs
             */

            /**
             * Constructs a new GetLogsReply.
             * @memberof net.pb
             * @classdesc Represents a GetLogsReply.
             * @implements IGetLogsReply
             * @constructor
             * @param {net.pb.IGetLogsReply=} [properties] Properties to set
             */
            function GetLogsReply(properties) {
                this.logs = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetLogsReply logs.
             * @member {Array.<net.pb.ILog>} logs
             * @memberof net.pb.GetLogsReply
             * @instance
             */
            GetLogsReply.prototype.logs = $util.emptyArray;

            /**
             * Creates a new GetLogsReply instance using the specified properties.
             * @function create
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {net.pb.IGetLogsReply=} [properties] Properties to set
             * @returns {net.pb.GetLogsReply} GetLogsReply instance
             */
            GetLogsReply.create = function create(properties) {
                return new GetLogsReply(properties);
            };

            /**
             * Encodes the specified GetLogsReply message. Does not implicitly {@link net.pb.GetLogsReply.verify|verify} messages.
             * @function encode
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {net.pb.IGetLogsReply} message GetLogsReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogsReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.logs != null && message.logs.length)
                    for (let i = 0; i < message.logs.length; ++i)
                        $root.net.pb.Log.encode(message.logs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetLogsReply message, length delimited. Does not implicitly {@link net.pb.GetLogsReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {net.pb.IGetLogsReply} message GetLogsReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetLogsReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetLogsReply message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.GetLogsReply} GetLogsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogsReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetLogsReply();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.logs && message.logs.length))
                                message.logs = [];
                            message.logs.push($root.net.pb.Log.decode(reader, reader.uint32()));
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
             * Decodes a GetLogsReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.GetLogsReply} GetLogsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetLogsReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetLogsReply message.
             * @function verify
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetLogsReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.logs != null && message.hasOwnProperty("logs")) {
                    if (!Array.isArray(message.logs))
                        return "logs: array expected";
                    for (let i = 0; i < message.logs.length; ++i) {
                        let error = $root.net.pb.Log.verify(message.logs[i]);
                        if (error)
                            return "logs." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetLogsReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.GetLogsReply} GetLogsReply
             */
            GetLogsReply.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.GetLogsReply)
                    return object;
                let message = new $root.net.pb.GetLogsReply();
                if (object.logs) {
                    if (!Array.isArray(object.logs))
                        throw TypeError(".net.pb.GetLogsReply.logs: array expected");
                    message.logs = [];
                    for (let i = 0; i < object.logs.length; ++i) {
                        if (typeof object.logs[i] !== "object")
                            throw TypeError(".net.pb.GetLogsReply.logs: object expected");
                        message.logs[i] = $root.net.pb.Log.fromObject(object.logs[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetLogsReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {net.pb.GetLogsReply} message GetLogsReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetLogsReply.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.logs = [];
                if (message.logs && message.logs.length) {
                    object.logs = [];
                    for (let j = 0; j < message.logs.length; ++j)
                        object.logs[j] = $root.net.pb.Log.toObject(message.logs[j], options);
                }
                return object;
            };

            /**
             * Converts this GetLogsReply to JSON.
             * @function toJSON
             * @memberof net.pb.GetLogsReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetLogsReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetLogsReply
             * @function getTypeUrl
             * @memberof net.pb.GetLogsReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetLogsReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.GetLogsReply";
            };

            return GetLogsReply;
        })();

        pb.PushLogRequest = (function() {

            /**
             * Properties of a PushLogRequest.
             * @memberof net.pb
             * @interface IPushLogRequest
             * @property {net.pb.PushLogRequest.IBody|null} [body] PushLogRequest body
             */

            /**
             * Constructs a new PushLogRequest.
             * @memberof net.pb
             * @classdesc Represents a PushLogRequest.
             * @implements IPushLogRequest
             * @constructor
             * @param {net.pb.IPushLogRequest=} [properties] Properties to set
             */
            function PushLogRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PushLogRequest body.
             * @member {net.pb.PushLogRequest.IBody|null|undefined} body
             * @memberof net.pb.PushLogRequest
             * @instance
             */
            PushLogRequest.prototype.body = null;

            /**
             * Creates a new PushLogRequest instance using the specified properties.
             * @function create
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {net.pb.IPushLogRequest=} [properties] Properties to set
             * @returns {net.pb.PushLogRequest} PushLogRequest instance
             */
            PushLogRequest.create = function create(properties) {
                return new PushLogRequest(properties);
            };

            /**
             * Encodes the specified PushLogRequest message. Does not implicitly {@link net.pb.PushLogRequest.verify|verify} messages.
             * @function encode
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {net.pb.IPushLogRequest} message PushLogRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushLogRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                    $root.net.pb.PushLogRequest.Body.encode(message.body, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified PushLogRequest message, length delimited. Does not implicitly {@link net.pb.PushLogRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {net.pb.IPushLogRequest} message PushLogRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushLogRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushLogRequest message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.PushLogRequest} PushLogRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushLogRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.PushLogRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.body = $root.net.pb.PushLogRequest.Body.decode(reader, reader.uint32());
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
             * Decodes a PushLogRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.PushLogRequest} PushLogRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushLogRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushLogRequest message.
             * @function verify
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushLogRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.body != null && message.hasOwnProperty("body")) {
                    let error = $root.net.pb.PushLogRequest.Body.verify(message.body);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates a PushLogRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.PushLogRequest} PushLogRequest
             */
            PushLogRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.PushLogRequest)
                    return object;
                let message = new $root.net.pb.PushLogRequest();
                if (object.body != null) {
                    if (typeof object.body !== "object")
                        throw TypeError(".net.pb.PushLogRequest.body: object expected");
                    message.body = $root.net.pb.PushLogRequest.Body.fromObject(object.body);
                }
                return message;
            };

            /**
             * Creates a plain object from a PushLogRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {net.pb.PushLogRequest} message PushLogRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushLogRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.body = null;
                if (message.body != null && message.hasOwnProperty("body"))
                    object.body = $root.net.pb.PushLogRequest.Body.toObject(message.body, options);
                return object;
            };

            /**
             * Converts this PushLogRequest to JSON.
             * @function toJSON
             * @memberof net.pb.PushLogRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushLogRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PushLogRequest
             * @function getTypeUrl
             * @memberof net.pb.PushLogRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PushLogRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.PushLogRequest";
            };

            PushLogRequest.Body = (function() {

                /**
                 * Properties of a Body.
                 * @memberof net.pb.PushLogRequest
                 * @interface IBody
                 * @property {Uint8Array|null} [threadID] Body threadID
                 * @property {Uint8Array|null} [serviceKey] Body serviceKey
                 * @property {Uint8Array|null} [readKey] Body readKey
                 * @property {net.pb.ILog|null} [log] Body log
                 */

                /**
                 * Constructs a new Body.
                 * @memberof net.pb.PushLogRequest
                 * @classdesc Represents a Body.
                 * @implements IBody
                 * @constructor
                 * @param {net.pb.PushLogRequest.IBody=} [properties] Properties to set
                 */
                function Body(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Body threadID.
                 * @member {Uint8Array} threadID
                 * @memberof net.pb.PushLogRequest.Body
                 * @instance
                 */
                Body.prototype.threadID = $util.newBuffer([]);

                /**
                 * Body serviceKey.
                 * @member {Uint8Array} serviceKey
                 * @memberof net.pb.PushLogRequest.Body
                 * @instance
                 */
                Body.prototype.serviceKey = $util.newBuffer([]);

                /**
                 * Body readKey.
                 * @member {Uint8Array} readKey
                 * @memberof net.pb.PushLogRequest.Body
                 * @instance
                 */
                Body.prototype.readKey = $util.newBuffer([]);

                /**
                 * Body log.
                 * @member {net.pb.ILog|null|undefined} log
                 * @memberof net.pb.PushLogRequest.Body
                 * @instance
                 */
                Body.prototype.log = null;

                /**
                 * Creates a new Body instance using the specified properties.
                 * @function create
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {net.pb.PushLogRequest.IBody=} [properties] Properties to set
                 * @returns {net.pb.PushLogRequest.Body} Body instance
                 */
                Body.create = function create(properties) {
                    return new Body(properties);
                };

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.PushLogRequest.Body.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {net.pb.PushLogRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.threadID != null && Object.hasOwnProperty.call(message, "threadID"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.threadID);
                    if (message.serviceKey != null && Object.hasOwnProperty.call(message, "serviceKey"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.serviceKey);
                    if (message.readKey != null && Object.hasOwnProperty.call(message, "readKey"))
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.readKey);
                    if (message.log != null && Object.hasOwnProperty.call(message, "log"))
                        $root.net.pb.Log.encode(message.log, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.PushLogRequest.Body.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {net.pb.PushLogRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.PushLogRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.PushLogRequest.Body();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.threadID = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.serviceKey = reader.bytes();
                                break;
                            }
                        case 3: {
                                message.readKey = reader.bytes();
                                break;
                            }
                        case 4: {
                                message.log = $root.net.pb.Log.decode(reader, reader.uint32());
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
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.PushLogRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Body message.
                 * @function verify
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Body.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        if (!(message.threadID && typeof message.threadID.length === "number" || $util.isString(message.threadID)))
                            return "threadID: buffer expected";
                    if (message.serviceKey != null && message.hasOwnProperty("serviceKey"))
                        if (!(message.serviceKey && typeof message.serviceKey.length === "number" || $util.isString(message.serviceKey)))
                            return "serviceKey: buffer expected";
                    if (message.readKey != null && message.hasOwnProperty("readKey"))
                        if (!(message.readKey && typeof message.readKey.length === "number" || $util.isString(message.readKey)))
                            return "readKey: buffer expected";
                    if (message.log != null && message.hasOwnProperty("log")) {
                        let error = $root.net.pb.Log.verify(message.log);
                        if (error)
                            return "log." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.PushLogRequest.Body} Body
                 */
                Body.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.PushLogRequest.Body)
                        return object;
                    let message = new $root.net.pb.PushLogRequest.Body();
                    if (object.threadID != null)
                        if (typeof object.threadID === "string")
                            $util.base64.decode(object.threadID, message.threadID = $util.newBuffer($util.base64.length(object.threadID)), 0);
                        else if (object.threadID.length >= 0)
                            message.threadID = object.threadID;
                    if (object.serviceKey != null)
                        if (typeof object.serviceKey === "string")
                            $util.base64.decode(object.serviceKey, message.serviceKey = $util.newBuffer($util.base64.length(object.serviceKey)), 0);
                        else if (object.serviceKey.length >= 0)
                            message.serviceKey = object.serviceKey;
                    if (object.readKey != null)
                        if (typeof object.readKey === "string")
                            $util.base64.decode(object.readKey, message.readKey = $util.newBuffer($util.base64.length(object.readKey)), 0);
                        else if (object.readKey.length >= 0)
                            message.readKey = object.readKey;
                    if (object.log != null) {
                        if (typeof object.log !== "object")
                            throw TypeError(".net.pb.PushLogRequest.Body.log: object expected");
                        message.log = $root.net.pb.Log.fromObject(object.log);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {net.pb.PushLogRequest.Body} message Body
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Body.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.threadID = "";
                        else {
                            object.threadID = [];
                            if (options.bytes !== Array)
                                object.threadID = $util.newBuffer(object.threadID);
                        }
                        if (options.bytes === String)
                            object.serviceKey = "";
                        else {
                            object.serviceKey = [];
                            if (options.bytes !== Array)
                                object.serviceKey = $util.newBuffer(object.serviceKey);
                        }
                        if (options.bytes === String)
                            object.readKey = "";
                        else {
                            object.readKey = [];
                            if (options.bytes !== Array)
                                object.readKey = $util.newBuffer(object.readKey);
                        }
                        object.log = null;
                    }
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        object.threadID = options.bytes === String ? $util.base64.encode(message.threadID, 0, message.threadID.length) : options.bytes === Array ? Array.prototype.slice.call(message.threadID) : message.threadID;
                    if (message.serviceKey != null && message.hasOwnProperty("serviceKey"))
                        object.serviceKey = options.bytes === String ? $util.base64.encode(message.serviceKey, 0, message.serviceKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.serviceKey) : message.serviceKey;
                    if (message.readKey != null && message.hasOwnProperty("readKey"))
                        object.readKey = options.bytes === String ? $util.base64.encode(message.readKey, 0, message.readKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.readKey) : message.readKey;
                    if (message.log != null && message.hasOwnProperty("log"))
                        object.log = $root.net.pb.Log.toObject(message.log, options);
                    return object;
                };

                /**
                 * Converts this Body to JSON.
                 * @function toJSON
                 * @memberof net.pb.PushLogRequest.Body
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Body.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Body
                 * @function getTypeUrl
                 * @memberof net.pb.PushLogRequest.Body
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Body.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.PushLogRequest.Body";
                };

                return Body;
            })();

            return PushLogRequest;
        })();

        pb.PushLogReply = (function() {

            /**
             * Properties of a PushLogReply.
             * @memberof net.pb
             * @interface IPushLogReply
             */

            /**
             * Constructs a new PushLogReply.
             * @memberof net.pb
             * @classdesc Represents a PushLogReply.
             * @implements IPushLogReply
             * @constructor
             * @param {net.pb.IPushLogReply=} [properties] Properties to set
             */
            function PushLogReply(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new PushLogReply instance using the specified properties.
             * @function create
             * @memberof net.pb.PushLogReply
             * @static
             * @param {net.pb.IPushLogReply=} [properties] Properties to set
             * @returns {net.pb.PushLogReply} PushLogReply instance
             */
            PushLogReply.create = function create(properties) {
                return new PushLogReply(properties);
            };

            /**
             * Encodes the specified PushLogReply message. Does not implicitly {@link net.pb.PushLogReply.verify|verify} messages.
             * @function encode
             * @memberof net.pb.PushLogReply
             * @static
             * @param {net.pb.IPushLogReply} message PushLogReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushLogReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified PushLogReply message, length delimited. Does not implicitly {@link net.pb.PushLogReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.PushLogReply
             * @static
             * @param {net.pb.IPushLogReply} message PushLogReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushLogReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushLogReply message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.PushLogReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.PushLogReply} PushLogReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushLogReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.PushLogReply();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PushLogReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.PushLogReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.PushLogReply} PushLogReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushLogReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushLogReply message.
             * @function verify
             * @memberof net.pb.PushLogReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushLogReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a PushLogReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.PushLogReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.PushLogReply} PushLogReply
             */
            PushLogReply.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.PushLogReply)
                    return object;
                return new $root.net.pb.PushLogReply();
            };

            /**
             * Creates a plain object from a PushLogReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.PushLogReply
             * @static
             * @param {net.pb.PushLogReply} message PushLogReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushLogReply.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this PushLogReply to JSON.
             * @function toJSON
             * @memberof net.pb.PushLogReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushLogReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PushLogReply
             * @function getTypeUrl
             * @memberof net.pb.PushLogReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PushLogReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.PushLogReply";
            };

            return PushLogReply;
        })();

        pb.GetRecordsRequest = (function() {

            /**
             * Properties of a GetRecordsRequest.
             * @memberof net.pb
             * @interface IGetRecordsRequest
             * @property {net.pb.GetRecordsRequest.IBody|null} [body] GetRecordsRequest body
             */

            /**
             * Constructs a new GetRecordsRequest.
             * @memberof net.pb
             * @classdesc Represents a GetRecordsRequest.
             * @implements IGetRecordsRequest
             * @constructor
             * @param {net.pb.IGetRecordsRequest=} [properties] Properties to set
             */
            function GetRecordsRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetRecordsRequest body.
             * @member {net.pb.GetRecordsRequest.IBody|null|undefined} body
             * @memberof net.pb.GetRecordsRequest
             * @instance
             */
            GetRecordsRequest.prototype.body = null;

            /**
             * Creates a new GetRecordsRequest instance using the specified properties.
             * @function create
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {net.pb.IGetRecordsRequest=} [properties] Properties to set
             * @returns {net.pb.GetRecordsRequest} GetRecordsRequest instance
             */
            GetRecordsRequest.create = function create(properties) {
                return new GetRecordsRequest(properties);
            };

            /**
             * Encodes the specified GetRecordsRequest message. Does not implicitly {@link net.pb.GetRecordsRequest.verify|verify} messages.
             * @function encode
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {net.pb.IGetRecordsRequest} message GetRecordsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRecordsRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                    $root.net.pb.GetRecordsRequest.Body.encode(message.body, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetRecordsRequest message, length delimited. Does not implicitly {@link net.pb.GetRecordsRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {net.pb.IGetRecordsRequest} message GetRecordsRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRecordsRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetRecordsRequest message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.GetRecordsRequest} GetRecordsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRecordsRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetRecordsRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.body = $root.net.pb.GetRecordsRequest.Body.decode(reader, reader.uint32());
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
             * Decodes a GetRecordsRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.GetRecordsRequest} GetRecordsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRecordsRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetRecordsRequest message.
             * @function verify
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetRecordsRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.body != null && message.hasOwnProperty("body")) {
                    let error = $root.net.pb.GetRecordsRequest.Body.verify(message.body);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates a GetRecordsRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.GetRecordsRequest} GetRecordsRequest
             */
            GetRecordsRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.GetRecordsRequest)
                    return object;
                let message = new $root.net.pb.GetRecordsRequest();
                if (object.body != null) {
                    if (typeof object.body !== "object")
                        throw TypeError(".net.pb.GetRecordsRequest.body: object expected");
                    message.body = $root.net.pb.GetRecordsRequest.Body.fromObject(object.body);
                }
                return message;
            };

            /**
             * Creates a plain object from a GetRecordsRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {net.pb.GetRecordsRequest} message GetRecordsRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetRecordsRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.body = null;
                if (message.body != null && message.hasOwnProperty("body"))
                    object.body = $root.net.pb.GetRecordsRequest.Body.toObject(message.body, options);
                return object;
            };

            /**
             * Converts this GetRecordsRequest to JSON.
             * @function toJSON
             * @memberof net.pb.GetRecordsRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetRecordsRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetRecordsRequest
             * @function getTypeUrl
             * @memberof net.pb.GetRecordsRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetRecordsRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.GetRecordsRequest";
            };

            GetRecordsRequest.Body = (function() {

                /**
                 * Properties of a Body.
                 * @memberof net.pb.GetRecordsRequest
                 * @interface IBody
                 * @property {Uint8Array|null} [threadID] Body threadID
                 * @property {Uint8Array|null} [serviceKey] Body serviceKey
                 * @property {Array.<net.pb.GetRecordsRequest.Body.ILogEntry>|null} [logs] Body logs
                 */

                /**
                 * Constructs a new Body.
                 * @memberof net.pb.GetRecordsRequest
                 * @classdesc Represents a Body.
                 * @implements IBody
                 * @constructor
                 * @param {net.pb.GetRecordsRequest.IBody=} [properties] Properties to set
                 */
                function Body(properties) {
                    this.logs = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Body threadID.
                 * @member {Uint8Array} threadID
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @instance
                 */
                Body.prototype.threadID = $util.newBuffer([]);

                /**
                 * Body serviceKey.
                 * @member {Uint8Array} serviceKey
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @instance
                 */
                Body.prototype.serviceKey = $util.newBuffer([]);

                /**
                 * Body logs.
                 * @member {Array.<net.pb.GetRecordsRequest.Body.ILogEntry>} logs
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @instance
                 */
                Body.prototype.logs = $util.emptyArray;

                /**
                 * Creates a new Body instance using the specified properties.
                 * @function create
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {net.pb.GetRecordsRequest.IBody=} [properties] Properties to set
                 * @returns {net.pb.GetRecordsRequest.Body} Body instance
                 */
                Body.create = function create(properties) {
                    return new Body(properties);
                };

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.GetRecordsRequest.Body.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {net.pb.GetRecordsRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.threadID != null && Object.hasOwnProperty.call(message, "threadID"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.threadID);
                    if (message.serviceKey != null && Object.hasOwnProperty.call(message, "serviceKey"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.serviceKey);
                    if (message.logs != null && message.logs.length)
                        for (let i = 0; i < message.logs.length; ++i)
                            $root.net.pb.GetRecordsRequest.Body.LogEntry.encode(message.logs[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.GetRecordsRequest.Body.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {net.pb.GetRecordsRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.GetRecordsRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetRecordsRequest.Body();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.threadID = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.serviceKey = reader.bytes();
                                break;
                            }
                        case 3: {
                                if (!(message.logs && message.logs.length))
                                    message.logs = [];
                                message.logs.push($root.net.pb.GetRecordsRequest.Body.LogEntry.decode(reader, reader.uint32()));
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
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.GetRecordsRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Body message.
                 * @function verify
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Body.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        if (!(message.threadID && typeof message.threadID.length === "number" || $util.isString(message.threadID)))
                            return "threadID: buffer expected";
                    if (message.serviceKey != null && message.hasOwnProperty("serviceKey"))
                        if (!(message.serviceKey && typeof message.serviceKey.length === "number" || $util.isString(message.serviceKey)))
                            return "serviceKey: buffer expected";
                    if (message.logs != null && message.hasOwnProperty("logs")) {
                        if (!Array.isArray(message.logs))
                            return "logs: array expected";
                        for (let i = 0; i < message.logs.length; ++i) {
                            let error = $root.net.pb.GetRecordsRequest.Body.LogEntry.verify(message.logs[i]);
                            if (error)
                                return "logs." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.GetRecordsRequest.Body} Body
                 */
                Body.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.GetRecordsRequest.Body)
                        return object;
                    let message = new $root.net.pb.GetRecordsRequest.Body();
                    if (object.threadID != null)
                        if (typeof object.threadID === "string")
                            $util.base64.decode(object.threadID, message.threadID = $util.newBuffer($util.base64.length(object.threadID)), 0);
                        else if (object.threadID.length >= 0)
                            message.threadID = object.threadID;
                    if (object.serviceKey != null)
                        if (typeof object.serviceKey === "string")
                            $util.base64.decode(object.serviceKey, message.serviceKey = $util.newBuffer($util.base64.length(object.serviceKey)), 0);
                        else if (object.serviceKey.length >= 0)
                            message.serviceKey = object.serviceKey;
                    if (object.logs) {
                        if (!Array.isArray(object.logs))
                            throw TypeError(".net.pb.GetRecordsRequest.Body.logs: array expected");
                        message.logs = [];
                        for (let i = 0; i < object.logs.length; ++i) {
                            if (typeof object.logs[i] !== "object")
                                throw TypeError(".net.pb.GetRecordsRequest.Body.logs: object expected");
                            message.logs[i] = $root.net.pb.GetRecordsRequest.Body.LogEntry.fromObject(object.logs[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {net.pb.GetRecordsRequest.Body} message Body
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Body.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.logs = [];
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.threadID = "";
                        else {
                            object.threadID = [];
                            if (options.bytes !== Array)
                                object.threadID = $util.newBuffer(object.threadID);
                        }
                        if (options.bytes === String)
                            object.serviceKey = "";
                        else {
                            object.serviceKey = [];
                            if (options.bytes !== Array)
                                object.serviceKey = $util.newBuffer(object.serviceKey);
                        }
                    }
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        object.threadID = options.bytes === String ? $util.base64.encode(message.threadID, 0, message.threadID.length) : options.bytes === Array ? Array.prototype.slice.call(message.threadID) : message.threadID;
                    if (message.serviceKey != null && message.hasOwnProperty("serviceKey"))
                        object.serviceKey = options.bytes === String ? $util.base64.encode(message.serviceKey, 0, message.serviceKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.serviceKey) : message.serviceKey;
                    if (message.logs && message.logs.length) {
                        object.logs = [];
                        for (let j = 0; j < message.logs.length; ++j)
                            object.logs[j] = $root.net.pb.GetRecordsRequest.Body.LogEntry.toObject(message.logs[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Body to JSON.
                 * @function toJSON
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Body.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Body
                 * @function getTypeUrl
                 * @memberof net.pb.GetRecordsRequest.Body
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Body.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.GetRecordsRequest.Body";
                };

                Body.LogEntry = (function() {

                    /**
                     * Properties of a LogEntry.
                     * @memberof net.pb.GetRecordsRequest.Body
                     * @interface ILogEntry
                     * @property {Uint8Array|null} [logID] LogEntry logID
                     * @property {Uint8Array|null} [offset] LogEntry offset
                     * @property {number|null} [limit] LogEntry limit
                     * @property {number|Long|null} [counter] LogEntry counter
                     */

                    /**
                     * Constructs a new LogEntry.
                     * @memberof net.pb.GetRecordsRequest.Body
                     * @classdesc Represents a LogEntry.
                     * @implements ILogEntry
                     * @constructor
                     * @param {net.pb.GetRecordsRequest.Body.ILogEntry=} [properties] Properties to set
                     */
                    function LogEntry(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * LogEntry logID.
                     * @member {Uint8Array} logID
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @instance
                     */
                    LogEntry.prototype.logID = $util.newBuffer([]);

                    /**
                     * LogEntry offset.
                     * @member {Uint8Array} offset
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @instance
                     */
                    LogEntry.prototype.offset = $util.newBuffer([]);

                    /**
                     * LogEntry limit.
                     * @member {number} limit
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @instance
                     */
                    LogEntry.prototype.limit = 0;

                    /**
                     * LogEntry counter.
                     * @member {number|Long} counter
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @instance
                     */
                    LogEntry.prototype.counter = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                    /**
                     * Creates a new LogEntry instance using the specified properties.
                     * @function create
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {net.pb.GetRecordsRequest.Body.ILogEntry=} [properties] Properties to set
                     * @returns {net.pb.GetRecordsRequest.Body.LogEntry} LogEntry instance
                     */
                    LogEntry.create = function create(properties) {
                        return new LogEntry(properties);
                    };

                    /**
                     * Encodes the specified LogEntry message. Does not implicitly {@link net.pb.GetRecordsRequest.Body.LogEntry.verify|verify} messages.
                     * @function encode
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {net.pb.GetRecordsRequest.Body.ILogEntry} message LogEntry message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LogEntry.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.logID != null && Object.hasOwnProperty.call(message, "logID"))
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.logID);
                        if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.offset);
                        if (message.limit != null && Object.hasOwnProperty.call(message, "limit"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.limit);
                        if (message.counter != null && Object.hasOwnProperty.call(message, "counter"))
                            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.counter);
                        return writer;
                    };

                    /**
                     * Encodes the specified LogEntry message, length delimited. Does not implicitly {@link net.pb.GetRecordsRequest.Body.LogEntry.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {net.pb.GetRecordsRequest.Body.ILogEntry} message LogEntry message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    LogEntry.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a LogEntry message from the specified reader or buffer.
                     * @function decode
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {net.pb.GetRecordsRequest.Body.LogEntry} LogEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LogEntry.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetRecordsRequest.Body.LogEntry();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.logID = reader.bytes();
                                    break;
                                }
                            case 2: {
                                    message.offset = reader.bytes();
                                    break;
                                }
                            case 3: {
                                    message.limit = reader.int32();
                                    break;
                                }
                            case 4: {
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
                     * Decodes a LogEntry message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {net.pb.GetRecordsRequest.Body.LogEntry} LogEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    LogEntry.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a LogEntry message.
                     * @function verify
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    LogEntry.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.logID != null && message.hasOwnProperty("logID"))
                            if (!(message.logID && typeof message.logID.length === "number" || $util.isString(message.logID)))
                                return "logID: buffer expected";
                        if (message.offset != null && message.hasOwnProperty("offset"))
                            if (!(message.offset && typeof message.offset.length === "number" || $util.isString(message.offset)))
                                return "offset: buffer expected";
                        if (message.limit != null && message.hasOwnProperty("limit"))
                            if (!$util.isInteger(message.limit))
                                return "limit: integer expected";
                        if (message.counter != null && message.hasOwnProperty("counter"))
                            if (!$util.isInteger(message.counter) && !(message.counter && $util.isInteger(message.counter.low) && $util.isInteger(message.counter.high)))
                                return "counter: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a LogEntry message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {net.pb.GetRecordsRequest.Body.LogEntry} LogEntry
                     */
                    LogEntry.fromObject = function fromObject(object) {
                        if (object instanceof $root.net.pb.GetRecordsRequest.Body.LogEntry)
                            return object;
                        let message = new $root.net.pb.GetRecordsRequest.Body.LogEntry();
                        if (object.logID != null)
                            if (typeof object.logID === "string")
                                $util.base64.decode(object.logID, message.logID = $util.newBuffer($util.base64.length(object.logID)), 0);
                            else if (object.logID.length >= 0)
                                message.logID = object.logID;
                        if (object.offset != null)
                            if (typeof object.offset === "string")
                                $util.base64.decode(object.offset, message.offset = $util.newBuffer($util.base64.length(object.offset)), 0);
                            else if (object.offset.length >= 0)
                                message.offset = object.offset;
                        if (object.limit != null)
                            message.limit = object.limit | 0;
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
                     * Creates a plain object from a LogEntry message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {net.pb.GetRecordsRequest.Body.LogEntry} message LogEntry
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    LogEntry.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            if (options.bytes === String)
                                object.logID = "";
                            else {
                                object.logID = [];
                                if (options.bytes !== Array)
                                    object.logID = $util.newBuffer(object.logID);
                            }
                            if (options.bytes === String)
                                object.offset = "";
                            else {
                                object.offset = [];
                                if (options.bytes !== Array)
                                    object.offset = $util.newBuffer(object.offset);
                            }
                            object.limit = 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, false);
                                object.counter = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.counter = options.longs === String ? "0" : 0;
                        }
                        if (message.logID != null && message.hasOwnProperty("logID"))
                            object.logID = options.bytes === String ? $util.base64.encode(message.logID, 0, message.logID.length) : options.bytes === Array ? Array.prototype.slice.call(message.logID) : message.logID;
                        if (message.offset != null && message.hasOwnProperty("offset"))
                            object.offset = options.bytes === String ? $util.base64.encode(message.offset, 0, message.offset.length) : options.bytes === Array ? Array.prototype.slice.call(message.offset) : message.offset;
                        if (message.limit != null && message.hasOwnProperty("limit"))
                            object.limit = message.limit;
                        if (message.counter != null && message.hasOwnProperty("counter"))
                            if (typeof message.counter === "number")
                                object.counter = options.longs === String ? String(message.counter) : message.counter;
                            else
                                object.counter = options.longs === String ? $util.Long.prototype.toString.call(message.counter) : options.longs === Number ? new $util.LongBits(message.counter.low >>> 0, message.counter.high >>> 0).toNumber() : message.counter;
                        return object;
                    };

                    /**
                     * Converts this LogEntry to JSON.
                     * @function toJSON
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    LogEntry.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for LogEntry
                     * @function getTypeUrl
                     * @memberof net.pb.GetRecordsRequest.Body.LogEntry
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    LogEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/net.pb.GetRecordsRequest.Body.LogEntry";
                    };

                    return LogEntry;
                })();

                return Body;
            })();

            return GetRecordsRequest;
        })();

        pb.GetRecordsReply = (function() {

            /**
             * Properties of a GetRecordsReply.
             * @memberof net.pb
             * @interface IGetRecordsReply
             * @property {Array.<net.pb.GetRecordsReply.ILogEntry>|null} [logs] GetRecordsReply logs
             */

            /**
             * Constructs a new GetRecordsReply.
             * @memberof net.pb
             * @classdesc Represents a GetRecordsReply.
             * @implements IGetRecordsReply
             * @constructor
             * @param {net.pb.IGetRecordsReply=} [properties] Properties to set
             */
            function GetRecordsReply(properties) {
                this.logs = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GetRecordsReply logs.
             * @member {Array.<net.pb.GetRecordsReply.ILogEntry>} logs
             * @memberof net.pb.GetRecordsReply
             * @instance
             */
            GetRecordsReply.prototype.logs = $util.emptyArray;

            /**
             * Creates a new GetRecordsReply instance using the specified properties.
             * @function create
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {net.pb.IGetRecordsReply=} [properties] Properties to set
             * @returns {net.pb.GetRecordsReply} GetRecordsReply instance
             */
            GetRecordsReply.create = function create(properties) {
                return new GetRecordsReply(properties);
            };

            /**
             * Encodes the specified GetRecordsReply message. Does not implicitly {@link net.pb.GetRecordsReply.verify|verify} messages.
             * @function encode
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {net.pb.IGetRecordsReply} message GetRecordsReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRecordsReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.logs != null && message.logs.length)
                    for (let i = 0; i < message.logs.length; ++i)
                        $root.net.pb.GetRecordsReply.LogEntry.encode(message.logs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GetRecordsReply message, length delimited. Does not implicitly {@link net.pb.GetRecordsReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {net.pb.IGetRecordsReply} message GetRecordsReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GetRecordsReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GetRecordsReply message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.GetRecordsReply} GetRecordsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRecordsReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetRecordsReply();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.logs && message.logs.length))
                                message.logs = [];
                            message.logs.push($root.net.pb.GetRecordsReply.LogEntry.decode(reader, reader.uint32()));
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
             * Decodes a GetRecordsReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.GetRecordsReply} GetRecordsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GetRecordsReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GetRecordsReply message.
             * @function verify
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GetRecordsReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.logs != null && message.hasOwnProperty("logs")) {
                    if (!Array.isArray(message.logs))
                        return "logs: array expected";
                    for (let i = 0; i < message.logs.length; ++i) {
                        let error = $root.net.pb.GetRecordsReply.LogEntry.verify(message.logs[i]);
                        if (error)
                            return "logs." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GetRecordsReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.GetRecordsReply} GetRecordsReply
             */
            GetRecordsReply.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.GetRecordsReply)
                    return object;
                let message = new $root.net.pb.GetRecordsReply();
                if (object.logs) {
                    if (!Array.isArray(object.logs))
                        throw TypeError(".net.pb.GetRecordsReply.logs: array expected");
                    message.logs = [];
                    for (let i = 0; i < object.logs.length; ++i) {
                        if (typeof object.logs[i] !== "object")
                            throw TypeError(".net.pb.GetRecordsReply.logs: object expected");
                        message.logs[i] = $root.net.pb.GetRecordsReply.LogEntry.fromObject(object.logs[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GetRecordsReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {net.pb.GetRecordsReply} message GetRecordsReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GetRecordsReply.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.logs = [];
                if (message.logs && message.logs.length) {
                    object.logs = [];
                    for (let j = 0; j < message.logs.length; ++j)
                        object.logs[j] = $root.net.pb.GetRecordsReply.LogEntry.toObject(message.logs[j], options);
                }
                return object;
            };

            /**
             * Converts this GetRecordsReply to JSON.
             * @function toJSON
             * @memberof net.pb.GetRecordsReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GetRecordsReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for GetRecordsReply
             * @function getTypeUrl
             * @memberof net.pb.GetRecordsReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            GetRecordsReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.GetRecordsReply";
            };

            GetRecordsReply.LogEntry = (function() {

                /**
                 * Properties of a LogEntry.
                 * @memberof net.pb.GetRecordsReply
                 * @interface ILogEntry
                 * @property {Uint8Array|null} [logID] LogEntry logID
                 * @property {Array.<net.pb.Log.IRecord>|null} [records] LogEntry records
                 * @property {net.pb.ILog|null} [log] LogEntry log
                 */

                /**
                 * Constructs a new LogEntry.
                 * @memberof net.pb.GetRecordsReply
                 * @classdesc Represents a LogEntry.
                 * @implements ILogEntry
                 * @constructor
                 * @param {net.pb.GetRecordsReply.ILogEntry=} [properties] Properties to set
                 */
                function LogEntry(properties) {
                    this.records = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * LogEntry logID.
                 * @member {Uint8Array} logID
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @instance
                 */
                LogEntry.prototype.logID = $util.newBuffer([]);

                /**
                 * LogEntry records.
                 * @member {Array.<net.pb.Log.IRecord>} records
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @instance
                 */
                LogEntry.prototype.records = $util.emptyArray;

                /**
                 * LogEntry log.
                 * @member {net.pb.ILog|null|undefined} log
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @instance
                 */
                LogEntry.prototype.log = null;

                /**
                 * Creates a new LogEntry instance using the specified properties.
                 * @function create
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {net.pb.GetRecordsReply.ILogEntry=} [properties] Properties to set
                 * @returns {net.pb.GetRecordsReply.LogEntry} LogEntry instance
                 */
                LogEntry.create = function create(properties) {
                    return new LogEntry(properties);
                };

                /**
                 * Encodes the specified LogEntry message. Does not implicitly {@link net.pb.GetRecordsReply.LogEntry.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {net.pb.GetRecordsReply.ILogEntry} message LogEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LogEntry.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.logID != null && Object.hasOwnProperty.call(message, "logID"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.logID);
                    if (message.records != null && message.records.length)
                        for (let i = 0; i < message.records.length; ++i)
                            $root.net.pb.Log.Record.encode(message.records[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.log != null && Object.hasOwnProperty.call(message, "log"))
                        $root.net.pb.Log.encode(message.log, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified LogEntry message, length delimited. Does not implicitly {@link net.pb.GetRecordsReply.LogEntry.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {net.pb.GetRecordsReply.ILogEntry} message LogEntry message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LogEntry.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a LogEntry message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.GetRecordsReply.LogEntry} LogEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LogEntry.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.GetRecordsReply.LogEntry();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.logID = reader.bytes();
                                break;
                            }
                        case 2: {
                                if (!(message.records && message.records.length))
                                    message.records = [];
                                message.records.push($root.net.pb.Log.Record.decode(reader, reader.uint32()));
                                break;
                            }
                        case 3: {
                                message.log = $root.net.pb.Log.decode(reader, reader.uint32());
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
                 * Decodes a LogEntry message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.GetRecordsReply.LogEntry} LogEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LogEntry.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a LogEntry message.
                 * @function verify
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                LogEntry.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.logID != null && message.hasOwnProperty("logID"))
                        if (!(message.logID && typeof message.logID.length === "number" || $util.isString(message.logID)))
                            return "logID: buffer expected";
                    if (message.records != null && message.hasOwnProperty("records")) {
                        if (!Array.isArray(message.records))
                            return "records: array expected";
                        for (let i = 0; i < message.records.length; ++i) {
                            let error = $root.net.pb.Log.Record.verify(message.records[i]);
                            if (error)
                                return "records." + error;
                        }
                    }
                    if (message.log != null && message.hasOwnProperty("log")) {
                        let error = $root.net.pb.Log.verify(message.log);
                        if (error)
                            return "log." + error;
                    }
                    return null;
                };

                /**
                 * Creates a LogEntry message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.GetRecordsReply.LogEntry} LogEntry
                 */
                LogEntry.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.GetRecordsReply.LogEntry)
                        return object;
                    let message = new $root.net.pb.GetRecordsReply.LogEntry();
                    if (object.logID != null)
                        if (typeof object.logID === "string")
                            $util.base64.decode(object.logID, message.logID = $util.newBuffer($util.base64.length(object.logID)), 0);
                        else if (object.logID.length >= 0)
                            message.logID = object.logID;
                    if (object.records) {
                        if (!Array.isArray(object.records))
                            throw TypeError(".net.pb.GetRecordsReply.LogEntry.records: array expected");
                        message.records = [];
                        for (let i = 0; i < object.records.length; ++i) {
                            if (typeof object.records[i] !== "object")
                                throw TypeError(".net.pb.GetRecordsReply.LogEntry.records: object expected");
                            message.records[i] = $root.net.pb.Log.Record.fromObject(object.records[i]);
                        }
                    }
                    if (object.log != null) {
                        if (typeof object.log !== "object")
                            throw TypeError(".net.pb.GetRecordsReply.LogEntry.log: object expected");
                        message.log = $root.net.pb.Log.fromObject(object.log);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a LogEntry message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {net.pb.GetRecordsReply.LogEntry} message LogEntry
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LogEntry.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.records = [];
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.logID = "";
                        else {
                            object.logID = [];
                            if (options.bytes !== Array)
                                object.logID = $util.newBuffer(object.logID);
                        }
                        object.log = null;
                    }
                    if (message.logID != null && message.hasOwnProperty("logID"))
                        object.logID = options.bytes === String ? $util.base64.encode(message.logID, 0, message.logID.length) : options.bytes === Array ? Array.prototype.slice.call(message.logID) : message.logID;
                    if (message.records && message.records.length) {
                        object.records = [];
                        for (let j = 0; j < message.records.length; ++j)
                            object.records[j] = $root.net.pb.Log.Record.toObject(message.records[j], options);
                    }
                    if (message.log != null && message.hasOwnProperty("log"))
                        object.log = $root.net.pb.Log.toObject(message.log, options);
                    return object;
                };

                /**
                 * Converts this LogEntry to JSON.
                 * @function toJSON
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                LogEntry.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for LogEntry
                 * @function getTypeUrl
                 * @memberof net.pb.GetRecordsReply.LogEntry
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                LogEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.GetRecordsReply.LogEntry";
                };

                return LogEntry;
            })();

            return GetRecordsReply;
        })();

        pb.PushRecordRequest = (function() {

            /**
             * Properties of a PushRecordRequest.
             * @memberof net.pb
             * @interface IPushRecordRequest
             * @property {net.pb.PushRecordRequest.IBody|null} [body] PushRecordRequest body
             * @property {number|Long|null} [counter] PushRecordRequest counter
             */

            /**
             * Constructs a new PushRecordRequest.
             * @memberof net.pb
             * @classdesc Represents a PushRecordRequest.
             * @implements IPushRecordRequest
             * @constructor
             * @param {net.pb.IPushRecordRequest=} [properties] Properties to set
             */
            function PushRecordRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PushRecordRequest body.
             * @member {net.pb.PushRecordRequest.IBody|null|undefined} body
             * @memberof net.pb.PushRecordRequest
             * @instance
             */
            PushRecordRequest.prototype.body = null;

            /**
             * PushRecordRequest counter.
             * @member {number|Long} counter
             * @memberof net.pb.PushRecordRequest
             * @instance
             */
            PushRecordRequest.prototype.counter = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new PushRecordRequest instance using the specified properties.
             * @function create
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {net.pb.IPushRecordRequest=} [properties] Properties to set
             * @returns {net.pb.PushRecordRequest} PushRecordRequest instance
             */
            PushRecordRequest.create = function create(properties) {
                return new PushRecordRequest(properties);
            };

            /**
             * Encodes the specified PushRecordRequest message. Does not implicitly {@link net.pb.PushRecordRequest.verify|verify} messages.
             * @function encode
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {net.pb.IPushRecordRequest} message PushRecordRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushRecordRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                    $root.net.pb.PushRecordRequest.Body.encode(message.body, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.counter != null && Object.hasOwnProperty.call(message, "counter"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.counter);
                return writer;
            };

            /**
             * Encodes the specified PushRecordRequest message, length delimited. Does not implicitly {@link net.pb.PushRecordRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {net.pb.IPushRecordRequest} message PushRecordRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushRecordRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushRecordRequest message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.PushRecordRequest} PushRecordRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushRecordRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.PushRecordRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.body = $root.net.pb.PushRecordRequest.Body.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
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
             * Decodes a PushRecordRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.PushRecordRequest} PushRecordRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushRecordRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushRecordRequest message.
             * @function verify
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushRecordRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.body != null && message.hasOwnProperty("body")) {
                    let error = $root.net.pb.PushRecordRequest.Body.verify(message.body);
                    if (error)
                        return "body." + error;
                }
                if (message.counter != null && message.hasOwnProperty("counter"))
                    if (!$util.isInteger(message.counter) && !(message.counter && $util.isInteger(message.counter.low) && $util.isInteger(message.counter.high)))
                        return "counter: integer|Long expected";
                return null;
            };

            /**
             * Creates a PushRecordRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.PushRecordRequest} PushRecordRequest
             */
            PushRecordRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.PushRecordRequest)
                    return object;
                let message = new $root.net.pb.PushRecordRequest();
                if (object.body != null) {
                    if (typeof object.body !== "object")
                        throw TypeError(".net.pb.PushRecordRequest.body: object expected");
                    message.body = $root.net.pb.PushRecordRequest.Body.fromObject(object.body);
                }
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
             * Creates a plain object from a PushRecordRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {net.pb.PushRecordRequest} message PushRecordRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushRecordRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.body = null;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.counter = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.counter = options.longs === String ? "0" : 0;
                }
                if (message.body != null && message.hasOwnProperty("body"))
                    object.body = $root.net.pb.PushRecordRequest.Body.toObject(message.body, options);
                if (message.counter != null && message.hasOwnProperty("counter"))
                    if (typeof message.counter === "number")
                        object.counter = options.longs === String ? String(message.counter) : message.counter;
                    else
                        object.counter = options.longs === String ? $util.Long.prototype.toString.call(message.counter) : options.longs === Number ? new $util.LongBits(message.counter.low >>> 0, message.counter.high >>> 0).toNumber() : message.counter;
                return object;
            };

            /**
             * Converts this PushRecordRequest to JSON.
             * @function toJSON
             * @memberof net.pb.PushRecordRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushRecordRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PushRecordRequest
             * @function getTypeUrl
             * @memberof net.pb.PushRecordRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PushRecordRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.PushRecordRequest";
            };

            PushRecordRequest.Body = (function() {

                /**
                 * Properties of a Body.
                 * @memberof net.pb.PushRecordRequest
                 * @interface IBody
                 * @property {Uint8Array|null} [threadID] Body threadID
                 * @property {Uint8Array|null} [logID] Body logID
                 * @property {net.pb.Log.IRecord|null} [record] Body record
                 */

                /**
                 * Constructs a new Body.
                 * @memberof net.pb.PushRecordRequest
                 * @classdesc Represents a Body.
                 * @implements IBody
                 * @constructor
                 * @param {net.pb.PushRecordRequest.IBody=} [properties] Properties to set
                 */
                function Body(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Body threadID.
                 * @member {Uint8Array} threadID
                 * @memberof net.pb.PushRecordRequest.Body
                 * @instance
                 */
                Body.prototype.threadID = $util.newBuffer([]);

                /**
                 * Body logID.
                 * @member {Uint8Array} logID
                 * @memberof net.pb.PushRecordRequest.Body
                 * @instance
                 */
                Body.prototype.logID = $util.newBuffer([]);

                /**
                 * Body record.
                 * @member {net.pb.Log.IRecord|null|undefined} record
                 * @memberof net.pb.PushRecordRequest.Body
                 * @instance
                 */
                Body.prototype.record = null;

                /**
                 * Creates a new Body instance using the specified properties.
                 * @function create
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {net.pb.PushRecordRequest.IBody=} [properties] Properties to set
                 * @returns {net.pb.PushRecordRequest.Body} Body instance
                 */
                Body.create = function create(properties) {
                    return new Body(properties);
                };

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.PushRecordRequest.Body.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {net.pb.PushRecordRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.threadID != null && Object.hasOwnProperty.call(message, "threadID"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.threadID);
                    if (message.logID != null && Object.hasOwnProperty.call(message, "logID"))
                        writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.logID);
                    if (message.record != null && Object.hasOwnProperty.call(message, "record"))
                        $root.net.pb.Log.Record.encode(message.record, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.PushRecordRequest.Body.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {net.pb.PushRecordRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.PushRecordRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.PushRecordRequest.Body();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.threadID = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.logID = reader.bytes();
                                break;
                            }
                        case 3: {
                                message.record = $root.net.pb.Log.Record.decode(reader, reader.uint32());
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
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.PushRecordRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Body message.
                 * @function verify
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Body.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        if (!(message.threadID && typeof message.threadID.length === "number" || $util.isString(message.threadID)))
                            return "threadID: buffer expected";
                    if (message.logID != null && message.hasOwnProperty("logID"))
                        if (!(message.logID && typeof message.logID.length === "number" || $util.isString(message.logID)))
                            return "logID: buffer expected";
                    if (message.record != null && message.hasOwnProperty("record")) {
                        let error = $root.net.pb.Log.Record.verify(message.record);
                        if (error)
                            return "record." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.PushRecordRequest.Body} Body
                 */
                Body.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.PushRecordRequest.Body)
                        return object;
                    let message = new $root.net.pb.PushRecordRequest.Body();
                    if (object.threadID != null)
                        if (typeof object.threadID === "string")
                            $util.base64.decode(object.threadID, message.threadID = $util.newBuffer($util.base64.length(object.threadID)), 0);
                        else if (object.threadID.length >= 0)
                            message.threadID = object.threadID;
                    if (object.logID != null)
                        if (typeof object.logID === "string")
                            $util.base64.decode(object.logID, message.logID = $util.newBuffer($util.base64.length(object.logID)), 0);
                        else if (object.logID.length >= 0)
                            message.logID = object.logID;
                    if (object.record != null) {
                        if (typeof object.record !== "object")
                            throw TypeError(".net.pb.PushRecordRequest.Body.record: object expected");
                        message.record = $root.net.pb.Log.Record.fromObject(object.record);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {net.pb.PushRecordRequest.Body} message Body
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Body.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.threadID = "";
                        else {
                            object.threadID = [];
                            if (options.bytes !== Array)
                                object.threadID = $util.newBuffer(object.threadID);
                        }
                        if (options.bytes === String)
                            object.logID = "";
                        else {
                            object.logID = [];
                            if (options.bytes !== Array)
                                object.logID = $util.newBuffer(object.logID);
                        }
                        object.record = null;
                    }
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        object.threadID = options.bytes === String ? $util.base64.encode(message.threadID, 0, message.threadID.length) : options.bytes === Array ? Array.prototype.slice.call(message.threadID) : message.threadID;
                    if (message.logID != null && message.hasOwnProperty("logID"))
                        object.logID = options.bytes === String ? $util.base64.encode(message.logID, 0, message.logID.length) : options.bytes === Array ? Array.prototype.slice.call(message.logID) : message.logID;
                    if (message.record != null && message.hasOwnProperty("record"))
                        object.record = $root.net.pb.Log.Record.toObject(message.record, options);
                    return object;
                };

                /**
                 * Converts this Body to JSON.
                 * @function toJSON
                 * @memberof net.pb.PushRecordRequest.Body
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Body.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Body
                 * @function getTypeUrl
                 * @memberof net.pb.PushRecordRequest.Body
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Body.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.PushRecordRequest.Body";
                };

                return Body;
            })();

            return PushRecordRequest;
        })();

        pb.PushRecordReply = (function() {

            /**
             * Properties of a PushRecordReply.
             * @memberof net.pb
             * @interface IPushRecordReply
             */

            /**
             * Constructs a new PushRecordReply.
             * @memberof net.pb
             * @classdesc Represents a PushRecordReply.
             * @implements IPushRecordReply
             * @constructor
             * @param {net.pb.IPushRecordReply=} [properties] Properties to set
             */
            function PushRecordReply(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new PushRecordReply instance using the specified properties.
             * @function create
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {net.pb.IPushRecordReply=} [properties] Properties to set
             * @returns {net.pb.PushRecordReply} PushRecordReply instance
             */
            PushRecordReply.create = function create(properties) {
                return new PushRecordReply(properties);
            };

            /**
             * Encodes the specified PushRecordReply message. Does not implicitly {@link net.pb.PushRecordReply.verify|verify} messages.
             * @function encode
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {net.pb.IPushRecordReply} message PushRecordReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushRecordReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified PushRecordReply message, length delimited. Does not implicitly {@link net.pb.PushRecordReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {net.pb.IPushRecordReply} message PushRecordReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PushRecordReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PushRecordReply message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.PushRecordReply} PushRecordReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushRecordReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.PushRecordReply();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PushRecordReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.PushRecordReply} PushRecordReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PushRecordReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PushRecordReply message.
             * @function verify
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PushRecordReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates a PushRecordReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.PushRecordReply} PushRecordReply
             */
            PushRecordReply.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.PushRecordReply)
                    return object;
                return new $root.net.pb.PushRecordReply();
            };

            /**
             * Creates a plain object from a PushRecordReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {net.pb.PushRecordReply} message PushRecordReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PushRecordReply.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this PushRecordReply to JSON.
             * @function toJSON
             * @memberof net.pb.PushRecordReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PushRecordReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for PushRecordReply
             * @function getTypeUrl
             * @memberof net.pb.PushRecordReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            PushRecordReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.PushRecordReply";
            };

            return PushRecordReply;
        })();

        pb.ExchangeEdgesRequest = (function() {

            /**
             * Properties of an ExchangeEdgesRequest.
             * @memberof net.pb
             * @interface IExchangeEdgesRequest
             * @property {net.pb.ExchangeEdgesRequest.IBody|null} [body] ExchangeEdgesRequest body
             */

            /**
             * Constructs a new ExchangeEdgesRequest.
             * @memberof net.pb
             * @classdesc Represents an ExchangeEdgesRequest.
             * @implements IExchangeEdgesRequest
             * @constructor
             * @param {net.pb.IExchangeEdgesRequest=} [properties] Properties to set
             */
            function ExchangeEdgesRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ExchangeEdgesRequest body.
             * @member {net.pb.ExchangeEdgesRequest.IBody|null|undefined} body
             * @memberof net.pb.ExchangeEdgesRequest
             * @instance
             */
            ExchangeEdgesRequest.prototype.body = null;

            /**
             * Creates a new ExchangeEdgesRequest instance using the specified properties.
             * @function create
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {net.pb.IExchangeEdgesRequest=} [properties] Properties to set
             * @returns {net.pb.ExchangeEdgesRequest} ExchangeEdgesRequest instance
             */
            ExchangeEdgesRequest.create = function create(properties) {
                return new ExchangeEdgesRequest(properties);
            };

            /**
             * Encodes the specified ExchangeEdgesRequest message. Does not implicitly {@link net.pb.ExchangeEdgesRequest.verify|verify} messages.
             * @function encode
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {net.pb.IExchangeEdgesRequest} message ExchangeEdgesRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExchangeEdgesRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.body != null && Object.hasOwnProperty.call(message, "body"))
                    $root.net.pb.ExchangeEdgesRequest.Body.encode(message.body, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ExchangeEdgesRequest message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {net.pb.IExchangeEdgesRequest} message ExchangeEdgesRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExchangeEdgesRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ExchangeEdgesRequest message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.ExchangeEdgesRequest} ExchangeEdgesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExchangeEdgesRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.ExchangeEdgesRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2: {
                            message.body = $root.net.pb.ExchangeEdgesRequest.Body.decode(reader, reader.uint32());
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
             * Decodes an ExchangeEdgesRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.ExchangeEdgesRequest} ExchangeEdgesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExchangeEdgesRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ExchangeEdgesRequest message.
             * @function verify
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ExchangeEdgesRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.body != null && message.hasOwnProperty("body")) {
                    let error = $root.net.pb.ExchangeEdgesRequest.Body.verify(message.body);
                    if (error)
                        return "body." + error;
                }
                return null;
            };

            /**
             * Creates an ExchangeEdgesRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.ExchangeEdgesRequest} ExchangeEdgesRequest
             */
            ExchangeEdgesRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.ExchangeEdgesRequest)
                    return object;
                let message = new $root.net.pb.ExchangeEdgesRequest();
                if (object.body != null) {
                    if (typeof object.body !== "object")
                        throw TypeError(".net.pb.ExchangeEdgesRequest.body: object expected");
                    message.body = $root.net.pb.ExchangeEdgesRequest.Body.fromObject(object.body);
                }
                return message;
            };

            /**
             * Creates a plain object from an ExchangeEdgesRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {net.pb.ExchangeEdgesRequest} message ExchangeEdgesRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ExchangeEdgesRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.body = null;
                if (message.body != null && message.hasOwnProperty("body"))
                    object.body = $root.net.pb.ExchangeEdgesRequest.Body.toObject(message.body, options);
                return object;
            };

            /**
             * Converts this ExchangeEdgesRequest to JSON.
             * @function toJSON
             * @memberof net.pb.ExchangeEdgesRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ExchangeEdgesRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ExchangeEdgesRequest
             * @function getTypeUrl
             * @memberof net.pb.ExchangeEdgesRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ExchangeEdgesRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.ExchangeEdgesRequest";
            };

            ExchangeEdgesRequest.Body = (function() {

                /**
                 * Properties of a Body.
                 * @memberof net.pb.ExchangeEdgesRequest
                 * @interface IBody
                 * @property {Array.<net.pb.ExchangeEdgesRequest.Body.IThreadEntry>|null} [threads] Body threads
                 */

                /**
                 * Constructs a new Body.
                 * @memberof net.pb.ExchangeEdgesRequest
                 * @classdesc Represents a Body.
                 * @implements IBody
                 * @constructor
                 * @param {net.pb.ExchangeEdgesRequest.IBody=} [properties] Properties to set
                 */
                function Body(properties) {
                    this.threads = [];
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Body threads.
                 * @member {Array.<net.pb.ExchangeEdgesRequest.Body.IThreadEntry>} threads
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @instance
                 */
                Body.prototype.threads = $util.emptyArray;

                /**
                 * Creates a new Body instance using the specified properties.
                 * @function create
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {net.pb.ExchangeEdgesRequest.IBody=} [properties] Properties to set
                 * @returns {net.pb.ExchangeEdgesRequest.Body} Body instance
                 */
                Body.create = function create(properties) {
                    return new Body(properties);
                };

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {net.pb.ExchangeEdgesRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.threads != null && message.threads.length)
                        for (let i = 0; i < message.threads.length; ++i)
                            $root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry.encode(message.threads[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {net.pb.ExchangeEdgesRequest.IBody} message Body message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Body.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.ExchangeEdgesRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.ExchangeEdgesRequest.Body();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                if (!(message.threads && message.threads.length))
                                    message.threads = [];
                                message.threads.push($root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry.decode(reader, reader.uint32()));
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
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.ExchangeEdgesRequest.Body} Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Body.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Body message.
                 * @function verify
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Body.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.threads != null && message.hasOwnProperty("threads")) {
                        if (!Array.isArray(message.threads))
                            return "threads: array expected";
                        for (let i = 0; i < message.threads.length; ++i) {
                            let error = $root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry.verify(message.threads[i]);
                            if (error)
                                return "threads." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.ExchangeEdgesRequest.Body} Body
                 */
                Body.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.ExchangeEdgesRequest.Body)
                        return object;
                    let message = new $root.net.pb.ExchangeEdgesRequest.Body();
                    if (object.threads) {
                        if (!Array.isArray(object.threads))
                            throw TypeError(".net.pb.ExchangeEdgesRequest.Body.threads: array expected");
                        message.threads = [];
                        for (let i = 0; i < object.threads.length; ++i) {
                            if (typeof object.threads[i] !== "object")
                                throw TypeError(".net.pb.ExchangeEdgesRequest.Body.threads: object expected");
                            message.threads[i] = $root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry.fromObject(object.threads[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {net.pb.ExchangeEdgesRequest.Body} message Body
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Body.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.arrays || options.defaults)
                        object.threads = [];
                    if (message.threads && message.threads.length) {
                        object.threads = [];
                        for (let j = 0; j < message.threads.length; ++j)
                            object.threads[j] = $root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry.toObject(message.threads[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Body to JSON.
                 * @function toJSON
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Body.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for Body
                 * @function getTypeUrl
                 * @memberof net.pb.ExchangeEdgesRequest.Body
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                Body.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.ExchangeEdgesRequest.Body";
                };

                Body.ThreadEntry = (function() {

                    /**
                     * Properties of a ThreadEntry.
                     * @memberof net.pb.ExchangeEdgesRequest.Body
                     * @interface IThreadEntry
                     * @property {Uint8Array|null} [threadID] ThreadEntry threadID
                     * @property {number|Long|null} [addressEdge] ThreadEntry addressEdge
                     * @property {number|Long|null} [headsEdge] ThreadEntry headsEdge
                     */

                    /**
                     * Constructs a new ThreadEntry.
                     * @memberof net.pb.ExchangeEdgesRequest.Body
                     * @classdesc Represents a ThreadEntry.
                     * @implements IThreadEntry
                     * @constructor
                     * @param {net.pb.ExchangeEdgesRequest.Body.IThreadEntry=} [properties] Properties to set
                     */
                    function ThreadEntry(properties) {
                        if (properties)
                            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * ThreadEntry threadID.
                     * @member {Uint8Array} threadID
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @instance
                     */
                    ThreadEntry.prototype.threadID = $util.newBuffer([]);

                    /**
                     * ThreadEntry addressEdge.
                     * @member {number|Long} addressEdge
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @instance
                     */
                    ThreadEntry.prototype.addressEdge = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * ThreadEntry headsEdge.
                     * @member {number|Long} headsEdge
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @instance
                     */
                    ThreadEntry.prototype.headsEdge = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                    /**
                     * Creates a new ThreadEntry instance using the specified properties.
                     * @function create
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {net.pb.ExchangeEdgesRequest.Body.IThreadEntry=} [properties] Properties to set
                     * @returns {net.pb.ExchangeEdgesRequest.Body.ThreadEntry} ThreadEntry instance
                     */
                    ThreadEntry.create = function create(properties) {
                        return new ThreadEntry(properties);
                    };

                    /**
                     * Encodes the specified ThreadEntry message. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.ThreadEntry.verify|verify} messages.
                     * @function encode
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {net.pb.ExchangeEdgesRequest.Body.IThreadEntry} message ThreadEntry message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ThreadEntry.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.threadID != null && Object.hasOwnProperty.call(message, "threadID"))
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.threadID);
                        if (message.addressEdge != null && Object.hasOwnProperty.call(message, "addressEdge"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.addressEdge);
                        if (message.headsEdge != null && Object.hasOwnProperty.call(message, "headsEdge"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.headsEdge);
                        return writer;
                    };

                    /**
                     * Encodes the specified ThreadEntry message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.ThreadEntry.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {net.pb.ExchangeEdgesRequest.Body.IThreadEntry} message ThreadEntry message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    ThreadEntry.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a ThreadEntry message from the specified reader or buffer.
                     * @function decode
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {net.pb.ExchangeEdgesRequest.Body.ThreadEntry} ThreadEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ThreadEntry.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry();
                        while (reader.pos < end) {
                            let tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1: {
                                    message.threadID = reader.bytes();
                                    break;
                                }
                            case 2: {
                                    message.addressEdge = reader.uint64();
                                    break;
                                }
                            case 3: {
                                    message.headsEdge = reader.uint64();
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
                     * Decodes a ThreadEntry message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {net.pb.ExchangeEdgesRequest.Body.ThreadEntry} ThreadEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    ThreadEntry.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a ThreadEntry message.
                     * @function verify
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    ThreadEntry.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.threadID != null && message.hasOwnProperty("threadID"))
                            if (!(message.threadID && typeof message.threadID.length === "number" || $util.isString(message.threadID)))
                                return "threadID: buffer expected";
                        if (message.addressEdge != null && message.hasOwnProperty("addressEdge"))
                            if (!$util.isInteger(message.addressEdge) && !(message.addressEdge && $util.isInteger(message.addressEdge.low) && $util.isInteger(message.addressEdge.high)))
                                return "addressEdge: integer|Long expected";
                        if (message.headsEdge != null && message.hasOwnProperty("headsEdge"))
                            if (!$util.isInteger(message.headsEdge) && !(message.headsEdge && $util.isInteger(message.headsEdge.low) && $util.isInteger(message.headsEdge.high)))
                                return "headsEdge: integer|Long expected";
                        return null;
                    };

                    /**
                     * Creates a ThreadEntry message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {net.pb.ExchangeEdgesRequest.Body.ThreadEntry} ThreadEntry
                     */
                    ThreadEntry.fromObject = function fromObject(object) {
                        if (object instanceof $root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry)
                            return object;
                        let message = new $root.net.pb.ExchangeEdgesRequest.Body.ThreadEntry();
                        if (object.threadID != null)
                            if (typeof object.threadID === "string")
                                $util.base64.decode(object.threadID, message.threadID = $util.newBuffer($util.base64.length(object.threadID)), 0);
                            else if (object.threadID.length >= 0)
                                message.threadID = object.threadID;
                        if (object.addressEdge != null)
                            if ($util.Long)
                                (message.addressEdge = $util.Long.fromValue(object.addressEdge)).unsigned = true;
                            else if (typeof object.addressEdge === "string")
                                message.addressEdge = parseInt(object.addressEdge, 10);
                            else if (typeof object.addressEdge === "number")
                                message.addressEdge = object.addressEdge;
                            else if (typeof object.addressEdge === "object")
                                message.addressEdge = new $util.LongBits(object.addressEdge.low >>> 0, object.addressEdge.high >>> 0).toNumber(true);
                        if (object.headsEdge != null)
                            if ($util.Long)
                                (message.headsEdge = $util.Long.fromValue(object.headsEdge)).unsigned = true;
                            else if (typeof object.headsEdge === "string")
                                message.headsEdge = parseInt(object.headsEdge, 10);
                            else if (typeof object.headsEdge === "number")
                                message.headsEdge = object.headsEdge;
                            else if (typeof object.headsEdge === "object")
                                message.headsEdge = new $util.LongBits(object.headsEdge.low >>> 0, object.headsEdge.high >>> 0).toNumber(true);
                        return message;
                    };

                    /**
                     * Creates a plain object from a ThreadEntry message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {net.pb.ExchangeEdgesRequest.Body.ThreadEntry} message ThreadEntry
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    ThreadEntry.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        let object = {};
                        if (options.defaults) {
                            if (options.bytes === String)
                                object.threadID = "";
                            else {
                                object.threadID = [];
                                if (options.bytes !== Array)
                                    object.threadID = $util.newBuffer(object.threadID);
                            }
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.addressEdge = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.addressEdge = options.longs === String ? "0" : 0;
                            if ($util.Long) {
                                let long = new $util.Long(0, 0, true);
                                object.headsEdge = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                            } else
                                object.headsEdge = options.longs === String ? "0" : 0;
                        }
                        if (message.threadID != null && message.hasOwnProperty("threadID"))
                            object.threadID = options.bytes === String ? $util.base64.encode(message.threadID, 0, message.threadID.length) : options.bytes === Array ? Array.prototype.slice.call(message.threadID) : message.threadID;
                        if (message.addressEdge != null && message.hasOwnProperty("addressEdge"))
                            if (typeof message.addressEdge === "number")
                                object.addressEdge = options.longs === String ? String(message.addressEdge) : message.addressEdge;
                            else
                                object.addressEdge = options.longs === String ? $util.Long.prototype.toString.call(message.addressEdge) : options.longs === Number ? new $util.LongBits(message.addressEdge.low >>> 0, message.addressEdge.high >>> 0).toNumber(true) : message.addressEdge;
                        if (message.headsEdge != null && message.hasOwnProperty("headsEdge"))
                            if (typeof message.headsEdge === "number")
                                object.headsEdge = options.longs === String ? String(message.headsEdge) : message.headsEdge;
                            else
                                object.headsEdge = options.longs === String ? $util.Long.prototype.toString.call(message.headsEdge) : options.longs === Number ? new $util.LongBits(message.headsEdge.low >>> 0, message.headsEdge.high >>> 0).toNumber(true) : message.headsEdge;
                        return object;
                    };

                    /**
                     * Converts this ThreadEntry to JSON.
                     * @function toJSON
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    ThreadEntry.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    /**
                     * Gets the default type url for ThreadEntry
                     * @function getTypeUrl
                     * @memberof net.pb.ExchangeEdgesRequest.Body.ThreadEntry
                     * @static
                     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns {string} The default type url
                     */
                    ThreadEntry.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                        if (typeUrlPrefix === undefined) {
                            typeUrlPrefix = "type.googleapis.com";
                        }
                        return typeUrlPrefix + "/net.pb.ExchangeEdgesRequest.Body.ThreadEntry";
                    };

                    return ThreadEntry;
                })();

                return Body;
            })();

            return ExchangeEdgesRequest;
        })();

        pb.ExchangeEdgesReply = (function() {

            /**
             * Properties of an ExchangeEdgesReply.
             * @memberof net.pb
             * @interface IExchangeEdgesReply
             * @property {Array.<net.pb.ExchangeEdgesReply.IThreadEdges>|null} [edges] ExchangeEdgesReply edges
             */

            /**
             * Constructs a new ExchangeEdgesReply.
             * @memberof net.pb
             * @classdesc Represents an ExchangeEdgesReply.
             * @implements IExchangeEdgesReply
             * @constructor
             * @param {net.pb.IExchangeEdgesReply=} [properties] Properties to set
             */
            function ExchangeEdgesReply(properties) {
                this.edges = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ExchangeEdgesReply edges.
             * @member {Array.<net.pb.ExchangeEdgesReply.IThreadEdges>} edges
             * @memberof net.pb.ExchangeEdgesReply
             * @instance
             */
            ExchangeEdgesReply.prototype.edges = $util.emptyArray;

            /**
             * Creates a new ExchangeEdgesReply instance using the specified properties.
             * @function create
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {net.pb.IExchangeEdgesReply=} [properties] Properties to set
             * @returns {net.pb.ExchangeEdgesReply} ExchangeEdgesReply instance
             */
            ExchangeEdgesReply.create = function create(properties) {
                return new ExchangeEdgesReply(properties);
            };

            /**
             * Encodes the specified ExchangeEdgesReply message. Does not implicitly {@link net.pb.ExchangeEdgesReply.verify|verify} messages.
             * @function encode
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {net.pb.IExchangeEdgesReply} message ExchangeEdgesReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExchangeEdgesReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.edges != null && message.edges.length)
                    for (let i = 0; i < message.edges.length; ++i)
                        $root.net.pb.ExchangeEdgesReply.ThreadEdges.encode(message.edges[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ExchangeEdgesReply message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {net.pb.IExchangeEdgesReply} message ExchangeEdgesReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ExchangeEdgesReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ExchangeEdgesReply message from the specified reader or buffer.
             * @function decode
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {net.pb.ExchangeEdgesReply} ExchangeEdgesReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExchangeEdgesReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.ExchangeEdgesReply();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.edges && message.edges.length))
                                message.edges = [];
                            message.edges.push($root.net.pb.ExchangeEdgesReply.ThreadEdges.decode(reader, reader.uint32()));
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
             * Decodes an ExchangeEdgesReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {net.pb.ExchangeEdgesReply} ExchangeEdgesReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ExchangeEdgesReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ExchangeEdgesReply message.
             * @function verify
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ExchangeEdgesReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.edges != null && message.hasOwnProperty("edges")) {
                    if (!Array.isArray(message.edges))
                        return "edges: array expected";
                    for (let i = 0; i < message.edges.length; ++i) {
                        let error = $root.net.pb.ExchangeEdgesReply.ThreadEdges.verify(message.edges[i]);
                        if (error)
                            return "edges." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an ExchangeEdgesReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {net.pb.ExchangeEdgesReply} ExchangeEdgesReply
             */
            ExchangeEdgesReply.fromObject = function fromObject(object) {
                if (object instanceof $root.net.pb.ExchangeEdgesReply)
                    return object;
                let message = new $root.net.pb.ExchangeEdgesReply();
                if (object.edges) {
                    if (!Array.isArray(object.edges))
                        throw TypeError(".net.pb.ExchangeEdgesReply.edges: array expected");
                    message.edges = [];
                    for (let i = 0; i < object.edges.length; ++i) {
                        if (typeof object.edges[i] !== "object")
                            throw TypeError(".net.pb.ExchangeEdgesReply.edges: object expected");
                        message.edges[i] = $root.net.pb.ExchangeEdgesReply.ThreadEdges.fromObject(object.edges[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an ExchangeEdgesReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {net.pb.ExchangeEdgesReply} message ExchangeEdgesReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ExchangeEdgesReply.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.edges = [];
                if (message.edges && message.edges.length) {
                    object.edges = [];
                    for (let j = 0; j < message.edges.length; ++j)
                        object.edges[j] = $root.net.pb.ExchangeEdgesReply.ThreadEdges.toObject(message.edges[j], options);
                }
                return object;
            };

            /**
             * Converts this ExchangeEdgesReply to JSON.
             * @function toJSON
             * @memberof net.pb.ExchangeEdgesReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ExchangeEdgesReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ExchangeEdgesReply
             * @function getTypeUrl
             * @memberof net.pb.ExchangeEdgesReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ExchangeEdgesReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/net.pb.ExchangeEdgesReply";
            };

            ExchangeEdgesReply.ThreadEdges = (function() {

                /**
                 * Properties of a ThreadEdges.
                 * @memberof net.pb.ExchangeEdgesReply
                 * @interface IThreadEdges
                 * @property {Uint8Array|null} [threadID] ThreadEdges threadID
                 * @property {boolean|null} [exists] ThreadEdges exists
                 * @property {number|Long|null} [addressEdge] ThreadEdges addressEdge
                 * @property {number|Long|null} [headsEdge] ThreadEdges headsEdge
                 */

                /**
                 * Constructs a new ThreadEdges.
                 * @memberof net.pb.ExchangeEdgesReply
                 * @classdesc Represents a ThreadEdges.
                 * @implements IThreadEdges
                 * @constructor
                 * @param {net.pb.ExchangeEdgesReply.IThreadEdges=} [properties] Properties to set
                 */
                function ThreadEdges(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ThreadEdges threadID.
                 * @member {Uint8Array} threadID
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @instance
                 */
                ThreadEdges.prototype.threadID = $util.newBuffer([]);

                /**
                 * ThreadEdges exists.
                 * @member {boolean} exists
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @instance
                 */
                ThreadEdges.prototype.exists = false;

                /**
                 * ThreadEdges addressEdge.
                 * @member {number|Long} addressEdge
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @instance
                 */
                ThreadEdges.prototype.addressEdge = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * ThreadEdges headsEdge.
                 * @member {number|Long} headsEdge
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @instance
                 */
                ThreadEdges.prototype.headsEdge = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * Creates a new ThreadEdges instance using the specified properties.
                 * @function create
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {net.pb.ExchangeEdgesReply.IThreadEdges=} [properties] Properties to set
                 * @returns {net.pb.ExchangeEdgesReply.ThreadEdges} ThreadEdges instance
                 */
                ThreadEdges.create = function create(properties) {
                    return new ThreadEdges(properties);
                };

                /**
                 * Encodes the specified ThreadEdges message. Does not implicitly {@link net.pb.ExchangeEdgesReply.ThreadEdges.verify|verify} messages.
                 * @function encode
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {net.pb.ExchangeEdgesReply.IThreadEdges} message ThreadEdges message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ThreadEdges.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.threadID != null && Object.hasOwnProperty.call(message, "threadID"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.threadID);
                    if (message.exists != null && Object.hasOwnProperty.call(message, "exists"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.exists);
                    if (message.addressEdge != null && Object.hasOwnProperty.call(message, "addressEdge"))
                        writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.addressEdge);
                    if (message.headsEdge != null && Object.hasOwnProperty.call(message, "headsEdge"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.headsEdge);
                    return writer;
                };

                /**
                 * Encodes the specified ThreadEdges message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesReply.ThreadEdges.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {net.pb.ExchangeEdgesReply.IThreadEdges} message ThreadEdges message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ThreadEdges.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ThreadEdges message from the specified reader or buffer.
                 * @function decode
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {net.pb.ExchangeEdgesReply.ThreadEdges} ThreadEdges
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ThreadEdges.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.net.pb.ExchangeEdgesReply.ThreadEdges();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1: {
                                message.threadID = reader.bytes();
                                break;
                            }
                        case 2: {
                                message.exists = reader.bool();
                                break;
                            }
                        case 3: {
                                message.addressEdge = reader.uint64();
                                break;
                            }
                        case 4: {
                                message.headsEdge = reader.uint64();
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
                 * Decodes a ThreadEdges message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {net.pb.ExchangeEdgesReply.ThreadEdges} ThreadEdges
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ThreadEdges.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ThreadEdges message.
                 * @function verify
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ThreadEdges.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        if (!(message.threadID && typeof message.threadID.length === "number" || $util.isString(message.threadID)))
                            return "threadID: buffer expected";
                    if (message.exists != null && message.hasOwnProperty("exists"))
                        if (typeof message.exists !== "boolean")
                            return "exists: boolean expected";
                    if (message.addressEdge != null && message.hasOwnProperty("addressEdge"))
                        if (!$util.isInteger(message.addressEdge) && !(message.addressEdge && $util.isInteger(message.addressEdge.low) && $util.isInteger(message.addressEdge.high)))
                            return "addressEdge: integer|Long expected";
                    if (message.headsEdge != null && message.hasOwnProperty("headsEdge"))
                        if (!$util.isInteger(message.headsEdge) && !(message.headsEdge && $util.isInteger(message.headsEdge.low) && $util.isInteger(message.headsEdge.high)))
                            return "headsEdge: integer|Long expected";
                    return null;
                };

                /**
                 * Creates a ThreadEdges message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {net.pb.ExchangeEdgesReply.ThreadEdges} ThreadEdges
                 */
                ThreadEdges.fromObject = function fromObject(object) {
                    if (object instanceof $root.net.pb.ExchangeEdgesReply.ThreadEdges)
                        return object;
                    let message = new $root.net.pb.ExchangeEdgesReply.ThreadEdges();
                    if (object.threadID != null)
                        if (typeof object.threadID === "string")
                            $util.base64.decode(object.threadID, message.threadID = $util.newBuffer($util.base64.length(object.threadID)), 0);
                        else if (object.threadID.length >= 0)
                            message.threadID = object.threadID;
                    if (object.exists != null)
                        message.exists = Boolean(object.exists);
                    if (object.addressEdge != null)
                        if ($util.Long)
                            (message.addressEdge = $util.Long.fromValue(object.addressEdge)).unsigned = true;
                        else if (typeof object.addressEdge === "string")
                            message.addressEdge = parseInt(object.addressEdge, 10);
                        else if (typeof object.addressEdge === "number")
                            message.addressEdge = object.addressEdge;
                        else if (typeof object.addressEdge === "object")
                            message.addressEdge = new $util.LongBits(object.addressEdge.low >>> 0, object.addressEdge.high >>> 0).toNumber(true);
                    if (object.headsEdge != null)
                        if ($util.Long)
                            (message.headsEdge = $util.Long.fromValue(object.headsEdge)).unsigned = true;
                        else if (typeof object.headsEdge === "string")
                            message.headsEdge = parseInt(object.headsEdge, 10);
                        else if (typeof object.headsEdge === "number")
                            message.headsEdge = object.headsEdge;
                        else if (typeof object.headsEdge === "object")
                            message.headsEdge = new $util.LongBits(object.headsEdge.low >>> 0, object.headsEdge.high >>> 0).toNumber(true);
                    return message;
                };

                /**
                 * Creates a plain object from a ThreadEdges message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {net.pb.ExchangeEdgesReply.ThreadEdges} message ThreadEdges
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ThreadEdges.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        if (options.bytes === String)
                            object.threadID = "";
                        else {
                            object.threadID = [];
                            if (options.bytes !== Array)
                                object.threadID = $util.newBuffer(object.threadID);
                        }
                        object.exists = false;
                        if ($util.Long) {
                            let long = new $util.Long(0, 0, true);
                            object.addressEdge = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.addressEdge = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            let long = new $util.Long(0, 0, true);
                            object.headsEdge = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.headsEdge = options.longs === String ? "0" : 0;
                    }
                    if (message.threadID != null && message.hasOwnProperty("threadID"))
                        object.threadID = options.bytes === String ? $util.base64.encode(message.threadID, 0, message.threadID.length) : options.bytes === Array ? Array.prototype.slice.call(message.threadID) : message.threadID;
                    if (message.exists != null && message.hasOwnProperty("exists"))
                        object.exists = message.exists;
                    if (message.addressEdge != null && message.hasOwnProperty("addressEdge"))
                        if (typeof message.addressEdge === "number")
                            object.addressEdge = options.longs === String ? String(message.addressEdge) : message.addressEdge;
                        else
                            object.addressEdge = options.longs === String ? $util.Long.prototype.toString.call(message.addressEdge) : options.longs === Number ? new $util.LongBits(message.addressEdge.low >>> 0, message.addressEdge.high >>> 0).toNumber(true) : message.addressEdge;
                    if (message.headsEdge != null && message.hasOwnProperty("headsEdge"))
                        if (typeof message.headsEdge === "number")
                            object.headsEdge = options.longs === String ? String(message.headsEdge) : message.headsEdge;
                        else
                            object.headsEdge = options.longs === String ? $util.Long.prototype.toString.call(message.headsEdge) : options.longs === Number ? new $util.LongBits(message.headsEdge.low >>> 0, message.headsEdge.high >>> 0).toNumber(true) : message.headsEdge;
                    return object;
                };

                /**
                 * Converts this ThreadEdges to JSON.
                 * @function toJSON
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ThreadEdges.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for ThreadEdges
                 * @function getTypeUrl
                 * @memberof net.pb.ExchangeEdgesReply.ThreadEdges
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                ThreadEdges.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/net.pb.ExchangeEdgesReply.ThreadEdges";
                };

                return ThreadEdges;
            })();

            return ExchangeEdgesReply;
        })();

        pb.Service = (function() {

            /**
             * Constructs a new Service service.
             * @memberof net.pb
             * @classdesc Represents a Service
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function Service(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }

            (Service.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Service;

            /**
             * Creates new Service service using the specified rpc implementation.
             * @function create
             * @memberof net.pb.Service
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {Service} RPC service. Useful where requests and/or responses are streamed.
             */
            Service.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };

            /**
             * Callback as used by {@link net.pb.Service#getLogs}.
             * @memberof net.pb.Service
             * @typedef GetLogsCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {net.pb.GetLogsReply} [response] GetLogsReply
             */

            /**
             * Calls GetLogs.
             * @function getLogs
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IGetLogsRequest} request GetLogsRequest message or plain object
             * @param {net.pb.Service.GetLogsCallback} callback Node-style callback called with the error, if any, and GetLogsReply
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(Service.prototype.getLogs = function getLogs(request, callback) {
                return this.rpcCall(getLogs, $root.net.pb.GetLogsRequest, $root.net.pb.GetLogsReply, request, callback);
            }, "name", { value: "GetLogs" });

            /**
             * Calls GetLogs.
             * @function getLogs
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IGetLogsRequest} request GetLogsRequest message or plain object
             * @returns {Promise<net.pb.GetLogsReply>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link net.pb.Service#pushLog}.
             * @memberof net.pb.Service
             * @typedef PushLogCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {net.pb.PushLogReply} [response] PushLogReply
             */

            /**
             * Calls PushLog.
             * @function pushLog
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IPushLogRequest} request PushLogRequest message or plain object
             * @param {net.pb.Service.PushLogCallback} callback Node-style callback called with the error, if any, and PushLogReply
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(Service.prototype.pushLog = function pushLog(request, callback) {
                return this.rpcCall(pushLog, $root.net.pb.PushLogRequest, $root.net.pb.PushLogReply, request, callback);
            }, "name", { value: "PushLog" });

            /**
             * Calls PushLog.
             * @function pushLog
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IPushLogRequest} request PushLogRequest message or plain object
             * @returns {Promise<net.pb.PushLogReply>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link net.pb.Service#getRecords}.
             * @memberof net.pb.Service
             * @typedef GetRecordsCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {net.pb.GetRecordsReply} [response] GetRecordsReply
             */

            /**
             * Calls GetRecords.
             * @function getRecords
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IGetRecordsRequest} request GetRecordsRequest message or plain object
             * @param {net.pb.Service.GetRecordsCallback} callback Node-style callback called with the error, if any, and GetRecordsReply
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(Service.prototype.getRecords = function getRecords(request, callback) {
                return this.rpcCall(getRecords, $root.net.pb.GetRecordsRequest, $root.net.pb.GetRecordsReply, request, callback);
            }, "name", { value: "GetRecords" });

            /**
             * Calls GetRecords.
             * @function getRecords
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IGetRecordsRequest} request GetRecordsRequest message or plain object
             * @returns {Promise<net.pb.GetRecordsReply>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link net.pb.Service#pushRecord}.
             * @memberof net.pb.Service
             * @typedef PushRecordCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {net.pb.PushRecordReply} [response] PushRecordReply
             */

            /**
             * Calls PushRecord.
             * @function pushRecord
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IPushRecordRequest} request PushRecordRequest message or plain object
             * @param {net.pb.Service.PushRecordCallback} callback Node-style callback called with the error, if any, and PushRecordReply
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(Service.prototype.pushRecord = function pushRecord(request, callback) {
                return this.rpcCall(pushRecord, $root.net.pb.PushRecordRequest, $root.net.pb.PushRecordReply, request, callback);
            }, "name", { value: "PushRecord" });

            /**
             * Calls PushRecord.
             * @function pushRecord
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IPushRecordRequest} request PushRecordRequest message or plain object
             * @returns {Promise<net.pb.PushRecordReply>} Promise
             * @variation 2
             */

            /**
             * Callback as used by {@link net.pb.Service#exchangeEdges}.
             * @memberof net.pb.Service
             * @typedef ExchangeEdgesCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {net.pb.ExchangeEdgesReply} [response] ExchangeEdgesReply
             */

            /**
             * Calls ExchangeEdges.
             * @function exchangeEdges
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IExchangeEdgesRequest} request ExchangeEdgesRequest message or plain object
             * @param {net.pb.Service.ExchangeEdgesCallback} callback Node-style callback called with the error, if any, and ExchangeEdgesReply
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(Service.prototype.exchangeEdges = function exchangeEdges(request, callback) {
                return this.rpcCall(exchangeEdges, $root.net.pb.ExchangeEdgesRequest, $root.net.pb.ExchangeEdgesReply, request, callback);
            }, "name", { value: "ExchangeEdges" });

            /**
             * Calls ExchangeEdges.
             * @function exchangeEdges
             * @memberof net.pb.Service
             * @instance
             * @param {net.pb.IExchangeEdgesRequest} request ExchangeEdgesRequest message or plain object
             * @returns {Promise<net.pb.ExchangeEdgesReply>} Promise
             * @variation 2
             */

            return Service;
        })();

        return pb;
    })();

    return net;
})();

export { $root as default };
