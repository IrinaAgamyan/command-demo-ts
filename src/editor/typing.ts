import {CSSProperties} from "react";

export type EditorState = {
    data: string;
    styles: CSSProperties;
}

export type CommandTask = {
    commandInfo: CommandInfo;
    id: string;
}
