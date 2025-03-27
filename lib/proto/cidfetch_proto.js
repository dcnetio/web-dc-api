/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const cidfetch = $root.cidfetch = (() => {

    /**
     * Namespace cidfetch.
     * @exports cidfetch
     * @namespace
     */
    const cidfetch = {};

    cidfetch.pb = (function() {

        /**
         * Namespace pb.
         * @memberof cidfetch
         * @namespace
         */
        const pb = {};

        pb.InitRequset = (function() {

            /**
             * Properties of an InitRequset.
             * @memberof cidfetch.pb
             * @interface IInitRequset
             */

            /**
             * Constructs a new InitRequset.
             * @memberof cidfetch.pb
             * @classdesc Represents an InitRequset.
             * @implements IInitRequset
             * @constructor
             * @param {cidfetch.pb.IInitRequset=} [properties] Properties to set
             */
            function InitRequset(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new InitRequset instance using the specified properties.
             * @function create
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {cidfetch.pb.IInitRequset=} [properties] Properties to set
             * @returns {cidfetch.pb.InitRequset} InitRequset instance
             */
            InitRequset.create = function create(properties) {
                return new InitRequset(properties);
            };

            /**
             * Encodes the specified InitRequset message. Does not implicitly {@link cidfetch.pb.InitRequset.verify|verify} messages.
             * @function encode
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {cidfetch.pb.IInitRequset} message InitRequset message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InitRequset.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified InitRequset message, length delimited. Does not implicitly {@link cidfetch.pb.InitRequset.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {cidfetch.pb.IInitRequset} message InitRequset message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InitRequset.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an InitRequset message from the specified reader or buffer.
             * @function decode
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cidfetch.pb.InitRequset} InitRequset
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InitRequset.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cidfetch.pb.InitRequset();
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
             * Decodes an InitRequset message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cidfetch.pb.InitRequset} InitRequset
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InitRequset.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an InitRequset message.
             * @function verify
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InitRequset.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an InitRequset message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cidfetch.pb.InitRequset} InitRequset
             */
            InitRequset.fromObject = function fromObject(object) {
                if (object instanceof $root.cidfetch.pb.InitRequset)
                    return object;
                return new $root.cidfetch.pb.InitRequset();
            };

            /**
             * Creates a plain object from an InitRequset message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {cidfetch.pb.InitRequset} message InitRequset
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InitRequset.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this InitRequset to JSON.
             * @function toJSON
             * @memberof cidfetch.pb.InitRequset
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InitRequset.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for InitRequset
             * @function getTypeUrl
             * @memberof cidfetch.pb.InitRequset
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            InitRequset.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/cidfetch.pb.InitRequset";
            };

            return InitRequset;
        })();

        pb.InitReply = (function() {

            /**
             * Properties of an InitReply.
             * @memberof cidfetch.pb
             * @interface IInitReply
             * @property {Uint8Array|null} [cid] InitReply cid
             */

            /**
             * Constructs a new InitReply.
             * @memberof cidfetch.pb
             * @classdesc Represents an InitReply.
             * @implements IInitReply
             * @constructor
             * @param {cidfetch.pb.IInitReply=} [properties] Properties to set
             */
            function InitReply(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * InitReply cid.
             * @member {Uint8Array} cid
             * @memberof cidfetch.pb.InitReply
             * @instance
             */
            InitReply.prototype.cid = $util.newBuffer([]);

            /**
             * Creates a new InitReply instance using the specified properties.
             * @function create
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {cidfetch.pb.IInitReply=} [properties] Properties to set
             * @returns {cidfetch.pb.InitReply} InitReply instance
             */
            InitReply.create = function create(properties) {
                return new InitReply(properties);
            };

            /**
             * Encodes the specified InitReply message. Does not implicitly {@link cidfetch.pb.InitReply.verify|verify} messages.
             * @function encode
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {cidfetch.pb.IInitReply} message InitReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InitReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.cid);
                return writer;
            };

            /**
             * Encodes the specified InitReply message, length delimited. Does not implicitly {@link cidfetch.pb.InitReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {cidfetch.pb.IInitReply} message InitReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InitReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an InitReply message from the specified reader or buffer.
             * @function decode
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cidfetch.pb.InitReply} InitReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InitReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cidfetch.pb.InitReply();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cid = reader.bytes();
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
             * Decodes an InitReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cidfetch.pb.InitReply} InitReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InitReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an InitReply message.
             * @function verify
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InitReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cid != null && message.hasOwnProperty("cid"))
                    if (!(message.cid && typeof message.cid.length === "number" || $util.isString(message.cid)))
                        return "cid: buffer expected";
                return null;
            };

            /**
             * Creates an InitReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cidfetch.pb.InitReply} InitReply
             */
            InitReply.fromObject = function fromObject(object) {
                if (object instanceof $root.cidfetch.pb.InitReply)
                    return object;
                let message = new $root.cidfetch.pb.InitReply();
                if (object.cid != null)
                    if (typeof object.cid === "string")
                        $util.base64.decode(object.cid, message.cid = $util.newBuffer($util.base64.length(object.cid)), 0);
                    else if (object.cid.length >= 0)
                        message.cid = object.cid;
                return message;
            };

            /**
             * Creates a plain object from an InitReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {cidfetch.pb.InitReply} message InitReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InitReply.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.cid = "";
                    else {
                        object.cid = [];
                        if (options.bytes !== Array)
                            object.cid = $util.newBuffer(object.cid);
                    }
                if (message.cid != null && message.hasOwnProperty("cid"))
                    object.cid = options.bytes === String ? $util.base64.encode(message.cid, 0, message.cid.length) : options.bytes === Array ? Array.prototype.slice.call(message.cid) : message.cid;
                return object;
            };

            /**
             * Converts this InitReply to JSON.
             * @function toJSON
             * @memberof cidfetch.pb.InitReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InitReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for InitReply
             * @function getTypeUrl
             * @memberof cidfetch.pb.InitReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            InitReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/cidfetch.pb.InitReply";
            };

            return InitReply;
        })();

        pb.FetchRequest = (function() {

            /**
             * Properties of a FetchRequest.
             * @memberof cidfetch.pb
             * @interface IFetchRequest
             * @property {Uint8Array|null} [cid] FetchRequest cid
             */

            /**
             * Constructs a new FetchRequest.
             * @memberof cidfetch.pb
             * @classdesc Represents a FetchRequest.
             * @implements IFetchRequest
             * @constructor
             * @param {cidfetch.pb.IFetchRequest=} [properties] Properties to set
             */
            function FetchRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FetchRequest cid.
             * @member {Uint8Array} cid
             * @memberof cidfetch.pb.FetchRequest
             * @instance
             */
            FetchRequest.prototype.cid = $util.newBuffer([]);

            /**
             * Creates a new FetchRequest instance using the specified properties.
             * @function create
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {cidfetch.pb.IFetchRequest=} [properties] Properties to set
             * @returns {cidfetch.pb.FetchRequest} FetchRequest instance
             */
            FetchRequest.create = function create(properties) {
                return new FetchRequest(properties);
            };

            /**
             * Encodes the specified FetchRequest message. Does not implicitly {@link cidfetch.pb.FetchRequest.verify|verify} messages.
             * @function encode
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {cidfetch.pb.IFetchRequest} message FetchRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FetchRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.cid != null && Object.hasOwnProperty.call(message, "cid"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.cid);
                return writer;
            };

            /**
             * Encodes the specified FetchRequest message, length delimited. Does not implicitly {@link cidfetch.pb.FetchRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {cidfetch.pb.IFetchRequest} message FetchRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FetchRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FetchRequest message from the specified reader or buffer.
             * @function decode
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cidfetch.pb.FetchRequest} FetchRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FetchRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cidfetch.pb.FetchRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.cid = reader.bytes();
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
             * Decodes a FetchRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cidfetch.pb.FetchRequest} FetchRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FetchRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FetchRequest message.
             * @function verify
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FetchRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.cid != null && message.hasOwnProperty("cid"))
                    if (!(message.cid && typeof message.cid.length === "number" || $util.isString(message.cid)))
                        return "cid: buffer expected";
                return null;
            };

            /**
             * Creates a FetchRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cidfetch.pb.FetchRequest} FetchRequest
             */
            FetchRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.cidfetch.pb.FetchRequest)
                    return object;
                let message = new $root.cidfetch.pb.FetchRequest();
                if (object.cid != null)
                    if (typeof object.cid === "string")
                        $util.base64.decode(object.cid, message.cid = $util.newBuffer($util.base64.length(object.cid)), 0);
                    else if (object.cid.length >= 0)
                        message.cid = object.cid;
                return message;
            };

            /**
             * Creates a plain object from a FetchRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {cidfetch.pb.FetchRequest} message FetchRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FetchRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.cid = "";
                    else {
                        object.cid = [];
                        if (options.bytes !== Array)
                            object.cid = $util.newBuffer(object.cid);
                    }
                if (message.cid != null && message.hasOwnProperty("cid"))
                    object.cid = options.bytes === String ? $util.base64.encode(message.cid, 0, message.cid.length) : options.bytes === Array ? Array.prototype.slice.call(message.cid) : message.cid;
                return object;
            };

            /**
             * Converts this FetchRequest to JSON.
             * @function toJSON
             * @memberof cidfetch.pb.FetchRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FetchRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FetchRequest
             * @function getTypeUrl
             * @memberof cidfetch.pb.FetchRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FetchRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/cidfetch.pb.FetchRequest";
            };

            return FetchRequest;
        })();

        pb.FetchReply = (function() {

            /**
             * Properties of a FetchReply.
             * @memberof cidfetch.pb
             * @interface IFetchReply
             * @property {Uint8Array|null} [data] FetchReply data
             */

            /**
             * Constructs a new FetchReply.
             * @memberof cidfetch.pb
             * @classdesc Represents a FetchReply.
             * @implements IFetchReply
             * @constructor
             * @param {cidfetch.pb.IFetchReply=} [properties] Properties to set
             */
            function FetchReply(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * FetchReply data.
             * @member {Uint8Array} data
             * @memberof cidfetch.pb.FetchReply
             * @instance
             */
            FetchReply.prototype.data = $util.newBuffer([]);

            /**
             * Creates a new FetchReply instance using the specified properties.
             * @function create
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {cidfetch.pb.IFetchReply=} [properties] Properties to set
             * @returns {cidfetch.pb.FetchReply} FetchReply instance
             */
            FetchReply.create = function create(properties) {
                return new FetchReply(properties);
            };

            /**
             * Encodes the specified FetchReply message. Does not implicitly {@link cidfetch.pb.FetchReply.verify|verify} messages.
             * @function encode
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {cidfetch.pb.IFetchReply} message FetchReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FetchReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
                return writer;
            };

            /**
             * Encodes the specified FetchReply message, length delimited. Does not implicitly {@link cidfetch.pb.FetchReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {cidfetch.pb.IFetchReply} message FetchReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            FetchReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a FetchReply message from the specified reader or buffer.
             * @function decode
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cidfetch.pb.FetchReply} FetchReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FetchReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cidfetch.pb.FetchReply();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.data = reader.bytes();
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
             * Decodes a FetchReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cidfetch.pb.FetchReply} FetchReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            FetchReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a FetchReply message.
             * @function verify
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            FetchReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                        return "data: buffer expected";
                return null;
            };

            /**
             * Creates a FetchReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cidfetch.pb.FetchReply} FetchReply
             */
            FetchReply.fromObject = function fromObject(object) {
                if (object instanceof $root.cidfetch.pb.FetchReply)
                    return object;
                let message = new $root.cidfetch.pb.FetchReply();
                if (object.data != null)
                    if (typeof object.data === "string")
                        $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                    else if (object.data.length >= 0)
                        message.data = object.data;
                return message;
            };

            /**
             * Creates a plain object from a FetchReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {cidfetch.pb.FetchReply} message FetchReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            FetchReply.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    if (options.bytes === String)
                        object.data = "";
                    else {
                        object.data = [];
                        if (options.bytes !== Array)
                            object.data = $util.newBuffer(object.data);
                    }
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                return object;
            };

            /**
             * Converts this FetchReply to JSON.
             * @function toJSON
             * @memberof cidfetch.pb.FetchReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            FetchReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for FetchReply
             * @function getTypeUrl
             * @memberof cidfetch.pb.FetchReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            FetchReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/cidfetch.pb.FetchReply";
            };

            return FetchReply;
        })();

        pb.ErrorInformRequest = (function() {

            /**
             * Properties of an ErrorInformRequest.
             * @memberof cidfetch.pb
             * @interface IErrorInformRequest
             * @property {string|null} [error] ErrorInformRequest error
             */

            /**
             * Constructs a new ErrorInformRequest.
             * @memberof cidfetch.pb
             * @classdesc Represents an ErrorInformRequest.
             * @implements IErrorInformRequest
             * @constructor
             * @param {cidfetch.pb.IErrorInformRequest=} [properties] Properties to set
             */
            function ErrorInformRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ErrorInformRequest error.
             * @member {string} error
             * @memberof cidfetch.pb.ErrorInformRequest
             * @instance
             */
            ErrorInformRequest.prototype.error = "";

            /**
             * Creates a new ErrorInformRequest instance using the specified properties.
             * @function create
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {cidfetch.pb.IErrorInformRequest=} [properties] Properties to set
             * @returns {cidfetch.pb.ErrorInformRequest} ErrorInformRequest instance
             */
            ErrorInformRequest.create = function create(properties) {
                return new ErrorInformRequest(properties);
            };

            /**
             * Encodes the specified ErrorInformRequest message. Does not implicitly {@link cidfetch.pb.ErrorInformRequest.verify|verify} messages.
             * @function encode
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {cidfetch.pb.IErrorInformRequest} message ErrorInformRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ErrorInformRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.error);
                return writer;
            };

            /**
             * Encodes the specified ErrorInformRequest message, length delimited. Does not implicitly {@link cidfetch.pb.ErrorInformRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {cidfetch.pb.IErrorInformRequest} message ErrorInformRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ErrorInformRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ErrorInformRequest message from the specified reader or buffer.
             * @function decode
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cidfetch.pb.ErrorInformRequest} ErrorInformRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorInformRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cidfetch.pb.ErrorInformRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.error = reader.string();
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
             * Decodes an ErrorInformRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cidfetch.pb.ErrorInformRequest} ErrorInformRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorInformRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ErrorInformRequest message.
             * @function verify
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ErrorInformRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.error != null && message.hasOwnProperty("error"))
                    if (!$util.isString(message.error))
                        return "error: string expected";
                return null;
            };

            /**
             * Creates an ErrorInformRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cidfetch.pb.ErrorInformRequest} ErrorInformRequest
             */
            ErrorInformRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.cidfetch.pb.ErrorInformRequest)
                    return object;
                let message = new $root.cidfetch.pb.ErrorInformRequest();
                if (object.error != null)
                    message.error = String(object.error);
                return message;
            };

            /**
             * Creates a plain object from an ErrorInformRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {cidfetch.pb.ErrorInformRequest} message ErrorInformRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ErrorInformRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.error = "";
                if (message.error != null && message.hasOwnProperty("error"))
                    object.error = message.error;
                return object;
            };

            /**
             * Converts this ErrorInformRequest to JSON.
             * @function toJSON
             * @memberof cidfetch.pb.ErrorInformRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ErrorInformRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ErrorInformRequest
             * @function getTypeUrl
             * @memberof cidfetch.pb.ErrorInformRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ErrorInformRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/cidfetch.pb.ErrorInformRequest";
            };

            return ErrorInformRequest;
        })();

        pb.ErrorInformReply = (function() {

            /**
             * Properties of an ErrorInformReply.
             * @memberof cidfetch.pb
             * @interface IErrorInformReply
             */

            /**
             * Constructs a new ErrorInformReply.
             * @memberof cidfetch.pb
             * @classdesc Represents an ErrorInformReply.
             * @implements IErrorInformReply
             * @constructor
             * @param {cidfetch.pb.IErrorInformReply=} [properties] Properties to set
             */
            function ErrorInformReply(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Creates a new ErrorInformReply instance using the specified properties.
             * @function create
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {cidfetch.pb.IErrorInformReply=} [properties] Properties to set
             * @returns {cidfetch.pb.ErrorInformReply} ErrorInformReply instance
             */
            ErrorInformReply.create = function create(properties) {
                return new ErrorInformReply(properties);
            };

            /**
             * Encodes the specified ErrorInformReply message. Does not implicitly {@link cidfetch.pb.ErrorInformReply.verify|verify} messages.
             * @function encode
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {cidfetch.pb.IErrorInformReply} message ErrorInformReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ErrorInformReply.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                return writer;
            };

            /**
             * Encodes the specified ErrorInformReply message, length delimited. Does not implicitly {@link cidfetch.pb.ErrorInformReply.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {cidfetch.pb.IErrorInformReply} message ErrorInformReply message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ErrorInformReply.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ErrorInformReply message from the specified reader or buffer.
             * @function decode
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cidfetch.pb.ErrorInformReply} ErrorInformReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorInformReply.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.cidfetch.pb.ErrorInformReply();
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
             * Decodes an ErrorInformReply message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cidfetch.pb.ErrorInformReply} ErrorInformReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ErrorInformReply.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an ErrorInformReply message.
             * @function verify
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ErrorInformReply.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                return null;
            };

            /**
             * Creates an ErrorInformReply message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cidfetch.pb.ErrorInformReply} ErrorInformReply
             */
            ErrorInformReply.fromObject = function fromObject(object) {
                if (object instanceof $root.cidfetch.pb.ErrorInformReply)
                    return object;
                return new $root.cidfetch.pb.ErrorInformReply();
            };

            /**
             * Creates a plain object from an ErrorInformReply message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {cidfetch.pb.ErrorInformReply} message ErrorInformReply
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ErrorInformReply.toObject = function toObject() {
                return {};
            };

            /**
             * Converts this ErrorInformReply to JSON.
             * @function toJSON
             * @memberof cidfetch.pb.ErrorInformReply
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ErrorInformReply.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ErrorInformReply
             * @function getTypeUrl
             * @memberof cidfetch.pb.ErrorInformReply
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ErrorInformReply.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/cidfetch.pb.ErrorInformReply";
            };

            return ErrorInformReply;
        })();

        return pb;
    })();

    return cidfetch;
})();

export { $root as default };
