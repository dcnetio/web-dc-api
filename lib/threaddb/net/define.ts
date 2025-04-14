import { IRecord,IThreadRecord } from '../core/record'; 
import { ThreadID } from '@textile/threads-id';
import type { PeerId } from '@libp2p/interface';



export const netPullingLimit = 1000; // 拉取记录数的限制

/**
 * Records with counters from a peer
 */
export interface PeerRecords {
  records: IRecord[];
  counter: number;
}

/**
 * Record with timestamp for sorting
 */
export interface TimestampedRecord {
  record: IRecord;
  counter: number;
  createtime: bigint;
  logid: PeerId;

}


/**
 * Record implements IThreadRecord
 */
export class ThreadRecord implements IThreadRecord {
  constructor(
    private record: IRecord,
    private _threadID: ThreadID,
    private _logID: PeerId
  ) {}

  value(): IRecord {
    return this.record;
  }

 threadID(): ThreadID {
    return this._threadID;
  }

  logID(): PeerId {
    return this._logID;
  }
}

