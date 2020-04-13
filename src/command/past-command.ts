import Command from "./command";

class PastCommand extends Command {
    private backup: string = '';

    saveBackup(): void {
        this.backup = this.editor.data$.value;
    }

    execute(): boolean {
        this.saveBackup();
        if (this.editor.clipboard) {
            this.editor.data$.next(`${this.editor.data$.value}${this.editor.clipboard}`);
        }

        return true;
    }

    undo(): void {
        this.editor.data$.next(this.backup);
    }
}

export default PastCommand;
