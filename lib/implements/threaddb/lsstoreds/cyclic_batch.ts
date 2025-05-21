import { Datastore,Batch ,Key} from 'interface-datastore';

  
  type CyclicBatchOptions = {  
    opsPerBatch?: number;  
  };  
  
  export class CyclicBatch implements Batch {  
    private currentBatch: Batch | null = null;  
    private pendingOps = 0;  
    private readonly threshold: number;  
    private closed = false;  
  
    constructor(  
      private readonly ds: Datastore,  
      options: CyclicBatchOptions = {}  
    ) {  
      this.threshold = options.opsPerBatch || 20;  
    }  
  
    private async initializeBatch(): Promise<void> {  
      if (!this.currentBatch && !this.closed) {  
        this.currentBatch =  this.ds.batch();
      }  
    }  
  
    private async cycle(): Promise<void> {  
      if (this.closed) {  
        throw new Error('Cyclic batch is closed');  
      }  
  
      if (this.pendingOps < this.threshold || !this.currentBatch) {  
        return;  
      }  
  
      try {  
        await this.currentBatch.commit();  
        this.pendingOps = 0;  
        this.currentBatch =  this.ds.batch();
      } catch (err) {  
        throw new Error(`Batch operation failed: ${err.message}`);  
      }  
    }  
  
    async put(key: Key, value: Uint8Array): Promise<void> {  
      if (this.closed) {  
        throw new Error('Cannot write to closed batch');  
      }  
  
      await this.initializeBatch();  
      await this.cycle();  
      
      if (this.currentBatch) {  
        this.pendingOps++;  
        await this.currentBatch.put(key, value);  
      }  
    }  
  
    async delete(key: Key): Promise<void> {  
      if (this.closed) {  
        throw new Error('Cannot write to closed batch');  
      }  
  
      await this.initializeBatch();  
      await this.cycle();  
  
      if (this.currentBatch) {  
        this.pendingOps++;  
        await this.currentBatch.delete(key);  
      }  
    }  
  
    async commit(): Promise<void> {  
      if (this.closed) {  
        throw new Error('Batch already committed');  
      }  
  
      if (this.currentBatch) {  
        await this.currentBatch.commit();  
        this.currentBatch = null;  
      }  
      
      this.closed = true;  
      this.pendingOps = 0;  
    }  
  }  
  