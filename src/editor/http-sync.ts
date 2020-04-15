import {Subject} from "rxjs";
import EditorService, {Service} from "./editor-service";

export class HttpSync {
    constructor(private service: Service) {
    }

    public update(info?: any): Subject<boolean> {
        console.log('HttpSync. Send request --->');
        const dataUpdated = new Subject<boolean>();
        this.service.updateEditorState()
            .subscribe(
                (res) => {
                    //compare and update model
                    console.log('HttpSync. <---- Get response');
                    dataUpdated.next(res);
                    dataUpdated.complete();
                },
                (error) => {
                    dataUpdated.error(error);
                    dataUpdated.complete();
                });
        return dataUpdated;
    }

    public undo(info?: any): Subject<boolean> {
        const dataUpdated = new Subject<boolean>();
        this.service.updateEditorState()
            .subscribe(
                (res) => {
                    //compare and update model
                    dataUpdated.next(res);
                    dataUpdated.complete();
                },
                (error) => {
                    dataUpdated.error(error);
                    dataUpdated.complete();
                });
        return dataUpdated;
    }
}

const EditorHttpSync = new HttpSync(EditorService);

export default EditorHttpSync;
