import Command from "./command";

class SelectionChangeCommand extends Command {
    saveBackup(): void {
        return;
    }

    execute(): boolean {
        const selection = window.getSelection();
        this.editor.selection = selection && selection.toString();
        return false;
    }

    undo(): void {
        return;
    }
}

export default SelectionChangeCommand;
