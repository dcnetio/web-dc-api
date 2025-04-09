// Package logstore provides local store for thread logs. The subpackages provide creators for different types of store implementations.

import { Mutex } from 'async-mutex';
import { KeyBook, AddrBook, ThreadMetadata, HeadBook, Logstore as CoreLogstore, ErrThreadNotFound, ErrLogNotFound, ErrLogExists } from '../core/logstore';
import {ThreadInfo,ThreadLogInfo} from '../core/core';
import {SymmetricKey} from './key';
import { ThreadID } from '@textile/threads-id'; 
import type { PeerId } from "@libp2p/interface";
import { compareByteArrays } from '../../util/utils';
import {Key as ThreadKey} from './key';
import { symKeyFromBytes } from '../../dc-key/keyManager';
import { CID } from 'multiformats';

const PermanentAddrTTL = 2^53-1; // 使用 bigint 精确表示 64 位整数  


const managedSuffix = "/managed";


// NewLogstore creates a new log store from the given books.
 export function newLogstore(kb: KeyBook, ab: AddrBook, hb: HeadBook, md: ThreadMetadata): Logstore {
    return new Logstore(kb, ab, hb, md);
}

// logstore is a collection of books for storing thread logs.
class Logstore implements CoreLogstore {
    private mutex = new Mutex();

    constructor(
        private keyBook: KeyBook,
        private addrBook: AddrBook,
        private headBook: HeadBook,
        private threadMetadata: ThreadMetadata
    ) {}

    // Close the logstore.
    async close(): Promise<void> {
        const errs: Error[] = [];
        const weakClose = async (name: string, c: any) => {
            if (c && typeof c.close === 'function') {
                try {
                    await c.close();
                } catch (err) {
                    errs.push(new Error(`${name} error: ${err}`));
                }
            }
        };

        await weakClose("keybook", this.keyBook);
        await weakClose("addressbook", this.addrBook);
        await weakClose("headbook", this.headBook);
        await weakClose("threadmetadata", this.threadMetadata);

        if (errs.length > 0) {
            throw new Error(`failed while closing logstore; err(s): ${errs.map(e => e.message).join(', ')}`);
        }
    }

    // Threads returns a list of the thread IDs in the store.
    async threads(): Promise<ThreadID[]> {
        return this.mutex.runExclusive(async () => {
            const set: Set<ThreadID> = new Set();
            const threadsFromKeys = await this.keyBook.threadsFromKeys();
            threadsFromKeys.forEach(t => set.add(t));
            const threadsFromAddrs = await this.addrBook.threadsFromAddrs();
            threadsFromAddrs.forEach(t => set.add(t));
            return Array.from(set);
        });
    }

    // AddThread adds a thread with keys.
    async addThread(info: ThreadInfo): Promise<void> {
        return this.mutex.runExclusive(async () => {
            if (!info.key?.service()) {
                throw new Error("a service-key is required to add a thread");
            }
            const sk = await this.keyBook.serviceKey(info.id);
            const symKey =  await info.key.service()?.toSymKey();
            if (!sk) {
                if (!symKey) {
                    throw new Error("service-key is required");
                }
                await this.keyBook.addServiceKey(info.id, symKey);
            } else if (!symKey || !compareByteArrays(symKey.raw, sk.raw)) {
                throw new Error("service-key mismatch");
            }
            if (info.key.canRead()) {
                const rk = await this.keyBook.readKey(info.id);
                const readKey =  await info.key.read()?.toSymKey();
                if (!rk) {
                    if (!readKey) {
                        throw new Error("read-key is required");
                    }
                    await this.keyBook.addReadKey(info.id, readKey);
                } else if (!readKey  || !compareByteArrays(readKey.raw, rk.raw)) {
                    throw new Error("read-key mismatch");
                }
            }
        });
    }

    // GetThread returns thread info of the given id.
    async getThread(id: ThreadID):Promise<ThreadInfo> {
        return this.mutex.runExclusive(async () => {
            const sk = await this.keyBook.serviceKey(id);
            if (!sk) {
                throw ErrThreadNotFound;
            }
            const rk = await this.keyBook.readKey(id);
            const set = await this.getLogIDs(id);
            const logs: ThreadLogInfo[] = [];
            for (const l of set) {
                const i = await this.getLog(id, l);
                logs.push(i);
            }
            let threadKey = new ThreadKey(SymmetricKey.fromSymKey(sk));
            if(rk) {
                threadKey = new ThreadKey(SymmetricKey.fromSymKey(sk), SymmetricKey.fromSymKey(rk));
            }
            return {
                id,
                logs,
                key: threadKey,
                addrs:[]
            };
        });
    }

    private async getLogIDs(id: ThreadID): Promise<Set<PeerId>> {
        const set: Set<PeerId> = new Set();
        const logsWithKeys = await this.keyBook.logsWithKeys(id);
        logsWithKeys.forEach(l => set.add(l));
        const logsWithAddrs = await this.addrBook.logsWithAddrs(id);
        logsWithAddrs.forEach(l => set.add(l));
        return set;
    }

    // DeleteThread deletes a thread.
    async deleteThread(id: ThreadID): Promise<void> {
        return this.mutex.runExclusive(async () => {
            await this.keyBook.clearKeys(id);
            await this.threadMetadata.clearMetadata(id);
            const set = await this.getLogIDs(id);
            for (const l of set) {
                await this.addrBook.clearAddrs(id, l);
                await this.headBook.clearHeads(id, l);
            }
        });
    }

    // AddLog adds a log under the given thread.
    async addLog(id: ThreadID, lg: ThreadLogInfo): Promise<void> {
        return this.mutex.runExclusive(async () => {
            if (lg.privKey) {
                const pk = await this.keyBook.privKey(id, lg.id);
                if (pk) {
                    throw ErrLogExists;
                }
                await this.keyBook.addPrivKey(id, lg.id, lg.privKey);
            }
            if (!lg.pubKey) {
                throw new Error("public key is required");
            }
            await this.keyBook.addPubKey(id, lg.id, lg.pubKey);
            await this.addrBook.addAddrs(id, lg.id, lg.addrs, PermanentAddrTTL);
            if (lg.head && lg.head.id.toString() !== "") {
                await this.headBook.setHead(id, lg.id, lg.head);
            }
            if (lg.managed || lg.privKey) {
                await this.threadMetadata.putBool(id, lg.id.toString() + managedSuffix, true);
            }
        });
    }

    // GetLog returns info about the given thread.
    async getLog(id: ThreadID, lid: PeerId): Promise<ThreadLogInfo> {
        return this.mutex.runExclusive(async () => {
            return this.getLogInternal(id, lid);
        });
    }

    private async getLogInternal(id: ThreadID, lid: PeerId): Promise<ThreadLogInfo> {
        const pk = await this.keyBook.pubKey(id, lid);
        if (!pk) {
            throw ErrLogNotFound;
        }
        const sk = await this.keyBook.privKey(id, lid);
        const addrs = await this.addrBook.addrs(id, lid);
        const heads = await this.headBook.heads(id, lid);
        const managed = await this.threadMetadata.getBool(id, lid.toString() + managedSuffix);
        return {
            id: lid,
            pubKey: pk,
            privKey: sk?sk:undefined,
            addrs,
            head: heads.length > 0 ? heads[0] : undefined,
            managed: managed || false
        };
    }

    // GetManagedLogs returns the logs the host is 'managing' under the given thread.
    async getManagedLogs(id: ThreadID): Promise<ThreadLogInfo[]> {
        const logs = await this.keyBook.logsWithKeys(id);
        const managed: ThreadLogInfo[] = [];
        for (const lid of logs) {
            const lg = await this.getLog(id, lid);
            if (lg.managed || lg.privKey) {
                managed.push(lg);
            }
        }
        return managed;
    }

    // DeleteLog deletes a log.
    async deleteLog(id: ThreadID, lid: PeerId): Promise<void> {
        return this.mutex.runExclusive(async () => {
            await this.keyBook.clearLogKeys(id, lid);
            await this.addrBook.clearAddrs(id, lid);
            await this.headBook.clearHeads(id, lid);
        });
    }

}

export default Logstore;
