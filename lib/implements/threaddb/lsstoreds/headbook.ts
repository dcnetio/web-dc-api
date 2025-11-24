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
import * as buffer from "buffer/";
const { Buffer } = buffer;

const hbBase = new Key('/thread/heads');
const hbEdge = new Key('/thread/heads:edge');
type LogHead = {
  logId: string;
  head: Head;
};


const FNV_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const MOD64 = 2n ** 64n;

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
        } catch (err: any) {
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
                ...(h.id ? { id:h.id }: {}),
                counter: h.counter,
            }));
        } catch (err: any) {
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
        } catch (err: any) {
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
        } catch (err: any) {
            txn.discard();
            throw err;
        }
    }

    private async getHeadsRecord(txn: Transaction, key: Key): Promise<HeadBookRecord | null> {
        try {
            const data = await txn.get(key);
            if (!data) return null;
            return deserializeHeadBookRecord(new TextDecoder().decode(data));
        } catch (err: any) {
            if (err.code === 'ERR_NOT_FOUND') return null;
            throw err;
        }
    }

    private mergeHeads(existing: HeadBookRecord, newHeads: Head[]): Head[] {
        const seen = new Set(existing.heads.map(h => h.id?.toString()));
        return [
            ...existing.heads,
            ...newHeads.filter(h => !seen.has(h.id?.toString()))
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
            } catch (err: any)  {
                if (err.code !== 'TX_CONFLICT') throw err;
                await this.randomDelay(attempt);
            }
        }
        throw new Error('Edge computation failed');
    }

    private async calculateEdge(tid: ThreadID, key: Key): Promise<number> {
        return this.withTransaction(async txn => {
            try {
                const data = await txn.get(key);
                if (data) {
                    return this.decodeStoredEdge(data);
                }
            } catch (err: any)  {
                if (err.code !== 'ERR_NOT_FOUND') throw err;
            }

            const heads = await this.collectHeads(txn, tid);
            if (heads.length === 0) throw new Error('Thread not found');

            const edge = this.computeHeadsEdge(heads);
            const buffer = Buffer.alloc(8);
            this.writeEdgeValue(buffer, edge);

            await txn.put(key, buffer);
            return Number(edge);
        });
    }

    private async collectHeads(txn: Transaction, tid: ThreadID): Promise<LogHead[]> {
        const query = { prefix: dsThreadKey(tid, hbBase).toString() };
        const results = txn.query(query);

        const heads: LogHead[] = [];
        for await (const entry of results) {
            const rawKey = entry.key as any;
            const keyObj = rawKey instanceof Key ? rawKey : new Key(rawKey);
            const namespaces = keyObj.namespaces();
            const logId = namespaces[namespaces.length - 1];
            if (!logId) {
                console.warn(`Skipping malformed head entry for thread ${tid.toString()}`);
                continue;
            }
            const record = deserializeHeadBookRecord(new TextDecoder().decode(entry.value));
            for (const head of record.heads) {
                if (head.counter === 0) continue;
                heads.push({
                    logId,
                    head: {
                        ...(head.id ? { id: head.id } : {}),
                        counter: head.counter,
                    },
                });
            }
        }
        return heads;
    }

        private computeHeadsEdge(hs: LogHead[]): bigint {
                const sorted = [...hs].sort((a, b) => {
                        if (a.logId === b.logId) {
                                return this.compareCidBytes(a.head.id?.bytes, b.head.id?.bytes);
                        }
                        return a.logId.localeCompare(b.logId);
                });

                const encoder = new TextEncoder();
                let hash = FNV_OFFSET_BASIS;

                for (const item of sorted) {
                        hash = this.fnv1a64(encoder.encode(item.logId), hash);
                        const headBytes = item.head.id?.bytes ?? new Uint8Array();
                        hash = this.fnv1a64(headBytes, hash);
                }

                return hash;
        }

        private compareCidBytes(left?: Uint8Array, right?: Uint8Array): number {
                const a = left ?? new Uint8Array();
                const b = right ?? new Uint8Array();
                const min = Math.min(a.length, b.length);
                for (let i = 0; i < min; i++) {
                        if (a[i] !== b[i]) {
                                return a[i] - b[i];
                        }
                }
                return a.length - b.length;
        }

private fnv1a64(data: Uint8Array, initial: bigint): bigint {
  let hash = initial;
  for (const byte of data) {
    hash ^= BigInt(byte);
    hash = (hash * FNV_PRIME) % MOD64;
  }
  return hash;
}

    private async invalidateEdge(txn: Transaction, tid: ThreadID): Promise<void> {
        const key = dsThreadKey(tid, hbEdge);
        await txn.delete(key);
    }

    private decodeStoredEdge(data: Uint8Array): number {
        const buf: any = Buffer.from(data);
        const reader = buf as unknown as { readBigUInt64BE?: (offset?: number) => bigint };
        if (buf.length >= 8 && typeof reader.readBigUInt64BE === 'function') {
            return Number(reader.readBigUInt64BE(0));
        }
        if (buf.length >= 4) {
            return buf.readUInt32BE(0);
        }
        throw new Error('Corrupted head edge value');
    }

    private writeEdgeValue(buf: any, value: bigint): void {
        const writer = buf as unknown as { writeBigUInt64BE?: (val: bigint, offset?: number) => number };
        if (typeof writer.writeBigUInt64BE === 'function') {
            writer.writeBigUInt64BE(value, 0);
            return;
        }
        buf.writeUInt32BE(Number(value & 0xffffffffn), 0);
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
                await this.setHeads(tid as unknown as ThreadID, lid as unknown as PeerId, dump.data[tid][lid]!);
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

        const ts = kns[kns.length - 2]!;
        const ls = kns[kns.length - 1]!;
        const tid = ts;
        const lid = ls;

        let heads: Head[] = [];
        if (withHeads) {
            const hr = deserializeHeadBookRecord(new TextDecoder().decode(entry.value));
            heads = hr.heads.map(h => ({
                ...(h.id ? { id: h.id } : {}),
                counter: h.counter
            }));
        }

        return { tid, lid, heads };
    }
}
