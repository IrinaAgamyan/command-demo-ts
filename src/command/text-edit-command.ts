import Command from "./command";

class TextEditCommand extends Command {

    constructor(editor: any, value: string) {
        super(editor);
        this.name = 'TextEditCommand';
        this.info = {
            selection: '',
            newState: value,
            initialState: this.editor.data$.value,
            timestamp: (new Date()).toDateString(),
        }
    }

    do(): boolean {
        this.editor.data$.next(this.info?.newState);
        return true;
    }

    undo(): void {
        this.editor.data$.next(this.info?.initialState);
    }
}

export default TextEditCommand;
