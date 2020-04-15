abstract class Command {
    protected editor: any;
    public name: string = '';
    public info?: CommandInfo;

    constructor(editor: any) {
        this.editor = editor;
    }

    public abstract undo(): void;

    public abstract do(): boolean;
}

export default Command;
