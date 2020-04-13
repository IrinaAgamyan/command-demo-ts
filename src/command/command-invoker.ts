import Command from "./command";
import {Subject} from "rxjs";

class Invoker {
    private history: Command[] = [];
    private cursor = 0;
    private commandsStream = new Subject<Command>();

    public init(): void {
        this.commandsStream.subscribe(command => {
            const saveToHistory = command.execute();
            if (saveToHistory) {
                this.history[this.cursor] = command;
                this.cursor++;
                this.clearFutureRedo();
            }
        })
    }

    public invoke(command: Command): void {
        const saveToHistory = command.execute();
        if (saveToHistory) {
            this.history[this.cursor] = command;
            this.cursor++;
            this.clearFutureRedo();
        }
    }

    public undo(): void {
        if (this.cursor > 0) {
            this.cursor--;
            this.history[this.cursor].undo();
        }
    }

    public redo(): void {
        if (this.cursor < this.history.length) {
            this.history[this.cursor].execute();
            this.cursor++;
        }
    }

    private clearFutureRedo(): void {
        if (this.cursor < this.history.length) {
            this.history = this.history.slice(0, this.cursor);
        }
    }
}

const CommandInvoker = new Invoker();
CommandInvoker.init();
export default CommandInvoker;
