import Command from "./command";

class PastCommand extends Command {

    constructor(editor: any) {
        super(editor);
        this.name = 'PastCommand';
        const newData = this.editor.clipboard ? `${this.editor.data$.value}${this.editor.clipboard}` : this.editor.data$.value;
        this.info = {
            selection: '',
            newState: newData,
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

export default PastCommand;
