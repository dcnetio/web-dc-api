import { CID } from 'multiformats/cid';
import { Key,Pair } from 'interface-datastore';
import { Head, HeadBookRecord, serializeHeadBookRecord, deserializeHeadBookRecord } from '../core/head';
import {
    TxnDatastoreExtended,
    Transaction,
} from '../core/db';
import { HeadBook, DumpHeadBook } from '../core/logstore';
import { ThreadID } from '@textile/threads-id';
import type { PeerId } from "@libp2p/interface";
import { dsLogKey, dsThreadKey, AllowEmptyRestore } from './global';

const hbBase = new Key('/thread/heads');
const hbEdge = new Key('/thread/heads:edge');

export function newHeadBook(ds: TxnDatastoreExtended): DsHeadBook {
    return new DsHeadBook(ds);
}

export class DsHeadBook implements HeadBook {
    private ds: TxnDatastoreExtended;

    constructor(datastore: TxnDatastoreExtended) {
        this.ds = datastore;
    }

    async addHead(tid: ThreadID, pid: PeerId, head: Head): Promise<void> {
        return this.addHeads(tid, pid, [head]);
    }

    async addHeads(tid: ThreadID, pid: PeerId, heads: Head[]): Promise<void> {
        return this.withTransaction(async txn => {
            const key = dsLogKey(tid, pid, hbBase);
            let existing = await this.getHeadsRecord(txn, key);
            if (!existing) {
                existing = { heads: [] };
            }
            const newHeads = this.mergeHeads(existing, heads);
            const record = { heads: newHeads };
            await this.saveRecord(txn, key, record);
            await this.invalidateEdge(txn, tid);
        });
    }

    async setHead(tid: ThreadID, pid: PeerId, head: Head): Promise<void> {
        return this.setHeads(tid, pid, [head]);
    }

    async setHeads(tid: ThreadID, pid: PeerId, heads: Head[]): Promise<void> {
        const txn = await this.ds.newTransactionExtended(false);
        try {
            const key = dsLogKey(tid, pid, hbBase);
            const hr: HeadBookRecord = { heads: [] };

            for (const head of heads) {
                if (!head.id) {
                    console.warn(`Ignoring head ${head} is undefined for ${key}`);
                    continue;
                }
                hr.heads.push({
                    id: head.id,
                    counter: head.counter,
                });
            }

            const serializedRecord = serializeHeadBookRecord(hr);
            const recordBytes = new TextEncoder().encode(serializedRecord);
            await txn.put(key, recordBytes);
            await this.invalidateEdge(txn, tid);
            await txn.commit();
        } catch (err) {
            txn.discard();
            throw new Error(`Error when setting heads: ${err.message}`);
        }
    }

    async heads(tid: ThreadID, pid: PeerId): Promise<Head[]> {
        const key = dsLogKey(tid, pid, hbBase);
        try {
            const data = await this.ds.get(key);
            if (!data) return [];
            const hr = deserializeHeadBookRecord(new TextDecoder().decode(data));
            return hr.heads.map(h => ({
                id: CID.decode(new TextEncoder().encode(h.id.toString())),
                counter: h.counter,
            }));
        } catch (err) {
            if (err.code === 'ERR_NOT_FOUND') return [];
            throw new Error(`Error when getting current heads from log ${key}: ${err.message}`);
        }
    }

    async clearHeads(tid: ThreadID, pid: PeerId): Promise<void> {
        const txn = await this.ds.newTransactionExtended(false);
        try {
            const key = dsLogKey(tid, pid, hbBase);
            await txn.delete(key);
            await this.invalidateEdge(txn, tid);
            await txn.commit();
        } catch (err) {
            txn.discard();
            throw new Error(`Error when clearing heads: ${err.message}`);
        }
    }

    private async withTransaction<T>(fn: (txn: Transaction) => Promise<T>): Promise<T> {
        const txn = await this.ds.newTransactionExtended(false);
        try {
            const result = await fn(txn);
            await txn.commit();
            return result;
        } catch (err) {
            txn.discard();
            throw err;
        }
    }

    private async getHeadsRecord(txn: Transaction, key: Key): Promise<HeadBookRecord | null> {
        try {
            const data = await txn.get(key);
            if (!data) return null;
            return deserializeHeadBookRecord(new TextDecoder().decode(data));
        } catch (err) {
            if (err.code === 'ERR_NOT_FOUND') return null;
            throw err;
        }
    }

    private mergeHeads(existing: HeadBookRecord, newHeads: Head[]): Head[] {
        const seen = new Set(existing.heads.map(h => h.id.toString()));
        return [
            ...existing.heads,
            ...newHeads.filter(h => !seen.has(h.id.toString()))
        ];
    }

    private async saveRecord(txn: Transaction, key: Key, record: HeadBookRecord): Promise<void> {
        const serializedRecord = serializeHeadBookRecord(record);
        const recordBytes = new TextEncoder().encode(serializedRecord);
        await txn.put(key, recordBytes);
    }

    async headsEdge(tid: ThreadID, retries = 3): Promise<number> {
        const key = dsThreadKey(tid, hbEdge);

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await this.calculateEdge(tid, key);
            } catch (err) {
                if (err.code !== 'TX_CONFLICT') throw err;
                await this.randomDelay(attempt);
            }
        }
        throw new Error('Edge computation failed');
    }

    private async calculateEdge(tid: ThreadID, key: Key): Promise<number> {
        return this.withTransaction(async txn => {
            try {
                let data = await txn.get(key);
                if (!data) {
                    data = Buffer.alloc(8);
                }
                return Buffer.from(data).readUInt32BE(0);
            } catch (err) {
                if (err.code !== 'ERR_NOT_FOUND') throw err;
            }

            const heads = await this.collectHeads(txn, tid);
            if (heads.length === 0) throw new Error('Thread not found');

            const edge = this.computeEdgeValue(heads);
            const buffer = Buffer.alloc(8);
            buffer.writeBigUInt64BE(BigInt(edge));

            await txn.put(key, buffer);
            return edge;
        });
    }

    private async collectHeads(txn: Transaction, tid: ThreadID): Promise<Head[]> {
        const query = { prefix: dsThreadKey(tid, hbBase).toString() };
        const results = txn.query(query);

        const heads: Head[] = [];
        for await (const entry of results) {
            const record = deserializeHeadBookRecord(new TextDecoder().decode(entry.value));
            heads.push(...record.heads.map(h => ({
                id: CID.decode(new TextEncoder().encode(h.id.toString())),
                counter: h.counter
            })));
        }
        return heads.filter(h => h.counter !== 0);
    }

    private computeEdgeValue(heads: Head[]): number {
        return heads.reduce((acc, h) => acc + h.counter, 0);
    }

    private async invalidateEdge(txn: Transaction, tid: ThreadID): Promise<void> {
        const key = dsThreadKey(tid, hbEdge);
        await txn.delete(key);
    }

    private randomDelay(attempt: number): Promise<void> {
        const delay = 50 * attempt + Math.random() * 30;
        return new Promise(resolve =>
            setTimeout(resolve, delay)
        );
    }

    async dumpHeads(): Promise<DumpHeadBook> {
        const data = await this.traverse(true);
        return { data: data };
    }

    async restoreHeads(dump: DumpHeadBook): Promise<void> {
        if (!AllowEmptyRestore && Object.keys(dump.data).length === 0) {
            throw new Error('Empty dump');
        }

        const stored = await this.traverse(false);

        for (const tid in stored) {
            for (const lid in stored[tid]) {
                await this.clearHeads(tid as unknown as ThreadID, lid as unknown as PeerId);
            }
        }

        for (const tid in dump.data) {
            for (const lid in dump.data[tid]) {
                await this.setHeads(tid as unknown as ThreadID, lid as unknown as PeerId, dump.data[tid][lid]);
            }
        }
    }

    private async traverse(withHeads: boolean): Promise<Record<string, Record<string, Head[]>>> {
        const data: Record<string, Record<string, Head[]>> = {};
        const result = this.ds.query({ prefix: hbBase.toString() });

        for await (const entry of result) {
            const { tid, lid, heads } = await this.decodeHeadEntry(entry, withHeads);
            if (!data[tid]) {
                data[tid] = {};
            }
            data[tid][lid] = heads;
        }

        return data;
    }

    private async decodeHeadEntry(
        entry: Pair,
        withHeads: boolean
    ): Promise<{ tid: string, lid: string, heads: Head[] }> {
        const kns = entry.key.namespaces();
        if (kns.length < 3) {
            throw new Error(`bad headbook key detected: ${entry.key}`);
        }

        const ts = kns[kns.length - 2];
        const ls = kns[kns.length - 1];
        const tid = ts;
        const lid = ls;

        let heads: Head[] = [];
        if (withHeads) {
            const hr = deserializeHeadBookRecord(new TextDecoder().decode(entry.value));
            heads = hr.heads.map(h => ({
                id: CID.decode(new TextEncoder().encode(h.id.toString())),
                counter: h.counter
            }));
        }

        return { tid, lid, heads };
    }
}
