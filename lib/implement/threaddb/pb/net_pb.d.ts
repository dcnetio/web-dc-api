import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace net. */
export namespace net {

    /** Namespace pb. */
    namespace pb {

        /** Properties of a Log. */
        interface ILog {

            /** Log ID */
            ID?: (Uint8Array|null);

            /** Log pubKey */
            pubKey?: (Uint8Array|null);

            /** Log addrs */
            addrs?: (Uint8Array[]|null);

            /** Log head */
            head?: (Uint8Array|null);

            /** Log counter */
            counter?: (number|Long|null);
        }

        /** Represents a Log. */
        class Log implements ILog {

            /**
             * Constructs a new Log.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.ILog);

            /** Log ID. */
            public ID: Uint8Array;

            /** Log pubKey. */
            public pubKey: Uint8Array;

            /** Log addrs. */
            public addrs: Uint8Array[];

            /** Log head. */
            public head: Uint8Array;

            /** Log counter. */
            public counter: (number|Long);

            /**
             * Creates a new Log instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Log instance
             */
            public static create(properties?: net.pb.ILog): net.pb.Log;

            /**
             * Encodes the specified Log message. Does not implicitly {@link net.pb.Log.verify|verify} messages.
             * @param message Log message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.ILog, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Log message, length delimited. Does not implicitly {@link net.pb.Log.verify|verify} messages.
             * @param message Log message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.ILog, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Log message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Log
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.Log;

            /**
             * Decodes a Log message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Log
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.Log;

            /**
             * Verifies a Log message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Log message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Log
             */
            public static fromObject(object: { [k: string]: any }): net.pb.Log;

            /**
             * Creates a plain object from a Log message. Also converts values to other types if specified.
             * @param message Log
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.Log, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Log to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for Log
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace Log {

            /** Properties of a Record. */
            interface IRecord {

                /** Record recordNode */
                recordNode?: (Uint8Array|null);

                /** Record eventNode */
                eventNode?: (Uint8Array|null);

                /** Record headerNode */
                headerNode?: (Uint8Array|null);

                /** Record bodyNode */
                bodyNode?: (Uint8Array|null);
            }

            /** Represents a Record. */
            class Record implements IRecord {

                /**
                 * Constructs a new Record.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.Log.IRecord);

                /** Record recordNode. */
                public recordNode: Uint8Array;

                /** Record eventNode. */
                public eventNode: Uint8Array;

                /** Record headerNode. */
                public headerNode: Uint8Array;

                /** Record bodyNode. */
                public bodyNode: Uint8Array;

                /**
                 * Creates a new Record instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Record instance
                 */
                public static create(properties?: net.pb.Log.IRecord): net.pb.Log.Record;

                /**
                 * Encodes the specified Record message. Does not implicitly {@link net.pb.Log.Record.verify|verify} messages.
                 * @param message Record message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.Log.IRecord, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Record message, length delimited. Does not implicitly {@link net.pb.Log.Record.verify|verify} messages.
                 * @param message Record message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.Log.IRecord, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Record message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Record
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.Log.Record;

                /**
                 * Decodes a Record message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Record
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.Log.Record;

                /**
                 * Verifies a Record message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Record message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Record
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.Log.Record;

                /**
                 * Creates a plain object from a Record message. Also converts values to other types if specified.
                 * @param message Record
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.Log.Record, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Record to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Record
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a GetLogsRequest. */
        interface IGetLogsRequest {

            /** GetLogsRequest body */
            body?: (net.pb.GetLogsRequest.IBody|null);
        }

        /** Represents a GetLogsRequest. */
        class GetLogsRequest implements IGetLogsRequest {

            /**
             * Constructs a new GetLogsRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IGetLogsRequest);

            /** GetLogsRequest body. */
            public body?: (net.pb.GetLogsRequest.IBody|null);

            /**
             * Creates a new GetLogsRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GetLogsRequest instance
             */
            public static create(properties?: net.pb.IGetLogsRequest): net.pb.GetLogsRequest;

            /**
             * Encodes the specified GetLogsRequest message. Does not implicitly {@link net.pb.GetLogsRequest.verify|verify} messages.
             * @param message GetLogsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IGetLogsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetLogsRequest message, length delimited. Does not implicitly {@link net.pb.GetLogsRequest.verify|verify} messages.
             * @param message GetLogsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IGetLogsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetLogsRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetLogsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetLogsRequest;

            /**
             * Decodes a GetLogsRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetLogsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetLogsRequest;

            /**
             * Verifies a GetLogsRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetLogsRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetLogsRequest
             */
            public static fromObject(object: { [k: string]: any }): net.pb.GetLogsRequest;

            /**
             * Creates a plain object from a GetLogsRequest message. Also converts values to other types if specified.
             * @param message GetLogsRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.GetLogsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GetLogsRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GetLogsRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace GetLogsRequest {

            /** Properties of a Body. */
            interface IBody {

                /** Body threadID */
                threadID?: (Uint8Array|null);

                /** Body serviceKey */
                serviceKey?: (Uint8Array|null);
            }

            /** Represents a Body. */
            class Body implements IBody {

                /**
                 * Constructs a new Body.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.GetLogsRequest.IBody);

                /** Body threadID. */
                public threadID: Uint8Array;

                /** Body serviceKey. */
                public serviceKey: Uint8Array;

                /**
                 * Creates a new Body instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Body instance
                 */
                public static create(properties?: net.pb.GetLogsRequest.IBody): net.pb.GetLogsRequest.Body;

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.GetLogsRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.GetLogsRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.GetLogsRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.GetLogsRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetLogsRequest.Body;

                /**
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetLogsRequest.Body;

                /**
                 * Verifies a Body message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Body
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.GetLogsRequest.Body;

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @param message Body
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.GetLogsRequest.Body, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Body to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Body
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a GetLogsReply. */
        interface IGetLogsReply {

            /** GetLogsReply logs */
            logs?: (net.pb.ILog[]|null);
        }

        /** Represents a GetLogsReply. */
        class GetLogsReply implements IGetLogsReply {

            /**
             * Constructs a new GetLogsReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IGetLogsReply);

            /** GetLogsReply logs. */
            public logs: net.pb.ILog[];

            /**
             * Creates a new GetLogsReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GetLogsReply instance
             */
            public static create(properties?: net.pb.IGetLogsReply): net.pb.GetLogsReply;

            /**
             * Encodes the specified GetLogsReply message. Does not implicitly {@link net.pb.GetLogsReply.verify|verify} messages.
             * @param message GetLogsReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IGetLogsReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetLogsReply message, length delimited. Does not implicitly {@link net.pb.GetLogsReply.verify|verify} messages.
             * @param message GetLogsReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IGetLogsReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetLogsReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetLogsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetLogsReply;

            /**
             * Decodes a GetLogsReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetLogsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetLogsReply;

            /**
             * Verifies a GetLogsReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetLogsReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetLogsReply
             */
            public static fromObject(object: { [k: string]: any }): net.pb.GetLogsReply;

            /**
             * Creates a plain object from a GetLogsReply message. Also converts values to other types if specified.
             * @param message GetLogsReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.GetLogsReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GetLogsReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GetLogsReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a PushLogRequest. */
        interface IPushLogRequest {

            /** PushLogRequest body */
            body?: (net.pb.PushLogRequest.IBody|null);
        }

        /** Represents a PushLogRequest. */
        class PushLogRequest implements IPushLogRequest {

            /**
             * Constructs a new PushLogRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IPushLogRequest);

            /** PushLogRequest body. */
            public body?: (net.pb.PushLogRequest.IBody|null);

            /**
             * Creates a new PushLogRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PushLogRequest instance
             */
            public static create(properties?: net.pb.IPushLogRequest): net.pb.PushLogRequest;

            /**
             * Encodes the specified PushLogRequest message. Does not implicitly {@link net.pb.PushLogRequest.verify|verify} messages.
             * @param message PushLogRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IPushLogRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PushLogRequest message, length delimited. Does not implicitly {@link net.pb.PushLogRequest.verify|verify} messages.
             * @param message PushLogRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IPushLogRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PushLogRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PushLogRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.PushLogRequest;

            /**
             * Decodes a PushLogRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PushLogRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.PushLogRequest;

            /**
             * Verifies a PushLogRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PushLogRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PushLogRequest
             */
            public static fromObject(object: { [k: string]: any }): net.pb.PushLogRequest;

            /**
             * Creates a plain object from a PushLogRequest message. Also converts values to other types if specified.
             * @param message PushLogRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.PushLogRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PushLogRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PushLogRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PushLogRequest {

            /** Properties of a Body. */
            interface IBody {

                /** Body threadID */
                threadID?: (Uint8Array|null);

                /** Body serviceKey */
                serviceKey?: (Uint8Array|null);

                /** Body readKey */
                readKey?: (Uint8Array|null);

                /** Body log */
                log?: (net.pb.ILog|null);
            }

            /** Represents a Body. */
            class Body implements IBody {

                /**
                 * Constructs a new Body.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.PushLogRequest.IBody);

                /** Body threadID. */
                public threadID: Uint8Array;

                /** Body serviceKey. */
                public serviceKey: Uint8Array;

                /** Body readKey. */
                public readKey: Uint8Array;

                /** Body log. */
                public log?: (net.pb.ILog|null);

                /**
                 * Creates a new Body instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Body instance
                 */
                public static create(properties?: net.pb.PushLogRequest.IBody): net.pb.PushLogRequest.Body;

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.PushLogRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.PushLogRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.PushLogRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.PushLogRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.PushLogRequest.Body;

                /**
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.PushLogRequest.Body;

                /**
                 * Verifies a Body message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Body
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.PushLogRequest.Body;

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @param message Body
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.PushLogRequest.Body, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Body to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Body
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a PushLogReply. */
        interface IPushLogReply {
        }

        /** Represents a PushLogReply. */
        class PushLogReply implements IPushLogReply {

            /**
             * Constructs a new PushLogReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IPushLogReply);

            /**
             * Creates a new PushLogReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PushLogReply instance
             */
            public static create(properties?: net.pb.IPushLogReply): net.pb.PushLogReply;

            /**
             * Encodes the specified PushLogReply message. Does not implicitly {@link net.pb.PushLogReply.verify|verify} messages.
             * @param message PushLogReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IPushLogReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PushLogReply message, length delimited. Does not implicitly {@link net.pb.PushLogReply.verify|verify} messages.
             * @param message PushLogReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IPushLogReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PushLogReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PushLogReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.PushLogReply;

            /**
             * Decodes a PushLogReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PushLogReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.PushLogReply;

            /**
             * Verifies a PushLogReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PushLogReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PushLogReply
             */
            public static fromObject(object: { [k: string]: any }): net.pb.PushLogReply;

            /**
             * Creates a plain object from a PushLogReply message. Also converts values to other types if specified.
             * @param message PushLogReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.PushLogReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PushLogReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PushLogReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a GetRecordsRequest. */
        interface IGetRecordsRequest {

            /** GetRecordsRequest body */
            body?: (net.pb.GetRecordsRequest.IBody|null);
        }

        /** Represents a GetRecordsRequest. */
        class GetRecordsRequest implements IGetRecordsRequest {

            /**
             * Constructs a new GetRecordsRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IGetRecordsRequest);

            /** GetRecordsRequest body. */
            public body?: (net.pb.GetRecordsRequest.IBody|null);

            /**
             * Creates a new GetRecordsRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GetRecordsRequest instance
             */
            public static create(properties?: net.pb.IGetRecordsRequest): net.pb.GetRecordsRequest;

            /**
             * Encodes the specified GetRecordsRequest message. Does not implicitly {@link net.pb.GetRecordsRequest.verify|verify} messages.
             * @param message GetRecordsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IGetRecordsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetRecordsRequest message, length delimited. Does not implicitly {@link net.pb.GetRecordsRequest.verify|verify} messages.
             * @param message GetRecordsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IGetRecordsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetRecordsRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetRecordsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetRecordsRequest;

            /**
             * Decodes a GetRecordsRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetRecordsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetRecordsRequest;

            /**
             * Verifies a GetRecordsRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetRecordsRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetRecordsRequest
             */
            public static fromObject(object: { [k: string]: any }): net.pb.GetRecordsRequest;

            /**
             * Creates a plain object from a GetRecordsRequest message. Also converts values to other types if specified.
             * @param message GetRecordsRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.GetRecordsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GetRecordsRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GetRecordsRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace GetRecordsRequest {

            /** Properties of a Body. */
            interface IBody {

                /** Body threadID */
                threadID?: (Uint8Array|null);

                /** Body serviceKey */
                serviceKey?: (Uint8Array|null);

                /** Body logs */
                logs?: (net.pb.GetRecordsRequest.Body.ILogEntry[]|null);
            }

            /** Represents a Body. */
            class Body implements IBody {

                /**
                 * Constructs a new Body.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.GetRecordsRequest.IBody);

                /** Body threadID. */
                public threadID: Uint8Array;

                /** Body serviceKey. */
                public serviceKey: Uint8Array;

                /** Body logs. */
                public logs: net.pb.GetRecordsRequest.Body.ILogEntry[];

                /**
                 * Creates a new Body instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Body instance
                 */
                public static create(properties?: net.pb.GetRecordsRequest.IBody): net.pb.GetRecordsRequest.Body;

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.GetRecordsRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.GetRecordsRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.GetRecordsRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.GetRecordsRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetRecordsRequest.Body;

                /**
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetRecordsRequest.Body;

                /**
                 * Verifies a Body message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Body
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.GetRecordsRequest.Body;

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @param message Body
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.GetRecordsRequest.Body, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Body to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Body
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Body {

                /** Properties of a LogEntry. */
                interface ILogEntry {

                    /** LogEntry logID */
                    logID?: (Uint8Array|null);

                    /** LogEntry offset */
                    offset?: (Uint8Array|null);

                    /** LogEntry limit */
                    limit?: (number|null);

                    /** LogEntry counter */
                    counter?: (number|Long|null);
                }

                /** Represents a LogEntry. */
                class LogEntry implements ILogEntry {

                    /**
                     * Constructs a new LogEntry.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: net.pb.GetRecordsRequest.Body.ILogEntry);

                    /** LogEntry logID. */
                    public logID: Uint8Array;

                    /** LogEntry offset. */
                    public offset: Uint8Array;

                    /** LogEntry limit. */
                    public limit: number;

                    /** LogEntry counter. */
                    public counter: (number|Long);

                    /**
                     * Creates a new LogEntry instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns LogEntry instance
                     */
                    public static create(properties?: net.pb.GetRecordsRequest.Body.ILogEntry): net.pb.GetRecordsRequest.Body.LogEntry;

                    /**
                     * Encodes the specified LogEntry message. Does not implicitly {@link net.pb.GetRecordsRequest.Body.LogEntry.verify|verify} messages.
                     * @param message LogEntry message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: net.pb.GetRecordsRequest.Body.ILogEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified LogEntry message, length delimited. Does not implicitly {@link net.pb.GetRecordsRequest.Body.LogEntry.verify|verify} messages.
                     * @param message LogEntry message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: net.pb.GetRecordsRequest.Body.ILogEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a LogEntry message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns LogEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetRecordsRequest.Body.LogEntry;

                    /**
                     * Decodes a LogEntry message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns LogEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetRecordsRequest.Body.LogEntry;

                    /**
                     * Verifies a LogEntry message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a LogEntry message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns LogEntry
                     */
                    public static fromObject(object: { [k: string]: any }): net.pb.GetRecordsRequest.Body.LogEntry;

                    /**
                     * Creates a plain object from a LogEntry message. Also converts values to other types if specified.
                     * @param message LogEntry
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: net.pb.GetRecordsRequest.Body.LogEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this LogEntry to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for LogEntry
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }

        /** Properties of a GetRecordsReply. */
        interface IGetRecordsReply {

            /** GetRecordsReply logs */
            logs?: (net.pb.GetRecordsReply.ILogEntry[]|null);
        }

        /** Represents a GetRecordsReply. */
        class GetRecordsReply implements IGetRecordsReply {

            /**
             * Constructs a new GetRecordsReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IGetRecordsReply);

            /** GetRecordsReply logs. */
            public logs: net.pb.GetRecordsReply.ILogEntry[];

            /**
             * Creates a new GetRecordsReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GetRecordsReply instance
             */
            public static create(properties?: net.pb.IGetRecordsReply): net.pb.GetRecordsReply;

            /**
             * Encodes the specified GetRecordsReply message. Does not implicitly {@link net.pb.GetRecordsReply.verify|verify} messages.
             * @param message GetRecordsReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IGetRecordsReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetRecordsReply message, length delimited. Does not implicitly {@link net.pb.GetRecordsReply.verify|verify} messages.
             * @param message GetRecordsReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IGetRecordsReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetRecordsReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetRecordsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetRecordsReply;

            /**
             * Decodes a GetRecordsReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetRecordsReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetRecordsReply;

            /**
             * Verifies a GetRecordsReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetRecordsReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetRecordsReply
             */
            public static fromObject(object: { [k: string]: any }): net.pb.GetRecordsReply;

            /**
             * Creates a plain object from a GetRecordsReply message. Also converts values to other types if specified.
             * @param message GetRecordsReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.GetRecordsReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GetRecordsReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for GetRecordsReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace GetRecordsReply {

            /** Properties of a LogEntry. */
            interface ILogEntry {

                /** LogEntry logID */
                logID?: (Uint8Array|null);

                /** LogEntry records */
                records?: (net.pb.Log.IRecord[]|null);

                /** LogEntry log */
                log?: (net.pb.ILog|null);
            }

            /** Represents a LogEntry. */
            class LogEntry implements ILogEntry {

                /**
                 * Constructs a new LogEntry.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.GetRecordsReply.ILogEntry);

                /** LogEntry logID. */
                public logID: Uint8Array;

                /** LogEntry records. */
                public records: net.pb.Log.IRecord[];

                /** LogEntry log. */
                public log?: (net.pb.ILog|null);

                /**
                 * Creates a new LogEntry instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns LogEntry instance
                 */
                public static create(properties?: net.pb.GetRecordsReply.ILogEntry): net.pb.GetRecordsReply.LogEntry;

                /**
                 * Encodes the specified LogEntry message. Does not implicitly {@link net.pb.GetRecordsReply.LogEntry.verify|verify} messages.
                 * @param message LogEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.GetRecordsReply.ILogEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified LogEntry message, length delimited. Does not implicitly {@link net.pb.GetRecordsReply.LogEntry.verify|verify} messages.
                 * @param message LogEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.GetRecordsReply.ILogEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a LogEntry message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns LogEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.GetRecordsReply.LogEntry;

                /**
                 * Decodes a LogEntry message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns LogEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.GetRecordsReply.LogEntry;

                /**
                 * Verifies a LogEntry message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a LogEntry message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns LogEntry
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.GetRecordsReply.LogEntry;

                /**
                 * Creates a plain object from a LogEntry message. Also converts values to other types if specified.
                 * @param message LogEntry
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.GetRecordsReply.LogEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this LogEntry to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for LogEntry
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a PushRecordRequest. */
        interface IPushRecordRequest {

            /** PushRecordRequest body */
            body?: (net.pb.PushRecordRequest.IBody|null);

            /** PushRecordRequest counter */
            counter?: (number|Long|null);
        }

        /** Represents a PushRecordRequest. */
        class PushRecordRequest implements IPushRecordRequest {

            /**
             * Constructs a new PushRecordRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IPushRecordRequest);

            /** PushRecordRequest body. */
            public body?: (net.pb.PushRecordRequest.IBody|null);

            /** PushRecordRequest counter. */
            public counter: (number|Long);

            /**
             * Creates a new PushRecordRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PushRecordRequest instance
             */
            public static create(properties?: net.pb.IPushRecordRequest): net.pb.PushRecordRequest;

            /**
             * Encodes the specified PushRecordRequest message. Does not implicitly {@link net.pb.PushRecordRequest.verify|verify} messages.
             * @param message PushRecordRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IPushRecordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PushRecordRequest message, length delimited. Does not implicitly {@link net.pb.PushRecordRequest.verify|verify} messages.
             * @param message PushRecordRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IPushRecordRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PushRecordRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PushRecordRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.PushRecordRequest;

            /**
             * Decodes a PushRecordRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PushRecordRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.PushRecordRequest;

            /**
             * Verifies a PushRecordRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PushRecordRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PushRecordRequest
             */
            public static fromObject(object: { [k: string]: any }): net.pb.PushRecordRequest;

            /**
             * Creates a plain object from a PushRecordRequest message. Also converts values to other types if specified.
             * @param message PushRecordRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.PushRecordRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PushRecordRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PushRecordRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace PushRecordRequest {

            /** Properties of a Body. */
            interface IBody {

                /** Body threadID */
                threadID?: (Uint8Array|null);

                /** Body logID */
                logID?: (Uint8Array|null);

                /** Body record */
                record?: (net.pb.Log.IRecord|null);
            }

            /** Represents a Body. */
            class Body implements IBody {

                /**
                 * Constructs a new Body.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.PushRecordRequest.IBody);

                /** Body threadID. */
                public threadID: Uint8Array;

                /** Body logID. */
                public logID: Uint8Array;

                /** Body record. */
                public record?: (net.pb.Log.IRecord|null);

                /**
                 * Creates a new Body instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Body instance
                 */
                public static create(properties?: net.pb.PushRecordRequest.IBody): net.pb.PushRecordRequest.Body;

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.PushRecordRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.PushRecordRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.PushRecordRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.PushRecordRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.PushRecordRequest.Body;

                /**
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.PushRecordRequest.Body;

                /**
                 * Verifies a Body message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Body
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.PushRecordRequest.Body;

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @param message Body
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.PushRecordRequest.Body, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Body to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Body
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a PushRecordReply. */
        interface IPushRecordReply {
        }

        /** Represents a PushRecordReply. */
        class PushRecordReply implements IPushRecordReply {

            /**
             * Constructs a new PushRecordReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IPushRecordReply);

            /**
             * Creates a new PushRecordReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PushRecordReply instance
             */
            public static create(properties?: net.pb.IPushRecordReply): net.pb.PushRecordReply;

            /**
             * Encodes the specified PushRecordReply message. Does not implicitly {@link net.pb.PushRecordReply.verify|verify} messages.
             * @param message PushRecordReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IPushRecordReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PushRecordReply message, length delimited. Does not implicitly {@link net.pb.PushRecordReply.verify|verify} messages.
             * @param message PushRecordReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IPushRecordReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PushRecordReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PushRecordReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.PushRecordReply;

            /**
             * Decodes a PushRecordReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PushRecordReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.PushRecordReply;

            /**
             * Verifies a PushRecordReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PushRecordReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PushRecordReply
             */
            public static fromObject(object: { [k: string]: any }): net.pb.PushRecordReply;

            /**
             * Creates a plain object from a PushRecordReply message. Also converts values to other types if specified.
             * @param message PushRecordReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.PushRecordReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PushRecordReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for PushRecordReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ExchangeEdgesRequest. */
        interface IExchangeEdgesRequest {

            /** ExchangeEdgesRequest body */
            body?: (net.pb.ExchangeEdgesRequest.IBody|null);
        }

        /** Represents an ExchangeEdgesRequest. */
        class ExchangeEdgesRequest implements IExchangeEdgesRequest {

            /**
             * Constructs a new ExchangeEdgesRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IExchangeEdgesRequest);

            /** ExchangeEdgesRequest body. */
            public body?: (net.pb.ExchangeEdgesRequest.IBody|null);

            /**
             * Creates a new ExchangeEdgesRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ExchangeEdgesRequest instance
             */
            public static create(properties?: net.pb.IExchangeEdgesRequest): net.pb.ExchangeEdgesRequest;

            /**
             * Encodes the specified ExchangeEdgesRequest message. Does not implicitly {@link net.pb.ExchangeEdgesRequest.verify|verify} messages.
             * @param message ExchangeEdgesRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IExchangeEdgesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ExchangeEdgesRequest message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesRequest.verify|verify} messages.
             * @param message ExchangeEdgesRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IExchangeEdgesRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ExchangeEdgesRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ExchangeEdgesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.ExchangeEdgesRequest;

            /**
             * Decodes an ExchangeEdgesRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ExchangeEdgesRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.ExchangeEdgesRequest;

            /**
             * Verifies an ExchangeEdgesRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ExchangeEdgesRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ExchangeEdgesRequest
             */
            public static fromObject(object: { [k: string]: any }): net.pb.ExchangeEdgesRequest;

            /**
             * Creates a plain object from an ExchangeEdgesRequest message. Also converts values to other types if specified.
             * @param message ExchangeEdgesRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.ExchangeEdgesRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ExchangeEdgesRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ExchangeEdgesRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ExchangeEdgesRequest {

            /** Properties of a Body. */
            interface IBody {

                /** Body threads */
                threads?: (net.pb.ExchangeEdgesRequest.Body.IThreadEntry[]|null);
            }

            /** Represents a Body. */
            class Body implements IBody {

                /**
                 * Constructs a new Body.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.ExchangeEdgesRequest.IBody);

                /** Body threads. */
                public threads: net.pb.ExchangeEdgesRequest.Body.IThreadEntry[];

                /**
                 * Creates a new Body instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Body instance
                 */
                public static create(properties?: net.pb.ExchangeEdgesRequest.IBody): net.pb.ExchangeEdgesRequest.Body;

                /**
                 * Encodes the specified Body message. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.ExchangeEdgesRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Body message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.verify|verify} messages.
                 * @param message Body message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.ExchangeEdgesRequest.IBody, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Body message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.ExchangeEdgesRequest.Body;

                /**
                 * Decodes a Body message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Body
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.ExchangeEdgesRequest.Body;

                /**
                 * Verifies a Body message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Body message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Body
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.ExchangeEdgesRequest.Body;

                /**
                 * Creates a plain object from a Body message. Also converts values to other types if specified.
                 * @param message Body
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.ExchangeEdgesRequest.Body, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Body to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for Body
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }

            namespace Body {

                /** Properties of a ThreadEntry. */
                interface IThreadEntry {

                    /** ThreadEntry threadID */
                    threadID?: (Uint8Array|null);

                    /** ThreadEntry addressEdge */
                    addressEdge?: (number|Long|null);

                    /** ThreadEntry headsEdge */
                    headsEdge?: (number|Long|null);
                }

                /** Represents a ThreadEntry. */
                class ThreadEntry implements IThreadEntry {

                    /**
                     * Constructs a new ThreadEntry.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: net.pb.ExchangeEdgesRequest.Body.IThreadEntry);

                    /** ThreadEntry threadID. */
                    public threadID: Uint8Array;

                    /** ThreadEntry addressEdge. */
                    public addressEdge: (number|Long);

                    /** ThreadEntry headsEdge. */
                    public headsEdge: (number|Long);

                    /**
                     * Creates a new ThreadEntry instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ThreadEntry instance
                     */
                    public static create(properties?: net.pb.ExchangeEdgesRequest.Body.IThreadEntry): net.pb.ExchangeEdgesRequest.Body.ThreadEntry;

                    /**
                     * Encodes the specified ThreadEntry message. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.ThreadEntry.verify|verify} messages.
                     * @param message ThreadEntry message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: net.pb.ExchangeEdgesRequest.Body.IThreadEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ThreadEntry message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesRequest.Body.ThreadEntry.verify|verify} messages.
                     * @param message ThreadEntry message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: net.pb.ExchangeEdgesRequest.Body.IThreadEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ThreadEntry message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ThreadEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.ExchangeEdgesRequest.Body.ThreadEntry;

                    /**
                     * Decodes a ThreadEntry message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ThreadEntry
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.ExchangeEdgesRequest.Body.ThreadEntry;

                    /**
                     * Verifies a ThreadEntry message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ThreadEntry message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ThreadEntry
                     */
                    public static fromObject(object: { [k: string]: any }): net.pb.ExchangeEdgesRequest.Body.ThreadEntry;

                    /**
                     * Creates a plain object from a ThreadEntry message. Also converts values to other types if specified.
                     * @param message ThreadEntry
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: net.pb.ExchangeEdgesRequest.Body.ThreadEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ThreadEntry to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };

                    /**
                     * Gets the default type url for ThreadEntry
                     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                     * @returns The default type url
                     */
                    public static getTypeUrl(typeUrlPrefix?: string): string;
                }
            }
        }

        /** Properties of an ExchangeEdgesReply. */
        interface IExchangeEdgesReply {

            /** ExchangeEdgesReply edges */
            edges?: (net.pb.ExchangeEdgesReply.IThreadEdges[]|null);
        }

        /** Represents an ExchangeEdgesReply. */
        class ExchangeEdgesReply implements IExchangeEdgesReply {

            /**
             * Constructs a new ExchangeEdgesReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IExchangeEdgesReply);

            /** ExchangeEdgesReply edges. */
            public edges: net.pb.ExchangeEdgesReply.IThreadEdges[];

            /**
             * Creates a new ExchangeEdgesReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ExchangeEdgesReply instance
             */
            public static create(properties?: net.pb.IExchangeEdgesReply): net.pb.ExchangeEdgesReply;

            /**
             * Encodes the specified ExchangeEdgesReply message. Does not implicitly {@link net.pb.ExchangeEdgesReply.verify|verify} messages.
             * @param message ExchangeEdgesReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IExchangeEdgesReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ExchangeEdgesReply message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesReply.verify|verify} messages.
             * @param message ExchangeEdgesReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IExchangeEdgesReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ExchangeEdgesReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ExchangeEdgesReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.ExchangeEdgesReply;

            /**
             * Decodes an ExchangeEdgesReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ExchangeEdgesReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.ExchangeEdgesReply;

            /**
             * Verifies an ExchangeEdgesReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ExchangeEdgesReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ExchangeEdgesReply
             */
            public static fromObject(object: { [k: string]: any }): net.pb.ExchangeEdgesReply;

            /**
             * Creates a plain object from an ExchangeEdgesReply message. Also converts values to other types if specified.
             * @param message ExchangeEdgesReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.ExchangeEdgesReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ExchangeEdgesReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ExchangeEdgesReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace ExchangeEdgesReply {

            /** Properties of a ThreadEdges. */
            interface IThreadEdges {

                /** ThreadEdges threadID */
                threadID?: (Uint8Array|null);

                /** ThreadEdges exists */
                exists?: (boolean|null);

                /** ThreadEdges addressEdge */
                addressEdge?: (number|Long|null);

                /** ThreadEdges headsEdge */
                headsEdge?: (number|Long|null);
            }

            /** Represents a ThreadEdges. */
            class ThreadEdges implements IThreadEdges {

                /**
                 * Constructs a new ThreadEdges.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.ExchangeEdgesReply.IThreadEdges);

                /** ThreadEdges threadID. */
                public threadID: Uint8Array;

                /** ThreadEdges exists. */
                public exists: boolean;

                /** ThreadEdges addressEdge. */
                public addressEdge: (number|Long);

                /** ThreadEdges headsEdge. */
                public headsEdge: (number|Long);

                /**
                 * Creates a new ThreadEdges instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ThreadEdges instance
                 */
                public static create(properties?: net.pb.ExchangeEdgesReply.IThreadEdges): net.pb.ExchangeEdgesReply.ThreadEdges;

                /**
                 * Encodes the specified ThreadEdges message. Does not implicitly {@link net.pb.ExchangeEdgesReply.ThreadEdges.verify|verify} messages.
                 * @param message ThreadEdges message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.ExchangeEdgesReply.IThreadEdges, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ThreadEdges message, length delimited. Does not implicitly {@link net.pb.ExchangeEdgesReply.ThreadEdges.verify|verify} messages.
                 * @param message ThreadEdges message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.ExchangeEdgesReply.IThreadEdges, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ThreadEdges message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ThreadEdges
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.ExchangeEdgesReply.ThreadEdges;

                /**
                 * Decodes a ThreadEdges message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ThreadEdges
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.ExchangeEdgesReply.ThreadEdges;

                /**
                 * Verifies a ThreadEdges message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ThreadEdges message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ThreadEdges
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.ExchangeEdgesReply.ThreadEdges;

                /**
                 * Creates a plain object from a ThreadEdges message. Also converts values to other types if specified.
                 * @param message ThreadEdges
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.ExchangeEdgesReply.ThreadEdges, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ThreadEdges to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for ThreadEdges
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Represents a Service */
        class Service extends $protobuf.rpc.Service {

            /**
             * Constructs a new Service service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new Service service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Service;

            /**
             * Calls GetLogs.
             * @param request GetLogsRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and GetLogsReply
             */
            public getLogs(request: net.pb.IGetLogsRequest, callback: net.pb.Service.GetLogsCallback): void;

            /**
             * Calls GetLogs.
             * @param request GetLogsRequest message or plain object
             * @returns Promise
             */
            public getLogs(request: net.pb.IGetLogsRequest): Promise<net.pb.GetLogsReply>;

            /**
             * Calls PushLog.
             * @param request PushLogRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and PushLogReply
             */
            public pushLog(request: net.pb.IPushLogRequest, callback: net.pb.Service.PushLogCallback): void;

            /**
             * Calls PushLog.
             * @param request PushLogRequest message or plain object
             * @returns Promise
             */
            public pushLog(request: net.pb.IPushLogRequest): Promise<net.pb.PushLogReply>;

            /**
             * Calls GetRecords.
             * @param request GetRecordsRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and GetRecordsReply
             */
            public getRecords(request: net.pb.IGetRecordsRequest, callback: net.pb.Service.GetRecordsCallback): void;

            /**
             * Calls GetRecords.
             * @param request GetRecordsRequest message or plain object
             * @returns Promise
             */
            public getRecords(request: net.pb.IGetRecordsRequest): Promise<net.pb.GetRecordsReply>;

            /**
             * Calls PushRecord.
             * @param request PushRecordRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and PushRecordReply
             */
            public pushRecord(request: net.pb.IPushRecordRequest, callback: net.pb.Service.PushRecordCallback): void;

            /**
             * Calls PushRecord.
             * @param request PushRecordRequest message or plain object
             * @returns Promise
             */
            public pushRecord(request: net.pb.IPushRecordRequest): Promise<net.pb.PushRecordReply>;

            /**
             * Calls ExchangeEdges.
             * @param request ExchangeEdgesRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ExchangeEdgesReply
             */
            public exchangeEdges(request: net.pb.IExchangeEdgesRequest, callback: net.pb.Service.ExchangeEdgesCallback): void;

            /**
             * Calls ExchangeEdges.
             * @param request ExchangeEdgesRequest message or plain object
             * @returns Promise
             */
            public exchangeEdges(request: net.pb.IExchangeEdgesRequest): Promise<net.pb.ExchangeEdgesReply>;
        }

        namespace Service {

            /**
             * Callback as used by {@link net.pb.Service#getLogs}.
             * @param error Error, if any
             * @param [response] GetLogsReply
             */
            type GetLogsCallback = (error: (Error|null), response?: net.pb.GetLogsReply) => void;

            /**
             * Callback as used by {@link net.pb.Service#pushLog}.
             * @param error Error, if any
             * @param [response] PushLogReply
             */
            type PushLogCallback = (error: (Error|null), response?: net.pb.PushLogReply) => void;

            /**
             * Callback as used by {@link net.pb.Service#getRecords}.
             * @param error Error, if any
             * @param [response] GetRecordsReply
             */
            type GetRecordsCallback = (error: (Error|null), response?: net.pb.GetRecordsReply) => void;

            /**
             * Callback as used by {@link net.pb.Service#pushRecord}.
             * @param error Error, if any
             * @param [response] PushRecordReply
             */
            type PushRecordCallback = (error: (Error|null), response?: net.pb.PushRecordReply) => void;

            /**
             * Callback as used by {@link net.pb.Service#exchangeEdges}.
             * @param error Error, if any
             * @param [response] ExchangeEdgesReply
             */
            type ExchangeEdgesCallback = (error: (Error|null), response?: net.pb.ExchangeEdgesReply) => void;
        }
    }
}
