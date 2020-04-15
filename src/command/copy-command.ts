import Command from "./command";

class CopyCommand extends Command {
    constructor(editor: any) {
        super(editor);
        this.name = 'CopyCommand';
    }

    do(): boolean {
        this.editor.clipboard = this.editor.selection;
        window.navigator.clipboard.writeText(this.editor.selection);
        return false;
    }

    undo(): void {
        return;
    }
}

export default CopyCommand;
