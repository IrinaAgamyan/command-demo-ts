//code of better-queue-memory module because it doesn't have module for typescript. If we will use better-queue library we need to add custom storage
import {Store} from "better-queue";
import {CommandTask} from "./typing";

let uuid = 0;

function stableSort(arr: any[], compare: { (a: any, b: any): 1 | -1 | 0; (arg0: any, arg1: any): any; }) {
    var wrapper = arr.map(function (item, idx) {
        return { item: item, idx: idx };
    });

    wrapper.sort(function (a, b) {
        return compare(a.item, b.item) || (a.idx - b.idx);
    });

    return wrapper.map(function (w) { return w.item });
}

class MemoryStore<T> implements Store<T> {
    private _queue = [];      // Array of taskIds
    private _tasks = {};      // Map of taskId => task
    private _priorities = {}; // Map of taskId => priority
    private _running = {};    // Map of lockId => taskIds

    public connect (cb: (error: any, length: number) => void) {
        // console.log('Connected to storage. Queue length: ', this._queue.length);
        cb(null, this._queue.length);
    }

    public getTask (taskId: any, cb: (error: any, task: T) => void) {
        // @ts-ignore
        // console.log('Storage. getTask with id: ', taskId, this._tasks[taskId]);
        // console.log(`Storage. queue length: `, this._queue.length);
        // @ts-ignore
        return cb(null, this._tasks[taskId]);
    }

    public deleteTask (taskId: any, cb: () => void) {
        // @ts-ignore
        // console.log('Storage. deleteTask with id: ', taskId, this._tasks[taskId]);
        // console.log(`Storage. queue length: `, this._queue.length);
        // @ts-ignore
        var hadTask = this._tasks[taskId];
        // @ts-ignore
        delete this._tasks[taskId];
        // @ts-ignore
        delete this._priorities[taskId];
        if (hadTask) {
            // @ts-ignore
            this._queue.splice(this._queue.indexOf(taskId), 1);
        }
        cb();
    }

    public putTask (taskId: any, task: T, priority: number, cb: (error: any) => void) {
        // @ts-ignore
        // console.log('Storage. putTask with id: ', taskId, this._tasks[taskId]);
        // console.log(`Storage. queue length: `, this._queue.length);
        // @ts-ignore
        var hadTask = this._tasks[taskId];
        // @ts-ignore
        this._tasks[taskId] = task;
        if (!hadTask) {
            // @ts-ignore
            this._queue.push(taskId);
        }
        if (priority !== undefined) {
            // @ts-ignore
            this._priorities[taskId] = priority;
            // @ts-ignore
            this._queue = stableSort(this._queue, function (a: string | number, b: string | number) {
                // @ts-ignore
                if (this._priorities[a] < this._priorities[b]) return 1;
                // @ts-ignore
                if (this._priorities[a] > this._priorities[b]) return -1;
                return 0;
            })
        }
        cb(null);
    }

    public takeFirstN (n: number, cb: (error: any, lockId: string) => void) {
        const lockId = uuid++;
        const taskIds = this._queue.splice(0, n);
        const tasks = {};
        taskIds.forEach((taskId: string | number) => {
            // @ts-ignore
            tasks[taskId] = this._tasks[taskId];
            // @ts-ignore
            delete this._tasks[taskId];
        })
        if (taskIds.length > 0) {
            // @ts-ignore
            this._running[lockId] = tasks;
        }
        // console.log(`Storage. takeFirst ${n} tasks`, tasks);
        // console.log(`Storage. queue length: `, this._queue.length);
        cb(null, lockId.toString());
    }

    public takeLastN (n: number, cb: (error: any, lockId: string) => void) {
        const lockId = uuid++;
        const taskIds = this._queue.splice(-n).reverse();
        const tasks = {};
        taskIds.forEach(function (taskId: string | number) {
            // @ts-ignore
            tasks[taskId] = this._tasks[taskId];
            // @ts-ignore
            delete this._tasks[taskId];
        })
        if (taskIds.length > 0) {
            // @ts-ignore
            this._running[lockId] = tasks;
        }
        // console.log(`Storage. takeLast ${n} tasks`, tasks);
        // console.log(`Storage. queue length: `, this._queue.length);
        cb(null, lockId.toString());
    }

    public getLock (lockId: string, cb: (error: any, tasks: { [taskId: string]: T }) => void) {
        // @ts-ignore
        cb(null, this._running[lockId]);
    }

    public getRunningTasks (cb: (arg0: null, arg1: any) => void) {
        cb(null, this._running);
    }

    public releaseLock (lockId: string, cb: (error: any) => void) {
        // @ts-ignore
        delete this._running[lockId];
        cb(null);
    }
}

const QueueMemoryStore = new MemoryStore<CommandTask>();

export default QueueMemoryStore;
