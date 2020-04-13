import Command from "./command";

class CopyCommand extends Command {
    saveBackup(): void {
        return;
    }

    execute(): boolean {
        this.editor.clipboard = this.editor.selection;
        window.navigator.clipboard.writeText(this.editor.selection);
        return false;
    }

    undo(): void {
        return;
    }
}

export default CopyCommand;
