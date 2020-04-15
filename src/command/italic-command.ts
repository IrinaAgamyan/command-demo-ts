import Command from "./command";
import {CSSProperties} from "react";

class ItalicCommand extends Command {
    private readonly styles: CSSProperties = {};

    constructor(editor: any) {
        super(editor);
        this.styles = this.editor.styles$.value;
        this.name = 'ItalicCommand';
        const isItalic = this.styles?.fontStyle === 'italic';
        this.info = {
            selection: '',
            newState: {fontStyle: isItalic ? 'normal' : 'italic'},
            initialState: {fontStyle: this.styles.fontStyle},
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

export default ItalicCommand;
