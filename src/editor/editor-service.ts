import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

class Service {
    public updateEditorState(): Observable<boolean> {
        const updated: boolean = !!Math.round(Math.random());
        console.log(updated);
        return of(updated).pipe(delay(2000));
    }
}

const EditorService = new Service();
export default EditorService;
