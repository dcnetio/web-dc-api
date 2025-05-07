export class AsyncMutex {
    private _locked: boolean = false;
    private _queue: (() => void)[] = [];
  
    async acquire(): Promise<void> {
      return new Promise<void>((resolve) => {
        if (!this._locked) {
          this._locked = true;
          resolve();
        } else {
          this._queue.push(resolve);
        }
      });
    }
  
    release(): void {
      if (this._queue.length > 0) {
        const next = this._queue.shift()!;
        next();
      } else {
        this._locked = false;
      }
    }
  }