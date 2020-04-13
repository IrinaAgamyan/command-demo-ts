import Command from "./command";
import {CSSProperties} from "react";

class ItalicCommand extends Command {
    private backup?: 'italic' | 'normal' | 'oblique' | string;
    private readonly styles: CSSProperties = {};

    constructor(editor: any) {
        super(editor);
        this.styles = this.editor.styles$.value;
    }

    saveBackup(): void {
        this.backup = this.styles?.fontStyle;
    }

    execute(): boolean {
        this.saveBackup();
        const isItalic = this.styles?.fontStyle === 'italic';
        this.editor.styles$.next({
            ...this.styles,
            fontStyle: isItalic ? 'normal' : 'italic'
        })
        return true;
    }

    undo(): void {
        this.editor.styles$.next({
            ...this.styles,
            fontStyle: this.backup
        })
    }
}

export default ItalicCommand;
