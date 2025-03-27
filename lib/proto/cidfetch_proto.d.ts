import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace cidfetch. */
export namespace cidfetch {

    /** Namespace pb. */
    namespace pb {

        /** Properties of an InitRequset. */
        interface IInitRequset {
        }

        /** Represents an InitRequset. */
        class InitRequset implements IInitRequset {

            /**
             * Constructs a new InitRequset.
             * @param [properties] Properties to set
             */
            constructor(properties?: cidfetch.pb.IInitRequset);

            /**
             * Creates a new InitRequset instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InitRequset instance
             */
            public static create(properties?: cidfetch.pb.IInitRequset): cidfetch.pb.InitRequset;

            /**
             * Encodes the specified InitRequset message. Does not implicitly {@link cidfetch.pb.InitRequset.verify|verify} messages.
             * @param message InitRequset message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: cidfetch.pb.IInitRequset, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InitRequset message, length delimited. Does not implicitly {@link cidfetch.pb.InitRequset.verify|verify} messages.
             * @param message InitRequset message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: cidfetch.pb.IInitRequset, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InitRequset message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InitRequset
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cidfetch.pb.InitRequset;

            /**
             * Decodes an InitRequset message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InitRequset
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cidfetch.pb.InitRequset;

            /**
             * Verifies an InitRequset message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InitRequset message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InitRequset
             */
            public static fromObject(object: { [k: string]: any }): cidfetch.pb.InitRequset;

            /**
             * Creates a plain object from an InitRequset message. Also converts values to other types if specified.
             * @param message InitRequset
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: cidfetch.pb.InitRequset, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InitRequset to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InitRequset
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an InitReply. */
        interface IInitReply {

            /** InitReply cid */
            cid?: (Uint8Array|null);
        }

        /** Represents an InitReply. */
        class InitReply implements IInitReply {

            /**
             * Constructs a new InitReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: cidfetch.pb.IInitReply);

            /** InitReply cid. */
            public cid: Uint8Array;

            /**
             * Creates a new InitReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InitReply instance
             */
            public static create(properties?: cidfetch.pb.IInitReply): cidfetch.pb.InitReply;

            /**
             * Encodes the specified InitReply message. Does not implicitly {@link cidfetch.pb.InitReply.verify|verify} messages.
             * @param message InitReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: cidfetch.pb.IInitReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InitReply message, length delimited. Does not implicitly {@link cidfetch.pb.InitReply.verify|verify} messages.
             * @param message InitReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: cidfetch.pb.IInitReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InitReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InitReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cidfetch.pb.InitReply;

            /**
             * Decodes an InitReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InitReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cidfetch.pb.InitReply;

            /**
             * Verifies an InitReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InitReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InitReply
             */
            public static fromObject(object: { [k: string]: any }): cidfetch.pb.InitReply;

            /**
             * Creates a plain object from an InitReply message. Also converts values to other types if specified.
             * @param message InitReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: cidfetch.pb.InitReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InitReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InitReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FetchRequest. */
        interface IFetchRequest {

            /** FetchRequest cid */
            cid?: (Uint8Array|null);
        }

        /** Represents a FetchRequest. */
        class FetchRequest implements IFetchRequest {

            /**
             * Constructs a new FetchRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: cidfetch.pb.IFetchRequest);

            /** FetchRequest cid. */
            public cid: Uint8Array;

            /**
             * Creates a new FetchRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FetchRequest instance
             */
            public static create(properties?: cidfetch.pb.IFetchRequest): cidfetch.pb.FetchRequest;

            /**
             * Encodes the specified FetchRequest message. Does not implicitly {@link cidfetch.pb.FetchRequest.verify|verify} messages.
             * @param message FetchRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: cidfetch.pb.IFetchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FetchRequest message, length delimited. Does not implicitly {@link cidfetch.pb.FetchRequest.verify|verify} messages.
             * @param message FetchRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: cidfetch.pb.IFetchRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FetchRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FetchRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cidfetch.pb.FetchRequest;

            /**
             * Decodes a FetchRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FetchRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cidfetch.pb.FetchRequest;

            /**
             * Verifies a FetchRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FetchRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FetchRequest
             */
            public static fromObject(object: { [k: string]: any }): cidfetch.pb.FetchRequest;

            /**
             * Creates a plain object from a FetchRequest message. Also converts values to other types if specified.
             * @param message FetchRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: cidfetch.pb.FetchRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FetchRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FetchRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a FetchReply. */
        interface IFetchReply {

            /** FetchReply data */
            data?: (Uint8Array|null);
        }

        /** Represents a FetchReply. */
        class FetchReply implements IFetchReply {

            /**
             * Constructs a new FetchReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: cidfetch.pb.IFetchReply);

            /** FetchReply data. */
            public data: Uint8Array;

            /**
             * Creates a new FetchReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FetchReply instance
             */
            public static create(properties?: cidfetch.pb.IFetchReply): cidfetch.pb.FetchReply;

            /**
             * Encodes the specified FetchReply message. Does not implicitly {@link cidfetch.pb.FetchReply.verify|verify} messages.
             * @param message FetchReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: cidfetch.pb.IFetchReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FetchReply message, length delimited. Does not implicitly {@link cidfetch.pb.FetchReply.verify|verify} messages.
             * @param message FetchReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: cidfetch.pb.IFetchReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FetchReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FetchReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cidfetch.pb.FetchReply;

            /**
             * Decodes a FetchReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FetchReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cidfetch.pb.FetchReply;

            /**
             * Verifies a FetchReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FetchReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FetchReply
             */
            public static fromObject(object: { [k: string]: any }): cidfetch.pb.FetchReply;

            /**
             * Creates a plain object from a FetchReply message. Also converts values to other types if specified.
             * @param message FetchReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: cidfetch.pb.FetchReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FetchReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for FetchReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ErrorInformRequest. */
        interface IErrorInformRequest {

            /** ErrorInformRequest error */
            error?: (string|null);
        }

        /** Represents an ErrorInformRequest. */
        class ErrorInformRequest implements IErrorInformRequest {

            /**
             * Constructs a new ErrorInformRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: cidfetch.pb.IErrorInformRequest);

            /** ErrorInformRequest error. */
            public error: string;

            /**
             * Creates a new ErrorInformRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ErrorInformRequest instance
             */
            public static create(properties?: cidfetch.pb.IErrorInformRequest): cidfetch.pb.ErrorInformRequest;

            /**
             * Encodes the specified ErrorInformRequest message. Does not implicitly {@link cidfetch.pb.ErrorInformRequest.verify|verify} messages.
             * @param message ErrorInformRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: cidfetch.pb.IErrorInformRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ErrorInformRequest message, length delimited. Does not implicitly {@link cidfetch.pb.ErrorInformRequest.verify|verify} messages.
             * @param message ErrorInformRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: cidfetch.pb.IErrorInformRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ErrorInformRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ErrorInformRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cidfetch.pb.ErrorInformRequest;

            /**
             * Decodes an ErrorInformRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ErrorInformRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cidfetch.pb.ErrorInformRequest;

            /**
             * Verifies an ErrorInformRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ErrorInformRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ErrorInformRequest
             */
            public static fromObject(object: { [k: string]: any }): cidfetch.pb.ErrorInformRequest;

            /**
             * Creates a plain object from an ErrorInformRequest message. Also converts values to other types if specified.
             * @param message ErrorInformRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: cidfetch.pb.ErrorInformRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ErrorInformRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ErrorInformRequest
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of an ErrorInformReply. */
        interface IErrorInformReply {
        }

        /** Represents an ErrorInformReply. */
        class ErrorInformReply implements IErrorInformReply {

            /**
             * Constructs a new ErrorInformReply.
             * @param [properties] Properties to set
             */
            constructor(properties?: cidfetch.pb.IErrorInformReply);

            /**
             * Creates a new ErrorInformReply instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ErrorInformReply instance
             */
            public static create(properties?: cidfetch.pb.IErrorInformReply): cidfetch.pb.ErrorInformReply;

            /**
             * Encodes the specified ErrorInformReply message. Does not implicitly {@link cidfetch.pb.ErrorInformReply.verify|verify} messages.
             * @param message ErrorInformReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: cidfetch.pb.IErrorInformReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ErrorInformReply message, length delimited. Does not implicitly {@link cidfetch.pb.ErrorInformReply.verify|verify} messages.
             * @param message ErrorInformReply message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: cidfetch.pb.IErrorInformReply, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ErrorInformReply message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ErrorInformReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): cidfetch.pb.ErrorInformReply;

            /**
             * Decodes an ErrorInformReply message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ErrorInformReply
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): cidfetch.pb.ErrorInformReply;

            /**
             * Verifies an ErrorInformReply message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ErrorInformReply message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ErrorInformReply
             */
            public static fromObject(object: { [k: string]: any }): cidfetch.pb.ErrorInformReply;

            /**
             * Creates a plain object from an ErrorInformReply message. Also converts values to other types if specified.
             * @param message ErrorInformReply
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: cidfetch.pb.ErrorInformReply, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ErrorInformReply to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for ErrorInformReply
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }
    }
}
