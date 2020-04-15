import Command from "./command";

class SelectionChangeCommand extends Command {
    constructor(editor: any) {
        super(editor);
        this.name = 'SelectionChangeCommand';
    }

    do(): boolean {
        const selection = window.getSelection();
        this.editor.selection = selection && selection.toString();
        return false;
    }

    undo(): void {}
}

export default SelectionChangeCommand;
