import Command from "./command";
import {CSSProperties} from "react";

class BoldCommand extends Command {
    private backup?: string | number;
    private readonly styles: CSSProperties = {};

    constructor(editor: any) {
        super(editor);
        this.styles = this.editor.styles$.value;
    }

    saveBackup(): void {
        this.backup = this.styles.fontWeight;
    }

    execute(): boolean {
        this.saveBackup();
        const isBold = this.styles?.fontWeight === 'bold';
        this.editor.styles$.next({
            ...this.styles,
            fontWeight: isBold ? 'normal' : 'bold'
        })
        return true;
    }

    undo(): void {
        this.editor.styles$.next({
            ...this.styles,
            fontWeight: this.backup
        })
    }
}

export default BoldCommand;
