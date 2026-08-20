import "grpc-libp2p-client";

declare module "grpc-libp2p-client" {
  interface Libp2pGrpcClient {
    /**
     * The workspace transport implementation accepts an AbortSignal as the
     * fourth argument. Older published clients ignore extra arguments, which
     * keeps this extension backward compatible during a rolling upgrade.
     */
    unaryCall(
      method: string,
      requestData: Uint8Array,
      timeout?: number,
      signal?: AbortSignal,
    ): Promise<Uint8Array>;
  }
}
