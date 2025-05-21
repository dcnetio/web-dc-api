import * as buffer from "buffer/";
const { Buffer } = buffer;
import {  Key, Query,Pair } from 'interface-datastore';
import {DBPrefix } from '../core/db';
import { Event ,TxnDatastoreExtended, Transaction} from '../core/db'; // Assuming Event is defined in a core module
import { jsonStringify } from "../../../util/utils";
 
export const dsDispatcherPrefix = DBPrefix.dsPrefix.child(new Key('dispatcher'));

// Reducer applies an event to an existing state.
interface Reducer {
    reduce(events: Event[]): Promise<void>;
}

// Dispatcher is used to dispatch events to registered reducers.
export class Dispatcher {
    private store: TxnDatastoreExtended;
    private reducers: Reducer[];
    private lock: { lock: () => void; unlock: () => void };
    private lastID: number;

    constructor(store: TxnDatastoreExtended) {
        this.store = store;
        this.reducers = [];
        this.lock = { lock: () => {}, unlock: () => {} }; 
        this.lastID = 0;
    }

    // Store returns the internal event store.
    getStore(): TxnDatastoreExtended {
        return this.store;
    }

    // Register takes a reducer to be invoked with each dispatched event.
    register(reducer: Reducer): void {
        this.lock.lock();
        this.lastID++;
        this.reducers.push(reducer);
        this.lock.unlock();
    }

    // Dispatch dispatches a payload to all registered reducers.
    async dispatch(events: Event[]): Promise<void> {
        this.lock.lock();

        const txn = await this.store.newTransactionExtended(false);
        try {
            for (const event of events) {
                const key = this.getKey(event);
                const buffer = Buffer.from(jsonStringify(event));
                await txn.put(key, buffer);
            }
            await txn.commit();
        } catch (err) {
             txn.discard();
            throw err;
        } finally {
            this.lock.unlock();
        }

        // Safe to fire off reducers now that event is persisted
       this.reducers.map(async (reducer) => {
			await reducer.reduce(events);
		});
    }

    // Query searches the internal event store and returns a query result.
    async *query(query: Query): AsyncIterable<Pair>{
        const result = this.store.query(query);
        return result;
    }

    // Key format: <timestamp>/<instance-id>/<type>
    private getKey(event: Event): Key {
        const timestamp = event.timestamp
        const collection = event.collection;
        const instanceID = event.instanceID;
        return dsDispatcherPrefix.child(new Key(timestamp.toString())).child(new Key(collection.toString())).child(new Key(instanceID.toString()));
    }
}

