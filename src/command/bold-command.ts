import Command from "./command";
import {CSSProperties} from "react";

class BoldCommand extends Command {
    private readonly styles: CSSProperties = {};

    constructor(editor: any) {
        super(editor);
        this.styles = this.editor.styles$.value;
        this.name = 'BoldCommand';

        const isBold = this.styles?.fontWeight === 'bold';

        this.info = {
            selection: '',
            newState: {fontWeight: isBold ? 'normal' : 'bold'},
            initialState: {fontWeight: this.styles.fontWeight},
            timestamp: (new Date()).toDateString(),
        }
    }

    do(): boolean {
        this.editor.styles$.next({
            ...this.styles,
            ...this.info?.newState
        })
        return true;
    }

    undo(): void {
        this.editor.styles$.next({
            ...this.styles,
            ...this.info?.initialState
        })
    }
}

export default BoldCommand;
