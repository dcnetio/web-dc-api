import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace net. */
export namespace net {

    /** Namespace pb. */
    namespace pb {

        /** Properties of an AddrBookRecord. */
        interface IAddrBookRecord {

            /** AddrBookRecord threadID */
            threadID?: (Uint8Array|null);

            /** AddrBookRecord peerID */
            peerID?: (Uint8Array|null);

            /** AddrBookRecord addrs */
            addrs?: (net.pb.AddrBookRecord.IAddrEntry[]|null);
        }

        /** Represents an AddrBookRecord. */
        class AddrBookRecord implements IAddrBookRecord {

            /**
             * Constructs a new AddrBookRecord.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IAddrBookRecord);

            /** AddrBookRecord threadID. */
            public threadID: Uint8Array;

            /** AddrBookRecord peerID. */
            public peerID: Uint8Array;

            /** AddrBookRecord addrs. */
            public addrs: net.pb.AddrBookRecord.IAddrEntry[];

            /**
             * Creates a new AddrBookRecord instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AddrBookRecord instance
             */
            public static create(properties?: net.pb.IAddrBookRecord): net.pb.AddrBookRecord;

            /**
             * Encodes the specified AddrBookRecord message. Does not implicitly {@link net.pb.AddrBookRecord.verify|verify} messages.
             * @param message AddrBookRecord message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IAddrBookRecord, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AddrBookRecord message, length delimited. Does not implicitly {@link net.pb.AddrBookRecord.verify|verify} messages.
             * @param message AddrBookRecord message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IAddrBookRecord, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AddrBookRecord message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AddrBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.AddrBookRecord;

            /**
             * Decodes an AddrBookRecord message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AddrBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.AddrBookRecord;

            /**
             * Verifies an AddrBookRecord message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AddrBookRecord message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AddrBookRecord
             */
            public static fromObject(object: { [k: string]: any }): net.pb.AddrBookRecord;

            /**
             * Creates a plain object from an AddrBookRecord message. Also converts values to other types if specified.
             * @param message AddrBookRecord
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.AddrBookRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AddrBookRecord to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for AddrBookRecord
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace AddrBookRecord {

            /** Properties of an AddrEntry. */
            interface IAddrEntry {

                /** AddrEntry addr */
                addr?: (Uint8Array|null);

                /** AddrEntry expiry */
                expiry?: (number|Long|null);

                /** AddrEntry ttl */
                ttl?: (number|Long|null);
            }

            /** Represents an AddrEntry. */
            class AddrEntry implements IAddrEntry {

                /**
                 * Constructs a new AddrEntry.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.AddrBookRecord.IAddrEntry);

                /** AddrEntry addr. */
                public addr: Uint8Array;

                /** AddrEntry expiry. */
                public expiry: (number|Long);

                /** AddrEntry ttl. */
                public ttl: (number|Long);

                /**
                 * Creates a new AddrEntry instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns AddrEntry instance
                 */
                public static create(properties?: net.pb.AddrBookRecord.IAddrEntry): net.pb.AddrBookRecord.AddrEntry;

                /**
                 * Encodes the specified AddrEntry message. Does not implicitly {@link net.pb.AddrBookRecord.AddrEntry.verify|verify} messages.
                 * @param message AddrEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.AddrBookRecord.IAddrEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified AddrEntry message, length delimited. Does not implicitly {@link net.pb.AddrBookRecord.AddrEntry.verify|verify} messages.
                 * @param message AddrEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.AddrBookRecord.IAddrEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an AddrEntry message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns AddrEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.AddrBookRecord.AddrEntry;

                /**
                 * Decodes an AddrEntry message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns AddrEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.AddrBookRecord.AddrEntry;

                /**
                 * Verifies an AddrEntry message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an AddrEntry message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns AddrEntry
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.AddrBookRecord.AddrEntry;

                /**
                 * Creates a plain object from an AddrEntry message. Also converts values to other types if specified.
                 * @param message AddrEntry
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.AddrBookRecord.AddrEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this AddrEntry to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for AddrEntry
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a HeadBookRecord. */
        interface IHeadBookRecord {

            /** HeadBookRecord heads */
            heads?: (net.pb.HeadBookRecord.IHeadEntry[]|null);
        }

        /** Represents a HeadBookRecord. */
        class HeadBookRecord implements IHeadBookRecord {

            /**
             * Constructs a new HeadBookRecord.
             * @param [properties] Properties to set
             */
            constructor(properties?: net.pb.IHeadBookRecord);

            /** HeadBookRecord heads. */
            public heads: net.pb.HeadBookRecord.IHeadEntry[];

            /**
             * Creates a new HeadBookRecord instance using the specified properties.
             * @param [properties] Properties to set
             * @returns HeadBookRecord instance
             */
            public static create(properties?: net.pb.IHeadBookRecord): net.pb.HeadBookRecord;

            /**
             * Encodes the specified HeadBookRecord message. Does not implicitly {@link net.pb.HeadBookRecord.verify|verify} messages.
             * @param message HeadBookRecord message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: net.pb.IHeadBookRecord, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified HeadBookRecord message, length delimited. Does not implicitly {@link net.pb.HeadBookRecord.verify|verify} messages.
             * @param message HeadBookRecord message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: net.pb.IHeadBookRecord, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a HeadBookRecord message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns HeadBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.HeadBookRecord;

            /**
             * Decodes a HeadBookRecord message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns HeadBookRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.HeadBookRecord;

            /**
             * Verifies a HeadBookRecord message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a HeadBookRecord message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns HeadBookRecord
             */
            public static fromObject(object: { [k: string]: any }): net.pb.HeadBookRecord;

            /**
             * Creates a plain object from a HeadBookRecord message. Also converts values to other types if specified.
             * @param message HeadBookRecord
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: net.pb.HeadBookRecord, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this HeadBookRecord to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for HeadBookRecord
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace HeadBookRecord {

            /** Properties of a HeadEntry. */
            interface IHeadEntry {

                /** HeadEntry cid */
                cid?: (Uint8Array|null);

                /** HeadEntry counter */
                counter?: (number|Long|null);
            }

            /** Represents a HeadEntry. */
            class HeadEntry implements IHeadEntry {

                /**
                 * Constructs a new HeadEntry.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: net.pb.HeadBookRecord.IHeadEntry);

                /** HeadEntry cid. */
                public cid: Uint8Array;

                /** HeadEntry counter. */
                public counter: (number|Long);

                /**
                 * Creates a new HeadEntry instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns HeadEntry instance
                 */
                public static create(properties?: net.pb.HeadBookRecord.IHeadEntry): net.pb.HeadBookRecord.HeadEntry;

                /**
                 * Encodes the specified HeadEntry message. Does not implicitly {@link net.pb.HeadBookRecord.HeadEntry.verify|verify} messages.
                 * @param message HeadEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: net.pb.HeadBookRecord.IHeadEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified HeadEntry message, length delimited. Does not implicitly {@link net.pb.HeadBookRecord.HeadEntry.verify|verify} messages.
                 * @param message HeadEntry message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: net.pb.HeadBookRecord.IHeadEntry, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a HeadEntry message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns HeadEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): net.pb.HeadBookRecord.HeadEntry;

                /**
                 * Decodes a HeadEntry message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns HeadEntry
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): net.pb.HeadBookRecord.HeadEntry;

                /**
                 * Verifies a HeadEntry message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a HeadEntry message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns HeadEntry
                 */
                public static fromObject(object: { [k: string]: any }): net.pb.HeadBookRecord.HeadEntry;

                /**
                 * Creates a plain object from a HeadEntry message. Also converts values to other types if specified.
                 * @param message HeadEntry
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: net.pb.HeadBookRecord.HeadEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this HeadEntry to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for HeadEntry
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }
    }
}
