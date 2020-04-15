import Queue, {ProcessFunctionCb} from 'better-queue';

import Command from "../command/command";
import QueueMemoryStore from './queue-storage';
import {CommandTask} from "./typing";
import EditorHttpSync, {HttpSync} from "./http-sync";

const queueConfig = {
    store: QueueMemoryStore,
    batchSize: 10,
    batchDelay: 500,
    merge: (oldTask: CommandTask, newTask: CommandTask, cb: (error: any, mergedTask: CommandTask) => void) => {
        console.log('Queue. Merging tasks', oldTask, newTask);
        oldTask.commandInfo = newTask.commandInfo;
        cb(null, oldTask);
    },
    precondition: function (cb: (error: any, passOrFail: boolean) => void) {
        console.log('Queue. Check connection...');
        if (window.navigator.onLine) {
            console.log('Queue. Has connection!');
            cb(null, true);
        } else {
            console.log('Queue. No connection :(');
            cb(null, false);
        }
    },
    preconditionRetryTimeout: 1000
}

class ActionManager {
    protected queue: Queue;
    private history: Command[] = [];
    private historyCursor = 0;

    constructor(private httpSync: HttpSync) {
        this.queue = new Queue<CommandTask, any>(this.handleTask.bind(this), queueConfig)
    }

    public handleTask(batch: CommandTask[], callback: ProcessFunctionCb<any>): void {
        console.log('Queue. Handle Tasks: ', batch);

        this.httpSync.update(batch)
            .subscribe(
                () => callback(null, batch),
                (error) => callback(error, batch)
            )
    }

    private clearFutureRedo(): void {
        if (this.historyCursor < this.history.length) {
            this.history = this.history.slice(0, this.historyCursor);
        }
    }

    public add(command: Command): void {
        const saveToHistory = command.do();
        if (saveToHistory) {
            this.history[this.historyCursor] = command;
            this.historyCursor++;
            this.clearFutureRedo();
        }
        this.queue.push({
            commandInfo: command.info,
            id: command.name,
        });
    }

    public undo(): void {
        if (this.historyCursor > 0) {
            this.historyCursor--;
            const command = this.history[this.historyCursor];
            command.undo();
            this.queue.push({
                commandInfo: {
                    ...command.info,
                    newState: command.info?.initialState,
                    initialState: command.info?.newState
                },
                id: command.name,
            })
        }
    }

    public redo(): void {
        if (this.historyCursor < this.history.length) {
            const command = this.history[this.historyCursor];
            command.do();
            this.queue.push({
                commandInfo: command.info,
                id: command.name
            });
            this.historyCursor++;
        }
    }
}

const EditorActionManager = new ActionManager(EditorHttpSync);

export default EditorActionManager;
