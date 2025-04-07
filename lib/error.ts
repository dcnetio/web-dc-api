

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = code;
  }
}

export const Errors = {
  // Authentication errors (400-499)
  // INVALID_SIGNATURE: new AppError('INVALID_SIGNATURE', 'bad signature', 401),
  INVALID_TOKEN: new AppError('INVALID_TOKEN', 'invalid token', 401),
  // REQ_TOKEN_TOO_OFTEN: new AppError('REQ_TOKEN_TOO_OFTEN', 'request token too often', 429),

  // // User management errors
  // USER_BINDED: new AppError('USER_BINDED', 'user has binded an account'),
  // ACCOUNT_BINDED: new AppError('ACCOUNT_BINDED', 'account has been Binded with other user'),
  
  // // Resource management errors
  // NO_ENOUGH_USER_SPACE: new AppError('NO_ENOUGH_USER_SPACE', 'no enough user space', 507),
  // DB_SPACE_LIMIT: new AppError('DB_SPACE_LIMIT', 'db space limit', 507),
  // USER_SPACE_EXPIRED: new AppError('USER_SPACE_EXPIRED', 'store space has expired'),
  
  // // Blockchain related errors
  // BLOCKCHAIN_NOT_INIT: new AppError('BLOCKCHAIN_NOT_INIT', 'blockchain not init', 503),
  // INVALID_ENCLAVE: new AppError('INVALID_ENCLAVE', 'invalid enclave'),

  // // Network errors
  // LOCAL_NET_FAIL: new AppError('LOCAL_NET_FAIL', 'local net fail', 502),

  // // Thread management errors
  // INVALID_THREADID: new AppError('INVALID_THREADID', 'invalid threadid'),
  // THREAD_NOT_FOUND: new AppError('THREAD_NOT_FOUND', 'thread not found', 404),

  // // Security errors
  // INVALID_PRIVKEY: new AppError('INVALID_PRIVKEY', 'invalid privkey', 403),

  // // Additional errors from original list
  // INVALID_CID: new AppError('INVALID_CID', 'invalid cid'),
  // PEER_NOT_INIT: new AppError('PEER_NOT_INIT', 'general datastore didn\'t init'),
  // INVALID_IDENTITY: new AppError('INVALID_IDENTITY', 'invalid identity'),
  // INVALID_REQUEST: new AppError('INVALID_REQUEST', 'invalid request', 400),
  // INVALID_PEERID: new AppError('INVALID_PEERID', 'invalid peerid'),
  // INVALID_PUBKEY: new AppError('INVALID_PUBKEY', 'invalid pubkey'),
  // USER_NOT_OWN_THREAD: new AppError('USER_NOT_OWN_THREAD', 'user not own thread', 403),
  // SUB_ACCOUNT_EXIST: new AppError('SUB_ACCOUNT_EXIST', 'sub account exist'),
  // SELF_IS_SUB_ACCOUNT: new AppError('SELF_IS_SUB_ACCOUNT', 'self is sub account'),
  // INVALID_SUB_ACCOUNT: new AppError('INVALID_SUB_ACCOUNT', 'invalid sub account'),
  // INVALID_TEE_REPORT: new AppError('INVALID_TEE_REPORT', 'invalid tee report'),
  // VACOUNT_MISMATCH: new AppError('VACOUNT_MISMATCH', 'vaccount mismatch')
};

// Type helper for error codes
export type ErrorCode = keyof typeof Errors;
