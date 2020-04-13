import React, {Component} from "react";
import EditorStore from "./editor-store";
import {combineLatest} from "rxjs/internal/observable/combineLatest";
import {map} from "rxjs/operators";
import {EditorState} from "./typing";
import CommandInvoker from "../command/command-invoker";
import BoldCommand from "../command/bold-command";
import ItalicCommand from "../command/italic-command";
import ContentEditable, {ContentEditableEvent} from 'react-contenteditable'
import TextEditCommand from "../command/text-edit-command";
import SelectionChangeCommand from "../command/selection-change-command";
import CopyCommand from "../command/copy-command";
import PastCommand from "../command/past-command";

class Editor extends Component<{}, EditorState> {
    private contentEditable: React.RefObject<HTMLElement>;

    constructor(props: {}) {
        super(props);
        this.contentEditable = React.createRef();
        this.state = {
            data: '',
            styles: {}
        }
    }

    public componentDidMount(): void {
        combineLatest([EditorStore.data$, EditorStore.styles$])
            .pipe(
                map(([data, styles]) => ({data, styles}))
            )
            .subscribe((editorState: EditorState) => {
                this.setState(editorState);
            })
    }

    render(): React.ReactNode {
        const {data, styles} = this.state;
        return (
            <div>
                <div>
                    <button onClick={() => {
                        CommandInvoker.invoke(new BoldCommand(EditorStore))
                    }}>Bold
                    </button>
                    <button onClick={() => {
                        CommandInvoker.invoke(new ItalicCommand(EditorStore))
                    }}>Italic
                    </button>
                    <button onClick={() => {
                        CommandInvoker.invoke(new CopyCommand(EditorStore))
                    }}>Copy
                    </button>
                    <button onClick={() => {
                        CommandInvoker.invoke(new PastCommand(EditorStore))
                    }}>Past
                    </button>
                    <button onClick={() => {
                        CommandInvoker.undo()
                    }}>Undo
                    </button>
                    <button onClick={() => {
                        CommandInvoker.redo()
                    }}>Redo
                    </button>
                </div>
                <div
                    style={{border: "1px solid #ccc", padding: 15}}
                    onMouseUp={() => CommandInvoker.invoke(new SelectionChangeCommand(EditorStore))}
                >
                    <ContentEditable
                        innerRef={this.contentEditable}
                        html={data} // innerHTML of the editable div
                        disabled={false}       // use true to disable editing
                        onChange={(event: ContentEditableEvent) => {CommandInvoker.invoke(new TextEditCommand(EditorStore, event.target.value))}} // handle innerHTML change
                        tagName='div'
                        style={{outline: 'none', ...styles}}>
                    </ContentEditable>
                </div>

            </div>
        );
    }
}

export default Editor;
