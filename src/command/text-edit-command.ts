import Command from "./command";

class TextEditCommand extends Command {
    private backup?: string;
    private readonly text: string = '';

    constructor(editor: any, value: string) {
        super(editor);
        this.text = value;
    }

    saveBackup(): void {
        this.backup = this.editor.data$.value;
    }

    execute(): boolean {
        this.saveBackup();
        this.editor.data$.next(this.text);
        return true;
    }

    undo(): void {
        this.editor.data$.next(this.backup);
    }
}

export default TextEditCommand;
