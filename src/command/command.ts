abstract class Command {
    protected receiver: any;
    protected editor: any;

    constructor(editor: any, receiver?: any) {
        this.editor = editor;
        this.receiver = receiver;
    }

    public abstract saveBackup(): void;

    public abstract undo(): void;

    public abstract execute(): boolean;
}

export default Command;
