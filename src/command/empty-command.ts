import Command from "./command";

class EmptyCommand extends Command {

    constructor() {
        super(null);
        this.name = 'EmptyCommand';
    }

    do(): boolean {
        return false;
    }

    undo(): void {}
}

export default EmptyCommand;
