import Command from "./command";

class Invoker {
    private history: Command[] = [];
    private historyCursor = 0;

    public invoke(command: Command): void {
        const saveToHistory = command.do();
        if (saveToHistory) {
            this.history[this.historyCursor] = command;
            this.historyCursor++;
            this.clearFutureRedo();
        }
    }

    public undo(): void {
        if (this.historyCursor > 0) {
            this.historyCursor--;
            this.history[this.historyCursor].undo();
        }
    }

    public redo(): void {
        if (this.historyCursor < this.history.length) {
            this.history[this.historyCursor].do();
            this.historyCursor++;
        }
    }

    private clearFutureRedo(): void {
        if (this.historyCursor < this.history.length) {
            this.history = this.history.slice(0, this.historyCursor);
        }
    }
}

const CommandInvoker = new Invoker();
export default CommandInvoker;
